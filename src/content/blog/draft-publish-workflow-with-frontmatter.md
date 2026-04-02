---
title: "A Draft/Publish Workflow Without a CMS Dashboard"
topic: draft-publish-workflow-with-frontmatter
date: "2026-04-01"
status: draft
excerpt: "How a single frontmatter field and a Claude Code skill file replace a CMS publish button — with full control over what goes live and when."
tags: ["Next.js", "Claude Code", "Content Management", "Workflow", "SSG"]
readTime: "5 min read"
---

Every CMS has a publish button. Contentful has one. Sanity has one. WordPress has one.

When I built a markdown-based blog with no CMS, I still needed the same capability: write content privately, review it, decide when it goes live. The question was how to replicate that without a dashboard.

The answer turned out to be simpler than expected: one frontmatter field and a Claude Code skill file.

## The Frontmatter Gate

Every blog post in `src/content/blog/` has a `status` field in its YAML frontmatter:

```yaml
---
title: "My Post Title"
topic: my-post-slug
date: "2026-04-01"
status: draft        # ← the gate
excerpt: "..."
tags: ["Tag1"]
readTime: "3 min read"
---
```

The `getAllPosts()` function — the only place that reads blog content — filters on this field:

```ts
export function getAllPosts(): PostMeta[] {
  return fs.readdirSync(postsDirectory)
    .filter(name => name.endsWith('.md') && !name.startsWith('_'))
    .map(fileName => {
      const { data } = matter(fs.readFileSync(...))
      return data as PostMeta
    })
    .filter(post => post.status === 'published')   // ← the gate
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}
```

A draft file can exist in git, be deployed to Vercel, and still never appear on the live blog. The build reads it, sees `status: draft`, and skips it. No special routing, no password protection, no environment variable toggle — the content simply does not exist in the output.

## The Problem with Manual Status Changes

This works well mechanically. The friction is human: to publish a post, you open the file, change `draft` to `published`, save, stage, commit, push. That is four steps with an open editor and a terminal. Easy to forget which posts are still drafts. Easy to accidentally publish the wrong one.

A CMS solves this with a UI — a list of drafts, a toggle, a confirmation. The equivalent for a markdown blog is a script or a skill file.

## The `/publish-blog` Skill

I built a Claude Code skill file at `.claude/commands/publish-blog.md`. When invoked with `/publish-blog`, it:

1. Reads every `.md` file in `src/content/blog/` (skipping `_template.md`)
2. Parses frontmatter with `gray-matter`
3. Separates posts into `draft` and `published`
4. Prints a numbered list of drafts only:

```
📝 Draft posts (not yet live):

1. "A Draft/Publish Workflow Without a CMS Dashboard"   (draft-publish-workflow-with-frontmatter)
2. "CSS vs JS Scroll Animations"                         (css-vs-js-scroll-animations)
3. "Active Nav Links in Next.js Mixed Route Navbars"     (active-nav-links-nextjs-mixed-routes)

✅ Already published: (3 posts)

Which post would you like to publish?
```

5. Waits for input — a number or a slug
6. Uses the `Edit` tool to change exactly one line in the chosen file: `status: draft` → `status: published`
7. Confirms and tells you what to commit

The skill never touches any other frontmatter field. It never rewrites the file. One targeted line change, nothing else.

## The Full Workflow

```
Write post
  → status: draft (invisible on live site)
  → commit and push freely (drafts deploy but don't appear)

Review it live locally
  → npm run dev → visit /blog → post is missing (expected)
  → visit /blog/my-post-slug directly → 404 (not in generateStaticParams output)

When ready to publish
  → /publish-blog
  → pick number from list
  → git add src/content/blog/my-post-slug.md
  → git commit -m "publish: My Post Title"
  → git push
  → Vercel rebuilds → post appears on /blog
```

## Why This Beats an Environment Variable Toggle

A common alternative is to gate posts with `NEXT_PUBLIC_SHOW_DRAFTS=true` locally. The problem: it applies to all drafts at once. You cannot selectively preview one post without showing all others.

The frontmatter field is per-post. You can have ten drafts and publish exactly one. The others remain invisible until you explicitly choose them.

## The Template

To make sure every new post starts with the right shape, there is a `_template.md` file in the same directory. Files starting with `_` are excluded from the post list in `getAllPosts()`:

```markdown
---
title: "Your Post Title Here"
topic: your-post-slug
date: "YYYY-MM-DD"
status: draft
excerpt: "One sentence shown on the blog listing card."
tags: ["Tag1", "Tag2"]
readTime: "X min read"
---

Your post content here...
```

Copy it, rename it to your slug, fill in the frontmatter, write. The `_` prefix convention means the template is always there as a reference but never appears in the live blog.

## What to Try Next

If you have a markdown-based blog or are building one, adding the status gate takes about five minutes:

1. Add `status: draft` to every existing post's frontmatter
2. Add `.filter(post => post.status === 'published')` to your `getAllPosts()` function
3. Re-run your build — existing posts without `status: published` will disappear

That last step is the useful test. Seeing posts disappear from the build output confirms the gate works. Then flip them back to `published` one by one.

The pattern works the same way for any statically generated content — not just blog posts. Featured case studies, changelog entries, announcements — anything where you want draft/live control without a CMS dashboard.
