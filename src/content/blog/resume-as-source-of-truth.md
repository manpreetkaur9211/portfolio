---
title: "Your Portfolio Is Already Out of Date. Here's the Fix."
topic: resume-as-source-of-truth
date: "2026-04-08"
status: draft
excerpt: "Most developers maintain their resume and portfolio as two separate documents. One Claude Code skill file and a PowerShell trick collapsed that into a single command."
tags: ["Claude Code", "Agentic Engineering", "Developer Productivity", "Workflow", "Automation"]
readTime: "5 min read"
---

Every time I updated my resume — a new role, refreshed bullets, a skill added — my portfolio lagged behind by days or weeks. I'd tell myself I'd sync them later. Later never came.

The root cause was treating them as two separate documents. They're not. One is the source of truth. The other is a rendering layer. The moment I started thinking about it that way, the fix became obvious.

## The Architecture That Makes This Possible

My portfolio stores all content in a single file: `src/constants/userData.ts`. Every bullet point, every skill, every bio paragraph lives there. Components just read from it. Nothing is hardcoded.

This matters because it gives an agentic workflow exactly one file to touch. Not five components. Not inline strings scattered across JSX. One file. An agent that only ever writes to `userData.ts` cannot accidentally break layout, styling, or logic.

The resume lives at `public/resume.docx` — the canonical Word document I send to recruiters.

These two files are the contract. The skill keeps them in sync.

## Reading a .docx Without a Parser Library

The first challenge is extracting text from a Word document. Most approaches reach for an npm package. I didn't need one.

On Windows, PowerShell can open and read a Word document directly via COM automation — the same mechanism that Office apps use internally:

```powershell
$docxPath = 'C:\Users\SuperPc\workspace\portfolio-hub\public\resume.docx'
$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Open($docxPath)

$text = $doc.Content.Text
$doc.Close()
$word.Quit()
Write-Output $text
```

This dumps the full document text — every heading, bullet, date, and paragraph — as a flat string. No npm install. No parsing XML inside a zip. No version compatibility issues.

Claude Code can run this directly via Bash (PowerShell is available in WSL and terminal sessions on Windows). The output becomes the raw input for the next step.

## Mapping Resume Sections to the Data Layer

Once the text is extracted, the skill knows exactly which resume sections map to which keys in `userData.ts`:

| Resume section | userData.ts key |
|---|---|
| Name / title line | `personal.name`, `personal.role` |
| Professional summary | `personal.introduction`, `about.paragraphs` |
| Work experience (company, title, dates, bullets) | `experience[]` |
| Skills / competencies | `skills.frontend`, `skills.backend`, `skills.other` |
| Projects | `projects[]` |
| Certifications / courses | `selfLearning.courses[]` |
| Contact details | `contact.*`, `contact.socialLinks` |

The agent reads the current `userData.ts`, diffs it against the extracted resume, and identifies exactly what changed. Not a full rewrite — a minimal, targeted edit.

## What the Diff Output Looks Like

Before applying anything, the skill surfaces a summary:

```
## Changes applied to userData.ts

### Updated
- personal.role: "Senior Full Stack Developer" → "Senior Full-Stack Engineer"
- experience[0].date: "Mar 2023 – Present" → "Mar 2023 – Present" (unchanged)
- experience[0].description: added 2 new bullets (LLM automation, AWS SQS)

### Added
- skills.frontend: React 19 (90%), Next.js (88%)
- skills.other: Docker (78%), Playwright (75%)

### Skipped / needs confirmation
- projects[2] (Exly) not listed in resume — kept in portfolio. Remove it? (y/n)
```

This is the part that earned my trust. The agent doesn't silently delete things that were in the portfolio but not on the resume. It flags them and waits.

That last point matters more than it sounds. A portfolio legitimately contains work that doesn't belong on a resume — side projects, older roles removed to keep the resume to two pages, demo apps. The skill preserves those unless you explicitly say to remove them.

## The Full Workflow in One Command

The complete sequence is:

1. Run `/update-portfolio-from-resume` in Claude Code
2. PowerShell reads `resume.docx`, dumps full text
3. Agent parses against the mapping table above
4. Agent reads current `userData.ts`, computes diff
5. Agent applies edits — no component files touched
6. Agent prints the summary (updated / added / flagged)
7. You confirm, then it commits and pushes

The commit message is auto-generated and descriptive:

```
Sync portfolio content from updated resume

- Update role to Senior Full-Stack Engineer
- Refresh Yeyro bullets: LLM automation, AWS SQS/WebSockets, React 19 dashboards
- Add Next.js, RxJS, Docker, Firebase, Jest/RTL/Playwright to skills
```

From opening the skill to `git push` takes under five minutes. Before, the same sync took 30–45 minutes of side-by-side comparison and manual editing — and I still always missed something.

## Why This Works Better Than a Shared CMS

The tempting alternative is to manage content in a CMS and pull from it for both your resume and portfolio. I chose not to, for a few reasons:

- My resume lives in Word because that's what recruiters and ATS systems expect. I'm not changing that.
- A CMS adds infrastructure cost and complexity to what should be a static site.
- Word + `userData.ts` + a skill file has zero running cost, zero external dependencies, and works offline.

The agentic approach works because the skill file encodes the mapping knowledge that would otherwise live in my head. Every session, Claude Code knows exactly what to extract, where to write it, and what to flag.

## What to Try Next

If your portfolio is a separate document you update manually, this pattern is worth stealing:

1. Consolidate all portfolio content into one data file (or at most two — one for personal data, one for UI labels).
2. Write a skill file that maps your resume sections to that data file's keys.
3. Add the PowerShell COM snippet if you're on Windows, or use a markdown resume as your source if you prefer plain text.

The key shift isn't the tooling — it's deciding which document is the source of truth and letting the other one be derived from it.
