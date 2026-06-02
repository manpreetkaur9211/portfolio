import { notFound } from 'next/navigation'
import { getAllPosts, getPostBySlug } from '@/lib/blog'
import BlogPostHeader from '@/components/blog/BlogPostHeader'
import JsonLd from '@/components/JsonLd'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map(post => ({ slug: post.topic }))
}

const BASE_URL = 'https://portfolio-chi-ten-51.vercel.app'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return {}

  const url = `${BASE_URL}/blog/${slug}`

  return {
    title: `${post.title} | Manpreet Kaur`,
    description: post.excerpt,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      url,
      siteName: 'Manpreet Kaur',
      publishedTime: post.date,
      authors: ['Manpreet Kaur'],
      tags: post.tags,
      images: [
        {
          url: `${BASE_URL}/og-image.png`,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [`${BASE_URL}/og-image.png`],
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) notFound()

  return (
    <main className="min-h-screen pt-28 pb-20 bg-[#f8fafc] dark:bg-[#0f172a]">
      <JsonLd
        type="article"
        title={post.title}
        description={post.excerpt}
        date={post.date}
        url={`${BASE_URL}/blog/${slug}`}
        tags={post.tags}
      />
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
