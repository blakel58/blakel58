import { company, credentials, links } from '../data/site'
import { Arrow, Check, Reveal } from './ui'

export function Credentials() {
  return (
    <div className="credentials" aria-label="Recognition">
      <div className="container">
        <span className="credentials-label">Recognized by</span>
        <ul>
          {credentials.map((c) => (
            <li key={c}>
              <Check />
              {c}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export function Intro() {
  return (
    <section className="section intro" aria-label="About Wharton-Smith">
      <div className="container intro-grid">
        <Reveal>
          <div className="eyebrow">About Wharton-Smith</div>
          <h2>Four decades of building critical infrastructure across the Southeast.</h2>
        </Reveal>
        <Reveal className="intro-body" delay={0.1}>
          <p>
            Founded in {company.founded} by {company.founders}, Wharton-Smith is a construction manager, general
            contractor and design-build firm headquartered in Sanford, Florida. We operate from eleven offices across
            Florida, Texas, Louisiana and North Carolina.
          </p>
          <p>
            Our work began with water and wastewater treatment, and it remains our core strength: self-performed heavy
            civil, structural, mechanical and cast-in-place concrete construction. ENR Southeast consistently ranks us
            among the region’s top contractors for water supply projects.
          </p>
          <a className="text-link" href={links.contact}>
            Our story & leadership <Arrow />
          </a>
        </Reveal>
      </div>
    </section>
  )
}
