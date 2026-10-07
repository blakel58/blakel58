// Placeholder-branded copy of site.ts, used when building with VITE_DEMO=1.
// Keep its exports in sync with site.ts.

export const isDemo = true

export const company = {
  name: 'Your Company',
  short: 'YC',
  legalName: 'Your Company, Inc.',
  founded: 1984,
  hq: { street: '100 Main Street', city: 'Anytown, FL' },
  linkedin: '#',
  facebook: '#',
}

// PLACEHOLDER hrefs: point these at the real pages.
export const links = {
  contact: '#contact',
  careers: '#careers',
  bids: '#contact',
}

export const nav = [
  { label: 'Water', href: '#water' },
  { label: 'Commercial', href: '#commercial' },
  { label: 'Projects', href: '#projects' },
  { label: 'Technology', href: '#technology' },
  { label: 'Our Process', href: '#process' },
  { label: 'About', href: '#about' },
  { label: 'Careers', href: '#careers' },
]

const base = import.meta.env.BASE_URL
export const r = (name: string) => `${base}renders/${name}.jpg`

/**
 * An image area. `src` is what shows today (a study-model render); `shot`
 * describes the photo that belongs there. Set `real: true` once a real photo
 * is in place and the "image area" tag disappears.
 */
export type Img = { src: string; shot: string; real?: boolean }
const img = (render: string, shot: string): Img => ({ src: r(render), shot })

export const hero = {
  image: img('site-hero', 'Drone aerial of an active water plant jobsite'),
  // Optional: drop a muted drone loop into /public and set its path here.
  video: '',
}

export const stats = [
  { value: 1984, from: 1950, label: 'Founded' },
  { value: 11, label: 'Offices' },
  { value: 400, label: 'Employees', prefix: '~' },
  { value: 120, label: 'Self-perform craft', suffix: '+' },
]

export const ticker = ['Water', 'Wastewater', 'Commercial', 'Municipal', 'Education', 'Design-Build', 'CMAR', 'Self-Perform', 'Since 1984']

export const water = {
  image: img('plant-low', 'Clarifiers or basins at a finished plant'),
  divisionImage: img('plant-aerial', 'Aerial of a completed treatment plant'),
  capabilities: ['Water treatment plants', 'Water reclamation', 'Pump stations', 'Conveyance & force mains', 'Reuse & storage', 'Membranes & filtration'],
  projects: [
    {
      title: 'Regional Water Reclamation Facility',
      location: 'Central Florida',
      specs: ['5 MGD → 15 MGD', 'GC', '2023'],
      image: img('plant-side', 'Project hero photo'),
    },
    {
      title: 'Wastewater Plant Expansion',
      location: 'Gulf Coast, FL',
      specs: ['10 → 30 MGD', 'Expansion'],
      image: img('plant-aerial', 'Project hero photo'),
    },
    {
      title: 'Raw Water Reservoir Expansion',
      location: 'The Carolinas',
      specs: ['Reservoir', 'Water treatment'],
      image: img('site-4d', 'Project hero photo'),
    },
  ],
}

export const commercial = {
  image: img('civic-b', 'Finished civic building, street level'),
  divisionImage: img('civic-a', 'Aerial of a completed civic or school campus'),
  markets: [
    { name: 'Municipal & Justice', desc: 'Justice centers, public safety, parking and civic buildings.', image: img('civic-a', 'Justice / civic project') },
    { name: 'Education', desc: 'K-12 and higher-ed campuses, new and renovated.', image: img('school-a', 'School campus') },
    { name: 'Sports & Hospitality', desc: 'Venues, attractions and recreation where opening day is fixed.', image: img('venue-a', 'Venue or attraction') },
    { name: 'Community', desc: 'Community centers, parks and mixed-use for our neighborhoods.', image: img('school-b', 'Community building') },
  ],
  projects: [
    {
      title: 'County Justice Center & Garage',
      location: 'Central Florida',
      specs: ['Design-Build', '105,000 SF', '5-level garage'],
      image: img('civic-a', 'Project hero photo'),
    },
    {
      title: 'Charter High School Campus',
      location: 'Central Florida',
      specs: ['450,000 SF'],
      image: img('school-a', 'Project hero photo'),
    },
    {
      title: 'Prototype High School',
      location: 'Polk County, FL',
      specs: ['345,000 SF', 'Prototype'],
      image: img('school-b', 'Project hero photo'),
    },
  ],
}

// CONFIRM: technology actually in use.
export const tools = [
  { key: 'bim', title: 'VDC & BIM coordination', body: 'Every pipe, duct and rebar cage is modeled and clash-checked before it reaches the field.' },
  { key: 'sched', title: '4D sequencing', body: 'The model is tied to the schedule, so owners and crews can watch the job get built before day one.' },
  { key: 'drone', title: 'Drone & reality capture', body: 'Regular flights and laser scans track progress and verify as-built conditions against the model.' },
  { key: 'prefab', title: 'Prefabrication', body: 'Pipe spools, rebar cages and assemblies built off-site, then set in place to save time and improve safety.' },
  { key: 'field', title: 'Connected field', body: 'Plans, RFIs, inspections and daily reports on every tablet, live for the whole project team.' },
]

export const processSteps = [
  { title: 'In early', body: 'We join during design through CMAR, design-build or progressive delivery.', gain: 'Budget certainty sooner' },
  { title: 'Model it first', body: 'VDC coordination and 4D sequencing solve conflicts on screen, not in concrete.', gain: 'Fewer RFIs & change orders' },
  { title: 'Buy it early', body: 'Long-lead equipment is procured during design, so it’s on site when crews need it.', gain: 'Schedule protected' },
  { title: 'Self-perform', body: 'Our own crews handle concrete, piping and equipment on the critical path.', gain: 'Control of quality & time' },
  { title: 'Hand over ready', body: 'Startup, testing and commissioning planned from day one, with operators trained.', gain: 'A plant that runs on day one' },
]

export const trades = ['Cast-in-place concrete', 'Site work', 'Underground utilities', 'Process piping', 'Equipment setting', 'Masonry']

export const selfPerformImage = img('site-hero', 'Crew placing concrete or setting rebar')
export const careersImage = img('civic-b', 'Field team on a jobsite, hard hats on')

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

export const roles = ['Project Managers', 'Superintendents', 'Project Engineers', 'Field Engineers', 'Estimators', 'Craft Professionals', 'VDC Specialists', 'Internships']
