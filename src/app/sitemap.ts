import { getAllPosts } from '@/lib/blog'
import type { MetadataRoute } from 'next'

const BASE_URL = 'https://portfolio-chi-ten-51.vercel.app'

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts()

  return [
    { url: BASE_URL, lastModified: new Date(), priority: 1 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), priority: 0.8 },
    ...posts.map(p => ({
      url: `${BASE_URL}/blog/${p.topic}`,
      lastModified: new Date(p.date),
      priority: 0.7,
    })),
  ]
}
