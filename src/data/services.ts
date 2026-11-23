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
    title: 'Digital Transformation Advisory',
    icon: 'compass',
    summary: 'Technology roadmaps, architecture reviews, vendor selection and business cases that leadership can act on.',
    intro: 'Big technology decisions deserve independent, evidence-based advice. We help leadership teams cut through vendor noise, align technology with business strategy and commit to a roadmap they can defend.',
    capabilities: ['Digital and technology strategy', 'Enterprise and solution architecture reviews', 'Vendor and platform selection', 'Business case and ROI modelling', 'Programme governance and PMO set-up', 'Operating model and capability assessment'],
    tech: ['TOGAF', 'ArchiMate', 'Wardley mapping', 'Cloud Adoption Framework', 'SAFe'],
    outcomes: ['A prioritised, costed roadmap', 'Lower selection and delivery risk', 'Stakeholder alignment from day one'],
  },
  {
    slug: 'enterprise-applications',
    title: 'Enterprise Applications',
    icon: 'layers',
    summary: 'SAP, Oracle, Microsoft Dynamics 365 and Workday: implementation, upgrades, migrations and support.',
    intro: 'Core platforms run the business, so changes to them must be precise. We deliver ERP, finance, HR and supply chain programmes that modernise processes while protecting day-to-day operations.',
    capabilities: ['SAP S/4HANA implementation and migration', 'Oracle Cloud ERP and HCM', 'Microsoft Dynamics 365 finance and operations', 'Workday HCM and financials', 'Upgrades, rollouts and template design', 'Application support and enhancement'],
    tech: ['SAP S/4HANA', 'Oracle Cloud', 'Dynamics 365', 'Workday', 'SAP BTP'],
    outcomes: ['Standardised global processes', 'Cleaner, migrated data', 'Reduced total cost of ownership'],
  },
  {
    slug: 'crm-customer-platforms',
    title: 'CRM & Customer Platforms',
    icon: 'users',
    summary: 'Salesforce, HubSpot and Dynamics CRM solutions that unify sales, service and marketing.',
    intro: 'A great customer experience needs one connected view of the customer. We implement and extend CRM platforms so sales, service and marketing teams all work from the same truth.',
    capabilities: ['Salesforce Sales, Service and Experience Cloud', 'HubSpot and Dynamics 365 CRM', 'Marketing automation and journeys', 'CPQ and revenue lifecycle', 'Customer 360 and data unification', 'Custom apps and AppExchange integrations'],
    tech: ['Salesforce', 'HubSpot', 'Dynamics 365 CRM', 'Marketing Cloud', 'Apex · LWC'],
    outcomes: ['A single view of the customer', 'Faster lead-to-cash cycles', 'Higher adoption through better UX'],
  },
  {
    slug: 'cloud-devops',
    title: 'Cloud & DevOps',
    icon: 'cloud',
    summary: 'AWS, Azure and Google Cloud migrations, landing zones, Kubernetes, CI/CD and FinOps.',
    intro: 'The cloud pays off when it is designed well and run with discipline. We plan migrations, build secure landing zones and automate delivery so teams ship faster with less risk and less waste.',
    capabilities: ['Cloud migration and modernisation', 'Landing zones and governance', 'Kubernetes and container platforms', 'Infrastructure as code', 'CI/CD pipelines and platform engineering', 'Observability, SRE and FinOps'],
    tech: ['AWS', 'Azure', 'Google Cloud', 'Kubernetes', 'Terraform', 'GitHub Actions'],
    outcomes: ['Faster, safer releases', 'Resilient, scalable platforms', 'Cloud spend under control'],
  },
  {
    slug: 'data-analytics-bi',
    title: 'Data, Analytics & BI',
    icon: 'chart',
    summary: 'Modern data platforms on Snowflake and Databricks, plus Power BI and Tableau insight that drives decisions.',
    intro: 'Data only matters when people use it. We build trusted data platforms and self-service analytics that put the right numbers in front of the right people at the right time.',
    capabilities: ['Data strategy and governance', 'Lakehouse and warehouse engineering', 'ELT/ETL pipelines and streaming', 'Dashboards and self-service BI', 'Master data and data quality', 'Advanced and predictive analytics'],
    tech: ['Snowflake', 'Databricks', 'Power BI', 'Tableau', 'dbt', 'Azure Synapse'],
    outcomes: ['One trusted source of truth', 'Decisions in minutes, not weeks', 'Analytics people actually adopt'],
  },
  {
    slug: 'ai-genai-automation',
    title: 'AI, GenAI & Automation',
    icon: 'spark',
    summary: 'Copilots, intelligent agents, ML models and RPA, with responsible AI governance built in.',
    intro: 'We move AI from experiment to production. From generative AI copilots to classical machine learning and robotic process automation, we focus on use cases with measurable value and the guardrails to run them safely.',
    capabilities: ['GenAI copilots and retrieval-augmented search', 'Intelligent agents and workflow automation', 'Machine learning model development and MLOps', 'Robotic process automation', 'Document and conversation intelligence', 'Responsible AI governance and evaluation'],
    tech: ['OpenAI', 'Azure OpenAI', 'LangChain', 'Python', 'UiPath', 'Power Automate'],
    outcomes: ['Productivity gains you can measure', 'AI with governance and guardrails', 'Production-ready, not just proofs of concept'],
  },
  {
    slug: 'custom-software-products',
    title: 'Custom Software & Products',
    icon: 'code',
    summary: 'Web, mobile and API-first products engineered with React, .NET, Java, Python and Flutter.',
    intro: 'When off-the-shelf will not do, we design and build software around how your business really works. Product thinking, clean architecture and rigorous engineering produce applications that last.',
    capabilities: ['Product discovery and UX design', 'Web applications and portals', 'iOS, Android and cross-platform mobile apps', 'API-first and microservice architectures', 'Legacy application modernisation', 'MVP to scale product engineering'],
    tech: ['React', 'Angular', '.NET', 'Java · Spring', 'Python', 'Node.js', 'Flutter'],
    outcomes: ['Software that fits your process', 'Maintainable, well-tested code', 'Faster time to market'],
  },
  {
    slug: 'cybersecurity-compliance',
    title: 'Cybersecurity & Compliance',
    icon: 'shield',
    summary: 'Security assessments, IAM, DevSecOps and compliance readiness for ISO 27001, SOC 2, GDPR and DPDP.',
    intro: 'Security is a design principle, not an afterthought. We assess your posture, close the gaps and embed controls into engineering so trust is built in from the start.',
    capabilities: ['Security and risk assessments', 'Identity and access management', 'DevSecOps and secure SDLC', 'Cloud security posture management', 'ISO 27001 and SOC 2 readiness', 'GDPR and India DPDP programme support'],
    tech: ['Microsoft Entra ID', 'Okta', 'OWASP', 'Defender', 'SIEM tooling'],
    outcomes: ['Reduced attack surface', 'Audit-ready evidence', 'Security that does not slow delivery'],
  },
  {
    slug: 'it-service-management',
    title: 'IT Service Management',
    icon: 'gear',
    summary: 'ServiceNow and ITIL-aligned ITSM, ITOM and HR service delivery that scales with you.',
    intro: 'Great service management makes the whole organisation run smoother. We implement ServiceNow and ITIL-aligned processes for IT, HR and business teams, with workflows that people actually enjoy using.',
    capabilities: ['ServiceNow ITSM, ITOM and CMDB', 'HR and customer service delivery', 'Workflow and low-code app development', 'Service catalogue and portal design', 'Discovery, event and AIOps', 'ITIL process design and maturity uplift'],
    tech: ['ServiceNow', 'ITIL 4', 'Jira Service Management', 'BMC Helix'],
    outcomes: ['Faster resolution and fulfilment', 'Complete asset and service visibility', 'A better employee experience'],
  },
  {
    slug: 'integration-apis',
    title: 'Integration & APIs',
    icon: 'link',
    summary: 'MuleSoft, Azure Integration and event-driven architectures connecting every system you run.',
    intro: 'Connected systems create connected businesses. We design API-led and event-driven integration layers that remove silos, reduce rework and make change easier.',
    capabilities: ['API strategy, design and management', 'MuleSoft and Azure Integration Services', 'Event-driven architecture and messaging', 'B2B and EDI integration', 'Legacy and SaaS connectivity', 'Integration monitoring and support'],
    tech: ['MuleSoft', 'Azure Integration', 'Apache Kafka', 'REST · GraphQL', 'Boomi'],
    outcomes: ['Fewer brittle point-to-point links', 'Reusable APIs across teams', 'Real-time data across systems'],
  },
  {
    slug: 'quality-engineering',
    title: 'Quality Engineering',
    icon: 'flask',
    summary: 'Test strategy, automation, performance and security testing that ships confidence with every release.',
    intro: 'Quality is built, not inspected in. We embed testing across the lifecycle so every release is faster, safer and easier to trust.',
    capabilities: ['Test strategy and quality governance', 'Test automation frameworks', 'Performance and load engineering', 'API and contract testing', 'Security and accessibility testing', 'ERP and CRM packaged-app testing'],
    tech: ['Playwright', 'Selenium', 'JMeter', 'k6', 'Postman', 'Tosca'],
    outcomes: ['Fewer production defects', 'Shorter regression cycles', 'Confident, frequent releases'],
  },
  {
    slug: 'managed-services-talent',
    title: 'Managed Services & Talent',
    icon: 'headset',
    summary: 'Application support, 24×7 operations and skilled consultants who extend your team on demand.',
    intro: 'Keep your platforms healthy and your teams focused. We provide SLA-backed support and operations, plus experienced consultants who extend your capacity when and where you need it.',
    capabilities: ['Application support (L1 to L3)', '24×7 monitoring and incident response', 'Run, maintain and enhance models', 'Dedicated delivery pods', 'Specialist consultant augmentation', 'Continuous service improvement'],
    tech: ['ServiceNow', 'Azure Monitor', 'Datadog', 'PagerDuty'],
    outcomes: ['Predictable run costs', 'Fast, accountable support', 'Scalable capacity on demand'],
  },
];

export const serviceBySlug = (slug: string) => services.find((s) => s.slug === slug);
