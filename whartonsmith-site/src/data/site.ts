// Company facts, projects and copy, gathered from whartonsmith.com search
// listings and public news coverage (Oct 2026). Verify with Wharton-Smith
// before launch. Items marked PLACEHOLDER need real content.

export const company = {
  name: 'Wharton-Smith',
  legalName: 'Wharton-Smith, Inc.',
  founded: 1984,
  founders: 'Bill Wharton and George Smith',
  vision: 'To be the construction group of choice.',
  hq: { street: '750 Monroe Road', city: 'Sanford, FL 32771' },
  linkedin: 'https://www.linkedin.com/company/wharton-smith-inc-',
  facebook: 'https://www.facebook.com/whartonsmithinc/',
}

// PLACEHOLDER hrefs: point these at the real pages / portals.
export const links = {
  contact: '#contact',
  careers: '#careers',
  projects: '#projects',
  bids: '#contact',
  prequal: '#contact',
}

// Drop real photography into /public/images and set the paths here.
// When a path is empty, a technical-drawing panel is shown instead.
export const photos = {
  hero: '', // e.g. '/images/hero.jpg' (wide jobsite / aerial of a plant)
  selfPerform: '', // e.g. '/images/self-perform.jpg' (crew placing concrete)
  careers: '', // e.g. '/images/careers.jpg' (field team on site)
}

export const nav = [
  { label: 'Markets', href: '#markets' },
  { label: 'Services', href: '#services' },
  { label: 'Projects', href: '#projects' },
  { label: 'Self-Perform', href: '#self-perform' },
  { label: 'Safety', href: '#safety' },
  { label: 'Locations', href: '#locations' },
  { label: 'Careers', href: '#careers' },
]

export const kpis: { value: number; label: string; from?: number; prefix?: string; suffix?: string }[] = [
  { value: 1984, label: 'Founded in Sanford, FL', from: 1950 },
  { value: 11, label: 'Offices in FL, TX, LA & NC' },
  { value: 400, label: 'Builders, engineers & craft', prefix: '~' },
  { value: 120, label: 'Self-perform craftsmen', suffix: '+' },
]

export const credentials = [
  'ENR Top 400 Contractors',
  'ENR Top 200 Environmental Firms',
  'ENR Southeast Top Contractors',
  'DBIA Florida Design-Build Project of the Year 2026',
  'Top Workplaces',
]

export type MarketKey = 'water' | 'municipal' | 'education' | 'hospitality' | 'industrial' | 'community'

export const markets: { key: MarketKey; title: string; body: string; examples: string }[] = [
  {
    key: 'water',
    title: 'Water & Wastewater',
    body: 'Water treatment, water reclamation, reuse, pump stations and conveyance. Our founding market since 1984, and the core of what we do.',
    examples: 'WTPs · WRFs · Reuse · Pump stations',
  },
  {
    key: 'municipal',
    title: 'Municipal & Justice',
    body: 'Justice centers, public safety, fire and police stations, and civic buildings, built to public budgets and schedules.',
    examples: 'Justice · Public safety · Parking',
  },
  {
    key: 'education',
    title: 'Education',
    body: 'K-12 and higher-education facilities, from new prototype high schools to renovations on occupied campuses.',
    examples: 'K-12 · Higher ed · Renovations',
  },
  {
    key: 'hospitality',
    title: 'Entertainment & Hospitality',
    body: 'Themed attractions, sports and recreation venues, and hospitality projects where opening day is fixed.',
    examples: 'Attractions · Sports · Resorts',
  },
  {
    key: 'industrial',
    title: 'Industrial',
    body: 'Heavy civil, structural, mechanical and process work for industrial owners, backed by our self-perform crews.',
    examples: 'Process · Heavy civil · Mechanical',
  },
  {
    key: 'community',
    title: 'Community & Commercial',
    body: 'Community centers, parks and recreation, mixed-use and commercial buildings for the neighborhoods we live in.',
    examples: 'Community centers · Parks · Mixed-use',
  },
]

export const services = [
  {
    title: 'Construction Management at Risk',
    short: 'CMAR',
    body: 'We join during design, commit to a guaranteed maximum price and manage cost, schedule and quality on the owner’s behalf through closeout.',
  },
  {
    title: 'Design-Build',
    short: 'Design-Build',
    body: 'One contract and one accountable team from concept through commissioning. Faster decisions, fewer handoffs and a single point of responsibility.',
  },
  {
    title: 'Progressive Design-Build & EPC',
    short: 'Progressive DB / EPC',
    body: 'For complex water infrastructure we engineer, procure and construct as one team. As a member of the Water Collaborative Delivery Association, we bring open-book collaboration from day one.',
  },
  {
    title: 'General Contracting',
    short: 'General Contracting',
    body: 'Competitive hard-bid delivery with the same people, safety program and quality standards we bring to negotiated work.',
  },
  {
    title: 'Preconstruction',
    short: 'Preconstruction',
    body: 'Estimating, constructability and phasing reviews, scheduling and value engineering, so problems get solved on paper instead of in the field.',
  },
]

export const selfPerform = [
  'Cast-in-place concrete',
  'Site work & earthwork',
  'Underground utilities',
  'Process piping',
  'Mechanical equipment installation',
  'Masonry',
]

// Water / wastewater process stages, used by the process diagram.
export const processStages = [
  { title: 'Headworks', body: 'Screening, grit removal and odor control at the front of the plant.' },
  { title: 'Biological treatment', body: 'Activated sludge and BNR aeration basins with process air blowers.' },
  { title: 'Clarification', body: 'Secondary clarifiers and splitter boxes that separate solids.' },
  { title: 'Filtration', body: 'Tertiary filters and membrane systems for high-level treatment.' },
  { title: 'Disinfection', body: 'Chlorine contact tanks and UV systems before discharge or reuse.' },
  { title: 'Storage & reuse', body: 'Ground storage tanks, pump stations and reclaimed water distribution.' },
]

export type Project = {
  title: string
  market: MarketKey
  drawing: 'water' | 'civic' | 'school'
  location: string
  owner?: string
  specs: { label: string; value: string }[]
  delivery?: string
  completed?: string
  image?: string // e.g. '/images/projects/hamlin.jpg'
}

export const projects: Project[] = [
  {
    title: 'Hamlin Water Reclamation Facility',
    market: 'water',
    drawing: 'water',
    location: 'Winter Garden, FL',
    owner: 'Orange County Utilities',
    specs: [
      { label: 'Capacity', value: '5.0 MGD (15 MGD build-out)' },
      { label: 'Construction value', value: '$110.6M' },
    ],
    delivery: 'General Contractor',
    completed: '2023',
  },
  {
    title: 'Seminole County Justice Center Annex & Parking Garage',
    market: 'municipal',
    drawing: 'civic',
    location: 'Sanford, FL',
    owner: 'Seminole County',
    specs: [
      { label: 'Annex', value: '105,000 SF' },
      { label: 'Garage', value: '5 levels, 150,000 SF' },
    ],
    delivery: 'Design-Build',
    completed: '2023',
  },
  {
    title: 'Northwest Regional Water Reclamation Facility Expansion',
    market: 'water',
    drawing: 'water',
    location: 'Hillsborough County, FL',
    owner: 'Hillsborough County',
    specs: [{ label: 'Capacity', value: '10 MGD → 30 MGD' }],
  },
  {
    title: 'Villages Charter High School, South Campus',
    market: 'education',
    drawing: 'school',
    location: 'The Villages, FL',
    specs: [{ label: 'Size', value: '450,000 SF campus' }],
  },
  {
    title: 'Davenport High School',
    market: 'education',
    drawing: 'school',
    location: 'Davenport, FL',
    specs: [{ label: 'Size', value: '345,000 SF prototype' }],
  },
  {
    title: 'Catawba River WTP Raw Water Reservoir Expansion',
    market: 'water',
    drawing: 'water',
    location: 'Lancaster County, SC',
    specs: [{ label: 'Scope', value: 'Raw water reservoir expansion' }],
  },
  {
    title: 'West Harrison Middle School',
    market: 'education',
    drawing: 'school',
    location: 'Gulfport, MS',
    specs: [{ label: 'Construction value', value: '$26M' }],
  },
  {
    title: 'Holy Trinity Middle School',
    market: 'education',
    drawing: 'school',
    location: 'Charlotte, NC',
    specs: [{ label: 'Scope', value: 'Renovation & improvements' }],
    delivery: 'CMAR',
  },
]

export const regions: { name: string; offices: string[] }[] = [
  { name: 'Central Florida', offices: ['Sanford (HQ)', 'Space Coast'] },
  { name: 'North Florida', offices: ['Jacksonville'] },
  { name: 'Southwest Florida', offices: ['Tampa', 'North Port', 'Fort Myers'] },
  { name: 'Southeast Florida', offices: ['Jupiter'] },
  { name: 'Gulf Coast', offices: ['Pensacola', 'Baton Rouge, LA', 'Houston, TX'] },
  { name: 'Carolinas', offices: ['Charlotte, NC'] },
]

export const offices: { name: string; state: string; lat: number; lon: number; hq?: boolean }[] = [
  { name: 'Sanford', state: 'FL', lat: 28.8, lon: -81.27, hq: true },
  { name: 'Jacksonville', state: 'FL', lat: 30.33, lon: -81.66 },
  { name: 'Space Coast', state: 'FL', lat: 28.35, lon: -80.73 },
  { name: 'Tampa', state: 'FL', lat: 27.95, lon: -82.46 },
  { name: 'North Port', state: 'FL', lat: 27.04, lon: -82.24 },
  { name: 'Fort Myers', state: 'FL', lat: 26.64, lon: -81.87 },
  { name: 'Jupiter', state: 'FL', lat: 26.93, lon: -80.09 },
  { name: 'Pensacola', state: 'FL', lat: 30.42, lon: -87.22 },
  { name: 'Baton Rouge', state: 'LA', lat: 30.45, lon: -91.19 },
  { name: 'Houston', state: 'TX', lat: 29.76, lon: -95.37 },
  { name: 'Charlotte', state: 'NC', lat: 35.23, lon: -80.84 },
]

// PLACEHOLDER: confirm wording with the safety department; add EMR / TRIR
// figures here if Wharton-Smith publishes them.
export const safety = [
  {
    title: 'Plan every task',
    body: 'Hazards are identified and controlled before work starts, at every level from the project plan to each crew’s daily pre-task briefing.',
  },
  {
    title: 'Everyone can stop work',
    body: 'Every person on our sites, whether employee, subcontractor or visitor, has the authority and the obligation to stop unsafe work.',
  },
  {
    title: 'Train our own',
    body: 'Our self-perform crews are trained, mentored and promoted from within, so safe practices are built into how the work gets done.',
  },
]

export const news = [
  {
    date: 'Oct 2025',
    title: 'Wharton-Smith commits $1 million to Habitat for Humanity’s Legacy Point',
    body: 'The largest investment in company history helps Habitat for Humanity Seminole-Apopka build a 19-home affordable community in Central Florida.',
  },
  {
    date: 'Mar 2024',
    title: 'Creating Connections: South AWWTF reclaimed water expansion opens',
    body: 'A new reclaimed water expansion goes into service, putting treated water back to work for the community.',
  },
  {
    date: 'Oct 2023',
    title: 'Wharton-Smith makes the Golden 100, Fast 50 and ENR Top 400',
    body: 'Recognition from the Orlando Business Journal and Engineering News-Record in the same season.',
  },
  {
    date: 'Apr 2023',
    title: 'Wharton-Smith completes the Hamlin Water Reclamation Facility',
    body: 'A new 5 MGD facility for Orange County Utilities, designed to grow to 15 MGD and serve southwest Orange County.',
  },
]

export const roles = [
  'Project Managers',
  'Superintendents',
  'Project Engineers',
  'Field Engineers',
  'Estimators',
  'Craft Professionals',
  'Safety',
  'Internships',
]
