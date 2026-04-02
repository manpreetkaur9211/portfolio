---
title: "Migrating My Portfolio from Vite to Next.js with Claude Code"
topic: vite-to-nextjs-migration
date: "2026-03-27"
status: published
excerpt: "A real migration — not a tutorial. 14 steps done agentically, build errors diagnosed and turned into permanent skill improvements."
tags: ["Next.js", "Claude Code", "Migration", "Agentic Engineering"]
readTime: "2 min read"
---

I migrated my entire portfolio from Vite + React Router to Next.js in one session with Claude Code.

Not a tutorial. Not a demo. A real migration — 14 steps, file deletions, tsconfig rewrites, env var renames, component audits — done agentically.

Here's the part that changed how I think about AI-assisted engineering:

The agent hit build errors. Instead of me debugging them, I asked it to diagnose *why* they happened and patch the migration skill it was following.

It found the root cause: it was reading a few components manually and assuming the rest were fine. 5 components using hooks silently failed at build time.

The fix? A single grep command added to the skill:

```
grep -rl "useState|useEffect|useRef|window." src/components/
```

Now that skill runs the grep *before* classifying components — every future migration gets that check automatically.

The skill got smarter from the mistake. That's the part traditional tooling can't do.

Before: I'd debug the error, fix it, move on, forget it.
After: The error becomes a permanent improvement to the process.

If you're still using AI as a smarter autocomplete, you're leaving the most valuable part on the table.

If this resonates, let's connect — I'm always up for talking agentic workflows with people building in this space.

What does your team do when an AI-assisted workflow fails? Fix and forget, or fix and improve?
