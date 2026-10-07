import { useEffect, useRef } from 'react'
import { AnimatePresence, MotionConfig, motion } from 'motion/react'
import Lenis from 'lenis'
import { Footer } from './components/Company'
import { Nav } from './components/Nav'
import { ease } from './components/ui'
import { isDemo } from './data/site'
import { Page } from './pages'
import { useRoute } from './router'

export default function App() {
  const route = useRoute()
  const lenis = useRef<Lenis | null>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    lenis.current = new Lenis({ autoRaf: true, lerp: 0.1 })
    return () => lenis.current?.destroy()
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      <a href="#main" className="skip-link" onClick={(e) => {
        e.preventDefault()
        document.getElementById('main')?.focus()
      }}>
        Skip to content
      </a>
      <Nav route={route} />
      <AnimatePresence
        mode="wait"
        onExitComplete={() => {
          lenis.current ? lenis.current.scrollTo(0, { immediate: true }) : window.scrollTo(0, 0)
        }}
      >
        <motion.main
          key={route}
          id="main"
          tabIndex={-1}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.4 } }}
          exit={{ opacity: 0, transition: { duration: 0.25 } }}
        >
          <Page route={route} />
          <Footer cta={route !== 'contact'} />
        </motion.main>
      </AnimatePresence>
      {/* page-change wipe */}
      <AnimatePresence>
        <motion.div
          key={route}
          className="wipe"
          aria-hidden="true"
          initial={{ scaleY: 1, transformOrigin: 'top' }}
          animate={{ scaleY: 0, transition: { duration: 0.7, ease, delay: 0.15 } }}
        />
      </AnimatePresence>
      {isDemo && <div className="demo-banner">Design preview · placeholder name & projects</div>}
    </MotionConfig>
  )
}
