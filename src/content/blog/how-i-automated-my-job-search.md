---
title: "How I Automated My Job Search with an AI Agent"
topic: how-i-automated-my-job-search
date: "2026-03-24"
status: published
excerpt: "My job search now runs on a slash command — fresh, scored, filtered listings straight to a Google Sheet every week."
tags: ["Automation", "Claude Code", "Job Search"]
readTime: "2 min read"
---

My job search now runs on a slash command.

Every week I type `/find-jobs` and get a fresh, scored, filtered list of React/TypeScript/Next.js roles in Melbourne — sorted by how well they match my actual skill profile — written directly into a Google Sheet.

Here's what's running under the hood:
- Apify scrapes LinkedIn and Seek across 10 keyword searches
- Each job is scored (0–100) based on tech stack match, seniority, and location fit
- Irrelevant roles (Python, DevOps, Java) are filtered out by title
- Results are bucketed into 3 tabs: High-Scale, Mid-Scale, Startups
- Re-runs only add new listings — no duplicates, ever

The whole scraper — from Apify integration to Google Sheets API to deduplication logic — was built with Claude Code. Not prototyped. Actually used, weekly.

The part that stuck with me: when I said "filter out Python roles", it also cleaned the rows already in my sheet from previous runs. It understood that "fix this" meant fixing both present and past state.

Job searching is already stressful. Manually scrolling through irrelevant listings shouldn't be part of it.

If you're job hunting right now, this kind of automation is more accessible than it looks. Happy to share how I set it up.
