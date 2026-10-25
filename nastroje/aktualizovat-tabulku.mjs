/*
  Stáhne z fotbalunas.cz tabulku okresního přeboru, rozlosování Červenky (termíny a výsledky)
  a žebříček střelců a přepíše je v sk-cervenka/assets/data.js. Zbytek souboru nechá být.

  Spuštění (potřebuje Node 18+):   node nastroje/aktualizovat-tabulku.mjs
  Jen vyzkoušet, nic neukládat:    node nastroje/aktualizovat-tabulku.mjs --zkouska
  Bez internetu z uložených stránek (tabulka.html, rozlosovani.html, strelci.html):
                                   node nastroje/aktualizovat-tabulku.mjs --slozka test/

  Když se nějaká část nepovede (web nejde, zablokuje automatické stažení, změní vzhled),
  ta část v data.js zůstane beze změny a skript skončí chybou, aby o tom GitHub dal vědět.
*/

import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { aktualizujData } from './fotbalunas.mjs';

const STRANKY = {
  tabulka: 'https://fotbalunas.cz/tabulky/soutez/249',
  rozlosovani: 'https://fotbalunas.cz/rozlosovani/soutez/249',
  strelci: 'https://fotbalunas.cz/statistiky/soutez/249/strelci'
};

const koren = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DATA_JS = path.join(koren, 'sk-cervenka', 'assets', 'data.js');
const argument = nazev => { const i = process.argv.indexOf(nazev); return i === -1 ? null : process.argv[i + 1] || ''; };
const zkouska = process.argv.includes('--zkouska');
const slozka = argument('--slozka');
const pockej = ms => new Promise(r => setTimeout(r, ms));

async function stahni(nazev, url) {
  try {
    if (slozka !== null) return await readFile(path.resolve(slozka, `${nazev}.html`), 'utf8');
    const res = await fetch(url, {
      headers: { 'User-Agent': 'SK-Cervenka-web/1.0 (tydenni aktualizace tabulky a vysledku)' },
      signal: AbortSignal.timeout(30000)
    });
    if (!res.ok) throw new Error(`fotbalunas.cz vrátil ${res.status}`);
    const html = await res.text();
    if (/WEDOS\.protection|Security verification/i.test(html)) {
      throw new Error('fotbalunas.cz místo stránky ukázal bezpečnostní kontrolu (zablokoval automatické stažení)');
    }
    return html;
  } catch (e) {
    console.error(`${nazev}: ${e.message}`);
    return null;
  }
}

const stranky = {};
for (const [nazev, url] of Object.entries(STRANKY)) {
  stranky[nazev] = await stahni(nazev, url);
  if (slozka === null) await pockej(2000);   // ohleduplně, jedna stránka za druhou
}

const data = await readFile(DATA_JS, 'utf8');
const dnes = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Prague' }).format(new Date());   // RRRR-MM-DD v českém čase
const vysledek = aktualizujData(data, stranky, dnes);

vysledek.zpravy.forEach(z => console.log(z));
vysledek.chyby.forEach(c => console.error('CHYBA: ' + c));

if (vysledek.data === data) console.log('data.js je beze změny.');
else if (zkouska) console.log('Zkouška: data.js by se změnil, ale nic neukládám.');
else { await writeFile(DATA_JS, vysledek.data, 'utf8'); console.log('data.js uložen.'); }

if (vysledek.chyby.length) process.exit(1);
