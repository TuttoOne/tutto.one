/**
 * Regenerates `client/src/lib/usecase-runs.ts` from `client/public/usecase/data.js`.
 *
 * `data.js` is what the recorder on the workstation writes (see
 * `client/public/usecase/README.md`); this turns it into the typed module the
 * page imports, so a rebuild is still "drop in data.js, run this".
 *
 *   node script/usecase-runs.mjs
 *
 * Only the fields the page actually renders are carried across. The recorder
 * also stamps each stage and note with the second it printed at; the player
 * paces off note counts rather than those, so they are dropped here.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = resolve(root, "client/public/usecase/data.js");
const target = resolve(root, "client/src/lib/usecase-runs.ts");

const sandbox = { window: {} };
new Function("window", readFileSync(source, "utf8"))(sandbox.window);
const runs = sandbox.window.__DEMO_DATA__;
if (!Array.isArray(runs) || !runs.length) throw new Error(`No runs found in ${source}`);

const s = (v) => JSON.stringify(v);

const body = runs
  .map(
    (r) => `  {
    id: ${s(r.id)},
    tab: ${s(r.tab)},
    sector: ${s(r.sector)},
    who: ${s(r.who)},
    title: ${s(r.title)},
    problem: ${s(r.problem)},
    caught: ${s(r.catch)},
    real: ${r.real},
    stages: [
${r.stages
  .map(
    (st) => `      {
        label: ${s(st.label)},
        notes: [${st.notes.map((n) => `\n          ${s(n.text)},`).join("")}
        ],
      },`,
  )
  .join("\n")}
    ],
    summary: [
${r.summary.map((row) => `      { key: ${s(row.key)}, value: ${s(row.value)} },`).join("\n")}
    ],
    downloads: [
${r.downloads
  .map(
    (f) =>
      `      { name: ${s(f.name)}, size: ${f.size}, kind: ${s(f.kind)}, href: ${s(
        f.href.startsWith("files/") ? `/usecase/${f.href}` : f.href,
      )} },`,
  )
  .join("\n")}
    ],
  },`,
  )
  .join("\n");

writeFileSync(
  target,
  `/**
 * The three recorded runs behind /usecase.
 *
 * Generated — do not hand-edit. Run \`node script/usecase-runs.mjs\` after the
 * recorder on the workstation drops a new \`client/public/usecase/data.js\`.
 *
 * The stages, their order, the lines they printed and the files they produced
 * are exactly what three real runs did. French for every string here lives in
 * \`lib/fr/usecase.ts\`, keyed on the English.
 */

export type UseCaseStage = {
  label: string;
  /** The lines the stage printed, in the order it printed them. */
  notes: string[];
};

export type UseCaseRun = {
  id: string;
  /** Short label on the tab. */
  tab: string;
  sector: string;
  who: string;
  title: string;
  problem: string;
  /** What the run caught that a person would have missed. \`catch\` is reserved. */
  caught: string;
  /** How long the real run took, in seconds. */
  real: number;
  stages: UseCaseStage[];
  summary: { key: string; value: string }[];
  downloads: { name: string; size: number; kind: string; href: string }[];
};

export const USE_CASE_RUNS: UseCaseRun[] = [
${body}
];
`,
  "utf8",
);

console.log(
  `Wrote ${target} — ${runs.length} runs, ${runs.reduce((n, r) => n + r.stages.length, 0)} stages.`,
);
