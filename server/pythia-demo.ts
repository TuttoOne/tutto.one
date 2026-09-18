/**
 * The Atelier Vallon demonstration, served from /pythia-demo.
 *
 * This used to be a standalone nginx vhost at pythia-demo.tutto.one, and the guarantees it
 * made were made by that config. Moving it into the site means Express has to make the same
 * ones, because they are not decoration — the pitch to a firm is that nothing it might upload
 * could reach anything, and the honest version of that sentence is "there is nowhere to upload
 * to and the headers say so".
 *
 * Everything here is scoped to /pythia-demo. `default-src 'none'` applied site-wide would take
 * the React app down instantly, so the path guard is load-bearing rather than tidiness.
 */
import type { Express, Request, Response, NextFunction } from "express";

/** Mount path. Kept in one place so the guard and the route cannot drift apart. */
export const DEMO_PATH = "/pythia-demo";

/**
 * Two inline blocks survive in the packaged demo: the trailing-slash guard in index.html, and
 * the report's stylesheet. Both are hashed rather than allowed with 'unsafe-inline'.
 *
 * These hashes are copied from the nginx config that generated the package. They stay valid
 * only while those two inline blocks are untouched — the intro screen deliberately puts its
 * CSS in app.css, an external file covered by 'self', precisely so that adding it did not
 * require regenerating them. If you ever edit the inline script or the report's inline style,
 * these must be recomputed or the page silently stops working in the browser while curl still
 * looks fine.
 */
const STYLE_HASH = "'sha256-m9Eva+ytefySgZSVEwwo6Crh7kPp7NdGZSn6SMY0S60='";
const SCRIPT_HASH = "'sha256-bub7zCsJpZMfy6IEZbZtYy++/MAeX5CeALJSEYZWAg0='";

const CSP = [
  "default-src 'none'",
  "img-src 'self'",
  `style-src 'self' ${STYLE_HASH}`,
  `script-src 'self' ${SCRIPT_HASH}`,
  "connect-src 'self'",
  "font-src 'self'",
  "base-uri 'none'",
  "form-action 'none'",
  "frame-ancestors 'none'",
].join("; ");

/**
 * Cache-Control by path, mirroring the map in the old vhost. Page images are addressed by
 * stable paths across builds, so they get a week; run data gets an hour, which is the longest
 * anyone should see a stale figure; everything else revalidates.
 */
function cacheControl(urlPath: string): string {
  if (urlPath.startsWith(`${DEMO_PATH}/pages/`)) return "public, max-age=604800";
  if (urlPath.startsWith(`${DEMO_PATH}/data/`)) return "public, max-age=3600";
  return "no-cache";
}

/**
 * Install the demo's headers. Must be mounted BEFORE the static handler, so the headers are
 * already on the response by the time a file is streamed.
 */
export function guardPythiaDemo(app: Express) {
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.path !== DEMO_PATH && !req.path.startsWith(`${DEMO_PATH}/`)) return next();

    // A static site cannot accept a document, but an absence of functionality is only an
    // argument — a 405 is a control that can be demonstrated in the room.
    if (req.method !== "GET" && req.method !== "HEAD") {
      res.setHeader("Allow", "GET, HEAD");
      return res.status(405).type("text/plain").send("405 Method Not Allowed");
    }

    res.setHeader("Content-Security-Policy", CSP);
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Referrer-Policy", "no-referrer");
    res.setHeader(
      "Permissions-Policy",
      "geolocation=(), microphone=(), camera=(), payment=(), usb=()",
    );
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
    // frame-ancestors already covers current browsers; kept because a scanner will ask.
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("Cache-Control", cacheControl(req.path));

    next();
  });
}
