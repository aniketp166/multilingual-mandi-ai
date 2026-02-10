# Implementation Plan: UI Refinement & Design System Alignment

## Objective
Harmonize the "Multilingual Mandi" UI with a premium, glassmorphic aesthetic while ensuring all styling is driven by central CSS variables. Eliminate hardcoded colors and fonts throughout the codebase.

## Design Principles
- **Aesthetic**: Premium Indian marketplace with glassmorphims, hierarchy, and smooth animations.
- **Typography**: 'Outfit' for headings/display, 'Inter' for body.
- **Color Palette**: Emerald green (Primary), Neon Saffron (Secondary/Accent), and Neutral grays.
- **Variable-Driven**: Every color, font, spacing, and transition must map back to `globals.css` via Tailwind config.

## Architecture
1. **Design System**: `src/styles/globals.css` (Already implemented with CSS variables).
2. **Tailwind Mapping**: `tailwind.config.js` mapping theme keys to `var(--...)` (Already implemented).
3. **Component Refactoring**: Individual components using Tailwind classes defined in the config.

## Implementation Steps
### 1. Foundation Cleanup (Done)
- [x] Define comprehensive variables in `globals.css`.
- [x] Map Tailwind config to these variables.

### 2. Core Layout & Navigation (In Progress)
- [x] Refactor `Navbar.tsx` (Use variables, Lucide icons, premium typography).
- [ ] Refactor `Layout.tsx` (Ensure consistent background and spacing).

### 3. Key Pages
- [x] Refactor `Dashboard.tsx` (Full logic restoration with new UI).
- [ ] Refactor `Buyer.tsx` (Marketplace grid, search bar refinement).
- [ ] Refactor `index.tsx` (Landing page hero, features section).

### 4. Shared Components
- [ ] Refactor `ProductCard.tsx` (Update to use variables and Lucide).
- [ ] Refactor `NegotiationChat.tsx` (Modern chat bubble design).
- [ ] Refactor `AddProductModal.tsx` & `PriceSuggestionModal.tsx`.

## Validation
- [ ] Run `npm run lint` and fix all errors.
- [ ] Visual audit of all pages.
- [ ] Check dark mode support (variables should switch values).
