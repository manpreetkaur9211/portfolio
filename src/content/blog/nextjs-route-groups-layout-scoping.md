---
title: "Next.js Route Groups: Scope a Sidebar Layout Without Changing Your URLs"
topic: nextjs-route-groups-layout-scoping
date: 2026-05-06
status: draft
excerpt: "Route groups let you share a layout across a subset of pages without adding a URL segment. Here's how the (sidebar) pattern works, and the import path gotcha that trips you up the first time you refactor into one."
tags: ["Next.js", "App Router", "React", "TypeScript", "Layout"]
readTime: "5 min read"
---

## The Problem: Sidebar on Some Pages, Not Others

My app has two distinct sections: an invoice dashboard with a persistent sidebar nav, and a whiteboard tool that uses the full screen with no sidebar. Both live under `/dashboard`.

The obvious wrong answer is a conditional in the root layout:

```tsx
// layout.tsx — please don't do this
export default function RootLayout({ children }) {
  const pathname = usePathname();
  const showSidebar = pathname.startsWith('/dashboard/invoices') ||
                      pathname.startsWith('/dashboard/users');
  return (
    <html>
      <body>
        {showSidebar && <Sidebar />}
        {children}
      </body>
    </html>
  );
}
```

This works but it's fragile. Every new route requires a manual update to the condition. The layout grows into a routing decision system it shouldn't own.

The right answer: a route group.

## What Route Groups Are

Route groups are directories wrapped in parentheses: `(sidebar)`. The parentheses tell Next.js App Router to treat the folder as a layout boundary without adding it to the URL.

This structure:

```
src/app/
├── (sidebar)/
│   ├── layout.tsx        ← sidebar layout lives here
│   ├── (overview)/
│   │   └── page.tsx      → accessible at /
│   ├── invoices/
│   │   └── page.tsx      → accessible at /invoices
│   └── users/
│       └── page.tsx      → accessible at /users
├── dashboard/
│   ├── boards/           → accessible at /dashboard/boards
│   └── tractor/          → accessible at /dashboard/tractor
```

The sidebar layout wraps invoices and users. The dashboard routes are outside the group — they get the root layout only.

`(sidebar)` never appears in any URL. `/invoices`, not `/(sidebar)/invoices`.

## The Layout File

`src/app/(sidebar)/layout.tsx` is where the shared structure lives:

```tsx
export default function SidebarLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <SideNav />
      <main className="flex-1 overflow-auto p-6">
        {children}
      </main>
    </div>
  );
}
```

Any page inside `(sidebar)/` gets this layout automatically. Pages outside it don't. No conditional logic, no pathname checks — the file system handles the routing decision.

## The Gotcha: Relative Imports Break on Refactor

This is where people get caught. When I moved the invoice and users pages into the `(sidebar)/` group, every relative import path in those files changed.

Before the move, a file at `src/app/invoices/page.tsx` might import:

```ts
import { SideNav } from '../../ui/dashboard/sidenav';
```

After moving to `src/app/(sidebar)/invoices/page.tsx`, that same relative path now resolves differently — one level deeper in the directory tree, pointing at nothing.

The build fails with errors like:

```
Module not found: Can't resolve '../../ui/dashboard/sidenav'
```

The fix is to stop using relative imports in route files. Use the `@/` alias instead:

```ts
import { SideNav } from '@/ui/dashboard/sidenav';
```

`@/` maps to `src/` regardless of where the importing file lives. Moving files between route groups stops breaking imports.

If you're setting up a project, configure `tsconfig.json` upfront:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

And use `@/` everywhere from day one — not just after you've been burned by a refactor.

## When to Use Route Groups

Route groups are the right tool when:

- You need a shared layout for a subset of routes that doesn't map to a URL segment
- You want to organise files without creating a new URL prefix
- Multiple distinct app sections need different root layouts (e.g., marketing site vs. app vs. admin)

They're not needed when:

- You just want to group files for readability without any layout difference
- The layout difference is genuinely route-prefix-based (use a regular subfolder)

The `(sidebar)/` pattern in my app handles a real product constraint: two separate tools in one Next.js project, each with different chrome. Route groups give each section its own layout without touching URLs.

## What to Try

If you have conditional sidebar logic in a root layout, the migration path is:

1. Create `src/app/(sidebar)/layout.tsx` with the sidebar structure
2. Move the affected routes into the `(sidebar)/` folder
3. Fix any broken imports by switching to `@/` aliases
4. Delete the conditional logic from the root layout

The root layout becomes what it should be — minimal, unconditional chrome that applies everywhere.
