import Image from "next/image";
import ReserveButton from "@/components/ReserveButton";

/** Короткие факты под кнопками (часы работы и т.д.) */
const HERO_FACTS: ReadonlyArray<{ label: string; value: string; description?: string }> = [
  { label: "Heute", value: "09:00 - 22:00 Uhr" },
  { label: "Montag", value: "Ruhetag" },
  { label: "Abholung (Außer Montags)", value: "11:30 - 22:00 Uhr" },
  { label: "Frühstückszeiten", value: "10:00 - 14:00 Uhr", description: "Dienstag bis Freitag" },
];

/**
 * Главный экран (hero). Серверный компонент.
 * Весь контент строго отцентрирован (text-center + items-center).
 *
 * Важная деталь «бесшовного» дизайна: внизу секции лежит градиент
 * к сплошному тёмному цвету (to-ink). Следующая секция (завтраки)
 * начинается таким же тёмным градиентом сверху — обе картинки
 * «склеиваются» и выглядят как одно целое фото.
 */
export default function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative flex min-h-[85vh] items-center overflow-hidden bg-ink"
    >
      <Image
        src="/assets/Home.png"
        alt="Eleganter Bistro-Tisch mit Kaffee und Speisen"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      {/* Равномерное затемнение, чтобы центрированный текст читался */}
      <div className="absolute inset-0 bg-ink/50" />
      {/* Шов-соединитель с нижней секцией */}
      <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-b from-transparent to-ink" />

      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center px-4 py-24 text-center text-paper sm:px-6">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-gold">
          Cafe &amp; Bistro in Münnerstadt
        </p>
        <h1
          id="hero-title"
          className="mt-4 font-serif text-5xl font-bold sm:text-7xl"
        >
          GoldenHorn
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-paper/85">
          Hausgemachte Spezialitäten, feiner Kaffeegenuss und ein ruhiger Ort
          für Frühstück, Lunch und entspannte Abende.
        </p>

        {/* Кнопки всегда по центру; на узких экранах переносятся */}
        <div
          className="mt-8 flex flex-wrap justify-center gap-3"
          aria-label="Schnellauswahl"
        >
          <a
            href="#menu"
            className="rounded-full bg-gold px-7 py-3 text-sm font-semibold text-ink transition hover:brightness-110"
          >
            Speisekarte ansehen
          </a>
          <ReserveButton className="rounded-full border border-paper/40 px-7 py-3 text-sm font-semibold text-paper transition hover:border-gold hover:text-gold">
            Reservieren
          </ReserveButton>
        </div>

        {/* Факты — аккуратные центрированные «чипы» */}
        <div
          className="mt-10 flex flex-wrap justify-center gap-2.5 text-sm"
          aria-label="Kurzinfo"
        >
          {HERO_FACTS.map((fact) => (
            <span
              key={fact.label}
              className="rounded-full bg-paper/10 px-4 py-2 text-paper/85 backdrop-blur-sm"
            >
              <b className="text-paper">{fact.label}</b> {fact.value}
              {fact.description && (
                <span className="ml-1 text-paper/70">({fact.description})</span>
              )}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
