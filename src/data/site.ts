export const site = {
  name: 'Cornerstone Tech Advisory LLP',
  short: 'Cornerstone',
  url: 'https://cornerstonetech.co.in',
  tagline: 'Software consulting, engineering and advisory',
  description:
    'Cornerstone Tech Advisory LLP is a software consulting firm delivering enterprise applications, cloud, data, AI, CRM, ITSM and custom engineering across every industry.',
  email: {
    sales: 'letsconnect@cornerstonetech.co.in',
    support: 'wecare@cornerstonetech.co.in',
  },
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
  rowB: ['Generative AI', 'OpenAI', 'Kubernetes', 'Terraform', 'React', 'Angular', '.NET', 'Java · Spring', 'Python', 'Node.js', 'MuleSoft', 'Tableau', 'UiPath', 'Flutter'],
};

export const process = [
  { n: '01', title: 'Discover', text: 'Stakeholder workshops, current-state assessment and clear success metrics.' },
  { n: '02', title: 'Design', text: 'Target architecture, solution blueprint, delivery roadmap and risk plan.' },
  { n: '03', title: 'Build', text: 'Agile sprints with transparent demos, automated quality gates and DevSecOps.' },
  { n: '04', title: 'Deploy', text: 'Zero-drama go-lives, data migration, change management and user enablement.' },
  { n: '05', title: 'Evolve', text: 'Hypercare, managed services and continuous optimisation of value.' },
];

export const models = [
  { k: 'A', title: 'Advisory', text: 'Expert-led assessments, strategy and architecture to de-risk big decisions.' },
  { k: 'B', title: 'Project Delivery', text: 'Fixed-scope, outcome-based programmes with full delivery accountability.' },
  { k: 'C', title: 'Dedicated Teams', text: 'Cross-functional pods that plug into your roadmap and scale on demand.' },
  { k: 'D', title: 'Managed Services', text: 'SLA-backed application and platform operations, monitored around the clock.' },
];

export const why = [
  { icon: 'bolt', title: 'Senior-led delivery', text: 'Experienced consultants on every engagement, from day one to go-live.' },
  { icon: 'globe', title: 'Platform-agnostic advice', text: "We recommend what's right for you, not what's easiest to sell." },
  { icon: 'shield', title: 'Security by design', text: 'Privacy, compliance and resilience embedded into everything we build.' },
  { icon: 'heart', title: 'Care that continues', text: 'A dedicated support channel and a long-term partnership mindset.' },
];

export const faqs = [
  { q: 'Which technologies and platforms do you work with?', a: 'We work across the in-demand enterprise and engineering stack: SAP, Oracle, Microsoft Dynamics 365, Workday, Salesforce, ServiceNow, the major clouds (AWS, Azure, Google Cloud), modern data platforms, AI tooling and custom software in React, .NET, Java, Python and Flutter.' },
  { q: 'Do you only work with large enterprises?', a: 'No. We engage with start-ups, mid-sized businesses and large enterprises. Engagement models flex from a short advisory sprint to a dedicated team or a full managed service.' },
  { q: 'How do you price engagements?', a: 'Advisory work is typically time-boxed, delivery programmes can be fixed-scope and outcome-based, and dedicated teams or managed services run on a predictable monthly model. We agree the model with you after discovery.' },
  { q: 'How quickly can we get started?', a: 'Tell us about your challenge through the contact form and we usually reply within one business day. A discovery conversation normally follows within the week.' },
  { q: 'What happens after go-live?', a: 'Every programme includes hypercare. After that, our managed services and the wecare@ support channel keep your platforms healthy, secure and continuously improving.' },
  { q: 'How do you handle security and confidentiality?', a: 'We sign NDAs as standard, follow least-privilege access, and build with DevSecOps practices. We also help clients prepare for ISO 27001, SOC 2, GDPR and India DPDP compliance.' },
];
