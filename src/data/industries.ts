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
    summary: 'Core banking modernisation, digital lending, payments, regulatory reporting and fraud analytics.',
    intro: 'Financial institutions must innovate quickly while staying compliant and secure. We help banks, NBFCs and fintechs modernise core systems and launch digital experiences on a foundation of trust.',
    solutions: ['Core banking modernisation', 'Digital onboarding and lending journeys', 'Payments and open-API integration', 'Regulatory and risk reporting', 'Fraud and AML analytics'],
    platforms: ['Salesforce Financial Services Cloud', 'MuleSoft', 'Snowflake', 'Azure', 'AWS'],
    focus: ['Regulatory compliance', 'Real-time resilience', 'Customer trust'],
  },
  {
    slug: 'insurance',
    title: 'Insurance',
    icon: 'umbrella',
    summary: 'Policy administration, claims automation, underwriting intelligence and customer self-service portals.',
    intro: 'Insurers are competing on speed and service. We modernise policy and claims platforms and add intelligence to underwriting so carriers and brokers can serve customers faster.',
    solutions: ['Policy administration modernisation', 'Claims automation and triage', 'Underwriting decision support', 'Broker and customer portals', 'Actuarial and risk analytics'],
    platforms: ['Salesforce', 'Guidewire ecosystem', 'Power BI', 'UiPath', 'Azure'],
    focus: ['Faster claims', 'Better risk selection', 'Digital self-service'],
  },
  {
    slug: 'healthcare-life-sciences',
    title: 'Healthcare & Life Sciences',
    icon: 'cross',
    summary: 'Patient engagement, EHR integration, clinical data platforms and compliant cloud for life sciences.',
    intro: 'Healthcare technology must be reliable, interoperable and private. We build patient-centred platforms and compliant data foundations for providers, pharma and medtech organisations.',
    solutions: ['Patient and provider engagement', 'EHR and HL7/FHIR integration', 'Clinical and research data platforms', 'Regulated cloud environments', 'Quality and validation engineering'],
    platforms: ['Salesforce Health Cloud', 'FHIR APIs', 'Databricks', 'Azure', 'AWS'],
    focus: ['Privacy and compliance', 'Interoperability', 'Patient experience'],
  },
  {
    slug: 'retail-ecommerce',
    title: 'Retail & eCommerce',
    icon: 'cart',
    summary: 'Unified commerce, omnichannel CX, demand forecasting and loyalty platforms that convert.',
    intro: 'Shoppers expect a seamless experience across every channel. We unify commerce, inventory and customer data so retailers can personalise, fulfil and grow.',
    solutions: ['Unified and headless commerce', 'Omnichannel order management', 'Personalisation and loyalty', 'Demand forecasting and replenishment', 'Marketplace and ERP integration'],
    platforms: ['Salesforce Commerce Cloud', 'Shopify ecosystem', 'SAP', 'Snowflake', 'React'],
    focus: ['Conversion', 'Inventory accuracy', 'Customer lifetime value'],
  },
  {
    slug: 'manufacturing',
    title: 'Manufacturing',
    icon: 'factory',
    summary: 'Smart factory, MES and ERP integration, IoT telemetry, quality analytics and supply visibility.',
    intro: 'Modern manufacturers connect the shop floor to the top floor. We integrate ERP, MES and IoT data to improve throughput, quality and supply chain visibility.',
    solutions: ['ERP and MES integration', 'IoT and shop-floor telemetry', 'Predictive maintenance analytics', 'Quality and traceability', 'Supplier and supply-plan visibility'],
    platforms: ['SAP', 'Azure IoT', 'Databricks', 'Power BI', 'ServiceNow'],
    focus: ['Uptime', 'Quality', 'Supply resilience'],
  },
  {
    slug: 'energy-utilities',
    title: 'Energy & Utilities',
    icon: 'bolt',
    summary: 'Asset performance, field service, grid analytics and customer billing transformation.',
    intro: 'Energy providers are balancing reliability, sustainability and customer expectations. We help utilities digitise asset management, field operations and customer engagement.',
    solutions: ['Asset performance management', 'Field service mobility', 'Grid and consumption analytics', 'Billing and CIS transformation', 'Sustainability reporting'],
    platforms: ['SAP', 'Salesforce', 'Azure', 'Databricks', 'ServiceNow'],
    focus: ['Reliability', 'Sustainability', 'Customer experience'],
  },
  {
    slug: 'telecom-media',
    title: 'Telecom & Media',
    icon: 'signal',
    summary: 'BSS/OSS modernisation, subscriber analytics, OTT platforms and network automation.',
    intro: 'Telecom and media companies compete on experience and agility. We modernise BSS/OSS stacks, build streaming and subscriber platforms, and apply analytics to retain and grow audiences.',
    solutions: ['BSS/OSS modernisation', 'Subscriber and churn analytics', 'OTT and content platforms', 'Network and service automation', 'Partner and API ecosystems'],
    platforms: ['Salesforce', 'ServiceNow', 'Kafka', 'AWS', 'Snowflake'],
    focus: ['Churn reduction', 'Time to launch', 'Network efficiency'],
  },
  {
    slug: 'logistics-supply-chain',
    title: 'Logistics & Supply Chain',
    icon: 'truck',
    summary: 'Warehouse and transport management, track-and-trace, route optimisation and control towers.',
    intro: 'Resilient supply chains depend on real-time visibility. We connect warehouses, carriers and partners and apply analytics to optimise flow from order to delivery.',
    solutions: ['Warehouse and transport management', 'Track-and-trace and control towers', 'Route and load optimisation', 'Partner and EDI integration', 'Demand and capacity planning'],
    platforms: ['SAP', 'Dynamics 365', 'MuleSoft', 'Power BI', 'Azure'],
    focus: ['Visibility', 'On-time delivery', 'Cost to serve'],
  },
  {
    slug: 'public-sector',
    title: 'Public Sector',
    icon: 'building',
    summary: 'Citizen services, secure digital public infrastructure and data-driven governance.',
    intro: 'Public institutions serve everyone and must be accessible, transparent and secure. We help agencies deliver citizen-first digital services and make better use of their data.',
    solutions: ['Citizen service portals', 'Secure digital public infrastructure', 'Case and workflow management', 'Open data and analytics', 'Accessibility and inclusion'],
    platforms: ['ServiceNow', 'Salesforce Public Sector', 'Azure', 'Power BI', 'React'],
    focus: ['Accessibility', 'Security', 'Transparency'],
  },
  {
    slug: 'education',
    title: 'Education',
    icon: 'cap',
    summary: 'Learning platforms, student information systems and analytics for institutions and EdTech.',
    intro: 'Education is being reshaped by digital learning. We build learning experiences, student systems and insight tools for universities, schools and EdTech companies.',
    solutions: ['Learning and content platforms', 'Student information and admissions', 'Mobile learning apps', 'Student success analytics', 'Campus systems integration'],
    platforms: ['Salesforce Education Cloud', 'Flutter', 'React', 'Power BI', 'AWS'],
    focus: ['Learner outcomes', 'Engagement', 'Operational efficiency'],
  },
  {
    slug: 'travel-hospitality',
    title: 'Travel & Hospitality',
    icon: 'plane',
    summary: 'Booking engines, revenue management, guest experience and loyalty for travel brands.',
    intro: 'Travellers expect effortless journeys from search to stay. We build booking, loyalty and guest-experience platforms that turn visitors into loyal customers.',
    solutions: ['Booking and reservation engines', 'Revenue and yield analytics', 'Guest experience and loyalty', 'Property and channel integration', 'Mobile concierge apps'],
    platforms: ['Salesforce', 'Dynamics 365', 'React', 'Flutter', 'Snowflake'],
    focus: ['Direct bookings', 'Guest satisfaction', 'Revenue per available room'],
  },
  {
    slug: 'automotive-mobility',
    title: 'Automotive & Mobility',
    icon: 'car',
    summary: 'Dealer management, connected vehicle data, aftersales and EV ecosystem platforms.',
    intro: 'Mobility is going electric, connected and service-led. We build dealer, aftersales and connected-vehicle platforms that help OEMs and mobility providers serve drivers better.',
    solutions: ['Dealer management systems', 'Connected vehicle data platforms', 'Aftersales and warranty', 'EV charging and fleet apps', 'Customer 360 and loyalty'],
    platforms: ['Salesforce', 'SAP', 'Azure IoT', 'Kafka', 'Flutter'],
    focus: ['Connected experience', 'Aftersales revenue', 'EV readiness'],
  },
];

export const industryBySlug = (slug: string) => industries.find((i) => i.slug === slug);
