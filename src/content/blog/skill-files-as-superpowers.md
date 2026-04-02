---
title: "Skill Files Are Superpowers"
topic: skill-files-as-superpowers
date: "2026-03-24"
status: draft
excerpt: "A single markdown file replaced a 30-minute onboarding doc for my AI agent — and now every session starts with full context already loaded."
tags: ["Claude Code", "Developer Productivity", "Agentic Engineering"]
readTime: "2 min read"
---

A markdown file just replaced a 30-minute onboarding doc for my AI agent.

In Claude Code, you can create "skill files" — small `.md` files that teach your AI assistant how to handle a specific task, permanently.

I created one called `find-jobs.md`.

Now when I type `/find-jobs`, Claude knows:
- Which sources to scrape (LinkedIn, Seek)
- How to score roles against my skill profile
- When to run a pilot first vs go straight to full scrape
- Where to save results (Google Sheets, 3 tabs)
- What to ask me before proceeding

I wrote that file once. Now every session starts with that full context already loaded — no re-explaining, no drift, no "as I mentioned before."

Before skill files: I was re-prompting the same setup instructions every session.
After: one slash command, and my agent knows exactly what to do.

The real insight — skill files aren't just convenience. They're how you give an AI agent a long-term memory for specific workflows. They make your agent actually yours.

If you're using Claude Code and not writing skill files yet, start with one task you repeat every week. Write the steps as a markdown file. Save it in `.claude/commands/`. That's it.

What workflow would you automate first?
