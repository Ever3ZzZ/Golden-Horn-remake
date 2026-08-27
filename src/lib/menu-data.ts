import type { CategoryFilter, MenuItem } from "@/lib/types";

/** Папка с фото блюд внутри public. Всё из public доступно по URL от корня сайта. */
const MENU_IMAGE_DIR = "/assets/speisekarte";

/**
 * Собирает полный URL картинки блюда.
 * encodeURI нужен, потому что в именах файлов есть пробелы и умлауты
 * (например "Golden Horn-Frühstück.png").
 */
export function menuImageSrc(fileName: string): string {
  return encodeURI(`${MENU_IMAGE_DIR}/${fileName}`);
}

/**
 * Данные меню. Тип MenuItem[] гарантирует, что у каждой позиции
 * есть все нужные поля и категория написана без опечаток.
 */
export const MENU_ITEMS: MenuItem[] = [
  { image: "Rote-Linsensuppe.jpg", category: "Suppen", name: "Rote Linsensuppe", description: "Wärmende Linsensuppe nach Hausart.", price: "6,50 €" },
  { image: "Klassischer-Caesar-Salat.jpg", category: "Salate", name: "Klassischer Caesar-Salat", description: "Romana-Salatherzen, Parmesan, Croutons, Caesar-Dressing.", price: "9,90 €" },
  { image: "Golden-Horn-Salat.png", category: "Salate", name: "Golden Horn Salat", description: "Tabouleh-Salat, Hummus, Blattsalat, Granatapfel und Granatapfelsoße.", price: "12,40 €" },
  { image: "Gemischter-Salat.jpg", category: "Salate", name: "Gemischter Salat", description: "Grüner Salat, Tomaten, Gurken, rote Zwiebel, Mais, Radieschen, Balsamico-Dressing.", price: "9,50 €" },
  { image: "Fitness-Fruehstueck.jpg", category: "Frühstück", name: "Fitness-Frühstück", description: "Pute, Frischkäse, Avocado-Dip, Obstsalat, Butter, Marmelade, Tomate, Gurke.", price: "12,00 €" },
  { image: "Vegan-Frühstück.png", category: "Frühstück", name: "Vegan-Frühstück", description: "Halbe Avocado, Hummus, Taboule Salat, veganer Frischkäse, vegane Butter, Marmelade, Tomate und Gurke.", price: "14,00 €" },
  { image: "Lachs-Frühstück.png", category: "Frühstück", name: "Lachs-Frühstück", description: "Räucherlachs, Mozzarella, geröstete Paprika, Oliven, Mandeln, Meerrettich, Tomate und Gurke.", price: "16,40 €" },
  { image: "Franzoesisches-Fruehstueck.jpg", category: "Frühstück", name: "Französisches Frühstück", description: "Nutella, Marmelade, Butter und zwei Croissants.", price: "9,90 €" },
  { image: "Golden-Horn-Frühstück.png", category: "Frühstück", name: "Golden Horn-Frühstück", description: "Sucuk, dreier Käse, gekochtes Ei, Oliven, Honig, Hummus, Tomate, Gurke und Paprika.", price: "14,50 €" },
  { image: "Spiegelei-oder-Ruehrei.jpg", category: "Frühstück", name: "Einfaches Omelett", description: "Einfaches Omelett", price: "ab 8,40 €" },
  { image: "Spiegelei-oder-Ruehrei.jpg", category: "Frühstück", name: "Käse-Omelett", description: "Käse-Omelett", price: "ab 9,40 €" },
  { image: "Spiegelei-oder-Ruehrei.jpg", category: "Frühstück", name: "Paprika-Zwiebel-Omelett", description: "Paprika-Zwiebel-Omelett", price: "ab 9,40 €" },
  { image: "Spiegelei-oder-Ruehrei.jpg", category: "Frühstück", name: "Pilz-Omelett", description: "Pilz-Omelett", price: "ab 9,40 €" },
  { image: "Spiegelei-oder-Ruehrei.jpg", category: "Frühstück", name: "Omelett mit Salami", description: "Omelett mit Salami", price: "ab 9,50 €" },
  { image: "Spiegelei-oder-Ruehrei.jpg", category: "Frühstück", name: "Lachs-Omelett", description: "Lachs-Omelett", price: "ab 12,00 €" },
  { image: "Spiegelei-oder-Ruehrei.jpg", category: "Frühstück", name: "Gemischtes Omelett", description: "Gemischtes Omelett", price: "12,00 €" },
  { image: "Muesli.jpg", category: "Frühstück", name: "Müsli", description: "Knuspriges Müsli, Bio-Joghurt und saisonales Obst.", price: "8,90 €" },
  { image: "Avocado-Brot.jpg", category: "Frühstück", name: "Avocado Brot", description: "Pochiertes Ei, Avocadodip, grüner Salat, Vollkornbrot, Tomaten, Gurken, Paprika und Gewürze.", price: "9,50 €" },
  //{ image: "Franzoesische-Quiche.jpg", category: "Frühstück", name: "Französische Quiche", description: "Quiche mit Salat.", price: "9,90 €" },
  // image: "Pfannkuchen-salzig-4-Stueck.jpg", category: "Frühstück", name: "Pfannkuchen salzig (4 Stück)", description: "Nach Wahl mit Fetakäse, Gemüse, Obst oder Räucherlachs. Extra Räucherlachs 2,50 €.", price: "8,90 €" },
  //{ image: "Waffel.png", category: "Frühstück", name: "Waffel", description: "Mit Schokolade, Honig, Obst und Eis.", price: "9,20 €" },
  { image: "Classic-Burger.jpg", category: "Burger", name: "Classic Burger", description: "180 g Rindfleischpatty, Tomate, Romanasalat, Gurken, XXL Brötchen, Ketchup oder Mayonnaise. Menü 14,50 €.", price: "12,00 €" },
  { image: "Cheeseburger.jpg", category: "Burger", name: "Cheeseburger", description: "180 g Rindfleischpatty, Tomate, Romanasalat, Gurken, Cheddar, XXL Brötchen. Menü 17,00 €.", price: "13,00 €" },
  { image: "Egg-Burger.jpg", category: "Burger", name: "Egg-Burger", description: "180 g Rindfleischpatty, Spiegelei, Romanasalat, Gurken, Röstzwiebeln, XXL Brötchen. Menü 17,00 €.", price: "13,00 €" },
  { image: "B16-Burger.png", category: "Burger", name: "BIG Burger", description: "360 g Rindfleischpatty, gebratene Zwiebeln, Krautsalat, Gurken, XXL Brötchen. Menü 22,00 €.", price: "17,50 €" },
  { image: "Goldenhorn-Jumbo-Burger.png", category: "Burger", name: "Goldenhorn-Jumbo-Burger", description: "360 g Rindfleischpatty, Tomate, Romanasalat, gebratene Zwiebeln, doppelter Cheddar. Menü 21,50 €.", price: "18,50 €" },
  { image: "Veggie-Burger.jpg", category: "Burger", name: "Veggie Burger", description: "180 g Gemüse-Bratling, Avocado-Dip mit Tomaten, veganer Käse, XXL Brötchen. Menü 17,00 €.", price: "13,00 €" },
  { image: "Burger-Beilagen.jpg", category: "Burger", name: "Burger Beilagen", description: "POMMES 4,00 €, extra Ketchup oder Mayonnaise 0,90 €.", price: "ab 0,90 €" },
  { image: "margherita.jpg", category: "Pizza", name: "Margherita", description: "Tomatensauce, Mozzarella, Tomate, Basilikum. Kinderpizza 18 cm und normal 30 cm.", price: "Groß 11,00 € / Klein 6,50 €" },
  { image: "Ultramet.png", category: "Pizza", name: "Ultramet", description: "Tomatensauce, Mozzarella, drei Wurstsorten, Pilze, Paprika, Oliven.", price: "Groß 13,00 € / Klein 8,50 €" },
  { image: "Obsession.jpg", category: "Pizza", name: "Obsession", description: "Tomatensauce, Mozzarella, Thunfisch, rote Zwiebeln, Mais, Brokkoli.", price: "Groß 14,50 € / Klein 8,50 €" },
  { image: "Geisha.png", category: "Pizza", name: "Geisha", description: "Tomatensauce, Mozzarella, Hühnerbrust, Putenbrust, grüner Paprika, Aubergine.", price: "Groß 13,00 € / Klein 7,90 €" },
  { image: "Rainbow.png", category: "Pizza", name: "Rainbow", description: "Tomatensauce, Mozzarella, Aubergine, Spinat, Pilze, Mais, rote Paprika, Zwiebeln.", price: "Groß 12,00 € / Klein 7,00 €" },
  { image: "Spaghetti-Bolognese.jpg", category: "Pasta", name: "Spaghetti Bolognese", description: "Spaghetti, Hackfleischsoße, Parmesan.", price: "12,00 €" },
  { image: "Spaghetti-Napolitana.jpg", category: "Pasta", name: "Spaghetti Napolitana", description: "Spaghetti, Napolitansauce, Parmesan.", price: "9,50 €" },
  { image: "Pasta-alla-Avocado.jpg", category: "Pasta", name: "Pasta alla Avocado", description: "Penne Rigate, Avocado, Napolitansauce, Parmesan.", price: "12,00 €" },
  { image: "Pasta-Alfredo.jpg", category: "Pasta", name: "Pasta Alfredo", description: "Penne Rigate, Hühnerbrust, Zucchini, cremige Currysoße, Parmesan und Pilze.", price: "12,00 €" },
  { image: "Linguine-al-Lachs-mit-Spinat.jpg", category: "Pasta", name: "Linguine al Lachs mit Spinat", description: "Linguine, Lachs, Spinat, Pesto, Parmesan.", price: "16,00 €" },
  { image: "Pasta-all-Arrabbiata.jpg", category: "Pasta", name: "Pasta all'Arrabbiata", description: "Penne Rigate, Brokkoli, Aubergine, Karotte, Paprika, Pilze, Arrabbiata-Sauce. Vegan/vegetarisch.", price: "12,50 €" },
  { image: "Erfrischungsgetraenke-033l.jpg", category: "Kaltgetränke", name: "Erfrischungsgetränke 0,33 l", description: "Coca Cola, Coca Cola Zero, Fanta, Orange Mezzo Mix, Sprite, Bitter Lemon, Wild Berry.", price: "3,90 €" },
  { image: "Mineralwasser-05l.jpg", category: "Kaltgetränke", name: "Mineralwasser 0,5 l", description: "Naturell, Medium oder Spritzig.", price: "3,90 €" },
  { image: "Eistee-05l.jpg", category: "Kaltgetränke", name: "Eistee 0,5 l", description: "Pfirsich oder Zitrone.", price: "4,50 €" },
  { image: "Saft-und-Schorle-033l.jpg", category: "Kaltgetränke", name: "Saft & Schorle 0,33 l", description: "Johannisbeere, Maracuja, Orange, Apfelsaft.", price: "4,50 €" },
  { image: "Kaffee-Genuss.jpg", category: "Warmgetränke", name: "Kaffee Genuss", description: "Tasse Kaffee 3,20 €, Pott 4,10 €, Americano 4,20 €, Milchkaffee 4,40 €, Cappuccino 3,80 €, groß 4,70 €, Espresso 3,40 €, doppelt 4,40 €, Latte Macchiato 4,30 €.", price: "ab 3,20 €" },
  { image: "Milchsorten-und-Aromen.jpg", category: "Warmgetränke", name: "Milchsorten & Aromen", description: "Laktosefreie Milch, Hafermilch, Mandelmilch, Kokosmilch 0,95 €. Vanille, Karamell, Kokos, Haselnuss 1,20 €.", price: "ab 0,95 €" },
  { image: "Teesorten.jpg", category: "Warmgetränke", name: "Teesorten", description: "Grüner Tee, Kamille, frische Minze, Ingwer. Tasse 2,30 €, Kännchen 4,50 €.", price: "ab 2,30 €" },
  { image: "Bier.jpg", category: "Alkohol", name: "Bier", description: "0,5 l, Biersorten auf Anfrage.", price: "3,90 €" },
  { image: "Radler.jpg", category: "Alkohol", name: "Radler", description: "0,5 l, Biersorten auf Anfrage.", price: "3,90 €" },
  { image: "Rotwein-Weisswein.jpg", category: "Alkohol", name: "Rotwein / Weisswein", description: "0,2 l, Weinsorte auf Anfrage.", price: "5,50 €" },
  { image: "Weinschorle.jpg", category: "Alkohol", name: "Weinschorle", description: "0,3 l, Weinsorte auf Anfrage.", price: "4,50 €" },
];

/**
 * Список кнопок-фильтров: «Alle» + уникальные категории из данных.
 * new Set(...) убирает дубликаты, Array.from превращает Set обратно в массив.
 */
export const CATEGORY_FILTERS: CategoryFilter[] = [
  "Alle",
  ...Array.from(new Set(MENU_ITEMS.map((item) => item.category))),
];
