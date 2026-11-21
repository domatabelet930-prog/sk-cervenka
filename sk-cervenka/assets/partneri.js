/*
  Partneři klubu: loga, balíčky a doplňkové možnosti.
  cena: prázdná ('') = na webu se ukáže "Cena na dotaz". Jinak se ukáže přesně to, co napíšete, třeba '15 000 Kč za sezónu'.
  zahrnuje: název balíčku, jehož výhody tenhle balíček obsahuje (ukáže se jako "Vše z balíčku ...").
  zvyraznit: true = karta je na webu zvýrazněná, stitek je text v jejím štítku.
*/

window.PARTNERI = {
  // Loga partnerů v pruhu hned pod úvodem. Soubory patří do složky assets/partneri/.
  // Logo je šedé a při najetí myší barevné; web = kam logo odkazuje (nepovinné).
  // Příklad: { nazev: 'Firma s.r.o.', soubor: 'assets/partneri/firma.png', web: 'https://www.firma.cz' }
  loga: [
    { nazev: 'Olomoucký kraj', soubor: 'assets/partneri/olomoucky-kraj.svg', web: 'https://www.olkraj.cz' },
    { nazev: 'Obec Červenka', soubor: 'assets/partneri/obec-cervenka.png', web: 'https://www.obeccervenka.cz' },
    { nazev: 'Pivovar Litovel', soubor: 'assets/partneri/pivovar-litovel.svg', web: 'https://www.litovel.cz' },
    { nazev: 'Adriana pasta', soubor: 'assets/partneri/adriana.svg', web: 'https://www.adriana.cz' }
  ],

  // Kolik políček má pruh aspoň mít. Chybějící místa se vyplní polem "Místo pro vaše logo".
  pocetPolicek: 4,

  balicky: [
    {
      nazev: 'Přítel klubu',
      cena: '',
      vyhody: [
        'Jméno na tabuli partnerů a na webu',
        'Propagace na sociálních sítích'
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
        'Partner všech domácích zápasů'
      ]
    },
    {
      nazev: 'Generální partner',
      cena: '',
      zahrnuje: 'Hlavní partner',
      zvyraznit: true,
      stitek: 'Logo na dresu',
      vyhody: [
        'Logo na dresu A-mužstva',
        'Největší banner u vchodu',
        'Vstup na domácí zápasy zdarma',
        'Jedna firemní akce v areálu'
      ]
    }
  ],

  doplnky: [
    { nazev: 'Partner mládeže', cena: '' },
    { nazev: 'Partner zápasu', cena: '' },
    { nazev: 'Partner rozvoje', popis: 'Dar na konkrétní věc, třeba hrací pomůcky nebo zázemí.', cena: '' }
  ]
};
