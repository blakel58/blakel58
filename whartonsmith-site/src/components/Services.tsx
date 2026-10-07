import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { links, selfPerform, services, photos } from '../data/site'
import { Drawing } from './Drawing'
import { Arrow, Button, Check, Reveal, ease } from './ui'

export function Services() {
  const [active, setActive] = useState(0)
  const s = services[active]

  return (
    <section className="section" id="services" aria-labelledby="services-title">
      <div className="container">
        <div className="section-head">
          <Reveal>
            <div className="eyebrow">Services</div>
            <h2 id="services-title">The right delivery method for every owner.</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p>
              Whether you need a guaranteed maximum price, a single point of responsibility or a competitive bid, our
              team is involved from the first estimate through closeout and warranty.
            </p>
          </Reveal>
        </div>

        <div className="services-grid">
          <Reveal>
            <div className="services-tabs" role="tablist" aria-label="Delivery methods">
              {services.map((sv, i) => (
                <button
                  key={sv.title}
                  role="tab"
                  id={`svc-tab-${i}`}
                  aria-selected={active === i}
                  aria-controls="svc-panel"
                  className={`service-tab ${active === i ? 'is-active' : ''}`}
                  onClick={() => setActive(i)}
                >
                  {active === i && <motion.span className="service-tab-bar" layoutId="svc-bar" transition={{ duration: 0.35, ease }} />}
                  {sv.short}
                  <Arrow />
                </button>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="service-panel" id="svc-panel" role="tabpanel" aria-labelledby={`svc-tab-${active}`}>
              <svg className="service-panel-art" viewBox="0 0 100 100" fill="none" stroke="currentColor" aria-hidden="true">
                <path d="M10 90V40l40-30 40 30v50M10 90h80M30 90V60h40v30M50 10v80" strokeWidth="1.5" />
              </svg>
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35, ease }}
                >
                  <div className="service-panel-num">
                    {String(active + 1).padStart(2, '0')} / {String(services.length).padStart(2, '0')}
                  </div>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </motion.div>
              </AnimatePresence>
              <div style={{ marginTop: 36, position: 'relative' }}>
                <Button href={links.contact}>Talk to Our Preconstruction Team</Button>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export function SelfPerform() {
  return (
    <section className="section section-alt" id="self-perform" aria-labelledby="sp-title">
      <div className="container split">
        <Reveal>
          <div className="split-media">
            {photos.selfPerform ? (
              <img src={photos.selfPerform} alt="Wharton-Smith crew placing concrete" />
            ) : (
              <Drawing kind="concrete" sheet="S-201" title="Self-perform concrete" />
            )}
            <div className="split-media-badge">
              <strong>120+</strong>
              <span>In-house craft professionals</span>
            </div>
          </div>
        </Reveal>
        <Reveal className="split-copy" delay={0.1}>
          <div className="eyebrow">Self-Perform</div>
          <h2 id="sp-title">Our own crews on the critical path.</h2>
          <p>
            As a self-performing general contractor, we control the work that drives schedule and quality. Our
            in-house workforce of more than 120 craft professionals gives owners more certainty on cost, schedule and
            safety.
          </p>
          <ul className="trade-list">
            {selfPerform.map((t) => (
              <li key={t}>
                <Check />
                {t}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
