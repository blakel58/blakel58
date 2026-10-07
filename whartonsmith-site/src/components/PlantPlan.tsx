import { motion, type Variants } from 'motion/react'
import { ease } from './ui'

// Animated plan view of a water reclamation facility, used behind the hero
// until real photography is supplied.
const draw: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  show: (i: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: { pathLength: { duration: 1.8, ease, delay: 0.2 + i * 0.08 }, opacity: { duration: 0.2, delay: 0.2 + i * 0.08 } },
  }),
}

const fade: Variants = {
  hidden: { opacity: 0 },
  show: (i: number) => ({ opacity: 1, transition: { duration: 0.8, delay: 0.6 + i * 0.08 } }),
}

const PIPE = 'M200 225 H260 V420 M420 590 H500 V260 H450 M790 260 H860 V440 M980 560 H1060'
const FLOW = 'M130 225 H260 V480 H420 V590 H500 V260 H620 M790 260 H860 V560 H1060'

function Clarifier({ cx, cy, r, i, speed }: { cx: number; cy: number; r: number; i: number; speed: number }) {
  const spokes = Array.from({ length: 16 }, (_, k) => {
    const a = (k / 16) * Math.PI * 2
    return `M${cx + Math.cos(a) * r * 0.26} ${cy + Math.sin(a) * r * 0.26} L${cx + Math.cos(a) * r * 0.86} ${cy + Math.sin(a) * r * 0.86}`
  }).join(' ')
  return (
    <g>
      <motion.circle cx={cx} cy={cy} r={r} variants={draw} custom={i} strokeWidth={1.4} />
      <motion.circle cx={cx} cy={cy} r={r * 0.9} variants={draw} custom={i + 1} strokeDasharray="2 6" />
      <motion.circle cx={cx} cy={cy} r={r * 0.24} variants={draw} custom={i + 2} />
      <motion.path d={spokes} variants={fade} custom={i} strokeOpacity={0.25} />
      <motion.g variants={fade} custom={i + 2}>
        <motion.g animate={{ rotate: 360 }} transition={{ duration: speed, ease: 'linear', repeat: Infinity }}>
          <line x1={cx - r * 0.9} y1={cy} x2={cx + r * 0.9} y2={cy} stroke="var(--accent)" strokeWidth={2} strokeOpacity={1} />
          <rect x={cx + r * 0.9 - 12} y={cy - 6} width={12} height={12} fill="var(--accent)" stroke="none" />
        </motion.g>
      </motion.g>
    </g>
  )
}

export function PlantPlan({ className }: { className?: string }) {
  return (
    <motion.svg
      className={className}
      viewBox="0 0 1100 820"
      fill="none"
      stroke="currentColor"
      strokeOpacity={0.4}
      strokeWidth={1}
      initial="hidden"
      animate="show"
      aria-hidden="true"
    >
      {/* Headworks */}
      <motion.rect x={60} y={180} width={140} height={90} variants={draw} custom={0} />
      <motion.path d="M60 205 H200 M60 245 H200" variants={draw} custom={1} strokeDasharray="3 5" />

      {/* Aeration basins with serpentine baffles */}
      <motion.rect x={100} y={420} width={320} height={300} variants={draw} custom={2} strokeWidth={1.4} />
      <motion.path d="M180 420 V680 M260 460 V720 M340 420 V680" variants={draw} custom={3} />
      {Array.from({ length: 4 }, (_, lane) =>
        Array.from({ length: 6 }, (_, row) => (
          <motion.circle
            key={`${lane}-${row}`}
            cx={140 + lane * 80}
            cy={470 + row * 40}
            r={3}
            variants={fade}
            custom={4 + lane}
            strokeOpacity={0.4}
          />
        )),
      )}

      {/* Clarifiers */}
      <Clarifier cx={705} cy={260} r={150} i={4} speed={40} />
      <Clarifier cx={860} cy={560} r={120} i={6} speed={32} />

      {/* Process piping */}
      <motion.path d={PIPE} variants={draw} custom={5} strokeWidth={2} strokeOpacity={0.35} />
      <path id="flow-path" d={FLOW} stroke="none" />
      {[0, 1.3, 2.6, 3.9].map((begin) => (
          <circle key={begin} r={3.5} fill="var(--accent)" stroke="none">
            <animateMotion dur="5.2s" repeatCount="indefinite" begin={`-${begin}s`} rotate="auto">
              <mpath href="#flow-path" />
            </animateMotion>
          </circle>
      ))}

      {/* Dimensions and labels */}
      <motion.g variants={fade} custom={8} strokeOpacity={0.35} fill="currentColor" fillOpacity={0.5} fontSize={11} fontFamily="var(--font-head)">
        <path d="M555 450 H855 M555 444 V456 M855 444 V456" />
        <text x={705} y={472} textAnchor="middle" stroke="none" letterSpacing="1.5">
          Ø 30.0 M
        </text>
        <path d="M100 750 H420 M100 744 V756 M420 744 V756" />
        <text x={260} y={772} textAnchor="middle" stroke="none" letterSpacing="1.5">
          AERATION BASINS 01–04
        </text>
        <text x={60} y={168} stroke="none" letterSpacing="1.5">
          HEADWORKS
        </text>
        <text x={860} y={705} textAnchor="middle" stroke="none" letterSpacing="1.5">
          SECONDARY CLARIFIER 02
        </text>
        <text x={1060} y={548} textAnchor="end" stroke="none" letterSpacing="1.5">
          EFFLUENT →
        </text>
        {/* north arrow */}
        <path d="M1040 390 L1052 420 L1040 413 L1028 420 Z" />
        <text x={1040} y={380} textAnchor="middle" stroke="none">
          N
        </text>
      </motion.g>
    </motion.svg>
  )
}
