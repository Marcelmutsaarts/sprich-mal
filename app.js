// Sprich mal! De straat, de voorbereiding, het gesprek met de verkoper (stem in en uit) en de feedback.
(function () {
  'use strict';
  const $ = (s) => document.querySelector(s), $$ = (s) => [...document.querySelectorAll(s)];
  const wacht = (ms) => new Promise((r) => setTimeout(r, ms));
  const klem = (v, a, b) => Math.max(a, Math.min(b, v));
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  function toast(t, ms) { const el = $('#toast'); el.textContent = t; el.classList.add('on'); clearTimeout(toast.h); toast.h = setTimeout(() => el.classList.remove('on'), ms || 4200); }
  const WINKELS = window.WINKELS, vind = (id) => WINKELS.find((w) => w.id === id);
  const T = window.Tekening, F = window.Gezicht;
  const VINK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
  const LUIDSPREKER = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/></svg>';

  // ---------- voortgang en voorkeuren (alleen in deze browser) ----------
  const SLEUTEL = 'sprichmal.v1';
  const lees = () => { try { return JSON.parse(localStorage.getItem(SLEUTEL)) || {}; } catch (e) { return {}; } };
  const bewaar = (d) => { try { localStorage.setItem(SLEUTEL, JSON.stringify(d)); } catch (e) { /* privévenster: dan maar niet onthouden */ } };
  const voorkeur = Object.assign({ langzaam: false, vertaling: false }, lees().voorkeur || {});
  function zetVoorkeur(k, v) { voorkeur[k] = v; const d = lees(); d.voorkeur = voorkeur; bewaar(d); }

  // ---------- schermen ----------
  // Elk scherm buiten de straat krijgt één stap in de browsergeschiedenis, zodat de terugknop of terugveeg
  // terug naar de straat gaat in plaats van de app te verlaten.
  function toon(id) {
    $$('.scherm').forEach((s) => { s.hidden = s.id !== id; });
    document.body.dataset.scherm = id; window.scrollTo(0, 0);
    if (id !== 'sGesprek') stopLus();
    if (id !== 'sStraat' && !(history.state && history.state.sprich)) { try { history.pushState({ sprich: 1 }, ''); } catch (e) {} }
    const kop = $(`#${id} h1`); if (kop) { kop.setAttribute('tabindex', '-1'); try { kop.focus({ preventScroll: true }); } catch (e) {} }
  }
  function verlaatNaarStraat() {
    stopStem(); stopOpname(true); G.klaar = true; G.sessie++; sluitMicrofoon();
    renderStraat(); toon('sStraat');
  }
  function naarStraat() { if (history.state && history.state.sprich) history.back(); else verlaatNaarStraat(); }
  addEventListener('popstate', () => { if (document.body.dataset.scherm !== 'sStraat') verlaatNaarStraat(); });

  // ---------- staat de AI aan? ----------
  let live = { gecheckt: false, ok: false };
  async function checkLive() {
    try { const r = await fetch('api/gesprek', { cache: 'no-store' }); const j = await r.json(); live = { gecheckt: true, ok: !!j.sleutel }; }
    catch (e) { live = { gecheckt: true, ok: false }; }
    const el = $('#liveStatus'); el.hidden = live.ok;
    el.textContent = 'De verkopers zijn er nog niet: de AI staat uit. Vraag je docent om de app aan te zetten.';
    return live.ok;
  }

  // ---------- de straat ----------
  function renderStraat() {
    const v = lees();
    $('#straat').innerHTML = WINKELS.map((w) => {
      const p = v[w.id];
      const stand = p ? `<small class="gedaan">${VINK.replace('<svg', '<svg width="14" height="14"')}Beste poging: ${p.best} van 4 · ${p.keer}× geoefend</small>` : '<small>Nog niet geoefend</small>';
      return `<button class="winkel" data-id="${w.id}">${T.gevel(w.id)}<div class="w-tekst"><b>${esc(w.naam)}</b><span>${esc(w.wat)}</span>${stand}</div></button>`;
    }).join('');
    $$('.winkel').forEach((b) => b.addEventListener('click', () => openBriefing(b.dataset.id)));
  }

  // ---------- voorbereiding ----------
  let keuze = { id: null, focus: '' };
  function openBriefing(id, focus) {
    const w = vind(id); if (!w) return;
    const opgeslagen = (lees()[id] || {}).focus || '';
    keuze = { id, focus: focus != null ? focus : opgeslagen };
    $('#brGevel').innerHTML = T.gevel(id);
    $('#brMini').innerHTML = T.portret(id, true);
    $('#brPersoon').textContent = w.persoon; $('#brRol').textContent = `${w.rol} · ${w.stad}`;
    $('#brStad').textContent = `${w.stad} · ${w.thema}`; $('#brNaam').textContent = w.naam;
    $('#brSituatie').textContent = w.situatie;
    $('#brTaken').innerHTML = w.opdrachten.map((t, i) => `<li><span class="nr">${i + 1}</span><span>${esc(t)}</span></li>`).join('');
    $('#brInfoTitel').textContent = w.info.titel;
    $('#brInfo').innerHTML = w.info.regels.map(([a, b]) => `<div><b lang="de">${esc(a)}</b><span>${esc(b)}</span></div>`).join('');
    $('#brNoot').textContent = w.info.noot || ''; $('#brNoot').hidden = !w.info.noot;
    $('#brZinnen').innerHTML = w.zinnen.map(([de, nl]) => `<li><b lang="de">${esc(de)}</b><span>${esc(nl)}</span></li>`).join('');
    renderFocus(); renderTempo();
    toon('sBriefing');
    (live.ok ? Promise.resolve(true) : checkLive()).then((ok) => { if (ok) voorlaad(w.opener.de, w.id, w.opener.emotie); });
  }
  function renderFocus() { $('#brFocus').hidden = !keuze.focus; $('#brFocusTekst').textContent = keuze.focus; }
  function renderTempo() { $$('.seg [data-tempo]').forEach((b) => { const aan = (b.dataset.tempo === 'langzaam') === voorkeur.langzaam; b.classList.toggle('on', aan); b.setAttribute('aria-pressed', String(aan)); }); }
  $$('.seg [data-tempo]').forEach((b) => b.addEventListener('click', () => { zetVoorkeur('langzaam', b.dataset.tempo === 'langzaam'); renderTempo(); const w = vind(keuze.id); if (w && live.ok) voorlaad(w.opener.de, w.id, w.opener.emotie); }));
  $('#brFocusWeg').addEventListener('click', () => { keuze.focus = ''; renderFocus(); });
  $('#brTerug').addEventListener('click', naarStraat);
  $('#brStart').addEventListener('click', async () => {
    ontgrendelAudio();
    if (!live.ok && !(await checkLive())) { toast('De AI staat nog niet aan. Vraag je docent om de app aan te zetten.', 6000); return; }
    vraagMic().catch(() => {}); // de toestemming nu al vragen, dan gaat de eerste zin niet verloren
    startGesprek(keuze.id, keuze.focus);
  });

  // ---------- de microfoon ----------
  function vraagMic() {
    if (G.stream && G.stream.active) return Promise.resolve(G.stream);
    if (!G.micBelofte) {
      try {
        G.micBelofte = navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } })
          .then((s) => {
            if (document.body.dataset.scherm !== 'sGesprek' || G.klaar) { s.getTracks().forEach((t) => t.stop()); throw new Error('niet meer nodig'); }
            G.stream = s; return s;
          })
          .finally(() => { G.micBelofte = null; });
      } catch (e) { return Promise.reject(e); }
    }
    return G.micBelofte;
  }
  function sluitMicrofoon() {
    if (G.stream) { try { G.stream.getTracks().forEach((t) => t.stop()); } catch (e) {} G.stream = null; }
  }

  // ---------- de stem ----------
  const audio = $('#stemAudio');
  let actx = null, analyser = null, buf = null;
  function ontgrendelAudio() {
    try {
      if (!actx) {
        actx = new (window.AudioContext || window.webkitAudioContext)();
        const src = actx.createMediaElementSource(audio); analyser = actx.createAnalyser(); analyser.fftSize = 512; buf = new Uint8Array(analyser.fftSize);
        src.connect(analyser); analyser.connect(actx.destination);
      }
      if (actx.state === 'suspended') actx.resume();
    } catch (e) { /* lip-sync valt dan terug op een eenvoudige beweging */ }
    try { speechSynthesis.getVoices(); } catch (e) {}
  }
  let nepVolume = false, spreekt = false, klok = 0;
  function volume() {
    if (nepVolume) return 0.35 + 0.35 * Math.abs(Math.sin(klok * 13)) * (0.6 + 0.4 * Math.sin(klok * 3.1));
    if (!analyser || audio.paused) return 0;
    analyser.getByteTimeDomainData(buf); let s = 0; for (let i = 0; i < buf.length; i++) { const v = (buf[i] - 128) / 128; s += v * v; }
    return klem(Math.sqrt(s / buf.length) * 5.5, 0, 1);
  }
  // Na twee mislukte stemmen op rij gebruikt de app de browserstem, tot het volgende gesprek.
  const Stem = { api: null, fouten: 0, cache: new Map() };
  function haalStem(tekst, wie, emotie, langzaam) {
    const sleutel = `${wie}|${emotie}|${langzaam ? 1 : 0}|${tekst}`;
    if (Stem.cache.has(sleutel)) return Stem.cache.get(sleutel);
    const p = fetch('api/stem', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tekst, wie, emotie, langzaam: !!langzaam }) })
      .then((r) => { if (!r.ok) throw new Error('stem ' + r.status); return r.blob(); })
      .then((b) => { if (!b.size) throw new Error('lege stem'); Stem.api = true; Stem.fouten = 0; return URL.createObjectURL(b); })
      .catch((e) => { Stem.cache.delete(sleutel); Stem.fouten += 1; if (Stem.fouten >= 2) Stem.api = false; throw e; });
    Stem.cache.set(sleutel, p); return p;
  }
  function voorlaad(tekst, wie, emotie) { if (live.ok && Stem.api !== false) haalStem(tekst, wie, emotie, voorkeur.langzaam).catch(() => {}); }
  function browserStem(tekst, wie, langzaam) {
    return new Promise((klaar) => {
      if (!('speechSynthesis' in window)) return klaar();
      try {
        speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(tekst); u.lang = 'de-DE'; u.rate = langzaam ? 0.72 : 0.92;
        const vs = speechSynthesis.getVoices().filter((v) => /^de/i.test(v.lang));
        const vrouw = /katja|hedda|amala|marlene|vicki|anna|petra|female|frau/i, man = /conrad|stefan|killian|hans|markus|male|mann/i;
        const wil = (wie === 'becker' || wie === 'lena') ? vrouw : man;
        u.voice = vs.find((v) => wil.test(v.name) && /natural|online/i.test(v.name)) || vs.find((v) => wil.test(v.name)) || vs.find((v) => /natural|online/i.test(v.name)) || vs[0] || null;
        nepVolume = true; u.onend = u.onerror = () => { nepVolume = false; klaar(); };
        stopSpreken = () => { try { speechSynthesis.cancel(); } catch (e) {} nepVolume = false; klaar(); };
        speechSynthesis.speak(u);
        setTimeout(() => { if (nepVolume) { nepVolume = false; klaar(); } }, 4000 + tekst.length * 110);
      } catch (e) { nepVolume = false; klaar(); }
    });
  }
  let stopSpreken = null, spreekNr = 0;
  async function spreek(zin) {
    const nr = ++spreekNr;
    F.zetEmotie(zin.emotie); zetOndertitel(zin); spreekt = true;
    $('#gNogeens').disabled = true;
    try {
      if (live.ok && Stem.api !== false) {
        try {
          const url = await Promise.race([haalStem(zin.de, G.w.id, zin.emotie, voorkeur.langzaam), wacht(10000).then(() => { throw new Error('te traag'); })]);
          if (nr !== spreekNr) return;
          audio.src = url; ontgrendelAudio(); await audio.play();
          await new Promise((r) => { stopSpreken = r; audio.onended = r; audio.onerror = r; setTimeout(r, 30000); });
          return;
        } catch (e) { if (nr !== spreekNr) return; /* door naar de browserstem */ }
      }
      await browserStem(zin.de, G.w.id, voorkeur.langzaam);
    } finally {
      if (nr === spreekNr) { spreekt = false; nepVolume = false; stopSpreken = null; $('#gNogeens').disabled = false; }
    }
  }
  function stopStem() {
    spreekNr++;
    try { audio.pause(); } catch (e) {}
    try { speechSynthesis.cancel(); } catch (e) {}
    if (stopSpreken) { const s = stopSpreken; stopSpreken = null; s(); }
    spreekt = false; nepVolume = false; $('#gNogeens').disabled = !G.laatste;
  }
  function zetOndertitel(zin) {
    $('#gSpreker').textContent = G.w ? G.w.persoon : '';
    $('#gDe').textContent = zin ? zin.de : '';
    $('#gNl').textContent = zin ? (zin.nl || '') : '';
    $('#gNl').hidden = !voorkeur.vertaling || !zin || !zin.nl;
  }
  $('#gNogeens').addEventListener('click', () => { if (!G.laatste || G.bezig) return; ontgrendelAudio(); stopOpname(true); stopStem(); spreek(G.laatste).then(naSpreken); });
  $('#gLangzaam').addEventListener('click', () => {
    zetVoorkeur('langzaam', !voorkeur.langzaam); zetKnopjes();
    if (voorkeur.langzaam && G.laatste && !G.bezig && !opname) { ontgrendelAudio(); stopStem(); spreek(G.laatste).then(naSpreken); }
  });
  $('#gVertaal').addEventListener('click', () => { zetVoorkeur('vertaling', !voorkeur.vertaling); zetKnopjes(); zetOndertitel(G.laatste); });
  function zetKnopjes() { $('#gLangzaam').setAttribute('aria-pressed', String(voorkeur.langzaam)); $('#gVertaal').setAttribute('aria-pressed', String(voorkeur.vertaling)); }

  // ---------- het gesprek ----------
  // G.sessie telt elk gesprek. Een antwoord dat binnenkomt voor een gesprek dat al voorbij is, wordt genegeerd.
  const G = { w: null, sessie: 0, geschiedenis: [], notities: [], gedaan: new Set(), bezig: false, klaar: false, focus: '', laatste: null, hulp: [], gesproken: 0, getypt: 0, stream: null, micBelofte: null };
  function startGesprek(id, focus) {
    const w = vind(id);
    stopStem(); stopOpname(true);
    G.sessie += 1; const sessie = G.sessie;
    if (Stem.api === false) { Stem.api = null; Stem.fouten = 0; }
    Object.assign(G, { w, geschiedenis: [], notities: [], gedaan: new Set(), bezig: false, klaar: false, focus: focus || '', laatste: null, hulp: w.startHulp.slice(), gesproken: 0, getypt: 0 });
    $('#portret').innerHTML = T.portret(id); F.reset(); kader();
    $('#gWinkel').textContent = w.naam; $('#gWie').textContent = `${w.persoon} · ${w.rol}`;
    $('#gFocus').hidden = !G.focus; $('#gFocusTekst').textContent = G.focus;
    renderTaken(); renderHulp(); zetHulp(false);
    $('#gJij').hidden = true;
    $('#gInfoTitel').textContent = w.info.titel;
    $('#gInfo').innerHTML = w.info.regels.map(([a, b]) => `<div><b lang="de">${esc(a)}</b><span>${esc(b)}</span></div>`).join('');
    $('#gNoot').textContent = w.info.noot || ''; $('#gNoot').hidden = !w.info.noot;
    $('#gInfoBlok').open = id === 'lena' && innerWidth > 860;
    $('#gBediening').hidden = false; $('#gEinde').hidden = true;
    zetTyp(false); zetKnopjes(); zetMic('wacht');
    G.laatste = { de: w.opener.de, nl: w.opener.nl, emotie: w.opener.emotie };
    zetOndertitel(G.laatste); $('#gNogeens').disabled = false;
    toon('sGesprek'); startLus();
    (async () => {
      await wacht(450);
      if (sessie !== G.sessie || G.klaar || opname) return; // al weg, of de leerling praat al
      await spreek(G.laatste);
      if (sessie === G.sessie) naSpreken();
    })();
  }
  // het portret zo uitsnijden dat het hoofd altijd in beeld is, hoe breed of laag het vak ook is
  function kader() {
    const vak = $('#portret'), svg = vak && vak.querySelector('svg'); if (!svg) return;
    const w = vak.clientWidth, h = vak.clientHeight; if (!w || !h) return;
    const s = Math.max(w / 900, h / 760, Math.min(w / 560, h / 420)), vw = w / s, vh = h / s;
    const x = klem(470 - vw / 2, 0, 900 - vw);
    let y = klem(292 - vh / 2, 0, 760 - vh);
    if (y + vh < 462) y = klem(462 - vh, 0, 760 - vh); // in een laag vak gaan mond en kin voor, het haar mag eraf
    if (y > 250) y = klem(250, 0, 760 - vh); // de ogen blijven altijd in beeld
    svg.setAttribute('viewBox', `${x.toFixed(1)} ${y.toFixed(1)} ${vw.toFixed(1)} ${vh.toFixed(1)}`);
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
  }
  if (window.ResizeObserver) new ResizeObserver(kader).observe($('#portret')); else addEventListener('resize', kader);
  function naSpreken() { if (!G.klaar && !G.bezig && !opname) zetMic('klaar'); }
  function renderTaken(nieuw) {
    const n = G.w.opdrachten.length;
    $('#gTaken').innerHTML = G.w.opdrachten.map((t, i) => {
      const nr = String(i + 1), k = G.gedaan.has(nr);
      return `<li class="${k ? 'klaar' : ''}${nieuw && nieuw.has(nr) ? ' net' : ''}"><span class="nr">${k ? VINK : i + 1}</span><span>${esc(t)}</span></li>`;
    }).join('');
    $('#gTelling').textContent = G.gedaan.size ? `${G.gedaan.size} van ${n} klaar` : '';
  }
  function renderHulp() { $('#gHulpLijst').innerHTML = G.hulp.map(([de, nl]) => `<li><b lang="de">${esc(de)}</b><span>${esc(nl)}</span></li>`).join(''); }
  function zetHulp(aan) {
    $('#gHulp').hidden = !aan; $('#gHulpKnop').setAttribute('aria-pressed', String(aan));
    if (aan && innerWidth <= 860) $('#gHulp').scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  $('#gHulpKnop').addEventListener('click', () => zetHulp($('#gHulp').hidden));
  function zetTyp(aan) { $('#gTyp').hidden = !aan; $('#gTypKnop').setAttribute('aria-pressed', String(aan)); if (aan) setTimeout(() => $('#gInput').focus(), 30); }
  $('#gTypKnop').addEventListener('click', () => zetTyp($('#gTyp').hidden));

  function zetMic(stand) {
    const mic = $('#gMic'), t = $('#gMicTekst'), c = $('#gCaption');
    mic.classList.remove('op', 'denkt'); c.classList.remove('live');
    mic.disabled = stand === 'denkt' || stand === 'wacht';
    if (stand === 'klaar') { t.textContent = 'Houd vast en praat'; c.textContent = innerWidth > 860 ? 'Houd de knop ingedrukt (of de spatiebalk) en praat Duits. Laat los als je klaar bent.' : 'Houd de knop ingedrukt en praat Duits.'; }
    if (stand === 'wacht') { t.textContent = 'Even luisteren…'; c.textContent = `${G.w ? G.w.persoon : 'De verkoper'} praat.`; mic.disabled = false; }
    if (stand === 'op') { mic.classList.add('op'); t.textContent = 'Laat los om te versturen'; c.textContent = 'Ik luister…'; c.classList.add('live'); }
    if (stand === 'denkt') { mic.classList.add('denkt'); t.textContent = `${G.w.persoon} denkt na…`; c.textContent = ''; }
  }

  // opnemen
  let opname = null;
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  async function startOpname() {
    if (!G.w || G.bezig || G.klaar || opname) return;
    stopStem();
    const o = { chunks: [], tekst: '', klaar: null, start: 0 };
    opname = o;
    const klaarVoorOpname = G.stream && G.stream.active;
    if (!klaarVoorOpname) { $('#gCaption').classList.remove('live'); $('#gCaption').textContent = 'Sta de microfoon toe als je browser erom vraagt.'; }
    try {
      await vraagMic();
      if (opname !== o) return; // al losgelaten terwijl de browser om toestemming vroeg
      o.rec = new MediaRecorder(G.stream); o.rec.ondataavailable = (e) => e.data && e.data.size && o.chunks.push(e.data);
      o.klaar = new Promise((r) => { o.rec.onstop = r; }); o.rec.start(); o.start = performance.now();
    } catch (e) {
      if (opname !== o) return;
      opname = null; zetMic('klaar'); zetTyp(true);
      $('#gCaption').textContent = 'De microfoon doet het niet. Typ je zin in het veld hieronder.';
      toast('De microfoon doet het niet (geen toestemming of niet beschikbaar). Je kunt typen.', 7000); return;
    }
    zetMic('op');
    if (SR) {
      try {
        const sr = new SR(); sr.lang = 'de-DE'; sr.interimResults = true; sr.continuous = true;
        sr.onresult = (ev) => { let t = ''; for (let i = 0; i < ev.results.length; i++) t += ev.results[i][0].transcript; o.tekst = t; if (opname === o) $('#gCaption').textContent = t || 'Ik luister…'; };
        sr.onerror = () => {}; sr.start(); o.sr = sr;
      } catch (e) {}
    }
  }
  async function stopOpname(afbreken) {
    const o = opname; if (!o) return; opname = null;
    try { o.sr && o.sr.stop(); } catch (e) {}
    try { if (o.rec && o.rec.state !== 'inactive') o.rec.stop(); } catch (e) {}
    if (afbreken || !o.rec) {
      if (!G.bezig && !G.klaar && G.w) {
        zetMic('klaar');
        if (!afbreken) $('#gCaption').textContent = G.stream && G.stream.active ? 'Houd de knop vast zolang je praat.' : 'Sta eerst de microfoon toe. Houd daarna de knop vast en praat.';
      }
      return;
    }
    const duur = performance.now() - o.start;
    await o.klaar; await wacht(120);
    let audioB64 = null;
    try { const blob = new Blob(o.chunks, { type: o.rec.mimeType || 'audio/webm' }); if (blob.size > 2000 && duur > 450) audioB64 = await naarWav(blob); } catch (e) { audioB64 = null; }
    if (!audioB64 && !o.tekst) { zetMic('klaar'); $('#gCaption').textContent = 'Ik hoorde niets. Houd de knop vast zolang je praat.'; return; }
    stuurBeurt({ audio: audioB64, tekst: o.tekst });
  }
  async function naarWav(blob) {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const ab = await ctx.decodeAudioData(await blob.arrayBuffer()); if (ctx.close) ctx.close();
    const sr = 16000, lengte = Math.max(1, Math.ceil(ab.duration * sr));
    const off = new OfflineAudioContext(1, lengte, sr); const s = off.createBufferSource(); s.buffer = ab; s.connect(off.destination); s.start();
    const data = (await off.startRendering()).getChannelData(0);
    const wav = new DataView(new ArrayBuffer(44 + data.length * 2));
    const str = (o, t) => { for (let i = 0; i < t.length; i++) wav.setUint8(o + i, t.charCodeAt(i)); };
    str(0, 'RIFF'); wav.setUint32(4, 36 + data.length * 2, true); str(8, 'WAVE'); str(12, 'fmt '); wav.setUint32(16, 16, true); wav.setUint16(20, 1, true); wav.setUint16(22, 1, true);
    wav.setUint32(24, sr, true); wav.setUint32(28, sr * 2, true); wav.setUint16(32, 2, true); wav.setUint16(34, 16, true); str(36, 'data'); wav.setUint32(40, data.length * 2, true);
    for (let i = 0; i < data.length; i++) wav.setInt16(44 + i * 2, klem(data[i], -1, 1) * 0x7fff, true);
    const bytes = new Uint8Array(wav.buffer); let bin = '';
    for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    return btoa(bin);
  }

  async function stuurBeurt({ audio: audioB64, tekst }) {
    if (G.bezig || G.klaar) return;
    const sessie = G.sessie, weg = () => sessie !== G.sessie || G.klaar;
    G.bezig = true; zetMic('denkt'); F.zetEmotie('nadenkend');
    const denkt = $('#portret').appendChild(Object.assign(document.createElement('div'), { className: 'denkt', innerHTML: '<i></i><i></i><i></i>' }));
    $('#gJij').hidden = false; $('#gJijTekst').textContent = tekst || '…';
    try {
      let r;
      try {
        r = await fetch('api/gesprek', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
          mode: 'beurt', winkel: G.w.id, geschiedenis: G.geschiedenis, gedaan: [...G.gedaan], focus: G.focus,
          beurt: G.geschiedenis.filter((b) => b.wie === 'leerling').length, audio: audioB64, tekst }) });
      } catch (x) { throw new Error('Er is geen verbinding met internet.'); }
      const j = await r.json().catch(() => ({}));
      if (weg()) { denkt.remove(); if (sessie === G.sessie) G.bezig = false; return; }
      if (!r.ok) throw new Error(foutTekst(r.status, j.fout));
      if (audioB64) G.gesproken++; else G.getypt++;
      const zin = j.leerling_tekst || tekst || '';
      $('#gJijTekst').textContent = zin;
      G.geschiedenis.push({ wie: 'leerling', tekst: zin }, { wie: 'verkoper', tekst: j.tekst });
      G.notities.push({ notitie: j.notitie || '', uitspraak: j.uitspraak || '' });
      const nieuw = new Set((j.gedaan || []).filter((x) => !G.gedaan.has(x)));
      nieuw.forEach((x) => G.gedaan.add(x)); renderTaken(nieuw);
      if (j.hulp && j.hulp.length) { G.hulp = j.hulp.map((h) => [h.de, h.nl]); renderHulp(); }
      denkt.remove();
      G.laatste = { de: j.tekst, nl: j.vertaling, emotie: j.emotie };
      G.bezig = false; zetMic('wacht');
      await spreek(G.laatste);
      if (weg()) return;
      if (j.einde || G.gedaan.size === G.w.opdrachten.length && /tsch[üu]ss|wiedersehen|sch[öo]nen tag/i.test(j.tekst)) return eindeGesprek();
      naSpreken();
    } catch (e) {
      denkt.remove();
      if (weg()) { if (sessie === G.sessie) G.bezig = false; return; }
      F.zetEmotie('neutraal'); G.bezig = false; zetMic('klaar');
      if (!audioB64 && tekst) { zetTyp(true); if (!$('#gInput').value) $('#gInput').value = tekst; }
      $('#gCaption').textContent = `${e.message} Probeer het nog eens.`;
      toast(`${e.message} Probeer het nog eens.`, 7000);
    }
  }
  // een foutmelding die een leerling begrijpt
  function foutTekst(status, fout) {
    if (fout === 'geen-sleutel') return 'De AI staat uit. Vraag je docent om de app aan te zetten.';
    if (status === 429) return 'De AI is even te druk.';
    if (typeof fout === 'string' && fout && fout.length < 140 && !/[{}<>]/.test(fout)) return fout;
    return 'De AI gaf geen antwoord.';
  }
  function eindeGesprek() {
    G.klaar = true; stopOpname(true); sluitMicrofoon();
    const n = G.gedaan.size, tot = G.w.opdrachten.length;
    $('#gEindeTekst').textContent = n === tot ? `Het gesprek is klaar. Je deed alle ${tot} opdrachten!` : `Het gesprek is klaar. Je deed ${n} van de ${tot} opdrachten.`;
    $('#gBediening').hidden = true; $('#gEinde').hidden = false; zetHulp(false);
  }
  $('#gNaarFb').addEventListener('click', maakFeedback);
  $('#gStop').addEventListener('click', () => {
    if (!G.geschiedenis.length) { toast(`Zeg eerst iets tegen ${G.w.persoon}. Dan valt er iets te bespreken.`); return; }
    if (G.bezig) { toast('Even wachten tot het antwoord er is.'); return; }
    maakFeedback();
  });
  $('#gTerug').addEventListener('click', naarStraat);
  $('#gTyp').addEventListener('submit', (e) => { e.preventDefault(); const t = $('#gInput').value.trim(); if (!t || G.bezig || G.klaar) return; $('#gInput').value = ''; ontgrendelAudio(); stopStem(); stuurBeurt({ audio: null, tekst: t }); });
  const mic = $('#gMic');
  mic.addEventListener('pointerdown', (e) => { if (e.button > 0) return; e.preventDefault(); ontgrendelAudio(); try { mic.setPointerCapture(e.pointerId); } catch (x) {} startOpname(); });
  ['pointerup', 'pointercancel'].forEach((ev) => mic.addEventListener(ev, () => { if (opname) stopOpname(false); }));
  mic.addEventListener('contextmenu', (e) => e.preventDefault());

  // ---------- feedback ----------
  let laatsteFb = null;
  async function maakFeedback() {
    stopStem(); stopOpname(true); G.klaar = true; sluitMicrofoon();
    const w = G.w, n = G.gedaan.size, tot = w.opdrachten.length, sessie = G.sessie;
    $('#fbMini').innerHTML = T.portret(w.id, true);
    $('#fbWinkel').textContent = `${w.naam} · ${w.persoon}`;
    $('#fbTitel').textContent = n === tot ? 'Super gemacht!' : n === 3 ? 'Gut gemacht!' : n === 2 ? 'Schon ganz gut!' : 'Ein guter Anfang!';
    $('#fbSamen').textContent = `Je deed ${n} van de ${tot} opdrachten.`;
    $('#fbLaden').hidden = false; $('#fbInhoud').hidden = true; $('#fbFout').hidden = true;
    toon('sFeedback');
    try {
      let r;
      try {
        r = await fetch('api/gesprek', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
          mode: 'feedback', winkel: w.id, geschiedenis: G.geschiedenis, notities: G.notities, gedaan: [...G.gedaan], focus: G.focus, gesproken: G.gesproken > 0 }) });
      } catch (x) { throw new Error('Er is geen verbinding met internet.'); }
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(foutTekst(r.status, j.fout));
      // de poging telt mee, ook als de leerling intussen al verder is gegaan
      const d = lees(); const p = d[w.id] || { best: 0, keer: 0 };
      p.best = Math.max(p.best, n); p.keer += 1; p.focus = j.volgende_stap || ''; d[w.id] = p; bewaar(d);
      if (sessie !== G.sessie || document.body.dataset.scherm !== 'sFeedback') return;
      laatsteFb = j; renderFeedback(j);
    } catch (e) {
      if (sessie !== G.sessie || document.body.dataset.scherm !== 'sFeedback') return;
      $('#fbLaden').hidden = true; $('#fbFout').hidden = false;
      $('#fbSamen').textContent = `Je deed ${n} van de ${tot} opdrachten. De feedback lukte niet: ${e.message}`;
    }
  }
  function renderFeedback(j) {
    const w = G.w, tot = w.opdrachten.length;
    $('#fbSamen').textContent = `Je deed ${G.gedaan.size} van de ${tot} opdrachten. ${j.samenvatting || ''}`;
    $('#fbTaken').innerHTML = w.opdrachten.map((t, i) => { const k = G.gedaan.has(String(i + 1)); return `<li class="${k ? 'klaar' : ''}"><span class="nr">${k ? VINK : i + 1}</span><span>${esc(t)}</span></li>`; }).join('');
    $('#fbTelling').textContent = `${G.gedaan.size} van ${tot}`;
    const NIVEAU = ['', 'nog lastig', 'op weg', 'sterk'];
    const rij = (naam, v) => `<div class="score"><b>${naam}</b><span class="stippen">${[1, 2, 3].map((i) => `<i class="${i <= v ? 'aan' : ''}"></i>`).join('')}</span><span>${v ? NIVEAU[v] : 'niet gehoord: je typte'}</span></div>`;
    $('#fbScores').innerHTML = rij('Woordenschat', j.woordenschat) + rij('Grammatica', j.grammatica) + rij('Uitspraak', j.uitspraak);
    $('#fbScoreNoot').textContent = j.uitspraak ? `Uitspraak is een inschatting van de AI. ${j.uitspraak_tip ? 'Tip: ' + j.uitspraak_tip : ''}` : 'Gemeten aan wat je in 3 havo mag verwachten (A2).';
    $('#fbGoed').innerHTML = (j.goed && j.goed.length ? j.goed : ['Je durfde Duits te praten. Dat is de eerste stap.']).map((t) => `<li>${esc(t)}</li>`).join('');
    $('#fbBeter').innerHTML = (j.verbeter || []).map((v) => `<div class="verb">
        <div><small>Jij zei</small><div class="jij" lang="de">${esc(v.jij)}</div></div>
        <div><small>Beter</small><div class="beter" lang="de"><span>${esc(v.beter)}</span><button class="luister" data-zin="${esc(v.beter)}" aria-label="Luister naar de betere zin">${LUIDSPREKER}</button></div></div>
        <div class="uitleg">${esc(v.uitleg)}</div></div>`).join('') || '<p class="noot">Geen verbeterpunten. Knap!</p>';
    $('#fbWoorden').innerHTML = (j.woorden || []).map((z) => `<li><button class="luister" data-zin="${esc(z.de)}" aria-label="Luister naar ${esc(z.de)}">${LUIDSPREKER}</button><b lang="de">${esc(z.de)}</b><span>${esc(z.nl)}</span></li>`).join('');
    $('#fbStap').textContent = j.volgende_stap || 'Probeer het nog eens en gebruik een nieuwe zin uit de lijst met handige zinnen.';
    $('#fbFocus').hidden = !j.focus; $('#fbFocus').textContent = j.focus ? `Je focus van deze keer: ${j.focus}` : '';
    const regels = [{ wie: 'verkoper', tekst: w.opener.de }, ...G.geschiedenis];
    $('#fbGesprek').innerHTML = regels.map((b) => `<div class="regel ${b.wie}"><b>${b.wie === 'leerling' ? 'Jij' : esc(w.persoon)}</b><span lang="de">${esc(b.tekst)}</span></div>`).join('');
    $$('#sFeedback .luister').forEach((b) => b.addEventListener('click', () => luister(b)));
    $('#fbLaden').hidden = true; $('#fbInhoud').hidden = false;
  }
  let losAudio = null;
  async function luister(knop) {
    const zin = knop.dataset.zin; if (!zin) return;
    $$('.luister.speelt').forEach((b) => b.classList.remove('speelt')); knop.classList.add('speelt');
    try { if (losAudio) losAudio.pause(); } catch (e) {}
    try {
      if (!live.ok || Stem.api === false) throw new Error('geen api-stem');
      const url = await haalStem(zin, G.w.id, 'vriendelijk', true);
      losAudio = new Audio(url); losAudio.onended = losAudio.onerror = () => knop.classList.remove('speelt');
      await losAudio.play();
    } catch (e) { await browserStem(zin, G.w.id, true); knop.classList.remove('speelt'); }
  }
  $('#fbOpnieuw').addEventListener('click', () => openBriefing(G.w.id, laatsteFb ? laatsteFb.volgende_stap : ''));
  $('#fbStraat').addEventListener('click', naarStraat);
  $('#fbFoutStraat').addEventListener('click', naarStraat);
  $('#fbNogmaals').addEventListener('click', maakFeedback);

  // ---------- docentinformatie ----------
  $('#bDocent').addEventListener('click', () => { $('#docent').hidden = false; $('#dSluit').focus(); });
  $('#dSluit').addEventListener('click', () => { $('#docent').hidden = true; });
  $('#docent').addEventListener('click', (e) => { if (e.target.id === 'docent') $('#docent').hidden = true; });

  // ---------- toetsen ----------
  addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !$('#docent').hidden) { $('#docent').hidden = true; return; }
    const inVeld = /INPUT|TEXTAREA/.test(e.target.tagName);
    if (inVeld || document.body.dataset.scherm !== 'sGesprek' || G.klaar || !$('#docent').hidden) return;
    if (e.code === 'Space') {
      e.preventDefault(); if (e.repeat) return;
      if (/BUTTON|SUMMARY/.test(e.target.tagName)) e.target.blur();
      ontgrendelAudio(); startOpname();
    }
  });
  addEventListener('keyup', (e) => { if (e.code === 'Space' && opname) { e.preventDefault(); stopOpname(false); } });

  // ---------- animatie van het gezicht ----------
  let lusAan = false, vorige = 0;
  function lus(nu) { if (!lusAan) return; requestAnimationFrame(lus); const dt = Math.min(0.05, (nu - vorige) / 1000 || 0.016); vorige = nu; klok += dt; F.teken(dt, spreekt, volume()); }
  function startLus() { if (lusAan) return; lusAan = true; vorige = performance.now(); requestAnimationFrame(lus); }
  function stopLus() { lusAan = false; }

  // ---------- start ----------
  renderStraat(); checkLive();
  window.__sprich = { G, kader, live: () => live, zetLive: (v) => { live = { gecheckt: true, ok: v }; }, step: (n, d) => { for (let i = 0; i < n; i++) { klok += d || 1 / 60; F.teken(d || 1 / 60, spreekt, volume()); } }, openBriefing, startGesprek, stuurBeurt, maakFeedback, renderFeedback, eindeGesprek, Stem };
})();
