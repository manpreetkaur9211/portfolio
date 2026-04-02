import { getAllPosts } from '@/lib/blog'
import { SECTION_DATA } from '@/constants/sectionData'
import BlogCard from '@/components/blog/BlogCard'

export const metadata = {
  title: 'Blog | Manpreet Kaur',
  description: SECTION_DATA.blog.subtitle,
}

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <main className="min-h-screen pt-28 pb-20">
      <div className="section-container">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-portfolio-blue mb-4">
            {SECTION_DATA.blog.title}
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            {SECTION_DATA.blog.subtitle}
          </p>
        </div>

        {/* Grid */}
        {posts.length === 0 ? (
          <p className="text-center text-gray-500">No posts published yet.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {posts.map((post, index) => (
              <BlogCard key={post.topic} post={post} index={index} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
