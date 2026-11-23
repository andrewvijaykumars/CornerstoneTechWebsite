export const site = {
  name: 'Cornerstone Tech Advisory LLP',
  short: 'Cornerstone',
  url: 'https://cornerstonetech.co.in',
  tagline: 'Technology that feels human',
  description:
    'Cornerstone Tech Advisory LLP is a technology partner that listens first, then designs, builds and cares for software that makes work and life easier for the people you serve.',
  email: 'letsconnect@cornerstonetech.co.in',
  // Optional business details. Anything left empty is simply not rendered.
  details: {
    llpin: '',
    address: '',
    phone: '',
    linkedin: '',
  } as { llpin: string; address: string; phone: string; linkedin: string },
} as const;

export const nav = [
  { href: '/services/', label: 'Services' },
  { href: '/industries/', label: 'Industries' },
  { href: '/about/', label: 'About' },
  { href: '/contact/', label: 'Contact' },
];

export const technologies = {
  rowA: ['SAP S/4HANA', 'Salesforce', 'ServiceNow', 'Microsoft Dynamics 365', 'Oracle Cloud', 'Workday', 'AWS', 'Microsoft Azure', 'Google Cloud', 'Snowflake', 'Databricks', 'Power BI'],
  rowB: ['Generative AI', 'OpenAI', 'Kubernetes', 'Terraform', 'React', 'Angular', '.NET', 'Java Â· Spring', 'Python', 'Node.js', 'MuleSoft', 'Tableau', 'UiPath', 'Flutter'],
};

export const audiences = ['your team', 'your customers', 'your patients', 'your students', 'your community', 'your neighbourhood shop'];

export const chapters = [
  {
    n: '01',
    icon: 'ear',
    title: 'We listen',
    lead: 'Before a single line of code, we sit with you.',
    text: 'We want to understand the people behind the problem: the late nights, the workarounds, the hopes for what could be. Your story shapes everything that follows.',
  },
  {
    n: '02',
    icon: 'compass',
    title: 'We understand',
    lead: 'Then we map the path together, honestly.',
    text: 'Clear options in plain language, with the trade-offs laid out. No jargon, no pressure, and no recommending something just because it is popular.',
  },
  {
    n: '03',
    icon: 'code',
    title: 'We build, side by side',
    lead: 'You see progress every week, not just at the end.',
    text: 'Small, steady steps you can touch and try. We invite your team in, celebrate the wins with you and fix the bumps quickly and openly.',
  },
  {
    n: '04',
    icon: 'heart',
    title: 'We stay',
    lead: 'Going live is a beginning, not a goodbye.',
    text: 'We stay close after launch, keep things healthy and secure, and keep improving as your world changes. You will always know who to call.',
  },
];

export const ways = [
  { k: '01', title: 'A trusted second opinion', text: 'Short, focused guidance when you are facing a big decision and want an honest, independent view.' },
  { k: '02', title: 'A project, start to finish', text: 'We take an idea all the way to launch with a clear plan, steady updates and no surprises.' },
  { k: '03', title: 'An extension of your team', text: 'Skilled people who join your rhythm, share your goals and grow with you over time.' },
  { k: '04', title: 'Ongoing care', text: 'We look after the systems you rely on every day, so you can focus on the people you serve.' },
];

export const promises = [
  { icon: 'users', title: 'Real people, all the way through', text: 'The experienced people you meet on day one are the people who stay with you.' },
  { icon: 'compass', title: 'Honest advice', text: 'We recommend what is right for you, even when the right answer is simpler than you expected.' },
  { icon: 'shield', title: 'Safe hands', text: 'Your data and your trust are treated with the same care we would want for our own.' },
  { icon: 'heart', title: 'Care that continues', text: 'We are here long after launch, because good relationships do not end at go-live.' },
];

export const faqs = [
  { q: 'What kind of technology do you work with?', a: 'Most of what modern organisations rely on: SAP, Oracle, Microsoft Dynamics 365, Workday, Salesforce, ServiceNow, the major clouds (AWS, Azure, Google Cloud), data and AI platforms, and custom software built with React, .NET, Java, Python and Flutter. If it matters to your work, we are happy to talk about it.' },
  { q: 'We are a small organisation. Is that okay?', a: 'Absolutely. We work with start-ups, growing teams, family-run companies, charities and large organisations alike. Every relationship gets the same attention and the same care.' },
  { q: 'We are not technical. Will that be a problem?', a: 'Not at all. Explaining things clearly is part of our job. We use plain language, show rather than tell, and make sure you feel confident about every decision.' },
  { q: 'How do we begin?', a: 'Just write to letsconnect@cornerstonetech.co.in and tell us a little about what is on your mind. We usually reply within one working day and suggest a relaxed first conversation.' },
  { q: 'What happens once everything is live?', a: 'We stay with you. We keep an eye on things, help your people settle in, and keep improving as your needs grow. You will always have a familiar person to talk to.' },
  { q: 'How do you look after our information?', a: 'With great care. We are happy to sign an NDA, give access only to the people who need it, and build security in from the very first day. We can also help you prepare for ISO 27001, SOC 2, GDPR and India DPDP requirements.' },
];
