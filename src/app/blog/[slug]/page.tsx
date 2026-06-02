import { notFound } from 'next/navigation'
import { getAllPosts, getPostBySlug } from '@/lib/blog'
import BlogPostHeader from '@/components/blog/BlogPostHeader'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map(post => ({ slug: post.topic }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return {}
  return {
    title: `${post.title} | Manpreet Kaur`,
    description: post.excerpt,
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) notFound()

  return (
    <main className="min-h-screen pt-28 pb-20 bg-[#f8fafc] dark:bg-[#0f172a]">
      <div className="section-container max-w-3xl">
        <BlogPostHeader post={post} />
        <article
          className="prose prose-lg max-w-none prose-headings:font-heading prose-headings:text-slate-900 dark:prose-headings:text-slate-50 prose-p:text-slate-600 dark:prose-p:text-slate-400 prose-a:text-blue-500 dark:prose-a:text-blue-400 prose-code:text-slate-800 dark:prose-code:text-slate-200 prose-code:bg-slate-100 dark:prose-code:bg-slate-800 prose-code:px-1 prose-code:rounded prose-strong:text-slate-900 dark:prose-strong:text-slate-100 prose-li:text-slate-600 dark:prose-li:text-slate-400"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
    </main>
  )
}
