/*
  Stáhne z fotbalunas.cz tabulku okresního přeboru a rozlosování mužů (termíny a výsledky)
  a z is.fotbal.cz zápasy, výsledky a tabulky mládeže. Přepíše je v sk-cervenka/assets/data.js,
  zbytek souboru nechá být.

  Spuštění (potřebuje Node 18+):   node nastroje/aktualizovat-tabulku.mjs
  Jen vyzkoušet, nic neukládat:    node nastroje/aktualizovat-tabulku.mjs --zkouska
  Bez internetu z uložených stránek (tabulka.html, rozlosovani.html, starsi-zaci-zapasy.html, ...):
                                   node nastroje/aktualizovat-tabulku.mjs --slozka test/

  Když se nějaká část nepovede (web nejde, zablokuje automatické stažení, změní vzhled),
  ta část v data.js zůstane beze změny a skript skončí chybou, aby o tom GitHub dal vědět.
*/

import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { aktualizujData } from './fotbalunas.mjs';
import { aktualizujMladez, strankyMladeze } from './isfotbal.mjs';

const STRANKY = {
  tabulka: 'https://fotbalunas.cz/tabulky/soutez/249',
  rozlosovani: 'https://fotbalunas.cz/rozlosovani/soutez/249'
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
    if (!res.ok) throw new Error(`${new URL(url).hostname} vrátil ${res.status}`);
    const html = await res.text();
    if (/WEDOS\.protection|Security verification/i.test(html)) {
      throw new Error(`${new URL(url).hostname} místo stránky ukázal bezpečnostní kontrolu (zablokoval automatické stažení)`);
    }
    return html;
  } catch (e) {
    console.error(`${nazev}: ${e.message}`);
    return null;
  }
}

// ohleduplně, jedna stránka za druhou
async function stahniVse(adresy) {
  const stranky = {};
  for (const [nazev, url] of Object.entries(adresy)) {
    stranky[nazev] = await stahni(nazev, url);
    if (slozka === null) await pockej(2000);
  }
  return stranky;
}

const data = await readFile(DATA_JS, 'utf8');
const dnes = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Prague' }).format(new Date());   // RRRR-MM-DD v českém čase
const muzi = aktualizujData(data, await stahniVse(STRANKY), dnes);
const mladez = aktualizujMladez(muzi.data, await stahniVse(strankyMladeze(muzi.data)), dnes);
const novaData = mladez.data;
const chyby = [...muzi.chyby, ...mladez.chyby];

[...muzi.zpravy, ...mladez.zpravy].forEach(z => console.log(z));
chyby.forEach(c => console.error('CHYBA: ' + c));

if (novaData === data) console.log('data.js je beze změny.');
else if (zkouska) console.log('Zkouška: data.js by se změnil, ale nic neukládám.');
else { await writeFile(DATA_JS, novaData, 'utf8'); console.log('data.js uložen.'); }

if (chyby.length) process.exit(1);
