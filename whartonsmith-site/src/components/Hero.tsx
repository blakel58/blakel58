import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { company, links, r } from '../data/site'
import { Arrow, RevealLines, ease } from './ui'

const Stage = lazy(() => import('../three/Stage').then((m) => ({ default: m.Stage })))

function canRunLive() {
  if (typeof window === 'undefined') return false
  if (!window.matchMedia('(min-width: 900px)').matches) return false
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  try {
    return !!document.createElement('canvas').getContext('webgl2')
  } catch {
    return false
  }
}

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const [live] = useState(canRunLive)
  const [visible, setVisible] = useState(true)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  useEffect(() => {
    if (!ref.current) return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting))
    io.observe(ref.current)
    return () => io.disconnect()
  }, [])

  return (
    <section className="hero" id="top" ref={ref} aria-label="Introduction">
      <div className="hero-stage" aria-hidden="true">
        {!live && (
          <motion.img
            src={r('hero')}
            alt=""
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2, ease }}
          />
        )}
        {live && (
          <Suspense fallback={null}>
            <motion.div
              style={{ position: 'absolute', inset: 0 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2 }}
            >
              <Stage view="hero" interactive active={visible} />
            </motion.div>
          </Suspense>
        )}
      </div>
      <div className="hero-fade" />

      <motion.div className="wrap hero-meta" style={{ opacity: textOpacity }}>
        <motion.span className="label" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 1 }}>
          General contractor · Construction manager · Design-builder
        </motion.span>
        <motion.span className="label" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3, duration: 1 }}>
          Fig. 01 · Water reclamation facility, study model
        </motion.span>
      </motion.div>

      <motion.div className="hero-content" style={{ y: textY, opacity: textOpacity }}>
        <div className="wrap hero-row">
          <RevealLines
            as="h1"
            className="display"
            immediate
            delay={0.5}
            lines={[
              'Built to',
              <>
                <em>endure.</em>
              </>,
            ]}
          />
          <motion.div
            className="hero-side"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease, delay: 1.1 }}
          >
            <p>
              Water, civic and education infrastructure for the communities of the American Southeast, built by
              Wharton-Smith since {company.founded}.
            </p>
            <a className="link" href="#work">
              See the work <Arrow />
            </a>
            <span style={{ display: 'inline-block', width: 28 }} />
            <a className="link" href={links.contact}>
              Start a project <Arrow />
            </a>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
