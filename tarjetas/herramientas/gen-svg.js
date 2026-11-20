// Genera tiro.svg y retiro.svg editables (mm, sangrado 2 mm, texto vivo, todo vectorial).
// Uso: node gen-svg.js <carpeta assets> <carpeta salida>
const fs = require('fs');
const QR = require('qrcode');
const fas = require('@fortawesome/free-solid-svg-icons');
const fab = require('@fortawesome/free-brands-svg-icons');
const [assets, outDir] = process.argv.slice(2);
const logo = JSON.parse(fs.readFileSync(`${assets}/logo-trazos.json`, 'utf8'));

const PT = 0.352778;           // 1 pt en mm
const N = '#fd5f00', N2 = '#ff8a2b', N3 = '#c2410c';
const f = n => +n.toFixed(3);
// Ancho (en em) de "o acerca tu celular" en Inter SemiBold, medido en Chrome con fuentes/Inter-SemiBold.ttf
const ANCHO_NFC_EM = 8.90;

function head(id) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="94mm" height="58mm" viewBox="0 0 94 58" id="${id}">
<!-- Tarjeta NFC Art Sneyder 90 x 54 mm + 2 mm de sangrado. Corte: rectángulo x=2 y=2 w=90 h=54. -->
<clipPath id="sangrado"><rect x="0" y="0" width="94" height="58"/></clipPath>
<g id="arte" clip-path="url(#sangrado)">
`;
}
function logoG(id, x, y, w, fillIzq, fillDer) {
  const s = w / logo.w;
  return `<g id="${id}" transform="translate(${f(x)} ${f(y)}) scale(${s.toFixed(6)})">
  <path id="${id}-naranja" fill="${fillIzq}" d="${logo.izq}"/>
  <path id="${id}-derecha" fill="${fillDer}" d="${logo.der}"/>
</g>`;
}
// Icono Font Awesome centrado en (cx, cy) con alto h (mm)
function icon(def, cx, cy, h, fill, id) {
  const [w, , , , d] = def.icon; const s = h / 512;
  return `<path id="${id}" fill="${fill}" transform="translate(${f(cx - w * s / 2)} ${f(cy - h / 2)}) scale(${s.toFixed(6)})" d="${d}"/>`;
}
function text(o) {
  const a = [`x="${f(o.x)}"`, `y="${f(o.y)}"`, `font-family="${o.font}"`, `font-weight="${o.w}"`, `font-size="${f(o.size * PT)}"`];
  if (o.ls) a.push(`letter-spacing="${f(o.ls * o.size * PT)}"`);
  if (o.anchor) a.push(`text-anchor="${o.anchor}"`);
  a.push(`fill="${o.fill}"`);
  if (o.id) a.unshift(`id="${o.id}"`);
  return `<text ${a.join(' ')}>${o.body}</text>`;
}

// ================= TIRO =================
function tiro() {
  const lx = 28.5, ly = 7.6, lw = 37;
  const anillos = [[25, 17, .55], [32, 21.5, .38, '.6 .9'], [40, 27, .26], [49, 33, .18, '2 1.2'], [59, 40, .12]]
    .map(([rx, ry, o, da]) => `<ellipse cx="47" cy="21" rx="${rx}" ry="${ry}" fill="none" stroke="${N}" stroke-width=".12" opacity="${o}"${da ? ` stroke-dasharray="${da}"` : ''}/>`).join('\n  ');
  const nfcH = 8.4 * PT;   // alto del icono NFC
  return head('tiro') + `<defs>
  <linearGradient id="t-fondo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b0b0b"/><stop offset=".6" stop-color="#050505"/><stop offset="1" stop-color="#000"/></linearGradient>
  <radialGradient id="t-glow1"><stop offset="0" stop-color="${N}" stop-opacity=".42"/><stop offset=".55" stop-color="${N}" stop-opacity=".1"/><stop offset=".75" stop-color="${N}" stop-opacity="0"/><stop offset="1" stop-color="${N}" stop-opacity="0"/></radialGradient>
  <radialGradient id="t-glow2"><stop offset="0" stop-color="${N}" stop-opacity=".16"/><stop offset=".7" stop-color="${N}" stop-opacity="0"/><stop offset="1" stop-color="${N}" stop-opacity="0"/></radialGradient>
  <linearGradient id="t-izq" x1=".35" y1="0" x2=".65" y2="1"><stop offset="0" stop-color="#ffb066"/><stop offset=".22" stop-color="${N2}"/><stop offset=".55" stop-color="${N}"/><stop offset="1" stop-color="${N3}"/></linearGradient>
  <linearGradient id="t-der" x1=".65" y1="0" x2=".35" y2="1"><stop offset="0" stop-color="#fff"/><stop offset=".45" stop-color="#f1f1f1"/><stop offset="1" stop-color="#bdbdbd"/></linearGradient>
  <linearGradient id="t-raya" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${N}" stop-opacity="0"/><stop offset=".5" stop-color="${N}"/><stop offset="1" stop-color="${N}" stop-opacity="0"/></linearGradient>
</defs>
<g id="fondo">
  <rect id="fondo-negro" x="0" y="0" width="94" height="58" fill="url(#t-fondo)"/>
  <ellipse id="resplandor" cx="47" cy="22" rx="46" ry="30" fill="url(#t-glow1)"/>
  <ellipse id="resplandor-bajo" cx="47" cy="70" rx="80" ry="50" fill="url(#t-glow2)"/>
</g>
<g id="anillos">
  ${anillos}
  <line x1="0" y1="21" x2="20" y2="21" stroke="${N}" stroke-width=".1" opacity=".35"/>
  <line x1="74" y1="21" x2="94" y2="21" stroke="${N}" stroke-width=".1" opacity=".35"/>
</g>
${logoG('logo', lx, ly, lw, 'url(#t-izq)', 'url(#t-der)')}
<g id="textos">
  ${text({ id: 'marca', x: 47 + .53, y: 37.7, font: 'Poppins', w: 800, size: 15, ls: .2, anchor: 'middle', fill: '#fff', body: `<tspan fill="${N}">ART</tspan> SNEYDER` })}
  <rect id="rayita" x="39" y="38.2" width="16" height=".3" fill="url(#t-raya)"/>
  ${text({ id: 'eslogan', x: 47 + .33, y: 42.52, font: 'Inter', w: 500, size: 6.3, ls: .3, anchor: 'middle', fill: '#a3a3a3', body: `BRANDING <tspan fill="${N}">·</tspan> MOTION <tspan fill="${N}">·</tspan> WEB UX/UI` })}
  ${text({ id: 'est', x: 10.4, y: 51.43, font: 'Inter', w: 600, size: 5.6, ls: .22, fill: '#737373', body: 'EST. 2016' })}
  ${text({ id: 'ciudad', x: 83.6 + .43, y: 51.43, font: 'Inter', w: 600, size: 5.6, ls: .22, anchor: 'end', fill: '#737373', body: 'BOGOTÁ — CO' })}
</g>
<g id="nfc">
  ${icon(fab.faNfcDirectional, 83.6 - nfcH / 2, 7.4, nfcH, N, 'ico-nfc')}
  ${text({ id: 'nfc-texto', x: 83.6 - nfcH - .9 + .43, y: 8.1, font: 'Inter', w: 600, size: 5.6, ls: .22, anchor: 'end', fill: '#737373', body: 'ACERCA TU CELULAR' })}
</g>
<g id="esquinas" fill="none" stroke="${N}" stroke-width=".3">
  <path d="M6.15 9.15V6.15H9.15"/><path d="M84.85 6.15H87.85V9.15"/><path d="M6.15 48.85V51.85H9.15"/><path d="M84.85 51.85H87.85V48.85"/>
</g>
</g>
</svg>
`;
}

// ================= RETIRO =================
function qrRects(x, y, size) {
  const q = QR.create('https://sneyder.netlify.app', { errorCorrectionLevel: 'M' });
  const n = q.modules.size, m = size / n, out = [];
  for (let r = 0; r < n; r++) {
    let c = 0;
    while (c < n) {
      if (q.modules.get(r, c)) { let e = c; while (e < n && q.modules.get(r, e)) e++; out.push(`M${f(x + c * m)} ${f(y + r * m)}h${f((e - c) * m)}v${f(m)}h${f(-(e - c) * m)}z`); c = e; } else c++;
    }
  }
  return `<path id="qr-portafolio" fill="#0a0a0a" d="${out.join('')}"/>`;
}
function retiro() {
  // franjas diagonales del panel, recortadas al panel
  const rayas = [];
  for (let i = -40; i < 60; i++) { const x = 60 + i * 1.6 / Math.sin(65 * Math.PI / 180); rayas.push(`<line x1="${f(x)}" y1="0" x2="${f(x - 58 / Math.tan(65 * Math.PI / 180))}" y2="58"/>`); }
  const row = (i) => 29.6 + i * 5.15;
  const ico = (def, cx, top, id) => `<circle cx="${f(cx)}" cy="${f(top + 1.8)}" r="1.7" fill="none" stroke="${N}" stroke-opacity=".7" stroke-width=".2"/>\n  ` + icon(def, cx, top + 1.8, 5.6 * PT, N, id);
  const dato = (body, x, i, id) => text({ id, x, y: row(i) + 2.7, font: 'Inter', w: 500, size: 7, fill: '#e5e5e5', body });
  // "o acerca tu celular" centrado junto con su icono NFC
  const sz = 5.8 * PT, icoW = 6.6 * PT, hueco = .25 * sz, anchoTxt = ANCHO_NFC_EM * sz;
  const total = icoW + hueco + anchoTxt, x0 = 77.9 - total / 2;
  return head('retiro') + `<defs>
  <linearGradient id="r-fondo" x1=".33" y1="0" x2=".67" y2="1"><stop offset="0" stop-color="#111"/><stop offset=".55" stop-color="#070707"/><stop offset="1" stop-color="#000"/></linearGradient>
  <radialGradient id="r-glow"><stop offset="0" stop-color="${N}" stop-opacity=".13"/><stop offset=".7" stop-color="${N}" stop-opacity="0"/><stop offset="1" stop-color="${N}" stop-opacity="0"/></radialGradient>
  <linearGradient id="r-panel" x1=".37" y1="0" x2=".63" y2="1"><stop offset="0" stop-color="${N2}"/><stop offset=".45" stop-color="${N}"/><stop offset="1" stop-color="${N3}"/></linearGradient>
  <radialGradient id="r-brillo"><stop offset="0" stop-color="#ff9a3c"/><stop offset=".7" stop-color="#ff9a3c" stop-opacity="0"/><stop offset="1" stop-color="#ff9a3c" stop-opacity="0"/></radialGradient>
  <radialGradient id="r-icoglow"><stop offset="0" stop-color="${N}" stop-opacity=".45"/><stop offset="1" stop-color="${N}" stop-opacity="0"/></radialGradient>
  <linearGradient id="r-ico" x1=".25" y1="0" x2=".75" y2="1"><stop offset="0" stop-color="${N2}"/><stop offset="1" stop-color="${N3}"/></linearGradient>
  <linearGradient id="r-linea" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${N}"/><stop offset=".45" stop-color="${N}" stop-opacity=".25"/><stop offset="1" stop-color="${N}" stop-opacity="0"/></linearGradient>
  <clipPath id="r-clip-panel"><polygon points="67,0 94,0 94,58 62,58"/></clipPath>
</defs>
<g id="fondo">
  <rect id="fondo-negro" x="0" y="0" width="94" height="58" fill="url(#r-fondo)"/>
  <ellipse id="resplandor" cx="10" cy="0" rx="60" ry="40" fill="url(#r-glow)"/>
</g>
<g id="panel-naranja">
  <polygon id="panel" points="67,0 94,0 94,58 62,58" fill="url(#r-panel)"/>
  <g clip-path="url(#r-clip-panel)">
    <ellipse id="panel-brillo" cx="84.4" cy="14.5" rx="30" ry="30" fill="url(#r-brillo)"/>
    <g id="panel-rayas" stroke="#000" stroke-opacity=".07" stroke-width=".25">${rayas.join('')}</g>
  </g>
  <polygon id="filo-blanco" points="66.2,0 66.55,0 61.55,58 61.2,58" fill="#fff" fill-opacity=".9"/>
</g>
<g id="datos">
  ${text({ id: 'nombre', x: 7, y: 10.21, font: 'Poppins', w: 700, size: 10.4, ls: .01, fill: '#fff', body: 'Sneyder Riaño Hernández' })}
  ${text({ id: 'cargo', x: 7, y: 14.26, font: 'Inter', w: 600, size: 6.1, ls: .2, fill: N, body: 'DISEÑADOR GRÁFICO PROFESIONAL' })}
  <rect id="linea" x="7" y="16.2" width="50" height=".25" fill="url(#r-linea)"/>
  <circle cx="10.7" cy="22.37" r="6.2" fill="url(#r-icoglow)"/>
  <circle id="circulo-cel" cx="10.7" cy="22.37" r="3.7" fill="url(#r-ico)"/>
  ${icon(fas.faMobileScreenButton, 10.7, 22.37, 9 * PT, '#fff', 'ico-cel')}
  ${text({ id: 'cel-titulo', x: 16.6, y: 20.31, font: 'Inter', w: 600, size: 5.6, ls: .24, fill: '#8a8a8a', body: 'CELULAR · WHATSAPP' })}
  ${text({ id: 'celular', x: 16.6, y: 25.43, font: 'Poppins', w: 700, size: 13.2, ls: .02, fill: '#fff', body: `<tspan fill="${N}">+57</tspan> 311 811 3811` })}
  ${ico(fas.faEnvelope, 8.8, row(0), 'ico-correo')}
  ${dato('bogofija@gmail.com', 12.5, 0, 'correo')}
  ${ico(fab.faInstagram, 8.8, row(1), 'ico-instagram')}
  ${dato('@sneyder.rh', 12.5, 1, 'instagram')}
  ${text({ x: 30.4, y: row(1) + 2.7, font: 'Inter', w: 500, size: 7, anchor: 'middle', fill: '#525252', body: '|' })}
  ${ico(fab.faBehance, 35.0, row(1), 'ico-behance')}
  ${dato('art-sneyder', 38.7, 1, 'behance')}
  ${ico(fas.faLocationDot, 8.8, row(2), 'ico-ubicacion')}
  ${dato('Bogotá, Colombia', 12.5, 2, 'ubicacion')}
  ${text({ id: 'servicios', x: 7, y: 51.53, font: 'Inter', w: 600, size: 5.6, ls: .16, fill: '#6b6b6b', body: `DISEÑO <tspan fill="${N}">·</tspan> VIDEO <tspan fill="${N}">·</tspan> FOTO <tspan fill="${N}">·</tspan> SOCIAL <tspan fill="${N}">·</tspan> WEB` })}
</g>
<g id="qr">
  <rect id="qr-fondo" x="68.2" y="7.4" width="19.4" height="19.4" rx="1.8" fill="#fff"/>
  ${qrRects(70.4, 9.6, 15)}
  ${text({ id: 'qr-titulo', x: 77.9 + .18, y: 30.76, font: 'Poppins', w: 800, size: 7.2, ls: .14, anchor: 'middle', fill: '#160700', body: 'ESCANÉAME' })}
  ${icon(fab.faNfcDirectional, x0 + icoW / 2, 33.25, icoW, '#160700', 'ico-nfc')}
  ${text({ id: 'qr-texto', x: x0 + icoW + hueco, y: 33.96, font: 'Inter', w: 600, size: 5.8, fill: '#160700', body: 'o acerca tu celular' })}
</g>
${logoG('logo', 70.9, 40.3, 14, '#160700', '#fff')}
</g>
</svg>
`;
}

fs.writeFileSync(`${outDir}/Tarjeta-Art-Sneyder-TIRO.svg`, tiro());
fs.writeFileSync(`${outDir}/Tarjeta-Art-Sneyder-RETIRO.svg`, retiro());
console.log('ok');
