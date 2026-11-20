param([string]$pdf, [string]$outPrefix, [int]$width = 1800)
# Renderiza cada página de un PDF a PNG con Windows.Data.Pdf (WinRT), para revisar sin abrir programas
Add-Type -AssemblyName System.Runtime.WindowsRuntime
$null = [Windows.Storage.StorageFile, Windows.Storage, ContentType = WindowsRuntime]
$null = [Windows.Data.Pdf.PdfDocument, Windows.Data.Pdf, ContentType = WindowsRuntime]
$null = [Windows.Storage.Streams.InMemoryRandomAccessStream, Windows.Storage.Streams, ContentType = WindowsRuntime]
$asTask = [System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object { $_.Name -eq 'AsTask' -and $_.GetParameters().Count -eq 1 -and $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncOperation`1' } | Select-Object -First 1
$asTaskAction = [System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object { $_.Name -eq 'AsTask' -and $_.GetParameters().Count -eq 1 -and $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncAction' } | Select-Object -First 1
function Await($op, [Type]$t) { $task = $asTask.MakeGenericMethod($t).Invoke($null, @($op)); $task.Wait(); $task.Result }
$file = Await ([Windows.Storage.StorageFile]::GetFileFromPathAsync($pdf)) ([Windows.Storage.StorageFile])
$doc = Await ([Windows.Data.Pdf.PdfDocument]::LoadFromFileAsync($file)) ([Windows.Data.Pdf.PdfDocument])
for ($i = 0; $i -lt $doc.PageCount; $i++) {
  $page = $doc.GetPage($i)
  $opt = New-Object Windows.Data.Pdf.PdfPageRenderOptions
  $opt.DestinationWidth = $width
  $opt.DestinationHeight = [uint32]($width * $page.Size.Height / $page.Size.Width)
  $opt.BitmapEncoderId = [Windows.Graphics.Imaging.BitmapEncoder, Windows.Graphics.Imaging, ContentType = WindowsRuntime]::PngEncoderId
  $ms = New-Object Windows.Storage.Streams.InMemoryRandomAccessStream
  $asTaskAction.Invoke($null, @($page.RenderToStreamAsync($ms, $opt))).Wait()
  $net = [System.IO.WindowsRuntimeStreamExtensions]::AsStreamForRead($ms.GetInputStreamAt(0))
  $fs = [IO.File]::Create("$outPrefix-$($i + 1).png"); $net.CopyTo($fs); $fs.Close()
  "pagina $($i + 1): {0:N1} x {1:N1} mm" -f ($page.Size.Width / 96 * 25.4), ($page.Size.Height / 96 * 25.4)
}
