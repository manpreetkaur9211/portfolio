# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run dev        # Start dev server (Vite)
npm run build      # Production build
npm run build:dev  # Dev mode build
npm run lint       # ESLint
npm run preview    # Preview production build
```

## Architecture

Single-page portfolio website. All content is rendered on one page (`/`) via `src/pages/Index.tsx`, which composes section components in order: `Navbar → Hero → About → Skills → Experience → Projects → SelfLearning → SelfProjects → Contact → Footer`.

### Data layer

All portfolio content lives in two constants files — **do not hardcode content in components**:
- [src/constants/userData.ts](src/constants/userData.ts) — personal info, experience, projects, skills, contact details
- [src/constants/sectionData.ts](src/constants/sectionData.ts) — section titles, subtitles, and UI labels

### UI components

`src/components/ui/` contains shadcn/ui primitives (Radix UI based) — these are not hand-authored and should generally not be modified. Portfolio-specific section components live directly in `src/components/`.

### Styling

Custom Tailwind color palette uses `portfolio-blue` (`#1a365d`), `portfolio-light-blue` (`#2b4c7e`), `portfolio-accent` (`#4299e1`), etc. These are defined in [tailwind.config.ts](tailwind.config.ts). Scroll-triggered animations use the `.animate-on-scroll` / `.is-visible` CSS class pattern driven by a scroll listener in `Index.tsx`.

### Contact form

Uses EmailJS (`@emailjs/browser`). Requires env vars:
- `VITE_EMAILJS_SERVICE_ID`
- `VITE_EMAILJS_TEMPLATE_ID`
- `VITE_EMAILJS_PUBLIC_KEY`

### Path aliases

`@/` maps to `src/` (configured in `tsconfig.app.json`).
