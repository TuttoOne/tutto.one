// Option lists, reference content and step definitions.
// Values are short ids; labels are what people see and what the charter prints.

export const CHARTER_TYPES = [
  { value: 'strategy', label: 'Our organisation’s AI strategy', hint: 'Why and how the whole organisation uses AI.' },
  { value: 'individual', label: 'How our people use AI', hint: 'Day-to-day rules for staff, students or members.' },
  { value: 'services', label: 'AI in the services we offer', hint: 'How AI shapes what clients or the public receive.' },
  { value: 'development', label: 'How we build AI systems', hint: 'Design and development of your own AI.' },
  { value: 'governance', label: 'How we govern and oversee AI', hint: 'Who decides, who checks, who answers for it.' },
];

export const ORG_TYPES = [
  { value: 'private', label: 'Private company' },
  { value: 'public', label: 'Public administration' },
  { value: 'education', label: 'School, college or university' },
  { value: 'nonprofit', label: 'Non-profit or NGO' },
  { value: 'research', label: 'Research institution' },
  { value: 'healthcare', label: 'Healthcare organisation' },
  { value: 'community', label: 'Local community or collective' },
  { value: 'other', label: 'Other' },
];

export const ORG_SIZES = [
  { value: 'small', label: '1 to 50 people' },
  { value: 'medium', label: '50 to 500 people' },
  { value: 'large', label: '500 to 5,000 people' },
  { value: 'xlarge', label: 'More than 5,000 people' },
  { value: 'na', label: 'Not applicable' },
];

export const MATURITY = [
  { value: 'planning', label: 'Not using AI yet, but planning to' },
  { value: 'exploring', label: 'Exploring: early experiments and pilots' },
  { value: 'adopting', label: 'Adopting: some tools in everyday use' },
  { value: 'integrating', label: 'Integrating: several AI systems in use' },
  { value: 'centric', label: 'AI-centric: AI is core to what we do' },
];

export const SCOPES = [
  { value: 'local', label: 'Local: one site' },
  { value: 'regional', label: 'Regional: several sites in one region' },
  { value: 'national', label: 'National' },
  { value: 'international', label: 'International: several countries' },
  { value: 'global', label: 'Global' },
];

export const STAKEHOLDERS = [
  { value: 'staff', label: 'Employees and staff' },
  { value: 'students', label: 'Students' },
  { value: 'teachers', label: 'Teachers and educators' },
  { value: 'parents', label: 'Parents and guardians' },
  { value: 'clients', label: 'Clients and customers' },
  { value: 'patients', label: 'Patients and service users' },
  { value: 'public', label: 'The public' },
  { value: 'partners', label: 'Partners and supporters' },
  { value: 'researchers', label: 'Researchers' },
  { value: 'developers', label: 'Developers and engineers' },
  { value: 'regulators', label: 'Regulators' },
  { value: 'other', label: 'Other external parties' },
];

export const VALUES = [
  { value: 'honesty', label: 'Honesty' },
  { value: 'trust', label: 'Trust' },
  { value: 'boldness', label: 'Boldness' },
  { value: 'freedom', label: 'Freedom' },
  { value: 'modesty', label: 'Modesty' },
  { value: 'inclusivity', label: 'Inclusivity' },
  { value: 'sustainability', label: 'Sustainability' },
  { value: 'innovation', label: 'Innovation' },
  { value: 'transparency', label: 'Transparency' },
  { value: 'responsibility', label: 'Responsibility' },
];

// The seven principles, after Capgemini's Code of Ethics for AI and the EU trustworthy AI guidelines.
export const PRINCIPLES = [
  {
    value: 'impact', label: 'AI with carefully delimited impact',
    description: 'Designed for human benefit, with a clearly defined purpose: what the solution delivers, to whom, and with respect for human rights.',
    example: { challenge: 'AI gets used because it is available, not because it serves a clear purpose.', response: 'Every AI use states who it serves and what it delivers before it is approved.' },
  },
  {
    value: 'sustainable', label: 'Sustainable AI',
    description: 'Developed with every stakeholder in mind, benefiting the environment and all present and future members of our ecosystem.',
    example: { challenge: 'Training and running AI models uses significant energy and water.', response: 'We prefer proportionate tools, measure use where we can, and weigh environmental cost when we buy.' },
  },
  {
    value: 'fair', label: 'Fair AI',
    description: 'Produced by diverse teams using sound data, so outcomes are unbiased and include all individuals and groups.',
    example: { challenge: 'AI systems can reflect biases in the data they learned from.', response: 'We involve a diverse group in design and review, and test outputs for unfair bias.' },
  },
  {
    value: 'transparent', label: 'Transparent and explainable AI',
    description: 'Outcomes can be understood, traced and audited as appropriate, and we are clear about what AI can and cannot do.',
    example: { challenge: 'People may not know when AI shaped a decision or a piece of content.', response: 'We say when AI is used, and keep enough records to explain how an outcome was reached.' },
  },
  {
    value: 'controllable', label: 'Controllable AI with clear accountability',
    description: 'People make informed choices and keep the final say, with clear roles, responsibilities and traceability.',
    example: { challenge: 'Automated suggestions can quietly become automated decisions.', response: 'A named person is accountable for each AI use, and anyone affected can ask for a human review.' },
  },
  {
    value: 'robust', label: 'Robust and safe AI',
    description: 'Technically sound, with fallback plans; accurate, reliable and reproducible; secure against accidents and misuse.',
    example: { challenge: 'AI output can be wrong while sounding confident.', response: 'We check output before relying on it, and keep a fallback for when tools fail.' },
  },
  {
    value: 'privacy', label: 'AI that respects privacy and data protection',
    description: 'Privacy and security are considered from the design stage, so data use is lawful, secure and respects individual rights.',
    example: { challenge: 'People may paste personal or confidential data into public AI tools.', response: 'We set clear rules on which data may go into which tools, and only approve tools that meet data protection law.' },
  },
];

export const REGULATION = [
  { value: 'light', label: 'Light: little sector-specific regulation' },
  { value: 'moderate', label: 'Moderate: general rules such as GDPR apply' },
  { value: 'high', label: 'High: regulated sector such as health, finance or critical infrastructure' },
  { value: 'public', label: 'Public sector: public accountability applies' },
];

export const MODELS = [
  {
    value: 'officer', label: 'A named AI lead',
    bestFor: 'Small teams and organisations starting out.',
    pros: 'Simple, quick, one clear point of contact.', cons: 'Depends on one person’s time and judgement.',
  },
  {
    value: 'committee', label: 'Central AI ethics committee',
    bestFor: 'Schools, non-profits, regulated organisations.',
    pros: 'Consistent oversight and clear accountability.', cons: 'Can become a bottleneck.',
  },
  {
    value: 'advisory', label: 'Committee with an external advisory board',
    bestFor: 'Public bodies and high-profile AI use.',
    pros: 'Independent scrutiny and public credibility.', cons: 'Slower and costlier.',
  },
  {
    value: 'hybrid', label: 'Hybrid: central standards, local delivery',
    bestFor: 'Larger organisations with several departments.',
    pros: 'Balanced and scales well.', cons: 'More to design and coordinate.',
  },
  {
    value: 'distributed', label: 'Distributed: each department oversees its own AI',
    bestFor: 'Very diverse business units.',
    pros: 'Agile and close to the work.', cons: 'Risk of inconsistency and duplication.',
  },
  {
    value: 'taskforce', label: 'Cross-functional AI task force',
    bestFor: 'Organisations piloting AI.',
    pros: 'Several perspectives, quick to set up.', cons: 'Temporary by nature.',
  },
  { value: 'other', label: 'Something else', bestFor: '', pros: '', cons: '' },
];

export const FRAMEWORKS = [
  {
    value: 'eu-ai-act', label: 'EU AI Act', status: 'Binding EU regulation',
    bestFor: 'Anyone using or offering AI in the EU.',
    meaning: 'We classify our AI uses by risk, avoid prohibited practices, and meet the transparency and oversight duties that apply to us.',
    step: 'Check each AI use against the EU AI Act risk categories and close any gaps.',
  },
  {
    value: 'nist-ai-rmf', label: 'NIST AI Risk Management Framework', status: 'Voluntary framework',
    bestFor: 'Any organisation wanting a practical risk method.',
    meaning: 'We manage AI risk through its four functions: govern, map, measure and manage.',
    step: 'Run a first NIST-style risk review: govern, map, measure, manage.',
  },
  {
    value: 'iso-42001', label: 'ISO/IEC 42001', status: 'Certifiable standard',
    bestFor: 'Organisations seeking certification.',
    meaning: 'We run an AI management system with documented processes, audits and management review.',
    step: 'Scope an AI management system and plan for ISO/IEC 42001 audit.',
  },
  {
    value: 'oecd', label: 'OECD AI Principles', status: 'Values-based principles',
    bestFor: 'International and public-interest organisations.',
    meaning: 'Our principles follow the OECD’s values: human rights, transparency, robustness and accountability.',
    step: 'Map this charter’s principles to the OECD AI Principles.',
  },
];

export const ROLES = {
  leadership: { name: 'Senior leadership', responsibilities: 'Approves this charter and major AI decisions, and makes sure it has the time and budget it needs.' },
  lead: { name: 'AI lead', responsibilities: 'Owns this charter day to day: answers questions, keeps the register of AI uses, and brings issues to leadership.' },
  caio: { name: 'Chief AI officer', responsibilities: 'Sets AI strategy and standards across the organisation and chairs the governance council.' },
  committeeChair: { name: 'AI ethics committee chair', responsibilities: 'Runs the committee, sets its agenda and signs off its decisions.' },
  committee: { name: 'AI ethics committee', responsibilities: 'A cross-functional group (for example legal, IT, HR and operations) that reviews new AI uses and advises on hard cases.' },
  dpo: { name: 'Data protection officer', responsibilities: 'Checks that AI uses involving personal data are lawful and proportionate, and leads on data protection impact assessments.' },
  legal: { name: 'Legal and compliance', responsibilities: 'Tracks AI law and regulation and advises on contracts, liability and compliance.' },
  hr: { name: 'HR representative', responsibilities: 'Looks after the effect of AI on jobs, skills and working conditions, and links with staff representatives.' },
  architect: { name: 'AI solution architect', responsibilities: 'Makes sure AI systems we build or buy are secure, documented and fit for purpose.' },
  deptLeads: { name: 'Department AI leads', responsibilities: 'Apply the charter within each department and report uses and issues to the centre.' },
  council: { name: 'AI governance council', responsibilities: 'Brings departments together to agree common standards and resolve cross-cutting questions.' },
  advisory: { name: 'External advisory board', responsibilities: 'Independent experts who review our approach and publish their observations.' },
  taskforce: { name: 'AI task force', responsibilities: 'A small cross-functional group that runs pilots, gathers lessons and proposes the long-term set-up.' },
  stakeholderRep: { name: 'Stakeholder representative', responsibilities: 'Speaks for the people affected by our AI use and makes sure their concerns are heard.' },
  publicLiaison: { name: 'Public liaison', responsibilities: 'Handles questions from the public and publishes our AI register and reports.' },
};

export const PARTICIPATION_METHODS = [
  { value: 'cafeia', label: 'Café IA workshops' },
  { value: 'surveys', label: 'Surveys and questionnaires' },
  { value: 'focus', label: 'Focus groups' },
  { value: 'consultations', label: 'Public consultations' },
  { value: 'interviews', label: 'Stakeholder interviews' },
  { value: 'openfeedback', label: 'Open feedback periods' },
  { value: 'pilots', label: 'Pilots with feedback' },
  { value: 'workinggroups', label: 'Working groups' },
];

export const COMMITMENT_AREAS = [
  { value: 'laws', label: 'Compliance with laws and regulations' },
  { value: 'impact', label: 'Regular AI impact assessments' },
  { value: 'diverse', label: 'Diverse and inclusive AI teams' },
  { value: 'transparency', label: 'Transparency in AI decision-making' },
  { value: 'dataprotection', label: 'Data protection by design' },
  { value: 'monitoring', label: 'Ongoing monitoring and auditing' },
  { value: 'engagement', label: 'Stakeholder engagement' },
  { value: 'procurement', label: 'Ethical procurement of AI' },
  { value: 'incidents', label: 'Incident reporting and response' },
];

export const APPROACHES = [
  { value: 'phased', label: 'Phased rollout across the organisation' },
  { value: 'pilot', label: 'Pilots with selected teams first' },
  { value: 'training', label: 'Training first' },
  { value: 'topdown', label: 'Top-down mandate' },
  { value: 'bottomup', label: 'Bottom-up adoption with support' },
  { value: 'other', label: 'Other' },
];

export const RESOURCES = [
  { value: 'budget', label: 'Dedicated budget' },
  { value: 'training', label: 'Training for staff' },
  { value: 'docs', label: 'Documentation and guidelines' },
  { value: 'toolkit', label: 'AI ethics toolkit' },
  { value: 'consultancy', label: 'External support' },
  { value: 'infrastructure', label: 'Technology infrastructure' },
  { value: 'supportteam', label: 'Dedicated support team' },
  { value: 'community', label: 'Community of practice' },
];

export const COMMUNICATION = [
  { value: 'workshops', label: 'Internal workshops (Café IA style)' },
  { value: 'allhands', label: 'All-hands meetings' },
  { value: 'newsletter', label: 'Email newsletters' },
  { value: 'intranet', label: 'Intranet or website' },
  { value: 'trainingsessions', label: 'Training sessions' },
  { value: 'publicconsult', label: 'Public consultation' },
  { value: 'social', label: 'Social media' },
  { value: 'print', label: 'Printed materials' },
];

export const FREQUENCIES = [
  { value: 'annual', label: 'Every year' },
  { value: 'biennial', label: 'Every two years' },
  { value: 'triennial', label: 'Every three years' },
  { value: 'continuous', label: 'Continuously, as needed' },
  { value: 'triggered', label: 'Only when something significant changes' },
];

export const TRIGGERS = [
  { value: 'tech', label: 'Significant advances in the technology' },
  { value: 'law', label: 'New laws or regulations' },
  { value: 'orgchange', label: 'Major changes in the organisation' },
  { value: 'incidents', label: 'Ethical incidents or concerns' },
  { value: 'feedback', label: 'Feedback from stakeholders' },
  { value: 'audit', label: 'Audit findings' },
];

export const labelOf = (options, value) => options.find(o => o.value === value)?.label ?? value ?? '';
export const principleOf = value => PRINCIPLES.find(p => p.value === value);

// --- Steps --------------------------------------------------------------
// Field types: text, email, url, date, textarea, select, checkboxes, cards, toggle, list.
// `more: true` puts a field under "More detail". `other` names the free-text path shown for "Other".

export const STEPS = [
  {
    id: 'start', title: 'Start', eyebrow: 'Step 0',
    heading: 'Start with what you already have',
    lead: 'Pull in your organisation’s details from the French company register, or skip ahead and type them in. You can check every value before it is used.',
    fields: [
      { path: 'charterType', type: 'cards', label: 'What should the charter cover?', options: CHARTER_TYPES },
    ],
  },
  {
    id: 'organisation', title: 'Your organisation', eyebrow: 'Step 1',
    heading: 'Your organisation',
    lead: 'The basics. Later steps use these answers to suggest sensible defaults.',
    fields: [
      { path: 'org.name', type: 'text', label: 'Organisation name', required: true, error: 'Enter your organisation’s name', autocomplete: 'organization' },
      { path: 'org.type', type: 'select', label: 'Type of organisation', options: ORG_TYPES, required: true, error: 'Choose the type of organisation', other: 'org.typeOther' },
      { path: 'org.size', type: 'select', label: 'Size', options: ORG_SIZES, required: true, error: 'Choose the size of your organisation' },
      { path: 'org.maturity', type: 'select', label: 'Where are you with AI today?', options: MATURITY, required: true, error: 'Choose where you are with AI today' },
      { path: 'org.contact', type: 'email', label: 'Contact email for questions about the charter', required: true, error: 'Enter a contact email', autocomplete: 'email' },
      { path: 'org.stakeholders', type: 'checkboxes', label: 'Who does the charter affect?', options: STAKEHOLDERS, columns: 2 },
      { path: 'org.scope', type: 'select', label: 'Geographic scope', options: SCOPES, more: true },
      { path: 'org.country', type: 'text', label: 'Country where you are based', more: true },
      { path: 'org.sector', type: 'text', label: 'Sector or main activity', more: true },
      { path: 'org.website', type: 'url', label: 'Website', more: true, placeholder: 'https://' },
      { path: 'org.description', type: 'textarea', label: 'Context and motivation', hint: 'Why are you writing this charter now?', more: true },
      { path: 'org.aiUses', type: 'textarea', label: 'Where you already use AI', hint: 'Tools, pilots or projects in place today.', more: true },
      { path: 'org.existingPolicies', type: 'textarea', label: 'Related policies you already have', hint: 'For example data protection, IT use or ethics policies.', more: true },
      { path: 'meta.title', type: 'text', label: 'Charter title', more: true },
      { path: 'meta.version', type: 'text', label: 'Version', more: true },
      { path: 'meta.date', type: 'date', label: 'Effective date', more: true },
    ],
  },
  {
    id: 'vision', title: 'Vision and principles', eyebrow: 'Step 2',
    heading: 'Vision and principles',
    lead: 'Why you use AI, and the principles you hold yourselves to. The seven standard principles follow Capgemini’s Code of Ethics for AI and the EU guidelines for trustworthy AI.',
    fields: [
      { path: 'vision.statement', type: 'textarea', label: 'Vision statement', hint: 'One or two sentences on what AI is for in your organisation.', required: true, error: 'Enter a vision statement', rows: 3 },
      { path: 'vision.values', type: 'checkboxes', label: 'Values that guide your use of AI', options: VALUES, columns: 3 },
      { path: 'principles.selected', type: 'checkboxes', label: 'Principles to include', options: PRINCIPLES, required: true, error: 'Choose at least one principle', describe: true },
      { path: 'vision.purpose', type: 'textarea', label: 'How AI supports your mission', more: true },
      { path: 'vision.aiDefinition', type: 'textarea', label: 'What you mean by AI', more: true },
      { path: 'vision.customValues', type: 'list', label: 'Other values', more: true, addLabel: 'Add a value', item: { type: 'text', placeholder: 'Value' } },
      { path: 'principles.custom', type: 'list', label: 'Your own principles', more: true, addLabel: 'Add a principle', item: { fields: [
        { key: 'name', type: 'text', label: 'Principle' },
        { key: 'description', type: 'textarea', label: 'What it means', rows: 2 },
      ] } },
      { path: 'principles.notes', type: 'textarea', label: 'Notes on putting the principles into practice', more: true },
      { type: 'challenges', label: 'Ethical challenges and your responses', hint: 'One example per principle is filled in. Edit it, add your own, or remove what does not apply.', more: true },
    ],
  },
  {
    id: 'governance', title: 'People and governance', eyebrow: 'Step 3',
    heading: 'People and governance',
    lead: 'Who was involved, who decides, and which frameworks you align with. The recommendation is based on your type, size and regulation.',
    fields: [
      { path: 'governance.regulation', type: 'select', label: 'How regulated is your use of AI?', options: REGULATION },
      { type: 'recommendation' },
      { path: 'governance.model', type: 'cards', label: 'Governance model', options: MODELS, required: true, error: 'Choose a governance model', other: 'governance.modelOther', describe: 'model' },
      { path: 'governance.frameworks', type: 'cards', multiple: true, label: 'Frameworks to align with', options: FRAMEWORKS, describe: 'framework' },
      { path: 'governance.roles', type: 'list', label: 'Roles and responsibilities', addLabel: 'Add a role', item: { fields: [
        { key: 'name', type: 'text', label: 'Role' },
        { key: 'responsibilities', type: 'textarea', label: 'Responsibilities', rows: 2 },
      ] } },
      { path: 'governance.decisionMaking', type: 'textarea', label: 'Who decides', rows: 3 },
      { path: 'governance.reviewProcess', type: 'textarea', label: 'How new AI uses are reviewed', rows: 4 },
      { path: 'participation.methods', type: 'checkboxes', label: 'How people were or will be involved', options: PARTICIPATION_METHODS, columns: 2, more: true },
      { path: 'participation.description', type: 'textarea', label: 'Describe the involvement', rows: 3, more: true },
      { path: 'participation.socialPartners', type: 'toggle', label: 'Staff representatives (unions, works councils) are involved', more: true },
    ],
  },
  {
    id: 'commitments', title: 'Commitments and rollout', eyebrow: 'Step 4',
    heading: 'Commitments and rollout',
    lead: 'What you promise to do, and how the charter reaches everyone it covers.',
    fields: [
      { path: 'commitments.statement', type: 'textarea', label: 'Commitment statement', rows: 3 },
      { path: 'commitments.areas', type: 'checkboxes', label: 'Commitment areas', options: COMMITMENT_AREAS, columns: 2 },
      { path: 'commitments.items', type: 'list', label: 'Specific commitments', addLabel: 'Add a commitment', item: { fields: [
        { key: 'title', type: 'text', label: 'Commitment' },
        { key: 'description', type: 'textarea', label: 'Detail', rows: 2 },
      ] } },
      { path: 'rollout.approach', type: 'select', label: 'Rollout approach', options: APPROACHES, other: 'rollout.approachOther' },
      { path: 'rollout.phases', type: 'list', label: 'Phases', addLabel: 'Add a phase', more: true, item: { fields: [
        { key: 'name', type: 'text', label: 'Phase' },
        { key: 'duration', type: 'text', label: 'Duration' },
        { key: 'description', type: 'textarea', label: 'What happens', rows: 2 },
        { key: 'criteria', type: 'textarea', label: 'Done when', rows: 2 },
      ] } },
      { path: 'rollout.resources', type: 'checkboxes', label: 'Resources', options: RESOURCES, columns: 2, more: true },
      { path: 'rollout.communication', type: 'checkboxes', label: 'How you will communicate the charter', options: COMMUNICATION, columns: 2, more: true },
    ],
  },
  {
    id: 'upkeep', title: 'Keeping it current', eyebrow: 'Step 5',
    heading: 'Keeping it current',
    lead: 'AI, the law and your organisation will change. Decide now how the charter keeps up.',
    fields: [
      { path: 'upkeep.frequency', type: 'select', label: 'How often is the charter reviewed?', options: FREQUENCIES },
      { path: 'upkeep.triggers', type: 'checkboxes', label: 'What else triggers a review?', options: TRIGGERS, columns: 2 },
      { path: 'upkeep.changeProposal', type: 'textarea', label: 'Who can propose changes', rows: 2, more: true },
      { path: 'upkeep.changeApproval', type: 'textarea', label: 'How changes are approved', rows: 3, more: true },
      { path: 'upkeep.versioning', type: 'textarea', label: 'Versioning', rows: 2, more: true },
      { path: 'upkeep.updateCommunication', type: 'textarea', label: 'How updates are communicated', rows: 2, more: true },
      { path: 'upkeep.coDesign', type: 'toggle', label: 'Use co-design (such as Café IA) for future updates', more: true },
    ],
  },
  {
    id: 'check', title: 'Check and export', eyebrow: 'Step 6',
    heading: 'Check your answers',
    lead: 'Change anything that is not right, then download the charter.',
    fields: [],
  },
];

export const stepById = id => STEPS.find(s => s.id === id);

export function fieldByPath(path) {
  for (const step of STEPS) {
    const f = step.fields.find(f => f.path === path);
    if (f) return { step, field: f };
  }
  return null;
}
