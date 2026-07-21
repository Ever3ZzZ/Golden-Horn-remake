# GUIDE.md — Полный разбор проекта GoldenHorn для новичка

Этот файл — учебное пособие к проекту. Читай его параллельно с кодом: открой файл, о котором идёт речь, и сверяйся со строками.

---

## Содержание

1. [Как запустить проект](#1-как-запустить-проект)
2. [Что изменилось по сравнению со старым проектом](#2-что-изменилось)
3. [Структура папок Next.js: что где лежит и почему](#3-структура-папок)
4. [Серверные и клиентские компоненты: зачем нужен 'use client'](#4-серверные-и-клиентские-компоненты)
5. [TypeScript на пальцах: интерфейсы, пропсы, типизация хуков](#5-typescript-на-пальцах)
6. [Tailwind CSS на примерах из этого кода](#6-tailwind-css-на-примерах)
7. [Связи между компонентами: кто кому что передаёт](#7-связи-между-компонентами)
8. [Упражнения для закрепления](#8-упражнения)

---

## 1. Как запустить проект

```bash
npm install      # один раз: скачивает Next.js, React, Tailwind в node_modules
npm run dev      # запускает сервер разработки
```

Открой http://localhost:3000. Правишь код — страница обновляется сама (hot reload).

---

## 2. Что изменилось

| Было (старый проект) | Стало (этот проект) |
|---|---|
| `index.html` — вся разметка одним файлом на 227 строк | Разметка разбита на 14 маленьких компонентов в `src/components` |
| `script.js` — данные меню + логика вперемешку | Данные лежат отдельно в `src/lib`, логика — внутри компонентов, которым она нужна |
| `styles.css` — 928 строк CSS с придуманными именами классов | Tailwind: стили пишутся прямо в разметке готовыми утилитами |
| `grid.innerHTML = ...` — HTML собирается строками вручную | React сам перерисовывает DOM, когда меняется состояние |
| Телефон кафе «зашит» в 5 местах (в одном — с опечаткой!) | Телефон в одном месте: `src/lib/site-config.ts` |
| Никакой проверки типов: опечатка в `item.cat` обнаружится только в браузере | TypeScript ловит опечатки ещё в редакторе, до запуска |

Весь функционал сохранён: поиск и фильтр по меню, переключение завтрак-меню, карусель отзывов, модалка резервации со сводкой «для звонка», плавное появление секций при скролле.

---

## 3. Структура папок

```
goldenhorn-next/
├── package.json          ← список зависимостей и команды (npm run dev)
├── tsconfig.json         ← настройки TypeScript (strict: true — строгий режим)
├── next.config.ts        ← настройки Next.js
├── postcss.config.mjs    ← подключение Tailwind
├── public/               ← статические файлы «как есть»
│   └── assets/           ← картинки. /assets/logo.png в коде = public/assets/logo.png
└── src/
    ├── app/              ← МАРШРУТЫ сайта (сердце App Router)
    │   ├── layout.tsx    ← общий каркас ВСЕХ страниц (шапка, подвал, шрифты)
    │   ├── page.tsx      ← главная страница, маршрут "/"
    │   └── globals.css   ← глобальные стили + палитра Tailwind
    ├── components/       ← переиспользуемые кусочки интерфейса
    └── lib/              ← НЕ-визуальный код: данные, типы, конфиг
```

### Почему именно так?

**`src/app` — папки превращаются в адреса.** В App Router файловая система = маршруты сайта:

- `src/app/page.tsx` → страница `/`
- `src/app/kontakt/page.tsx` → была бы страница `/kontakt` (если создать)
- `layout.tsx` оборачивает все страницы своего уровня. Поэтому `<Header />` и `<Footer />` лежат именно в layout: они одинаковы на любой странице, и при переходах между страницами не перерисовываются.

**`src/components` — детали конструктора.** Компонент — это функция, которая возвращает разметку. Правило: если кусок UI повторяется (карточка блюда) или логически самостоятелен (шапка, галерея) — это отдельный файл. Страница `page.tsx` тогда читается как оглавление: `<Hero />, <MenuSection />, <Gallery />...`

**`src/lib` — всё, что не рисует UI.** Данные меню, отзывы, типы, телефон и адрес кафе. Так компоненты не «знают», откуда данные, а данные не «знают», как их рисуют. Захочешь потом брать меню из базы данных — поменяешь только `lib`, компоненты не тронешь.

**`public` — раздаётся напрямую.** Файл `public/assets/logo.png` доступен по адресу `сайт/assets/logo.png`. Слово `public` в URL не пишется.

**Алиас `@/`.** В `tsconfig.json` настроено `"@/*": ["./src/*"]`. Поэтому пишем `import Header from "@/components/Header"` вместо хрупких `../../components/Header`.

---

## 4. Серверные и клиентские компоненты

Главная идея App Router: **по умолчанию каждый компонент — серверный**. Он выполняется на сервере, превращается в готовый HTML, и его JavaScript НЕ отправляется в браузер. Страница грузится быстрее.

Но серверный компонент не умеет:
- хранить состояние (`useState`),
- реагировать на события (`onClick`, `onChange`),
- использовать `useEffect`, таймеры, `IntersectionObserver` — всё, что живёт в браузере.

Если это нужно — в ПЕРВОЙ строке файла пишем `"use client"`.

### Кто есть кто в этом проекте

| Компонент | Тип | Почему |
|---|---|---|
| `Header`, `Hero`, `Favorites`, `Gallery`, `ContactSection`, `MapEmbed`, `Footer`, `SectionHeading` | серверный | просто разметка, никакого интерактива |
| `MenuSection` | клиентский | `useState` для поиска и активной категории |
| `BreakfastSection` | клиентский | `useState`: какое меню выбрано |
| `ReviewsCarousel` | клиентский | `useState` + `useEffect` с таймером |
| `ReservationModal`, `ReservationContext`, `ReserveButton` | клиентские | состояние окна, обработчики, контекст |
| `Reveal` | клиентский | `IntersectionObserver` — браузерное API |
| `MenuCard` | клиентский | `onError` у картинки + `useState` для заглушки |

### Приём, который стоит запомнить

Посмотри на `Header.tsx`: сам он **серверный**, но внутри использует маленькую клиентскую кнопку `<ReserveButton>`. Это правильный паттерн: не превращай всю большую секцию в клиентскую из-за одной кнопки — вынеси кнопку в отдельный клиентский компонент и вставь её внутрь серверного.

---

## 5. TypeScript на пальцах

### 5.1. Интерфейс = «паспорт объекта»

Открой `src/lib/types.ts`:

```ts
export interface MenuItem {
  image: string;
  category: MenuCategory;
  name: string;
  description: string;
  price: string;
}
```

Интерфейс описывает, какие поля обязаны быть у объекта и какого они типа. В `menu-data.ts` написано `MENU_ITEMS: MenuItem[]` («массив объектов MenuItem»). Теперь если забыть поле `price` или написать `nmae` вместо `name` — редактор подчеркнёт ошибку сразу, а не покажет `undefined` в браузере, как было бы в старом `script.js`.

### 5.2. Union-типы = «одно из»

```ts
export type MenuCategory = "Suppen" | "Salate" | "Frühstück" | ...;
export type CategoryFilter = MenuCategory | "Alle";
```

Значение может быть ТОЛЬКО одной из перечисленных строк. Напишешь `category: "Burgers"` — ошибка компиляции. Это дешёвая замена целому классу багов «опечатка в строке».

### 5.3. Типизация пропсов компонента

Пропсы — это «аргументы» компонента. Каждый компонент объявляет для них интерфейс. Пример из `SectionHeading.tsx`:

```tsx
interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;   // «?» = поле необязательное
  titleId?: string;
}

export default function SectionHeading({ eyebrow, title, description, titleId }: SectionHeadingProps) { ... }
```

Читается так: «SectionHeading принимает объект, в котором обязательно есть eyebrow и title (строки), и может быть description и titleId». В фигурных скобках слева — деструктуризация: сразу вытаскиваем поля из объекта пропсов.

Теперь вызов `<SectionHeading title="..." />` без `eyebrow` — ошибка ещё до запуска. А в `MenuCard.tsx` пропс — целый объект: `interface MenuCardProps { item: MenuItem }`.

### 5.4. Типизация хуков

**useState — тип чаще выводится сам:**

```ts
const [query, setQuery] = useState("");        // TypeScript сам понял: string
const [isVisible, setIsVisible] = useState(false); // boolean
```

**useState — когда тип нужно указать явно (в угловых скобках `<>`):**

```ts
// MenuSection.tsx: без подсказки TS решил бы, что тут может быть только "Alle"
const [activeCategory, setActiveCategory] = useState<CategoryFilter>("Alle");

// ReservationModal.tsx: «строка ИЛИ null». null = плашки нет на экране
const [summary, setSummary] = useState<string | null>(null);

// BreakfastSection.tsx: тип «как у поля id в BreakfastMenu», т.е. "menu1" | "menu2"
const [activeMenuId, setActiveMenuId] = useState<BreakfastMenu["id"]>("menu1");
```

Правило: начальное значение полностью описывает тип → скобки `<>` не нужны. Начальное значение — частный случай (пустая строка вместо union, null вместо «потом будет строка») → укажи тип явно.

**useRef — говорим, какой DOM-элемент внутри:**

```ts
// Reveal.tsx
const ref = useRef<HTMLDivElement>(null);
```

`ref.current` будет либо `null` (до отрисовки), либо `<div>`. Поэтому в коде стоит проверка `if (node === null) return;` — TypeScript её требует, и это спасает от реальной ошибки.

**События — у них тоже есть типы:**

```ts
// ReservationModal.tsx
function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
  const { name, value } = event.target; // TS знает, что тут есть .name и .value
}
function handleSubmit(event: FormEvent<HTMLFormElement>): void { ... }
```

А в простых случаях тип выводится сам: `onChange={(event) => setQuery(event.target.value)}`.

**useMemo и useEffect:**

```ts
// MenuSection.tsx: тип результата (MenuItem[]) выводится из return
const filteredItems = useMemo(() => MENU_ITEMS.filter(...), [query, activeCategory]);
```

Массив в конце — «зависимости»: пересчитать/перезапустить, только когда они изменились. Пустой массив `[]` в `useEffect` = «выполнить один раз после первой отрисовки» (см. таймер в `ReviewsCarousel.tsx`).

### 5.5. Почему без `any`

`any` выключает проверку типов — это возврат к старому `script.js`, где всё падает только в браузере. В проекте `any` нет ни одного. Если тип неизвестен, есть честные инструменты: union (`string | null`), необязательные поля (`?`), выведение типов.

---

## 6. Tailwind CSS на примерах

Идея Tailwind: вместо придумывания имён классов (`.menu-card-body`) и отдельного CSS-файла — набираешь стиль из готовых мелких «утилит» прямо в `className`. Один класс = одно CSS-свойство.

### 6.1. Наша палитра

В `src/app/globals.css` через `@theme` объявлены цвета из старого `styles.css`:

```css
@theme {
  --color-ink: #171513;    /* тёмный «чернильный» текст */
  --color-paper: #fffaf1;  /* тёплый фон страницы */
  --color-gold: #c9932e;   /* фирменный золотой */
  --color-wine: #8e3d34;   /* винный — для цен */
  ...
}
```

Каждая переменная автоматически даёт классы: `bg-paper`, `text-ink`, `text-gold`, `border-gold`, `bg-ink/50` (последнее = цвет ink с прозрачностью 50%).

### 6.2. Разбор реальной строки: карточка блюда

`MenuCard.tsx`:

```tsx
<article className="flex flex-col overflow-hidden rounded-2xl border border-ink/10 bg-ivory shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
```

| Класс | Что делает |
|---|---|
| `flex flex-col` | flex-контейнер, дети выстраиваются в колонку |
| `overflow-hidden` | обрезает картинку по скруглённым углам |
| `rounded-2xl` | сильно скруглённые углы |
| `border border-ink/10` | рамка толщиной 1px, цвет ink с прозрачностью 10% |
| `bg-ivory` | фон цвета «слоновая кость» из нашей палитры |
| `shadow-sm` | лёгкая тень |
| `transition duration-300` | все изменения анимируются за 300 мс |
| `hover:-translate-y-1 hover:shadow-xl` | при наведении: приподнять на 4px и усилить тень |

Префикс `hover:` — состояние. Есть также `focus:` (см. поле поиска в `MenuSection.tsx`).

### 6.3. Отступы: p, m, gap

Шкала: 1 единица = 0.25rem = 4px.

- `p-5` — padding (внутренний отступ) со всех сторон 20px; `px-4` — только слева/справа; `py-3` — сверху/снизу; `pt-3` — только сверху.
- `m-*` — margin (внешний отступ): `mt-4` — сверху, `mx-auto` — авто-отступы слева/справа = **центрирование блока** (см. `mx-auto max-w-6xl` почти в каждой секции).
- `gap-6` — расстояние между детьми во flex/grid. Современная замена «margin у каждого ребёнка».

### 6.4. Флексы: `Header.tsx`

```tsx
<div className="flex items-center justify-between gap-6 px-4 py-3">
```

- `flex` — включает флекс-контейнер (дети в ряд);
- `items-center` — выровнять по вертикали по центру;
- `justify-between` — раскидать по горизонтали: лого слева, меню в центре, кнопки справа;
- `flex-wrap` (в `Hero.tsx`) — разрешить перенос на новую строку, если не влезает;
- `flex-1` (в `MenuCard.tsx` у описания) — «займи всё свободное место», за счёт этого цены у всех карточек прижаты к низу;
- `shrink-0` (в `Gallery.tsx`) — запрет сжиматься: фото в ленте держат свои 288px (`w-72`).

### 6.5. Сетка (grid): меню и подвал

`MenuSection.tsx`:

```tsx
<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
```

`grid` — включить сетку. Без уточнений — одна колонка. Дальше — адаптивность (см. ниже). Подвал (`Footer.tsx`): `grid gap-10 sm:grid-cols-2 lg:grid-cols-4` — 1 → 2 → 4 колонки.

### 6.6. Адаптивность: mobile-first

Самое важное правило Tailwind: **классы без префикса — для самых маленьких экранов, префиксы включаются НА ЭТОЙ ШИРИНЕ И ШИРЕ**:

- `sm:` — от 640px, `md:` — от 768px, `lg:` — от 1024px, `xl:` — от 1280px.

Примеры из кода:

```tsx
// MenuSection: телефон — 1 колонка, планшет — 2, ноутбук — 3
"grid gap-6 sm:grid-cols-2 lg:grid-cols-3"

// Header: навигация скрыта на телефоне, появляется с 768px
"hidden md:flex"

// SectionHeading: заголовок крупнее на широких экранах
"text-3xl sm:text-4xl"

// ContactSection: колонки текст+кнопки только с 1024px
"grid gap-10 lg:grid-cols-2"
```

Читается всегда слева направо: «по умолчанию так, а начиная с такой-то ширины — вот так».

### 6.7. Позиционирование: hero-картинка

`Hero.tsx`:

```tsx
<section className="relative min-h-[80vh] ...">
  <Image ... fill className="object-cover" />
  <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/50 to-transparent" />
  <div className="relative z-10 ...">текст</div>
</section>
```

- `relative` на родителе — точка отсчёта для абсолютных детей; `fill` у `next/image` растягивает картинку на весь такой блок;
- `absolute inset-0` — растянуть слой на всю секцию (top/right/bottom/left = 0);
- `bg-gradient-to-r from-... to-...` — градиент-затемнение, чтобы текст читался;
- `z-10` — текст поверх затемнения;
- `min-h-[80vh]` — «произвольное значение» в квадратных скобках: минимум 80% высоты экрана. Так пишут, когда готового класса нет (ещё пример: `tracking-[0.25em]`, `aspect-[4/3]`).

### 6.8. Динамические классы

Активная кнопка категории (`MenuSection.tsx`):

```tsx
className={`rounded-full px-4 py-2 ... ${isActive ? "bg-ink text-paper" : "border border-ink/15 bg-ivory ..."}`}
```

Базовые классы + тернарный оператор для состояния. Важно: Tailwind должен видеть имена классов ЦЕЛИКОМ в коде (нельзя склеивать `"bg-" + color`). Поэтому сдвиг карусели в `ReviewsCarousel.tsx` задан через `style={{ transform: ... }}` — значение вычисляется на лету, классом это не сделать.

---

## 7. Связи между компонентами

### 7.1. Карта дерева

```
layout.tsx
└── ReservationProvider (контекст: открыто ли окно резервации)
    ├── Header ──────── ReserveButton (кнопка «открыть окно»)
    ├── page.tsx (children)
    │   ├── Hero ─────── ReserveButton
    │   ├── Reveal ──── BreakfastSection
    │   ├── Reveal ──── Favorites ──────── SectionHeading
    │   ├── Reveal ──── MenuSection ────── SectionHeading, MenuCard × N
    │   ├── Reveal ──── Gallery ────────── SectionHeading
    │   ├── Reveal ──── ReviewsCarousel ── SectionHeading
    │   ├── Reveal ──── ContactSection ─── ReserveButton
    │   └── MapEmbed
    ├── Footer ──────── ReserveButton
    └── ReservationModal (само окно + плашка «сводка для звонка»)

Данные (src/lib): menu-data ⟶ MenuSection, Favorites;  reviews-data ⟶ ReviewsCarousel;
site-config ⟶ Header, ContactSection, Footer, ReservationModal;  types ⟶ все.
```

### 7.2. Три способа передачи данных, использованные здесь

**1) Пропсы — сверху вниз.** Родитель передаёт данные ребёнку как атрибуты:

```tsx
// MenuSection.tsx (родитель):
{filteredItems.map((item) => <MenuCard key={item.name} item={item} />)}

// MenuCard.tsx (ребёнок) принимает и рисует:
function MenuCard({ item }: MenuCardProps) { ... item.name ... }
```

Поток ОДНОнаправленный: данные текут только вниз. `MenuCard` не может изменить список меню — он только отображает то, что дали. `key` нужен React, чтобы понимать, какая карточка какая при перерисовке.

**2) children — «компонент-обёртка».** `Reveal` не знает, ЧТО он анимирует:

```tsx
<Reveal>
  <MenuSection />   {/* это попадёт в проп children */}
</Reveal>
```

Так же работают `ReservationProvider` (оборачивает всё) и `ReserveButton` (children = текст кнопки).

**3) Контекст — «через голову» дерева.** Кнопки «Reservieren» есть в шапке, hero, контактах и подвале, а окно — одно, в layout. Тащить проп `openModal` через все уровни (prop drilling) неудобно. Поэтому:

- `ReservationContext.tsx` создаёт контекст и провайдер с состоянием `isOpen`;
- `layout.tsx` оборачивает всё в `<ReservationProvider>`;
- любая кнопка вызывает хук `useReservation()` и получает `open`;
- `ReservationModal` из того же хука берёт `isOpen` и `close`.

Нажатие кнопки в подвале меняет состояние в провайдере → React перерисовывает модалку. Компоненты друг о друге не знают — их связывает только контекст.

### 7.3. Где хранить состояние? Правило

Держи состояние как можно НИЖЕ (ближе к месту использования), поднимай выше только когда оно нужно нескольким веткам дерева:

- поиск и категория — только внутри `MenuSection` → локальный `useState`;
- выбранное завтрак-меню — только в `BreakfastSection` → локальный `useState`;
- открыта ли модалка — нужно шапке, hero, подвалу И самой модалке → контекст.

### 7.4. Как проследить любую фичу (пример: поиск по меню)

1. Пользователь печатает в `<input>` → срабатывает `onChange` → `setQuery(event.target.value)`.
2. Состояние `query` изменилось → React заново вызывает функцию `MenuSection`.
3. `useMemo` видит, что зависимость `query` изменилась → пересчитывает `filteredItems`.
4. `filteredItems.map(...)` создаёт новый список `<MenuCard>` → React обновляет на экране только то, что реально изменилось.

Никакого `innerHTML`, как в старом `script.js`: мы меняем ДАННЫЕ, а React сам синхронизирует экран.

---

## 8. Упражнения

От простого к сложному — всё проверяется в браузере:

1. **Цвет:** в `globals.css` поменяй `--color-gold` и посмотри, сколько мест обновилось само.
2. **Данные:** добавь новое блюдо в `MENU_ITEMS` (`src/lib/menu-data.ts`). Заметь: карточка и фильтры обновятся сами. Попробуй указать несуществующую категорию — увидишь ошибку TypeScript.
3. **Tailwind:** в `MenuSection.tsx` сделай 4 колонки на очень широких экранах, добавив `xl:grid-cols-4`.
4. **Пропсы:** добавь в `SectionHeading` необязательный проп `align?: "left" | "center"` и используй его.
5. **Состояние:** добавь в `ReviewsCarousel` кнопки «вперёд/назад» рядом с точками.
6. **Маршруты:** создай `src/app/impressum/page.tsx` с любым текстом и открой `/impressum` — новая страница появится без единой настройки, а шапка и подвал будут уже на месте (спасибо layout).

Удачи! Лучший способ понять этот код — ломать его и чинить обратно. 🛠️
