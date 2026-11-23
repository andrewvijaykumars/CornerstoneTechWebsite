export interface Service {
  slug: string;
  title: string;
  icon: string;
  summary: string;
  intro: string;
  capabilities: string[];
  tech: string[];
  outcomes: string[];
}

export const services: Service[] = [
  {
    slug: 'digital-transformation-advisory',
    title: 'Technology Advisory',
    icon: 'compass',
    summary: 'Clear, honest guidance for the big technology decisions, so you can move forward with confidence.',
    intro: 'Big decisions can feel lonely and overwhelming. We sit beside you, listen to what you are trying to achieve, and help you see the options clearly. You get an honest, independent view and a plan your whole team can understand and believe in.',
    capabilities: ['Technology roadmaps in plain language', 'Architecture and health reviews', 'Help choosing the right platform', 'Making the case to your leadership', 'Setting up projects for success', 'Understanding where your team is today'],
    tech: ['TOGAF', 'ArchiMate', 'Wardley mapping', 'Cloud Adoption Framework', 'SAFe'],
    outcomes: ['A path everyone understands', 'Fewer costly surprises', 'Your people aligned from day one'],
  },
  {
    slug: 'enterprise-applications',
    title: 'Enterprise Applications',
    icon: 'layers',
    summary: 'SAP, Oracle, Microsoft Dynamics 365 and Workday, introduced gently so everyday work keeps flowing.',
    intro: 'The systems that run your finance, people and operations touch everyone. We modernise them with great care, keep daily work running smoothly, and help your people feel at home in the new way of working.',
    capabilities: ['SAP S/4HANA implementation and moves', 'Oracle Cloud ERP and HCM', 'Microsoft Dynamics 365 Finance and Operations', 'Workday for people and finance', 'Upgrades and rollouts across locations', 'Day-to-day support and improvements'],
    tech: ['SAP S/4HANA', 'Oracle Cloud', 'Dynamics 365', 'Workday', 'SAP BTP'],
    outcomes: ['Simpler, calmer daily work', 'Clean, trustworthy information', 'Systems your people enjoy using'],
  },
  {
    slug: 'crm-customer-platforms',
    title: 'Customer Experience Platforms',
    icon: 'users',
    summary: 'Salesforce, HubSpot and Dynamics 365 set up so every conversation with your customers feels personal.',
    intro: 'Every customer wants to feel known. We bring their story into one place, so whoever they speak to already understands them, and your team can spend less time searching and more time helping.',
    capabilities: ['Salesforce for service, communities and customer journeys', 'HubSpot and Dynamics 365 customer platforms', 'Personalised, caring customer journeys', 'Quotes and orders made simple', 'One complete picture of every customer', 'Custom apps and connected tools'],
    tech: ['Salesforce', 'HubSpot', 'Dynamics 365', 'Marketing Cloud', 'Apex · LWC'],
    outcomes: ['Customers who feel understood', 'Less time searching, more time helping', 'Tools your team actually loves'],
  },
  {
    slug: 'cloud-devops',
    title: 'Cloud & DevOps',
    icon: 'cloud',
    summary: 'Calm, reliable cloud foundations on AWS, Azure and Google Cloud, and releases that stop feeling scary.',
    intro: 'The cloud should give you peace of mind, not sleepless nights. We plan each move carefully, build secure foundations and automate the busywork, so your team can release with confidence and rest easy.',
    capabilities: ['Careful moves to the cloud', 'Secure, well-organised foundations', 'Kubernetes and containers', 'Infrastructure written as code', 'Automated, gentle release pipelines', 'Monitoring, reliability and sensible spending'],
    tech: ['AWS', 'Azure', 'Google Cloud', 'Kubernetes', 'Terraform', 'GitHub Actions'],
    outcomes: ['Releases without the stress', 'Systems that stay up when it matters', 'Cloud spending you understand'],
  },
  {
    slug: 'data-analytics-bi',
    title: 'Data & Insights',
    icon: 'chart',
    summary: 'Snowflake, Databricks, Power BI and Tableau, turned into answers people can trust and act on.',
    intro: 'Data only matters when it helps someone make a better decision. We bring your information together, make it trustworthy, and present it simply, so the right people see the right picture at the right moment.',
    capabilities: ['A clear plan for your data', 'Modern data platforms', 'Reliable data pipelines', 'Dashboards people enjoy using', 'Clean, consistent information', 'Forecasts and deeper insight'],
    tech: ['Snowflake', 'Databricks', 'Power BI', 'Tableau', 'dbt', 'Azure Synapse'],
    outcomes: ['One version of the truth', 'Answers in minutes, not weeks', 'Confidence in every decision'],
  },
  {
    slug: 'ai-genai-automation',
    title: 'AI & Automation',
    icon: 'spark',
    summary: 'Helpful AI assistants and gentle automation that give your people back their time, responsibly.',
    intro: 'Good AI should feel like a thoughtful colleague, not a mystery. We focus on the everyday tasks that drain your team, build helpers that are safe and transparent, and make sure people always stay in control.',
    capabilities: ['AI assistants that know your content', 'Smart workflows that remove busywork', 'Machine learning, built and looked after properly', 'Automation of repetitive tasks', 'Understanding documents and conversations', 'Responsible, transparent AI practices'],
    tech: ['OpenAI', 'Azure OpenAI', 'LangChain', 'Python', 'UiPath', 'Power Automate'],
    outcomes: ['Hours given back to your people', 'AI you can trust and explain', 'Real help, not just experiments'],
  },
  {
    slug: 'custom-software-products',
    title: 'Custom Software & Apps',
    icon: 'code',
    summary: 'Web and mobile apps designed around real people and crafted with React, .NET, Java, Python and Flutter.',
    intro: 'When nothing off the shelf quite fits, we build something that does. We start with the people who will use it, design with empathy and engineer with care, so it feels natural from the very first tap.',
    capabilities: ['Discovery and human-centred design', 'Web apps and portals', 'iOS, Android and cross-platform apps', 'Well-designed APIs', 'Giving older systems a fresh start', 'From first version to growing product'],
    tech: ['React', 'Angular', '.NET', 'Java · Spring', 'Python', 'Node.js', 'Flutter'],
    outcomes: ['Software that fits how you work', 'Built to last and easy to change', 'Ideas in people\'s hands sooner'],
  },
  {
    slug: 'cybersecurity-compliance',
    title: 'Security & Privacy',
    icon: 'shield',
    summary: 'Protecting the people who trust you, with security built in and ISO 27001, SOC 2, GDPR and DPDP readiness.',
    intro: 'Behind every record is a person who trusted you with it. We help you protect that trust, close the gaps calmly and build security into everyday work, so being safe never slows anyone down.',
    capabilities: ['Friendly, thorough security reviews', 'Identity and access done right', 'Security built into how software is made', 'Keeping cloud environments safe', 'ISO 27001 and SOC 2 readiness', 'GDPR and India DPDP support'],
    tech: ['Microsoft Entra ID', 'Okta', 'OWASP', 'Defender', 'SIEM tooling'],
    outcomes: ['Peace of mind for you and your users', 'Ready when auditors call', 'Safety that does not slow you down'],
  },
  {
    slug: 'it-service-management',
    title: 'Service Management',
    icon: 'gear',
    summary: 'ServiceNow and ITIL-based services that make asking for help easy for employees and customers alike.',
    intro: 'When someone needs help, the experience should feel kind and effortless. We design ServiceNow services that get people what they need quickly, and give your teams the visibility to help well.',
    capabilities: ['ServiceNow for IT, operations and assets', 'Helpful HR and customer services', 'Simple workflows and apps', 'Friendly service portals', 'Discovery, alerts and AIOps', 'Better ways of working, step by step'],
    tech: ['ServiceNow', 'ITIL 4', 'Jira Service Management', 'BMC Helix'],
    outcomes: ['Help that arrives quickly', 'A clear view of everything you run', 'Happier, less frustrated people'],
  },
  {
    slug: 'integration-apis',
    title: 'Connecting Systems',
    icon: 'link',
    summary: 'MuleSoft, Azure Integration and event-driven designs that let your systems finally talk to each other.',
    intro: 'Typing the same thing into three systems wears people down. We connect your tools so information flows on its own, quietly and reliably, and your people can let go of the copy and paste.',
    capabilities: ['A clear plan for connecting systems', 'MuleSoft and Azure Integration Services', 'Real-time, event-driven updates', 'Connecting with partners and suppliers', 'Bridging older and newer systems', 'Watching over every connection'],
    tech: ['MuleSoft', 'Azure Integration', 'Apache Kafka', 'REST · GraphQL', 'Boomi'],
    outcomes: ['No more double typing', 'Building blocks you can reuse', 'Up-to-date information everywhere'],
  },
  {
    slug: 'quality-engineering',
    title: 'Quality & Testing',
    icon: 'flask',
    summary: 'Careful testing, automation and performance checks, so every release feels safe and calm.',
    intro: 'Nobody enjoys being the one who finds the bug in production. We weave care for quality through every step, so problems are caught early and every release feels like good news.',
    capabilities: ['A thoughtful approach to quality', 'Automated testing that saves time', 'Performance and load checks', 'API and integration checks', 'Accessibility and security testing', 'Testing for SAP, Salesforce and more'],
    tech: ['Playwright', 'Selenium', 'JMeter', 'k6', 'Postman', 'Tosca'],
    outcomes: ['Fewer late-night surprises', 'Faster, calmer releases', 'Confidence in every change'],
  },
  {
    slug: 'managed-services-talent',
    title: 'Ongoing Care & Talent',
    icon: 'headset',
    summary: 'Round-the-clock care for the systems you rely on, and skilled people who join your team when you need them.',
    intro: 'Your systems never sleep, and neither does our care. We look after the platforms your people depend on, respond quickly when something needs attention, and add experienced hands whenever your team needs them.',
    capabilities: ['Friendly, responsive support at every level', 'Round-the-clock monitoring', 'Looking after and improving what you run', 'Dedicated teams that grow with you', 'Specialists exactly when you need them', 'Getting a little better every month'],
    tech: ['ServiceNow', 'Azure Monitor', 'Datadog', 'PagerDuty'],
    outcomes: ['Someone always there for you', 'Quick, caring responses', 'Room for your team to breathe'],
  },
];

export const serviceBySlug = (slug: string) => services.find((s) => s.slug === slug);
