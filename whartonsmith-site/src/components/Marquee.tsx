import { useRef } from 'react'
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'motion/react'
import { offices } from '../data/site'

function Star() {
  return (
    <svg className="marquee-star" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 0v24M0 12h24M3.5 3.5l17 17M20.5 3.5l-17 17" stroke="currentColor" strokeWidth="2.4" />
    </svg>
  )
}

/** Office names scrolling sideways; scrolling the page speeds it up and flips direction. */
export function Marquee() {
  const reduce = useReducedMotion()
  const x = useMotionValue(0)
  const trackRef = useRef<HTMLDivElement>(null)
  const direction = useRef(1)
  const { scrollY } = useScroll()
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 })
  const boost = useTransform(velocity, [-2000, 0, 2000], [-5, 0, 5], { clamp: false })
  const skew = useTransform(velocity, [-2000, 2000], [6, -6])

  useAnimationFrame((_, delta) => {
    if (reduce || !trackRef.current) return
    const half = trackRef.current.scrollWidth / 2
    const b = boost.get()
    if (b < 0) direction.current = -1
    else if (b > 0) direction.current = 1
    let next = x.get() - direction.current * (delta / 1000) * 60 * (1 + Math.abs(b))
    if (next <= -half) next += half
    if (next > 0) next -= half
    x.set(next)
  })

  const items = [...offices, ...offices]

  return (
    <div className="marquee" aria-label={`Offices: ${offices.map((o) => o.name).join(', ')}`}>
      <motion.div className="marquee-track" ref={trackRef} style={{ x, skewX: reduce ? 0 : skew }} aria-hidden="true">
        {items.map((o, i) => (
          <span key={i} className={`marquee-item ${o.hq ? 'is-hq' : ''}`}>
            {o.name}
            <Star />
          </span>
        ))}
      </motion.div>
    </div>
  )
}
