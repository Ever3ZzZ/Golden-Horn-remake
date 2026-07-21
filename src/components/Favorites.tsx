import Image from "next/image";
import SectionHeading from "@/components/SectionHeading";
import { menuImageSrc } from "@/lib/menu-data";

/** Локальный тип: нужен только этому компоненту, поэтому живёт рядом с ним. */
interface FavoriteItem {
  image: string;
  name: string;
  description: string;
  price: string;
}

const FAVORITES: FavoriteItem[] = [
  {
    image: "Golden-Horn-Salat.png",
    name: "Golden Horn Salat",
    description: "Tabouleh, Hummus, Blattsalat, Granatapfel",
    price: "11,90 €",
  },
  {
    image: "Goldenhorn-Jumbo-Burger.png",
    name: "Goldenhorn Jumbo Burger",
    description: "360 g Patty, Zwiebeln, doppelter Cheddar",
    price: "16,50 €",
  },
  {
    image: "Linguine-al-Lachs-mit-Spinat.jpg",
    name: "Linguine al Lachs",
    description: "Linguine, Lachs, Spinat, Pesto, Parmesan",
    price: "14,90 €",
  },
];

/**
 * «Любимцы из меню» — три карточки. Серверный компонент:
 * данные статичны, интерактива нет.
 */
export default function Favorites() {
  return (
    <section
      aria-labelledby="favorites-title"
      className="mx-auto max-w-6xl px-4 py-16 sm:px-6"
    >
      <SectionHeading
        eyebrow="Top Auswahl"
        title="Lieblinge aus der Karte"
        titleId="favorites-title"
      />

      {/* Мобильный: 1 колонка; от 640px (sm): 3 колонки */}
      <div className="grid gap-6 sm:grid-cols-3">
        {FAVORITES.map((favorite) => (
          <article
            key={favorite.name}
            className="overflow-hidden rounded-2xl border border-ink/10 bg-ivory shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="relative aspect-square w-full bg-cream">
              <Image
                src={menuImageSrc(favorite.image)}
                alt={favorite.name}
                fill
                sizes="(min-width: 640px) 33vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="flex items-start justify-between gap-3 p-5">
              <div>
                <strong className="text-ink">{favorite.name}</strong>
                <span className="mt-1 block text-sm text-muted">
                  {favorite.description}
                </span>
              </div>
              <b className="shrink-0 text-wine">{favorite.price}</b>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
