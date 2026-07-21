"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useReservation } from "@/components/ReservationContext";
import { NAV_LINKS } from "@/lib/nav-links";
import { SITE } from "@/lib/site-config";

/**
 * Мобильное бургер-меню (видно только до 768px).
 *
 * Важные детали:
 * 1. Кнопка — стандартные три палочки, без текста.
 * 2. При первом заходе на сайт рядом появляется МИГАЮЩАЯ подсказка
 *    «Alle Bereiche hier» — через 4 секунды она исчезает (setTimeout).
 * 3. Само меню рендерится через createPortal ПРЯМО В <body>:
 *    у шапки есть backdrop-blur, а backdrop-filter ломает position: fixed
 *    у вложенных элементов. Через портал меню живёт отдельно и полностью
 *    накрывает экран своим сплошным фоном.
 * 4. Разделы — не просто строки, а КНОПКИ-прямоугольники с рамкой,
 *    фоном и стрелкой — сразу видно, что на них надо нажимать.
 */
export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const { open: openReservation } = useReservation();

  // Подсказка при заходе на сайт: мигает 4 секунды и пропадает
  useEffect(() => {
    setShowHint(true);
    const timer = window.setTimeout(() => setShowHint(false), 4000);
    return () => window.clearTimeout(timer);
  }, []);

  // Пока меню открыто — запрещаем прокрутку страницы под ним
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  /** Reservieren внутри меню: закрываем меню, потом открываем окно брони */
  function handleReserveClick(): void {
    setIsOpen(false);
    openReservation();
  }

  /** Полноэкранное меню — отдельный слой со сВОИМ сплошным тёмным фоном */
  const menuOverlay = (
    <div className="anim-fade fixed inset-0 z-[100] flex flex-col bg-ink md:hidden">
      <div className="flex items-center justify-between border-b border-paper/15 px-4 py-3">
        <Image
          src={SITE.logo}
          alt={SITE.name}
          width={500}
          height={164}
          className="h-10 w-auto"
        />
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          aria-label="Menü schließen"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-paper/30 text-xl text-paper transition hover:border-gold hover:text-gold"
        >
          ×
        </button>
      </div>

      <div className="anim-rise flex flex-1 flex-col items-center justify-center gap-8 overflow-y-auto px-6 py-6">
        {/* Разделы — кликабельные прямоугольные кнопки с рамкой и стрелкой */}
      <nav
          aria-label="Hauptnavigation mobil"
          className="flex w-full max-w-xs flex-col gap-3"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between rounded-2xl border border-paper/25 bg-paper/10 px-5 py-4 text-lg font-semibold text-paper shadow-sm transition hover:border-gold hover:bg-paper/15 active:scale-[0.98] active:bg-gold active:text-ink"
            >
              {link.label}
              <span aria-hidden="true" className="text-xl text-gold">
                ›
              </span>
            </a>
          ))}
        </nav>

        <div className="flex w-full max-w-xs flex-col gap-3">
          <button
            type="button"
            onClick={handleReserveClick}
            className="rounded-full bg-gold px-6 py-3 text-sm font-semibold text-ink transition hover:brightness-110"
          >
            Reservieren
          </button>
          <a
            href={SITE.phoneHref}
            className="rounded-full border border-paper/30 px-6 py-3 text-center text-sm font-semibold text-paper transition hover:border-gold hover:text-gold"
          >
            {SITE.phoneDisplay}
          </a>
        </div>
      </div>

      <p className="border-t border-paper/15 px-6 py-4 text-center text-xs text-paper/60">
        {SITE.openingHours.regular} · {SITE.openingHours.closedDay}
      </p>
    </div>
  );

  return (
    <div className="relative md:hidden">
      {/* Стандартный бургер: только три палочки, без текста */}
      <button
        type="button"
        onClick={() => {
          setShowHint(false);
          setIsOpen(true);
        }}
        aria-label="Menü öffnen"
        className="flex h-10 w-10 flex-col items-center justify-center gap-[5px] rounded-full border border-ink/15 bg-ivory transition hover:border-gold"
      >
        <span aria-hidden="true" className="block h-0.5 w-5 rounded bg-ink" />
        <span aria-hidden="true" className="block h-0.5 w-5 rounded bg-ink" />
        <span aria-hidden="true" className="block h-0.5 w-5 rounded bg-ink" />
      </button>

      {/* Мигающая подсказка под кнопкой: видна первые 4 секунды после захода */}
      {showHint && !isOpen && (
        <span
          role="status"
          className="anim-blink pointer-events-none absolute right-0 top-full z-50 mt-2 w-max rounded-full bg-ink px-3.5 py-2 text-[11px] font-semibold text-paper shadow-lg"
        >
          Alle Bereiche hier ↑
        </span>
      )}

      {/* Портал: меню монтируется в <body>, мимо шапки с её backdrop-blur */}
      {isOpen && createPortal(menuOverlay, document.body)}
    </div>
  );
}
