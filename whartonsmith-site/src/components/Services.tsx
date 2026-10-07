import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { links, services } from '../data/site'
import { Button, RevealLines, ease } from './ui'

export function Services() {
  const [open, setOpen] = useState(0)
  const [shown, setShown] = useState(0)
  const toggle = (i: number) => {
    setOpen(open === i ? -1 : i)
    setShown(i)
  }

  return (
    <section className="services section-light" id="services" aria-label="Services">
      <div className="wrap services-grid">
        <div className="services-aside">
          <div className="mono eyebrow">How we deliver</div>
          <RevealLines className="display" lines={['However', 'you need', 'it built.']} />
          <p>
            Every owner, budget and schedule is different. We meet each one with the delivery method that fits, and
            we’re in it from the first estimate to the last punch-list item.
          </p>
          <div className="services-big" aria-hidden="true">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={shown}
                initial={{ y: '100%' }}
                animate={{ y: '0%' }}
                exit={{ y: '-100%' }}
                transition={{ duration: 0.6, ease }}
              >
                {String(shown + 1).padStart(2, '0')}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>

        <div>
          <ul className="service-list">
            {services.map((s, i) => {
              const isOpen = open === i
              return (
                <motion.li
                  key={s.title}
                  className={`service ${isOpen ? 'is-open' : ''}`}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease, delay: i * 0.07 }}
                >
                  <button
                    className="service-btn"
                    aria-expanded={isOpen}
                    aria-controls={`service-${i}`}
                    onClick={() => toggle(i)}
                  >
                    <span className="mono">{String(i + 1).padStart(2, '0')}</span>
                    <span className="service-title">{s.title}</span>
                    <span className="service-icon" aria-hidden="true" />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`service-${i}`}
                        className="service-body"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.55, ease }}
                      >
                        <p>{s.body}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.li>
              )
            })}
          </ul>
          <div style={{ marginTop: 40 }}>
            <Button href={links.contact} variant="ghost">
              Talk to our preconstruction team
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
