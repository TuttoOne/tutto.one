// Where the wizard is running: the local server (python3 server.py) or a claude.ai artifact viewer.
// Hosted pages cannot reach other sites or download files directly, so saves and Claude calls
// go through the viewer's capabilities instead.

export const hosted = typeof window.claude?.use === 'function';

let downloadsP = null;
const downloads = () => (downloadsP ??= hosted ? window.claude.use('downloads').catch(() => null) : Promise.resolve(null));

let sampleP = null;
export const sampleFn = () => (sampleP ??= hosted ? window.claude.use('sample').catch(() => null) : Promise.resolve(null));

// Save a generated file. Returns a short status line for a toast, or '' if the viewer declined.
export async function saveFile(filename, text, type) {
  const dl = await downloads();
  if (dl) {
    try {
      await dl.save({ filename, data: text });
      return 'saved';
    } catch (e) {
      if (e?.code === 'declined') return '';
      if (e?.code === 'rate_limited') return 'busy';
      return 'unavailable';
    }
  }
  if (hosted) return 'unavailable';
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = Object.assign(document.createElement('a'), { href: url, download: filename });
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return 'saved';
}

// Every same-origin stylesheet rule on the page, for a self-contained HTML export.
export function pageCss() {
  const out = [];
  for (const sheet of document.styleSheets) {
    try { for (const rule of sheet.cssRules) out.push(rule.cssText); } catch { /* cross-origin sheet (fonts) */ }
  }
  return out.join('\n');
}

// Load a library from cdnjs once (allowed in hosted pages and locally).
const loaded = {};
export function loadScript(src) {
  return (loaded[src] ??= new Promise((resolve, reject) => {
    const s = Object.assign(document.createElement('script'), { src, async: true });
    s.onload = resolve;
    s.onerror = () => reject(new Error('Could not load a helper library.'));
    document.head.appendChild(s);
  }));
}
