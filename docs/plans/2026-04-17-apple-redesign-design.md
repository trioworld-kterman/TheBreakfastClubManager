# Apple-Influenced Redesign — The Bread Board

**Date:** 2026-04-17
**Approach:** Apple-influenced hybrid — adopt Apple's typography system, card surfaces, and spacing discipline while keeping amber as the brand accent and the existing layout structure.

## Decisions

- Apple Blue (`#0071e3`) is NOT adopted — amber stays as the sole accent
- Emojis removed from headings — purely typographic
- Layout structure (12-col grid, two panels) unchanged
- No dark sections — single light surface throughout

---

## 1. Color & Surface

| Element | Value |
|---|---|
| Page background | `#f5f5f7` |
| Card background | `#ffffff` |
| Card borders | removed |
| Card shadow | `rgba(0,0,0,0.22) 3px 5px 30px 0px` (hover/elevated only) |
| Primary text | `#1d1d1f` |
| Secondary text | `rgba(0,0,0,0.48)` |
| Dividers | `rgba(0,0,0,0.06)` |
| Amber accent | unchanged (buttons, checkmarks, today highlight) |

---

## 2. Typography

Font stack — SF Pro with Helvetica Neue / Arial fallbacks:
- Display: `"SF Pro Display", "Helvetica Neue", Arial, sans-serif` (20px+)
- Body: `"SF Pro Text", "Helvetica Neue", Arial, sans-serif` (below 20px)

| Role | Size | Weight | Line-height | Letter-spacing |
|---|---|---|---|---|
| App title / date numbers | 56px | 600 | 1.07 | -0.28px |
| Section headings | 28–40px | 600 | 1.10 | normal |
| Card titles | 21px | 700 | 1.19 | 0.231px |
| Body | 17px | 400 | 1.47 | -0.374px |
| Body emphasis / employee names | 17px | 600 | 1.24 | -0.374px |
| Caption / labels | 14px | 400 | 1.29 | -0.224px |
| Caption bold | 14px | 600 | 1.29 | -0.224px |

Uppercase tracking labels (`tracking-[0.24em]`) replaced with Apple Caption style — no forced uppercase.

---

## 3. Components

| Component | New styling |
|---|---|
| Primary buttons | 8px radius, SF Pro Text 17px weight 400 |
| Input fields | `rounded-[11px]`, border `3px solid rgba(0,0,0,0.04)`, focus ring amber |
| Employee list items | no border, hover shadow `rgba(0,0,0,0.22) 3px 5px 30px`, `rounded-lg` (8px) |
| Panel cards | `rounded-[12px]` (down from 2.5–3rem) |
| Schedule section card | `rounded-[12px]` |
| Synkroniseret badge | `rounded-[5px]` |
| Today accent bar | `border-l-4 border-l-amber-700` (down from 12px) |
| Emojis in headings | removed |

---

## 4. Layout & Spacing

| Element | New value |
|---|---|
| Page padding | `px-6 py-12 md:py-16` |
| Header margin | `mb-12` |
| Grid gap | `gap-8` |
| Schedule row padding | `p-8` |
| Team panel padding | `p-8` uniform |
| Schedule header | `px-8 py-7` |
| Employee list item | `p-4` |
| Empty state border | `border border-dashed border-[rgba(0,0,0,0.1)]` |

---

## Files to change

- `index.css` — font stack, body background, CSS custom properties
- `components/Dashboard.tsx` — all className updates
- `components/LoginView.tsx` — all className updates
