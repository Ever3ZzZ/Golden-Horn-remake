import Image from "next/image";
import SectionHeading from "@/components/SectionHeading";
import type { GalleryPhoto } from "@/lib/types";

/** Фотографии интерьера из public/assets/gallery */
const PHOTOS: GalleryPhoto[] = [
  { src: "/assets/gallery/kuchenvitrine.jpeg", alt: "Kuchenvitrine im Goldenhorn" },
  { src: "/assets/gallery/dekoration.jpeg", alt: "Dekoration im Cafe" },
  { src: "/assets/gallery/innenraum.jpeg", alt: "Innenraum mit Tischen" },
  { src: "/assets/gallery/theke.jpeg", alt: "Thekenbereich" },
  { src: "/assets/gallery/sitzbereich.jpeg", alt: "Sitzbereich im Goldenhorn" },
];

/**
 * Галерея «Räumlichkeiten».
 * Адаптивное поведение:
 * - телефон/планшет: горизонтальная лента с прокруткой (overflow-x-auto + snap);
 * - ПК (lg+): лента превращается в ЦЕНТРИРОВАННУЮ сетку (flex-wrap +
 *   justify-center + mx-auto), чтобы фото не «уезжали» влево.
 * Серверный компонент — всё работает на чистом CSS, JavaScript не нужен.
 */
export default function Gallery() {
  return (
    <section
      id="gallery"
      aria-labelledby="gallery-title"
      className="scroll-mt-24 bg-cream py-16"
    >
      <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
        <SectionHeading
          eyebrow="Unsere Räumlichkeiten"
          title="Licht, Ruhe und warme Details."
          description="Ob Kaffee, gemütliches Frühstück oder gesellige Abende: der Innenbereich bleibt freundlich und entspannt."
          titleId="gallery-title"
        />
      </div>

      {/*
       * До lg: flex-лента с горизонтальным скроллом, snap-center «примагничивает» карточки.
       * С lg: flex-wrap + justify-center — фото аккуратно выстраиваются по центру экрана.
       */}
      <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:px-6 lg:mx-auto lg:max-w-6xl lg:snap-none lg:flex-wrap lg:justify-center lg:overflow-visible">
        {PHOTOS.map((photo) => (
          <div
            key={photo.src}
            className="relative h-80 w-72 shrink-0 snap-center overflow-hidden rounded-2xl shadow-md"
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="18rem"
              className="object-cover transition duration-500 hover:scale-105"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
