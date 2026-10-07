import { company, links, markets, services } from '../data/site'
import { Logo } from './ui'

export function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="container">
        <div className="footer-top">
          <div>
            <Logo />
            <address>
              {company.legalName}
              <br />
              {company.hq.street}
              <br />
              {company.hq.city}
            </address>
            <p className="footer-vision">Our vision: {company.vision.replace(/^To be/, 'to be')}</p>
          </div>
          <div>
            <h4>Markets</h4>
            <ul>
              {markets.map((m) => (
                <li key={m.key}>
                  <a href="#markets">{m.title}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Services</h4>
            <ul>
              {services.map((s) => (
                <li key={s.title}>
                  <a href="#services">{s.short}</a>
                </li>
              ))}
              <li>
                <a href="#self-perform">Self-Perform</a>
              </li>
            </ul>
          </div>
          <div>
            <h4>Company</h4>
            <ul>
              <li>
                <a href="#projects">Projects</a>
              </li>
              <li>
                <a href="#safety">Safety</a>
              </li>
              <li>
                <a href="#locations">Locations</a>
              </li>
              <li>
                <a href="#news">News</a>
              </li>
              <li>
                <a href={links.careers}>Careers</a>
              </li>
            </ul>
          </div>
          <div>
            <h4>Partners</h4>
            <ul>
              <li>
                <a href={links.bids}>Bid Opportunities</a>
              </li>
              <li>
                <a href={links.prequal}>Subcontractor Prequalification</a>
              </li>
              <li>
                <a href={links.contact}>Contact Us</a>
              </li>
              <li>
                <a href={company.linkedin} target="_blank" rel="noreferrer">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href={company.facebook} target="_blank" rel="noreferrer">
                  Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} {company.legalName} All rights reserved. Equal Opportunity Employer.
          </span>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            <li>
              <a href="#">Privacy Policy</a>
            </li>
            <li>
              <a href="#top">Back to top ↑</a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  )
}
