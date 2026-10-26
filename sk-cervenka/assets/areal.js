/*
  Sekce Areál: co se v areálu opravilo a postavilo.
  Každý projekt má název, krátký text a jednu nebo dvě fotky ze složky assets/areal/.
  stitek: krátký popisek přes fotku, třeba 'Před 2019' a 'Po 2025'.
  sipka: false = mezi dvěma fotkami se neukáže šipka (když nejde o před a po).
  Pořadí na webu je stejné jako tady.
*/

window.AREAL = [
  {
    nazev: 'Vstup do areálu',
    text: 'Z rozbité cesty s kalužemi je dlážděný vstup.',
    fotky: [
      { src: 'assets/areal/vstup-pred.jpg', stitek: 'Před 2019', alt: 'Rozbitá cesta s kalužemi u vstupu do areálu v roce 2019' },
      { src: 'assets/areal/vstup-po.jpg', stitek: 'Po 2025', alt: 'Nová dlažba u vstupu do areálu v roce 2025' }
    ]
  },
  {
    nazev: 'Nový kiosek',
    text: 'Místo starého dřevěného kiosku stojí nový.',
    fotky: [
      { src: 'assets/areal/kiosek-pred.jpg', stitek: 'Před 2023', alt: 'Starý dřevěný kiosek v roce 2023' },
      { src: 'assets/areal/kiosek-po.jpg', stitek: 'Po 2025', alt: 'Nový kiosek s červenou střechou v roce 2025' }
    ]
  },
  {
    nazev: 'Pergola',
    text: 'Místo pod širým nebem je kryté posezení.',
    fotky: [
      { src: 'assets/areal/pergola-pred.jpg', stitek: 'Před 2018', alt: 'Lidé u budovy v areálu bez pergoly v roce 2018' },
      { src: 'assets/areal/pergola-po.jpg', stitek: 'Po 2025', alt: 'Děti a dospělí u stolů pod novou pergolou v roce 2025' }
    ]
  },
  {
    nazev: 'Tribuna',
    text: 'V březnu 2023 prošla tribuna opravou.',
    sipka: false,
    fotky: [
      { src: 'assets/areal/tribuna-brigada.jpg', stitek: 'Brigáda 2023', alt: 'Kluci nosí modré sedačky na tribunu' },
      { src: 'assets/areal/tribuna.jpg', stitek: 'Tribuna 2023', alt: 'Tribuna s modrými sedačkami' }
    ]
  },
  {
    nazev: 'Střídačky',
    text: 'Staré střídačky šly do opravy.',
    fotky: [
      { src: 'assets/areal/stridacky-pred.jpg', stitek: 'Před 2023', alt: 'Stará zašlá střídačka u hřiště' },
      { src: 'assets/areal/stridacky-oprava.jpg', stitek: 'Oprava 2023', alt: 'Rámy střídaček při opravě pod pergolou' }
    ]
  },
  {
    nazev: 'Nové branky',
    text: 'Staré branky nahradily nové hliníkové.',
    fotky: [
      { src: 'assets/areal/branky-pred.jpg', stitek: 'Před 2025', alt: 'Stará branka vyjmutá z hřiště' },
      { src: 'assets/areal/branky-montaz.jpg', stitek: 'Montáž 2025', alt: 'Osazování nové hliníkové branky' }
    ]
  },
  {
    nazev: 'Hrací plocha',
    text: 'Po deštích stála na hřišti voda. Poškozená místa dostala nový trávník.',
    fotky: [
      { src: 'assets/areal/plocha-voda.jpg', stitek: 'Září 2025', alt: 'Voda stojící na hřišti u lavičky' },
      { src: 'assets/areal/plocha-oprava.jpg', stitek: 'Říjen 2025', alt: 'Pokládání nového trávníku na hřišti' }
    ]
  },
  {
    nazev: 'Stromy po kůrovci',
    text: 'Smrky napadené kůrovcem šly pryč, místo nich rostou nové stromky.',
    fotky: [
      { src: 'assets/areal/vysadba-pred.jpg', stitek: 'Před 2023', alt: 'Uschlé smrky napadené kůrovcem u areálu' },
      { src: 'assets/areal/vysadba-po.jpg', stitek: 'Po 2023', alt: 'Nově vysazené stromky v zasněženém areálu' }
    ]
  },
  {
    nazev: 'Závlaha',
    text: 'Trávník se zavlažuje, aby vydržel i suché léto.',
    fotky: [
      { src: 'assets/areal/zavlaha.jpg', stitek: 'Srpen 2025', alt: 'Zavlažování hřiště za soumraku' }
    ]
  }
];
