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
  content: string
}

export type PostMeta = Omit<Post, 'content'>

export function getAllPosts(): PostMeta[] {
  const fileNames = fs.readdirSync(postsDirectory)

  return fileNames
    .filter(name => name.endsWith('.md') && !name.startsWith('_'))
    .map(fileName => {
      const filePath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(filePath, 'utf8')
      const { data } = matter(fileContents)
      return data as PostMeta
    })
    .filter(post => post.status === 'published')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const fileNames = fs.readdirSync(postsDirectory)

  const fileName = fileNames.find(name => {
    if (!name.endsWith('.md') || name.startsWith('_')) return false
    const filePath = path.join(postsDirectory, name)
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const { data } = matter(fileContents)
    return data.topic === slug
  })

  if (!fileName) return null

  const filePath = path.join(postsDirectory, fileName)
  const fileContents = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(fileContents)

  // Strip trailing social-media hashtag lines (#ClaudeCode #AI etc.)
  const cleanedContent = content
    .split('\n')
    .filter(line => !line.trim().match(/^(#[A-Za-z]\w*\s*)+$/))
    .join('\n')

  const processed = await remark().use(remarkHtml).process(cleanedContent)

  return {
    ...(data as PostMeta),
    content: processed.toString(),
  }
}
