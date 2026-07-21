"use client";

/**
 * Контекст бронирования.
 *
 * Проблема: кнопка «Reservieren» есть в Hero, в секции контактов и в футере,
 * а модальное окно — одно на весь сайт. Передавать функцию «открыть окно»
 * через пропсы сквозь все уровни (prop drilling) неудобно.
 * Решение: React Context — «общая розетка», к которой может подключиться
 * любой компонент внутри <ReservationProvider>.
 */

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/** Что именно контекст отдаёт наружу. */
interface ReservationContextValue {
  /** Открыто ли сейчас модальное окно */
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

/**
 * Сам контейнер. Начальное значение null — пока компонент не обёрнут
 * в Provider, значения нет. Тип указываем явно: «или значение, или null».
 */
const ReservationContext = createContext<ReservationContextValue | null>(null);

/**
 * Provider — компонент-обёртка. Всё, что он оборачивает (children),
 * получает доступ к isOpen/open/close через хук useReservation().
 */
export function ReservationProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  // useCallback запоминает функцию между рендерами,
  // чтобы не создавать новую при каждом обновлении.
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  // useMemo собирает объект один раз и пересоздаёт только при смене isOpen.
  const value = useMemo<ReservationContextValue>(
    () => ({ isOpen, open, close }),
    [isOpen, open, close],
  );

  return (
    <ReservationContext.Provider value={value}>
      {children}
    </ReservationContext.Provider>
  );
}

/**
 * Собственный хук: прячет useContext и проверку на null.
 * Если забыть обернуть дерево в Provider — получим понятную ошибку,
 * а не загадочный null где-то в глубине кода.
 */
export function useReservation(): ReservationContextValue {
  const context = useContext(ReservationContext);
  if (context === null) {
    throw new Error(
      "useReservation можно вызывать только внутри <ReservationProvider>",
    );
  }
  return context;
}
