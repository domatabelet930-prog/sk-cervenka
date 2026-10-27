/*
  Data webu SK Červenka.
  Zápasy, tabulka a kontakty. Když se změní výsledek nebo tabulka, upraví se jen tento soubor.
  Skóre se píše vždy z pohledu Červenky: naše góly : góly soupeře.
  pen: 'V' = výhra na penalty, 'P' = prohra na penalty (jen u remízy).
*/

window.KLUB = {
  nazev: 'SK Červenka',
  email: '',                        // DOPLNIT: e-mail klubu, kam chodí zprávy z formuláře
  telefon: '+420 605 272 347',      // z veřejného zápisu klubu na Firmy.cz, ověřit
  adresa: 'Jižní 24, 784 01 Červenka',
  ico: '45213046',
  // sociální sítě: ikony v hlavičce, v kontaktu a v patičce; prázdná adresa = ikona se neukáže
  facebook: 'https://www.facebook.com/people/SK-%C4%8Cervenka/100057497947163/',
  instagram: '',                    // DOPLNIT: adresa profilu, třeba 'https://www.instagram.com/skcervenka/'
  fotbalcz: 'https://souteze.fotbal.cz/club/club/60467a7e-0594-4ed5-a2a9-4e965426a1da',
  mapa: 'https://mapy.cz/zakladni?q=SK%20%C4%8Cervenka%20fotbalov%C3%A9%20h%C5%99i%C5%A1t%C4%9B'
};

window.SEZONA = {
  soutez: 'Okresní přebor mužů',
  rocnik: '2026/27',
  aktualizovano: '2026-10-26',
  strelec: { jmeno: 'Vojtěch Schulmeister', goly: 19, nejvic: true },   // nejvic: vede tabulku střelců soutěže

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
    { datum: '2026-10-28T15:00', doma: false, souper: 'Velký Újezd',   pozn: 'dohrávka', id: 611152 },
    { datum: '2026-11-01T14:00', doma: false, souper: 'Nemilany',      id: 611185 },
    { datum: '2026-11-07T14:00', doma: false, souper: 'Dlouhá Loučka', id: 611190 },
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
    { tym: 'FC Hněvotín',            z: 11,  skore: '48:9',   b: 28 },
    { tym: 'SK Červenka',            z: 10,  skore: '36:21',  b: 23, nas: true },
    { tym: 'TJ Sokol Slavonín B',    z: 11,  skore: '29:21',  b: 23 },
    { tym: 'Sokol Velký Újezd',      z: 10,  skore: '26:16',  b: 21 },
    { tym: 'FK Nemilany',            z: 11,  skore: '30:14',  b: 20 },
    { tym: 'SFK Nedvězí',            z: 11,  skore: '28:24',  b: 18 },
    { tym: 'Sokol Mladeč',           z: 11,  skore: '27:30',  b: 16 },
    { tym: 'SK Grygov',              z: 11,  skore: '24:29',  b: 15 },
    { tym: 'SK Chválkovice B',       z: 10,  skore: '31:24',  b: 14 },
    { tym: 'TJ Štěpánov u Olomouce', z: 11,  skore: '20:30',  b: 14 },
    { tym: 'TJ Blatec',              z: 11,  skore: '28:29',  b: 13 },
    { tym: 'TJ Mladějovice',         z: 11,  skore: '25:35',  b: 10 },
    { tym: 'Sokol Dlouhá Loučka',    z: 11,  skore: '18:42',  b: 10 },
    { tym: 'SK Šumvald',             z: 10,  skore: '9:55',   b: 0 }
  ]
};

/*
  Fotky do sekcí webu. Soubor patří do assets/foto/.
  Prázdné src = místo fotky se ukáže kreslená výplň.
*/
window.FOTKY = {
  historie:   { src: '', alt: '' },
  muzi:       { src: 'assets/foto/muzi.jpg',     alt: 'Muži SK Červenka před zápasem na hodech 2026' },
  fanousci:   { src: 'assets/foto/fanousci.jpg', alt: 'Návštěvníci soutěže ve vaření gulášů na hřišti SK Červenka' },
  starsizaci: { src: '', alt: '' },
  mladsizaci: { src: '', alt: '' },
  benjaminci: { src: 'assets/galerie/31-mladez-sk-cervenka-zari-2025.jpg', alt: 'Děti z mládeže SK Červenka s trenéry na hřišti, září 2025' }
};

/*
  Mládež: jedna položka = jedna karta v sekci Týmy.
  Další kategorii přidáte zkopírováním celého bloku { ... }.
  'DOPLNIT' nebo prázdný text se na webu ukáže jako zvýrazněné DOPLNIT.
  foto: název políčka ve FOTKY výše.
  rozpis: zápasy z kalendářů (.ics) z fotbal.cz, stav k 27. 10. 2026. doma: true = hrajeme v Července.
  turnaje: true = soutěž se hraje na turnajích, zápasy jednoho dne se na webu spojí do jednoho řádku.
*/
window.MLADEZ_AKTUALIZOVANO = '2026-10-27';   // datum, ke kterému sedí rozpisy mládeže

window.MLADEZ = [
  {
    nazev: 'Starší žáci',
    vek: 'U15, ročníky 2012 a mladší',    // podle věkových kategorií FAČR pro sezónu 2026/27, ověřit
    treninky: 'DOPLNIT',                   // kdy, třeba 'úterý a čtvrtek 16:30–18:00'
    misto: 'DOPLNIT',                      // kde, třeba 'hřiště SK Červenka'
    trener: 'DOPLNIT',                     // jméno trenéra
    kontakt: 'DOPLNIT',                    // telefon nebo e-mail trenéra
    soutez: '5. liga starších žáků, skupina A',
    foto: 'starsizaci',
    rozpis: [
      { datum: '2026-08-30T10:00', doma: false, souper: 'Sokol Pňovice', misto: 'Pňovice' },
      { datum: '2026-09-02T17:00', doma: true, souper: 'SK Šumvald' },
      { datum: '2026-09-13T13:30', doma: false, souper: 'Sokol Troubelice', misto: 'Troubelice' },
      { datum: '2026-09-19T13:00', doma: true, souper: '1.FC Olešnice' },
      { datum: '2026-09-26T10:30', doma: false, souper: 'FC Kolos Jiříkov', misto: 'Jiříkov' },
      { datum: '2026-10-03T12:30', doma: true, souper: 'Sokol Újezd (u Un.)' },
      { datum: '2026-10-11T12:00', doma: false, souper: '1.FC Olešnice', misto: 'Olešnice' },
      { datum: '2026-10-17T12:00', doma: true, souper: 'FC Kolos Jiříkov' },
      { datum: '2026-10-25T09:30', doma: false, souper: 'Sokol Újezd (u Un.)', misto: 'Újezd' },
      { datum: '2027-04-03T13:00', doma: true, souper: 'Sokol Pňovice' },
      { datum: '2027-04-04T13:00', doma: false, souper: 'SK Šumvald', misto: 'Šumvald' },
      { datum: '2027-04-17T13:30', doma: true, souper: 'Sokol Troubelice' },
      { datum: '2027-04-25T12:00', doma: false, souper: '1.FC Olešnice', misto: 'Olešnice' },
      { datum: '2027-05-01T14:00', doma: true, souper: 'FC Kolos Jiříkov' },
      { datum: '2027-05-09T09:30', doma: false, souper: 'Sokol Újezd (u Un.)', misto: 'Újezd' },
      { datum: '2027-05-15T14:00', doma: true, souper: 'SK Šumvald' },
      { datum: '2027-05-23T10:00', doma: false, souper: 'Sokol Pňovice', misto: 'Pňovice' },
      { datum: '2027-06-06T14:30', doma: false, souper: 'Sokol Troubelice', misto: 'Troubelice' },
    ]
  },
  {
    nazev: 'Mladší žáci',
    vek: 'U13, ročníky 2014 a mladší',    // podle věkových kategorií FAČR pro sezónu 2026/27, ověřit
    treninky: 'DOPLNIT',
    misto: 'DOPLNIT',
    trener: 'DOPLNIT',
    kontakt: 'DOPLNIT',
    soutez: '5. liga mladších žáků, skupina A',
    foto: 'mladsizaci',
    rozpis: [
      { datum: '2026-08-23T14:00', doma: true, souper: 'Granitol Mor. Beroun' },
      { datum: '2026-08-29T10:00', doma: false, souper: 'Sokol Újezd (u Un.)', misto: 'Újezd' },
      { datum: '2026-09-05T11:00', doma: true, souper: 'Sokol Mladeč' },
      { datum: '2026-09-13T11:15', doma: false, souper: 'SK Šumvald', misto: 'Šumvald' },
      { datum: '2026-09-19T10:30', doma: true, souper: 'SK Štarnov' },
      { datum: '2026-09-27T10:00', doma: false, souper: 'FC Dolany', misto: 'Dolany' },
      { datum: '2026-10-03T10:00', doma: true, souper: 'TJ Štěpánov' },
      { datum: '2026-10-10T10:00', doma: false, souper: 'Sokol Bohuňovice', misto: 'Bohuňovice' },
      { datum: '2026-10-17T10:00', doma: false, souper: 'Sokol Troubelice', misto: 'Troubelice' },
      { datum: '2026-10-24T11:00', doma: true, souper: 'Sokol Babice' },
      { datum: '2026-11-01T09:30', doma: false, souper: 'Olešnice/Hvozd', misto: 'Olešnice' },
    ]
  },
  {
    nazev: 'Benjamínci',
    vek: 'DOPLNIT',
    treninky: 'DOPLNIT',
    misto: 'DOPLNIT',
    trener: 'DOPLNIT',
    kontakt: 'DOPLNIT',
    soutez: 'BST 16, turnajová soutěž',   // název soutěže tak, jak ho uvádí fotbal.cz
    foto: 'benjaminci',
    turnaje: true,
    rozpis: [
      { datum: '2026-09-05T09:00', doma: false, souper: 'FK Hlubočky' },
      { datum: '2026-09-05T09:00', doma: false, souper: 'Tatran Litovel' },
      { datum: '2026-09-12T12:00', doma: false, souper: 'FK Slavonín' },
      { datum: '2026-09-12T12:00', doma: false, souper: 'SK Chválkovice' },
      { datum: '2026-09-12T12:00', doma: false, souper: 'Sokol Újezd (u Un.)' },
      { datum: '2026-09-20T09:00', doma: false, souper: 'FK Horka nad Mor.' },
      { datum: '2026-09-20T09:00', doma: false, souper: 'Sokol Doloplazy' },
      { datum: '2026-09-20T09:00', doma: true, souper: 'Sokol Příkazy' },
      { datum: '2026-09-26T09:00', doma: false, souper: 'FC Lužice' },
      { datum: '2026-09-26T09:00', doma: false, souper: 'Sokol Příkazy' },
      { datum: '2026-09-26T09:00', doma: false, souper: 'TJ Štěpánov' },
      { datum: '2026-10-04T12:00', doma: true, souper: 'FK Velká Bystřice' },
      { datum: '2026-10-04T12:00', doma: true, souper: 'Sigma Lutín' },
      { datum: '2026-10-04T12:00', doma: true, souper: 'Sokol Velký Týnec' },
      { datum: '2026-10-11T12:00', doma: true, souper: '1.FC Olešnice' },
      { datum: '2026-10-11T12:00', doma: true, souper: 'SFK Nedvězí' },
      { datum: '2026-10-11T12:00', doma: true, souper: 'SK Chválkovice' },
      { datum: '2026-10-17T09:00', doma: false, souper: 'FC Dolany' },
      { datum: '2026-10-17T09:00', doma: false, souper: 'Granitol Mor. Beroun' },
      { datum: '2026-10-17T09:00', doma: false, souper: 'Slovan Černovír' },
      { datum: '2026-10-25T09:00', doma: false, souper: 'SK Náměšť' },
      { datum: '2026-10-25T09:00', doma: false, souper: 'SK Těšetice' },
      { datum: '2026-10-25T09:00', doma: true, souper: 'Sokol Mladeč' },
    ]
  }
];
