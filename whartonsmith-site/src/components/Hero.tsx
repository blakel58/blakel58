import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { company, hero, links, stats, ticker } from '../data/site'
import { Arrow, CountUp, Lines, ease } from './ui'

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const mediaY = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])

  return (
    <section className="hero" id="top" ref={ref} aria-label="Introduction">
      <motion.div className="hero-media" style={{ y: mediaY }}>
        <div className="shot">
          {hero.video ? (
            <video src={hero.video} poster={hero.image.src} autoPlay muted loop playsInline />
          ) : (
            <motion.img
              src={hero.image.src}
              alt=""
              initial={{ scale: 1.25 }}
              animate={{ scale: 1.04 }}
              transition={{ duration: 6, ease: [0.16, 1, 0.3, 1] }}
            />
          )}
          {!hero.image.real && !hero.video && (
            <span className="shot-tag hero-tag" style={{ top: 'calc(var(--nav-h) + 12px)', left: 'auto', right: 12 }}>
              <span>Image / video area · {hero.image.shot}</span>
            </span>
          )}
        </div>
      </motion.div>
      <div className="hero-shade" />

      <div className="wrap hero-content">
        <motion.div
          className="label"
          style={{ color: 'var(--yellow)' }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.3 }}
        >
          General Contractor · Construction Manager · Design-Builder
        </motion.div>
        <Lines
          as="h1"
          immediate
          delay={0.4}
          lines={[
            'We build what',
            'the Southeast',
            <>
              <span className="hl">runs on.</span>
            </>,
          ]}
        />
        <motion.div
          className="hero-row"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease, delay: 1 }}
        >
          <p>
            Water and wastewater plants, schools, justice centers and public facilities, built by {company.name} and our
            own crews since {company.founded}.
          </p>
          <div className="hero-ctas">
            <a className="btn btn-yellow" href="#water">
              See our work <Arrow />
            </a>
            <a className="btn btn-ghost" href={links.contact}>
              Request a proposal <Arrow />
            </a>
          </div>
        </motion.div>
      </div>

      <motion.div className="hero-stats" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1.2 }}>
        <div className="wrap">
          {stats.map((s) => (
            <div className="hero-stat" key={s.label}>
              <strong>
                {s.prefix}
                <CountUp to={s.value} from={s.from ?? 0} />
                {s.suffix && <em>{s.suffix}</em>}
              </strong>
              <span>{s.label}</span>
            </div>
          ))}
          <div className="hero-stat">
            <strong>
              <em>ENR</em> 400
            </strong>
            <span>Top contractors in the U.S.</span>
          </div>
        </div>
      </motion.div>
    </section>
  )
}

export function Ticker() {
  const items = [...ticker, ...ticker]
  return (
    <div className="ticker" aria-hidden="true">
      <motion.div
        className="ticker-track"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 28, ease: 'linear', repeat: Infinity }}
      >
        {[...items, ...items].map((t, i) => (
          <span className="ticker-item" key={i}>
            {t}
            <i />
          </span>
        ))}
      </motion.div>
    </div>
  )
}
