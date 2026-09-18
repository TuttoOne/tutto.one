# Handoff: trainer directory and per-trainer disclosure

**Owner:** Daniel Forsthofer
**Date:** 16 September 2026
**Status:** Next step. Not built.
**Source:** `tutto-pricing-handoff.md` §2g, plus §7 of `trainer-terms.md`.

## Why this exists

The September 2026 pricing change made a trainer's referral participation a term the client is affected by. Handoff 2g requires that, wherever a client can choose or book a trainer, the site shows:

- whether that trainer takes part in referral credits
- the trainer's languages and format (online or in person)

None of that shipped with the pricing change, because there is nowhere to put it. The site has no trainer records, no directory, no trainer profiles, and no point in any flow where a client picks a trainer. Every booking button is a link to one shared Cal.com account (`cal.com/tuttoone`). So 2g is not a copy change that was missed — it is a feature that has to be built first.

Until it exists, referral participation has to be disclosed by the trainer at the point of enquiry, which is a promise to a client that the site cannot keep on its own.

## What already exists to build on

| Piece | Where | State |
|---|---|---|
| Trainer code capture and persistence | `client/src/lib/trainer-code.ts` | Built. Reads `?trainer=CODE`, stores under `tutto.trainer`, appends `trainerCode` to Cal.com links. |
| Attribution on enquiries | `shared/schema.ts` → `contact_submissions.trainer_code` | Built and migrated. |
| Trainer recruitment page | `client/src/pages/become-a-trainer.tsx` | Built. Sells the track; is not a directory. |
| Payment rules, client-facing | `/become-a-trainer`, "How Trainers Are Paid" | Built. States that credits are opt-in, but not who has opted in. |
| Contract terms | `trainer-terms.md` | Written. §7 is the clause this work satisfies. |
| Admin-editable content | `site_content` table, `server/admin-routes.ts`, `/admin` | Built, and the likely place to manage trainer records without a new CMS. |

## What has to be built

### 1. A trainer record

New table. Minimum viable shape:

```
trainers
  id
  code              -- the tracked code already used by ?trainer=
  name
  slug              -- for a profile URL
  languages         -- e.g. ["en", "fr"]
  formats           -- online | in-person | both
  region            -- where in-person is possible
  referralCredits   -- boolean, opt-in, default FALSE
  bookingUrl        -- this trainer's own Cal.com link
  bio, photo        -- optional
  active            -- boolean
```

`referralCredits` defaults to **false**: opted out unless the trainer opts in, per `trainer-terms.md` §5. A trainer's change of status applies to future bookings only, so the record needs either an effective-from date or an append-only history — decide which before the first trainer opts in, because retrofitting it is much harder.

### 2. Surfaces where the disclosure appears

- **A trainer directory**, listing active trainers with languages, format and referral participation.
- **A trainer profile**, one per trainer, at `/trainers/:slug`.
- **The booking step**, wherever a client picks a trainer — the disclosure must be visible *before* the booking is confirmed, not after.
- **`/praxis-programme`**, which currently sends everyone to one shared enquiry form. It should be able to route to a chosen trainer.

### 3. Booking per trainer

This is the hard part and the reason to scope carefully. Today there is one Cal.com account. Options, roughly in increasing order of cost:

1. **Per-trainer Cal.com link on the trainer record.** Cheapest. Each trainer brings their own Cal.com (or equivalent), the directory links to it, and the trainer code rides along as it does now. Attribution and disclosure both work. Tutto does not see the calendar.
2. **Cal.com team with round-robin or per-member links.** Keeps everything under one account and one set of booking questions. Costs a Cal.com team seat per trainer.
3. **On-site booking.** Full control, and the only option that makes "stored against the booking" literally true. Much more work, and it puts availability management on us.

Option 1 is the recommendation unless you want Tutto to own the calendar.

### 4. Copy

Already specified in the handoff, EN and FR:

> **EN:** Referral credits: accepted / not offered
> **FR:** Crédits de parrainage : acceptés / non proposés

Add to `client/src/lib/i18n.ts` under a new `trainers` section, following the `{ en, fr }` leaf convention. Languages and format need their own label pairs.

## Acceptance criteria

- [ ] A client can see, before booking, whether the trainer they are about to book offers referral credits
- [ ] Languages and format (online / in person) shown on the same surface
- [ ] Referral participation defaults to not offered, and only an explicit opt-in changes it
- [ ] Changing a trainer's participation does not alter bookings already made
- [ ] The trainer's code is carried into the booking, so the 80% / 60% split resolves correctly
- [ ] EN and FR match on every string
- [ ] Directory and profile checked at 390px

## Open questions for Daniel

1. How many trainers will exist in the next six months? One or two argues for a hand-maintained record in `site_content`; a dozen argues for a real table and an admin screen.
2. Does Tutto own the booking calendar, or does each trainer bring their own? This decides §3 above and is the largest cost in the piece.
3. Should a client be able to *choose* a trainer, or only be *assigned* one? 2g says "wherever a client can choose or book a trainer" — if the answer is that Tutto always assigns, the disclosure moves to the confirmation step and the directory becomes optional.
