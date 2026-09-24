// Suggestions: later answers worked out from earlier ones.
// A suggestion is written into the state only while the person has not touched that path.

import { state, get, setIn, isTouched } from './state.js';
import { ROLES, PRINCIPLES, STAKEHOLDERS, PARTICIPATION_METHODS, COMMUNICATION, FREQUENCIES, labelOf, MODELS } from './schema.js';

export let suggestions = {};

const has = (arr, ...vals) => vals.some(v => (arr || []).includes(v));
const isBig = size => size === 'large' || size === 'xlarge';
const isSmall = size => size === 'small' || size === 'na';
const advanced = m => m === 'integrating' || m === 'centric';
const early = m => m === 'planning' || m === 'exploring';

export function today() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function listText(items, conj = 'and') {
  const xs = items.filter(Boolean);
  if (xs.length <= 1) return xs.join('');
  return `${xs.slice(0, -1).join(', ')} ${conj} ${xs.at(-1)}`;
}

const lower = s => s ? s.charAt(0).toLowerCase() + s.slice(1) : s;

const EU = ['france', 'germany', 'italy', 'spain', 'portugal', 'belgium', 'netherlands', 'luxembourg', 'ireland', 'austria',
  'denmark', 'sweden', 'finland', 'poland', 'czechia', 'czech republic', 'slovakia', 'slovenia', 'croatia', 'hungary', 'romania',
  'bulgaria', 'greece', 'cyprus', 'malta', 'estonia', 'latvia', 'lithuania', 'eu', 'european union'];
const inEU = country => EU.includes((country || '').trim().toLowerCase());

// Who sits at the top, in words that fit the organisation.
export function leadershipName(type) {
  return {
    private: 'Board and executive team', public: 'Senior management', education: 'Head and senior leadership team',
    nonprofit: 'Board of trustees', research: 'Institute leadership', healthcare: 'Executive board', community: 'Steering group',
  }[type] || 'Senior leadership';
}

// --- Governance recommendation (one rule set, used everywhere) ---------------

export function recommendModel(org = state.org, regulation = state.governance.regulation) {
  const { type, size, maturity } = org;
  if (!type && !size) return null;
  if (isSmall(size)) return { model: 'officer', reason: 'With a small team, one named person keeps things simple and accountable. A committee would be overhead.' };
  if (regulation === 'public' || type === 'public') return { model: 'advisory', reason: 'Public bodies answer to the people they serve. An external advisory board adds independent scrutiny and credibility.' };
  if (regulation === 'high') return { model: 'committee', reason: 'In a regulated sector, one committee with clear authority keeps compliance consistent.' };
  if (['education', 'nonprofit', 'community', 'research', 'healthcare'].includes(type)) return { model: 'committee', reason: 'A single cross-functional committee gives consistent oversight without much structure.' };
  if (isBig(size)) return { model: 'hybrid', reason: 'At your size, central standards with delivery inside each department scales better than one committee.' };
  if (early(maturity)) return { model: 'taskforce', reason: 'While you are still piloting, a small task force learns quickly and can propose the long-term set-up.' };
  return { model: 'hybrid', reason: 'A central team sets the standards and departments apply them. It balances consistency with speed.' };
}

const MODEL_ROLES = {
  officer: ['leadership', 'lead', 'dpo'],
  committee: ['leadership', 'committeeChair', 'committee', 'dpo', 'legal'],
  advisory: ['leadership', 'committeeChair', 'committee', 'advisory', 'dpo', 'publicLiaison'],
  hybrid: ['leadership', 'caio', 'council', 'deptLeads', 'dpo'],
  distributed: ['leadership', 'council', 'deptLeads', 'dpo'],
  taskforce: ['leadership', 'taskforce', 'lead', 'dpo'],
  other: ['leadership', 'lead', 'dpo'],
};

export function bodyName(model) {
  return {
    officer: 'the AI lead', committee: 'the AI ethics committee', advisory: 'the AI ethics committee',
    hybrid: 'the AI governance council', distributed: 'the AI governance council', taskforce: 'the AI task force',
  }[model] || 'the AI lead';
}

export function suggestRoles(s = state) {
  const model = s.governance.model || recommendModel(s.org)?.model;
  if (!model) return [];
  const ids = [...(MODEL_ROLES[model] || MODEL_ROLES.other)];
  if (has(s.org.stakeholders, 'staff') && !isSmall(s.org.size)) ids.push('hr');
  if (s.org.type === 'education' || has(s.org.stakeholders, 'public', 'patients')) ids.push('stakeholderRep');
  if (s.charterType === 'development' || s.org.maturity === 'centric') ids.push('architect');
  return [...new Set(ids)].map(id => ({
    name: id === 'leadership' ? leadershipName(s.org.type) : ROLES[id].name,
    responsibilities: ROLES[id].responsibilities,
  }));
}

export function suggestFrameworks(s = state) {
  const { type, size, maturity, scope, country } = s.org;
  const reg = s.governance.regulation;
  if (!type && !size) return [];
  const out = [];
  if (inEU(country) || ['public', 'healthcare'].includes(type) || ['high', 'public'].includes(reg) || ['international', 'global'].includes(scope)) out.push('eu-ai-act');
  if (['private', 'education', 'nonprofit', 'research', 'healthcare'].includes(type) || !out.length) out.push('nist-ai-rmf');
  if (!isSmall(size) && (isBig(size) || advanced(maturity))) out.push('iso-42001');
  if (['international', 'global'].includes(scope) || ['public', 'research'].includes(type)) out.push('oecd');
  return out;
}

// --- All suggestions --------------------------------------------------------

function compute(s) {
  const out = {};
  const { org } = s;
  const name = org.name?.trim();

  // Step 1
  out['meta.title'] = name ? `${name} AI charter` : 'AI charter';
  out['meta.version'] = '1.0';
  out['meta.date'] = today();
  out['org.stakeholders'] = {
    private: ['staff', 'clients'], public: ['staff', 'public', 'regulators'], education: ['staff', 'students', 'teachers', 'parents'],
    nonprofit: ['staff', 'partners', 'public'], research: ['researchers', 'staff', 'partners'], healthcare: ['staff', 'patients', 'regulators'],
    community: ['public', 'partners'],
  }[org.type] || [];
  if (org.type === 'public' || org.type === 'healthcare') out['governance.regulation'] = org.type === 'public' ? 'public' : 'high';
  else if (org.type) out['governance.regulation'] = 'moderate';

  // Step 2
  out['vision.statement'] = {
    private: 'We use AI to do better work for our clients and colleagues, with a person accountable for every outcome.',
    public: 'We use AI to serve the public better: openly, fairly, and with a person accountable for every decision.',
    education: 'We use AI to support teaching, learning and school life, never to replace the judgement and relationships at the heart of education.',
    nonprofit: 'We use AI where it helps us further our mission, and never in ways that put the people we serve at risk.',
    research: 'We use AI to advance research with rigour and openness, and with respect for the people and data involved.',
    healthcare: 'We use AI to support care, never to replace clinical judgement, with patient safety and privacy first.',
    community: 'We use AI together, on our terms, where it helps the community and in ways everyone can understand.',
  }[org.type] || '';
  out['vision.aiDefinition'] = 'By AI we mean systems that learn from data to generate content, make predictions or recommend decisions, including generative AI tools such as chatbots and assistants.';
  out['principles.selected'] = PRINCIPLES.map(p => p.value);
  const selected = s.principles.selected || [];
  for (const p of PRINCIPLES) {
    if (selected.includes(p.value)) out[`challenges.${p.value}`] = [{ challenge: p.example.challenge, response: p.example.response, example: '' }];
  }

  // Step 3
  const rec = recommendModel(org, s.governance.regulation);
  if (rec) out['governance.model'] = rec.model;
  out['governance.frameworks'] = suggestFrameworks(s);
  const roles = suggestRoles(s);
  if (roles.length) out['governance.roles'] = roles;

  const model = s.governance.model || rec?.model;
  const body = bodyName(model);
  const leaders = lower(leadershipName(org.type));
  if (model) {
    out['governance.decisionMaking'] = {
      officer: `The AI lead approves everyday AI uses and keeps the register. Anything involving personal data, decisions about people or significant spend goes to the ${leaders} for a final decision.`,
      committee: `The AI ethics committee approves new AI uses and sets policy. The chair handles day-to-day questions. The ${leaders} has the final say on high-risk uses and budget.`,
      advisory: `The AI ethics committee approves new AI uses and sets policy. The external advisory board reviews high-risk uses and publishes its observations. The ${leaders} takes the final decision.`,
      hybrid: `The AI governance council sets common standards. Department AI leads approve routine uses within those standards. High-risk uses go to the council, and the ${leaders} has the final say.`,
      distributed: `Each department approves its own AI uses within the common standards agreed by the AI governance council. The ${leaders} settles anything the council cannot.`,
      taskforce: `During the pilot phase the AI task force approves AI uses and reports monthly to the ${leaders}, which takes the final decision on anything beyond a pilot.`,
    }[model] || '';
    out['governance.reviewProcess'] = `Anyone proposing a new AI use fills in a short form: its purpose, the data involved, who is affected and who is accountable. ${body.charAt(0).toUpperCase() + body.slice(1)} reviews it against this charter within two weeks. Uses involving personal data, decisions about people or public-facing tools get a fuller impact assessment first.`;
  }

  const sh = org.stakeholders || [];
  const methods = ['cafeia'];
  if (has(sh, 'staff')) methods.push('focus', 'workinggroups');
  if (has(sh, 'students', 'teachers', 'parents', 'clients', 'partners')) methods.push('surveys');
  if (has(sh, 'public', 'patients')) methods.push('consultations', 'openfeedback');
  if (has(sh, 'regulators')) methods.push('interviews');
  out['participation.methods'] = [...new Set(methods)];
  out['participation.socialPartners'] = has(sh, 'staff') && !isSmall(org.size);
  const chosenMethods = s.participation.methods?.length ? s.participation.methods : out['participation.methods'];
  if (sh.length) {
    const who = listText(sh.map(v => lower(labelOf(STAKEHOLDERS, v))));
    const how = listText(chosenMethods.map(v => lower(labelOf(PARTICIPATION_METHODS, v)).replace('café IA', 'Café IA')));
    out['participation.description'] = `We are drafting this charter with ${who}, through ${how}. Everyone it affects gets the chance to comment before it is adopted.`;
  }

  // Step 4
  out['commitments.statement'] = `${name || 'We'} ${name ? 'commits' : 'commit'} to using AI in ways that are purposeful, fair and transparent, that respect people’s rights and privacy, and that we can explain to the people they affect.`;
  const fw = s.governance.frameworks || [];
  const areas = ['laws', 'engagement'];
  if (selected.includes('privacy')) areas.push('dataprotection');
  if (selected.includes('fair')) areas.push('diverse');
  if (selected.includes('transparent')) areas.push('transparency');
  if (has(fw, 'eu-ai-act', 'iso-42001') || advanced(org.maturity)) areas.push('impact');
  if (has(fw, 'iso-42001') || advanced(org.maturity)) areas.push('monitoring');
  if ((selected.includes('robust') && !early(org.maturity)) || has(fw, 'nist-ai-rmf')) areas.push('incidents');
  if (selected.includes('sustainable') || early(org.maturity) || org.maturity === 'adopting') areas.push('procurement');
  out['commitments.areas'] = areas;

  const chosenAreas = s.commitments.areas?.length ? s.commitments.areas : areas;
  const items = [
    { title: 'Keep a register of AI uses', description: 'We list every AI tool in use, what it is for and who owns it, and review the list every quarter.' },
    { title: 'Train everyone who uses AI', description: 'Everyone who uses AI in their work completes a short training session within three months of this charter’s launch.' },
  ];
  if (chosenAreas.includes('dataprotection')) items.push({ title: 'No personal data in unapproved tools', description: 'Personal or confidential data only goes into AI tools on the approved list.' });
  if (chosenAreas.includes('transparency')) items.push({ title: 'Say when AI was used', description: 'We disclose when content or decisions have been substantially shaped by AI.' });
  if (chosenAreas.includes('incidents')) items.push({ title: 'Report AI incidents quickly', description: `Anyone can report an AI incident or concern to ${body}. Serious incidents are reported within 48 hours.` });
  out['commitments.items'] = items.slice(0, 5);

  out['rollout.approach'] = org.type === 'education' || org.maturity === 'planning' ? 'training'
    : org.maturity === 'exploring' ? 'pilot' : org.maturity ? 'phased' : '';
  out['rollout.phases'] = early(org.maturity) || !org.maturity ? [
    { name: 'Awareness', duration: '1 month', description: 'Share the charter, run a Café IA session and publish the list of approved tools.', criteria: 'Most people covered by the charter have attended a session.' },
    { name: 'Pilot', duration: '2 to 3 months', description: 'Try approved tools in two or three teams under the charter and gather feedback.', criteria: 'Pilot teams have reported back and there are no open incidents.' },
    { name: 'Roll out', duration: '3 months', description: 'Extend use across the organisation, with training and the review process in place.', criteria: 'Every new AI use goes through the review process.' },
    { name: 'First review', duration: 'At 12 months', description: 'Review the charter with the people it affects and publish version 2.', criteria: 'Updated charter adopted.' },
  ] : [
    { name: 'Inventory', duration: '1 month', description: 'List every AI tool and use in place today, with an owner for each.', criteria: 'The register is complete and every use has an owner.' },
    { name: 'Align', duration: '2 months', description: 'Bring existing uses in line with the charter; adapt or retire what does not fit.', criteria: 'No use in the register conflicts with the charter.' },
    { name: 'Embed', duration: '3 to 6 months', description: 'Build the review process into buying and project approval, and train everyone who uses AI.', criteria: 'New uses are reviewed before launch; training completion is above 90 percent.' },
    { name: 'First review', duration: 'At 12 months', description: 'Review the charter with the people it affects and publish version 2.', criteria: 'Updated charter adopted.' },
  ];
  const resources = ['training', 'docs'];
  if (!isSmall(org.size)) resources.push('community');
  if (isBig(org.size)) resources.push('budget', 'supportteam');
  if (advanced(org.maturity)) resources.push('toolkit', 'infrastructure');
  out['rollout.resources'] = resources;
  const comm = [];
  if (has(sh, 'staff')) comm.push('intranet', 'trainingsessions', ...(isSmall(org.size) ? [] : ['allhands']));
  if (has(sh, 'public', 'patients')) comm.push('intranet', 'publicconsult', 'social');
  if (has(sh, 'students', 'teachers', 'parents')) comm.push('workshops', 'print');
  if (chosenMethods.includes('cafeia')) comm.push('workshops');
  out['rollout.communication'] = [...new Set(comm)];

  // Step 5
  out['upkeep.frequency'] = org.maturity === 'centric' ? 'continuous' : 'annual';
  const triggers = ['tech', 'law', 'incidents', 'feedback'];
  if (fw.includes('iso-42001')) triggers.push('audit');
  if (isBig(org.size)) triggers.push('orgchange');
  out['upkeep.triggers'] = triggers;
  const contact = org.contact?.trim();
  const routes = [contact && `writing to ${contact}`, chosenMethods.includes('cafeia') && 'raising it at a Café IA session'].filter(Boolean);
  out['upkeep.changeProposal'] = `Anyone covered by this charter can propose a change${routes.length ? ` by ${listText(routes, 'or')}` : ''}. Every proposal is logged and answered.`;
  const freq = lower(labelOf(FREQUENCIES, s.upkeep.frequency || out['upkeep.frequency']));
  out['upkeep.changeApproval'] = `${body.charAt(0).toUpperCase() + body.slice(1)} reviews proposals ${freq.startsWith('only') ? 'when they arrive' : freq.replace('continuously, as needed', 'as they arrive')}. Wording changes can be approved by ${body}. Changes to principles or commitments need sign-off from the ${leaders}, after consulting the people affected.`;
  out['upkeep.versioning'] = 'Changes to principles or commitments raise the major version (2.0). Smaller changes raise the minor version (1.1). Every version is dated and kept.';
  const chosenComm = s.rollout.communication?.length ? s.rollout.communication : out['rollout.communication'];
  out['upkeep.updateCommunication'] = `Each new version is published with a short summary of what changed${chosenComm.length ? `, and announced through ${listText(chosenComm.map(v => lower(labelOf(COMMUNICATION, v))))}` : ''}.`;
  out['upkeep.coDesign'] = chosenMethods.includes('cafeia');

  return out;
}

// Apply suggestions in two passes, so ones that depend on other suggestions settle.
export function applySuggestions() {
  let changed = false;
  for (let pass = 0; pass < 2; pass++) {
    suggestions = compute(state);
    for (const [path, value] of Object.entries(suggestions)) {
      if (isTouched(path)) continue;
      if (JSON.stringify(get(path)) !== JSON.stringify(value)) {
        setIn(state, path, structuredClone(value));
        changed = true;
      }
    }
  }
  // Drop suggested challenges for principles that are no longer selected.
  for (const key of Object.keys(state.challenges)) {
    if (PRINCIPLES.some(p => p.value === key) && !state.principles.selected.includes(key) && !isTouched(`challenges.${key}`)) {
      delete state.challenges[key];
      changed = true;
    }
  }
  return changed;
}

export const hasSuggestion = path => path in suggestions;
export const isSuggested = path =>
  hasSuggestion(path) && !isTouched(path) && JSON.stringify(get(path)) === JSON.stringify(suggestions[path]) &&
  !(get(path) === '' || get(path) === false || (Array.isArray(get(path)) && !get(path).length));

export const modelLabel = v => labelOf(MODELS, v);
