# Data Patterns Reference

## Server Actions — mutations and form submissions

### Basic Server Action (called from Client Component)

```tsx
// app/todos/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createTodo(formData: FormData) {
  const title = formData.get('title') as string
  await db.todo.create({ data: { title } })
  revalidatePath('/todos')
}

export async function deleteTodo(id: string) {
  await db.todo.delete({ where: { id } })
  revalidatePath('/todos')
}
```

```tsx
// app/todos/NewTodoForm.tsx
'use client'

import { createTodo } from './actions'

export function NewTodoForm() {
  return (
    <form action={createTodo}>
      <input name="title" required />
      <button type="submit">Add</button>
    </form>
  )
}
```

### Server Action with optimistic update

```tsx
'use client'

import { useOptimistic, useTransition } from 'react'
import { toggleTodo } from './actions'

export function TodoList({ todos }) {
  const [optimisticTodos, setOptimistic] = useOptimistic(todos)
  const [, startTransition] = useTransition()

  const handleToggle = (id: string) => {
    startTransition(async () => {
      setOptimistic(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))
      await toggleTodo(id)
    })
  }

  return <ul>{optimisticTodos.map(t => <li key={t.id} onClick={() => handleToggle(t.id)}>{t.title}</li>)}</ul>
}
```

---

## Route Handlers — API endpoints

### GET with query params

```tsx
// app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category') ?? ''
  const page = Number(searchParams.get('page') ?? 1)

  const products = await db.products.findMany({
    where: { category: category || undefined },
    skip: (page - 1) * 20,
    take: 20,
  })

  return NextResponse.json(products)
}
```

### POST with body

```tsx
// app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const schema = z.object({ email: z.string().email(), message: z.string().min(10) })

export async function POST(request: NextRequest) {
  const body = await request.json()
  const parsed = schema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten() }, { status: 400 })
  }

  await db.contact.create({ data: parsed.data })
  return NextResponse.json({ success: true }, { status: 201 })
}
```

### Dynamic Route Handler

```tsx
// app/api/products/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const product = await db.products.findUnique({ where: { id } })
  if (!product) return new Response('Not found', { status: 404 })
  return NextResponse.json(product)
}
```

### Proxy Route Handler (hide API keys)

```tsx
// app/api/external/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')

  const res = await fetch(
    `https://external-api.com/search?q=${q}&key=${process.env.EXTERNAL_API_KEY}`
  )
  const data = await res.json()
  return NextResponse.json(data)
}
```

---

## Inline Server Component fetch (no API route needed)

```tsx
// app/dashboard/page.tsx
import { cookies } from 'next/headers'

async function getUserData(token: string) {
  return fetch('https://api.example.com/me', {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  }).then(r => r.json())
}

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth-token')?.value ?? ''
  const user = await getUserData(token)
  return <h1>Welcome, {user.name}</h1>
}
```

---

## Parallel data fetching (avoid waterfall)

```tsx
// app/profile/page.tsx
export default async function ProfilePage({ params }) {
  const { id } = await params

  // Fetch in parallel — NOT sequential await
  const [user, posts, followers] = await Promise.all([
    fetch(`/api/users/${id}`).then(r => r.json()),
    fetch(`/api/users/${id}/posts`).then(r => r.json()),
    fetch(`/api/users/${id}/followers`).then(r => r.json()),
  ])

  return (
    <>
      <UserCard user={user} />
      <PostList posts={posts} />
      <FollowerCount count={followers.length} />
    </>
  )
}
```

---

## When to use what — decision summary

| Scenario | Use |
|----------|-----|
| Form submit, DB mutation | Server Action |
| Need redirect after mutation | Server Action + `redirect()` |
| Public REST API endpoint | Route Handler |
| Webhook receiver | Route Handler |
| Proxy to hide secrets | Route Handler |
| Mobile/third-party API consumer | Route Handler |
| Read data in a page (no auth) | Inline fetch in Server Component |
| Read data in a page (with auth) | Inline fetch + `cookies()` in Server Component |
| Real-time / polling client data | CSR + SWR/React Query hitting Route Handler |
| File upload | Route Handler (multipart) or Server Action |