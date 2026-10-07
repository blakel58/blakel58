import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { company, links, nav } from '../data/site'
import { Arrow, ease } from './ui'

export function Logo() {
  return (
    <span className="logo">
      <span className="logo-mark">{company.short}</span>
      <span className="logo-name">
        {company.name}
        <small>Since {company.founded}</small>
      </span>
    </span>
  )
}

export function Nav({ route }: { route: string }) {
  const { scrollY } = useScroll()
  const [solid, setSolid] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setSolid(y > 40)
    setHidden(y > prev && y > 300)
  })

  useEffect(() => setOpen(false), [route])

  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : ''
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <header className={`nav ${solid || open ? 'is-solid' : ''} ${hidden && !open ? 'is-hidden' : ''}`}>
        <a href="#home" aria-label={`${company.name} home`}>
          <Logo />
        </a>
        <nav aria-label="Primary">
          <ul className="nav-links">
            {nav.map((n) => (
              <li key={n.href}>
                <a href={n.href} className={n.href === `#${route}` ? 'is-active' : ''} aria-current={n.href === `#${route}` ? 'page' : undefined}>
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <a className="btn btn-yellow" href={links.contact}>
            Request a proposal <Arrow />
          </a>
          <button className="menu-btn" aria-expanded={open} aria-controls="menu" onClick={() => setOpen((o) => !o)}>
            {open ? 'Close' : 'Menu'}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="menu"
            className="menu"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.6, ease }}
          >
            <ul>
              {[...nav, { label: 'Contact', href: links.contact }].map((n, i) => (
                <li key={n.href}>
                  <motion.a
                    href={n.href}
                    onClick={() => setOpen(false)}
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.7, ease, delay: 0.15 + i * 0.05 }}
                  >
                    {n.label}
                    <span>0{i + 1}</span>
                  </motion.a>
                </li>
              ))}
            </ul>
            <a className="btn btn-yellow" href={links.contact} onClick={() => setOpen(false)}>
              Request a proposal <Arrow />
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
