import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/reservation
 *
 * Принимает данные формы бронирования и отправляет их в Telegram-группу.
 *
 * Почему API-роут, а не прямой вызов из браузера:
 * - токен бота хранится в .env.local и никогда не попадает в браузер;
 * - запрос идёт со стороны сервера Next.js — CORS не проблема.
 */

/** Тип данных, который фронтенд отправляет на этот API */
interface ReservationPayload {
  name: string;
  phone: string;
  email: string;
  persons: string;
  date: string;    // YYYY-MM-DD
  time: string;    // "14:30"
  message: string;
}

/** Форматирует ISO-дату в немецкий вид: Freitag, 24. Juli 2026 */
function formatGermanDate(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00`);
  return date.toLocaleDateString("de-DE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Экранирует спецсимволы MarkdownV2.
 * Telegram требует экранировать: _ * [ ] ( ) ~ ` > # + - = | { } . !
 */
function esc(text: string): string {
  return text.replace(/[_*[\]()~`>#+\-=|{}.!\\]/g, (ch) => `\\${ch}`);
}

/** Строит отформатированное сообщение для Telegram MarkdownV2 */
function buildMessage(data: ReservationPayload): string {
  const date = data.date ? formatGermanDate(data.date) : "\u2014";
  const time = data.time ? `${data.time} Uhr` : "\u2014";
  const lines = [
    `\u{1F4CB} *Neue Reservierungsanfrage \u2014 GoldenHorn*`,
    ``,
    `\u{1F464} *Name:*     ${esc(data.name)}`,
    `\u{1F4DE} *Telefon:*  ${esc(data.phone)}`,
    `\u{1F4E7} *E\\-Mail:*  ${esc(data.email)}`,
    `\u{1F465} *Personen:* ${esc(data.persons)}`,
    `\u{1F4C5} *Datum:*    ${esc(date)}`,
    `\u{23F0} *Uhrzeit:*  ${esc(time)}`,
  ];
  if (data.message.trim()) {
    lines.push(`\u{1F4AC} *Nachricht:* ${esc(data.message.trim())}`);
  }
  return lines.join("\n");
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  // Читаем токен и chat_id из .env.local.
  // Эти значения никогда не попадают в браузер (Next.js скрывает
  // переменные без NEXT_PUBLIC_ автоматически).
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.error(
      "[reservation] Ошибка: TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID не заданы. " +
        "Скопируйте .env.local.example в .env.local и заполните значения.",
    );
    return NextResponse.json(
      { ok: false, error: "Server configuration error" },
      { status: 500 },
    );
  }

  let body: ReservationPayload;
  try {
    body = (await request.json()) as ReservationPayload;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  // Telegram Bot API URL. Токен подставляется на сервере из .env.local
  const apiUrl =
    "https://api.telegram.org/bot" + token + "/sendMessage";

  const telegramResponse = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: buildMessage(body),
      parse_mode: "MarkdownV2",
    }),
  });

  if (!telegramResponse.ok) {
    const errorText = await telegramResponse.text();
    console.error("[reservation] Telegram API error:", errorText);
    return NextResponse.json(
      { ok: false, error: "Telegram API error" },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
