# Color tokens — full reference

Semantic layer only. Each token resolves to a primitive value defined in `primitives.md` — exact mappings aren't locked yet (see SKILL.md "what's still open").

## Text (`text-*`)

| Token | Notes |
|---|---|
| `text` | default body text |
| `text-subtle` | |
| `text-subtlest` | |
| `text-disabled` | |
| `text-inverse` | |
| `text-selected` | |
| `text-brand` | |
| `text-danger` | |
| `text-warning` | |
| `text-warning-inverse` | the only semantic role with an inverse variant — warning's bold background needs dark text instead of white |
| `text-success` | |
| `text-information` | |
| `text-accent-[color]` | `[color]` is one of the 10 accent hues — see primitives.md |
| `text-accent-[color]-bold` | modifier order: color, then bold |

No `-bold` variant exists for `danger`/`warning`/`success`/`information` — those are flat, single-tone. Bold only applies to accent colors.

## Icon (`icon-*`)

| Token | Notes |
|---|---|
| `icon` | |
| `icon-subtle` | |
| `icon-subtlest` | |
| `icon-disabled` | |
| `icon-inverse` | |
| `icon-selected` | |
| `icon-brand` | |
| `icon-danger` | |
| `icon-warning` | |
| `icon-warning-inverse` | same single exception as text |
| `icon-success` | |
| `icon-information` | |

No accent-color variants for icon get a `-bold` modifier (text accents do, icon accents don't). No dedicated hover/pressed tokens for icons — use a neutral background change to indicate interaction state instead.

## Border (`border-*`)

| Token | Notes |
|---|---|
| `border` | default divider/outline color |
| `border-bold` | |
| `border-input` | |
| `border-disabled` | |
| `border-focused` | pair with a border-width token for the focus ring, see primitives.md |
| `border-inverse` | |
| `border-danger` | |
| `border-warning` | |
| `border-success` | |
| `border-information` | |
| `border-selected` | |
| `border-brand` | |
| `border-accent-[color]` | |

Border has no `subtle`/`subtlest` emphasis gradient — just `border` and `border-bold`. Don't add intermediate tiers here even though text and icon have them. No `-bold` variant for border accent colors.

## Link

| Token | Notes |
|---|---|
| `link` | |
| `link-hover` | project-specific addition, not in stock ADS |
| `link-pressed` | |
| `link-visited` | |
| `link-visited-pressed` | |

## Background (`bg-*`)

| Group | Tokens |
|---|---|
| Neutral | `bg-neutral`, `bg-neutral-hovered`, `bg-neutral-pressed` |
| Neutral subtle | `bg-neutral-subtle`, `bg-neutral-subtle-hovered`, `bg-neutral-subtle-pressed` |
| Neutral bold | `bg-neutral-bold`, `bg-neutral-bold-hovered`, `bg-neutral-bold-pressed` |
| Selected | `bg-selected`, `bg-selected-hovered`, `bg-selected-pressed` |
| Selected bold | `bg-selected-bold`, `bg-selected-bold-hovered`, `bg-selected-bold-pressed` |
| Disabled | `bg-disabled` (no hover/pressed — not interactive) |
| Inverse | `bg-inverse-subtle`, `bg-inverse-subtle-hovered`, `bg-inverse-subtle-pressed` |
| Input | `bg-input`, `bg-input-hovered`, `bg-input-pressed` |
| Danger | `bg-danger` / `bg-danger-bold`, each with hovered/pressed |
| Warning | `bg-warning` / `bg-warning-bold`, each with hovered/pressed |
| Success | `bg-success` / `bg-success-bold`, each with hovered/pressed |
| Information | `bg-information` / `bg-information-bold`, each with hovered/pressed |
| Brand | `bg-brand-subtlest`, `bg-brand-bold`, `bg-brand-boldest`, each with hovered/pressed — a 3-tier shape, different from the semantic roles above |
| Accent (×10 colors) | `bg-accent-[color]-subtlest`, `-subtler`, `-subtle`, `-bolder`, each with hovered/pressed |

Semantic backgrounds (danger/warning/success/information) are a 2-tier shape (subtle default + bold) — don't add a middle "secondary" tier. Discovery is intentionally not part of this system; don't add `bg-discovery`.