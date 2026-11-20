// JScript (cscript): corrige en el .cdr los pesos de fuente que la importación SVG de Corel
// descarta, recoloca los textos centrados/derecha, guarda y publica un PDF de control.
// Uso: cscript //nologo corel-fix.js <ruta del .cdr> <pdf de control>
var cdr = WScript.Arguments(0), pdf = WScript.Arguments(1);
var app = new ActiveXObject("CorelDRAW.Application");
var doc = null;
for (var i = 1; i <= app.Documents.Count; i++) { var d = app.Documents.Item(i); if (d.FullFileName.toLowerCase() == cdr.toLowerCase()) doc = d; }
if (!doc) { WScript.Echo("no encontré " + cdr); WScript.Quit(1); }
doc.Unit = 3;
// [prueba sobre el texto, fuente, negrita, alineación, x objetivo (mm, origen en el corte)]
// El espaciado entre letras ya llega como desplazamiento por letra: no se toca CharSpacing.
var reglas = [
  [/^ART S/,      "Poppins ExtraBold", false, "c", 45],
  [/^BRANDING/,   "Inter Medium",      false, "c", 45],
  [/^EST\./,      "Inter SemiBold",    false, "l"],
  [/^BOGOT/,      "Inter SemiBold",    false, "r", 81.6],
  [/^ACERCA/,     "Inter SemiBold",    false, "r", 77.74],
  [/^Sneyder R/,  "Poppins",           true,  "l"],
  [/^DISE.ADOR/,  "Inter SemiBold",    false, "l"],
  [/^CELULAR/,    "Inter SemiBold",    false, "l"],
  [/^\+57/,       "Poppins",           true,  "l"],
  [/^bogofija/,   "Inter Medium",      false, "l"],
  [/^@sneyder/,   "Inter Medium",      false, "l"],
  [/^\|$/,        "Inter Medium",      false, "c", 28.4],
  [/^art-sne/,    "Inter Medium",      false, "l"],
  [/^Bogot/,      "Inter Medium",      false, "l"],
  [/^DISE.O /,    "Inter SemiBold",    false, "l"],
  [/^ESCAN/,      "Poppins ExtraBold", false, "c", 75.9],
  [/^o acerca/,   "Inter SemiBold",    false, "l"]
];
var hechos = 0;
function fix(s) {
  var st = s.Text.Story, t = st.Text, r = null;
  for (var k = 0; k < reglas.length; k++) if (reglas[k][0].test(t)) { r = reglas[k]; break; }
  if (!r) { WScript.Echo("  sin regla: " + t); return; }
  var left = s.LeftX;
  st.Font = r[1]; st.Bold = r[2];
  if (r[3] == "c") s.Move(r[4] - s.CenterX, 0);
  else if (r[3] == "r") s.Move(r[4] - s.RightX, 0);
  else s.Move(left - s.LeftX, 0);
  hechos++;
}
function walk(shapes) {
  for (var k = 1; k <= shapes.Count; k++) {
    var s = shapes.Item(k);
    if (s.Type == 6) fix(s);
    try { if (s.Shapes.Count > 0) walk(s.Shapes); } catch (e) {}
    try { if (s.PowerClip != null) walk(s.PowerClip.Shapes); } catch (e) {}
  }
}
for (var p = 1; p <= 2; p++) { doc.Pages.Item(p).Activate(); walk(doc.Pages.Item(p).Shapes); }
WScript.Echo("textos corregidos: " + hechos);
doc.Pages.Item(1).Activate();
doc.Save();
doc.PublishToPDF(pdf);
WScript.Echo("ok");
