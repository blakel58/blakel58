import { links, news, photos, roles } from '../data/site'
import { Drawing } from './Drawing'
import { Arrow, Button, Reveal } from './ui'

export function News() {
  return (
    <section className="section section-alt" id="news" aria-labelledby="news-title">
      <div className="container">
        <div className="section-head">
          <Reveal>
            <div className="eyebrow">News & Community</div>
            <h2 id="news-title">What’s new at Wharton‑Smith.</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p>Project milestones, industry recognition and the community work our people are proud of.</p>
          </Reveal>
        </div>
        <div className="news-grid">
          {news.map((n, i) => (
            <Reveal key={n.title} delay={i * 0.06} as="article" className={`news-card ${i === 0 ? 'is-lead' : ''}`}>
              <div className="news-date">{n.date}</div>
              <h3>{n.title}</h3>
              <p>{n.body}</p>
              <a className="text-link" href="#news">
                Read more <Arrow />
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Careers() {
  return (
    <section className="section careers" id="careers" aria-labelledby="careers-title">
      <div className="container split">
        <Reveal className="split-copy">
          <div className="eyebrow">Careers</div>
          <h2 id="careers-title">Build your career with a builder that invests in its people.</h2>
          <p>
            From field engineers on their first jobsite to superintendents running major programs, our people are the
            reason owners come back to us. We train and promote from within, and we’ve been recognized as a Top
            Workplace.
          </p>
          <div className="roles">
            {roles.map((r) => (
              <span key={r}>{r}</span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Button href={links.careers}>View Open Positions</Button>
            <Button href={links.careers} variant="outline">
              Internships
            </Button>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="split-media">
            {photos.careers ? (
              <img src={photos.careers} alt="Wharton-Smith field team on a jobsite" />
            ) : (
              <Drawing kind="crane" sheet="G-001" title="Careers" />
            )}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export function CtaBand() {
  return (
    <section className="cta-band" aria-labelledby="cta-title">
      <div className="container">
        <div>
          <h2 id="cta-title">Planning a project? Let’s talk early.</h2>
          <p>
            The earlier we’re involved, the more we can do for your budget and schedule. Reach out to our team to
            discuss your next water, municipal, education or hospitality project.
          </p>
        </div>
        <div className="cta-band-actions">
          <a className="btn btn-dark" href={links.contact}>
            Contact Us <Arrow />
          </a>
          <a className="btn btn-outline" href={links.bids}>
            Bid Opportunities <Arrow />
          </a>
        </div>
      </div>
    </section>
  )
}
