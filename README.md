# Od nedoumice do odluke

Interaktivna edukativna igra za zdravstvene radnike — vežbanje empatičke komunikacije o HPV vakcinaciji. Dve perspektive: lekar koji vodi razgovor i roditelj koji okleva.

**[→ Otvori igru](https://stefanmr.github.io/hpvGame/)** &nbsp;·&nbsp; **[→ Validator](https://stefanmr.github.io/hpvGame/validate.html)** &nbsp;·&nbsp; **[→ Statistika](https://stefanmr.github.io/hpvGame/stats.html)**

---

## Struktura fajlova

| Fajl | Edituje se? | Sadržaj |
|------|-------------|---------|
| `personas.js` | ✅ da | Igra 02 — persone roditelja |
| `scenarios.js` | ✅ da | Igra 01 — HCP scenariji |
| `_TEMPLATE_persona.js` | ✅ kopirati | Šablon za novu personu sa komentarima |
| `validate.html` | ne | Alat za proveru ispravnosti personas.js |
| `engine.js` | ne | Logika igre, state, render |
| `analytics.js` | konfiguracija | Anonimno beleženje izbora (Supabase) |
| `stats.html` | ne | Dashboard za facilitatora (login potreban) |
| `styles.css` | ne | CSS |
| `index.html` | ne | HTML struktura |

---

## Dodavanje nove persone (Igra 02)

1. Otvori `_TEMPLATE_persona.js` — kopiraj ceo objekat `{ ... }`.
2. Nalepi ga u `personas.js`, u niz `PERSONAS[]`, **ispred stub-ova** (pre Gorana).
3. Popuni sva polja prateći komentare u šablonu. Postavi `active: 0` dok ne završiš.
4. Kad je sadržaj gotov, postavi `active: 1`.
5. Prevuci `personas.js` na `validate.html` — popravi sve greške pre pusha.
6. Commit i push.

**Brza referenca — opsezi merača:**

| Merač | 0 | 100 |
|-------|---|-----|
| `anks` | mirna | veoma anksiozna |
| `sas` | oseća se ignorisano | oseća se saslušano |
| `otv` | zatvorena | otvorena za promenu |
| `dec` | čvrsto protiv vakcinacije | čvrsto za vakcinaciju |

Tipičan početak za oklevajućeg roditelja: `anks: 50–75`, `sas: 5–15`, `otv: 15–30`, `dec: 15–35`.

---

## Dodavanje novog scenarija (Igra 01)

Scenariji se dodaju u `scenarios.js`, u niz `HCP_SCENARIOS[]`. Svaki scenario ima 4 obavezna koraka:

| Korak | `t:` | Šta igrac bira |
|-------|------|----------------|
| 1 | `"root"` | Identifikuje attitude root (opcije imaju `ok: 1` ili `ok: 0`) |
| 2 | `"affirm"` | Afirmacija (opcije imaju `q: "good"/"neutral"/"bad"`) |
| 3 | `"refute"` | Opovrgavanje |
| 4 | `"facts"` | Činjenice |

Uticaji na merače (`trust` i `will`) su fiksni u `engine.js` i ne menjaju se po scenariju:

```
affirm  good    → trust +15
affirm  bad     → trust -15
refute  good    → trust +10, will +20
refute  neutral → will +5
refute  bad     → trust -10, will -10
facts   good    → trust +5,  will +20
facts   neutral → will +5
```

Ending se određuje po finalnom `trust`: ≥ 70 → `eGood`, 40–69 → `eMid`, < 40 → `eBad`.

---

## Potencijalni TODO

- **Više scena po personi/scenariju** — trenutno je fiksno 4. Parametrizovati u `engine.js` (pip logika i progress bar). Omogućilo bi duže HCP scenarije sa više koraka.
- **Prenos trust/will između scenarija** — akumulisani score u sesiji umesto reset-a na 50/30 pri svakom novom scenariju. Pedagoški: vidi da konzistentno loše odluke imaju kumulativni efekat.
- **Adaptivni odabir sledećeg scenarija** — po ostvarenom finalnom trust-u predloži scenario koji adresira isti attitude root ali iz druge perspektive.
- **Mid-game debrief** — posle svake sesije prikaži koje attitude roots je igrac konzistentno pogrešno identifikovao.
- **Unlock-based grananje između scena u HCP igri** — analogno `req`/`unlock` mehanizmu u parent igri; lekar dobija drugačiji tok razgovora zavisno od ranog izbora.

## Analitika radionica

Igra anonimno beleži izbore u Supabase bazu radi istraživanja efikasnosti vežbe. Svaki klik se loguje sa `session_id`-jem (UUID u `localStorage`, anoniman, bez ličnih podataka) i opcionim `workshop_id`-jem iz URL parametra `?w=...`.

Saglasnost je prikazana u uvodnom ekranu sa opt-out linkom. Ako korisnik klikne odustajanje, šalje se marker `consent_revoked` i `track()` postaje no-op za tu sesiju i sve buduće.

Konfiguracija (URL projekta + publishable key) ide u `analytics.js`. Anon ima samo `insert` pravo na `events` tabelu; čitanje je iza Supabase autentikacije (RLS politika).

**Tokom radionice:**
- Otvori `stats.html`, uloguj se sa Supabase email-om, filtriraj po `workshop_id`-ju.
- Uključi "Uživo" za auto-osveži svakih 10 sekundi.
- Vidiš: broj sesija, distribucija ishoda po scenariju/liku, kvalitet izbora po ERI koraku, najnoviji događaji.

**Posle radionice:**
- Export podataka: Supabase Studio → Table Editor → `events` → "Export CSV".
- Za naprednije upite: Supabase SQL Editor (npr. najlošije birane opcije, drop-off između scena).

## Reference

- Fasce, A. et al. (2023). Inoculation and attitudinal inoculation reduce misperceptions and vaccine hesitancy. *Nature Human Behaviour*, 7, 1462–1480. — taksonomija 11 attitude roots korišćena u Koraku 1 Igre 01.
- Holford, D. et al. (2024). Testing the ERI (Elicit–Respond–Inoculate) approach to address vaccine hesitancy. *Health Psychology*, 43(6), 426–437. — ERI okvir (Eliciraj → Afirmiši → Opovrgni → Činjenice) koji strukturiše Igru 01.
- Alat za procenu attitude roots: [jitsuvax.info](https://jitsuvax.info)
