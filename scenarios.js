/* ════════════════════════════════════════════════════
   scenarios.js — sadržaj za Igru 01 (Lekar / HCP)

   Ovaj fajl je jedino mesto gde se edituju scenariji.
   engine.js i styles.css ne treba dirati.

   STRUKTURA HCP_PROFILES:
     id    — interni identifikator (ne menja se)
     name  — prikazano ime uloge
     desc  — kratak opis koji roditelj "vidi" u kontekstu

   STRUKTURA HCP_SCENARIOS — svaki scenario:
     title  — naslov scenarija (prikazan u pick ekranu i u igri)
     root   — attitude root po Fasce et al. (2023) taksonomiji;
              prikazan samo lekarima u korak-1 feedback-u
     parent — {i: inicijali za avatar, l: label ispod avatara}
     open   — prva rečenica roditelja koja otvara razgovor
     steps  — niz od 4 koraka (vidi STRUKTURA KORAKA ispod)
     eGood  — završna rečenica roditelja ako je trust ≥ 70
     eMid   — završna rečenica roditelja ako je trust 40–69
     eBad   — završna rečenica roditelja ako je trust < 40
     take   — "pouka" prikazana lekaru na kraju scenarija

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
{title:"Aluminijum i fetalne ćelije",root:"Strah i fobije — toksičnost (HPV)",parent:{i:"M",l:"Majka · ćerka 13 god."},open:"Doktore, čitala sam na internetu da HPV vakcina sadrži aluminijum i ostatke fetalnih ćelija. Bojim se da to može da uškodi mom detetu. Ne želim da unosim toksine u njeno mlado telo.",steps:[
{t:"root",p:"Pre odgovora — koji 'attitude root' prepoznajete?",o:[
{x:"Konspirativna ideja — Big Pharma krije istinu",ok:0,fb:"Argument ne pominje farmaceutske kompanije ili zaveru — emocija je <strong>strah od konkretnih supstanci</strong>, ne sumnja u motiv."},
{x:"Strah i fobije — toksičnost sastojaka",ok:1,fb:"Tačno. Roditelj imenuje konkretne 'toksične' supstance. Klasičan obrazac iz Fasce et al. (2023) — <strong>fear and phobias / toxicity hazard</strong>."},
{x:"Moralne brige — etička osuda fetalnih ćelija",ok:0,fb:"Moralne brige podrazumevaju etičku osudu. Ovde je akcenat na <strong>strahu od štete</strong>, ne na moralnoj poziciji."}]},
{t:"affirm",p:"Korak 2 · Kako pokazujete razumevanje?",o:[
{q:"good",x:"Razumem vašu brigu. Mnogi roditelji čitaju iste stvari na internetu i to izaziva nemir — sasvim prirodna reakcija. Hajde da pogledamo zajedno.",fb:"Validirate <strong>emociju</strong> (nemir) bez prihvatanja netačne premise. Pozivate na zajednički proces."},
{q:"bad",x:"Pa, vakcina jeste hemijski preparat — vaše brige nisu sasvim bezrazložne.",fb:"Opasna 'afirmacija'. Priznavanjem netačne premise gubite tlo za kasnije opovrgavanje."},
{q:"bad",x:"To su gluposti sa interneta. Ne verujte u takve priče.",fb:"Odbacivanjem gubite poverenje. Roditelj će zatvoriti razgovor."}]},
{t:"refute",p:"Korak 3 · Prilagođeno opovrgavanje",o:[
{q:"good",x:"Aluminijum u vakcinama je u tragovima — beba u prvih 6 meseci unese više aluminijuma iz mleka nego što ga ima u svim vakcinama zajedno. Što se tiče fetalnih ćelija — vakcina ih ne sadrži.",fb:"Konkretno, kvantifikovano. Daje <strong>uporednu meru</strong> (mleko) koja je razumljiva."},
{q:"neutral",x:"Vakcine prolaze ozbiljne kontrole i dokazano su bezbedne.",fb:"Tačno, ali generičko. Ne odgovara na konkretan strah."},
{q:"bad",x:"Vidite, internet je pun dezinformacija. Trebalo bi da slušate stručnjake.",fb:"Autoritarno. Roditelj koji nema poverenja postaje samo defanzivniji."}]},
{t:"facts",p:"Korak 4 · Faktualne informacije",o:[
{q:"good",x:"Nakon preko 270 miliona doza HPV vakcine u svetu, profil bezbednosti je odličan. Najčešće su lokalne reakcije — bol, blago crvenilo — koje prolaze za 24–48h. Ozbiljne reakcije <1 na milion doza.",fb:"Konkretno (broj doza, vrste reakcija, učestalost) — važno za roditelja koji se boji nepoznatog."},
{q:"neutral",x:"Sve vakcine se temeljno testiraju pre upotrebe.",fb:"Tačno, ali nedovoljno specifično."}]}
],eGood:"Hvala što ste mi to objasnili na ovaj način. Uznemirila sam se od onoga što sam čitala. Razmisliću.",eMid:"Dobro, čula sam šta ste rekli. Razmisliću još.",eBad:"Hvala doktore. Pričaću sa drugima.",take:"Strah od toksičnosti neutrališe se <strong>konkretnim uporednim merama</strong> — ne uopštenom tvrdnjom 'bezbedno je'."},

{title:"Farmaceutske kompanije zarađuju milijarde",root:"Konspirativna ideja — Big Pharma",parent:{i:"O",l:"Otac · sin 12 god."},open:"Doktore, jasno mi je da farmaceutske kompanije zarađuju milijarde od ovih vakcina. Zar nije sumnjivo što baš sada toliko forsiraju HPV vakcinu, čak i za dečake? Sigurno postoji nešto što nam ne govore.",steps:[
{t:"root",p:"Korak 1 · Koji je psihološki koren?",o:[
{x:"Konspirativna ideja — Big Pharma",ok:1,fb:"Tačno. Pretpostavlja <strong>skriveni motiv profita</strong> i da postoji 'nešto što nam ne govore' — klasičan obrazac konspirativne ideacije."},
{x:"Distortovana percepcija rizika",ok:0,fb:"Ne osporava rizik — sumnja u <em>motiv</em> onih koji preporučuju vakcinu."},
{x:"Moralne brige — profit u zdravstvu",ok:0,fb:"Akcenat je na <strong>skrivenoj nameri</strong>, ne na moralnoj poziciji."}]},
{t:"affirm",p:"Korak 2 · Afirmacija",o:[
{q:"good",x:"Razumem vaš skepticizam. Veliki sistemi i kompanije zaista treba da budu pod nadzorom — istorija medicine ima primere gde je profit bio iznad pacijenata. Vaš oprez je razumljiv.",fb:"Priznajete <strong>deo istine</strong> bez pristajanja na zaključak."},
{q:"bad",x:"Farmaceutske kompanije ne razmišljaju samo o novcu — one žele da pomognu.",fb:"Naivno i lako oborivo. Gubite kredibilitet."},
{q:"bad",x:"To su teorije zavere koje šire dezinformacije.",fb:"Etiketiranje. Roditelj koji nije teoretičar zavere će se uvrediti."}]},
{t:"refute",p:"Korak 3 · Opovrgavanje",o:[
{q:"good",x:"I ja gledam farmaceutsku industriju kritički — upravo zato ne donosim odluke na osnovu reklama, već nezavisnih studija. HPV vakcinu preporučuju SZO, ECDC, CDC i naša komisija — tela nezavisna od proizvođača. Australija počela 2007, danas skoro nestao rak grlića kod mladih.",fb:"Briljantno. <strong>Aligniraite se sa skepticizmom</strong> i pokazujete da vodi ka istom zaključku."},
{q:"neutral",x:"Ovo nije profit, ovo je javno zdravlje.",fb:"Suviše uopšteno. Ne pomera sumnju."},
{q:"bad",x:"Lekari znaju bolje od interneta.",fb:"Argumentum ad verecundiam — vredi 0 sa nekim ko sumnja u taj autoritet."}]},
{t:"facts",p:"Korak 4 · Činjenice",o:[
{q:"good",x:"HPV ne izaziva samo rak grlića — izaziva i rak grla i ždrela, jedan od najbrže rastućih karcinoma kod muškaraca. Zato i za dečake — ne 'širenje tržišta', već konkretna bolest.",fb:"Direktno odgovara na implicitni argument 'zašto za dečake'. Daje <strong>kauzalni razlog</strong>."},
{q:"neutral",x:"Statistike pokazuju koliko je korisno.",fb:"Bez konkretnih brojeva, samo tvrdjenje."}]}
],eGood:"Hmm... nisam znao za to o raku grla. Razmisliću ozbiljno.",eMid:"Razmisliću. Treba mi vremena.",eBad:"Hvala, ali ostajem pri svom.",take:"Konspirativna ideacija se <strong>ne pobeđuje suprotnim autoritetom</strong> — pobeđuje se aliranjem sa skepticizmom."},

{title:"Ne želim joj slati pogrešnu poruku",root:"Moralne brige — promiskuitetnost (HPV)",parent:{i:"M",l:"Majka · ćerka 12 god."},open:"Moja ćerka ima samo 12 godina, ne radi se još o seksu. Bojim se da bi davanje vakcine protiv polno prenosive bolesti poslalo poruku da je u redu rano početi sa seksom. To nije poruka koju joj želim slati.",steps:[
{t:"root",p:"Korak 1 · Koren stava?",o:[
{x:"Moralne brige — promiskuitetnost",ok:1,fb:"Majka eksplicitno govori o 'porukama' i vrednostima — <strong>moralna pozicija</strong>."},
{x:"Distortovana percepcija rizika",ok:0,fb:"Ne osporava rizik — ne želi da implicitno odobri ponašanje."},
{x:"Religijske brige",ok:0,fb:"Moguće u pozadini, ali argument je u jeziku <em>vrednosti</em>, ne verskog autoriteta."}]},
{t:"affirm",p:"Korak 2 · Afirmacija",o:[
{q:"good",x:"Vidim da vam je važno koje vrednosti prenosite ćerki — i koje poruke ona dobija. To što razmišljate o tome je znak odgovornog roditeljstva.",fb:"Validirate <strong>identitet roditelja</strong> — najmoćnije, jer je njena pozicija deo osećaja sebe kao roditelja."},
{q:"bad",x:"Pa, deca tih godina ionako kreću sa eksperimentisanjem.",fb:"Direktno vređa njene vrednosti. Razgovor je gotov."},
{q:"bad",x:"Vakcina nema veze sa seksom — ona je za rak.",fb:"Tehnički netačno i deluje kao da ne slušate."}]},
{t:"refute",p:"Korak 3 · Opovrgavanje",o:[
{q:"good",x:"Ovu zabrinutost su istraživači konkretno proučavali. Vakcinisane devojčice ne počinju sa seksom ranije, nemaju više partnera. Devojčice ovaj proces doživljavaju kao zdravstvenu meru — kao i svaku drugu vakcinu, ne kao 'dozvolu'.",fb:"Adresira <em>baš njen</em> strah. Ne osporava vrednosti — pokazuje da vakcina nije u sukobu sa njima."},
{q:"neutral",x:"Vakcina je medicinska intervencija, ne edukacija o seksu.",fb:"Ima logike, ali ne odgovara na zabrinutost o <em>poruci</em>."},
{q:"bad",x:"Šta god vi mislili, mladi će raditi šta žele.",fb:"Direktan napad na njen autoritet kao roditelja."}]},
{t:"facts",p:"Korak 4 · Činjenice",o:[
{q:"good",x:"HPV vakcina je najefikasnija <em>pre</em> prvog seksualnog kontakta. Zato uzrast 9–14. Više od 80% odraslih dobije neki tip HPV — ovo nije 'da li', već 'kada'. Vakcinacija sada štiti ćerku od raka za 20–30 godina.",fb:"Pomeranje fokusa sa 'seksa' na 'rak' i 'dugoročna zaštita' — u skladu sa brigom o <em>budućnosti</em> deteta."},
{q:"neutral",x:"Vakcina je efikasna kada se da na vreme.",fb:"Bez konteksta — ne pomera razgovor."}]}
],eGood:"Hvala. Razumem sada zašto se daje u ovim godinama. Razgovaraću sa ćerkom — ne kao o 'seksu' nego kao o zaštiti.",eMid:"Vidim... ima logike. Pričaću sa mužem.",eBad:"Razmisliću.",take:"Moralne brige se ne pobeđuju moralnim demantijem. Pobeđuju se <em>premapiranjem</em> — pokazujući da vakcina ne ugrožava vrednosti, već ih čuva."},

{title:"HPV se prolazi sam — zašto vakcinisati?",root:"Distortovana percepcija rizika (HPV)",parent:{i:"O",l:"Otac · ćerka 14 god."},open:"Pa dobro, HPV — zar nije to nešto što se prolazi? Većina ljudi se zarazi, ne zna ni da ga ima, i prođe. Zašto bismo mi vakcinisali zdravo dete protiv nečega što verovatno neće biti problem?",steps:[
{t:"root",p:"Korak 1 · Koren stava?",o:[
{x:"Distortovana percepcija rizika",ok:1,fb:"Argument je 'rizik nije dovoljan da opravda intervenciju' — obrazac iz korena <strong>distorted risk perception</strong>."},
{x:"Neutemeljena uverenja — prirodno je najbolje",ok:0,fb:"Ne kaže da je prirodno bolje — kaže da rizik nije veliki. Razlika u nijansi."},
{x:"Konspirativna ideja",ok:0,fb:"Ne pominje skrivenu nameru. Smatra da rizik ne opravdava intervenciju."}]},
{t:"affirm",p:"Korak 2 · Afirmacija",o:[
{q:"good",x:"U pravu ste — i to je važno reći. Većina HPV infekcija zaista prolazi sama od sebe. Mnogi to ne čuju jasno, pa hvala što ste postavili pitanje.",fb:"Genijalno. <strong>Priznajete istinu</strong> — gradite poverenje. Sada vam veruje da niste 'pro-vakcinski automat'."},
{q:"bad",x:"Niste sasvim u pravu — HPV je vrlo opasan.",fb:"Frontalno suprotstavljanje. Pošto je argument delimično tačan, izgledate kao da preuveličavate."},
{q:"bad",x:"Mnogi roditelji misle kao vi — ali greše.",fb:"Snishodljivo. Stavlja ga u kategoriju 'onih koji greše'."}]},
{t:"refute",p:"Korak 3 · Opovrgavanje",o:[
{q:"good",x:"Tačno — oko 90% HPV infekcija telo savlada samo. Problem je kod 10% gde virus ostaje godinama — upravo te trajne infekcije izazivaju rak. A mi ne možemo unapred znati koje će dete biti u tih 10%. Vakcina je 'osiguranje' za slučaj kad telo ne uspe. Kao pojas u kolima.",fb:"Briljantno. Prihvatate premisu, dodaje nedostajući deo (10%), pruža <strong>razumljivu analogiju</strong>."},
{q:"neutral",x:"HPV uzrokuje rak — zato je vakcina važna.",fb:"Tačno, ali ne odgovara na poentu da je rizik <em>mali</em>."},
{q:"bad",x:"Verujte mi kao lekaru, ovo treba.",fb:"Argumentum ad verecundiam."}]},
{t:"facts",p:"Korak 4 · Činjenice",o:[
{q:"good",x:"U Srbiji oko 1.500 žena godišnje oboli od raka grlića, oko 400 umre — više od jedne dnevno. Plus rak grla, anusa, vulve. Vakcina sprečava oko 90%. Australija je počela 2007 — rak grlića skoro nestao kod mladih.",fb:"Konkretno (Srbija — njegov kontekst), Australija (dokaz da radi). Pretvara apstraktno '10%' u <em>jedna žena dnevno</em>."},
{q:"neutral",x:"Brojevi pokazuju da je važno.",fb:"Bez specifika, samo opšta tvrdnja."}]}
],eGood:"Hm. Nisam znao da je toliko. Razgovaraću sa ćerkom — ima 14, već može da razume.",eMid:"Razmisliću još. Pričaću sa ženom.",eBad:"Ja i dalje mislim da je previše brige za malu šansu.",take:"Niska percepcija rizika pobeđuje se <strong>kalibracijom</strong>: priznati istinu i precizirati ko nije u toj većini."},

{title:"Previše vakcina, prirodno je bolje",root:"Neutemeljena uverenja — prirodno (opšte)",parent:{i:"M",l:"Majka · sin 13 god."},open:"Doktore, ja se trudim da moja deca žive prirodno — što manje lekova. Imam utisak da im dajemo previše vakcina, premnogo, prerano. Telo bi trebalo da nauči samo da se brani.",steps:[
{t:"root",p:"Korak 1 · Koren stava?",o:[
{x:"Neutemeljena uverenja — prirodno je najbolje",ok:1,fb:"Kombinacija <em>natural is best</em> i <em>overmedicalization</em>. To je <strong>ideologija prirodnosti</strong>."},
{x:"Distortovana percepcija rizika",ok:0,fb:"Ne osporava bolesti — ima drugačiji pogled na <em>kako</em> telo treba da se bori."},
{x:"Konspirativna ideja",ok:0,fb:"Nema zavere. Pozitivno ukorenjeno uverenje u prirodnost."}]},
{t:"affirm",p:"Korak 2 · Afirmacija",o:[
{q:"good",x:"Cenim što razmišljate šta dajete deci — to je odgovorno. I zaista, neki lekovi se prepisuju previše, recimo antibiotici. Logično je da to pitanje postavite i za vakcine.",fb:"<strong>Priznajete deo istine</strong> i premeštate je u <em>vama prijateljski okvir</em>."},
{q:"bad",x:"Vakcine nisu kao drugi lekovi, to je nesporazum.",fb:"Poriče njenu zabrinutost. 'Nesporazum' znači 'pogrešno mislite'."},
{q:"bad",x:"Prirodno ne znači sigurno — i bolest je prirodna.",fb:"Logički ispravno, ali emocionalno konfrontativno."}]},
{t:"refute",p:"Korak 3 · Opovrgavanje",o:[
{q:"good",x:"Vakcina ne 'zamenjuje' imuni sistem — ona ga <em>trenira</em>. Pokazuje mu kako virus izgleda <em>pre</em> nego što se susretne sa pravim. A što se tiče 'previše' — vaš sin se svaki dan susreće sa hiljadama mikroorganizama. Kalendar vakcina je manje 'opterećenje' nego jedan dan napolju.",fb:"Premapiranje: vakcina = <strong>trening, ne supstitut</strong>. Spaja se sa intuicijom o snazi tela."},
{q:"neutral",x:"Vakcine su neophodne za zdravlje deteta.",fb:"Generičko. Ne adresira zašto baš vakcina."},
{q:"bad",x:"Bez vakcina deca umiru od malih boginja.",fb:"Plašenje. Aktivira otpor."}]},
{t:"facts",p:"Korak 4 · Činjenice",o:[
{q:"good",x:"Vaše dete u jednom dahu udahne više antigena nego što ih ima u svim vakcinama zajedno. Imuni sistem obrađuje milione signala dnevno. A za HPV — vakcina ne unosi živi virus, već prazne 'ljušture' (VLPs) koje imuni sistem zapamti.",fb:"Biološki mehanizam koji <strong>poštuje njenu inteligenciju</strong>."},
{q:"neutral",x:"Vakcine su efikasna mera javnog zdravlja.",fb:"Apstraktno — ne menja lični okvir."}]}
],eGood:"Zanimljivo... nisam tako razmišljala. Razmisliću.",eMid:"Razgovaraćemo opet. Treba mi vreme.",eBad:"Mi ćemo i dalje birati prirodne metode.",take:"'Prirodno je bolje' pobeđuje se <strong>premapiranjem</strong>: vakcina nije <em>protiv</em> imuniteta, već <em>partner</em>."},

{title:"Čula sam za devojčice koje su imale teške reakcije",root:"Strah i fobije — strašne povrede (HPV)",parent:{i:"M",l:"Majka · ćerka 12 god."},open:"Čitala sam priče o devojčicama koje su nakon HPV vakcine imale ozbiljne neurološke probleme, autoimune bolesti, čak i neplodnost. Ne mogu da rizikujem da se to desi mojoj ćerki.",steps:[
{t:"root",p:"Korak 1 · Koren stava?",o:[
{x:"Strah i fobije — strašne povrede",ok:1,fb:"Imenuje konkretne <strong>katastrofalne ishode</strong> — <em>dreadful injuries</em> obrazac."},
{x:"Konspirativna ideja",ok:0,fb:"Ne pominje skriveni motiv. Primarna emocija je <strong>strah</strong>."},
{x:"Nepoverenje u sistem",ok:0,fb:"Argument je 'desiće se nešto strašno' — ne 'sistem laže'."}]},
{t:"affirm",p:"Korak 2 · Afirmacija",o:[
{q:"good",x:"Razumem — kad čujete priče o drugoj deci, prvi instinkt je zaštititi svoje. To je prirodna reakcija svakog roditelja.",fb:"Validirate <strong>roditeljski instinkt</strong> kao legitiman."},
{q:"bad",x:"Te priče sa interneta su lažne.",fb:"Nemate kredibilitet da to tvrdite frontalno."},
{q:"bad",x:"Tako razmišljaju panične majke.",fb:"Sramoti, vređa identitet."}]},
{t:"refute",p:"Korak 3 · Opovrgavanje",o:[
{q:"good",x:"Tačno je da na internetu kruže anegdote — i razumem da su uznemirujuće. Ali kad se sistematski ispituju (preko 10 velikih studija na milionima devojčica), nije pronađena veza sa autoimunim bolestima ili neplodnošću. Anegdote ne dokazuju uzrok — tinejdžerke svake godine dobijaju autoimune bolesti i bez vakcine.",fb:"Priznaje da anegdote postoje (validacija), zatim brojevi i objašnjava <em>zašto</em> anegdote varaju."},
{q:"neutral",x:"Vakcina je bezbedna, ne brinite.",fb:"Generičko, ne adresira konkretnu zabrinutost."},
{q:"bad",x:"Te priče su izmišljene od antivaksera.",fb:"Premapira njen identitet u 'antivakser'."}]},
{t:"facts",p:"Korak 4 · Činjenice",o:[
{q:"good",x:"Naprotiv — vakcina <em>štiti</em> plodnost. Lečenje preinvazivnih lezija (konizacija) povećava rizik od prevremenog porođaja. Vakcina sprečava lezije — sprečava i tu intervenciju.",fb:"Briljantno. <strong>Preokreće strah</strong>: vakcina ne ugrožava plodnost — sprečava ono što je ugrožava."},
{q:"neutral",x:"Vakcina je proverena na milionima ljudi.",fb:"Ne preokreće specifičan strah."}]}
],eGood:"Nisam to znala — da konizacija može da utiče na trudnoću. To je nešto što ću proveriti.",eMid:"Razmisliću, ali još uvek imam strepnju.",eBad:"Ne mogu da rizikujem.",take:"Strah od katastrofe pobeđuje se <strong>preokretom narativa</strong>: vakcina brani baš ono što roditelj brani."},

{title:"Uradio sam svoje istraživanje",root:"Nepoverenje — do your own research",parent:{i:"O",l:"Otac · ćerka 11 god."},open:"Doktore, sa svim dužnim poštovanjem — ja sam uradio svoje istraživanje. Čitao sam različite izvore, ne samo zvanične. Vi lekari ste obučeni u jednom okviru, a postoje i drugi pogledi. Ja moram sam da donesem odluku za svoje dete.",steps:[
{t:"root",p:"Korak 1 · Koren stava?",o:[
{x:"Nepoverenje — 'uradi svoje istraživanje'",ok:1,fb:"Sopstveno istraživanje kao <strong>jednakovredno</strong> stručnoj literaturi."},
{x:"Konspirativna ideja",ok:0,fb:"Ne tvrdi da postoji zavera."},
{x:"Moralne brige",ok:0,fb:"Ne moralni argument — već <em>autonomija znanja</em>."}]},
{t:"affirm",p:"Korak 2 · Afirmacija",o:[
{q:"good",x:"Cenim što ozbiljno pristupate odluci — vaše dete je vaše dete. Nije lako razabrati se u moru informacija danas.",fb:"Validirate <strong>autonomiju</strong> — upravo ono što mu je važno."},
{q:"bad",x:"Internet nije izvor znanja — medicinske škole jesu.",fb:"Direktno vređa autonomiju."},
{q:"bad",x:"Pa onda donesite kakvu hoćete odluku.",fb:"Pasivna agresija."}]},
{t:"refute",p:"Korak 3 · Opovrgavanje",o:[
{q:"good",x:"Slažem se da je vaša odluka. Pitanje je <em>koji</em> izvori. Razlika nije u tome ko je 'pravi' — već u tome ko <strong>transparentno objavljuje izvore i metode</strong>, ko prolazi peer review. Mogu da vam pokažem konkretne studije. Hoćete li da pregledamo zajedno?",fb:"<strong>Premapira pitanje</strong> sa 'ko je u pravu' na 'koji su kriterijumi'."},
{q:"neutral",x:"Lekari imaju decenije obuke u medicini.",fb:"Argumentum ad verecundiam."},
{q:"bad",x:"Internet je pun laži i pseudonauke.",fb:"Generalizacija koja ga uvrijedi."}]},
{t:"facts",p:"Korak 4 · Činjenice",o:[
{q:"good",x:"Cochrane je nezavisna organizacija koja kritički preispituje medicinske intervencije — često ide <em>protiv</em> zvaničnih preporuka. 2018 izveštaj: 73 studije, 73.000+ ispitanika. HPV vakcina sprečava preinvazivne lezije. Otvoren pristup. Možete sami pogledati.",fb:"<strong>Daje mu alat</strong> (Cochrane), priznaje kritičko preispitivanje — odgovara skepticizmu."},
{q:"neutral",x:"Studije pokazuju da vakcina radi.",fb:"Bez izvora — nije bolje od alternativnih sajtova."}]}
],eGood:"Hvala. Ovo je prvi put da neko nije pokušao da me ubedi — već da mi pokaže izvore.",eMid:"Razmisliću.",eBad:"Nastaviću sa svojim istraživanjem.",take:"'Uradi svoje istraživanje' nije ignoranca — to je <strong>autonomija</strong>. Nikada ne osporavajte; <em>obučite je</em>."},

{title:"Moje dete, moja odluka",root:"Pogled na svet — libertarijanizam",parent:{i:"M",l:"Majka · ćerka 14 god."},open:"Doktore, ovo nije pitanje vakcine — ovo je pitanje slobode. Posle COVID-a izgubila sam poverenje u to kako država i medicinski sistem rade. Moje dete, moja odluka. Ne želim da iko spolja diktira.",steps:[
{t:"root",p:"Korak 1 · Koren stava?",o:[
{x:"Pogled na svet — libertarijanizam",ok:1,fb:"Eksplicitno govori o <strong>slobodi izbora</strong> i odbijanju spoljnog uticaja."},
{x:"Konspirativna ideja",ok:0,fb:"Nema implikacije skrivene namere — opšte odbijanje kontrole."},
{x:"Nepoverenje u sistem",ok:0,fb:"Razlika: distrust = sistem laže; libertarianism = moje pravo bez obzira."}]},
{t:"affirm",p:"Korak 2 · Afirmacija",o:[
{q:"good",x:"Potpuno se slažem — vi ste roditelj, vi donosite odluku. Moja uloga nije da diktiram, već da podelim šta znam. I čujem vas — pandemija je za mnoge bila težak period.",fb:"<strong>Eksplicitno potvrđujete</strong> autonomiju i validirate COVID iskustvo."},
{q:"bad",x:"Država ima pravo i obavezu da štiti decu.",fb:"Eskalacija. Pretvarate razgovor u politički."},
{q:"bad",x:"Vakcine nisu politika.",fb:"Poriče njenu doživljenu stvarnost."}]},
{t:"refute",p:"Korak 3 · Opovrgavanje",o:[
{q:"good",x:"Upravo zato što je vaša odluka, želim da imate <em>vašu</em> informaciju — ne moju, ne državnu. HPV vakcina kod nas <strong>nije obavezna</strong>. Šta god odlučite, tretiram vas kao odgovornu osobu sposobnu da donese odluku za svoje dete.",fb:"<strong>Maksimalno empatski</strong>. Pojačavate autonomiju, postavljate sebe kao <em>resursa</em>."},
{q:"neutral",x:"Ovo nije politika, ovo je javno zdravlje.",fb:"Pomera okvir, ali ona ga oseća kao politički."},
{q:"bad",x:"Pa nemojte je raditi onda — ali ćete snositi posledice.",fb:"Pretnja. Završava razgovor."}]},
{t:"facts",p:"Korak 4 · Činjenice",o:[
{q:"good",x:"U zemljama gde se vakcina daje preko 70% devojčica (UK, Australija, Skandinavija), rak grlića nestaje kod mladih generacija. Podaci iz nacionalnih registara. Vaša ćerka može biti deo te generacije. Ali odluku donosite vi.",fb:"<strong>Tvrdi podaci</strong> + zatvara sa potvrđivanjem autonomije."},
{q:"neutral",x:"Vakcine spasavaju živote.",fb:"Opšti slogan."}]}
],eGood:"Hvala. Cenim što me niste pritiskali. Razmisliću sa mužem.",eMid:"Ovo je drugačiji razgovor.",eBad:"Ja i dalje neću da je vakcinišem.",take:"Libertarijanski koren <strong>uvek se pogoršava pritiskom</strong>. Što više potvrđujete autonomiju, više prostora ostavljate."}
];
