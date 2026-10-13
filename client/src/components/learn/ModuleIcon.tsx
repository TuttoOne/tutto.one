/**
 * The hand-drawn session icons on /learn. Each module in
 * shared/learn-programmes.ts names one; the same drawings sit on the
 * Background Italia week 1 page, so the dashboard and the handouts match.
 *
 * The wobble is an SVG displacement filter over clean paths, so a drawing
 * stays a few short lines to edit. Foundations sessions sit on an amber blob,
 * building sessions on slate, as on the programme timeline.
 */
import { useId, type ReactNode } from "react";
import type { ModuleIcon as IconName } from "@shared/learn-programmes";

const AMBER = "#d97706";
const INK = "#1a1a1a";
const BLOB = { foundations: "#fcefdf", building: "#e8edf2" } as const;

const S = { fill: "none", stroke: INK, strokeWidth: 2.3, strokeLinecap: "round", strokeLinejoin: "round" } as const;
const A = { ...S, stroke: AMBER, strokeWidth: 2.6 } as const;
const COVER = { fill: "#fff" } as const;

const DRAWINGS: Record<IconName, { blob: string; body: ReactNode }> = {
  rules: {
    blob: "M10 24c3-11 19-17 32-14s18 15 15 27-16 20-29 18S7 36 10 24z",
    body: (
      <>
        <path {...S} d="M17 12.5 39.5 11l7 7.5-.6 34L17.4 53z" />
        <path {...S} d="M39.5 11.4v7h6.8" />
        <path {...A} d="m21.5 22.5 2.3 2.4 4.4-4.6M21.5 31.5l2.3 2.4 4.4-4.6" />
        <path {...S} d="M31.5 23H41M31.5 32h8M22 41h10" />
        <rect {...COVER} x="37" y="39" width="17" height="14" rx="2.5" />
        <path {...A} d="M37.2 39.4 53.8 39l.2 13.8-16.6.4z" />
        <path {...A} d="M40.5 39v-3.8a5 5 0 0 1 10 0V39" />
        <path {...A} d="M45.5 44.5v3" />
      </>
    ),
  },
  scorecard: {
    blob: "M12 18c8-9 26-10 36-3s12 22 5 31-24 13-34 7S4 27 12 18z",
    body: (
      <>
        <path {...S} d="M13.5 15.5 47 14.5l.8 35.5-34 1z" />
        <circle {...S} cx="20" cy="25" r="1.6" />
        <circle {...S} cx="20" cy="33" r="1.6" />
        <circle {...S} cx="20" cy="41" r="1.6" />
        <path {...S} d="M25 25h16M25 33h10M25 41h13" />
        <path {...A} d="m37 15 6 7.5L57 5" />
      </>
    ),
  },
  signpost: {
    blob: "M9 30c1-12 14-21 27-20s21 10 20 22-10 22-24 22S8 42 9 30z",
    body: (
      <>
        <path {...S} d="M32.3 15.5 31.8 54M23.5 54.3h17" />
        <circle {...S} cx="32" cy="12.5" r="2.4" />
        <path {...A} d="M32.5 18.5h15.5l5 4-5 4.3H32.5" />
        <path {...S} d="M31.8 30.5H16.5l-5 4.2 5 4.1h15.3" />
      </>
    ),
  },
  pencil: {
    blob: "M11 21c6-10 23-14 34-8s15 21 9 31-22 14-32 9S5 31 11 21z",
    body: (
      <>
        <path {...S} d="M12 15.5h19M12 22.5h13" />
        <path {...S} d="M28.5 43.5 50 22l6 6-21.5 21.5z" />
        <path {...S} d="m46 26 6 6" />
        <path {...S} d="m28.5 43.5-3.2 9.3 9.2-3.3" />
        <path {...A} d="M9 51c3-4 5-1 8-3.5s4.5-3 7-.5" />
      </>
    ),
  },
  plug: {
    blob: "M8 28c2-12 17-19 30-17s20 12 18 24-13 20-27 19S6 40 8 28z",
    body: (
      <>
        <path {...S} d="M10 21.5V48h30.5V25.5H26l-4-4.2z" />
        <path {...A} d="M40.5 37c6 0 5.5-7 11.5-7" />
        <path {...S} d="M52 25h7v10.5h-7z" />
        <path {...S} d="M59 28h3.5M59 32.5h3.5" />
      </>
    ),
  },
  magnifier: {
    blob: "M10 25c4-12 20-17 32-13s17 16 13 28-18 18-30 14S6 36 10 25z",
    body: (
      <>
        <path {...S} d="M13.5 10.5h24.5l.4 39.5h-25z" />
        <path {...S} d="M18.5 18h14M18.5 25h12M18.5 32h7" />
        <circle {...COVER} cx="40" cy="38" r="10" />
        <circle {...S} cx="40" cy="38" r="10" />
        <path {...S} d="m47.2 45.3 8 8" />
        <path {...A} d="m35 38.3 3.2 3.2 6.4-6.6" />
      </>
    ),
  },
  gear: {
    blob: "M9 31c0-13 13-22 26-21s22 11 21 23-12 21-25 21S9 44 9 31z",
    body: (
      <>
        <circle {...S} cx="28" cy="35" r="9" />
        <circle {...S} cx="28" cy="35" r="3.3" />
        <path {...S} d="M37 35h4M34.4 41.4l2.8 2.8M28 44v4M21.6 41.4l-2.8 2.8M19 35h-4M21.6 28.6l-2.8-2.8M28 26v-4M34.4 28.6l2.8-2.8" />
        <path {...A} d="M39 17a8 8 0 1 1 8 8" />
        <path {...A} d="m50 22-3 3 3 3" />
      </>
    ),
  },
  robot: {
    blob: "M11 26c3-12 18-18 31-15s17 16 14 28-17 18-29 15S8 38 11 26z",
    body: (
      <>
        <path {...S} d="M16.5 22.5 47.5 22l.5 26-31.5.5z" />
        <path {...S} d="M32 22v-7.5" />
        <circle {...A} cx="32" cy="12" r="2.6" />
        <circle {...S} cx="25" cy="33" r="2.8" />
        <circle {...S} cx="39" cy="33" r="2.8" />
        <path {...S} d="M26 41.5c3.5 2 8.5 2 12 0" />
        <path {...S} d="M16.5 30h-4v10h4M47.8 30h4v10h-4" />
        <path {...A} d="M55 7v6M52 10h6" />
      </>
    ),
  },
};

export function ModuleIcon({
  name,
  size = 48,
  tone = "foundations",
}: {
  name: IconName;
  size?: number;
  tone?: keyof typeof BLOB;
}) {
  // One filter per drawing: ids must be unique on a page with eight of them.
  const filterId = `pencil-${useId().replace(/:/g, "")}`;
  const drawing = DRAWINGS[name];
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" focusable="false" style={{ flex: "none", display: "block" }}>
      <filter id={filterId} x="-10%" y="-10%" width="120%" height="120%">
        <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves={2} seed={7} result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale={2.4} xChannelSelector="R" yChannelSelector="G" />
      </filter>
      <g filter={`url(#${filterId})`}>
        <path d={drawing.blob} fill={BLOB[tone]} />
        {drawing.body}
      </g>
    </svg>
  );
}
