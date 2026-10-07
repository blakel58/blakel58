import { useRef } from 'react'
import { motion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { figures, processStages, r } from '../data/site'
import { CountUp, Fade, Picture, RevealLines, SectionTag, ease } from './ui'

const STATEMENT =
  'For forty years we have built the plants that make water safe to drink, the schools where children learn, and the civic buildings that hold a community together.'

function Word({ w, progress, range }: { w: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.18, 1])
  return (
    <motion.span className="w" style={{ opacity }}>
      {w}
    </motion.span>
  )
}

export function Statement() {
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.5'] })
  const words = STATEMENT.split(' ')
  return (
    <section className="section" id="company" aria-label="The company">
      <div className="wrap">
        <SectionTag n="01">The company</SectionTag>
        <div className="statement-grid">
          <Fade>
            <span className="label">Sanford, Florida</span>
          </Fade>
          <div>
            <p className="statement-text" ref={ref}>
              <span className="sr-only">{STATEMENT}</span>
              <span aria-hidden="true">
                {words.map((w, i) => (
                  <Word key={i} w={w} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} />
                ))}
              </span>
            </p>
          </div>
        </div>
        <div className="figures">
          {figures.map((f, i) => (
            <Fade key={f.label} delay={i * 0.08} className="figure">
              <div className="figure-num">
                {f.prefix}
                <CountUp to={f.value} from={f.from ?? 0} />
                {f.suffix && <sup>{f.suffix}</sup>}
              </div>
              <p>{f.label}</p>
            </Fade>
          ))}
        </div>
      </div>
    </section>
  )
}

/** A framed image that opens to full-bleed as you scroll through it. */
export function Bleed() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] })
  const inset = useTransform(scrollYProgress, [0.15, 0.7], [12, 0])
  const radius = useTransform(scrollYProgress, [0.15, 0.7], [4, 0])
  const clip = useTransform(() => {
    const i = inset.get()
    return `inset(${i}% ${i * 1.4}% ${i}% ${i * 1.4}% round ${radius.get()}px)`
  })
  const scale = useTransform(scrollYProgress, [0, 1], [1.18, 1])
  const textOpacity = useTransform(scrollYProgress, [0.55, 0.8], [0, 1])
  const textY = useTransform(scrollYProgress, [0.55, 0.85], [40, 0])

  return (
    <section className="bleed" ref={ref} aria-label="Water infrastructure">
      <div className="bleed-sticky">
        <motion.div className="bleed-frame" style={{ clipPath: clip }}>
          <motion.img src={r('plant-low')} alt="Study model of secondary clarifiers at a water reclamation facility" style={{ scale }} />
          <motion.div className="bleed-scrim" style={{ opacity: textOpacity }} />
        </motion.div>
        <motion.h2 className="display bleed-text" style={{ opacity: textOpacity, y: textY }}>
          Clean water is
          <br />
          <em>our first trade.</em>
        </motion.h2>
        <motion.div className="bleed-caption" style={{ opacity: textOpacity }}>
          <span className="label">Fig. 02 · Secondary clarifiers</span>
          <span className="label">Water & Wastewater</span>
        </motion.div>
      </div>
    </section>
  )
}

export function Water() {
  return (
    <section className="section" aria-label="Water and wastewater">
      <div className="wrap">
        <SectionTag n="02">Water & Wastewater</SectionTag>
        <div className="chapter-grid">
          <div className="chapter-title">
            <RevealLines className="display" lines={['Where we began.', <em key="e">What we know best.</em>]} />
            <Fade delay={0.1}>
              <p>
                Wharton-Smith started building water treatment in Central Florida in 1984. Today we deliver treatment
                plants, water reclamation facilities, pump stations and conveyance across the Southeast, with our own
                crews placing the concrete, setting the equipment and running the process piping. ENR Southeast has
                ranked us a top contractor for water supply projects year after year.
              </p>
            </Fade>
          </div>
          <div>
            <ol className="process">
              {processStages.map((s, i) => (
                <motion.li
                  key={s.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '0px 0px -10% 0px' }}
                  transition={{ duration: 1, ease, delay: i * 0.05 }}
                >
                  <span className="index-num">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <h3>{s.title}</h3>
                    <p>{s.body}</p>
                  </div>
                </motion.li>
              ))}
            </ol>
            <div className="chapter-image">
              <Picture src={r('plant-aerial')} alt="Aerial study model of a water reclamation facility" ratio="16 / 11" />
              <div className="caption">
                <span className="label">Fig. 03 · Plant layout, aerial</span>
                <span className="label">Headworks to storage</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
