import ReserveButton from "@/components/ReserveButton";
import { SITE } from "@/lib/site-config";

/**
 * Секция контактов: адрес + два варианта связи (позвонить / резерв).
 * Серверный компонент; все данные берёт из site-config.ts.
 */
export default function ContactSection() {
  return (
    <section
      id="kontakt"
      aria-labelledby="contact-title"
      className="scroll-mt-24 bg-cream py-16"
    >
      {/* На мобильном — одна колонка, от lg (1024px) — текст слева, кнопки справа */}
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-gold">
            So finden Sie uns
          </p>
          <h2
            id="contact-title"
            className="mt-3 font-serif text-3xl font-bold text-ink sm:text-4xl"
          >
            {SITE.addressLine1}, {SITE.addressLine2}
          </h2>
          <p className="mt-4 leading-relaxed text-muted">
            Parkmöglichkeiten gibt es an der Straßenseite. Reservierungen sind
            telefonisch oder per Anfrage möglich.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <a
            href={SITE.phoneHref}
            className="flex flex-col gap-1 rounded-2xl border border-ink/10 bg-ivory p-6 text-left transition hover:border-gold hover:shadow-md"
          >
            <span className="text-sm text-muted">Anrufen</span>
            <strong className="text-lg text-ink">{SITE.phoneDisplay}</strong>
            <small className="text-muted">Direkt und am schnellsten</small>
          </a>
          <ReserveButton className="flex flex-col gap-1 rounded-2xl border border-ink/10 bg-ivory p-6 text-left transition hover:border-gold hover:shadow-md">
            <span className="text-sm text-muted">Anfrage</span>
            <strong className="text-lg text-ink">Reservieren</strong>
            <small className="text-muted">
              Datum, Uhrzeit und Personen angeben
            </small>
          </ReserveButton>
        </div>
      </div>
    </section>
  );
}
