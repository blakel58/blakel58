import type { ReactNode } from 'react'
import { links, markets, type MarketKey } from '../data/site'
import { Arrow, Reveal } from './ui'

const icons: Record<MarketKey, ReactNode> = {
  water: (
    <>
      <path d="M24 5c6 8 11 14 11 20a11 11 0 0 1-22 0c0-6 5-12 11-20Z" />
      <path d="M18 27a6 6 0 0 0 6 6" />
      <path d="M4 43c4 0 4-3 8-3s4 3 8 3 4-3 8-3 4 3 8 3 4-3 8-3" />
    </>
  ),
  municipal: (
    <>
      <path d="M5 17 24 6l19 11H5Z" />
      <path d="M9 21v16M17 21v16M31 21v16M39 21v16" />
      <path d="M4 41h40M6 37h36" />
    </>
  ),
  education: (
    <>
      <path d="M5 42V20h14v22M29 42V20h14v22" />
      <path d="M19 42V12l5-5 5 5v30" />
      <circle cx="24" cy="17" r="3" />
      <path d="M9 25h6M9 31h6M33 25h6M33 31h6M22 42v-8h4v8M3 42h42" />
    </>
  ),
  hospitality: (
    <>
      <ellipse cx="24" cy="30" rx="20" ry="9" />
      <ellipse cx="24" cy="30" rx="11" ry="4.5" />
      <path d="M4 30v6c0 5 9 9 20 9s20-4 20-9v-6" />
      <path d="M10 22V9M38 22V9M10 9l6 3M38 9l-6 3" />
    </>
  ),
  industrial: (
    <>
      <path d="M4 42V22l10 6v-6l10 6v-6l10 6V8h8v34H4Z" />
      <path d="M10 35h4M18 35h4M26 35h4M36 14v4" />
    </>
  ),
  community: (
    <>
      <path d="M4 42V24l10-8 10 8v18" />
      <path d="M24 42V20l10-8 10 8v22" />
      <path d="M11 42v-8h6v8M31 42v-8h6v8M2 42h44" />
    </>
  ),
}

export function Markets() {
  return (
    <section className="section section-alt" id="markets" aria-labelledby="markets-title">
      <div className="container">
        <div className="section-head">
          <Reveal>
            <div className="eyebrow">Markets</div>
            <h2 id="markets-title">Experience across the markets that build communities.</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p>
              From clean water to classrooms, we bring the same people, safety culture and self-perform capability to
              every market we serve.
            </p>
          </Reveal>
        </div>

        <div className="market-grid">
          {markets.map((m, i) => (
            <Reveal key={m.key} delay={(i % 3) * 0.08} as="article">
              <a href={links.projects} className={`market ${i === 0 ? 'is-featured' : ''}`} style={{ height: '100%' }}>
                {i === 0 && <span className="market-tag">Core market</span>}
                <svg
                  className="market-icon"
                  viewBox="0 0 48 48"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  {icons[m.key]}
                </svg>
                <h3>{m.title}</h3>
                <p className="market-body">{m.body}</p>
                <div className="market-examples">
                  <span>{m.examples}</span>
                  <Arrow />
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
