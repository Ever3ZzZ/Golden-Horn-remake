import Image from "next/image";
import ReserveButton from "@/components/ReserveButton";
import { SITE } from "@/lib/site-config";

/**
 * Подвал сайта: адрес, часы работы, контакты.
 * Серверный компонент. Все данные — из site-config.ts,
 * поэтому смена телефона/часов правится в одном месте.
 */
export default function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-ink text-paper/80">
      {/* 1 колонка → 2 (sm) → 4 (lg) */}
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        <div>
          <Image
            src={SITE.logo}
            alt={SITE.name}
            width={500}
            height={164}
            className="h-10 w-auto brightness-0 invert"
          />
          <p className="mt-4 text-sm leading-relaxed">
            {SITE.name}
            <br />
            {SITE.addressLine1}
            <br />
            {SITE.addressLine2}
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-paper">Öffnungszeiten</h3>
          <p className="mt-3 text-sm leading-relaxed">
            {SITE.openingHours.closedDay}
            <br />
            {SITE.openingHours.regular}
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-paper">Abholservice</h3>
          <p className="mt-3 text-sm leading-relaxed">
            {SITE.openingHours.pickup}
            <br />
            {SITE.openingHours.closedDay}
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-paper">Kontakt</h3>
          <p className="mt-3 text-sm leading-relaxed">
            <a href={SITE.phoneHref} className="transition hover:text-gold">
              {SITE.phoneDisplay}
            </a>
          </p>
          <ReserveButton className="mt-3 rounded-full border border-paper/30 px-4 py-2 text-sm font-semibold text-paper transition hover:border-gold hover:text-gold">
            Reservieren
          </ReserveButton>
        </div>
      </div>
    </footer>
  );
}
