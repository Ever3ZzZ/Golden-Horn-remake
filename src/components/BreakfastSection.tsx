"use client";

import Image from "next/image";
import { useState } from "react";
import type { BreakfastMenu } from "@/lib/types";

/** Данные двух буфет-меню. Тип BreakfastMenu описан в src/lib/types.ts */
const BREAKFAST_MENUS: BreakfastMenu[] = [
  {
    id: "menu1",
    label: "Menü 1",
    pricePerPerson: "15,00 € p. Person",
    image: "/assets/breakfast-menu-1.png",
    imageAlt: "Menü 1 Frühstücksbuffet für 15,00 € pro Person",
  },
  {
    id: "menu2",
    label: "Menü 2",
    pricePerPerson: "22,50 € p. Person",
    image: "/assets/breakfast-menu-2.png",
    imageAlt: "Menü 2 Frühstücksbuffet für 22,50 € pro Person",
  },
];

/**
 * Секция завтрак-буфета с переключателем Меню 1 / Меню 2.
 *
 * Дизайн «одной картинки» с hero:
 * - фоновое фото ОТЗЕРКАЛЕНО И ПЕРЕВЁРНУТО (-scale-x-100 -scale-y-100),
 *   чтобы его светлый край смотрел вниз, а тёмный — вверх к шву;
 * - сверху градиент от сплошного тёмного (from-ink), который стыкуется
 *   с таким же градиентом внизу hero — секции сливаются в одно целое.
 * Весь текст отцентрирован, как в hero.
 */
export default function BreakfastSection() {
  const [activeMenuId, setActiveMenuId] = useState<BreakfastMenu["id"]>("menu1");

  const activeMenu =
    BREAKFAST_MENUS.find((menu) => menu.id === activeMenuId) ??
    BREAKFAST_MENUS[0];

  return (
    <section id="breakfast" aria-labelledby="breakfast-title">
      {/* Верхняя часть: перевёрнутое фото буфета, продолжающее hero */}
      <div className="relative overflow-hidden bg-ink">
        <Image
          src="/assets/breakfast-buffet.png"
          alt="Frühstücksbuffet mit Croissants, Obst, Dips und Heißgetränken"
          fill
          sizes="100vw"
          className="-scale-x-100 -scale-y-100 object-cover"
        />
        <div className="absolute inset-0 bg-ink/50" />
        {/* Шов-соединитель с hero выше */}
        <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-ink to-transparent" />
        {/* Мягкий переход к светлой части страницы внизу */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-ink/70" />

        <div className="relative z-10 mx-auto flex min-h-[70vh] w-full max-w-3xl flex-col items-center justify-center px-4 py-24 text-center sm:px-6">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-gold">
            Freitag bis Sonntag
          </p>
          <h2
            id="breakfast-title"
            className="mt-3 font-serif text-3xl font-bold text-paper sm:text-5xl"
          >
            Frühstücksbuffet ab 6 Personen
          </h2>
          <p className="mt-4 max-w-xl text-paper/85">
            Wählen Sie ein Buffet-Menü. Details öffnen sich direkt darunter,
            ruhig und übersichtlich.
          </p>

          {/* На телефоне кнопки друг под другом, с 640px — в ряд по центру */}
          <div className="mt-8 flex w-full max-w-md flex-col justify-center gap-3 sm:max-w-none sm:flex-row">
            {BREAKFAST_MENUS.map((menu) => {
              const isActive = menu.id === activeMenuId;
              return (
                <button
                  key={menu.id}
                  type="button"
                  onClick={() => setActiveMenuId(menu.id)}
                  className={`w-full rounded-2xl border px-6 py-3.5 text-sm font-semibold transition sm:w-auto sm:min-w-56 ${
                    isActive
                      ? "border-gold bg-gold/25 text-paper shadow-lg"
                      : "border-paper/30 bg-ink/30 text-paper/90 hover:border-gold/70"
                  }`}
                >
                  <span className="block">{menu.label}</span>
                  <b className="block text-base">{menu.pricePerPerson}</b>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Нижняя часть: картинка выбранного меню */}
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <Image
          key={activeMenu.id}
          src={activeMenu.image}
          alt={activeMenu.imageAlt}
          width={1402}
          height={1122}
          sizes="(min-width: 896px) 56rem, 100vw"
          className="anim-rise h-auto w-full rounded-3xl shadow-xl"
        />
      </div>
    </section>
  );
}
