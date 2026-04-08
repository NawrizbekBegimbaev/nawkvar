# Nawkvar — Mobile App UI Design Prompt (Flutter)

## General Style
- Minimalist, premium, airy layout with generous whitespace
- No visual clutter — every element has purpose
- Rounded corners (16px on cards, 24px on modals, 12px on buttons)
- Subtle shadows (0 2px 8px rgba(0,0,0,0.08)) — no harsh borders
- Smooth transitions and micro-animations on all interactions

## Color Palette
- **Primary (Sage Green):** #B8C5B2 — used for backgrounds, active states, map pins
- **Secondary (Dark):** #2C2C2C — used for text, popups on map, buttons
- **Background:** #F5F3EF (warm cream/off-white)
- **Card Background:** #FFFFFF
- **Text Primary:** #1A1A1A
- **Text Secondary:** #8A8A8A
- **Accent:** #4A6741 (darker green for CTAs like "Позвонить", "Telegram")
- **Error/Sold:** #C45C5C (muted red for SOLD badges)

## Typography
- Font: Inter or SF Pro Display
- Headings: 24-28px, SemiBold, #1A1A1A
- Price: 32-36px, Bold, #1A1A1A — prices are the most prominent text element
- Body: 14-16px, Regular, #1A1A1A
- Caption/Label: 12px, Medium, #8A8A8A
- All numbers (price, rooms, area) use tabular/monospaced figures

## Screens

### 1. Map Screen (Home / Main Screen)
- **Status bar:** Light style
- **Top bar:**
  - Left: Nawkvar logo (minimal geometric/infinity mark, sage green)
  - Right: Profile avatar circle (32px), if not logged in — generic person icon
  - No heavy navigation bar — float above the map
- **Map:**
  - Full-screen Yandex Map, takes 100% of the screen behind top bar
  - Map style: light/muted tones (custom Yandex map styling to match sage palette)
  - Pins: Small circles (40x40px) with sage green fill (#B8C5B2), white border (2px), subtle shadow
  - Pin shows price inside if zoom is close enough, otherwise just a dot
- **Popup on pin tap:**
  - Dark card (#2C2C2C) with rounded corners (20px), appears from bottom of pin
  - Size: ~300px wide, ~120px tall
  - Contains: Small property photo (80x80px, rounded 12px) on the left
  - Right side: Price (bold, white, 18px), rooms count, short address (gray, 12px)
  - Tap on popup → navigates to Apartment Detail screen
  - Background map dims slightly (overlay rgba(0,0,0,0.1))
- **Bottom floating button:**
  - "Я сдаю" button — pill shape, dark (#2C2C2C), white text, centered at bottom
  - 48px height, padding 24px horizontal
  - Position: 24px from bottom, centered

### 2. Apartment Detail Screen
- **Layout:** Scrollable, no bottom tabs during detail view
- **Hero image:**
  - Full-width photo, height 55% of screen
  - Rounded bottom corners (24px)
  - If multiple photos — horizontal swipeable carousel with dot indicators (white dots, bottom of image)
  - Back arrow (top-left, 40px circle, white background with blur, dark icon)
- **Content section (below image):**
  - Background: #F5F3EF
  - Padding: 20px horizontal
  - **Address:** 14px, Medium, #8A8A8A — one line, directly below image
  - **Price:** 32px, Bold, #1A1A1A — e.g. "7 980 000 сум/мес"
  - **Stats row:** Horizontal, 3 items in rounded pill badges (sage green background #B8C5B2, dark text)
    - Rooms: "3 комнаты"
    - (future: area, floor — for now just rooms)
  - **Description:** 14px, Regular, #1A1A1A, line-height 1.6, max 6 lines then "Показать полностью"
  - **Divider:** Thin line (#E5E5E5), 1px, full width
  - **Owner section:** Small row with phone icon + "Связаться"
- **Bottom fixed bar:**
  - "Написать" button — full-width, dark (#2C2C2C), white text, 52px height, rounded 16px
  - On tap → modal with two buttons

### 3. Contact Modal (on "Написать" tap)
- **Overlay:** rgba(0,0,0,0.4) backdrop
- **Modal:** Bottom sheet, white background, rounded top corners (24px)
- **Height:** Auto, ~200px
- **Content:**
  - Title: "Связаться с владельцем" — 18px, SemiBold, centered
  - 16px gap
  - **Telegram button:** Full-width, #229ED9 (Telegram blue), white text, paper plane icon left, 48px, rounded 12px
  - 12px gap
  - **Call button:** Full-width, #4A6741 (accent green), white text, phone icon left, 48px, rounded 12px
  - 24px bottom padding (safe area)
- Handle bar at top of sheet (40px wide, 4px tall, #D0D0D0, centered)

### 4. Apartment List Screen (Feed / "Мои объявления" uses same layout)
- **Top bar:**
  - Title: "Квартиры" or "Мои объявления" — 24px, SemiBold, left-aligned
  - Right: Filter icon (if public list) or "+" icon (if my apartments)
- **List:**
  - Vertical scroll
  - Each card: Horizontal layout (image left, info right)
  - Card height: ~120px
  - Card background: white, rounded 16px, subtle shadow
  - Gap between cards: 12px
  - **Photo:** Left side, 120x120px, rounded left corners (16px), cover fit
  - **Info (right side):** Padding 12px
    - Price: 18px, Bold, #1A1A1A — first line
    - Rooms: 13px, Regular, #8A8A8A — "3 комнаты"
    - Address/description: 13px, Regular, #8A8A8A — one line, ellipsis overflow
    - Status badge (only in "Мои объявления"): Small pill, top-right of card
      - ACTIVE: sage green background, dark text
      - SOLD: muted red background, white text
  - **Swipe actions (Мои объявления only):**
    - Swipe left: "Редактировать" (blue), "Удалить" (red)
    - Or: Tap card → edit screen

### 5. Auth Screen (Register / Login)
- **Background:** #F5F3EF
- **Center layout:**
  - Nawkvar logo at top, 64px
  - 32px gap
  - Title: "Вход" or "Регистрация" — 28px, SemiBold
  - 24px gap
  - **Phone input:** Full-width, white background, rounded 12px, 52px height, prefix "+998"
  - **Password input:** Same style, eye toggle icon right
  - **Telegram input (register only):** Same style, "@" prefix, label "Telegram (необязательно)"
  - 16px gap
  - **Submit button:** Full-width, dark (#2C2C2C), white text, 52px, rounded 12px
  - 12px gap
  - Toggle text: "Нет аккаунта? Регистрация" / "Уже есть аккаунт? Вход" — 14px, #4A6741, tappable

### 6. Create/Edit Apartment Screen
- **Top bar:** "Новое объявление" or "Редактирование" — back arrow left
- **Scrollable form, background #F5F3EF:**
  - **Photo upload area:**
    - Horizontal scroll of photo thumbnails (80x80px, rounded 12px)
    - Last item: "+" dashed border square to add photo
    - Each photo has small "x" delete button (top-right corner)
  - **Fields (white background, rounded 12px, 52px height each):**
    - Цена (number keyboard)
    - Комнаты (number keyboard)
    - Описание (multiline, 120px height)
  - **Location picker:**
    - Small map preview (200px height, rounded 16px)
    - Draggable pin in center
    - Text below: "Переместите карту для выбора локации"
  - **Submit button:** "Опубликовать" — full-width, dark, white text, 52px, rounded 12px
  - 24px bottom padding

### 7. Profile/Cabinet Screen
- **Top bar:** "Кабинет" — left aligned
- **User info card:**
  - White card, rounded 16px
  - Phone number: 16px, SemiBold
  - Telegram: 14px, #8A8A8A
- **"Мои объявления" section:**
  - Same card layout as List Screen (screen 4)
  - "Добавить объявление" button at bottom — outlined style, dark border, dark text, rounded 12px

## Navigation
- **Bottom tab bar:** 3 tabs, minimal icons (no labels, or small labels)
  - Map (home icon or map pin) — active = sage green fill
  - List (grid/list icon) — browse all apartments
  - Profile (person icon) — cabinet
- Tab bar: White background, top border 1px #E5E5E5, 56px height
- Active icon: #4A6741, Inactive: #8A8A8A

## Spacing System
- Base unit: 4px
- Common spacings: 8, 12, 16, 20, 24, 32px
- Screen horizontal padding: 20px
- Card internal padding: 12-16px

## Iconography
- Style: Outlined, 1.5px stroke, rounded caps
- Size: 24px default, 20px in compact areas
- Color: inherits text color
