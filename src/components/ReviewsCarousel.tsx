"use client";

import { useEffect, useState } from "react";
import SectionHeading from "@/components/SectionHeading";
import { REVIEWS } from "@/lib/reviews-data";

/** Каждые 4,2 секунды переключаемся на следующий отзыв (как в старом script.js) */
const AUTOPLAY_INTERVAL_MS = 4200;

/**
 * Карусель отзывов. Клиентский компонент: таймер и состояние.
 *
 * Как работает анимация: все карточки лежат в одну линию внутри «трека»,
 * а трек сдвигается влево на index * 100% ширины. Родитель с overflow-hidden
 * показывает только одну карточку за раз.
 */
export default function ReviewsCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      // Функциональное обновление: берём предыдущее значение и считаем следующее.
      // Остаток от деления (%) возвращает нас к 0 после последнего отзыва.
      setActiveIndex((previous) => (previous + 1) % REVIEWS.length);
    }, AUTOPLAY_INTERVAL_MS);

    // Очистка: без clearInterval таймер продолжит работать даже после
    // удаления компонента — это утечка памяти.
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      id="reviews"
      aria-labelledby="reviews-title"
      className="mx-auto max-w-6xl scroll-mt-24 px-4 py-16 sm:px-6"
    >
      <SectionHeading
        eyebrow="Google Bewertungen"
        title="Gäste sagen es am besten."
        titleId="reviews-title"
      />

      <div className="mx-auto max-w-xl overflow-hidden rounded-3xl border border-ink/10 bg-ivory shadow-md">
        {/* Стиль с вычисляемым значением задаём через style, а не через классы:
            Tailwind не умеет генерировать классы «на лету» во время работы сайта */}
        <div
          className="flex transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {REVIEWS.map((review) => (
            <article
              key={review.author}
              className="flex w-full shrink-0 flex-col gap-3 p-8 text-center"
            >
              <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-cream font-serif text-xl font-bold text-gold">
                G
              </span>
              <strong className="text-lg text-ink">{review.title}</strong>
              <p className="leading-relaxed text-muted">{review.text}</p>
              <small className="tracking-[0.3em] text-gold">★★★★★</small>
              <span className="text-sm font-semibold text-soft-ink">
                {review.author}
              </span>
            </article>
          ))}
        </div>

        {/* Точки-индикаторы: по ним можно переключаться вручную */}
        <div className="flex justify-center gap-2 pb-6">
          {REVIEWS.map((review, index) => (
            <button
              key={review.author}
              type="button"
              aria-label={`Bewertung ${index + 1} anzeigen`}
              onClick={() => setActiveIndex(index)}
              className={`h-2 w-2 rounded-full transition ${
                index === activeIndex ? "w-5 bg-gold" : "bg-ink/20 hover:bg-ink/40"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
