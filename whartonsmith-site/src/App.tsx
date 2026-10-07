import { useEffect } from 'react'
import { MotionConfig } from 'motion/react'
import Lenis from 'lenis'
import { Careers, Crew, Footer, Locations } from './components/Company'
import { Commercial, Divisions, Water } from './components/Divisions'
import { Hero, Ticker } from './components/Hero'
import { Nav } from './components/Nav'
import { Process } from './components/Process'
import { Technology } from './components/Tech'
import { isDemo } from './data/site'

export default function App() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({ autoRaf: true, anchors: true, lerp: 0.1 })
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
        <Ticker />
        <Divisions />
        <Water />
        <Commercial />
        <Technology />
        <Process />
        <Crew />
        <Locations />
        <Careers />
      </main>
      <Footer />
      {isDemo && <div className="demo-banner">Design preview · placeholder name & projects</div>}
    </MotionConfig>
  )
}
