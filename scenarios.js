/* ════════════════════════════════════════════════════
   scenarios.js — sadržaj za Igru 01 (Lekar / HCP)

   Ovaj fajl je jedino mesto gde se edituju scenariji.
   engine.js i styles.css ne treba dirati.

   STRUKTURA HCP_PROFILES:
     id    — interni identifikator (ne menja se)
     name  — prikazano ime uloge
     desc  — kratak opis koji roditelj "vidi" u kontekstu

   STRUKTURA HCP_SCENARIOS — svaki scenario:
     title       — naslov scenarija (prikazan u pick ekranu i u igri)
     root        — attitude root po Fasce et al. (2023) taksonomiji;
                   prikazan samo lekarima u korak-1 feedback-u
     startTrust  — početni skor poverenja (0–100). Default 50 ako izostavljeno.
     startWill   — početna spremnost na vakcinaciju (0–100). Default 30.
     startWhy    — kratak (1 rečenica) opis zašto baš ti početni skorovi —
                   prikazuje se igraču pre prvog koraka.
     maxWhy      — kratak (1 rečenica) opis zašto plafon scenarija nije 100
                   ni pri savršenom razgovoru. Prikazuje se na kraju, uz
                   "Krajnji rezultat X / Y" blok.
     parent      — {i: inicijali za avatar, l: label ispod avatara}
     open        — prva rečenica roditelja koja otvara razgovor
     steps       — niz od 4 koraka (vidi STRUKTURA KORAKA ispod)
     eGood       — završna rečenica roditelja ako je trust ≥ 70
     eMid        — završna rečenica roditelja ako je trust 40–69
     eBad        — završna rečenica roditelja ako je trust < 40
     take        — "pouka" prikazana lekaru na kraju scenarija

   STRUKTURA KORAKA (steps[]):
     t  — tip koraka; jedan od: "root" | "affirm" | "refute" | "facts"
     p  — pitanje/prompt prikazan igraču
     o  — niz opcija (vidi STRUKTURA OPCIJA ispod)

   STRUKTURA OPCIJA (o[]):
     x   — tekst opcije koji igrac bira
     fb  — feedback tekst koji se prikazuje posle izbora (HTML dozvoljen)

     Za korak tipa "root" (identifikacija attitude root-a):
       ok  — 1 ako je ovo tačan odgovor, 0 ako nije
             (utiče na trust +5 tačno / -3 netačno)

     Za ostale korake (affirm / refute / facts):
       q   — kvalitet odgovora: "good" | "neutral" | "bad"
             Uticaj na trust i will definisan je u HCP_IMPACT (engine.js):
               affirm  good  → trust +15
               affirm  bad   → trust -15
               refute  good  → trust +10, will +20
               refute  neutral → will +5
               refute  bad   → trust -10, will -10
               facts   good  → trust +5, will +20
               facts   neutral → will +5
   ════════════════════════════════════════════════════ */

const HCP_PROFILES=[
{id:"pedijatar",name:"Pedijatar",desc:"Roditelje znate godinama. Vidite decu od ranog uzrasta."},
{id:"opsta",name:"Lekar opšte medicine",desc:"Porodični lekar. Znate roditelje i istoriju porodice."},
{id:"ginekolog",name:"Ginekolog",desc:"Vaša ekspertiza je HPV i njegove posledice. Znanje i autoritet su tu."},
{id:"specijalista",name:"Drugi lekar — specijalista",desc:"Infektolog, imunolog ili sličan specijalista — roditelj traži drugo mišljenje."}
];

const HCP_SCENARIOS=[
{title:"Aluminijum i fetalne ćelije",startTrust:45,startWill:25,startWhy:"Majka već čita internet i uplašena je od konkretnih supstanci — došla je da je lekar smiri, ali ulazi sa otporom.",maxWhy:"Marija je nedeljama tonula u internet sumnje; jedan razgovor može da pomeri planinu, ali ne i da je sruši.",root:"Strah i fobije — toksičnost (HPV)",parent:{i:"M",l:"Majka · ćerka 13 god."},open:"Doktore, čitala sam na internetu da HPV vakcina sadrži aluminijum i ostatke fetalnih ćelija. Bojim se da to može da uškodi mom detetu. Ne želim da unosim toksine u njeno mlado telo.",steps:[
{t:"root",p:"Pre odgovora — koji 'attitude root' prepoznajete?",o:[
{x:"Konspirativna ideja — Big Pharma i skrivanje istine o sastavu",ok:0,fb:"Argument ne pominje farmaceutske kompanije niti koordinisanu zaveru — primarna emocija je <strong>strah od konkretnih supstanci</strong>, a ne sumnja u motive sistema."},
{x:"Strah i fobije — toksičnost i štetnost sastojaka vakcine",ok:1,fb:"Tačno. Roditelj imenuje konkretne 'toksične' supstance koje izazivaju unutrašnju nelagodu. Klasičan obrazac iz Fasce et al. (2023) — <strong>fear and phobias / toxicity hazard</strong>."},
{x:"Moralne brige — etička i moralna osuda upotrebe fetalnih ćelija",ok:0,fb:"Moralne brige podrazumevaju duboku etičku osudu i vrednosni konflikt. Ovde je akcenat stavljen na <strong>biološki strah od štete i zagađenja tela</strong>, a ne na moralnu poziciju."},
{x:"Neutemeljena uverenja — prirodni imunitet naspram veštačkog",ok:0,fb:"Majka se u svom pitanju ne fokusira na snagu prirodnog imuniteta niti tvrdi da je preležavanje bolje, već izražava striktan <strong>strah od unosa spoljnih toksina</strong> u organizam deteta."}]},
{t:"affirm",p:"Korak 2 · Kako pokazujete razumevanje?",o:[
{q:"good",x:"Razumem vašu brigu. Mnogi roditelji čitaju iste stvari na internetu i to izaziva nemir — sasvim prirodna reakcija. Hajde da pogledamo zajedno.",fb:"Validirate <strong>emociju</strong> (nemir) bez prihvatanja netačne premise. Pozivate na zajednički proces i smirujete tenziju."},
{q:"bad",x:"Pa dobro, vakcina jeste složen hemijski preparat i sadrži pomoćne supstance, tako da moram reći da vaše brige i sumnje zapravo nisu sasvim bezrazložne.",fb:"Opasna i kontraproduktivna 'afirmacija'. Priznavanjem netačne naučne premise gubite stabilno tlo za kasnije argumentovano opovrgavanje."},
{q:"bad",x:"To su obične gluposti i neproverene teorije sa interneta kojima ne bi trebalo da verujete, pogotovo kada je u pitanju zdravlje i bezbednost vašeg deteta.",fb:"Direktnim odbacivanjem i napadom gubite poverenje. Roditelj se oseća posramljeno i emotivno će potpuno zatvoriti dalji tok razgovora."}]},
{t:"refute",p:"Korak 3 · Prilagođeno opovrgavanje",o:[
{q:"good",x:"Aluminijum u vakcinama je u tragovima — beba u prvih 6 meseci unese više aluminijuma iz mleka nego što ga ima u svim vakcinama zajedno. Što se tiče fetalnih ćelija — vakcina ih ne sadrži.",fb:"Konkretno, kvantifikovano i precizno. Daje <strong>uporednu meru</strong> (mleko) koja je roditelju bliska i lako razumljiva."},
{q:"neutral",x:"Morate znati da sve vakcine u našem kalendaru prolaze izuzetno stroge, višestepene kontrole i da su zvanično dokazane kao potpuno bezbedne i efikasne za upotrebu.",fb:"Ova tvrdnja jeste tačna, ali je previše generička i birokratska. Ne odgovara direktno na specifičan i lociran strah od aluminijuma i ćelija."},
{q:"bad",x:"Vidite, internet je danas preplavljen opasnim dezinformacijama i lažnim vestima. Umesto toga, jedino ispravno je da slušate isključivo nas koji smo školovani stručnjaci.",fb:"Izrazito autoritaran nastup. Roditelj koji već ima inicijalni strah i sumnju postaće samo još defanzivniji i nepoverljiviji prema vama."}]},
{t:"facts",p:"Korak 4 · Faktualne informacije",o:[
{q:"good",x:"Nakon preko 270 miliona doza HPV vakcine u svetu, profil bezbednosti je odličan. Najčešće su lokalne reakcije — bol, blago crvenilo — koje prolaze za 24–48h. Ozbiljne reakcije <1 na milion doza.",fb:"Konkretno i merljivo (veliki broj doza, jasne vrste reakcija, precizna učestalost) — ključno za roditelja koji se panično boji nepoznatog."},
{q:"neutral",x:"Naučne studije i klinička ispitivanja sprovedena širom sveta na velikom uzorku pacijenata nedvosmisleno potvrđuju da se sve vakcine temeljno i dugotrajno testiraju pre puštanja u upotrebu.",fb:"Iako je informacija tačna, ponovo je nedovoljno specifična za ovaj kontekst i ne nudi konkretne brojke koje bi umirile uplašenu majku."}]}
],eGood:"Hvala što ste mi to objasnili na ovaj način. Uznemirila sam se od onoga što sam čitala. Razmisliću.",eMid:"Dobro, čula sam šta ste rekli. Razmisliću još.",eBad:"Hvala doktore. Pričaću sa drugima.",take:"Strah od toksičnosti neutrališe se <strong>konkretnim uporednim merama</strong> — ne uopštenom tvrdnjom 'bezbedno je'."},

{title:"Farmaceutske kompanije zarađuju milijarde",startTrust:35,startWill:20,startWhy:"Otac sumnja u motiv institucija — nije a priori protiv vakcine, ali ne veruje preporukama bez sopstvene provere.",maxWhy:"Stav prema farmaceutskoj industriji nije razgovor, već decenijski pogled na svet — najbolje što jedan razgovor može je da otvori vrata.",root:"Konspirativna ideja — Big Pharma",parent:{i:"O",l:"Otac · sin 12 god."},open:"Doktore, jasno mi je da farmaceutske kompanije zarađuju milijarde od ovih vakcina. Zar nije sumnjivo što baš sada toliko forsiraju HPV vakcinu, čak i za dečake? Sigurno postoji nešto što nam ne govore.",steps:[
{t:"root",p:"Korak 1 · Koji je psihološki koren?",o:[
{x:"Konspirativna ideja — profitni motivi i skriveni interesi Big Pharma",ok:1,fb:"Tačno. Roditelj pretpostavlja <strong>skriveni motiv profita</strong> i ubeđen je da postoji 'nešto što nam ne govore' — školski primer konspirativne ideacije."},
{x:"Distortovana percepcija rizika — minimiziranje opasnosti od virusa",ok:0,fb:"Netačno. Otac u ovom trenutku uopšte ne osporava medicinski rizik same bolesti, već primarno sumnja u <em>motiv</em> onih koji vakcinu preporučuju."},
{x:"Moralne brige — etička osuda kapitalizma i profita u zdravstvu",ok:0,fb:"Blizu, ali fokus oca nije na moralnoj neprihvatljivosti zarade u medicini, već na sumnji u <strong>skrivenu i potencijalno opasnu nameru</strong> iza te kampanje."},
{x:"Nepoverenje u sistem — generalizovano odbacivanje državnih protokola",ok:0,fb:"Iako postoji preklapanje, otac ovde targetira specifično <strong>farmaceutsku industriju (korporativnu zaveru)</strong> kao pokretača, a ne širi institucionalni slom."}]},
{t:"affirm",p:"Korak 2 · Afirmacija",o:[
{q:"good",x:"Razumem vaš skepticizam. Veliki sistemi i kompanije zaista treba da budu pod nadzorom — istorija medicine ima primere gde je profit bio iznad pacijenata. Vaš oprez je razumljiv.",fb:"Priznajete <strong>deo legitimne istorijske istine</strong> bez pristajanja na konspirativni zaključak o trenutnoj situaciji."},
{q:"bad",x:"Morate shvatiti da farmaceutske kompanije danas ne razmišljaju samo o novcu i zaradi — one ulažu ogroman kapital da bi razvile lekove i primarno žele da pomognu čovečanstvu.",fb:"Ovakav odgovor deluje izuzetno naivno, lako je oboriv i predvidiv. Automatski gubite profesionalni kredibilitet kod skeptičnog roditelja."},
{q:"bad",x:"To su klasične teorije zavere koje se planski šire po internetu i društvenim mrežama kako bi se zbunili savesni roditelji i stvorilo nepotrebno nepoverenje.",fb:"Etiketiranje i stavljanje u defanzivu. Roditelj koji sebe doživljava kao racionalnog skeptika, a ne teoretičara zavere, duboko će se uvrediti."}]},
{t:"refute",p:"Korak 3 · Opovrgavanje",o:[
{q:"good",x:"I ja gledam farmaceutsku industriju kritički — upravo zato ne donosim odluke na osnovu reklama, već nezavisnih studija. HPV vakcinu preporučuju SZO, ECDC, CDC i naša komisija — tela nezavisna od proizvođača. Australija počela 2007, danas skoro nestao rak grlića kod mladih.",fb:"Briljantno rešenje. <strong>Alignirate se sa njegovim skepticizmom</strong> i pokazujete da naučni pristup zapravo vodi ka istom opreznom zaključku."},
{q:"neutral",x:"Ovde se uopšte ne radi o profitu pojedinačnih kompanija, već o organizovanoj strategiji javnog zdravlja čiji je jedini cilj iskorenjivanje teških malignih bolesti u populaciji.",fb:"Ovaj odgovor je suviše uopšten i deklarativan. Deluje kao političko saopštenje i ne uspeva da pomeri ili ublaži lociranu sumnju oca."},
{q:"bad",x:"Gledajte, lekari ipak imaju mnogo više informacija i znaju znatno bolje od laika sa interneta koji izvori su relevantni, a koji nisu. Treba verovati struci.",fb:"Klasičan 'argumentum ad verecundiam' (pozivanje na autoritet). Ovakav argument vredi apsolutno nula kod nekoga ko suštinski sumnja u sam sistem."}]},
{t:"facts",p:"Korak 4 · Činjenice",o:[
{q:"good",x:"HPV ne izaziva samo rak grlića — izaziva i rak grla i ždrela, jedan od najbrže rastućih karcinoma kod muškaraca. Zato i za dečake — ne 'širenje tržišta', već konkretna bolest.",fb:"Direktno i precizno odgovara na implicitni argument 'zašto baš sada i za dečake'. Daje jasan <strong>kauzalni i medicinski razlog</strong>."},
{q:"neutral",x:"Statistički podaci iz velikog broja evropskih zemalja jasno i nedvosmisleno pokazuju u kojoj meri je ova imunizacija korisna i opravdana za oba pola.",fb:"Tvrdnja je suva i prazna jer ne sadrži konkretne medicinske brojeve i specifične patologije, pa ostaje na nivou opšteg mesta."}]}
],eGood:"Hmm... nisam znao za to o raku grla. Razmisliću ozbiljno.",eMid:"Razmisliću. Treba mi vremena.",eBad:"Hvala, ali ostajem pri svom.",take:"Konspirativna ideacija se <strong>ne pobeđuje suprotnim autoritetom</strong> — pobeđuje se aliranjem sa skepticizmom."},

{title:"Ne želim joj slati pogrešnu poruku",startTrust:55,startWill:15,startWhy:"Majka veruje lekaru kao stručnjaku, ali njena pozicija je principijelna — vakcina je za nju moralno pitanje, ne medicinsko.",maxWhy:"Visok plafon: ovo nije osoba bez poverenja u lekara, već osoba sa principima — kad oseti poštovanje prema vrednostima, otvara se brzo.",root:"Moralne brige — promiskuitetnost (HPV)",parent:{i:"M",l:"Majka · ćerka 12 god."},open:"Moja ćerka ima samo 12 godina, ne radi se još o seksu. Bojim se da bi davanje vakcine protiv polno prenosive bolesti poslalo poruku da je u redu rano početi sa seksom. To nije poruka koju joj želim slati.",steps:[
{t:"root",p:"Korak 1 · Koren stava?",o:[
{x:"Moralne brige — strah od podsticanja promiskuitetnosti i ranog stupanja u odnose",ok:1,fb:"Tačno. Majka eksplicitno i otvoreno govori o 'porukama', vaspitanju i vrednostima — u pitanju je jasna <strong>moralna pozicija</strong>."},
{x:"Distortovana percepcija rizika — uverenje da dete nije ugroženo u tom uzrastu",ok:0,fb:"Iako pominje godine, ona ne osporava samu opasnost od virusa u budućnosti, već se primarno plaši da će vakcina delovati kao implicitno odobrenje ponašanja."},
{x:"Religijske brige — sukob sa zvaničnim stavovima verske zajednice",ok:0,fb:"Moguće je da religija igra ulogu u pozadini, ali sam argument je formulisan u sekularnom jeziku <em>porodičnih vrednosti</em>, a ne verskog autoriteta i dogme."},
{x:"Strah i fobije — anksioznost zbog asocijacije dece sa seksualnim temama",ok:0,fb:"Netačno. Ovde dominira racionalizovan vrednosni sistem i briga o vaspitnoj poruci, a ne iracionalni ili fobijski strah od same medicinske procedure."}]},
{t:"affirm",p:"Korak 2 · Afirmacija",o:[
{q:"good",x:"Vidim da vam je važno koje vrednosti prenosite ćerki — i koje poruke ona dobija. To što razmišljate o tome je znak odgovornog roditeljstva.",fb:"Validirate i podržavate <strong>identitet roditelja</strong>. Ovo je izuzetno moćno jer je njena pozicija direktno vezana za njen osećaj sebe kao dobre majke."},
{q:"bad",x:"Pa dobro, moramo biti realni, deca tih godina u današnje vreme ionako mnogo ranije kreću sa raznim oblicima eksperimentisanja i ne možete ih potpuno kontrolisati.",fb:"Gruba greška koja direktno vređa i devalvira njene duboke roditeljske vrednosti. Ovim odgovorom je razgovor praktično trajno završen."},
{q:"bad",x:"Vakcina zapravo nema apsolutno nikakve veze sa seksom i seksualnim ponašanjem — ona je isključivo preventiva protiv malignih bolesti i raka.",fb:"Tehnički suviše hladno, netačno u kontekstu prenosa virusa i deluje odbrambeno, kao da uopšte niste pažljivo saslušali šta je njena stvarna briga."}]},
{t:"refute",p:"Korak 3 · Opovrgavanje",o:[
{q:"good",x:"Ovu zabrinutost su istraživači konkretno proučavali. Vakcinisane devojčice ne počinju sa seksom ranije, nemaju više partnera. Devojčice ovaj proces doživljavaju kao zdravstvenu meru — kao i svaku drugu vakcinu, ne kao 'dozvolu'.",fb:"Adresira <em>baš njen specifičan</em> strah. Ne osporava njene moralne vrednosti, već naučno dokazuje da vakcina uopšte nije u sukobu sa njima."},
{q:"neutral",x:"Vakcinacija je isključivo čista medicinska intervencija na imunom sistemu, a ne neka vrsta seksualne edukacije ili ideološkog predavanja u školi.",fb:"Ova distinkcija ima logike, ali je previše hladna i ne odgovara direktno na njenu suštinsku zabrinutost o tome kakvu podsvesnu poruku dete dobija."},
{q:"bad",x:"Šta god vi lično mislili o tome i kako god je vaspitavali, mladi ljudi u tim godinama će na kraju ipak raditi tačno ono što oni žele, bez obzira na vakcinu.",fb:"Ovo predstavlja direktan, agresivan napad na njen autoritet i ulogu kao roditelja, što izaziva momentalni gnev i prekid komunikacije."}]},
{t:"facts",p:"Korak 4 · Činjenice",o:[
{q:"good",x:"HPV vakcina je najefikasnija <em>pre</em> prvog seksualnog kontakta. Zato uzrast 9–14. Više od 80% odraslih dobije neki tip HPV — ovo nije 'da li', već 'kada'. Vakcinacija sada štiti ćerku od raka za 20–30 godina.",fb:"Uspešno pomeranje fokusa sa 'seksa' na 'rak' i 'dugoročnu zaštitu života' — što je potpuno u skladu sa njenom brigom o bezbednoj <em>budućnosti</em> deteta."},
{q:"neutral",x:"Medicinski gledano, ova vrsta imunizacije postiže svoj maksimalni teoretski i praktični učinak onda kada se pacijentu aplikuje striktno na vreme i po predviđenom kalendaru.",fb:"Informacija je tačna, ali joj potpuno nedostaje širi kontekst i emocionalna težina, te ne uspeva da pomeri razgovor ka rešenju problema."}]}
],eGood:"Hvala. Razumem sada zašto se daje u ovim godinama. Razgovaraću sa ćerkom — ne kao o 'seksu' nego kao o zaštiti.",eMid:"Vidim... ima logike. Pričaću sa mužem.",eBad:"Razmisliću.",take:"Moralne brige se ne pobeđuju moralnim demantijem. Pobeđuju se <em>premapiranjem</em> — pokazujući da vakcina ne ugrožava vrednosti, već ih čuva."},

{title:"HPV se prolazi sam — zašto vakcinisati?",startTrust:50,startWill:25,startWhy:"Otac racionalno procenjuje rizik — pristojno poverenje u lekara, ali ne vidi razlog da intervencijom dira zdravo dete.",maxWhy:"Racionalan pristup je tvoj saveznik, ali emocionalna komponenta brige za dete uvek ostavlja prostor za rezervu.",root:"Distortovana percepcija rizika (HPV)",parent:{i:"O",l:"Otac · ćerka 14 god."},open:"Pa dobro, HPV — zar nije to nešto što se prolazi? Većina ljudi se zarazi, ne zna ni da ga ima, i prođe. Zašto bismo mi vakcinisali zdravo dete protiv nečega što verovatno neće biti problem?",steps:[
{t:"root",p:"Korak 1 · Koren stava?",o:[
{x:"Distortovana percepcija rizika — potcenjivanje verovatnoće i težine komplikacija",ok:1,fb:"Tačno. Glavni argument oca je 'rizik je premali da bi opravdao medicinsku intervenciju na zdravom detetu' — čist koren <strong>distorted risk perception</strong>."},
{x:"Neutemeljena uverenja — ideologija da je prirodni imunitet uvek superioran",ok:0,fb:"Netačno. Otac nigde ne tvrdi da je prirodni put imunizacije superiorniji ili čistiji, on samo racionalno (ali pogrešno) procenjuje da opasnost nije velika."},
{x:"Nepoverenje u sistem — sumnja u opravdanost zvaničnih lekarskih preporuka",ok:0,fb:"Otac ne pokazuje agresivno nepoverenje prema vama niti prema sistemu; on postavlja legitimno, pragmatično pitanje o matematičkoj isplativosti rizika."},
{x:"Strah i fobije — anksioznost zbog unošenja spoljnih agensa u organizam deteta",ok:0,fb:"Netačno. U jeziku roditelja nema panike, straha od igle niti fobije od sastojaka, već isključivo hladna (iako nekompletna) kalkulacija verovatnoće bolesti."}]},
{t:"affirm",p:"Korak 2 · Afirmacija",o:[
{q:"good",x:"U pravu ste — i to je važno reći. Većina HPV infekcija zaista prolazi sama od sebe. Mnogi to ne čuju jasno, pa hvala što ste postavili pitanje.",fb:"Genijalan potez. <strong>Priznajete tačan deo njegove informacije</strong> i time gradite snažno poverenje. Otac vidi da niste 'pro-vakcinski robot' koji negira činjenice."},
{q:"bad",x:"Moram vam reći da niste sasvim u pravu — HPV virus je zapravo izuzetno opasan, podmukao i može izazvati katastrofalne posledice po zdravlje vašeg deteta.",fb:"Frontalno i agresivno suprotnim stavom zatvarate vrata. Pošto je njegov argument delimično tačan, delujete kao da namerno preuveličavate opasnost da biste ga uplašili."},
{q:"bad",x:"Veliki broj roditelja danas razmišlja na sličan način kao i vi — ali morate razumeti da svi vi pravite fundamentalnu i opasnu grešku u proceni.",fb:"Snishodljiv ton koji odmah stvara distancu. Smještanjem oca u kategoriju 'onih koji greše' aktivirate njegov ego i prirodni odbrambeni mehanizam."}]},
{t:"refute",p:"Korak 3 · Opovrgavanje",o:[
{q:"good",x:"Tačno — oko 90% HPV infekcija telo savlada samo. Problem je kod 10% gde virus ostaje godinama — upravo te trajne infekcije izazivaju rak. A mi ne možemo unapred znati koje će dete biti u tih 10%. Vakcina je 'osiguranje' za slučaj kad telo ne uspe. Kao pojas u kolima.",fb:"Briljantna argumentacija. Prihvatate njegovu tačnu premisu, ali dodajete ključni, nedostajući deo slagalice (onih 10%) kroz <strong>lako razumljivu analogiju</strong>."},
{q:"neutral",x:"Bez obzira na procente prolaznosti, HPV je zvanično dokazan kao primarni uzročnik karcinoma i upravo zbog toga je ova vakcina kritično važna za zdravlje.",fb:"Ovo jeste tačno, ali je previše suvoparno jer uopšte ne adresira njegovu konkretnu poentu da je individualna šansa za problem zapravo statistički mala."},
{q:"bad",x:"Verujte mi na reč kao lekaru sa dugogodišnjim iskustvom u praksi, ovo je intervencija koja je vašem detetu zaista stopostotno potrebna i nemojte sumnjati.",fb:"Ponovo se oslanjate na puki 'argumentum ad verecundiam' koji ne nudi nikakvo logičko objašnjenje roditelju koji traži racionalne i opipljive dokaze."}]},
{t:"facts",p:"Korak 4 · Činjenice",o:[
{q:"good",x:"U Srbiji oko 1.500 žena godišnje oboli od raka grlića, oko 400 umre — više od jedne dnevno. Plus rak grla, anusa, vulve. Vakcina sprečava oko 90%. Australija je počela 2007 — rak grlića skoro nestao kod mladih.",fb:"Konkretno (Srbija daje lokalni kontekst), a primer Australije je empirijski dokaz da strategija radi. Apstraktnih '10%' pretvarate u potresnu stvarnost: <em>jedna žena dnevno</em>."},
{q:"neutral",x:"Zvanične statistike i dugogodišnji uporedni podaci iz različitih globalnih registara jasno pokazuju izuzetno visoku stopu korisnosti ove imunizacije.",fb:"Bez specifičnih, opipljivih brojeva i jasnih primera iz prakse, ova rečenica zvuči samo kao još jedna prazna i dosadna opšta tvrdnja iz brošure."}]}
],eGood:"Hm. Nisam znao da je toliko. Razgovaraću sa ćerkom — ima 14, već može da razume.",eMid:"Razmisliću još. Pričaću sa ženom.",eBad:"Ja i dalje mislim da je previše brige za malu šansu.",take:"Niska percepcija rizika pobeđuje se <strong>kalibracijom</strong>: priznati istinu i precizirati ko nije u toj većini."},

{title:"Previše vakcina, prirodno je bolje",startTrust:40,startWill:20,startWhy:"Majka ima ideološku poziciju prema medicini — manji a priori trust u 'sistem' lekova; pristup tela kao prirodnog branioca.",maxWhy:"Ideologija prirodnosti je deo identiteta — razgovor može da je relativizuje, ali ne i da preokrene poziciju izgrađenu kroz godine.",root:"Neutemeljena uverenja — prirodno (opšte)",parent:{i:"M",l:"Majka · sin 13 god."},open:"Doktore, ja se trudim da moja deca žive prirodno — što manje lekova. Imam utisak da im dajemo previše vakcina, premnogo, prerano. Telo bi trebalo da nauči samo da se brani.",steps:[
{t:"root",p:"Korak 1 · Koren stava?",o:[
{x:"Neutemeljena uverenja — apsolutna superiornost prirodnog i strah od prekomerne medikalizacije",ok:1,fb:"Tačno. Kombinacija stavova <em>natural is best</em> i <em>overmedicalization</em>. U pitanju je duboko ukorenjena <strong>ideologija prirodnosti</strong> životnog stila."},
{x:"Moralne brige — etički stavovi o čistoti dečijeg organizma",ok:0,fb:"Netačno. Iako zvuči kao vrednosni stav, reč je o zabludi o biološkom funkcionisanju imunog sistema (prirodno naspram veštačkog), a ne o etičkom sudu."},
{x:"Distortovana percepcija rizika — potcenjivanje opasnosti od infektivnih bolesti",ok:0,fb:"Majka ovde ne govori o tome da su same bolesti bezopasne, već ima specifičan, bazični ideološki pogled na to <em>kako</em> bi organizam trebalo da se bori sa njima."},
{x:"Nepoverenje u sistem — odbijanje zvaničnog kalendara imunizacije",ok:0,fb:"Ovo je prateći element, ali primarni psihološki koren nije gnev prema državi ili institucijama, već afirmativno, unutrašnje uverenje u nepogrešivost prirode."}]},
{t:"affirm",p:"Korak 2 · Afirmacija",o:[
{q:"good",x:"Cenim što ozbiljno pristupate odluci — vaše dete je vaše dete. Nije lako razabrati se u moru informacija danas.",fb:"<strong>Validirate njenu roditeljsku autonomiju i trud</strong> — upravo ono što joj je važno u njenom identitetu, stvarajući bezbednu zonu za razgovor."},
{q:"bad",x:"Morate da razumete da vakcine nisu isto što i klasični farmaceutski lekovi i da je mešanje tih pojmova zapravo jedan veliki i opasan nesporazum u javnosti.",fb:"Ovim direktno poričete njenu duboku zabrinutost. Reč 'nesporazum' u komunikaciji roditelju šalje jasnu i uvredljivu poruku: 'vi zapravo mislite pogrešno'."},
{q:"bad",x:"To što je nešto prirodno uopšte ne znači da je automatski sigurno i bezbedno za zdravlje — uostalom, i same teške bolesti i virusi su potpuno prirodni.",fb:"Iako je ova tvrdnja logički i naučno besprekorno ispravna, ona je u ovoj fazi razgovora izrazito konfrontativna i majka će je doživeti kao agresivan napad."}]},
{t:"refute",p:"Korak 3 · Opovrgavanje",o:[
{q:"good",x:"Vakcina ne 'zamenjuje' imuni sistem — ona ga <em>trenira</em>. Pokazuje mu kako virus izgleda <em>pre</em> nego što se susretne sa pravim. A što se tiče 'previše' — vaš sin se svaki dan susreće sa hiljadama mikroorganizama. Kalendar vakcina je manje 'opterećenje' nego jedan dan napolju.",fb:"Izvrsno premapiranje koncepta: vakcina = <strong>trening i podrška, a ne veštački supstitut</strong>. Uspešno se spaja sa njenom intuicijom o urođenoj snazi tela."},
{q:"neutral",x:"Bez obzira na prirodan način života koji vodite, savremene vakcine su apsolutno neophodna i bazična mera za očuvanje optimalnog dugoročnog zdravlja vašeg deteta.",fb:"Ovaj odgovor je previše generički i suv. Uopšte ne adresira njenu ključnu dilemu i strah od toga zašto je baš vakcina bolji izbor od čistog prirodnog imuniteta."},
{q:"bad",x:"Ako potpuno odbacite vakcine i prepustite sve prirodi, deca rizikuju da obole i umru od bolesti poput malih boginja koje smo davno mogli da iskorenimo.",fb:"Ovo je agresivna taktika zastrašivanja. Kod majke sa ovakvim profilom to momentalno aktivira snažan psihološki otpor i trajno prekida saradnju."}]},
{t:"facts",p:"Korak 4 · Činjenice",o:[
{q:"good",x:"Vaše dete u jednom dahu udahne više antigena nego što ih ima u svim vakcinama zajedno. Imuni sistem obrađuje milione signala dnevno. A za HPV — vakcina ne unosi živi virus, već prazne 'ljušture' (VLPs) koje imuni sistem zapamti.",fb:"Precizan biološki mehanizam koji <strong>duboko poštuje njenu inteligenciju</strong> i preveodi priču na jezik biologije koji ona ceni."},
{q:"neutral",x:"Naučni podaci i brojne studije iz oblasti imunologije jasno i nedvosmisleno potvrđuju da su savremene vakcine najefikasnija i najbezbednija mera javnog zdravlja.",fb:"Suviše apstraktna i akademska tvrdnja. Ne pomaže majci da promeni svoj lični, emotivni i iskustveni okvir u vezi sa zdravljem svog sina."}]}
],eGood:"Zanimljivo... nisam tako razmišljala. Razmisliću.",eMid:"Razgovaraćemo opet. Treba mi vreme.",eBad:"Mi ćemo i dalje birati prirodne metode.",take:"'Prirodno je bolje' pobeđuje se <strong>premapiranjem</strong>: vakcina nije <em>protiv</em> imuniteta, već <em>partner</em>."},

{title:"Čula sam za devojčice koje su imale teške reakcije",startTrust:45,startWill:10,startWhy:"Majka je preplašena anegdotama o teškim ishodima — opšte poverenje u lekara je pristojno, ali volja za baš ovu vakcinu je vrlo niska.",maxWhy:"Strah od konkretnih anegdota se umiruje, ne briše — sledeća prijateljičina priča će ga ponovo aktivrichten.",root:"Strah i fobije — strašne povrede (HPV)",parent:{i:"M",l:"Majka · ćerka 12 god."},open:"Čitala sam priče o devojčicama koje su nakon HPV vakcine imale ozbiljne neurološke probleme, autoimune bolesti, čak i neplodnost. Ne mogu da rizikujem da se to desi mojoj ćerki.",steps:[
{t:"root",p:"Korak 1 · Koren stava?",o:[
{x:"Strah i fobije — užasne i katastrofalne povrede izazvane medicinskom procedurom",ok:1,fb:"Tačno. Majka u svom izlaganju eksplicitno imenuje konkretne <strong>katastrofalne, onesposobljavajuće ishode</strong> — u pitanju je klasičan <em>dreadful injuries</em> obrazac."},
{x:"Konspirativna ideja — zataškavanje nuspojava od strane medicinskih institucija",ok:0,fb:"Netačno. Majka ne pominje nikakav skriveni motiv sistema niti koordinisanu zaveru da se istina sakrije. Primarna i dominantna emocija ovde je čist <strong>strah</strong>."},
{x:"Nepoverenje u sistem — odbijanje zvaničnih uveravanja o bezbednosti lekova",ok:0,fb:"Iako postoji sumnja, njen argument je strukturiran oko rečenice 'desiće se nešto strašno mom detetu', što ukazuje na fobijski strah od ishoda, a ne na političko nepoverenje."},
{x:"Distortovana percepcija rizika — nerazumevanje stvarne statistike neželjenih efekata",ok:0,fb:"Blizu, ali kod ovako dramatičnih opisa (neurološke bolesti, neplodnost) koren nije u lošoj matematičkoj proceni, već u dubokoj emocionalnoj preplavljenosti strašnim anegdotama."}]},
{t:"affirm",p:"Korak 2 · Afirmacija",o:[
{q:"good",x:"Razumem — kad čujete priče o drugoj deci, prvi instinkt je zaštititi svoje. To je prirodna reakcija svakog roditelja.",fb:"Validirate i duboko poštujete <strong>primarni roditeljski instinkt</strong> kao potpuno legitiman, čime skidate ton optuživanja sa razgovora."},
{q:"bad",x:"Moram vam otvoreno reći da su sve te zastrašujuće priče koje čitate po internetu najobičnije laži i izmišljotine koje nemaju nikakvo uporište u stvarnosti.",fb:"U ovoj fazi razgovora nemate dovoljan kredibilitet da to tvrdite tako frontalno i oštro. Majka će steći utisak da bezosećajno minimizirate njen realan strah."},
{q:"bad",x:"Nažalost, svedok sam da u današnje vreme mnoge panične i nedovoljno informisane majke olako nasedaju na neproverene tekstove i šire bespotrebnu dramu.",fb:"Ovim odgovorom otvoreno sramotite roditelja i direktno vređate njen identitet. Nakon ovakve rečenice, komunikacijski kanal je trajno zatvoren."}]},
{t:"refute",p:"Korak 3 · Opovrgavanje",o:[
{q:"good",x:"Tačno je da na internetu kruže anegdote — i razumem da su uznemirujuće. Ali kad se sistematski ispituju (preko 10 velikih studija na milionima devojčica), nije pronađena veza sa autoimunim bolestima ili neplodnošću. Anegdote ne dokazuju uzrok — tinejdžerke svake godine dobijaju autoimune bolesti i bez vakcine.",fb:"Izbalansiran pristup: priznaje da uznemirujuće anegdote realno postoje (validacija), a zatim uvodi velike naučne brojeve i logički objašnjava <em>zašto</em> nas pojedinačni slučajevi često varaju."},
{q:"neutral",x:"Budite potpuno bezbrižni, ova vakcina je prošla sve zamislive bezbednosne provere i apsolutno nema nikakvog razloga da se opterećujete tim pričama.",fb:"Ovo je suviše generičko uveravanje. Ono uopšte ne adresira konkretne i locirane strahove majke (neurološki problemi i neplodnost) i deluje površno."},
{q:"bad",x:"Te strašne priče su namerno i zlonamerno izmislile različite antivakserske grupe sa jasnim ciljem da zaplaše javnost i sabotiraju zdravstveni sistem.",fb:"Ovim odgovorom vi premapirate njen lični, opravdani strah za dete i etiketirate je kao člana 'antivakserskog pokreta', što će izazvati ogroman i opravdan bes."}]},
{t:"facts",p:"Korak 4 · Činjenice",o:[
{q:"good",x:"Naprotiv — vakcina <em>štiti</em> plodnost. Lečenje preinvazivnih lezija (konizacija) povećava rizik od prevremenog porođaja. Vakcina sprečava lezije — sprečava i tu intervenciju.",fb:"Briljantan i visoko efektan potez. <strong>Potpuno preokreće njen primarni strah</strong>: naučno dokazujete da vakcina zapravo ne ugrožava plodnost, već agresivno sprečava ono što je realno ugrožava."},
{q:"neutral",x:"Ova vakcina se već godinama sa izuzetnim uspehom primenjuje na desetinama miliona devojčica širom sveta i njena bezbednost je detaljno dokumentovana.",fb:"Iako zvuči impresivno, ova tvrdnja ne pravi ključni logički preokret i ne adresira specifičan strah od hirurških intervencija i očuvanja reproduktivnog zdravlja."}]}
],eGood:"Nisam to znala — da konizacija može da utiče na trudnoću. To je nešto što ću proveriti.",eMid:"Razmisliću, ali još uvek imam strepnju.",eBad:"Ne mogu da rizikujem.",take:"Strah od katastrofe pobeđuje se <strong>preokretom narativa</strong>: vakcina brani baš ono što roditelj brani."},

{title:"Uradio sam svoje istraživanje",startTrust:35,startWill:25,startWhy:"Otac vrednuje sopstvene izvore jednako kao stručnu literaturu — nizak a priori trust prema lekarskoj ekspertizi specifično.",maxWhy:"Autonomija je suština njegovog stava — može da prihvati kvalitet razgovora, ali 'potpuno poverenje iz prve' nije njegov mod.",root:"Nepoverenje — do your own research",parent:{i:"O",l:"Otac · ćerka 11 god."},open:"Doktore, sa svim dužnim poštovanjem — ja sam uradio svoje istraživanje. Čitao sam različite izvore, ne samo zvanične. Vi lekari ste obučeni u jednom okviru, a postoje i drugi pogledi. Ja moram sam da donesem odluku za svoje dete.",steps:[
{t:"root",p:"Korak 1 · Koren stava?",o:[
{x:"Nepoverenje — imperativ samostalnog istraživanja i sumnja u ekspertizu",ok:1,fb:"Tačno. Roditelj doživljava sopstveno, laičko pretraživanje interneta kao proces koji je <strong>jednakovredan</strong> zvaničnoj stručnoj literaturi — 'do your own research' koren."},
{x:"Konspirativna ideja — uverenje da lekari namerno sakrivaju alternativne medicinske pristupe",ok:0,fb:"Netačno. Otac u ovom trenutku ne tvrdi da vi ili sistem svesno kujete zaveru ili lažete, već prosto insistira na postojanju ravnopravnih alternativnih perspektiva."},
{x:"Moralne brige — odbrana svetog prava roditelja na donošenje odluka",ok:0,fb:"Iako pominje donošenje odluke, argument nije postavljen na terenu moralnih vrednosti ili etike, već na terenu <em>autonomije znanja i epistemologije</em> (šta je istina i ko je poseduje)."},
{x:"Pogled na svet — libertarijansko odbijanje bilo kakvih institucionalnih preporuka",ok:0,fb:"Blizu, ali akcenat ovog oca je primarno na samom procesu prikupljanja i evaluacije <em>informacija</em> i izvora, a ne na čistom političkom pravu na slobodu izbora."}]},
{t:"affirm",p:"Korak 2 · Afirmacija",o:[
{q:"good",x:"Cenim što ozbiljno pristupate odluci — vaše dete je vaše dete. Nije lako razabrati se u moru informacija danas.",fb:"Uspešno validirate njegovu potrebu za <strong>autonomijom i odgovornošću</strong> — što je tačno ono što mu je u ovom razgovoru najvažnije."},
{q:"bad",x:"Morate shvatiti da internet nikako ne može biti relevantan izvor naučnog znanja — medicinski fakultet i specijalizacija su jedino pravo merilo ekspertize.",fb:"Ovakav nastup direktno i grubo vređa njegovu intelektualnu autonomiju i trud. Roditelj će se osetiti poniženo i automatski će prekinuti suštinski dijalog."},
{q:"bad",x:"Pa dobro, ako vi smatrate da znate bolje, onda slobodno donesite kakvu god hoćete odluku za sudbinu svog deteta, ja nemam vremena za ubeđivanje.",fb:"Izrazito loša pasivna agresija. Ovim rečenicom potpuno odustajete od pacijenta, urušavate sopstveni profesionalizam i trajno gubite poverenje oca."}]},
{t:"refute",p:"Korak 3 · Opovrgavanje",o:[
{q:"good",x:"Slažem se da je vaša odluka. Pitanje je <em>koji</em> izvori. Razlika nije u tome ko je 'pravi' — već u tome ko <strong>transparentno objavljuje izvore i metode</strong>, ko prolazi peer review. Mogu da vam pokažem konkretne studije. Hoćete li da pregledamo zajedno?",fb:"<strong>Izvrsno premapirate pitanje</strong> sa osetljivog terena 'ko je u pravu i ko ima veći autoritet' na neutralan teren egzaktnih naučnih kriterijuma proverljivosti podataka."},
{q:"neutral",x:"Ipak, morate uzeti u obzir da lekari iza sebe imaju bukvalno decenije rigorozne akademske obuke i prakse u oblasti humane medicine da bi donosili ove odluke.",fb:"Klasičan i suvoparan 'argumentum ad verecundiam'. Kod roditelja koji već sumnja u ekskluzivnost tog zvaničnog okvira, ova tvrdnja ima nulti efekat."},
{q:"bad",x:"Velika većina tog vašeg 'alternativnog' istraživanja na internetu je zapravo preplavljena opasnim pseudonaučnim lažima i neproverenim teorijama.",fb:"Oštra i preširoka generalizacija koja direktno vređa njegovu sposobnost kritičkog mišljenja i diskriminacije izvora, što izaziva trenutan otpor."}]},
{t:"facts",p:"Korak 4 · Činjenice",o:[
{q:"good",x:"Cochrane je nezavisna organizacija koja kritički preispituje medicinske intervencije — često ide <em>protiv</em> zvaničnih preporuka. 2018 izveštaj: 73 studije, 73.000+ ispitanika. HPV vakcina sprečava preinvazivne lezije. Otvoren pristup. Možete sami pogledati.",fb:"<strong>Dajete mu konkretan i moćan alat u ruke</strong> (Cochrane), čime uvažavate njegovu potrebu za kritičkim preispitivanjem i odgovarate njegovom profilu skeptika."},
{q:"neutral",x:"Brojne nezavisne i strogo kontrolisane naučne studije širom sveta su do sada više puta nedvosmisleno dokazale da ova vakcina izuzetno uspešno obavlja svoju funkciju.",fb:"Bez navođenja konkretnog, imenovanog izvora, metodologije ili opipljivih brojki, ova izjava za njega zvuči podjednako neproverljivo kao i sajtovi koje je sam čitao."}]}
],eGood:"Hvala. Ovo je prvi put da neko nije pokušao da me ubedi — već da mi pokaže izvore.",eMid:"Razmisliću.",eBad:"Nastaviću sa svojim istraživanjem.",take:"'Uradi svoje istraživanje' nije ignoranca — to je <strong>autonomija</strong>. Nikada ne osporavajte; <em>obučite je</em>."},

{title:"Moje dete, moja odluka",startTrust:30,startWill:15,startWhy:"Posle COVID-a izgubila je poverenje u zdravstveni sistem — najniži start na obe ose; libertarijanski koren se dodatno pogoršava pritiskom.",maxWhy:"Post-COVID erozija poverenja u sistem se ne rešava jednim razgovorom — najviše što možeš je da budeš čovek na koga može da se vrati.",root:"Pogled na svet — libertarijanizam",parent:{i:"M",l:"Majka · ćerka 14 god."},open:"Doktore, ovo nije pitanje vakcine — ovo je pitanje slobode. Posle COVID-a izgubila sam poverenje u to kako država i medicinski sistem rade. Moje dete, moja odluka. Ne želim da iko spolja diktira.",steps:[
{t:"root",p:"Korak 1 · Koren stava?",o:[
{x:"Pogled na svet — libertarijanski stavovi i neprikosnovena sloboda individualnog izbora",ok:1,fb:"Tačno. Majka eksplicitno i bez okolišanja govori o <strong>slobodi izbora</strong>, autonomiji i agresivnom odbijanju bilo kakve vrste spoljne institucionalne kontrole."},
{x:"Konspirativna ideja — uverenje da država koristi vakcine za uspostavljanje totalne kontrole",ok:0,fb:"Netačno. Iako pominje nepoverenje u sistem nakon pandemije, ona ne elaborira konkretnu skrivenu teoriju zavere, već se fokusira na samo pravo na otpor diktatu."},
{x:"Nepoverenje u sistem — sumnja u naučnu ispravnost i bezbednost same HPV vakcine",ok:0,fb:"Suptilna razlika: ovde primarni koren nije sumnja u medicinske specifikacije virusa (distrust), već bazični stav da država nema pravo da se meša u privatnu sferu (libertarianism)."},
{x:"Moralne brige — vrednosni konflikt sa ideologijom savremenog javnog zdravlja",ok:0,fb:"Netačno. Njen argument nije strukturiran oko moralnog dobra, etike ili vaspitanja ćerke, već oko političkog i pravnog koncepta individualne slobode i suvereniteta."}]},
{t:"affirm",p:"Korak 2 · Afirmacija",o:[
{q:"good",x:"Potpuno se slažem — vi ste roditelj, vi donosite odluku. Moja uloga nije da diktiram, već da podelim šta znam. I čujem vas — pandemija je za mnoge bila težak period.",fb:"<strong>Eksplicitno i bezuslovno potvrđujete</strong> njenu potpunu autonomiju i istovremeno ljudski validirate njeno loše i traumatično COVID iskustvo sa sistemom."},
{q:"bad",x:"Morate razumeti da država po zakonu ima ne samo pravo, već i jasnu ustavnu obavezu da štiti zdravlje i živote maloletne dece, čak i kada se roditelji bune.",fb:"Ovo je ozbiljna eskalacija sukoba. Ovakvim odgovorom svesno pretvarate medicinski razgovor u političku i pravnu debatu, što kod libertarijanca izaziva ogroman bes."},
{q:"bad",x:"Pitanje imunizacije dece i borbe protiv teških malignih bolesti nikako ne može i ne sme da se posmatra kroz prizmu dnevne politike i ličnih stavova.",fb:"Ovom rečenicom direktno poričete i devalvirate njenu proživljenu stvarnost i osećanja, čineći da se roditelj oseti neshvaćeno, napadnuto i odbačeno."}]},
{t:"refute",p:"Korak 3 · Opovrgavanje",o:[
{q:"good",x:"Upravo zato što je vaša odluka, želim da imate <em>vašu</em> informaciju — ne moju, ne državnu. HPV vakcina kod nas <strong>nije obavezna</strong>. Šta god odlučite, tretiram vas kao odgovornu osobu sposobnu da donese odluku za svoje dete.",fb:"<strong>Maksimalno empatski i strateški pozicionirano</strong>. Dodatno pojačavate njenu autonomiju i postavljate sebe isključivo kao dobronameran <em>resurs</em>, a ne agenta sistema."},
{q:"neutral",x:"Želim da naglasim da ovo zapravo uopšte nije politička tema, već je u pitanju čisto javno zdravlje i zaštita mlade populacije od teških onkoloških oboljenja.",fb:"Pokušavate da pomerite okvir razgovora na teren medicine, ali pošto ona celu situaciju duboko oseća kao politički pritisak, ova tvrdnja promašuje metu."},
{q:"bad",x:"Pa dobro, nemojte onda uopšte da vakcinišete dete ako tako želite — ali morate biti svesni da ćete sami snositi sve katastrofalne posledice te odluke.",fb:"Ovo zvuči kao direktna, agresivna ucena i pretnja sa pozicije moći. Ovakav ton garantovano i momentalno završava bilo kakav dalji razgovor sa majkom."}]},
{t:"facts",p:"Korak 4 · Činjenice",o:[
{q:"good",x:"U zemljama gde se vakcina daje preko 70% devojčica (UK, Australija, Skandinavija), rak grlića nestaje kod mladih generacija. Podaci iz nacionalnih registara. Vaša ćerka može biti deo te generacije. Ali odluku donosite vi.",fb:"Izloženost <strong>tvrdim i neoborivim podacima</strong> iz uspešnih sistema, uz ponovno, pametno zatvaranje razgovora kroz stopostotno potvrđivanje njene slobode izbora."},
{q:"neutral",x:"Sve relevantne svetske studije i višedecenijska praksa jasno pokazuju da masovne vakcine provereno spasavaju milione ljudskih života svake godine.",fb:"Ovo zvuči kao generički i dosadan politički slogan. Ovakve opšte fraze kod visoko nepoverljivih i politički motivisanih roditelja samo pojačavaju sumnju."}]}
],eGood:"Hvala. Cenim što me niste pritiskali. Razmisliću sa mužem.",eMid:"Ovo je drugačiji razgovor.",eBad:"Ja i dalje neću da je vakcinišem.",take:"Libertarijanski koren <strong>uvek se pogoršava pritiskom</strong>. Što više potvrđujete autonomiju, više prostora ostavljate."}
];