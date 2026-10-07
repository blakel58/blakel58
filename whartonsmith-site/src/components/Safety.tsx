import { safety } from '../data/site'
import { Reveal } from './ui'

export function Safety() {
  return (
    <section className="section section-navy safety" id="safety" aria-labelledby="safety-title">
      <div className="safety-stripe" aria-hidden="true" />
      <div className="container safety-grid">
        <Reveal>
          <div className="eyebrow">Safety</div>
          <h2 id="safety-title">Everyone goes home safe. Every day.</h2>
          <p className="safety-lede">
            Safety is the first item on every agenda, from preconstruction meetings to the morning huddle on site. It is
            how we protect our people, our partners and the communities we build in.
          </p>
        </Reveal>
        <div className="safety-items">
          {safety.map((s, i) => (
            <Reveal className="safety-item" key={s.title} delay={i * 0.08}>
              <div className="safety-item-num">{String(i + 1).padStart(2, '0')}</div>
              <div>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
