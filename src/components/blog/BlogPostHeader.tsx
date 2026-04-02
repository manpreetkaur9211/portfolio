import Link from 'next/link'
import { Calendar, Clock, ArrowLeft } from 'lucide-react'
import type { PostMeta } from '@/lib/blog'

interface BlogPostHeaderProps {
  post: PostMeta
}

export default function BlogPostHeader({ post }: BlogPostHeaderProps) {
  return (
    <div className="mb-10">
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-sm text-portfolio-accent hover:text-portfolio-blue transition-colors mb-8"
      >
        <ArrowLeft size={16} />
        Back to Blog
      </Link>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {post.tags.map(tag => (
          <span
            key={tag}
            className="text-xs font-medium bg-blue-50 text-portfolio-accent px-2 py-1 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Title */}
      <h1 className="font-heading text-3xl md:text-4xl font-bold text-portfolio-blue leading-tight mb-4">
        {post.title}
      </h1>

      {/* Meta row */}
      <div className="flex items-center gap-6 text-sm text-gray-500">
        <span className="flex items-center gap-2">
          <Calendar size={14} />
          {new Date(post.date).toLocaleDateString('en-AU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </span>
        <span className="flex items-center gap-2">
          <Clock size={14} />
          {post.readTime}
        </span>
      </div>

      <div className="mt-8 border-t border-gray-200" />
    </div>
  )
}
