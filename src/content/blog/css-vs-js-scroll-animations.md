---
title: "CSS Animations vs JS Scroll Animations in React: How to Choose"
topic: css-vs-js-scroll-animations
date: "2026-04-01"
status: draft
excerpt: "Both CSS-only and IntersectionObserver-driven animations work — but they have different costs and different use cases. Here is the decision framework I now use."
tags: ["React", "CSS", "Performance", "Animation", "Next.js"]
readTime: "5 min read"
---

When I added scroll animations to my portfolio, I used `IntersectionObserver` inside a `useEffect` hook for every section. It worked well: each section fades in as it enters the viewport, fires once, and stops.

When I added a blog listing page with cards, I faced the same question. And I made the opposite choice: CSS-only animations with no JavaScript at all.

Here is why they are different decisions, and the framework I use to choose between them.

## What Each Approach Actually Costs

### JS-driven animations (IntersectionObserver + useEffect)

```tsx
// Component must be 'use client'
'use client'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'

export function ExperienceSection() {
  const ref = useIntersectionObserver<HTMLDivElement>()
  return <div ref={ref} className="animate-on-scroll">...</div>
}
```

**What this sends to the browser:**
- The component's JavaScript bundle
- The `useIntersectionObserver` hook code
- React's hydration runtime (shared, but still required)

**What you get:**
- Animation triggers exactly when the element enters the viewport
- Works reliably regardless of page length or scroll position
- Fires once and disconnects — no repeated triggering

**The constraint:** the component must be a Client Component (`'use client'`). This means React hydrates it in the browser, which has a small but real cost.

### CSS-only animations

```tsx
// No 'use client' needed — this can be a Server Component
export function BlogCard({ post, index }: BlogCardProps) {
  return (
    <article
      className="animate-fade-in"
      style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}
    >
      ...
    </article>
  )
}
```

```css
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in 0.5s ease-out;
}
```

**What this sends to the browser:**
- Nothing extra. The CSS is in the existing stylesheet. The component has no JS.

**What you get:**
- Animation fires on page load, not on scroll
- Stagger effect via `animationDelay` based on index
- Component can be a Server Component — pre-rendered to HTML, zero hydration cost

**The constraint:** fires on load, not on scroll. If the element is far below the fold, it will have already animated in before the user scrolls to it.

## The Decision Table

| Factor | Use CSS-only | Use JS (IntersectionObserver) |
|---|---|---|
| Content is near or above the fold | ✓ | |
| Page is long, content is far below fold | | ✓ |
| Component needs to stay a Server Component | ✓ | |
| Animation must be scroll-triggered | | ✓ |
| Multiple items need stagger | ✓ (delay by index) | ✓ (delay by index) |
| Animation complexity is high | | ✓ |
| Minimising JS bundle is a priority | ✓ | |

## Real Example: Why I Used Different Approaches on the Same Site

**Home page sections** (`Experience`, `Skills`, `Projects`, etc.) → **JS-driven**

The home page is long — around 3000px on desktop. `Experience` and `Projects` are well below the fold. If I used CSS-only animations, they would fire immediately on page load when the user is still looking at the hero section. By the time they scroll down, the animation is long finished. The fade-in effect is wasted.

`IntersectionObserver` solves this: each section animates exactly when the user arrives at it.

**Blog listing cards** (`/blog` page) → **CSS-only**

The blog listing page is short. All 5 cards fit on one screen on desktop, and at most two scrolls on mobile. Every card is near the fold. Using `IntersectionObserver` here would add JS hydration overhead for an animation that would fire almost immediately anyway.

CSS-only with a stagger delay gives the same visual result — cards cascade in on load — with zero extra JavaScript. The `BlogCard` component stays a Server Component.

## The Stagger Pattern with CSS

```tsx
{posts.map((post, index) => (
  <BlogCard key={post.topic} post={post} index={index} />
))}
```

```tsx
// BlogCard.tsx — Server Component, no 'use client'
export default function BlogCard({ post, index }) {
  return (
    <article
      className="animate-fade-in"
      style={{
        animationDelay: `${index * 100}ms`,
        animationFillMode: 'both'  // stays at final state after animation completes
      }}
    >
      ...
    </article>
  )
}
```

`animationFillMode: 'both'` is important. Without it, the card starts at full opacity (the element's default state), jumps to `opacity: 0` when the animation begins, then fades in. With `both`, the element holds the `from` state before the animation starts — so cards with a delay appear invisible until their turn, then animate in smoothly.

## The Rule I Follow Now

> If the animated content is reliably near the fold — use CSS-only and keep the component a Server Component.
> If the content could be far below the fold on any common screen size — use IntersectionObserver so the animation fires when the user actually sees it.

A secondary consideration: if the component already needs `'use client'` for another reason (state, event handlers), the cost of adding `useIntersectionObserver` is negligible — the component is already a Client Component anyway.

## What to Try Next

Audit your React app's animated components. For each one, ask:

1. Is this reliably above or near the fold on most screen sizes?
2. Does this component already need `'use client'` for another reason?

If the answer to (1) is yes, try removing the `useEffect`/`IntersectionObserver` and replacing with a CSS animation + delay. If the component has no other reason to be a Client Component, remove `'use client'` entirely.

Run `next build` before and after and compare the route output. Routes that shed all Client Components will often flip from needing hydration to being pure static HTML — a measurable improvement in time-to-interactive.
