# Web SK Červenka

Web je ve složce `sk-cervenka`. Otevřete `sk-cervenka/index.html` dvojklikem, nic se nemusí instalovat.
Na internet se nahrává jen obsah složky `sk-cervenka`.

Data jsou v souborech `.js` (ne `.json`), aby web fungoval i po otevření dvojklikem bez serveru.

## Výsledky, tabulka, rozpis: samy

Všechno je v jediném souboru `sk-cervenka/assets/data.js`. Každé pondělí ráno ho GitHub přepíše
podle fotbalunas.cz (muži) a is.fotbal.cz (mládež) a web znovu nasadí. Nic se nemusí psát ručně:

- **tabulka** soutěže a datum „Stav k …“ (`aktualizovano`),
- **rozpis a výsledky** mužů (`zapasy`): přeložené termíny, prohozené domácí a hosté, poznámka „dohrávka“,
- **zápasy na penalty:** fotbalunas.cz ukazuje jen výsledek penalt, remízu z hrací doby skript dopočítá z tabulky,
- **zápasy, výsledky a tabulky mládeže** (`window.MLADEZ`).

Další zápas a odpočet dní si web vybere sám podle data. Dělá to `.github/workflows/tabulka.yml`
se skripty `nastroje/aktualizovat-tabulku.mjs`, `nastroje/fotbalunas.mjs` a `nastroje/isfotbal.mjs`. Bot zapisuje do `data.js`,
proto před vlastní úpravou udělejte `git pull`.

- **Ručně hned teď:** na GitHubu Actions → „Tabulka a nasazení webu“ → Run workflow.
  Se zaškrtnutým „Jen vyzkoušet“ se data jen stáhnou a vypíšou, nic se neuloží.
  Na počítači s Node: `node nastroje/aktualizovat-tabulku.mjs` (jen zkouška: `--zkouska`).
- **Když něco nejde** (web neodpovídá, zablokuje automatické stažení, změní vzhled stránky):
  dotčená část `data.js` zůstane beze změny, web běží s posledními daty a běh na GitHubu skončí
  červeně, takže přijde e-mail. V kroku „Stáhnout data“ je napsané, co selhalo.

Ruční úprava, kdyby automatika delší dobu nešla. Skóre se píše vždy z pohledu Červenky (naše góly : góly soupeře):
```js
{ datum: '2026-10-24T14:30', doma: false, souper: 'Blatec', skore: '5:4', id: 611178 },
```
Remíza rozhodnutá penaltami: `skore: '2:2', pen: 'V'` (vyhráli jsme) nebo `pen: 'P'` (prohráli jsme).
`id` je číslo zápasu na fotbalunas.cz (z adresy `fotbalunas.cz/zapas/611178/`), podle něj skript zápasy páruje.

Odkud se berou čísla: [tabulka soutěže mužů](https://fotbalunas.cz/tabulky/soutez/249),
[rozlosování mužů](https://fotbalunas.cz/rozlosovani/soutez/249), [soutěže mládeže](https://is.fotbal.cz/public/souteze/prehled-soutezi.aspx?sport=fotbal).

## Partneři

Soubor `sk-cervenka/assets/partneri.js`.

- **Balíčky a doplňky:** názvy, výhody a ceny. Prázdná cena (`cena: ''`) se ukáže jako „Cena na dotaz“,
  jinak se ukáže přesně napsaný text, třeba `cena: '15 000 Kč za sezónu'`.
- **Loga:** soubor dejte do `sk-cervenka/assets/partneri/` a přidejte řádek do `loga`:
  ```js
  { nazev: 'Firma s.r.o.', soubor: 'assets/partneri/firma.png', web: 'https://www.firma.cz' },
  ```
  Loga se ukazují svisle přímo na úvodní fotce, barevná a bez pozadí.
  Volná místa do počtu `pocetPolicek` (teď 4) se vyplní polem „Místo pro vaše logo“.
  Nejlépe vypadají loga na průhledném pozadí (PNG nebo SVG).

## Úvod webu

Na začátku `sk-cervenka/index.html` je řádek `var HERO_VARIANT = "foto";`.
`"branka"` = kreslená branka s míčem, `"foto"` = velká fotka přes celou šířku.
Bez úpravy kódu jde varianta ukázat i adresou: `...index.html?uvod=foto` nebo `?uvod=branka`.
Fotka je zatím hřiště z galerie, mění se v `src` u `hf-img` v `index.html`. Přes ni jdou další zápasy mužů a žáků, když kategorie nemá termín, ukáže se její poslední výsledek.

## Mládež a akce

Zápasy a tabulka mají záložky Muži, Starší žáci, Mladší žáci a Starší přípravka. Data mládeže jsou ve `window.MLADEZ`
v `data.js` a přepisuje je automat z is.fotbal.cz (`nastroje/isfotbal.mjs`), ručně se nemění.
Pro novou sezónu je potřeba u každé kategorie vyměnit `req`: je to číslo soutěže v adrese na is.fotbal.cz.
Přípravka má `bezTabulky: true`, protože is.fotbal.cz její tabulku nezveřejňuje.

Karty v sekci Akce jsou ve `window.AKCE` v `data.js`: název, popis a fotka z galerie.

## Historie

Milníky jsou přímo v `index.html` v sekci KLUB / HISTORIE (rok + jedna věta). Historickou fotku stačí
uložit do `sk-cervenka/assets/historie/` pod názvem roku, třeba `1945.jpg`: u milníku s `data-tl-foto`
se sama objeví místo zástupného pole a po kliknutí se otevře přes celou obrazovku.

## Kontakty a fotky

- Telefon, adresa, e-mail pro formulář, Facebook a Instagram: `window.KLUB` na začátku `data.js`.
  Prázdná adresa sociální sítě = ikona se na webu neukáže.
- Fotky do galerie: dejte je do složky `fotky 1` a spusťte `.\nastroje\pripravit-fotky.ps1 -Zdroj "fotky 1"`.
  Skript je otočí, zmenší a zapíše do `assets/galerie.js`. Popisek se vezme z názvu souboru.
  Záložka se pozná taky podle názvu: slova jako zápas, nástup, muži, mládež, hráči, Sigi nebo 80 let dají fotku do Fotbal, ostatní do Akce.
- Fotka v sekci Historie: soubor do `assets/foto/` a cestu do `window.FOTKY` v `data.js`.

## Písma

Písma jsou uložená přímo u webu v `sk-cervenka/assets/fonts/` (popis v `assets/fonts.css`), web nic nenačítá z Googlu (GDPR).
Při nahrávání na hosting nezapomeňte na tuhle složku. Skript `nastroje\stahnout-fonty.ps1` je jen pro případ, že byste písma měnili.

## Náhled se vším všudy

`powershell -ExecutionPolicy Bypass -File nastroje\server.ps1` a pak v prohlížeči http://localhost:8137/
