/*
  Čtení stránek fotbalunas.cz a přepis dat v sk-cervenka/assets/data.js.
  Nepoužívá nic z Node, takže jde vyzkoušet i v prohlížeči. Spouští ho aktualizovat-tabulku.mjs.

  Každá část (tabulka, zápasy, střelec) se zpracuje zvlášť. Když jedna selže,
  ostatní se uloží a v data.js zůstane její poslední platná podoba.
*/

const NAS = 'Červenka';               // tak se Červenka jmenuje v rozlosování
const NAS_TYM_ID = '2726';            // SK Červenka v tabulce (/tym/2726)
const MIN_TYMU = 10;                  // pojistka: méně řádků v tabulce = něco je špatně
const MIN_ZAPASU = 10;                // pojistka: méně zápasů v rozlosování = něco je špatně
const DNY_PRESUN = 5;                 // zápas víc než 5 dní po termínu kola je dohrávka

const bezTagu = s => s.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
const bezDiakritiky = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const jsText = s => `'${String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
const dvojmistne = n => String(n).padStart(2, '0');

/* ---------- tabulka soutěže ---------- */
function parsujTabulku(html) {
  // Hlavní tabulka je první <table>, jejíž hlavička má sloupce Tým, Z, V, R, P, Skóre, B.
  const tabulky = html.match(/<table[\s\S]*?<\/table>/gi) || [];
  const hlavni = tabulky.find(t => {
    const hlavicka = (t.match(/<thead[\s\S]*?<\/thead>/i) || [''])[0];
    const sloupce = [...hlavicka.matchAll(/<th[^>]*>([\s\S]*?)<\/th>/gi)].map(m => bezTagu(m[1]));
    return ['Tým', 'Z', 'V', 'R', 'P', 'Skóre', 'B'].every(s => sloupce.includes(s));
  });
  if (!hlavni) throw new Error('na stránce jsem nenašel tabulku soutěže (změnil se vzhled fotbalunas.cz?)');

  const telo = (hlavni.match(/<tbody[\s\S]*?<\/tbody>/i) || [''])[0];
  const radky = [...telo.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)].map(m => m[1]);
  const tabulka = radky.map((r, i) => {
    const bunky = [...r.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map(m => m[1]);
    // sloupce: pořadí | tým | Z | V | R | P | skóre | B | PK
    if (bunky.length < 8) throw new Error(`řádek ${i + 1} tabulky má málo sloupců`);
    const id = (bunky[1].match(/\/tym\/(\d+)/) || [])[1];
    const tym = bezTagu(bunky[1]);
    const z = Number(bezTagu(bunky[2]));
    const skore = bezTagu(bunky[6]);
    const b = Number(bezTagu(bunky[7]));
    if (!tym || !Number.isInteger(z) || !Number.isInteger(b) || !/^\d+:\d+$/.test(skore)) {
      throw new Error(`řádek ${i + 1} tabulky nejde přečíst (${tym || '?'})`);
    }
    return { tym, z, skore, b, nas: id === NAS_TYM_ID };
  });
  if (tabulka.length < MIN_TYMU) throw new Error(`v tabulce je jen ${tabulka.length} týmů`);
  if (!tabulka.some(t => t.nas)) throw new Error('v tabulce chybí SK Červenka');
  return tabulka;
}

function blokTabulky(tabulka) {
  const sirka = Math.max(...tabulka.map(t => jsText(t.tym).length)) + 1;
  const radky = tabulka.map(t => {
    const tym = `${jsText(t.tym)},`.padEnd(sirka);
    const z = `${t.z},`.padEnd(4);
    const skore = `'${t.skore}',`.padEnd(9);
    return `    { tym: ${tym} z: ${z} skore: ${skore} b: ${t.b}${t.nas ? ', nas: true' : ''} }`;
  });
  return 'tabulka: [\n' + radky.join(',\n') + '\n  ]';
}

/* ---------- rozlosování: termíny a výsledky Červenky ---------- */
function rokPodleKola(kolo, den, mesic) {
  // V rozlosování je u zápasu jen den a měsíc. Rok vezmu z data kola (kvůli Silvestru i z vedlejších let).
  const r = kolo.getFullYear();
  return [r - 1, r, r + 1]
    .map(rok => new Date(rok, mesic - 1, den))
    .sort((a, b) => Math.abs(a - kolo) - Math.abs(b - kolo))[0];
}

function parsujRozlosovani(html) {
  const sezona = html.match(/(20\d\d)-(20\d\d)/);
  const kola = [...html.matchAll(/class="card-title"[\s\S]{0,400}?(\d+)\.\s*kolo,\s*(\d\d)\.(\d\d)\.(\d{4})/g)]
    .map(m => ({ i: m.index, cislo: Number(m[1]), datum: new Date(Number(m[4]), Number(m[3]) - 1, Number(m[2])) }));
  if (!kola.length) throw new Error('v rozlosování jsem nenašel žádné kolo (změnil se vzhled fotbalunas.cz?)');

  const zapasy = new Map();   // stránka má každý zápas několikrát, beru první výskyt
  for (const m of html.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)) {
    const radek = m[1];
    const utkani = radek.match(/class="zapas-item-utkani[^"]*"[^>]*>\s*<a href="\/zapas\/(\d+)\/"[^>]*>([\s\S]*?)<\/a>/);
    if (!utkani || zapasy.has(utkani[1])) continue;
    const tymy = bezTagu(utkani[2]).split(' - ').map(s => s.trim());
    if (tymy.length !== 2 || !tymy.includes(NAS)) continue;

    const vysledek = (radek.match(/class="zapas-item-vysledek[^"]*"[^>]*>([\s\S]*)$/) || [])[1] || '';
    const termin = vysledek.match(/(\d\d)\.(\d\d)\.\s+(\d\d?):(\d\d)/);
    const kolo = kola.filter(k => k.i < m.index).pop();
    if (!termin || !kolo) throw new Error(`u zápasu ${tymy.join(' - ')} chybí termín nebo kolo`);

    const den = rokPodleKola(kolo.datum, Number(termin[1]), Number(termin[2]));
    const skore = vysledek.match(/\/zapas\/\d+\/"[^>]*>\s*(\d+):(\d+)\s*(p\.)?/);
    zapasy.set(utkani[1], {
      id: utkani[1],
      domaci: tymy[0],
      hoste: tymy[1],
      den,
      datum: `${den.getFullYear()}-${dvojmistne(den.getMonth() + 1)}-${dvojmistne(den.getDate())}T${dvojmistne(termin[3])}:${termin[4]}`,
      posun: Math.round((den - kolo.datum) / 864e5),
      golyDomaci: skore ? Number(skore[1]) : null,   // u penalt jsou to penalty, ne hrací doba
      golyHoste: skore ? Number(skore[2]) : null,
      penalty: !!(skore && skore[3])
    });
  }
  const seznam = [...zapasy.values()].sort((a, b) => a.den - b.den);
  if (seznam.length < MIN_ZAPASU) throw new Error(`v rozlosování je jen ${seznam.length} zápasů Červenky`);
  return { rocnik: sezona ? `${sezona[1]}/${sezona[2].slice(2)}` : null, zapasy: seznam };
}

// soupeř se na webu jmenuje kratší verzí ("Mladeč" místo "Sokol Mladeč", "Dlouhá Loučka" místo "Dl.Loučka")
function klicSoupere(nazev) {
  return bezDiakritiky(nazev).replace(/\bu olomouce\b/g, '').replace(/\b(sk|tj|fk|fc|sfk|sokol)\b/g, '').replace(/[^a-z0-9]/g, '');
}
function stejnySouper(a, b) {
  const x = klicSoupere(a), y = klicSoupere(b);
  return x === y || (Math.min(x.length, y.length) >= 5 && x.slice(0, 2) === y.slice(0, 2) && x.slice(-4) === y.slice(-4));
}
function kratkeJmeno(nazev) {
  return nazev.replace(/^(SK|TJ|FK|FC|SFK|Sokol|TJ Sokol)\s+/, '').replace(/\s+u Olomouce$/, '').trim();
}

function noveZapasy(fu, stare, tabulka, zpravy, chyby) {
  const jmeno = souper => (stare.find(z => stejnySouper(z.souper, souper)) || {}).souper || kratkeJmeno(souper);
  const zapasy = fu.zapasy.map(z => {
    const doma = z.domaci === NAS;
    const souper = doma ? z.hoste : z.domaci;
    const e = { datum: z.datum, doma, souper: jmeno(souper) };
    if (z.golyDomaci !== null) {
      const [my, oni] = doma ? [z.golyDomaci, z.golyHoste] : [z.golyHoste, z.golyDomaci];
      if (!z.penalty) e.skore = `${my}:${oni}`;
      else {
        // fotbalunas.cz u penalt ukazuje jen výsledek penalt. Remízu z hrací doby převezmu z data.js.
        e.pen = my > oni ? 'V' : 'P';
        const drive = stare.find(s => String(s.id) === z.id) ||
          stare.find(s => !s.id && s.doma === doma && stejnySouper(s.souper, souper) && s.pen);
        if (drive && drive.pen === e.pen && /^(\d+):\1$/.test(drive.skore || '')) e.skore = drive.skore;
        else e.chybiSkore = true;
      }
    }
    if (z.posun > DNY_PRESUN) e.pozn = 'dohrávka';
    else if (z.posun < -DNY_PRESUN) e.pozn = 'předehrávka';
    e.id = Number(z.id);
    return e;
  });

  // Nový zápas na penalty: skóre z hrací doby dopočítám z tabulky (vstřelené a obdržené góly).
  const nas = tabulka && tabulka.find(t => t.nas);
  const chybi = zapasy.filter(e => e.chybiSkore);
  if (chybi.length === 1 && nas) {
    const [dali, dostali] = nas.skore.split(':').map(Number);
    const znamo = zapasy.filter(e => e.skore).map(e => e.skore.split(':').map(Number));
    const x = dali - znamo.reduce((s, g) => s + g[0], 0);
    const y = dostali - znamo.reduce((s, g) => s + g[1], 0);
    if (x === y && x >= 0 && znamo.length + 1 === nas.z) {
      chybi[0].skore = `${x}:${x}`;
      delete chybi[0].chybiSkore;
      zpravy.push(`Zápas se soupeřem ${chybi[0].souper} skončil ${x}:${x} a rozhodly penalty (dopočítáno z tabulky).`);
    }
  }
  for (const e of zapasy.filter(e => e.chybiSkore)) {
    delete e.chybiSkore;
    delete e.pen;
    chyby.push(`Zápas ${e.datum.slice(0, 10)} se soupeřem ${e.souper} rozhodly penalty a skóre z hrací doby nejde zjistit. ` +
      `Doplňte ho ručně v data.js (skore: 'x:x', pen: 'V' nebo 'P').`);
  }

  // Kontrola proti tabulce: odehrané zápasy a góly musí sedět.
  if (nas) {
    const hrane = zapasy.filter(e => e.skore).map(e => e.skore.split(':').map(Number));
    const skore = `${hrane.reduce((s, g) => s + g[0], 0)}:${hrane.reduce((s, g) => s + g[1], 0)}`;
    if (hrane.length !== nas.z || skore !== nas.skore) {
      zpravy.push(`Pozor: zápasy dávají ${hrane.length} utkání a skóre ${skore}, tabulka ukazuje ${nas.z} a ${nas.skore}.`);
    }
  }
  return zapasy;
}

function blokZapasu(zapasy) {
  const sirka = Math.max(...zapasy.map(z => jsText(z.souper).length)) + 1;
  const vystup = [];
  let pulka = '';
  for (const z of zapasy) {
    const [rok, mesic] = z.datum.split('-').map(Number);
    const nazev = mesic >= 7 ? `podzim ${rok}` : `jaro ${rok}`;
    if (nazev !== pulka) { vystup.push({ komentar: `    // ${nazev}` }); pulka = nazev; }
    let radek = `    { datum: '${z.datum}', doma: ${z.doma ? 'true, ' : 'false,'} souper: ${(jsText(z.souper) + ',').padEnd(sirka)}`;
    const dalsi = [];
    if (z.skore) dalsi.push(`skore: '${z.skore}'`);
    if (z.pen) dalsi.push(`pen: '${z.pen}'`);
    if (z.pozn) dalsi.push(`pozn: ${jsText(z.pozn)}`);
    dalsi.push(`id: ${z.id}`);
    radek += ' ' + dalsi.join(', ') + ' }';
    vystup.push({ radek });
  }
  const posledni = vystup.map(v => !!v.radek).lastIndexOf(true);
  return 'zapasy: [\n' + vystup.map((v, i) => v.komentar || v.radek + (i < posledni ? ',' : '')).join('\n') + '\n  ]';
}

/* ---------- střelci soutěže ---------- */
function parsujStrelce(html) {
  const tabulky = html.match(/<table[\s\S]*?<\/table>/gi) || [];
  const tab = tabulky.find(t => /<th[^>]*>\s*Hráč\s*<\/th>/.test(t) && /<th[^>]*>\s*Počet\s*<\/th>/.test(t));
  if (!tab) throw new Error('na stránce jsem nenašel žebříček střelců');
  const hraci = [...tab.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)].map(m => {
    const bunky = [...m[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map(x => bezTagu(x[1]));
    return bunky.length >= 3 ? { jmeno: bunky[1], goly: Number(bunky[2]) } : null;
  }).filter(h => h && h.jmeno && Number.isInteger(h.goly));
  if (!hraci.length) throw new Error('žebříček střelců je prázdný');
  return hraci;
}

/* ---------- celé zpracování ---------- */
// dataJs: obsah data.js, stranky: { tabulka, rozlosovani, strelci } (HTML, nebo null když se nestáhlo)
function aktualizujData(dataJs, stranky, dnes) {
  const zpravy = [], chyby = [];
  const okno = {};
  new Function('window', dataJs)(okno);
  const sezona = okno.SEZONA || {};
  let data = dataJs;

  let tabulka = null;
  try {
    if (!stranky.tabulka) throw new Error('stránku se nepodařilo stáhnout');
    tabulka = parsujTabulku(stranky.tabulka);
    const vzor = /tabulka:\s*\[[\s\S]*?\n\s*\]/;
    if (!vzor.test(data)) throw new Error('v data.js jsem nenašel seznam `tabulka`');
    data = data.replace(vzor, blokTabulky(tabulka)).replace(/aktualizovano:\s*'[^']*'/, `aktualizovano: '${dnes}'`);
    const nas = tabulka.findIndex(t => t.nas);
    zpravy.push(`Tabulka: ${tabulka.length} týmů, Červenka je ${nas + 1}. (${tabulka[nas].b} b).`);
  } catch (e) { chyby.push('Tabulka: ' + e.message); }

  try {
    if (!stranky.rozlosovani) throw new Error('stránku se nepodařilo stáhnout');
    const fu = parsujRozlosovani(stranky.rozlosovani);
    const zapasy = noveZapasy(fu, sezona.zapasy || [], tabulka, zpravy, chyby);
    const vzor = /zapasy:\s*\[[\s\S]*?\n\s*\]/;
    if (!vzor.test(data)) throw new Error('v data.js jsem nenašel seznam `zapasy`');
    data = data.replace(vzor, blokZapasu(zapasy));
    if (fu.rocnik) data = data.replace(/rocnik:\s*'[^']*'/, `rocnik: '${fu.rocnik}'`);
    zpravy.push(`Zápasy: ${zapasy.length} v rozlosování, ${zapasy.filter(z => z.skore).length} odehraných.`);
  } catch (e) { chyby.push('Zápasy: ' + e.message); }

  try {
    if (!stranky.strelci) throw new Error('stránku se nepodařilo stáhnout');
    const hraci = parsujStrelce(stranky.strelci);
    const kdo = sezona.strelec && sezona.strelec.jmeno;
    const hrac = kdo && hraci.find(h => bezDiakritiky(h.jmeno) === bezDiakritiky(kdo));
    if (!hrac) throw new Error(`${kdo || 'střelec z data.js'} v žebříčku střelců není`);
    const nejvic = hrac.goly === Math.max(...hraci.map(h => h.goly));
    data = data.replace(/strelec:\s*\{[^}]*\}/, `strelec: { jmeno: ${jsText(hrac.jmeno)}, goly: ${hrac.goly}, nejvic: ${nejvic} }`);
    zpravy.push(`Střelec: ${hrac.jmeno} ${hrac.goly} gólů${nejvic ? ', nejvíc v soutěži' : ''}.`);
  } catch (e) { chyby.push('Střelec: ' + e.message); }

  // pojistka: nový data.js musí jít načíst a mít všechna data
  const kontrola = {};
  new Function('window', data)(kontrola);
  if (!kontrola.SEZONA || !kontrola.SEZONA.zapasy.length || !kontrola.SEZONA.tabulka.length) {
    throw new Error('nový data.js by byl poškozený, nic neukládám');
  }
  return { data, zpravy, chyby };
}

export { aktualizujData, parsujTabulku, parsujRozlosovani, parsujStrelce };
