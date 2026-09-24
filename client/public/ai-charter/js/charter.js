// Builds the charter once as a list of blocks, then renders it to Markdown or to HTML.
// User text is escaped for HTML; nothing is parsed back out of Markdown.

import { state } from './state.js';
import {
  ORG_TYPES, ORG_SIZES, MATURITY, SCOPES, STAKEHOLDERS, VALUES, PRINCIPLES, MODELS, FRAMEWORKS,
  PARTICIPATION_METHODS, COMMITMENT_AREAS, APPROACHES, RESOURCES, COMMUNICATION, FREQUENCIES, TRIGGERS, CHARTER_TYPES, labelOf,
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

export function buildCharter(s = state) {
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
    kind: labelOf(CHARTER_TYPES, s.charterType),
    meta: [
      ['Organisation', clean(org.name)],
      ['Version', clean(s.meta.version) || '1.0'],
      ['Effective', clean(s.meta.date) || today()],
      ['Contact', clean(org.contact)],
      ['Website', clean(org.website)],
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
  out.push('## Contents', '', ...doc.sections.map((s, i) => `${i + 1}. ${s.title}`), '', '---', '');
  doc.sections.forEach((s, i) => {
    out.push(`## ${i + 1}. ${s.title}`, '');
    s.blocks.forEach(b => { const md = blockToMd(b); if (md) out.push(md, ''); });
  });
  out.push('---', '', `*${mdEscape(doc.title)}, version ${doc.meta.find(m => m[0] === 'Version')?.[1] || '1.0'}. Drafted with the Tutto AI charter wizard, after the Café IA method and Capgemini’s Code of Ethics for AI.*`, '');
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

export function toHtml(doc = buildCharter()) {
  return `<article class="charter">
  <header class="charter-cover">
    <span class="eyebrow">AI charter${doc.kind ? ` · ${esc(doc.kind)}` : ''}</span>
    <h1>${esc(doc.title)}</h1>
    ${doc.lead ? `<p class="lead">${esc(doc.lead)}</p>` : ''}
    <dl class="charter-meta">${doc.meta.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
  </header>
  <nav class="charter-toc" aria-label="Charter contents"><h2>Contents</h2><ol>${doc.sections.map(s => `<li>${esc(s.title)}</li>`).join('')}</ol></nav>
  ${doc.sections.map((s, i) => `<section class="charter-section"><span class="eyebrow">${String(i + 1).padStart(2, '0')}</span><h2>${esc(s.title)}</h2>${s.blocks.map(blockToHtml).join('')}</section>`).join('')}
  <footer class="doc-footer"><span>${esc(doc.title)}</span><span>Drafted with <span class="brand brand-sm">Tutto<span class="dot">.</span></span></span></footer>
</article>`;
}
