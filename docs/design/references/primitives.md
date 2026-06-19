# Primitives — full reference

## Color ramps

Four purpose ramps are sourced from Tailwind CSS, one is a custom blend. Brand is undecided — don't invent a value for it.

| Step | Danger (rose) | Success (emerald) | Warning (amber) | Information (sky) | Neutral (zinc/gray blend) |
|---|---|---|---|---|---|
| 50 | ![#fff1f2](https://placehold.co/15x15/fff1f2/fff1f2.png) `#fff1f2` | #ecfdf5 | #fffbeb | #f0f9ff | #fafafb |
| 100 | #ffe4e6 | #d1fae5 | #fef3c7 | #e0f2fe | #f4f4f6 |
| 200 | #fecdd3 | #a7f3d0 | #fde68a | #bae6fd | #e5e6e9 |
| 300 | #fda4af | #6ee7b7 | #fcd34d | #7dd3fc | #d3d5da |
| 400 | #fb7185 | #34d399 | #fbbf24 | #38bdf8 | #9fa2ad |
| 500 | #f43f5e | #10b981 | #f59e0b | #0ea5e9 | #6e727d |
| 600 | #e11d48 | #059669 | #d97706 | #0284c7 | #4f545f |
| 700 | #be123c | #047857 | #b45309 | #0369a1 | #3b404c |
| 800 | #9f1239 | #065f46 | #92400e | #075985 | #232831 |
| 900 | #881337 | #064e3b | #78350f | #0c4a6e | #151821 |
| 950 | #4c0519 | #022c22 | #451a03 | #082f49 | #06080f |

The neutral ramp is a per-channel average of Tailwind's zinc and gray at every step, not a perceptual blend — treat it as a reasonable starting point rather than a final answer; worth a visual check before it's locked in.

Not yet defined: the brand ramp, and the 10 accent hues (lime, red, orange, yellow, green, teal, blue, purple, magenta, gray) that the `*-accent-[color]` tokens in color-tokens.md point to.

Not yet defined: which exact step in each ramp each semantic token resolves to, for light and dark themes (e.g. `text-danger` → rose-700 in light, rose-400 in dark — these are illustrative, not decided). This requires checking contrast ratios per pairing before locking in, since picking the wrong step can fail WCAG contrast requirements.

## Spacing

An 8px-rooted scale: 0, 2, 4, 6, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80px. A mirrored negative version of the same scale is useful for pulling elements outside a container's padding.

## Typography

Sizes: 11, 12, 14, 16, 20, 24, 29, 35px.
Line heights: 16, 20, 24, 28, 32, 40px.
Weights: regular (400), medium (500), semibold (600), bold (700).
Separate heading and body font-family tokens; consider a distinct pair reserved for large display/marketing headings, kept apart from the everyday UI font.

## Border radius

2, 4 (default), 8, 12, 16px, plus a circle/pill value for fully-rounded elements.

## Border width

A default (~1px), a zero value, and two heavier weights — one for indicators, one for outlines/focus rings.

## Elevation

Surface tokens for default, raised, overlay, and sunken — each except sunken gets its own hovered/pressed variant. Paired shadow tokens for raised, overlay, and overflow.

## Opacity

Keep this minimal: a `disabled` value (~0.4) and a `loading` value (~0.2). Avoid building out a broader opacity scale than that.

## Motion

Not yet defined. Duration and easing tokens belong here once decided.