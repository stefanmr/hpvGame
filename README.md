# Od nedoumice do odluke
claude --resume 8feada7b-a7de-4dcd-a942-21a6a476b9e0

Interaktivna edukativna igra za zdravstvene radnike — vežbanje empatičke komunikacije o HPV vakcinaciji. Dve perspektive: lekar koji vodi razgovor i roditelj koji okleva.

**[→ Otvori igru](https://hpvgame.pages.dev/)** &nbsp;·&nbsp; **[→ Validator](https://hpvgame.pages.dev/validate.html)** &nbsp;·&nbsp; **[→ Statistika](https://hpvgame.pages.dev/stats.html)** &nbsp;·&nbsp; **[→ QR generator](https://hpvgame.pages.dev/qr.html)**

---

## Dokumentacija

Cela dokumentacija je u folderu [`docs/`](docs/) (na engleskom, namenjena devima i istraživačima).

| Poglavlje | Sadržaj |
|---|---|
| [01 — Overview](docs/01-overview.md) | 30-sekundni pitch + kako čitati ostalo. |
| [02 — Background](docs/02-background.md) | Zašto igra, zašto baš HPV, zašto dve perspektive. |
| [03 — Science](docs/03-science.md) | Fasce 2023 + Holford 2024 → mapiranje na konkretne fajlove i polja. |
| [04 — Architecture](docs/04-architecture.md) | Fajl struktura, state, language pack, URL parametri, hosting. |
| [05 — Game 01 (HCP)](docs/05-game-01-hcp.md) | Mehanika lekarske igre. |
| [06 — Game 02 (Parent)](docs/06-game-02-parent.md) | Mehanika roditeljske igre. |
| [07 — Analytics](docs/07-analytics.md) | Supabase event vokabular + dashboard. |
| [08 — Extending](docs/08-extending.md) | Korak-po-korak: dodaj personu, scenario, UI string, jezik. |
| [09 — i18n](docs/09-i18n.md) | Language pack + Gemini translate pipeline. |
| [10 — Roadmap](docs/10-roadmap.md) | Aktuelno + razmatrano-i-odbijeno. |
| [refs.md](docs/refs.md) | Bibliografija. |

## Brz početak — najčešći zadaci

- **Dodaj novu personu (Igra 02):** kopiraj `_TEMPLATE_persona.js`, prati [08 §1](docs/08-extending.md#1-add-a-new-persona-game-02).
- **Dodaj novi HCP scenario (Igra 01):** [08 §2](docs/08-extending.md#2-add-a-new-hcp-scenario-game-01).
- **Edituj UI string:** [08 §3](docs/08-extending.md#3-add-or-edit-a-ui-string).
- **Pokreni Gemini prevod:** `node scripts/translate.js persona <idx>` — vidi [09](docs/09-i18n.md).
- **Pripremi radionicu (QR):** `qr.html`, popuni workshop ID + mode + jezik.

## Reference

- Fasce, A. et al. (2023). *Nature Human Behaviour*, 7, 1462–1480 — taksonomija 11 attitude roots.
- Holford, D. et al. (2024). *Health Psychology*, 43(6), 426–437 — ERI okvir (Elicit–Affirm–Refute–Inform).
- [jitsuvax.info](https://jitsuvax.info) — alat za procenu attitude roots.

Puni citati i ostali izvori u [docs/refs.md](docs/refs.md).
