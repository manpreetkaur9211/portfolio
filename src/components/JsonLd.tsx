interface PersonJsonLdProps {
  type: 'person'
}

interface ArticleJsonLdProps {
  type: 'article'
  title: string
  description: string
  date: string
  url: string
  tags: string[]
}

type JsonLdProps = PersonJsonLdProps | ArticleJsonLdProps

const BASE_URL = 'https://portfolio-chi-ten-51.vercel.app'

export default function JsonLd(props: JsonLdProps) {
  let schema: Record<string, unknown>

  if (props.type === 'person') {
    schema = {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Manpreet Kaur',
      url: BASE_URL,
      image: `${BASE_URL}/og-image.png`,
      jobTitle: 'Senior Full-Stack Engineer',
      worksFor: { '@type': 'Organization', name: 'Yeyro Pty Ltd' },
      address: { '@type': 'PostalAddress', addressLocality: 'Melbourne', addressCountry: 'AU' },
      sameAs: [
        'https://github.com/manpreetkaur',
        'https://linkedin.com/in/manpreetkaur',
      ],
      knowsAbout: ['React', 'Next.js', 'TypeScript', 'Node.js', 'AI integration', 'Claude API'],
    }
  } else {
    schema = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: props.title,
      description: props.description,
      datePublished: props.date,
      author: {
        '@type': 'Person',
        name: 'Manpreet Kaur',
        url: BASE_URL,
      },
      publisher: {
        '@type': 'Person',
        name: 'Manpreet Kaur',
        url: BASE_URL,
      },
      url: props.url,
      image: `${BASE_URL}/og-image.png`,
      keywords: props.tags.join(', '),
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
