import { useEffect, useRef, useState } from 'react'
import { animate, motion, useInView, useReducedMotion } from 'motion/react'
import { stats } from '../data/site'
import { RevealLines, ease } from './ui'

function CountUp({ to, from = 0 }: { to: number; from?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -15% 0px' })
  const reduce = useReducedMotion()
  const [value, setValue] = useState(reduce ? to : from)

  useEffect(() => {
    if (!inView || reduce) return
    const c = animate(from, to, { duration: 2, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => setValue(Math.round(v)) })
    return () => c.stop()
  }, [inView, reduce, from, to])

  return <span ref={ref}>{value}</span>
}

const badges = [
  'ENR Top 400 Contractors',
  'ENR Top 200 Environmental Firms',
  'ENR Southeast Top Contractors',
  'Top Green Southeast Contractor',
  'Top Workplaces',
]

export function Stats() {
  return (
    <section className="stats section-dark" aria-label="Wharton-Smith by the numbers">
      <div className="wrap">
        <div className="stats-head">
          <div>
            <div className="mono eyebrow" style={{ marginBottom: 20 }}>
              By the numbers
            </div>
            <RevealLines className="display" lines={['Four decades.', 'Still building.']} />
          </div>
          <p>
            What started in Central Florida in 1984 is now one of the Southeast’s leading builders, consistently ranked by
            Engineering News-Record among the nation’s top contractors and environmental firms.
          </p>
        </div>

        <div className="stats-grid">
          {stats.map((s, i) => (
            <motion.div
              className="stat"
              key={s.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease, delay: i * 0.1 }}
            >
              <div className="stat-value">
                {s.prefix && <span className="pre">{s.prefix}</span>}
                <CountUp to={s.value} from={s.format === 'year' ? 1900 : 0} />
              </div>
              <div className="stat-label mono">{s.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="badges">
          {badges.map((b, i) => (
            <motion.span
              className="badge"
              key={b}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease, delay: 0.3 + i * 0.06 }}
            >
              <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M8 1l2 4.4 4.8.5-3.6 3.2 1 4.7L8 11.4 3.8 13.8l1-4.7L1.2 5.9 6 5.4z" fill="currentColor" />
              </svg>
              {b}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  )
}
