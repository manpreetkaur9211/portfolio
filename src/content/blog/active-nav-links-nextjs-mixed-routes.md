---
title: "Active Nav Links in Next.js When Your Navbar Mixes Hash Anchors and Route Links"
topic: active-nav-links-nextjs-mixed-routes
date: "2026-04-01"
status: draft
excerpt: "When your navbar has both #hash anchors and /route links, usePathname alone isn't enough — here's the pattern that makes both work correctly."
tags: ["Next.js", "React", "Navigation", "TypeScript", "App Router"]
readTime: "4 min read"
---

Most Next.js navbar tutorials show one of two patterns:

1. Hash anchors — `#about`, `#skills`, `#contact` — for single-page sites
2. Route links — `/about`, `/blog`, `/contact` — for multi-page apps

My portfolio uses both at the same time, and that creates a problem that neither tutorial covers.

## The Setup

The portfolio is a single-page site with all sections on `/`. The navbar links scroll to each section via hash anchors:

```tsx
const sectionLinks = [
  { title: "About",    href: "#about" },
  { title: "Skills",   href: "#skills" },
  { title: "Contact",  href: "#contact" },
  // ...
]
```

I then added a Blog page at `/blog` — a real separate route, not a section on the home page. So the navbar needed a Blog link alongside the hash anchors.

Two problems immediately appeared.

## Problem 1: Hash Links Break on Non-Home Pages

When a user is on `/blog` and clicks `#about`, the browser interprets it as `/blog#about` — it tries to scroll to an element with `id="about"` on the blog page. That element does not exist. Nothing happens.

The fix is to prefix the hash with `/` when not on the home page:

```tsx
// #about     → works on /
// /#about    → works from any page (navigates home, then scrolls)
const sectionHref = (hash: string) => isHome ? hash : `/${hash}`
```

This requires knowing whether the current page is `/`. That means `usePathname()` from `next/navigation`:

```tsx
'use client'
import { usePathname } from 'next/navigation'

const pathname = usePathname()
const isHome = pathname === '/'
```

Now in the render:

```tsx
{sectionLinks.map(link => (
  <a href={sectionHref(link.href)} key={link.title}>
    {link.title}
  </a>
))}
```

On `/`: `sectionHref("#about")` → `"#about"` (scroll within page)
On `/blog`: `sectionHref("#about")` → `"/#about"` (navigate home, then scroll)

## Problem 2: Active State Across Different Link Types

The Blog link needs to highlight when the user is on `/blog` or any `/blog/*` route. The section links do not have a meaningful "active" state in the same way — the user is always on `/` when those are relevant.

For the Blog link specifically:

```tsx
import Link from 'next/link'

<Link
  href="/blog"
  className={
    pathname.startsWith('/blog')
      ? 'text-portfolio-accent font-medium'
      : 'text-gray-600 hover:text-portfolio-accent font-medium'
  }
>
  Blog
</Link>
```

`pathname.startsWith('/blog')` catches both `/blog` (the listing) and `/blog/any-slug` (individual posts). The Blog link stays highlighted throughout the entire blog section.

## The Complete Navbar Pattern

Here is the full implementation with both problems solved:

```tsx
'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const sectionLinks = [
  { title: "About",    href: "#about" },
  { title: "Skills",   href: "#skills" },
  { title: "Experience", href: "#experience" },
  { title: "Contact",  href: "#contact" },
]

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  const isHome = pathname === '/'

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // On non-home pages, hash links must navigate home first
  const sectionHref = (hash: string) => isHome ? hash : `/${hash}`

  return (
    <header className={isScrolled ? 'bg-white shadow-md' : 'bg-transparent'}>
      <nav>
        {/* Section links — hash anchors that work from any page */}
        {sectionLinks.map(link => (
          <a
            key={link.title}
            href={sectionHref(link.href)}
            className="text-gray-600 hover:text-blue-500"
          >
            {link.title}
          </a>
        ))}

        {/* Blog — full route link with active state */}
        <Link
          href="/blog"
          className={
            pathname.startsWith('/blog')
              ? 'text-blue-500 font-semibold'
              : 'text-gray-600 hover:text-blue-500'
          }
        >
          Blog
        </Link>
      </nav>
    </header>
  )
}
```

## Why `usePathname` Forces `'use client'`

`usePathname` is a React hook, and hooks can only run in Client Components. This means the Navbar must be `'use client'` — but it already was, because of `useState` (scroll state) and `useEffect` (scroll listener).

If your navbar has no other reason to be a Client Component, there are two options:

**Option A:** Accept `'use client'` on the Navbar. The cost is small — Navbar JS is tiny and shared across every page.

**Option B:** Split the active Blog link into its own small Client Component (`'use client'`), keep the rest of the Navbar as a Server Component. This is over-engineering for most cases but valid if you are aggressively minimising Client Components.

For a personal portfolio, Option A is the right call.

## Mobile Menu Consideration

The same `sectionHref` helper applies in the mobile menu — same links, same problem:

```tsx
{/* Mobile menu */}
{isMenuOpen && (
  <div className="mobile-menu">
    {sectionLinks.map(link => (
      <a
        key={link.title}
        href={sectionHref(link.href)}   // ← same helper
        onClick={closeMenu}
      >
        {link.title}
      </a>
    ))}
    <Link
      href="/blog"
      className={pathname.startsWith('/blog') ? 'active' : ''}
      onClick={closeMenu}
    >
      Blog
    </Link>
  </div>
)}
```

One helper, two menus, consistent behaviour.

## What to Try Next

If you have a single-page portfolio and are adding a separate route (blog, case studies, resume page), check your existing navbar:

1. Do any links use `href="#section"`? Add the `sectionHref` helper.
2. Does your new route need an active state? Use `pathname.startsWith('/your-route')`.
3. Is `usePathname` the only reason your Navbar needs `'use client'`? Check if you can avoid it — or accept the minimal cost.

The pattern scales: if you add more full routes later (`/projects`, `/talks`, `/uses`), each gets its own `pathname.startsWith()` check. The section links require no changes.
