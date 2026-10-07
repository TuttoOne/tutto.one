import { state, load, edit, markVisited, onChange, exportJSON, importJSON, clearAll, saveNow, setMode } from './state.js';
import { stepById, activeSteps, formSteps, fieldByPath } from './schema.js';
import { applySuggestions } from './derive.js';
import {
  esc, stepFieldsHtml, trackMore, syncFields, readInput, handleAction, missingRequired, errorSummary, setErrors,
  checkAnswersHtml, allMissing, idFor,
} from './render.js';
import { buildCharter, toMarkdown, toHtml } from './charter.js';
import { mountSources } from './autofill.js';
import { hosted, saveFile, pageCss } from './host.js';

const $ = (s, r = document) => r.querySelector(s);
const mount = $('#panel');
const toastEl = $('#toast');
let current = 'start';
let fromCheck = false;
let outTab = 'doc';
const me = () => state.mode === 'me';
const outputStep = () => activeSteps().at(-1);

// --- Routing -----------------------------------------------------------------------------

function parseHash() {
  const [path, query = ''] = location.hash.replace(/^#\/?/, '').split('?');
  const params = new URLSearchParams(query);
  return { id: stepById(path) ? path : null, from: params.get('from'), field: params.get('field') };
}

function go(id, opts = {}) {
  const query = [opts.from && `from=${opts.from}`, opts.field && `field=${opts.field}`].filter(Boolean).join('&');
  const hash = `#/${id}${query ? `?${query}` : ''}`;
  if (location.hash !== hash) location.hash = hash;
  else route();
}

let booted = false;
function route() {
  const { id, from, field } = parseHash();
  const next = id || firstUnfinished();
  if (next !== current) { setErrors({}); window.__errors = {}; }
  current = next;
  fromCheck = from === 'check';
  if (fromCheck) outTab = 'answers';
  markVisited(current);
  render({ focusHeading: !field && booted, focusField: field });
  booted = true;
}

window.addEventListener('hashchange', route);

function firstUnfinished() {
  const steps = formSteps();
  if (!state.visited[steps[0].id]) return steps[0].id;
  const s = steps.find(st => !stepDone(st));
  return s ? s.id : outputStep().id;
}

// --- Progress ------------------------------------------------------------------------------

const stepDone = step => !!state.visited[step.id] && !Object.keys(missingRequired(step)).length;

function renderNav() {
  $('#nav').innerHTML = activeSteps().map((step, i) => {
    const done = stepDone(step);
    const dot = step.output || step.tool ? '' : `<span class="ok${done ? ' on' : ''}" title="${done ? 'Done' : 'Still to do'}"></span>`;
    return `<li><button type="button" data-goto="${step.id}"${step.id === current ? ' aria-current="step"' : ''}>` +
      `<span class="num">${String(i + 1).padStart(2, '0')}</span><span class="t">${esc(step.title)}</span>${dot}</button></li>`;
  }).join('');
  // On a phone the rail scrolls sideways: keep the step you are on in view.
  const ol = $('#nav'), here = $('#nav [aria-current]');
  if (here && ol.scrollWidth > ol.clientWidth) ol.scrollLeft = here.offsetLeft - ol.offsetLeft - 16;
}

function renderAside() {
  const steps = formSteps();
  const done = steps.filter(stepDone).length;
  const label = done === steps.length ? 'Ready' : done ? 'In progress' : 'Not started';
  const missing = allMissing().filter(m => state.visited[m.step.id]);
  $('#aside').innerHTML = `<div class="card"><span class="eyebrow">${me() ? 'Your sheet so far' : 'Charter so far'}</span>
    <div class="strength"><b>${label}</b><span>${done} of ${steps.length}</span></div>
    <div class="meter" style="grid-template-columns:repeat(${steps.length},1fr)">${steps.map(st => `<i class="${stepDone(st) ? 'on' : ''}"></i>`).join('')}</div>
    <ul class="todo">${steps.map(st => `<li><button type="button" class="${stepDone(st) ? 'done' : ''}" data-goto="${st.id}"><span class="mk"></span><span>${esc(st.todo)}</span></button></li>`).join('')}</ul>
    <p class="saved">Your answers are saved in this browser as you type.</p></div>
    ${missing.length ? `<div class="card"><h3>Still missing</h3><ul class="todo issues">${missing.map(m => `<li><button type="button" data-goto="${m.step.id}" data-field="${idFor(m.path)}"><span class="mk warn"></span><span>${esc(m.msg)}<em>${esc(m.step.title)}</em></span></button></li>`).join('')}</ul></div>` : ''}
    ${me() ? `<div class="card"><h3>Not sure about something?</h3><p>Six questions about one thing you want to do, and you know if AI is right for it.</p><button type="button" class="btn btn-ghost btn-sm" data-goto="try">Check a use</button></div>` : ''}`;
}

function renderHero() {
  $('#hero').innerHTML = me()
    ? `<span class="eyebrow">Session one · Your AI Use Charter</span><h1>Your own rules for AI.<br><em>And a sheet for when you’re not sure.</em></h1><p class="lead">Five short steps about what you use AI for, what stays out of it and who you ask. Most answers are suggested for you, and you can change every one. You finish with a sheet to print and keep, with six questions on it for the days you wonder if AI is right for the job.</p><button type="button" class="btn btn-ghost" data-goto="try">Not sure about something? Check it now</button>`
    : `<span class="eyebrow">Session one · Your AI Use Charter</span><h1>Rules first.<br><em>Then the tools.</em></h1><p class="lead">Six short steps about why you use AI, the principles you hold yourselves to, who decides and how the charter stays current. Most answers are suggested from the first few, and you can change every one. You finish with a charter to download and share.</p>`;
  document.querySelectorAll('#mode-seg button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.mode === state.mode)));
  $('#credit').textContent = me()
    ? 'The six questions and the rules behind them are Tutto’s. The principles follow Capgemini’s Code of Ethics for AI and the EU guidelines for trustworthy AI.'
    : 'After the Café IA co-design method and Capgemini’s Code of Ethics for AI.';
}

// --- Step rendering --------------------------------------------------------------------------------

function footHtml(step) {
  const steps = activeSteps();
  const i = steps.indexOf(step);
  const prev = steps[i - 1];
  const next = steps[i + 1];
  if (fromCheck) {
    return `<div class="panel-foot"><span></span><button type="button" class="btn btn-primary" data-nav="check">Save and go back to ${me() ? 'your sheet' : 'your charter'}</button></div>`;
  }
  return `<div class="panel-foot">
    ${prev ? `<button type="button" class="btn btn-ghost" data-goto="${prev.id}">Back: ${esc(prev.title)}</button>` : '<span></span>'}
    ${next ? `<button type="button" class="btn btn-primary" data-nav="next">Next: ${esc(next.title)}</button>` : ''}
  </div>`;
}

function outputHtml() {
  const missing = allMissing();
  const what = me() ? 'sheet' : 'charter';
  const tabs = [['doc', me() ? 'Your sheet' : 'Charter'], ['answers', 'Your answers']];
  const bar = outTab === 'doc'
    ? (me() ? 'Keep it where you work and go through it with your group.' : 'Share it with the people it affects before you adopt it.')
    : 'Every answer behind it. Change one and it’s updated straight away.';
  return `${missing.length ? `<p class="tip">Still missing: ${missing.map(m => `<a href="#/${m.step.id}?from=check&field=${idFor(m.path)}">${esc(fieldByPath(m.path)?.field.label || m.msg)}</a>`).join(', ')}. You can download it as it is, with gaps.</p>` : ''}
    <div class="download"><div><h3>Download your ${what}</h3><p>${hosted ? 'A page you can open anywhere and print.' : 'Print it, or choose “Save as PDF” in the print window.'}</p></div>
      <div class="btns">${hosted
        ? '<button type="button" class="btn btn-primary" data-export="html">Download printable page</button>'
        : '<button type="button" class="btn btn-primary" data-export="print">Print or save as PDF</button>'}</div></div>
    <div class="tabs" role="tablist">${tabs.map(([k, l]) => `<button type="button" role="tab" aria-selected="${outTab === k}" data-tab="${k}">${l}</button>`).join('')}</div>
    <div class="out-bar"><p>${bar}</p>${outTab === 'doc' ? `<div class="btns"><button type="button" class="btn btn-primary btn-sm" data-export="copy">Copy</button><button type="button" class="btn btn-ghost btn-sm" data-export="md">Download Markdown</button></div>` : ''}</div>
    <div class="paper">${outTab === 'doc' ? toHtml(buildCharter()) : checkAnswersHtml()}</div>
    <div class="out-bar"><p>Save your answers to carry on later, on this computer or another one.</p><div class="btns"><button type="button" class="btn btn-ghost btn-sm" data-export="json">Save answers</button><label class="btn btn-ghost btn-sm file-btn">Load answers<input type="file" accept=".json,application/json" data-export="import" class="sr-only"></label></div></div>
    <p><button type="button" class="link-btn danger" data-export="clear">Clear these answers and start again</button></p>`;
}

const smooth = () => (matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth');

function render({ focusHeading = false, focusField = null, keepFocus = null } = {}) {
  const step = stepById(current);
  const errs = window.__errors || {};
  let body;
  if (step.output) body = outputHtml();
  else body = `${stepFieldsHtml(step)}${step.id === 'start' ? '<div id="sources"></div>' : ''}${footHtml(step)}`;

  mount.innerHTML = `<h2 tabindex="-1">${esc(step.heading)}</h2><p class="lead">${esc(step.lead)}</p>${errorSummary(errs)}${body}`;

  trackMore(mount);
  if (step.id === 'start') mountSources(mount.querySelector('#sources'), n => {
    toast(n ? `${n} answer${n === 1 ? '' : 's'} filled in. Check them below.` : 'Nothing was filled in.');
    go('organisation');
  });
  renderHero();
  renderNav();
  renderAside();
  document.title = `${step.title} · AI Charter · Tutto`;

  if (keepFocus) {
    const el = mount.querySelector(keepFocus);
    if (el) { el.focus(); return; }
  }
  if (focusField) {
    const el = document.getElementById(focusField);
    if (el) {
      el.closest('details')?.setAttribute('open', '');
      (el.matches('input,select,textarea') ? el : el.querySelector('input,select,textarea') || el).focus();
      el.scrollIntoView({ block: 'center' });
      return;
    }
  }
  if (Object.keys(errs).length) { mount.querySelector('.error-summary')?.focus(); return; }
  if (focusHeading) {
    mount.querySelector('h2').focus({ preventScroll: true });
    $('#layout').scrollIntoView({ block: 'start', behavior: smooth() });
  }
}

// A selector that finds the same control again after a re-render.
function focusKey(el) {
  if (!el?.dataset?.path) return null;
  const v = el.type === 'checkbox' || el.type === 'radio' ? `[value="${CSS.escape(el.value)}"]` : '';
  return `[data-path="${CSS.escape(el.dataset.path)}"]${v}`;
}

// --- Events -------------------------------------------------------------------------------------------

mount.addEventListener('input', e => {
  const el = e.target;
  if (!el.dataset?.path || el.type === 'checkbox' || el.type === 'radio' || el.tagName === 'SELECT') return;
  edit(el.dataset.path, readInput(el));
});

mount.addEventListener('change', e => {
  const el = e.target;
  if (el.dataset?.export === 'import') return importFile(el);
  if (!el.dataset?.path) return;
  // Naming a custom principle adds a challenge group; redraw once the person has left the field.
  if (el.dataset.path.startsWith('principles.custom.')) {
    setTimeout(() => rerender(focusKey(document.activeElement)), 0);
    return;
  }
  if (el.type === 'checkbox' || el.type === 'radio' || el.tagName === 'SELECT') {
    edit(el.dataset.path, readInput(el));
    rerender(focusKey(el));
  }
});

mount.addEventListener('submit', e => e.preventDefault());

mount.addEventListener('click', e => {
  const btn = e.target.closest('button, a[data-focus]');
  if (!btn) return;
  if (btn.dataset.focus) {
    e.preventDefault();
    const el = document.getElementById(btn.dataset.focus);
    el?.closest('details')?.setAttribute('open', '');
    (el?.matches('input,select,textarea') ? el : el?.querySelector('input,select,textarea'))?.focus();
    return;
  }
  if (btn.dataset.nav) return navigate(btn.dataset.nav);
  if (btn.dataset.tab) { outTab = btn.dataset.tab; return render(); }
  if (btn.dataset.export) return exportAction(btn.dataset.export, btn);
  if (btn.dataset.action) {
    const res = handleAction(btn);
    if (res) rerender(res.focus || null);
  }
});

// The rail, the progress card, the hero and the Back button all move without checking the step first.
document.addEventListener('click', e => {
  const seg = e.target.closest('#mode-seg button');
  if (seg) {
    if (seg.dataset.mode === state.mode) return;
    // The switch wins over a ?for= link, so a reload stays where the person put it.
    if (location.search) history.replaceState(null, '', location.pathname + location.hash);
    setMode(seg.dataset.mode);
    return;
  }
  const btn = e.target.closest('[data-goto]');
  if (btn) go(btn.dataset.goto, { field: btn.dataset.field });
});

function navigate(dir) {
  const step = stepById(current);
  const errs = missingRequired(step);
  if (Object.keys(errs).length) {
    window.__errors = errs;
    setErrors(errs);
    render();
    return;
  }
  window.__errors = {};
  setErrors({});
  if (dir === 'check') return go(outputStep().id);
  const steps = activeSteps();
  const next = steps[steps.indexOf(step) + 1];
  if (next) go(next.id);
}

let pending = false;
function rerender(keep) {
  // Clear stale error messages for fields that now have answers.
  if (window.__errors && Object.keys(window.__errors).length) {
    const still = missingRequired(stepById(current));
    window.__errors = Object.fromEntries(Object.entries(window.__errors).filter(([p]) => p in still));
    setErrors(window.__errors);
  }
  render({ keepFocus: keep });
}

onChange(meta => {
  applySuggestions();
  if (meta.source === 'mode') {
    setErrors({}); window.__errors = {}; outTab = 'doc';
    return go(firstUnfinished());
  }
  if (meta.source === 'replace') { current = firstUnfinished(); return render({ focusHeading: true }); }
  if (meta.source === 'sync') {
    // Another tab changed the answers: refresh unless the person is typing here.
    if (!document.activeElement?.dataset?.path) { if (!stepById(current)) current = firstUnfinished(); render(); }
    return;
  }
  if (meta.source === 'autofill') return;
  if (meta.source === 'edit') {
    // Typing: update the rest of the page in place, re-render only if lists changed shape.
    if (pending) return;
    pending = true;
    queueMicrotask(() => {
      pending = false;
      if (stepById(current).output) return;
      if (!syncFields(mount)) rerender(focusKey(document.activeElement));
      renderNav();
      renderAside();
    });
    return;
  }
  rerender(focusKey(document.activeElement));
});

// --- Export ----------------------------------------------------------------------------------------------

const slug = () => {
  const name = (me() ? state.me.name : state.org.name) || '';
  return name.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || (me() ? 'my' : 'our');
};

const SAVE_COPY = { busy: 'A save is already waiting for you to confirm.', unavailable: 'Saving files is not available here.' };

async function offer(filename, text, type, done) {
  const res = await saveFile(filename, text, type);
  if (res === 'saved') toast(done);
  else if (res) toast(SAVE_COPY[res]);
}

// A self-contained copy of the charter, styled like the preview, to open and print anywhere.
function charterPage() {
  const doc = buildCharter();
  return `<!DOCTYPE html>\n<html lang="en-GB"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">` +
    `<title>${esc(doc.title)}</title><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Roboto:wght@400;500;700;900&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;1,8..60,400&display=swap">` +
    `<style>${pageCss()}\nbody{display:block;padding:2rem 1rem}.paper{max-width:56rem;margin:0 auto}@media print{body>*:not(.print-root){display:block!important}.paper{border:0;padding:0}}</style></head><body><div class="paper">${toHtml(doc)}</div></body></html>`;
}

async function copyText(text) {
  let ok = false;
  try { await navigator.clipboard.writeText(text); ok = true; } catch {
    try {
      const t = Object.assign(document.createElement('textarea'), { value: text });
      t.style.position = 'fixed'; t.style.opacity = '0';
      document.body.appendChild(t); t.select(); ok = document.execCommand('copy'); t.remove();
    } catch { /* blocked */ }
  }
  toast(ok ? `Copied the ${me() ? 'sheet' : 'charter'}.` : 'Your browser blocked copying here. Download the Markdown file instead.');
}

let clearConfirmArmed = false;
function exportAction(kind) {
  saveNow();
  if (kind === 'md') offer(`${slug()}-ai-charter.md`, toMarkdown(), 'text/markdown;charset=utf-8', 'Markdown saved.');
  if (kind === 'copy') copyText(toMarkdown());
  if (kind === 'json') offer(`${slug()}-charter-answers.json`, exportJSON(), 'application/json', 'Answers saved.');
  if (kind === 'html') offer(`${slug()}-ai-charter.html`, charterPage(), 'text/html;charset=utf-8', 'Printable page saved. Open it and print to PDF.');
  if (kind === 'print') {
    $('#print-root').innerHTML = toHtml(buildCharter());
    window.print();
  }
  if (kind === 'clear') {
    if (!clearConfirmArmed) {
      clearConfirmArmed = true;
      toast('Select “Clear these answers” again within five seconds to confirm.');
      setTimeout(() => { clearConfirmArmed = false; }, 5000);
      return;
    }
    clearConfirmArmed = false;
    clearAll(activeSteps().map(s => s.id));
    applySuggestions();
    go(formSteps()[0].id);
    toast('Answers cleared.');
  }
}

async function importFile(input) {
  const file = input.files?.[0];
  if (!file) return;
  try {
    importJSON(await file.text());
    toast('Your saved answers are loaded.');
    go(outputStep().id);
  } catch (err) {
    toast(err.message || 'Could not open that file.');
  }
}

window.addEventListener('afterprint', () => { $('#print-root').innerHTML = ''; });

// --- Toast ----------------------------------------------------------------------------------------------

let toastTimer;
function toast(msg) {
  toastEl.innerHTML = `<span>${esc(msg)}</span>`;
  toastEl.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toastEl.hidden = true; }, 4000);
}

// --- Start ------------------------------------------------------------------------------------------------

const how = load();
// A link can open the charter for one person or for an organisation: /ai-charter?for=me
const wanted = new URLSearchParams(location.search).get('for');
if (wanted === 'me' || wanted === 'org') state.mode = wanted;
applySuggestions();
saveNow();
if (how === 'migrated') setTimeout(() => toast('Your answers from the previous version of the wizard have been carried over.'), 300);
route();
