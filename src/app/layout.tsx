import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'
import Providers from './providers'
import CustomCursor from '@/components/CustomCursor'
import { Analytics } from '@vercel/analytics/next'

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
})

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
})

const BASE_URL = 'https://portfolio-chi-ten-51.vercel.app'

export const metadata: Metadata = {
  title: 'Manpreet Kaur — Senior Full-Stack Engineer, Melbourne',
  description:
    'Manpreet Kaur — Senior Full-Stack Engineer in Melbourne, Australia. Building with React 19, Next.js 15, TypeScript, and Node.js. 10+ years shipping production platforms across healthcare, fintech, and AI.',
  authors: [{ name: 'Manpreet Kaur' }],
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    title: 'Manpreet Kaur — Senior Full-Stack Engineer, Melbourne',
    description:
      'Manpreet Kaur — Senior Full-Stack Engineer in Melbourne, Australia. Building with React 19, Next.js 15, TypeScript, and Node.js. 10+ years shipping production platforms across healthcare, fintech, and AI.',
    type: 'website',
    url: BASE_URL,
    siteName: 'Manpreet Kaur',
    images: [
      {
        url: `${BASE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Manpreet Kaur — Senior Full-Stack Engineer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@manpreetkaur',
    title: 'Manpreet Kaur — Senior Full-Stack Engineer, Melbourne',
    description:
      'Senior Full-Stack Engineer in Melbourne. React 19, Next.js 15, TypeScript, Node.js, AI integrations.',
    images: [`${BASE_URL}/og-image.png`],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`} suppressHydrationWarning>
      <body>
        <CustomCursor />
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  )
}
