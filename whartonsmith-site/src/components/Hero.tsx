import { useEffect, useRef, useState } from 'react'
import { animate, motion, useInView, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { company, kpis, links, photos } from '../data/site'
import { PlantPlan } from './PlantPlan'
import { Button, ease } from './ui'

function CountUp({ to, from = 0 }: { to: number; from?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const reduce = useReducedMotion()
  const [v, setV] = useState(reduce ? to : from)
  useEffect(() => {
    if (!inView || reduce) return
    const c = animate(from, to, { duration: 1.8, delay: 0.6, ease: [0.16, 1, 0.3, 1], onUpdate: (x) => setV(Math.round(x)) })
    return () => c.stop()
  }, [inView, reduce, from, to])
  return <span ref={ref}>{v}</span>
}

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
}

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const mediaY = useTransform(scrollYProgress, [0, 1], ['0%', '12%'])

  return (
    <section className="hero" id="top" ref={ref} aria-label="Introduction">
      <motion.div className="hero-media" style={{ y: mediaY }}>
        {photos.hero ? (
          <img src={photos.hero} alt="" />
        ) : (
          <>
            <div className="hero-drawing" />
            <PlantPlan className="hero-plan" />
          </>
        )}
      </motion.div>

      <motion.div
        className="container hero-content"
        initial="hidden"
        animate="show"
        transition={{ staggerChildren: 0.12, delayChildren: 0.15 }}
      >
        <motion.div variants={item} className="eyebrow">
          Construction Manager · General Contractor · Design-Builder
        </motion.div>
        <motion.h1 variants={item}>
          We build the water, schools and public facilities <span className="hl">communities depend on.</span>
        </motion.h1>
        <motion.p variants={item} className="hero-lede">
          Since {company.founded}, Wharton-Smith has delivered complex water and wastewater, municipal, education and
          hospitality projects across the Southeast, with our own crews self-performing the critical work.
        </motion.p>
        <motion.div variants={item} className="hero-ctas">
          <Button href={links.projects}>View Our Projects</Button>
          <Button href={links.contact} variant="outline">
            Discuss Your Project
          </Button>
        </motion.div>
      </motion.div>

      <motion.div
        className="kpis"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <div className="container">
          {kpis.map((k) => (
            <div className="kpi" key={k.label}>
              <div className="kpi-value">
                {k.prefix}
                <CountUp to={k.value} from={k.from} />
                {k.suffix && <span className="unit">{k.suffix}</span>}
              </div>
              <div className="kpi-label">{k.label}</div>
            </div>
          ))}
          <div className="kpi">
            <div className="kpi-value">
              <span className="unit">ENR</span> 400
            </div>
            <div className="kpi-label">Top contractors nationwide</div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
