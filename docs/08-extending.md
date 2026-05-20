# 08 — Extending the game

This chapter is the practical companion to the rest of the documentation. It walks through the five most common change requests:

1. Add a new persona (Game 02)
2. Add a new HCP scenario (Game 01)
3. Edit or add a UI string
4. Fill in one of the four stub personas
5. Add a third language

Each section is a step-by-step recipe. The chapter assumes the conceptual background of chapters [05](05-game-01-hcp.md) and [06](06-game-02-parent.md), and the language-pack mechanics of [09](09-i18n.md).

## 1. Add a new persona (Game 02)

A persona is a self-contained object in `personas.js`. The fastest path to a working new persona is to copy `_TEMPLATE_persona.js`, fill in the fields, and run the translator.

### Step 1 — copy the template

`_TEMPLATE_persona.js` is one large object with field-by-field comments. Open it, select everything from the opening `{` to the closing `}` (inclusive — *do not* take the wrapping `/* … */`), and copy.

### Step 2 — paste into `personas.js`

Open `personas.js`. The structure is:

```js
const PERSONAS = {
  sr: [
    {id:"marija", active:1, name:"Marija", … },
    {id:"jelena", active:1, name:"Jelena", … },
    {id:"sanja",  active:1, name:"Sanja",  … },
    {id:"petar",  active:1, name:"Petar",  … },
    {id:"goran",  active:0, …},     // stub
    {id:"dragan", active:0, …},     // stub
    {id:"tijana", active:0, …},     // stub
    {id:"maja",   active:0, …}      // stub
  ],
  en: [ /* mirror — managed by scripts/translate.js */ ]
};
```

Paste the new persona **into the `sr:` array, before the first stub**. The order of active personas controls their display order on the picker screen.

### Step 3 — fill in the required fields

Following the template comments:

- `id` — unique lowercase Latin slug, no spaces. Used in `localStorage`. Never change it after a persona is published.
- `active: 0` — leave at `0` while writing. Set to `1` only when content is complete.
- `name`, `tag`, `hook` — display name (kept in Serbian even in EN), one-line characterisation (player-visible), one-line context (facilitator-only).
- `intro` — 3–5 paragraphs introducing the persona to the player.
- `start: { anks, sas, otv, dec }` — opening meter values. See [06 §3](06-game-02-parent.md#3-the-four-meters) for ranges.
- `startWhy` (flat sentence) **or** `startWhyBy` (per-meter explanation) — at least one is required.
- `doc: { i, l }` — doctor avatar initials and label.
- `scenes` — four scene objects (see §1.4).
- `endings` — one block per `end:` key used in scene 4.
- `finalLine` — the closing acknowledgement.

### Step 4 — write the four scenes

Each scene needs:

```js
{
  title: "Scene title",
  docLine: "…" OR docHigh + docLow OR docVariants: {…},
  prompt: "What are you feeling?",
  choices: [ {em, in, imp, re, unlock?, req?}, … ]
}
```

A few rules:

- **Scene 4 must be the decision scene.** Every choice in scene 4 needs an `end:` field naming an ending branch.
- **Each choice's `imp` keys are optional.** Omit a key if a meter doesn't move. The engine adds zero for missing keys.
- **`unlock` is set on a choice that should grant a tag** to `S.pPath`. `req` is set on a choice that should only appear if a tag is already present. Tags are arbitrary lowercase strings; pick something semantic like `"shared"`, `"family"`, `"deep"`.
- **`docVariants` keys**: any unlock tag name (matched first); plus optional `high` / `low` fallbacks based on `sas + otv` thresholds. See [06 §6](06-game-02-parent.md#6-getdocline--three-fallback-patterns).

### Step 5 — write the endings

For every distinct `end:` value used in scene 4 choices, add an entry to `endings: {…}`. Each ending has `phone`, `opts` (exactly 4), and `close` (3–5 paragraphs). See [06 §7](06-game-02-parent.md#7-endings--six-possible-keys) for the conventional keys.

### Step 6 — validate

Drag-drop `personas.js` onto `validate.html` (planned — see chapter [10](10-roadmap.md)). It will report:

- Missing scenes (any persona with `active:1` must have exactly 4 scenes).
- Scene 4 choices missing `end:`.
- `req:` tags that no `unlock:` produces.
- `end:` values that don't have a matching `endings:` block.
- `docVariants` referencing tags that no `unlock:` produces.

Until `validate.html` is built, the practical fallback is to open the game in a browser, play the new persona end-to-end through all four endings, and watch the DevTools console for errors.

### Step 7 — flip `active: 1` and translate

Once the Serbian content is complete and validated:

```bash
node scripts/translate.js persona <idx>
```

…where `<idx>` is the persona's position in the array (0-based). This calls the Gemini API and patches `PERSONAS.en[idx]` in place. See [09 — i18n](09-i18n.md) for details.

### Step 8 — commit and push

```bash
git add personas.js
git commit -m "personas: add <name> (Game 02)"
git push
```

Cloudflare Pages auto-deploys on push to `main`. The new persona appears on the picker within a minute.

## 2. Add a new HCP scenario (Game 01)

Scenarios live in `HCP_SCENARIOS[sr]` in `scenarios.js`. The structure was described in [05 §2](05-game-01-hcp.md#2-anatomy-of-a-scenario); the recipe to add one:

### Step 1 — pick the attitude root

Read the table in [03 §2](03-science.md#2-framework-a--fasce-et-al-2023-the-attitude-roots-taxonomy). Decide which Fasce root the new scenario will exercise. The eight existing scenarios cover roughly eight of the eleven roots — there are three uncovered roots (e.g. *religious concerns*, *reactance*) that would be good additions if you have one.

Set the `root:` field in plain Serbian (e.g. `"Religijske brige — moralna čistota"`).

### Step 2 — write the parent's opening line

```js
{
  title: "Short scenario title for the picker",
  root: "Fasce root label",
  startTrust: 50, startWill: 30,
  startWhy: "One-sentence explanation of why this parent starts here.",
  maxWhy: "One-sentence explanation of why the ceiling isn't 100.",
  parent: { i: "M" /* or "O" */, l: "Mother · 13yo daughter" },
  open: "The parent's first utterance in the conversation.",
  steps: [ … ],
  eGood: "…", eMid: "…", eBad: "…",
  take: "One-sentence take-away lesson shown at the end."
}
```

### Step 3 — write Step 1 (root identification)

Four candidate roots, exactly one with `ok: 1`:

```js
{ t: "root", p: "Which attitude root do you recognise?", o: [
  { x: "First candidate root description", ok: 1, fb: "Why this is the load-bearing root." },
  { x: "Distractor 1",                     ok: 0, fb: "Why this is close but not the operative root." },
  { x: "Distractor 2",                     ok: 0, fb: "…" },
  { x: "Distractor 3",                     ok: 0, fb: "…" }
] }
```

The distractors should be *plausible* — the player should have to think. The `fb:` for each distractor names the distinction (what would the parent have said if *this* were the root?). The `fb:` for the correct option names the Fasce category in plain language.

### Step 4 — write Steps 2–4 (affirm, refute, facts)

Each step is `q:"good"` / `"neutral"` / `"bad"` graded. The convention across the existing eight scenarios:

- Step 2 (affirm): 3 options — one `good`, two `bad`. Affirmation is binary in practice.
- Step 3 (refute): 3 options — one `good`, one `neutral`, one `bad`.
- Step 4 (facts): 2 options — one `good`, one `neutral`. The worst-case is "vague generic" rather than "actively harmful".

The `good` option should be the *longest* historically — but Package B (a 2026-05 rebalance) deliberately mixed this up. Five of eight scenarios now have a shorter `good` option in Step 2. Don't make length a tell.

### Step 5 — write the three endings (`eGood`, `eMid`, `eBad`)

One sentence each, in the parent's voice. The tonal trajectory: receptive → considering → disengaging.

### Step 6 — write the take-away (`take:`)

One sentence summarising the lesson. The convention is to use HTML `<strong>` around the key technique:

> *Fear of toxicity is neutralised with **concrete comparative measures** — not generic safety assurances.*

### Step 7 — translate

```bash
node scripts/translate.js scenario <idx>
```

`<idx>` is the 0-based position. The Gemini call preserves the structure exactly; only string values change.

### Step 8 — playtest, commit, push

Open the game in a browser, play the new scenario end-to-end. Watch for:

- Step 1 distractors that are too obviously wrong (revise the distractor or its `fb`).
- A `good` affirmation that sounds preachy (revise toward more natural empathy).
- A `facts` option that quotes statistics — double-check the numbers.

## 3. Add or edit a UI string

UI strings live in `ui.js` under the `UI.sr` and `UI.en` objects, keyed by dotted slugs (e.g. `step.eri.0`, `btn.home`).

### Edit an existing string

```js
// ui.js
sr: {
  // …
  "btn.home": "Početak",
  // ↑ change the value here
}
```

Then run `node scripts/translate.js ui` to regenerate the English pack — the existing English value will be overwritten. (Or hand-edit `UI.en` if you want to skip the API call for a one-character fix.)

### Add a new string

1. Add the key to `UI.sr` with a Serbian value:

   ```js
   sr: {
     // …
     "myNewSection.heading": "Novi naslov",
   }
   ```

2. If the string is shown statically in HTML, add a `data-i18n` attribute on the relevant element:

   ```html
   <h2 data-i18n="myNewSection.heading">Novi naslov</h2>
   ```

   `applyI18n()` will overwrite the element's `innerHTML` with the looked-up value on language change.

3. If the string is shown by an engine function, call `t()`:

   ```js
   document.getElementById("title").innerHTML = t("myNewSection.heading");
   ```

4. If the string contains a placeholder, use `{name}` syntax:

   ```js
   "step.counter": "Korak {n}/4 · ",
   // …
   t("step.counter", { n: 3 })
   ```

5. Translate:

   ```bash
   node scripts/translate.js ui
   ```

`validateSameKeys()` will refuse if any key is missing or extra after the API call, so partial translations fail loudly rather than silently breaking the language pack.

## 4. Fill in a stub persona

The four stubs (Goran, Dragan, Tijana, Maja) already have `id`, `name`, `tag`, `hook` and `active: 0`. To activate one:

1. Add all the remaining fields: `intro`, `start`, `startWhy[By]`, `doc`, `scenes` (×4), `endings`, `finalLine`. The shape is identical to the four active personas — copy Marija or another similar one as the structural reference, and replace the content.
2. Flip `active: 0` → `active: 1`.
3. Translate the persona:
   ```bash
   node scripts/translate.js persona <idx>
   ```
4. Playtest end-to-end through every ending key the persona uses.

The stubs were sketched with an underlying attitude root in mind (see [06 §1](06-game-02-parent.md#1-the-persona-roster)) — keep the persona consistent with that hook unless you have a reason to redirect.

## 5. Add a third language

The language-pack pattern was designed for two languages but is not artificially limited. To add a third (say, German):

### Step 1 — extend the data files

Each of the three data layers needs a new key:

**`ui.js`** — add a third top-level key under `UI`:

```js
const UI = {
  sr: { … },
  en: { … },
  de: { /* fill in */ }
};
```

**`scenarios.js`** — add to both `HCP_PROFILES` and `HCP_SCENARIOS`:

```js
const HCP_PROFILES = { sr: [...], en: [...], de: [...] };
const HCP_SCENARIOS = { sr: [...], en: [...], de: [...] };
```

**`personas.js`** — add to `PERSONAS`:

```js
const PERSONAS = { sr: [...], en: [...], de: [...] };
```

### Step 2 — extend the engine dispatcher

The three helpers in `engine.js`:

```js
function getScenarios() {
  const de = HCP_SCENARIOS?.de, en = HCP_SCENARIOS?.en, sr = HCP_SCENARIOS?.sr;
  if (S.lang === "de" && de && de.length) return de;
  if (S.lang === "en" && en && en.length) return en;
  return sr || [];
}
// same for getProfiles() and getPersonas()
```

…and `t()` in `ui.js` already falls back correctly via `UI[S.lang] || UI.sr`.

### Step 3 — extend the UI

Add a third toggle pill in `index.html`:

```html
<div class="lang-toggle">
  <button class="lang-pill active" data-lang="sr" onclick="setLang('sr')">SR</button>
  <button class="lang-pill"        data-lang="en" onclick="setLang('en')">EN</button>
  <button class="lang-pill"        data-lang="de" onclick="setLang('de')">DE</button>
</div>
```

And update `setLang()` (`engine.js`) to whitelist the new code:

```js
if (lang !== "sr" && lang !== "en" && lang !== "de") return;
```

(Same for the `?lang=` URL-param check in the `DOMContentLoaded` handler.)

### Step 4 — extend the translator

`scripts/translate.js` currently hard-codes Serbian-as-source and English-as-target. To support a third language you would need to either:

- Add a `--target <lang>` flag and parameterise the prompt's "translate into English" line, **or**
- Duplicate the script as `translate-de.js` with `de` instead of `en` everywhere.

The first is cleaner. The bracket-counting patchers (`replaceEnArray`, `replaceEnObject`, `patchScenariosEn`) would need to look for `,de:[` and `de:{` instead. This is mechanical but non-trivial; budget a couple of hours.

### Step 5 — extend the facilitator tools

`qr.html`, `admin.html`, `stats.html` all have hard-coded `sr`/`en` lists in their language pickers and filters. Add the third code to each. The filter pattern in `stats.html` (`LANG_FILTER`, `_setLang()`, `renderLangPills()`) is the most involved.

### Step 6 — sanity-check the CSS

English text is typically 10–15% longer than Serbian and German can be 20%+ longer. Walk through the game in the new language and look for overflow / line-wrapping issues. Most fixes are local to `styles.css` (set `font-size` smaller, allow wrapping, increase container width).

---

A practical note on adding any new content: the game is content-heavy and the engine is small. The right unit of effort is *one persona or one scenario at a time*, fully validated and translated, rather than batching many half-written items. The Gemini translation step is cheap but the human review of the result is not — translate as you finish each piece, not at the end.

---

*Related:* [09 — i18n](09-i18n.md) for the translation pipeline details. [10 — Roadmap](10-roadmap.md) for what's currently being added.
