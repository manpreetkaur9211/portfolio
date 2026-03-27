# Common Pitfalls & Gotchas

## ❌ Importing Server Components into Client Components

```tsx
// WRONG — breaks the RSC model
'use client'
import { ServerComponent } from './ServerComponent' // ❌

// CORRECT — pass as children
'use client'
export function ClientWrapper({ children }) {
  return <div onClick={...}>{children}</div>
}

// In a Server Component parent:
<ClientWrapper>
  <ServerComponent /> {/* ✅ passed as prop, not imported */}
</ClientWrapper>
```

---

## ❌ Using browser APIs in Server Components

```tsx
// WRONG
export default function Page() {
  const theme = localStorage.getItem('theme') // ❌ — no window on server
}

// CORRECT — move to a Client Component
'use client'
export function ThemeToggle() {
  const theme = localStorage.getItem('theme') // ✅
}
```

---

## ❌ env vars: VITE_ prefix

```tsx
// WRONG
const key = import.meta.env.VITE_API_URL // ❌

// CORRECT
const key = process.env.NEXT_PUBLIC_API_URL // ✅ (public)
const secret = process.env.DB_URL           // ✅ (server-only, never exposed)
```

---

## ❌ react-router hooks in Server Components

```tsx
// WRONG — these are client-only
import { useNavigate, useLocation } from 'react-router-dom' // ❌

// CORRECT
'use client'
import { useRouter, usePathname, useSearchParams } from 'next/navigation' // ✅
```

---

## ❌ Sequential fetch waterfall

```tsx
// SLOW — each await waits for the previous
const user = await getUser(id)
const posts = await getPosts(id)   // waits for user to finish
const tags = await getTags(id)     // waits for posts to finish

// FAST — parallel
const [user, posts, tags] = await Promise.all([
  getUser(id), getPosts(id), getTags(id)
])
```

---

## ❌ CSS-in-JS libraries that don't support RSC

Libraries like `styled-components` and `emotion` require client-side runtime. In the App Router:
- Wrap in a `'use client'` Provider at the root
- See: https://nextjs.org/docs/app/guides/css-in-js

```tsx
// app/StyledComponentsRegistry.tsx
'use client'
import { useState } from 'react'
import { useServerInsertedHTML } from 'next/navigation'
import { ServerStyleSheet, StyleSheetManager } from 'styled-components'

export default function StyledComponentsRegistry({ children }) {
  const [sheet] = useState(() => new ServerStyleSheet())
  useServerInsertedHTML(() => <>{sheet.getStyleElement()}</>)
  return <StyleSheetManager sheet={sheet.instance}>{children}</StyleSheetManager>
}
```

---

## ❌ Accessing cookies/headers in Client Components

```tsx
// WRONG — cookies() is server-only
'use client'
import { cookies } from 'next/headers' // ❌ Runtime error

// CORRECT — read in Server Component, pass as prop
// app/page.tsx (Server Component)
import { cookies } from 'next/headers'
export default async function Page() {
  const cookieStore = await cookies()
  const theme = cookieStore.get('theme')?.value
  return <ClientComponent theme={theme} />
}
```

---

## ❌ Dynamic routes: params is now a Promise (Next.js 15+)

```tsx
// WRONG (Next.js 14 pattern)
export default function Page({ params }: { params: { id: string } }) {
  const { id } = params // ❌ — params is a Promise in Next.js 15+
}

// CORRECT
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params // ✅
}
```

---

## ⚠️ Libraries that may need 'use client' wrappers

| Library | Issue | Fix |
|---------|-------|-----|
| `react-hot-toast` | uses Context | Wrap provider in `'use client'` |
| `framer-motion` | uses browser APIs | Mark animated components `'use client'` |
| `recharts` | uses window | Wrap in `'use client'` |
| `react-hook-form` | uses refs/events | Mark forms `'use client'` |
| `zustand` | client state | Store provider `'use client'`; reads OK in client |
| `react-select` | uses DOM | Mark `'use client'` |
| `react-dnd` | uses drag events | Mark `'use client'` |
| `@tanstack/react-query` | client fetching | QueryClientProvider `'use client'` |

---

## ⚠️ Middleware caveats

- `middleware.ts` runs on the Edge runtime — no Node.js APIs
- Don't import Prisma, heavy ORMs, or Node-only modules here
- Use lightweight auth checks (JWT decode, cookie inspection)

```tsx
// middleware.ts
import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')
  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/account/:path*'],
}
```

---

## ⚠️ next/image requires width + height (or fill)

```tsx
// WRONG
<Image src="/hero.png" alt="Hero" /> // ❌ — missing width/height

// CORRECT — known dimensions
<Image src="/hero.png" alt="Hero" width={1200} height={600} />

// CORRECT — fill parent container
<div style={{ position: 'relative', height: '400px' }}>
  <Image src="/hero.png" alt="Hero" fill style={{ objectFit: 'cover' }} />
</div>
```