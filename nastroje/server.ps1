<#
  Místní náhled webu SK Červenka, bez instalace čehokoliv.
  Spuštění:  powershell -ExecutionPolicy Bypass -File nastroje\server.ps1
  Potom v prohlížeči otevřete  http://localhost:8137/
  Zastavení: Ctrl+C
#>
param(
  [int]$Port = 8137,
  [string]$Root = (Join-Path $PSScriptRoot '..\sk-cervenka')
)
$ErrorActionPreference = 'Stop'
$Root = (Resolve-Path -LiteralPath $Root).Path.TrimEnd('\')
$typy = @{
  '.html' = 'text/html; charset=utf-8'; '.css' = 'text/css; charset=utf-8'; '.js' = 'text/javascript; charset=utf-8'
  '.json' = 'application/json; charset=utf-8'; '.svg' = 'image/svg+xml'; '.jpg' = 'image/jpeg'; '.jpeg' = 'image/jpeg'
  '.png' = 'image/png'; '.webp' = 'image/webp'; '.gif' = 'image/gif'; '.ico' = 'image/x-icon'; '.mp4' = 'video/mp4'
  '.woff2' = 'font/woff2'; '.txt' = 'text/plain; charset=utf-8'
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Start()
Write-Host "Náhled webu běží na http://localhost:$Port/   (zastavení: Ctrl+C)"
try {
  while ($listener.IsListening) {
    $cekani = $listener.GetContextAsync()
    while (-not $cekani.AsyncWaitHandle.WaitOne(250)) { }
    $ctx = $cekani.Result
    try {
      $req = $ctx.Request
      $res = $ctx.Response
      $path = [System.Uri]::UnescapeDataString($req.Url.AbsolutePath)
      if ($path.EndsWith('/')) { $path += 'index.html' }
      $full = [System.IO.Path]::GetFullPath((Join-Path $Root ($path.TrimStart('/') -replace '/', '\')))
      if (-not $full.StartsWith($Root + '\') -or -not (Test-Path -LiteralPath $full -PathType Leaf)) {
        $res.StatusCode = 404
        $res.ContentType = 'text/plain; charset=utf-8'
        $body = [System.Text.Encoding]::UTF8.GetBytes('Soubor nenalezen.')
      } else {
        $body = [System.IO.File]::ReadAllBytes($full)
        $ext = [System.IO.Path]::GetExtension($full).ToLower()
        $res.ContentType = if ($typy.ContainsKey($ext)) { $typy[$ext] } else { 'application/octet-stream' }
      }
      $res.Headers['Cache-Control'] = 'no-store'
      $res.ContentLength64 = $body.Length
      if ($req.HttpMethod -ne 'HEAD') { $res.OutputStream.Write($body, 0, $body.Length) }
    } catch {
    } finally {
      try { $ctx.Response.OutputStream.Close() } catch { }
    }
  }
} finally {
  $listener.Stop()
  $listener.Close()
}
