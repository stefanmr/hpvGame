# 03 — Science: theoretical basis and how it is wired into the game

This chapter is the bridge between the academic literature and the source code. Every construct discussed below is implemented in a specific file, function, or data field — the mapping is given explicitly so a reader can trace any design choice from the published evidence to the line of code that realises it.

## 1. Why a game?

Vaccine hesitancy is rarely the absence of information; it is the presence of an emotional or moral commitment that conflicting information cannot easily dislodge. A passive lecture transmits facts, but it does not give healthcare workers (HCWs) practice in *recognising* what is actually being said by a hesitant parent, *holding the conversation open* under pressure, or *choosing words* that defuse rather than escalate. The two games in this project are designed to give that practice in a low-stakes environment:

- **Game 01 — *Conversation with a parent*** puts the player in the role of the doctor. Eight scripted scenarios train explicit recognition and response skills.
- **Game 02 — *In the parent's shoes*** inverts the perspective. The player becomes a hesitant parent, experiences the conversation from inside, and feels how the same words can land differently depending on emotional state. There is no "right answer" — the goal is empathic insight, not optimisation.

Both games rest on two peer-reviewed frameworks. The next two sections introduce each in turn, then sections 4 and 5 spell out exactly where each construct appears in the codebase.

## 2. Framework A — Fasce et al. (2023): the *attitude roots* taxonomy

> Fasce, A., Schmid, P., Holford, D. L., Bates, L., Gurevych, I., & Lewandowsky, S. (2023). A taxonomy of anti-vaccination arguments from a systematic literature review and text modelling. *Nature Human Behaviour*, 7, 1462–1480.

Fasce and colleagues argue that the surface form of a vaccine-hesitant argument ("aluminium is dangerous", "the pharmaceutical industry profits", "my child is too young") is a poor target for refutation. The same surface claim can grow from very different psychological roots, and a refutation that does not address the underlying root will fail even when it is factually correct.

They identify eleven **attitude roots** — broad psychological motivations that organise specific concerns. The roots used in the present game's eight scenarios are:

| # | Attitude root (Fasce 2023) | Example concern in the game |
|---|----------------------------|-----------------------------|
| 1 | Fear and phobias — *toxicity* | "Aluminium and fetal cell remnants in the vaccine will harm my child." |
| 2 | Conspiracy beliefs — *Big Pharma* | "Pharma earns billions; what aren't they telling us?" |
| 3 | Moral concerns — *promiscuity* | "Vaccinating a 12-year-old against an STI sends the wrong message." |
| 4 | Distorted risk perception | "Most HPV infections clear on their own — why vaccinate a healthy child?" |
| 5 | Unfounded beliefs — *natural is better* | "Too many vaccines, too early. The body should learn to defend itself." |
| 6 | Fear and phobias — *dreadful injuries* | "Girls had neurological problems, infertility, autoimmune disease." |
| 7 | Distrust — *do your own research* | "Doctors are trained in one framework; I read more widely." |
| 8 | Worldview — *libertarianism* | "After COVID, I no longer trust the system. My child, my choice." |

The diagnostic claim is **not** that these labels capture the full person — they capture the *most load-bearing* root for the conversation at hand. A useful refutation acknowledges the root before challenging the surface claim. A refutation that ignores the root (or, worse, misidentifies it) tends to escalate.

**Where this lives in the code:** Each `HCP_SCENARIOS[sr][i]` object has an explicit `root:` field naming the Fasce category in plain Serbian. Step 1 of every scenario presents four candidate roots to the player; the correct one is flagged with `ok:1`. See `scenarios.js:64` (Scenario 01 / toxicity) for the pattern.

## 3. Framework B — Holford et al. (2024): the *ERI* response approach

> Holford, D. L., Schmid, P., Fasce, A., & Lewandowsky, S. (2024). Effective rebuttals of vaccine misperceptions: A test of the elicit–affirm–rebut–inform approach. *Health Psychology*, 43(6), 426–437.

The companion paper to Fasce 2023 specifies *how* to respond once a root is identified. The approach is built from four ordered moves, each empirically tested in vignette studies. The game uses the abbreviation **ERI** (Elicit–Respond–Inoculate) as a shorthand for the same four-step pattern; the underlying moves correspond directly to Holford's *Elicit – Affirm – Rebut – Inform*:

| Step | Move | What the player chooses |
|------|------|--------------------------|
| 1 | **Elicit** the underlying attitude root | Identify *which* of the candidate roots is the load-bearing one for this conversation. |
| 2 | **Affirm** the emotion or legitimate concern before challenging the claim | Choose a response that validates *the person* without conceding the false premise. |
| 3 | **Rebut** (refute) the specific incorrect claim, targeted to the identified root | Choose a refutation that is precise to the named concern, not a generic appeal to authority. |
| 4 | **Inform** with concrete, quantified facts | Choose facts that are specific, comparable, and emotionally proportionate to the parent's stated worry. |

The pedagogical claim of Holford et al. is twofold: (a) the *order* matters — facts placed before affirmation tend to land as confrontation; (b) the *target* matters — a refutation aimed at the wrong root has near-zero persuasive value even when factually correct.

**Where this lives in the code:** Every HCP scenario contains exactly four steps in a fixed order, encoded by the field `t:` taking values `"root" | "affirm" | "refute" | "facts"`. The four ERI labels are user-facing strings in `ui.js` under the keys `step.eri.0` through `step.eri.3`. Each step's label is colour-coded in the UI (coral / teal / gold / plum) so the player perceives the four-phase rhythm visually as they advance.

## 4. Mapping: the eight scenarios

The eight HCP scenarios were designed so that each scenario exercises a different attitude root, while the four-step ERI rhythm stays constant. Together they give a player coverage of the most common roots a Serbian HCW will actually encounter when discussing the HPV vaccine.

| Scenario index | Title (translated) | Attitude root (Fasce 2023) | What the scenario teaches |
|---|---|---|---|
| 1 | Aluminium and fetal cells | Fear / toxicity | Use *comparative measures* (e.g. aluminium in breast milk), not generic safety assurances. |
| 2 | Pharma earns billions | Conspiracy / Big Pharma | *Align with the parent's scepticism*; defeat the conspiracy frame by appealing to independent sources, not authority. |
| 3 | I don't want to send the wrong message | Moral / promiscuity | *Re-map* — show the vaccine protects the parent's values (future health) rather than challenging them. |
| 4 | HPV resolves on its own | Distorted risk perception | *Calibrate* — affirm the true part of the parent's claim, then locate the genuine residual risk (the 10%). |
| 5 | Too many vaccines, natural is better | Unfounded beliefs / natural | *Re-frame* the vaccine as **training** for the natural immune system, not a substitute for it. |
| 6 | Girls had terrible reactions | Fear / dreadful injuries | *Invert the threat* — show how the intervention protects what the parent fears losing (e.g. fertility). |
| 7 | I did my own research | Distrust / DYOR | *Equip* the parent with high-quality tools (Cochrane, peer review) rather than appeal to medical authority. |
| 8 | My child, my decision | Worldview / libertarianism | *Yield on autonomy* — make clear the parent is the decision-maker; rebuild trust as a person rather than a system. |

These mappings are not narrative flourishes — they are encoded as the correct (`ok:1`) option in step 1 of each scenario and reinforced in the per-option feedback (`fb:` field) shown after each choice. A player who correctly identifies the root receives feedback that names the Fasce category in plain language and links the choice back to the framework. A player who misidentifies it receives feedback that explains *why* the candidate root does not fit and gently steers toward the load-bearing one.

## 5. Mapping: scientific construct → code location

The table below is the single most important reference in this chapter. Every theoretical construct that drives game behaviour is implemented in exactly one place. Day-to-day content edits change only the leaf values; the theoretical structure is fixed.

| Construct (theory) | File | Field / function | Notes |
|---|---|---|---|
| Eleven attitude roots (Fasce 2023) | `scenarios.js` | `HCP_SCENARIOS[lang][i].root` | Plain-language label per scenario. Step 1's `ok:1` option labels the correct root. |
| ERI four-step ordering (Holford 2024) | `scenarios.js` | `HCP_SCENARIOS[lang][i].steps[j].t` | Values: `"root"`, `"affirm"`, `"refute"`, `"facts"`. Exactly four per scenario, in this order. |
| Step labels shown to player | `ui.js` | `step.eri.0`…`step.eri.3` | SR: Eliciraj / Afirmišite / Opovrgnite / Činjenice. EN: Elicit / Affirm / Refute / Facts. |
| Step colour-coding (Eliciraj=coral, Afirmišite=teal, Opovrgnite=gold, Činjenice=plum) | `styles.css`, `engine.js` | `.step-tag.phase-eli/aff/ref/fac`; `ERI_PHASE_KEYS` | Each ERI phase is one colour so players perceive the four-beat rhythm. |
| Response quality flags | `scenarios.js` | each option's `q:` field | `"good"` / `"neutral"` / `"bad"`. Drives both meter deltas and feedback tone. |
| Root identification correct flag | `scenarios.js` | each step-1 option's `ok:` field | `1` = correct root; `0` = plausible distractor with an explanation in `fb:`. |
| Quality → meter delta lookup | `engine.js` | `HCP_IMPACT` constant | The single source of truth that converts a theoretical "good/neutral/bad" judgment into trust / will points. |
| Trust meter (parent–HCW alliance) | `engine.js` | `S.trust`, `renderHcpMeters()` | Range 0–100. Threshold ≥70 → good ending, ≥40 → mid, else bad. |
| Will meter (vaccination acceptance) | `engine.js` | `S.will`, `renderHcpMeters()` | Range 0–100. Per-step ceiling capped via `computeHcpMax()`. |
| Per-scenario starting position | `scenarios.js` | `startTrust`, `startWill`, `startWhy` | Different parents arrive in different starting states; the game shows the player *why* up front. |
| Achievable ceiling | `scenarios.js` + `engine.js` | `maxWhy`, `computeHcpMax()` | Honest statement that a single conversation cannot always reach 100%; the cap and reason are shown at the end. |
| Empathic-then-informational ending text | `scenarios.js` | `eGood`, `eMid`, `eBad` | Three closing lines per scenario, chosen by final `trust`. |
| End-of-scenario review (per-step retrospective) | `engine.js` | `renderHcpReview()` | Lists every attempt with quality, deltas, and a "better answer" suggestion when the last choice was not good. |

## 6. A note on Game 02 and the experiential design choice

Game 02 (the parent perspective) deliberately *does not* expose the Fasce taxonomy to the player. Each persona — Marija, Jelena, Sanja, Petar — is built around an attitude root, but the root is not named in the UI. The reasoning is pedagogical: in Game 01 the player is the analyst, so labels help; in Game 02 the player is the lived experience, and labels would shortcut exactly the empathic immersion the game is trying to produce. The four meters of Game 02 (anxiety, feeling heard, openness, decision) are emotional rather than analytic, and the doctor's lines in each scene (`docVariants`) adapt based on the player's *felt* trajectory rather than on labelled correctness.

This is a design departure from a strict Fasce-mapping approach, and it is deliberate. Game 01 and Game 02 are designed to teach complementary skills:

- **Game 01** trains the *recognition–response* loop (analytic, taxonomy-explicit).
- **Game 02** trains *empathic perspective-taking* (experiential, taxonomy-implicit).

A facilitator running both in sequence is asking the same learner to alternate between the diagnostic stance and the patient's stance, which is the broader competence the literature implies but rarely makes a curriculum target.

## 7. External tools referenced

- The **JitsuVax** project ([jitsuvax.info](https://jitsuvax.info)) is the umbrella research programme out of which both Fasce 2023 and Holford 2024 emerged. It offers a clinician-facing assessment instrument for identifying the dominant attitude root in a real conversation.

---

*Related chapters:* [04 — Architecture](04-architecture.md) describes the technical structure that implements the constructs above. [05 — Game 01 (HCP)](05-game-01-hcp.md) and [06 — Game 02 (Parent)](06-game-02-parent.md) walk through the two games in detail. The full bibliography is in [refs.md](refs.md).
