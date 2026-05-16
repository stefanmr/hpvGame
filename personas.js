/* ════════════════════════════════════════════════════
   personas.js — sadržaj za Igru 02 (Roditelj / Parent)

   Ovaj fajl je jedino mesto gde se edituju persone.
   engine.js i styles.css ne treba dirati.
   ════════════════════════════════════════════════════ */

const PERSONAS=[

/* ━━━━━━━ MARIJA ━━━━━━━ */
{id:"marija",active:1,name:"Marija",
tag:"Posle COVID-a više ne verujem sistemu",
hook:"Pre dve godine joj je tetka umrla. Sada pedijatrica preporučuje vakcinu za ćerku — bez pitanja.",
intro:["Imaš 38 godina. Lana ima 14.","Pre dve godine ti je preminula tetka — zbog propuštenog skrininga za rak grlića materice. Lekari su stalno odlagali pregled, a devet meseci kasnije je više nije bilo.","Od tada ne veruješ sistemu koji nastupa sa stavom: <em>«Mi znamo najbolje»</em>.","Lanina pedijatrica je preporučila HPV vakcinu. Nije te ništa pitala — samo je presekla: <em>Treba</em>.","Potražila si drugo mišljenje. Sediš u čekaonici novog pedijatra. Stomak ti se grči."],
start:{anks:75,sas:5,otv:15,dec:20},
doc:{i:"MJ",l:"Dr Marija Janković, pedijatrica"},
scenes:[
{title:"Ulazak",
docLine:"Marija, dobar dan. Hvala što ste došli. Sela bih sa vama da popričamo o Lani. Vidim u kartonu da imate otpor prema HPV vakcini. Mogu li prvo da vas pitam — šta vas u vezi sa tim najviše brine?",
prompt:"Šta osećaš dok je slušaš?",
choices:[
{em:"Olakšanje",in:"Pita me za mišljenje, ne naređuje. Ovo je drugačije.",imp:{anks:-10,sas:15,dec:5},re:"Spuštaš ramena za milimetar. Nešto u tebi je čeznulo upravo za takvim pristupom."},
{em:"Oprez",in:"Lepo počinje. Ali brzo će ona preći na to da se 'mora'.",imp:{anks:5,otv:-5,dec:-5},re:"Oklevaš sa odgovorom. Lepe reči ne znače ništa dok se ne pokažu na delu."},
{em:"Sumnja",in:"Zna ona kako da me smekša. Prvo glumi empatiju, pa onda udari.",imp:{anks:10,sas:-5,otv:-10,dec:-10},re:"Prekrštaš ruke na grudima. Defanzivni stav je nužan — već si jednom prošla kroz to."},
{em:"Iznenađenje",in:"Niko me do sada nije ovo pitao.",imp:{anks:-5,sas:20,otv:5,dec:10},re:"Pogledaš je pažljivije. Stvarno želi da čuje tvoj odgovor. Nakon pet različitih ordinacija, ovo je prvi put."}]},
{title:"Šta deliš?",
docHigh:"Vidim da vam je teško. Ne moramo da žurimo. Šta je za vas najvažnije da znam pre nego što uopšte počnemo razgovor o vakcini?",
docLow:"Razumem. Pokušaću da budem što konkretnija. Šta vas tačno brine, koje su prve stvari koje vam padaju na pamet?",
prompt:"Šta joj sada kažeš?",
choices:[
{em:"Ličnu priču — o tetki",in:"Možda bi trebalo da zna zašto sam ovoliko skeptična.",imp:{anks:-10,sas:25,otv:15,dec:15},re:"Reči izleću pre nego što si stigla da razmisliš. Pričaš joj o tetki. O odlaganju lekarskih pregleda. O tih devet meseci... Doktorka te ne prekida.",unlock:"shared"},
{em:"Direktno pitanje — o izvoru",in:"Pre svega, želim da znam ko zapravo stoji iza ove preporuke?",imp:{sas:5,otv:5,dec:5},re:"Postavljaš pitanje hladno, ali odmereno. Doktorka klima glavom i kaže: «To je potpuno legitimno pitanje»."},
{em:"Praktična pitanja — o nuspojavama",in:"Želim čiste činjenice i zvanične podatke.",imp:{sas:5,otv:-5,dec:0},re:"Povlačiš se u tehničke detalje. Tako se osećaš sigurnije. Lekarka prihvata tvoj tempo."},
{em:"Vrednosni stav — odbrambeno",in:"Ja sam Lanina majka. Zašto baš ja moram da snosim toliki teret odluke?",imp:{anks:5,sas:10,dec:-5},re:"Glas ti zvuči oštrije nego što si planirala. Lekarka pravi kratku pauzu i mirno se slaže sa tobom."}]},
{title:"Reakcija lekarke",
docVariants:{shared:"Marija, zaista mi je žao. To je užasan gubitak. Potpuno mi je jasno zašto vam je teško da verujete autoritetima kada vam kažu da nešto «treba». Mogu li da vas pitam — šta vam je tetka govorila u tim poslednjim mesecima?",high:"Razumem vas. Pre nego što nastavimo — ova vakcina nije obavezna. Vi odlučujete o svemu, a ne ja ili država. Šta bih mogla detaljnije da vam objasnim?",low:"Razumem. Pokušaću da vam pružim korisne informacije, ako mi dozvolite. HPV vakcina kod nas nije obavezna. Šta vas u ovom trenutku najviše zanima?"},
prompt:"Kako reaguješ na njene reči?",
choices:[
{em:"Potiskuješ suze",in:"Niko me godinama nije pitao kako sam ja.",imp:{anks:-20,sas:25,otv:10,dec:20},re:"Brzo trepćeš da ti suza ne bi skliznula niz lice. Prvi put posle mnogo godina osećaš da te neko zaista vidi i čuje.",req:"shared"},
{em:"Spuštaš gard",in:"Možda ovoj ženi ipak mogu malo da verujem.",imp:{anks:-15,sas:10,otv:5,dec:15},re:"Tvoje skrštene ruke se polako opuštaju. Sedaš malo udobnije, a da to nisi ni osvestila."},
{em:"Tražiš još informacija",in:"Želim da čujem šta još ima da kaže.",imp:{anks:-5,sas:5,otv:15,dec:10},re:"Naginješ se napred. Pitanja koja su ti danima tutnjala po glavi sada izlaze jedno za drugim — a ona odgovara, smireno i strpljivo."},
{em:"I dalje si skeptična",in:"Lepe reči, ali zašto me baš sada ubeđuje?",imp:{anks:5,otv:-10,dec:-15},re:"Slušaš je sa pola pažnje. Sve su to lepe reči, ali odluka je i dalje preteška."}]},
{title:"Odluka",
docLine:"Marija, dale smo sebi dovoljno vremena za razgovor. Kako se sada osećate kada razmišljate o odluci?",
prompt:"Šta na kraju odlučuješ?",
choices:[
{em:"«Vraćamo se u petak, zajedno sa Lanom.»",in:"Želim da i ona čuje sve ovo. Hoću da odlučimo zajedno.",imp:{anks:-10,sas:10,otv:30,dec:30},end:"best",re:"Rečenica «dovodiću i Lanu» izlazi prirodno iz tebe. Lekarka se osmehuje i klima glavom: «Odlično, zabeležiću termin.» Iz ordinacije izlaziš sa potpuno drugačijim osećajem."},
{em:"«Vakcinisaću je danas.»",in:"Kad sam već ovde, hajde da završimo sa tim.",imp:{anks:-5,sas:5,otv:25,dec:40},end:"rushed",re:"Izgovaraš to pre nego što si zapravo dobro promislila. Telefon ti zvoni čim si zakoračila na hodnik — Lana te zove."},
{em:"«Moram prvo da razgovaram sa mužem.»",in:"Treba mi još nekoliko dana da saberem utiske.",imp:{sas:5,otv:10,dec:10},end:"delayed",re:"Pakuješ informativne brošure u torbu. Tvoje «Hvala» upućeno lekarki zvuči mnogo iskrenije nego što si očekivala."},
{em:"«Cenim vaš trud, ali neću danas.»",in:"Ne. Ne mogu to da uradim danas.",imp:{otv:-10,dec:-30},end:"closed",re:"Glas ti je miran i staložen. Lekarka ne pokušava da te ubedi u suprotno. Samo klima glavom: «Moja vrata su vam uvek otvorena», kaže. I veruješ joj."}]}],
endings:{
best:{phone:"Lana te zove čim si sela u auto: <em>«Mama, jesi li završila? Šta je rekla doktorka?»</em>",
opts:["«U petak idemo ponovo, ali zajedno. Hoću da i ti čuješ sve.»","«Doktorka je skroz drugačija. Ispričaću ti sve večeras.»","«Dobro je, mila. Pričaćemo kad stignem kući.»","«Spremaj se polako za petak, idemo zajedno.»"],
close:["Dok voziš prema kući, razmišljaš o tetki.","Ne o vakcini, nego o njoj.","O tome kako ti je rekla samo mesec dana pre nego što je otišla: <em>«E, da sam ranije znala... Da sam samo pitala na vreme.»</em>","Možda ćeš večeras ispričati Lani sve. Možda nećeš reći ništa.","Ali danas si naučila nešto što jutros nisi imala u svojim rukama."]},
rushed:{phone:"Lana te zove na mobilni baš u trenutku kada sestra priprema špric.",
opts:["«Mama je u ordinaciji. Čujemo se malo kasnije.»","«Moram da završim nešto, ispričaću ti sve sutra.»","«Sve je u redu, dušo. Pričaćemo večeras.»","«Dobro sam, javiću ti se posle.»"],
close:["Možda je trebalo da sačekaš.","A možda i nije. Možda je ova odluka zapravo doneta još pre dve godine, u onom trenutku kada si izgubila tetku.","Vraćaš se kući. Ne osećaš se ni dobro ni loše. Samo imaš neku čudnu prazninu, kao da si preskočila važan korak.","Možda večeras nećeš imati snage da pričaš sa Lanom o ovome. A možda joj kažeš baš sve."]},
delayed:{phone:"Lana te zove: <em>«Mama, jesi li gotova? Šta radimo sad?»</em>",
opts:["«Razgovaraćemo večeras sa tatom, pa ćemo odlučiti svi zajedno.»","«Treba mi još malo vremena. Pričaćemo kod kuće.»","«Sutra ćemo o tome, kada svi budemo mirni.»","«Mama još uvek razmišlja. Čujemo se posle.»"],
close:["Dok stojiš na semaforu, otvaraš torbu i gledaš unutra.","Materijali su tu. Brošure, brojevi telefona, sajtovi. Na ivici papira vidi se uredan lekarkin rukopis.","Možda ćeš ih pročitati još večeras. Možda ćeš ih ostaviti u fioci da skupljaju prašinu.","Ali nešto se danas u tebi prelomilo. Još ne znaš u kom pravcu.","Ali proces je počeo."]},
closed:{phone:"Lana te zove: <em>«Mama, kako je bilo na pregledu?»</em>",
opts:["«Doktorka je sasvim korektna. Pričaćemo večeras.»","«Dobro je bilo. Kako je tebi danas u školi?»","«Sve je u redu. Ne mogu sada da pričam, vozim.»","«Hvala što pitaš, zlato. Mama te voli.»"],
close:["Dok voziš nazad, uopšte ne razmišljaš o vakcini.","Misliš o Lani. O tome kako je preplašeno sedela na klupi prvog dana škole, uvlačeći glavu među ramena.","Ona je tvoja ćerka. Tvoja i ničija više.","Možda ćeš se za godinu dana vratiti u ovu ordinaciju. Možda se nećeš vratiti nikada.","Ali doktorka je rekla da su vrata otvorena. I zaista joj veruješ."]}
},
finalLine:"Hvala što si proživela Marijinu priču ovih 10 minuta."},

/* ━━━━━━━ JELENA ━━━━━━━ */
{id:"jelena",active:1,name:"Jelena",
tag:"Već sedam godina čitam deklaracije na svemu",
hook:"Sin sa alergijskom astmom. Vakcinu za ćerku gleda kroz prizmu jednog složenog deteta.",
intro:["Imaš 35 godina i dvoje dece: Milu od 13 i Lazara od 7 godina.","Lazar boluje od alergijske astme. Već sedam godina vodiš lavovsku borbu da otkriješ šta mu sve smeta i izaziva napade.","Postala si ekspert za deklaracije i sastojke. <em>Bez aditiva, bez veštačkih boja, bez kompromisa.</em>","Sada je na redu HPV vakcina za Milu. Čula si reči: aluminijum, adjuvansi.","Ne želiš da uneseš u telo svoje zdrave ćerke nešto što ne razumeš do detalja."],
start:{anks:80,sas:10,otv:20,dec:25},
doc:{i:"VL",l:"Dr Vesna Lazarević, lekarka opšte medicine"},
scenes:[
{title:"Ulazak",
docLine:"Jelena, dobar dan. Vidim da Mila uskoro treba da primi HPV vakcinu. Ali pre nego što pređemo na to — kako ste vi? Znam iz kartona da kod kuće imate velike zdravstvene izazove sa mlađim detetom.",
prompt:"Šta osećaš u tom trenutku?",
choices:[
{em:"Iznenađenje",in:"Ova žena pita kako sam ja, a ne forsira odmah priču o vakcinaciji.",imp:{anks:-10,sas:20,otv:5,dec:10},re:"U krilu grčevito držiš fasciklu sa sedmogodišnjom istorijom Lazarovih bolesti. Konačno te neko pita kako se <em>ti</em> nosiš sa tim."},
{em:"Oprez",in:"Samo pokušava da me odobrovolji pre nego što mi ponudi iglu.",imp:{anks:5,otv:-5,dec:-5},re:"Slušaš je sa maksimalnim oprezom. Lepe reči su često samo prva faza ubeđivanja."},
{em:"Iritacija",in:"Jasno, koristi Lazara kao psihološki trik da bi mi lakše 'prodala' vakcinu za Milu.",imp:{anks:10,sas:-5,otv:-10,dec:-10},re:"Snažnije stežeš torbu. Lazar i njegova bolest nisu povod za jeftine razgovore."},
{em:"Otvaranje",in:"Možda bih zaista mogla da joj kažem... Možda me ona stvarno razume.",imp:{anks:-15,sas:15,otv:10,dec:15},re:"Polako spuštaš fasciklu na sto. «Sedam godina borbe...», izgovaraš tiho, a lekarka samo saosećajno klima glavom."}]},
{title:"Šta tražiš?",
docHigh:"Jelena, hvala vam na iskrenosti. Pre nego što pređemo na HPV vakcinu, želim da znate jednu stvar: sva vaša pitanja su potpuno opravdana. Moj cilj nije da vam po svaku cenu 'prodam' vakcinu, već da otvoreno razgovaramo. Šta vas najviše brine?",
docLow:"Razumem da ste zabrinuti. Šta vam je u ovom trenutku najvažnije da saznate o HPV vakcini?",
prompt:"Koje pitanje postavljaš lekarki?",
choices:[
{em:"Kompletna lista sastojaka",in:"Moram tačno da znam šta ulazi u organizam mog deteta.",imp:{sas:5,otv:10,dec:5},re:"Lekarka odmah okreće monitor prema tebi. «Hajde da pogledamo sastav zajedno, stavku po stavku.»"},
{em:"Strah od alergijske reakcije",in:"Plašim se da Mila ne prođe kroz pakao kao Lazar.",imp:{anks:-15,sas:25,otv:15,dec:15},re:"Reči jedva prelaze preko tvojih usana. Lekarka te pažljivo sluša i ne prekida te. «Recite mi, čega se tačno najviše plašite?», pita te blago.",unlock:"shared"},
{em:"Sadržaj aluminijuma",in:"Čitala sam mnogo o aluminijumu u vakcinama i to mi stvara ogroman nemir.",imp:{sas:5,otv:5,dec:5},re:"«Razumem vaš strah, i sama sam dosta čitala o tim sumnjama. Pričaćemo o tome, ali pre nego što pređemo na brojke...»"},
{em:"Odlaganje odluke",in:"Možemo li jednostavno da sačekamo? Mila je još mlada, ima vremena.",imp:{anks:5,sas:5,dec:-5},re:"To pitanje ti deluje sigurnije nego direktno odbijanje. Lekarka bez problema prihvata tvoj predlog."}]},
{title:"Razgovor o Lazaru",
docVariants:{shared:"Jelena, hvala vam što ste to podelili sa mnom. Mogu li da vas pitam kakvu je tačno reakciju Lazar imao na početku i koliko vam je truda trebalo da locirate uzročnik?",high:"Količina aluminijuma u vakcinama je u tragovima — zapravo, beba unese više aluminijuma kroz majčino mleko tokom prvih šest meseci života. Ali znam da vam te brojke sada ne znače mnogo. Vama je ključno pitanje: može li Mila da prođe loše kao Lazar?",low:"Razumem vašu zabrinutost oko sastojaka. Aluminijum je tu prisutan samo u tragovima. Ako želite, mogu vam pokazati zvanične toksikološke grafikone."},
prompt:"Kako reaguješ na njene reči?",
choices:[
{em:"Emotivni slom i suze",in:"Sedam godina sam potpuno sama u ovoj borbi. I sada me konačno neko pita kako mi je.",imp:{anks:-25,sas:25,otv:15,dec:20},re:"Suza ti nehotice pada pravo na fasciklu u krilu. Lekarka ti bez reči pruža maramicu. Ne forsira te da pričaš, samo čeka.",req:"shared"},
{em:"Pažljivo slušaš objašnjenje",in:"Možda bih ipak mogla da pokušam da razumem naučnu stranu.",imp:{anks:-10,sas:10,otv:15,dec:15},re:"Naginješ se bliže stolu. Lekarka počinje da govori jezikom koji ti je blizak — kroz sastojke, precizne doze i hemijske veze."},
{em:"Izražavaš skepticizam",in:"Majčino mleko i aluminijum u špricu ne mogu da se porede.",imp:{anks:5,otv:-5,dec:-5},re:"«Aluminijum je ipak teški metal», kažeš odsečno. Lekarka klima glavom: «Apsolutno. Želite li da analiziramo proces njegove resorpcije i izlučivanja iz organizma?»"},
{em:"Zadržavaš distancu",in:"Lepo ona govori, ali meni i dalje treba vreme da sve ovo svarim.",imp:{otv:5,dec:0},re:"Slušaš svaku njenu reč, ali ne dopuštaš da ti se približi. Logički sve razumeš, ali onih sedam godina opreza te i dalje koči."}]},
{title:"Odluka",
docLine:"Jelena, o čemu trenutno razmišljate?",
prompt:"Šta na kraju odlučuješ?",
choices:[
{em:"«Vakcinisaćemo je. Hvala vam.»",in:"Hvala vam što ste me saslušali kao čoveka. Spremne smo za ovo.",imp:{anks:-5,sas:15,otv:25,dec:40},end:"best",re:"Izgovaraš to čvrsto i odlučno. Lekarka ti uzvraća toplim osmehom: «Drago mi je zbog vaše odluke. Možemo zakazati termin već za sledeću nedelju.»"},
{em:"«Razmisliću još nedelju dana.»",in:"Moram još jednom sama da prođem kroz sve ove informacije.",imp:{sas:10,otv:20,dec:20},end:"delayed",re:"Lekarka ti pruža stručne brošure i svoj službeni kontakt. «Slobodno me okrenite ako se pojavi bilo kakva nova sumnja.» Osećaš olakšanje."},
{em:"«Možda ćemo to uraditi kasnije.»",in:"Ne želim danas. Možda za nekoliko meseci, kada budem spremnija.",imp:{sas:5,otv:5,dec:0},end:"pending",re:"Lekarka ne vrši nikakav pritisak na tebe. Samo blago klima glavom: «Potpuno vas razumem. Mila je mlada, imamo vremena.»"},
{em:"«Hvala vam, ali ipak neću danas.»",in:"Jednostavno ne mogu da prelomim. Možda nikada neću ni moći.",imp:{otv:-10,dec:-30},end:"closed",re:"«U redu, Jelena. Moja vrata su vam uvek otvorena ako poželite ponovo da porazgovaramo.»"}]}],
endings:{
best:{phone:"Mila te pita čim sednete u auto: <em>«Mama, i šta smo se dogovorile?»</em>",
opts:["«Spremi se, idemo sledeće nedelje na vakcinaciju.»","«Iskaži mi svoje mišljenje večeras, pa ćemo sesti da popričamo.»","«Mama je dobro, sve je u redu. Pričaćemo kod kuće.»","«Bilo je mnogo prijatnije nego što sam očekivala.»"],
close:["Dok voziš prema kući, atmosfera u kolima ti deluje nekako lakša.","U torbi su i dalje Lazarevi inhalatori, u glavi ti odzvanjaju deklaracije... Sedam godina neprekidnog opreza.","Ali shvataš da nije svaki strah nužno tvoj neprijatelj.","I da nije svaka vakcina pretnja za porodicu.","Danas si otkrila prostor između slepog odbijanja i slepog slušanja autoriteta."]},
delayed:{phone:"Na samom izlasku iz ordinacije, lekarka ti pruža papirić sa brojem telefona: <em>«Pozovite me čim se pojavi neko novo pitanje.»</em>",
opts:["«Hvala vam puno. Sigurno ću vas kontaktirati.»","«Ozbiljno ću razmisliti o svemu što ste mi rekli.»","«Prvo ću se posavetovati i sa Lazarevim pedijatrom.»","«Mila i ja ćemo večeras sesti i otvoreno popričati.»"],
close:["Dok se voziš kući, svesna si da odluka još nije doneta.","Ali onaj teški oklop sumnje u tvojoj glavi danas je ipak malo popustio.","Materijali su bezbedno smešteni u torbi. Možda ćeš ih detaljno prostudirati već večeras, a možda tek za nekoliko dana.","Najvažnije je da se nešto u tebi konačno pokrenulo."]},
pending:{phone:"Mila te zabrinuto posmatra na suvozačevom sedištu: <em>«Mama, jesi li dobro?»</em>",
opts:["«Jesam, zlato, sve je u redu.»","«Samo duboko razmišljam o nekim stvarima.»","«Hajde da večeras zajedno napravimo palačinke, šta kažeš?»","«Sve je u redu, mama te mnogo voli.»"],
close:["«Dobro sam», odgovaraš joj sa blagim osmehom.","I stvarno se osećaš mirnije nego što si mislila da je moguće.","Možda ćeš se vratiti u ovu ordinaciju za pola godine, možda za godinu dana, a možda nikada.","Ali najvažnije je da ovo više nije ona mučna čekaonica iz koje izlaziš besna i uplašena."]},
closed:{phone:"Dok voziš prema kući, zoveš muža da proveriš kako je Lazar. On ti prepričava njegove školske dogodovštine.",
opts:["«Pričaj mi slobodno, slušam te pažljivo.»","«Lazar je naš veliki dečko, ponosna sam na njega.»","«Čim stignem, spremam vam omiljenu večeru.»","«Sve me ovo strašno opterećuje, ali proći će.»"],
close:["Razgovor sa lekarkom ti polako bledi u pozadini misli.","Možda ćeš za godinu dana ponovo razmisliti o svemu, a možda se ovom pitanju više nikada nećeš vratiti.","Tvoja deca su tvoj ceo svet. Svaka odluka koju doneseš je vođena isključivo ljubavlju prema njima.","Lekarka je rekla da su joj vrata uvek otvorena. Bar znaš da te tamo niko ne osuđuje."]}
},
finalLine:"Hvala što si proživela Jeleninu priču ovih 10 minuta."},

/* ━━━━━━━ SANJA ━━━━━━━ */
{id:"sanja",active:1,name:"Sanja",
tag:"Iva je još uvek dete — to u ovim godinama nije tema",
hook:"Tradicionalna porodica. Vakcina protiv «polno prenosive bolesti» u 12. godini deluje kao pogrešan signal.",
intro:["Imaš 40 godina. Iva ima 12, a Stefan 15 godina.","Tvoja porodica duboko drži do tradicionalnih vrednosti. Vera, zajednica i jasno postavljene moralne granice su vam temelj.","Stefan je tvoj prvenac — sa njim si već pokrenula prve, ozbiljne razgovore o zrelosti i odnosima.","Ali Iva je još uvek devojčica koja raste. Kada je pedijatar pomenuo <em>«HPV vakcinu»</em>, ti si čula samo jedno: vakcina protiv polno prenosive bolesti.","Iva ima samo 12 godina. Smatraš da to u njenom uzrastu nikako ne bi trebalo da bude tema."],
start:{anks:60,sas:5,otv:20,dec:20},
doc:{i:"AP",l:"Dr Aleksandar Petrović, pedijatar"},
scenes:[
{title:"Ulazak",
docLine:"Sanja, dobar dan. Vidim u kartonu da imate ozbiljne rezerve u vezi sa HPV vakcinom za Ivu. Pre nego što vam predstavim bilo kakve medicinske činjenice — želeo bih da čujem šta vas najviše brine?",
prompt:"Šta osećaš dok stojiš pred njim?",
choices:[
{em:"Spremnost na razgovor",in:"Iva je još uvek dete. Imam potpuno legitimno pravo da to kažem.",imp:{sas:15,dec:5},re:"«Iva ima samo 12 godina», kažeš mu smireno. «Smatram da je prerano za vakcinu protiv takvih bolesti.» Doktor pažljivo klima glavom i sluša te."},
{em:"Oprez",in:"Sada će sigurno pokušati da me ubedi nekim stručnim argumentima.",imp:{anks:5,dec:-5},re:"Čekaš ono čuveno «ali» koje uvek usledi nakon što te lekari saslušaju."},
{em:"Direktno isticanje vrednosti",in:"Mi smo religiozna porodica. Živimo po jasnim moralnim principima.",imp:{sas:10,dec:0},re:"Izgovaraš to potpuno mirno, bez ikakvog osećaja nelagode. Doktor ne menja izraz lica, već te posmatra sa poštovanjem."},
{em:"Zabrinutost zbog poruke",in:"Plašim se da joj ova vakcina šalje potpuno pogrešan signal.",imp:{sas:10,otv:5,dec:5},re:"«To što ste pomenuli — pogrešan signal... Možete li mi malo detaljnije objasniti kako to vidite?», pita te doktor sasvim blago."}]},
{title:"Šta deliš?",
docHigh:"Razumem vas. Pre nego što pređemo na samu HPV vakcinu — želim da znate da sam i sam roditelj. Šta tačno podrazumevate pod tim «pogrešnim signalom»? Želeo bih to dobro da razumem.",
docLow:"Razumem da vam je izuzetno važno kakve poruke šaljete svojoj deci. Šta vas u vezi sa tim najviše plaši?",
prompt:"Šta odlučuješ da podeliš sa njim?",
choices:[
{em:"Tradiciju i vaspitanje",in:"Učimo našu decu da se intimnost čuva za brak.",imp:{sas:20,otv:-5,dec:-5},re:"«Hvala vam što ste to podelili sa mnom. Mogu li da vam pokažem podatak koji je i mene lično iznenadio?», pita doktor pažljivo.",unlock:"family"},
{em:"Strah od promene ponašanja",in:"Bojim se da time nesvesno podstičemo rano stupanje u odnose.",imp:{sas:15,dec:5},re:"Doktor klima glavom. «To je potpuno prirodna roditeljska briga. Mogu li da vam pokažem šta kažu velika istraživanja baš na tu temu?»"},
{em:"Direktan stav",in:"Jednostavno smatram da to moralno nije ispravno za našu porodicu.",imp:{sas:5,dec:-5},re:"Doktor ne vrši nikakav pritisak. «U redu. Šta bi po vašem mišljenju promenilo pravac ovog našeg razgovora?»"},
{em:"Konkretno pitanje",in:"Da li je istina da vakcinisana deca ranije stupaju u seksualne odnose?",imp:{otv:10,dec:15},re:"«Odlično pitanje. Postoje veoma ozbiljne studije koje su pratile na hiljade devojčica...»"}]},
{title:"Reakcija",
docVariants:{family:"Sanja, hvala vam na iskrenosti. Reći ću vam nešto sasvim lično — moja supruga i ja smo prolazili kroz iste unutrašnje dileme kada je naša ćerka bila u tim godinama. Ako mi dozvolite, pokazao bih vam šta me je potpuno razuverilo kada sam detaljno istraživao ovu temu.",high:"Zvanične studije koje su pratile hiljade vakcinisanih i nevakcinisanih devojčica pokazuju da vakcinisana deca <em>ne</em> stupaju rano u odnose, niti imaju više partnera. Devojčice ovu vakcinu doživljavaju isključivo kao zdravstvenu zaštitu — baš kao i svaku drugu vakcinu protiv gripa ili tetanusa.",low:"Zvanični podaci pokazuju da devojčice ovu intervenciju doživljavaju isključivo kao preventivnu zdravstvenu meru, a ne kao nekakvu 'zelenu kartu' za promenu ponašanja."},
prompt:"Kako reaguješ na njegovo izlaganje?",
choices:[
{em:"Pažljivo pratiš argumente",in:"Izgovorio je nešto što uopšte nisam očekivala.",imp:{otv:20,dec:20},re:"Sada sediš drugačije. Ne više kao roditelj koji je u stalnoj defanzivi, već kao majka koja zaista sluša."},
{em:"Pokazuješ skepticizam",in:"Ko stoji iza tih studija? Da li ih finansira farmaceutska industrija?",imp:{otv:0,dec:0},re:"«Potpuno legitimno pitanje», odgovara doktor. «Mogu vam poslati direktne linkove za Cochrane bazu — to su nezavisne analize, bez ikakvog industrijskog uticaja.»"},
{em:"Prihvataš ljudski pristup",in:"Pominje svoju porodicu i svoju ćerku. Vidim da je iskren.",imp:{sas:20,otv:5,dec:15},re:"Osećaš kako ti se unutrašnji grč smanjuje. Činjenica da je i on roditelj koji deli tvoje brige menja sve.",req:"family"},
{em:"Ostaješ pri svojim stavovima",in:"Bez obzira na sve studije, ovo jednostavno nije pravi put za naše dete.",imp:{anks:5,otv:-5,dec:-15},re:"Tvoji principi ostaju čvrsti. Doktor to prepoznaje i ne pokušava da te natera na promenu mišljenja."}]},
{title:"Odluka",
docLine:"Sanja, nakon svega o čemu smo pričali, šta vam sada prolazi kroz glavu?",
prompt:"Šta na kraju odlučuješ?",
choices:[
{em:"«Porazgovaraću sa mužem. Možda na proleće.»",in:"Želim da i Iva polako bude uključena u ovaj proces.",imp:{sas:10,otv:25,dec:25},end:"best",re:"Izgovaraš to potpuno mirnim glasom. Plan postoji i to ti prija. Doktor klima glavom sa odobravanjem: «Potpuno vas razumem. Moja vrata su vam uvek otvorena.»"},
{em:"«Moram veoma pažljivo da razmislim o svemu.»",in:"Treba mi vremena da se sve ove informacije slegnu.",imp:{sas:5,otv:15,dec:15},end:"mid",re:"Doktor ti pruža odštampane materijale. Vidi se da to nisu obični reklamni flajeri, već pažljivo odabrani tekstovi napisani sa poštovanjem prema roditeljima."},
{em:"«Pristajem sada, kad smo već tu u ordinaciji.»",in:"Ovaj razgovor me je zaista pomerio sa početne tačke.",imp:{otv:20,dec:35},end:"rushed",re:"Odluka je brza, možda čak i prebrza. Sestra uvodi Ivu u ordinaciju. Doktor te još jednom tiho pita da li si potpuno sigurna."},
{em:"«Hvala vam na razgovoru, ali nećemo u ovim godinama.»",in:"Možda ćemo razmisliti ponovo kada bude starija.",imp:{otv:-5,dec:-25},end:"closed",re:"«U redu, Sanja. Poštujem vaš stav. Ako se bilo šta promeni ili budete imale dodatnih pitanja, tu sam.»"}]}],
endings:{
best:{phone:"Iva te pita čim sednete u auto: <em>«Mama, jesi li ti na kraju za ili protiv te vakcine?»</em>",
opts:["«Prvo ćemo sesti da otvoreno razgovaramo sa tatom.»","«Ispričaću ti sve detaljno večeras, uz večeru.»","«Hajde sada da ostavimo to po strani, reci mi kako je prošao kontrolni?»","«Razgovaraću sa tobom čim stignemo kući i sednemo na miru.»"],
close:["Dok se vozite kući, uopšte ne pominjete vakcinaciju.","Pričate o kontrolnom iz matematike, o njenoj drugarici iz klupe, o Stefanovom treningu...","Ali u pozadini tog razgovora osećaš duboki mir: ona je i dalje tvoja devojčica.","A odluka ostaje isključivo tvoja.","Možda na proleće. Možda kada sednete za trpezarijski sto u krugu porodice."]},
rushed:{phone:"Iva sedi pored tebe u kolima i drži ruku na mestu uboda.",
opts:["«Jel boli puno, zlato?»","«Ne brini, mama je tu pored tebe.»","«Hajde da svratimo do poslastičarnice na kolače, zaslužila si.»","«Znam da ti je neprijatno, ali mama te mnogo voli.»"],
close:["U kolima vlada tišina, slušate radio.","Možda ti je trebalo više vremena da sve analiziraš.","A možda je ovaj razgovor sa doktorom zapravo bio sve što ti je nedostajalo proteklih godinu dana da prelomiš.","Iva ti se u tom trenutku toplo osmehuje kroz retrovizor."]},
mid:{phone:"Uveče u kuhinji, dok kuvaš čaj, širiš doktorove materijale po stolu.",
opts:["Stefan ulazi u kuhinju: «Šta je to, mama?» — «Nešto za Ivu, razmišljam o nekim stvarima.»","«Pokazaću ovo tati kada dođe s posla.»","«Posavetovaću se sa našim sveštenikom u nedelju.»","«Sutra ću okrenuti doktora da mu javim šta sam odlučila.»"],
close:["Stefan samo klima glavom. Sa njim je u petnaestoj godini ipak lakše razgovarati nego sa Ivom.","Tema je pokrenuta i više nije tabu. Možda bude 'da', možda 'ne', a možda jednostavno sačekate još malo.","Najvažnije je da se u vašoj kući o tome sada priča otvoreno i bez straha."]},
closed:{phone:"Iva veselo dotrčava do auta: <em>«Mama, gde idemo sad?»</em>",
opts:["«Idemo pravo kući, dušo.»","«Hoćeš li da popodne zajedno napravimo tvoj omiljeni kolač?»","«Hajde da prvo sednemo malo u park da uživamo u suncu.»","«Pričaćemo o svemu malo kasnije.»"],
close:["Dok voziš prema kući, ne osećaš krivicu. Ali ne osećaš ni olakšanje.","Doneta odluka je tvoje legitimno pravo kao majke. To je nešto što ti niko ne može oduzeti ili osporiti.","Doktor je bio pun poštovanja i rekao je da su vrata uvek otvorena. Veruješ mu.","Tvoja ćerka je samo tvoja i ti najbolje znaš kako da je zaštitiš."]}
},
finalLine:"Hvala što si proživela Sanjinu priču ovih 10 minuta."},

/* ━━━━━━━ PETAR ━━━━━━━ */
{id:"petar",active:1,name:"Petar",
tag:"Želim argumentovanu raspravu, ne slepo prihvatanje autoriteta",
hook:"Doktorant filozofije nauke. Skeptičan prema autoritetu — ali pošten prema procesu.",
intro:["Imaš 39 godina i doktorant si u oblasti filozofije nauke. Tvoja ćerka Olja ima 11 godina.","Provodiš dane analizirajući kako se stvara naučno znanje i ko zapravo ima moć da odlučuje šta je «naučna činjenica».","Ne, ti nisi nekakav zatucani antivakser. Pročitao si brdo literature — i to ne samo zvanične brošure iz čekaonica.","Oljanina pedijatrica snažno preporučuje HPV vakcinu. Tvoja supruga se potpuno slaže sa njom.","Ali ti želiš duboko da promisliš. Želiš debatu. Želiš da budeš maksimalno pošten prema samom naučnom procesu."],
start:{anks:40,sas:15,otv:35,dec:35},
doc:{i:"MS",l:"Dr Milica Stević, infektološkinja"},
scenes:[
{title:"Ulazak",
docLine:"Petre, dobar dan. Vidim u kartonu da imate određene rezerve. Pre nego što pređemo na samu vakcinu — možete li mi reći iz kog ugla dolaze vaša ključna pitanja?",
prompt:"Šta osećaš dok sediš preko puta nje?",
choices:[
{em:"Spreman na intelektualni izazov",in:"Odlično, hajde da vidimo iz kog ugla. Koji su vaši kriterijumi za poverenje u podatke?",imp:{sas:5,otv:10,dec:5},re:"«Iz kog ugla? Dobro — zanima me na čemu zasnivate stopostotno poverenje u izvore?», pitaš. Lekarka se blago osmehuje: «Odlično, krenuli smo sa pravim pitanjima.»"},
{em:"Otvorenost za dijalog",in:"Pošto me već otvoreno pita, odgovoriću joj bez rukavica.",imp:{sas:15,otv:10,dec:10},re:"«Zanimaju me epistemološki okviri same preporuke», kažeš direktno. Lekarka klima glavom: «Izuzetno mi je drago. Hajde da raščlanimo to.»"},
{em:"Skepticizam prema jednostranosti",in:"Sumnjam da ćete mi prikazati obe strane medalje.",imp:{sas:5,dec:0},re:"Lekarka te smireno posmatra: «Potpuno legitimna sumnja. Idemo odmah na suštinu.»"},
{em:"Intelektualni humor",in:"Da budem potpuno iskren — došao sam spreman za ozbiljnu akademsku debatu.",imp:{sas:10,otv:5,dec:5},re:"Ona se kratko nasmeje: «Hvala vam na toj iskrenosti. Sada i ja mogu da skinem zvanični lekarski ton i budem potpuno direktna.»"}]},
{title:"Šta postavljaš?",
docHigh:"Petre, zaista mi je drago što ovako razgovaramo. Da budem potpuno iskrena — i sama često preispitujem šta sve podvodimo pod termin 'medicina zasnovana na dokazima'. Hoćete li da zajedno prođemo kroz metodologiju?",
docLow:"Razumem vaš stav. Moj posao u ovoj ordinaciji je da budem vaš informativni oslonac, a ne nikakav nametnuti autoritet. O čemu prvo želimo da diskutujemo?",
prompt:"Koje pitanje prvo postavljaš?",
choices:[
{em:"Metodologija — Cochrane baza",in:"Koliko je studija obuhvaćeno? Koja su ključna metodološka ograničenja?",imp:{sas:10,otv:20,dec:15},re:"«Cochrane analiza iz 2018. godine: 26 studija, preko 73.000 učesnica. Želite li da odmah pređemo na sumnjive tačke i ograničenja?», uzvraća ona spremno.",unlock:"deep"},
{em:"Filozofski aspekt — definicije dokaza",in:"Ko tačno postavlja granicu između validne naučne studije i obične anegdote?",imp:{sas:10,otv:5,dec:5},re:"Lekarka se ponovo osmehuje: «Sjajno. Idemo u dubinu. Smatram da razlika nije ontološke, već čisto metodološke prirode...»"},
{em:"Lokalni kontekst — naša populacija",in:"Zanimaju me naši uslovi. Da li ti globalni podaci zaista važe i na Balkanu?",imp:{otv:10,dec:5},re:"«To je odlično pitanje. I odmah moram da vam kažem lošu vest — nemamo dovoljno preciznih podataka specifičnih za naš region. Hajde da analiziramo zašto je to tako.»"},
{em:"Direktno o slabostima sistema",in:"Pre nego što iznesete svoje argumente — gde škripi u vašoj teoriji?",imp:{sas:20,otv:10,dec:20},re:"Lekarka bez oklevanja klima glavom: «Potpuno pošteno mesto za početak. Izdvojila bih tri glavne slabosti — krenimo redom.»",unlock:"weak"}]},
{title:"Razgovor",
docVariants:{deep:"Cochrane analiza ima prosečno praćenje od 6 godina. To objektivno nije dovoljno dug period da bismo direktno merili uticaj na stopu raka grlića materice. Ali za preinvazivne lezije, efikasnost je izuzetno visoka. To koristimo kao zamenski parametar efikasnosti. Želite li da analiziramo koliko je to metodološki opravdano?",weak:"Pitate me za slabosti? Tri glavne su: prekratak period praćenja za određene parametre, očigledan sukob interesa u pojedinim ranim studijama i hroničan nedostatak balkanskih statističkih podataka. A sada je red na vas — koji je vaš najjači kontraargument?",high:"Želim da vam pružim maksimalno iskrene i tačne odgovore. Dajte mi samo trenutak da otvorim bazu sa kompletnim podacima na ekranu.",low:"Mogu vam pokazati konkretne uporedne studije. Šta vas u njihovoj metodologiji najviše zanima?"},
prompt:"Kako reaguješ na njenu analizu?",
choices:[
{em:"Zajednički naučni rad",in:"Ova žena govori potpuno pošteno i naučno. Hajde da zaista analiziramo podatke.",imp:{sas:5,otv:20,dec:15},re:"Naginješ se ka stolu, potpuno unesen u razgovor. Debata prestaje da bude puko nadmudrivanje — postaje stvaran dijalog dva ravnopravna uma."},
{em:"Pedantno hvatanje beleški",in:"Moram sve ovo tačno da zapišem i proverim.",imp:{sas:15,otv:10,dec:10},re:"Vadiš telefon i počnješ da hvataš beleške. Lekarka klima glavom sa odobravanjem: «Odlično. Imamo spreman spisak otvorenih pitanja za naš sledeći susret.»"},
{em:"Verifikacija kroz SZO",in:"Da li se sve te tvrdnje poklapaju sa zvaničnim pozicijama Svetske zdravstvene organizacije?",imp:{otv:5,dec:5},re:"«Hajde da pređemo i na taj nivo. Da, SZO koristi malo drugačiju metodologiju selekcije dokaza...»"},
{em:"Intelektualno priznanje",in:"Možda sam neke svoje zaključke doneo prebrzo, bez uvida u ove detalje.",imp:{sas:20,otv:10,dec:20},re:"Osećaš kako ti se unutrašnja perspektiva pomera. To te iskreno iznenađuje — retko ti se dešava da promeniš stav u samoj sredini diskusije."}]},
{title:"Odluka",
docLine:"Petre, nakon ovih intenzivnih pola sata razgovora — kakva je vaša konačna odluka?",
prompt:"Šta na kraju odlučuješ?",
choices:[
{em:"«Vakcinisaćemo je. Ubedili ste me time što niste krili slabosti.»",in:"Časna i transparentna argumentacija me je ubedila, a ne jeftin medicinski marketing.",imp:{sas:5,otv:25,dec:35},end:"best",re:"Lekarka klima glavom sa dubokim poštovanjem: «To je jedino što sam i želela — da dođemo do istinski informisanog pristanka.»"},
{em:"«Pročitaću još malo literature. Vraćamo se za nedelju dana.»",in:"Moram samostalno da proanaliziram ove metodološke parametre.",imp:{sas:5,otv:20,dec:25},end:"delayed",re:"«Slobodno mi pošaljite mejl sa svim dodatnim pitanjima čim prođete kroz tekstove. Ne morate čekati sledeći zakazan pregled.» Ispisuje ti svoju e-adresu."},
{em:"«Konsultovaću se sa suprugom, pa vam javljamo odluku.»",in:"Ovo ipak nije odluka koju bi trebalo da donosim potpuno sam.",imp:{otv:10,dec:10},end:"mid",re:"Ona klima glavom: «Naravno, to je odluka cele porodice. Javite mi se čim se usaglasite.» Zapisuje ti imejl na ivici kartona."},
{em:"«I dalje sam protiv, ali iskreno cenim ovaj razgovor.»",in:"Ne menjam mišljenje danas, a verovatno ni u budućnosti. Ali razgovor je bio vrhunski.",imp:{otv:-5,dec:-25},end:"closed",re:"«Haza vam što ste bili spremni na ovako otvoren i dubok razgovor», kaže ti iskreno. Pruža ti ruku, čvrsto i bez uobičajene lekarske distance."}]}],
endings:{
best:{phone:"Šalješ brzu poruku supruzi čim si izašao na parking: <em>«Dogovoreno. Idemo na vakcinaciju.»</em>",
opts:["Ona ti odmah odgovara: «Ispričaj mi sve detalje kad stigneš.»","Olja te zove na mobilni čim je završila sa časovima.","Pišeš detaljan imejl lekarki sa još dva preostala metodološka pitanja.","Olja te uveče radoznalo pita: «Tata, šta si to danas radio?»"],
close:["Dok se voziš kući, posmatraš studente koji ulaze u autobus.","Razmišljaš o tome kako i ti, kao profesor i naučnik, ponekad upadneš u zamku da misliš da znaš dovoljno o svemu.","Shvataš da je naša apsolutna sigurnost često samo dobro upakovana iluzija.","I da je istinski dobar razgovor onaj nakon kojeg nijedna strana ne ostane potpuno ista.","Danas si ti bio ta strana koja se promenila."]},
delayed:{phone:"U autobusu odmah otvaraš PDF dokument koji ti je lekarka poslala na mejl.",
opts:["U pitanju je kompletan Cochrane izveštaj. Čitaćeš ga večeras pažljivo.","Spremićeš olovku, marker i hladno pivo za analizu.","Olja te pita: «Tata, šta to toliko pažljivo čitaš?» — «Nešto za posao, zlato.»","Već u glavi sastavljaš imejl sa novim, kompleksnim pitanjima."],
close:["Imejl šalješ tačno u jedanaest sati uveče.","Odgovor od nje ti stiže već sutradan u sedam ujutru.","Sama činjenica da u svom inboksu imaš živu, argumentovanu prepisku sa nečijom medicinskom ordinacijom...","To je za tebe potpuno novo i osvežavajuće iskustvo.","Dokaz da je normalan i inteligentan razgovor sa sistemom ipak moguć."]},
mid:{phone:"Šalješ poruku supruzi: <em>«Razgovor je bio potpuno drugačiji od svega što sam očekivao.»</em>",
opts:["Ona te odmah pita: «I? Kakav je zaključak?»","«Mislim da imamo prostora da još jednom ozbiljno razmislimo.»","«Ispričaću ti sve detaljno sutra ujutru uz kafu.»","«Pošalji mi i ti svoja pitanja, pa da ih analiziramo zajedno.»"],
close:["Ona ne odgovara odmah na tu poruku.","A onda ti stiže kratko: «Hvala ti što si uopšte bio spreman da saslušaš.»","Olja bezbrižno sedi u svojoj sobi i radi domaći.","Razgovor između vas dvoje će večeras imati potpuno drugačiju notu.","Imate vreme na svojoj strani. Niste ni na šta primorani. Imate validne informacije. A to je zapravo sve što si od samog početka i tražio."]},
closed:{phone:"Šalješ poruku supruzi: <em>«Cenim njen trud i profesionalizam, ali i dalje smatram da ne bi trebalo da je vakcinišemo.»</em>",
opts:["Supruga ne odgovara odmah na poruku, ostavlja ti prostor.","Olja te uveče radoznalo pita za večerom: «Tata, a šta je to uopšte HPV?»","Sedaš na krevet pored nje, potpuno smiren.","«Hajde da ti tata objasni šta je danas naučio o tome.»"],
close:["I objasniš joj sve.","Potpuno iskreno. Od početka do kraja. Pre vakcine, o vakcini, šta misli medicina, a šta misliš ti kao njen otac.","Olja te sluša i klima glavom sa ozbiljnošću odrasle osobe.","Možda ona to već jeste, a ti još uvek odbijaš da primetiš.","Ali najvažnije je da si danas ostao maksimalno pošten prema samom procesu — a to je upravo ono što ti je jutros bilo najvažnije."]}
},
finalLine:"Hvala što si proživeo Petrovu priču ovih 10 minuta."},

/* ━━━━━━━ STUBS — active:0, prikazuju "Uskoro" ━━━━━━━ */
{id:"goran",active:0,name:"Goran",tag:"Sumnjam u multinacionalne kompanije",hook:"IT inženjer. Čita finansijske izveštaje. Žena ga je dovela jer su se posvađali."},
{id:"dragan",active:0,name:"Dragan",tag:"Ono što nije pokvareno — ne popravljaj",hook:"Građevinski inženjer. «Sami smo zdravi, generacije pre nas su bile zdrave.»"},
{id:"tijana",active:0,name:"Tijana",tag:"Telo sve zna samo",hook:"Joga instruktorka. Organska hrana, prirodni porođaj. Vakcina = nepotrebno mešanje."},
{id:"maja",active:0,name:"Maja",tag:"Komšijska devojčica je imala tešku reakciju",hook:"Videla je u Facebook grupi priče o teškim ishodima. Strah je konkretan i lice ima."}
];
