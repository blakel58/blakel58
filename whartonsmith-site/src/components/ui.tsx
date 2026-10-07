import { useRef, type ReactNode } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'motion/react'

export const ease = [0.22, 1, 0.36, 1] as const

export function Arrow({ className = 'arrow' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M3 10h13M11 4.5 16.5 10 11 15.5" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  )
}

export function LogoMark({ className = 'logo-mark' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 34 34" fill="none" aria-hidden="true">
      <rect x="0.75" y="0.75" width="32.5" height="32.5" rx="7" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1.5" />
      <path
        d="M7 10l3.6 14L14 13l3 11 3-11 3.4 11L27 10"
        stroke="var(--accent)"
        strokeWidth="2.6"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Headline whose lines slide up from behind a mask. */
export function RevealLines({
  lines,
  className,
  as: Tag = 'h2',
  delay = 0,
  immediate = false,
}: {
  lines: ReactNode[]
  className?: string
  as?: 'h1' | 'h2' | 'h3'
  delay?: number
  immediate?: boolean
}) {
  const MotionTag = motion[Tag]
  return (
    <MotionTag
      className={className}
      initial="hidden"
      {...(immediate ? { animate: 'show' } : { whileInView: 'show', viewport: { once: true, margin: '0px 0px -10% 0px' } })}
      transition={{ staggerChildren: 0.09, delayChildren: delay }}
    >
      {lines.map((line, i) => (
        <span className="line-mask" key={i}>
          <motion.span
            variants={{
              hidden: { y: '110%', rotate: 2 },
              show: { y: '0%', rotate: 0, transition: { duration: 1.1, ease } },
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  )
}

/** Fades content up as it enters the viewport. */
export function FadeUp({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.9, ease, delay }}
    >
      {children}
    </motion.div>
  )
}

/** Pulls its child toward the pointer while hovered. */
export function Magnetic({ children, strength = 0.3 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 18, mass: 0.4 })
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 18, mass: 0.4 })

  return (
    <motion.div
      ref={ref}
      style={{ x, y, display: 'inline-block' }}
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== 'mouse' || !ref.current) return
        const r = ref.current.getBoundingClientRect()
        x.set((e.clientX - (r.left + r.width / 2)) * strength)
        y.set((e.clientY - (r.top + r.height / 2)) * strength)
      }}
      onPointerLeave={() => {
        x.set(0)
        y.set(0)
      }}
    >
      {children}
    </motion.div>
  )
}

export function Button({
  href,
  children,
  variant = 'primary',
}: {
  href: string
  children: ReactNode
  variant?: 'primary' | 'ghost'
}) {
  return (
    <Magnetic>
      <a href={href} className={`btn btn-${variant}`}>
        <span className="btn-fill" />
        {children}
        <Arrow />
      </a>
    </Magnetic>
  )
}
