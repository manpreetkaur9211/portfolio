import Link from 'next/link'
import { Calendar, Clock } from 'lucide-react'
import type { PostMeta } from '@/lib/blog'

interface BlogCardProps {
  post: PostMeta
  index: number
}

export default function BlogCard({ post, index }: BlogCardProps) {
  return (
    <article
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col hover:shadow-md transition-shadow duration-300 animate-fade-in"
      style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}
    >
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
      <h2 className="font-heading text-xl font-semibold text-portfolio-blue mb-3 leading-snug">
        <Link
          href={`/blog/${post.topic}`}
          className="hover:text-portfolio-accent transition-colors"
        >
          {post.title}
        </Link>
      </h2>

      {/* Excerpt */}
      <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-1">
        {post.excerpt}
      </p>

      {/* Footer row */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <Calendar size={12} />
            {new Date(post.date).toLocaleDateString('en-AU', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {post.readTime}
          </span>
        </div>
        <Link
          href={`/blog/${post.topic}`}
          className="text-xs font-medium text-portfolio-accent hover:text-portfolio-blue transition-colors"
        >
          Read post →
        </Link>
      </div>
    </article>
  )
}
