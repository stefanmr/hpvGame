/* ════════════════════════════════════════════════════
   _TEMPLATE_persona.js — šablon za novu personu

   Uputstvo:
   1. Kopiraj ceo objekat ispod (od { do }).
   2. Nalepi ga u personas.js, u niz PERSONAS[],
      ISPRED stub-ova (pre Gorana).
   3. Promeni active: 0 u active: 1 kad je gotova.
   4. Otvori validate.html i prevuci personas.js —
      prijaviće sve greške pre nego što pushuješ.

   Nemoj menjati engine.js ni styles.css.
   ════════════════════════════════════════════════════ */

{
  /* ── IDENTITET ── */

  id: "ime_persone",
  // Interni ID — jedinstven, bez razmaka, latinica.
  // Koristi se u localStorage-u; ne menjati posle objave.
  // Primer: "ana", "igor", "biljana"

  active: 0,
  // 0 = stub (prikazuje "Uskoro", nije klikabilna)
  // 1 = aktivna, dostupna igračima
  // Postavi na 0 dok ne završiš sav sadržaj.

  name: "Ime",
  // Prikazano ime na kartici i u baru tokom igre.
  // Primer: "Ana"

  tag: "Jedna rečenica koja definiše stav",
  // Kratka karakterizacija u navodnicima, ispod imena na kartici.
  // Treba da bude u prvom licu ili blisko njemu.
  // Primer: "Čekam još jedan znak da je bezbedno"

  hook: "Rečenica za fasilitatore — kontekst koji igračima nije vidljiv.",
  // Nije prikazano u igri. Pomaže trenerima da kontekstualizuju personu.
  // Primer: "Medicinska sestra. Vidi vakcine svaki dan — ali ne za svoju decu."

  /* ── UVOD ── */

  intro: [
    "Prvi paragraf — ko si ti, koliko imaš godina, dete i situacija.",
    "Drugi paragraf — emocionalni ili istorijski kontekst koji objašnjava stav.",
    "Treći paragraf — šta se desilo neposredno pre ordinacije.",
    // HTML tagovi su dozvoljeni: <em>naglasak</em>
    // Svaki string = poseban paragraf.
    // Preporučeno: 3–5 paragrafa.
  ],

  /* ── POČETNO STANJE MERAČA ── */

  start: {
    anks: 60,
    // Anksioznost: 0 (smirena) – 100 (veoma anksiozna)
    // Visoka anks = zatvoreniji razgovor na početku.
    // Tipičan opseg za početak: 40–80

    sas: 10,
    // Saslušano: 0 (oseća se ignorisano) – 100 (oseća se čuto)
    // Na početku obično nizak (5–20).

    otv: 20,
    // Otvorenost: 0 (potpuno zatvorena) – 100 (otvorena za promenu)
    // Utiče i na koji se docHigh/docLow prikazuje (prag: sas+otv ≥ 30 ili 40).
    // Tipičan početak: 10–35

    dec: 25,
    // Odluka o vakcinaciji: 0 (čvrsto protiv) – 100 (čvrsto za)
    // Tipičan početak za oklevajućeg roditelja: 15–40
  },

  /* ── LEKAR U OVOJ PERSONI ── */

  doc: {
    i: "MJ",
    // Inicijali za avatar (1–2 slova, prikazana u krugu).
    // Primer: "MJ", "VP", "AS"

    l: "Dr Ime Prezime, titula",
    // Puno ime i zvanje, prikazano pored avatara.
    // Primer: "Dr Marija Janković, pedijatrica"
  },

  /* ── SCENE (4 obavezne) ── */

  scenes: [

    /* ── SCENA 1: Ulazak ── */
    {
      title: "Ulazak",
      // Naslov scene — prikazan u progress baru.

      docLine: "Prva rečenica lekara koja otvara razgovor.",
      // Koristiti docLine kada lekar govori isto bez obzira na stanje.
      // ALI: ako želiš da lekar reaguje na stanje merača ili unlock,
      // umesto docLine koristi docHigh+docLow ili docVariants (vidi Scenu 3).

      prompt: "Šta osećaš?",
      // Pitanje prikazano igraču — šta lik oseća ili bira.
      // Obično počinje sa "Šta osećaš?" ili "Šta odlučuješ?" ili slično.

      choices: [
        {
          em: "Naziv emocije",
          // Kratko ime emocije (bold). Primer: "Olakšanje", "Oprez", "Sumnja"

          in: "Unutrašnji monolog lika.",
          // Italic tekst ispod em, u prvom licu.
          // Primer: "Pita, ne kaže. Možda je drugačija."

          imp: { anks: -10, sas: 15, otv: 5, dec: 5 },
          // Uticaj na merače. Izostavi ključ ako nema promene.
          // anks: negativno = smanjuje anksioznost (dobro za otvorenost)
          // sas:  pozitivno = oseća se saslušanije
          // otv:  pozitivno = otvorenost raste
          // dec:  pozitivno = pomera ka vakcinaciji
          // Vrednosti su obično u opsegu -25 do +25 po izboru.

          re: "Naracija — šta se dešava u telu/mislima lika posle ovog izbora.",
          // Prikazano korisniku kao feedback. Kratko, senzorno, u drugom licu.
          // Primer: "Spuštaš ramena. Nešto u tebi se opušta."

          unlock: "naziv_taga",
          // OPCIONO. Dodaje tag u S.pPath — koristi se za req i docVariants.
          // Primer: unlock: "shared" (kad lik podeli lični gubitak)
          // Izostavi ceo ključ ako unlock nije potreban.
        },
        {
          em: "Drugi izbor",
          in: "Drugi unutrašnji monolog.",
          imp: { anks: 5, otv: -5, dec: -5 },
          re: "Naracija za drugi izbor.",
          // Bez unlock — jednostavno ga ne pišeš.
        },
        {
          em: "Treći izbor",
          in: "Treći unutrašnji monolog.",
          imp: { anks: 10, sas: -5, otv: -10, dec: -10 },
          re: "Naracija za treći izbor.",
        },
        {
          em: "Četvrti izbor",
          in: "Četvrti unutrašnji monolog.",
          imp: { anks: -5, sas: 20, otv: 5, dec: 10 },
          re: "Naracija za četvrti izbor.",

          req: "naziv_taga",
          // OPCIONO. Ovaj izbor se PRIKAZUJE samo ako je tag već u S.pPath
          // (tj. ako je igrac ranije izabrao opciju sa odgovarajućim unlock).
          // Primer: req: "shared"
          // Izostavi ceo ključ ako req nije potreban.
        },
      ],
    },

    /* ── SCENA 2: Razgovor ── */
    {
      title: "Razgovor",

      docHigh: "Tekst lekara kada je sas+otv ≥ 30 (persona je otvorenija).",
      docLow:  "Tekst lekara kada je sas+otv < 30 (persona je zatvorenija).",
      // Koristiti docHigh+docLow umesto docLine kada lekar treba
      // da reaguje na ukupno stanje razgovora.

      prompt: "Šta postavljaš?",
      choices: [
        { em: "Izbor A", in: "Monolog A.", imp: { sas: 5, otv: 10, dec: 5 }, re: "Reakcija A.", unlock: "deep" },
        { em: "Izbor B", in: "Monolog B.", imp: { sas: 10, otv: 5, dec: 5 }, re: "Reakcija B." },
        { em: "Izbor C", in: "Monolog C.", imp: { otv: 10, dec: 5 }, re: "Reakcija C." },
        { em: "Izbor D", in: "Monolog D.", imp: { sas: 20, otv: 10, dec: 20 }, re: "Reakcija D.", unlock: "weak" },
      ],
    },

    /* ── SCENA 3: Ključni momenat ── */
    {
      title: "Ključni momenat",

      docVariants: {
        deep: "Tekst lekara ako je igrac ranije unlockovao tag 'deep'.",
        weak: "Tekst lekara ako je igrac ranije unlockovao tag 'weak'.",
        high: "Fallback tekst ako nije ni deep ni weak, a sas+otv ≥ 40.",
        low:  "Fallback tekst ako nije ni deep ni weak, a sas+otv < 40.",
        // Redosled prioriteta u engine-u:
        //   1. Prvo proverava S.pPath (unlock tagovi, redom)
        //   2. Zatim "high" ako combined ≥ 40
        //   3. Na kraju "low" (ili prvi ključ ako low ne postoji)
        // Svaki ključ je opcioni — piši samo one koje su ti potrebni.
      },

      prompt: "Kako reaguješ?",
      choices: [
        { em: "Izbor A", in: "Monolog A.", imp: { anks: -25, sas: 25, otv: 15, dec: 20 }, re: "Reakcija A.", req: "deep" },
        { em: "Izbor B", in: "Monolog B.", imp: { anks: -10, sas: 10, otv: 15, dec: 15 }, re: "Reakcija B." },
        { em: "Izbor C", in: "Monolog C.", imp: { anks: 5, otv: -5, dec: -5 }, re: "Reakcija C." },
        { em: "Izbor D", in: "Monolog D.", imp: { otv: 5, dec: 0 }, re: "Reakcija D." },
      ],
    },

    /* ── SCENA 4: Odluka (OBAVEZNO POSLEDNJA) ── */
    {
      title: "Odluka",

      docLine: "Lekar pita za odluku — isti tekst bez obzira na stanje.",

      prompt: "Šta odlučuješ?",
      choices: [
        {
          em: "Pozitivna odluka",
          in: "Monolog — lik pristaje ili se vraća.",
          imp: { anks: -10, sas: 10, otv: 30, dec: 30 },
          end: "best",
          // end — OBAVEZNO u poslednjoj sceni za sve izbore koji vode kraju.
          // Vrednost mora biti ključ u endings{} ispod.
          // Preporučene vrednosti: "best" | "rushed" | "delayed" | "mid" | "pending" | "closed"
          re: "Naracija za ovu odluku.",
        },
        {
          em: "Brza odluka",
          in: "Monolog — lik pristaje odmah, možda prebrzo.",
          imp: { anks: -5, sas: 5, otv: 25, dec: 40 },
          end: "rushed",
          re: "Naracija za brzu odluku.",
        },
        {
          em: "Odlaganje",
          in: "Monolog — treba mi vreme.",
          imp: { sas: 5, otv: 10, dec: 10 },
          end: "delayed",
          re: "Naracija za odlaganje.",
        },
        {
          em: "Odbijanje",
          in: "Monolog — ne danas.",
          imp: { otv: -10, dec: -30 },
          end: "closed",
          re: "Naracija za odbijanje.",
        },
      ],
    },

  ], // kraj scenes[]

  /* ── ENDINGSI ── */
  // Svaki ključ mora odgovarati vrednosti end: u choices[] Scene 4.

  endings: {

    best: {
      phone: "Naracija — ko zove i šta kaže? (HTML dozvoljen, npr. <em>kursiv</em>)",
      // Scena posle ordinacije — telefon, poruka, dete u kolima.

      opts: [
        "Prva stvar koju lik kaže ili misli.",
        "Druga opcija.",
        "Treća opcija.",
        "Četvrta opcija.",
        // Tačno 4 stringa. Prikazani kao dugmad bez uticaja na merače.
        // Igrac bira jedno — posle toga se prikazuje close[].
      ],

      close: [
        "Prvi paragraf finalnog narativa — refleksija dok se vozi kući.",
        "Drugi paragraf.",
        "Treći paragraf — može biti otvoren, poetičan, bez rezolucije.",
        // HTML dozvoljen. Svaki string = paragraf.
        // Preporučeno: 3–5 paragrafa.
      ],
    },

    rushed: {
      phone: "Scena posle brze odluke.",
      opts: ["Opcija 1.", "Opcija 2.", "Opcija 3.", "Opcija 4."],
      close: ["Paragraf 1.", "Paragraf 2.", "Paragraf 3."],
    },

    delayed: {
      phone: "Scena posle odlaganja.",
      opts: ["Opcija 1.", "Opcija 2.", "Opcija 3.", "Opcija 4."],
      close: ["Paragraf 1.", "Paragraf 2.", "Paragraf 3."],
    },

    closed: {
      phone: "Scena posle odbijanja.",
      opts: ["Opcija 1.", "Opcija 2.", "Opcija 3.", "Opcija 4."],
      close: ["Paragraf 1.", "Paragraf 2.", "Paragraf 3."],
    },

    // Dodaj mid: {} ili pending: {} ako ih koristiš u choices[].end

  }, // kraj endings{}

  finalLine: "Hvala što si bio/bila Ime ovih 10 minuta.",
  // Poslednja rečenica prikazana korisniku na kraju igre.
  // Prilagodi rod i ime persone.

}, // kraj persone — zarez je obavezan jer ide u niz PERSONAS[]
