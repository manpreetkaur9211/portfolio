import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Skills from '@/components/Skills'
import Experience from '@/components/Experience'
import Projects from '@/components/Projects'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import ScrollAnimator from '@/components/ScrollAnimator'
import JsonLd from '@/components/JsonLd'

export default function Home() {
  return (
    <div className="min-h-screen">
      <JsonLd type="person" />
      <ScrollAnimator />
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Projects />
      <Contact />
      <Footer />
    </div>
  )
}
