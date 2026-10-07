import type { ReactNode } from 'react'
import { motion, type Variants } from 'motion/react'
import { ease } from './ui'

// Technical-drawing panels shown wherever a photo hasn't been supplied yet.

export type DrawingKind = 'water' | 'civic' | 'school' | 'concrete' | 'crane'

const draw: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  show: (i: number = 0) => ({
    pathLength: 1,
    opacity: 1,
    transition: { pathLength: { duration: 1.4, ease, delay: i * 0.12 }, opacity: { duration: 0.1, delay: i * 0.12 } },
  }),
}

type Stroke = { stroke?: string; strokeWidth?: number; strokeOpacity?: number; strokeDasharray?: string }

const P = ({ d, i = 0, ...rest }: { d: string; i?: number } & Stroke) => (
  <motion.path d={d} variants={draw} custom={i} {...rest} />
)

const dim = (x1: number, x2: number, y: number) => `M${x1} ${y} H${x2} M${x1} ${y - 5} V${y + 5} M${x2} ${y - 5} V${y + 5}`

const circle = (cx: number, cy: number, r: number) => `M${cx - r} ${cy} a${r} ${r} 0 1 0 ${r * 2} 0 a${r} ${r} 0 1 0 ${-r * 2} 0`

const art: Record<DrawingKind, ReactNode> = {
  water: (
    <>
      <P d={circle(120, 110, 70)} i={0} />
      <P d={circle(120, 110, 60)} i={1} strokeDasharray="3 5" />
      <P d={circle(120, 110, 12)} i={1} />
      <P d={circle(290, 75, 45)} i={2} />
      <P d={circle(290, 75, 38)} i={2} strokeDasharray="3 5" />
      <P d="M235 140 h130 v70 h-130 Z M267 140 v70 M300 140 v70 M333 140 v70" i={3} />
      <P d="M20 110 H50 M190 110 H230 V140 M290 120 V140 M335 75 H390" i={4} strokeWidth={2.5} strokeOpacity={0.5} />
      <P d="M48 50 H72 M120 25 V40" i={5} strokeOpacity={0.5} />
      <P d={dim(50, 190, 205)} i={5} strokeOpacity={0.5} />
    </>
  ),
  civic: (
    <>
      <P d="M10 210 H390" i={0} strokeWidth={2} />
      <P d="M30 210 V60 H210 V210 M30 97 H210 M30 134 H210 M30 171 H210" i={1} />
      <P
        d={Array.from({ length: 4 }, (_, r) =>
          Array.from({ length: 7 }, (_, c) => `M${42 + c * 24} ${70 + r * 37} h14 v18 h-14 Z`).join(' '),
        ).join(' ')}
        i={2}
        strokeOpacity={0.6}
      />
      <P d="M100 210 v-24 h40 v24 M90 186 h60" i={3} />
      <P d="M230 210 V80 H380 V210 M230 106 H380 M230 132 H380 M230 158 H380 M230 184 H380" i={2} />
      <P d="M240 80 V210 M370 80 V210 M305 80 V210" i={3} strokeOpacity={0.4} strokeDasharray="4 4" />
      <P d={dim(30, 210, 228)} i={4} strokeOpacity={0.5} />
      <P d={dim(230, 380, 228)} i={4} strokeOpacity={0.5} />
    </>
  ),
  school: (
    <>
      <P d="M10 210 H390" i={0} strokeWidth={2} />
      <P d="M30 210 V110 H160 V210 M240 210 V110 H370 V210" i={1} />
      <P d="M160 210 V70 H240 V210 M150 70 L200 40 L250 70" i={2} />
      <P
        d={[0, 1].map((r) =>
          [0, 1, 2, 3].map((c) => `M${42 + c * 30} ${125 + r * 40} h20 v22 h-20 Z M${252 + c * 30} ${125 + r * 40} h20 v22 h-20 Z`).join(' '),
        ).join(' ')}
        i={3}
        strokeOpacity={0.6}
      />
      <P d="M185 210 v-40 h30 v40 M172 170 h56" i={4} />
      <P d={circle(200, 98, 12)} i={4} />
      <P d={dim(30, 370, 228)} i={5} strokeOpacity={0.5} />
    </>
  ),
  concrete: (
    <>
      <P d="M120 20 V200 M200 20 V200" i={0} strokeWidth={2} />
      <P d="M100 20 V200 M220 20 V200 M100 40 H120 M100 90 H120 M100 140 H120 M200 40 H220 M200 90 H220 M200 140 H220" i={1} strokeOpacity={0.5} />
      <P d="M80 200 H340 V230 H80 Z" i={2} strokeWidth={2} />
      <P
        d={Array.from({ length: 9 }, (_, k) => `M${125 + k * 9} 200 l8 -10`).join(' ') + ' ' + Array.from({ length: 28 }, (_, k) => `M${84 + k * 9} 230 l8 -10`).join(' ')}
        i={3}
        strokeOpacity={0.3}
      />
      <P d="M135 25 V215 H320 M185 25 V215" i={3} stroke="var(--accent)" strokeWidth={1.8} />
      <P
        d={Array.from({ length: 8 }, (_, k) => `${circle(135, 45 + k * 20, 3)} ${circle(185, 45 + k * 20, 3)}`).join(' ')}
        i={4}
        stroke="var(--accent)"
      />
      <P d="M250 120 h80 M250 120 l10 -6 M250 120 l10 6" i={5} strokeOpacity={0.6} />
      <P d={dim(120, 200, 12)} i={5} strokeOpacity={0.5} />
    </>
  ),
  crane: (
    <>
      <P d="M10 222 H390" i={0} strokeWidth={2} />
      <P d="M150 222 V40 M170 222 V40" i={1} strokeWidth={1.6} />
      <P
        d={Array.from({ length: 9 }, (_, k) => `M150 ${222 - k * 20} L170 ${202 - k * 20} M170 ${222 - k * 20} L150 ${202 - k * 20}`).join(' ')}
        i={2}
        strokeOpacity={0.5}
      />
      <P d="M60 40 H370 M60 52 H370 M160 40 L160 14 M160 14 L80 40 M160 14 L300 40" i={3} />
      <P d="M60 40 v24 h40 v-12" i={4} />
      <P d="M310 52 V150 M300 150 h20 v14 h-20 Z" i={4} stroke="var(--accent)" />
      <P d="M230 222 V170 h120 v52 M230 196 h120 M260 170 v52 M290 170 v52 M320 170 v52" i={5} strokeOpacity={0.6} />
    </>
  ),
}

export function Drawing({ kind, sheet, title }: { kind: DrawingKind; sheet: string; title: string }) {
  return (
    <div className="drawing" aria-hidden="true">
      <motion.svg
        viewBox="0 0 400 240"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.3}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        preserveAspectRatio="xMidYMid meet"
      >
        {art[kind]}
      </motion.svg>
      <div className="drawing-title">
        <span>{title}</span>
        <span>{sheet}</span>
      </div>
    </div>
  )
}
