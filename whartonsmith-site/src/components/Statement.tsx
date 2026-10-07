import { useRef } from 'react'
import { motion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { company } from '../data/site'

const TEXT =
  'For four decades we’ve built the places communities depend on: the plants that make water *safe* *to* *drink*, the schools where kids *grow* *up*, and the venues where people *come* *together*.'

function Word({ word, progress, range }: { word: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.14, 1])
  const highlight = word.startsWith('*')
  return (
    <motion.span className={`word ${highlight ? 'hl' : ''}`} style={{ opacity }}>
      {word.replace(/\*/g, '')}
    </motion.span>
  )
}

/** Paragraph that lights up word by word as it scrolls through the viewport. */
export function Statement() {
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] })
  const words = TEXT.split(' ')

  return (
    <section className="statement section-light" aria-label="About Wharton-Smith">
      <div className="wrap statement-grid">
        <div className="mono eyebrow" style={{ alignSelf: 'start', paddingTop: 12 }}>
          Who we are
        </div>
        <div>
          <p ref={ref}>
            <span className="sr-only">{TEXT.replace(/\*/g, '')}</span>
            <span aria-hidden="true">
              {words.map((w, i) => (
                <Word key={i} word={w} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} />
              ))}
            </span>
          </p>
          <div className="statement-foot mono">
            <span>Founded {company.founded} by {company.founders}</span>
            <span>Headquartered in Sanford, FL</span>
            <span>Vision: {company.vision}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
