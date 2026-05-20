# 10 — Roadmap

This chapter lists what is currently being worked on and what has been considered but not built. Items are roughly ordered by priority and grouped by whether they are content, infrastructure, or mechanics work.

The current shipped version is **v3.0**, deployed at [hpvgame.pages.dev](https://hpvgame.pages.dev). The English language pack is structurally complete; the four stub personas are not yet written. The version string lives in `<meta name="game-version">` in `index.html` and is propagated to every analytics event so post-release changes can be filtered for in research.

## Active work

### Browser QA of the English language pack

The English content was machine-translated from the Serbian source via the Gemini API pipeline (chapter [09](09-i18n.md)). Structural validation passed; semantic and visual review in the browser has not yet been completed end-to-end. The two known classes of issue to look for:

- **CSS overflow.** English text is typically 10–15% longer than Serbian. Some button labels, meter labels, and card titles may wrap unexpectedly. Fix is per-element in `styles.css`.
- **Translation quality.** The glossary catches consistent technical terms but individual sentences can still read awkwardly. Per-item re-runs (`node scripts/translate.js scenario <i>` or `persona <i>`) are the granular fix; for one-line fixes, hand-editing the relevant `…en[i]` entry is faster.

### Four stub personas

Four personas exist with metadata only (`active: 0`):

| `id` | Name | Tag | Underlying root |
|---|---|---|---|
| `goran` | Goran | *"I'm suspicious of multinationals"* | Conspiracy / Big Pharma |
| `dragan` | Dragan | *"If it ain't broken, don't fix it"* | Unfounded beliefs — generational fatalism |
| `tijana` | Tijana | *"The body knows itself"* | Unfounded beliefs — natural is better |
| `maja` | Maja | *"The neighbour's daughter had a severe reaction"* | Fear / dreadful injuries — anecdote-driven |

Each needs `intro` (3–5 paragraphs), `start` meters, `doc`, four scenes, and the matching `endings` block. The workflow is in chapter [08 §4](08-extending.md#4-fill-in-a-stub-persona). Once written in Serbian, the Gemini pipeline produces the English version automatically.

The roots were chosen to cover the three Fasce categories not yet exemplified in the active four (Marija, Jelena, Sanja, Petar) and to broaden the demographic mix.

## Near-term infrastructure

### `validate.html`

Planned as a drag-and-drop validator for `personas.js`. The current development practice is to open the game in a browser and play through every persona end-to-end, which catches most errors but is slow and error-prone. `validate.html` would parse `personas.js` and report:

- Active personas with `scenes.length !== 4`.
- Scene 4 choices missing an `end:` field.
- `req:` tags referencing tags that no `unlock:` produces.
- `end:` values pointing to non-existent `endings:` blocks.
- `docVariants` keys referencing tags that no `unlock:` produces.
- Meter deltas (`imp:`) summing to values that exceed the `0–100` range across the scenario.

Implementation is a single HTML page with a `<input type="file">`, a small validator written against the same field rules `_TEMPLATE_persona.js` documents, and a results panel. No build step; matches the rest of the architecture.

## Mechanics ideas (lower priority)

Each of these has been discussed but not committed to. They are listed here so a future contributor (or the project owner returning after a break) knows the design space, not the implementation plan.

### More scenes per persona / scenario

The hard-coded "four scenes per persona" and "four steps per scenario" is enforced in `engine.js` (pip rendering, step index logic) and assumed throughout. Lifting the limit requires:

- Parameterising pip rendering off `scene.length` / `steps.length` (already done for personas — Game 02 already shows `scenes.length + 1` pips).
- Updating progress copy ("Step 2/4 ·") to use the actual length.
- Adjusting `computeHcpMax()` to assume the same per-step ceiling regardless of step count (or, more honestly, per-step-type max so 4 affirm + 2 facts doesn't claim 80 trust from affirm alone).

The pedagogical case: some attitude roots need more than one refute attempt to address; a longer scenario could model a more realistic difficult conversation.

### Trust/will carry-over between HCP scenarios

Currently, each scenario resets to its own `startTrust` / `startWill`. A session is a series of independent conversations. The argument for carry-over:

- The session-as-shift metaphor (consecutive parents, same doctor) is more realistic.
- A consistently bad early conversation should plausibly affect the doctor's emotional resources in the next.

The argument against:

- A single bad scenario early would discourage rather than teach.
- The pedagogical reset between scenarios is the whole point of practice — each scenario is a clean attempt.

If implemented, the reasonable compromise is a *blended* carry-over: 50% of the previous final state, 50% of the scenario's `startTrust`. Tunable.

### Adaptive scenario selection

Today the scenario picker is a flat grid in fixed order. An adaptive version would:

- Track which attitude roots the player has been weakest on (low `totalRoots` rate for that root's scenarios in their session log).
- Surface the next scenario that targets that root.

This is a research-grade question — the right algorithm depends on what the project considers a "weakness". Implementation is relatively small once the goal is decided.

### Mid-game debrief

After every 2–3 scenarios, show a one-screen reflection: which attitude roots you misidentified, which step quality you've been strongest/weakest at, which scenario type you should try next. The data is already in `S.hcpScenarioLog` plus a session-level rollup.

The friction is pedagogical pacing: a debrief in the middle of a workshop disrupts flow. This is probably better as a per-workshop *facilitator* tool (i.e. built into `stats.html`) than a per-player interruption.

### HCP branching via `unlock` / `req`

The Parent game has a small but effective branching system: `unlock` tags pushed by choices, `req` filters on subsequent choices, `docVariants` adapting the doctor's line based on accumulated tags. The HCP game is currently linear by comparison.

Importing the same mechanic into HCP would let a single scenario branch — e.g. a parent who hears a *good* affirmation reveals a deeper concern (`unlock: "deeper"`); a player who reaches that branch faces a more difficult Step 3. The content authoring cost is roughly 2× the current; the pedagogical payoff is exposure to mid-conversation derailments.

## Hosting and operations

These are already complete and listed for completeness:

- **Cloudflare Pages deploy** — automatic on push to `main`. Live at [hpvgame.pages.dev](https://hpvgame.pages.dev).
- **Supabase analytics** — `events` table, RLS configured, publishable key embedded in `analytics.js`.
- **Gemini translation pipeline** — script + `.env` configuration documented in chapter [09](09-i18n.md).

No active work is needed on any of these unless the upstream services change. The Supabase publishable key would need to be rotated if exposed beyond its existing RLS protection.

## What is explicitly *not* on the roadmap

A few items have been considered and deliberately rejected. They are listed here so they do not get rediscovered:

- **A user account system.** Anonymity is a core design property. A login would let the project link cross-device sessions and survey responses to gameplay, but it would also break the opt-in trust model that lets workshops collect data without a consent step beyond the privacy notice.
- **A native mobile app.** The web version works in mobile browsers. Building a native shell would add a release cycle and an app-store gate for a benefit (PWA-style offline play) that the current Cloudflare Pages caching already delivers.
- **A build step / bundler.** Considered briefly when adding the language pack. Rejected because the current edit-then-refresh loop is the project's biggest contributor productivity advantage. Will be revisited if the codebase grows past ~5,000 lines or if multiple developers need to work on the engine simultaneously.
- **Server-side analytics validation.** Currently any client could POST arbitrary events to the `events` table. RLS prevents reads; it does not prevent garbage writes. The trade-off is accepted because the dataset is small enough to clean manually if needed and the alternative (a server) is large.

---

*Related:* [02 — Background](02-background.md) for the audiences these items serve. [08 — Extending](08-extending.md) for how to actually do the content work above.
