import { useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Careers, Crew, Locations } from './components/Company'
import { Card, Cards, Commercial, Divisions, Water } from './components/Divisions'
import { Hero, Ticker } from './components/Hero'
import { Process } from './components/Process'
import { Technology } from './components/Tech'
import { Arrow, Fade, Lines, Shot, Station, ease } from './components/ui'
import { commercial, company, links, offices, r, water, type Img } from './data/site'
import type { Route } from './router'

/** Inner-page header: image band, breadcrumb and big title. */
function PageHeader({ crumb, title, lede, image }: { crumb: string; title: ReactNode[]; lede: string; image: Img }) {
  return (
    <header className="page-head">
      <div className="page-head-media">
        <Shot image={image} parallax={false} wipe={false} />
      </div>
      <div className="page-head-shade" />
      <div className="wrap page-head-body">
        <motion.div className="label crumbs" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease, delay: 0.2 }}>
          <a href="#home">Home</a> <span>/</span> {crumb}
        </motion.div>
        <Lines as="h1" immediate delay={0.25} className="display page-title" lines={title} />
        <motion.p className="page-lede" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease, delay: 0.6 }}>
          {lede}
        </motion.p>
      </div>
    </header>
  )
}

const allProjects = [
  ...water.projects.map((p) => ({ ...p, division: 'Water' as const })),
  ...commercial.projects.map((p) => ({ ...p, division: 'Commercial' as const })),
]

function Highlights() {
  const items = [
    { href: '#technology', label: 'Technology', title: 'Built digitally first', body: 'VDC, 4D sequencing, drones and prefab on every job.', image: { src: r('site-4d'), shot: '4D model or drone shot' } },
    { href: '#process', label: 'Our process', title: 'Faster. Safer. Fewer surprises.', body: 'How joining early and self-performing changes the schedule.', image: { src: r('plant-aerial'), shot: 'Preconstruction meeting or model review' } },
    { href: '#about', label: 'About us', title: 'Since 1984', body: 'Eleven offices across the Southeast and a safety-first crew.', image: { src: r('civic-b'), shot: 'Team or office photo' } },
  ]
  return (
    <section className="section">
      <div className="wrap">
        <Station sta="0+50" right="Why us">
          The difference
        </Station>
        <div className="highlights">
          {items.map((it, i) => (
            <motion.a
              key={it.href}
              href={it.href}
              className="highlight"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease, delay: i * 0.1 }}
            >
              <Shot image={it.image} parallax={false} />
              <div className="highlight-body">
                <span className="label">{it.label}</span>
                <h3>{it.title}</h3>
                <p>{it.body}</p>
                <span className="highlight-go">
                  Learn more <Arrow />
                </span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}

function FeaturedWork() {
  return (
    <section className="section dark grain">
      <div className="wrap">
        <Station sta="0+75" right="Selected projects">
          Featured work
        </Station>
        <div className="projects-head">
          <Lines className="display section-title" lines={['Recent', <span key="h" className="hl">work.</span>]} />
          <a className="btn btn-yellow" href="#projects">
            All projects <Arrow />
          </a>
        </div>
        <Cards projects={[water.projects[0], commercial.projects[0], commercial.projects[1]]} />
      </div>
    </section>
  )
}

function Home() {
  return (
    <>
      <Hero />
      <Ticker />
      <Divisions />
      <FeaturedWork />
      <Highlights />
    </>
  )
}

function Projects() {
  const [filter, setFilter] = useState<'All' | 'Water' | 'Commercial'>('All')
  const shown = allProjects.filter((p) => filter === 'All' || p.division === filter)
  return (
    <>
      <PageHeader crumb="Projects" title={['Our', <span key="h" className="hl">projects.</span>]} lede="Water plants, justice centers and schools across the Southeast. Filter by division." image={{ src: r('plant-aerial'), shot: 'Signature project aerial' }} />
      <section className="section">
        <div className="wrap">
          <div className="filters" role="group" aria-label="Filter projects">
            {(['All', 'Water', 'Commercial'] as const).map((f) => (
              <button key={f} className={`filter ${filter === f ? 'is-on' : ''}`} aria-pressed={filter === f} onClick={() => setFilter(f)}>
                {filter === f && <motion.span className="filter-bg" layoutId="filter-bg" transition={{ duration: 0.35, ease }} />}
                {f}
              </button>
            ))}
          </div>
          <motion.div layout className="cards">
            <AnimatePresence mode="popLayout">
              {shown.map((p) => (
                <motion.div key={p.title} layout initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.4, ease }}>
                  <Card p={p} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>
    </>
  )
}

function About() {
  return (
    <>
      <PageHeader crumb="About" title={['Building the', <span key="h" className="hl">Southeast</span>, 'since 1984.']} lede={`${company.name} is a construction manager, general contractor and design-builder, headquartered in ${company.hq.city.split(',')[0]}.`} image={{ src: r('civic-b'), shot: 'Headquarters or leadership team' }} />
      <section className="section">
        <div className="wrap detail-grid">
          <Lines className="display section-title" lines={['Four decades.', <span key="h" className="mark">One standard.</span>]} />
          <Fade delay={0.1}>
            <p className="section-lede">
              {company.name} was founded in {company.founded} and began by building water treatment plants in Central
              Florida. Today our teams deliver water, municipal, education and hospitality projects from eleven offices in
              Florida, Texas, Louisiana and North Carolina, with more than 120 of our own craft professionals in the field.
            </p>
            <p className="section-lede" style={{ marginTop: 18 }}>
              In 2025 we made the largest gift in our history: $1 million to Habitat for Humanity to help build Legacy
              Point, a 19-home affordable community in Central Florida.
            </p>
          </Fade>
        </div>
      </section>
      <Crew />
      <Locations />
    </>
  )
}

function Contact() {
  const [sent, setSent] = useState(false)
  return (
    <>
      <PageHeader crumb="Contact" title={['Let’s', <span key="h" className="hl">build.</span>]} lede="Tell us about your project. The earlier we’re involved, the more we can do for its budget and schedule." image={{ src: r('site-hero'), shot: 'Jobsite at golden hour' }} />
      <section className="section">
        <div className="wrap contact-grid">
          <form
            className="contact-form"
            onSubmit={(e) => {
              e.preventDefault()
              setSent(true)
            }}
          >
            {/* PLACEHOLDER: connect to a real form handler before launch. */}
            <div className="field">
              <label htmlFor="c-name">Name</label>
              <input id="c-name" required />
            </div>
            <div className="field">
              <label htmlFor="c-org">Organization</label>
              <input id="c-org" />
            </div>
            <div className="field">
              <label htmlFor="c-email">Email</label>
              <input id="c-email" type="email" required />
            </div>
            <div className="field">
              <label htmlFor="c-type">Project type</label>
              <select id="c-type" defaultValue="Water / wastewater">
                <option>Water / wastewater</option>
                <option>Municipal / justice</option>
                <option>Education</option>
                <option>Hospitality / venue</option>
                <option>Other</option>
              </select>
            </div>
            <div className="field field-wide">
              <label htmlFor="c-msg">About the project</label>
              <textarea id="c-msg" rows={5} />
            </div>
            <button className="btn btn-dark" type="submit">
              Send <Arrow />
            </button>
            {sent && <p className="form-note">Preview only: this form isn’t connected yet, so nothing was sent.</p>}
          </form>
          <aside className="contact-aside">
            <span className="label">Headquarters</span>
            <address>
              {company.legalName}
              <br />
              {company.hq.street}
              <br />
              {company.hq.city}
            </address>
            <span className="label" style={{ marginTop: 28 }}>
              Subcontractors & suppliers
            </span>
            <a className="btn btn-yellow" href={links.bids}>
              Bid opportunities <Arrow />
            </a>
            <span className="label" style={{ marginTop: 28 }}>
              Offices
            </span>
            <p className="contact-offices">{offices.map((o) => o.name).join(' · ')}</p>
          </aside>
        </div>
      </section>
    </>
  )
}

export function Page({ route }: { route: Route }) {
  switch (route) {
    case 'water':
      return (
        <>
          <PageHeader crumb="Water" title={['Water', <span key="h" className="hl-water">division.</span>]} lede="Treatment plants, water reclamation, pump stations and conveyance across the Southeast." image={water.divisionImage} />
          <Water />
        </>
      )
    case 'commercial':
      return (
        <>
          <PageHeader crumb="Commercial" title={['Commercial', <span key="h" className="hl">division.</span>]} lede="Justice centers, schools, public safety, venues and community buildings." image={commercial.divisionImage} />
          <Commercial />
        </>
      )
    case 'projects':
      return <Projects />
    case 'technology':
      return (
        <>
          <PageHeader crumb="Technology" title={['Technology.']} lede="VDC, 4D sequencing, reality capture and prefabrication on every project." image={{ src: r('site-4d'), shot: 'Drone or VDC model' }} />
          <Technology />
        </>
      )
    case 'process':
      return (
        <>
          <PageHeader crumb="Our Process" title={['How we', <span key="h" className="hl">build.</span>]} lede="Joining early, modeling first and self-performing the critical path." image={{ src: r('site-hero'), shot: 'Crew on site' }} />
          <Process />
          <Crew />
        </>
      )
    case 'about':
      return <About />
    case 'careers':
      return (
        <>
          <PageHeader crumb="Careers" title={['Careers.']} lede="Build your career with a builder that trains its own and promotes from within." image={{ src: r('civic-a'), shot: 'Field team, hard hats on' }} />
          <Careers />
        </>
      )
    case 'contact':
      return <Contact />
    default:
      return <Home />
  }
}
