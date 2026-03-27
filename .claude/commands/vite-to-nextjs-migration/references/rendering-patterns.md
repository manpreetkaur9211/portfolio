# Rendering Patterns Reference

## SSG — Static Site Generation

No fetch, or fetch with `cache: 'force-cache'` (default). Page is rendered once at build time.

```tsx
// app/about/page.tsx
// No special config needed — static by default when no dynamic data

export default function AboutPage() {
  return <h1>About Us</h1>
}
```

With data:
```tsx
// app/team/page.tsx
export default async function TeamPage() {
  // cache:'force-cache' is the default — rendered at build time
  const team = await fetch('https://api.example.com/team').then(r => r.json())
  return <ul>{team.map(m => <li key={m.id}>{m.name}</li>)}</ul>
}
```

---

## ISR — Incremental Static Regeneration

Page is statically generated but revalidated on a schedule.

```tsx
// app/products/page.tsx
export const revalidate = 60 // seconds — re-render at most every 60s

export default async function ProductsPage() {
  const products = await fetch('https://api.example.com/products').then(r => r.json())
  return <ProductGrid products={products} />
}
```

On-demand ISR (trigger from a webhook or Server Action):
```tsx
// app/api/revalidate/route.ts
import { revalidatePath, revalidateTag } from 'next/cache'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const { secret, path } = await req.json()
  if (secret !== process.env.REVALIDATE_SECRET) {
    return new Response('Unauthorized', { status: 401 })
  }
  revalidatePath(path)
  return Response.json({ revalidated: true })
}
```

---

## SSR — Server-Side Rendering

Page rendered fresh on every request.

```tsx
// app/dashboard/page.tsx
export const dynamic = 'force-dynamic'
// OR: use fetch with cache: 'no-store'

import { cookies } from 'next/headers'

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth-token')?.value

  const data = await fetch('https://api.example.com/dashboard', {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  }).then(r => r.json())

  return <Dashboard data={data} />
}
```

---

## CSR — Client-Side Rendering

For interactive, user-specific, or real-time UI that doesn't need SSR/SEO.

```tsx
// components/LiveFeed.tsx
'use client'

import { useState, useEffect } from 'react'

export function LiveFeed() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/feed')
      .then(r => r.json())
      .then(data => {
        setItems(data)
        setLoading(false)
      })
  }, [])

  if (loading) return <p>Loading...</p>
  return <ul>{items.map(i => <li key={i.id}>{i.title}</li>)}</ul>
}
```

With SWR (recommended for CSR data fetching):
```tsx
'use client'

import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export function LiveFeed() {
  const { data, isLoading } = useSWR('/api/feed', fetcher, { refreshInterval: 5000 })
  if (isLoading) return <p>Loading...</p>
  return <ul>{data.map(i => <li key={i.id}>{i.title}</li>)}</ul>
}
```

---

## Mixed: Server Component with CSR islands

```tsx
// app/products/[id]/page.tsx  (Server Component)
import { AddToCartButton } from '@/components/AddToCartButton' // 'use client'

export default async function ProductPage({ params }) {
  const { id } = await params
  const product = await fetch(`https://api.example.com/products/${id}`).then(r => r.json())

  return (
    <div>
      <h1>{product.name}</h1>           {/* Server-rendered */}
      <p>{product.description}</p>      {/* Server-rendered */}
      <AddToCartButton id={product.id} /> {/* Client island */}
    </div>
  )
}
```