/*
  Data webu SK Červenka.
  Zápasy, tabulka a kontakty. Když se změní výsledek nebo tabulka, upraví se jen tento soubor.
  Skóre se píše vždy z pohledu Červenky: naše góly : góly soupeře.
  pen: 'V' = výhra na penalty, 'P' = prohra na penalty (jen u remízy).
*/

window.KLUB = {
  nazev: 'SK Červenka',
  formKlic: '15ca089e-f955-450b-bc8d-2046d53c7ec2',   // klíč z web3forms.com, zprávy z formuláře chodí na e-mail, na který je registrovaný
  telefon: '+420 605 272 347',      // z veřejného zápisu klubu na Firmy.cz, ověřit
  adresa: 'Jižní 24, 784 01 Červenka',
  ico: '45213046',
  // sociální sítě: ikony v hlavičce, v kontaktu a v patičce; prázdná adresa = ikona se neukáže
  facebook: 'https://www.facebook.com/people/SK-%C4%8Cervenka/100057497947163/',
  instagram: 'https://www.instagram.com/sk.cervenka/',
  fotbalcz: 'https://souteze.fotbal.cz/club/club/60467a7e-0594-4ed5-a2a9-4e965426a1da',
  mapa: 'https://mapy.cz/zakladni?q=SK%20%C4%8Cervenka%20fotbalov%C3%A9%20h%C5%99i%C5%A1t%C4%9B'
};

window.SEZONA = {
  soutez: 'Okresní přebor mužů',
  rocnik: '2026/27',
  aktualizovano: '2026-11-10',

  zapasy: [
    // podzim 2026
    { datum: '2026-08-15T16:30', doma: false, souper: 'Slavonín B',    skore: '5:1', id: 611108 },
    { datum: '2026-08-23T16:30', doma: true,  souper: 'Mladeč',        skore: '2:2', pen: 'V', id: 611118 },
    { datum: '2026-08-29T16:30', doma: false, souper: 'Šumvald',       skore: '3:0', id: 611123 },
    { datum: '2026-09-05T16:00', doma: true,  souper: 'Mladějovice',   skore: '7:1', id: 611126 },
    { datum: '2026-09-12T16:00', doma: false, souper: 'Nedvězí',       skore: '3:0', id: 611134 },
    { datum: '2026-09-19T15:30', doma: true,  souper: 'Chválkovice B', skore: '4:3', id: 611141 },
    { datum: '2026-10-03T15:00', doma: true,  souper: 'Štěpánov',      skore: '4:1', id: 611157 },
    { datum: '2026-10-10T15:00', doma: false, souper: 'Hněvotín',      skore: '0:5', id: 611164 },
    { datum: '2026-10-17T14:30', doma: true,  souper: 'Grygov',        skore: '3:4', id: 611170 },
    { datum: '2026-10-24T14:30', doma: false, souper: 'Blatec',        skore: '5:4', id: 611178 },
    { datum: '2026-10-28T15:00', doma: false, souper: 'Velký Újezd',   skore: '1:4', pozn: 'dohrávka', id: 611152 },
    { datum: '2026-11-01T14:00', doma: false, souper: 'Nemilany',      skore: '1:4', id: 611185 },
    { datum: '2026-11-07T14:00', doma: false, souper: 'Dlouhá Loučka', skore: '6:2', id: 611190 },
    // jaro 2027
    { datum: '2027-03-27T15:00', doma: true,  souper: 'Nemilany',      id: 611196 },
    { datum: '2027-04-04T15:30', doma: true,  souper: 'Slavonín B',    id: 611208 },
    { datum: '2027-04-11T14:30', doma: false, souper: 'Mladeč',        id: 611214 },
    { datum: '2027-04-17T16:00', doma: true,  souper: 'Šumvald',       id: 611220 },
    { datum: '2027-04-24T16:00', doma: false, souper: 'Mladějovice',   id: 611226 },
    { datum: '2027-05-01T16:30', doma: true,  souper: 'Nedvězí',       id: 611233 },
    { datum: '2027-05-09T16:30', doma: false, souper: 'Chválkovice B', id: 611244 },
    { datum: '2027-05-15T16:30', doma: true,  souper: 'Velký Újezd',   id: 611247 },
    { datum: '2027-05-23T17:00', doma: false, souper: 'Štěpánov',      id: 611258 },
    { datum: '2027-05-29T16:30', doma: true,  souper: 'Hněvotín',      id: 611261 },
    { datum: '2027-06-05T17:00', doma: false, souper: 'Grygov',        id: 611267 },
    { datum: '2027-06-12T16:30', doma: true,  souper: 'Blatec',        id: 611275 },
    { datum: '2027-06-19T16:30', doma: true,  souper: 'Dlouhá Loučka', id: 611280 }
  ],

  // tabulka ke dni "aktualizovano"
  tabulka: [
    { tym: 'FC Hněvotín',            z: 13,  skore: '51:9',   b: 34 },
    { tym: 'Sokol Velký Újezd',      z: 13,  skore: '40:20',  b: 30 },
    { tym: 'TJ Sokol Slavonín B',    z: 13,  skore: '34:21',  b: 28 },
    { tym: 'FK Nemilany',            z: 13,  skore: '39:15',  b: 26 },
    { tym: 'SK Červenka',            z: 13,  skore: '44:31',  b: 26, nas: true },
    { tym: 'SFK Nedvězí',            z: 13,  skore: '33:33',  b: 21 },
    { tym: 'SK Chválkovice B',       z: 13,  skore: '46:29',  b: 20 },
    { tym: 'SK Grygov',              z: 13,  skore: '30:29',  b: 19 },
    { tym: 'Sokol Mladeč',           z: 13,  skore: '30:34',  b: 18 },
    { tym: 'TJ Štěpánov u Olomouce', z: 13,  skore: '26:35',  b: 17 },
    { tym: 'TJ Blatec',              z: 13,  skore: '31:37',  b: 14 },
    { tym: 'TJ Mladějovice',         z: 13,  skore: '27:44',  b: 10 },
    { tym: 'Sokol Dlouhá Loučka',    z: 13,  skore: '20:53',  b: 10 },
    { tym: 'SK Šumvald',             z: 13,  skore: '11:72',  b: 0 }
  ]
};

/*
  Fotky do sekcí webu. Soubor patří do assets/foto/.
  Prázdné src = místo fotky se ukáže kreslená výplň.
*/
window.FOTKY = {
  historie: { src: '', alt: '' }
};

/*
  Akce pořádané klubem: jedna položka = jedna karta v sekci Akce.
  foto: soubor z assets/galerie/, alt: popis fotky pro čtečky.
*/
window.AKCE = [
  {
    nazev: 'Hody',
    popis: 'Tradiční hody na hřišti. Přípravné i mistrovské zápasy, pečené makrely a občerstvení, pouťové atrakce a v sobotu hodová zábava.',
    foto: 'assets/galerie/02-hody-2026-vecer-na-hristi.jpg',
    alt: 'Večer na hřišti při hodech 2026'
  },
  {
    nazev: 'Gulášfest',
    popis: 'Soutěž ve vaření gulášů na hřišti. Týmy vaří v kotlících, porota ochutnává a vybírá vítěze.',
    foto: 'assets/galerie/14-soutez-ve-vareni-gulasu-2026-plne-hriste.jpg',
    alt: 'Plné hřiště při soutěži ve vaření gulášů 2026'
  },
  {
    nazev: 'Turnaj Kubb',
    popis: 'Hanácké kolék, turnaj ve hře kubb. Týmy házením dřevěných kolíků shazují špalíky soupeře a hrají o vítěznou trofej.',
    foto: 'assets/galerie/18-kubbovy-turnaj-hanacke-kolek-2026.jpg',
    alt: 'Kubbový turnaj Hanácké kolék 2026'
  },
  {
    nazev: 'Evropský šampionát dogfrisbee',
    popis: 'V květnu 2025 patřilo naše hřiště psům a jejich psovodům. Závodníci soutěžili v chytání disků a bojovali o poháry.',
    foto: 'assets/galerie/36-dogfrisbee-vyhlaseni-vitezu-kveten-2025.jpg',
    alt: 'Vyhlášení vítězů dogfrisbee, květen 2025'
  }
];

/*
  Mládež: zápasy, výsledky a tabulky z is.fotbal.cz. Seznam přepisuje týdenní automat
  (nastroje/isfotbal.mjs), ručně není potřeba nic měnit. Skóre se píše z pohledu Červenky.
  req: číslo soutěže v adrese na is.fotbal.cz, pro novou sezónu ho je potřeba vyměnit.
  turnaje: true = soutěž se hraje na turnajích, zápasy jednoho dne se na webu spojí do jednoho řádku.
  bezTabulky: true = is.fotbal.cz tabulku nezveřejňuje (přípravka), na webu se neukáže.
  V seznamu zápasů se klíč jmenuje rozpis, aby ho automat nepletl se zápasy mužů.
*/
window.MLADEZ = [
  {
    id: 'starsi-zaci',
    nazev: 'Starší žáci',
    soutez: '5. liga starších žáků, skupina A',
    req: '08b058ec-38d8-476a-b43f-f2a1ad9318fe',
    aktualizovano: '2026-11-10',
    poradi: [
      { tym: 'SK Červenka',         z: 9,  skore: '80:5',    b: 27, nas: true },
      { tym: 'Sokol Troubelice',    z: 8,  skore: '31:9',    b: 21 },
      { tym: '1.FC Olešnice',       z: 9,  skore: '27:43',   b: 12 },
      { tym: 'FC Kolos Jiříkov',    z: 9,  skore: '18:37',   b: 12 },
      { tym: 'SK Šumvald',          z: 9,  skore: '23:27',   b: 9 },
      { tym: 'Sokol Pňovice',       z: 8,  skore: '11:28',   b: 6 },
      { tym: 'Sokol Újezd (u Un.)', z: 8,  skore: '10:51',   b: 3 }
    ],
    rozpis: [
      { datum: '2026-08-30T10:00', doma: false, souper: 'Sokol Pňovice',     misto: 'Pňovice', skore: '11:1' },
      { datum: '2026-09-02T17:00', doma: true,  souper: 'SK Šumvald',        skore: '9:2' },
      { datum: '2026-09-13T13:30', doma: false, souper: 'Sokol Troubelice',  misto: 'Troubelice', skore: '4:0' },
      { datum: '2026-09-19T13:00', doma: true,  souper: '1.FC Olešnice',     skore: '12:1' },
      { datum: '2026-09-26T10:30', doma: false, souper: 'FC Kolos Jiříkov',  misto: 'Jiříkov', skore: '8:1' },
      { datum: '2026-10-03T12:30', doma: true,  souper: 'Sokol Újezd (u Un.)', skore: '7:0' },
      { datum: '2026-10-11T12:00', doma: false, souper: '1.FC Olešnice',     misto: 'Olešnice', skore: '10:0' },
      { datum: '2026-10-17T12:00', doma: true,  souper: 'FC Kolos Jiříkov',  skore: '5:0' },
      { datum: '2026-10-25T09:30', doma: false, souper: 'Sokol Újezd (u Un.)', misto: 'Újezd', skore: '14:0' },
      { datum: '2027-04-03T13:00', doma: true,  souper: 'Sokol Pňovice' },
      { datum: '2027-04-04T13:00', doma: false, souper: 'SK Šumvald',        misto: 'Šumvald' },
      { datum: '2027-04-17T13:30', doma: true,  souper: 'Sokol Troubelice' },
      { datum: '2027-04-25T12:00', doma: false, souper: '1.FC Olešnice',     misto: 'Olešnice' },
      { datum: '2027-05-01T14:00', doma: true,  souper: 'FC Kolos Jiříkov' },
      { datum: '2027-05-09T09:30', doma: false, souper: 'Sokol Újezd (u Un.)', misto: 'Újezd' },
      { datum: '2027-05-15T14:00', doma: true,  souper: 'SK Šumvald' },
      { datum: '2027-05-23T10:00', doma: false, souper: 'Sokol Pňovice',     misto: 'Pňovice' },
      { datum: '2027-06-06T14:30', doma: false, souper: 'Sokol Troubelice',  misto: 'Troubelice' }
    ]
  },
  {
    id: 'mladsi-zaci',
    nazev: 'Mladší žáci',
    soutez: '5. liga mladších žáků, skupina A',
    req: '20a346db-751d-4aee-81e5-a96b0cc7fcb4',
    aktualizovano: '2026-11-04',
    poradi: [
      { tym: 'Sokol Bohuňovice',     z: 11, skore: '80:15',   b: 29 },
      { tym: 'SK Šumvald',           z: 11, skore: '68:15',   b: 27 },
      { tym: 'TJ Štěpánov',          z: 11, skore: '76:23',   b: 25 },
      { tym: 'Sokol Mladeč',         z: 11, skore: '57:18',   b: 25 },
      { tym: 'FC Dolany',            z: 11, skore: '29:38',   b: 22 },
      { tym: 'SK Štarnov',           z: 11, skore: '37:34',   b: 19 },
      { tym: 'Granitol Mor. Beroun', z: 11, skore: '31:38',   b: 16 },
      { tym: 'SK Červenka',          z: 11, skore: '46:37',   b: 14, nas: true },
      { tym: 'Olešnice/Hvozd',       z: 11, skore: '48:45',   b: 9 },
      { tym: 'Sokol Troubelice',     z: 11, skore: '23:50',   b: 7 },
      { tym: 'Sokol Újezd (u Un.)',  z: 11, skore: '5:89',    b: 5 },
      { tym: 'Sokol Babice',         z: 11, skore: '5:103',   b: 0 }
    ],
    rozpis: [
      { datum: '2026-08-23T14:00', doma: true,  souper: 'Granitol Mor. Beroun', skore: '11:0' },
      { datum: '2026-08-29T10:00', doma: false, souper: 'Sokol Újezd (u Un.)', misto: 'Újezd', skore: '4:0' },
      { datum: '2026-09-05T11:00', doma: true,  souper: 'Sokol Mladeč',       skore: '3:7' },
      { datum: '2026-09-13T11:15', doma: false, souper: 'SK Šumvald',         misto: 'Šumvald', skore: '0:2' },
      { datum: '2026-09-19T10:30', doma: true,  souper: 'SK Štarnov',         skore: '3:5' },
      { datum: '2026-09-27T10:00', doma: false, souper: 'FC Dolany',          misto: 'Dolany', skore: '1:4' },
      { datum: '2026-10-03T10:00', doma: true,  souper: 'TJ Štěpánov',        skore: '1:8' },
      { datum: '2026-10-10T10:00', doma: false, souper: 'Sokol Bohuňovice',   misto: 'Bohuňovice', skore: '1:7' },
      { datum: '2026-10-17T10:00', doma: false, souper: 'Sokol Troubelice',   misto: 'Troubelice', skore: '3:3', pen: 'V' },
      { datum: '2026-10-24T11:00', doma: true,  souper: 'Sokol Babice',       skore: '15:0' },
      { datum: '2026-11-01T10:15', doma: false, souper: 'Olešnice/Hvozd',     misto: 'Olešnice', skore: '4:1' }
    ]
  },
  {
    id: 'starsi-pripravka',
    nazev: 'Starší přípravka',
    soutez: 'BST 16, starší přípravka',
    req: 'd1edf19d-68c7-4614-a19b-dd1d3c03c9e8',
    turnaje: true,
    bezTabulky: true,
    aktualizovano: '2026-11-10',
    poradi: [],
    rozpis: [
      { datum: '2026-09-05T09:00', doma: false, souper: 'Tatran Litovel',     skore: '2:3' },
      { datum: '2026-09-05T09:00', doma: false, souper: 'FK Hlubočky',        skore: '7:6' },
      { datum: '2026-09-12T12:00', doma: false, souper: 'FK Slavonín',        skore: '2:4' },
      { datum: '2026-09-12T12:00', doma: false, souper: 'Sokol Újezd (u Un.)', skore: '11:0' },
      { datum: '2026-09-12T12:00', doma: false, souper: 'SK Chválkovice',     skore: '3:6' },
      { datum: '2026-09-20T09:00', doma: false, souper: 'Sokol Doloplazy',    skore: '3:6' },
      { datum: '2026-09-20T09:00', doma: true,  souper: 'Sokol Příkazy',      skore: '2:8' },
      { datum: '2026-09-20T09:00', doma: false, souper: 'FK Horka nad Mor.',  skore: '2:4' },
      { datum: '2026-09-26T09:00', doma: false, souper: 'FC Lužice',          skore: '5:1' },
      { datum: '2026-09-26T09:00', doma: false, souper: 'TJ Štěpánov',        skore: '0:6' },
      { datum: '2026-09-26T09:00', doma: false, souper: 'Sokol Příkazy',      skore: '4:7' },
      { datum: '2026-10-04T12:00', doma: true,  souper: 'Sokol Velký Týnec',  skore: '3:6' },
      { datum: '2026-10-04T12:00', doma: true,  souper: 'Sigma Lutín',        skore: '15:1' },
      { datum: '2026-10-04T12:00', doma: true,  souper: 'FK Velká Bystřice',  skore: '3:5' },
      { datum: '2026-10-11T12:00', doma: true,  souper: 'SK Chválkovice',     skore: '1:11' },
      { datum: '2026-10-11T12:00', doma: true,  souper: 'SFK Nedvězí',        skore: '3:5' },
      { datum: '2026-10-11T12:00', doma: true,  souper: '1.FC Olešnice',      skore: '3:3' },
      { datum: '2026-10-17T09:00', doma: false, souper: 'Granitol Mor. Beroun', skore: '1:3' },
      { datum: '2026-10-17T09:00', doma: false, souper: 'FC Dolany',          skore: '3:2' },
      { datum: '2026-10-17T09:00', doma: false, souper: 'Slovan Černovír',    skore: '1:2' },
      { datum: '2026-10-25T09:00', doma: false, souper: 'SK Těšetice',        skore: '1:7' },
      { datum: '2026-10-25T09:00', doma: true,  souper: 'Sokol Mladeč',       skore: '4:5' },
      { datum: '2026-10-25T09:00', doma: false, souper: 'SK Náměšť',          skore: '2:1' }
    ]
  }
];
