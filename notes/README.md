# notes/

Pomoćni materijali za istraživanje i analizu igre — nisu deo build-a, ne učitavaju se u browseru.

## queries.sql

Referentna zbirka gotovih SQL upita za izvlačenje istraživačkih podataka iz Supabase baze.

### Zašto fajl postoji

- **`stats.html` je za live dashboard** — brzi vizuelni pregled tokom radionice ili posle. Pokazuje sumarno: koliko sesija, koja distribucija opcija itd. Ali UI je ograničen — ne možeš da menjaš upit usred radionice.
- **`queries.sql` je za publikaciju i dublje analize** — kad pišeš rad, treba ti tačan broj sa filterom "samo sesije iz Novog Sada u maju u retry modu" ili "koliko je sesija probalo Marijinu priču ali ne i Petrovu". UI to ne daje; SQL da.

### Kako se koriste

1. Otvori **Supabase Studio** → SQL Editor (`https://app.supabase.com/project/<project-id>/sql/new`)
2. Otvori `notes/queries.sql` u editoru (VS Code, ili obični tekst editor)
3. Kopiraj **jedan upit** (od `SELECT …` do `;`) — ne ceo fajl odjednom
4. Paste u Supabase SQL editor, klik na "Run" (ili `Cmd+Enter`)
5. Rezultati se prikazuju u tabeli ispod; možeš da exportuješ kao CSV za R/Excel/Stata

### Šta dobijaš iz svake sekcije

**1. Overview**
- _Primer_: "Treba mi za uvod rada — koliko ukupno sesija imamo, na koliko različitih radionica?"
- `1.1` dnevni dashboard · `1.2` svaka radionica posebno · `1.3` retry vs sim breakdown

**2. HCP igra**
- _Primer_: "Recenzent traži tabelu po koraku — koliki % igrača bira tačan odgovor u Eliciraj fazi vs Činjenice?" → `2.2`
- `2.3` ti pokazuje **konkretne distractor opcije** ("u koraku 2 scenarija 3, ova _neutralna_ opcija privlači 40% klikova — verovatno nejasno formulisana")
- `2.5` funnel ti pokazuje gde igrači odustaju ("60% počne, samo 35% završi" → engagement metric)

**3. Parent igra**
- _Primer_: "Da li Marijina priča ima više `best` završetaka od Petrove? Da li je avg `odluka` slična?" → `3.1` i `3.3`
- `3.2` funnel — gde u CYOA igrači prekidaju (često scena 3 ako je teška)

**4. Sesije** (engagement depth)
- `4.1` prosečno scenarija + likova po sesiji ("prosečan učesnik proba 2.3 različite igre")
- `4.2` distribucija (ko proba 1 vs ko 4+ — radionice "duboke" ili "površne")
- `4.3` trajanje sesije iz `session_end` event-a (median + p90 — za odeljak "Procedure" rada)
- `4.4` last_screen — "gde su se sesije završile" → signal o intuitivnosti UI-ja

**5. Poređenja** (najvažnija sekcija za istraživačko pitanje)
- `5.1` _Primer_: "Hipoteza: u sim modu prvi izbor je iskreniji jer nema retry. Da li je % `good` izbora u sim-u niži ili viši?"
- `5.2` da li retry mod daje bolje ishode — testira pedagošku vrednost retry-ja
- `5.3` template za A vs B poređenje dve radionice (zameni `workshop_id`-jeve)

**6. Time series**
- `6.1` trend — da li se rezultati poboljšavaju kroz iteracije sadržaja
- `6.2` navika — kad ljudi igraju

### Workflow za istraživački rad

1. **Pre radionice** — `1.2` da znaš trenutno stanje
2. **Tokom radionice** — live `stats.html` dashboard
3. **Posle radionice** — `1.2` + `5.1` + `5.2` (vidi rezultate ove radionice u kontekstu svih)
4. **Za pisanje rada**:
   - _Methods/Procedure_ — `4.1`, `4.3`
   - _Results_ — `2.1`, `2.2`, `3.1`
   - _Discussion_ — `5.1`, `5.2`

### Napomene o podacima

- **Mode polje** (`payload->>'mode'`) postoji od v3.0 — stari događaji (pre 2026-05) imaju `NULL`. Tretiraj ih kao "nepoznato".
- **`session_end`** event takođe od v3.0 — pre toga ne znaš trajanje sesije.
- **Distinct sesije se broje po `session_id`** koji je anonimni UUID iz `localStorage`. Isti uređaj = ista sesija kroz različite posete; različiti uređaji istog korisnika = različite sesije.
- **`workshop_id`** dolazi iz `?w=` query parametra na URL-u koji je u QR kodu. Ako neko otvori `index.html` direktno (bez QR-a), `workshop_id` je `NULL`.
