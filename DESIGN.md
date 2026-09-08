## Overview

Clean, modern Korean e-commerce platform with a bold and energetic personality. The design feels fresh and dynamic with its rose red accent color, while maintaining high readability and mobile-first usability. The overall tone is professional yet vibrant, suitable for a broad consumer audience.

Two delivery tracks share one visual language: **web** pages are fixed-width desktop shells (`min-width: 1200px`, content column `--page-w: 1140px`) that collapse to a mobile layout via one media query; **mobile** pages are separate `.phone` fragments (`max-width: 390px`). Content is organized in clear sections with consistent padding and a single-column reading order.

Spacing follows a 4px base grid — common steps 4 / 8 / 12 / 16 / 20 / 24px.

## Colors
- **Rose Red** (#E8385A): brand accent, primary actions, CTA buttons, badges, active states. Aliased in `:root` as `--rose` / `--brand` / `--blue` (and `--red` on mobile) — all the same value.
- **Rose Red Hover** (#C42F4C): hover / pressed state for primary actions (`--rose-h` / `--brand-dark`)
- **Navy** (#1A3C6E): CS phone number, "사업자 전환" affordance, a few dark accents (`--navy`)
- **Amber** (#F5A623): 배송대기 status, warning callouts (left border on a `#FFF8EC` panel), the avatar gradient stop (`--amber`)
- **Green** (#3AAD4E): success states, positive indicators (`--green`)
- **Primary Text** (#333): body copy — the default text color
- **Strong Text** (#1A1A2E / #111827): headings and high-emphasis text (`--tp`)
- **Secondary Text** (#666680): descriptions, supporting labels (`--ts`)
- **Muted Text** (#999BAA): placeholder, disabled, hint text (`--tm`)
- **Background White** (#ffffff): Main background, cards, content areas
- **Background Gray Light** (#F5F7FA): Section backgrounds, subtle dividers
- **Border Gray** (#E0E4EB): Card borders, input borders, dividers
- **Notice Bar** (#F1F3F5): Top notice bar background

### Grade colors

Membership tiers use a dedicated 4-color scale, exposed as `:root` tokens
(`bb-common.js` / `bb-common-mobile.js` inject them; grade pages also
declare them inline). Used for the tier name, benefit values, tab/badge
accents and the current-grade highlight.

```css
:root{
  --grade-std: #7A828C;  /* Standard — silver  */
  --grade-pre: #28705F;  /* Premium  — teal    */
  --grade-vip: #174F8A;  /* VIP      — blue     */
  --grade-prs: #E8385A;  /* Prestige — rose (== brand) */
}
```

## Typography

### Font tokens (single source of truth)

Every page defines these two custom properties at the top of its first
`<style>` block, and `bb-common.js` / `bb-common-mobile.js` inject the same
`:root` declaration as a backstop. All `font-family` declarations in page
CSS reference the tokens — never a literal stack.

```css
:root{
  --font-sans: 'Pretendard', 'Malgun Gothic', '돋움', 'Dotum', Arial, sans-serif;
  --font-num:  Roboto, var(--font-sans);
  --tp: #1A1A2E;   /* strong text  */
  --ts: #666680;   /* secondary    */
  --tm: #999BAA;   /* muted        */
}
body{ font: 400 14px/1 var(--font-sans); }
```

- **`--font-sans`** — headlines, body, labels, buttons, everything textual (Korean + Latin).
- **`--font-num`** — numerals only: prices, amounts, counts, phone numbers, dates. Roboto gives even tabular digits; it falls back to `--font-sans` so Korean characters in the same element still render in Pretendard.
- **`--tp` / `--ts` / `--tm`** — the text-color tokens, defined once in the shared `:root` (no per-page redefinition).
- Components that inherit correctly use `font-family: inherit` (unchanged).
- Icon fonts (`"Font Awesome …"`) are exempt.

### Loading

- Pretendard: `<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css">` (never the Google Fonts `css2?family=Pretendard` URL — Google Fonts does not serve Pretendard).
- Roboto: Google Fonts (`family=Roboto:wght@400;500;700`).

### Weight

- **400** — body copy
- **500** — secondary / supporting text
- **600** — labels, interactive elements, list rows
- **700** — section titles, most headings, emphasis
- **800 / 900** — hero and page-level titles only (e.g. the product `h1` on `web_auction`)

Apply negative letter-spacing (-0.22px to -0.36px) to text below 12px. Line heights stay tight, close to the font size, for compact mobile layouts.

### Title scale

Titles do **not** share one size across web and mobile — each platform keeps its own scale.

| Role | Web | Mobile |
|---|---|---|
| Home section title (`.sec-title` — "실시간 베스트" etc.) | `18px / 700` | `15px / 700` |
| Product / item title in agent flows (`.item-title`) | `19px / 700`, `var(--tp)`, `line-height 1.5`, `margin-bottom 5px` | — |
| Auction detail `h1` (`web_auction .item-title`) | `20px / 900`, `#111`, `margin 0`, `line-height 1.5` | — |
| Mobile item title (`.m-title-ko`) | — | `15px / 700`, `var(--tp)`, `line-height 1.5`, `margin-bottom 4px` |
| Source-language name under the title (`.item-title-jp` / `.m-title-jp`) | `12px`, `var(--tm)`, `line-height 1.5`, `margin-bottom 14px` | `11px`, `var(--tm)`, `line-height 1.5` |

### Status colors (거래 현황)

The trade-status board and order-card chips use two accent colors, nothing else:

- **결제대기** (1·2차 결제대기): `#E8385A` (`var(--rose)` / `var(--brand)`)
- **배송대기** (현지도착·배송대기, shipping-wait): `#F5A623` (`var(--amber)`)

All other statuses (완료, 취소/반품, 국제배송 등) use neutral text (`#111` / `#1A1A2E` / muted grey).

## Corner radius

| Token | Value | Use |
|---|---|---|
| `--r-btn` | **12px** | buttons and button-shaped controls (primary interactive) |
| `--r-sm` | **5px** | chips, tiles, dense UI — the 나의 거래 현황 grid, filter pills, small cards |
| `--r-md` | 8px | mid-size cards |
| `--r-lg` | 12px | large cards / panels |
| `--r-pill` | 999px | fully rounded pills, avatars, progress tracks |

## Components
- **Navigation Bar**: white header, rose red only for the search button / active states / badges. Injected by `bb-common(.js)` — logo left, search center, utility icons right.
- **Shared shell** (`bb-common.js` / `bb-common-mobile.js`): header, left category drawer + right user-menu drawer, notice-bar handling, mobile phone status bar, product-image fallbacks. `bb-trade-status-mobile.js` + `.css` render the shared "나의 거래 현황" board.
- **Card Components**: white surface, `--r-md`/`--r-lg` radius, hairline border, no heavy shadow
- **Button System**: rose red primary / white-outline secondary, `--r-btn` (12px) radius. Heights: `--btn-h-sm 36px` · `--btn-h-md 44px` · `--btn-h-lg 48px` (same on web and mobile).
- **Elevation**: only three sanctioned shadows — hairline `0 1px 0 rgba(32,36,43,.04)`, modal `0 20px 60px rgba(0,0,0,.18)`, bottom sheet `0 -2px 10px rgba(0,0,0,.08)`. Otherwise lean on color contrast.

## Do's and Don'ts
- Do use rose red (#E8385A) as the primary brand accent for buttons, active states, and key highlights
- Do use `--r-btn` (12px) for buttons and `--r-sm` (5px) for chips / dense tiles — don't hand-pick radii
- Do drive every `font-family` from `var(--font-sans)` / `var(--font-num)` — never write a literal font stack in page CSS
- Do keep numerals (prices, counts, phone) on `var(--font-num)` and everything else on `var(--font-sans)`
- Do drive text color from `var(--tp)` / `var(--ts)` / `var(--tm)`; don't redefine them per page
- Do reserve weights 800 / 900 for page-level titles; use 400 / 500 / 600 / 700 elsewhere
- Do apply negative letter-spacing to text smaller than 12px for better readability
- Don't use heavy shadows - rely on color contrast and subtle backgrounds for depth
- Do maintain generous spacing (minimum 8px) between interactive elements for mobile usability
- Don't mix the rose red and navy primary colors in the same interactive element
- Do keep the navigation bar background white (#ffffff) with rose red used only for accents
