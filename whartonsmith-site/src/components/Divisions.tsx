import { useState } from 'react'
import { motion } from 'motion/react'
import { commercial, water, type Img } from '../data/site'
import { Arrow, Check, Fade, Lines, Shot, Station, ease } from './ui'

/** Two divisions side by side; the hovered one widens. */
export function Divisions() {
  const [hover, setHover] = useState<0 | 1 | null>(null)
  const panels = [
    {
      id: 'water',
      kicker: 'Water Division',
      color: 'var(--water)',
      title: 'Water',
      body: 'Treatment plants, water reclamation, pump stations and conveyance. Where we started in 1984 and what we are known for.',
      list: ['Treatment', 'Reclamation', 'Pump stations', 'Conveyance'],
      image: water.divisionImage,
    },
    {
      id: 'commercial',
      kicker: 'Commercial Division',
      color: 'var(--yellow)',
      title: 'Commercial',
      body: 'Justice centers, schools, public safety, venues and community buildings, delivered as CM, GC or design-builder.',
      list: ['Municipal', 'Education', 'Justice', 'Hospitality'],
      image: commercial.divisionImage,
    },
  ]
  return (
    <section className="divisions" aria-label="Our divisions" onPointerLeave={() => setHover(null)}>
      {panels.map((p, i) => (
        <motion.a
          key={p.id}
          href={`#${p.id}`}
          className="division"
          onPointerEnter={() => setHover(i as 0 | 1)}
          animate={{ flexGrow: hover === null ? 1 : hover === i ? 1.45 : 0.75 }}
          transition={{ duration: 0.8, ease }}
        >
          <Shot image={p.image as Img} parallax={false} wipe={false} />
          <div className="division-shade" />
          <div className="division-body">
            <span className="label division-kicker" style={{ background: p.color, color: p.id === 'water' ? '#fff' : undefined }}>
              {p.kicker}
            </span>
            <Lines className="display" lines={[p.title]} />
            <p>{p.body}</p>
            <ul className="division-list" style={{ color: p.color }}>
              {p.list.map((l) => (
                <li key={l}>
                  <span style={{ color: 'var(--on-dark)' }}>{l}</span>
                </li>
              ))}
            </ul>
            <span className="btn btn-yellow" style={p.id === 'water' ? { background: 'var(--water)', color: '#fff' } : undefined}>
              Explore {p.title} <Arrow />
            </span>
          </div>
        </motion.a>
      ))}
    </section>
  )
}

function Cards({ projects }: { projects: { title: string; location: string; specs: string[]; image: Img }[] }) {
  return (
    <div className="cards">
      {projects.map((p, i) => (
        <motion.article
          key={p.title}
          className="card"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -8% 0px' }}
          transition={{ duration: 0.8, ease, delay: i * 0.1 }}
        >
          <Shot image={p.image} alt={p.title} />
          <div className="card-body">
            <span className="card-loc">{p.location}</span>
            <h4>{p.title}</h4>
            <div className="card-specs">
              {p.specs.map((s) => (
                <span key={s}>{s}</span>
              ))}
            </div>
          </div>
        </motion.article>
      ))}
    </div>
  )
}

export function Water() {
  return (
    <section className="section water-sec" id="water" aria-label="Water division">
      <div className="wrap">
        <Station sta="1+00" right="Water & Wastewater">
          Water Division
        </Station>
        <div className="detail-grid">
          <div className="detail-copy">
            <Lines className="display section-title" lines={['Clean water', <span key="h" className="hl-water">is our first</span>, 'trade.']} />
            <Fade delay={0.1}>
              <p className="section-lede">
                For four decades we’ve built the plants that make water safe and put it back to work. Our own crews place
                the concrete, set the equipment and run the process piping, and ENR Southeast ranks us a top contractor
                for water supply projects.
              </p>
            </Fade>
            <ul className="checks">
              {water.capabilities.map((c, i) => (
                <motion.li
                  key={c}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease, delay: i * 0.05 }}
                >
                  <Check />
                  {c}
                </motion.li>
              ))}
            </ul>
          </div>
          <div className="detail-media">
            <Shot image={water.image} alt="Water treatment facility" />
            <Fade className="detail-badge" delay={0.3}>
              <strong>Since 1984</strong>
              <span>Building water in the Southeast</span>
            </Fade>
          </div>
        </div>

        <div className="projects-row">
          <div className="projects-head">
            <h3>Water projects</h3>
            <a className="label" href="#water">
              All water work →
            </a>
          </div>
          <Cards projects={water.projects} />
        </div>
      </div>
    </section>
  )
}

export function Commercial() {
  return (
    <section className="section dark grain" id="commercial" aria-label="Commercial division">
      <div className="wrap">
        <Station sta="2+00" right="Municipal · Education · Venues">
          Commercial Division
        </Station>
        <div className="detail-grid" style={{ alignItems: 'end' }}>
          <Lines className="display section-title" lines={['Schools. Justice.', 'Public safety.', <span key="h" className="hl">Venues.</span>]} />
          <Fade delay={0.1}>
            <p className="section-lede">
              The buildings a community counts on, delivered on public budgets and immovable dates, as construction
              manager, general contractor or design-builder.
            </p>
          </Fade>
        </div>

        <div className="markets">
          {commercial.markets.map((m, i) => (
            <motion.a
              key={m.name}
              href="#commercial"
              className="market"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease, delay: i * 0.08 }}
            >
              <Shot image={m.image} parallax={false} wipe={false} />
              <div className="market-shade" />
              <div className="market-body">
                <span className="label">0{i + 1}</span>
                <h3>{m.name}</h3>
                <p>{m.desc}</p>
              </div>
            </motion.a>
          ))}
        </div>

        <div className="projects-row">
          <div className="projects-head">
            <h3>Commercial projects</h3>
            <a className="label" href="#commercial" style={{ color: 'var(--yellow)' }}>
              All commercial work →
            </a>
          </div>
          <Cards projects={commercial.projects} />
        </div>
      </div>
    </section>
  )
}
