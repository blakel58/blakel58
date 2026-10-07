import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { company, links, nav } from '../data/site'
import { Arrow, Button, Logo, ease } from './ui'

export function Nav() {
  const { scrollY } = useScroll()
  const [solid, setSolid] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setSolid(y > 24)
    setHidden(y > prev && y > 600)
  })

  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : ''
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <header
        className={`header ${solid || open ? 'is-solid' : ''}`}
        style={{ transform: hidden && !open ? 'translateY(-100%)' : undefined }}
      >
        <div className="utility">
          <div className="container">
            <span>Building the Southeast since {company.founded}</span>
            <ul>
              <li>
                <a href={links.bids}>Bid Opportunities</a>
              </li>
              <li>
                <a href={links.prequal}>Subcontractor Prequalification</a>
              </li>
              <li>
                <a href={company.linkedin} target="_blank" rel="noreferrer">
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="nav">
          <div className="container">
            <a href="#top" aria-label="Wharton-Smith home">
              <Logo />
            </a>
            <nav aria-label="Primary">
              <ul className="nav-links">
                {nav.map((item) => (
                  <li key={item.href}>
                    <a href={item.href}>{item.label}</a>
                  </li>
                ))}
              </ul>
            </nav>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Button href={links.contact}>Contact Us</Button>
              <button
                className="menu-btn"
                aria-label={open ? 'Close menu' : 'Open menu'}
                aria-expanded={open}
                aria-controls="mobile-menu"
                onClick={() => setOpen((o) => !o)}
              >
                <span />
                <span />
              </button>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="mobile-menu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease }}
          >
            <ul>
              {nav.map((item) => (
                <li key={item.href}>
                  <a href={item.href} onClick={() => setOpen(false)}>
                    {item.label}
                    <Arrow />
                  </a>
                </li>
              ))}
            </ul>
            <a href={links.contact} className="btn btn-primary" onClick={() => setOpen(false)}>
              Contact Us
            </a>
            <a href={links.bids} className="btn btn-outline-dark" onClick={() => setOpen(false)}>
              Bid Opportunities
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
