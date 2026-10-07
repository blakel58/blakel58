import { useState } from 'react'
import { motion } from 'motion/react'
import { offices } from '../data/site'
import { RevealLines, ease } from './ui'

// Simple equirectangular projection over the Gulf/South Atlantic region.
const W = 1000
const H = 700
const LON0 = -97
const LAT1 = 36.5
const K = W / (19 * Math.cos((30 * Math.PI) / 180))
const project = (lon: number, lat: number) => ({
  x: (lon - LON0) * Math.cos((30 * Math.PI) / 180) * K,
  y: (LAT1 - lat) * K,
})

// Hand-simplified coastline, Corpus Christi → Wilmington.
const COAST: [number, number][] = [
  [-97.4, 27.8], [-96.5, 28.4], [-95.0, 29.2], [-94.0, 29.7], [-93.3, 29.8], [-92.0, 29.6], [-91.2, 29.2],
  [-90.2, 29.1], [-89.4, 28.9], [-89.6, 29.6], [-89.6, 30.2], [-88.8, 30.4], [-88.0, 30.7], [-87.5, 30.3],
  [-86.5, 30.4], [-85.6, 30.1], [-85.3, 29.7], [-84.3, 30.0], [-83.6, 29.9], [-83.0, 29.2], [-82.7, 28.7],
  [-82.8, 28.0], [-82.6, 27.5], [-82.2, 26.9], [-81.8, 26.1], [-81.3, 25.6], [-80.9, 25.2], [-80.4, 25.2],
  [-80.1, 25.8], [-80.0, 26.7], [-80.1, 27.2], [-80.4, 27.8], [-80.6, 28.4], [-80.9, 29.0], [-81.2, 29.8],
  [-81.4, 30.4], [-81.4, 31.0], [-81.2, 31.6], [-80.9, 32.1], [-80.4, 32.5], [-79.9, 32.8], [-79.2, 33.3],
  [-78.6, 33.9], [-77.9, 34.1],
]
const coastPts = COAST.map(([lon, lat]) => project(lon, lat))
const coastPath = coastPts.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ')
const landPath = `${coastPath} L${W + 20} -20 L-20 -20 L-20 ${coastPts[0].y.toFixed(1)} Z`

const ALWAYS_LABEL = new Set(['Sanford', 'Charlotte', 'Houston', 'Baton Rouge', 'Pensacola'])

const hq = offices.find((o) => o.hq)!
const hqPt = project(hq.lon, hq.lat)

export function Footprint() {
  const [active, setActive] = useState<string | null>(null)
  const pts = offices.map((o) => ({ ...o, ...project(o.lon, o.lat) }))

  return (
    <section className="footprint section-dark" id="footprint" aria-label="Office locations">
      <div className="wrap footprint-grid">
        <div className="footprint-copy">
          <div className="mono eyebrow">Our footprint</div>
          <RevealLines className="display" lines={['Rooted in Sanford.', 'Built across', 'the Southeast.']} />
          <p>
            Eleven offices in four states, each staffed by people who live in the communities they build for, backed by
            the resources of our Sanford headquarters.
          </p>
          <ul className="office-list" onPointerLeave={() => setActive(null)}>
            {offices.map((o) => (
              <li key={o.name}>
                <button
                  className={active === o.name ? 'is-active' : ''}
                  onPointerEnter={() => setActive(o.name)}
                  onFocus={() => setActive(o.name)}
                  onBlur={() => setActive(null)}
                >
                  {o.name}
                  <span className="mono">{o.hq ? 'HQ' : o.state}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <motion.div
          className="map"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.35 }}
          aria-hidden="true"
        >
          <svg viewBox={`0 0 ${W} ${H}`}>
            <defs>
              <pattern id="dots" width="14" height="14" patternUnits="userSpaceOnUse">
                <circle cx="7" cy="7" r="1.6" fill="rgba(239,235,227,0.22)" />
              </pattern>
              <clipPath id="land">
                <path d={landPath} />
              </clipPath>
            </defs>

            <motion.rect
              width={W}
              height={H}
              fill="url(#dots)"
              clipPath="url(#land)"
              variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 1.2 } } }}
            />
            <motion.path
              d={coastPath}
              fill="none"
              stroke="rgba(239,235,227,0.4)"
              strokeWidth={1.2}
              variants={{
                hidden: { pathLength: 0 },
                show: { pathLength: 1, transition: { duration: 2.4, ease } },
              }}
            />

            {pts
              .filter((p) => !p.hq)
              .map((p, i) => {
                const mx = (hqPt.x + p.x) / 2
                const my = (hqPt.y + p.y) / 2 - Math.hypot(p.x - hqPt.x, p.y - hqPt.y) * 0.35
                const on = active === p.name
                return (
                  <motion.path
                    key={p.name}
                    d={`M${hqPt.x} ${hqPt.y} Q${mx} ${my} ${p.x} ${p.y}`}
                    fill="none"
                    stroke={on ? 'var(--accent)' : 'rgba(255,91,31,0.5)'}
                    strokeWidth={on ? 2 : 1.2}
                    strokeDasharray={on ? undefined : '4 5'}
                    variants={{
                      hidden: { pathLength: 0, opacity: 0 },
                      show: { pathLength: 1, opacity: 1, transition: { duration: 1.4, ease, delay: 0.8 + i * 0.08 } },
                    }}
                  />
                )
              })}

            {pts.map((p, i) => {
              const on = active === p.name
              const label = ALWAYS_LABEL.has(p.name) || on
              return (
                <motion.g
                  key={p.name}
                  variants={{
                    hidden: { opacity: 0, scale: 0 },
                    show: { opacity: 1, scale: 1, transition: { duration: 0.5, ease, delay: p.hq ? 0.5 : 1.4 + i * 0.08 } },
                  }}
                >
                  {(p.hq || on) && (
                    <motion.circle
                      cx={p.x}
                      cy={p.y}
                      fill="none"
                      stroke="var(--accent)"
                      initial={{ r: 6, opacity: 0.9 }}
                      animate={{ r: 30, opacity: 0 }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
                    />
                  )}
                  <circle cx={p.x} cy={p.y} r={p.hq ? 9 : on ? 7 : 5} fill={p.hq || on ? 'var(--accent)' : 'var(--bone)'} />
                  {label && (
                    <text
                      x={p.x + (p.name === 'Charlotte' || p.hq ? 16 : 0)}
                      y={p.y + (p.name === 'Charlotte' || p.hq ? 5 : -16)}
                      textAnchor={p.name === 'Charlotte' || p.hq ? 'start' : 'middle'}
                      className="map-label"
                      style={on || p.hq ? { fill: 'var(--bone)' } : undefined}
                    >
                      {p.hq ? 'Sanford HQ' : p.name}
                    </text>
                  )}
                </motion.g>
              )
            })}
          </svg>
        </motion.div>
      </div>
    </section>
  )
}
