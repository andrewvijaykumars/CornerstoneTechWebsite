export interface Industry {
  slug: string;
  title: string;
  icon: string;
  summary: string;
  intro: string;
  solutions: string[];
  platforms: string[];
  focus: string[];
}

export const industries: Industry[] = [
  {
    slug: 'banking-financial-services',
    title: 'Banking & Financial Services',
    icon: 'bank',
    summary: 'Helping people manage their money with confidence through safe, simple digital banking.',
    intro: 'Money is personal, and trust is everything. We help banks, lenders and fintechs modernise their systems and create digital experiences that feel safe, simple and respectful of every customer.',
    solutions: ['Modernising core banking safely', 'Friendly digital onboarding and lending', 'Secure payments and open APIs', 'Clear regulatory reporting', 'Spotting fraud before it hurts anyone'],
    platforms: ['Salesforce Financial Services Cloud', 'MuleSoft', 'Snowflake', 'Azure', 'AWS'],
    focus: ['Trust and safety', 'Always-on reliability', 'Respectful experiences'],
  },
  {
    slug: 'insurance',
    title: 'Insurance',
    icon: 'umbrella',
    summary: 'Being there for people in their hardest moments, with faster claims and kinder service.',
    intro: 'People usually reach their insurer on a difficult day. We help insurers respond with speed and empathy by modernising policy and claims systems and giving teams the insight to help quickly.',
    solutions: ['Simpler policy administration', 'Faster, fairer claims', 'Smarter underwriting support', 'Helpful self-service for customers and brokers', 'Clear insight into risk'],
    platforms: ['Salesforce', 'Guidewire ecosystem', 'Power BI', 'UiPath', 'Azure'],
    focus: ['Faster help on hard days', 'Fair decisions', 'Easy self-service'],
  },
  {
    slug: 'healthcare-life-sciences',
    title: 'Healthcare & Life Sciences',
    icon: 'cross',
    summary: 'Technology that gives caregivers more time with patients, connected safely and privately.',
    intro: 'Every minute a caregiver spends fighting a system is a minute not spent with a patient. We build connected, private and dependable platforms for hospitals, clinics, pharma and medtech, so care can come first.',
    solutions: ['Connecting patients and caregivers', 'EHR and HL7/FHIR integration', 'Clinical and research data platforms', 'Secure, compliant cloud environments', 'Careful validation and quality'],
    platforms: ['Salesforce Health Cloud', 'FHIR APIs', 'Databricks', 'Azure', 'AWS'],
    focus: ['Privacy first', 'More time for care', 'Systems that talk to each other'],
  },
  {
    slug: 'retail-ecommerce',
    title: 'Retail & eCommerce',
    icon: 'cart',
    summary: 'Shopping experiences that feel personal and effortless, in store and online.',
    intro: 'Shoppers remember how a brand makes them feel. We connect stores, websites and stock so every visit feels personal, every promise is kept and every parcel arrives when it should.',
    solutions: ['Seamless online and in-store experiences', 'Orders that arrive as promised', 'Personal touches and loyalty', 'Knowing what people will need next', 'Connecting marketplaces and back office'],
    platforms: ['Salesforce Commerce Cloud', 'Shopify ecosystem', 'SAP', 'Snowflake', 'React'],
    focus: ['Delighted shoppers', 'Promises kept', 'Lasting loyalty'],
  },
  {
    slug: 'manufacturing',
    title: 'Manufacturing',
    icon: 'factory',
    summary: 'Connecting the shop floor and the office, so makers can do their best work safely.',
    intro: 'Great products come from people who take pride in their craft. We connect machines, systems and teams so problems are spotted early, quality stays high and everyone works with a clearer view.',
    solutions: ['Connecting ERP and the shop floor', 'Live machine and sensor data', 'Fixing issues before breakdowns', 'Quality you can trace end to end', 'Clear view of suppliers and plans'],
    platforms: ['SAP', 'Azure IoT', 'Databricks', 'Power BI', 'ServiceNow'],
    focus: ['Safer work', 'Consistent quality', 'Fewer disruptions'],
  },
  {
    slug: 'energy-utilities',
    title: 'Energy & Utilities',
    icon: 'bolt',
    summary: 'Keeping the lights on for communities with smarter, more sustainable operations.',
    intro: 'Families and businesses count on power and water every single day. We help utilities look after their assets, support crews in the field and communicate clearly with the communities they serve.',
    solutions: ['Caring for critical assets', 'Mobile tools for field crews', 'Smarter grid and usage insight', 'Clear, fair billing', 'Sustainability reporting'],
    platforms: ['SAP', 'Salesforce', 'Azure', 'Databricks', 'ServiceNow'],
    focus: ['Reliability for families', 'A greener future', 'Clear communication'],
  },
  {
    slug: 'telecom-media',
    title: 'Telecom & Media',
    icon: 'signal',
    summary: 'Keeping people connected and entertained, with services that simply work.',
    intro: 'Staying connected to the people and stories we love matters more than ever. We help telecom and media companies modernise their platforms, launch new services faster and understand what their audiences truly enjoy.',
    solutions: ['Modernising BSS/OSS platforms', 'Understanding what subscribers need', 'Streaming and content platforms', 'Automating networks and services', 'Partner and API ecosystems'],
    platforms: ['Salesforce', 'ServiceNow', 'Kafka', 'AWS', 'Snowflake'],
    focus: ['Always connected', 'New ideas, sooner', 'Happy audiences'],
  },
  {
    slug: 'logistics-supply-chain',
    title: 'Logistics & Supply Chain',
    icon: 'truck',
    summary: 'Getting what people need to where it matters, on time and with full visibility.',
    intro: 'Behind every delivery is someone waiting for it. We connect warehouses, carriers and partners and bring everything into view, so goods move smoothly and promises are kept.',
    solutions: ['Warehouse and transport systems', 'Live tracking and control towers', 'Smarter routes and loads', 'Partner and EDI connections', 'Planning for demand and capacity'],
    platforms: ['SAP', 'Dynamics 365', 'MuleSoft', 'Power BI', 'Azure'],
    focus: ['Full visibility', 'On-time deliveries', 'Less waste'],
  },
  {
    slug: 'public-sector',
    title: 'Public Sector',
    icon: 'building',
    summary: 'Citizen services that are open, accessible and kind to everyone who needs them.',
    intro: 'Public services exist for everyone, including people who find technology hard. We help agencies build services that are accessible, secure and genuinely easy to use, and make better use of their information.',
    solutions: ['Simple citizen service portals', 'Secure digital public infrastructure', 'Case and workflow management', 'Open data and insight', 'Accessibility and inclusion'],
    platforms: ['ServiceNow', 'Salesforce Public Sector', 'Azure', 'Power BI', 'React'],
    focus: ['Access for everyone', 'Safety and privacy', 'Openness'],
  },
  {
    slug: 'education',
    title: 'Education',
    icon: 'cap',
    summary: 'Helping learners and teachers thrive with digital learning that inspires.',
    intro: 'Every learner deserves the chance to shine. We build learning platforms, student systems and insight tools for universities, schools and EdTech teams, so teachers can teach and students can grow.',
    solutions: ['Learning and content platforms', 'Student information and admissions', 'Mobile learning apps', 'Insight that helps students succeed', 'Connected campus systems'],
    platforms: ['Salesforce Education Cloud', 'Flutter', 'React', 'Power BI', 'AWS'],
    focus: ['Learners first', 'Engaged classrooms', 'Less admin for teachers'],
  },
  {
    slug: 'travel-hospitality',
    title: 'Travel & Hospitality',
    icon: 'plane',
    summary: 'Making every journey and every stay feel effortless and warmly welcoming.',
    intro: 'Travel is about memories. We build booking, loyalty and guest experience platforms that make every step feel easy, so your teams can focus on making guests feel at home.',
    solutions: ['Easy booking and reservations', 'Insight for smarter planning', 'Warm guest experiences and loyalty', 'Connected properties and channels', 'Mobile concierge apps'],
    platforms: ['Salesforce', 'Dynamics 365', 'React', 'Flutter', 'Snowflake'],
    focus: ['Memorable stays', 'Effortless journeys', 'Guests who return'],
  },
  {
    slug: 'automotive-mobility',
    title: 'Automotive & Mobility',
    icon: 'car',
    summary: 'Making every journey safer and smarter, with connected vehicles and caring service.',
    intro: 'Mobility is becoming electric, connected and centred on people. We build dealer, service and connected-vehicle platforms that help carmakers and mobility providers look after drivers better.',
    solutions: ['Dealer management systems', 'Connected vehicle data', 'Service and warranty care', 'EV charging and fleet apps', 'Knowing and caring for every driver'],
    platforms: ['Salesforce', 'SAP', 'Azure IoT', 'Kafka', 'Flutter'],
    focus: ['Safer journeys', 'Caring service', 'Ready for electric'],
  },
];

export const industryBySlug = (slug: string) => industries.find((i) => i.slug === slug);
