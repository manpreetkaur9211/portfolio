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
    <main className="min-h-screen pt-28 pb-20">
      <div className="section-container max-w-3xl">
        <BlogPostHeader post={post} />
        <article
          className="prose prose-lg max-w-none prose-headings:font-heading prose-headings:text-portfolio-blue prose-a:text-portfolio-accent prose-code:text-portfolio-blue prose-code:bg-blue-50 prose-code:px-1 prose-code:rounded"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
    </main>
  )
}
