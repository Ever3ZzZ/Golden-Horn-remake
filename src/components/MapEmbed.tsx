import { SITE } from "@/lib/site-config";

/**
 * Встроенная карта Google Maps.
 * Серверный компонент: обычный iframe без состояния.
 */
export default function MapEmbed() {
  return (
    <section aria-label="Karte">
      <iframe
        title="Goldenhorn Cafe & Bistro bei Google Maps"
        src={SITE.mapsEmbedUrl}
        loading="lazy"
        className="h-96 w-full border-0"
      />
    </section>
  );
}
