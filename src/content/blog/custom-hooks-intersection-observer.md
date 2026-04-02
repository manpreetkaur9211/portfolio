---
title: "One Custom Hook to Replace 5 Duplicated useEffect Blocks"
topic: custom-hooks-intersection-observer
date: "2026-04-01"
status: draft
excerpt: "I found the same 25-line IntersectionObserver pattern copy-pasted across 5 React components. Here's the custom hook that replaced all of them."
tags: ["React", "Custom Hooks", "TypeScript", "Performance", "Clean Code"]
readTime: "5 min read"
---

During a codebase audit, I found this pattern in five separate React components:

```tsx
const ref = useRef<HTMLDivElement>(null)

useEffect(() => {
  const el = ref.current
  if (!el) return

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible')
        observer.disconnect()
      }
    },
    { threshold: 0.1 }
  )

  observer.observe(el)
  return () => observer.disconnect()
}, [])
```

Same logic. Different components. Copy-pasted five times. This is a code smell — if you ever need to change the threshold, add a once-only flag, or tweak the disconnect logic, you're hunting down five files.

The fix: one custom hook with two modes.

## What Is IntersectionObserver?

Before the hook, a quick recap. `IntersectionObserver` is a browser API that fires a callback when an element enters or leaves the viewport. It's the right tool for scroll-triggered animations — more performant than `scroll` event listeners because the browser manages the intersection detection off the main thread.

The basic pattern:

```ts
const observer = new IntersectionObserver(callback, { threshold: 0.1 })
observer.observe(element)
// threshold: 0.1 → fires when 10% of the element is visible
```

The `disconnect()` call after the first intersection is the "fire once" optimization — you don't want to re-trigger animations every time the user scrolls up and back down.

## The Problem with Five Copies

Each component had slightly different needs:
- `Experience.tsx` and `Projects.tsx` — add `is-visible` class to trigger a CSS transition
- `Skills.tsx` — trigger a `setState` to animate progress bars after a 300ms delay
- `SelfLearning.tsx` and `SelfProjects.tsx` — add `animate-fade-in` class (different from `is-visible`)

Three different behaviours, but the IntersectionObserver setup was identical in all five. The only thing that changed was what happened *inside* the callback.

## The Custom Hook

```ts
// src/hooks/useIntersectionObserver.ts
'use client'
import { useEffect, useRef } from 'react'

interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  onIntersect?: (entry: IntersectionObserverEntry) => void
  addVisibleClass?: boolean
}

export function useIntersectionObserver<T extends Element>(
  options: UseIntersectionObserverOptions = {}
) {
  const { onIntersect, addVisibleClass = true, ...observerInit } = options
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return

        if (onIntersect) {
          onIntersect(entry)
        } else if (addVisibleClass) {
          entry.target.classList.add('is-visible')
        }

        observer.disconnect()
      },
      { threshold: 0.1, ...observerInit }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return ref
}
```

### Design decisions worth explaining

**Generic type parameter `<T extends Element>`** — the caller specifies the element type (`HTMLDivElement`, `HTMLSectionElement`, etc.), so TypeScript knows what `ref.current` is. Without this, you'd get `Element | null` everywhere and lose autocompletion on DOM properties.

**`addVisibleClass = true` as default** — the most common behaviour (add `is-visible`) requires zero configuration. You only pass options when you need something different.

**`...observerInit` spread** — the hook accepts all standard `IntersectionObserverInit` options (`threshold`, `rootMargin`, `root`). You can customise per call-site without the hook needing to know about every option.

**`observer.disconnect()` inside the callback** — fires once and stops. This is intentional. If you need repeated firing, pass `addVisibleClass: false` and manage disconnection yourself in `onIntersect`.

**Empty dependency array** — the observer is set up once on mount. The `eslint-disable` comment is correct here: `onIntersect` could change on every render if defined inline, which would re-run the effect and double-register the observer. Capturing it at mount time is the right call for animation triggers.

## Three Usage Patterns

### Default — add `is-visible` class

```tsx
// Experience.tsx, Projects.tsx
const ref = useIntersectionObserver<HTMLDivElement>()

return <div ref={ref} className="animate-on-scroll">...</div>
```

The CSS handles the animation:
```css
.animate-on-scroll { opacity: 0; transform: translateY(20px); transition: opacity 0.6s, transform 0.6s; }
.animate-on-scroll.is-visible { opacity: 1; transform: translateY(0); }
```

### Custom callback — progress bars

```tsx
// Skills.tsx
const ref = useIntersectionObserver<HTMLDivElement>({
  addVisibleClass: false,
  onIntersect: () => setTimeout(() => setWidth(skill.percentage), 300),
})
```

The progress bar animation needs `setState` — not a CSS class. The `onIntersect` callback gives you full control.

### Custom callback — different class

```tsx
// SelfLearning.tsx, SelfProjects.tsx
const ref = useIntersectionObserver<HTMLDivElement>({
  addVisibleClass: false,
  onIntersect: (entry) => entry.target.classList.add('animate-fade-in'),
})
```

Same idea — just a different class name. Could have used the default mode with a `className` prop, but this approach keeps the hook call-site explicit about what class is being added.

## The Before/After

Before: 5 components × 25 lines = ~125 lines of IntersectionObserver boilerplate across the codebase.

After: 1 hook (35 lines) + 1 line per component call-site.

More importantly: if the observer setup needs to change — different threshold, added `rootMargin`, changed disconnect timing — it changes in exactly one place.

## What to Try Next

If you have scroll animations in your React app, do a quick audit:

```bash
grep -rn "IntersectionObserver" src/
```

If you see the same pattern in more than one file, extract it into a custom hook. The generic type parameter pattern (`<T extends Element>`) works for any hook that attaches a `ref` to a DOM element — tooltips, focus traps, resize observers.

Custom hooks are the cleanest way to share stateful logic between React components without prop drilling or context. If you're not writing them yet, this is a good place to start.
