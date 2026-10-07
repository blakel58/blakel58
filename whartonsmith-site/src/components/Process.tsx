import { motion } from 'motion/react'
import { processSteps } from '../data/site'
import { Fade, Lines, Station, ease } from './ui'

type Bar = { label: string; from: number; to: number; lane: number; hot?: boolean }

// Illustrative schedule, in months, across a 12-month axis.
const traditional: Bar[] = [
  { label: 'Design', from: 0, to: 3.5, lane: 0 },
  { label: 'Bid & award', from: 3.5, to: 4.6, lane: 1 },
  { label: 'Procurement', from: 4.6, to: 6.6, lane: 2 },
  { label: 'Construction', from: 6.6, to: 12, lane: 0 },
]
const collaborative: Bar[] = [
  { label: 'Design', from: 0, to: 3.5, lane: 0 },
  { label: 'Preconstruction & VDC', from: 0.4, to: 3.6, lane: 1, hot: true },
  { label: 'Early procurement', from: 2, to: 4.4, lane: 2, hot: true },
  { label: 'Construction · self-perform', from: 3.6, to: 9.8, lane: 0 },
]

function Track({ bars, kind, finish, finishLabel }: { bars: Bar[]; kind: 'trad' | 'ws'; finish: number; finishLabel: string }) {
  return (
    <motion.div className="gantt-track" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }}>
      {bars.map((b, i) => (
        <motion.div
          key={b.label}
          className={`gantt-bar ${kind} ${b.hot ? 'hot' : ''}`}
          style={{ left: `${(b.from / 12) * 100}%`, width: `${((b.to - b.from) / 12) * 100}%`, top: b.lane * 27 }}
          variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 0.8, ease, delay: 0.2 + i * 0.25 } } }}
        >
          {b.label}
        </motion.div>
      ))}
      <motion.div
        className="gantt-flag"
        style={{ left: `${(finish / 12) * 100}%` }}
        variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { delay: 1.4 } } }}
      >
        <span>{finishLabel}</span>
      </motion.div>
    </motion.div>
  )
}

export function Process() {
  return (
    <section className="section" id="process" aria-label="How we improve the construction process">
      <div className="wrap">
        <Station sta="4+00" right="CMAR · Design-Build · Progressive DB">
          Our Process
        </Station>
        <div className="detail-grid" style={{ alignItems: 'end' }}>
          <Lines className="display section-title" lines={['Faster. Safer.', <span key="a" className="mark">Fewer</span>, <span key="b" className="mark">surprises.</span>]} />
          <Fade delay={0.1}>
            <p className="section-lede">
              The biggest savings on a project happen before the first shovel. By joining early, modeling everything and
              buying long-lead equipment during design, we overlap work that usually happens one step at a time.
            </p>
          </Fade>
        </div>

        <Fade className="gantt">
          <div className="gantt-inner">
            <div className="gantt-scale" aria-hidden="true">
              <span>Delivery</span>
              {Array.from({ length: 12 }, (_, i) => (
                <span key={i}>M{i + 1}</span>
              ))}
            </div>
            <div className="gantt-row">
              <h4>
                Traditional
                <small>Design-bid-build, one step at a time</small>
              </h4>
              <Track bars={traditional} kind="trad" finish={12} finishLabel="Complete" />
            </div>
            <div className="gantt-row">
              <h4>
                The collaborative way
                <small>CMAR / design-build, overlapped</small>
              </h4>
              <Track bars={collaborative} kind="ws" finish={9.8} finishLabel="Complete, sooner" />
            </div>
          </div>
          <p className="gantt-note">Illustrative only. Actual schedules vary by project and delivery method.</p>
        </Fade>

        <div className="steps">
          {processSteps.map((s, i) => (
            <motion.div
              key={s.title}
              className="step"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease, delay: i * 0.08 }}
            >
              <div className="step-num">0{i + 1}</div>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
              <div className="step-gain">→ {s.gain}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
