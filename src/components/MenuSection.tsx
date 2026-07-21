"use client";

import { useEffect, useMemo, useState } from "react";
import MenuCard from "@/components/MenuCard";
import SectionHeading from "@/components/SectionHeading";
import { CATEGORY_FILTERS, MENU_ITEMS } from "@/lib/menu-data";
import type { CategoryFilter } from "@/lib/types";

/**
 * Секция «Спейскарта»: поиск + фильтр по категориям + сетка карточек.
 * Это главный интерактивный компонент страницы, поэтому 'use client'.
 *
 * Два кусочка состояния:
 * - query — текст из поля поиска (тип string выводится из "")
 * - activeCategory — выбранная категория (тип указан явно через <CategoryFilter>,
 *   иначе TypeScript решил бы, что там может быть только строка "Alle")
 */
export default function MenuSection() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("Alle");

  /**
   * UX-трюк для телефонов: карточки крупные, и в разделе «Alle»
   * пришлось бы очень долго листать. Поэтому на экранах уже 768px
   * стартовая категория — нейтральная «Suppen», а дальше пользователь
   * сам выбирает раздел. useEffect с [] выполняется один раз после
   * первого рендера в браузере (на сервере window не существует).
   */
  useEffect(() => {
    if (window.matchMedia("(max-width: 767px)").matches) {
      setActiveCategory("Suppen");
    }
  }, []);

  /**
   * useMemo кеширует результат фильтрации: список пересчитывается,
   * только когда меняется query или activeCategory (см. массив зависимостей).
   */
  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return MENU_ITEMS.filter((item) => {
      const matchesCategory =
        activeCategory === "Alle" || item.category === activeCategory;
      const haystack =
        `${item.name} ${item.description} ${item.price} ${item.category}`.toLowerCase();
      return matchesCategory && haystack.includes(normalizedQuery);
    });
  }, [query, activeCategory]);

  return (
    <section
      id="menu"
      aria-labelledby="menu-title"
      className="mx-auto max-w-6xl scroll-mt-24 px-4 py-16 sm:px-6"
    >
      <SectionHeading
        eyebrow="Speisekarte"
        title="Klar sortiert, schnell gefunden."
        description="Wählen Sie eine Kategorie oder suchen Sie direkt nach Gericht, Zutat oder Preis."
        titleId="menu-title"
      />

      {/* Панель управления: поиск + табы категорий */}
      <div className="mb-8 flex flex-col gap-4">
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Gericht suchen..."
          aria-label="Gericht suchen"
          className="mx-auto w-full max-w-md rounded-full border border-ink/15 bg-ivory px-5 py-3 text-sm text-ink placeholder:text-muted focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
        />

        <div
          className="flex flex-wrap justify-center gap-2"
          aria-label="Speisekarte Kategorien"
        >
          {CATEGORY_FILTERS.map((category) => {
            const isActive = category === activeCategory;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  isActive
                    ? "bg-ink text-paper"
                    : "border border-ink/15 bg-ivory text-soft-ink hover:border-gold hover:text-ink"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      {/* Адаптивная сетка: 1 → 2 → 3 колонки */}
      {filteredItems.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => (
            <MenuCard key={item.name} item={item} />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted">
          Keine passenden Gerichte gefunden.
        </p>
      )}
    </section>
  );
}
