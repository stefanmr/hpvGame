# References

The two primary citations the game is built on, plus supporting tools and an inventory of claims elsewhere in the documentation that should be footnoted to a specific source when the bibliography is next refreshed.

## Primary references

### Fasce et al. (2023) — attitude-root taxonomy

> Fasce, A., Schmid, P., Holford, D. L., Bates, L., Gurevych, I., & Lewandowsky, S. (2023). A taxonomy of anti-vaccination arguments from a systematic literature review and text modelling. *Nature Human Behaviour*, **7**, 1462–1480.

The eleven-root taxonomy structures Step 1 of every HCP scenario. Each scenario's `root:` field names the load-bearing root in plain Serbian, and each Step-1 option's feedback either confirms that root (correct option) or explains the distinction (distractor).

See [03 §2](03-science.md#2-framework-a--fasce-et-al-2023-the-attitude-roots-taxonomy) for the eight roots used in the current scenarios. The remaining three roots are candidate territory for future scenarios (chapter [10](10-roadmap.md)).

### Holford et al. (2024) — ERI framework

> Holford, D. L., Schmid, P., Fasce, A., & Lewandowsky, S. (2024). Effective rebuttals of vaccine misperceptions: A test of the elicit–affirm–rebut–inform approach. *Health Psychology*, **43**(6), 426–437.

The four-step Elicit → Affirm → Refute → Inform approach is implemented directly as `t: "root" | "affirm" | "refute" | "facts"` in every scenario's `steps[]` array. The order is fixed and the labels are shown to the player. The pedagogical claim — that order matters and targeting matters — is the design rationale for the per-step quality grading.

See [03 §3](03-science.md#3-framework-b--holford-et-al-2024-the-eri-response-approach) for the construct-by-construct mapping.

## Supporting tools and resources

### JitsuVax

> JitsuVax research project. *Jitsuvax.info*. [https://jitsuvax.info](https://jitsuvax.info)

The umbrella project under which Fasce 2023 and Holford 2024 were produced. Offers a clinician-facing assessment instrument and additional training materials, complementary to the present tool.

### Cochrane Collaboration

> The Cochrane Library. [https://www.cochranelibrary.com](https://www.cochranelibrary.com)

Cited in the game itself (Scenario 07 — *"I did my own research"*) as an example of a peer-reviewed, transparently sourced evidence base. The Cochrane HPV vaccine systematic review (Arbyn et al. 2018) is what the in-game doctor character points to.

### Supabase

> Supabase. *Open-source Firebase alternative.* [https://supabase.com](https://supabase.com)

The analytics backend. The `events` table is a single Postgres table behind Row-Level Security; details in [07 — Analytics](07-analytics.md).

### Gemini API

> Google. *Gemini API documentation.* [https://ai.google.dev/gemini-api](https://ai.google.dev/gemini-api)

The translation pipeline (`scripts/translate.js`) calls Gemini via REST. Free-tier models used: `gemini-2.5-flash` and `gemini-2.5-flash-lite` (see chapter [09](09-i18n.md)).

## Claims to footnote on next refresh

A small inventory of statements in the documentation that would benefit from a specific citation. Listing them here so they are not lost when the bibliography is next revised.

- **Chapter [02 §2](02-background.md#2-why-hpv-specifically): "Coverage in the Western Balkans is well below the targets set by WHO Europe."** Generic claim — defensible but a specific WHO Europe coverage report would harden it. Look for the *European Vaccine Action Plan* monitoring data or the most recent ECDC/WHO joint HPV coverage report for the Balkans.

- **Chapter [02 §2](02-background.md#2-why-hpv-specifically): "around 1,500 women per year develop cervical cancer in Serbia, around 400 die"** — these numbers come from in-game Scenario 04 content. They should be verified against the current Cancer Registry of Serbia (Institut za javno zdravlje *Dr Milan Jovanović Batut*) annual report and updated if newer figures are available.

- **Chapter [03 §3](03-science.md#3-framework-b--holford-et-al-2024-the-eri-response-approach): "The pedagogical claim of Holford et al. is twofold: (a) the order matters … (b) the target matters."** Paraphrase — should be tied to specific page numbers in Holford 2024 (likely the Discussion section).

- **Chapter [02 §1](02-background.md#1-vaccine-hesitancy-is-a-communication-problem-not-an-information-problem)** **list of conversation-quality predictors** — this list is summarising a body of research (the Information-Deficit-Model critique). A literature review citation (e.g. WHO SAGE Working Group on Vaccine Hesitancy 2014, or a more recent review) would back it.

## How to cite the tool itself

A suggested citation format if the tool is referenced in a paper or workshop materials:

> Mandić-Rajčević, S. (2026). *Od nedoumice do odluke (From doubt to decision): An interactive training tool for HPV vaccination communication.* Belgrade. [https://hpvgame.pages.dev](https://hpvgame.pages.dev)

Update author list, affiliation, and DOI as appropriate when the project's publication status changes.
