import { useState } from 'react'
import { AnimatePresence, LayoutGroup, motion } from 'motion/react'
import { links, markets, projects, type MarketKey } from '../data/site'
import { Drawing } from './Drawing'
import { Arrow, Pin, Reveal, ease } from './ui'

export function Projects() {
  const used = new Set(projects.map((p) => p.market))
  const filters: { key: MarketKey | 'all'; label: string }[] = [
    { key: 'all', label: 'All Projects' },
    ...markets.filter((m) => used.has(m.key)).map((m) => ({ key: m.key, label: m.title })),
  ]
  const [filter, setFilter] = useState<MarketKey | 'all'>('all')
  const shown = projects.filter((p) => filter === 'all' || p.market === filter)

  return (
    <section className="section" id="projects" aria-labelledby="projects-title">
      <div className="container">
        <div className="projects-head">
          <Reveal>
            <div className="eyebrow">Featured Projects</div>
            <h2 id="projects-title">Proven on projects that matter.</h2>
          </Reveal>
          <LayoutGroup id="project-filters">
            <div className="filters" role="group" aria-label="Filter projects by market">
              {filters.map((f) => (
                <button
                  key={f.key}
                  className={`filter ${filter === f.key ? 'is-active' : ''}`}
                  aria-pressed={filter === f.key}
                  onClick={() => setFilter(f.key)}
                >
                  {filter === f.key && (
                    <motion.span className="filter-pill" layoutId="filter-pill" transition={{ duration: 0.3, ease }} />
                  )}
                  {f.label}
                </button>
              ))}
            </div>
          </LayoutGroup>
        </div>

        <motion.div className="project-grid" layout>
          <AnimatePresence mode="popLayout" initial={false}>
            {shown.map((p, i) => {
              const market = markets.find((m) => m.key === p.market)!
              const specs = [
                ...(p.owner ? [{ label: 'Owner', value: p.owner }] : []),
                ...p.specs,
                ...(p.delivery ? [{ label: 'Delivery', value: p.delivery }] : []),
                ...(p.completed ? [{ label: 'Completed', value: p.completed }] : []),
              ]
              return (
                <motion.article
                  key={p.title}
                  className="project"
                  layout
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '0px 0px -8% 0px' }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.5, ease, delay: (i % 3) * 0.06 }}
                >
                  <div className="project-media">
                    <span className="project-market">{market.title}</span>
                    {p.image ? (
                      <img src={p.image} alt={p.title} loading="lazy" />
                    ) : (
                      <Drawing kind={p.drawing} sheet={`A-${101 + projects.indexOf(p)}`} title={p.location} />
                    )}
                  </div>
                  <div className="project-body">
                    <div className="project-loc">
                      <Pin />
                      {p.location}
                    </div>
                    <h3>{p.title}</h3>
                    <dl className="project-specs">
                      {specs.map((s) => (
                        <div key={s.label}>
                          <dt>{s.label}</dt>
                          <dd>{s.value}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </motion.article>
              )
            })}
          </AnimatePresence>
        </motion.div>

        <div className="projects-foot">
          <a className="btn btn-outline-dark" href={links.projects}>
            View Full Portfolio <Arrow />
          </a>
        </div>
      </div>
    </section>
  )
}
