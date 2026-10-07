// Company facts and copy, gathered from public sources (Oct 2026).
// Anything marked PLACEHOLDER should be replaced with Wharton-Smith's own
// content before launch.

export const company = {
  name: 'Wharton-Smith',
  legalName: 'Wharton-Smith, Inc.',
  founded: 1984,
  founders: 'Bill Wharton and George Smith',
  vision: 'The construction group of choice.',
  hq: {
    street: '750 Monroe Road',
    city: 'Sanford, FL 32771',
    coords: '28.8029° N, 81.2695° W',
  },
  linkedin: 'https://www.linkedin.com/company/wharton-smith-inc-',
}

// PLACEHOLDER hrefs: point these at the real pages.
export const links = {
  contact: '#contact',
  careers: '#careers',
  projects: '#projects',
}

export const nav = [
  { label: 'Markets', href: '#markets' },
  { label: 'Services', href: '#services' },
  { label: 'Projects', href: '#projects' },
  { label: 'Footprint', href: '#footprint' },
  { label: 'Careers', href: '#careers' },
]

export type MarketKey = 'water' | 'municipal' | 'education' | 'hospitality' | 'community'

export const markets: {
  key: MarketKey
  title: string
  short: string
  body: string
  tags: string[]
}[] = [
  {
    key: 'water',
    title: 'Water & Wastewater',
    short: 'Water',
    body: 'Treatment plants, pump stations, reuse and conveyance. Our founding market since 1984, and one where ENR Southeast has ranked us a top contractor year after year.',
    tags: ['Water treatment', 'Wastewater', 'Reclaimed water', 'Pump stations', 'Membranes'],
  },
  {
    key: 'municipal',
    title: 'Municipal',
    short: 'Municipal',
    body: 'Public safety, civic and operations facilities, built to public budgets, public schedules and the scrutiny that comes with them.',
    tags: ['Public safety', 'Civic buildings', 'Operations centers', 'Parks & recreation'],
  },
  {
    key: 'education',
    title: 'Education',
    short: 'Education',
    body: 'K-12 and higher-ed facilities planned around the school calendar, with occupied campuses and student safety coming first.',
    tags: ['K-12', 'Higher education', 'Renovations', 'Occupied campuses'],
  },
  {
    key: 'hospitality',
    title: 'Entertainment & Hospitality',
    short: 'Hospitality',
    body: 'Guest-facing work in Central Florida, one of the most demanding entertainment markets in the world, where opening day doesn’t move.',
    tags: ['Attractions', 'Resorts', 'Venues', 'Back-of-house'],
  },
  {
    key: 'community',
    title: 'Community',
    short: 'Community',
    body: 'Community developments and the projects that hold neighborhoods together, built by people who live in them.',
    tags: ['Community developments', 'Affordable housing', 'Commercial'],
  },
]

export const services = [
  {
    title: 'Preconstruction',
    body: 'Estimating, constructability reviews, scheduling and value engineering before the first shovel. We look for the problems while they’re still cheap to fix.',
  },
  {
    title: 'Construction Management at Risk',
    body: 'We join early, commit to a guaranteed maximum price and bring owner, designer and builder together around one budget and one schedule.',
  },
  {
    title: 'Design-Build',
    body: 'One contract and one team responsible from concept through commissioning. Fewer handoffs, faster decisions, clear accountability.',
  },
  {
    title: 'Progressive & Collaborative Delivery',
    body: 'As a member of the Water Collaborative Delivery Association, we help owners use progressive design-build and CMAR to deliver complex water infrastructure with full transparency.',
  },
  {
    title: 'General Contracting',
    body: 'Traditional design-bid-build, carried out with the same people, safety culture and standards we bring to every other job.',
  },
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

// PLACEHOLDER portfolio: generic, representative entries so the layout can
// be reviewed. Swap in real project names, photos (`image`) and details.
export const projects: {
  title: string
  market: MarketKey
  location: string
  delivery: string
  image?: string
}[] = [
  { title: 'Water Reclamation Facility Expansion', market: 'water', location: 'Central Florida', delivery: 'Progressive Design-Build' },
  { title: 'Surface Water Treatment Plant', market: 'water', location: 'North Carolina', delivery: 'CMAR' },
  { title: 'Public Safety Headquarters', market: 'municipal', location: 'Tampa Bay', delivery: 'CMAR' },
  { title: 'High School Replacement Campus', market: 'education', location: 'Space Coast', delivery: 'CMAR' },
  { title: 'Resort Back-of-House Renovation', market: 'hospitality', location: 'Orlando', delivery: 'General Contracting' },
  { title: 'Regional Pump Station & Force Main', market: 'water', location: 'Gulf Coast, TX', delivery: 'Design-Build' },
  { title: 'University Research Building', market: 'education', location: 'Southwest Florida', delivery: 'Design-Build' },
  { title: 'Legacy Point', market: 'community', location: 'Seminole County', delivery: 'Community partnership' },
]

export const stats = [
  { value: 1984, label: 'Founded in Sanford, Florida', format: 'year' as const },
  { value: 11, label: 'Offices across the Southeast' },
  { value: 4, label: 'States: FL, TX, LA & NC' },
  { value: 400, label: 'ENR Top 400 Contractor', prefix: 'Top ' },
]
