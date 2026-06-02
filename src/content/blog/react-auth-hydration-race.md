---
title: "Your Auth Redirect Is Firing for Logged-In Users — Here's Why"
topic: react-auth-hydration-race
date: 2026-05-05
status: draft
excerpt: "If your React app reads auth state from localStorage, there's one render where every user looks logged out — and if you redirect on that render, valid sessions get bounced to the login page."
tags: ["React", "Next.js", "Authentication", "TypeScript", "Hooks"]
readTime: "5 min read"
---

## The Bug That Doesn't Look Like a Bug

Here's the pattern. You have an `AuthContext` that reads the user's token from `localStorage`:

```tsx
// AuthContext.tsx
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
```

And a protected page that redirects unauthenticated users:

```tsx
// boards/page.tsx
export default function Boards() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user?.token) {
      router.push('/login');
    }
  }, [user, router]);

  // ...
}
```

This looks correct. It reads the user, redirects if there isn't one. The problem is timing.

## Why `user` Is Always Null on the First Render

React renders the component tree before effects run. On the very first render:

1. `AuthProvider` mounts with `user = null` (the initial state)
2. The component tree renders — including your protected page
3. The protected page's `useEffect` sees `user = null` and calls `router.push('/login')`
4. *Then* `AuthProvider`'s `useEffect` fires, reads localStorage, and sets the real user

By step 4, the redirect has already happened. A logged-in user just got sent to the login page.

In practice this often manifests as a flash — the redirect happens and then the login page loads, or depending on your router setup, the user gets stuck at `/login` even though they have a valid token.

## The Fix: An `initialized` Flag

The issue is that `null` means two different things: "no user" and "we haven't checked yet." You need to distinguish between them.

Add an `initialized` flag to `AuthContext` that starts as `false` and becomes `true` only after the `useEffect` has run:

```tsx
// AuthContext.tsx
interface AuthContextValue {
  user: User | null;
  initialized: boolean;  // add this
  login: (user: User) => void;
  logout: () => void;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [initialized, setInitialized] = useState(false);  // starts false

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
    setInitialized(true);  // always set true after the check, regardless of result
  }, []);

  return (
    <AuthContext.Provider value={{ user, initialized, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
```

Now update the protected page to wait for initialization before making any redirect decision:

```tsx
// boards/page.tsx
export default function Boards() {
  const { user, initialized } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!initialized) return;          // still reading localStorage — wait
    if (!user?.token) {
      router.push('/login');           // now we know they're actually logged out
    }
  }, [user, initialized, router]);

  if (!initialized) return <CircularProgress sx={{ display: 'block', margin: '2rem auto' }} />;

  // ...rest of the page
}
```

Two things changed:
1. The effect bails early if `initialized` is false — no redirect decision until after the localStorage read
2. The render returns a spinner while uninitialized — the user sees a brief loading state instead of a flash redirect

## The Render Sequence After the Fix

With the `initialized` flag:

1. First render: `user = null`, `initialized = false` → spinner shown, no redirect
2. `AuthProvider`'s `useEffect` fires → reads localStorage → sets `user` to the stored value, sets `initialized = true`
3. Re-render: `user = { token: '...' }`, `initialized = true` → boards page renders normally

For an unauthenticated user:

1. First render: `user = null`, `initialized = false` → spinner shown, no redirect
2. `useEffect` fires → nothing in localStorage → sets `initialized = true`
3. Re-render: `user = null`, `initialized = true` → redirect to `/login` fires correctly

## Why This Isn't Obvious

The reason this catches people out is that localStorage reads are synchronous in isolation — `localStorage.getItem('user')` doesn't return a Promise. It feels like it should be available immediately.

But in React, "immediately" means synchronously during render. `useEffect` is deliberately deferred — it runs after the browser has painted. That's what makes effects safe for things like subscribing to external stores, but it also means any state set inside an effect won't be available on the first render.

This is true of any external store that gets read in a `useEffect`: cookies, `sessionStorage`, `IndexedDB`, even URL parameters read via `useSearchParams` in some Next.js configurations. Any time you set state inside an effect, there's at least one render where that state is still the initial value.

## A Note on Next.js Specifically

If you're using Next.js App Router, protected routes are commonly handled in middleware (`middleware.ts`) at the edge rather than in client-side `useEffect`. Middleware can read cookies synchronously before any rendering happens, which sidesteps this problem entirely for token-based auth stored in cookies.

The `localStorage` pattern is common for JWT auth where the token is stored client-side only — which is the typical setup when your auth is handled by an Express backend rather than a Next.js-native session. In that case, the `initialized` flag is the right fix.

## What to Try

Check your `AuthContext` right now: does it expose an `initialized`, `loading`, or `hydrated` flag? If not, every protected page in your app has this race condition sitting in it — it may just be masked by fast network or redirect handling.

The fix is three lines: add the flag to state, set it at the end of the `useEffect`, and check it before any redirect decision. Takes two minutes and removes an entire class of auth-related bugs.
