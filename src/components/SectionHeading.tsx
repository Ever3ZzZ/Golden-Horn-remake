/**
 * Переиспользуемый заголовок секции: маленькая «бровь» (eyebrow),
 * крупный заголовок и необязательное описание.
 *
 * Здесь НЕТ 'use client' — это серверный компонент:
 * никакого состояния и обработчиков событий, только разметка из пропсов.
 */
interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  /** Необязательный подзаголовок */
  description?: string;
  /** id для якорных ссылок и aria-labelledby */
  titleId?: string;
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  titleId,
}: SectionHeadingProps) {
  return (
    <div className="mx-auto mb-10 max-w-2xl text-center">
      <p className="text-xs font-bold uppercase tracking-[0.25em] text-gold">
        {eyebrow}
      </p>
      <h2
        id={titleId}
        className="mt-3 font-serif text-3xl font-bold text-ink sm:text-4xl"
      >
        {title}
      </h2>
      {/* Условный рендеринг: абзац появится, только если description передан */}
      {description !== undefined && (
        <p className="mt-4 leading-relaxed text-muted">{description}</p>
      )}
    </div>
  );
}
