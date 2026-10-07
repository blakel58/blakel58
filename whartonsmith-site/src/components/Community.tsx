import { motion } from 'motion/react'
import { ease, FadeUp } from './ui'

function House() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M3 11.5 12 4l9 7.5M5.5 9.5V20h13V9.5M10 20v-5h4v5" strokeLinejoin="round" />
    </svg>
  )
}

export function Community() {
  return (
    <section className="community section-light" aria-label="Community investment">
      <div className="wrap community-grid">
        <div>
          <div className="mono eyebrow">In the community</div>
          <motion.div
            className="community-amount"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, ease }}
          >
            $1<span className="unit">M</span>
          </motion.div>
          <FadeUp>
            <h2>For Legacy Point: 19 affordable homes for families in Seminole County.</h2>
            <p>
              In 2025 Wharton-Smith committed $1 million, the largest investment in our history, to Habitat for Humanity
              Seminole-Apopka to help build Legacy Point, a 19-home community of safe, stable and affordable housing a few
              miles from where we started.
            </p>
          </FadeUp>
        </div>

        <div>
          <motion.div
            className="homes"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            transition={{ staggerChildren: 0.06 }}
            aria-hidden="true"
          >
            {Array.from({ length: 20 }, (_, i) =>
              i === 19 ? (
                <motion.div
                  key={i}
                  className="home"
                  style={{ background: 'transparent', border: '1px dashed var(--line-light)' }}
                  variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
                />
              ) : (
                <motion.div
                  key={i}
                  className={`home ${i % 7 === 3 ? 'is-key' : ''}`}
                  variants={{
                    hidden: { opacity: 0, y: 24, scale: 0.85 },
                    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease } },
                  }}
                >
                  <House />
                </motion.div>
              ),
            )}
          </motion.div>
          <div className="homes-caption mono">
            <span>19 homes</span>
            <span>Habitat for Humanity Seminole-Apopka</span>
          </div>
        </div>
      </div>
    </section>
  )
}
