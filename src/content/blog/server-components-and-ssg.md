---
title: "SSG and 'use client' Are Not Mutually Exclusive in Next.js"
topic: server-components-and-ssg
date: "2026-04-01"
status: draft
excerpt: "Most developers think adding 'use client' breaks static generation. It doesn't — and understanding why changes how you architect Next.js apps."
tags: ["Next.js", "React", "Server Components", "SSG", "Performance"]
readTime: "6 min read"
---

When I migrated my portfolio from Vite to Next.js App Router, I ran into a question that stopped me cold:

> "If I add `'use client'` to a component that uses `useEffect`, does that break SSG?"

The short answer is no. The longer answer changes how you think about the entire rendering model.

## The Misconception

Most developers coming from Vite or Create React App think in terms of one rendering environment: the browser. When Next.js introduces "Server Components", it feels like a binary: either your component runs on the server (SSG/SSR), or it runs on the client.

So when you add `'use client'`, the assumption is: "this component is now browser-only, therefore it can't be pre-rendered."

That's wrong.

## How It Actually Works

`'use client'` doesn't mean "render only in the browser". It means "this component uses browser APIs or React hooks, so it needs to be hydrated".

Here's the actual sequence:

**At build time (SSG):**
1. Next.js runs your Server Component page (e.g. `page.tsx`)
2. It encounters a Client Component (e.g. a card with `'use client'`)
3. It **pre-renders that Client Component to static HTML too** — React can do this on the server
4. The result is a complete HTML page, with the Client Component's markup already in it

**In the browser:**
1. The browser receives the pre-rendered HTML immediately — fast, no JS needed for the initial paint
2. React downloads the Client Component's JavaScript bundle
3. React **hydrates** — attaches event listeners and hook state to the already-rendered HTML
4. Now interactive features work (scroll animations, click handlers, etc.)

The `○ (Static)` label in `next build` output refers to the **route**, not individual components. A route is static if no data is fetched at request time. Client Components inside it don't change that.

## Real Example from My Portfolio

My portfolio's home page (`src/app/page.tsx`) is a Server Component. It composes sections like `Experience`, `Skills`, `Projects` — all of which use `useIntersectionObserver` (a custom hook), so they're all `'use client'`.

```tsx
// src/app/page.tsx — Server Component, no 'use client'
export default function Home() {
  return (
    <div className="min-h-screen">
      <Skills />      {/* 'use client' — uses useState + IntersectionObserver */}
      <Experience />  {/* 'use client' — uses useRef + IntersectionObserver */}
      <Projects />    {/* 'use client' — uses useState for filtering */}
    </div>
  )
}
```

The build output:

```
Route (app)
┌ ○ /        ← Static. Despite all the 'use client' children.
└ ○ /blog    ← Static.
```

Both routes are fully static. The Client Components inside them are pre-rendered to HTML at build time, then hydrated in the browser.

## What JS Actually Gets Sent to the Browser

This is the nuance most posts skip. When a component is `'use client'`, the following gets bundled and sent to the browser:

- The component function itself
- Any hooks it uses (including custom ones like `useIntersectionObserver`)
- Direct imports within that component (icons, utilities, etc.)
- React's hydration runtime (shared across all Client Components on the page — not duplicated)

What does **not** get sent:
- Server Component code
- `fs`, `path`, database clients, or any Node.js-only imports
- Data fetched on the server (it's baked into the HTML)

So for a blog listing page:

```tsx
// src/app/blog/page.tsx — Server Component
import { getAllPosts } from '@/lib/blog'  // reads files with Node.js fs — never sent to browser
import BlogCard from '@/components/blog/BlogCard'  // 'use client' — hydrated

export default function BlogPage() {
  const posts = getAllPosts()  // runs at build time only
  return posts.map(post => <BlogCard post={post} />)
}
```

`getAllPosts()` uses `fs.readdirSync` — Node.js only. It never touches the browser bundle. `BlogCard` is a Client Component, so its JS is sent — but the post data it renders is already in the HTML.

## When to Use Each

| Use Server Component when... | Use Client Component (`'use client'`) when... |
|---|---|
| Fetching data (DB, files, API) | Using `useState`, `useReducer`, `useRef` |
| Static content rendering | Using `useEffect` or `useContext` |
| SEO-critical markup | Attaching DOM event listeners |
| Anything that doesn't need interactivity | Using browser-only APIs (`window`, `document`, `IntersectionObserver`) |

## The Practical Rule

**Start every component as a Server Component.** Only add `'use client'` when the TypeScript compiler or Next.js build tells you it's needed — usually because you're using a hook or browser API.

The boundary between Server and Client Components is where you draw the line between "rendered once at build time" and "hydrated and interactive in the browser". That boundary doesn't have to be at the page level — it can be deep inside a component tree.

## What to Try Next

If you have an existing Next.js app, run `next build` and look at the route output. Every route marked `○ (Static)` is being served as pure HTML from a CDN — no server involved at request time.

Then look at your `'use client'` components. Ask: does this whole component need to be a Client Component, or just one small interactive part of it? Often you can extract the interactive part into a small Client Component and keep the rest as a Server Component — shrinking your JS bundle in the process.

The more deliberate you are about the Server/Client boundary, the faster and more SEO-friendly your app becomes — without giving up interactivity.
