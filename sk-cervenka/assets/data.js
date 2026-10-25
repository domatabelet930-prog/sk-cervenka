/*
  Data webu SK Červenka.
  Zápasy, tabulka a kontakty. Když se změní výsledek nebo tabulka, upraví se jen tento soubor.
  Skóre se píše vždy z pohledu Červenky: naše góly : góly soupeře.
  pen: 'V' = výhra na penalty, 'P' = prohra na penalty (jen u remízy).
*/

window.KLUB = {
  nazev: 'SK Červenka',
  email: '',                        // kontaktní e-mail klubu, kam chodí zprávy z formuláře (zatím chybí)
  telefon: '+420 605 272 347',      // z veřejného zápisu klubu na Firmy.cz, ověřit
  adresa: 'Jižní 24, 784 01 Červenka',
  ico: '45213046',
  facebook: 'https://www.facebook.com/people/SK-%C4%8Cervenka/100057497947163/',
  fotbalcz: 'https://souteze.fotbal.cz/club/club/60467a7e-0594-4ed5-a2a9-4e965426a1da',
  mapa: 'https://mapy.cz/zakladni?q=SK%20%C4%8Cervenka%20fotbalov%C3%A9%20h%C5%99i%C5%A1t%C4%9B'
};

window.SEZONA = {
  soutez: 'Okresní přebor mužů',
  rocnik: '2026/27',
  aktualizovano: '2026-10-25',
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
    { tym: 'FK Nemilany',            z: 11,  skore: '30:14',  b: 20 },
    { tym: 'Sokol Velký Újezd',      z: 9,   skore: '23:15',  b: 18 },
    { tym: 'SFK Nedvězí',            z: 11,  skore: '28:24',  b: 18 },
    { tym: 'Sokol Mladeč',           z: 10,  skore: '26:27',  b: 16 },
    { tym: 'SK Chválkovice B',       z: 10,  skore: '31:24',  b: 14 },
    { tym: 'TJ Štěpánov u Olomouce', z: 11,  skore: '20:30',  b: 14 },
    { tym: 'TJ Blatec',              z: 11,  skore: '28:29',  b: 13 },
    { tym: 'SK Grygov',              z: 10,  skore: '20:28',  b: 12 },
    { tym: 'TJ Mladějovice',         z: 11,  skore: '25:35',  b: 10 },
    { tym: 'Sokol Dlouhá Loučka',    z: 10,  skore: '17:38',  b: 10 },
    { tym: 'SK Šumvald',             z: 10,  skore: '9:55',   b: 0 }
  ]
};

/*
  Fotky do sekcí webu. Soubor patří do assets/foto/.
  Prázdné src = místo fotky se ukáže kreslená výplň.
*/
window.FOTKY = {
  historie: { src: '', alt: '' },
  muzi:     { src: 'assets/foto/muzi.jpg',     alt: 'Muži SK Červenka před zápasem na hodech 2026' },
  mladez:   { src: '', alt: '' },
  fanousci: { src: 'assets/foto/fanousci.jpg', alt: 'Návštěvníci soutěže ve vaření gulášů na hřišti SK Červenka' }
};
