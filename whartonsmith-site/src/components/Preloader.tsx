import { useEffect, useState } from 'react'
import { animate, motion } from 'motion/react'
import { company } from '../data/site'
import { ease } from './ui'

const END_YEAR = new Date().getFullYear()

/** Counts 1984 → today, then wipes away to reveal the page. */
export function Preloader({ onDone }: { onDone: () => void }) {
  const [year, setYear] = useState(company.founded)

  useEffect(() => {
    const controls = animate(company.founded, END_YEAR, {
      duration: 1.5,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (v) => setYear(Math.round(v)),
      onComplete: () => setTimeout(onDone, 250),
    })
    return () => controls.stop()
  }, [onDone])

  return (
    <motion.div
      className="preloader"
      initial={{ clipPath: 'inset(0 0 0% 0)' }}
      exit={{ clipPath: 'inset(0 0 100% 0)', transition: { duration: 0.9, ease } }}
      aria-hidden="true"
    >
      <div className="preloader-meta mono">
        <span>Wharton-Smith, Inc.</span>
        <span>Building since {company.founded}</span>
      </div>
      <motion.div
        className="preloader-year"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -80, opacity: 0, transition: { duration: 0.6, ease } }}
        transition={{ duration: 0.6, ease }}
      >
        {year}
      </motion.div>
    </motion.div>
  )
}
