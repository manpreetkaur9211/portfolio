---
title: "Ship Features 3x Faster: Parallel Agent Builds Coordinated by TypeScript Contracts"
topic: parallel-agent-feature-building-typescript-contracts
date: 2026-05-05
status: draft
excerpt: "Instead of building data, UI, and tests one after another, define a TypeScript contract first — then let three agents build all three layers at the same time."
tags: ["Claude Code", "TypeScript", "Agentic Development", "Developer Productivity"]
readTime: "6 min read"
---

## The Sequential Trap

Every feature I've built follows the same rhythm: write the hook, then the component that consumes it, then the tests for both. Each layer waits for the previous one to exist before you can start.

That rhythm is so ingrained it feels like physics. It's not.

The dependency isn't really "hook before component." The dependency is **knowing the shape of what the hook returns**. Once you have that shape — a TypeScript interface — the component author and the test author can work from it immediately, even if the implementation doesn't exist yet.

That insight is what parallel agent builds are built on.

## The Setup: Contracts as Coordination

Before spawning any agents, I define two TypeScript interfaces:

```ts
// src/types/auth.ts

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

export interface UseRegisterReturn {
  status: 'idle' | 'loading' | 'error';
  error: string | null;
  register: (credentials: RegisterCredentials) => Promise<boolean>;
}

export interface RegisterFormProps {
  onSuccess: () => void;
  onLoginClick: () => void;
}
```

That's it. Three interfaces, one file. This is the contract. I run `npx tsc --noEmit` to confirm it compiles, then I don't touch it again. Any agent that violates it will get a type error.

## Three Agents, Three Git Worktrees

With the contract locked, I spawn three agents simultaneously using `isolation: "worktree"`. Each gets its own branch and a strict file boundary:

- **Agent 1 (data layer)**: implement `useRegister.ts`. May only touch `src/hooks/` and `src/app/api/`. Must conform to `UseRegisterReturn`.
- **Agent 2 (UI layer)**: implement `RegisterForm.tsx` and `src/app/register/page.tsx`. May only touch `src/app/ui/components/` and `src/app/register/`. Must accept `RegisterFormProps`.
- **Agent 3 (test layer)**: write `src/__tests__/register.test.tsx`. May only read the types and the produced files — never edit them.

Each agent is told: run `npx tsc --noEmit` before finishing, and list every file you touched.

## What Each Agent Produced

**Data agent** (`src/hooks/useRegister.ts`):
```ts
export function useRegister(): UseRegisterReturn {
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();

  const register = async (credentials: RegisterCredentials): Promise<boolean> => {
    setStatus('loading');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error?.message ?? 'Registration failed. Please try again.');
        setStatus('error');
        return false;
      }
      login(data.data);
      setStatus('idle');
      return true;
    } catch {
      setError('Network error. Please check your connection and try again.');
      setStatus('error');
      return false;
    }
  };

  return { status, error, register };
}
```

**UI agent** produced a MUI-styled form that consumes the hook, shows "Registering..." while loading, and calls `onSuccess` only if `register()` returns `true`.

**Test agent** produced 20 tests across three suites — hook state transitions, component rendering, and page routing — all mocked against the contract, not the implementation.

## The Merge Order

Contracts fix sequencing: merge data first (the hook exists), then UI (component can import the real hook), then tests (both targets exist).

```bash
git merge feature/register-data
git merge feature/register-ui
git merge feature/register-tests
```

Three branches, each built in parallel, all passing `tsc --noEmit` independently.

## Why This Works

The contract acts as a shared fixture. An agent testing the component doesn't need the hook to exist — it needs to know what the hook returns so it can mock it accurately. The mock is derived from the interface, not the implementation.

This is exactly how human team parallelism works when it works well: backend and frontend teams agree on an API schema, then build in parallel. The schema is the synchronisation point, not the code.

## What to Try

1. Next time you add a hook + component pair, write the return type interface first and commit it separately.
2. Try spawning two agents — one for the hook, one for the component — and see whether the type boundary holds without any coordination message between them.
3. If either agent produces a type error against the contract, that error is informative. It tells you the contract was underspecified, not that the agent failed.

The contract review step — the gate before spawning — is the real work. Everything after that is execution.
