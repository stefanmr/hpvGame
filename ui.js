/* ════════════════════════════════════════════════════
   ui.js — UI stringovi za i18n

   Učitava se PRE engine.js. Definiše:
   - UI struktura sa SR i EN labelama
   - t(key, params)               — lookup helper sa fallback na SR
   - applyI18n(root)              — popunjava sve [data-i18n] elemente

   Sadržaj fajla `scenarios.js` i `personas.js` se NE prevodi ovde —
   već u samim data fajlovima preko { sr: [...], en: [...] } strukture.
   ════════════════════════════════════════════════════ */

const UI = {

sr: {

  // ─── Browser title & brand ───
  "title.page": "Od nedoumice do odluke — interaktivna vežba",
  "brand.mark1": "Od nedoumice",
  "brand.mark2": "do odluke",
  "brand.meta": "interaktivna vežba · v3",

  // ─── Crumb (breadcrumb) ───
  "crumb.home": "Početak",
  "crumb.doctor": "Lekar",
  "crumb.scenarios": "Scenariji",
  "crumb.parent": "Roditelj",

  // ─── Dialozi i stub ───
  "dialog.resetConfirm": "Resetuj sve i počni iznova?",
  "dialog.homeConfirm": "Vratiti se na početak? Trenutni napredak se čuva.",
  "dialog.stubClick": "Ovaj lik je u izradi. Biće dostupan u sledećoj verziji.",
  "persona.stubBadge": "Uskoro",

  // ─── Role select screen ───
  "role.eyebrow": "Dve perspektive · jedna tema",
  "role.title": "U <em>čijim</em><br>cipelama danas?",
  "role.lead": "Vakcinacija nije monolog. Dve igre, dva pogleda. Jedna kroz oči lekara koji pokušava da pomogne, druga kroz oči roditelja koji okleva. Razumevanje obe strane je preduslov dobre prakse.",
  "role.hcp.tag": "Igra 01",
  "role.hcp.title": "Razgovor sa<br><em>roditeljem</em>",
  "role.hcp.desc": "Vi ste lekar. Pred vama je roditelj sa konkretnom brigom. Prepoznajte koren stava, vežbajte empatičke odgovore. Osam scenarija na izbor.",
  "role.hcp.meta": "~15 min · uloga: lekar",
  "role.hcp.cta": "Krenite kao lekar",
  "role.parent.tag": "Igra 02",
  "role.parent.title": "U <em>cipelama</em><br>roditelja",
  "role.parent.desc": "Postanite roditelj koji okleva. Osetite šta znači biti ranjiv u ordinaciji. Birajte šta osećate, ne šta govorite. Osam likova na izbor.",
  "role.parent.meta": "~10 min · uloga: roditelj",
  "role.parent.cta": "Krenite kao roditelj",
  "role.groupNote": "<strong>Za grupe:</strong> Igrate samostalno ili u parovima. Predlog — 1–2 scenarija ili lika po sesiji, ostavite vremena za razgovor među sobom posle svakog. Sve odluke se čuvaju u brauzeru, možete pauzirati.",
  "role.privacy": "<strong>Privatnost:</strong> Izbori se anonimno beleže radi istraživanja efikasnosti vežbe. Ne prikupljaju se imena, email-ovi ni IP adrese; nema praćenja izvan ovog alata. Ako ne želite da učestvujete u beleženju, kliknite <a onclick=\"setAnalyticsConsent(false)\" style=\"cursor:pointer;color:var(--coral)\">ovde</a>.",
  "role.privacy.declined": "<strong>Privatnost:</strong> Odjavljeni ste iz beleženja. Vaši budući klikovi se ne šalju.",

  // ─── HCP profile screen ───
  "hcpProfile.eyebrow": "Igra 01 · Razgovor sa roditeljem",
  "hcpProfile.title": "Koja je vaša uloga<br>u zdravstvenom sistemu?",
  "hcpProfile.lead": "Vaš profil daje kontekst razgovoru — kako vas roditelj doživljava i šta podrazumevate o porodici. Mehanika scenarija ostaje ista.",

  // ─── HCP scenario pick ───
  "hcpPick.eyebrow": "Izaberite scenario",
  "hcpPick.title": "Pred vama je roditelj.<br>Koji danas?",
  "hcpPick.lead": "Osam različitih briga, osam različitih psiholoških korenova. Posle završenog razgovora možete birati drugi — ili završiti sesiju.",
  "hcpPick.finishBtn": "Završi sesiju i vidi rezultate",
  "hcpPick.scenarioNum": "Scenario {nn}",
  "hcpPick.scenarioDone": "Scenario {nn} · završen",

  // ─── HCP game screen / bar ───
  "hcpGame.scenarioPrefix": "Scenario · ",
  "hcpGame.scenarioFull": "Scenario · <strong>{nn} / {total}</strong>",
  "hcpGame.stepHint": "Razgovor počinje...",
  "hcpGame.metersHead": "Stanje roditelja",
  "hcpGame.meter.trust": "Poverenje",
  "hcpGame.meter.will": "Prihvatanje vakcinacije",
  "hcpGame.scnNum": "Scenario {nn}",

  // ─── HCP start-of-scenario note ───
  "startNote.label": "Polazna pozicija",
  "startNote.trust": "Poverenje",
  "startNote.will": "Spremnost",

  // ─── ERI steps ───
  "step.eri.0": "Eliciraj",
  "step.eri.1": "Afirmišite",
  "step.eri.2": "Opovrgnite",
  "step.eri.3": "Činjenice",
  "step.prefix": "Korak",
  "step.counter": "Korak {n}/4 · ",
  "step.numberPadded": "Korak {nn}",

  // ─── HCP feedback labels ───
  "fb.retry.good": "Odlično",
  "fb.retry.neutral": "Funkcionalno — probajte da pronađete bolji odgovor",
  "fb.retry.bad": "Rizično — pokušajte drugi odgovor",
  "fb.sim.good": "Odlično",
  "fb.sim.neutral": "Funkcionalno — ali nije optimalno",
  "fb.sim.bad": "Rizično — razgovor nastavlja sa posledicama",
  "fb.root.correct": "Tačno",
  "fb.root.incorrectRetry": "Nije tačno — pokušajte ponovo",
  "fb.root.incorrectSim": "Nije tačno — razgovor ide dalje",

  // ─── Buttons ───
  "btn.nextStep": "Sledeći korak",
  "btn.finishConv": "Završi razgovor",
  "btn.backToScenarios": "Nazad na scenarije",
  "btn.anotherScenario": "Još jedan scenario",
  "btn.tryAnother": "Probaj drugog lika",
  "btn.nextScene": "Sledeća scena",
  "btn.exitOffice": "Izlazak iz ordinacije",
  "btn.enterOffice": "Ulazak u ordinaciju",
  "btn.home": "Početak",

  // ─── Impact pillovi ───
  "impact.trust": "Poverenje",
  "impact.will": "Spremnost",
  "impact.anks": "Anksioznost",
  "impact.sas": "Saslušanost",
  "impact.otv": "Otvorenost",
  "impact.dec": "Prihvatanje",

  // ─── HCP scenario outcome tone ───
  "outcome.good": "Roditelj odlazi sa otvorenim umom.",
  "outcome.mid": "Roditelj nije ubeđen, ali nije ni zatvoren.",
  "outcome.bad": "Razgovor je zatvoren — odlazi sa istom pozicijom.",

  "endCard.eyebrow": "Kraj razgovora",
  "endCard.lesson": "Pouka:",

  // ─── Review screen (kraj scenarija) ───
  "review.title": "Pregled tvojih izbora",
  "review.cap.label": "Krajnji rezultat",
  "review.cap.why": "Zašto plafon nije 100?",
  "review.cap.trust": "Poverenje",
  "review.cap.will": "Spremnost",
  "review.attempt": "Pokušaj {n}",
  "review.attempts": "{n} pokušaja",
  "review.correctRoot": "Tačan koren je bio:",
  "review.betterAnswer": "Bolji odgovor bi bio:",

  // ─── Persona intro (parent) ───
  "persona.intro.prefix": "Lik {nn}",
  "persona.intro.stateHd": "Tvoje stanje sad:",
  "persona.intro.footer": "Tvoji izbori menjaju ove mere. Cilj nije «pobeda» — već iskreni odgovor onome šta lik oseća.",
  "persona.scene.beforeChat": "Pre razgovora",
  "persona.scene.endLbl": "Kraj",
  "persona.scene.counter": "Scena {n}/{total}",
  "persona.scene.numPadded": "Scena {nn}",
  "persona.scene.numTitle": "Scena {nn} · {title}",

  // ─── Parent feedback & ending ───
  "parent.feel.label": "U tebi se događa",
  "parent.ending.eyebrow": "Posle razgovora",
  "parent.ending.prompt": "Šta joj/mu kažeš?",
  "parent.bar.personaLbl": "Lik · <strong>{name}</strong>",

  // ─── Parent pick screen ───
  "parentPick.eyebrow": "Igra 02 · U cipelama roditelja",
  "parentPick.title": "Ko ste vi <em>danas</em>?",
  "parentPick.lead1": "Niste lekar. Niste posmatrač. Postaćete neko ko sutra ide na pregled sa nedoumicom u stomaku.",
  "parentPick.lead2": "Birajte lik koji vam je najmanje sličan — najviše ćete naučiti.",
  "parentPick.note": "<strong>Napomena:</strong> Ovo nije test ispravnih odgovora. Svaki izbor je pokušaj da budete iskreni prema osećaju lika. Nema „pobeđujem\" — postoji samo iskustvo.",
  "parentPick.g2.head": "Zašto baš ova igra?",
  "parentPick.g2.p1": "Vežba je namenjena <strong>zdravstvenim radnicima</strong> — istim onima koji u Igri 01 vežbaju razgovor sa oklevajućim roditeljem. Ovde se uloge zamenjuju: postajete roditelj.",
  "parentPick.g2.p2": "Cilj nije „pobeda\" — nego da iz prve ruke osetite zašto razuman čovek može da okleva. Kroz priče četiri lika vidite kako:",
  "parentPick.g2.li1": "<strong>Anksioznost menja šta čujete od lekara</strong> — iste reči, drugačije značenje kad ste uplašeni.",
  "parentPick.g2.li2": "<strong>Mali znaci poštovanja menjaju spremnost za razgovor</strong> — naspram pritiska koji zatvara vrata.",
  "parentPick.g2.li3": "<strong>Iste činjenice deluju drugačije kroz različite emocionalne filtere</strong> — zašto „dokazi\" ponekad ne ubeđuju.",
  "parentPick.g2.meta": "Svaki lik traje ~10 minuta. Možete ih probati u bilo kom redosledu — svaki je drugačiji slučaj.",

  // ─── Parent game side meters ───
  "parentGame.metersHead": "Tvoje stanje",
  "parentGame.meter.anks": "Anksioznost",
  "parentGame.meter.sas": "Saslušanost",
  "parentGame.meter.otv": "Otvorenost",
  "parentGame.meter.dec": "Prihvatanje vakcinacije",
  "parentGame.meter.against": "protiv vakcinacije",
  "parentGame.meter.for": "za vakcinaciju",

  // ─── HCP Summary screen ───
  "summary.eyebrow": "Završili ste sesiju",
  "summary.titleSingular": "{n} razgovor.<br><em>Šta sad?</em>",
  "summary.titleFew": "{n} razgovora.<br><em>Šta sad?</em>",
  "summary.titleMany": "{n} razgovora.<br><em>Šta sad?</em>",
  "summary.intro": "Empatičko opovrgavanje nije veština koja se nauči odjednom — ali je <strong>moguće je naučiti</strong>. Ključ je da slušate <em>zašto</em> pre nego što odgovorite <em>šta</em>.",
  "summary.stat.avgTrust": "Prosečno poverenje",
  "summary.stat.avgWill": "Prosečna spremnost",
  "summary.stat.roots": "Tačni korenovi",
  "summary.stat.good": "Optimalni izbori",
  "summary.takes.head": "Pet stvari koje treba zapamtiti",
  "summary.takes.1.title": "Prvo prepoznajte koren, pa onda govorite.",
  "summary.takes.1.body": "Argumenti se ponavljaju, ali se motivi razlikuju. Isti odgovor neće raditi za sva tri.",
  "summary.takes.2.title": "Afirmacija pre opovrgavanja.",
  "summary.takes.2.body": "Holford et al. (2024) — afirmacija je imala najveći efekat, veći od dodavanja činjenica.",
  "summary.takes.3.title": "Konkretno, ne uopšteno.",
  "summary.takes.3.body": "„Vakcina je bezbedna\" radi gotovo nikad. „Aluminijuma u svim vakcinama ima manje nego u mleku za 6 meseci\" radi često.",
  "summary.takes.4.title": "Nikad ne osporavajte autonomiju.",
  "summary.takes.4.body": "Pritisak garantuje suprotan ishod. Pojačajte njihov osećaj kontrole, ne svoje autoritete.",
  "summary.takes.5.title": "Ne morate ubediti danas.",
  "summary.takes.5.body": "Cilj nije konverzija u jednom razgovoru — cilj je <em>otvoriti vrata</em> za sledeći.",
  "summary.cite": "<strong>Reference:</strong> Fasce, A. et al. (2023). Nature Human Behaviour, 7, 1462–1480. · Holford, D. et al. (2024). Health Psychology, 43(6), 426–437. · Alat: <a href=\"https://jitsuvax.info\" target=\"_blank\">jitsuvax.info</a>",

  // ─── Language toggle ───
  "lang.toggle.sr": "SR",
  "lang.toggle.en": "EN",
  "lang.toggle.aria": "Promeni jezik"
},

en: {"title.page":"From Hesitation to Decision — interactive exercise","brand.mark1":"From Hesitation","brand.mark2":"to Decision","brand.meta":"interactive exercise · v3","crumb.home":"Home","crumb.doctor":"Doctor","crumb.scenarios":"Scenarios","crumb.parent":"Parent","dialog.resetConfirm":"Reset everything and start over?","dialog.homeConfirm":"Return to home? Your current progress is saved.","dialog.stubClick":"This character is under development. It will be available in the next version.","persona.stubBadge":"Coming soon","role.eyebrow":"Two perspectives · one topic","role.title":"In <em>whose</em><br>shoes today?","role.lead":"Vaccination is not a monologue. Two games, two perspectives. One through the eyes of a doctor trying to help, the other through the eyes of a hesitant parent. Understanding both sides is a prerequisite for good practice.","role.hcp.tag":"Game 01","role.hcp.title":"Conversation with<br>a <em>parent</em>","role.hcp.desc":"You are a doctor. You are facing a parent with a specific concern. Identify the attitude root, practice empathic responses. Eight scenarios to choose from.","role.hcp.meta":"~15 min · role: doctor","role.hcp.cta":"Start as a doctor","role.parent.tag":"Game 02","role.parent.title":"In a <em>parent's</em><br>shoes","role.parent.desc":"Become a hesitant parent. Feel what it's like to be vulnerable in the doctor's office. Choose what you feel, not what you say. Eight characters to choose from.","role.parent.meta":"~10 min · role: parent","role.parent.cta":"Start as a parent","role.groupNote":"<strong>For groups:</strong> Play individually or in pairs. Suggestion — 1–2 scenarios or characters per session, leave time for discussion among yourselves after each. All decisions are saved in the browser, you can pause.","role.privacy":"<strong>Privacy:</strong> Choices are anonymously recorded for research on the exercise's effectiveness. No names, emails, or IP addresses are collected; there is no tracking outside this tool. If you do not wish to participate in logging, click <a onclick=\"setAnalyticsConsent(false)\" style=\"cursor:pointer;color:var(--coral)\">here</a>.","role.privacy.declined":"<strong>Privacy:</strong> You have opted out of logging. Your future clicks will not be sent.","hcpProfile.eyebrow":"Game 01 · Conversation with a parent","hcpProfile.title":"What is your role<br>in the healthcare system?","hcpProfile.lead":"Your profile provides context to the conversation — how the parent perceives you and what you assume about the family. The scenario mechanics remain the same.","hcpPick.eyebrow":"Choose a scenario","hcpPick.title":"You are facing a parent.<br>Which one today?","hcpPick.lead":"Eight different concerns, eight different psychological attitude roots. After completing a conversation, you can choose another — or end the session.","hcpPick.finishBtn":"End session and view results","hcpPick.scenarioNum":"Scenario {nn}","hcpPick.scenarioDone":"Scenario {nn} · completed","hcpGame.scenarioPrefix":"Scenario · ","hcpGame.scenarioFull":"Scenario · <strong>{nn} / {total}</strong>","hcpGame.stepHint":"The conversation begins...","hcpGame.metersHead":"Parent's status","hcpGame.meter.trust":"Trust","hcpGame.meter.will":"Vaccination acceptance","hcpGame.scnNum":"Scenario {nn}","startNote.label":"Starting position","startNote.trust":"Trust","startNote.will":"Willingness","step.eri.0":"Elicit","step.eri.1":"Affirm","step.eri.2":"Refute","step.eri.3":"Facts","step.prefix":"Step","step.counter":"Step {n}/4 · ","step.numberPadded":"Step {nn}","fb.retry.good":"Excellent","fb.retry.neutral":"Functional — try to find a better answer","fb.retry.bad":"Risky — try another answer","fb.sim.good":"Excellent","fb.sim.neutral":"Functional — but not optimal","fb.sim.bad":"Risky — the conversation continues with consequences","fb.root.correct":"Correct","fb.root.incorrectRetry":"Incorrect — try again","fb.root.incorrectSim":"Incorrect — the conversation moves on","btn.nextStep":"Next step","btn.finishConv":"End conversation","btn.backToScenarios":"Back to scenarios","btn.anotherScenario":"Another scenario","btn.tryAnother":"Try another character","btn.nextScene":"Next scene","btn.exitOffice":"Exit office","btn.enterOffice":"Enter office","btn.home":"Home","impact.trust":"Trust","impact.will":"Willingness","impact.anks":"Anxiety","impact.sas":"Feeling heard","impact.otv":"Openness","impact.dec":"Acceptance","outcome.good":"The parent leaves with an open mind.","outcome.mid":"The parent is not convinced, but not closed off either.","outcome.bad":"The conversation is closed — they leave with the same position.","endCard.eyebrow":"End of conversation","endCard.lesson":"Lesson:","review.title":"Review of your choices","review.cap.label":"Final result","review.cap.why":"Why isn't the ceiling 100?","review.cap.trust":"Trust","review.cap.will":"Willingness","review.attempt":"Attempt {n}","review.attempts":"{n} attempts","review.correctRoot":"The correct attitude root was:","review.betterAnswer":"A better answer would have been:","persona.intro.prefix":"Character {nn}","persona.intro.stateHd":"Your current status:","persona.intro.footer":"Your choices change these metrics. The goal is not to 'win' — but to respond honestly to what the character feels.","persona.scene.beforeChat":"Before the conversation","persona.scene.endLbl":"End","persona.scene.counter":"Scene {n}/{total}","persona.scene.numPadded":"Scene {nn}","persona.scene.numTitle":"Scene {nn} · {title}","parent.feel.label":"What's happening within you","parent.ending.eyebrow":"After the conversation","parent.ending.prompt":"What do you say to her/him?","parent.bar.personaLbl":"Character · <strong>{name}</strong>","parentPick.eyebrow":"Game 02 · In a parent's shoes","parentPick.title":"Who are you <em>today</em>?","parentPick.lead1":"You are not a doctor. You are not an observer. You will become someone who goes for an appointment tomorrow with a knot of doubt in their stomach.","parentPick.lead2":"Choose the character least like you — you will learn the most.","parentPick.note":"<strong>Note:</strong> This is not a test of correct answers. Every choice is an attempt to be honest with the character's feelings. There is no 'winning' — there is only experience.","parentPick.g2.head":"Why this game?","parentPick.g2.p1":"This exercise is intended for <strong>healthcare workers</strong> — the same ones who practice conversations with hesitant parents in Game 01. Here, the roles are reversed: you become the parent.","parentPick.g2.p2":"The goal is not to 'win' — but to experience firsthand why a reasonable person might hesitate. Through the stories of four characters, you see how:","parentPick.g2.li1":"<strong>Anxiety changes what you hear from the doctor</strong> — the same words, a different meaning when you are scared.","parentPick.g2.li2":"<strong>Small signs of respect change willingness to talk</strong> — as opposed to pressure that closes doors.","parentPick.g2.li3":"<strong>The same facts appear differently through various emotional filters</strong> — why 'evidence' sometimes doesn't convince.","parentPick.g2.meta":"Each character lasts ~10 minutes. You can try them in any order — each is a different case.","parentGame.metersHead":"Your status","parentGame.meter.anks":"Anxiety","parentGame.meter.sas":"Feeling heard","parentGame.meter.otv":"Openness","parentGame.meter.dec":"Vaccination acceptance","parentGame.meter.against":"against vaccination","parentGame.meter.for":"for vaccination","summary.eyebrow":"You have completed the session","summary.titleSingular":"{n} conversation.<br><em>What now?</em>","summary.titleFew":"{n} conversations.<br><em>What now?</em>","summary.titleMany":"{n} conversations.<br><em>What now?</em>","summary.intro":"Empathic refutation is not a skill learned overnight — but it <strong>can be learned</strong>. The key is to listen to <em>why</em> before you answer <em>what</em>.","summary.stat.avgTrust":"Average trust","summary.stat.avgWill":"Average willingness","summary.stat.roots":"Correct attitude roots","summary.stat.good":"Optimal choices","summary.takes.head":"Five things to remember","summary.takes.1.title":"First identify the attitude root, then speak.","summary.takes.1.body":"Arguments repeat, but motives differ. The same answer won't work for all three.","summary.takes.2.title":"Affirmation before refutation.","summary.takes.2.body":"Holford et al. (2024) — affirmation had the greatest effect, greater than adding facts.","summary.takes.3.title":"Specific, not general.","summary.takes.3.body":"'The vaccine is safe' almost never works. 'There is less aluminum in all vaccines than in 6 months of milk' often works.","summary.takes.4.title":"Never challenge autonomy.","summary.takes.4.body":"Pressure guarantees the opposite outcome. Enhance their sense of control, not your authority.","summary.takes.5.title":"You don't have to convince them today.","summary.takes.5.body":"The goal is not conversion in a single conversation — the goal is to <em>open the door</em> for the next one.","summary.cite":"<strong>References:</strong> Fasce, A. et al. (2023). Nature Human Behaviour, 7, 1462–1480. · Holford, D. et al. (2024). Health Psychology, 43(6), 426–437. · Tool: <a href=\"https://jitsuvax.info\" target=\"_blank\">jitsuvax.info</a>","lang.toggle.sr":"SR","lang.toggle.en":"EN","lang.toggle.aria":"Change language"}

};

// ─── Plural helper (sr ima 3 oblika: 1, 2-4 (few), 5+ (many)) ───
function plural(lang, n) {
  if (lang === "en") return n === 1 ? "Singular" : "Plural";
  // sr
  const mod10 = n % 10, mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return "Singular";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "Few";
  return "Many";
}

// ─── t() lookup ───
function t(key, params) {
  const lang = (typeof S !== "undefined" && S && S.lang) || "sr";
  const dict = (UI[lang] && Object.keys(UI[lang]).length) ? UI[lang] : UI.sr;
  let s = dict[key] != null ? dict[key] : (UI.sr[key] != null ? UI.sr[key] : key);
  if (params) {
    for (const k of Object.keys(params)) {
      s = s.split("{" + k + "}").join(params[k]);
    }
  }
  return s;
}

// ─── Plural-aware lookup (key + "Singular"/"Few"/"Many" suffix) ───
function tn(baseKey, n, params) {
  const lang = (typeof S !== "undefined" && S && S.lang) || "sr";
  const suffix = plural(lang, n);
  const fullKey = baseKey + suffix;
  return t(UI[lang] && UI[lang][fullKey] !== undefined ? fullKey : (UI.sr[fullKey] !== undefined ? fullKey : baseKey),
           Object.assign({ n: n }, params || {}));
}

// ─── Apply translations to all [data-i18n] elements ───
// Attributes:
//   data-i18n="key"          -> innerHTML = t(key)
//   data-i18n-attr="key,attr" -> el.setAttribute(attr, t(key)) — npr. za title/aria-label
function applyI18n(root) {
  root = root || document;
  root.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    el.innerHTML = t(key);
  });
  root.querySelectorAll("[data-i18n-attr]").forEach(el => {
    const spec = el.getAttribute("data-i18n-attr").split(",");
    const key = spec[0], attr = spec[1];
    if (key && attr) el.setAttribute(attr, t(key));
  });
  // <title> i <html lang>
  const titleKey = document.querySelector("[data-i18n-title]");
  if (titleKey) document.title = t(titleKey.getAttribute("data-i18n-title"));
  const lang = (typeof S !== "undefined" && S && S.lang) || "sr";
  document.documentElement.setAttribute("lang", lang === "en" ? "en" : "sr-Latn");
}
