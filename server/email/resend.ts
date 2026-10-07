import { Resend } from "resend";

// Constructed lazily. `new Resend(undefined)` throws, and at module scope that
// crashes the whole server at import time in any environment without the key
// set — including local development.
let _resend: Resend | null = null;
export function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY);
  return _resend;
}
