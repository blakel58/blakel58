import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { company, links, methods, nav, offices, r, roles, trades } from '../data/site'
import { Arrow, CountUp, Fade, Picture, RevealLines, SectionTag, ease } from './ui'

export function HowWeBuild() {
  const [open, setOpen] = useState(0)
  return (
    <div className="dark">
      <section className="section" aria-label="How we build">
        <div className="wrap">
          <SectionTag n="05">How we build</SectionTag>
          <div className="methods">
            <div>
              <RevealLines className="display" lines={['However it', <em key="e">needs building.</em>]} />
              <Fade delay={0.1}>
                <p className="methods-intro">
                  Every owner, budget and schedule is different. We meet each with the delivery method that fits, and
                  stay with it from the first estimate to the last day of warranty.
                </p>
              </Fade>
            </div>
            <ul className="method-list">
              {methods.map((m, i) => (
                <li key={m.title} className={`method ${open === i ? 'is-open' : ''}`}>
                  <button aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>
                    <span className="index-num">{String(i + 1).padStart(2, '0')}</span>
                    <span className="method-name">{m.title}</span>
                    <span className="method-plus" aria-hidden="true" />
                  </button>
                  <AnimatePresence initial={false}>
                    {open === i && (
                      <motion.div
                        className="method-body"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.6, ease }}
                      >
                        <p>{m.body}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              ))}
            </ul>
          </div>

          <div className="selfperform">
            <div className="selfperform-num">
              <CountUp to={120} />
              <em>+</em>
            </div>
            <Fade>
              <h3>Craftspeople on our own payroll.</h3>
              <p>
                We self-perform the work that decides schedule and quality. Our own crews give owners more certainty on
                cost, on time and on safety, and give our people a career, not just a job.
              </p>
              <div className="trades">
                {trades.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
            </Fade>
          </div>
        </div>
      </section>

      <section className="safety wrap" aria-label="Safety">
        <span className="label">Safety</span>
        <RevealLines className="display" lines={['Everyone goes home,', <em key="e">every day.</em>]} />
        <Fade delay={0.2}>
          <p>
            Safety is the first item on every agenda, from preconstruction to the morning huddle. Every person on our
            sites can stop work they believe is unsafe, and is thanked for doing it.
          </p>
        </Fade>
      </section>
    </div>
  )
}

// Simple equirectangular projection over the Gulf / South Atlantic region.
const W = 1000
const H = 700
const LON0 = -97
const LAT1 = 36.5
const COS = Math.cos((30 * Math.PI) / 180)
const K = W / (19 * COS)
const project = (lon: number, lat: number) => ({ x: (lon - LON0) * COS * K, y: (LAT1 - lat) * K })

// Hand-simplified coastline, Corpus Christi to Wilmington.
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

export function Footprint() {
  const [active, setActive] = useState<string | null>(null)
  const pts = offices.map((o) => ({ ...o, ...project(o.lon, o.lat) }))
  const hq = pts.find((p) => p.hq)!

  return (
    <section className="section footprint" aria-label="Offices">
      <div className="wrap">
        <SectionTag n="06">Footprint</SectionTag>
        <div className="footprint-grid">
          <div>
            <RevealLines className="display" lines={['Rooted in Sanford.', <em key="e">At home in the South.</em>]} />
            <Fade delay={0.1}>
              <p className="footprint-lede">
                Eleven offices across Florida, Texas, Louisiana and North Carolina, each staffed by people who live in
                the communities they build for.
              </p>
            </Fade>
            <ul className="offices" onPointerLeave={() => setActive(null)}>
              {offices.map((o) => (
                <li key={o.name}>
                  <button
                    className={active === o.name ? 'is-active' : ''}
                    onPointerEnter={() => setActive(o.name)}
                    onFocus={() => setActive(o.name)}
                    onBlur={() => setActive(null)}
                  >
                    {o.name}
                    <span className="label">{o.hq ? 'HQ' : o.state}</span>
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
                stroke="var(--ink)"
                strokeOpacity={0.5}
                strokeWidth={1}
                variants={{ hidden: { pathLength: 0 }, show: { pathLength: 1, transition: { duration: 2.6, ease } } }}
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
                      stroke={on ? 'var(--accent)' : 'var(--ink)'}
                      strokeOpacity={on ? 1 : 0.28}
                      strokeWidth={on ? 1.6 : 0.8}
                      variants={{
                        hidden: { pathLength: 0 },
                        show: { pathLength: 1, transition: { duration: 1.6, ease, delay: 0.8 + i * 0.07 } },
                      }}
                    />
                  )
                })}
              {pts.map((p, i) => {
                const on = active === p.name
                const right = p.name === 'Charlotte' || p.hq
                return (
                  <motion.g
                    key={p.name}
                    variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.6, delay: 1 + i * 0.06 } } }}
                  >
                    <circle cx={p.x} cy={p.y} r={p.hq ? 7 : on ? 6 : 4} fill={on || p.hq ? 'var(--accent)' : 'var(--ink)'} />
                    {(LABELS.has(p.name) || on) && (
                      <text
                        x={p.x + (right ? 16 : 0)}
                        y={p.y + (right ? 7 : -16)}
                        textAnchor={right ? 'start' : 'middle'}
                        className="map-label"
                        fontStyle={on || p.hq ? 'italic' : undefined}
                      >
                        {p.hq ? 'Sanford' : p.name}
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

function House() {
  return (
    <svg viewBox="0 0 26 26" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
      <path d="M3 12 13 4l10 8M5.5 10v12h15V10" />
    </svg>
  )
}

export function Community() {
  return (
    <section className="section community" aria-label="Community" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <SectionTag n="07">In the community</SectionTag>
        <div className="community-grid">
          <div className="community-num">
            $<CountUp to={1} from={0} duration={1} />
            <em style={{ fontSize: '0.5em' }}>million</em>
          </div>
          <div>
            <RevealLines
              as="h2"
              lines={['Nineteen homes at Legacy Point,', <em key="e">a few miles from where we began.</em>]}
            />
            <Fade delay={0.1}>
              <p>
                In 2025 Wharton-Smith made the largest gift in its history: $1 million to Habitat for Humanity
                Seminole-Apopka, helping to build Legacy Point, a community of safe, stable and affordable homes for
                Central Florida families.
              </p>
            </Fade>
            <motion.div
              className="homes"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              transition={{ staggerChildren: 0.05 }}
              aria-hidden="true"
            >
              {Array.from({ length: 19 }, (_, i) => (
                <motion.span
                  key={i}
                  style={{ color: i % 6 === 2 ? 'var(--accent)' : 'var(--ink)' }}
                  variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } } }}
                >
                  <House />
                </motion.span>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function Careers() {
  return (
    <section className="section careers" id="careers" aria-label="Careers" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <SectionTag n="08">Careers</SectionTag>
        <div className="careers-grid">
          <div>
            <RevealLines className="display" lines={['Build with', <em key="e">us.</em>]} />
            <Fade delay={0.1}>
              <p>
                From field engineers on their first jobsite to superintendents running major programs, our people are the
                reason owners come back. We train our own, promote from within, and have been named a Top Workplace.
              </p>
              <div className="roles">
                {roles.map((rl) => (
                  <span key={rl}>{rl}</span>
                ))}
              </div>
              <a className="pill" href={links.careers}>
                View open positions <Arrow />
              </a>
            </Fade>
          </div>
          <div>
            <Picture src={r('civic-b')} alt="Study model of a civic campus" />
            <div className="caption">
              <span className="label">Fig. 04 · Justice campus, study model</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="dark footer" id="contact">
      <div className="wrap">
        <div className="footer-cta">
          <span className="label">Start a project</span>
          <RevealLines className="display" lines={['Let’s build something', <em key="e">that lasts.</em>]} />
          <div className="footer-cta-row">
            <p>The earlier we join a project, the more we can do for its budget, schedule and safety. Tell us what you’re planning.</p>
            <a className="pill" href={links.contact}>
              Get in touch <Arrow />
            </a>
          </div>
        </div>
        <div className="footer-cols">
          <div>
            <span className="label">Headquarters</span>
            <address>
              {company.legalName}
              <br />
              {company.hq.street}
              <br />
              {company.hq.city}
            </address>
          </div>
          <div>
            <span className="label">Explore</span>
            <ul>
              {nav.map((n) => (
                <li key={n.href}>
                  <a href={n.href}>{n.label}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <span className="label">Partners</span>
            <ul>
              <li>
                <a href={links.bids}>Bid opportunities</a>
              </li>
              <li>
                <a href={links.bids}>Subcontractor prequalification</a>
              </li>
              <li>
                <a href={links.contact}>Contact</a>
              </li>
            </ul>
          </div>
          <div>
            <span className="label">Follow</span>
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
          <span>Imagery: study-model renders</span>
          <a href="#top">Back to top</a>
        </div>
      </div>
    </footer>
  )
}
