import { motion } from 'motion/react'
import { company, links, markets, nav } from '../data/site'
import { Button, RevealLines, ease } from './ui'

const WORD = ['W', 'H', 'A', 'R', 'T', 'O', 'N', '–', 'S', 'M', 'I', 'T', 'H']

export function Footer() {
  return (
    <footer className="footer section-dark" id="contact">
      <div className="wrap">
        <div className="footer-cta">
          <div>
            <div className="mono eyebrow" style={{ marginBottom: 20 }}>
              Start a project
            </div>
            <RevealLines className="display" lines={['Let’s build', 'something that lasts.']} />
          </div>
          <Button href={links.contact}>Get in touch</Button>
        </div>

        <div className="footer-cols">
          <div>
            <h4 className="mono">Headquarters</h4>
            <address>
              {company.legalName}
              <br />
              {company.hq.street}
              <br />
              {company.hq.city}
            </address>
          </div>
          <div>
            <h4 className="mono">Company</h4>
            <ul>
              {nav.map((n) => (
                <li key={n.href}>
                  <a href={n.href}>{n.label}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mono">Markets</h4>
            <ul>
              {markets.map((m) => (
                <li key={m.key}>
                  <a href="#markets">{m.title}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mono">Connect</h4>
            <ul>
              <li>
                <a href={company.linkedin} target="_blank" rel="noreferrer">
                  LinkedIn ↗
                </a>
              </li>
              <li>
                <a href={links.careers}>Careers</a>
              </li>
              <li>
                <a href={links.contact}>Contact</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <motion.div
        className="footer-word"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.5 }}
        transition={{ staggerChildren: 0.04 }}
        aria-hidden="true"
      >
        {WORD.map((ch, i) => (
          <span key={i}>
            <motion.span
              className={ch === '–' ? 'dash' : undefined}
              variants={{ hidden: { y: '100%' }, show: { y: '0%', transition: { duration: 1, ease } } }}
            >
              {ch}
            </motion.span>
          </span>
        ))}
      </motion.div>

      <div className="wrap">
        <div className="footer-base mono">
          <span>
            © {new Date().getFullYear()} {company.legalName}
          </span>
          <span>Est. {company.founded} · Sanford, Florida</span>
          <a href="#top">Back to top ↑</a>
        </div>
      </div>
    </footer>
  )
}
