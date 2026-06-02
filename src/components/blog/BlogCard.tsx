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
      className="bg-white dark:bg-slate-800/40 rounded-xl border border-slate-200/60 dark:border-slate-700/50 p-6 flex flex-col hover:border-blue-500/30 hover:shadow-md dark:hover:border-blue-400/30 transition-all duration-300 animate-fade-in"
      style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}
    >
      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {post.tags.map(tag => (
          <span
            key={tag}
            className="text-xs font-medium bg-slate-100/80 text-slate-700 border border-slate-200/40 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 px-2.5 py-1 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Title */}
      <h2 className="font-heading text-xl font-semibold text-slate-900 dark:text-slate-50 mb-3 leading-snug">
        <Link
          href={`/blog/${post.topic}`}
          className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
        >
          {post.title}
        </Link>
      </h2>

      {/* Excerpt */}
      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6 flex-1">
        {post.excerpt}
      </p>

      {/* Footer row */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700/50">
        <div className="flex items-center gap-4 text-xs text-slate-400 dark:text-slate-500">
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
          className="text-xs font-medium text-blue-500 dark:text-blue-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
        >
          Read post →
        </Link>
      </div>
    </article>
  )
}
