# tutto.one

## Writing copy

Everything a visitor reads should sound like Daniel, not like Claude. Before
writing or editing any copy (pages, `client/src/lib/*` copy files, French
overlays, blog posts, course HTML), read `VOICE.md`: it profiles his voice and
has a matrix of Claude's habits, how to spot each one, and what to write
instead.

After a copy change, run the checker on the files you touched and fix what it
flags, using the matrix:

```
node scripts/voice-check.mjs <changed files>
```

It is advisory. It greps for the patterns it can see (em dashes, "X, not Y",
American spelling, Claude's pet words and so on); the tone rows in `VOICE.md`
still need a read. Don't mass-rewrite old copy to clear flags unless Daniel
asks; fix what you touch.

No em dashes anywhere, in English or French.

## Admin login bypass (dev only, never production)

`ADMIN_DEV_BYPASS=1` lets Daniel use /admin on his own machine without
signing in. It is only ever a local dev feature: nobody else may reach admin
without a login, ever. The guard in `server/admin-routes.ts` (above
`requireAdmin`) needs development mode, not running on Replit, and a
request from this machine with no proxy headers. Never loosen those checks,
never set `ADMIN_DEV_BYPASS` in Replit secrets, a deployment or any shared
`.env`, and never add another route or flag that skips `requireAdmin`.
