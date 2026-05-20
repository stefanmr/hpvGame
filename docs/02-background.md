# 02 — Background: why this tool, and why this shape

This chapter sets the case for the project before chapters [03 — Science](03-science.md) and [05](05-game-01-hcp.md) / [06](06-game-02-parent.md) describe *how* it works. It is the chapter to point a colleague at when they ask "why would anyone build a game for this?"

It is short on purpose. The literature on vaccine hesitancy is enormous; this chapter does not summarise it. It states the three premises the tool is built on and stops there.

## 1. Vaccine hesitancy is a communication problem, not an information problem

The default response to vaccine hesitancy among clinicians and policymakers — *"if only the parent understood the data"* — has been steadily eroded by twenty years of research. Information deficit alone explains very little. What predicts whether a hesitant parent eventually vaccinates is closer to:

- whether they felt **heard** in the encounter,
- whether the response targeted **the specific concern they had**, not a generic one,
- whether the clinician affirmed *the person* before challenging *the claim*,
- and whether the underlying psychological root (fear, moral conviction, distrust, worldview) was identified at all.

This shifts the training target. A healthcare worker who only knows the facts but does not know how to identify roots, affirm before rebutting, or pace the conversation will repeatedly fail conversations they could have won. Conversely, a worker with weaker recall of the data but strong empathic technique can carry a conversation that information alone could not.

The two academic frameworks the project is built on — Fasce et al. (2023) and Holford et al. (2024) — operationalise this shift. They identify the *roots* and prescribe the *response order*. The tool is, in essence, a training environment for the resulting skill: recognise → respond → inoculate. See [03 — Science](03-science.md) for the construct-by-construct walkthrough.

## 2. Why HPV specifically

The HPV vaccine is a useful focal case for this kind of training for several converging reasons:

- **It prevents cancer.** Cervical cancer, oropharyngeal cancer, and others. The intervention is unambiguously high-impact in long-term outcomes, but the benefit lies decades downstream of the dose — a structural mismatch with how most parents intuitively weight risk.
- **It is given to adolescents.** This brings a *moral* charge that most paediatric vaccines do not: the vaccine is for a sexually transmitted virus, given to children whose parents do not yet think of them as sexual. The Fasce taxonomy's *moral concerns* root shows up at the HPV conversation more sharply than at the MMR conversation. Scenario 03 in this game — *"I don't want to send the wrong message"* — exists for this reason.
- **It is under-vaccinated in much of Europe.** Coverage in the Western Balkans is well below the targets set by WHO Europe. The gap is not driven by access (the vaccine is available); it is driven by the conversation in the clinic. The tool is built for that conversation.
- **It is gendered.** Originally introduced for girls (cervical cancer), the vaccine is now recommended for both boys and girls in most national programmes. Many parents have not updated their mental model. Scenario 02 — *"Why even for boys?"* — directly addresses this update.

The local statistics quoted in-game (e.g. Scenario 04's *"around 1,500 women per year develop cervical cancer in Serbia, around 400 die"*) reflect contemporary Serbian public-health figures available at the time of writing. These are properties of the *content* and may need updating as registries publish revised numbers; the engine and structure do not depend on them.

## 3. Why a *game* — three things passive material cannot do

A book chapter, a slide deck, or a webinar can convey the Fasce taxonomy and the ERI order. None of them can do the three things this tool was built to do:

### 3.1 Deliberate practice under realistic time pressure

Recognising an attitude root from a parent's actual words is a perceptual skill. It develops with *repetitions*, ideally with quick feedback. A book gives you the taxonomy; only practice gives you the ability to spot toxicity-fear when it arrives dressed as a casual question about aluminium. Game 01's structure — eight scenarios, four steps each, immediate feedback after every click — is straightforward deliberate-practice design.

### 3.2 Perspective-taking

Healthcare workers are trained to be analysts. The default failure mode is reading the parent as a problem to be solved. Game 02 — *In the parent's shoes* — is a deliberate inversion. The player does not analyse; the player *inhabits*. The mechanic of choosing emotions rather than utterances, of reading the inner monologue before the doctor's response, and of feeling the meter shifts as the conversation unfolds, is engineered to produce a small but real shift in how the same clinician then runs Game 01.

The dual-game design is the project's main pedagogical claim. Either game alone is useful; both together address what neither would alone.

### 3.3 Low-stakes failure

A real conversation in clinic that goes badly leaves a parent worse off and a clinician demoralised. Most clinicians get a handful of opportunities to practise difficult conversations per year, and each one carries a real cost. A simulation can let the same clinician fail an "aluminium and fetal cells" scenario five times in fifteen minutes, with the conversation simply rewinding, until the rhythm clicks. Game 01's two play modes (chapter [05 §8](05-game-01-hcp.md#8-two-play-modes--retry-vs-sim)) calibrate the failure cost: *retry* mode lets the player try again until they get it right; *simulation* mode locks in the first answer and shows what would have been better in the post-game review. A facilitator picks the mode that fits the learning stage.

## 4. The audience

The tool is built for:

- **Healthcare workers in primary care** — pediatricians, GPs, gynaecologists, nurses — who actually have the conversations.
- **Medical and nursing students** — early-career professionals who have not yet had the conversations and benefit most from rehearsal before they meet a parent.
- **Workshop facilitators** running continuing-education sessions on vaccine communication, who need a turn-key activity that runs in a browser, generates a workshop QR code, and produces post-session analytics.
- **Researchers** studying communication training interventions, who need the analytics tail (chapter [07](07-analytics.md)) to evaluate effectiveness.

A *general public* audience is not the target — the game does not exist to convince hesitant parents directly. The theory of change is one step removed: equip the clinicians, and the clinicians have better conversations with the parents.

## 5. The language strategy

The original audience is Serbian-speaking. The game is therefore native in Serbian Latin script, and the content (scenarios, personas, doctor lines) was written in Serbian first. English is a translated overlay generated from the Serbian source via the Gemini API (chapter [09](09-i18n.md)) and intended for international workshops and academic dissemination.

The asymmetry is intentional — the Serbian text is the authored artefact, the English text is the translation. When the two diverge, the Serbian version is canonical. The persona names (Marija, Jelena, Sanja, Petar) are not translated even in the English pack, to preserve the cultural texture.

## 6. What this tool is *not*

To close a few likely misreadings:

- **It is not a quiz.** Game 02 has no right answers. Game 01 has graded answers but the grading is pedagogical, not punitive — the "Better answer would be" hint in the review (chapter [05 §7](05-game-01-hcp.md#7-end-of-scenario-review)) is the teaching moment, not a mark.
- **It is not a substitute for direct training.** A facilitator-led workshop using the game is far more valuable than the game played alone. The roles are complementary.
- **It is not a clinical decision-support tool.** It does not give vaccine recommendations to patients. It trains the communicators who give those recommendations.
- **It does not claim disease-coverage impact.** The evaluable outcome the project can credibly claim is *change in clinician communication behaviour*. Whether that translates to vaccine uptake is a downstream question for the public-health system to measure.

---

*Next:* [03 — Science](03-science.md) describes the two frameworks the design rests on. [04 — Architecture](04-architecture.md) is the technical map.
