/*
  Čtení stránek is.fotbal.cz (zápasy, výsledky a tabulky mládeže) a přepis seznamu window.MLADEZ v data.js.
  Nepoužívá nic z Node, takže jde vyzkoušet i v prohlížeči. Spouští ho aktualizovat-tabulku.mjs.

  Každá kategorie se zpracuje zvlášť. Když jedna selže, ostatní se uloží
  a v data.js zůstane její poslední platná podoba.
*/

const NAS = 'SK Červenka';            // tak se Červenka jmenuje na is.fotbal.cz
const MIN_TYMU = 4;                   // pojistka: méně řádků v tabulce = něco je špatně
const MIN_ZAPASU = 5;                 // pojistka: méně zápasů Červenky = něco je špatně

const bezTagu = s => s.replace(/<i>[\s\S]*?<\/i>/g, ' ').replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/\s+/g, ' ').trim();
const jsText = s => `'${String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
const bunky = radek => [...radek.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map(m => m[1]);

/* ---------- zápasy po kolech ---------- */
function parsujZapasy(html) {
  const zapasy = [];
  for (const [, radek] of html.matchAll(/<tr class="type_[^"]*">([\s\S]*?)<\/tr>/g)) {
    const b = bunky(radek);
    if (b.length < 5) continue;
    const domaci = bezTagu(b[1]), hoste = bezTagu(b[2]);
    if (domaci !== NAS && hoste !== NAS) continue;
    const termin = bezTagu(b[0]).match(/(\d\d)\.(\d\d)\.(\d{4})\s+(\d\d):(\d\d)/);
    if (!termin) throw new Error(`u zápasu ${domaci} - ${hoste} chybí termín`);

    const doma = domaci === NAS;
    const z = { datum: `${termin[3]}-${termin[2]}-${termin[1]}T${termin[4]}:${termin[5]}`, doma, souper: doma ? hoste : domaci };
    if (!doma) {
      const misto = bezTagu(b[4]).replace(/\s*[,-]\s*tráva$/i, '').replace(/^tráva$/i, '');
      if (misto) z.misto = misto;
    }
    const skore = b[3].match(/^\s*(\d+)\s*:\s*(\d+)/);    // neodehraný zápas má -- : --
    if (skore) {
      const [my, oni] = doma ? [skore[1], skore[2]] : [skore[2], skore[1]];
      z.skore = `${my}:${oni}`;
      const pk = b[3].match(/penalta-ano[^>]*>\s*\(PK:(\d+):(\d+)\)/);
      if (pk) z.pen = Number(doma ? pk[1] : pk[2]) > Number(doma ? pk[2] : pk[1]) ? 'V' : 'P';
    }
    zapasy.push(z);
  }
  if (zapasy.length < MIN_ZAPASU) throw new Error(`na stránce je jen ${zapasy.length} zápasů Červenky (změnil se vzhled is.fotbal.cz?)`);
  return zapasy.sort((a, b) => a.datum.localeCompare(b.datum));
}

/* ---------- tabulka ---------- */
function parsujTabulku(html) {
  // Stránka má tabulky celkovou, doma a venku. Celková je první.
  const celkova = (html.match(/Tabulka celková[\s\S]*?<table[\s\S]*?<\/table>/i) || [''])[0];
  const radky = [...celkova.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)].map(m => bunky(m[1])).filter(b => b.length >= 8);
  const poradi = radky.map((b, i) => {
    const tym = bezTagu(b[1]), z = Number(bezTagu(b[2])), skore = bezTagu(b[6]).replace(/\s/g, ''), body = Number(bezTagu(b[7]));
    if (!tym || !Number.isInteger(z) || !Number.isInteger(body) || !/^\d+:\d+$/.test(skore)) throw new Error(`řádek ${i + 1} tabulky nejde přečíst (${tym || '?'})`);
    return { tym, z, skore, b: body, nas: tym === NAS };
  });
  if (poradi.length < MIN_TYMU) throw new Error(`v tabulce je jen ${poradi.length} týmů`);
  if (!poradi.some(t => t.nas)) throw new Error('v tabulce chybí SK Červenka');
  return poradi;
}

/* ---------- zápis do data.js ---------- */
function blokPoradi(poradi) {
  if (!poradi.length) return '    poradi: [],';
  const sirka = Math.max(...poradi.map(t => jsText(t.tym).length)) + 1;
  const radky = poradi.map(t => `      { tym: ${`${jsText(t.tym)},`.padEnd(sirka)} z: ${`${t.z},`.padEnd(3)} skore: ${`'${t.skore}',`.padEnd(10)} b: ${t.b}${t.nas ? ', nas: true' : ''} }`);
  return '    poradi: [\n' + radky.join(',\n') + '\n    ],';
}

function blokRozpisu(rozpis) {
  if (!rozpis.length) return '    rozpis: []';
  const sirka = Math.max(...rozpis.map(z => jsText(z.souper).length)) + 1;
  const radky = rozpis.map(z => {
    const dalsi = [];
    if (z.misto) dalsi.push(`misto: ${jsText(z.misto)}`);
    if (z.skore) dalsi.push(`skore: '${z.skore}'`);
    if (z.pen) dalsi.push(`pen: '${z.pen}'`);
    const zacatek = `      { datum: '${z.datum}', doma: ${z.doma ? 'true, ' : 'false,'} souper: ${jsText(z.souper)}`;
    return dalsi.length ? `${zacatek},`.padEnd(sirka + 54) + ` ${dalsi.join(', ')} }` : `${zacatek} }`;
  });
  return '    rozpis: [\n' + radky.join(',\n') + '\n    ]';
}

function blokMladeze(kategorie) {
  const bloky = kategorie.map(k => {
    const hlava = [`    id: ${jsText(k.id)},`, `    nazev: ${jsText(k.nazev)},`, `    soutez: ${jsText(k.soutez)},`, `    req: ${jsText(k.req)},`];
    if (k.turnaje) hlava.push('    turnaje: true,');
    if (k.bezTabulky) hlava.push('    bezTabulky: true,');
    hlava.push(`    aktualizovano: ${jsText(k.aktualizovano || '')},`);
    return '  {\n' + hlava.join('\n') + '\n' + blokPoradi(k.poradi || []) + '\n' + blokRozpisu(k.rozpis || []) + '\n  }';
  });
  return 'window.MLADEZ = [\n' + bloky.join(',\n') + '\n];';
}

const nactiMladez = dataJs => {
  const okno = {};
  new Function('window', dataJs)(okno);
  return Array.isArray(okno.MLADEZ) ? okno.MLADEZ : [];
};

// adresy, které je potřeba stáhnout: { 'starsi-zaci-zapasy': url, 'starsi-zaci-tabulka': url, ... }
function strankyMladeze(dataJs) {
  const adresy = {};
  for (const k of nactiMladez(dataJs)) {
    adresy[`${k.id}-zapasy`] = `https://is.fotbal.cz/public/souteze/detail-souteze.aspx?req=${k.req}&sport=fotbal`;
    if (!k.bezTabulky) adresy[`${k.id}-tabulka`] = `https://is.fotbal.cz/public/souteze/tabulky-souteze.aspx?req=${k.req}&sport=fotbal`;
  }
  return adresy;
}

// dataJs: obsah data.js, stranky: { 'starsi-zaci-zapasy': html nebo null, ... }
function aktualizujMladez(dataJs, stranky, dnes) {
  const zpravy = [], chyby = [];
  const kategorie = nactiMladez(dataJs).map(k => {
    try {
      const htmlZapasy = stranky[`${k.id}-zapasy`], htmlTabulka = stranky[`${k.id}-tabulka`];
      if (!htmlZapasy || (!htmlTabulka && !k.bezTabulky)) throw new Error('stránku se nepodařilo stáhnout');
      const rozpis = parsujZapasy(htmlZapasy), hrane = rozpis.filter(z => z.skore).length;
      zpravy.push(`${k.nazev}: ${rozpis.length} zápasů, ${hrane} odehraných.`);
      if (k.bezTabulky) return Object.assign({}, k, { rozpis, poradi: [], aktualizovano: dnes });
      const poradi = parsujTabulku(htmlTabulka), nas = poradi.find(t => t.nas);
      zpravy.push(`${k.nazev}: Červenka je ${poradi.indexOf(nas) + 1}. (${nas.b} b).`);
      if (hrane !== nas.z) zpravy.push(`Pozor: ${k.nazev} mají ${hrane} odehraných zápasů, tabulka ukazuje ${nas.z}.`);
      return Object.assign({}, k, { rozpis, poradi, aktualizovano: dnes });
    } catch (e) {
      chyby.push(`${k.nazev}: ${e.message}`);
      return k;
    }
  });

  const vzor = /window\.MLADEZ = \[[\s\S]*?\n\];/;
  if (!vzor.test(dataJs)) { chyby.push('v data.js jsem nenašel seznam window.MLADEZ'); return { data: dataJs, zpravy, chyby }; }
  const data = dataJs.replace(vzor, () => blokMladeze(kategorie));

  // pojistka: nový data.js musí jít načíst a mít všechny kategorie
  if (nactiMladez(data).length !== kategorie.length) throw new Error('nový data.js by byl poškozený, nic neukládám');
  return { data, zpravy, chyby };
}

export { aktualizujMladez, strankyMladeze, parsujZapasy, parsujTabulku };
