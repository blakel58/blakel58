import { useLayoutEffect, useRef, useState } from 'react'
import { motion, useMotionValueEvent, useScroll, useSpring, useTransform } from 'motion/react'
import { links, markets } from '../data/site'
import { MarketArt } from './MarketArt'
import { Button, RevealLines } from './ui'

function useIsDesktop() {
  const query = '(min-width: 861px)'
  const [match, setMatch] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches)
  useLayoutEffect(() => {
    const mq = window.matchMedia(query)
    const on = () => setMatch(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return match
}

/** Markets as a pinned, horizontally scrolling rail on desktop and a stack on mobile. */
export function Markets() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const desktop = useIsDesktop()
  const [distance, setDistance] = useState(0)
  const [active, setActive] = useState(0)

  useLayoutEffect(() => {
    if (!desktop || !trackRef.current) return setDistance(0)
    const el = trackRef.current
    const measure = () => setDistance(Math.max(0, el.scrollWidth - window.innerWidth))
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [desktop])

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] })
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 })
  const x = useTransform(smooth, (v) => -v * distance)

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setActive(Math.min(markets.length - 1, Math.floor(v * markets.length * 1.05)))
  })

  return (
    <section
      className="markets section-dark"
      id="markets"
      ref={sectionRef}
      style={{ height: desktop ? `calc(100svh + ${distance}px)` : 'auto' }}
      aria-label="Markets"
    >
      <div className="markets-sticky">
        <div className="wrap markets-head" style={{ width: '100%' }}>
          <div>
            <div className="mono eyebrow" style={{ marginBottom: 16 }}>
              Markets
            </div>
            <RevealLines className="display" lines={['Five markets.', 'One standard.']} />
          </div>
          <div className="mono markets-count" aria-hidden="true">
            <span style={{ color: 'var(--bone)' }}>{String(active + 1).padStart(2, '0')}</span> /{' '}
            {String(markets.length).padStart(2, '0')} · {markets[active].short}
            <div className="markets-bar">
              <motion.div style={{ scaleX: smooth }} />
            </div>
          </div>
        </div>

        <motion.div className="markets-track" ref={trackRef} style={{ x: desktop ? x : 0 }}>
          {markets.map((m, i) => (
            <article className="market-card" key={m.key}>
              <div className="market-copy">
                <div>
                  <div className="mono market-num">
                    {String(i + 1).padStart(2, '0')} — {m.short}
                  </div>
                  <h3 className="display">{m.title}</h3>
                  <p>{m.body}</p>
                </div>
                <div className="tags">
                  {m.tags.map((t) => (
                    <span className="tag" key={t}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="market-art">
                <MarketArt market={m.key} />
                <span className="mono art-label">
                  Fig. {String(i + 1).padStart(2, '0')}
                </span>
              </div>
            </article>
          ))}
          <div className="markets-end">
            <p>Have a project in one of these markets? Let’s talk early.</p>
            <div>
              <Button href={links.contact}>Start a conversation</Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
