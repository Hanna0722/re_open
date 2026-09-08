## Overview

Clean, modern Korean e-commerce platform with a bold and energetic personality. The design feels fresh and dynamic with its rose red accent color, while maintaining high readability and mobile-first usability. The overall tone is professional yet vibrant, suitable for a broad consumer audience.

Mobile-first responsive design with generous spacing (20px, 15px, 12px system). Content is organized in clear sections with consistent padding. The layout uses a single-column approach optimized for mobile viewing, with clear visual hierarchy through typography and color contrast.

Uses a 4px base grid with scale: 1, 2, 3, 4, 5, 6, 8, 10.

## Colors
- **Rose Red** (#E8385A): Brand accent, primary actions, CTA buttons, badges — main brand color
- **Rose Red Hover** (#C42F4C): Hover state for primary actions
- **Navy** (#1A3C6E): Secondary text emphasis, channel navigation links
- **Amber** (#F5A623): Grade badges, highlight accents
- **Green** (#3AAD4E): Success states, positive indicators
- **Primary Text** (#1A1A2E): Primary text content, headings
- **Secondary Text** (#666680): Secondary text, descriptions, labels
- **Muted Text** (#999BAA): Placeholder, disabled, hint text
- **Background White** (#ffffff): Main background, cards, content areas
- **Background Gray Light** (#F5F7FA): Section backgrounds, subtle dividers
- **Border Gray** (#E0E4EB): Card borders, input borders, dividers
- **Notice Bar** (#F1F3F5): Top notice bar background

## Typography

### Font tokens (single source of truth)

Every page defines these two custom properties at the top of its first
`<style>` block, and `bb-common.js` / `bb-common-mobile.js` inject the same
`:root` declaration as a backstop. All `font-family` declarations in page
CSS reference the tokens — never a literal stack.

```css
:root{
  --font-sans: Pretendard, 'Apple SD Gothic Neo', 'Helvetica Neue', 'Malgun Gothic', '맑은 고딕', sans-serif;
  --font-num:  Roboto, var(--font-sans);
}
body{ font-family: var(--font-sans); }
```

- **`--font-sans`** — headlines, body, labels, buttons, everything textual (Korean + Latin).
- **`--font-num`** — numerals only: prices, amounts, counts, phone numbers, dates. Roboto gives even tabular digits; it falls back to `--font-sans` so Korean characters in the same element still render in Pretendard.
- Components that inherit correctly use `font-family: inherit` (unchanged).
- Icon fonts (`"Font Awesome …"`) are exempt.

### Loading

- Pretendard: `<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css">` (never the Google Fonts `css2?family=Pretendard` URL — Google Fonts does not serve Pretendard).
- Roboto: Google Fonts (`family=Roboto:wght@400;500;700`).

### Weight & spacing

Weight hierarchy: **400** body · **600** interactive elements · **700** headings and emphasis (avoid other weights). Font sizes run 10px (micro-copy) to 14px (primary content); apply negative letter-spacing (-0.22px to -0.36px) to text below 12px. Line heights stay tight, close to the font size, for compact mobile layouts.

## Elevation

The design uses minimal shadows and relies primarily on subtle background color changes and rounded corners to create depth. Elevation is achieved through color contrast rather than dramatic shadow effects, maintaining a clean, flat-adjacent aesthetic with gentle dimensionality.

## Components
- **Navigation Bar**: White background header with rose red accent (search button, active states, badges). Logo on the left, search bar center, utility icons right.
- **Hero Section**: Large promotional banner with Korean text, illustration, and call-to-action elements
- **Card Components**: Rounded corner cards (12px radius) with subtle shadows for content organization
- **Button System**: Consistent button styling with rose red as primary and navy as secondary, 12px rounded corners
- **Typography Hierarchy**: Clear text hierarchy using Pretendard font with consistent weight and spacing patterns

## Do's and Don'ts
- Do use rose red (#E8385A) as the primary brand accent for buttons, active states, and key highlights
- Do maintain consistent 12px border radius for primary interactive elements
- Do use Pretendard font family exclusively for brand consistency
- Don't use font weights other than 400, 600, and 700 to maintain hierarchy clarity
- Do apply negative letter-spacing to text smaller than 12px for better readability
- Don't use heavy shadows - rely on color contrast and subtle backgrounds for depth
- Do maintain generous spacing (minimum 8px) between interactive elements for mobile usability
- Don't mix the rose red and navy primary colors in the same interactive element
- Do keep the navigation bar background white (#ffffff) with rose red used only for accents
