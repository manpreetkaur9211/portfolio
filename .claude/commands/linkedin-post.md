---
name: linkedin-post
description: Autonomously identify high-signal learnings from recent Claude Code work and generate LinkedIn posts + companion blog posts for each. No topic argument needed — the skill reads recent git history, changed files, and conversation context to find what was learned, then cross-checks against existing posts to avoid duplication. If a topic argument is provided, use it directly instead of discovering topics automatically.
argument-hint: [optional: specific topic to write about]
disable-model-invocation: true
---

# LinkedIn Post + Blog Generator

Write LinkedIn posts **and** companion blog posts for **Manpreet Kaur** — Senior Full Stack Developer based in Melbourne, Australia.

## Author context
- Senior Full Stack Developer (React, Angular, TypeScript, Node.js, Next.js, AWS)
- 9 years of experience across frontend, backend, and full-stack
- Uses Claude Code daily for real engineering work — not demos, real production workflows
- Tone: genuine, practical, first-person. Not hype. Real experience, real tradeoffs.

## Topic scope
Topics can include anything that represents a meaningful, shareable learning:
- A specific technical concept explained clearly (React patterns, Next.js internals, TypeScript tricks)
- An engineering decision with real tradeoffs (SSG vs SSR, CMS vs files, custom hook vs inline)
- A workflow or tooling improvement (automation, DX, developer habits)
- A mistake diagnosed and turned into a reusable lesson
- An agentic or AI-assisted development insight (Claude Code, skill files, agentic workflows)
- Anything worth the thought "I didn't know that" or "I wish I'd known this earlier"

---

## Step 0 — Discover topics (skip if a specific topic was provided as argument)

If no argument was given, identify post-worthy learnings from recent work:

1. Run `git log --oneline -20` to see recent commits
2. Run `git diff HEAD~5 --name-only` to see recently changed files
3. Read the current conversation context for concepts explained, problems solved, decisions made, or patterns discovered
4. List candidate topics — each must be one distinct, concrete insight (not a vague theme)

Cross-check every candidate against existing posts using the overlap audit below. Remove any that are already covered with the same angle.

Present the shortlist to the user and confirm which to generate — or if the user said "create as many as you want", proceed with all non-overlapping candidates.

---

## Guardrails — run these checks before writing anything

### 1. Overlap audit
Read all existing files in `public/linkedin-posts/` and `src/content/blog/`. Extract the `topic` and `title` from each frontmatter.

Ask: does the incoming topic substantially overlap with any existing post?

- **Same concept, same angle** → do not create a new post. Tell the user it is already covered and name the existing file.
- **Same concept, different angle** → proceed, but the angle must be locked down explicitly before writing. The opening line of both the LinkedIn post and the blog post must make the angle clear and must not drift into the other post's territory during writing.
- **No overlap** → proceed normally.

### 2. One insight per post
Both the LinkedIn post and the blog post must be anchored to exactly one insight, technique, or learning. If the topic naturally contains multiple distinct insights, split them into separate posts. A post that tries to cover two things ends up explaining neither well.

### 3. LinkedIn post vs blog post must not mirror each other
The LinkedIn post teases one concrete, surprising detail to create curiosity. The blog post delivers the full context, reasoning, and evidence. They should not repeat the same sentences or examples. If someone reads both, they should feel the LinkedIn post made them want to read the blog — not that the blog is just the LinkedIn post expanded with filler.

### 4. Blog post must have substance, not padding
A blog post of 600–1200 words must earn its length. It must include at least one of:
- A working code block or command
- A step-by-step breakdown with numbered stages
- A before/after comparison with specific detail
- A decision table or trade-off analysis

If the topic cannot naturally yield any of these, it is too thin for a blog post. Reconsider the topic or combine it with a related concept.

### 5. Slug integrity
The slug must be lowercase, hyphens only, no punctuation, no special characters, no full sentences. It must exactly match the filename (without `.md`) and the `topic` field in frontmatter.

Good: `custom-hooks-intersection-observer`
Bad: `Custom Hooks for Intersection Observer`, `custom_hooks`, `how-i-used-custom-hooks-to-solve-a-problem-in-my-portfolio`

### 6. readTime must reflect actual word count
Estimate at 200 words per minute. Round up to nearest minute.
- ~400 words → 2 min read
- ~600 words → 3 min read
- ~1000 words → 5 min read
- ~1200 words → 6 min read

### 7. No social-media hashtags inside blog post body
Hashtags belong only at the end of the LinkedIn post. The blog post uses the frontmatter `tags` array instead. Any `#Word` pattern in the blog post body will be rendered as an `<h1>` by the markdown parser — do not use them.

### 8. Connection CTA question must be specific
The closing question in the LinkedIn post must be specific enough to prompt a real, considered answer from the reader. It must relate directly to the post's single insight. Generic questions are not acceptable.

Not acceptable: "What do you think?", "Have you tried this?", "Thoughts?"
Acceptable: "When did you last grep your codebase for a duplicated pattern — what did you find?", "What is the most confusing part of Server vs Client Components you had to unlearn?"

---

## Step 1 — Generate the blog post slug

Derive a URL-friendly slug from $ARGUMENTS (lowercase, hyphens only, no special chars).
Example: "skill files as superpowers" → `skill-files-as-superpowers`

The blog post will be live at:
`https://manpreetkaur.dev/blog/<slug>`

Keep this URL — you will include it in the LinkedIn post.

---

## Step 2 — Write the blog post

Write a detailed, long-form blog post (600–1200 words). This is **not** a LinkedIn post — it can and should:

- Explain the concept thoroughly, including the *why* and the *how*
- Include code snippets, commands, or config examples where relevant
- Walk through a real example or scenario step by step
- Cover edge cases, gotchas, or nuances worth knowing
- Be structured with markdown headings (`##`, `###`) for readability
- End with a takeaway or "what to try next" section

**Blog post frontmatter shape:**
```
---
title: "[Descriptive post title]"
topic: <slug>
date: [today's date in YYYY-MM-DD format]
status: draft
excerpt: "[One sentence shown on the blog listing card — make it compelling]"
tags: ["Tag1", "Tag2", "Tag3"]
readTime: "[estimated read time, e.g. '5 min read']"
---
```

Save the blog post to:
`src/content/blog/<slug>.md`

---

## Step 3 — Write the LinkedIn post

Write a LinkedIn post that:

1. **Hooks immediately** — opens with a surprising insight, a number, or a bold statement. No "I'm excited to share..." openers.
2. **Shares one specific, concrete learning** — something Manpreet actually experienced. Specific enough that readers think "I didn't know that."
3. **Shows the before/after or problem/solution** — what changed with an agentic approach vs traditional?
4. **Is practical** — readers can apply something from this post immediately.
5. **Includes the blog link** — before the closing CTA, add a line:
   `Read the full breakdown → https://manpreetkaur.dev/blog/<slug>`
6. **Ends with a connection CTA + question** — always close with two things: (1) a direct invitation for the reader to connect with Manpreet on LinkedIn, and (2) a genuine question asking what *they* are doing in the same space. The question must be specific enough to prompt a real answer, not a generic "what do you think?"
7. **Formatting**: short paragraphs (2–3 lines max), generous line breaks for LinkedIn readability. 1–3 relevant hashtags at the end only. No emoji overload — max 2–3 if they add value.
8. **Length**: 150–250 words. Punchy, not padded.

Save the LinkedIn post to:
`public/linkedin-posts/<slug>.md`

Use this format for the file:

```
---
topic: <slug>
date: [today's date]
status: draft
---

[the LinkedIn post content]
```

---

## Step 4 — Confirm to user

After saving both files, confirm:

```
✅ Blog post saved → src/content/blog/<slug>.md  (status: draft)
✅ LinkedIn post saved → public/linkedin-posts/<slug>.md

To publish the blog post, run /publish-blog and select it from the list.
Once published + deployed, the link in your LinkedIn post will be live.
```
