import Image from "next/image";
import MobileMenu from "@/components/MobileMenu";
import ReserveButton from "@/components/ReserveButton";
import { NAV_LINKS } from "@/lib/nav-links";
import { SITE } from "@/lib/site-config";

/**
 * Шапка сайта. Серверный компонент.
 * Адаптивная логика:
 * - телефон (< 768px): логотип + бургер-меню (кнопка Reservieren скрыта,
 *   она есть внутри бургер-меню);
 * - планшет/ПК (md+): навигация + Reservieren, бургер скрыт;
 * - широкий ПК (lg+): дополнительно появляется телефон.
 */
export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/90 backdrop-blur-lg">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <a href="#top" aria-label="Goldenhorn Startseite" className="shrink-0">
          <Image
            src={SITE.logo}
            alt={SITE.name}
            width={500}
            height={164}
            priority
            className="h-10 w-auto sm:h-12"
          />
        </a>

        {/* Навигация только с 768px */}
        <nav
          aria-label="Hauptnavigation"
          className="hidden items-center gap-6 text-sm font-semibold text-soft-ink md:flex"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="border-b-2 border-transparent py-1 transition hover:border-gold hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={SITE.phoneHref}
            className="hidden rounded-full border border-ink/15 px-4 py-2 text-sm font-semibold text-ink transition hover:border-gold hover:text-wine lg:inline-block"
          >
            {SITE.phoneDisplay}
          </a>
          {/* На телефоне эта кнопка скрыта — вместо неё бургер-меню */}
          <ReserveButton className="hidden rounded-full bg-gold px-4 py-2 text-sm font-semibold text-ink transition hover:brightness-110 md:inline-block">
            Reservieren
          </ReserveButton>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
