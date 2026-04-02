---
title: "I Built a Job Scraper with Claude Code in Zero Hours"
topic: ai-job-scraper-with-claude-code
date: "2026-03-24"
status: draft
excerpt: "How I described what I wanted to an AI agent and got a full Apify + Google Sheets job scraper — without writing a line from scratch."
tags: ["Claude Code", "Agentic Engineering", "Automation"]
readTime: "2 min read"
---

I spent 0 hours writing a job scraper from scratch.

Instead, I described what I wanted to Claude Code:
- Scrape LinkedIn + Seek for React/TypeScript/Next.js roles in Melbourne
- Score each job against my skill profile
- Auto-classify by company size (startup / mid / high-scale)
- Write results into a Google Sheet — no duplicates, ever

It built the whole thing. Apify integration, Google Sheets API, deduplication logic, match scoring — all of it.

But here's what actually surprised me:

When I said "Python roles are showing up — remove them", it didn't just add a filter.
It added an `EXCLUDED_TITLE_PATTERNS` constant, wired a `#isRelevant()` method into the pipeline, and also ran a cleanup pass against my existing sheet to remove rows that were already there.

I asked for one thing. It fixed the present AND the past.

That's the shift with agentic engineering — you stop thinking in tasks and start thinking in outcomes. You describe the world you want, not the steps to get there.

I now run `/find-jobs` weekly. Fresh, filtered, scored listings straight to my sheet. Zero manual effort.

If you're still hand-crafting scrapers line by line, it's worth trying a different approach.

What's the most useful thing you've automated with an AI agent recently?
