<#
  Stáhne písma webu SK Červenka z Google Fonts a uloží je přímo k webu.
  Web pak nenačítá nic z Googlu (kvůli GDPR) a písma fungují i bez internetu.

  Spuštění (stačí jednou):  powershell -ExecutionPolicy Bypass -File nastroje\stahnout-fonty.ps1

  Co skript udělá:
  1. Stáhne písma (jen latinka včetně české diakritiky) do sk-cervenka\assets\fonts.
  2. Zapíše jejich popis do sk-cervenka\assets\fonts.css.
  3. V index.html nahradí odkaz na Google Fonts odkazem na assets/fonts.css.
  Když se cokoli nepovede, index.html nechá beze změny.
#>
param(
  [string]$Web = (Join-Path $PSScriptRoot '..\sk-cervenka')
)
$ErrorActionPreference = 'Stop'
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

$Web = (Resolve-Path -LiteralPath $Web).Path
$indexPath = Join-Path $Web 'index.html'
$fontDir = Join-Path $Web 'assets\fonts'
$cssPath = Join-Path $Web 'assets\fonts.css'
$utf8 = New-Object System.Text.UTF8Encoding($false)

$html = [IO.File]::ReadAllText($indexPath, [Text.Encoding]::UTF8)
$m = [regex]::Match($html, '<link rel="stylesheet" href="(https://fonts\.googleapis\.com/css2\?[^"]+)">')
if (-not $m.Success) {
  Write-Host 'V index.html už žádný odkaz na Google Fonts není. Nic není potřeba dělat.'
  exit 0
}
$cssUrl = [Net.WebUtility]::HtmlDecode($m.Groups[1].Value)

# Prohlížeč Chrome dostane od Googlu moderní formát woff2 rozdělený podle abecedy.
$ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36'
Write-Host 'Stahuji popis písem...'
$css = (Invoke-WebRequest -UseBasicParsing -Uri $cssUrl -Headers @{ 'User-Agent' = $ua }).Content

New-Item -ItemType Directory -Force -Path $fontDir | Out-Null
$bloky = [regex]::Matches($css, '/\*\s*([\w-]+)\s*\*/\s*(@font-face\s*\{[^}]*\})')
$vystup = New-Object Text.StringBuilder
[void]$vystup.AppendLine('/* Písma webu, uložená přímo na webu. Vygeneroval nastroje/stahnout-fonty.ps1. */')
$pocet = 0

foreach ($b in $bloky) {
  $sada = $b.Groups[1].Value
  if ($sada -ne 'latin' -and $sada -ne 'latin-ext') { continue }
  $blok = $b.Groups[2].Value
  $rodina = [regex]::Match($blok, "font-family:\s*'([^']+)'").Groups[1].Value
  $vaha = [regex]::Match($blok, 'font-weight:\s*(\d+)').Groups[1].Value
  $url = [regex]::Match($blok, 'url\((https://[^)]+)\)').Groups[1].Value
  if (-not $rodina -or -not $url) { continue }
  $jmeno = (($rodina.ToLower() -replace '[^a-z0-9]+', '-') + "-$vaha-$sada.woff2")
  Write-Host "  $jmeno"
  Invoke-WebRequest -UseBasicParsing -Uri $url -OutFile (Join-Path $fontDir $jmeno)
  [void]$vystup.AppendLine("/* $sada */")
  [void]$vystup.AppendLine($blok.Replace($url, "fonts/$jmeno"))
  $pocet++
}

if ($pocet -eq 0) { throw 'Nepodařilo se najít žádné písmo ke stažení. index.html zůstává beze změny.' }
[IO.File]::WriteAllText($cssPath, $vystup.ToString(), $utf8)

# Odkazy na Google pryč, místo nich vlastní soubor s písmy.
$html = [regex]::Replace($html, '[ \t]*<link rel="preconnect" href="https://fonts\.(googleapis|gstatic)\.com"[^>]*>\r?\n', '')
$html = $html.Replace($m.Value, '<link rel="stylesheet" href="assets/fonts.css">')
[IO.File]::WriteAllText($indexPath, $html, $utf8)

Write-Host ''
Write-Host "Hotovo: $pocet souborů s písmy v assets\fonts, web už nic nestahuje z Googlu."
Write-Host 'Při nahrávání na hosting nezapomeňte i na složku assets\fonts a soubor assets\fonts.css.'
