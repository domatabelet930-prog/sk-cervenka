/*
  Stáhne aktuální tabulku okresního přeboru z fotbalunas.cz a přepíše ji v sk-cervenka/assets/data.js.
  Mění jen seznam `tabulka` a datum `aktualizovano`. Výsledky zápasů, střelce a zbytek souboru nechá být.

  Spuštění (potřebuje Node 18+):   node nastroje/aktualizovat-tabulku.mjs
  Test bez internetu:              node nastroje/aktualizovat-tabulku.mjs --soubor test/tabulka.html

  Když se cokoli nepovede (web nejde, změnil se vzhled stránky, chybí Červenka v tabulce),
  skript skončí chybou a data.js NEZMĚNÍ. Na webu tak zůstane poslední platná tabulka.
*/

import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const URL_TABULKY = 'https://fotbalunas.cz/tabulky/soutez/249';
const NAS_TYM_ID = '2726';            // SK Červenka na fotbalunas.cz (/tym/2726)
const MIN_TYMU = 10;                  // pojistka: méně řádků = něco je špatně

const koren = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DATA_JS = path.join(koren, 'sk-cervenka', 'assets', 'data.js');

function chyba(text) {
  console.error('CHYBA: ' + text + '\nTabulka v data.js zůstala beze změny.');
  process.exit(1);
}

async function nactiHtml() {
  const i = process.argv.indexOf('--soubor');
  if (i !== -1) return readFile(path.resolve(process.argv[i + 1]), 'utf8');

  const res = await fetch(URL_TABULKY, {
    headers: { 'User-Agent': 'SK-Cervenka-web/1.0 (tydenni aktualizace tabulky)' },
    signal: AbortSignal.timeout(30000)
  });
  if (!res.ok) chyba(`fotbalunas.cz vrátil ${res.status}`);
  return res.text();
}

const bezTagu = s => s.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();

function parsujTabulku(html) {
  // Hlavní tabulka je první <table>, jejíž hlavička má sloupce Tým, Z, V, R, P, Skóre, B.
  const tabulky = html.match(/<table[\s\S]*?<\/table>/gi) || [];
  const hlavni = tabulky.find(t => {
    const hlavicka = (t.match(/<thead[\s\S]*?<\/thead>/i) || [''])[0];
    const sloupce = [...hlavicka.matchAll(/<th[^>]*>([\s\S]*?)<\/th>/gi)].map(m => bezTagu(m[1]));
    return ['Tým', 'Z', 'V', 'R', 'P', 'Skóre', 'B'].every(s => sloupce.includes(s));
  });
  if (!hlavni) chyba('na stránce jsem nenašel tabulku soutěže (změnil se vzhled fotbalunas.cz?)');

  const telo = (hlavni.match(/<tbody[\s\S]*?<\/tbody>/i) || [''])[0];
  const radky = [...telo.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)].map(m => m[1]);

  return radky.map((r, i) => {
    const bunky = [...r.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map(m => m[1]);
    // sloupce: pořadí | tým | Z | V | R | P | skóre | B | PK
    if (bunky.length < 8) chyba(`řádek ${i + 1} má málo sloupců`);
    const id = (bunky[1].match(/\/tym\/(\d+)/) || [])[1];
    const tym = bezTagu(bunky[1]);
    const z = Number(bezTagu(bunky[2]));
    const skore = bezTagu(bunky[6]);
    const b = Number(bezTagu(bunky[7]));
    if (!tym || !Number.isInteger(z) || !Number.isInteger(b) || !/^\d+:\d+$/.test(skore)) {
      chyba(`řádek ${i + 1} nejde přečíst (${tym || '?'})`);
    }
    return { tym, z, skore, b, nas: id === NAS_TYM_ID };
  });
}

function dnesPraha() {
  // RRRR-MM-DD v českém čase (GitHub běží v UTC)
  return new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Prague' }).format(new Date());
}

function vytvorBlok(tabulka) {
  const sirka = Math.max(...tabulka.map(t => t.tym.length)) + 3;
  const radky = tabulka.map(t => {
    const tym = `'${t.tym.replace(/'/g, "\\'")}',`.padEnd(sirka);
    const z = `${t.z},`.padEnd(4);
    const skore = `'${t.skore}',`.padEnd(9);
    return `    { tym: ${tym} z: ${z} skore: ${skore} b: ${t.b}${t.nas ? ', nas: true' : ''} }`;
  });
  return 'tabulka: [\n' + radky.join(',\n') + '\n  ]';
}

const html = await nactiHtml();
const tabulka = parsujTabulku(html);
if (tabulka.length < MIN_TYMU) chyba(`v tabulce je jen ${tabulka.length} týmů`);
if (!tabulka.some(t => t.nas)) chyba('v tabulce chybí SK Červenka');

let data = await readFile(DATA_JS, 'utf8');
const vzor = /tabulka:\s*\[[\s\S]*?\n\s*\]/;
if (!vzor.test(data)) chyba('v data.js jsem nenašel seznam `tabulka`');
if (!/aktualizovano:\s*'[^']*'/.test(data)) chyba('v data.js chybí `aktualizovano`');

const novaData = data
  .replace(vzor, vytvorBlok(tabulka))
  .replace(/aktualizovano:\s*'[^']*'/, `aktualizovano: '${dnesPraha()}'`);

if (novaData === data) {
  console.log('Tabulka je beze změny.');
} else {
  await writeFile(DATA_JS, novaData, 'utf8');
  const nas = tabulka.findIndex(t => t.nas) + 1;
  console.log(`Hotovo: ${tabulka.length} týmů, Červenka je ${nas}. (${tabulka[nas - 1].b} b).`);
}
