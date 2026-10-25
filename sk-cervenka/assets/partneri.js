/*
  Partneři klubu: loga, balíčky a doplňkové možnosti.
  cena: prázdná ('') = na webu se ukáže "Cena na dotaz". Jinak se ukáže přesně to, co napíšete, třeba '15 000 Kč za sezónu'.
  zahrnuje: název balíčku, jehož výhody tenhle balíček obsahuje (ukáže se jako "Vše z balíčku ...").
  zvyraznit: true = karta je na webu zvýrazněná, stitek je text v jejím štítku.
*/

window.PARTNERI = {
  // Loga současných partnerů. Soubory patří do složky assets/partneri/.
  // Příklad: { nazev: 'Firma s.r.o.', soubor: 'assets/partneri/firma.png', web: 'https://www.firma.cz' }
  loga: [],

  // Kolik políček má mřížka log mít. Chybějící místa se vyplní políčkem "Vaše logo zde".
  pocetPolicek: 6,

  balicky: [
    {
      nazev: 'Přítel klubu',
      cena: '',
      vyhody: [
        'Jméno na tabuli partnerů a na webu',
        'Poděkování na Facebooku na začátku sezóny'
      ]
    },
    {
      nazev: 'Partner',
      cena: '',
      zahrnuje: 'Přítel klubu',
      vyhody: [
        'Banner na plotě hřiště',
        'Logo na webu'
      ]
    },
    {
      nazev: 'Hlavní partner',
      cena: '',
      zahrnuje: 'Partner',
      vyhody: [
        'Banner na nejlepším místě',
        'Logo na zápasových grafikách a plakátech',
        'Hlášení rozhlasem',
        'Partner jednoho domácího zápasu'
      ]
    },
    {
      nazev: 'Generální partner',
      cena: '',
      zahrnuje: 'Hlavní partner',
      zvyraznit: true,
      stitek: 'Logo na dresu',
      vyhody: [
        'Logo na prsou dresu A-mužstva',
        'Největší banner u vchodu',
        '4 VIP vstupy s občerstvením',
        'Jedna firemní akce v areálu'
      ]
    }
  ],

  doplnky: [
    { nazev: 'Partner mládeže', cena: '' },
    { nazev: 'Partner zápasu', cena: '' },
    { nazev: 'Rukáv nebo záda dresu', cena: '' },
    { nazev: 'Partner obnovy po povodni', popis: 'Dar na konkrétní věc, třeba střídačky nebo šatny.', cena: '' }
  ]
};
