import { useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useScroll, useSpring, useTransform } from 'motion/react'
import { expertise, projects } from '../data/site'
import { Arrow, RevealLines, SectionTag, ease } from './ui'

/** Index of markets; hovering a row floats a study-model image beside the cursor. */
export function Expertise() {
  const [active, setActive] = useState<number | null>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 180, damping: 22, mass: 0.6 })
  const sy = useSpring(y, { stiffness: 180, damping: 22, mass: 0.6 })

  return (
    <section className="section" id="expertise" aria-label="Expertise" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <SectionTag n="03">Expertise</SectionTag>
        <ul
          className="expertise-list"
          onPointerMove={(e) => {
            x.set(e.clientX + 28)
            y.set(e.clientY - 120)
          }}
          onPointerLeave={() => setActive(null)}
        >
          {expertise.map((m, i) => (
            <motion.li
              key={m.name}
              className="expertise-item"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -8% 0px' }}
              transition={{ duration: 1, ease, delay: i * 0.06 }}
            >
              <a className="expertise-row" href="#work" onPointerEnter={() => setActive(i)} onFocus={() => setActive(i)}>
                <span className="index-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="expertise-name">{m.name}</span>
                <span className="expertise-desc">{m.desc}</span>
                <Arrow className="expertise-arrow" />
              </a>
            </motion.li>
          ))}
        </ul>
      </div>

      <motion.div className="cursor-image" style={{ x: sx, y: sy }} aria-hidden="true">
        <AnimatePresence>
          {active !== null && (
            <motion.img
              key={active}
              src={expertise[active].image}
              alt=""
              initial={{ clipPath: 'inset(100% 0 0 0)', scale: 1.2 }}
              animate={{ clipPath: 'inset(0% 0 0 0)', scale: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.3 } }}
              transition={{ duration: 0.8, ease }}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  )
}

/** Selected work as a pinned, horizontally scrolling gallery. */
export function Work() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [distance, setDistance] = useState(0)
  const [desktop, setDesktop] = useState(true)

  useLayoutEffect(() => {
    const mq = window.matchMedia('(min-width: 901px)')
    const measure = () => {
      setDesktop(mq.matches)
      if (trackRef.current) setDistance(Math.max(0, trackRef.current.scrollWidth - window.innerWidth))
    }
    measure()
    const ro = new ResizeObserver(measure)
    if (trackRef.current) ro.observe(trackRef.current)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] })
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.5 })
  const tx = useTransform(smooth, (v) => -v * distance)

  return (
    <section
      className="work"
      id="work"
      ref={sectionRef}
      style={{ height: desktop ? `calc(100svh + ${distance}px)` : 'auto' }}
      aria-label="Selected work"
    >
      <div className="work-sticky">
        <div className="wrap" style={{ width: '100%' }}>
          <SectionTag n="04">Selected work</SectionTag>
          <div className="work-head">
            <RevealLines className="display" lines={['Proof, in', <em key="e">concrete.</em>]} />
            <div className="work-progress" aria-hidden="true">
              <motion.div style={{ scaleX: smooth }} />
            </div>
          </div>
        </div>
        <motion.div className="work-track" ref={trackRef} style={{ x: desktop ? tx : 0 }}>
          {projects.map((p, i) => (
            <motion.article
              key={p.title}
              className="work-card"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.1, ease, delay: Math.min(i, 3) * 0.08 }}
            >
              <div className="media">
                <img src={p.image} alt={`Study model: ${p.title}`} loading="lazy" />
              </div>
              <div className="caption">
                <span className="label">{p.location}</span>
                <span className="index-num">{String(i + 1).padStart(2, '0')}</span>
              </div>
              <h3>{p.title}</h3>
              <div className="work-specs">
                {p.specs.map((s, k) => (
                  <span key={s}>
                    {k > 0 && <span style={{ color: 'var(--stone)', margin: '0 12px' }}>·</span>}
                    {s}
                  </span>
                ))}
              </div>
            </motion.article>
          ))}
          <div style={{ flex: 'none', width: 'var(--gutter)' }} />
        </motion.div>
      </div>
    </section>
  )
}
