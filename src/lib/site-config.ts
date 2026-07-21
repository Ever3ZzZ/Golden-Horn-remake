/**
 * Единая точка правды для контактных данных сайта.
 * Раньше телефон был «зашит» в HTML в пяти местах (и в одном месте — с опечаткой).
 * Теперь меняем в одном файле — обновляется везде.
 */
export const SITE = {
  name: "Goldenhorn Cafe & Bistro",
  city: "Münnerstadt",
  addressLine1: "Veit-Stoß-Straße 21",
  addressLine2: "97702 Münnerstadt",
  phoneDisplay: "097 335 240 958",
  /** Для ссылки tel: номер без пробелов */
  phoneHref: "tel:097335240958",
  logo: "/assets/logo.png",
  openingHours: {
    closedDay: "Montag Ruhetag",
    regular: "Dienstag - Sonntag 10:00 - 22:00 Uhr",
    pickup: "Täglich von 11:30 - 22:00 Uhr",
  },
  mapsEmbedUrl:
    "https://www.google.com/maps?q=Goldenhorn%20Cafe%20%26%20Bistro%20Veit-Sto%C3%9F-Stra%C3%9Fe%2021%2097702%20M%C3%BCnnerstadt&output=embed",
} as const;
