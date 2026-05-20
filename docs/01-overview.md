# 01 — Overview

*Od nedoumice do odluke* / *From doubt to decision* is an interactive training tool for healthcare workers having conversations about HPV vaccination with hesitant parents. Two short games — one analytic, one experiential — together teach a small but specific set of communication skills derived from the published vaccine-hesitancy literature.

This is the entry point for the documentation. The rest of the chapters dig into specific aspects; this one tells you what is here and where to read next.

## The 30-second pitch

A clinician opens the game in any browser. They pick a role:

- **Doctor.** They face eight scripted scenarios with vaccine-hesitant parents. Each scenario runs through four steps modelled on the Elicit–Affirm–Refute–Inform framework (Holford et al. 2024). They identify the parent's underlying attitude root (Fasce et al. 2023 taxonomy), then practise empathic affirmation, targeted refutation, and proportional facts. Live meters show the parent's trust and acceptance. After each scenario, a per-step review shows what they chose, what would have been better, and why.

- **Parent.** They become one of four hesitant parents and live the conversation from the inside. Choices are *emotions*, not utterances. The doctor's lines adapt to what the parent has shared. There is no winning state — the goal is empathic insight.

Workshops scan a QR code to channel sessions under a shared identifier; a facilitator dashboard shows live results per workshop. All gameplay is anonymous. The whole project is a static site, hosted on Cloudflare Pages, with no backend except Supabase for analytics.

**Live demo:** [hpvgame.pages.dev](https://hpvgame.pages.dev)

## What's in this folder

| Chapter | For whom | What's in it |
|---|---|---|
| [01 — Overview](01-overview.md) | Everyone | This file. The 30-second pitch + how to read the rest. |
| [02 — Background](02-background.md) | Reviewers, paper readers | Why a game, why HPV, why this dual-perspective design. |
| [03 — Science](03-science.md) | Researchers, reviewers | The Fasce 2023 and Holford 2024 frameworks, mapped construct-by-construct to specific files and fields. The load-bearing chapter for academic credibility. |
| [04 — Architecture](04-architecture.md) | Developers | Files, screens, state shape, language pack, URL params, hosting. |
| [05 — Game 01 (HCP)](05-game-01-hcp.md) | Developers, facilitators | Full mechanics of the doctor game: ERI steps, scoring, modes, review. |
| [06 — Game 02 (Parent)](06-game-02-parent.md) | Developers, facilitators | Full mechanics of the parent game: meters, scenes, unlock/req tags, doctor variants, endings. |
| [07 — Analytics](07-analytics.md) | Developers, researchers | Supabase event vocabulary, payload schema, privacy model, dashboard. |
| [08 — Extending](08-extending.md) | Content authors | Step-by-step recipes for adding personas, scenarios, UI strings, languages. |
| [09 — i18n](09-i18n.md) | Developers | Language-pack mechanics; the Gemini-based translation pipeline. |
| [10 — Roadmap](10-roadmap.md) | Everyone | Active work + considered-and-rejected ideas. |
| [refs.md](refs.md) | Researchers | Bibliography. |

## Suggested reading order by audience

**Researcher / reviewer.** Read chapters [02](02-background.md) → [03](03-science.md). That gives you the design rationale and the construct-to-code mapping. If you want to understand how a specific scenario teaches a specific Fasce root, jump to [05](05-game-01-hcp.md); if you want to understand the perspective-taking design choice for Game 02, [06 §1–§9](06-game-02-parent.md) plus [03 §6](03-science.md#6-a-note-on-game-02-and-the-experiential-design-choice).

**Developer extending the game.** Read [04](04-architecture.md) → [08](08-extending.md). Chapters [05](05-game-01-hcp.md) and [06](06-game-02-parent.md) are the deep references for engine behaviour. [09](09-i18n.md) is needed only if you are adding content (which triggers the translation step).

**Facilitator preparing a workshop.** The QR generator workflow is in chapter [04 §9](04-architecture.md#9-facilitator-tools); the analytics dashboard in [07 §7](07-analytics.md#7-the-facilitator-dashboard--statshtml). Mode choice (retry vs. simulation) is explained in [05 §8](05-game-01-hcp.md#8-two-play-modes--retry-vs-sim).

**Curator / project owner returning after time away.** Read [10 — Roadmap](10-roadmap.md) first, then refresh on [04 — Architecture](04-architecture.md). The other chapters are reference, not necessarily linear reading.

## Project status snapshot

- **Version:** v3.0 (May 2026)
- **Live URL:** [hpvgame.pages.dev](https://hpvgame.pages.dev)
- **Languages:** Serbian (authored), English (Gemini-translated)
- **Game 01:** 8 scenarios complete, in both languages.
- **Game 02:** 4 personas complete, 4 stubs pending (see [10 — Roadmap](10-roadmap.md)).
- **Facilitator tools:** QR generator, admin hub, analytics dashboard — all live.
- **Hosting:** Cloudflare Pages, auto-deployed from `main`.
- **Source:** [github.com/stefanmr/hpvGame](https://github.com/stefanmr/hpvGame) (or wherever the canonical repo lives).

## Conventions used in the docs

A few small choices that repeat across the chapters:

- **File references** are given as `path:line` or `path:function()` so they can be Cmd-clicked or fed straight to a grep.
- **Mermaid diagrams** appear where the structure is graph-shaped (screen flow, persona scenes, engine call flow). They render natively on GitHub and in most markdown viewers.
- **"What this does *not* do (yet)" sections** at the end of mechanic chapters intentionally surface the boundaries of the current design. They are the first place to look before proposing an extension.
- **Tables of constructs and their code locations** appear in [03 §5](03-science.md#5-mapping-scientific-construct--code-location) (science) and [04](04-architecture.md) (state). When in doubt about where something lives, those tables are authoritative.

## How to contribute or report something

Most likely changes are content additions — a new persona, a new scenario, a fix to a translated string. Chapter [08](08-extending.md) is the recipe book. The translation step ([09](09-i18n.md)) requires a Gemini API key (free tier is sufficient).

For substantive design changes (mechanics, scoring, branching), check [10 — Roadmap](10-roadmap.md) first — many ideas are already documented as considered-and-deferred, with their trade-offs. Picking up one of those is much easier than starting fresh.

---

*Next:* if you have ten minutes, read [02 — Background](02-background.md). If you have an hour, read 02 → [03 — Science](03-science.md) → [04 — Architecture](04-architecture.md).
