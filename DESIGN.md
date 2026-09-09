## Overview

Clean, modern Korean e-commerce platform with a bold and energetic personality. The design feels fresh and dynamic with its rose red accent color, while maintaining high readability and mobile-first usability. The overall tone is professional yet vibrant, suitable for a broad consumer audience.

Two delivery tracks share one visual language:

- **Web** pages are fixed-width desktop shells — content column **1140px** (`--page-w` / `--bb-page-w`), page floored at `min-width: 1200px` so the column always keeps ≥30px gutters — that collapse to a mobile layout via one media query.
- **Mobile** pages are separate `.phone` fragments (`max-width: 390px`).

Content is organized in clear sections with consistent padding and a single-column reading order.

This document is split into three parts: **Common** (one value, identical on both tracks), **Web**, and **Mobile**. When a rule is not repeated in a platform section, the Common value applies.

---

# Common

Applies to both web and mobile. Values here are defined once — never redefine per page or per platform.

## Colors

### Token naming

The **hex value is the contract, not the variable name.** A page (or the live site) may expose the same color under a different alias — `--color-rose`, `--col_white`, `--mr-rose`, `--red` — and that is fine as long as the value matches this palette. Do not introduce a *new hex* just because it arrives under a new name. Preferred names in this repo: `--rose` / `--brand` / `--blue` (accent, one value), `--navy`, `--amber`, `--green`, `--tp` / `--ts` / `--tm` (text), `--border` (also seen as `--line` / `--line-soft`), `--bg`.

- **Rose Red** (#E8385A): brand accent, primary actions, CTA buttons, badges, active states. Aliased in `:root` as `--rose` / `--brand` / `--blue` (and `--red` on mobile) — all the same value.
- **Rose Red Hover** (#C42F4C): hover / pressed state for primary actions (`--rose-h` / `--brand-dark`)
- **Navy** (#1A3C6E): CS phone number, "사업자 전환" affordance, a few dark accents (`--navy`)
- **Amber** (#F5A623): 배송대기 status, warning callouts (left border on a `#FFF8EC` panel), the avatar gradient stop (`--amber`)
- **Green** (#3AAD4E): success states, positive indicators (`--green`)
- **Primary Text** (#333): body copy — the default text color
- **Strong Text** (#1A1A2E / #111827): headings and high-emphasis text (`--tp`). Collapse near-blacks like #151B29 to this.
- **Secondary Text** (#666680): descriptions, supporting labels (`--ts`)
- **Muted Text** (#999BAA): placeholder, disabled, hint text, chevrons, 10–11px meta labels (`--tm`). **One muted grey only** — collapse any near-neighbours (#9AA3B2, #A8B0BD, #A4ACB8) to this.
- **Background White** (#ffffff): Main background, cards, content areas
- **Background Gray Light** (#F5F7FA): Section backgrounds, subtle dividers, row hover (not #F9FAFB)
- **Border Gray** (#E0E4EB): Card borders, input borders, dividers — **the single border color**. Collapse #E5E7EB / #DDE3EB / #D9E0E9 / #EEEEEE to this.
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

### Status colors (거래 현황)

The trade-status board and order-card chips use two accent colors, nothing else:

- **결제대기** (1·2차 결제대기): `#E8385A` (`var(--rose)` / `var(--brand)`)
- **배송대기** (현지도착·배송대기, shipping-wait): `#F5A623` (`var(--amber)`)

All other statuses (완료, 취소/반품, 국제배송 등) use neutral text (`#111` / `#1A1A2E` / muted grey).

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

Applied to recurring components:

- **Menu / list rows** (user-menu drawer, category list, `.user-menu-item`): **600**. Never 800 / 900 for a menu label.
- **User name, tier / VIP chips** (`.user-name-strong`, `.user-vip-chip`): **500**.
- **Numeric emphasis** — status counts (`.user-status-grid strong`), amounts, mileage / 예치금: **600–700**, on `var(--font-num)`.

Apply negative letter-spacing (-0.22px to -0.36px) to text below 12px. Line heights stay tight, close to the font size, for compact layouts.

### Title scale

Titles do **not** share one size across web and mobile — each platform keeps its own scale.

| Role | Web | Mobile |
|---|---|---|
| Home section title (`.sec-title` — "실시간 베스트" etc.) | `18px / 700` | `15px / 700` |
| Product / item title in agent flows (`.item-title`) | `19px / 700`, `var(--tp)`, `line-height 1.5`, `margin-bottom 5px` | — |
| Auction detail `h1` (`web_auction .item-title`) | `20px / 900`, `#111`, `margin 0`, `line-height 1.5` | — |
| Mobile item title (`.m-title-ko`) | — | `15px / 700`, `var(--tp)`, `line-height 1.5`, `margin-bottom 4px` |
| Source-language name under the title (`.item-title-jp` / `.m-title-jp`) | `12px`, `var(--tm)`, `line-height 1.5`, `margin-bottom 14px` | `11px`, `var(--tm)`, `line-height 1.5` |

## Spacing

Spacing follows a 4px base grid — common steps 4 / 8 / 12 / 16 / 20 / 24px.

## Corner radius

| Token | Value | Use |
|---|---|---|
| `--r-btn` | **12px** | buttons and button-shaped controls (primary interactive) |
| `--r-sm` | **5px** | chips, tiles, dense UI — the 나의 거래 현황 grid, filter pills, small cards |
| `--r-md` | 8px | mid-size cards |
| `--r-lg` | 12px | large cards / panels |
| `--r-pill` | 999px | fully rounded pills, avatars, progress tracks |

## Buttons

Rose red primary / white-outline secondary, `--r-btn` (12px) radius. Heights are the **same on web and mobile**: `--btn-h-sm 36px` · `--btn-h-md 44px` · `--btn-h-lg 48px`.

## Elevation

Three base shadows, one exact value each — do not hand-tune the blur / spread / color:

| Role | Value |
|---|---|
| Hairline (sticky header, thin separators) | `0 1px 0 rgba(32,36,43,.04)` |
| Modal / centered dialog / popover panel | `0 20px 60px rgba(0,0,0,.18)` |
| Bottom sheet (mobile, sheet slides up from bottom) | `0 -2px 10px rgba(0,0,0,.08)` |

### Sanctioned exceptions

These are **rings, not drop shadows** — a 1–4px `0 0 0` spread that traces an element. Allowed:

| Role | Value |
|---|---|
| Focus ring (input / selectable card `:focus`, `:hover`) | `0 0 0 2px`–`0 0 0 4px` of a tinted accent — `rgba(232,56,90,.08–.20)` (rose), `rgba(26,60,110,.12)` (navy), `rgba(245,166,35,.20)` (amber) |
| Selected / active card or option | `0 0 0 2px var(--rose)` / `0 0 0 2px rgba(232,56,90,.12)` |
| Brand-emphasis affordance (active store chip, active thumb) | `0 0 0 3px rgba(232,56,90,.14)` |
| Flag / tiny thumbnail inner hairline | `inset 0 0 0 1px rgba(0,0,0,.08)` |

Anything else — card-hover drop shadows, receipt paper, colored glows, `0 4px 16px …` and friends — is **not** sanctioned. Use `border-color: var(--rose)` for hover feedback instead.

## Cards

White surface, `--r-md` / `--r-lg` radius, hairline border, no drop shadow. Hover = `border-color: var(--rose)` (optionally `color` shift), never a shadow.

---

# Web

## Layout shell

- Content column **1140px** wide, centered (`--page-w` / `--bb-page-w`; per-page sections commonly use `max-width: 1140px; margin: 0 auto` or `--stage-left: max(16px, calc((100vw - 1140px) / 2))`).
- `body { min-width: 1200px }` — the page never narrows below this; it scrolls horizontally instead of reflowing, so the 1140 column always has ≥30px gutters.
- One media query collapses the desktop shell to the mobile layout.

## Navigation bar

White header, rose red only for the search button / active states / badges. Injected by `bb-common.js` — logo left, search center, utility icons right.

## Shared shell (`bb-common.js`)

Header, left category drawer + right user-menu drawer, notice-bar handling, product-image fallbacks. `bb-trade-status-mobile.js` + `.css` render the shared "나의 거래 현황" board.

---

# Mobile

## Layout shell

- Separate `.phone` fragments, `max-width: 390px`.
- Single-column reading order, compact vertical rhythm.

## Mobile-only UI

- Phone status bar, bottom sheets (shadow `0 -2px 10px rgba(0,0,0,.08)`), drawers.
- `--red` is an extra alias for the brand rose on mobile pages.
- Maintain generous spacing (minimum 8px) between interactive elements for touch usability.

## Shared shell (`bb-common-mobile.js`)

Header, category + user-menu drawers, notice-bar handling, mobile phone status bar, product-image fallbacks.

---

# Do's and Don'ts

- Do use rose red (#E8385A) as the primary brand accent for buttons, active states, and key highlights
- Do use `--r-btn` (12px) for buttons and `--r-sm` (5px) for chips / dense tiles — don't hand-pick radii
- Do drive every `font-family` from `var(--font-sans)` / `var(--font-num)` — never write a literal font stack in page CSS
- Do keep numerals (prices, counts, phone) on `var(--font-num)` and everything else on `var(--font-sans)`
- Do drive text color from `var(--tp)` / `var(--ts)` / `var(--tm)`; don't redefine them per page
- Do reserve weights 800 / 900 for page-level titles; use 400 / 500 / 600 / 700 elsewhere
- Do apply negative letter-spacing to text smaller than 12px for better readability
- Don't use heavy shadows — rely on color contrast and subtle backgrounds for depth
- Do maintain generous spacing (minimum 8px) between interactive elements for mobile usability
- Don't mix the rose red and navy primary colors in the same interactive element
- Do keep the navigation bar background white (#ffffff) with rose red used only for accents
