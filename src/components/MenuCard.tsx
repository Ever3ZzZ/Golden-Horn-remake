"use client";

import Image from "next/image";
import { useState } from "react";
import { menuImageSrc } from "@/lib/menu-data";
import type { MenuItem } from "@/lib/types";

/**
 * Пропсы карточки: целиком один объект MenuItem.
 * Компонент не знает, ОТКУДА взялись данные — он просто рисует то, что дали.
 */
interface MenuCardProps {
  item: MenuItem;
}

/**
 * Карточка одного блюда.
 * Клиентский компонент из-за запасного варианта для картинок:
 * у нескольких блюд фото ещё нет, и onError + useState показывают
 * аккуратную заглушку вместо «битой» картинки (как onerror в старом script.js).
 */
export default function MenuCard({ item }: MenuCardProps) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-ink/10 bg-ivory shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* relative + aspect-[4/3] задают рамку, которую Image с fill заполняет целиком */}
      <div className="relative aspect-[4/3] w-full bg-cream">
        {imageFailed ? (
          <div className="flex h-full flex-col items-center justify-center gap-1 p-4 text-center">
            <span className="text-2xl" aria-hidden="true">🍽️</span>
            <span className="text-xs text-muted">Foto folgt</span>
          </div>
        ) : (
          <Image
            src={menuImageSrc(item.image)}
            alt={item.name}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
            onError={() => setImageFailed(true)}
          />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="text-lg font-semibold text-ink">{item.name}</h3>
        {/* flex-1 «распирает» описание, чтобы цена у всех карточек была на одной линии снизу */}
        <p className="flex-1 text-sm leading-relaxed text-muted">
          {item.description}
        </p>
        <footer className="mt-2 flex items-center justify-between border-t border-ink/10 pt-3">
          <span className="text-xs font-semibold uppercase tracking-wide text-olive">
            {item.category}
          </span>
          <b className="text-wine">{item.price}</b>
        </footer>
      </div>
    </article>
  );
}
