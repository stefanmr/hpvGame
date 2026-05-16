/* ════════════════════════════════════════════════════
   personas.js — sadržaj za Igru 02 (Roditelj / Parent)

   Ovaj fajl je jedino mesto gde se edituju persone.
   engine.js i styles.css ne treba dirati.

   STRUKTURA PERSONE — svaki objekat u PERSONAS[]:
     id        — interni identifikator (ne menja se)
     active    — 1 = dostupna; 0 = stub (prikazuje "Uskoro", nije klikabilna)
     name      — ime persone (prikazano na kartici i u igri)
     tag       — kratka karakterizacija u navodnicima na kartici i baru
     hook      — jedna rečenica za trener/fasilitator kontekst (nije prikazano u igri)
     intro     — niz stringa; svaki string = jedan paragraf uvoda pre ordinacije
                 (HTML tagovi dozvoljeni, npr. <em>)
     start     — početne vrednosti merača: {anks, sas, otv, dec}
                 anks = anksioznost (0–100; visoko = zatvoreniji)
                 sas  = saslušano (0–100; raste kad se persona oseća čutom)
                 otv  = otvorenost (0–100; utiče na ishod)
                 dec  = odluka o vakcinaciji (0 = protiv, 100 = za)
     doc       — lekar u ovoj personi: {i: inicijali za avatar, l: puno ime + titula}
     scenes    — niz od 4 scene (vidi STRUKTURA SCENE ispod)
     endings   — objekat sa ključevima: best | rushed | delayed | mid | pending | closed
                 (koji ključevi postoje zavisi od choices[].end u poslednjoj sceni)
     finalLine — poslednja rečenica prikazana korisniku na kraju igre

   STRUKTURA SCENE (scenes[]):
     title       — naslov scene (prikazan u baru)
     docLine     — fiksni tekst lekara (koristiti ili docLine ILI docHigh+docLow ILI docVariants)
     docHigh     — tekst lekara kad je sas+otv ≥ 30 (engine ih automatski bira)
     docLow      — tekst lekara kad je sas+otv < 30
     docVariants — objekat gde ključevi mogu biti:
                     naziv unlock taga (ima prioritet)
                     "high" i "low" (fallback po stanju merača)
     prompt      — pitanje prikazano igraču (šta lik oseća/bira)
     choices     — niz emocionalnih izbora (vidi STRUKTURA IZBORA ispod)

   STRUKTURA IZBORA (choices[]):
     em      — naziv emocije (bold, prikazan kao dugme)
     in      — unutrašnji monolog lika u navodnicima (italic ispod em)
     imp     — uticaj na merače: {anks, sas, otv, dec}
               vrednosti mogu biti pozitivne ili negativne; izostavljene = bez promene
               clamp(0–100) se primenjuje automatski
     re      — reakcija/naracija prikazana korisniku posle izbora
     unlock  — (opciono) string tag koji se dodaje u S.pPath
               koristi se da se "otključaju" docVariants i req izbori u kasnijim scenama
     req     — (opciono) string tag; ovaj izbor se NE prikazuje ako tag nije u S.pPath
               koristiti req zajedno sa odgovarajućim unlock u ranijoj sceni
     end     — (opciono) string ključ endinga; postavlja S.pEnding
               SAMO u poslednjoj sceni; mora odgovarati ključu u endings{}

   STRUKTURA ENDINGA (endings{}):
     phone   — naracija telefonskog poziva posle ordinacije (HTML dozvoljen)
     opts    — niz od 4 stringa; svaki = opcija šta lik kaže/misli (dugmad bez merača)
     close   — niz stringa; svaki = jedan paragraf finalnog narativa

   ════════════════════════════════════════════════════ */

const PERSONAS=[

/* ━━━━━━━ MARIJA ━━━━━━━ */
{id:"marija",active:1,name:"Marija",
tag:"Posle COVID-a, više ne verujem sistemu",
hook:"Pre dve godine joj je tetka umrla. Sada pedijatrica preporučuje vakcinu za ćerku — bez pitanja.",
intro:["Imaš 38 godina. Lana ima 14.","Pre dve godine je tvoja tetka umrla — propušten skrining raka grlića materice. Lekari su odlagali. Devet meseci kasnije, otišla je.","Od tada ne veruješ sistemu koji govori <em>«mi znamo bolje»</em>.","Pedijatrica je preporučila HPV vakcinu za Lanu. Nije pitala — rekla je: <em>treba</em>.","Tražila si drugo mišljenje. Sediš u čekaonici pedijatra. Stomak ti se grči."],
start:{anks:75,sas:5,otv:15,dec:20},
doc:{i:"MJ",l:"Dr Marija Janković, pedijatrica"},
scenes:[
{title:"Ulazak",
docLine:"Marija, dobar dan. Hvala što ste došli. Sela bih sa vama da pričamo o Lani. Vidim u kartonu da imate pitanja oko HPV vakcine. Mogu li prvo da pitam — šta vas najviše brine?",
prompt:"Šta osećaš dok je slušaš?",
choices:[
{em:"Olakšanje",in:"Pita, ne kaže. Drugačije je.",imp:{anks:-10,sas:15,dec:5},re:"Spuštaš ramena za milimetar. Nešto u tebi je čekalo upravo to."},
{em:"Oprez",in:"Lepo počinje. Pa će sigurno doći «treba».",imp:{anks:5,otv:-5,dec:-5},re:"Čekaš. Ne odgovaraš odmah. Lepe reči ne znače ništa dok se ne pokažu."},
{em:"Sumnja",in:"Zna ona šta radi. Otvori, pa udri.",imp:{anks:10,sas:-5,otv:-10,dec:-10},re:"Skrstaš ruke. Defanziva je nužna — već si bila na ovome."},
{em:"Iznenađenje",in:"Niko me dosad nije ovo pitao.",imp:{anks:-5,sas:20,otv:5,dec:10},re:"Pogledaš je pažljivije. Stvarno te pita. Posle pet ordinacija, ovo je prvi put."}]},
{title:"Šta deliš?",
docHigh:"Vidim da je teško. Ne moramo ići brzo. Šta je za vas važno da znamo pre nego što o vakcini pričamo?",
docLow:"Razumem. Probaću da budem konkretna. Šta vas tačno brine, koje su prve stvari koje vam padaju na pamet?",
prompt:"Šta sad kažeš?",
choices:[
{em:"Lično — deliš tetku",in:"Možda treba da zna zašto sam tu.",imp:{anks:-10,sas:25,otv:15,dec:15},re:"Reči izađu pre nego što odlučiš. Pričaš o tetki. O odlaganju. O devet meseci. Lekarka ne prekida.",unlock:"shared"},
{em:"Direktno — tražiš izvor",in:"Pre svega — ko stoji iza ove preporuke?",imp:{sas:5,otv:5,dec:5},re:"Postavljaš pitanje hladno, ali pošteno. «Pošteno pitanje», kaže ona."},
{em:"Operativno — pitaš za nuspojave",in:"Hoću činjenice. Hoću podatke.",imp:{sas:5,otv:-5,dec:0},re:"Povučeš se u tehničko. Sigurnije je. Lekarka prihvata tvoj okvir."},
{em:"Vrednosno — odbrambeno",in:"Ja sam Lanina majka. Hoću da znam zašto baš ja sad moram da odlučim.",imp:{anks:5,sas:10,dec:-5},re:"Glas ti je oštriji nego što si htela. Lekarka ne pravi pauzu — slaže se."}]},
{title:"Reakcija lekarke",
docVariants:{shared:"Marija, žao mi je. To je strašno gubitak. I razumem zašto je teško da poverujete kada vam neko sa autoritetom kaže «treba». Mogu li da vas pitam — šta vam je tetka rekla u poslednjim mesecima?",high:"Razumem. Pre nego što išta drugo — ovo nije obavezno. Vi odlučujete, ne ja, ne država. Šta vam mogu objasniti?",low:"Razumem. Probaću da budem korisna — ako mi dozvolite. HPV vakcina kod nas nije obavezna. Šta vas najviše interesuje?"},
prompt:"Kako reaguješ?",
choices:[
{em:"Suzbijaš plač",in:"Niko me nije ovo pitao.",imp:{anks:-20,sas:25,otv:10,dec:20},re:"Trepneš pre nego što ti suza padne. Osetiš se gledano po prvi put u nekoliko godina.",req:"shared"},
{em:"Spuštaš ramena",in:"Možda mogu malo da joj verujem.",imp:{anks:-15,sas:10,otv:5,dec:15},re:"Skrštene ruke se opuste. Sediš drugačije sada. Bez da si to odlučila."},
{em:"Tražiš još",in:"Hoću da čujem više.",imp:{anks:-5,sas:5,otv:15,dec:10},re:"Naginješ se napred. Pitanja koja si držala u glavi izlaze redom — i ona odgovara, redom."},
{em:"I dalje skeptična",in:"Lepe reči. Ali zašto baš sada?",imp:{anks:5,otv:-10,dec:-15},re:"Slušaš sa pola pažnje. Lepe reči, lepe reči. Ali odluka je teška."}]},
{title:"Odluka",
docLine:"Marija, dali smo sebi vreme. Kako se sada osećate u vezi sa odlukom?",
prompt:"Šta odlučuješ?",
choices:[
{em:"«Vraćamo se u petak. Sa Lanom.»",in:"Hoću da i ona čuje. Hoću da odluči sa mnom.",imp:{anks:-10,sas:10,otv:30,dec:30},end:"best",re:"Reč «sa Lanom» izgovara se prirodno. Lekarka klima. «Odlično, kažem joj da dođe.» Odlazak je drugačiji od dolaska."},
{em:"«Vakcinisaću je danas.»",in:"Sad smo. Hajde da završimo.",imp:{anks:-5,sas:5,otv:25,dec:40},end:"rushed",re:"Reč izlazi pre nego što si pomislila. Možda i si pomislila. Lana ti telefonira čim izlaziš."},
{em:"«Razgovaraću sa mužem.»",in:"Treba mi nekoliko dana.",imp:{sas:5,otv:10,dec:10},end:"delayed",re:"Brošure u torbi. «Hvala» je iskreniji nego što si očekivala."},
{em:"«Cenim razgovor. Neću danas.»",in:"Ne. Ne danas.",imp:{otv:-10,dec:-30},end:"closed",re:"Glas ti je miran. Lekarka ne pokušava da te prevari. Klima. «Vrata su otvorena», kaže. Veruješ joj."}]}],
endings:{
best:{phone:"Lana zove čim si u kolima. <em>«Mama, jesi gotova? Šta je rekla?»</em>",
opts:["«U petak idemo zajedno. Hoću da i ti čuješ.»","«Bila je drugačija. Pričaćemo večeras.»","«Mama je dobro. Posle pričamo.»","«Spremaj se. Idemo zajedno.»"],
close:["Vozeći se kući, misliš na tetku.","Ne na vakcinu. Na tetku.","Kako je rekla, mesec pre nego što je otišla: <em>«Da sam pre znala. Da sam pre pitala.»</em>","Možda Lani večeras kažeš sve. Možda joj ne kažeš ništa.","Ali nešto si danas naučila što nije bilo u tvojim rukama do jutros."]},
rushed:{phone:"Lana ti telefonira dok sestra puni špric.",
opts:["«Mama je ovde. Pričaćemo posle.»","«Idem da završim nešto. Sutra ti pričam.»","«Sve je u redu. Pričamo večeras.»","«Mama je dobro. Posle.»"],
close:["Možda si trebala da je čekaš.","Možda nisi. Možda je odluka donesena onda kada ti je trebala — pre dve godine, sa tetkom.","Vraćaš se kući. Ne osećaš se dobro, ne osećaš se loše. Osećaš se kao da si nešto preskočila.","Možda Lani večeras ne pričaš. Možda joj sve pričaš."]},
delayed:{phone:"Lana zove. <em>«Mama, jesi gotova? Šta sad?»</em>",
opts:["«Razgovaramo večeras s tatom. Ti takođe.»","«Treba mi vreme. Pričaćemo.»","«Sutra, kad smo svi mirni.»","«Mama razmišlja. Pričaćemo.»"],
close:["Vozeći se kući, otvaraš torbu na semaforu.","Materijal je tamo. Brošure, broj telefona, link. Lekarkin rukopis na ivici.","Možda ćeš ih pročitati. Možda ćeš ih ostaviti u fioci.","Nešto se danas pomaklo. Ne znaš još kuda.","Ali pomaklo se."]},
closed:{phone:"Lana zove. <em>«Mama, kako je bilo?»</em>",
opts:["«Bila je u redu. Pričamo večeras.»","«Mama te pita kako je tebi danas u školi.»","«Dobro. Sad ne pričam, voziću.»","«Hvala što si me pitala. Mama te voli.»"],
close:["Vozeći se kući, ne misliš na vakcinu.","Misliš na Lanu. Kako je sedela na klupi prvi dan škole. Kako su joj se ramena povijala.","Tvoja je. Tvoja je tvoja.","Možda za godinu dana ćeš se vratiti. Možda nećeš. Možda ćeš.","Lekarka je rekla da su vrata otvorena."]}
},
finalLine:"Hvala što si bila Marija ovih 10 minuta."},

/* ━━━━━━━ JELENA ━━━━━━━ */
{id:"jelena",active:1,name:"Jelena",
tag:"Sedam godina čitam liste sastojaka",
hook:"Sin sa alergijskom astmom. Vakcinu za ćerku gleda kroz prizmu jednog složenog deteta.",
intro:["Imaš 35 godina. Dvoje dece: Mila 13, Lazar 7.","Lazar ima alergijsku astmu. Sedmu godinu se boriš da nađeš šta mu škodi.","Postala si stručnjak za etikete. <em>Bez aditiva, bez kompromisa.</em>","Sad je HPV vakcina za Milu. Aluminijum. Adjuvansi.","Ne želiš da uneseš u njeno mlado telo nešto što ne razumeš."],
start:{anks:80,sas:10,otv:20,dec:25},
doc:{i:"VL",l:"Dr Vesna Lazarević, lekar opšte medicine"},
scenes:[
{title:"Ulazak",
docLine:"Jelena, dobar dan. Vidim da Mila treba na HPV vakcinu. Pre nego što išta drugo — kako ste vi? Vidim u kartonu da imate i drugo dete sa zdravstvenim izazovima.",
prompt:"Šta osećaš?",
choices:[
{em:"Iznenađenje",in:"Pita za mene, ne samo za vakcinu.",imp:{anks:-10,sas:20,otv:5,dec:10},re:"Torba sa 7 godina Lazarevih kartona u krilu. Neko te konačno pita kako si <em>ti</em>."},
{em:"Oprez",in:"Sad će probati da me umiri — pre vakcine.",imp:{anks:5,otv:-5,dec:-5},re:"Slušaš pažljivo. Lepe reči su uvek prvi korak."},
{em:"Iritacija",in:"Aha, otvara Lazara da bi ušla u Milu.",imp:{anks:10,sas:-5,otv:-10,dec:-10},re:"Stisneš torbu. Lazar nije «strategija razgovora»."},
{em:"Otvaranje",in:"Možda mogu da kažem... možda može da razume.",imp:{anks:-15,sas:15,otv:10,dec:15},re:"Spuštaš torbu. <em>«Sedam godina»</em>, kažeš tiho. Lekarka samo klima glavom."}]},
{title:"Šta tražiš?",
docHigh:"Jelena, hvala. Pre HPV vakcine, hoću da znate — sva vaša pitanja su normalna. Ja ne idem «da prodam vakcinu». Idem da razgovaramo. Šta je vaše prvo pitanje?",
docLow:"Razumem da imate brige. Šta je najvažnije da znate o HPV vakcini?",
prompt:"Šta postavljaš?",
choices:[
{em:"Lista sastojaka",in:"Hoću da vidim šta tačno ulazi u njeno telo.",imp:{sas:5,otv:10,dec:5},re:"Lekarka otvara nešto na ekranu. «Hajde, gledamo zajedno.»"},
{em:"Strah od reakcije — kao Lazar",in:"Bojim se da će Mila imati reakciju.",imp:{anks:-15,sas:25,otv:15,dec:15},re:"Reči izađu jedva. Lekarka klima i čeka — ne prekida. «Recite mi šta tačno strepite», kaže nakon trenutka.",unlock:"shared"},
{em:"Aluminijum specifično",in:"Aluminijum mi je problem. Pročitala sam.",imp:{sas:5,otv:5,dec:5},re:"«Razumem, čitala sam i sama o tome. Pričaćemo, ali pre toga...»"},
{em:"Distanca — zašto sad",in:"Možemo li sačekati? Ima vremena.",imp:{anks:5,sas:5,dec:-5},re:"Pitanje je sigurnije od direktnog «ne». Lekarka prihvata okvir."}]},
{title:"Razgovor o Lazaru",
docVariants:{shared:"Jelena, hvala što ste mi to rekla. Mogu li da pitam — kakvu reakciju je Lazar imao i šta vam je trebalo da je nađete?",high:"Aluminijum u vakcinama je u tragovima — manje nego što beba unese mlekom u 6 meseci. Ali to nije ono što vam je važno, zar ne? Vama je važno — može li Mila <em>ne</em> da bude kao Lazar?",low:"Da, sastojci. Aluminijum u tragovima. Mogu da pokažem grafikone."},
prompt:"Kako reaguješ?",
choices:[
{em:"Plač",in:"Sedam godina sam se borila. I neko me sad pita.",imp:{anks:-25,sas:25,otv:15,dec:20},re:"Suza padne na torbu. Lekarka samo gurne maramicu preko stola. Ne kaže ništa.",req:"shared"},
{em:"Pažljivo slušaš",in:"Možda mogu da razumem.",imp:{anks:-10,sas:10,otv:15,dec:15},re:"Naginješ se napred. Lekarka govori jezikom koji znaš — sastojci, brojevi, doze."},
{em:"Skepticizam",in:"Mleko nije aluminijum.",imp:{anks:5,otv:-5,dec:-5},re:"«Aluminijum je aluminijum», kažeš. Lekarka klima. «Da. Hoćete da uđemo u apsorpciju, biodostupnost?»"},
{em:"Distanca",in:"Lepo govori. Treba mi vreme.",imp:{otv:5,dec:0},re:"Slušaš, ali ne primaš. Sve razumeš. Ali. Sedam godina."}]},
{title:"Odluka",
docLine:"Jelena, šta razmišljate sada?",
prompt:"Šta odlučuješ?",
choices:[
{em:"«Vakcinisaćemo. Hvala.»",in:"Hvala što ste me saslušali. Spremne smo.",imp:{anks:-5,sas:15,otv:25,dec:40},end:"best",re:"Reči izlaze odlučno. Lekarka klima. «Drago mi je. Možemo i sledeću nedelju.»"},
{em:"«Razmisliću nedelju.»",in:"Treba mi malo vremena. Hoću da pročitam.",imp:{sas:10,otv:20,dec:20},end:"delayed",re:"Lekarka daje brošure i broj. «Pitajte šta god vam treba.» Veruješ joj."},
{em:"«Možda kasnije.»",in:"Ne danas. Možda za par meseci.",imp:{sas:5,otv:5,dec:0},end:"pending",re:"Lekarka ne pritiska. Klima glavom. «Razumem. Mila ima vremena.»"},
{em:"«Hvala. Neću danas.»",in:"Ne mogu. Možda nikad.",imp:{otv:-10,dec:-30},end:"closed",re:"«U redu. Vrata su otvorena.»"}]}],
endings:{
best:{phone:"Mila pita u kolima: <em>«Mama, šta sad?»</em>",
opts:["«Spakuj torbicu, idemo sledeće nedelje.»","«Razgovaraćemo večeras kod kuće.»","«Mama je dobro. Pričaćemo.»","«Bilo je drugačije nego što sam očekivala.»"],
close:["Vozeći se kući, zvuk je drugačiji.","Lazarevi inhalatori u torbi, etikete u glavi, sedam godina opreza.","Možda nije svaki strah neprijatelj.","Možda nije svaka vakcina ista.","Možda postoji prostor između <em>«ne dam ništa što ne razumem»</em> i <em>«kažu — treba».</em>"]},
delayed:{phone:"Pre nego što odeš, lekarka ti gura broj telefona. <em>«Zovite ako budete imale pitanja.»</em>",
opts:["«Hvala. Možda vas zovem.»","«Ozbiljno ću razmisliti.»","«Pričaću sa Lazarom — sa pedijatrom.»","«Mila i ja ćemo pričati uveče.»"],
close:["Vozeći se kući, ne osećaš se rešeno.","Ali kovčeg u glavi je malo manje zaključan nego jutros.","Materijal u torbi. Možda ga čitaš večeras. Možda za nedelju dana.","Nešto je sad drugačije."]},
pending:{phone:"Mila te gleda u kolima. <em>«Mama, jesi dobro?»</em>",
opts:["«Dobro sam.»","«Razmišljam.»","«Hajde da pravimo palačinke večeras.»","«Volim te.»"],
close:["«Dobro sam», kažeš.","I više nego što si očekivala da budeš.","Možda za pola godine vraćaš se. Možda godinu. Možda nikad.","Ali nije više čekaonica iz koje izlaziš ljuta."]},
closed:{phone:"Vozeći se kući, telefoniraš Lazaru. On ti priča o školi.",
opts:["«Pričaj mi, slušam.»","«Ti si moj veliki čovek.»","«Posle ti pravim sve što voliš.»","«Da li te ovo boli — sve mama oseti pre nego što ti kažeš.»"],
close:["Razgovor sa lekarkom ti je u zadnjem delu glave.","Možda za godinu dana se vraćaš. Možda nikad.","Sve si njihovo. Sve je njihovo."]}
},
finalLine:"Hvala što si bila Jelena ovih 10 minuta."},

/* ━━━━━━━ SANJA ━━━━━━━ */
{id:"sanja",active:1,name:"Sanja",
tag:"Iva je još dete — ne radi se o tome",
hook:"Tradicionalna porodica. Vakcina protiv «polno prenosive bolesti» u 12. godini deluje kao pogrešan signal.",
intro:["Imaš 40 godina. Iva ima 12, Stefan 15.","Tvoja porodica čuva vrednosti. Pravoslavlje, zajednica, jasne granice.","Stefan je tvoj prvenac — sa njim si počela direktan razgovor o seksualnosti.","Iva tek raste. Pedijatrica pominje <em>«vakcinu protiv HPV-a»</em>.","Ti čuješ: «vakcinu protiv polno prenosive bolesti». Iva. 12 godina. Ne radi se još o tome."],
start:{anks:60,sas:5,otv:20,dec:20},
doc:{i:"AP",l:"Dr Aleksandar Petrović, pedijatar"},
scenes:[
{title:"Ulazak",
docLine:"Sanja, dobar dan. Vidim u kartonu da imate rezervu oko HPV vakcine za Ivu. Pre nego što išta kažem o vakcini — hoću da znam vaše brige.",
prompt:"Šta osećaš?",
choices:[
{em:"Otvaranje",in:"Iva je dete. Imam razlog da to kažem.",imp:{sas:15,dec:5},re:"«Iva ima 12», kažeš. «Nije vreme za vakcinu protiv toga.» Lekar klima glavom. Sluša."},
{em:"Oprez",in:"Sigurno će me ubediti.",imp:{anks:5,dec:-5},re:"Čekaš na «ali». Uvek dođe."},
{em:"Direktno — vrednosti",in:"Mi smo verska porodica. Imamo svoje vrednosti.",imp:{sas:10,dec:0},re:"Kažeš to mirno, bez izvinjenja. Lekar ne menja izraz lica. Klima."},
{em:"Mirno o porukama",in:"Ovo joj šalje pogrešnu poruku.",imp:{sas:10,otv:5,dec:5},re:"«To što ste rekla — pogrešna poruka — možete li mi to malo objasniti?», pita."}]},
{title:"Šta deliš?",
docHigh:"Razumem. Pre HPV-a — ja sam i sam roditelj. Šta tačno mislite pod «pogrešnom porukom»? Hoću dobro da razumem.",
docLow:"Razumem da je važno koje poruke šaljete deci. Šta vas najviše brine?",
prompt:"Šta deliš?",
choices:[
{em:"Tradicija",in:"Učimo decu da seks čuvaju za brak.",imp:{sas:20,otv:-5,dec:-5},re:"«Hvala što ste mi to rekla. Mogu li nešto da pokažem što me je iznenadilo?»",unlock:"family"},
{em:"Anksioznost o porukama",in:"Bojim se da ću joj poslati signale.",imp:{sas:15,dec:5},re:"Klima glavom. «To je iskrena briga. Mogu li da podelim podatak koji se tiče baš toga?»"},
{em:"Direktno",in:"Mislim da nije ispravno.",imp:{sas:5,dec:-5},re:"Lekar ne pritiska. «U redu. Šta bi bilo dovoljno da promenim način razgovora?»"},
{em:"Pitanje",in:"Da li je istina da vakcinisane deca počinju ranije?",imp:{otv:10,dec:15},re:"«Odlično pitanje. Postoje studije sa hiljadama ispitanica...»"}]},
{title:"Reakcija",
docVariants:{family:"Sanja, hvala. Hoću da kažem nešto — moja žena i ja smo se isto borili kad je naša ćerka došla u te godine. Ako mi dozvolite, pokazaću vam šta me je iznenadilo kad sam istraživao.",high:"Postoje studije sa hiljadama vakcinisanih i nevakcinisanih devojčica. Vakcinisane <em>ne</em> počinju ranije, niti imaju više partnera. Devojčice ovaj proces doživljavaju kao zdravstvenu meru — kao i bilo koju drugu vakcinu.",low:"Devojčice ovaj proces doživljavaju kao zdravstvenu meru, ne kao «dozvolu»."},
prompt:"Kako reaguješ?",
choices:[
{em:"Pažljivo pratiš",in:"Kaže nešto što nisam očekivala.",imp:{otv:20,dec:20},re:"Sediš drugačije sada. Ne kao roditelj koji se brani — kao roditelj koji sluša."},
{em:"Skepticizam",in:"Koje studije? Ko ih je platio?",imp:{otv:0,dec:0},re:"«Pošteno pitanje. Mogu vam ih poslati — Cochrane, otvoren pristup. Nije industrijski finansirano.»"},
{em:"Slušaš porodicu",in:"Pominje svoju decu. Pošten je.",imp:{sas:20,otv:5,dec:15},re:"Nešto se pomera. On je takođe roditelj. To menja stvari.",req:"family"},
{em:"Vrednosno — i dalje",in:"Bez obzira. Ovo nije za naše dete.",imp:{anks:5,otv:-5,dec:-15},re:"Tvoje, tvoje ostaje. Lekar ne pritiska."}]},
{title:"Odluka",
docLine:"Sanja, šta razmišljate sada?",
prompt:"Šta odlučuješ?",
choices:[
{em:"«Razgovaraću s mužem. Možda u proleće.»",in:"Hoću da i Iva uđe u taj razgovor.",imp:{sas:10,otv:25,dec:25},end:"best",re:"Glas miran. Vremenski plan postoji. Lekar klima. «Razumem. Vrata su otvorena.»"},
{em:"«Razmisliću pažljivo.»",in:"Treba mi vreme.",imp:{sas:5,otv:15,dec:15},end:"mid",re:"Lekar daje brošure. Ne tipično za njega. Štampano, sa pažnjom."},
{em:"«Pristaću sad — kad sam ovde.»",in:"Razgovor me je pomerio.",imp:{otv:20,dec:35},end:"rushed",re:"Brzo. Možda prebrzo. Iva ulazi. Lekar je oprezan."},
{em:"«Cenim razgovor. Neću u ovim godinama.»",in:"Možda kasnije.",imp:{otv:-5,dec:-25},end:"closed",re:"«U redu. Razumem. Vrata su otvorena ako se nešto promeni.»"}]}],
endings:{
best:{phone:"Iva pita kad ste u kolima: <em>«Mama, jesi za ili protiv?»</em>",
opts:["«Razgovaramo s tatom.»","«Pričaćemo večeras.»","«Sad neću o tome. Hajde o testu.»","«Pričaću s tobom kad sednemo.»"],
close:["Vozeći se kući, ne pričate o vakcini.","Pričate o testu iz matematike. O njenoj drugarici. O Stefanovom basketu.","A ispod razgovora, nešto stoji: ona je još tvoja Iva.","I tvoj izbor.","Možda u proleće. Možda kad sednete za trpezarijski sto u tri."]},
rushed:{phone:"Iva drži ruku na mestu uboda u kolima.",
opts:["«Boli?»","«Mama je tu.»","«Hajde, da sednemo u poslastičarnicu.»","«Volim te.»"],
close:["Ne pričate. Slušate radio.","Možda nisi imala vremena.","Možda i si — možda je razgovor sa lekarom bio razgovor koji je nedostajao već godinu dana.","Iva ti se smeši kroz ogledalo retrovizora."]},
mid:{phone:"U kuhinji uveče, otvaraš materijale dok praviš čaj.",
opts:["Stefan ulazi. «Šta je to?» — «Nešto za Ivu. Razmišljam.»","Pokazaćeš ih i mužu.","Pričaš sa sveštenikom u nedelju.","Zovi sutra lekara — javi mu šta sa razmišljanjem ide."],
close:["Stefan klima. Lakše sa 15 nego sa 12.","Otvoreno je. Možda da. Možda ne. Možda kasnije.","Ali se priča vodi."]},
closed:{phone:"Iva trči ka kolima. <em>«Mama, gde smo?»</em>",
opts:["«Idemo kući.»","«Hoćeš da pravimo kolač?»","«Hajde, sednimo u parku.»","«Pričamo posle.»"],
close:["Vozeći se kući, ne osećaš se loše. Ne osećaš se ni dobro.","Doneta odluka je tvoja odluka. To je nešto što ti niko ne može oduzeti.","Lekar je rekao da su vrata otvorena. Veruješ mu.","Tvoja je. Tvoja je tvoja."]}
},
finalLine:"Hvala što si bila Sanja ovih 10 minuta."},

/* ━━━━━━━ PETAR ━━━━━━━ */
{id:"petar",active:1,name:"Petar",
tag:"Hoću da raspravljam, ne da primam",
hook:"Doktorant filozofije nauke. Skeptičan prema autoritetu — ali pošten prema procesu.",
intro:["Imaš 39 godina. Doktorant filozofije nauke. Olja 11.","Provodiš dane misleći o tome kako se stvara znanje, ko ima moć da kaže šta je «činjenica».","Ne, nisi antivakser. Da, čitao si literaturu — ne samo zvaničnu.","Pedijatrica preporučuje HPV vakcinu. Žena je za.","Ti hoćeš da razmišljaš. Da raspravljaš. Da budeš pošten prema procesu."],
start:{anks:40,sas:15,otv:35,dec:35},
doc:{i:"MS",l:"Dr Milica Stević, infektolog"},
scenes:[
{title:"Ulazak",
docLine:"Petre, dobar dan. Vidim u kartonu da imate rezervu. Pre nego što o vakcini — kakvi su vam tipovi pitanja?",
prompt:"Šta osećaš?",
choices:[
{em:"Provokacija",in:"Da, hajde — kakvi tipovi?",imp:{sas:5,otv:10,dec:5},re:"«Kakvi tipovi? Dobro — koji su vaši izvori poverenja?» Lekarka se nasmeši. «Krenuli smo dobro.»"},
{em:"Otvoreno",in:"Pošto je pitala...",imp:{sas:15,otv:10,dec:10},re:"«Pitanja o epistemologiji preporuke», kažeš. Lekarka klima. «Drago mi je. Krenimo.»"},
{em:"Skepticizam",in:"Sumnjam u jednu stranu.",imp:{sas:5,dec:0},re:"Lekarka klima. «Pošteno. Idemo na to.»"},
{em:"Šaljivo",in:"Da budem iskren — došao sam da raspravljam.",imp:{sas:10,otv:5,dec:5},re:"Smeje se. «Hvala što ste to izgovorili. Sad mogu da budem iskrena.»"}]},
{title:"Šta postavljaš?",
docHigh:"Petre, drago mi je. Da budem iskrena — i ja se često pitam šta je «evidence-based». Mogu li sa vama u to?",
docLow:"Razumem. Moj posao je da budem informacioni resurs, ne autoritet. Šta raspravljamo prvo?",
prompt:"Šta tražiš?",
choices:[
{em:"Konkretno — Cochrane",in:"Koliko studija? Koja ograničenja?",imp:{sas:10,otv:20,dec:15},re:"«Cochrane 2018: 26 studija, 73.000 učesnica. Hoćete da pričamo o ograničenjima?»",unlock:"deep"},
{em:"Filozofski — definicije",in:"Ko odlučuje šta je 'studija' a šta 'anegdota'?",imp:{sas:10,otv:5,dec:5},re:"Lekarka se nasmeši. «Vau. Idemo. Mislim da razlika nije ontološka već metodološka...»"},
{em:"Lokalno — naša populacija",in:"Naši uslovi. Da li to važi i ovde?",imp:{otv:10,dec:5},re:"«Dobro pitanje. Ima i loših vesti — nemamo dovoljno balkanskih podataka. Idemo na to.»"},
{em:"Direktno — slabosti",in:"Pre vašeg argumenta — gde su slabosti?",imp:{sas:20,otv:10,dec:20},re:"Lekarka klima. «Pošteno. Tri slabosti — krenimo.»",unlock:"weak"}]},
{title:"Razgovor",
docVariants:{deep:"Cochrane: prosečno praćenje 6 godina. Nije dovoljno dugo za rak. Ali za preinvazivne lezije — značajno efikasno. To je dobar surrogate endpoint, ali surrogate. Otvaramo?",weak:"Slabosti? Tri: kratak follow-up za neke endpointe, sukob interesa u nekim studijama, malo balkanskih podataka. Sad vaš red — najjači kontra-argument?",high:"Hoću da iskreno odgovorim. Daj mi minut da otvorim podatke.",low:"Mogu da pokažem konkretne studije. Šta vas najviše interesuje?"},
prompt:"Kako reaguješ?",
choices:[
{em:"Iskreni rad",in:"Govori pošteno. Hajde da razmišljamo.",imp:{sas:5,otv:20,dec:15},re:"Naginješ se. Razgovor postaje stvaran. Ne dva govora — dva čoveka."},
{em:"Pažljivo slušaš",in:"Pišem ovo.",imp:{sas:15,otv:10,dec:10},re:"Vadiš telefon. Pišeš nešto. Lekarka klima. «Dobro. Imamo registar pitanja za sledeći put.»"},
{em:"Provera",in:"Da li sve to govori i SZO?",imp:{otv:5,dec:5},re:"«Idemo na taj nivo. Da, SZO ima drugačiju metodologiju...»"},
{em:"Razumevanje",in:"Možda sam tvrdio prebrzo.",imp:{sas:20,otv:10,dec:20},re:"Nešto se u tebi pomera. Iznenađuje te. Ne često se ti pomeraš u sredini razgovora."}]},
{title:"Odluka",
docLine:"Petre, posle 30 min — kako odlučujete?",
prompt:"Šta odlučuješ?",
choices:[
{em:"«Vakciniramo. Vi ste me ubedila — priznavanjem slabosti.»",in:"Časno argumentovanje me je ubedilo, ne marketing.",imp:{sas:5,otv:25,dec:35},end:"best",re:"Lekarka klima. «To je sve što tražim — informisan pristanak.»"},
{em:"«Pročitaću još. Vraćamo se za nedelju.»",in:"Treba mi vremena da pročitam.",imp:{sas:5,otv:20,dec:25},end:"delayed",re:"«Pošaljite mi pitanja kad ih budete imali. Ne morate čekati pregled.» Daje vam imejl."},
{em:"«Razgovaraću sa ženom. Pošaljem vam šta odlučimo.»",in:"Ovo nije moja odluka sama.",imp:{otv:10,dec:10},end:"mid",re:"Klima. «Naravno. Pošaljite mi.» Imejl na ivici kartice."},
{em:"«I dalje neću. Ali cenim razgovor.»",in:"Ne menjam mišljenje danas. Možda ikad.",imp:{otv:-5,dec:-25},end:"closed",re:"«Hvala što ste me čuli da razmišljam.» Iskrena reč. Rukovanje, ne formalno."}]}],
endings:{
best:{phone:"Šaljiv si poruku ženi sa parkinga: <em>«Idemo.»</em>",
opts:["Ona: «Pričaj kad dođeš.»","Olja te zove iz škole.","Pišeš email lekarki sa nedostajućim pitanjima.","Olja kasnije: «Tata, šta si radio?»"],
close:["U autobusu, gledaš studente koji ulaze.","Misliš na to da i ti, profesor, ponekad ne znaš dovoljno.","Da je tvoja sigurnost ponekad iluzija.","Da je dobar razgovor — onaj u kojem se obe strane menjaju.","Danas si ti, takođe, bio jedna od tih strana."]},
delayed:{phone:"U autobusu otvaraš PDF koji ti je poslala.",
opts:["Cochrane review. Pročitaćeš ga večeras.","Sa pivom. Sa olovkom.","Olja: «Tata, šta čitaš?» — «Posao.»","Pišeš joj imejl sa pitanjima."],
close:["Imejl kreće u 11 noći.","Ona odgovara u 7 ujutru.","To što sad postoji email iz medicinske ordinacije u tvom inboxu...","To je samo po sebi nešto novo.","Da je razgovor moguć."]},
mid:{phone:"Ženi: <em>«Bilo je drugačije od onog što sam očekivao.»</em>",
opts:["Ona: «I?»","«Mislim da treba da razmislimo.»","«Sutra pričamo.»","«Pošalji mi tvoja pitanja takođe.»"],
close:["Ona ne odgovara odmah.","Onda piše: «Hvala što si otvorio.»","Olja je u sobi.","Razgovor između vas dvoje će biti — drugačiji večeras.","Imate vremena. Niste obavezni. Imate informaciju. To je sve što ste hteli."]},
closed:{phone:"Šaljiv si ženi: <em>«Cenim razgovor. Ipak neću da je vakciniraju.»</em>",
opts:["Ona ne odgovara odmah.","Olja te pita uveče: «Tata, šta je HPV?»","Sedneš pored nje.","«Hajde da ti objasnim šta sam danas naučio.»"],
close:["I objasniš joj.","Iskreno. Sve. Pre vakcine. O vakcini. Šta lekar misli. Šta ti misliš.","Olja klima glavom kao da je odrasla.","Možda je. Možda nije još.","Ali si ti, danas, bio pošten prema procesu. Što je ono što si jutros izvio u glavi."]}
},
finalLine:"Hvala što si bio Petar ovih 10 minuta."},

/* ━━━━━━━ STUBS — active:0, prikazuju "Uskoro" ━━━━━━━ */
{id:"goran",active:0,name:"Goran",tag:"Sumnjam u multinacionalke",hook:"IT inženjer. Čita finansijske izveštaje. Žena ga je dovela jer su se posvađali."},
{id:"dragan",active:0,name:"Dragan",tag:"Šta nije pokvareno, ne popravljaj",hook:"Građevinski inženjer. «Sami smo zdravi, generacije pre nas su bile zdrave.»"},
{id:"tijana",active:0,name:"Tijana",tag:"Telo zna samo",hook:"Joga instruktorka. Organska hrana, prirodni porođaj. Vakcina = nepotrebno mešanje."},
{id:"maja",active:0,name:"Maja",tag:"Komšijska devojčica je imala reakciju",hook:"Videla je u Facebook grupi priče o teškim ishodima. Strah je konkretan i lice ima."}
];
