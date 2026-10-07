import type { ReactNode } from 'react'
import { motion } from 'motion/react'

export const ease = [0.22, 1, 0.36, 1] as const

export function Arrow({ className = 'arrow' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M3 10h13M11 4.5 16.5 10 11 15.5" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

export function Check() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M4 10.5 8 14.5 16 5.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="square" />
    </svg>
  )
}

export function Pin() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 1a5 5 0 0 0-5 5c0 3.6 5 9 5 9s5-5.4 5-9a5 5 0 0 0-5-5Zm0 7a2 2 0 1 1 0-4 2 2 0 0 1 0 4Z" />
    </svg>
  )
}

/** Placeholder mark: swap for the official Wharton-Smith logo SVG. */
export function Logo({ sub = true }: { sub?: boolean }) {
  return (
    <span className="logo">
      <svg className="logo-mark" viewBox="0 0 40 40" aria-hidden="true">
        <rect width="40" height="40" rx="3" fill="#10263d" />
        <path d="M7 11h4.2l2.6 11.4L17 11h4l3.2 11.4L26.8 11H31l-5 18h-3.8L19 17.8 15.8 29H12z" fill="#fff" />
        <rect x="7" y="32" width="24" height="3" fill="#f2a900" />
      </svg>
      <span className="logo-text">
        <span className="logo-name">Wharton-Smith</span>
        {sub && <span className="logo-sub">Est. 1984</span>}
      </span>
    </span>
  )
}

/** Fades content up once as it enters the viewport. */
export function Reveal({
  children,
  delay = 0,
  className,
  as = 'div',
}: {
  children: ReactNode
  delay?: number
  className?: string
  as?: 'div' | 'li' | 'article'
}) {
  const M = motion[as]
  return (
    <M
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.7, ease, delay }}
    >
      {children}
    </M>
  )
}

export function Button({
  href,
  children,
  variant = 'primary',
}: {
  href: string
  children: ReactNode
  variant?: 'primary' | 'outline' | 'outline-dark' | 'dark'
}) {
  return (
    <a href={href} className={`btn btn-${variant}`}>
      {children}
      <Arrow />
    </a>
  )
}
