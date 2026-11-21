// De tekeningen: de gevels in de straat, de verkopers achter de toonbank en hun gezicht (emotie, knipperen, praten).
(function () {
  'use strict';

  // ---------- gevels ----------
  function luifel(xl, xr, y0, y1, inset, n, k1, k2) {
    const w = (xr - xl) / n, wb = (xr - xl - 2 * inset) / n;
    let s = `<path d="M${xl} ${y0} H${xr} L${xr - inset} ${y1} H${xl + inset}Z" fill="${k1}"/>`;
    for (let i = 1; i < n; i += 2) s += `<path d="M${(xl + i * w).toFixed(1)} ${y0} h${w.toFixed(1)} L${(xl + inset + (i + 1) * wb).toFixed(1)} ${y1} H${(xl + inset + i * wb).toFixed(1)}Z" fill="${k2}"/>`;
    for (let i = 0; i < n; i++) s += `<path d="M${(xl + inset + i * wb).toFixed(1)} ${y1} q${(wb / 2).toFixed(1)} ${(wb * 0.55).toFixed(1)} ${wb.toFixed(1)} 0Z" fill="${i % 2 ? k2 : k1}"/>`;
    return s;
  }
  const STOEP = '<rect y="234" width="240" height="3" fill="#c3b9aa"/><rect y="236" width="240" height="14" fill="#d9d1c5"/>';
  const GEVEL = {
    becker: () => `
      <rect x="14" y="28" width="196" height="208" fill="#f3e3c5"/>
      <rect x="8" y="20" width="208" height="12" rx="2" fill="#d8bf97"/>
      <rect x="26" y="40" width="172" height="32" rx="5" fill="#6b4a2f"/>
      <text x="112" y="61.5" text-anchor="middle" font-family="Georgia,serif" font-style="italic" font-size="15.5" fill="#f8ecd6">Bäckerei am Markt</text>
      <path d="M210 50 H226 M223 50 V60" stroke="#3b2e26" stroke-width="3"/>
      <g transform="translate(223 73)"><path d="M-9 4 C-15 -4 -10 -11 -3 -9 C3 -7 4 1 0 6 C-4 1 -3 -7 3 -9 C10 -11 15 -4 9 4 C5 9 -5 9 -9 4Z" fill="none" stroke="#b7742f" stroke-width="4.5" stroke-linejoin="round"/></g>
      ${luifel(20, 204, 82, 102, 8, 8, '#c96a41', '#f6e6cc')}
      <rect x="26" y="116" width="100" height="92" rx="4" fill="#fff8ea" stroke="#6b4a2f" stroke-width="5"/>
      <rect x="31" y="170" width="90" height="5" fill="#b98b5e"/>
      <g fill="#c98a4b"><ellipse cx="48" cy="161" rx="13" ry="8.5"/><ellipse cx="76" cy="159" rx="15" ry="10"/><ellipse cx="103" cy="161" rx="12" ry="8.5"/></g>
      <g stroke="#a76a33" stroke-width="2" opacity=".55"><path d="M41 158l6-4M48 160l6-4M69 156l7-5M77 158l7-5M97 158l6-4"/></g>
      <g fill="#dba361"><circle cx="44" cy="194" r="7"/><circle cx="59" cy="194" r="7"/><circle cx="74" cy="194" r="7"/></g>
      <path d="M96 196 C90 189 94 183 99 185 C103 187 103 193 101 196 C99 193 99 187 103 185 C108 183 112 189 106 196 C103 199 99 199 96 196Z" fill="none" stroke="#b7742f" stroke-width="3"/>
      <rect x="142" y="116" width="58" height="120" rx="3" fill="#6b4a2f"/>
      <rect x="150" y="124" width="42" height="58" rx="2" fill="#dbeaf2"/>
      <path d="M154 128 h12 l-12 22z" fill="#fff" opacity=".55"/>
      <circle cx="190" cy="192" r="3" fill="#e9c46a"/>`,
    jonas: () => `
      <rect x="14" y="28" width="212" height="208" fill="#eceef1"/>
      <rect x="14" y="28" width="212" height="46" fill="#23262d"/>
      <text x="120" y="58" text-anchor="middle" font-family="'Plus Jakarta Sans',system-ui,sans-serif" font-weight="800" font-size="18" letter-spacing="5" fill="#fff">TRENDWERK</text>
      <rect x="26" y="86" width="120" height="150" fill="#f8fafb" stroke="#23262d" stroke-width="4"/>
      <g><circle cx="60" cy="110" r="8" fill="#d3d7dc"/>
        <path d="M43 122 Q60 116 77 122 L81 168 H39Z" fill="#3f7cc4"/><path d="M43 122 L34 146 L41 149 L47 132Z M77 122 L86 146 L79 149 L73 132Z" fill="#3f7cc4"/>
        <path d="M60 168 V226 M50 228 h20" stroke="#9aa0a8" stroke-width="3"/></g>
      <g><circle cx="112" cy="110" r="8" fill="#d3d7dc"/>
        <path d="M95 122 Q112 116 129 122 L133 172 H91Z" fill="#e2a33b"/><path d="M95 122 L86 150 L93 153 L99 132Z M129 122 L138 150 L131 153 L125 132Z" fill="#e2a33b"/>
        <path d="M100 121 Q112 133 124 121" fill="none" stroke="#c08423" stroke-width="3"/><rect x="103" y="148" width="18" height="10" rx="3" fill="#c08423"/>
        <path d="M112 172 V226 M102 228 h20" stroke="#9aa0a8" stroke-width="3"/></g>
      <rect x="158" y="86" width="56" height="150" fill="#d6e4ec" stroke="#23262d" stroke-width="4"/>
      <path d="M164 96 h14 l-14 30z" fill="#fff" opacity=".6"/>
      <path d="M167 152 V178" stroke="#23262d" stroke-width="3" stroke-linecap="round"/>`,
    lena: () => `
      <rect x="14" y="28" width="212" height="208" fill="#2f5b4f"/>
      <rect x="8" y="20" width="224" height="12" rx="2" fill="#244a40"/>
      <text x="120" y="64" text-anchor="middle" font-family="Georgia,serif" font-style="italic" font-weight="700" font-size="23" fill="#f3e6c8">Café Krümel</text>
      ${luifel(18, 222, 76, 96, 8, 8, '#f3e6c8', '#3f7a69')}
      <rect x="26" y="114" width="108" height="80" rx="4" fill="#fff5e3" stroke="#1f3f36" stroke-width="5"/>
      <path d="M52 174 h52 M78 174 v8 M68 182 h20" stroke="#9aa3a8" stroke-width="3"/>
      <path d="M56 174 V159 Q78 149 100 159 V174Z" fill="#e7b46e"/><path d="M56 159 Q78 149 100 159 V165 Q78 156 56 165Z" fill="#fffaf2"/><circle cx="78" cy="151" r="4" fill="#c94f4f"/>
      <rect x="110" y="164" width="14" height="10" rx="2" fill="#fff" stroke="#c9b48f" stroke-width="2"/>
      <rect x="150" y="110" width="60" height="126" rx="3" fill="#1f3f36"/>
      <rect x="158" y="118" width="44" height="64" rx="2" fill="#dbeaf2" opacity=".9"/>
      <circle cx="160" cy="192" r="3" fill="#e9c46a"/>
      <ellipse cx="72" cy="214" rx="24" ry="5" fill="#3b3b40"/><path d="M72 214 V233 M63 233 h18" stroke="#3b3b40" stroke-width="3"/>
      <path d="M38 233 V204 M38 218 H50 V233 M106 233 V204 M106 218 H94 V233" stroke="#3b3b40" stroke-width="3" fill="none"/>
      <rect x="66" y="203" width="11" height="8" rx="2" fill="#fff"/>`,
    schmidt: () => `
      <path d="M6 54 L120 14 L234 54Z" fill="#8f4f30"/>
      <rect x="8" y="52" width="224" height="184" fill="#b8693f"/>
      <g stroke="#a35a35" stroke-width="1.4" opacity=".7">${Array.from({ length: 16 }, (_, i) => `<path d="M8 ${96 + i * 9} H232"/>`).join('')}</g>
      <circle cx="120" cy="40" r="14" fill="#fbf8f2" stroke="#5a3424" stroke-width="3"/><path d="M120 40 V31 M120 40 L126 44" stroke="#2c2a30" stroke-width="2.5" stroke-linecap="round"/>
      <rect x="24" y="64" width="192" height="24" rx="3" fill="#1f3a5f"/>
      <text x="120" y="80.8" text-anchor="middle" font-family="'Plus Jakarta Sans',system-ui,sans-serif" font-weight="800" font-size="13" letter-spacing="3" fill="#fff">HAUPTBAHNHOF</text>
      <path d="M84 236 V146 A36 36 0 0 1 156 146 V236Z" fill="#e3ebf0" stroke="#efe6da" stroke-width="5"/>
      <path d="M120 110 V236 M84 172 H156" stroke="#b8c4cc" stroke-width="3"/>
      <path d="M26 206 V142 A17 17 0 0 1 60 142 V206Z M180 206 V142 A17 17 0 0 1 214 142 V206Z" fill="#dfe8ee" stroke="#efe6da" stroke-width="4"/>
      <rect x="168" y="214" width="54" height="17" rx="3" fill="#fff"/>
      <text x="195" y="226" font-size="8.5" font-weight="800" text-anchor="middle" fill="#1f3a5f" font-family="system-ui,sans-serif">Fahrkarten</text>`,
  };
  function gevel(id) {
    const naam = (window.WINKELS.find((w) => w.id === id) || {}).naam || '';
    return `<svg class="gevel" viewBox="0 0 240 250" role="img" aria-label="De gevel van ${naam}">${GEVEL[id]()}${STOEP}</svg>`;
  }

  // ---------- de verkopers ----------
  const PERSOON = {
    becker: { naam: 'Frau Becker', huid: '#efc3a1', huidD: '#d8a07f', haar: '#9b8b7d', haarD: '#7d6e61', wenk: '#6b5d52', lip: '#b6575c', pupil: '#4a3a2e', shirt: '#a9473c', stijl: 'knot', vrouw: true, plek: 'bakkerij' },
    jonas: { naam: 'Jonas', huid: '#c48c67', huidD: '#aa714f', haar: '#2b211b', haarD: '#1c1511', wenk: '#221914', lip: '#985347', pupil: '#2e211a', shirt: '#2c2f3a', stijl: 'kort', plek: 'mode' },
    lena: { naam: 'Lena', huid: '#f2cfb3', huidD: '#ddac8d', haar: '#a6522b', haarD: '#86401f', wenk: '#7c3a1d', lip: '#c05a66', pupil: '#4d5a36', shirt: '#f6f3ed', stijl: 'staart', vrouw: true, plek: 'cafe' },
    schmidt: { naam: 'Herr Schmidt', huid: '#e5b490', huidD: '#cc9672', haar: '#cfc9c1', haarD: '#b3ada5', wenk: '#9a938a', lip: '#a6645a', pupil: '#3a3f4a', shirt: '#1f3a5f', stijl: 'pet', bril: true, snor: true, das: '#b8932f', plek: 'bahnhof' },
  };

  function achtergrond(plek, u) {
    if (plek === 'bakkerij') return `
      <defs><pattern id="tegels${u}" width="64" height="44" patternUnits="userSpaceOnUse"><rect width="64" height="44" fill="#f4e8d6"/><rect x="1" y="1" width="62" height="42" fill="none" stroke="#e7d6bc" stroke-width="2"/></pattern></defs>
      <rect width="900" height="760" fill="url(#tegels${u})"/>
      <rect x="36" y="86" width="214" height="252" rx="8" fill="#2f3530" stroke="#8a6a4a" stroke-width="10"/>
      <text x="143" y="136" fill="#f3efe4" font-size="27" font-family="Georgia,serif" font-style="italic" text-anchor="middle">Heute frisch</text>
      <path d="M78 150 h130" stroke="#f3efe4" stroke-width="2" opacity=".5"/>
      <g fill="#e9e4d6" font-size="20" font-family="Georgia,serif"><text x="70" y="186">Brötchen</text><text x="70" y="218">Brezeln</text><text x="70" y="250">Croissants</text><text x="70" y="282">Roggenbrot</text><text x="70" y="314">Apfelkuchen</text></g>
      <rect x="650" y="70" width="250" height="470" fill="#c99d6f"/>
      <g fill="#8f6440"><rect x="640" y="186" width="260" height="12"/><rect x="640" y="300" width="260" height="12"/><rect x="640" y="414" width="260" height="12"/></g>
      <g fill="#c4843f"><ellipse cx="700" cy="164" rx="40" ry="22"/><ellipse cx="790" cy="160" rx="44" ry="26"/><ellipse cx="870" cy="166" rx="34" ry="20"/>
        <ellipse cx="712" cy="280" rx="44" ry="22"/><ellipse cx="808" cy="278" rx="40" ry="24"/>
        <circle cx="690" cy="398" r="17"/><circle cx="728" cy="398" r="17"/><circle cx="766" cy="398" r="17"/><circle cx="804" cy="398" r="17"/><circle cx="842" cy="398" r="17"/></g>
      <g fill="#8a5426" opacity=".9"><ellipse cx="876" cy="282" rx="28" ry="18"/></g>
      <g stroke="#a26a30" stroke-width="3" fill="none" opacity=".6"><path d="M680 158 l12 -9 M698 160 l12 -9 M770 154 l12 -9 M790 156 l12 -9 M810 158 l12 -9 M694 276 l12 -9 M714 278 l12 -9"/></g>
      <path d="M560 0 V58" stroke="#5b4636" stroke-width="3"/><path d="M516 58 h88 l-16 26 h-56z" fill="#3b2e26"/><ellipse cx="560" cy="86" rx="22" ry="5" fill="#ffe7a8" opacity=".8"/>`;
    if (plek === 'mode') return `
      <rect width="900" height="760" fill="#eef0f3"/>
      <rect y="0" width="900" height="54" fill="#e2e5ea"/>
      <path d="M20 152 H262" stroke="#8b9097" stroke-width="6" stroke-linecap="round"/>
      ${[['#3f7cc4', 44], ['#d0574f', 90], ['#2f9e6e', 136], ['#8d939b', 182], ['#e2a33b', 228]].map(([k, x]) => `
        <path d="M${x} 152 v10 M${x - 18} 176 L${x} 162 L${x + 18} 176" stroke="#6f747b" stroke-width="3" fill="none"/>
        <path d="M${x - 20} 176 Q${x} 170 ${x + 20} 176 L${x + 22} 262 H${x - 22}Z" fill="${k}"/>
        <path d="M${x - 20} 176 L${x - 30} 214 L${x - 22} 218 L${x - 16} 194Z M${x + 20} 176 L${x + 30} 214 L${x + 22} 218 L${x + 16} 194Z" fill="${k}"/>`).join('')}
      <rect x="46" y="350" width="170" height="80" rx="8" fill="#23262d"/>
      <text x="131" y="402" text-anchor="middle" fill="#fff" font-size="30" font-weight="800" letter-spacing="6" font-family="'Plus Jakarta Sans',system-ui,sans-serif">NEU</text>
      <rect x="704" y="66" width="160" height="460" rx="80" fill="#dfe9ef" stroke="#c9b48f" stroke-width="10"/>
      <path d="M740 140 L800 100 M736 200 L830 136" stroke="#fff" stroke-width="10" stroke-linecap="round" opacity=".7"/>
      <path d="M600 0 V70" stroke="#6f747b" stroke-width="3"/><circle cx="600" cy="86" r="18" fill="#fff6d8"/>`;
    if (plek === 'cafe') return `
      <rect width="900" height="760" fill="#efe3cf"/>
      <rect y="330" width="900" height="430" fill="#2f5b4f"/><rect y="324" width="900" height="10" fill="#244a40"/>
      <rect x="36" y="64" width="222" height="236" rx="8" fill="#26302c" stroke="#8a6a4a" stroke-width="8"/>
      <text x="147" y="112" fill="#f3e6c8" font-size="25" font-family="Georgia,serif" font-style="italic" text-anchor="middle">Kaffee &amp; Kuchen</text>
      <g fill="#e9e1cf" font-size="17" font-family="Georgia,serif"><text x="64" y="152">Kakao</text><text x="64" y="180">Apfelschorle</text><text x="64" y="208">Käsekuchen</text><text x="64" y="236">Waffel</text><text x="64" y="264">Käsetoast</text></g>
      <path d="M140 208 H230" stroke="#e9e1cf" stroke-width="2" opacity=".0"/>
      <rect x="652" y="150" width="248" height="10" fill="#8a6a4a"/><rect x="652" y="250" width="248" height="10" fill="#8a6a4a"/>
      ${[[684, '#f6f3ee'], [730, '#c94f4f'], [776, '#f6f3ee'], [822, '#3f7a69'], [866, '#e2a33b']].map(([x, k]) => `<rect x="${x - 16}" y="118" width="32" height="32" rx="4" fill="${k}"/><path d="M${x + 16} 126 q12 0 12 10 q0 10 -12 10" stroke="${k}" stroke-width="5" fill="none"/>`).join('')}
      <rect x="676" y="198" width="44" height="52" rx="8" fill="#d9c6a3"/><rect x="740" y="190" width="44" height="60" rx="8" fill="#b9d3c7"/><rect x="804" y="204" width="44" height="46" rx="8" fill="#e8c9a1"/>
      <path d="M640 0 V86" stroke="#3b2e26" stroke-width="3"/><path d="M608 86 a32 22 0 0 1 64 0z" fill="#e2a33b"/><ellipse cx="640" cy="88" rx="18" ry="4" fill="#fff3c4"/>
      <path d="M120 760 C100 640 130 560 160 520 C170 600 160 690 150 760Z M150 760 C160 650 200 590 240 560 C230 640 200 700 180 760Z" fill="#5e9a6f"/>`;
    // bahnhof
    return `
      <rect width="900" height="760" fill="#dfe3e8"/>
      <rect y="0" width="900" height="40" fill="#cfd5dc"/>
      <circle cx="132" cy="150" r="66" fill="#fff" stroke="#2c3e55" stroke-width="10"/>
      ${Array.from({ length: 12 }, (_, i) => { const a = i * Math.PI / 6; return `<path d="M${(132 + Math.sin(a) * 50).toFixed(1)} ${(150 - Math.cos(a) * 50).toFixed(1)} L${(132 + Math.sin(a) * 58).toFixed(1)} ${(150 - Math.cos(a) * 58).toFixed(1)}" stroke="#2c3e55" stroke-width="${i % 3 ? 3 : 6}"/>`; }).join('')}
      <path d="M132 150 L${(132 + Math.sin(1.92 * Math.PI / 6) * 30).toFixed(1)} ${(150 - Math.cos(1.92 * Math.PI / 6) * 30).toFixed(1)}" stroke="#1d2b44" stroke-width="7" stroke-linecap="round"/>
      <path d="M132 150 L${(132 + Math.sin(55 * Math.PI / 30) * 46).toFixed(1)} ${(150 - Math.cos(55 * Math.PI / 30) * 46).toFixed(1)}" stroke="#1d2b44" stroke-width="4.5" stroke-linecap="round"/>
      <circle cx="132" cy="150" r="5" fill="#c94f4f"/>
      <rect x="40" y="250" width="186" height="34" rx="5" fill="#1f3a5f"/><text x="133" y="273" text-anchor="middle" fill="#fff" font-size="17" font-weight="800" font-family="system-ui,sans-serif">Fahrkarten</text>
      <rect x="722" y="64" width="172" height="214" rx="6" fill="#1d2b44"/>
      <text x="736" y="96" fill="#f1c84b" font-size="18" font-weight="800" font-family="system-ui,sans-serif">Abfahrt</text>
      <g fill="#e8edf3" font-size="13.5" font-family="ui-monospace,Consolas,monospace">
        <text x="736" y="134">13:58</text><text x="784" y="134">Essen</text><text x="882" y="134" text-anchor="end">4</text>
        <text x="736" y="166">14:05</text><text x="784" y="166">Dortmund</text><text x="882" y="166" text-anchor="end">11</text>
        <text x="736" y="198">14:20</text><text x="784" y="198">Duisburg</text><text x="882" y="198" text-anchor="end">2</text>
        <text x="736" y="230">14:31</text><text x="784" y="230">Hagen</text><text x="882" y="230" text-anchor="end">6</text></g>`;
  }

  function voorgrond(plek) {
    if (plek === 'bakkerij') return `
      <rect y="660" width="900" height="100" fill="#8a5a3c"/><rect y="648" width="900" height="16" fill="#a86f4b"/>
      <path d="M84 650 h176 l-14 -40 h-148z" fill="#b5834f"/><path d="M98 610 h148" stroke="#94673a" stroke-width="4"/>
      <g fill="#d9a05e"><circle cx="120" cy="604" r="17"/><circle cx="156" cy="600" r="17"/><circle cx="192" cy="602" r="17"/><circle cx="226" cy="606" r="15"/><circle cx="138" cy="588" r="15"/><circle cx="174" cy="586" r="15"/><circle cx="208" cy="590" r="14"/></g>
      <rect x="690" y="574" width="156" height="78" rx="10" fill="#d9d4cc"/><rect x="706" y="590" width="82" height="30" rx="4" fill="#2b2b30"/><rect x="800" y="590" width="30" height="46" rx="4" fill="#bfb8ad"/>`;
    if (plek === 'mode') return `
      <rect y="660" width="900" height="100" fill="#cdb594"/><rect y="648" width="900" height="16" fill="#e0cba8"/>
      <rect x="100" y="620" width="150" height="30" rx="4" fill="#3f7cc4"/><rect x="108" y="596" width="136" height="26" rx="4" fill="#f4f4f4"/><rect x="114" y="574" width="124" height="24" rx="4" fill="#2f9e6e"/>
      <rect x="720" y="600" width="64" height="50" rx="8" fill="#2b2b30"/><rect x="730" y="610" width="44" height="16" rx="3" fill="#8fd0b8"/>`;
    if (plek === 'cafe') return `
      <rect y="660" width="900" height="100" fill="#3a2e28"/><rect y="648" width="900" height="16" fill="#5a463b"/>
      <path d="M120 650 h150" stroke="#9aa3a8" stroke-width="5"/><path d="M134 650 V614 Q195 594 256 614 V650Z" fill="#e7b46e"/><path d="M134 614 Q195 594 256 614 V624 Q195 606 134 624Z" fill="#fffaf2"/>
      <path d="M120 650 a75 75 0 0 1 150 0" fill="#e8f1f5" opacity=".45" stroke="#c9d6dc" stroke-width="3"/>
      <rect x="680" y="518" width="176" height="132" rx="12" fill="#c9ccd1"/><rect x="696" y="534" width="144" height="40" rx="6" fill="#2b2b30"/><rect x="740" y="588" width="56" height="12" rx="3" fill="#8b9097"/><rect x="748" y="606" width="40" height="40" rx="4" fill="#fff"/>`;
    // bahnhof: loketraam, dan toonbank
    return `
      <g fill="#8f99a6"><rect x="232" y="26" width="18" height="640"/><rect x="690" y="26" width="18" height="640"/><rect x="232" y="26" width="476" height="18"/></g>
      <path d="M256 44 H330 L250 200 V44Z M640 44 H684 V120Z" fill="#fff" opacity=".22"/>
      <circle cx="470" cy="600" r="30" fill="none" stroke="#8f99a6" stroke-width="5"/>
      <g fill="#8f99a6">${[-14, 0, 14].map((dx) => [-14, 0, 14].map((dy) => `<circle cx="${470 + dx}" cy="${600 + dy}" r="3"/>`).join('')).join('')}</g>
      <rect y="660" width="900" height="100" fill="#6f7a87"/><rect y="648" width="900" height="16" fill="#8f99a6"/>
      <rect x="380" y="640" width="180" height="10" rx="3" fill="#5c6672"/>
      <rect x="730" y="586" width="124" height="64" rx="8" fill="#3a4350"/><rect x="762" y="570" width="60" height="22" fill="#fff"/><rect x="742" y="600" width="40" height="8" rx="2" fill="#8fd0b8"/>`;
  }

  function lijf(p) {
    let s = `<path d="M250 760 C260 610 330 560 470 556 C610 560 680 610 690 760 Z" fill="${p.shirt}"/>`;
    if (p.stijl === 'knot') s += `<path d="M360 760 L372 604 C410 594 530 594 568 604 L580 760 Z" fill="#fbf7ef"/><path d="M372 604 L400 558 M568 604 L540 558" stroke="#fbf7ef" stroke-width="16"/>`;
    if (p.stijl === 'staart') s += `<path d="M394 760 L402 636 C430 628 510 628 538 636 L546 760Z" fill="#2b2b30"/><path d="M402 636 L436 566 M538 636 L504 566" stroke="#2b2b30" stroke-width="11"/>`;
    s += `<rect x="430" y="470" width="80" height="100" rx="30" fill="${p.huidD}"/>`;
    if (p.stijl === 'kort') s += `<path d="M422 562 Q470 600 518 562" stroke="#1f2129" stroke-width="13" fill="none" stroke-linecap="round"/><rect x="548" y="610" width="78" height="28" rx="6" fill="#fff"/><text x="587" y="630" font-size="16" font-weight="800" text-anchor="middle" fill="#2c2f3a" font-family="system-ui,sans-serif">Jonas</text>`;
    if (p.stijl === 'staart') s += `<path d="M430 560 L468 594 L444 612Z M510 560 L472 594 L496 612Z" fill="#fff" stroke="#e2ddd3" stroke-width="3" stroke-linejoin="round"/>`;
    if (p.stijl === 'pet') s += `<path d="M426 560 L470 650 L514 560Z" fill="#f4f4f2"/><path d="M462 574 H478 L485 640 L470 660 L455 640Z" fill="${p.das}"/>
      <path d="M426 560 L470 650 L452 668 L398 588Z M514 560 L470 650 L488 668 L542 588Z" fill="#16304f"/><rect x="560" y="612" width="70" height="22" rx="4" fill="#e8edf3"/><text x="595" y="628" font-size="13" font-weight="800" text-anchor="middle" fill="#1f3a5f" font-family="system-ui,sans-serif">Schmidt</text>`;
    return s;
  }

  function hoofd(p, I) {
    let achter = '', haar = '', extra = '';
    if (p.stijl === 'knot') {
      achter = `<circle cx="470" cy="152" r="46" fill="${p.haarD}"/><path d="M436 146 q34 -16 68 0" stroke="${p.haar}" stroke-width="6" fill="none"/>`;
      haar = `<path d="M346 316 C330 196 394 140 470 140 C548 140 612 196 594 316 C588 262 566 222 530 204 C500 220 440 222 410 206 C378 226 352 266 346 316Z" fill="${p.haar}"/><path d="M470 142 C462 170 450 192 424 208" stroke="${p.haarD}" stroke-width="4" fill="none" opacity=".7"/>`;
    } else if (p.stijl === 'kort') {
      haar = `<path d="M350 292 C334 182 400 128 476 130 C556 132 612 188 590 294 C584 240 562 206 528 196 C496 212 440 214 404 204 C378 224 360 256 350 292Z" fill="${p.haar}"/><path d="M406 162 C440 118 522 118 560 160 C522 144 456 144 406 162Z" fill="${p.haar}"/>`;
      extra = `<path d="M372 352 C380 420 420 446 470 448 C520 446 560 420 568 352" fill="none" stroke="#3b2a20" stroke-width="5" opacity=".12" stroke-linecap="round"/>`;
    } else if (p.stijl === 'staart') {
      achter = `<path d="M564 198 C650 218 666 342 632 442 C618 482 598 510 580 528 C594 448 604 366 566 296Z" fill="${p.haarD}"/><circle cx="574" cy="206" r="13" fill="#2b2b30"/>`;
      haar = `<path d="M340 322 C320 186 394 126 470 126 C556 126 620 186 600 322 C592 262 572 222 542 202 C500 232 420 238 378 210 C356 238 344 280 340 322Z" fill="${p.haar}"/>`;
      extra = `<circle cx="351" cy="352" r="6.5" fill="#e2b33c"/><circle cx="589" cy="352" r="6.5" fill="#e2b33c"/>`;
    } else if (p.stijl === 'pet') {
      haar = `<path d="M350 316 C346 272 354 240 372 222 L386 316Z M590 316 C594 272 586 240 568 222 L554 316Z" fill="${p.haar}"/>
        <path d="M356 206 C344 158 386 124 470 122 C554 124 596 158 584 206Z" fill="#1f3a5f"/><rect x="352" y="188" width="236" height="26" rx="8" fill="#152b47"/>
        <path d="M366 212 C418 240 522 240 574 212 C566 230 522 244 470 246 C418 244 374 230 366 212Z" fill="#0e1f33"/><circle cx="470" cy="164" r="11" fill="${p.das}"/>`;
    }
    const bw = p.vrouw ? 7 : 10;
    return `${achter}
      <ellipse cx="352" cy="318" rx="20" ry="30" fill="${p.huidD}"/><ellipse cx="588" cy="318" rx="20" ry="30" fill="${p.huidD}"/>
      <ellipse cx="470" cy="300" rx="120" ry="146" fill="${p.huid}"/>
      ${haar}${extra}
      <ellipse ${I('fWangL')} cx="402" cy="362" rx="30" ry="17" fill="#e9826f" opacity=".08"/><ellipse ${I('fWangR')} cx="538" cy="362" rx="30" ry="17" fill="#e9826f" opacity=".08"/>
      <g ${I('fOogL')}><ellipse cx="420" cy="300" rx="20" ry="14" fill="#fff"/><circle ${I('fPupL')} cx="420" cy="301" r="9" fill="${p.pupil}"/><circle cx="423" cy="297" r="3" fill="#fff"/></g>
      <g ${I('fOogR')}><ellipse cx="520" cy="300" rx="20" ry="14" fill="#fff"/><circle ${I('fPupR')} cx="520" cy="301" r="9" fill="${p.pupil}"/><circle cx="523" cy="297" r="3" fill="#fff"/></g>
      <path ${I('fWenkL')} d="M392 268 Q420 258 446 266" stroke="${p.wenk}" stroke-width="${bw}" stroke-linecap="round" fill="none"/>
      <path ${I('fWenkR')} d="M494 266 Q520 258 548 268" stroke="${p.wenk}" stroke-width="${bw}" stroke-linecap="round" fill="none"/>
      ${p.bril ? `<g fill="none" stroke="#6b5a48" stroke-width="5"><circle cx="420" cy="301" r="32"/><circle cx="520" cy="301" r="32"/><path d="M452 298 Q470 288 488 298"/><path d="M388 296 L356 288 M552 296 L584 288"/></g>` : ''}
      <path d="M470 300 C462 330 456 352 462 362 C468 368 478 368 484 362" stroke="${p.huidD}" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path ${I('fMond')} d="M420 398 Q470 412 520 398 Q470 420 420 398Z" fill="#6e2a2a" stroke="${p.lip}" stroke-width="7" stroke-linejoin="round"/>
      ${p.snor ? `<path d="M428 384 C446 368 462 370 470 377 C478 370 494 368 512 384 C496 392 482 390 470 385 C458 390 444 392 428 384Z" fill="${p.haar}"/>` : ''}`;
  }

  let teller = 0;
  function portret(id, mini) {
    const p = PERSOON[id], u = ++teller;
    const I = mini ? () => '' : (n) => `id="${n}"`;
    const vb = mini ? '300 118 340 340' : '0 0 900 760';
    const naam = (window.WINKELS.find((w) => w.id === id) || {}).naam || '';
    return `<svg viewBox="${vb}" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${p.naam}${mini ? '' : ` in ${naam}`}">
      ${achtergrond(p.plek, u)}
      <g ${I('fLijf')}>${lijf(p)}</g>
      <g ${I('fHoofd')}>${hoofd(p, I)}</g>
      ${mini ? '' : voorgrond(p.plek)}
    </svg>`;
  }

  // ---------- het gezicht in beweging ----------
  const EMO = {
    neutraal: { bh: 0, ba: 0, smile: 0.18, w: 1, open: 0, blush: 0.06, oog: 1, kx: 0, ky: 0 },
    vriendelijk: { bh: -3, ba: 3, smile: 0.5, w: 1.05, open: 0.02, blush: 0.12, oog: 0.92, kx: 0, ky: 0 },
    blij: { bh: -6, ba: 5, smile: 0.85, w: 1.12, open: 0.08, blush: 0.22, oog: 0.74, kx: 0, ky: 0 },
    nadenkend: { bh: -4, ba: 6, smile: 0.02, w: 0.84, open: 0, blush: 0.04, oog: 0.9, kx: 7, ky: -6 },
    verbaasd: { bh: -12, ba: 3, smile: 0.05, w: 0.8, open: 0.26, blush: 0.04, oog: 1.16, kx: 0, ky: 0 },
    spijt: { bh: -2, ba: 12, smile: -0.22, w: 0.9, open: 0, blush: 0.06, oog: 0.9, kx: 0, ky: 2 },
  };
  const g = { emo: 'neutraal', cur: Object.assign({}, EMO.neutraal), mond: 0, knipper: 0, volgend: 2, t: 0 };
  const el = {};
  function koppel() { ['fMond', 'fWenkL', 'fWenkR', 'fWangL', 'fWangR', 'fOogL', 'fOogR', 'fPupL', 'fPupR', 'fHoofd', 'fLijf'].forEach((n) => { el[n] = document.getElementById(n); }); }
  function zetEmotie(e) { g.emo = EMO[e] ? e : 'neutraal'; }
  function reset() { g.cur = Object.assign({}, EMO.neutraal); g.emo = 'neutraal'; g.mond = 0; koppel(); }
  function teken(dt, spreekt, volume) {
    if (!el.fMond || !el.fMond.isConnected) koppel();
    if (!el.fMond) return;
    g.t += dt; const d = EMO[g.emo], c = g.cur, k = Math.min(1, dt * 5);
    for (const key in d) c[key] += (d[key] - c[key]) * k;
    const doel = spreekt ? c.open + 0.12 + volume * 0.95 : c.open;
    g.mond += (doel - g.mond) * Math.min(1, dt * 18);
    const cx = 470, cy = 400, hw = 50 * c.w, hoek = -c.smile * 16;
    const boven = cy - 4 - c.smile * 4 + g.mond * 4, onder = cy + 6 + c.smile * 16 + g.mond * 46;
    el.fMond.setAttribute('d', `M${(cx - hw).toFixed(1)} ${(cy + hoek).toFixed(1)} Q${cx} ${boven.toFixed(1)} ${(cx + hw).toFixed(1)} ${(cy + hoek).toFixed(1)} Q${cx} ${onder.toFixed(1)} ${(cx - hw).toFixed(1)} ${(cy + hoek).toFixed(1)}Z`);
    const yb = 266 + c.bh, bin = -c.ba;
    el.fWenkL.setAttribute('d', `M392 ${(yb + 3 - bin * 0.2).toFixed(1)} Q420 ${(yb - 8).toFixed(1)} 446 ${(yb + bin).toFixed(1)}`);
    el.fWenkR.setAttribute('d', `M494 ${(yb + bin).toFixed(1)} Q520 ${(yb - 8).toFixed(1)} 548 ${(yb + 3 - bin * 0.2).toFixed(1)}`);
    el.fWangL.setAttribute('opacity', c.blush.toFixed(2)); el.fWangR.setAttribute('opacity', c.blush.toFixed(2));
    g.volgend -= dt; if (g.volgend <= 0) { g.knipper = 0.14; g.volgend = 2.4 + Math.random() * 3.6; }
    g.knipper = Math.max(0, g.knipper - dt);
    const oog = g.knipper > 0 ? 0.08 : c.oog;
    el.fOogL.setAttribute('transform', `translate(420 300) scale(1 ${oog.toFixed(3)}) translate(-420 -300)`);
    el.fOogR.setAttribute('transform', `translate(520 300) scale(1 ${oog.toFixed(3)}) translate(-520 -300)`);
    const kx = c.kx + Math.sin(g.t * 0.7) * 1.5, ky = c.ky;
    el.fPupL.setAttribute('cx', (420 + kx).toFixed(1)); el.fPupL.setAttribute('cy', (301 + ky).toFixed(1));
    el.fPupR.setAttribute('cx', (520 + kx).toFixed(1)); el.fPupR.setAttribute('cy', (301 + ky).toFixed(1));
    const kant = Math.sin(g.t * 0.6) * 1.4 + (g.emo === 'nadenkend' ? 3 : 0) + (spreekt ? Math.sin(g.t * 2.3) * 0.8 : 0);
    el.fHoofd.setAttribute('transform', `rotate(${kant.toFixed(2)} 470 430)`);
    el.fLijf.setAttribute('transform', `translate(0 ${(Math.sin(g.t * 1.3) * 2).toFixed(2)})`);
  }

  window.Tekening = { gevel, portret, PERSOON };
  window.Gezicht = { zetEmotie, reset, teken, emoties: Object.keys(EMO), staat: g };
})();
