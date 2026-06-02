---
title: "A Git Pre-Push Hook That Fixes Its Own Errors Before Blocking You"
topic: self-healing-pre-push-hook-claude-headless
date: 2026-05-05
status: draft
excerpt: "Instead of a hook that just says 'TypeScript errors found, push blocked' — build one that calls Claude to diagnose and fix the errors first, then retries before deciding to block."
tags: ["Claude Code", "Git Hooks", "CI/CD", "Developer Productivity", "TypeScript"]
readTime: "5 min read"
---

## The Problem with Normal Pre-Push Hooks

A standard pre-push hook runs `tsc --noEmit`, and if it fails, prints something like:

```
TypeScript errors found. Push blocked.
```

Then you fix the errors manually, stage, commit, and push again. The hook caught the problem but did nothing to help you solve it. It's a gate that just says no.

After watching a Vercel build fail four times in a row — each time for a different missing type or broken import — I decided the hook should do more than yell.

## The Setup: Two Files

The approach requires two files:

**`scripts/pre-push`** — committed to the repo, the source of truth:

```bash
#!/bin/sh
echo "Running pre-push checks..."

npx tsc --noEmit
if [ $? -ne 0 ]; then
  echo "TypeScript errors found. Calling Claude to fix..."
  bash .claude/scripts/pre-deploy-sh
  # Retry after Claude's fixes
  npx tsc --noEmit
  if [ $? -ne 0 ]; then
    echo "Build still failing after automated fix attempt. Push blocked."
    exit 1
  fi
fi

npm run build
if [ $? -ne 0 ]; then
  echo "Next.js build failed. Calling Claude to fix..."
  bash .claude/scripts/pre-deploy-sh
  npm run build
  if [ $? -ne 0 ]; then
    echo "Build still failing after automated fix attempt. Push blocked."
    exit 1
  fi
fi

echo "All checks passed."
exit 0
```

**`.claude/scripts/pre-deploy-sh`** — the Claude headless invocation:

```bash
#!/bin/bash
claude -p "$(cat <<'EOF'
The Next.js build has errors. Do the following:
1. Run 'npx tsc --noEmit' and capture any TypeScript errors
2. Run 'npm run build' and capture any Next.js build errors
3. For each error: identify the file, find the root cause
   (broken import path, missing type, wrong env var reference, missing export),
   and apply a minimal fix
4. Re-run both checks to verify
5. Repeat up to 3 times until both pass
6. Report a summary of what was fixed
Do NOT change any logic — only fix compilation and type errors.
EOF
)" \
  --allowedTools "Edit,Read,Bash,Glob,Grep" \
  --max-turns 20
```

**`.git/hooks/pre-push`** — installed locally (not committed, since `.git/` is ignored):

```bash
cp scripts/pre-push .git/hooks/pre-push
chmod +x .git/hooks/pre-push
```

## What Actually Happens

When I run `git push`:

1. Hook runs `tsc --noEmit`
2. If it passes, moves to `npm run build`
3. If either fails, it calls `bash .claude/scripts/pre-deploy-sh`
4. Claude Code runs headlessly — reads the error output, finds the affected files, applies fixes
5. The check runs again
6. If it passes now, the push goes through with no further input from me
7. If it still fails after Claude's attempt, the push is blocked with a clear message

The key constraint in the Claude prompt is: **fix only compilation errors, never logic**. This makes the automation safe — it won't silently change behaviour, only make the code compile.

## A Real Example

I moved several pages into a Next.js route group (`(sidebar)/`) to scope a layout. The move broke four relative imports — paths like `../../ui/skeletons` that no longer resolved from the new directory depth.

Without the hook: push, wait for CI, read the build log, fix locally, push again.

With the hook: `git push` → tsc fails → Claude sees four `Cannot find module` errors → rewrites the four paths to `@/app/ui/skeletons` (the tsconfig alias) → tsc passes → push proceeds.

Total additional time: about 40 seconds. I didn't open a single file.

## The GitHub Actions Layer

The pre-push hook is local-only. Anyone who clones the repo needs to reinstall it with `cp scripts/pre-push .git/hooks/pre-push`. For the cloud gate, I pair it with a GitHub Actions workflow:

```yaml
name: Build Check
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npx tsc --noEmit
      - run: npm run build
        env:
          NEXT_PUBLIC_API_URL: https://placeholder.railway.app/api
```

The hook catches issues before they reach the remote. Actions catches anything that slips through (e.g., someone who hasn't installed the hook).

## What This Changes

The old loop was: push → CI fails → read logs → fix → push again. Sometimes two or three rounds.

Now the loop is: push → hook self-heals if it can → push succeeds or you get a specific failure message. Claude only touches compilation errors so there's no risk of silent behaviour changes.

The part worth noting: Claude's ability to fix these errors headlessly depends entirely on the prompt constraints being tight. "Fix TypeScript errors, do not change logic" is the instruction that keeps this safe. A looser prompt would be a liability.

## What to Try

1. Create `scripts/pre-push` with just the tsc + build checks (no Claude yet) and install it. Get comfortable with the hook running on push.
2. Add `.claude/scripts/pre-deploy-sh` and wire up the self-healing call.
3. Deliberately introduce a broken import, run `git push`, and watch it self-correct.
