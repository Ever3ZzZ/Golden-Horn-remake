"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
}

/**
 * Обёртка «плавное появление при скролле».
 * В старом проекте это делал IntersectionObserver в script.js,
 * который добавлял класс .visible. Здесь та же логика, но через хуки:
 *
 * - useRef<HTMLDivElement>(null) — «закладка» на реальный DOM-элемент.
 *   Тип в <> говорит TypeScript, что внутри будет именно <div>.
 * - useState(false) — виден ли блок. Тип boolean TypeScript выводит сам.
 * - useEffect — код, который запускается ПОСЛЕ отрисовки в браузере
 *   (на сервере DOM нет, поэтому компонент клиентский).
 */
export default function Reveal({ children, className = "" }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (node === null) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.01, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(node);

    // Функция очистки: React вызовет её, когда компонент исчезнет со страницы.
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
}
