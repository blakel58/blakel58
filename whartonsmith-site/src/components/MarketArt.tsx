import type { ReactNode } from 'react'
import { motion, type Variants } from 'motion/react'
import type { MarketKey } from '../data/site'
import { ease } from './ui'

const draw: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  show: (i: number = 0) => ({
    pathLength: 1,
    opacity: 1,
    transition: { pathLength: { duration: 1.6, ease, delay: i * 0.12 }, opacity: { duration: 0.1, delay: i * 0.12 } },
  }),
}
const pop: Variants = {
  hidden: { opacity: 0, scale: 0.6 },
  show: (i: number = 0) => ({ opacity: 1, scale: 1, transition: { duration: 0.6, ease, delay: 0.4 + i * 0.05 } }),
}

const P = motion.path
const C = motion.circle
const R = motion.rect

function Water() {
  const cx = 200
  const cy = 150
  const ticks = Array.from({ length: 24 }, (_, k) => {
    const a = (k / 24) * Math.PI * 2
    return `M${cx + Math.cos(a) * 112} ${cy + Math.sin(a) * 112} L${cx + Math.cos(a) * 120} ${cy + Math.sin(a) * 120}`
  }).join(' ')
  return (
    <>
      <C cx={cx} cy={cy} r={120} variants={draw} custom={0} strokeWidth={1.6} />
      <C cx={cx} cy={cy} r={100} variants={draw} custom={1} strokeDasharray="3 6" />
      <C cx={cx} cy={cy} r={28} variants={draw} custom={2} />
      <P d={ticks} variants={draw} custom={2} strokeOpacity={0.5} />
      <P d="M0 150 H80 M320 150 H400" variants={draw} custom={3} strokeWidth={3} strokeOpacity={0.5} />
      <motion.g variants={pop} custom={2}>
        <motion.g animate={{ rotate: 360 }} transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}>
          <line x1={cx - 100} y1={cy} x2={cx + 100} y2={cy} stroke="var(--accent)" strokeWidth={2.5} />
          <circle cx={cx} cy={cy} r={100} stroke="none" fill="none" />
        </motion.g>
      </motion.g>
      {[0, 1, 2].map((k) => (
        <motion.circle
          key={k}
          cx={cx}
          cy={cy}
          stroke="var(--accent)"
          initial={{ r: 28, opacity: 0.8 }}
          animate={{ r: 120, opacity: 0 }}
          transition={{ duration: 3.6, repeat: Infinity, delay: k * 1.2, ease: 'easeOut' }}
        />
      ))}
    </>
  )
}

function Municipal() {
  const cols = [120, 160, 200, 240, 280]
  return (
    <>
      <P d="M60 250 H340 M70 238 H330 M80 226 H320" variants={draw} custom={0} strokeWidth={1.6} />
      <P d="M90 120 L200 64 L310 120 Z" variants={draw} custom={1} strokeWidth={1.6} />
      <P d="M90 132 H310" variants={draw} custom={2} />
      {cols.map((x, k) => (
        <R key={x} x={x - 9} y={140} width={18} height={84} variants={draw} custom={2 + k * 0.4} />
      ))}
      <P d="M200 64 V20" variants={draw} custom={3} />
      <motion.g variants={pop} custom={4}>
        <motion.path
          d="M200 22 h34 l-6 8 l6 8 h-34 Z"
          fill="var(--accent)"
          stroke="none"
          animate={{ skewY: [0, -4, 0, 4, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.g>
      <C cx={200} cy={100} r={10} variants={draw} custom={3} />
    </>
  )
}

function Education() {
  const windows: ReactNode[] = []
  for (let row = 0; row < 3; row++)
    for (let col = 0; col < 8; col++) {
      const x = col < 4 ? 46 + col * 28 : 246 + (col - 4) * 28
      windows.push(
        <motion.rect
          key={`${row}-${col}`}
          x={x}
          y={150 + row * 30}
          width={16}
          height={18}
          variants={pop}
          custom={row * 8 + col}
          fill={(row * 8 + col) % 5 === 2 ? 'var(--accent)' : 'none'}
          stroke={(row * 8 + col) % 5 === 2 ? 'none' : 'currentColor'}
        />,
      )
    }
  return (
    <>
      <P d="M30 250 H370" variants={draw} custom={0} strokeWidth={1.6} />
      <R x={36} y={136} width={328} height={114} variants={draw} custom={1} strokeWidth={1.4} />
      <R x={166} y={70} width={68} height={180} variants={draw} custom={2} strokeWidth={1.4} />
      <P d="M158 70 L200 40 L242 70" variants={draw} custom={3} />
      <C cx={200} cy={98} r={14} variants={draw} custom={4} />
      <path d="M200 98 V88" stroke="var(--accent)" strokeWidth={2}>
        <animateTransform attributeName="transform" type="rotate" from="0 200 98" to="360 200 98" dur="8s" repeatCount="indefinite" />
      </path>
      <R x={186} y={200} width={28} height={50} variants={draw} custom={4} />
      {windows}
    </>
  )
}

function Hospitality() {
  const cx = 250
  const cy = 130
  const r = 92
  const spokes = Array.from({ length: 12 }, (_, k) => {
    const a = (k / 12) * Math.PI * 2
    return { x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r }
  })
  return (
    <>
      <P d="M20 262 H380" variants={draw} custom={0} strokeWidth={1.6} />
      <P d={`M${cx - 50} 262 L${cx} ${cy} L${cx + 50} 262`} variants={draw} custom={1} strokeWidth={1.4} />
      <motion.g variants={pop} custom={0}>
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        >
          <circle cx={cx} cy={cy} r={r} />
          <circle cx={cx} cy={cy} r={r * 0.7} strokeDasharray="2 5" />
          {spokes.map((s, k) => (
            <line key={k} x1={cx} y1={cy} x2={s.x} y2={s.y} strokeOpacity={0.5} />
          ))}
        </motion.g>
        {spokes.map((s, k) => (
          <motion.g
            key={k}
            animate={{
              x: Array.from({ length: 13 }, (_, t) => cx + Math.cos(((k + t) / 12) * Math.PI * 2) * r - s.x),
              y: Array.from({ length: 13 }, (_, t) => cy + Math.sin(((k + t) / 12) * Math.PI * 2) * r - s.y),
            }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          >
            <rect x={s.x - 6} y={s.y} width={12} height={10} rx={2} fill={k % 4 === 0 ? 'var(--accent)' : 'var(--ink-3)'} />
          </motion.g>
        ))}
      </motion.g>
      <P
        d="M20 262 C40 262 50 150 80 150 S110 230 130 230 S150 120 175 190"
        variants={draw}
        custom={2}
        strokeWidth={2.2}
        stroke="var(--accent)"
      />
      <P d="M50 262 V210 M80 262 V152 M110 262 V205 M140 262 V200" variants={draw} custom={3} strokeOpacity={0.5} />
    </>
  )
}

function Community() {
  const homes = [40, 120, 200, 280]
  return (
    <>
      <P d="M20 250 H380" variants={draw} custom={0} strokeWidth={1.6} />
      {homes.map((x, k) => (
        <motion.g key={x}>
          <P d={`M${x} 250 V160 L${x + 40} 120 L${x + 80} 160 V250`} variants={draw} custom={1 + k * 0.5} strokeWidth={1.4} />
          <R x={x + 30} y={210} width={20} height={40} variants={draw} custom={2 + k * 0.5} />
          <motion.g variants={pop} custom={k * 2}>
            <motion.rect
              x={x + 14}
              y={172}
              width={16}
              height={16}
              animate={{ fill: ['rgba(255,91,31,0)', 'rgba(255,91,31,1)', 'rgba(255,91,31,1)', 'rgba(255,91,31,0)'] }}
              transition={{ duration: 4, repeat: Infinity, delay: k * 0.7, times: [0, 0.2, 0.7, 1] }}
            />
          </motion.g>
          <R x={x + 50} y={172} width={16} height={16} variants={pop} custom={k * 2 + 1} />
        </motion.g>
      ))}
      <P d="M60 80 Q100 60 140 80 T220 80" variants={draw} custom={4} strokeOpacity={0.4} strokeDasharray="3 5" />
    </>
  )
}

const ART: Record<MarketKey, () => ReactNode> = {
  water: Water,
  municipal: Municipal,
  education: Education,
  hospitality: Hospitality,
  community: Community,
}

export function MarketArt({ market }: { market: MarketKey }) {
  const Art = ART[market]
  return (
    <motion.svg
      viewBox="0 0 400 300"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.2}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      aria-hidden="true"
    >
      <Art />
    </motion.svg>
  )
}
