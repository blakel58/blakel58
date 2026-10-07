// Company facts, projects and copy, gathered from whartonsmith.com search
// listings and public news coverage (Oct 2026). Verify with Wharton-Smith
// before launch.
//
// Imagery: /public/renders/*.jpg are study-model renders generated from the
// 3D scenes in src/three (see README). Swap any `image` for real photography.

export const company = {
  legalName: 'Wharton-Smith, Inc.',
  founded: 1984,
  founders: 'Bill Wharton and George Smith',
  hq: { street: '750 Monroe Road', city: 'Sanford, Florida 32771' },
  linkedin: 'https://www.linkedin.com/company/wharton-smith-inc-',
  facebook: 'https://www.facebook.com/whartonsmithinc/',
}

// PLACEHOLDER hrefs: point these at the real pages.
export const links = {
  contact: '#contact',
  careers: '#careers',
  bids: '#contact',
}

export const nav = [
  { label: 'Work', href: '#work' },
  { label: 'Expertise', href: '#expertise' },
  { label: 'Company', href: '#company' },
  { label: 'Careers', href: '#careers' },
]

export const r = (name: string) => `/renders/${name}.jpg`

export const figures = [
  { value: 1984, from: 1950, label: 'Founded in Sanford, Florida' },
  { value: 11, label: 'Offices across four Southern states' },
  { value: 400, label: 'Builders, engineers and craft professionals', prefix: '~' },
  { value: 120, label: 'Self-perform craftsmen on our own payroll', suffix: '+' },
]

export const processStages = [
  { title: 'Headworks', body: 'Screening, grit removal and odor control where the water first arrives.' },
  { title: 'Biological treatment', body: 'Activated sludge and nutrient-removal basins, with the blowers that feed them.' },
  { title: 'Clarification', body: 'Secondary clarifiers that let solids settle and clean water rise.' },
  { title: 'Filtration', body: 'Tertiary filters and membranes for water that meets the highest standard.' },
  { title: 'Disinfection', body: 'Chlorine contact basins and UV before the water returns to the world.' },
  { title: 'Storage & reuse', body: 'Ground storage, pump stations and reclaimed water for the community.' },
]

export const expertise = [
  {
    name: 'Water & Wastewater',
    desc: 'Treatment plants, water reclamation, reuse and conveyance. Our founding market and our deepest expertise.',
    image: r('plant-aerial'),
  },
  {
    name: 'Civic & Justice',
    desc: 'Justice centers, public safety, parking and the civic buildings that serve a county for generations.',
    image: r('civic-a'),
  },
  {
    name: 'Education',
    desc: 'K-12 and higher education, from new prototype high schools to renovations on occupied campuses.',
    image: r('school-a'),
  },
  {
    name: 'Hospitality & Entertainment',
    desc: 'Themed attractions, sports and recreation venues where opening day never moves.',
    image: r('venue-a'),
  },
  {
    name: 'Industrial',
    desc: 'Heavy civil, structural, mechanical and process work, carried out by our own crews.',
    image: r('plant-side'),
  },
]

export type Project = {
  title: string
  location: string
  specs: string[]
  image: string
}

export const projects: Project[] = [
  {
    title: 'Hamlin Water Reclamation Facility',
    location: 'Winter Garden, Florida',
    specs: ['Orange County Utilities', '5 MGD, expandable to 15', '$110.6M', '2023'],
    image: r('plant-low'),
  },
  {
    title: 'Seminole County Justice Center Annex & Garage',
    location: 'Sanford, Florida',
    specs: ['Design-Build', '105,000 SF annex', '5-level garage', '2023'],
    image: r('civic-a'),
  },
  {
    title: 'Villages Charter High School, South Campus',
    location: 'The Villages, Florida',
    specs: ['450,000 SF campus'],
    image: r('school-a'),
  },
  {
    title: 'Northwest Regional Water Reclamation Facility',
    location: 'Hillsborough County, Florida',
    specs: ['Expansion from 10 to 30 MGD'],
    image: r('plant-aerial'),
  },
  {
    title: 'Davenport High School',
    location: 'Davenport, Florida',
    specs: ['345,000 SF prototype'],
    image: r('school-b'),
  },
  {
    title: 'Catawba River WTP Raw Water Reservoir',
    location: 'Lancaster County, South Carolina',
    specs: ['Reservoir expansion'],
    image: r('plant-side'),
  },
]

export const methods = [
  {
    title: 'Construction Management at Risk',
    body: 'We join during design, commit to a guaranteed maximum price, and carry cost, schedule and quality on the owner’s behalf through closeout.',
  },
  {
    title: 'Design-Build',
    body: 'One contract and one accountable team from first sketch to commissioning. Fewer handoffs, faster decisions.',
  },
  {
    title: 'Progressive Design-Build & EPC',
    body: 'For complex water infrastructure we engineer, procure and construct as one team. We are members of the Water Collaborative Delivery Association.',
  },
  {
    title: 'General Contracting',
    body: 'Competitive hard-bid delivery, with the same people, safety program and standards we bring to negotiated work.',
  },
  {
    title: 'Preconstruction',
    body: 'Estimating, constructability and phasing reviews, so problems get solved on paper rather than in the field.',
  },
]

export const trades = [
  'Cast-in-place concrete',
  'Site work',
  'Underground utilities',
  'Process piping',
  'Mechanical equipment',
  'Masonry',
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

export const roles = [
  'Project Managers',
  'Superintendents',
  'Project Engineers',
  'Field Engineers',
  'Estimators',
  'Craft Professionals',
  'Internships',
]
