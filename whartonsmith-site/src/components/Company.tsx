import { useState } from 'react'
import { motion } from 'motion/react'
import { careersImage, company, isDemo, links, nav, offices, roles, selfPerformImage, trades } from '../data/site'
import { Logo } from './Nav'
import { Arrow, CountUp, Fade, Lines, Shot, Station, ease } from './ui'

export function Crew() {
  return (
    <>
      <div className="hazard-band" aria-hidden="true" />
      <section className="section dark grain" aria-label="Self-perform and safety">
        <div className="wrap">
          <Station sta="5+00" right="Our people">
            Self-Perform & Safety
          </Station>
          <div className="sp-grid">
            <div>
              <div className="sp-num">
                <CountUp to={120} />
                <em>+</em>
              </div>
              <Lines className="display" lines={['Our own crews.', <span key="h" className="hl">Our own standards.</span>]} />
              <Fade delay={0.1}>
                <p className="section-lede">
                  More than 120 craft professionals on our payroll self-perform the work that drives schedule and
                  quality, so owners get more certainty on cost, time and safety.
                </p>
                <div className="trades">
                  {trades.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
              </Fade>
            </div>
            <div className="sp-media">
              <Shot image={selfPerformImage} alt="Self-perform crew at work" />
            </div>
          </div>

          <motion.div
            className="safety-strip"
            initial={{ clipPath: 'inset(0 100% 0 0)' }}
            whileInView={{ clipPath: 'inset(0 0% 0 0)' }}
            viewport={{ once: true, margin: '0px 0px -10% 0px' }}
            transition={{ duration: 1, ease }}
          >
            <h2 className="display">
              Everyone
              <br />
              goes home.
            </h2>
            <p>
              Safety is the first item on every agenda, from preconstruction to the morning huddle. Every person on our
              sites has the authority to stop work they believe is unsafe, and is thanked for using it.
            </p>
          </motion.div>
        </div>
      </section>
    </>
  )
}

// Equirectangular projection over the Gulf / South Atlantic region.
const W = 1000
const H = 700
const COS = Math.cos((30 * Math.PI) / 180)
const K = W / (19 * COS)
const project = (lon: number, lat: number) => ({ x: (lon + 97) * COS * K, y: (36.5 - lat) * K })
const COAST: [number, number][] = [
  [-97.4, 27.8], [-96.5, 28.4], [-95.0, 29.2], [-94.0, 29.7], [-93.3, 29.8], [-92.0, 29.6], [-91.2, 29.2],
  [-90.2, 29.1], [-89.4, 28.9], [-89.6, 29.6], [-89.6, 30.2], [-88.8, 30.4], [-88.0, 30.7], [-87.5, 30.3],
  [-86.5, 30.4], [-85.6, 30.1], [-85.3, 29.7], [-84.3, 30.0], [-83.6, 29.9], [-83.0, 29.2], [-82.7, 28.7],
  [-82.8, 28.0], [-82.6, 27.5], [-82.2, 26.9], [-81.8, 26.1], [-81.3, 25.6], [-80.9, 25.2], [-80.4, 25.2],
  [-80.1, 25.8], [-80.0, 26.7], [-80.1, 27.2], [-80.4, 27.8], [-80.6, 28.4], [-80.9, 29.0], [-81.2, 29.8],
  [-81.4, 30.4], [-81.4, 31.0], [-81.2, 31.6], [-80.9, 32.1], [-80.4, 32.5], [-79.9, 32.8], [-79.2, 33.3],
  [-78.6, 33.9], [-77.9, 34.1],
]
const coastPath = COAST.map(([lon, lat], i) => {
  const p = project(lon, lat)
  return `${i ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`
}).join(' ')
const LABELS = new Set(['Sanford', 'Charlotte', 'Houston', 'Baton Rouge', 'Pensacola'])

export function Locations() {
  const [active, setActive] = useState<string | null>(null)
  const pts = offices.map((o) => ({ ...o, ...project(o.lon, o.lat) }))
  const hq = pts.find((p) => p.hq)!
  return (
    <section className="section dark" aria-label="Locations" style={{ background: 'var(--asphalt-2)' }}>
      <div className="wrap">
        <Station sta="6+00" right="FL · TX · LA · NC">
          Locations
        </Station>
        <div className="loc-grid">
          <div>
            <Lines className="display section-title" lines={['11 offices.', <span key="h" className="hl">One crew.</span>]} />
            <ul className="offices" onPointerLeave={() => setActive(null)}>
              {offices.map((o) => (
                <li key={o.name}>
                  <button
                    className={active === o.name ? 'is-on' : ''}
                    onPointerEnter={() => setActive(o.name)}
                    onFocus={() => setActive(o.name)}
                    onBlur={() => setActive(null)}
                  >
                    {isDemo && o.hq ? 'Headquarters' : o.name}
                    <span>{o.hq ? 'HQ' : o.state}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <motion.div className="map" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.35 }} aria-hidden="true">
            <svg viewBox={`0 0 ${W} ${H}`}>
              <motion.path
                d={coastPath}
                fill="none"
                stroke="var(--on-dark)"
                strokeOpacity={0.45}
                strokeWidth={1.5}
                variants={{ hidden: { pathLength: 0 }, show: { pathLength: 1, transition: { duration: 2.2, ease } } }}
              />
              {pts
                .filter((p) => !p.hq)
                .map((p, i) => {
                  const mx = (hq.x + p.x) / 2
                  const my = (hq.y + p.y) / 2 - Math.hypot(p.x - hq.x, p.y - hq.y) * 0.3
                  const on = active === p.name
                  return (
                    <motion.path
                      key={p.name}
                      d={`M${hq.x} ${hq.y} Q${mx} ${my} ${p.x} ${p.y}`}
                      fill="none"
                      stroke="var(--yellow)"
                      strokeOpacity={on ? 1 : 0.5}
                      strokeWidth={on ? 3 : 1.5}
                      strokeDasharray={on ? undefined : '6 6'}
                      variants={{ hidden: { pathLength: 0 }, show: { pathLength: 1, transition: { duration: 1.2, ease, delay: 0.6 + i * 0.06 } } }}
                    />
                  )
                })}
              {pts.map((p, i) => {
                const on = active === p.name
                const right = p.name === 'Charlotte' || p.hq
                return (
                  <motion.g key={p.name} variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { delay: 0.8 + i * 0.05 } } }}>
                    <rect
                      x={p.x - (p.hq ? 9 : 6)}
                      y={p.y - (p.hq ? 9 : 6)}
                      width={p.hq ? 18 : 12}
                      height={p.hq ? 18 : 12}
                      fill={p.hq || on ? 'var(--yellow)' : 'var(--on-dark)'}
                      transform={`rotate(45 ${p.x} ${p.y})`}
                    />
                    {(LABELS.has(p.name) || on) && (
                      <text
                        x={p.x + (right ? 18 : 0)}
                        y={p.y + (right ? 6 : -18)}
                        textAnchor={right ? 'start' : 'middle'}
                        className="map-label"
                        style={on || p.hq ? { fill: 'var(--yellow)' } : undefined}
                      >
                        {p.hq ? (isDemo ? 'HQ' : 'Sanford HQ') : p.name}
                      </text>
                    )}
                  </motion.g>
                )
              })}
            </svg>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export function Careers() {
  return (
    <section className="section" aria-label="Careers">
      <div className="wrap">
        <Station sta="7+00" right="Now hiring">
          Careers
        </Station>
        <div className="careers-grid">
          <Shot image={careersImage} alt="Field team on a jobsite" />
          <div>
            <Lines className="display section-title" lines={['Build your', 'career', <span key="h" className="mark">with us.</span>]} />
            <Fade delay={0.1}>
              <p className="section-lede" style={{ marginTop: 24 }}>
                From field engineers on their first jobsite to superintendents running major programs, we train our own
                and promote from within, and we’ve been named a Top Workplace.
              </p>
              <div className="roles">
                {roles.map((r) => (
                  <span key={r}>{r}</span>
                ))}
              </div>
              <a className="btn btn-dark" href={links.careers}>
                View open positions <Arrow />
              </a>
            </Fade>
          </div>
        </div>
      </div>
    </section>
  )
}

export function Footer({ cta = true }: { cta?: boolean }) {
  return (
    <>
      {cta && (
      <section className="cta" aria-label="Contact">
        <div className="wrap">
          <div>
            <Lines className="display" lines={['Ready to', 'build?']} />
            <p>Bring us in early. Tell us about your water, municipal, education or commercial project.</p>
          </div>
          <div className="cta-actions">
            <a className="btn btn-dark" href={links.contact}>
              Request a proposal <Arrow />
            </a>
            <a className="btn btn-ghost" href={links.bids}>
              Bid opportunities <Arrow />
            </a>
          </div>
        </div>
      </section>
      )}
      <footer className="footer">
        <div className="wrap">
          <div className="footer-top">
            <div>
              <Logo />
              <address>
                {company.legalName}
                <br />
                {company.hq.street}
                <br />
                {company.hq.city}
              </address>
            </div>
            <div>
              <h4>Divisions</h4>
              <ul>
                <li>
                  <a href="#water">Water</a>
                </li>
                <li>
                  <a href="#commercial">Commercial</a>
                </li>
              </ul>
            </div>
            <div>
              <h4>Company</h4>
              <ul>
                {nav.slice(2).map((n) => (
                  <li key={n.href}>
                    <a href={n.href}>{n.label}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4>Partners</h4>
              <ul>
                <li>
                  <a href={links.bids}>Bid opportunities</a>
                </li>
                <li>
                  <a href={links.bids}>Subcontractor prequal</a>
                </li>
                <li>
                  <a href={links.contact}>Contact</a>
                </li>
              </ul>
            </div>
            <div>
              <h4>Follow</h4>
              <ul>
                <li>
                  <a href={company.linkedin} target="_blank" rel="noreferrer">
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a href={company.facebook} target="_blank" rel="noreferrer">
                    Facebook
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="footer-base">
            <span>
              © {new Date().getFullYear()} {company.legalName} Equal Opportunity Employer.
            </span>
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Back to top ↑</button>
          </div>
        </div>
      </footer>
    </>
  )
}
