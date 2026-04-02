---
title: "Building a Blog with No CMS, No Database, and No API Calls"
topic: git-based-blog-no-cms
date: "2026-04-01"
status: draft
excerpt: "My portfolio blog is powered by markdown files, three npm packages, and Next.js SSG — no Contentful, no Sanity, no infrastructure cost."
tags: ["Next.js", "SSG", "Blog", "Markdown", "TypeScript"]
readTime: "7 min read"
---

Every time I looked at adding a blog to my portfolio, I'd end up in the same place: evaluating CMSs.

Contentful — free tier, but API rate limits and a content model to configure. Sanity — great DX, but another service to manage. Notion as a CMS — clever, but now my blog depends on Notion's uptime. Netlify CMS — deprecated. Ghost — separate server.

None of it felt right for a personal portfolio. I just want to write markdown, push to git, and have it appear on my site.

So that's exactly what I built.

## The Stack

```
gray-matter   → parse YAML frontmatter from .md files
remark        → convert markdown content to HTML AST
remark-html   → serialize that AST to an HTML string
Next.js SSG   → generateStaticParams() to pre-render every post at build time
```

Three npm packages. No database. No API. No authentication. The blog is just files in `src/content/blog/`.

## File Structure

```
src/content/blog/
  _template.md                          ← copy this to create new posts (gitignored from listing)
  git-based-blog-no-cms.md             ← this post
  server-components-and-ssg.md
  custom-hooks-intersection-observer.md
```

Each post is a `.md` file with YAML frontmatter:

```markdown
---
title: "Building a Blog with No CMS, No Database, and No API Calls"
topic: git-based-blog-no-cms
date: "2026-04-01"
status: draft
excerpt: "One compelling sentence shown on the listing card."
tags: ["Next.js", "SSG", "Blog"]
readTime: "7 min read"
---

Post content here...
```

The `topic` field doubles as the URL slug. `status: draft` hides the post from the live site — only `status: published` posts appear.

## The Blog Utility (`src/lib/blog.ts`)

This is the only server-side file that touches the filesystem. It never runs in the browser.

```ts
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import remarkHtml from 'remark-html'

const postsDirectory = path.join(process.cwd(), 'src', 'content', 'blog')

export interface Post {
  title: string
  topic: string
  date: string
  status: string
  excerpt: string
  tags: string[]
  readTime: string
  content: string  // rendered HTML
}

export type PostMeta = Omit<Post, 'content'>
```

### `getAllPosts()` — for the listing page

```ts
export function getAllPosts(): PostMeta[] {
  return fs.readdirSync(postsDirectory)
    .filter(name => name.endsWith('.md') && !name.startsWith('_'))
    .map(fileName => {
      const filePath = path.join(postsDirectory, fileName)
      const { data } = matter(fs.readFileSync(filePath, 'utf8'))
      return data as PostMeta
    })
    .filter(post => post.status === 'published')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}
```

Two key details:
- Files starting with `_` are skipped (`_template.md` never appears in the listing)
- Only `status: published` posts make it through the filter — drafts are invisible even if the file exists in git

### `getPostBySlug()` — for the post page

```ts
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const fileNames = fs.readdirSync(postsDirectory)

  const fileName = fileNames.find(name => {
    if (!name.endsWith('.md') || name.startsWith('_')) return false
    const { data } = matter(fs.readFileSync(path.join(postsDirectory, name), 'utf8'))
    return data.topic === slug
  })

  if (!fileName) return null

  const { data, content } = matter(
    fs.readFileSync(path.join(postsDirectory, fileName), 'utf8')
  )

  const processed = await remark().use(remarkHtml).process(content)

  return { ...(data as PostMeta), content: processed.toString() }
}
```

`remark().use(remarkHtml).process(content)` converts the markdown body to an HTML string. The component renders it with `dangerouslySetInnerHTML` — safe here because the content is authored by you from local files, not from user input.

## The Pages

### Blog listing (`src/app/blog/page.tsx`)

```tsx
import { getAllPosts } from '@/lib/blog'

export default function BlogPage() {
  const posts = getAllPosts()  // runs at build time only
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {posts.map((post, index) => (
        <BlogCard key={post.topic} post={post} index={index} />
      ))}
    </div>
  )
}
```

This is a Server Component. `getAllPosts()` uses `fs` — Node.js only — so it never leaks into the client bundle. The posts data is baked into the static HTML at build time.

### Individual post (`src/app/blog/[slug]/page.tsx`)

```tsx
import { getAllPosts, getPostBySlug } from '@/lib/blog'

export async function generateStaticParams() {
  return getAllPosts().map(post => ({ slug: post.topic }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  return { title: `${post.title} | Manpreet Kaur`, description: post.excerpt }
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  return (
    <article
      className="prose prose-lg max-w-none"
      dangerouslySetInnerHTML={{ __html: post.content }}
    />
  )
}
```

`generateStaticParams()` is the key function. It tells Next.js which slugs to pre-render at build time. For 5 posts, Next.js generates 5 HTML files — no server needed at runtime.

The build output confirms it:

```
Route (app)
├ ○ /blog
└ ● /blog/[slug]
  ├ /blog/git-based-blog-no-cms
  ├ /blog/server-components-and-ssg
  ├ /blog/custom-hooks-intersection-observer
  └ [+2 more paths]

○  (Static)   prerendered as static content
●  (SSG)      prerendered as static HTML (uses generateStaticParams)
```

Every post is a static HTML file on Vercel's CDN. Zero compute at request time.

## The Draft/Publish Workflow

New post workflow:
1. Copy `_template.md`, rename to `my-post-slug.md`
2. Fill in frontmatter — `status: draft`
3. Write content
4. When ready: change `status: draft` → `status: published`
5. `git add src/content/blog/my-post-slug.md && git commit -m "publish: My Post Title" && git push`
6. Vercel rebuilds → post is live

I've wrapped step 4 into a `/publish-blog` Claude Code skill that reads all draft posts, lists them, and asks which one to publish. It then edits the frontmatter automatically — I just pick a number.

## The Prose Styling

`@tailwindcss/typography` handles the rendered HTML styling with zero custom CSS:

```tsx
<article className="prose prose-lg max-w-none prose-headings:font-heading prose-headings:text-portfolio-blue prose-a:text-portfolio-accent" />
```

`prose-headings:text-portfolio-blue` and `prose-a:text-portfolio-accent` apply my portfolio colour palette to the rendered markdown without writing a single line of custom CSS. The typography plugin knows how to style `h1`–`h6`, `p`, `ul`, `ol`, `code`, `pre`, `blockquote` — all of it.

## What This Costs

Vercel: free tier. No backend. No database. No CMS subscription. The blog is markdown files in a git repo — backed up by git history, editable in any text editor, portable to any static host.

The only constraint: new posts require a redeploy. For a personal blog that publishes every few days or weeks, that's not a constraint at all — it's a feature. Every post goes through git, which means every post has a history.

## What to Try Next

If you have a portfolio site and want to add a blog:

1. Install: `npm install gray-matter remark remark-html`
2. Create `src/content/blog/` with one `.md` file
3. Write `getAllPosts()` and `getPostBySlug()` as shown above
4. Add `src/app/blog/page.tsx` and `src/app/blog/[slug]/page.tsx`
5. Run `npm run build` — your post should appear as a static route

Total setup time: under an hour. Ongoing cost: zero.
