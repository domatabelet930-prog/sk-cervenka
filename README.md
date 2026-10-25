# Web SK Červenka

Web je ve složce `sk-cervenka`. Otevřete `sk-cervenka/index.html` dvojklikem, nic se nemusí instalovat.
Na internet se nahrává jen obsah složky `sk-cervenka`.

Data jsou v souborech `.js` (ne `.json`), aby web fungoval i po otevření dvojklikem bez serveru.

## Každý týden: výsledky, tabulka, rozpis

Všechno je v jediném souboru `sk-cervenka/assets/data.js`. Nikde jinde se výsledky ani tabulka nepíšou.
Další zápas a odpočet dní si web vybere sám podle data.

1. **Výsledek:** najděte zápas podle data v seznamu `zapasy` a doplňte skóre.
   Skóre se píše vždy z pohledu Červenky (naše góly : góly soupeře), i když hrajeme venku.
   ```js
   { datum: '2026-10-24T14:30', doma: false, souper: 'Blatec', skore: '2:1' },
   ```
   Remíza rozhodnutá penaltami: `skore: '2:2', pen: 'V'` (vyhráli jsme) nebo `pen: 'P'` (prohráli jsme).
2. **Tabulka: sama.** Každé pondělí ráno ji GitHub stáhne z fotbalunas.cz, přepíše v `data.js`
   (i datum `aktualizovano`) a web znovu nasadí. Dělá to `.github/workflows/tabulka.yml`
   se skriptem `nastroje/aktualizovat-tabulku.mjs`.
   Ručně hned teď: na GitHubu Actions → „Tabulka a nasazení webu“ → Run workflow
   (nebo na počítači s Node: `node nastroje/aktualizovat-tabulku.mjs`).
   Když fotbalunas.cz nejde nebo změní vzhled stránky, skript nic nepřepíše a zůstane poslední tabulka.
   Pokud by to někdy selhalo, jde to pořád ručně: v seznamu `tabulka` přepište `z`, skóre a `b`,
   seřaďte řádky a nechte `nas: true` u Červenky.
3. **Střelec:** `strelec: { jmeno, goly, nejvic }`. `nejvic: true` jen když vede tabulku střelců soutěže.
4. **Datum aktualizace:** `aktualizovano: 'RRRR-MM-DD'` (ukazuje se jako „Stav k …“).
5. **Přeložený zápas:** změňte `datum`. Poznámka u zápasu: `pozn: 'dohrávka'`.

Odkud brát čísla: [fotbalunas.cz, Červenka](https://fotbalunas.cz/tym/2726),
[tabulka soutěže](https://fotbalunas.cz/tabulky/soutez/249), [rozlosování](https://fotbalunas.cz/rozlosovani/soutez/249).

Pozor na čárky a apostrofy. Když se po úpravě sekce Zápasy vyprázdní, je v souboru překlep.

## Partneři

Soubor `sk-cervenka/assets/partneri.js`.

- **Balíčky a doplňky:** názvy, výhody a ceny. Prázdná cena (`cena: ''`) se ukáže jako „Cena na dotaz“,
  jinak se ukáže přesně napsaný text, třeba `cena: '15 000 Kč za sezónu'`.
- **Loga:** soubor dejte do `sk-cervenka/assets/partneri/` a přidejte řádek do `loga`:
  ```js
  { nazev: 'Firma s.r.o.', soubor: 'assets/partneri/firma.png', web: 'https://www.firma.cz' },
  ```
  Volná místa do počtu `pocetPolicek` (teď 6) se vyplní políčkem „Vaše logo zde“.
  Nejlépe vypadají loga na průhledném pozadí (PNG nebo SVG).

## Kontakty a fotky

- Telefon, adresa, e-mail pro formulář, Facebook: `window.KLUB` na začátku `data.js`.
- Fotky do galerie: dejte je do složky `fotky` a spusťte
  `powershell -ExecutionPolicy Bypass -File nastroje\pripravit-fotky.ps1`.
  Skript je otočí, zmenší a zapíše do `assets/galerie.js`. Popisek se vezme z názvu souboru.
- Fotky do sekcí (historie, týmy): soubor do `assets/foto/` a cestu do `window.FOTKY` v `data.js`.

## Písma

Písma jsou uložená přímo u webu v `sk-cervenka/assets/fonts/` (popis v `assets/fonts.css`), web nic nenačítá z Googlu (GDPR).
Při nahrávání na hosting nezapomeňte na tuhle složku. Skript `nastroje\stahnout-fonty.ps1` je jen pro případ, že byste písma měnili.

## Náhled se vším všudy

`powershell -ExecutionPolicy Bypass -File nastroje\server.ps1` a pak v prohlížeči http://localhost:8137/
