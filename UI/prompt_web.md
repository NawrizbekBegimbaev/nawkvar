# Nawkvar — Web App UI Design Prompt (React)

## General Style
- Minimalist, premium, editorial-quality layout
- Desktop-first responsive design (breakpoints: 1440, 1024, 768, 375px)
- Generous whitespace — content breathes
- Rounded corners (16px cards, 20px modals, 12px buttons, 8px inputs)
- Subtle shadows (0 2px 12px rgba(0,0,0,0.06)) — no hard borders between sections
- Smooth CSS transitions (200-300ms ease) on hover states, modals, tooltips

## Color Palette
- **Primary (Sage Green):** #B8C5B2 — backgrounds, hover states, active indicators, map pins
- **Secondary (Dark):** #2C2C2C — headers, primary buttons, map popups
- **Background:** #F5F3EF (warm cream/off-white) — page background
- **Card/Panel Background:** #FFFFFF
- **Text Primary:** #1A1A1A
- **Text Secondary:** #8A8A8A
- **Accent:** #4A6741 (darker green for links, CTAs)
- **Sold Badge:** #C45C5C (muted red)
- **Telegram Blue:** #229ED9
- **Hover on dark buttons:** #3A3A3A
- **Border color:** #E8E8E8 (used sparingly)

## Typography
- Font: Inter (Google Fonts) — all weights from 400 to 700
- H1 (page titles): 36px, SemiBold, #1A1A1A
- H2 (section titles): 24px, SemiBold, #1A1A1A
- H3 (card titles): 18px, SemiBold, #1A1A1A
- Price (main): 28-32px, Bold, #1A1A1A — most prominent element
- Price (card): 20px, Bold, #1A1A1A
- Body: 15px, Regular, #1A1A1A, line-height 1.6
- Caption: 13px, Medium, #8A8A8A
- Button text: 15px, SemiBold
- All numbers use tabular figures (font-variant-numeric: tabular-nums)

## Layout Structure

### Overall Page Layout
- **Max content width:** 1400px, centered
- **Horizontal padding:** 40px (desktop), 20px (mobile)
- **No traditional sidebar** — map IS the main content

---

## Pages

### 1. Main Page (Map + List Split View)
This is the primary screen. Two-panel layout.

**Header (fixed top, 64px height):**
- Background: white, bottom shadow (0 1px 4px rgba(0,0,0,0.06))
- Left: Nawkvar logo — minimal geometric mark + "nawkvar" text, sage green, 28px
- Center: Search input (optional for MVP — can skip)
- Right side:
  - If NOT logged in: "Войти" text link (#1A1A1A, 15px) + "Я сдаю" button (dark pill, white text, 40px height, padding 20px horizontal)
  - If logged in: "Я сдаю" button + Avatar circle (36px, sage green background, white initials) dropdown

**Main content (below header, full remaining height):**
- **Left panel: Map (60% width)**
  - Yandex Map, fills entire left side, no border-radius (flush with edges)
  - Map pins: Circle markers (36px), sage green (#B8C5B2) fill, white border 2px, subtle drop shadow
  - On hover over pin: Pin scales up 1.15x, cursor pointer
  - **On pin click — Popup card:**
    - Dark card (#2C2C2C), 320px wide, rounded 16px
    - Appears above the pin with a small triangle pointer
    - Content: Property photo (full-width top, 160px height, rounded top 16px), below: price (white, 20px Bold), rooms (gray, 13px), address (gray, 13px)
    - "Подробнее" link at bottom (sage green text)
    - Close "x" button (top-right, 28px circle, rgba(255,255,255,0.2))
  - Map controls: Zoom buttons styled to match (white, rounded 8px, subtle shadow)

- **Right panel: Apartment List (40% width)**
  - Background: #F5F3EF
  - Padding: 24px
  - Scroll: Independent vertical scroll (left map does not scroll)
  - **Header row:** "Квартиры" (24px, SemiBold) + count badge (sage green pill, "128 объявлений", 13px)
  - **Cards (stacked vertically, 16px gap):**
    - Background: white, rounded 16px, shadow, overflow hidden
    - Layout: Horizontal — photo left (200px wide, full card height), info right
    - Card height: ~140px
    - **Photo:** Object-fit cover, no border-radius on right side
    - **Info section (padding 16px):**
      - Price: 20px, Bold — "7 980 000 сум/мес"
      - Rooms: 14px, Regular, #8A8A8A — "3 комнаты"
      - Address/description: 14px, Regular, #8A8A8A, one line, text-overflow ellipsis
      - Bottom-right: Small sage green dot indicator if ACTIVE
    - **Hover state:** Card lifts (shadow increases), corresponding map pin pulses/highlights
    - **Click:** Navigate to detail page
  - **Pagination:** Bottom, simple "1 2 3 ... 10" with page numbers, active = dark background circle

### 2. Apartment Detail Page
- **Header:** Same global header
- **Breadcrumb:** "Главная > Квартиры > {title}" — 13px, #8A8A8A, links sage green
- **Content: Two columns (max-width 1200px, centered)**
  - **Left column (60%):**
    - **Photo gallery:**
      - Main large photo: 100% width, 420px height, rounded 16px, object-fit cover
      - Below: Thumbnail row (4-5 thumbnails, 80x80px, rounded 8px, 8px gap)
      - Active thumbnail: 2px sage green border
      - Click thumbnail → swap main photo (smooth fade transition)
    - **Description section:**
      - "Описание" — 20px, SemiBold
      - Text: 15px, Regular, line-height 1.7, #1A1A1A
  - **Right column (40%, sticky):**
    - **Price card (white, rounded 16px, padding 24px, shadow):**
      - Price: 28px, Bold — "7 980 000 сум/мес"
      - Divider (1px, #E8E8E8)
      - Stats grid (2 columns):
        - Комнаты: value bold, label gray below
      - Divider
      - **"Написать" button:** Full-width, dark (#2C2C2C), white text, 48px, rounded 12px
      - On click → contact modal
    - **Owner info (below price card, 12px gap):**
      - Small card, white, rounded 16px, padding 16px
      - "Владелец" label (13px, #8A8A8A)
      - Phone number (15px, SemiBold)

### 3. Contact Modal
- **Overlay:** rgba(0,0,0,0.4), click outside to close
- **Modal:** Centered, 400px wide, white, rounded 20px, padding 32px
- **Content:**
  - Close "x" (top-right, 32px, #8A8A8A, hover #1A1A1A)
  - Title: "Связаться с владельцем" — 22px, SemiBold, centered
  - 24px gap
  - **Telegram button:** Full-width, #229ED9, white text, paper plane SVG icon left (20px), 48px height, rounded 12px, hover darken 5%
  - 12px gap
  - **Call button:** Full-width, #4A6741, white text, phone SVG icon left (20px), 48px height, rounded 12px, hover darken 5%
  - Phone number displayed below call button: 14px, #8A8A8A, centered

### 4. Auth Page (Login / Register)
- **Full page, centered content**
- **Background:** #F5F3EF
- **Card:** White, 420px wide, rounded 20px, padding 40px, centered vertically and horizontally, shadow
- **Content:**
  - Nawkvar logo centered, 48px mark
  - 24px gap
  - Title: "Вход" or "Регистрация" — 28px, SemiBold, centered
  - 8px gap
  - Subtitle: "Войдите чтобы управлять объявлениями" — 15px, #8A8A8A, centered
  - 32px gap
  - **Phone input:**
    - Label: "Телефон" — 13px, SemiBold, #1A1A1A, above input
    - Input: Full-width, 48px height, white bg, border 1px #E8E8E8, rounded 10px, padding-left 16px
    - Prefix "+998" inside input (gray)
    - Focus: border color #4A6741, subtle sage green glow (0 0 0 3px rgba(74,103,65,0.1))
  - 16px gap
  - **Password input:** Same style, eye toggle icon (right side, 20px, #8A8A8A)
  - **Telegram input (register only):** Same style, "@" prefix, helper text below: "Необязательно — для связи через Telegram"
  - 24px gap
  - **Submit button:** Full-width, #2C2C2C, white text, 48px, rounded 12px, hover #3A3A3A
  - 16px gap
  - Toggle: "Нет аккаунта? Регистрация" — 14px, #4A6741 link, centered
- **Error states:** Input border #C45C5C, error text below input 13px #C45C5C

### 5. Cabinet Page (My Apartments)
- **Header:** Same global header
- **Content (max-width 1000px, centered):**
  - **Page title:** "Мои объявления" — 28px, SemiBold
  - **Top-right:** "+ Добавить объявление" button — outlined (border 1.5px #2C2C2C, dark text, 40px, rounded 10px, hover fills dark)
  - 24px gap
  - **Cards:** Same horizontal card layout as main list, but with:
    - Status badge (top-right of card): Pill shape
      - ACTIVE: #B8C5B2 bg, #1A1A1A text, "Активно"
      - SOLD: #C45C5C bg, white text, "Продано"
    - Action buttons (bottom-right of info section):
      - "Редактировать" — text link, #4A6741, 13px
      - "Удалить" — text link, #C45C5C, 13px
      - "Продано" — text link, #8A8A8A, 13px (only if ACTIVE)
  - **Empty state (no apartments):**
    - Centered illustration or icon (house outline, sage green, 80px)
    - "У вас пока нет объявлений" — 18px, #8A8A8A
    - "+ Добавить" button below

### 6. Create/Edit Apartment Page
- **Header:** Same global header
- **Content (max-width 800px, centered):**
  - **Title:** "Новое объявление" or "Редактирование" — 28px, SemiBold
  - 32px gap
  - **Photo upload section:**
    - Grid of uploaded photos (3 per row, 1:1 aspect ratio, rounded 12px)
    - Each photo: hover overlay with trash icon to delete
    - Empty slot: Dashed border (#D0D0D0), "+" icon centered, click to upload
    - Drag & drop support, helper text: "Минимум 1 фото"
  - 24px gap
  - **Form fields (white cards, rounded 12px, full-width):**
    - All inputs: 48px height, padding 16px, border 1px #E8E8E8, rounded 10px
    - Focus: sage green border + glow
    - **Цена:** Number input, suffix "сум/мес" (gray, inside input right)
    - **Комнаты:** Number input or segmented control (1, 2, 3, 4, 5+) — sage green active
    - **Описание:** Textarea, 160px height, resize vertical
  - 24px gap
  - **Location picker:**
    - Label: "Расположение" — 16px, SemiBold
    - Yandex Map embed, 300px height, rounded 16px
    - Center pin (static, always in center), user drags map underneath
    - Instruction below: "Переместите карту для указания локации" — 13px, #8A8A8A
  - 32px gap
  - **Submit button:** "Опубликовать" — full-width, #2C2C2C, white text, 48px, rounded 12px
  - 24px bottom padding

### 7. "Mark as Sold" Confirmation Modal
- **Overlay:** rgba(0,0,0,0.4)
- **Modal:** Centered, 380px, white, rounded 20px, padding 32px
- **Content:**
  - Icon: Warning/check circle (sage green, 48px)
  - Title: "Отметить как продано?" — 20px, SemiBold, centered
  - Subtitle: "Объявление исчезнет с карты" — 15px, #8A8A8A, centered
  - 24px gap
  - Two buttons side by side:
    - "Отмена" — outlined, border #E8E8E8, dark text, 44px, rounded 10px, 48% width
    - "Да, продано" — filled #2C2C2C, white text, 44px, rounded 10px, 48% width

### 8. Delete Confirmation Modal
- Same layout as "Sold" modal
- Title: "Удалить объявление?"
- Subtitle: "Это действие нельзя отменить"
- Buttons: "Отмена" (outlined) + "Удалить" (filled #C45C5C, white text)

---

## Responsive Behavior

**Tablet (768-1024px):**
- Map/List split becomes 50/50
- Cards stack tighter, photo 150px wide
- Detail page: Single column, sticky card becomes non-sticky below gallery

**Mobile (< 768px):**
- Split view disappears — toggle between Map and List with floating tab pills at top
- Cards: Photo top, info bottom (vertical layout)
- Detail page: Single column
- Header: Hamburger menu right, logo left
- Forms: Same but full-screen pages instead of centered cards

## Hover & Interactive States
- Buttons: Darken 5% on hover, scale(0.98) on active/press
- Cards: Shadow increases + translateY(-2px) on hover
- Links: Underline on hover
- Inputs: Border color transition 200ms
- Map pins: Scale 1.15 on hover, pulse animation on corresponding card hover
- Card hover ↔ Map pin highlight are synced (hover card = highlight pin, hover pin = highlight card)

## Loading States
- Skeleton screens: Rounded rectangles with shimmer animation (#E8E8E8 to #F5F3EF)
- Match card layout shape exactly
- Button loading: Text replaced with small spinner (white, 20px)

## Empty States
- Centered icon (outlined, sage green) + message + action button
- No sad faces or error-feeling illustrations — keep it neutral and encouraging
