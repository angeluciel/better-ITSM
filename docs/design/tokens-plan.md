# Design tokens working plan

## 1. Architecture
This all sits in three tiers, bottom to top:
* Primite Tokens: Raw values. Color ramps, a spacing unit, font sizes. Nobody references these directly in a component
* Semantic Tokens: `text-danger`, `bg-neutral`, `border-input`. These point at primitives and carry meaning.
* Component Tokens: `button-bg-primary`, `input-border-focused`. Point at semantic tokens.

## 2. Semantic Inventory

