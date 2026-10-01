// Builds the charter once as a list of blocks, then renders it to Markdown or to HTML.
// User text is escaped for HTML; nothing is parsed back out of Markdown.
// buildCharter() picks the organisation charter or the personal sheet from the mode.

import { state } from './state.js';
import {
  ORG_TYPES, ORG_SIZES, MATURITY, SCOPES, STAKEHOLDERS, VALUES, PRINCIPLES, MODELS, FRAMEWORKS,
  PARTICIPATION_METHODS, COMMITMENT_AREAS, APPROACHES, RESOURCES, COMMUNICATION, FREQUENCIES, TRIGGERS, CHARTER_TYPES, labelOf,
  ME_PRINCIPLES, ME_NEVER, ME_NOGO, ME_CHECKS, ME_FREQUENCIES, ME_TRIGGERS, CHECK_QUESTIONS,
} from './schema.js';
import { recommendModel, today } from './derive.js';
import { esc, customKey } from './render.js';

const clean = s => (s ?? '').toString().trim();
const labels = (opts, vals) => (vals || []).map(v => labelOf(opts, v)).filter(Boolean);
const withOther = (opts, v, other) => (v === 'other' ? clean(other) || 'Other' : labelOf(opts, v));

const COVERS = {
  strategy: 'why and how we use artificial intelligence across the organisation',
  individual: 'how our people use artificial intelligence in their day-to-day work',
  services: 'how artificial intelligence shapes the services we offer',
  development: 'how we design and build artificial intelligence systems',
  governance: 'how we govern and oversee artificial intelligence',
};

const fmtDate = d => {
  const t = new Date(`${d}T00:00:00`);
  return isNaN(t) ? d : t.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
};

export const buildCharter = (s = state) => (s.mode === 'me' ? buildPersonal(s) : buildOrganisation(s));

function buildOrganisation(s) {
  const org = s.org;
  const name = clean(org.name) || 'Our organisation';
  const sections = [];
  const section = (title, blocks) => {
    const b = blocks.filter(Boolean).filter(x => !(x.items && !x.items.length) && !(x.text === ''));
    if (b.length) sections.push({ title, blocks: b });
  };
  const p = text => (clean(text) ? { type: 'p', text: clean(text) } : null);
  const h = text => ({ type: 'h3', text });
  const ul = items => ({ type: 'ul', items: items.map(clean).filter(Boolean) });
  const defs = pairs => ({ type: 'defs', items: pairs.filter(([, v]) => clean(v)).map(([k, v]) => [k, clean(v)]) });
  const sub = (title, ...blocks) => {
    const b = blocks.filter(x => x && !(x.items && !x.items.length));
    return b.length ? [h(title), ...b] : [];
  };

  // Preface
  section('About this charter', [
    p(`This charter sets out ${COVERS[s.charterType] || COVERS.strategy}: what we use it for, the principles we hold ourselves to, who is accountable, and how we will keep the charter current.`),
    p(s.participation.methods?.includes('cafeia')
      ? 'We wrote it with the people it affects, following the Café IA co-design approach.'
      : 'We wrote it with the people it affects.'),
    p('It is a living document. AI, the law and our own understanding will change, and so will this text.'),
  ]);

  section('Context', [
    defs([
      ['Organisation', withOther(ORG_TYPES, org.type, org.typeOther)],
      ['Size', labelOf(ORG_SIZES, org.size)],
      ['Sector', org.sector],
      ['Where we are with AI', labelOf(MATURITY, org.maturity)],
      ['Geographic scope', labelOf(SCOPES, org.scope)],
      ['Based in', org.country],
    ]),
    ...sub('Who this charter affects', ul(labels(STAKEHOLDERS, org.stakeholders))),
    ...(clean(org.description) ? sub('Why we wrote it', p(org.description)) : []),
    ...(clean(org.aiUses) ? sub('Where we use AI today', p(org.aiUses)) : []),
    ...(clean(org.existingPolicies) ? sub('Related policies', p(org.existingPolicies)) : []),
  ]);

  section('Vision and purpose', [
    p(s.vision.statement),
    ...(clean(s.vision.purpose) ? sub('How AI supports our mission', p(s.vision.purpose)) : []),
    ...(clean(s.vision.aiDefinition) ? sub('What we mean by AI', p(s.vision.aiDefinition)) : []),
    ...sub('Our values', ul([...labels(VALUES, s.vision.values), ...(s.vision.customValues || [])])),
  ]);

  const principles = [
    ...PRINCIPLES.filter(x => s.principles.selected.includes(x.value)).map(x => ({ key: x.value, name: x.label, description: x.description })),
    ...(s.principles.custom || []).filter(c => clean(c.name)).map(c => ({ key: customKey(c.name), name: clean(c.name), description: clean(c.description) })),
  ];
  section('Principles', [
    principles.length ? p('Our use of AI is guided by these principles.') : null,
    { type: 'numbered', items: principles.map(x => [x.name, x.description]) },
    ...(clean(s.principles.notes) ? sub('Putting them into practice', p(s.principles.notes)) : []),
  ]);

  const challengeBlocks = principles.flatMap(x => {
    const list = (s.challenges[x.key] || []).filter(c => clean(c.challenge) || clean(c.response));
    if (!list.length) return [];
    return [h(x.name), ...list.map(c => defs([['Challenge', c.challenge], ['Our response', c.response], ['Example', c.example]]))];
  });
  if (challengeBlocks.length) section('Ethical challenges and our responses', [p('For each principle, the challenges we see and what we do about them.'), ...challengeBlocks]);

  section('How people were involved', [
    p(s.participation.description),
    ...sub('Methods', ul(labels(PARTICIPATION_METHODS, s.participation.methods))),
    s.participation.socialPartners ? p('Staff representatives, such as unions and works councils, are involved.') : null,
  ]);

  const g = s.governance;
  const rec = recommendModel(org, g.regulation);
  section('Governance', [
    defs([['Model', withOther(MODELS, g.model, g.modelOther)]]),
    rec && rec.model === g.model ? p(rec.reason) : null,
    ...sub('Roles and responsibilities', defs((g.roles || []).filter(r => clean(r.name)).map(r => [clean(r.name), r.responsibilities || '']))),
    ...(clean(g.decisionMaking) ? sub('Who decides', p(g.decisionMaking)) : []),
    ...(clean(g.reviewProcess) ? sub('How new AI uses are reviewed', p(g.reviewProcess)) : []),
    ...sub('Frameworks we align with', defs(FRAMEWORKS.filter(f => (g.frameworks || []).includes(f.value)).map(f => [`${f.label} (${f.status.toLowerCase()})`, f.meaning]))),
  ]);

  const c = s.commitments;
  section('Commitments', [
    p(c.statement),
    ...sub('Areas we commit to', ul(labels(COMMITMENT_AREAS, c.areas))),
    ...sub('Specific commitments', { type: 'numbered', items: (c.items || []).filter(i => clean(i.title)).map(i => [clean(i.title), clean(i.description)]) }),
  ]);

  const r = s.rollout;
  const frameworkSteps = FRAMEWORKS.filter(f => (g.frameworks || []).includes(f.value)).map(f => f.step);
  section('Rollout', [
    defs([['Approach', withOther(APPROACHES, r.approach, r.approachOther)]]),
    ...(r.phases || []).filter(ph => clean(ph.name)).flatMap(ph => [
      h(clean(ph.duration) ? `${clean(ph.name)} (${clean(ph.duration)})` : clean(ph.name)),
      p(ph.description),
      clean(ph.criteria) ? defs([['Done when', ph.criteria]]) : null,
    ]),
    ...sub('Framework actions', ul(frameworkSteps)),
    ...sub('Resources', ul(labels(RESOURCES, r.resources))),
    ...sub('Communication', ul(labels(COMMUNICATION, r.communication))),
  ]);

  const u = s.upkeep;
  section('Keeping this charter current', [
    defs([['Review', labelOf(FREQUENCIES, u.frequency)]]),
    ...sub('Other triggers for a review', ul(labels(TRIGGERS, u.triggers))),
    ...(clean(u.changeProposal) ? sub('Proposing changes', p(u.changeProposal)) : []),
    ...(clean(u.changeApproval) ? sub('Approving changes', p(u.changeApproval)) : []),
    ...(clean(u.versioning) ? sub('Versions', p(u.versioning)) : []),
    ...(clean(u.updateCommunication) ? sub('Communicating updates', p(u.updateCommunication)) : []),
    u.coDesign ? p('Future versions will be co-designed with the people they affect, using methods such as Café IA workshops.') : null,
  ]);

  if (clean(org.contact)) section('Questions', [p(`Questions about this charter go to ${clean(org.contact)}.`)]);

  return {
    title: clean(s.meta.title) || `${name} AI charter`,
    org: name,
    lead: clean(s.vision.statement),
    eyebrow: `AI charter${labelOf(CHARTER_TYPES, s.charterType) ? ` · ${labelOf(CHARTER_TYPES, s.charterType)}` : ''}`,
    version: clean(s.meta.version) || '1.0',
    toc: true,
    credit: 'Drafted with the Tutto AI charter wizard, after the Café IA method and Capgemini’s Code of Ethics for AI.',
    meta: [
      ['Organisation', clean(org.name)],
      ['Version', clean(s.meta.version) || '1.0'],
      ['Effective', fmtDate(clean(s.meta.date) || today())],
      ['Contact', clean(org.contact)],
      ['Website', clean(org.website)],
    ].filter(([, v]) => v),
    sections,
  };
}

// --- Just me: the sheet to come back to -----------------------------------------------------

function buildPersonal(s) {
  const me = s.me;
  const sections = [];
  const section = (title, blocks) => {
    const b = blocks.filter(Boolean).filter(x => !(x.items && !x.items.length));
    if (b.length) sections.push({ title, blocks: b });
  };
  const p = text => (clean(text) ? { type: 'p', text: clean(text) } : null);
  const h = text => ({ type: 'h3', text });
  const ul = items => ({ type: 'ul', items: items.map(clean).filter(Boolean) });
  const defs = pairs => ({ type: 'defs', items: pairs.filter(([k, v]) => clean(k) && clean(v)).map(([k, v]) => [clean(k), clean(v)]) });

  section('What I use AI for', [p(me.why), ul(me.uses || [])]);

  section('What matters to me', [
    { type: 'numbered', items: ME_PRINCIPLES.filter(x => (me.principles || []).includes(x.value)).map(x => [x.label, x.description]) },
  ]);

  section('What never goes into an AI tool', [ul([...labels(ME_NEVER, me.never), ...(me.neverOther || [])])]);

  section('What I don’t use AI for', [ul(labels(ME_NOGO, me.noGo))]);

  const rules = (me.rules || []).filter(r => clean(r.title));
  section('Before I rely on an answer', [
    ul(labels(ME_CHECKS, me.checks)),
    ...(rules.length ? [h('My own rules'), { type: 'numbered', items: rules.map(r => [clean(r.title), clean(r.description)]) }] : []),
  ]);

  section('Not sure? Six questions', [
    p('When I’m not sure if AI is right for something, I go through these in order.'),
    { type: 'numbered', items: CHECK_QUESTIONS.map(q => q.sheet) },
    p('If nothing comes up, I go ahead and do my usual checks.'),
  ]);

  const ask = (me.askWho || []).filter(r => clean(r.who));
  section('Who I ask', [
    defs(ask.map(r => [r.about || 'Anything', r.who])),
    ...(clean(me.wrong) ? [h('If something goes wrong'), p(me.wrong)] : []),
  ]);

  section('Looking at this again', [
    defs([['I read this sheet again', labelOf(ME_FREQUENCIES, me.frequency)]]),
    ...((me.triggers || []).length ? [h('And when'), ul(labels(ME_TRIGGERS, me.triggers))] : []),
    me.shared ? p('I go through it with someone I trust.') : null,
  ]);

  return {
    title: clean(me.title) || 'My AI Use Charter',
    org: clean(me.name),
    lead: clean(me.statement),
    eyebrow: 'AI Use Charter · A sheet to come back to',
    version: '',
    toc: false,
    credit: 'Drafted with the Tutto AI charter wizard.',
    meta: [
      ['Name', clean(me.name)],
      ['Date', fmtDate(clean(me.date) || today())],
      ['Tools', clean(me.tools)],
    ].filter(([, v]) => v),
    sections,
  };
}

// --- Markdown ------------------------------------------------------------------------------

const mdEscape = s => s.replace(/([\\`*_[\]#])/g, '\\$1').replace(/^(\s*)([-+]|\d+\.)\s/gm, '$1\\$2 ');

function blockToMd(b) {
  switch (b.type) {
    case 'p': return mdEscape(b.text);
    case 'h3': return `### ${mdEscape(b.text)}`;
    case 'ul': return b.items.map(i => `- ${mdEscape(i)}`).join('\n');
    case 'numbered': return b.items.map(([t, d], i) => `${i + 1}. **${mdEscape(t)}**${d ? `: ${mdEscape(d)}` : ''}`).join('\n');
    case 'defs': return b.items.map(([k, v]) => `**${mdEscape(k)}:** ${mdEscape(v)}`).join('  \n');
    default: return '';
  }
}

export function toMarkdown(doc = buildCharter()) {
  const out = [`# ${mdEscape(doc.title)}`, ''];
  if (doc.lead) out.push(`*${mdEscape(doc.lead)}*`, '');
  out.push(doc.meta.map(([k, v]) => `**${k}:** ${mdEscape(v)}`).join('  \n'), '', '---', '');
  if (doc.toc) out.push('## Contents', '', ...doc.sections.map((s, i) => `${i + 1}. ${s.title}`), '', '---', '');
  doc.sections.forEach((s, i) => {
    out.push(`## ${i + 1}. ${s.title}`, '');
    s.blocks.forEach(b => { const md = blockToMd(b); if (md) out.push(md, ''); });
  });
  out.push('---', '', `*${mdEscape(doc.title)}${doc.version ? `, version ${doc.version}` : ''}. ${doc.credit}*`, '');
  return out.join('\n');
}

// --- HTML (preview and print) -----------------------------------------------------------------

function blockToHtml(b) {
  switch (b.type) {
    case 'p': return `<p>${esc(b.text)}</p>`;
    case 'h3': return `<h3>${esc(b.text)}</h3>`;
    case 'ul': return `<ul class="dash">${b.items.map(i => `<li>${esc(i)}</li>`).join('')}</ul>`;
    case 'numbered': return `<ol class="charter-numbered">${b.items.map(([t, d]) => `<li><strong>${esc(t)}</strong>${d ? `<span>${esc(d)}</span>` : ''}</li>`).join('')}</ol>`;
    case 'defs': return `<dl class="charter-defs">${b.items.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>`;
    default: return '';
  }
}

// Same document furniture as the scorecard pack and the hand-over card: masthead, numbered section heads, footer.
export function toHtml(doc = buildCharter()) {
  return `<article class="charter">
  <header class="doc-header"><span class="brand">Tutto<span class="dot">.</span></span><span class="meta">AI charter · ${esc(fmtDate(today()))}</span></header>
  <span class="eyebrow">${esc(doc.eyebrow)}</span>
  <h2 class="brief-title">${esc(doc.title)}</h2>
  ${doc.lead ? `<p class="lead">${esc(doc.lead)}</p>` : ''}
  <div class="facts">${doc.meta.map(([k, v]) => `<div><b>${esc(k)}</b>${esc(v)}</div>`).join('')}</div>
  ${doc.toc ? `<ol class="charter-toc" aria-label="Charter contents">${doc.sections.map(s => `<li>${esc(s.title)}</li>`).join('')}</ol>` : ''}
  ${doc.sections.map((s, i) => `<div class="section-head"><span class="num">${String(i + 1).padStart(2, '0')}</span><span class="label">${esc(s.title)}</span><span class="rule"></span></div>${s.blocks.map(blockToHtml).join('')}`).join('')}
  <footer class="doc-footer"><span>Praxis · AI charter</span><span>Session one</span></footer>
</article>`;
}
