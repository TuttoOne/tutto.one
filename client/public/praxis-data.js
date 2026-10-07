/* Praxis tools: the data policy, in the browser.
 *
 * Every tool (/agent-scorecard, /ai-charter, /handover-list, /use-case-card) keeps
 * its work in localStorage under one key and reads it back when it starts. This
 * script works at that level, so the tools barely change:
 *
 * - asks people to agree to the data policy before they start (once per version)
 * - wipes saved work that hasn't been opened for BROWSER_DAYS
 * - adds a "Your work" button: save to a CSV file, open a saved file, share a copy
 *   with Tutto, clear it from this browser
 *
 * Load it in <head>, before the tool's own script, so the expiry check runs first:
 *   <script src="/praxis-data.js" data-tool="agent-scorecard" data-key="praxis-agent-scorecard-v2"></script>
 *
 * POLICY_VERSION, BROWSER_DAYS and RETENTION_MONTHS must match shared/data-policy.ts.
 */
(function () {
  'use strict';
  var POLICY_VERSION = '2026-10-07';
  var BROWSER_DAYS = 30;
  var RETENTION_MONTHS = 6;
  var POLICY_URL = '/data-policy';

  var me = document.currentScript;
  var TOOL = me.getAttribute('data-tool');
  var KEY = me.getAttribute('data-key');
  var MOUNT = me.getAttribute('data-mount') || '.topbar .right';
  var LABEL = me.getAttribute('data-label') || 'this tool';
  var TOUCHED = 'tutto:touched:' + KEY;
  var AGREED = 'tutto:policy';
  var DAY = 24 * 60 * 60 * 1000;

  function get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* storage blocked */ } }
  function del(k) { try { localStorage.removeItem(k); } catch (e) { /* storage blocked */ } }

  /* ---------- expiry: runs before the tool reads its work ---------- */
  var expired = false;
  (function () {
    var touched = +get(TOUCHED) || 0;
    if (get(KEY) !== null && touched && Date.now() - touched > BROWSER_DAYS * DAY) {
      del(KEY); del(TOUCHED); expired = true;
    } else if (get(KEY) !== null) {
      set(TOUCHED, String(Date.now()));
    }
    // Every save the tool makes counts as use.
    try {
      var original = Storage.prototype.setItem;
      Storage.prototype.setItem = function (k, v) {
        original.call(this, k, v);
        if (this === window.localStorage && k === KEY) original.call(this, TOUCHED, String(Date.now()));
      };
    } catch (e) { /* storage blocked */ }
  })();

  function wipeDate() {
    var t = +get(TOUCHED);
    if (!t || get(KEY) === null) return '';
    return new Date(t + BROWSER_DAYS * DAY).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  /* ---------- CSV: one row per value, plus a row per list and group ----------
     field,type,value. The field is a path like S/week/0/task. Types: obj, arr
     (containers), s (text), n (number), b (true/false), null. Opens in Excel and
     reads back exactly. */
  function esc(p) { return String(p).replace(/~/g, '~0').replace(/\//g, '~1'); }
  function unesc(p) { return p.replace(/~1/g, '/').replace(/~0/g, '~'); }

  function flatten(value) {
    var rows = [];
    (function walk(v, path) {
      if (Array.isArray(v)) { rows.push([path, 'arr', '']); v.forEach(function (x, i) { walk(x, path + '/' + i); }); }
      else if (v && typeof v === 'object') { rows.push([path, 'obj', '']); Object.keys(v).forEach(function (k) { walk(v[k], path + '/' + esc(k)); }); }
      else if (typeof v === 'number') rows.push([path, 'n', String(v)]);
      else if (typeof v === 'boolean') rows.push([path, 'b', String(v)]);
      else if (v === null || v === undefined) rows.push([path, 'null', '']);
      else rows.push([path, 's', String(v)]);
    })(value, '');
    return rows;
  }

  function unflatten(rows) {
    var root;
    rows.forEach(function (r) {
      var path = r[0], type = r[1], raw = r[2];
      var v = type === 'obj' ? {} : type === 'arr' ? [] : type === 'n' ? Number(raw) : type === 'b' ? raw === 'true' : type === 'null' ? null : raw;
      if (path === '') { root = v; return; }
      var parts = path.split('/').slice(1).map(unesc);
      var at = root;
      for (var i = 0; i < parts.length - 1; i++) at = at[parts[i]];
      at[parts[parts.length - 1]] = v;
    });
    return root;
  }

  function csvCell(s) { s = String(s); return /[",\r\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; }
  function toCsv(rows) { return rows.map(function (r) { return r.map(csvCell).join(','); }).join('\r\n'); }

  function parseCsv(text) {
    var rows = [], row = [], cell = '', q = false;
    text = text.replace(/^﻿/, '');
    for (var i = 0; i < text.length; i++) {
      var c = text[i];
      if (q) {
        if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; }
        else if (c === '"') q = false;
        else cell += c;
      } else if (c === '"') q = true;
      else if (c === ',') { row.push(cell); cell = ''; }
      else if (c === '\n' || c === '\r') {
        if (c === '\r' && text[i + 1] === '\n') i++;
        row.push(cell); rows.push(row); row = []; cell = '';
      } else cell += c;
    }
    if (cell !== '' || row.length) { row.push(cell); rows.push(row); }
    return rows;
  }

  function exportCsv() {
    var raw = get(KEY);
    if (raw === null) return say('There is nothing to save yet.');
    var rows = [['field', 'type', 'value'], ['#tool', 'meta', TOOL], ['#saved', 'meta', new Date().toISOString()], ['#format', 'meta', '1']]
      .concat(flatten(JSON.parse(raw)));
    var blob = new Blob(['﻿' + toCsv(rows)], { type: 'text/csv;charset=utf-8' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'tutto-' + TOOL + '-' + new Date().toISOString().slice(0, 10) + '.csv';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
    say('Saved to a file. Keep it somewhere safe: it is the only copy that lasts.');
  }

  function importCsv(file) {
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var rows = parseCsv(String(reader.result));
        if (!rows.length || rows[0][0] !== 'field') throw new Error('This is not a file saved from a Tutto tool.');
        var meta = {}, data = [];
        rows.slice(1).forEach(function (r) {
          if (!r.length || (r.length === 1 && r[0] === '')) return;
          if (r[0].charAt(0) === '#') meta[r[0].slice(1)] = r[2];
          else data.push(r);
        });
        if (meta.tool !== TOOL) throw new Error(meta.tool ? 'This file was saved from a different tool (' + meta.tool + ').' : 'This file does not say which tool it came from.');
        var value = unflatten(data);
        if (!value || typeof value !== 'object') throw new Error('The file is empty or damaged.');
        if (get(KEY) !== null && !confirm('Opening this file replaces the work in this browser. Carry on?')) return;
        set(KEY, JSON.stringify(value));
        location.reload();
      } catch (e) {
        say(e.message || 'That file could not be opened.');
      }
    };
    reader.readAsText(file);
  }

  function clearAll() {
    del(KEY); del(TOUCHED);
    location.reload();
  }

  /* ---------- share a copy with Tutto ---------- */
  function share(form) {
    var raw = get(KEY);
    if (raw === null) return say('There is nothing to share yet.');
    var f = form.elements;
    if (!f['pd-agree'].checked) return say('Please tick that you agree to the data policy.');
    var btn = form.querySelector('button[type=submit]');
    btn.disabled = true;
    fetch('/api/shares', {
      method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tool: TOOL, data: JSON.parse(raw), name: f['pd-name'].value, email: f['pd-email'].value,
        organisation: f['pd-org'].value, note: f['pd-note'].value, policyVersion: POLICY_VERSION,
      }),
    }).then(function (r) { return r.json().then(function (d) { if (!r.ok) throw new Error(d.error || 'That did not go through.'); return d; }); })
      .then(function (d) {
        form.innerHTML = '<p class="pd-ok">Sent. Daniel has a copy' + (d.linkedToAccount ? ', and it shows on your /learn dashboard' : '') +
          '. Your work stays in this browser too, so keep saving it to a file.</p>';
      })
      .catch(function (e) { btn.disabled = false; say(e.message); });
  }

  /* ---------- the panel ---------- */
  var CSS = '\
.pd-btn{display:inline-flex;align-items:center;gap:6px}\
.pd-back{position:fixed;inset:0;background:rgba(20,20,20,.45);z-index:1000;display:flex;align-items:flex-start;justify-content:center;padding:6vh 16px;overflow:auto}\
.pd-box{background:hsl(var(--card,0 0% 100%));color:hsl(var(--foreground,0 0% 12%));border-radius:12px;max-width:560px;width:100%;padding:24px;box-shadow:0 20px 60px rgba(0,0,0,.25);font-size:15px;line-height:1.55}\
.pd-box h2{margin:0 0 8px;font-size:1.35rem}\
.pd-box h3{margin:20px 0 6px;font-size:1rem}\
.pd-box p{margin:0 0 10px}\
.pd-box ul{margin:0 0 12px;padding-left:20px}\
.pd-box li{margin:0 0 6px}\
.pd-muted{color:hsl(var(--muted-foreground,220 9% 46%));font-size:.875rem}\
.pd-row{display:flex;flex-wrap:wrap;gap:8px;margin:8px 0 4px}\
.pd-box label.pd-f{display:block;font-size:.8rem;font-weight:600;margin:10px 0 4px}\
.pd-box input[type=text],.pd-box input[type=email],.pd-box textarea{width:100%;box-sizing:border-box;border:1px solid hsl(var(--border,220 13% 91%));border-radius:6px;padding:8px 10px;font:inherit;background:#fff}\
.pd-check{display:flex;gap:8px;align-items:flex-start;margin:14px 0;font-size:.9rem}\
.pd-check input{margin-top:4px;width:auto!important;flex:0 0 auto}\
.pd-check span{flex:1}\
.pd-msg{margin-top:10px;font-size:.875rem;color:hsl(var(--primary,32 95% 44%))}\
.pd-ok{padding:12px;border-radius:8px;background:hsl(var(--muted,40 5% 90%))}\
.pd-close{float:right;background:none;border:0;font-size:22px;line-height:1;cursor:pointer;color:inherit}\
.pd-box a{color:hsl(var(--primary,32 95% 44%))}\
@media print{.pd-back,.pd-btn{display:none!important}}';

  var box, msgEl;
  function say(t) { if (msgEl) msgEl.textContent = t; else alert(t); }

  function open(html, opts) {
    close();
    var back = document.createElement('div');
    back.className = 'pd-back';
    back.innerHTML = '<div class="pd-box" role="dialog" aria-modal="true">' + html + '<div class="pd-msg" role="status"></div></div>';
    document.body.appendChild(back);
    box = back; msgEl = back.querySelector('.pd-msg');
    if (!(opts && opts.locked)) {
      back.addEventListener('click', function (e) { if (e.target === back) close(); });
      document.addEventListener('keydown', escClose);
    }
    var first = back.querySelector('input,button,a');
    if (first) first.focus();
    return back;
  }
  function escClose(e) { if (e.key === 'Escape') close(); }
  function close() { if (box) { box.remove(); box = null; msgEl = null; document.removeEventListener('keydown', escClose); } }

  var HOW = '<ul>' +
    '<li><strong>Your work stays in this browser.</strong> Nothing reaches us unless you press "Share with Tutto".</li>' +
    '<li><strong>It is wiped after ' + BROWSER_DAYS + ' days</strong> if you don\'t open it, and it doesn\'t follow you to another computer or browser. Clearing your browser data wipes it too.</li>' +
    '<li><strong>Save it to a file</strong> whenever you finish a session. You can open that file here later on any computer and carry on.</li>' +
    '<li><strong>Use placeholders</strong> for client names, personal details and real figures until your organisation\'s AI rules say otherwise.</li>' +
    '<li><strong>On a shared computer,</strong> save your file and then choose "Clear from this browser" before you leave.</li>' +
    '</ul>';

  function consentGate() {
    var back = open(
      '<h2>Before you start</h2>' +
      '<p>' + LABEL.charAt(0).toUpperCase() + LABEL.slice(1) + ' works in your browser. Here\'s how we handle what you type.</p>' + HOW +
      '<p>If you share a copy with us, we keep it for the length of your programme and ' + RETENTION_MONTHS + ' months after, then delete it. You can ask us to delete it sooner, and we confirm in writing when it\'s done. The full details are in our <a href="' + POLICY_URL + '" target="_blank" rel="noopener">data policy</a>.</p>' +
      '<label class="pd-check"><input type="checkbox" id="pd-agree-start"> <span>I\'ve read the data policy and agree to it.</span></label>' +
      '<button type="button" class="btn btn-primary" id="pd-start" disabled>Start</button>',
      { locked: true });
    var tick = back.querySelector('#pd-agree-start'), go = back.querySelector('#pd-start');
    tick.addEventListener('change', function () { go.disabled = !tick.checked; });
    go.addEventListener('click', function () { set(AGREED, POLICY_VERSION); close(); if (expired) expiredNote(); });
  }

  function expiredNote() {
    open('<button class="pd-close" aria-label="Close">×</button><h2>Your saved work was cleared</h2>' +
      '<p>It hadn\'t been opened for ' + BROWSER_DAYS + ' days, so this browser wiped it, as our data policy says. If you saved it to a file, open that file from "Your work" to carry on.</p>' +
      '<button type="button" class="btn btn-primary" data-pd="close">OK</button>');
  }

  function panel() {
    var has = get(KEY) !== null, until = wipeDate();
    var back = open(
      '<button class="pd-close" aria-label="Close">×</button>' +
      '<h2>Your work</h2>' +
      '<p class="pd-muted">' + (has ? 'Saved in this browser only.' + (until ? ' It will be wiped on ' + until + ' unless you open it again before then.' : '') : 'Nothing saved in this browser yet.') + '</p>' +
      '<div class="pd-row">' +
      '<button type="button" class="btn btn-primary btn-sm" data-pd="export"' + (has ? '' : ' disabled') + '>Save to a file (CSV)</button>' +
      '<label class="btn btn-ghost btn-sm" style="cursor:pointer">Open a saved file<input type="file" accept=".csv,text/csv" data-pd="import" hidden></label>' +
      '</div>' +
      '<h3>Share a copy with Tutto</h3>' +
      '<p class="pd-muted">Sends us one copy of your work as it is now, so we can read it before your next session. We keep it as our data policy says and delete it when you ask.</p>' +
      '<form data-pd="share"' + (has ? '' : ' hidden') + '>' +
      '<label class="pd-f" for="pd-name">Your name</label><input type="text" id="pd-name" name="pd-name" required autocomplete="name">' +
      '<label class="pd-f" for="pd-email">Your email</label><input type="email" id="pd-email" name="pd-email" required autocomplete="email">' +
      '<label class="pd-f" for="pd-org">Organisation (optional)</label><input type="text" id="pd-org" name="pd-org" autocomplete="organization">' +
      '<label class="pd-f" for="pd-note">A note for Daniel (optional)</label><textarea id="pd-note" name="pd-note" rows="2"></textarea>' +
      '<label class="pd-check"><input type="checkbox" name="pd-agree"> <span>I agree to the <a href="' + POLICY_URL + '" target="_blank" rel="noopener">data policy</a> and I\'ve left out anything I\'m not allowed to share.</span></label>' +
      '<button type="submit" class="btn btn-primary btn-sm">Share with Tutto</button>' +
      '</form>' +
      (has ? '' : '<p class="pd-muted">Start working and this opens.</p>') +
      '<h3>Clear from this browser</h3>' +
      '<p class="pd-muted">Deletes the work saved here. Save it to a file first if you want to keep it. It does not delete a copy you shared with us: for that, email daniel@tutto.one.</p>' +
      '<div class="pd-row"><button type="button" class="btn btn-ghost btn-sm" data-pd="clear"' + (has ? '' : ' disabled') + '>Clear from this browser</button></div>' +
      '<details style="margin-top:16px"><summary class="pd-muted" style="cursor:pointer">How we handle your data</summary>' + HOW + '<p><a href="' + POLICY_URL + '" target="_blank" rel="noopener">Read the data policy</a></p></details>');

    // A signed-in /learn student doesn't need to type their name and email again.
    fetch('/api/learn/me', { credentials: 'same-origin' }).then(function (r) { return r.ok ? r.json() : null; }).then(function (d) {
      if (!d || !box) return;
      var f = back.querySelector('form[data-pd=share]');
      if (!f) return;
      f.elements['pd-name'].value = d.student.name || '';
      f.elements['pd-email'].value = d.student.email || '';
      f.elements['pd-org'].value = (d.cohort && d.cohort.organisation) || '';
    }).catch(function () {});

    back.querySelector('input[data-pd=import]').addEventListener('change', function (e) { if (e.target.files[0]) importCsv(e.target.files[0]); });
    var form = back.querySelector('form[data-pd=share]');
    form.addEventListener('submit', function (e) { e.preventDefault(); share(form); });
  }

  document.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('[data-pd],.pd-close');
    if (!t) return;
    var a = t.getAttribute('data-pd');
    if (t.classList.contains('pd-close') || a === 'close') close();
    else if (a === 'open') panel();
    else if (a === 'export') exportCsv();
    else if (a === 'clear') {
      if (t.getAttribute('data-sure')) clearAll();
      else { t.setAttribute('data-sure', '1'); t.textContent = 'Click again to clear'; say('This cannot be undone.'); }
    }
  });

  document.addEventListener('DOMContentLoaded', function () {
    var style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);
    var mount = document.querySelector(MOUNT);
    if (mount) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'btn btn-ghost btn-sm pd-btn'; b.setAttribute('data-pd', 'open');
      b.textContent = 'Your work';
      mount.insertBefore(b, mount.firstChild);
    }
    if (get(AGREED) !== POLICY_VERSION) consentGate();
    else if (expired) expiredNote();
  });
})();
