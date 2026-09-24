import { state, load, edit, markVisited, onChange, exportJSON, importJSON, clearAll, saveNow } from './state.js';
import { STEPS, stepById } from './schema.js';
import { applySuggestions } from './derive.js';
import {
  esc, stepFieldsHtml, trackMore, syncFields, readInput, handleAction, missingRequired, errorSummary, setErrors,
  checkAnswersHtml, allMissing, idFor,
} from './render.js';
import { buildCharter, toMarkdown, toHtml } from './charter.js';
import { mountSources } from './autofill.js';
import { hosted, saveFile, pageCss } from './host.js';

const mount = document.getElementById('step');
const tasklist = document.getElementById('tasklist');
const toastEl = document.getElementById('toast');
const navSummary = document.querySelector('.nav-toggle > summary');
// On phones the step list starts folded away.
if (matchMedia('(max-width: 56rem)').matches) document.querySelector('.nav-toggle').open = false;
let current = 'start';
let fromCheck = false;

// --- Routing -----------------------------------------------------------------------------

function parseHash() {
  const [path, query = ''] = location.hash.replace(/^#\/?/, '').split('?');
  const params = new URLSearchParams(query);
  return { id: stepById(path) ? path : null, from: params.get('from'), field: params.get('field') };
}

function go(id, opts = {}) {
  const hash = `#/${id}${opts.from ? `?from=${opts.from}` : ''}`;
  if (location.hash !== hash) location.hash = hash;
  else route();
}

function route() {
  const { id, from, field } = parseHash();
  const next = id || firstUnfinished();
  if (next !== current) { setErrors({}); window.__errors = {}; }
  current = next;
  fromCheck = from === 'check';
  markVisited(current);
  render({ focusHeading: !field, focusField: field });
}

window.addEventListener('hashchange', route);

function firstUnfinished() {
  if (!state.visited.start) return 'start';
  const s = STEPS.find(st => st.id !== 'start' && st.id !== 'check' && status(st) !== 'Done');
  return s ? s.id : 'check';
}

// --- Task list ------------------------------------------------------------------------------

function status(step) {
  if (step.id === 'check') return allMissing().length ? 'Cannot start yet' : 'Ready';
  const missing = Object.keys(missingRequired(step)).length;
  if (!state.visited[step.id]) return 'Not started';
  return missing ? 'In progress' : 'Done';
}

function renderTasklist() {
  const i = STEPS.findIndex(st => st.id === current);
  navSummary.textContent = `Step ${i} of ${STEPS.length - 1}: ${STEPS[i].title}`;
  tasklist.innerHTML = STEPS.map(step => {
    const st = step.id === 'start' ? (state.visited.start ? 'Done' : 'Not started') : status(step);
    const cls = st.toLowerCase().replace(/\s+/g, '-');
    return `<li class="task${step.id === current ? ' is-current' : ''}"><a href="#/${step.id}"${step.id === current ? ' aria-current="step"' : ''}>` +
      `<span class="task-num">${step.id === 'start' ? '00' : String(STEPS.indexOf(step)).padStart(2, '0')}</span>` +
      `<span class="task-title">${esc(step.title)}</span><span class="task-status status-${cls}">${esc(st)}</span></a></li>`;
  }).join('');
}

// --- Step rendering --------------------------------------------------------------------------------

function navHtml(step) {
  const i = STEPS.indexOf(step);
  const prev = STEPS[i - 1];
  const next = STEPS[i + 1];
  if (fromCheck) {
    return `<div class="step-nav"><button type="button" class="btn btn-primary" data-nav="check">Save and return to check your answers</button></div>`;
  }
  return `<div class="step-nav">
    ${next ? `<button type="button" class="btn btn-primary" data-nav="next">Continue to ${esc(next.title.toLowerCase())}</button>` : ''}
    ${prev ? `<a class="back-link" href="#/${prev.id}">Back to ${esc(prev.title.toLowerCase())}</a>` : ''}
  </div>`;
}

function checkPageHtml() {
  const missing = allMissing();
  const doc = buildCharter();
  return `${missing.length ? `<div class="callout callout-warn"><p><strong>${missing.length} required ${missing.length === 1 ? 'answer is' : 'answers are'} missing.</strong> You can still preview and download, but the charter will have gaps.</p><ul class="dash">${missing.map(m => `<li><a href="#/${m.step.id}?from=check&field=${idFor(m.path)}">${esc(m.msg)}</a></li>`).join('')}</ul></div>` : ''}
    ${checkAnswersHtml()}
    <section class="export" aria-labelledby="export-title">
      <span class="eyebrow">Your charter</span>
      <h2 id="export-title">Download</h2>
      <div class="actions">
        <button type="button" class="btn btn-primary" data-export="md">Download Markdown</button>
        ${hosted
          ? '<button type="button" class="btn btn-ghost" data-export="html">Download printable page</button>'
          : '<button type="button" class="btn btn-ghost" data-export="print">Print or save as PDF</button>'}
        <button type="button" class="btn btn-ghost" data-export="json">Download save file</button>
        <label class="btn btn-ghost file-btn">Open save file<input type="file" accept=".json,application/json" data-export="import" class="sr-only"></label>
      </div>
      <p class="field-hint">The save file keeps every answer. Open it here later, on any computer, to carry on.</p>
    </section>
    <section class="preview" aria-label="Charter preview">${toHtml(doc)}</section>
    <p><button type="button" class="link-btn danger" data-export="clear">Clear all answers and start again</button></p>`;
}

function render({ focusHeading = false, focusField = null, keepFocus = null } = {}) {
  const step = stepById(current);
  const errs = window.__errors || {};
  let body;
  if (step.id === 'check') body = checkPageHtml();
  else body = `<div class="step-form">${step.id === 'start' ? '<div id="sources"></div>' : ''}${stepFieldsHtml(step)}${navHtml(step)}</div>`;

  mount.innerHTML = `<div class="step-head"><span class="eyebrow">${esc(step.eyebrow)}</span>
    <h1 tabindex="-1">${esc(step.heading)}</h1><p class="lead">${esc(step.lead)}</p></div>
    ${errorSummary(errs)}${body}`;

  trackMore(mount);
  if (step.id === 'start') mountSources(mount.querySelector('#sources'), n => {
    toast(n ? `${n} answer${n === 1 ? '' : 's'} filled in. Check them below.` : 'Nothing was filled in.');
    go('organisation');
  });
  renderTasklist();
  document.title = `${step.title} · AI charter · Tutto`;

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
  if (focusHeading) { mount.querySelector('h1').focus({ preventScroll: true }); window.scrollTo(0, 0); }
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
  if (btn.dataset.export) return exportAction(btn.dataset.export);
  if (btn.dataset.action) {
    const res = handleAction(btn);
    if (res) rerender(res.focus || null);
  }
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
  if (dir === 'check') return go('check');
  const next = STEPS[STEPS.indexOf(step) + 1];
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
  if (meta.source === 'replace') { current = firstUnfinished(); return render({ focusHeading: true }); }
  if (meta.source === 'sync') {
    // Another tab changed the answers: refresh unless the person is typing here.
    if (!document.activeElement?.dataset?.path) render();
    return;
  }
  if (meta.source === 'autofill') return;
  if (meta.source === 'edit') {
    // Typing: update the rest of the page in place, re-render only if lists changed shape.
    if (pending) return;
    pending = true;
    queueMicrotask(() => {
      pending = false;
      if (stepById(current).id === 'check') return;
      if (!syncFields(mount)) rerender(focusKey(document.activeElement));
      renderTasklist();
    });
    return;
  }
  rerender(focusKey(document.activeElement));
});

// --- Export ----------------------------------------------------------------------------------------------

const slug = () => (state.org.name || 'ai-charter').toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'ai-charter';

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
    `<style>${pageCss()}\nbody{display:block;padding:2rem 1rem}.charter{max-width:56rem;margin:0 auto}</style></head><body>${toHtml(doc)}</body></html>`;
}

function exportAction(kind) {
  saveNow();
  if (kind === 'md') offer(`${slug()}-ai-charter.md`, toMarkdown(), 'text/markdown;charset=utf-8', 'Markdown saved.');
  if (kind === 'json') offer(`${slug()}-charter-save.json`, exportJSON(), 'application/json', 'Save file saved.');
  if (kind === 'html') offer(`${slug()}-ai-charter.html`, charterPage(), 'text/html;charset=utf-8', 'Printable page saved. Open it and print to PDF.');
  if (kind === 'print') {
    document.getElementById('print-root').innerHTML = toHtml(buildCharter());
    window.print();
  }
  if (kind === 'clear') {
    if (!clearConfirmArmed) {
      clearConfirmArmed = true;
      toast('Select “Clear all answers” again within five seconds to confirm.');
      setTimeout(() => { clearConfirmArmed = false; }, 5000);
      return;
    }
    clearConfirmArmed = false;
    clearAll();
    applySuggestions();
    go('start');
    toast('All answers cleared.');
  }
}
let clearConfirmArmed = false;

async function importFile(input) {
  const file = input.files?.[0];
  if (!file) return;
  try {
    importJSON(await file.text());
    toast('Save file opened.');
    go('check');
  } catch (err) {
    toast(err.message || 'Could not open that file.');
  }
}

window.addEventListener('afterprint', () => { document.getElementById('print-root').innerHTML = ''; });

// --- Toast ----------------------------------------------------------------------------------------------

let toastTimer;
function toast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('is-visible'), 4000);
}

// --- Start ------------------------------------------------------------------------------------------------

const how = load();
applySuggestions();
saveNow();
if (how === 'migrated') setTimeout(() => toast('Your answers from the previous version of the wizard have been carried over.'), 300);
route();
