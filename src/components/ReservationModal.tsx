"use client";

import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import { useReservation } from "@/components/ReservationContext";
import { SITE } from "@/lib/site-config";

/** Все поля формы бронирования */
interface ReservationFormState {
  name: string;
  phone: string;
  email: string;
  persons: string;
  date: string;
  time: string;
  message: string;
}

/** Ошибки валидации */
type FormErrors = Partial<Record<keyof ReservationFormState, string>>;

/**
 * Шаги окна:
 * - "form"    — заполнение формы
 * - "review"  — проверка данных перед отправкой
 * - "sending" — идёт отправка в Telegram (спиннер)
 * - "done"    — успешно отправлено
 * - "error"   — ошибка отправки
 */
type ModalStep = "form" | "review" | "sending" | "done" | "error";

const EMPTY_FORM: ReservationFormState = {
  name: "",
  phone: "",
  email: "",
  persons: "2",
  date: "",
  time: "",
  message: "",
};

/**
 * Слоты времени с шагом 30 мин: 10:00 … 21:30.
 * Используем собственный выпадающий список — нативный <select>
 * браузер рисует сам и на iOS выглядит крошечным.
 */
const TIME_SLOTS: ReadonlyArray<string> = Array.from(
  { length: 24 },
  (_, i) => {
    const h = 10 + Math.floor(i / 2);
    const m = i % 2 === 0 ? "00" : "30";
    return `${h}:${m}`;
  },
);

/** Форматирует ISO-дату в немецкий вид: Freitag, 24. Juli 2026 */
function formatGermanDate(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00`);
  return date.toLocaleDateString("de-DE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Валидация с немецкими сообщениями (noValidate на форме) */
function validateForm(form: ReservationFormState): FormErrors {
  const errors: FormErrors = {};
  if (!form.name.trim()) errors.name = "Bitte geben Sie Ihren Namen ein.";
  if (!form.phone.trim()) {
    errors.phone = "Bitte geben Sie Ihre Telefonnummer ein.";
  } else if (!/^[+()/\-\s0-9]{6,}$/.test(form.phone.trim())) {
    errors.phone = "Bitte prüfen Sie die Telefonnummer – nur Ziffern, Leerzeichen und + sind erlaubt.";
  }
  if (!form.email.trim()) {
    errors.email = "Bitte geben Sie Ihre E-Mail-Adresse ein.";
  } else if (!form.email.includes("@")) {
    errors.email = 'Die E-Mail-Adresse muss ein "@" enthalten.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) {
    errors.email = "Bitte prüfen Sie die E-Mail-Adresse (z.\u00a0B. name@beispiel.de).";
  }
  const n = Number(form.persons);
  if (!form.persons.trim() || Number.isNaN(n)) {
    errors.persons = "Bitte geben Sie die Personenzahl an.";
  } else if (n < 1 || n > 40) {
    errors.persons = "Bitte wählen Sie zwischen 1 und 40 Personen.";
  }
  if (!form.date) errors.date = "Bitte wählen Sie ein Datum.";
  if (!form.time) errors.time = "Bitte wählen Sie eine Uhrzeit aus der Liste.";
  return errors;
}

/** Klassennamen für все Input-поля: фиксированная высота, 16px на телефоне */
function inputCls(hasError: boolean): string {
  const base = "h-11 w-full appearance-none rounded-xl border bg-white px-4 text-base text-ink placeholder:text-muted transition focus:outline-none focus:ring-2 sm:text-sm";
  return hasError
    ? `${base} border-wine focus:border-wine focus:ring-wine/20`
    : `${base} border-ink/15 focus:border-gold focus:ring-gold/30`;
}

/** Подпись + поле + опц. подсказка / ошибка */
function Field({
  label, error, hint, children,
}: {
  label: string; error?: string; hint?: string; children: ReactNode;
}) {
  return (
    <label className="flex min-w-0 flex-col gap-1.5">
      <span className="truncate text-xs font-semibold uppercase tracking-wide text-soft-ink">{label}</span>
      {children}
      {error ? (
        <span className="anim-rise text-xs font-medium text-wine" role="alert">{error}</span>
      ) : hint ? (
        <span className="text-[11px] text-muted">{hint}</span>
      ) : null}
    </label>
  );
}

export default function ReservationModal() {
  const { isOpen, close } = useReservation();
  const [form, setForm] = useState<ReservationFormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [step, setStep] = useState<ModalStep>("form");
  const [isTimeOpen, setIsTimeOpen] = useState(false);

  // Escape + блокировка скролла
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, close]);

  if (!isOpen) return null;

  const today = new Date().toISOString().slice(0, 10);

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: undefined }));
  }

  function selectTime(slot: string) {
    setForm((p) => ({ ...p, time: slot }));
    setErrors((p) => ({ ...p, time: undefined }));
    setIsTimeOpen(false);
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const errs = validateForm(form);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setStep("review");
  }

  /**
   * ОТПРАВКА В TELEGRAM.
   * Вызывается при клике «Alles korrekt» на шаге "review".
   * Делает POST-запрос на наш API-роут /api/reservation,
   * который в свою очередь звонит Telegram Bot API.
   * Токен бота остаётся в .env.local на сервере и никогда не попадает в браузер.
   */
  async function sendToTelegram() {
    setStep("sending");
    try {
      const res = await fetch("/api/reservation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("API error");
      setStep("done");
    } catch {
      setStep("error");
    }
  }

  function finishAndClose() {
    close();
    setForm(EMPTY_FORM);
    setErrors({});
    setStep("form");
    setIsTimeOpen(false);
  }

  const reviewRows = [
    { label: "Name", value: form.name },
    { label: "Telefon", value: form.phone },
    { label: "E-Mail", value: form.email },
    { label: "Personen", value: form.persons },
    { label: "Datum", value: form.date ? formatGermanDate(form.date) : "" },
    { label: "Uhrzeit", value: form.time ? `${form.time} Uhr` : "" },
    { label: "Nachricht", value: form.message },
  ].filter((r) => r.value.trim());

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog" aria-modal="true" aria-label="Tisch reservieren"
    >
      <button
        type="button" aria-label="Schließen"
        onClick={step === "form" ? close : undefined}
        className="anim-fade absolute inset-0 bg-ink/60 backdrop-blur-sm"
      />

      {/* ШАГ 1: форма */}
      {step === "form" && (
        <section className="anim-rise relative z-10 max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-paper p-6 shadow-2xl sm:p-8">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-gold">Reservierung</p>
              <h2 className="mt-2 font-serif text-2xl font-bold text-ink sm:text-3xl">Tisch reservieren</h2>
            </div>
            <button type="button" onClick={close} aria-label="Fenster schließen"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-ink/15 text-xl text-soft-ink transition hover:bg-cream">
              ×
            </button>
          </div>

          <div className="grid items-start gap-6 md:grid-cols-[minmax(0,15rem)_1fr]">
            {/* Блок звонка */}
            <div className="flex flex-col gap-3">
              <a href={SITE.phoneHref}
                className="flex items-center gap-3.5 rounded-2xl bg-ink p-4 text-paper shadow-lg transition hover:shadow-xl">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold text-ink">
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-5 w-5">
                    <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.61 21 3 13.39 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.24.2 2.45.57 3.57a1 1 0 0 1-.25 1.02l-2.2 2.2Z" />
                  </svg>
                </span>
                <span className="flex min-w-0 flex-col">
                  <span className="text-[11px] font-bold uppercase tracking-wide text-gold">Direkt anrufen</span>
                  <b className="text-base leading-tight">{SITE.phoneDisplay}</b>
                  <span className="text-xs text-paper/70">Sofort bestätigt</span>
                </span>
              </a>
              <p className="rounded-2xl border border-ink/10 bg-cream p-3.5 text-xs leading-relaxed text-soft-ink">
                <b>Öffnungszeiten:</b> {SITE.openingHours.regular}<br />
                {SITE.openingHours.closedDay}
              </p>
            </div>

            {/* Форма */}
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
              <Field label="Name *" error={errors.name}>
                <input type="text" name="name" value={form.name} onChange={handleChange}
                  placeholder="Ihr Name" autoComplete="name" className={inputCls(!!errors.name)} />
              </Field>

              <div className="grid items-start gap-4 sm:grid-cols-2">
                <Field label="Telefon *" error={errors.phone}>
                  <input type="tel" name="phone" value={form.phone} onChange={handleChange}
                    placeholder="+49 …" autoComplete="tel" className={inputCls(!!errors.phone)} />
                </Field>
                <Field label="E-Mail *" error={errors.email}>
                  <input type="email" name="email" value={form.email} onChange={handleChange}
                    placeholder="name@beispiel.de" autoComplete="email" className={inputCls(!!errors.email)} />
                </Field>
              </div>

              <div className="grid items-start gap-4 sm:grid-cols-2">
                <Field label="Personen *" error={errors.persons}>
                  <input type="number" name="persons" value={form.persons} onChange={handleChange}
                    min={1} max={40} className={inputCls(!!errors.persons)} />
                </Field>
                <Field label="Datum *" hint="Format: TT.MM.JJJJ" error={errors.date}>
                  <input type="date" name="date" lang="de" value={form.date} onChange={handleChange}
                    min={today} className={inputCls(!!errors.date)} />
                </Field>
              </div>

              {/* Свой выпадающий список времени — крупные кнопки, не нативный <select> */}
              <Field label="Uhrzeit *" error={errors.time}>
                <div className="relative">
                  <button type="button"
                    onClick={() => setIsTimeOpen((o) => !o)}
                    aria-expanded={isTimeOpen} aria-haspopup="listbox"
                    className={`${inputCls(!!errors.time)} flex items-center justify-between text-left ${
                      !form.time ? "text-muted" : ""
                    }`}>
                    {form.time ? `${form.time} Uhr` : "Uhrzeit wählen …"}
                    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"
                      className={`h-4 w-4 shrink-0 text-muted transition-transform ${isTimeOpen ? "rotate-180" : ""}`}>
                      <path fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z"
                        clipRule="evenodd" />
                    </svg>
                  </button>

                  {isTimeOpen && (
                    <>
                      <button type="button" aria-label="Liste schließen"
                        onClick={() => setIsTimeOpen(false)}
                        className="fixed inset-0 z-10 cursor-default" />
                      <div role="listbox" aria-label="Uhrzeit wählen"
                        className="anim-rise absolute inset-x-0 top-full z-20 mt-2 max-h-56 overflow-y-auto rounded-xl border border-ink/15 bg-white p-2 shadow-xl">
                        <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-4">
                          {TIME_SLOTS.map((slot) => (
                            <button key={slot} type="button" role="option" aria-selected={form.time === slot}
                              onClick={() => selectTime(slot)}
                              className={`rounded-lg px-2 py-2.5 text-sm font-semibold transition ${
                                form.time === slot
                                  ? "bg-gold text-ink"
                                  : "bg-cream/60 text-soft-ink hover:bg-cream"
                              }`}>
                              {slot}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </Field>

              <Field label="Nachricht (optional)">
                <textarea name="message" value={form.message} onChange={handleChange} rows={3}
                  placeholder="Anlass, Kinderstuhl, Terrasse …"
                  className={`${inputCls(false)} h-auto resize-none py-2.5`} />
              </Field>

              <button type="submit"
                className="mt-1 rounded-full bg-gold px-7 py-3 text-sm font-semibold text-ink transition hover:brightness-110">
                Anfrage prüfen &amp; senden
              </button>
            </form>
          </div>
        </section>
      )}

      {/* ШАГ 2: проверка данных */}
      {step === "review" && (
        <section className="anim-rise relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-paper p-6 shadow-2xl sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-gold">Fast geschafft</p>
          <h2 className="mt-2 font-serif text-2xl font-bold text-ink">Bitte prüfen Sie Ihre Anfrage</h2>
          <p className="mt-2 text-sm text-muted">
            Stimmen alle Angaben? Dann senden wir Ihre Anfrage direkt an das Restaurant.
          </p>

          <dl className="mt-5 divide-y divide-ink/10 overflow-hidden rounded-2xl border border-ink/10 bg-ivory text-sm">
            {reviewRows.map((row) => (
              <div key={row.label} className="flex items-baseline justify-between gap-4 px-4 py-2.5">
                <dt className="shrink-0 text-muted">{row.label}</dt>
                <dd className="text-right font-semibold text-ink">{row.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-6 flex flex-col gap-3">
            {/*
             * При нажатии — вызывается sendToTelegram():
             * форма отправляется на /api/reservation →
             * сервер пересылает в Telegram-группу.
             */}
            <button type="button" onClick={sendToTelegram}
              className="rounded-full bg-gold px-7 py-3 text-sm font-semibold text-ink transition hover:brightness-110">
              Alles korrekt – Anfrage absenden
            </button>
            <button type="button" onClick={() => setStep("form")}
              className="rounded-full border border-ink/15 px-7 py-3 text-sm font-semibold text-soft-ink transition hover:border-gold hover:text-ink">
              Zurück zur Anfrage
            </button>
          </div>
        </section>
      )}

      {/* ШАГ 3: отправка — спиннер */}
      {step === "sending" && (
        <section className="anim-rise relative z-10 w-full max-w-xs rounded-3xl bg-paper p-8 text-center shadow-2xl">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-cream border-t-gold" />
          <p className="mt-5 text-sm text-soft-ink">Anfrage wird gesendet…</p>
        </section>
      )}

      {/* ШАГ 4: успех */}
      {step === "done" && (
        <section className="anim-rise relative z-10 w-full max-w-md rounded-3xl bg-paper p-8 text-center shadow-2xl">
          <span aria-hidden="true"
            className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-olive text-2xl text-paper">
            ✓
          </span>
          <h2 className="mt-4 font-serif text-2xl font-bold text-ink">Vielen Dank, {form.name}!</h2>
          <p className="mt-3 text-sm leading-relaxed text-soft-ink">
            Ihre Anfrage wurde erfolgreich übermittelt. Das Team meldet sich in Kürze bei Ihnen.
          </p>
          <p className="mt-2 text-xs text-muted">
            Rückfragen?{" "}
            <a href={SITE.phoneHref} className="font-semibold text-wine">{SITE.phoneDisplay}</a>
          </p>
          <button type="button" onClick={finishAndClose}
            className="mt-6 w-full rounded-full bg-ink px-7 py-3 text-sm font-semibold text-paper transition hover:bg-soft-ink">
            Schließen
          </button>
        </section>
      )}

      {/* ШАГ 5: ошибка отправки */}
      {step === "error" && (
        <section className="anim-rise relative z-10 w-full max-w-md rounded-3xl bg-paper p-8 text-center shadow-2xl">
          <span aria-hidden="true"
            className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-wine text-2xl text-paper">
            !
          </span>
          <h2 className="mt-4 font-serif text-xl font-bold text-ink">Fehler beim Senden</h2>
          <p className="mt-3 text-sm leading-relaxed text-soft-ink">
            Die Anfrage konnte leider nicht übermittelt werden. Bitte rufen Sie uns direkt an:
          </p>
          <a href={SITE.phoneHref}
            className="mt-4 inline-block rounded-full bg-gold px-6 py-3 text-sm font-semibold text-ink transition hover:brightness-110">
            {SITE.phoneDisplay}
          </a>
          <div className="mt-4 flex flex-col gap-2">
            <button type="button" onClick={() => setStep("review")}
              className="rounded-full border border-ink/15 px-6 py-2.5 text-sm font-semibold text-soft-ink transition hover:border-gold">
              Nochmal versuchen
            </button>
            <button type="button" onClick={finishAndClose}
              className="text-xs text-muted underline">
              Schließen
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
