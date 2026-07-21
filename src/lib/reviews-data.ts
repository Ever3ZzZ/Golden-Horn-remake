import type { Review } from "@/lib/types";

/**
 * Отзывы для карусели. Раньше это были массивы-кортежи вида
 * ["заголовок", "текст", "имя"] — легко перепутать порядок.
 * Объекты с именованными полями читаются и типизируются лучше.
 */
export const REVIEWS: Review[] = [
  { title: "Sehr gemütlich", text: "Frühstück war liebevoll angerichtet, Service freundlich und Kaffee richtig gut.", author: "Anna Mueller" },
  { title: "Gute Auswahl", text: "Von Salat bis Burger ist für jeden etwas dabei. Die Karte ist angenehm vielseitig.", author: "Thomas Schneider" },
  { title: "Schöner Ort", text: "Ruhige Atmosphäre, helle Räume und unkomplizierte Reservierung.", author: "Katharina Weber" },
  { title: "Leckeres Buffet", text: "Das Frühstücksbuffet war frisch, reichlich und sehr schoen praesentiert.", author: "Martin Fischer" },
  { title: "Freundlicher Service", text: "Man fuehlt sich willkommen. Die Bedienung war aufmerksam und entspannt.", author: "Sabrina Hofmann" },
  { title: "Sehr guter Kaffee", text: "Cappuccino und Kuchen waren ausgezeichnet. Perfekt für eine Pause am Nachmittag.", author: "Jens Bauer" },
  { title: "Burger top", text: "Der Jumbo Burger war saftig, die Beilagen frisch und die Portion genau richtig.", author: "Lena Richter" },
  { title: "Angenehmes Ambiente", text: "Nicht zu laut, schoene Tische und ein gemütlicher Innenbereich.", author: "Markus Klein" },
  { title: "Gerne wieder", text: "Pizza, Pasta und Salat kamen schnell und haben allen am Tisch geschmeckt.", author: "Nadine Wagner" },
  { title: "Familienfreundlich", text: "Unkompliziert, herzlich und mit genug Auswahl für verschiedene Geschmaecker.", author: "Peter Schmitt" },
];
