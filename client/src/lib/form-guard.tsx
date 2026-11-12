import { useEffect, useRef } from "react";

/**
 * The client half of server/form-guard.ts. Every public form sends two extra
 * fields: `formToken`, a signed timestamp fetched when the form appears, and
 * `website`, a honeypot input that people never see.
 *
 * The server drops anything sent under three seconds after the token was issued.
 * A person almost never manages that, and if they do, `guardFields` simply waits
 * out the rest of the gap, so a real submission is never thrown away.
 */

const MIN_AGE_MS = 3200;

type Token = { token: string; at: number } | null;
let pending: Promise<Token> | null = null;

function fetchToken(): Promise<Token> {
  return fetch("/api/form-token", { credentials: "same-origin" })
    .then((r) => (r.ok ? r.json() : null))
    .then((d) => (d?.token ? { token: d.token as string, at: Date.now() } : null))
    .catch(() => null);
}

/** Start fetching a token now, so it has aged by the time the visitor submits. */
export function primeFormToken() {
  if (!pending) pending = fetchToken();
  return pending;
}

/** The extra fields to spread into a form's JSON body. */
export async function guardFields(honeypot = ""): Promise<{ formToken?: string; website: string }> {
  let t = await primeFormToken();
  if (!t) {
    // The first fetch failed (offline for a moment?). Try once more; if that
    // fails too, send without a token: the server flags it but still delivers it.
    pending = fetchToken();
    t = await pending;
  }
  if (!t) return { website: honeypot };
  const wait = t.at + MIN_AGE_MS - Date.now();
  if (wait > 0) await new Promise((r) => setTimeout(r, wait));
  return { formToken: t.token, website: honeypot };
}

/**
 * For React forms: render `honeypot` anywhere inside the <form> and spread
 * `await fields()` into the body you post.
 */
export function useFormGuard() {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    primeFormToken();
  }, []);
  const honeypot = (
    <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", top: "auto", width: 1, height: 1, overflow: "hidden" }}>
      <label>
        Website
        <input ref={ref} type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
      </label>
    </div>
  );
  return { honeypot, fields: () => guardFields(ref.current?.value ?? "") };
}
