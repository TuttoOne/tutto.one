// The player.
//
// Pacing, and telling the truth about it. The real runs take between a third of a
// second and three seconds. Played at that speed a viewer sees a flicker and learns
// nothing, so each stage is given room proportional to how much it printed, and the
// panel states the real figure next to the paced one. What is never altered: the
// stages, their order, the notes they printed, or the files they produced.

var DATA = window.__DEMO_DATA__;
var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

var PER_NOTE = 820, BASE = 1500, MIN_STAGE = 2100, GAP = 260;

function stageMs(st) { return Math.max(MIN_STAGE, BASE + st.notes.length * PER_NOTE); }
function totalMs(v) {
  return v.stages.reduce(function (t, st) { return t + stageMs(st) + GAP; }, 0);
}
function fmtSize(n) {
  return n < 1048576 ? (n / 1024).toFixed(0) + ' KB' : (n / 1048576).toFixed(1) + ' MB';
}
function el(tag, cls, text) {
  var e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined) e.textContent = text;
  return e;
}

function select(id) {
  DATA.forEach(function (v) {
    var on = v.id === id;
    document.getElementById('tab-' + v.id).setAttribute('aria-selected', on ? 'true' : 'false');
    document.getElementById('panel-' + v.id).hidden = !on;
  });
}

function buildTabs() {
  var tabs = document.getElementById('tabs');
  var panels = document.getElementById('panels');

  DATA.forEach(function (v, i) {
    var b = el('button');
    b.type = 'button';
    b.id = 'tab-' + v.id;
    b.setAttribute('role', 'tab');
    b.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    b.setAttribute('aria-controls', 'panel-' + v.id);
    b.appendChild(el('b', null, v.tab));
    b.appendChild(el('span', null, v.sector));
    b.onclick = function () { select(v.id); };
    tabs.appendChild(b);

    var panel = el('section', 'panel');
    panel.id = 'panel-' + v.id;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', 'tab-' + v.id);
    panel.hidden = i !== 0;

    var wrap = el('div', 'wrap');
    wrap.appendChild(el('p', 'who', v.who));
    wrap.appendChild(el('h2', null, v.title));
    wrap.appendChild(el('p', 'problem', v.problem));

    var console_ = el('div', 'console');

    // The window strip from the site's example-session card. The dots are
    // decoration; the caption is not, so only the dots are hidden.
    var chrome = el('div', 'chrome');
    for (var d = 0; d < 3; d++) {
      var dotEl = el('u');
      dotEl.setAttribute('aria-hidden', 'true');
      chrome.appendChild(dotEl);
    }
    chrome.appendChild(el('em', null, 'recorded run · ' + v.tab.toLowerCase()));
    console_.appendChild(chrome);

    var head = el('div', 'console-head');
    var btn = el('button', 'run', 'Run it');
    btn.type = 'button';
    var pacing = el('p', 'pacing');
    pacing.textContent = 'The real run takes ' + v.real.toFixed(1) + ' seconds. Played back over '
      + Math.round(totalMs(v) / 1000) + ' seconds, slowly enough to read what it is doing.';
    head.appendChild(btn);
    head.appendChild(pacing);
    console_.appendChild(head);

    var overall = el('div', 'overall');
    var overallFill = el('i');
    overall.appendChild(overallFill);
    console_.appendChild(overall);

    var list = el('ol', 'stages');
    console_.appendChild(list);

    var result = el('div', 'result');
    console_.appendChild(result);

    wrap.appendChild(console_);
    panel.appendChild(wrap);
    panels.appendChild(panel);

    btn.onclick = function () { play(v, btn, list, result, overallFill, pacing); };
  });
}

function play(v, btn, list, result, overallFill, pacing) {
  btn.disabled = true;
  btn.textContent = 'Running';
  list.innerHTML = '';
  result.innerHTML = '';
  pacing.textContent = 'Reading the data and applying the rules.';

  // Follow the run down the page, but stop the moment the viewer takes over.
  // A demo that fights your scroll wheel is worse than one that does not scroll.
  var follow = true;
  function release() { follow = false; }
  window.addEventListener('wheel', release, { passive: true, once: true });
  window.addEventListener('touchmove', release, { passive: true, once: true });
  window.addEventListener('keydown', release, { once: true });

  var total = totalMs(v);
  var t = 0;
  var items = [];

  v.stages.forEach(function (st) {
    var li = el('li');
    var row = el('div', 'srow');
    var dot = el('span', 'dot');
    dot.appendChild(el('em', null, String(st.n)));
    row.appendChild(dot);
    row.appendChild(el('div', 'label', st.label));
    li.appendChild(row);

    var bar = el('div', 'bar');
    var fill = el('i');
    bar.appendChild(fill);
    li.appendChild(bar);

    var notes = el('div', 'notes');
    var noteEls = st.notes.map(function (n) {
      var d = el('div', /matches$/.test(n.text) ? 'truth' : null, n.text);
      notes.appendChild(d);
      return d;
    });
    li.appendChild(notes);
    list.appendChild(li);

    var dur = stageMs(st);
    items.push({ li: li, fill: fill, notes: noteEls, at: t, dur: dur });
    t += dur + GAP;
  });

  var timers = [];
  items.forEach(function (item, i) {
    timers.push(setTimeout(function () {
      if (i > 0) {
        items[i - 1].li.classList.remove('running');
        items[i - 1].li.classList.add('done');
      }
      item.li.classList.add('seen', 'running');

      // CSSOM rather than a style attribute, so the content-security-policy
      // stays free of unsafe-inline.
      item.fill.style.transition = 'none';
      item.fill.style.width = '0%';
      void item.fill.offsetWidth;
      item.fill.style.transition = 'width ' + item.dur + 'ms linear';
      item.fill.style.width = '100%';

      if (follow) {
        item.li.scrollIntoView({
          behavior: REDUCED ? 'auto' : 'smooth',
          block: 'center'
        });
      }

      // Space the notes across the stage so each one has time to be read.
      var step = item.notes.length ? (item.dur - 500) / item.notes.length : 0;
      item.notes.forEach(function (d, k) {
        timers.push(setTimeout(function () { d.classList.add('in'); }, 380 + k * step));
      });
    }, item.at));
  });

  overallFill.style.transition = 'none';
  overallFill.style.width = '0%';
  void overallFill.offsetWidth;
  overallFill.style.transition = 'width ' + total + 'ms linear';
  overallFill.style.width = '100%';

  timers.push(setTimeout(function () {
    var last = items[items.length - 1];
    last.li.classList.remove('running');
    last.li.classList.add('done');

    btn.disabled = false;
    btn.textContent = 'Run it again';
    pacing.textContent = 'The real run takes ' + v.real.toFixed(1) + ' seconds.';

    var done = el('div', 'done-panel');
    done.appendChild(el('h3', null, 'Finished'));
    done.appendChild(el('p', 'sub',
      'The run took ' + v.real.toFixed(1) + ' seconds on an ordinary desktop machine.'));

    var table = el('table', 'sum');
    v.summary.forEach(function (r) {
      var tr = el('tr');
      tr.appendChild(el('td', null, r.key));
      tr.appendChild(el('td', null, r.value));
      table.appendChild(tr);
    });
    done.appendChild(table);

    var files = el('div', 'files');
    files.appendChild(el('b', null, 'The files it produced'));
    v.downloads.forEach(function (f) {
      var a = el('a');
      a.href = f.href;
      a.setAttribute('download', '');
      a.appendChild(document.createTextNode(f.name));
      a.appendChild(el('i', null, f.kind + ' · ' + fmtSize(f.size)));
      files.appendChild(a);
    });
    done.appendChild(files);

    result.appendChild(done);
    result.appendChild(el('p', 'catch', v.catch));

    if (follow) {
      done.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'center' });
    }
  }, total + 200));
}

buildTabs();
