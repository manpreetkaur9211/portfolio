---
name: vite-to-nextjs-migration
description: >
  Expert guide for migrating React Vite applications to Next.js (App Router).
  Use this skill whenever a user mentions migrating from Vite to Next.js, converting
  a Vite React app, or asks about moving to Next.js from any SPA/Vite setup.
  Also trigger when a user shares a Vite project structure and asks for help with
  Next.js routing, rendering strategy (SSR/SSG/ISR/CSR), Server Actions, Route Handlers,
  or React Server Components. This skill covers the full migration lifecycle: project
  analysis, rendering strategy decisions, file-by-file conversion, config setup, and
  a step-by-step checklist. Always use this skill — do not rely on general knowledge —
  whenever Vite-to-Next.js migration is in scope.
---

# Vite → Next.js Migration Skill

## Overview

This skill guides Claude through a structured, opinionated migration of a React + Vite
application to Next.js (App Router). It produces:

1. **A project analysis** — inventory of routes, data fetching patterns, and rendering candidates
2. **A rendering strategy decision** per route/module (SSR / SSG / ISR / CSR)
3. **A data layer decision** per API call (Server Action / Route Handler / REST API kept as-is)
4. **Converted source files** with explanatory comments
5. **A step-by-step migration checklist** the user can follow

---

## Phase 0 — Project Analysis

Before writing any code, analyse the user's project. If they haven't shared files, ask for:
- `package.json`
- `vite.config.ts` / `vite.config.js`
- The `src/` directory tree (or key files: router config, main entry, env files)

### What to look for

| Area | Look for | Implication |
|------|----------|-------------|
| Router | `react-router-dom` version, route definitions | Map to `app/` folder structure |
| Data fetching | `fetch`, `axios`, `react-query`, `swr`, `useEffect` fetches | Decide rendering strategy |
| Auth | `localStorage`, cookies, JWT handling, auth providers | Server vs client handling |
| State | `zustand`, `redux`, `context`, `jotai` | May need `'use client'` wrappers |
| Env vars | `VITE_*` prefix | Rename to `NEXT_PUBLIC_*` (public) or plain (server-only) |
| Images | `<img>` tags, CDN URLs — run `grep -rn "<img" src/` to find all instances | Migrate every hit to `next/image`; collect all external hostnames for `remotePatterns` |
| Fonts | Google Fonts `<link>`, font imports | Migrate to `next/font` |
| Scripts | Third-party `<script>` tags | Migrate to `next/script` |
| CSS | CSS modules, Tailwind, styled-components, CSS-in-JS | Check compatibility |
| Build config | Vite aliases, proxy config | Migrate to `next.config.js` |
| Tests | vitest, jest | Update config |
| TypeScript | `tsconfig.json` paths | Update for Next.js |

### Phase 0 — Mandatory component audit (run before writing the split table)

Before classifying any component as Server vs Client, grep the entire `src/components/`
directory for client-only APIs. Do not assume a component is a Server Component based
on its name or data pattern alone — verify first.

```bash
# Find every component that needs 'use client'
grep -rl "useState\|useEffect\|useRef\|useCallback\|useContext\|window\.\|document\." src/components/
```

Every file returned by this grep needs `'use client'`. Mark ALL matches in the component
split table before proceeding. This step prevents build-time errors from Server Components
that silently use hooks or browser APIs.

---

## Phase 1 — Rendering Strategy Decision

For **each page/route**, classify using this decision tree:

```
Does this page need real-time or user-specific data?
  YES → Does it change on every single request?
          YES → SSR (Server Component + no caching)
          NO  → ISR (revalidate: N seconds) or SSR with short cache
  NO  → Is the content fully static at build time?
          YES → SSG (generateStaticParams + no fetch or fetch with cache:'force-cache')
          NO  → Is it purely interactive / user-driven with no SEO need?
                  YES → CSR ('use client' + useEffect / SWR / React Query)
                  NO  → SSG or ISR depending on update frequency
```

### Rendering Strategy Summary Table (fill in during analysis)

| Route | Current pattern | Recommended strategy | Reason |
|-------|----------------|----------------------|--------|
| `/` | useEffect fetch | SSG or ISR | Marketing/landing, low change rate |
| `/dashboard` | authenticated, live data | SSR or CSR | User-specific |
| `/blog/[slug]` | static markdown | SSG + generateStaticParams | Pure static |
| `/products/[id]` | DB-driven, hourly updates | ISR (revalidate: 3600) | Periodic revalidation |
| `/cart` | client state only | CSR | No SSR benefit |

> See `references/rendering-patterns.md` for full code templates for each strategy.

---

## Phase 2 — Data Layer Decision

For each data call, decide:

```
Is this a form submission / mutation?
  YES → Server Action ('use server' function called from Client Component)
       Exception: if you need streaming response or complex middleware → Route Handler

Is this a data READ only used server-side?
  YES → Inline fetch() inside Server Component (no API route needed)

Is this consumed by a third-party or mobile client?
  YES → Route Handler (app/api/route.ts)

Is this a proxied call hiding secret keys from the browser?
  YES → Route Handler or Server Action

Is this an existing REST API you're keeping?
  YES → Keep as-is, call from Server Component or via Route Handler proxy
```

---

## Phase 3 — Step-by-Step Migration Checklist

Generate this checklist as a Markdown document and present it to the user.
Fill in project-specific details discovered in Phase 0.

> ⚠️ The component split table (Server vs Client) must be populated from the grep
> audit in Phase 0, not from assumptions about component names or data patterns.
> Never mark a component as a Server Component without verifying it contains no
> hooks or browser APIs.

```markdown
# Migration Checklist: [Project Name] — Vite → Next.js

## ✅ Step 1: Bootstrap Next.js project
- [ ] Run: `npx create-next-app@latest [project-name] --typescript --eslint --app --src-dir --import-alias "@/*"`
- [ ] Copy `src/` components, hooks, utils, types into new project
- [ ] Do NOT copy: `vite.config.*`, `index.html`, `src/main.tsx`, `src/App.tsx` (these are replaced)

## ✅ Step 2: Update package.json
- [ ] Remove: `vite`, `@vitejs/plugin-react`, `react-router-dom` (unless needed for gradual migration)
- [ ] Keep: all UI, utility, and data-fetching libraries
- [ ] Add if needed: `next`, `react`, `react-dom` (already added by create-next-app)
- [ ] Run `npm install`

## ✅ Step 3: Environment variables
- [ ] Rename `VITE_*` → `NEXT_PUBLIC_*` for browser-exposed vars
- [ ] Move secret vars (API keys, DB strings) to plain `NEXT_*` or unnamespaced vars (server-only)
- [ ] Update all `import.meta.env.VITE_*` usages → `process.env.NEXT_PUBLIC_*`
- [ ] Create `.env.local` from `.env` / `.env.local` equivalents

## ✅ Step 4: Routing — map react-router → App Router
- [ ] Create `app/` directory (already done by create-next-app)
- [ ] For each `<Route path="X">` create `app/X/page.tsx`
- [ ] For each `<Route path="X/:id">` create `app/X/[id]/page.tsx`
- [ ] Replace `<Link to="...">` → `<Link href="...">` from `next/link`
- [ ] Replace `useNavigate()` → `useRouter()` from `next/navigation` (must be 'use client')
- [ ] Replace `useParams()` → `useParams()` from `next/navigation`
- [ ] Replace `useLocation()` → `usePathname()` + `useSearchParams()` from `next/navigation`
- [ ] Wrap layout in `app/layout.tsx` (replaces `App.tsx` / root layout)
- [ ] Add `app/not-found.tsx` to replace 404 handling

## ✅ Step 5: Apply rendering strategy (per route — see analysis above)
- [ ] SSG: fetch with `cache: 'force-cache'` or no fetch → exports as static by default
- [ ] ISR: `export const revalidate = N` at top of page file
- [ ] SSR: `export const dynamic = 'force-dynamic'` or fetch with `cache: 'no-store'`
- [ ] CSR: add `'use client'` directive at top of component file
- [ ] See `references/rendering-patterns.md` for boilerplate for each

## ✅ Step 6: Convert data fetching
- [ ] Move `useEffect` fetches in page-level components → async Server Component fetch
- [ ] Convert form `onSubmit` API calls → Server Actions where appropriate
- [ ] Create `app/api/*/route.ts` Route Handlers for any public/external API endpoints
- [ ] Remove unnecessary client-side state used only for fetched data (useState + useEffect combos)
- [ ] See `references/data-patterns.md` for Server Action and Route Handler boilerplate

## ✅ Step 7: React Server Components — split components
- [ ] Run this grep to find every component that needs `'use client'`:
      `grep -rl "useState\|useEffect\|useRef\|useCallback\|useContext\|window\.\|document\." src/components/`
      Add `'use client'` as the first line of every file returned — do not rely on guessing.
- [ ] Leave all purely presentational / data-display components as Server Components (no directive)
- [ ] Move auth/session logic to server using `cookies()` from `next/headers`
- [ ] Do NOT import Server Components inside Client Components (only pass as children/props)

## ✅ Step 8: Optimise images
- [ ] Run this grep to find every raw img tag — do not rely on memory of which components use images:
      `grep -rn "<img" src/`
      Replace every result with `<Image>` from `next/image`.
- [ ] For known dimensions use `width` + `height` props
- [ ] For unknown/fluid sizes (e.g. card thumbnails in `aspect-ratio` containers) add `relative` to the parent and use `fill` prop on `<Image>`
- [ ] Collect all external image hostnames from the grep results and add each to `images.remotePatterns` in `next.config.ts`
- [ ] Use `priority` prop on above-the-fold images (hero/banner)

## ✅ Step 9: Optimise fonts
- [ ] Remove Google Fonts `<link>` tags from HTML / layout
- [ ] Import fonts via `next/font/google`: `import { YourFont } from 'next/font/google'`
- [ ] Apply font className to root layout `<html>` tag
- [ ] For local fonts use `next/font/local`

## ✅ Step 10: Optimise third-party scripts
- [ ] Replace bare `<script>` tags in layout → `<Script>` from `next/script`
- [ ] Set appropriate `strategy`: `beforeInteractive` | `afterInteractive` | `lazyOnload`
- [ ] Analytics/tag managers → `strategy="afterInteractive"`
- [ ] Critical polyfills → `strategy="beforeInteractive"`

## ✅ Step 11: Update next.config.js
- [ ] Migrate Vite `resolve.alias` → `webpack.resolve.alias` or `experimental.turbo.resolveAlias`
- [ ] Migrate Vite `server.proxy` → `rewrites()` or Route Handler proxy
- [ ] Set `images.remotePatterns` for all external image hosts
- [ ] Enable `reactStrictMode: true`
- [ ] Add `transpilePackages` for any CJS-only libraries

## ✅ Step 12: Update TypeScript config
- [ ] Replace `vite/client` reference in `tsconfig.json` with `next`
- [ ] Set `"moduleResolution": "bundler"` or `"node16"`
- [ ] Add `"plugins": [{ "name": "next" }]` for Next.js TS plugin
- [ ] Verify path aliases (`@/*`) match `next.config.js`

## ✅ Step 13: Update ESLint
- [ ] Install: `npm install --save-dev eslint-config-next`
- [ ] Update `.eslintrc.json`: `{ "extends": ["next/core-web-vitals", "next/typescript"] }`
- [ ] Run `npx next lint` and fix reported issues
- [ ] Remove `eslint-plugin-react-hooks` if added manually (included in next config)

## ✅ Step 14: Streaming & Suspense
- [ ] Wrap slow data-fetching Server Components in `<Suspense fallback={<Loading />}>`
- [ ] Create `app/*/loading.tsx` files for route-level loading UI (automatic Suspense boundary)
- [ ] Use `<Suspense>` to stream independent data sections on the same page

## ✅ Step 15: Metadata & SEO
- [ ] Remove `react-helmet` / `react-helmet-async`
- [ ] Export `metadata` object from each `page.tsx` / `layout.tsx`
- [ ] For dynamic metadata export `generateMetadata()` async function
- [ ] Add `app/sitemap.ts` and `app/robots.ts` if needed

## ✅ Step 16: Auth migration
- [ ] If using JWT in localStorage → migrate to `httpOnly` cookies, read via `cookies()` in Server Components
- [ ] Consider `next-auth` (Auth.js) for provider-based auth
- [ ] Protect routes using Middleware (`middleware.ts` at project root)

## ✅ Step 17: Testing
- [ ] Update vitest config: add `@vitejs/plugin-react` only if keeping Vitest for unit tests
- [ ] For Next.js-specific tests use Jest with `next/jest` config or Playwright for E2E
- [ ] Run existing test suite; fix broken imports and mocks

## ✅ Step 18: Build & verify
- [ ] Run `npm run build` — fix all type errors and build warnings
- [ ] Run `npm run start` — smoke test all routes
- [ ] Check Network tab: verify SSG pages return HTML, SSR pages return fresh HTML
- [ ] Verify ISR pages revalidate correctly
- [ ] Run Lighthouse — verify Core Web Vitals improvement over Vite SPA baseline
```

---

## Phase 4 — File Conversion Templates

When rewriting individual files, follow these patterns.

### Page file (SSR example)

```tsx
// app/products/[id]/page.tsx
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ id: string }>
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params
  const product = await fetch(`https://api.example.com/products/${id}`, {
    cache: 'no-store', // SSR — remove for SSG, add revalidate for ISR
  }).then(r => r.json())

  if (!product) notFound()

  return <div>{product.name}</div>
}
```

### Page file (ISR example)

```tsx
// app/blog/[slug]/page.tsx
export const revalidate = 3600 // revalidate every hour

export async function generateStaticParams() {
  const posts = await fetch('https://api.example.com/posts').then(r => r.json())
  return posts.map((p: { slug: string }) => ({ slug: p.slug }))
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await fetch(`https://api.example.com/posts/${slug}`).then(r => r.json())
  return <article>{post.content}</article>
}
```

### Client Component

```tsx
// components/SearchBar.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function SearchBar() {
  const [query, setQuery] = useState('')
  const router = useRouter()

  return (
    <input
      value={query}
      onChange={e => setQuery(e.target.value)}
      onKeyDown={e => e.key === 'Enter' && router.push(`/search?q=${query}`)}
    />
  )
}
```

### Server Action

```tsx
// app/contact/actions.ts
'use server'

import { revalidatePath } from 'next/cache'

export async function submitContact(formData: FormData) {
  const email = formData.get('email') as string
  await db.contact.create({ data: { email } })
  revalidatePath('/contact')
}
```

### Route Handler

```tsx
// app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const products = await db.products.findMany({ where: { category } })
  return NextResponse.json(products)
}
```

---

## Phase 5 — Output Format

When completing a migration request, always deliver:

1. **Analysis summary** — table of routes with recommended rendering strategy and data pattern
2. **Converted files** — each file as a separate code block with filename as heading
3. **The migration checklist** — pre-filled with project-specific notes where possible, as a downloadable Markdown file (use `create_file` + `present_files`)
4. **Breaking changes callout** — any library incompatibilities, deprecated APIs, or manual steps

---

## Reference files

- `references/rendering-patterns.md` — Full boilerplate for SSR, SSG, ISR, CSR with comments
- `references/data-patterns.md` — Server Actions, Route Handlers, inline fetch patterns
- `references/common-pitfalls.md` — Known gotchas, incompatible libraries, CSR escape hatches

---

## Self-Optimization Protocol

This skill is designed to improve itself over time. Follow this protocol whenever
you notice a gap, mistake, or missing pattern during a migration.

### When to trigger self-optimization

Trigger this protocol when any of the following occur:
- Claude made a **wrong rendering strategy decision** (e.g. recommended SSR when ISR was correct)
- A **code pattern failed** at runtime or build time
- A **library or tool** wasn't handled correctly (missing `'use client'`, wrong import, etc.)
- The **checklist was missing a step** that turned out to be necessary
- A user explicitly says "that was wrong" or "this didn't work"

### How to self-optimize

When a gap is identified, Claude should:

**Step 1 — Diagnose**
State clearly what went wrong:
```
❌ Issue: Recommended SSR for `/pricing` page, but it has no dynamic data — SSG was correct.
📍 Location: Phase 1 decision tree
💡 Fix: Add rule — "If all data is fetched from a public CMS with no auth and changes < daily → prefer SSG/ISR over SSR"
```

**Step 2 — Propose a patch**
Show the exact diff — what text to remove and what to add — before making any changes:
```
In SKILL.md > Phase 1 decision tree, after "Does this page need real-time or user-specific data?":

ADD after the NO branch:
  "Is all data from a public source updated less than once per day?
    YES → SSG or ISR (prefer ISR with revalidate: 86400)
    NO  → continue tree"
```

**Step 3 — Confirm with user**
Always ask: *"Should I apply this patch to the skill?"* — never auto-write without confirmation.

**Step 4 — Apply and log**
Once confirmed, edit the relevant file (`SKILL.md` or a `references/*.md` file) and append
an entry to the change log below.

---

### Guardrail — Keep the skill file project-agnostic

This skill file must remain **fully reusable across any project**. Before writing any patch
or example, check it against these rules:

| Rule | ✅ Allowed | ❌ Not allowed |
|------|-----------|---------------|
| Component names | `SearchBar`, `ProductCard`, `NavMenu` (generic) | `Navbar`, `Hero`, `Contact`, `Footer` (from a specific project) |
| File names | `app/page.tsx`, `components/Button.tsx` | `src/components/SelfProjects.tsx`, `src/pages/Index.tsx` |
| Package names | `next`, `react`, `tailwindcss`, `@tanstack/react-query` (ecosystem-standard) | `@emailjs/browser`, `next-themes`, or any package specific to one project |
| Font names | `YourFont`, `SansFont` (placeholder) | `Inter`, `Poppins` (project-chosen fonts) |
| API/env names | `NEXT_PUBLIC_API_KEY`, `NEXT_PUBLIC_SERVICE_ID` (generic) | `NEXT_PUBLIC_EMAILJS_SERVICE_ID` (service-specific) |
| Route examples | `/dashboard`, `/blog/[slug]`, `/products/[id]` (universal) | `/self-projects`, `/self-learning` (domain-specific) |

If a patch would violate any of these rules, rewrite it using a generic placeholder before
applying. The Change Log is the only place where a brief factual reference to a migration
may appear — keep it as a pattern description, not a name list.

---

## Change Log

Track every self-improvement here. This makes the skill's evolution visible and reversible.

| Date | File changed | What was wrong | What was fixed |
|------|-------------|----------------|----------------|
| — | — | Initial version | — |
| 2026-03-27 | SKILL.md | Phase 0 didn't audit all components before writing the Server/Client split table. Multiple section components were incorrectly assumed to be Server Components — all failed at build time with "cannot use hooks in Server Component" because they used `useEffect`/`useRef`/`useState`. A component with a browser API (`window.scrollTo`) + `onClick` also failed. | Added mandatory grep audit step at end of Phase 0; added guard note to Phase 3 intro; replaced vague Step 7 bullets with an actionable grep command. |
| 2026-03-27 | SKILL.md | Step 8 had no discovery command for raw `<img>` tags. Only the explicitly-read hero component was migrated; two other components with external image URLs were missed. The build does not fail on raw `<img>` — the gap was only caught during the post-build verify step. External hostnames across multiple domains were also not collected. | Added mandatory `grep -rn "<img" src/` to Step 8; expanded the step to cover `remotePatterns` collection; updated Phase 0 Images row to include the grep command. |

### How to revert a change
Each row in the log should have enough context to manually undo the change if it made
things worse. If a patch degrades quality, restore the previous version and add a new
row explaining why the patch was reverted.

---

## Improvement Triggers for the User

You can also proactively ask Claude to review the skill after a migration by saying:

> *"We just finished the migration. What gaps did you notice in the skill? Propose patches."*

Claude will review what it had to handle that wasn't covered in the skill, and propose
additions before the next session.