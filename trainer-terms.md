# Praxis trainer track — commercial terms

**For the trainer agreement, not the website.** The public copy on `/become-a-trainer` and `/praxis-programme` summarises these rules; this is the version that governs.

Derived from `tutto-pricing-handoff.md` §5, with the Tutto-sourced share set at 60%.
Last updated 16 September 2026.

## 1. Sourcing

A client is **trainer-sourced** only if their booking carries that trainer's tracked code. Any other client is **Tutto-sourced**.

The code is issued by Tutto, is unique to the trainer, and travels on the trainer's own links as `?trainer=CODE`. It is captured on the site, prefilled into the Cal.com booking as `trainerCode`, and stored against any enquiry the client sends. A booking with no code is Tutto-sourced; there is no retrospective reassignment.

## 2. Shares

| Client | Trainer keeps | Tutto keeps |
|---|---|---|
| Trainer-sourced | 80% of tuition paid | 20% |
| Tutto-sourced | 60% of tuition paid | 40% |

Shares are calculated on tuition **actually paid**, not on list price.

## 3. Delivery

Whoever delivers a session is paid for it.

## 4. Mixed delivery

Where one person delivers the intro session and another delivers the programme sessions:

- The intro fee (€250) goes to whoever delivered the intro, at the sourcing share for that client.
- The intro credit is deducted from the programme price. The programme trainer's share is calculated on the remaining tuition paid — normally €1,750, less any referral credits.
- Where sessions within a programme are split between trainers, tuition is divided per session delivered.

## 5. Referral credits

Referral credits are **opt-in per trainer, and opted out by default**.

- For an opted-in trainer, shares are calculated on tuition paid **after** referral credits.
- The credit is €250 per referred enrolment, capped at €1,000 per client (four referrals).
- A trainer may change their status for **future bookings only**, never for bookings already made.
- Referral credits do not apply to the trainer track itself.

## 6. Who funds a credit

Where a referral credit applies to a Tutto-sourced client placed with a trainer, or where it is unclear who generated the referral, Tutto and the trainer agree **in writing** how the credit is shared before the client's booking is confirmed.

## 7. Transparency

Each trainer's referral participation is shown to clients before they book.

> **Not yet implemented — this is the next thing to build.** The site has no trainer records, no directory, and no point in the booking flow where a client chooses a trainer, so there is nowhere to display this today. Until that surface exists, participation has to be disclosed by the trainer at the point of enquiry, which is a promise the site cannot keep on its own. Build spec: `handoff-trainer-directory.md`.

## Worked example

A trainer-sourced client taking the intro and then the full programme, delivered throughout by the same trainer, with two referrals:

| Line | Amount |
|---|---|
| Intro session | €250 |
| Programme, after intro credit | €1,750 |
| Less two referral credits (opted-in trainer) | −€500 |
| **Tuition paid** | **€1,500** |
| Trainer keeps (80%) | €1,200 |
| Tutto keeps (20%) | €300 |

The same client, Tutto-sourced, with the trainer opted out of referral credits:

| Line | Amount |
|---|---|
| Tuition paid (€250 + €1,750) | €2,000 |
| Trainer keeps (60%) | €1,200 |
| Tutto keeps (40%) | €800 |
