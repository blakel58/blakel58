import { lazy, Suspense, useEffect, useRef, useState, type ReactNode } from 'react'
import { animate, motion, useInView } from 'motion/react'
import { r, tools } from '../data/site'
import { Fade, Lines, Shot, Station, ease } from './ui'

const Stage = lazy(() => import('../three/Stage').then((m) => ({ default: m.Stage })))

const BUILD_SECONDS = 3.2
const PHASES = ['Sitework', 'Structure', 'Process', 'Commission']
const WEEKS = 104

function canRunLive() {
  if (typeof window === 'undefined') return false
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  if (!window.matchMedia('(min-width: 760px)').matches) return false
  try {
    return !!document.createElement('canvas').getContext('webgl2')
  } catch {
    return false
  }
}

const icons: Record<string, ReactNode> = {
  bim: <path d="M6 14 20 6l14 8v16l-14 8-14-8zM6 14l14 8 14-8M20 22v16" />,
  sched: <path d="M6 8h28v26H6zM6 15h28M13 5v6M27 5v6M11 21h8M15 27h12" />,
  drone: <path d="M8 10h8M24 10h8M12 10v4M28 10v4M14 16h12v6H14zM17 22l-3 6M23 22l3 6M20 26v8" />,
  prefab: <path d="M6 30h28M10 30V14h8v16M22 30V8h8v22M10 20h8M22 15h8M22 22h8" />,
  field: <path d="M11 5h18v30H11zM15 31h10M15 11h10M15 16h10M15 21h6" />,
}

/** 4D sequencing demo: drag the timeline to build the plant. */
function Viewer() {
  const [live] = useState(canRunLive)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.35 })
  const progressRef = useRef({ current: 0 })
  const [value, setValue] = useState(0)
  const [touched, setTouched] = useState(false)

  useEffect(() => {
    progressRef.current.current = (value / 100) * BUILD_SECONDS
  }, [value])

  // Play the build once when the viewer first scrolls into view.
  useEffect(() => {
    if (!inView || touched || !live) return
    const c = animate(value, 100, { duration: 7, ease: 'easeInOut', onUpdate: (v) => setValue(v) })
    return () => c.stop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, touched, live])

  const phase = Math.min(PHASES.length - 1, Math.floor((value / 100) * PHASES.length))
  return (
    <div ref={ref}>
      <div className="viewer">
        {live ? (
          <Suspense fallback={<img src={r('site-4d')} alt="" />}>
            <Stage view="site-4d" manual={progressRef.current} active={inView} />
          </Suspense>
        ) : (
          <img src={r('site-4d')} alt="Model of a water plant under construction" />
        )}
        <div className="viewer-hud">
          <b>4D model</b>
          <span>Week {live ? Math.round((value / 100) * WEEKS) : WEEKS}</span>
        </div>
      </div>
      {live && (
        <div className="scrubber">
          <div className="scrubber-top">
            <strong>Drag to build</strong>
            <span className="label" style={{ color: 'var(--yellow)' }}>
              {PHASES[phase]}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={0.1}
            value={value}
            aria-label="Construction timeline"
            onChange={(e) => {
              setTouched(true)
              setValue(Number(e.target.value))
            }}
          />
          <div className="phases">
            {PHASES.map((p, i) => (
              <span key={p} className={i <= phase ? 'is-on' : ''}>
                {p}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export function Technology() {
  return (
    <section className="section tech" id="technology" aria-label="Technology">
      <div className="wrap">
        <Station sta="3+00" right="VDC · BIM · Reality capture">
          Technology
        </Station>
        <div className="detail-grid" style={{ alignItems: 'end', marginBottom: 'clamp(32px, 4vw, 56px)' }}>
          <Lines className="display section-title" lines={['Built digitally', <span key="h" className="hl">before we</span>, 'break ground.']} />
          <Fade delay={0.1}>
            <p className="section-lede">
              Every project is modeled, coordinated and sequenced before crews mobilize. Conflicts get solved on screen
              instead of in concrete, and owners see the job built before day one.
            </p>
          </Fade>
        </div>

        <div className="tech-grid">
          <Fade>
            <Viewer />
          </Fade>
          <ul className="tools">
            {tools.map((t, i) => (
              <motion.li
                key={t.key}
                className="tool"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease, delay: i * 0.07 }}
              >
                <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" aria-hidden="true">
                  {icons[t.key]}
                </svg>
                <div>
                  <h3>{t.title}</h3>
                  <p>{t.body}</p>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>

        <div className="models">
          <Shot image={{ src: r('plant-aerial'), shot: 'Coordinated model screenshot' }} alt="Coordinated water plant model" />
          <Shot image={{ src: r('civic-a'), shot: 'Drone progress photo' }} alt="Civic campus model" />
          <Shot image={{ src: r('school-a'), shot: 'Laser scan or point cloud' }} alt="School campus model" />
        </div>
      </div>
    </section>
  )
}
