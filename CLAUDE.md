# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

HPV vaccination communication training game in Serbian, for healthcare workers. Currently a single self-contained HTML file (`od_nedoumice_do_odluke.html`, ~103 KB). The planned target structure is a modular multi-file layout hosted on GitHub Pages (no build step).

## Running the app

No build step. Open `od_nedoumice_do_odluke.html` (or after refactor: `index.html`) directly in a browser. All dependencies are Google Fonts loaded via CDN.

## Planned target file structure

```
hpvGame/
├── index.html              # HTML structure only
├── styles.css              # extracted from <style> block
├── engine.js               # game logic, state, all render functions
├── scenarios.js            # HCP_PROFILES + HCP_SCENARIOS data
├── personas.js             # PERSONAS data (4 active + 4 stubs)
├── _TEMPLATE_persona.js    # copy-paste template with comments for every
│                           # parameter: anks, sas, otv, dec, unlock,
│                           # req, ending, docVariants, etc.
├── validate.html           # drag-drop personas.js → reports all errors:
│                           # missing scenes, broken req/unlock pairs,
│                           # endings without data
└── README.md               # quick edit how-to, links to published papers
```

**Constraints:** behaviour must be 100% identical to current version. GitHub Pages compatible — static files only, no build step. All editable Serbian-language content lives exclusively in `personas.js` and `scenarios.js`. `engine.js` and `styles.css` should not need day-to-day edits.

## Architecture (current single-file)

### Screens and navigation

All screens are `<section>` elements. `showScreen(id)` hides all and reveals the target. Screen IDs: `s-role`, `s-hcp-profile`, `s-hcp-pick`, `s-hcp-game`, `s-hcp-summary`, `s-parent-pick`, `s-parent-game`. No URL routing.

### State

Single global object `S`, persisted to `localStorage` under key `ondk_v2` via `saveState()` / `loadState()`. Flat structure shared across both games:

```js
S = {
  screen, game,
  // HCP game
  hcpProfile, hcpScenarioIdx, hcpStepIdx, trust, will,
  hcpResults, hcpCompletedScenarios, totalRoots, totalGood,
  // Parent game
  personaIdx, pSceneIdx, pPath, pChoices, pEnding,
  anks, sas, otv, odluka
}
```

### Game 01 — HCP (ERI framework)

Player is a doctor. 8 scenarios in `HCP_SCENARIOS`. Each scenario has 4 ordered steps based on the ERI framework (Holford et al. 2024):

1. **Eliciraj** — identify the attitude root (Fasce et al. 2023 taxonomy)
2. **Afirmiši** — empathic affirmation before rebuttal
3. **Opovrgni** — targeted refutation
4. **Činjenice** — factual information

Step options have quality tags (`good` / `neutral` / `bad`) that map to `trust` and `will` meter deltas via the `HCP_IMPACT` lookup table. Scenario ends when `trust ≥ 70` (good outcome), `≥ 40` (mid), or `< 40` (bad), selecting `eGood`, `eMid`, or `eBad` text. HCP profiles (Pedijatar, Lekar opšte medicine, Ginekolog, Specijalista) are cosmetic context — they do not change scenario mechanics.

### Game 02 — Parent (CYOA / experiential debrief)

Player becomes a hesitant parent. 4 active personas: **Marija, Jelena, Sanja, Petar**. 4 stubs (Goran, Dragan, Tijana, Maja) — call `stubClick()` which shows an alert. Each persona has 4 scenes. Attitude roots are intentionally not named in-game (experiential approach, no explicit taxonomy labelling).

Four meters per persona (0–100):
- `anks` — anksioznost (anxiety)
- `sas` — saslušano (feeling heard)
- `otv` — otvorenost (openness)
- `odluka` — vaccination decision (0 = against, 100 = for)

Each persona defines `start` values for all four meters. The final scene's choice sets `S.pEnding` (values: `best`, `rushed`, `delayed`, `mid`, `closed`), selecting the ending branch with `phone`, `opts[]`, and `close[]` text.

### Unlock / branching mechanism

A choice with `unlock: "tag"` pushes that tag to `S.pPath`. Later choices with `req: "tag"` are hidden unless the tag is in `S.pPath`. Doctor dialog variants (`docVariants`) also key on these tags — `getDocLine()` checks `S.pPath` first, then falls back to a `sas + otv` threshold selecting `high` vs `low` variants.

### Impact tables

- `HCP_IMPACT` — maps `{step type} × {quality}` to `{trust, will}` deltas
- Each parent scene choice has an `imp` object with optional keys `anks`, `sas`, `otv`, `dec`
- `clamp(v)` keeps all meter values in `[0, 100]`

## Academic references

- Fasce, A. et al. (2023). *Nature Human Behaviour*, 7, 1462–1480 — taxonomy of 11 attitude roots used in HCP step 1
- Holford, D. et al. (2024). *Health Psychology*, 43(6), 426–437 — ERI (Elicit–Respond–Inoculate) framework
- Tool context: [jitsuvax.info](https://jitsuvax.info)
