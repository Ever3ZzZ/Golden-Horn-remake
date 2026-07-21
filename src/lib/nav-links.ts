/**
 * Пункты навигации в одном месте: используются и в шапке (ПК),
 * и в мобильном бургер-меню. Меняем здесь — обновляется везде.
 */
export const NAV_LINKS: ReadonlyArray<{ href: string; label: string }> = [
  { href: "#menu", label: "Speisekarte" },
  { href: "#breakfast", label: "Frühstück" },
  { href: "#gallery", label: "Räume" },
  { href: "#reviews", label: "Bewertungen" },
  { href: "#kontakt", label: "Kontakt" },
];
