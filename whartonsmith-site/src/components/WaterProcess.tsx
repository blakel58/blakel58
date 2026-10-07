import { useEffect, useRef, useState, type ReactNode } from 'react'
import { motion, useInView, useReducedMotion, type Variants } from 'motion/react'
import { processStages } from '../data/site'
import { Reveal, ease } from './ui'

const draw: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  show: (i: number = 0) => ({
    pathLength: 1,
    opacity: 1,
    transition: { pathLength: { duration: 1.2, ease, delay: i * 0.15 }, opacity: { duration: 0.1, delay: i * 0.15 } },
  }),
}

const CX = [100, 300, 500, 700, 900, 1100]
const Y = 130

function Unit({ i, active, children }: { i: number; active: boolean; children: ReactNode }) {
  return (
    <motion.g
      variants={{
        hidden: { opacity: 0, y: 12 },
        show: { opacity: 1, y: 0, transition: { duration: 0.7, ease, delay: 0.2 + i * 0.15 } },
      }}
      stroke={active ? 'var(--accent)' : 'rgba(255,255,255,0.7)'}
      style={{ transition: 'stroke 0.4s' }}
    >
      {children}
    </motion.g>
  )
}

function Diagram({ active }: { active: number }) {
  const x = CX
  return (
    <motion.svg
      viewBox="0 0 1200 260"
      fill="none"
      strokeWidth={1.6}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
      aria-hidden="true"
    >
      {/* main process line */}
      <motion.path
        d={`M0 ${Y} H${x[0] - 60} M${x[0] + 60} ${Y} H${x[1] - 75} M${x[1] + 75} ${Y} H${x[2] - 70} M${x[2] + 70} ${Y} H${x[3] - 60} M${x[3] + 60} ${Y} H${x[4] - 60} M${x[4] + 60} ${Y} H${x[5] - 50}`}
        stroke="rgba(255,255,255,0.35)"
        strokeWidth={4}
        variants={draw}
        custom={0}
      />
      <path id="process-flow" d={`M0 ${Y} H1060`} />
      {[0, 1, 2, 3, 4, 5, 6, 7].map((k) => (
        <circle key={k} r={3.5} fill="var(--accent)">
          <animateMotion dur="8s" repeatCount="indefinite" begin={`-${k}s`}>
            <mpath href="#process-flow" />
          </animateMotion>
        </circle>
      ))}

      {/* 1 headworks: channel with bar screen */}
      <Unit i={0} active={active === 0}>
        <rect x={x[0] - 60} y={Y - 40} width={120} height={80} />
        <path d={`M${x[0] - 20} ${Y - 40} V${Y + 40} M${x[0] - 12} ${Y - 40} V${Y + 40} M${x[0] - 4} ${Y - 40} V${Y + 40} M${x[0] + 4} ${Y - 40} V${Y + 40}`} />
        <path d={`M${x[0] + 22} ${Y + 40} l12 -20 l12 20`} />
      </Unit>

      {/* 2 aeration basin with diffusers */}
      <Unit i={1} active={active === 1}>
        <rect x={x[1] - 75} y={Y - 60} width={150} height={120} />
        <path d={`M${x[1] - 75} ${Y + 44} H${x[1] + 75}`} strokeDasharray="4 6" />
      </Unit>
      {[-50, -25, 0, 25, 50].map((dx, k) => (
        <motion.circle
          key={dx}
          cx={x[1] + dx}
          r={3}
          stroke="rgba(255,255,255,0.6)"
          strokeWidth={1.2}
          initial={{ cy: Y + 40, opacity: 0 }}
          animate={{ cy: [Y + 40, Y - 50], opacity: [0, 1, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, delay: k * 0.45, ease: 'easeOut' }}
        />
      ))}

      {/* 3 secondary clarifier */}
      <Unit i={2} active={active === 2}>
        <circle cx={x[2]} cy={Y} r={70} />
        <circle cx={x[2]} cy={Y} r={60} strokeDasharray="3 5" />
        <circle cx={x[2]} cy={Y} r={14} />
      </Unit>
      <motion.g animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}>
        <line x1={x[2] - 60} y1={Y} x2={x[2] + 60} y2={Y} stroke="var(--accent)" strokeWidth={2} />
      </motion.g>

      {/* 4 filters: media layers */}
      <Unit i={3} active={active === 3}>
        <rect x={x[3] - 60} y={Y - 55} width={120} height={110} />
        <path d={`M${x[3] - 60} ${Y + 5} H${x[3] + 60} M${x[3] - 60} ${Y + 25} H${x[3] + 60}`} />
        <path
          d={Array.from({ length: 11 }, (_, k) => `M${x[3] - 55 + k * 11} ${Y + 25} l8 -20`).join(' ')}
          strokeOpacity={0.5}
        />
        <path d={`M${x[3]} ${Y - 55} V${Y - 30} M${x[3] - 8} ${Y - 38} l8 8 l8 -8`} />
      </Unit>

      {/* 5 chlorine contact / UV: serpentine baffles */}
      <Unit i={4} active={active === 4}>
        <rect x={x[4] - 60} y={Y - 50} width={120} height={100} />
        <path d={`M${x[4] - 30} ${Y - 50} V${Y + 30} M${x[4]} ${Y - 30} V${Y + 50} M${x[4] + 30} ${Y - 50} V${Y + 30}`} />
      </Unit>

      {/* 6 ground storage tank */}
      <Unit i={5} active={active === 5}>
        <ellipse cx={x[5]} cy={Y - 45} rx={50} ry={14} />
        <path d={`M${x[5] - 50} ${Y - 45} V${Y + 45} M${x[5] + 50} ${Y - 45} V${Y + 45}`} />
        <path d={`M${x[5] - 50} ${Y + 45} A50 14 0 0 0 ${x[5] + 50} ${Y + 45}`} />
        <path d={`M${x[5] + 50} ${Y + 20} H1200`} strokeWidth={4} strokeOpacity={0.5} />
      </Unit>

      {/* stage numbers */}
      {CX.map((cx, k) => (
        <motion.text
          key={k}
          x={cx}
          y={248}
          textAnchor="middle"
          fontFamily="var(--font-head)"
          fontWeight={700}
          fontSize={15}
          letterSpacing="1.5"
          fill={active === k ? 'var(--accent)' : 'rgba(255,255,255,0.5)'}
          variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { delay: 0.4 + k * 0.15 } } }}
        >
          {String(k + 1).padStart(2, '0')}
        </motion.text>
      ))}
    </motion.svg>
  )
}

export function WaterProcess() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.3 })
  const reduce = useReducedMotion()
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (!inView || paused || reduce) return
    const t = setInterval(() => setActive((a) => (a + 1) % processStages.length), 2600)
    return () => clearInterval(t)
  }, [inView, paused, reduce])

  return (
    <section className="section section-navy process" id="water" aria-labelledby="water-title">
      <div className="container">
        <div className="section-head">
          <Reveal>
            <div className="eyebrow">Water & Wastewater</div>
            <h2 id="water-title">From headworks to reuse, we build every part of the plant.</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p>
              Water treatment is where Wharton-Smith began in 1984. Today we deliver treatment plants, water reclamation
              facilities, pump stations and conveyance for utilities throughout the Southeast, often as the
              engineer-procure-construct partner.
            </p>
          </Reveal>
        </div>

        <Reveal>
          <div ref={ref} onPointerLeave={() => setPaused(false)}>
            <div className="process-diagram">
              <Diagram active={active} />
            </div>
            <div className="process-steps">
              {processStages.map((s, i) => (
                <button
                  key={s.title}
                  className={`process-step ${active === i ? 'is-active' : ''}`}
                  onPointerEnter={() => {
                    setPaused(true)
                    setActive(i)
                  }}
                  onFocus={() => {
                    setPaused(true)
                    setActive(i)
                  }}
                  onClick={() => setActive(i)}
                >
                  <div className="process-step-num">{String(i + 1).padStart(2, '0')}</div>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        <div className="process-facts">
          {[
            {
              t: 'Self-performed heavy civil',
              b: 'Our own crews place the cast-in-place concrete, set the equipment and run the process piping.',
            },
            {
              t: 'Collaborative delivery',
              b: 'CMAR, progressive design-build and EPC. We are a member of the Water Collaborative Delivery Association.',
            },
            {
              t: 'Plants that stay online',
              b: 'Phased expansions and upgrades at operating facilities, sequenced around the utility’s operations.',
            },
          ].map((f, i) => (
            <Reveal className="process-fact" key={f.t} delay={i * 0.08}>
              <h3>{f.t}</h3>
              <p>{f.b}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
