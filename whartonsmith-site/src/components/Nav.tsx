import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from 'motion/react'
import { links, nav } from '../data/site'
import { Arrow, Button, LogoMark, ease } from './ui'

export function Nav() {
  const { scrollY, scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 })
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [hovered, setHovered] = useState<string | null>(null)

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setScrolled(y > 40)
    setHidden(y > prev && y > 400 && !open)
  })

  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : ''
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <motion.div className="progress" style={{ scaleX: progress }} />
      <motion.header
        className={`nav ${scrolled || open ? 'is-scrolled' : ''}`}
        animate={{ y: hidden ? '-100%' : '0%' }}
        transition={{ duration: 0.45, ease }}
      >
        <a href="#top" className="logo" aria-label="Wharton-Smith home">
          <LogoMark />
          <span>
            Wharton<span className="dash">–</span>Smith
          </span>
        </a>

        <nav aria-label="Primary">
          <ul className="nav-links" onPointerLeave={() => setHovered(null)}>
            {nav.map((item) => (
              <li key={item.href}>
                <a href={item.href} onPointerEnter={() => setHovered(item.href)}>
                  {hovered === item.href && (
                    <motion.span className="nav-pill" layoutId="nav-pill" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />
                  )}
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="nav-right">
          <Button href={links.contact}>Start a project</Button>
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
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="mobile-menu"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.7, ease }}
          >
            <ul>
              {[...nav, { label: 'Contact', href: links.contact }].map((item, i) => (
                <li key={item.href}>
                  <motion.a
                    href={item.href}
                    onClick={() => setOpen(false)}
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.8, ease, delay: 0.15 + i * 0.06 }}
                  >
                    {item.label}
                    <span className="mono" style={{ color: 'var(--accent)' }}>
                      0{i + 1}
                    </span>
                  </motion.a>
                </li>
              ))}
            </ul>
            <motion.a
              href={links.careers}
              className="mono"
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.6 } }}
              style={{ display: 'inline-flex', gap: 10, alignItems: 'center', color: 'var(--accent)' }}
            >
              We’re hiring <Arrow />
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
