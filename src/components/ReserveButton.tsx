"use client";

import type { ReactNode } from "react";
import { useReservation } from "@/components/ReservationContext";

/**
 * Пропсы кнопки: текст/содержимое (children) и опциональные Tailwind-классы.
 * Знак "?" означает, что пропс необязателен.
 */
interface ReserveButtonProps {
  children: ReactNode;
  className?: string;
}

/**
 * Кнопка «открыть окно бронирования».
 * Это клиентский компонент ('use client'), потому что ему нужен onClick
 * и доступ к контексту. Благодаря ему большие секции (Hero, Footer...)
 * могут оставаться серверными: они просто вставляют эту маленькую
 * интерактивную кнопку внутрь себя.
 */
export default function ReserveButton({
  children,
  className = "",
}: ReserveButtonProps) {
  const { open } = useReservation();

  return (
    <button type="button" onClick={open} className={className}>
      {children}
    </button>
  );
}
