# Web SK Červenka

Web je ve složce `sk-cervenka`. Otevřete `sk-cervenka/index.html` dvojklikem, nic se nemusí instalovat.
Na internet se nahrává jen obsah složky `sk-cervenka`.

Data jsou v souborech `.js` (ne `.json`), aby web fungoval i po otevření dvojklikem bez serveru.

## Výsledky, tabulka, rozpis: samy

Všechno je v jediném souboru `sk-cervenka/assets/data.js`. Každé pondělí ráno ho GitHub přepíše
podle fotbalunas.cz a web znovu nasadí. Nic se nemusí psát ručně:

- **tabulka** soutěže a datum „Stav k …“ (`aktualizovano`),
- **rozpis a výsledky** Červenky (`zapasy`): přeložené termíny, prohozené domácí a hosté, poznámka „dohrávka“,
- **zápasy na penalty:** fotbalunas.cz ukazuje jen výsledek penalt, remízu z hrací doby skript dopočítá z tabulky,
- **střelec** (`strelec`): počet gólů a jestli vede celou soutěž.

Další zápas a odpočet dní si web vybere sám podle data. Dělá to `.github/workflows/tabulka.yml`
se skripty `nastroje/aktualizovat-tabulku.mjs` a `nastroje/fotbalunas.mjs`. Bot zapisuje do `data.js`,
proto před vlastní úpravou udělejte `git pull`.

- **Ručně hned teď:** na GitHubu Actions → „Tabulka a nasazení webu“ → Run workflow.
  Se zaškrtnutým „Jen vyzkoušet“ se data jen stáhnou a vypíšou, nic se neuloží.
  Na počítači s Node: `node nastroje/aktualizovat-tabulku.mjs` (jen zkouška: `--zkouska`).
- **Když něco nejde** (fotbalunas.cz neodpovídá, zablokuje automatické stažení, změní vzhled stránky):
  dotčená část `data.js` zůstane beze změny, web běží s posledními daty a běh na GitHubu skončí
  červeně, takže přijde e-mail. V kroku „Stáhnout data z fotbalunas.cz“ je napsané, co selhalo.
- **Co skript sám nepozná:** když nejlepším střelcem Červenky začne být jiný hráč než ten v `strelec.jmeno`.
  Pak stačí jméno v `data.js` přepsat, počet gólů si už doplní sám.

Ruční úprava, kdyby automatika delší dobu nešla. Skóre se píše vždy z pohledu Červenky (naše góly : góly soupeře):
```js
{ datum: '2026-10-24T14:30', doma: false, souper: 'Blatec', skore: '5:4', id: 611178 },
```
Remíza rozhodnutá penaltami: `skore: '2:2', pen: 'V'` (vyhráli jsme) nebo `pen: 'P'` (prohráli jsme).
`id` je číslo zápasu na fotbalunas.cz (z adresy `fotbalunas.cz/zapas/611178/`), podle něj skript zápasy páruje.

Odkud se berou čísla: [tabulka soutěže](https://fotbalunas.cz/tabulky/soutez/249),
[rozlosování](https://fotbalunas.cz/rozlosovani/soutez/249), [střelci](https://fotbalunas.cz/statistiky/soutez/249/strelci).

## Partneři

Soubor `sk-cervenka/assets/partneri.js`.

- **Balíčky a doplňky:** názvy, výhody a ceny. Prázdná cena (`cena: ''`) se ukáže jako „Cena na dotaz“,
  jinak se ukáže přesně napsaný text, třeba `cena: '15 000 Kč za sezónu'`.
- **Loga:** soubor dejte do `sk-cervenka/assets/partneri/` a přidejte řádek do `loga`:
  ```js
  { nazev: 'Firma s.r.o.', soubor: 'assets/partneri/firma.png', web: 'https://www.firma.cz' },
  ```
  Loga se ukazují v pruhu „Partneři klubu“ hned pod úvodem, šedá a při najetí myší barevná.
  Volná místa do počtu `pocetPolicek` (teď 4) se vyplní polem „Místo pro vaše logo“.
  Nejlépe vypadají loga na průhledném pozadí (PNG nebo SVG).

## Úvod webu

Na začátku `sk-cervenka/index.html` je řádek `var HERO_VARIANT = "branka";`.
`"branka"` = kreslená branka s míčem, `"foto"` = velká fotka přes celou šířku.
Bez úpravy kódu jde varianta ukázat i adresou: `...index.html?uvod=foto` nebo `?uvod=branka`.
Fotka pro variantu „foto“ je zatím zástupná (hřiště z galerie), mění se v `src` u `hf-img` v `index.html`.

## Mládež

Karty kategorií (Žáci, Benjamínci) jsou ve `window.MLADEZ` v `data.js`: věk a ročníky, tréninky, místo, trenér,
kontakt a soutěž. Co je `'DOPLNIT'`, se na webu ukáže jako zvýrazněné DOPLNIT. Další kategorii přidáte
zkopírováním celého bloku `{ ... }`. Tlačítko „Přihlásit dítě“ zaškrtne ve formuláři volbu a předvyplní kategorii.
Rozpis zápasů mládeže (`rozpis`) je převzatý z kalendářů (.ics), které jdou stáhnout u soutěže na fotbal.cz.
Automat ho neaktualizuje (fotbal.cz pouští jen lidi, ne skripty), takže nové termíny je potřeba doplnit ručně
nebo kalendáře stáhnout znovu a nechat je převést. Výsledky ani tabulky v kalendářích nejsou.

## Historie

Milníky jsou přímo v `index.html` v sekci KLUB / HISTORIE (rok + jedna věta). Historickou fotku stačí
uložit do `sk-cervenka/assets/historie/` pod názvem roku, třeba `1945.jpg`: u milníku s `data-tl-foto`
se sama objeví místo zástupného pole a po kliknutí se otevře přes celou obrazovku.

## Kontakty a fotky

- Telefon, adresa, e-mail pro formulář, Facebook a Instagram: `window.KLUB` na začátku `data.js`.
  Prázdná adresa sociální sítě = ikona se na webu neukáže.
- Fotky do galerie: dejte je do složky `fotky` a spusťte
  `powershell -ExecutionPolicy Bypass -File nastroje\pripravit-fotky.ps1`.
  Skript je otočí, zmenší a zapíše do `assets/galerie.js`. Popisek se vezme z názvu souboru.
- Fotky do sekcí (historie, týmy): soubor do `assets/foto/` a cestu do `window.FOTKY` v `data.js`.

## Písma

Písma jsou uložená přímo u webu v `sk-cervenka/assets/fonts/` (popis v `assets/fonts.css`), web nic nenačítá z Googlu (GDPR).
Při nahrávání na hosting nezapomeňte na tuhle složku. Skript `nastroje\stahnout-fonty.ps1` je jen pro případ, že byste písma měnili.

## Náhled se vším všudy

`powershell -ExecutionPolicy Bypass -File nastroje\server.ps1` a pak v prohlížeči http://localhost:8137/
