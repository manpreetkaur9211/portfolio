---
name: linkedin-post
description: Generate and save a LinkedIn post about agentic engineering, Claude Code, or AI-assisted development learnings. Use when user wants to write a LinkedIn post, create content about agentic workflows, or share learnings about Claude Code.
argument-hint: [topic]
disable-model-invocation: true
---

# LinkedIn Post Generator

Write a LinkedIn post for **Manpreet Kaur** — Senior Full Stack Developer based in Melbourne, Australia — about agentic engineering, Claude Code, or AI-assisted development.

**Topic:** $ARGUMENTS

## Author context
- Senior Full Stack Developer (React, Angular, TypeScript, Node.js, Next.js, AWS)
- Using Claude Code daily for real engineering work — not demos, real production workflows
- Has built: an AI-powered job scraper (LinkedIn + Seek → Google Sheets), portfolio site, automated deploy pipelines — all agentic
- Tone: genuine, practical, first-person. Not hype. Real experience.

## Post requirements

Write a LinkedIn post that:

1. **Hooks immediately** — opens with a surprising insight, a number, or a bold statement. No "I'm excited to share..." openers.
2. **Shares one specific, concrete learning** — something Manpreet actually experienced building with Claude Code. Make it specific enough that readers think "I didn't know that."
3. **Shows the before/after or the problem/solution** — what changed when using an agentic approach vs traditional?
4. **Is practical** — readers should be able to apply or try something from this post
5. **Ends with a CTA or question** — invite discussion, ask what others are doing, or point to something actionable
6. **Formatting**: short paragraphs (2-3 lines max), use line breaks generously for LinkedIn readability. 1-3 relevant hashtags at the end only. No emoji overload — max 2-3 if they add value.
7. **Length**: 150–250 words. Punchy, not padded.

## Save the post

After writing the post, save it to:
`public/linkedin-posts/$ARGUMENTS.md`

Use this format for the file:

```
---
topic: $ARGUMENTS
date: [today's date]
status: draft
---

[the post content]
```

Confirm to the user: "Post saved to `public/linkedin-posts/$ARGUMENTS.md` — review it, tweak if needed, then copy-paste to LinkedIn."
