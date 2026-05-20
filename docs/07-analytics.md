# 07 — Analytics

Every meaningful click in the game is logged to a Supabase Postgres table for research analysis. This chapter is the reference for the event vocabulary, the payload structure, the workshop-grouping mechanism, and the facilitator dashboard built on top.

The design priorities are, in order:

1. **No game blocking.** Network failures must never affect gameplay. Every `track()` call is fire-and-forget; errors are silently swallowed.
2. **Anonymity at source.** No names, no emails, no IPs. Identity is a per-browser UUID with no link to the user.
3. **Opt-out is one click.** A link on the role-selection screen sends a `consent_revoked` marker and disables further logging permanently for that browser.
4. **Workshop-friendly.** Sessions from one workshop can be grouped under a shared identifier via a URL parameter, without any sign-in step for the participants.

## 1. The `events` table

A single Supabase table holds everything. The schema is:

| Column | Type | Notes |
|---|---|---|
| `id` | `bigserial` | Primary key. |
| `created_at` | `timestamptz` | Default `now()`. Server-side, not from client. |
| `session_id` | `uuid` | Anonymous per-browser id. Stable across sessions until the user clears localStorage. |
| `workshop_id` | `text` (nullable) | The `?w=` URL param, if present at page load. `null` for organic visits. |
| `event_type` | `text` | One of the twelve types in §2. |
| `payload` | `jsonb` | Event-specific data + the four common fields below. |

### Row-Level Security (RLS)

Anonymous clients (the game) have **`INSERT` only** on `events`. They cannot read what they wrote, nor anything else. Reads require Supabase Auth — that is the gate behind `stats.html` and `admin.html`.

The anonymous client uses the *publishable* Supabase key (`sb_publishable_…`), which is safe to embed in client-side code precisely because of this RLS configuration. The full URL and key are configured at the top of `analytics.js`:

```js
const ANALYTICS = {
  url: "https://xahvkqtmguflkzixxysz.supabase.co",
  key: "sb_publishable_…",
  enabled: true
};
```

## 2. The event vocabulary

Twelve event types fire across the game. Three come from `analytics.js` (life-cycle), the rest from `engine.js` (gameplay).

| `event_type` | Fires when | Source |
|---|---|---|
| `page_load` | Page loads (every visit). | `analytics.js:144` |
| `session_end` | Tab closes or user navigates away. Sent via `pagehide` with `keepalive`. | `analytics.js:164` |
| `consent_revoked` | User clicks the privacy opt-out link on the role screen. After this fires, the same browser sends nothing else for the same session id. | `analytics.js:36` |
| `game_enter` | User picks HCP or Parent from the role screen. | `engine.js:86` |
| `hcp_profile_pick` | User selects one of the four HCP profiles. | `engine.js:105` |
| `hcp_scenario_start` | User opens a scenario from the picker. | `engine.js:141` |
| `hcp_choice` | User clicks any option in any ERI step. **One row per attempt** (retry mode fires several times per step). | `engine.js:273` |
| `hcp_scenario_end` | Scenario ends, ending is shown. | `engine.js:390` |
| `parent_persona_start` | User opens a persona's intro card. | `engine.js:449` |
| `parent_choice` | User picks an emotion/inner-monologue option in any scene. | `engine.js:591` |
| `parent_ending_shown` | Final scene resolves to an ending branch. | `engine.js:627` |
| `parent_final_reflection` | User picks one of the four `opts` lines on the ending screen. | `engine.js:645` |

There is no `hcp_step_start` or `parent_scene_start` event — those are inferred from the next `*_choice` row in the same `session_id` if needed. The events are deliberately minimal at the boundaries and verbose at the action.

## 3. The payload — what every event carries

`track()` (`analytics.js:112`) wraps every event's payload with four common fields before POSTing:

```js
payload: Object.assign(
  { t_ms: Date.now() - ANALYTICS_T0,   // ms since page load
    ver:  ANALYTICS_VER,               // from <meta name="game-version">
    mode: ANALYTICS_MODE,              // "retry" | "sim", from ?mode= param
    lang: _gameLang() },               // "sr" | "en"
  payload || {}
)
```

So every row in `events` can be filtered by *when* in the session it happened, *which version* of the game was running, *which play mode*, and *which language*. None of these need to be passed by each individual `track()` call site.

### Event-specific payload fields

The most interesting payloads:

**`hcp_choice`** — every click in Game 01:

```js
{ scenarioIdx, stepIdx, stepType,           // "root"|"affirm"|"refute"|"facts"
  optionIdx, optionText,                    // optionText truncated to 140 chars
  quality, isCorrect, attemptIdx,           // attemptIdx = 1, 2, … within step
  trust, will, dTrust, dWill }              // meter state + delta from this click
```

**`hcp_scenario_end`** — outcome of a Game 01 scenario:

```js
{ scenarioIdx, outcome,                     // "good" | "mid" | "bad"
  trust, will }                             // final meter values
```

**`parent_choice`** — every click in Game 02:

```js
{ personaIdx, sceneIdx, sceneTitle,
  choiceIdx, em, inner,                     // em, inner truncated
  imp,                                      // {anks, sas, otv, dec} deltas
  unlock, endTrigger,                       // unlock tag pushed; end key set (if any)
  anks, sas, otv, odluka,                   // post-click meter values
  dAnks, dSas, dOtv, dOdluka }              // deltas this click
```

**`parent_ending_shown`** — Game 02 ending fired:

```js
{ personaIdx, ending,                       // "best"|"rushed"|"delayed"|"mid"|"pending"|"closed"
  anks, sas, otv, odluka,
  path,                                     // copy of S.pPath — all unlock tags accumulated
  nChoices }                                // number of choices the player made
```

**`session_end`** — fires once per tab via `pagehide`:

```js
{ duration_ms,                              // total session length
  last_screen,                              // S.screen at the moment of close
  path }                                    // location.pathname
```

A `_SESSION_END_SENT` flag prevents duplicates within a tab, but a bfcache restore (back-button return) does not reset the flag — this is a known and accepted trade-off for simplicity.

## 4. Identifying a player — `session_id`

When the page first loads, `analytics.js` generates a UUID v4 and stores it under `localStorage["ondk_sid_v1"]`. Every subsequent event from the same browser carries the same `session_id` *until the user clears localStorage*.

This means:

- **One person, one device, many days** appears as a single session id with multiple `page_load` events at different timestamps. Use `MIN(created_at)` / `MAX(created_at)` to find their first and last visit.
- **One person, multiple devices** appears as multiple session ids. They cannot be joined — the design refuses to.
- **Multiple people on one device** (e.g. a shared workshop laptop) appear as one session id and cannot be separated.

The trade-off is between research granularity and unbreakable anonymity. The project chose anonymity.

## 5. Identifying a workshop — `workshop_id`

A workshop facilitator generates a QR code via `qr.html` (chapter [04 §9](04-architecture.md#9-facilitator-tools)) with a slug, e.g. `novi-sad-2026-05`. The QR resolves to:

```
https://hpvgame.pages.dev/?w=novi-sad-2026-05
```

`analytics.js` reads `?w=` once at page load (`_analyticsWorkshopId()`, `analytics.js:70`) and includes it on every event from that session. Stats can then filter by workshop, group events across multiple participants, and produce per-workshop reports.

A typical convention is `<city-or-context>-<YYYY>-<MM>`, e.g. `kme-beograd-2026-juni`. The slug is free text — the engine does not validate or interpret it — but `qr.html` lowercases and de-spaces input as a convenience.

## 6. The consent model

The role-selection screen (`s-role`) shows a one-paragraph privacy notice with an opt-out link:

> *Privacy: Choices are anonymously logged for research effectiveness. No names, emails, or IPs are collected; there is no tracking outside this tool. If you do not want to participate, click [here].*

Clicking the link calls `setAnalyticsConsent(false)`:

1. Sends one final `consent_revoked` event (with no payload) so the researcher knows when the opt-out happened and can purge upstream events for the same `session_id` if they choose to.
2. Writes `"declined"` to `localStorage["ondk_analytics_consent_v1"]`.
3. From this point on, `track()` short-circuits at the first line: `if (_consentDeclined()) return;`.

There is no opt-in / opt-out toggle in-game once declined. To re-enable, the user has to clear localStorage. This is intentional — making opt-out reversible only via "clear cache" is more honest about what re-consent would mean.

## 7. The facilitator dashboard — `stats.html`

`stats.html` is a single-page dashboard built on the same vanilla stack as the game. It authenticates via Supabase Auth (email + password), reads `events`, and renders nine tables plus several summary cards. Highlights:

- **Two filter rows** at the top:
  - *Workshop*: dropdown rebuilt from the full `_ALL_EVENTS` cache (so filtering by workshop never empties the dropdown).
  - *Mode*: `Svi · Retry · Simulacija · Nepoznato` toggle pills.
  - *Language*: `Svi · SR · EN · Nepoznato` toggle pills.
- **Live mode** — auto-refresh every 10s; useful during a workshop.
- **CSV export** on every table — `↓ CSV` button generates a UTF-8-BOM CSV with the table's exact contents (honoring rowspans, escaping commas, filename pattern `hpv-stats-<slug>-<YYYY-MM-DD>.csv`).
- **Per-option distribution** for HCP scenarios — pick a scenario, see which options were chosen at each ERI step, optionally split by mode.
- **Session depth** — distribution of how many distinct HCP scenarios / personas each session played.

Filters are in-memory (`applyFilters()`); a network refetch only happens when the user explicitly reloads. The meta line at the top of the dashboard shows which filters are active (e.g. *"Showing 412 of 1284 events · mode=sim, lang=en"*).

## 8. The SQL cheat-sheet — `notes/queries.sql`

For analysis outside `stats.html` (e.g. research papers, ad-hoc questions), `notes/queries.sql` ships a set of paste-into-Supabase queries organised in six sections:

1. **Overview** — sessions / page loads / completions per day; per-workshop breakdown; mode split.
2. **HCP game** — outcome per scenario, ERI step quality, option distribution, retry funnel.
3. **Parent game** — ending distribution, scene funnel, final meter values.
4. **Sessions** — depth bucketing, duration from `session_end`, last screen, returning visitors.
5. **Comparisons** — retry vs. sim splits; A-vs-B variant comparisons.
6. **Time series** — week-by-week trends.

The file is heavily commented in Serbian; an English-speaking analyst can read past the section headers because the SQL itself is portable.

## 9. Privacy-relevant guarantees, restated

- No PII is collected. No names, emails, IP addresses are stored. Supabase logs IPs at the request level by default but those logs are separate from the `events` table.
- Session id is a client-generated UUID, never derived from any user property.
- Opt-out is honoured immediately and irreversibly within the same browser/session.
- Workshop id is *explicit and opt-in* — set only when a participant scans a QR code that has it. A user who navigates directly to the game URL has no workshop id.
- Anonymous clients cannot read the table. Even if the client were modified, RLS prevents exfiltration.
- The whole event log can be exported (Supabase Studio → Table Editor → CSV) or queried (SQL Editor) by an authenticated researcher; nothing about the design hides data from the project owner.

## 10. Adding a new event

To track a new in-game interaction:

1. Pick a verb-noun `event_type` string consistent with the existing naming (`<game>_<noun>` for game events, `<state>_<verb>` for life-cycle).
2. In the relevant engine function, add:
   ```js
   track("hcp_step_skip", { scenarioIdx, stepIdx, reason: "facilitator_demo" });
   ```
3. No schema change is needed — `payload` is `jsonb`.
4. Document the event in this chapter and add a query for it in `notes/queries.sql` if it's research-relevant.

The events table is intentionally a free-form ledger. New events do not break old queries; old events remain valid forever. The cost of this freedom is that schema-drift problems must be caught by `notes/queries.sql` testing rather than by the database itself.

---

*Related:* [04 — Architecture §8](04-architecture.md#8-analytics-in-one-paragraph) for the architectural placement. [10 — Roadmap](10-roadmap.md) lists planned analytics extensions.
