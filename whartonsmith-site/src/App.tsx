import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, MotionConfig } from 'motion/react'
import Lenis from 'lenis'
import { Careers } from './components/Careers'
import { Community } from './components/Community'
import { Footer } from './components/Footer'
import { Footprint } from './components/Footprint'
import { Hero } from './components/Hero'
import { Markets } from './components/Markets'
import { Marquee } from './components/Marquee'
import { Nav } from './components/Nav'
import { Preloader } from './components/Preloader'
import { Projects } from './components/Projects'
import { Services } from './components/Services'
import { Stats } from './components/Stats'
import { Statement } from './components/Statement'

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

function seenIntro() {
  try {
    return sessionStorage.getItem('ws-intro') === '1'
  } catch {
    return false
  }
}

export default function App() {
  const [loading, setLoading] = useState(() => !reducedMotion() && !seenIntro())
  const finish = useCallback(() => {
    setLoading(false)
    try {
      sessionStorage.setItem('ws-intro', '1')
    } catch {
      /* storage unavailable */
    }
  }, [])

  useEffect(() => {
    if (reducedMotion()) return
    const lenis = new Lenis({ autoRaf: true, anchors: { offset: 0 }, lerp: 0.1 })
    return () => lenis.destroy()
  }, [])

  useEffect(() => {
    document.documentElement.style.overflow = loading ? 'hidden' : ''
  }, [loading])

  return (
    <MotionConfig reducedMotion="user">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <AnimatePresence>{loading && <Preloader onDone={finish} />}</AnimatePresence>
      <Nav />
      <main id="main">
        <Hero ready={!loading} />
        <Marquee />
        <Statement />
        <Markets />
        <Services />
        <Stats />
        <Projects />
        <Footprint />
        <Community />
        <Careers />
      </main>
      <Footer />
    </MotionConfig>
  )
}
