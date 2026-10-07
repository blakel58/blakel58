import { useEffect, useRef, useState, type ReactNode } from 'react'
import { animate, motion, useInView, useReducedMotion, useScroll, useTransform } from 'motion/react'

export const ease = [0.22, 1, 0.36, 1] as const

export function Arrow({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M1 8h13M9 3l5 5-5 5" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  )
}

/** Serif headline whose lines rise from behind a mask. */
export function RevealLines({
  lines,
  className,
  as = 'h2',
  delay = 0,
  immediate = false,
}: {
  lines: ReactNode[]
  className?: string
  as?: 'h1' | 'h2' | 'h3' | 'p'
  delay?: number
  immediate?: boolean
}) {
  const M = motion[as]
  return (
    <M
      className={className}
      initial="hidden"
      {...(immediate ? { animate: 'show' } : { whileInView: 'show', viewport: { once: true, margin: '0px 0px -12% 0px' } })}
      transition={{ staggerChildren: 0.1, delayChildren: delay }}
    >
      {lines.map((line, i) => (
        <span className="line-mask" key={i}>
          <motion.span variants={{ hidden: { y: '105%' }, show: { y: '0%', transition: { duration: 1.2, ease } } }}>
            {line}
          </motion.span>
        </span>
      ))}
    </M>
  )
}

export function Fade({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 1, ease, delay }}
    >
      {children}
    </motion.div>
  )
}

/** Image that unveils with a clip-path wipe and settles from a slight zoom, with gentle parallax. */
export function Picture({ src, alt, className, ratio }: { src: string; alt: string; className?: string; ratio?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-6%', '6%'])
  return (
    <motion.div
      ref={ref}
      className={`media ${className ?? ''}`}
      style={{ aspectRatio: ratio }}
      initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
      whileInView={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 1.4, ease }}
    >
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        style={{ y }}
        initial={{ scale: 1.3 }}
        whileInView={{ scale: 1.14 }}
        viewport={{ once: true }}
        transition={{ duration: 1.8, ease }}
      />
    </motion.div>
  )
}

export function CountUp({ to, from = 0, duration = 2 }: { to: number; from?: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -15% 0px' })
  const reduce = useReducedMotion()
  const [v, setV] = useState(reduce ? to : from)
  useEffect(() => {
    if (!inView || reduce) return
    const c = animate(from, to, { duration, ease: [0.16, 1, 0.3, 1], onUpdate: (x) => setV(Math.round(x)) })
    return () => c.stop()
  }, [inView, reduce, from, to, duration])
  return <span ref={ref}>{v}</span>
}

export function SectionTag({ n, children }: { n: string; children: ReactNode }) {
  return (
    <div className="section-tag">
      <span className="index-num">{n}</span>
      <span className="label">{children}</span>
    </div>
  )
}
