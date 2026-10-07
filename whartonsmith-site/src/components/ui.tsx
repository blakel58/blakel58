import { useEffect, useRef, useState, type ReactNode } from 'react'
import { animate, motion, useInView, useReducedMotion, useScroll, useTransform } from 'motion/react'
import type { Img } from '../data/site'

export const ease = [0.22, 1, 0.36, 1] as const

export function Arrow() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M2 10h14M11 4l6 6-6 6" stroke="currentColor" strokeWidth="2.6" strokeLinecap="square" />
    </svg>
  )
}

export function Check() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M3 10.5 8 15.5 17 5" stroke="currentColor" strokeWidth="3" strokeLinecap="square" />
    </svg>
  )
}

function Camera() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M1.5 4.5h3l1.2-2h4.6l1.2 2h3v9h-13z" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="8" cy="8.8" r="2.6" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

/** Uppercase headline whose lines punch up from behind a mask. */
export function Lines({
  lines,
  className = 'display',
  as = 'h2',
  delay = 0,
  immediate = false,
}: {
  lines: ReactNode[]
  className?: string
  as?: 'h1' | 'h2' | 'h3'
  delay?: number
  immediate?: boolean
}) {
  const M = motion[as]
  return (
    <M
      className={className}
      initial="hidden"
      {...(immediate ? { animate: 'show' } : { whileInView: 'show', viewport: { once: true, margin: '0px 0px -10% 0px' } })}
      transition={{ staggerChildren: 0.08, delayChildren: delay }}
    >
      {lines.map((l, i) => (
        <span className="line-mask" key={i}>
          <motion.span variants={{ hidden: { y: '110%' }, show: { y: '0%', transition: { duration: 0.9, ease } } }}>{l}</motion.span>
        </span>
      ))}
    </M>
  )
}

export function Fade({ children, delay = 0, className, y = 24 }: { children: ReactNode; delay?: number; className?: string; y?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.8, ease, delay }}
    >
      {children}
    </motion.div>
  )
}

/**
 * An image area: wipes in from the left on scroll, with gentle parallax.
 * Until a real photo is supplied it carries a tag naming the shot that belongs there.
 */
export function Shot({ image, className, alt = '', parallax = true, wipe = true }: { image: Img; className?: string; alt?: string; parallax?: boolean; wipe?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], parallax ? ['-7%', '7%'] : ['0%', '0%'])
  return (
    <motion.div
      ref={ref}
      className={`shot ${className ?? ''}`}
      initial={wipe ? { clipPath: 'inset(0 100% 0 0)' } : false}
      whileInView={{ clipPath: 'inset(0 0% 0 0)' }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 1.1, ease }}
    >
      <motion.img src={image.src} alt={alt} loading="lazy" style={{ y, scale: parallax ? 1.16 : 1 }} />
      {!image.real && (
        <span className="shot-tag" title={`Image area: ${image.shot}`}>
          <Camera />
          <span>Image area · {image.shot}</span>
        </span>
      )}
    </motion.div>
  )
}

export function CountUp({ to, from = 0 }: { to: number; from?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const reduce = useReducedMotion()
  const [v, setV] = useState(reduce ? to : from)
  useEffect(() => {
    if (!inView || reduce) return
    const c = animate(from, to, { duration: 1.8, ease: [0.16, 1, 0.3, 1], onUpdate: (x) => setV(Math.round(x)) })
    return () => c.stop()
  }, [inView, reduce, from, to])
  return <span ref={ref}>{v}</span>
}

/** Survey-style section marker on a tape-measure rule: "STA 1+00 · Water". */
export function Station({ sta, children, right }: { sta: string; children: ReactNode; right?: ReactNode }) {
  return (
    <div className="station">
      <span className="label station-sta">
        STA {sta} · {children}
      </span>
      {right && <span className="label mute">{right}</span>}
    </div>
  )
}
