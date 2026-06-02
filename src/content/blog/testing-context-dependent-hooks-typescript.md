---
title: "Testing a Hook That Calls Another Hook: Mock at the Dependency Boundary"
topic: testing-context-dependent-hooks-typescript
date: 2026-05-06
status: draft
excerpt: "When useRegister internally calls useAuth().login, the naive test approach (wrapping in a Provider) gets messy fast. The cleaner pattern: mock at the hook boundary using jest.mock, and let TypeScript enforce that your mock matches the real contract."
tags: ["TypeScript", "Testing", "React", "Jest", "Hooks"]
readTime: "6 min read"
---

## The Setup

Testing `useRegister` should be straightforward: call it, simulate a successful registration, assert the state transitions. But `useRegister` has a dependency — it calls `useAuth().login` to store the JWT after a successful registration.

```ts
// src/hooks/useRegister.ts
export function useRegister() {
  const { login } = useAuth(); // dependency
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const register = async (credentials: RegisterCredentials) => {
    setStatus('loading');
    try {
      const res = await fetch('/api/auth/register', { /* ... */ });
      const data = await res.json();
      login(data.user); // stores JWT in AuthContext
      setStatus('success');
    } catch {
      setError('Something went wrong');
      setStatus('error');
    }
  };

  return { status, error, register };
}
```

The test needs to run `useRegister` without a real `AuthContext` in the tree. There are a few ways to approach this — some much cleaner than others.

## The Approach That Works: Mock the Hook, Not the Provider

The temptation is to render a mock `AuthProvider` around the hook under test:

```tsx
// Don't do this
const mockLogin = jest.fn();
const MockProvider = ({ children }) => (
  <AuthContext.Provider value={{ user: null, login: mockLogin, logout: jest.fn() }}>
    {children}
  </AuthContext.Provider>
);

const { result } = renderHook(() => useRegister(), {
  wrapper: MockProvider,
});
```

This works but it's noisy. You're constructing the full context shape manually, and any change to `AuthContextValue` can silently break your mock without TypeScript catching it.

The better approach: mock the `useAuth` hook directly at the module level.

```ts
// src/__tests__/register.test.tsx
jest.mock('@/context/AuthContext', () => ({
  useAuth: jest.fn(),
}));
```

Then in each test, configure what `useAuth` returns:

```ts
import { useAuth } from '@/context/AuthContext';

const mockLogin = jest.fn();

beforeEach(() => {
  (useAuth as jest.Mock).mockReturnValue({
    user: null,
    login: mockLogin,
    logout: jest.fn(),
  });
});
```

Now `useRegister` gets a mock `login` function injected via the mocked `useAuth` — no Provider needed, no render tree to maintain.

## Making TypeScript Enforce the Mock Shape

Casting to `jest.Mock` loses type safety. If `AuthContextValue` adds a new required field, the mock silently doesn't include it.

The fix: use the real return type to constrain the mock.

```ts
import type { AuthContextValue } from '@/context/AuthContext';

const mockAuthContext: AuthContextValue = {
  user: null,
  login: jest.fn(),
  logout: jest.fn(),
  initialized: false,
};

(useAuth as jest.MockedFunction<typeof useAuth>).mockReturnValue(mockAuthContext);
```

`AuthContextValue` is the same interface the real context uses. If you add `initialized` to the real interface and forget to add it to the mock, TypeScript catches it at compile time — not at runtime when a test mysteriously fails.

The types file for this project defines the contract explicitly:

```ts
// src/types/auth.ts
export interface UseRegisterReturn {
  status: 'idle' | 'loading' | 'success' | 'error';
  error: string | null;
  register: (credentials: RegisterCredentials) => Promise<void>;
}
```

This is the same interface the mock must satisfy. Same contract, enforced at compile time.

## Testing the Real Hook While the Module Is Mocked

Here's a subtlety: when you `jest.mock('@/context/AuthContext')`, every import of that module gets the mock — including inside `useRegister` itself. That's exactly what you want.

But in tests that verify the hook's integration with the real auth context, you may want to bypass the module mock for specific tests. Use `jest.requireActual`:

```ts
describe('useRegister with real auth context', () => {
  const { useRegister: useRegisterReal } =
    jest.requireActual<typeof import('@/hooks/useRegister')>('@/hooks/useRegister');

  it('returns idle status initially', () => {
    const { result } = renderHook(() => useRegisterReal(), {
      wrapper: /* real AuthProvider */,
    });
    expect(result.current.status).toBe('idle');
  });
});
```

`jest.requireActual` bypasses the module registry and returns the real implementation. This lets one describe block test against the mock, and another test against the real implementation — in the same file.

## What the Full Test Suite Looks Like

With this setup, the test coverage splits cleanly:

**Hook tests** — mock `useAuth`, test `useRegister` in isolation:
- Status transitions: idle → loading → success
- Error state on failed fetch
- `login` called with correct user data after success
- Network error fallback message

**Component tests** — mock `useRegister`, test `RegisterForm` in isolation:
- Form renders with expected fields
- Loading state disables submit button
- Error message renders on error status
- Submit calls `register` with form values

**Page tests** — mock both, test routing logic:
- Redirects to `/dashboard/boards` after successful registration
- Redirects to `/login` if user is already authenticated

Each layer tests exactly what it owns. Dependencies are mocked at their boundary.

## The Principle

Mock at the hook boundary, not at the Provider level. The hook is the public API your component depends on — that's the contract worth enforcing in tests. Providers are implementation details.

TypeScript-enforced mocks mean: if the contract changes, the tests break at compile time, not at runtime. That's the valuable signal.
