import { useState } from 'react'
import { AnimatePresence, LayoutGroup, motion } from 'motion/react'
import { links, markets, projects, type MarketKey } from '../data/site'
import { MarketArt } from './MarketArt'
import { Arrow, Button, RevealLines, ease } from './ui'

const tint: Record<MarketKey, string> = {
  water: '#0f2633',
  municipal: '#25211d',
  education: '#1a2620',
  hospitality: '#2c1a13',
  community: '#2a2012',
}

function Plate({ market, index }: { market: MarketKey; index: number }) {
  return (
    <div
      className="project-plate"
      style={{
        background: `radial-gradient(120% 90% at 80% 10%, ${tint[market]}, var(--ink) 70%)`,
        color: 'var(--bone)',
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(var(--line-dark) 1px, transparent 1px), linear-gradient(90deg, var(--line-dark) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          opacity: 0.6,
        }}
      />
      <div style={{ position: 'absolute', inset: '8% -6% -6% 18%', opacity: 0.7 }}>
        <MarketArt market={market} />
      </div>
      <div
        className="display"
        style={{
          position: 'absolute',
          left: 18,
          bottom: '28%',
          fontSize: 'clamp(64px, 8vw, 140px)',
          color: 'transparent',
          WebkitTextStroke: '1px rgba(239,235,227,0.18)',
        }}
        aria-hidden="true"
      >
        {String(index + 1).padStart(2, '0')}
      </div>
    </div>
  )
}

export function Projects() {
  const [filter, setFilter] = useState<MarketKey | 'all'>('all')
  const filters: { key: MarketKey | 'all'; label: string }[] = [
    { key: 'all', label: 'All work' },
    ...markets.map((m) => ({ key: m.key, label: m.short })),
  ]
  const shown = projects.filter((p) => filter === 'all' || p.market === filter)

  return (
    <section className="projects section-light" id="projects" aria-label="Featured projects">
      <div className="wrap">
        <div className="projects-head">
          <div>
            <div className="mono eyebrow" style={{ marginBottom: 20 }}>
              Selected work
            </div>
            <RevealLines className="display" lines={['Built to last.']} />
          </div>
          <LayoutGroup id="filters">
            <div className="filters" role="group" aria-label="Filter projects by market">
              {filters.map((f) => (
                <button
                  key={f.key}
                  className={`filter ${filter === f.key ? 'is-active' : ''}`}
                  aria-pressed={filter === f.key}
                  onClick={() => setFilter(f.key)}
                >
                  {filter === f.key && (
                    <motion.span className="filter-pill" layoutId="filter-pill" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />
                  )}
                  {f.label}
                </button>
              ))}
            </div>
          </LayoutGroup>
        </div>

        <motion.div className="project-grid" layout>
          <AnimatePresence mode="popLayout">
            {shown.map((p, i) => {
              const wide = filter === 'all' && i === 0
              const marketName = markets.find((m) => m.key === p.market)?.short
              return (
                <motion.a
                  href="#"
                  layout
                  key={p.title}
                  className={`project ${wide ? 'is-wide' : ''}`}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={{ duration: 0.7, ease, delay: i * 0.04 }}
                  onClick={(e) => e.preventDefault()}
                >
                  <div className="project-media">
                    <div className="project-media-inner">
                      {p.image ? <img src={p.image} alt="" loading="lazy" /> : <Plate market={p.market} index={projects.indexOf(p)} />}
                    </div>
                    <div className="project-overlay">
                      <div className="project-top">
                        <span className="mono project-chip">{marketName}</span>
                        <span className="project-go" aria-hidden="true">
                          <Arrow className="" />
                        </span>
                      </div>
                      <div>
                        <h3>{p.title}</h3>
                        <div className="mono project-sub">
                          {p.location} · {p.delivery}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.a>
              )
            })}
          </AnimatePresence>
        </motion.div>

        <div className="projects-foot">
          <span className="mono">Representative work. Full portfolio available on request.</span>
          <Button href={links.projects} variant="ghost">
            View all projects
          </Button>
        </div>
      </div>
    </section>
  )
}
