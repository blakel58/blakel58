import { MotionConfig } from 'motion/react'
import { Careers, CtaBand, News } from './components/Careers'
import { Footer } from './components/Footer'
import { Footprint } from './components/Footprint'
import { Hero } from './components/Hero'
import { Credentials, Intro } from './components/Intro'
import { Markets } from './components/Markets'
import { Nav } from './components/Nav'
import { Projects } from './components/Projects'
import { Safety } from './components/Safety'
import { SelfPerform, Services } from './components/Services'
import { WaterProcess } from './components/WaterProcess'

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <Credentials />
        <Intro />
        <Markets />
        <WaterProcess />
        <Services />
        <SelfPerform />
        <Projects />
        <Safety />
        <Footprint />
        <News />
        <Careers />
        <CtaBand />
      </main>
      <Footer />
    </MotionConfig>
  )
}
