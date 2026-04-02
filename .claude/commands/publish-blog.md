# Skill: Publish Blog Post

## Purpose
Interactively publish one blog post at a time from `src/content/blog/`. Drafts stay hidden from the live site until explicitly published via this skill.

## Steps

### 1. Read all blog posts

Read every `.md` file in `src/content/blog/` that does not start with `_`.

For each file, extract the frontmatter fields: `title`, `topic`, `status`, `date`.

### 2. Separate by status

- **Drafts** — `status: draft` → eligible to publish
- **Published** — `status: published` → already live, skip

### 3. Report to user

Present a numbered list of drafts only:

```
📝 Draft posts (not yet live):

1. "Skill Files Are Superpowers"          (skill-files-as-superpowers)
2. "I Built a Job Scraper..."             (ai-job-scraper-with-claude-code)
3. "Stop Writing Code. Start Describing"  (stop-writing-code-start-describing-outcomes)
4. "How I Automated My Job Search"        (how-i-automated-my-job-search)
5. "Migrating My Portfolio to Next.js"    (vite-to-nextjs-migration)

✅ Already published: (none)

Which post would you like to publish? (enter number or topic slug)
```

If there are no drafts left, say: "All blog posts are already published. Nothing to do."

### 4. Wait for user selection

The user will reply with a number or the topic slug.

### 5. Publish the selected post

In the selected `.md` file, change:
```
status: draft
```
to:
```
status: published
```

Use the Edit tool — do not rewrite the entire file.

### 6. Commit and push automatically

Run the following git commands without asking for confirmation:

```
git add src/content/blog/<filename>.md
git commit -m "publish: <title>"
git push
```

### 7. Confirm

Tell the user:
- Which post was published
- That it has been committed and pushed — Vercel will rebuild automatically
- How many drafts remain

## Notes

- Never publish `_template.md`
- Never change any other frontmatter field
- One post per invocation — if the user wants to publish another, they run `/publish-blog` again
- The build gates on `status: published` — changing the file is enough; no code changes needed
- Always commit and push automatically after publishing — do not ask the user to do it manually
