import BreakfastSection from "@/components/BreakfastSection";
import ContactSection from "@/components/ContactSection";
import Favorites from "@/components/Favorites";
import Gallery from "@/components/Gallery";
import Hero from "@/components/Hero";
import MapEmbed from "@/components/MapEmbed";
import MenuSection from "@/components/MenuSection";
import ReviewsCarousel from "@/components/ReviewsCarousel";
import Reveal from "@/components/Reveal";

/**
 * Главная страница (маршрут "/").
 * Это серверный компонент-«дирижёр»: сам ничего не делает,
 * только расставляет секции в нужном порядке.
 *
 * <Reveal> — обёртка для эффекта «плавное появление при скролле».
 * Hero не оборачиваем: он виден сразу при загрузке.
 */
export default function HomePage() {
  return (
    <main id="top">
      <Hero />

      <Reveal>
        <BreakfastSection />
      </Reveal>

      <Reveal>
        <Favorites />
      </Reveal>

      <Reveal>
        <MenuSection />
      </Reveal>

      <Reveal>
        <Gallery />
      </Reveal>

      <Reveal>
        <ReviewsCarousel />
      </Reveal>

      <Reveal>
        <ContactSection />
      </Reveal>

      <MapEmbed />
    </main>
  );
}
