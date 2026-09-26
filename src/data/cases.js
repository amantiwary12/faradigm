import kranking from '../assets/kranking.webp';
import uplift from '../assets/uplift.webp';

export const cases = [
  {
    slug: 'mil-grade-ultracapacitors',
    tag: 'Defence',
    image: kranking, alt: 'MIL grade KranKing ultracapacitor module', width: 533, height: 373, contain: true,
    title: 'MIL Grade Ultracapacitors',
    sub: 'Qualified by the Indian Army as a jump-start device for Class A vehicles.',
    points: [
      'JS55555 qualified',
      'Best-in-class ESR and pulse power capabilities',
      'Qualified by the Indian Army as a jump-start device for Class A vehicles',
    ],
    range: true,
  },
  {
    slug: 'project-uplift',
    tag: 'Infrastructure',
    image: uplift, alt: 'Project UPLIFT ultracapacitor cabinet for elevators', width: 464, height: 618,
    title: 'Project UPLIFT',
    sub: 'Ultracapacitor Powered Lift, built with IIT Bombay and M/s Johnson Lifts, Chennai.',
    points: [
      'More than 25% energy savings in high-rise elevators',
      'Seamless Automatic Rescue Device operation during power failure',
      'Funded under the Clean Energy Research Initiative, Department of Science & Technology, Govt. of India',
      'Successfully tested by M/s Johnson Lifts at their test facilities',
    ],
  },
];

export const caseBySlug = (slug) => cases.find((c) => c.slug === slug);
