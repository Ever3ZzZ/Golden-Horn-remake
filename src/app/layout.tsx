import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { ReservationProvider } from "@/components/ReservationContext";
import ReservationModal from "@/components/ReservationModal";

/**
 * next/font скачивает шрифты НА ЭТАПЕ СБОРКИ и раздаёт их с нашего же сервера.
 * variable: "--font-inter" создаёт CSS-переменную, которую мы подключили
 * в globals.css внутри @theme (--font-sans / --font-serif).
 */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

/**
 * Метаданные страницы (<title>, <meta name="description">).
 * В App Router они объявляются как экспорт, а не пишутся вручную в <head>.
 */
export const metadata: Metadata = {
  title: "GoldenHorn Cafe & Bistro | Münnerstadt",
  description:
    "Goldenhorn Cafe & Bistro in Münnerstadt: Frühstück, Burger, Pizza, Pasta, Kaffee und gemütliche Räumlichkeiten.",
};

/**
 * Корневой макет (root layout) — обязательный файл App Router.
 * Он оборачивает ВСЕ страницы сайта: шапка и подвал здесь,
 * потому что они одинаковы на любой странице.
 *
 * ReservationProvider тоже здесь: и кнопки в шапке/подвале,
 * и само модальное окно должны быть ВНУТРИ одного Provider.
 */
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de" className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-paper font-sans text-ink antialiased">
        <ReservationProvider>
          <Header />
          {children}
          <Footer />
          <ReservationModal />
        </ReservationProvider>
      </body>
    </html>
  );
}
