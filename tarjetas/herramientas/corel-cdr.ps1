param([string]$dir)
# Crea Tarjeta-Art-Sneyder.cdr en la Corel abierta importando los dos SVG de $dir.
# Solo cierra un documento si es este mismo .cdr; nunca toca los demás documentos abiertos.
$ErrorActionPreference = 'Stop'
$app = New-Object -ComObject CorelDRAW.Application
"Corel {0}.{1}" -f $app.VersionMajor, $app.VersionMinor
$previo = $null; try { $previo = $app.ActiveDocument } catch {}
$out = Join-Path $dir 'Tarjeta-Art-Sneyder.cdr'
foreach ($d in @($app.Documents)) { if ($d.FullFileName -eq $out) { $d.Dirty = $false; $d.Close() } }

$doc = $app.CreateDocument()
$doc.Unit = 3                      # milímetros
$doc.ReferencePoint = 5            # abajo-izquierda
$doc.MasterPage.SetSize([double]90, [double]54)
try { $doc.MasterPage.Bleed = [double]2 } catch { "Sin propiedad Bleed: $($_.Exception.Message)" }
$doc.AddPages(1) | Out-Null
# Guías (no se imprimen) del margen de seguridad a 4 mm del corte
$g = $doc.MasterPage.GuidesLayer
foreach ($x in 4, 86) { [void]$g.CreateGuide([double]$x, [double]0, [double]$x, [double]54) }
foreach ($y in 4, 50) { [void]$g.CreateGuide([double]0, [double]$y, [double]90, [double]$y) }

$caras = @(@{n = 'Tiro'; f = 'Tarjeta-Art-Sneyder-TIRO.svg'}, @{n = 'Retiro'; f = 'Tarjeta-Art-Sneyder-RETIRO.svg'})
for ($i = 0; $i -lt 2; $i++) {
  $pg = $doc.Pages.Item($i + 1); $pg.Activate(); $pg.Name = $caras[$i].n
  $file = [string](Join-Path $dir $caras[$i].f)
  try { $flt = $pg.ActiveLayer.ImportEx($file, [int]0, $app.CreateStructImportOptions()); $flt.Finish() }
  catch { $doc.Dirty = $false; $doc.Close(); throw }
  $sr = $app.ActiveSelectionRange
  "{0}: caja {1:N2} x {2:N2} mm" -f $caras[$i].n, $sr.SizeWidth, $sr.SizeHeight
  $sr.SetPosition([double]-2, [double]-2)
}
$doc.Pages.Item(1).Activate()
$doc.SaveAs($out, $app.CreateStructSaveAsOptions())
"Guardado: $out"
