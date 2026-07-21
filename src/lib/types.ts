/**
 * Общие типы данных проекта.
 * Держим их в одном месте, чтобы и данные (lib), и компоненты (components)
 * ссылались на одно и то же описание структуры.
 */

/**
 * Union-тип: категория блюда может быть ТОЛЬКО одной из этих строк.
 * Если где-то опечататься ("Burgers" вместо "Burger"), TypeScript сразу подсветит ошибку.
 */
export type MenuCategory =
  | "Suppen"
  | "Salate"
  | "Frühstück"
  | "Burger"
  | "Pizza"
  | "Pasta"
  | "Kaltgetränke"
  | "Warmgetränke"
  | "Alkohol";

/** Специальная "категория-фильтр": все категории + пункт «Alle» (все). */
export type CategoryFilter = MenuCategory | "Alle";

/** Одна позиция в меню ресторана. */
export interface MenuItem {
  /** Имя файла картинки внутри public/assets/speisekarte */
  image: string;
  category: MenuCategory;
  name: string;
  description: string;
  /** Цена как строка, потому что бывают варианты вида "ab 6,90 €" или "Groß/Klein" */
  price: string;
}

/** Отзыв гостя для карусели. */
export interface Review {
  title: string;
  text: string;
  author: string;
}

/** Фотография для галереи «Räumlichkeiten». */
export interface GalleryPhoto {
  /** Путь к файлу внутри public, начинается с "/" */
  src: string;
  alt: string;
}

/** Вариант завтрак-буфета (Menü 1 / Menü 2). */
export interface BreakfastMenu {
  id: "menu1" | "menu2";
  label: string;
  pricePerPerson: string;
  /** Картинка с составом меню */
  image: string;
  imageAlt: string;
}
