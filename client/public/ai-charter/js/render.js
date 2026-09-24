// Renders a step from the schema. Every input carries data-path; one delegated
// listener on the mount writes changes into the state, so added rows save like any field.

import { state, get, isTouched, edit, resetToSuggestion } from './state.js';
import { STEPS, PRINCIPLES, MODELS, FRAMEWORKS, labelOf, principleOf, stepById } from './schema.js';
import { isSuggested, hasSuggestion, suggestions, recommendModel, leadershipName, modelLabel } from './derive.js';

export const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const idFor = path => 'f-' + path.replace(/[^a-zA-Z0-9]+/g, '-');

const SOURCE_LABEL = { register: 'From register', website: 'From website', document: 'From document' };
const openMore = new Set();
export let errors = {};
export const setErrors = e => { errors = e; };

// --- Tags and field chrome ----------------------------------------------------

export function tagsFor(path) {
  if (!path) return '';
  const out = [];
  const src = state.provenance[path];
  if (src) out.push(`<span class="tag tag-primary">${SOURCE_LABEL[src] || 'Imported'}</span>`);
  else if (isSuggested(path)) out.push('<span class="tag tag-primary">Suggested</span>');
  if (isTouched(path) && hasSuggestion(path) && JSON.stringify(get(path)) !== JSON.stringify(suggestions[path]) && !src) {
    out.push(`<button type="button" class="link-btn" data-action="reset" data-path="${esc(path)}">Use suggestion</button>`);
  }
  return out.join(' ');
}

function labelRow(f, forId, legend = false) {
  const req = f.required ? '' : ' <span class="optional">(optional)</span>';
  const tag = legend ? 'legend' : 'label';
  const forAttr = legend ? '' : ` for="${forId}"`;
  return `<div class="field-head"><${tag} class="field-label"${forAttr}>${esc(f.label)}${f.required ? '' : req}</${tag}>` +
    `<span class="field-tags" data-tags="${esc(f.path || '')}">${tagsFor(f.path)}</span></div>` +
    (f.hint ? `<p class="field-hint" id="${forId}-hint">${esc(f.hint)}</p>` : '') +
    (errors[f.path] ? `<p class="field-error" id="${forId}-error">${esc(errors[f.path])}</p>` : '');
}

function describedBy(f, id) {
  const ids = [f.hint && `${id}-hint`, errors[f.path] && `${id}-error`].filter(Boolean);
  return ids.length ? ` aria-describedby="${ids.join(' ')}"` : '';
}

// --- Field renderers ------------------------------------------------------------

function textInput(f) {
  const id = idFor(f.path);
  const type = { email: 'email', url: 'url', date: 'date' }[f.type] || 'text';
  return `<div class="field${errors[f.path] ? ' has-error' : ''}" data-field="${esc(f.path)}">${labelRow(f, id)}` +
    `<input id="${id}" type="${type}" data-path="${esc(f.path)}" value="${esc(get(f.path))}"` +
    `${f.placeholder ? ` placeholder="${esc(f.placeholder)}"` : ''}${f.autocomplete ? ` autocomplete="${f.autocomplete}"` : ''}` +
    `${f.required ? ' aria-required="true"' : ''}${describedBy(f, id)}></div>`;
}

function textarea(f) {
  const id = idFor(f.path);
  return `<div class="field${errors[f.path] ? ' has-error' : ''}" data-field="${esc(f.path)}">${labelRow(f, id)}` +
    `<textarea id="${id}" rows="${f.rows || 4}" data-path="${esc(f.path)}"${f.required ? ' aria-required="true"' : ''}${describedBy(f, id)}>${esc(get(f.path))}</textarea></div>`;
}

function select(f) {
  const id = idFor(f.path);
  const value = get(f.path) || '';
  const opts = [`<option value="">Choose…</option>`, ...f.options.map(o =>
    `<option value="${esc(o.value)}"${o.value === value ? ' selected' : ''}>${esc(o.label)}</option>`)].join('');
  let html = `<div class="field${errors[f.path] ? ' has-error' : ''}" data-field="${esc(f.path)}">${labelRow(f, id)}` +
    `<select id="${id}" data-path="${esc(f.path)}"${f.required ? ' aria-required="true"' : ''}${describedBy(f, id)}>${opts}</select>`;
  if (f.other && value === 'other') {
    const oid = idFor(f.other);
    html += `<label class="sr-only" for="${oid}">Please describe</label><input id="${oid}" class="other-input" type="text" data-path="${esc(f.other)}" value="${esc(get(f.other))}" placeholder="Please describe">`;
  }
  return html + '</div>';
}

function checkboxes(f) {
  const id = idFor(f.path);
  const values = get(f.path) || [];
  const items = f.options.map(o => `<label class="check"><input type="checkbox" data-path="${esc(f.path)}" data-multi value="${esc(o.value)}"${values.includes(o.value) ? ' checked' : ''}>` +
    `<span><span class="check-label">${esc(o.label)}</span>${f.describe && o.description ? `<span class="check-desc">${esc(o.description)}</span>` : ''}</span></label>`).join('');
  return `<fieldset class="field${errors[f.path] ? ' has-error' : ''}" data-field="${esc(f.path)}" id="${id}">${labelRow(f, id, true)}` +
    `<div class="checks cols-${f.columns || 1}">${items}</div></fieldset>`;
}

function toggle(f) {
  const id = idFor(f.path);
  return `<div class="field" data-field="${esc(f.path)}"><label class="check" for="${id}"><input id="${id}" type="checkbox" data-path="${esc(f.path)}" data-bool${get(f.path) ? ' checked' : ''}>` +
    `<span class="check-label">${esc(f.label)}</span></label> <span class="field-tags" data-tags="${esc(f.path)}">${tagsFor(f.path)}</span></div>`;
}

function cards(f) {
  const id = idFor(f.path);
  const multi = !!f.multiple;
  const value = get(f.path);
  const rec = f.describe === 'model' ? recommendModel()?.model : null;
  const items = f.options.map(o => {
    const checked = multi ? (value || []).includes(o.value) : value === o.value;
    let body = `<span class="card-title">${esc(o.label)}</span>`;
    if (f.describe === 'model' && o.bestFor) {
      body += `<span class="card-meta">Best for: ${esc(o.bestFor)}</span><span class="card-meta">For: ${esc(o.pros)} Against: ${esc(o.cons)}</span>`;
    } else if (f.describe === 'framework') {
      body += `<span class="card-status">${esc(o.status)}</span><span class="card-meta">${esc(o.bestFor)}</span>`;
    } else if (o.hint) {
      body += `<span class="card-meta">${esc(o.hint)}</span>`;
    }
    if (o.value === rec) body += '<span class="tag tag-primary card-badge">Recommended</span>';
    return `<label class="choice${checked ? ' is-checked' : ''}"><input type="${multi ? 'checkbox' : 'radio'}" name="${esc(f.path)}" data-path="${esc(f.path)}"${multi ? ' data-multi' : ''} value="${esc(o.value)}"${checked ? ' checked' : ''}>${body}</label>`;
  }).join('');
  let html = `<fieldset class="field${errors[f.path] ? ' has-error' : ''}" data-field="${esc(f.path)}" id="${id}">${labelRow(f, id, true)}<div class="choices">${items}</div>`;
  if (f.other && value === 'other') {
    const oid = idFor(f.other);
    html += `<label class="field-label small" for="${oid}">Describe your model</label><input id="${oid}" class="other-input" type="text" data-path="${esc(f.other)}" value="${esc(get(f.other))}">`;
  }
  return html + '</fieldset>';
}

function list(f, path = f.path, label = f.label) {
  const id = idFor(path);
  const rows = get(path) || [];
  const simple = !f.item.fields;
  const itemsHtml = rows.map((row, i) => {
    const rowLabel = `${label} ${i + 1}`;
    const remove = `<button type="button" class="icon-btn" data-action="remove" data-path="${esc(path)}" data-index="${i}" aria-label="Remove ${esc(rowLabel)}">Remove</button>`;
    if (simple) {
      const iid = `${id}-${i}`;
      return `<div class="row row-simple"><label class="sr-only" for="${iid}">${esc(rowLabel)}</label><input id="${iid}" type="text" data-path="${esc(path)}.${i}" value="${esc(row)}" placeholder="${esc(f.item.placeholder || '')}">${remove}</div>`;
    }
    const inner = f.item.fields.map(sf => {
      const iid = `${id}-${i}-${sf.key}`;
      const p = `${path}.${i}.${sf.key}`;
      const input = sf.type === 'textarea'
        ? `<textarea id="${iid}" rows="${sf.rows || 2}" data-path="${esc(p)}">${esc(row?.[sf.key])}</textarea>`
        : `<input id="${iid}" type="text" data-path="${esc(p)}" value="${esc(row?.[sf.key])}">`;
      return `<div class="row-field row-${sf.key}"><label class="field-label small" for="${iid}">${esc(sf.label)}</label>${input}</div>`;
    }).join('');
    return `<div class="row card">${inner}<div class="row-actions">${remove}</div></div>`;
  }).join('');
  return `<fieldset class="field" data-field="${esc(path)}" data-count="${rows.length}" id="${id}">${labelRow({ ...f, path, label }, id, true)}` +
    `<div class="rows">${itemsHtml || '<p class="field-hint">Nothing here yet.</p>'}</div>` +
    `<button type="button" class="btn btn-ghost btn-sm" data-action="add" data-path="${esc(path)}">${esc(f.addLabel || 'Add')}</button></fieldset>`;
}

const CHALLENGE_ITEM = { fields: [
  { key: 'challenge', type: 'textarea', label: 'Challenge', rows: 2 },
  { key: 'response', type: 'textarea', label: 'Our response', rows: 2 },
  { key: 'example', type: 'textarea', label: 'Example or case (optional)', rows: 2 },
] };

export const customKey = name => 'custom-' + (name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function challenges(f) {
  const chosen = [
    ...PRINCIPLES.filter(p => state.principles.selected.includes(p.value)).map(p => ({ key: p.value, name: p.label })),
    ...state.principles.custom.filter(c => c.name?.trim()).map(c => ({ key: customKey(c.name), name: c.name })),
  ];
  const body = chosen.map(p => `<div class="challenge-group"><h3>${esc(p.name)}</h3>${list({ item: CHALLENGE_ITEM, addLabel: 'Add a challenge', label: 'Challenge' }, `challenges.${p.key}`, 'Challenge')}</div>`).join('');
  return `<section class="field challenges"><div class="field-head"><h3 class="field-label">${esc(f.label)}</h3></div><p class="field-hint">${esc(f.hint)}</p>${body || '<p class="field-hint">Select principles first.</p>'}</section>`;
}

// --- Governance recommendation and org chart -----------------------------------------

export function orgChart(model, type) {
  const top = leadershipName(type);
  const levels = {
    officer: [[top], ['AI lead'], ['Data protection officer', 'Everyone using AI']],
    committee: [[top], ['AI ethics committee'], ['Data protection officer', 'Legal and compliance', 'Teams using AI']],
    advisory: [[top], ['AI ethics committee', 'External advisory board'], ['Data protection officer', 'Public liaison', 'Teams using AI']],
    hybrid: [[top], ['Chief AI officer'], ['AI governance council'], ['Department AI lead', 'Department AI lead', 'Department AI lead']],
    distributed: [[top], ['AI governance council'], ['Department oversight', 'Department oversight', 'Department oversight']],
    taskforce: [[top], ['AI task force'], ['Pilot team', 'Pilot team']],
  }[model];
  if (!levels) return '';
  return `<div class="orgchart" role="img" aria-label="Organisation chart: ${esc(levels.map(l => l.join(' and ')).join(', then '))}">` +
    levels.map((lvl, i) => `${i ? '<div class="orgchart-line" aria-hidden="true"></div>' : ''}<div class="orgchart-level">${lvl.map(n => `<div class="orgchart-node">${esc(n)}</div>`).join('')}</div>`).join('') +
    '</div>';
}

function recommendation() {
  const rec = recommendModel();
  if (!rec) return '<div class="callout"><p>Answer the questions about your organisation in step 1 to get a recommended governance model.</p></div>';
  const chosen = state.governance.model;
  const differs = chosen && chosen !== rec.model;
  return `<div class="callout recommendation"><span class="eyebrow">Recommended for you</span>` +
    `<p class="rec-model">${esc(modelLabel(rec.model))}</p><p>${esc(rec.reason)}</p>` +
    (differs ? `<p><button type="button" class="btn btn-ghost btn-sm" data-action="use-model" data-value="${esc(rec.model)}">Use the recommended model</button></p>` : '') +
    `</div>${chosen && chosen !== 'other' ? `<div class="field"><p class="field-label">How it fits together</p>${orgChart(chosen, state.org.type)}</div>` : ''}`;
}

// --- Step rendering -------------------------------------------------------------------

function renderField(f) {
  switch (f.type) {
    case 'text': case 'email': case 'url': case 'date': return textInput(f);
    case 'textarea': return textarea(f);
    case 'select': return select(f);
    case 'checkboxes': return checkboxes(f);
    case 'toggle': return toggle(f);
    case 'cards': return cards(f);
    case 'list': return list(f);
    case 'challenges': return challenges(f);
    case 'recommendation': return recommendation();
    default: return '';
  }
}

export function stepFieldsHtml(step) {
  const main = step.fields.filter(f => !f.more).map(renderField).join('');
  const more = step.fields.filter(f => f.more);
  const moreOpen = openMore.has(step.id) || more.some(f => errors[f.path]);
  const moreHtml = more.length
    ? `<details class="more" data-more="${step.id}"${moreOpen ? ' open' : ''}><summary>More detail <span class="more-count">${more.length} optional ${more.length === 1 ? 'question' : 'questions'}, mostly filled in for you</span></summary><div class="more-body">${more.map(renderField).join('')}</div></details>`
    : '';
  return main + moreHtml;
}

export function trackMore(root) {
  root.querySelectorAll('details.more').forEach(d => d.addEventListener('toggle', () => {
    d.open ? openMore.add(d.dataset.more) : openMore.delete(d.dataset.more);
  }));
}

// Update values and tags in place, without re-rendering (keeps focus and caret while typing).
// Returns false if the structure changed and a full render is needed.
export function syncFields(root) {
  for (const el of root.querySelectorAll('[data-count]')) {
    if ((get(el.dataset.field) || []).length !== Number(el.dataset.count)) return false;
  }
  for (const el of root.querySelectorAll('[data-path]')) {
    if (el === document.activeElement || el.tagName === 'BUTTON') continue;
    const v = get(el.dataset.path);
    if ('multi' in el.dataset) el.checked = (v || []).includes(el.value);
    else if ('bool' in el.dataset) el.checked = !!v;
    else if (el.type === 'radio') el.checked = v === el.value;
    else if (el.value !== (v ?? '')) el.value = v ?? '';
  }
  root.querySelectorAll('[data-tags]').forEach(el => { el.innerHTML = tagsFor(el.dataset.tags); });
  return true;
}

// --- Events ----------------------------------------------------------------------------

export function readInput(el) {
  const path = el.dataset.path;
  if ('multi' in el.dataset) {
    const current = get(path) || [];
    // Keep the order of the option list.
    const boxes = [...document.querySelectorAll(`[data-path="${CSS.escape(path)}"][data-multi]`)];
    const next = boxes.filter(b => b.checked).map(b => b.value);
    const kept = current.filter(v => !boxes.some(b => b.value === v));
    return [...kept, ...next];
  }
  if ('bool' in el.dataset) return el.checked;
  return el.value;
}

export function handleAction(btn) {
  const { action, path, index, value } = btn.dataset;
  if (action === 'add') {
    const rows = [...(get(path) || [])];
    const f = listFieldFor(path);
    rows.push(f?.item?.fields ? Object.fromEntries(f.item.fields.map(sf => [sf.key, ''])) : '');
    edit(path, rows);
    return { focus: `[data-path^="${path}.${rows.length - 1}"]` };
  }
  if (action === 'remove') {
    const rows = [...(get(path) || [])];
    rows.splice(Number(index), 1);
    edit(path, rows);
    return {};
  }
  if (action === 'reset') { resetToSuggestion(path); return {}; }
  if (action === 'use-model') { edit('governance.model', value); return {}; }
  return null;
}

function listFieldFor(path) {
  if (path.startsWith('challenges.')) return { item: CHALLENGE_ITEM };
  for (const s of STEPS) for (const f of s.fields) if (f.path === path) return f;
  return null;
}

// --- Validation -------------------------------------------------------------------------

export function missingRequired(step) {
  const out = {};
  for (const f of step.fields) {
    if (!f.path) continue;
    const v = get(f.path);
    if (f.type === 'email' && v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())) {
      out[f.path] = 'Enter an email address in the right format, like name@example.org';
      continue;
    }
    if (!f.required) continue;
    if (v == null || v === '' || (Array.isArray(v) && !v.length)) out[f.path] = f.error || `Enter ${f.label.toLowerCase()}`;
  }
  return out;
}

export function errorSummary(errs) {
  const entries = Object.entries(errs);
  if (!entries.length) return '';
  return `<div class="error-summary" role="alert" tabindex="-1"><h2 class="error-title">There is a problem</h2><ul>` +
    entries.map(([p, msg]) => `<li><a href="#${idFor(p)}" data-focus="${idFor(p)}">${esc(msg)}</a></li>`).join('') + '</ul></div>';
}

// --- Check your answers ---------------------------------------------------------------------

function displayValue(f) {
  const v = get(f.path);
  if (f.type === 'checkboxes' || (f.type === 'cards' && f.multiple)) return (v || []).map(x => esc(labelOf(f.options, x))).join('<br>');
  if (f.type === 'select' || f.type === 'cards') {
    if (v === 'other' && f.other) return esc(get(f.other) || 'Other');
    return esc(labelOf(f.options, v));
  }
  if (f.type === 'toggle') return v ? 'Yes' : 'No';
  if (f.type === 'list') {
    const rows = v || [];
    if (!rows.length) return '';
    return rows.map(r => esc(typeof r === 'string' ? r : (r.name || r.title || '(untitled)'))).join('<br>');
  }
  if (f.type === 'challenges') {
    const n = Object.values(state.challenges).reduce((a, l) => a + (l?.length || 0), 0);
    return n ? `${n} challenge${n === 1 ? '' : 's'} with responses` : '';
  }
  const s = String(v ?? '');
  return esc(s.length > 220 ? s.slice(0, 220) + '…' : s);
}

export function checkAnswersHtml() {
  return STEPS.filter(s => s.fields.length && s.id !== 'start').map(step => {
    const rows = step.fields.filter(f => f.path || f.type === 'challenges').map(f => {
      const value = displayValue(f);
      const missing = !value && f.required;
      const anchor = f.path ? idFor(f.path) : '';
      const href = `#/${step.id}?from=check${anchor ? `&field=${anchor}` : ''}`;
      return `<div class="summary-row${missing ? ' is-missing' : ''}"><dt>${esc(f.label)}</dt>` +
        `<dd>${value || (missing ? '<span class="missing">Not answered yet</span>' : '<span class="text-muted">Not included</span>')}</dd>` +
        `<dd class="summary-action"><a href="${href}">${value ? 'Change' : 'Add'}<span class="sr-only"> ${esc(f.label.toLowerCase())}</span></a></dd></div>`;
    }).join('');
    return `<section class="summary-section"><h2>${esc(step.title)}</h2><dl class="summary">${rows}</dl></section>`;
  }).join('');
}

export function allMissing() {
  const out = [];
  for (const step of STEPS) for (const [p, msg] of Object.entries(missingRequired(step))) out.push({ step, path: p, msg });
  return out;
}

export { stepById, principleOf, MODELS, FRAMEWORKS, idFor };
