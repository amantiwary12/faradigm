// All site copy lives here so it can be edited without touching components.

export const site = {
  email: 'info@faradigm.com',
  phoneDisplay: '+91-9993091164',
  phoneHref: 'tel:+919993091164',
  phonePlain: '+91 99930 91164',
  whatsappNumber: '919993091164',
  aartech: 'https://aartechsolonics.com',
  catalogUrl: 'https://drive.google.com/file/d/1CkhKqALkdmjtrk54uxH1q2ukWXxK3CEm/view?usp=sharing',
  addressLine: '35-A/36, Sector B, Industrial Area, Mandideep, District Raisen (Bhopal), Madhya Pradesh 462046, India',
  mapsHref:
    'https://www.google.com/maps/search/?api=1&query=35-A%2F36%2C+Sector+B%2C+Industrial+Area%2C+Mandideep%2C+Madhya+Pradesh+462046',
};

export const stats = [
  { id: 'inc', delay: 0, parts: [{ count: 2017 }], caption: 'Incorporated, after almost a decade of work in energy storage' },
  {
    id: 'save', delay: 1,
    parts: [{ em: '>' }, { count: 25 }, { em: '%' }],
    caption: 'Energy savings in high-rise elevators with Project UPLIFT',
  },
  {
    id: 'temp', delay: 2,
    parts: [{ em: '−' }, { count: 30 }, '°', { em: '/' }, '+', { count: 50 }, '°C'],
    caption: 'Field tested by the Indian Army, from the Himalayas to Rajasthan',
  },
  { id: 'volt', delay: 3, parts: [{ count: 200 }, { em: 'V' }], caption: 'Two-terminal interface with no external balancing systems needed' },
];

export const trusted = [
  'Indian Army · Northern Command',
  'Indian Army · Southern Command',
  'DRDO Labs',
  'IIT Bombay',
  'Johnson Lifts, Chennai',
  'Dept. of Science & Technology, Govt. of India',
];

export const heroChecks = ['Made in India', 'Indian Army qualified', 'Trusted by DRDO Labs'];

export const heroCallouts = [
  { id: 'c1', title: '≤ 200V', text: 'Two-terminal interface', icon: 'bolt' },
  { id: 'c2', title: 'Low ESR', text: 'Built for pulse power', icon: 'pulse' },
  { id: 'c3', title: 'JS55555', text: 'MIL grade qualified', icon: 'medal' },
];

export const specRows = [
  ['Interface', 'Two-terminal'],
  ['Balancing', 'None required'],
  ['Operating temp.', '−30 to +50 °C'],
  ['Qualification', 'MIL grade'],
];

export const techFeatures = [
  'One of the lowest ESR in the industry',
  'Simple two-terminal interface up to 200V',
  'No external balancing or monitoring systems',
  'Rugged, non-hazardous, eco-friendly materials',
  'Nanotechnology product',
  'Meets MIL grade JS55555 type tests',
];

export const oemChips = ['Nesscap', 'Maxwell', 'SPSCap', 'Ioxus', 'Skeleton Technologies GmbH', 'Vinatech Co. Ltd.'];

export const processSteps = [
  { n: '01', title: 'Deep Dive', text: 'We study your application needs and the real problem behind them.' },
  { n: '02', title: 'Solution Architecture', text: 'We design the right architecture using whichever technology fits best.' },
  { n: '03', title: 'Research, Design & Development', text: 'Industrial research turns the architecture into real engineered hardware.' },
  { n: '04', title: 'Validation & Testing', text: 'We validate and test the solution thoroughly before it reaches the field.' },
];

export const applicationTabs = [
  {
    id: 'proven', label: 'Proven Capabilities', big: 9, count: 9, heading: 'Proven Capabilities',
    text: 'Applications where Faradigm® ultracapacitor systems have already been engineered and delivered.',
    items: [
      'Engine Starting', 'Battery Assist', 'Short Duration DC/AC UPS', 'Safe Shutdown Systems', 'Regenerative Braking',
      'Uninterrupted Drives', 'Fuel Cell Assist Systems', 'Elevators', 'Wind Turbine Pitch Control',
    ],
  },
  {
    id: 'radar', label: 'Under the Radar', big: 8, count: 8, heading: 'Under the Radar',
    text: 'Emerging applications our team is actively exploring.',
    items: [
      'Electric Vehicles', 'Acceleration Assist', 'Start-Stop Systems', 'Remote Data Acquisition', 'Audio Entertainment',
      'Power Quality Improvement', 'Forklifts and Cranes', 'Power Tools',
    ],
  },
  {
    id: 'defence', label: 'Defence', big: 4, count: 4, heading: 'Defence Applications',
    text: 'Mission-critical power for defence, validated by the Indian Army.',
    items: [
      'Portable Jump Start Equipment for Class A / Class B Vehicles', 'Battery Assist Systems',
      'Electromagnetic Coil Gun Power Source', 'Missile Triggering Power Pack',
    ],
  },
  {
    id: 'oem', label: 'OEM Applications', big: '∞', heading: 'OEM Applications', text: 'Custom-built for your product.', items: null,
  },
];

export const testimonials = [
  {
    initials: 'CO', delay: 0, name: 'A Commanding Officer', role: 'Southern Command, Indian Army',
    quote: 'Your Ultracapacitors are a mission critical, life saving technology for Army Officers under combat conditions.',
  },
  {
    initials: 'CE', delay: 1, name: 'Chief Engineer', role: 'DRDO Labs',
    quote: 'Faradigm® Ultracapacitor Systems as Battery Backup Systems give the long term reliability that I was always looking for as a substitute of Batteries.',
  },
];

export const footerColumns = [
  {
    title: 'Products',
    links: [
      { to: '/products/faradigm-ultracapacitors', label: 'Faradigm® Ultracapacitors' },
      { to: '/products/oem-ultracapacitors', label: 'Other Ultracapacitor OEMs' },
      { to: '/work/mil-grade-ultracapacitors', label: 'MIL Grade Ultracapacitors' },
      { to: '/work/project-uplift', label: 'Project UPLIFT' },
    ],
  },
  {
    title: 'Solutions',
    links: [
      { to: '/solutions/proven', label: 'Proven Capabilities' },
      { to: '/solutions/radar', label: 'Under the Radar' },
      { to: '/solutions/defence', label: 'Defence' },
      { to: '/solutions/oem', label: 'OEM Applications' },
    ],
  },
  {
    title: 'Company',
    links: [
      { to: '/about', label: 'About Us' },
      { to: '/support', label: 'Service Support' },
      { to: '/news', label: 'News' },
      { href: site.aartech, label: 'Aartech Solonics Ltd. ↗', external: true },
    ],
  },
];
