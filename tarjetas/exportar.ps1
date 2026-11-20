# Exporta la tarjeta a PDF (imprenta) y PNG (vista previa) con Chrome sin ventana.
# Uso:  powershell -ExecutionPolicy Bypass -File exportar.ps1
$chrome = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$dir = $PSScriptRoot
$out = Join-Path $dir "salida"
New-Item -ItemType Directory -Force $out | Out-Null
$url = "file:///" + ((Join-Path $dir "tarjeta.html") -replace '\\', '/' -replace ' ', '%20')
$base = @("--headless=new", "--disable-gpu", "--allow-file-access-from-files", "--hide-scrollbars", "--run-all-compositor-stages-before-draw", "--virtual-time-budget=15000")

# Si Chrome se cuelga (a veces pasa con --screenshot), se cierra a los 60 s y se reintenta una vez
function Run($extra) {
  foreach ($intento in 1, 2) {
    $p = Start-Process -FilePath $chrome -ArgumentList ($base + $extra) -PassThru -WindowStyle Hidden
    if ($p.WaitForExit(60000)) { return $p.ExitCode }
    taskkill /PID $p.Id /T /F | Out-Null
    Write-Warning "Chrome no respondió (intento $intento): $($extra[-2])"
  }
}

# PDF para imprenta: 2 páginas (tiro y retiro) de 9,4 x 5,8 cm con sangrado
Run @("--no-pdf-header-footer", "--print-to-pdf=`"$out\Tarjeta-Art-Sneyder-IMPRENTA.pdf`"", "`"$url`"") | Out-Null
# Mismo PDF con marcas de corte
Run @("--no-pdf-header-footer", "--print-to-pdf=`"$out\Tarjeta-Art-Sneyder-con-marcas.pdf`"", "`"$url`?ver=marcas`"") | Out-Null
# PNG a ~770 ppp de cada cara (con sangrado) y la presentación
Run @("--force-device-scale-factor=8", "--window-size=355,219", "--screenshot=`"$out\tiro.png`"", "`"$url`?ver=tiro`"") | Out-Null
Run @("--force-device-scale-factor=8", "--window-size=355,219", "--screenshot=`"$out\retiro.png`"", "`"$url`?ver=retiro`"") | Out-Null
Run @("--force-device-scale-factor=3", "--window-size=520,620", "--screenshot=`"$out\presentacion.png`"", "`"$url`?ver=mock`"") | Out-Null
Get-ChildItem $out | Select-Object Name, Length
