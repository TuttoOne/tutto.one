/* Offline cache.
 *
 * The point of this app is five minutes on a commute, which is exactly where
 * there is no signal, so it has to work with the network gone.
 *
 * Strategy is cache-first with a background refresh. Course JSON and diagrams
 * are static generated files: serving a slightly stale one instantly beats
 * waiting on a dead connection, and the refresh picks up the new version for
 * next time. Bump VERSION when the shell changes, which drops the old cache.
 */
const VERSION = 'pocket-praxis-v7';

// The shell, plus enough of the content to open the first course cold.
//
// Both course indexes, not the current language's: which one is current lives
// in localStorage, which a service worker cannot read, and the index is a
// couple of kilobytes. Cheaper to hold both than to get it wrong and leave
// someone who switched language on the train with a blank list.
//
// The decks and the drawings themselves are not precached in either language —
// that is 13 courses times two, and the fetch handler below picks each one up
// the first time it is opened, which is while there is still signal.
const SHELL = [
  './',
  './index.html',
  './game.css',
  './game.js',
  // The character, and the one big file here. Precached rather than left to
  // the network: it is on every page, and the commute this is built for is
  // where the signal is not.
  './pointer.mp4',
  './icon.svg',
  './manifest.webmanifest',
  './manifest.fr.webmanifest',
  './courses/index.json',
  './courses/fr/index.json',
  './praxis.css',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(VERSION)
      // addAll fails the whole install if any one file 404s, and a single
      // missing asset should not leave the app with no cache at all.
      //
      // reload, because c.add() otherwise goes through the ordinary HTTP cache,
      // and the shell is served with a day of max-age. A phone that loaded the
      // app this morning would install this version and fill it with what it
      // already had, which makes bumping VERSION do nothing at all — the fix
      // ships, the browser reports success, and nobody sees any change.
      .then((c) => Promise.all(SHELL.map(
        (u) => c.add(new Request(u, { cache: 'reload' })).catch(() => null)
      )))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== location.origin) return;   // YouTube and Skilljar stay online
  // The account API answers per person and must never come back from a cache.
  if (url.pathname.startsWith('/api/')) return;

  e.respondWith(
    caches.match(req).then((hit) => {
      const live = fetch(req).then((res) => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(VERSION).then((c) => c.put(req, copy));
        }
        return res;
      }).catch(() => hit);          // offline: whatever we already hold

      return hit || live;
    })
  );
});
