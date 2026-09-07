#!/usr/bin/env node
/**
 * Screenshot a running tutto.one for the design-critic loop.
 *
 * The critic agent only ever sees these PNGs — never the source — so the shots
 * have to be what a visitor actually gets: full page, real fonts loaded, reveal
 * animations already triggered, no scrollbar gutter.
 *
 * Drives headless Chrome over the DevTools protocol directly rather than
 * pulling in Playwright: `ws` and a system Chrome are already here, and a
 * browser download is a poor trade for ~200 lines.
 *
 *   node scripts/design/shoot.mjs / /praxis --label before
 *   node scripts/design/shoot.mjs /about --width 1440 --tiles
 */
import { spawn } from "node:child_process";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import WebSocket from "ws";

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  "google-chrome",
  "google-chrome-stable",
  "chromium",
  "chromium-browser",
].filter(Boolean);

/* Vision models resize anything past ~8000px on a side, so a raw full-page
   capture of a long page arrives at the critic as mush. Overview shots are
   downscaled to fit this; --tiles then gives back the fine detail at 1:1. */
const MAX_EDGE = 8000;
const TILE_HEIGHT = 3600;

function parseArgs(argv) {
  const opts = {
    routes: [],
    widths: [],
    base: process.env.DESIGN_BASE_URL || "http://localhost:5000",
    height: 900,
    dpr: 1,
    out: ".design/shots",
    label: "shot",
    wait: 1200,
    fullPage: true,
    tiles: false,
    locale: null,
  };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    const next = () => argv[++i];
    switch (arg) {
      case "--base": opts.base = next(); break;
      case "--width": opts.widths.push(Number(next())); break;
      case "--height": opts.height = Number(next()); break;
      case "--dpr": opts.dpr = Number(next()); break;
      case "--out": opts.out = next(); break;
      case "--label": opts.label = next(); break;
      case "--wait": opts.wait = Number(next()); break;
      case "--viewport-only": opts.fullPage = false; break;
      case "--tiles": opts.tiles = true; break;
      case "--locale": opts.locale = next(); break;
      case "-h":
      case "--help": opts.help = true; break;
      default:
        if (arg.startsWith("-")) throw new Error(`Unknown flag: ${arg}`);
        opts.routes.push(arg);
    }
  }
  if (!opts.routes.length) opts.routes = ["/"];
  if (!opts.widths.length) opts.widths = [1440, 390];
  return opts;
}

const USAGE = `Usage: node scripts/design/shoot.mjs [routes...] [options]

  routes            one or more paths, e.g. / /praxis /portfolio  (default: /)

  --base <url>      site root (default: $DESIGN_BASE_URL or http://localhost:5000)
                    Check the port the dev server actually printed — it falls
                    back to 5001 when something else holds 5000.
  --width <n>       viewport width, repeatable (default: 1440 and 390)
  --height <n>      viewport height (default: 900)
  --dpr <n>         device pixel ratio (default: 1; use 2 to judge fine detail)
  --out <dir>       output directory (default: .design/shots)
  --label <s>       filename prefix, e.g. before / after (default: shot)
  --wait <ms>       settle delay after load (default: 1200)
  --viewport-only   above-the-fold only, no full-page capture
  --tiles           also write full-resolution slices of the page, for reading
                    type and spacing that the downscaled overview loses
  --locale <en|fr>  force the language toggle before the page renders. French
                    copy runs ~40% longer than English and is where the layout
                    breaks first, so shoot both before calling a page done.
`;

function slug(route) {
  const s = route.replace(/^\/+|\/+$/g, "").replace(/[^a-zA-Z0-9]+/g, "-");
  return s || "home";
}

/* Language is a localStorage preference, not a URL segment, so it has to be
   planted before the app's first render rather than clicked afterwards. */
const localeScript = (locale) =>
  `try { localStorage.setItem("tutto.locale", ${JSON.stringify(locale)}); } catch (e) {}`;

async function findChrome() {
  for (const bin of CHROME_CANDIDATES) {
    const ok = await new Promise((resolve) => {
      const p = spawn(bin, ["--version"], { stdio: "ignore" });
      p.on("error", () => resolve(false));
      p.on("exit", (code) => resolve(code === 0));
    });
    if (ok) return bin;
  }
  throw new Error(
    `No Chrome found. Tried: ${CHROME_CANDIDATES.filter(Boolean).join(", ")}. Set CHROME_PATH.`,
  );
}

async function launchChrome() {
  const bin = await findChrome();
  const profile = await mkdtemp(path.join(tmpdir(), "tutto-shoot-"));
  const child = spawn(bin, [
    "--headless=new",
    "--remote-debugging-port=0",
    `--user-data-dir=${profile}`,
    "--no-first-run",
    "--no-default-browser-check",
    "--disable-gpu",
    "--hide-scrollbars",
    "--force-color-profile=srgb",
    "--font-render-hinting=none",
    "about:blank",
  ]);

  const wsUrl = await new Promise((resolve, reject) => {
    let buf = "";
    const timer = setTimeout(
      () => reject(new Error("Chrome did not report a DevTools endpoint")),
      20000,
    );
    child.stderr.on("data", (chunk) => {
      buf += chunk.toString();
      const m = buf.match(/DevTools listening on (ws:\/\/\S+)/);
      if (m) {
        clearTimeout(timer);
        resolve(m[1]);
      }
    });
    child.on("error", (err) => { clearTimeout(timer); reject(err); });
    child.on("exit", (code) => {
      clearTimeout(timer);
      reject(new Error(`Chrome exited (${code}) before listening:\n${buf}`));
    });
  });

  return { child, wsUrl, profile };
}

/** Minimal flat-session CDP client over a single browser websocket. */
function connect(wsUrl) {
  const socket = new WebSocket(wsUrl, { maxPayload: 512 * 1024 * 1024 });
  const pending = new Map();
  let nextId = 1;

  socket.on("message", (raw) => {
    const msg = JSON.parse(raw.toString());
    if (!msg.id || !pending.has(msg.id)) return;
    const { resolve, reject } = pending.get(msg.id);
    pending.delete(msg.id);
    msg.error ? reject(new Error(msg.error.message)) : resolve(msg.result);
  });

  return {
    ready: new Promise((resolve, reject) => {
      socket.once("open", resolve);
      socket.once("error", reject);
    }),
    send(method, params = {}, sessionId) {
      const id = nextId++;
      const payload = { id, method, params };
      if (sessionId) payload.sessionId = sessionId;
      socket.send(JSON.stringify(payload));
      return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
    },
    close: () => socket.close(),
  };
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* Scroll the whole page once and come back. Anything driven by
   IntersectionObserver or `animate-*` on reveal is otherwise still in its
   pre-animation state in the capture, which reads as a broken layout.
   Fonts and images get a bounded wait — a dev server with one dead asset
   should cost a second, not hang the run. */
const SETTLE_SCRIPT = `(async () => {
  const deadline = Date.now() + 6000;
  const step = Math.max(200, window.innerHeight * 0.8);
  for (let y = 0; y < document.body.scrollHeight && Date.now() < deadline; y += step) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 60));
  }
  window.scrollTo(0, 0);
  await new Promise((r) => setTimeout(r, 250));
  const bounded = (p, ms) => Promise.race([p, new Promise((r) => setTimeout(r, ms))]);
  await bounded(document.fonts ? document.fonts.ready : Promise.resolve(), 3000);
  await bounded(
    Promise.all(
      Array.from(document.images)
        .filter((img) => !img.complete)
        .map((img) => new Promise((r) => { img.onload = img.onerror = r; })),
    ),
    3000,
  );
  return document.title;
})()`;

async function waitForLoad(cdp, sessionId, timeoutMs = 15000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const { result } = await cdp.send("Runtime.evaluate", {
      expression: "document.readyState",
    }, sessionId);
    if (result.value === "complete") return true;
    await sleep(150);
  }
  return false;
}

async function capture(cdp, sessionId, clip) {
  const { data } = await cdp.send("Page.captureScreenshot", {
    format: "png",
    captureBeyondViewport: true,
    clip,
  }, sessionId);
  return Buffer.from(data, "base64");
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.help) {
    process.stdout.write(USAGE);
    return;
  }

  const base = opts.base.replace(/\/+$/, "");
  const outDir = path.resolve(opts.out);
  await mkdir(outDir, { recursive: true });

  const { child, wsUrl, profile } = await launchChrome();
  const cdp = connect(wsUrl);
  await cdp.ready;

  let count = 0;
  try {
    const { targetId } = await cdp.send("Target.createTarget", { url: "about:blank" });
    const { sessionId } = await cdp.send("Target.attachToTarget", { targetId, flatten: true });
    await cdp.send("Page.enable", {}, sessionId);
    if (opts.locale) {
      await cdp.send("Page.addScriptToEvaluateOnNewDocument", {
        source: localeScript(opts.locale),
      }, sessionId);
    }

    const setViewport = (width) =>
      cdp.send("Emulation.setDeviceMetricsOverride", {
        width,
        height: opts.height,
        deviceScaleFactor: opts.dpr,
        mobile: width < 600,
      }, sessionId);

    for (const width of opts.widths) {
      for (const route of opts.routes) {
        const url = `${base}${route.startsWith("/") ? route : `/${route}`}`;
        /* Re-asserted per route: a captureBeyondViewport shot resizes the
           surface behind our back, and the next page then lays out wrong. */
        await setViewport(width);
        await cdp.send("Page.navigate", { url }, sessionId);
        const loaded = await waitForLoad(cdp, sessionId);
        await sleep(opts.wait);
        const { result } = await cdp.send("Runtime.evaluate", {
          expression: SETTLE_SCRIPT,
          awaitPromise: true,
        }, sessionId);
        const title = result.value ?? "";

        let pageHeight = opts.height;
        if (opts.fullPage) {
          const { cssContentSize } = await cdp.send("Page.getLayoutMetrics", {}, sessionId);
          pageHeight = Math.ceil(cssContentSize.height);
        }

        const stem =
          `${opts.label}__${slug(route)}__${opts.locale ? `${opts.locale}__` : ""}${width}w`;
        const scale = Math.min(1, MAX_EDGE / Math.max(width, pageHeight));
        const overview = await capture(cdp, sessionId, {
          x: 0, y: 0, width, height: pageHeight, scale,
        });
        const file = path.join(outDir, `${stem}.png`);
        await writeFile(file, overview);
        count++;
        console.log(
          `${path.relative(process.cwd(), file)}  ${width}x${pageHeight}` +
          `${scale < 1 ? ` @${scale.toFixed(2)}` : ""}` +
          `${loaded ? "" : "  [load timed out]"}  "${title}"`,
        );

        if (opts.tiles && pageHeight > TILE_HEIGHT) {
          const n = Math.ceil(pageHeight / TILE_HEIGHT);
          for (let i = 0; i < n; i++) {
            const y = i * TILE_HEIGHT;
            const tile = await capture(cdp, sessionId, {
              x: 0, y, width,
              height: Math.min(TILE_HEIGHT, pageHeight - y),
              scale: 1,
            });
            const tileFile = path.join(outDir, `${stem}__part${i + 1}of${n}.png`);
            await writeFile(tileFile, tile);
            count++;
            console.log(`${path.relative(process.cwd(), tileFile)}  y=${y}`);
          }
        }
      }
    }
  } finally {
    cdp.close();
    child.kill();
    await rm(profile, { recursive: true, force: true }).catch(() => {});
  }

  if (!count) process.exitCode = 1;
}

main().catch((err) => {
  console.error(`shoot: ${err.message}`);
  console.error("\nIs the dev server up, on the port you passed as --base?  npm run dev\n");
  process.exitCode = 1;
});
