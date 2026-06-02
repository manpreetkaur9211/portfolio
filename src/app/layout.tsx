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

export const metadata: Metadata = {
  title: 'Manpreet Kaur - Full Stack Developer',
  description:
    'Portfolio of Manpreet Kaur, a Full Stack Developer specializing in creating modern web applications and user experiences.',
  authors: [{ name: 'Manpreet Kaur' }],
  openGraph: {
    title: 'Manpreet Kaur - Full Stack Developer',
    description:
      'Portfolio of Manpreet Kaur, a Full Stack Developer specializing in creating modern web applications and user experiences.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@manpreetkaur',
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
