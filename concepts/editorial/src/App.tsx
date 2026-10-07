import { useEffect } from 'react'
import { MotionConfig } from 'motion/react'
import Lenis from 'lenis'
import { Careers, Community, Footer, Footprint, HowWeBuild } from './components/Company'
import { Hero } from './components/Hero'
import { Nav } from './components/Nav'
import { Bleed, Statement, Water } from './components/Story'
import { Expertise, Work } from './components/Work'

export default function App() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({ autoRaf: true, anchors: true, lerp: 0.09 })
    return () => lenis.destroy()
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <Statement />
        <Bleed />
        <Water />
        <Expertise />
        <Work />
        <HowWeBuild />
        <Footprint />
        <Community />
        <Careers />
      </main>
      <Footer />
    </MotionConfig>
  )
}
