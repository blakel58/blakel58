import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { links } from '../data/site'
import { Button, RevealLines } from './ui'

const roles = [
  'Project Managers',
  'Superintendents',
  'Field Engineers',
  'Estimators',
  'Preconstruction',
  'Craft Professionals',
  'Safety',
  'Internships',
]

export function Careers() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const rotate = useTransform(scrollYProgress, [0, 1], [-30, 60])

  return (
    <section className="careers" id="careers" ref={ref} aria-label="Careers">
      <motion.svg
        viewBox="0 0 200 200"
        aria-hidden="true"
        style={{
          position: 'absolute',
          right: '-8vw',
          top: '-10vw',
          width: '48vw',
          maxWidth: 720,
          rotate,
          opacity: 0.18,
        }}
      >
        <path d="M100 0v200M0 100h200M29 29l142 142M171 29 29 171" stroke="var(--ink)" strokeWidth="22" />
      </motion.svg>

      <div className="wrap" style={{ position: 'relative' }}>
        <div className="mono eyebrow" style={{ marginBottom: 24 }}>
          Careers
        </div>
        <RevealLines className="display" lines={['Build a career', 'with people', 'who build.']} />
        <div className="careers-row">
          <p>
            From field engineers on their first jobsite to superintendents running nine-figure projects, our people are
            the reason owners keep coming back. Grow with a builder that’s been named a best place to work.
          </p>
          <Button href={links.careers}>See open roles</Button>
        </div>
        <div className="roles">
          {roles.map((r) => (
            <span key={r}>{r}</span>
          ))}
        </div>
      </div>
    </section>
  )
}
