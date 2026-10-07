import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { links, nav } from '../data/site'
import { Arrow, ease } from './ui'

export function Nav() {
  const { scrollY } = useScroll()
  const [solid, setSolid] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setSolid(y > window.innerHeight * 0.8)
    setHidden(y > prev && y > 200)
  })

  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : ''
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <motion.header
        className={`nav ${solid && !open ? 'is-solid' : ''} ${hidden && !open ? 'is-hidden' : ''}`}
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease, delay: 0.4 }}
      >
        <a href="#top" className="wordmark" aria-label="Wharton-Smith home">
          Wharton<i>–</i>Smith
        </a>
        <nav aria-label="Primary">
          <ul className="nav-links">
            {nav.map((n) => (
              <li key={n.href}>
                <a href={n.href}>{n.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="nav-right">
          <a className="pill" href={links.contact}>
            Start a project <Arrow />
          </a>
          <button className="menu-btn" aria-expanded={open} aria-controls="menu" onClick={() => setOpen((o) => !o)}>
            {open ? 'Close' : 'Menu'}
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="menu"
            className="menu"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.8, ease }}
          >
            <ul>
              {[...nav, { label: 'Contact', href: links.contact }].map((n, i) => (
                <li key={n.href}>
                  <motion.a
                    href={n.href}
                    onClick={() => setOpen(false)}
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.9, ease, delay: 0.2 + i * 0.06 }}
                  >
                    {n.label}
                    <span>0{i + 1}</span>
                  </motion.a>
                </li>
              ))}
            </ul>
            <span className="label">750 Monroe Road, Sanford, Florida</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
