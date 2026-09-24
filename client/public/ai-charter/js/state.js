// One state object, saved to localStorage on every change.
// `touched` records paths the person has edited, so suggestions never overwrite them.
// `provenance` records paths filled from the register, a website or a document.

export const STORAGE_KEY = 'praxis_charter_v2';
const LEGACY_KEY = 'ai_charter_wizard_data';
const LEGACY_GOV_KEY = 'ai_charter_governance_design';

export function emptyState() {
  return {
    version: 2,
    charterType: 'strategy',
    org: {
      name: '', type: '', typeOther: '', size: '', maturity: '', contact: '', stakeholders: [],
      scope: '', country: '', sector: '', website: '', description: '', aiUses: '', existingPolicies: '', siren: '',
    },
    meta: { title: '', version: '', date: '' },
    vision: { statement: '', purpose: '', aiDefinition: '', values: [], customValues: [] },
    principles: { selected: [], custom: [], notes: '' },
    challenges: {},
    participation: { methods: [], description: '', socialPartners: false },
    governance: { regulation: '', model: '', modelOther: '', frameworks: [], roles: [], decisionMaking: '', reviewProcess: '' },
    commitments: { statement: '', areas: [], items: [] },
    rollout: { approach: '', approachOther: '', phases: [], resources: [], communication: [] },
    upkeep: { frequency: '', triggers: [], changeProposal: '', changeApproval: '', versioning: '', updateCommunication: '', coDesign: false },
    touched: {},
    provenance: {},
    visited: {},
  };
}

export let state = emptyState();
const listeners = new Set();

export const onChange = fn => listeners.add(fn);

function notify(meta) {
  listeners.forEach(fn => fn(meta));
}

// --- Path helpers --------------------------------------------------------

export function get(path, obj = state) {
  if (!path) return undefined;
  return path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
}

export function setIn(obj, path, value) {
  const keys = path.split('.');
  let o = obj;
  keys.slice(0, -1).forEach((k, i) => {
    if (o[k] == null || typeof o[k] !== 'object') o[k] = /^\d+$/.test(keys[i + 1]) ? [] : {};
    o = o[k];
  });
  o[keys.at(-1)] = value;
}

function prefixes(path) {
  const parts = path.split('.');
  return parts.map((_, i) => parts.slice(0, i + 1).join('.'));
}

export const isTouched = path => !!state.touched[path];

// A person's edit. Marks the path and its parents as touched and drops any provenance tag.
export function edit(path, value) {
  setIn(state, path, value);
  prefixes(path).forEach(p => {
    state.touched[p] = true;
    delete state.provenance[p];
  });
  save();
  notify({ path, source: 'edit' });
}

// A value accepted from autofill. Protected from suggestions, tagged with where it came from.
export function fill(path, value, source) {
  setIn(state, path, value);
  state.touched[path] = true;
  state.provenance[path] = source;
}

export function resetToSuggestion(path) {
  Object.keys(state.touched).forEach(p => {
    if (p === path || p.startsWith(path + '.')) delete state.touched[p];
  });
  delete state.provenance[path];
  save();
  notify({ path, source: 'reset' });
}

export function markVisited(stepId) {
  if (state.visited[stepId]) return;
  state.visited[stepId] = true;
  save();
}

export function commit(meta = { source: 'internal' }) {
  save();
  notify(meta);
}

// --- Persistence ----------------------------------------------------------

let saveTimer = null;
export function save() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(saveNow, 250);
}

export function saveNow() {
  clearTimeout(saveTimer);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Could not save to localStorage', e);
  }
}

// Fill any keys missing from older or partial saves, so the rest of the app can trust the shape.
function normalise(data) {
  const base = emptyState();
  const out = { ...base, ...data };
  for (const [k, v] of Object.entries(base)) {
    if (v && typeof v === 'object' && !Array.isArray(v)) out[k] = { ...v, ...(data?.[k] || {}) };
  }
  out.version = 2;
  return out;
}

export function load() {
  let raw = null;
  try { raw = localStorage.getItem(STORAGE_KEY); } catch { /* storage blocked */ }
  if (raw) {
    try { state = normalise(JSON.parse(raw)); return 'saved'; } catch { /* fall through */ }
  }
  const migrated = migrateLegacy();
  if (migrated) { state = migrated; saveNow(); return 'migrated'; }
  state = emptyState();
  return 'new';
}

export function replace(data) {
  state = normalise(data);
  saveNow();
  notify({ source: 'replace' });
}

export function clearAll() {
  state = emptyState();
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(LEGACY_KEY);
    localStorage.removeItem(LEGACY_GOV_KEY);
  } catch { /* ignore */ }
  notify({ source: 'replace' });
}

// Another tab saved: pick up its state.
window.addEventListener('storage', e => {
  if (e.key !== STORAGE_KEY || !e.newValue) return;
  try { state = normalise(JSON.parse(e.newValue)); notify({ source: 'sync' }); } catch { /* ignore */ }
});

// --- Legacy migration (old wizard + governance builder) ---------------------

const LEGACY_MAP = {
  type: {
    'Private Company / Enterprise': 'private', 'Public Administration / Government': 'public',
    'Educational Institution': 'education', 'Educational Institution (School/University)': 'education',
    'Non-profit / NGO': 'nonprofit', 'Research Institution': 'research', 'Healthcare Organization': 'healthcare',
    'Local Community / Collective': 'community',
  },
  size: {
    'Small (1-50 people)': 'small', 'Medium (50-500 people)': 'medium', 'Large (500-5000 people)': 'large',
    'Very Large (5000+ people)': 'xlarge', 'Not applicable': 'na',
  },
  maturity: {
    'Exploring AI - Early experiments and pilots': 'exploring', 'Adopting AI - Some tools in production use': 'adopting',
    'Integrating AI - Multiple AI systems in use': 'integrating', 'AI-Centric - AI is core to our operations': 'centric',
    'Not currently using AI but planning to': 'planning',
  },
  scope: {
    'Local (single location)': 'local', 'Regional (multiple locations in one region)': 'regional',
    'National (country-wide)': 'national', 'International (multiple countries)': 'international', 'Global': 'global',
  },
  stakeholders: {
    'Employees/Staff': 'staff', 'Students': 'students', 'Teachers/Educators': 'teachers', 'Clients/Customers': 'clients',
    'Public/Citizens': 'public', 'Partners/Supporters': 'partners', 'Researchers': 'researchers',
    'Developers/Engineers': 'developers', 'Regulators': 'regulators', 'Other external parties': 'other', 'Parents/Guardians': 'parents',
  },
  principles: {
    'AI with carefully delimited impact': 'impact', 'Sustainable AI': 'sustainable', 'Fair AI': 'fair',
    'Transparent and explainable AI': 'transparent', 'Controllable AI with clear accountability': 'controllable',
    'Robust and safe AI': 'robust', 'AI respectful of privacy and data protection': 'privacy',
  },
  model: {
    'Centralized AI Ethics Committee': 'committee', 'Distributed - Each department has AI oversight': 'distributed',
    'Dedicated AI Ethics Officer': 'officer', 'Cross-functional AI Task Force': 'taskforce',
    'External AI Advisory Board': 'advisory', 'Hybrid model': 'hybrid',
    'Centralized': 'committee', 'Hybrid': 'hybrid', 'Centralized with External Advisory': 'advisory',
  },
  methods: {
    'Café IA workshops': 'cafeia', 'Surveys and questionnaires': 'surveys', 'Focus groups': 'focus',
    'Public consultations': 'consultations', 'Stakeholder interviews': 'interviews', 'Open feedback periods': 'openfeedback',
    'Pilot programs with feedback': 'pilots', 'Dedicated working groups': 'workinggroups',
  },
  areas: {
    'Compliance with laws and regulations': 'laws', 'Regular AI impact assessments': 'impact',
    'Diverse and inclusive AI teams': 'diverse', 'Transparency in AI decision-making': 'transparency',
    'Data protection by design': 'dataprotection', 'Ongoing monitoring and auditing': 'monitoring',
    'Stakeholder engagement': 'engagement', 'Ethical procurement of AI technologies': 'procurement',
    'Incident reporting and response': 'incidents',
  },
  approach: {
    'Phased rollout across organization': 'phased', 'Pilot programs with selected teams first': 'pilot',
    'Training-first approach': 'training', 'Top-down mandate': 'topdown', 'Bottom-up adoption with support': 'bottomup',
  },
  resources: {
    'Dedicated AI ethics budget': 'budget', 'Training programs for staff': 'training', 'Documentation and guidelines': 'docs',
    'AI ethics toolkit': 'toolkit', 'External consultancy': 'consultancy', 'Technology infrastructure': 'infrastructure',
    'Dedicated support team': 'supportteam', 'Community of practice': 'community',
  },
  communication: {
    'Internal workshops (Café IA style)': 'workshops', 'All-hands meetings': 'allhands', 'Email newsletters': 'newsletter',
    'Intranet/website publication': 'intranet', 'Training sessions': 'trainingsessions', 'Public consultation': 'publicconsult',
    'Social media': 'social', 'Printed materials': 'print',
  },
  frequency: {
    'Annual review': 'annual', 'Biennial review (every 2 years)': 'biennial', 'Triennial review (every 3 years)': 'triennial',
    'Continuous review (as needed)': 'continuous', 'Review triggered by significant changes': 'triggered',
  },
  triggers: {
    'Significant technological advancements': 'tech', 'New laws or regulations': 'law', 'Major organizational changes': 'orgchange',
    'Ethical incidents or concerns': 'incidents', 'Stakeholder feedback': 'feedback', 'Annual audit findings': 'audit',
  },
  values: Object.fromEntries(['Honesty', 'Trust', 'Boldness', 'Freedom', 'Modesty', 'Inclusivity', 'Sustainability', 'Innovation', 'Transparency', 'Responsibility'].map(v => [v, v.toLowerCase()])),
};

function mapOne(table, value) {
  return value ? (LEGACY_MAP[table][value] ?? null) : null;
}
function mapMany(table, values) {
  return (values || []).map(v => LEGACY_MAP[table][v]).filter(Boolean);
}

export function migrateLegacy() {
  let old = null, gov = null;
  try { old = JSON.parse(localStorage.getItem(LEGACY_KEY) || 'null'); } catch { /* ignore */ }
  try { gov = JSON.parse(localStorage.getItem(LEGACY_GOV_KEY) || 'null'); } catch { /* ignore */ }
  if (!old && !gov) return null;

  const s = emptyState();
  const t = {};
  const put = (path, value) => {
    if (value == null || value === '' || (Array.isArray(value) && !value.length)) return;
    setIn(s, path, value);
    t[path] = true;
  };
  const withOther = (path, otherPath, table, value) => {
    if (!value) return;
    const id = mapOne(table, value);
    if (id) put(path, id);
    else { put(path, 'other'); put(otherPath, value); }
  };

  if (old) {
    const m = old.metadata || {}, c = old.context || {}, v = old.vision || {}, p = old.participation || {};
    const g = old.governance || {}, cm = old.commitments || {}, im = old.implementation || {}, ev = old.evolution || {};
    put('org.name', m.organization); put('org.contact', m.contact); put('org.website', m.website);
    put('meta.title', m.title); put('meta.version', m.version); put('meta.date', m.date);
    withOther('org.type', 'org.typeOther', 'type', c.type);
    put('org.size', mapOne('size', c.size)); put('org.maturity', mapOne('maturity', c.aiMaturity));
    put('org.scope', mapOne('scope', c.scope)); put('org.stakeholders', mapMany('stakeholders', c.stakeholders));
    put('org.description', c.description);
    put('vision.statement', v.statement); put('vision.purpose', v.purpose); put('vision.aiDefinition', v.aiDefinition);
    put('vision.values', mapMany('values', v.values)); put('vision.customValues', (v.customValues || []).filter(Boolean));

    const principles = old.principles || [];
    put('principles.selected', principles.map(x => LEGACY_MAP.principles[x.name]).filter(Boolean));
    put('principles.custom', principles.filter(x => !LEGACY_MAP.principles[x.name]).map(x => ({ name: x.name, description: x.description || '' })));
    put('principles.notes', principles.map(x => x.implementation_notes).filter(Boolean).join('\n\n'));

    for (const [name, list] of Object.entries(old.challenges || {})) {
      const key = LEGACY_MAP.principles[name] || name;
      put(`challenges.${key}`, (list || []).map(x => ({ challenge: x.description || '', response: x.response || '', example: x.case_study || '' })));
    }

    put('participation.methods', mapMany('methods', p.methods)); put('participation.description', p.description);
    if (p.socialPartners) put('participation.socialPartners', true);

    withOther('governance.model', 'governance.modelOther', 'model', g.model);
    put('governance.decisionMaking', g.decisionMaking); put('governance.reviewProcess', g.reviewProcess);
    put('governance.roles', (g.roles || []).map(r => ({ name: r.name || '', responsibilities: r.responsibilities || '' })));
    put('governance.frameworks', g.selectedFrameworks);

    put('commitments.statement', cm.statement); put('commitments.areas', mapMany('areas', cm.areas));
    put('commitments.items', (cm.items || []).map(x => ({ title: x.title || '', description: x.description || '' })));

    withOther('rollout.approach', 'rollout.approachOther', 'approach', im.approach);
    put('rollout.phases', (im.phases || []).map(x => ({ name: x.name || '', duration: x.duration || '', description: x.description || '', criteria: x.success_criteria || '' })));
    put('rollout.resources', mapMany('resources', im.resources)); put('rollout.communication', mapMany('communication', im.communication));

    put('upkeep.frequency', mapOne('frequency', ev.reviewFrequency)); put('upkeep.triggers', mapMany('triggers', ev.reviewTriggers));
    put('upkeep.changeProposal', ev.changeProposal); put('upkeep.changeApproval', ev.changeApproval);
    put('upkeep.versioning', ev.versioning); put('upkeep.updateCommunication', ev.updateCommunication);
    if (ev.coDesign) put('upkeep.coDesign', true);
  }

  if (gov) {
    if (!t['governance.frameworks']) put('governance.frameworks', gov.frameworks);
    if (!t['governance.model']) put('governance.model', mapOne('model', gov.structure));
    const reg = { Low: 'light', Medium: 'moderate', High: 'high', Public: 'public' }[gov.profile?.regulation];
    put('governance.regulation', reg);
  }

  // Everything carried over counts as the person's own answer, including parents of nested paths.
  Object.keys(t).forEach(p => prefixes(p).forEach(x => { s.touched[x] = true; }));
  Object.keys(t).length && ['start', 'organisation', 'vision', 'governance', 'commitments', 'upkeep'].forEach(id => { s.visited[id] = true; });
  return s;
}

// --- Import / export -----------------------------------------------------------

export function exportJSON() {
  return JSON.stringify({ ...state, exportedAt: new Date().toISOString() }, null, 2);
}

export function importJSON(text) {
  const data = JSON.parse(text);
  if (data?.version === 2) { replace(data); return; }
  // An old wizard export: run it through the legacy migration.
  if (data?.metadata || data?.context) {
    let migrated;
    try {
      const backup = localStorage.getItem(LEGACY_KEY);
      localStorage.setItem(LEGACY_KEY, JSON.stringify(data));
      migrated = migrateLegacy();
      if (backup) localStorage.setItem(LEGACY_KEY, backup); else localStorage.removeItem(LEGACY_KEY);
    } catch {
      throw new Error('Old save files need browser storage, which is blocked here.');
    }
    replace(migrated);
    return;
  }
  throw new Error('This file is not a charter save file.');
}
