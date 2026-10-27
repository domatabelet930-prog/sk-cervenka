/* SK Červenka, chování webu. Čistý JavaScript bez knihoven. */
(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const smooth = (p, e0, e1) => { const t = clamp((p - e0) / (e1 - e0), 0, 1); return t * t * (3 - 2 * t); };
  const easeOut = t => 1 - Math.pow(1 - t, 3);
  const easeInOut = t => -(Math.cos(Math.PI * t) - 1) / 2;
  const rng = seed => { let s = seed >>> 0; return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296; };
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]);
  const onMQ = (mql, fn) => (mql.addEventListener ? mql.addEventListener('change', fn) : mql.addListener(fn));
  const RM = matchMedia('(prefers-reduced-motion: reduce)');
  const TAU = Math.PI * 2;
  const NAS = 'Červenka';

  const KLUB = window.KLUB || {};
  const SEZONA = window.SEZONA || {};
  const FOTKY = window.FOTKY || {};
  const GALERIE = Array.isArray(window.GALERIE) ? window.GALERIE : [];
  const PARTNERI = window.PARTNERI || {};
  const AREAL = Array.isArray(window.AREAL) ? window.AREAL : [];
  const MLADEZ = Array.isArray(window.MLADEZ) ? window.MLADEZ : [];

  /* ---------- data, datumy ---------- */
  const DNY = ['ne', 'po', 'út', 'st', 'čt', 'pá', 'so'];
  const DNY_CELE = ['neděle', 'pondělí', 'úterý', 'středa', 'čtvrtek', 'pátek', 'sobota'];
  const MESICE = ['ledna', 'února', 'března', 'dubna', 'května', 'června', 'července', 'srpna', 'září', 'října', 'listopadu', 'prosince'];
  const toDate = iso => {
    const [d, t = '00:00'] = String(iso).split('T');
    const [y, m, dd] = d.split('-').map(Number);
    const [hh, mm] = t.split(':').map(Number);
    return new Date(y, m - 1, dd, hh || 0, mm || 0);
  };
  const kratce = dt => `${DNY[dt.getDay()]} ${dt.getDate()}. ${dt.getMonth() + 1}.`;
  const dlouze = dt => `${DNY_CELE[dt.getDay()]} ${dt.getDate()}. ${MESICE[dt.getMonth()]}`;
  const cas = dt => `${dt.getHours()}:${String(dt.getMinutes()).padStart(2, '0')}`;
  const dniDo = dt => {
    const a = new Date(); a.setHours(0, 0, 0, 0);
    const b = new Date(dt); b.setHours(0, 0, 0, 0);
    return Math.round((b - a) / 864e5);
  };
  const zaKolik = n => (n <= 0 ? 'dnes' : n === 1 ? 'zítra' : n < 5 ? `za ${n} dny` : `za ${n} dní`);

  const zapasy = (SEZONA.zapasy || []).map(z => Object.assign({}, z, { dt: toDate(z.datum) })).sort((a, b) => a.dt - b.dt);
  const budouci = z => !z.skore && z.dt.getTime() + 2 * 36e5 > Date.now();
  const dalsi = zapasy.find(budouci);
  const dalsiDoma = zapasy.find(z => z.doma && budouci(z));
  const vysl = z => { const [a, b] = z.skore.split(':').map(Number); return a > b ? 'v' : a < b ? 'p' : 'r'; };
  const domaHoste = z => (z.doma ? [NAS, z.souper] : [z.souper, NAS]);
  const skoreDH = z => { const [a, b] = z.skore.split(':'); return z.doma ? `${a}:${b}` : `${b}:${a}`; };
  const ZNAK = '<svg class="team-znak" aria-hidden="true"><use href="#znak"/></svg>';
  const tymBox = (n, tag) => `<div class="team"><span class="team-tag">${tag}</span><span class="team-n">${n === NAS ? ZNAK : ''}${esc(n)}</span></div>`;

  function renderZapasy() {
    const box = $('[data-next]');
    if (box) {
      const meta = $('[data-next-meta]'), when = $('[data-next-when]'), homeLine = $('[data-next-home-line]');
      if (!dalsi) {
        box.innerHTML = '<p class="next-none">Sezóna skončila. Nový rozpis sem dáme, jakmile ho svaz zveřejní.</p>';
        meta.hidden = true;
      } else {
        const [h, a] = domaHoste(dalsi);
        box.innerHTML = tymBox(h, 'Domácí') +
          `<div class="vs"><span class="plate plate-time">${cas(dalsi.dt)}</span><span class="vs-date">${kratce(dalsi.dt)}</span></div>` +
          tymBox(a, 'Hosté');
        when.textContent = zaKolik(dniDo(dalsi.dt));
        meta.textContent = `${dlouze(dalsi.dt)} · výkop ${cas(dalsi.dt)} · ${dalsi.doma ? 'doma v Července' : 'venku'}${dalsi.pozn ? ' · ' + dalsi.pozn : ''}`;
        if (!dalsi.doma && dalsiDoma) {
          homeLine.hidden = false;
          homeLine.innerHTML = `Další zápas doma: <a href="#rozpis" data-open-season>${esc(dlouze(dalsiDoma.dt))}, výkop ${cas(dalsiDoma.dt)}, soupeř ${esc(dalsiDoma.souper)}</a>.`;
        }
      }
    }

    $$('[data-next-home]').forEach(a => {
      const chip = $('[data-next-home-text]', a), k = $('.chip-k', a);
      if (!chip) return;
      if (dalsiDoma) chip.textContent = `${kratce(dalsiDoma.dt)} · ${cas(dalsiDoma.dt)} · ${dalsiDoma.souper}`;
      else { chip.textContent = 'Rozpis a výsledky'; if (k) k.textContent = `Sezóna ${SEZONA.rocnik || ''}`; }
    });

    const res = $('[data-results]');
    if (res) {
      const lab = { v: 'Výhra', r: 'Remíza', p: 'Prohra' };
      const posl = zapasy.filter(z => z.skore).slice(-5).reverse();
      res.innerHTML = posl.map(z => {
        const r = vysl(z);
        const pen = z.pen === 'V' ? ' · výhra na penalty' : z.pen === 'P' ? ' · prohra na penalty' : '';
        return `<li class="r r-${r}"><span class="r-badge" aria-hidden="true">${r.toUpperCase()}</span>` +
          `<span class="r-main"><span class="r-t"><span class="sr-only">${lab[r]}, soupeř </span>${esc(z.souper)}</span>` +
          `<span class="r-m">${kratce(z.dt)} · ${z.doma ? 'doma' : 'venku'}${pen}</span></span>` +
          `<span class="r-s">${z.skore}</span></li>`;
      }).join('') || '<li class="r"><span class="r-main">Zatím bez výsledků.</span></li>';
    }

    const tab = SEZONA.tabulka || [];
    const tb = $('[data-table]');
    if (tb) {
      tb.innerHTML = tab.map((t, i) => `<tr${t.nas ? ' class="is-us"' : ''}><td>${i + 1}.</td><th scope="row">${esc(t.tym)}${t.nas ? '<span class="sr-only"> (náš tým)</span>' : ''}</th><td>${t.z}</td><td class="tab-score">${t.skore}</td><td class="tab-b">${t.b}</td></tr>`).join('');
    }

    const st = $('[data-stats]');
    const nas = tab.find(t => t.nas);
    if (st && nas) {
      const items = [
        [tab.indexOf(nas) + 1, '.', 'místo v tabulce'],
        [nas.b, '', `bodů po ${nas.z} ${nas.z === 1 ? 'zápase' : 'zápasech'}`],
        [Number(nas.skore.split(':')[0]), '', 'vstřelených gólů']
      ];
      const s = SEZONA.strelec;
      if (s) items.push([s.goly, '', `gólů dal ${s.jmeno}${s.nejvic ? ', nejvíc v celé soutěži' : ''}`]);
      st.innerHTML = items.map(([n, suf, l]) => `<div><dt><span class="sr-only">${n}${suf}</span><span aria-hidden="true" data-count="${n}" data-suf="${suf}">${n}${suf}</span></dt><dd>${esc(l)}</dd></div>`).join('');
    }

    const up = $('[data-updated]');
    if (up && SEZONA.aktualizovano) {
      const d = toDate(SEZONA.aktualizovano);
      up.textContent = `Stav k ${d.getDate()}. ${d.getMonth() + 1}. ${d.getFullYear()}`;
    }
    const sl = $('[data-season-label]');
    if (sl && SEZONA.rocnik) sl.textContent = `Sezóna ${SEZONA.rocnik} · ${SEZONA.soutez || ''}`;

    const sch = $('[data-schedule]');
    if (sch) {
      const casti = [];
      zapasy.forEach(z => {
        const nazev = `${z.dt.getMonth() < 6 ? 'Jaro' : 'Podzim'} ${z.dt.getFullYear()}`;
        let c = casti.find(x => x.nazev === nazev);
        if (!c) casti.push((c = { nazev, z: [] }));
        c.z.push(z);
      });
      const nm = n => (n === NAS ? `<span class="us">${esc(n)}</span>` : esc(n));
      sch.innerHTML = casti.map(c => `<div class="season-part"><h4>${c.nazev}</h4><ol>${c.z.map(z => {
        const [h, a] = domaHoste(z);
        const mid = z.skore ? `${skoreDH(z)}${z.pen ? '<span class="sr-only">, rozhodly penalty</span>' : ''}` : `<span class="s-time">${cas(z.dt)}</span>`;
        const cls = z.skore ? ' is-played' : z === dalsi ? ' is-next' : '';
        return `<li class="s-row${cls}"><span class="s-d">${kratce(z.dt)}${z.pozn ? ' · ' + esc(z.pozn) : ''}${z.pen ? ' · pen.' : ''}</span><span class="s-h">${nm(h)}</span><span class="s-r">${mid}</span><span class="s-a">${nm(a)}</span></li>`;
      }).join('')}</ol></div>`).join('');
    }

    document.addEventListener('click', e => {
      const a = e.target.closest('[data-open-season]');
      if (!a) return;
      const d = $('details.season');
      if (d) { d.open = true; d.id = 'rozpis'; }
    });
  }

  function renderKontakty() {
    const tel = $('[data-c-tel]'), telRow = $('[data-c-tel-row]');
    if (KLUB.telefon && tel) { tel.textContent = KLUB.telefon; tel.href = 'tel:' + KLUB.telefon.replace(/[^\d+]/g, ''); }
    else if (telRow) telRow.hidden = true;
    if (KLUB.adresa) {
      const a = $('[data-c-adresa]'); if (a) a.textContent = `${KLUB.nazev || 'SK Červenka'}, ${KLUB.adresa}`;
      const f = $('[data-f-adresa]'); if (f) f.textContent = KLUB.adresa;
    }
    if (KLUB.mapa) { const m = $('[data-c-mapa]'); if (m) m.href = KLUB.mapa; }
    // sociální sítě: adresa z KLUB, bez adresy se odkaz schová
    $$('[data-social]').forEach(a => {
      const url = String(KLUB[a.dataset.social] || '').trim();
      if (url) { a.href = url; a.hidden = false; } else a.hidden = true;
    });
    if (KLUB.fotbalcz) $$('a[href*="fotbal.cz"]').forEach(a => { a.href = KLUB.fotbalcz; });
    const y = $('[data-year]'); if (y) y.textContent = new Date().getFullYear();
  }

  function renderFotky() {
    $$('[data-slot]').forEach(fig => {
      const f = FOTKY[fig.dataset.slot];
      if (!f || !f.src) return;
      const img = new Image();
      img.alt = f.alt || '';
      img.decoding = 'async';
      img.loading = 'lazy';
      img.addEventListener('load', () => fig.classList.add('has-photo'), { once: true });
      img.src = f.src;
      fig.insertBefore(img, fig.firstChild);
      const cap = $('.slot-cap', fig);
      if (cap && f.popis) cap.textContent = f.popis;
      else if (cap) cap.hidden = true;
    });
  }

  /* ---------- areál: projekty s fotkami před a po ---------- */
  function renderAreal() {
    const box = $('[data-areal]');
    if (!box) return;
    const sekce = box.closest('section');
    const projekty = AREAL.filter(p => p && p.nazev && Array.isArray(p.fotky) && p.fotky.length);
    if (!projekty.length) { if (sekce) sekce.hidden = true; return; }
    const sipka = '<span class="projekt-sipka" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>';
    box.innerHTML = projekty.map(p => {
      const fotky = p.fotky.slice(0, 2);
      const obr = fotky.map(f => `<figure><img src="${esc(f.src)}" alt="${esc(f.alt || p.nazev)}" loading="lazy" decoding="async">` +
        `${f.stitek ? `<figcaption class="projekt-stitek">${esc(f.stitek)}</figcaption>` : ''}</figure>`).join('');
      return `<article class="projekt"><div class="projekt-foto projekt-foto-${fotky.length}">${obr}` +
        `${fotky.length === 2 && p.sipka !== false ? sipka : ''}</div>` +
        `<div class="projekt-b"><h3 class="projekt-n">${esc(p.nazev)}</h3>${p.text ? `<p>${esc(p.text)}</p>` : ''}</div></article>`;
    }).join('');
  }

  /* ---------- mládež: karta pro každou kategorii ---------- */
  function renderMladez() {
    const box = $('[data-mladez]');
    if (!box) return;
    const kat = MLADEZ.filter(k => k && k.nazev);
    if (!kat.length) { const s = box.closest('section'); if (s) s.hidden = true; return; }
    const DOPLNIT = '<span class="doplnit">DOPLNIT</span>';
    const hodnota = v => { const s = String(v == null ? '' : v).trim(); return !s || /^doplnit$/i.test(s) ? DOPLNIT : esc(s); };
    const kontakt = v => {
      const s = String(v == null ? '' : v).trim();
      if (/^\+?[\d\s]{9,}$/.test(s)) return `<a href="tel:${s.replace(/\s/g, '')}">${esc(s)}</a>`;
      if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)) return `<a href="mailto:${esc(s)}">${esc(s)}</a>`;
      return hodnota(s);
    };
    const ikona = '<svg viewBox="0 0 200 200"><g fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"><circle cx="100" cy="112" r="34"/><path d="m100 92 18 13-7 21H89l-7-21Z"/><path d="M30 168h140M44 150l10-30 10 30M136 150l10-30 10 30"/></g></svg>';
    const radek = (dt, dd) => `<div><dt>${dt}</dt><dd>${dd}</dd></div>`;
    box.innerHTML = kat.map(k => `<article class="card kat">` +
      `${k.foto ? `<figure class="slot" data-slot="${esc(k.foto)}"><div class="ph" aria-hidden="true">${ikona}</div></figure>` : ''}` +
      `<div class="card-b"><h4 class="h3">${esc(k.nazev)}</h4>` +
      `<dl class="kat-info">${radek('Věk a ročníky', hodnota(k.vek))}${radek('Tréninky', hodnota(k.treninky))}${radek('Kde', hodnota(k.misto))}` +
      `${radek('Trenér', hodnota(k.trener))}${radek('Kontakt', kontakt(k.kontakt))}${radek('Soutěž', hodnota(k.soutez) + (k.rozpis && k.rozpis.length ? '<br><a href="#zapasy-mladez">Zápasy a rozpis</a>' : ''))}</dl>` +
      `<a class="btn btn-accent kat-btn" href="#pridej-se" data-zajem="dite" data-kategorie="${esc(k.nazev)}">Přihlásit dítě</a></div></article>`).join('');
  }

  /* ---------- zápasy mládeže: pod zápasy mužů, ve stejné grafice ---------- */
  // turnajové soutěže (turnaje: true) spojí zápasy jednoho dne do jednoho řádku
  function renderMladezZapasy() {
    const box = $('[data-mladez-zapasy]');
    if (!box) return;
    const sekce = box.closest('section');
    const kat = MLADEZ.filter(k => k && k.nazev && Array.isArray(k.rozpis) && k.rozpis.length);
    if (!kat.length) { if (sekce) sekce.hidden = true; return; }
    const stav = $('[data-mladez-stav]');
    if (stav && window.MLADEZ_AKTUALIZOVANO) { const d = toDate(window.MLADEZ_AKTUALIZOVANO); stav.textContent = `Rozpis k ${d.getDate()}. ${d.getMonth() + 1}. ${d.getFullYear()}`; }
    const nm = n => (n === NAS ? `<span class="us">${esc(n)}</span>` : esc(n));
    box.innerHTML = kat.map(k => {
      const list = k.rozpis.filter(z => z && z.datum && z.souper).map(z => Object.assign({}, z, { dt: toDate(z.datum) })).sort((a, b) => a.dt - b.dt);
      let html = `<article class="next mz-kat"><p class="next-k"><span class="pulse" aria-hidden="true"></span><span>${esc(k.nazev)}</span>`;
      let radky;
      if (k.turnaje) {
        const dny = [];
        list.forEach(z => { const p = dny[dny.length - 1]; if (p && p.den === z.datum.slice(0, 10)) p.souperi.push(z.souper); else dny.push({ den: z.datum.slice(0, 10), dt: z.dt, souperi: [z.souper] }); });
        const dalsiDen = dny.find(p => p.dt.getTime() + 6 * 36e5 > Date.now());
        html += dalsiDen ? `<span class="next-when">${zaKolik(dniDo(dalsiDen.dt))}</span></p>` +
          `<p class="mz-turnaj"><span class="plate plate-time">${cas(dalsiDen.dt)}</span><span><span class="vs-date">${kratce(dalsiDen.dt)} · turnaj</span><span class="mz-turnaj-s">${esc(dalsiDen.souperi.join(', '))}</span></span></p>`
          : '</p><p class="next-none">Podzim je odehraný. Jarní turnaje sem dáme, jakmile je svaz zveřejní.</p>';
        radky = dny.map(p => `<li class="s-row s-turnaj${p.dt.getTime() + 6 * 36e5 < Date.now() ? ' is-played' : p === dalsiDen ? ' is-next' : ''}"><span class="s-d">${kratce(p.dt)} · ${cas(p.dt)} · turnaj</span><span class="s-t">${esc(p.souperi.join(', '))}</span></li>`).join('');
      } else {
        const dalsiZ = list.find(z => z.dt.getTime() + 2 * 36e5 > Date.now());
        if (dalsiZ) {
          const [h, a] = domaHoste(dalsiZ);
          html += `<span class="next-when">${zaKolik(dniDo(dalsiZ.dt))}</span></p><div class="plates">${tymBox(h, 'Domácí')}` +
            `<div class="vs"><span class="plate plate-time">${cas(dalsiZ.dt)}</span><span class="vs-date">${kratce(dalsiZ.dt)}</span></div>${tymBox(a, 'Hosté')}</div>` +
            `<p class="next-meta">${dlouze(dalsiZ.dt)} · výkop ${cas(dalsiZ.dt)} · ${dalsiZ.doma ? 'doma v Července' : `venku${dalsiZ.misto ? ', ' + esc(dalsiZ.misto) : ''}`}</p>`;
        } else html += '</p><p class="next-none">Sezóna je odehraná. Nový rozpis sem dáme, jakmile ho svaz zveřejní.</p>';
        radky = list.map(z => {
          const [h, a] = domaHoste(z);
          const cls = z.dt.getTime() + 2 * 36e5 < Date.now() ? ' is-played' : z === dalsiZ ? ' is-next' : '';
          return `<li class="s-row s-mz${cls}"><span class="s-d">${kratce(z.dt)} · ${cas(z.dt)}${z.doma ? "" : z.misto ? " · " + esc(z.misto) : ""}</span><span class="s-t">${nm(h)} – ${nm(a)}</span></li>`;
        }).join('');
      }
      return html + `<p class="mz-soutez">${esc(k.soutez || '')}</p>` +
        `<details class="season mz-season"><summary><span>Rozpis sezóny</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></summary>` +
        `<ol class="mz-list">${radky}</ol></details></article>`;
    }).join('');
  }

  /* ---------- partneři: loga, balíčky, doplňky ---------- */
  function renderPartneri() {
    const cena = c => (c != null && String(c).trim() ? esc(String(c).trim()) : 'Cena na dotaz');
    const txt = s => esc(s).replace(/(^|\s)(\p{Lu})-(?=\p{L})/gu, '$1$2‑');   // "A-mužstva" se nezlomí za pomlčkou
    // pruh pod úvodem: loga šedá, při najetí barevná; volná místa doplní zástupná pole
    const loga = $('[data-pruh-loga]');
    if (loga) {
      const list = (Array.isArray(PARTNERI.loga) ? PARTNERI.loga : []).filter(l => l && l.soubor);
      const volna = Math.max(0, (PARTNERI.pocetPolicek || 4) - list.length);
      loga.innerHTML = list.map(l => {
        const img = `<img src="${esc(l.soubor)}" alt="${esc(l.nazev || 'Logo partnera')}" loading="lazy" decoding="async">`;
        return `<li class="logo">${l.web ? `<a href="${esc(l.web)}" target="_blank" rel="noopener" aria-label="${esc((l.nazev || 'Web partnera') + ' (otevře se v nové záložce)')}">${img}</a>` : img}</li>`;
      }).join('') + '<li class="logo logo-ph">Místo pro vaše logo</li>'.repeat(volna);
    }
    const bal = $('[data-balicky]');
    if (bal) {
      bal.innerHTML = (PARTNERI.balicky || []).map(b => `<article class="balicek${b.zvyraznit ? ' is-top' : ''}">` +
        `${b.zvyraznit && b.stitek ? `<p class="balicek-stitek">${esc(b.stitek)}</p>` : ''}` +
        `<h4 class="balicek-n">${esc(b.nazev)}</h4><p class="balicek-cena">${cena(b.cena)}</p>` +
        `<ul class="balicek-list">${b.zahrnuje ? `<li class="vse">Vše z balíčku ${esc(b.zahrnuje)}</li>` : ''}` +
        `${(b.vyhody || []).map(v => `<li>${txt(v)}</li>`).join('')}</ul></article>`).join('');
    }
    const dop = $('[data-doplnky]');
    if (dop) {
      dop.innerHTML = (PARTNERI.doplnky || []).map(d => `<li class="doplnek"><span class="doplnek-n">${esc(d.nazev)}</span>` +
        `${d.popis ? `<span class="doplnek-p">${esc(d.popis)}</span>` : ''}<span class="doplnek-c">${cena(d.cena)}</span></li>`).join('');
    }
  }

  /* ---------- rozdělení nadpisů na písmena a slova ---------- */
  function splitText() {
    $$('[data-split]').forEach((el, n) => {
      const mode = el.dataset.split;
      const r = rng(1945 + n * 77);
      const words = el.textContent.trim().split(/\s+/);
      const total = words.join('').length;
      let ci = 0;
      el.textContent = '';
      words.forEach((w, wi) => {
        const ws = document.createElement('span');
        ws.className = 'w';
        if (mode === 'words') {
          ws.textContent = w;
          ws.style.setProperty('--th', (wi * 0.12).toFixed(3));
          if (wi === words.length - 1) ws.classList.add('em');
        } else {
          for (const ch of w) {
            const c = document.createElement('span');
            c.className = 'c';
            c.textContent = ch;
            c.style.setProperty('--th', (ci / total * 0.5 + r() * 0.06).toFixed(3));
            c.style.setProperty('--jr', ((r() * 2 - 1) * 12).toFixed(1) + 'deg');
            ws.appendChild(c);
            ci++;
          }
        }
        el.appendChild(ws);
        if (wi < words.length - 1) el.appendChild(document.createTextNode(' '));
      });
    });
  }

  /* ---------- úvod: pohled zpoza branky, míč letí do sítě ---------- */
  function initHero() {
    if (document.documentElement.dataset.hero === 'foto') return;   // varianta s fotkou je čisté HTML a CSS
    const hero = $('#uvod'), stage = $('[data-stage]'), canvas = $('[data-scene]');
    if (!hero || !stage || !canvas || !canvas.getContext) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;
    const gap = $('[data-hero-gap]', stage);
    const cue = $('[data-cue]', stage);

    // kamera stojí 8 m za brankovou čarou ve výšce očí; rozměry v metrech, kreslí se do plochy 1600 x 900
    const F = 1023.5, EYE = 1.4, HZ = 520, VX = 800;
    const ZG = 7.97, ZSPOT = ZG + 11, ZBT = 7.07, ZBB = 6.37, BX = 3.82, BY = 2.3, L = 105;
    const px = (X, Z) => VX + F * X / Z;
    const py = (Y, Z) => HZ - F * (Y - EYE) / Z;
    const P = (X, Y, Z) => [px(X, Z), py(Y, Z)];
    const netZ = Y => lerp(ZBT, ZBB, 1 - Y / BY);
    const poly = (path, pts) => { path.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) path.lineTo(pts[i][0], pts[i][1]); path.closePath(); };

    // stromy a topoly na obzoru
    const treeline = (seed, base, hMin, hMax, step) => {
      const r = rng(seed), p = new Path2D();
      let x = -2600, y = base - lerp(hMin, hMax, r());
      p.moveTo(x, base + 2); p.lineTo(x, y);
      while (x < 4200) {
        const w = step * (0.6 + r() * 0.9), nx = x + w, ny = base - lerp(hMin, hMax, r());
        p.quadraticCurveTo(x + w / 2, Math.min(y, ny) - (6 + r() * 16), nx, ny);
        x = nx; y = ny;
      }
      p.lineTo(x, base + 2); p.closePath();
      return p;
    };
    const treesFar = treeline(7, 529, 12, 36, 26);
    const treesNear = treeline(45, 531, 22, 66, 36);
    const poplars = new Path2D();
    const poplar = (x, h, w) => {
      const b = 534;
      poplars.moveTo(x, b);
      poplars.bezierCurveTo(x - w * 0.62, b - h * 0.3, x - w * 0.5, b - h * 0.78, x + w * 0.04, b - h);
      poplars.bezierCurveTo(x + w * 0.52, b - h * 0.76, x + w * 0.6, b - h * 0.3, x, b);
      poplars.closePath();
    };
    poplar(396, 152, 27); poplar(441, 128, 23); poplar(1224, 90, 18); poplar(1251, 74, 15);

    // hřiště: pruhy po sekání a čáry
    const pitch = new Path2D(), stripes = new Path2D();
    poly(pitch, [P(-34, 0, ZG), P(34, 0, ZG), P(34, 0, ZG + L), P(-34, 0, ZG + L)]);
    for (let k = 0; k < 20; k += 2) {
      const z0 = ZG + k * 5.25, z1 = z0 + 5.25;
      poly(stripes, [P(-34, 0, z0), P(34, 0, z0), P(34, 0, z1), P(-34, 0, z1)]);
    }
    const chalk = new Path2D(), chalkFar = new Path2D(), strokes = [];
    const LW = 0.12;
    const lineX = (X0, X1, Z) => {
      const t = F * EYE * LW / (Z * Z);
      if (t >= 1.2) poly(chalk, [P(X0, 0, Z - LW / 2), P(X1, 0, Z - LW / 2), P(X1, 0, Z + LW / 2), P(X0, 0, Z + LW / 2)]);
      else { const p = new Path2D(); p.moveTo(px(X0, Z), py(0, Z)); p.lineTo(px(X1, Z), py(0, Z)); strokes.push({ p, w: 1.1, a: clamp(0.3 + t * 0.4, 0.3, 0.72) }); }
    };
    const lineZ = (X, Z0, Z1) => poly(Z1 - ZG > 40 ? chalkFar : chalk, [P(X - LW / 2, 0, Z0), P(X + LW / 2, 0, Z0), P(X + LW / 2, 0, Z1), P(X - LW / 2, 0, Z1)]);
    const HB = 20.16, H6 = 9.16;
    lineX(-34, 34, ZG);
    lineX(-H6, H6, ZG + 5.5); lineZ(-H6, ZG, ZG + 5.5); lineZ(H6, ZG, ZG + 5.5);
    lineX(-HB, HB, ZG + 16.5); lineZ(-HB, ZG, ZG + 16.5); lineZ(HB, ZG, ZG + 16.5);
    lineZ(-34, ZG, ZG + L); lineZ(34, ZG, ZG + L);
    lineX(-34, 34, ZG + L / 2);
    lineX(-HB, HB, ZG + L - 16.5); lineZ(-HB, ZG + L - 16.5, ZG + L); lineZ(HB, ZG + L - 16.5, ZG + L);
    lineX(-34, 34, ZG + L);
    const curve = (n, fn, closed) => { const p = new Path2D(); for (let i = 0; i <= n; i++) { const [X, Z] = fn(i / n); i ? p.lineTo(px(X, Z), py(0, Z)) : p.moveTo(px(X, Z), py(0, Z)); } if (closed) p.closePath(); return p; };
    strokes.push({ p: curve(40, t => { const th = lerp(-0.925, 0.925, t); return [9.15 * Math.sin(th), ZSPOT + 9.15 * Math.cos(th)]; }), w: 1.3, a: 0.62 });
    strokes.push({ p: curve(72, t => [9.15 * Math.sin(t * TAU), ZG + L / 2 + 9.15 * Math.cos(t * TAU)], true), w: 1, a: 0.36 });
    const spot = curve(24, t => [0.17 * Math.cos(t * TAU), ZSPOT + 0.17 * Math.sin(t * TAU)], true);

    // branka: tyče, břevno, boční sítě a střecha sítě
    const frame = new Path2D(), frameShade = new Path2D(), PW = 0.12;
    [-3.66, 3.66].forEach(X => {
      poly(frame, [P(X - PW / 2, 0, ZG), P(X + PW / 2, 0, ZG), P(X + PW / 2, 2.44 + PW / 2, ZG), P(X - PW / 2, 2.44 + PW / 2, ZG)]);
      poly(frameShade, [P(X + PW * 0.12, 0, ZG), P(X + PW / 2, 0, ZG), P(X + PW / 2, 2.44 - PW / 2, ZG), P(X + PW * 0.12, 2.44 - PW / 2, ZG)]);
    });
    poly(frame, [P(-3.66 - PW / 2, 2.44 - PW / 2, ZG), P(3.66 + PW / 2, 2.44 - PW / 2, ZG), P(3.66 + PW / 2, 2.44 + PW / 2, ZG), P(-3.66 - PW / 2, 2.44 + PW / 2, ZG)]);
    const sideNet = new Path2D();
    const seg = (path, a, b) => { path.moveTo(a[0], a[1]); path.lineTo(b[0], b[1]); };
    [-1, 1].forEach(sx => {
      for (let i = 0; i <= 20; i++) { const t = i / 20, Yb = BY * t; seg(sideNet, P(sx * 3.66, 2.44 * t, ZG), P(sx * BX, Yb, netZ(Yb))); }
      for (let j = 1; j < 9; j++) { const s = j / 9, X = lerp(3.66, BX, s) * sx; seg(sideNet, P(X, 0, lerp(ZG, ZBB, s)), P(X, lerp(2.44, BY, s), lerp(ZG, ZBT, s))); }
    });
    for (let i = 0; i <= 32; i++) { const X = lerp(-3.66, 3.66, i / 32); seg(sideNet, P(X, 2.44, ZG), P(X * BX / 3.66, BY, ZBT)); }

    // zadní síť: mřížka bodů, která se při gólu vyboulí
    const NU = 64, NV = 19, NN = (NU + 1) * (NV + 1);
    const bx = new Float32Array(NN), by = new Float32Array(NN), bw = new Float32Array(NN);
    const nx = new Float32Array(NN), ny = new Float32Array(NN), ns = new Float32Array(NN);
    const jr = rng(1287);
    for (let j = 0; j <= NV; j++) {
      for (let i = 0; i <= NU; i++) {
        const u = i / NU, v = j / NV, k = j * (NU + 1) + i;
        const edge = i === 0 || i === NU || j === 0 || j === NV;
        const X = lerp(-BX, BX, u), Y = BY * (1 - v), Z = lerp(ZBT, ZBB, v);
        bx[k] = px(X, Z) + (edge ? 0 : (jr() - 0.5) * 1.1);
        by[k] = py(Y, Z) + (edge ? 0 : (jr() - 0.5) * 1.1 + Math.sin(u * Math.PI) * Math.sin(v * Math.PI) * 3);
        bw[k] = smooth(Math.min(u, 1 - u), 0, 0.09) * smooth(Math.min(v, 1 - v), 0, 0.12);
      }
    }

    // míč: šestiúhelníky jako pětiúhelníkové záplaty v jednotkových souřadnicích
    const pentas = new Path2D();
    const penta = (cx, cy, r, rot) => { for (let i = 0; i < 5; i++) { const a = rot + i * TAU / 5 - Math.PI / 2; const x = cx + r * Math.cos(a), y = cy + r * Math.sin(a); i ? pentas.lineTo(x, y) : pentas.moveTo(x, y); } pentas.closePath(); };
    penta(0, 0, 0.36, 0);
    for (let i = 0; i < 5; i++) { const a = i * TAU / 5 + Math.PI / 2; penta(0.94 * Math.cos(a), 0.94 * Math.sin(a), 0.36, a + Math.PI / 2); }

    // průběh: výkop, let, náraz do sítě, pád, klid
    const KICK = 0.1, HIT = 0.52, PUSH = 0.565, REST = 0.86;
    const ZHIT = netZ(1.5) + 0.11;
    const ZC = P(1.3, 1.2, ZHIT);
    const ball = { X: 0, Y: 0.11, Z: ZSPOT, rot: 0 };
    const dropY = tau => {
      const g = 0.09;
      if (tau < g) { const s = tau / g; return 1.44 - 1.33 * s * s; }
      let t0 = g;
      for (const [d, h] of [[0.065, 0.36], [0.04, 0.12], [0.025, 0.04]]) {
        if (tau < t0 + d) { const s = (tau - t0) / d; return 0.11 + h * 4 * s * (1 - s); }
        t0 += d;
      }
      return 0.11;
    };
    const ballAt = p => {
      if (p <= KICK) { ball.X = 0; ball.Y = 0.11; ball.Z = ZSPOT; ball.rot = 0; }
      else if (p <= HIT) {
        const t = (p - KICK) / (HIT - KICK);
        ball.X = 1.9 * t; ball.Z = lerp(ZSPOT, ZHIT, t); ball.Y = lerp(0.11, 1.5, t) + 2 * t * (1 - t); ball.rot = t * 10;
      } else if (p <= PUSH) {
        const t = easeOut((p - HIT) / (PUSH - HIT));
        ball.X = 1.9 + 0.06 * t; ball.Y = 1.5 - 0.06 * t; ball.Z = ZHIT - 0.42 * t; ball.rot = 10 + t * 0.5;
      } else {
        const tau = p - PUSH;
        ball.Z = lerp(ZHIT - 0.42, ZHIT + 0.15, easeOut(clamp(tau / 0.07, 0, 1)));
        ball.X = lerp(1.96, 1.45, easeOut(clamp(tau / (REST - PUSH), 0, 1)));
        ball.Y = dropY(tau);
        ball.rot = 10.5 + (1.96 - ball.X) / 0.11;
      }
      return ball;
    };
    const netD = p => {
      if (p <= HIT) return 0;
      if (p <= PUSH) return 0.85 * easeOut((p - HIT) / (PUSH - HIT));
      const tau = p - PUSH;
      const d = 0.85 * Math.exp(-tau / 0.05) * Math.cos(tau * TAU / 0.085);
      return Math.abs(d) < 0.002 ? 0 : d;
    };
    const camZ = p => 1 + 0.15 * easeInOut(clamp((p - 0.06) / 0.5, 0, 1)) - 0.07 * easeInOut(clamp((p - 0.62) / 0.38, 0, 1));
    const C_PUSH = (() => { const b = ballAt(PUSH); return P(b.X, b.Y, b.Z); })();

    let W = 1, H = 1, DPR = 1, S = 1, offX = 0, offY = 0, staticMode = false;
    let skyG, glowG, groundG, hazeG, vigG, shadeG;
    const gradients = () => {
      skyG = ctx.createLinearGradient(0, -420, 0, HZ + 14);
      [[0, '#051209'], [0.42, '#0a1f15'], [0.74, '#143726'], [0.9, '#2b5843'], [0.97, '#6a967c'], [1, '#a4c3ad']].forEach(s => skyG.addColorStop(s[0], s[1]));
      glowG = ctx.createRadialGradient(0, 0, 0, 0, 0, 1300);
      glowG.addColorStop(0, 'rgba(196,222,204,.34)'); glowG.addColorStop(1, 'rgba(196,222,204,0)');
      groundG = ctx.createLinearGradient(0, 524, 0, 980);
      [[0, '#2b5d41'], [0.08, '#1f4d33'], [0.5, '#173f28'], [1, '#0d2a19']].forEach(s => groundG.addColorStop(s[0], s[1]));
      hazeG = ctx.createLinearGradient(0, HZ - 34, 0, HZ + 74);
      hazeG.addColorStop(0, 'rgba(170,200,180,0)'); hazeG.addColorStop(0.36, 'rgba(170,200,180,.26)'); hazeG.addColorStop(1, 'rgba(170,200,180,0)');
      vigG = ctx.createLinearGradient(0, 650, 0, 1000);
      vigG.addColorStop(0, 'rgba(3,10,6,0)'); vigG.addColorStop(1, 'rgba(3,10,6,.62)');
      shadeG = ctx.createRadialGradient(-0.38, -0.42, 0.05, 0, 0, 1.05);
      shadeG.addColorStop(0, 'rgba(255,255,255,.6)'); shadeG.addColorStop(0.42, 'rgba(255,255,255,0)'); shadeG.addColorStop(0.78, 'rgba(6,20,12,.16)'); shadeG.addColorStop(1, 'rgba(6,20,12,.58)');
    };

    const drawBall = (b, sc) => {
      const [x, y] = P(b.X, b.Y, b.Z);
      const r = F * 0.11 / b.Z * 2.4;
      const [sx, sy] = P(b.X, 0, b.Z);
      const hgt = Math.max(0, b.Y - 0.11);
      ctx.globalAlpha = 0.42 * (1 - clamp(hgt / 2.2, 0, 0.85));
      ctx.fillStyle = '#020805';
      ctx.beginPath(); ctx.ellipse(sx, sy, r * (1 + hgt * 0.5), Math.max(r * 0.3 * (1 + hgt * 0.3), 0.6 / sc), 0, 0, TAU); ctx.fill();
      ctx.globalAlpha = 1;
      ctx.save();
      ctx.translate(x, y); ctx.scale(r, r);
      ctx.beginPath(); ctx.arc(0, 0, 1, 0, TAU);
      ctx.fillStyle = '#eef2ea'; ctx.fill();
      ctx.save(); ctx.clip(); ctx.rotate(b.rot); ctx.fillStyle = '#10261a'; ctx.fill(pentas); ctx.restore();
      ctx.fillStyle = shadeG; ctx.fill();
      ctx.restore();
    };

    const buckets = [];
    const drawNet = (p, sc) => {
      const D = staticMode ? 0 : netD(p);
      let cx = 0, cy = 0;
      if (D !== 0) {
        if (p < PUSH) { const b = ballAt(p); [cx, cy] = P(b.X, b.Y, b.Z); } else [cx, cy] = C_PUSH;
      }
      const inv = 1 / (118 * 118);
      for (let k = 0; k < NN; k++) {
        let x = bx[k], y = by[k], m = 0;
        if (D !== 0 && bw[k] > 0) {
          const dx = x - cx, dy = y - cy;
          m = D * Math.exp(-(dx * dx + dy * dy) * inv) * bw[k];
          x += dx * m; y += dy * m;
        }
        nx[k] = x; ny[k] = y; ns[k] = m;
      }
      for (let i = 0; i < 8; i++) buckets[i] = new Path2D();
      const add = (a, b, edge) => {
        const m = (ns[a] + ns[b]) * 0.5;
        let f = 1 + (m > 0 ? 1.15 * m : 0.6 * m);
        if (edge) f *= 1.7;
        const pth = buckets[clamp(Math.round((f - 0.7) / 0.25), 0, 7)];
        pth.moveTo(nx[a], ny[a]); pth.lineTo(nx[b], ny[b]);
      };
      for (let j = 0; j <= NV; j++) for (let i = 0; i < NU; i++) { const a = j * (NU + 1) + i; add(a, a + 1, j === 0 || j === NV); }
      for (let i = 0; i <= NU; i++) for (let j = 0; j < NV; j++) { const a = j * (NU + 1) + i; add(a, a + NU + 1, i === 0 || i === NU); }
      const base = Math.max(1.15, 0.85 / sc);
      ctx.save();
      ctx.translate(0.7, 1.1);
      ctx.strokeStyle = 'rgba(3,10,6,.3)';
      buckets.forEach((pth, i) => { ctx.lineWidth = base * (0.7 + i * 0.25); ctx.stroke(pth); });
      ctx.restore();
      ctx.strokeStyle = 'rgba(234,241,232,.47)';
      buckets.forEach((pth, i) => { ctx.lineWidth = base * (0.7 + i * 0.25); ctx.stroke(pth); });
    };

    const render = p => {
      const z = staticMode ? 1 : camZ(p);
      const sc = S * z;
      const ex = offX + S * ZC[0] * (1 - z), ey = offY + S * ZC[1] * (1 - z);
      ctx.setTransform(DPR * sc, 0, 0, DPR * sc, DPR * ex, DPR * ey);
      const x0 = -ex / sc - 4, x1 = (W - ex) / sc + 4, y0 = -ey / sc - 4, y1 = (H - ey) / sc + 4;
      const minW = 0.9 / sc;

      ctx.fillStyle = skyG; ctx.fillRect(x0, y0, x1 - x0, HZ + 14 - y0);
      ctx.save(); ctx.translate(VX, HZ + 6); ctx.scale(1, 0.2); ctx.fillStyle = glowG; ctx.fillRect(-1400, -1400, 2800, 2800); ctx.restore();
      ctx.fillStyle = groundG; ctx.fillRect(x0, 524, x1 - x0, y1 - 524);
      ctx.fillStyle = '#1d4431'; ctx.fill(treesFar);
      ctx.fillStyle = '#0a1d13'; ctx.fill(treesNear);
      ctx.fillStyle = '#081910'; ctx.fill(poplars);
      ctx.fillStyle = 'rgba(70,150,100,.09)'; ctx.fill(pitch);
      ctx.fillStyle = 'rgba(255,255,255,.035)'; ctx.fill(stripes);
      ctx.fillStyle = 'rgba(236,242,232,.36)'; ctx.fill(chalkFar);
      ctx.fillStyle = 'rgba(236,242,232,.74)'; ctx.fill(chalk); ctx.fill(spot);
      strokes.forEach(s => { ctx.strokeStyle = `rgba(236,242,232,${s.a})`; ctx.lineWidth = Math.max(s.w, minW); ctx.stroke(s.p); });
      ctx.fillStyle = hazeG; ctx.fillRect(x0, HZ - 34, x1 - x0, 108);
      ctx.fillStyle = '#edf1ea'; ctx.fill(frame);
      ctx.fillStyle = 'rgba(10,30,18,.2)'; ctx.fill(frameShade);
      ctx.strokeStyle = 'rgba(230,238,228,.26)'; ctx.lineWidth = Math.max(1, minW); ctx.stroke(sideNet);
      drawBall(staticMode ? ballAt(1) : ballAt(p), sc);
      drawNet(p, sc);
      ctx.fillStyle = vigG; ctx.fillRect(x0, 650, x1 - x0, Math.max(0, y1 - 650));
    };

    const layout = () => {
      W = Math.max(1, stage.clientWidth); H = Math.max(1, stage.clientHeight);
      DPR = Math.min(2, window.devicePixelRatio || 1);
      const cw = Math.round(W * DPR), ch = Math.round(H * DPR);
      if (canvas.width !== cw || canvas.height !== ch) { canvas.width = cw; canvas.height = ch; }
      if (staticMode && gap) {
        const top = gap.offsetTop, h = Math.max(140, gap.offsetHeight);
        S = Math.min(W * 0.98 / (W < 600 ? 960 : 1060), h / 430);
        offX = W / 2 - 800 * S;
        offY = top + h / 2 - 573 * S;
      } else {
        S = Math.min(W * 0.98 / 1300, H * 0.62 / 520);
        offX = W / 2 - 800 * S;
        offY = H * 0.36 - 330 * S;
      }
      stage.style.setProperty('--hz', (offY + HZ * S).toFixed(1) + 'px');
    };

    // řízení scrollem: plynulé dotahování, smyčka se zastaví, když není co dělat
    const bands = $$('[data-band]', stage).map((el, i, all) => ({ el, a: +el.dataset.a, b: +el.dataset.b, ramp: +el.dataset.ramp || 0.1, first: i === 0, last: i === all.length - 1, op: -1, k: -1, vis: null }));
    let target = 0, shown = 0, drawn = -1, rafId = null, lastTick = 0, heroOn = true, scrubOn = false, loadT0 = 0, loadK = 0, cueOp = -1;
    const progress = () => { const range = hero.offsetHeight - innerHeight; return range > 0 ? clamp(-hero.getBoundingClientRect().top / range, 0, 1) : 0; };

    const updateBands = p => {
      const lk = easeOut(loadK);
      for (const b of bands) {
        const f = 0.06;
        const op = (b.first ? 1 : smooth(p, b.a, b.a + f)) * (b.last ? 1 : 1 - smooth(p, b.b - f, b.b));
        let k = clamp((p - b.a) / b.ramp, 0, 1);
        if (b.first) k = Math.max(k, lk);
        const o = Math.round(op * 1000) / 1000;
        if (o !== b.op) {
          b.op = o; b.el.style.opacity = o;
          const vis = o > 0.01;
          if (vis !== b.vis) { b.vis = vis; b.el.style.visibility = vis ? 'visible' : 'hidden'; }
        }
        if (Math.abs(k - b.k) >= 0.008 || ((k === 0 || k === 1) && k !== b.k)) { b.k = k; b.el.style.setProperty('--k', k.toFixed(3)); }
      }
      if (cue) {
        const c = Math.round((1 - smooth(p, 0.015, 0.08)) * 100) / 100;
        if (c !== cueOp) { cueOp = c; cue.style.opacity = c; cue.style.visibility = c > 0.01 ? 'visible' : 'hidden'; }
      }
    };

    const tick = now => {
      const dt = Math.min(100, now - (lastTick || now));
      lastTick = now;
      shown += (target - shown) * (1 - Math.pow(1 - 0.14, dt / 16.667));
      const conv = Math.abs(target - shown) < 0.0004;
      if (conv) shown = target;
      if (loadT0) loadK = clamp((now - loadT0) / 1200, 0, 1);
      if (shown !== drawn) { render(shown); drawn = shown; }
      updateBands(shown);
      if (conv && loadK >= 1) { rafId = null; lastTick = 0; }
      else rafId = requestAnimationFrame(tick);
    };
    const wake = () => { if (rafId === null && heroOn && scrubOn) rafId = requestAnimationFrame(tick); };
    const onScroll = () => { target = progress(); wake(); };

    const GATES = [
      '(max-width: 720px)',
      '(orientation: portrait) and (max-width: 1024px)',
      '(orientation: portrait) and (pointer: coarse)',
      '(orientation: landscape) and (pointer: coarse) and (max-height: 560px)',
      '(prefers-reduced-motion: reduce)'
    ];
    const MQLS = GATES.map(q => matchMedia(q));
    const enableScrub = () => {
      if (scrubOn) return;
      scrubOn = true; staticMode = false;
      bands.forEach(b => { b.op = -1; b.k = -1; b.vis = null; });
      cueOp = -1;
      layout();
      target = shown = progress();
      if (!loadT0) loadT0 = performance.now();
      addEventListener('scroll', onScroll, { passive: true });
      render(shown); drawn = shown;
      updateBands(shown);
      wake();
    };
    const disableScrub = () => {
      if (staticMode && !scrubOn) return;
      scrubOn = false; staticMode = true;
      removeEventListener('scroll', onScroll);
      if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; lastTick = 0; }
      bands.forEach(b => { b.el.style.removeProperty('opacity'); b.el.style.removeProperty('visibility'); b.el.style.removeProperty('--k'); });
      if (cue) { cue.style.removeProperty('opacity'); cue.style.removeProperty('visibility'); }
      layout(); render(1); drawn = -1;
    };
    const applyHeroMode = () => (MQLS.some(m => m.matches) ? disableScrub() : enableScrub());
    MQLS.forEach(m => onMQ(m, applyHeroMode));

    gradients();
    applyHeroMode();

    new IntersectionObserver(([e]) => { heroOn = e.isIntersecting; if (heroOn) { target = progress(); wake(); } }).observe(hero);
    const relayout = () => {
      layout();
      if (staticMode) render(1);
      else { target = shown = progress(); render(shown); drawn = shown; updateBands(shown); }
    };
    if ('ResizeObserver' in window) new ResizeObserver(relayout).observe(stage);
    else addEventListener('resize', relayout);
  }

  /* ---------- příchody, živé prvky, pauza ---------- */
  function initReveal() {
    const els = $$('[data-reveal]');
    if (RM.matches || !('IntersectionObserver' in window)) { els.forEach(el => el.classList.add('in', 'done')); return; }
    els.forEach(el => Array.from(el.children).forEach((c, i) => c.style.setProperty('--i', Math.min(i, 8))));
    // ukáže se, když je vidět 12 % prvku, nebo u vysokých prvků (galerie na mobilu), když zabírá aspoň pětinu obrazovky
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if (!e.isIntersecting) return;
      if (e.intersectionRatio < 0.12 && e.intersectionRect.height < innerHeight * 0.2) return;
      const el = e.target;
      io.unobserve(el);
      el.classList.add('in');
      setTimeout(() => el.classList.add('done'), Math.min(el.children.length, 9) * 90 + 1100);
    }), { threshold: [0, 0.01, 0.02, 0.05, 0.12], rootMargin: '0px 0px -6% 0px' });
    els.forEach(el => io.observe(el));
  }

  function initInview() {
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle('inview', e.isIntersecting)), { rootMargin: '10% 0px' });
      $$('.sec, .hero').forEach(el => io.observe(el));
    } else $$('.sec, .hero').forEach(el => el.classList.add('inview'));
    document.addEventListener('visibilitychange', () => document.body.classList.toggle('paused', document.hidden));
  }

  let pinned = RM.matches;
  let timelinePin = null, countersFinish = null;

  function initTimeline() {
    const tl = $('[data-timeline]');
    if (!tl) return;
    let on = false, raf = null, last = -1;
    const update = () => {
      raf = null;
      if (pinned) return;
      const r = tl.getBoundingClientRect();
      const q = Math.round(clamp((innerHeight * 0.72 - r.top) / Math.max(1, r.height), 0, 1) * 400) / 400;
      if (q !== last) { last = q; tl.style.setProperty('--draw', q); }
    };
    if ('IntersectionObserver' in window) new IntersectionObserver(([e]) => { on = e.isIntersecting; if (on) update(); }).observe(tl);
    else on = true;
    addEventListener('scroll', () => { if (on && raf === null) raf = requestAnimationFrame(update); }, { passive: true });
    timelinePin = v => { if (v) tl.style.setProperty('--draw', 1); else { last = -1; update(); } };
    if (pinned) timelinePin(true);
  }

  function initCounters() {
    const box = $('[data-stats]');
    if (!box) return;
    const els = $$('[data-count]', box);
    let running = false;
    const fin = () => { running = false; els.forEach(el => { el.textContent = el.dataset.count + (el.dataset.suf || ''); }); };
    countersFinish = fin;
    if (pinned || !('IntersectionObserver' in window)) return fin();
    els.forEach(el => { el.textContent = '0' + (el.dataset.suf || ''); });
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      running = true;
      const step = now => {
        if (!running) return;
        const t = clamp((now - t0) / 1300, 0, 1), k = easeOut(t);
        els.forEach(el => { const s = Math.round(+el.dataset.count * k) + (el.dataset.suf || ''); if (el.textContent !== s) el.textContent = s; });
        if (t < 1 && !pinned) requestAnimationFrame(step); else fin();
      };
      requestAnimationFrame(step);
    }, { threshold: 0.4 });
    io.observe(box);
  }

  /* ---------- prohlížeč fotek přes celou obrazovku (galerie i historie) ---------- */
  // vrací funkci otevri(seznam, index, tlačítko); seznam = [{ src, w, h, popis }]
  function initLightbox() {
    const dlg = $('[data-lightbox]');
    if (!dlg || typeof dlg.showModal !== 'function') return null;
    const img = $('[data-lb-img]', dlg), cap = $('[data-lb-cap]', dlg), cnt = $('[data-lb-count]', dlg);
    const prev = $('[data-lb-prev]', dlg), next = $('[data-lb-next]', dlg);
    let list = [], cur = 0, opener = null, sx = null, swiped = false;
    const show = i => {
      cur = (i + list.length) % list.length;
      const g = list[cur];
      if (g.w) { img.width = g.w; img.height = g.h; } else { img.removeAttribute('width'); img.removeAttribute('height'); }
      img.src = g.src;
      img.alt = g.popis || `Fotka ${cur + 1}`;
      cap.textContent = g.popis || '';
      cnt.textContent = `${cur + 1} / ${list.length}`;
      if (list.length > 1) [cur + 1, cur - 1].forEach(j => { const p = new Image(); p.src = list[(j + list.length) % list.length].src; });
    };
    const posun = d => { if (list.length > 1) show(cur + d); };
    prev.addEventListener('click', () => posun(-1));
    next.addEventListener('click', () => posun(1));
    $('[data-lb-close]', dlg).addEventListener('click', () => dlg.close());
    dlg.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); posun(-1); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); posun(1); }
    });
    dlg.addEventListener('close', () => { document.documentElement.classList.remove('lb-open'); if (opener) opener.focus(); });
    dlg.addEventListener('pointerdown', e => { sx = e.clientX; swiped = false; });
    dlg.addEventListener('pointerup', e => {
      if (sx === null) return;
      const dx = e.clientX - sx;
      sx = null;
      if (Math.abs(dx) > 50 && list.length > 1) { swiped = true; posun(dx < 0 ? 1 : -1); }
    });
    dlg.addEventListener('click', e => { if (e.target === dlg && !swiped) dlg.close(); swiped = false; });
    return (seznam, i, btn) => {
      list = seznam;
      opener = btn || null;
      [prev, next, cnt].forEach(el => { el.hidden = list.length < 2; });
      show(i);
      dlg.showModal();
      document.documentElement.classList.add('lb-open');
    };
  }
  const otevriFotku = initLightbox();

  /* ---------- galerie ---------- */
  function initGallery() {
    const box = $('[data-gallery]');
    if (!box) return;
    box.setAttribute('data-reveal', '');
    if (!GALERIE.length) {
      const ikona = '<svg viewBox="0 0 200 200"><g fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><rect x="30" y="50" width="140" height="100" rx="6"/><circle cx="72" cy="88" r="12"/><path d="M30 138l44-34 30 24 26-20 40 30"/></g></svg>';
      box.classList.add('is-empty');
      box.innerHTML = ['Tým', 'Zápas', 'Fanoušci', 'Oslava 80 let', 'Mládež', 'Hřiště']
        .map(l => `<div class="gal-ph slot" aria-hidden="true"><div class="ph" data-label="${l}">${ikona}</div></div>`).join('') +
        '<p class="gal-note">Fotky sem brzy přidáme.</p>';
      return;
    }
    box.innerHTML = GALERIE.map((g, i) => `<button class="gal-item" type="button" data-i="${i}"${g.nw && g.nh ? ` style="--ar:${(g.nw / g.nh).toFixed(4)}"` : ''}>` +
      `<img src="${esc(g.nahled || g.src)}"${g.nw ? ` width="${g.nw}" height="${g.nh}"` : ''} alt="${esc(g.popis || 'Fotka z galerie ' + (i + 1))}" loading="lazy" decoding="async">` +
      `${g.popis ? `<span class="gal-cap" aria-hidden="true">${esc(g.popis)}</span>` : ''}</button>`).join('');
    box.addEventListener('click', e => {
      const b = e.target.closest('.gal-item');
      if (!b) return;
      if (otevriFotku) otevriFotku(GALERIE, +b.dataset.i, b);
      else window.open(GALERIE[+b.dataset.i].src, '_blank', 'noopener');
    });
  }

  /* ---------- historické fotky u milníků ---------- */
  // fotka se ukáže, jen když soubor opravdu existuje; jinak zůstane zástupné pole
  function initHistorieFotky() {
    const nactene = [];
    $$('[data-tl-foto]').forEach(fig => {
      const src = fig.dataset.tlFoto, popis = fig.dataset.popis || '';
      const pokus = new Image();
      pokus.onload = () => {
        const polozka = { src, w: pokus.naturalWidth, h: pokus.naturalHeight, popis };
        nactene.push({ fig, polozka });
        nactene.sort((a, b) => (a.fig.compareDocumentPosition(b.fig) & 2 ? 1 : -1));
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'tl-foto-btn';
        btn.setAttribute('aria-label', `Zvětšit fotku: ${popis}`);
        btn.innerHTML = `<img src="${esc(src)}" alt="${esc(popis)}" decoding="async">`;
        btn.addEventListener('click', () => {
          const i = nactene.findIndex(n => n.fig === fig);
          if (otevriFotku) otevriFotku(nactene.map(n => n.polozka), i, btn);
          else window.open(src, '_blank', 'noopener');
        });
        fig.innerHTML = '';
        fig.appendChild(btn);
        fig.classList.add('has-photo');
      };
      pokus.src = src;
    });
  }

  /* ---------- navigace ---------- */
  function initNav() {
    const nav = $('[data-nav]'), btn = $('[data-menu-btn]'), menu = $('[data-menu]');
    if (!nav) return;
    let solid = null;
    const check = () => { const s = scrollY > 12; if (s !== solid) { solid = s; nav.classList.toggle('solid', s); } };
    addEventListener('scroll', check, { passive: true });
    check();
    if (btn && menu) {
      const setOpen = open => {
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        menu.hidden = !open;
        nav.classList.toggle('open', open);
        document.documentElement.classList.toggle('menu-open', open);
      };
      btn.addEventListener('click', () => setOpen(btn.getAttribute('aria-expanded') !== 'true'));
      menu.addEventListener('click', e => { if (e.target.closest('a')) setOpen(false); });
      addEventListener('keydown', e => { if (e.key === 'Escape' && !menu.hidden) { setOpen(false); btn.focus(); } });
      onMQ(matchMedia('(min-width: 921px)'), e => { if (e.matches) setOpen(false); });
    }
    // zvýraznění sekce, ve které právě jsme; v úvodu se nezvýrazňuje nic
    const links = $$('.nav-links a');
    const map = new Map(links.map(a => [a.getAttribute('href').slice(1), a]));
    // Mládež leží uvnitř Týmů, proto vyhrává poslední sekce v pořadí stránky, která je zrovna uprostřed obrazovky
    if (!('IntersectionObserver' in window)) return;
    const secs = $$('main > section, #mladez');
    const vidim = new Set();
    const io = new IntersectionObserver(es => {
      es.forEach(e => (e.isIntersecting ? vidim.add(e.target) : vidim.delete(e.target)));
      const akt = secs.filter(s => vidim.has(s)).pop();
      if (!akt) return;
      links.forEach(l => l.removeAttribute('aria-current'));
      const a = map.get(akt.id);
      if (a) a.setAttribute('aria-current', 'true');
    }, { rootMargin: '-45% 0px -50% 0px' });
    secs.forEach(s => io.observe(s));
  }

  /* ---------- formulář ---------- */
  function initForm() {
    const form = $('[data-form]');
    if (!form) return;
    const done = $('[data-form-done]', form), noMail = $('[data-form-noemail]', form), note = $('[data-form-note]', form);
    // odkazy s data-zajem="..." (Přihlásit dítě, Staňte se partnerem) zaškrtnou odpovídající volbu ve formuláři,
    // u mládeže se do prázdné zprávy předvyplní kategorie
    document.addEventListener('click', e => {
      const a = e.target.closest('[data-zajem]');
      if (!a) return;
      const chk = $(`[data-zajem-volba="${a.dataset.zajem}"]`, form);
      if (chk) chk.checked = true;
      const zpr = form.elements.zprava;
      if (a.dataset.kategorie && zpr && !zpr.value.trim()) zpr.value = `Kategorie: ${a.dataset.kategorie}\nVěk dítěte: `;
    });
    const fields = { jmeno: $('#f-jmeno', form), kontakt: $('#f-kontakt', form) };
    const errs = { jmeno: $('#e-jmeno', form), kontakt: $('#e-kontakt', form) };
    const setErr = (k, bad) => {
      errs[k].hidden = !bad;
      fields[k].closest('.field').classList.toggle('bad', bad);
      fields[k].setAttribute('aria-invalid', bad ? 'true' : 'false');
      if (bad) fields[k].setAttribute('aria-describedby', errs[k].id); else fields[k].removeAttribute('aria-describedby');
    };
    Object.keys(fields).forEach(k => fields[k].addEventListener('input', () => { if (!errs[k].hidden && fields[k].value.trim()) setErr(k, false); }));
    form.addEventListener('submit', e => {
      e.preventDefault();
      const jm = fields.jmeno.value.trim(), ko = fields.kontakt.value.trim();
      setErr('jmeno', !jm);
      setErr('kontakt', !ko);
      if (!jm) { fields.jmeno.focus(); return; }
      if (!ko) { fields.kontakt.focus(); return; }
      const zajem = $$('input[name="zajem"]:checked', form).map(i => i.value);
      const zprava = form.elements.zprava.value.trim();
      done.hidden = true;
      noMail.hidden = true;
      if (!KLUB.email) { noMail.hidden = false; noMail.focus(); return; }
      const subject = `Web SK Červenka: ${zajem.length ? zajem.join(', ') : 'zpráva'}`;
      const lines = [`Jméno: ${jm}`, `Kontakt: ${ko}`];
      if (zajem.length) lines.push(`Zájem: ${zajem.join(', ')}`);
      if (zprava) lines.push('', zprava);
      location.href = `mailto:${KLUB.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
      done.hidden = false;
      note.hidden = true;
      done.focus();
    });
  }

  /* ---------- omezený pohyb přepnutý za běhu ---------- */
  function pinToFinalStates() {
    pinned = true;
    if (timelinePin) timelinePin(true);
    if (countersFinish) countersFinish();
    $$('[data-reveal]').forEach(el => el.classList.add('in', 'done'));
  }
  function unpinFinalStates() {
    pinned = false;
    if (timelinePin) timelinePin(false);
  }

  splitText();
  renderZapasy();
  renderKontakty();
  renderAreal();
  renderMladez();
  renderMladezZapasy();
  renderFotky();
  renderPartneri();
  initGallery();
  initHistorieFotky();
  initHero();
  initReveal();
  initInview();
  initTimeline();
  initCounters();
  initNav();
  initForm();
  onMQ(RM, e => (e.matches ? pinToFinalStates() : unpinFinalStates()));
})();
