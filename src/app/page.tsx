import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Skills from '@/components/Skills'
import Experience from '@/components/Experience'
import Projects from '@/components/Projects'
import SelfLearning from '@/components/SelfLearning'
import SelfProjects from '@/components/SelfProjects'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import ScrollAnimator from '@/components/ScrollAnimator'

export default function Home() {
  return (
    <div className="min-h-screen">
      <ScrollAnimator />
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <SelfLearning />
      <SelfProjects />
      <Experience />
      <Projects />
      <Contact />
      <Footer />
    </div>
  )
}
