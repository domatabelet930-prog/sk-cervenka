<#
  Připraví fotky pro web SK Červenka.

  1. Fotky nakopírujte do složky "fotky" (vedle složky sk-cervenka).
  2. Spusťte:  powershell -ExecutionPolicy Bypass -File nastroje\pripravit-fotky.ps1
  3. Skript fotky otočí podle telefonu, zmenší, uloží do sk-cervenka\assets\galerie
     a zapíše jejich seznam do sk-cervenka\assets\galerie.js.

  Popisek se vezme z názvu souboru: "oslava-80-let.jpg" se ukáže jako "Oslava 80 let".
  Fotky s názvem z telefonu (IMG_1234.jpg) dostanou jako popisek datum pořízení.
  Pořadí: nejnovější nahoře. Když názvy začínají číslem (01-tym.jpg), řadí se podle čísla.
#>
param(
  [string]$Zdroj = (Join-Path $PSScriptRoot '..\fotky'),
  [string]$Web = (Join-Path $PSScriptRoot '..\sk-cervenka'),
  [int]$Velka = 1920,
  [int]$Nahled = 720,
  [int]$Kvalita = 84
)
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName PresentationCore, WindowsBase

$Zdroj = (Resolve-Path -LiteralPath $Zdroj).Path
$Web = (Resolve-Path -LiteralPath $Web).Path
$cil = Join-Path $Web 'assets\galerie'
New-Item -ItemType Directory -Force -Path $cil | Out-Null

$pripony = @('.jpg', '.jpeg', '.png', '.heic', '.heif', '.webp', '.tif', '.tiff', '.bmp')
$soubory = @(Get-ChildItem -LiteralPath $Zdroj -File | Where-Object { $pripony -contains $_.Extension.ToLower() })

function Get-Slug([string]$s) {
  $n = $s.Normalize([Text.NormalizationForm]::FormD)
  $sb = New-Object Text.StringBuilder
  foreach ($ch in $n.ToCharArray()) {
    if ([Globalization.CharUnicodeInfo]::GetUnicodeCategory($ch) -ne [Globalization.UnicodeCategory]::NonSpacingMark) { [void]$sb.Append($ch) }
  }
  $t = ($sb.ToString().ToLowerInvariant() -replace '[^a-z0-9]+', '-').Trim('-')
  if (-not $t) { $t = 'foto' }
  return $t
}

function Read-Photo([string]$path) {
  $fs = [IO.File]::OpenRead($path)
  try {
    $dec = [Windows.Media.Imaging.BitmapDecoder]::Create($fs, [Windows.Media.Imaging.BitmapCreateOptions]::PreservePixelFormat, [Windows.Media.Imaging.BitmapCacheOption]::OnLoad)
    $frame = $dec.Frames[0]
    $orient = 1
    $datum = $null
    $m = $null
    try { $m = $frame.Metadata } catch { }
    if ($m) {
      try { $o = $m.GetQuery('System.Photo.Orientation'); if ($o) { $orient = [int]$o } } catch { }
      try {
        $raw = $m.GetQuery('/app1/ifd/exif/{ushort=36867}')
        if ($raw) { $datum = [datetime]::ParseExact(([string]$raw).Trim([char]0, ' '), 'yyyy:MM:dd HH:mm:ss', [Globalization.CultureInfo]::InvariantCulture) }
      } catch { }
      if (-not $datum) { try { if ($m.DateTaken) { $datum = [datetime]::Parse($m.DateTaken, [Globalization.CultureInfo]::CurrentCulture) } } catch { } }
    }
    return @{ Frame = $frame; Orient = $orient; Datum = $datum }
  } finally {
    $fs.Dispose()
  }
}

function Set-Orientation($src, [int]$o) {
  if ($o -le 1 -or $o -gt 8) { return $src }
  $tg = New-Object Windows.Media.TransformGroup
  switch ($o) {
    2 { $tg.Children.Add((New-Object Windows.Media.ScaleTransform(-1, 1))) }
    3 { $tg.Children.Add((New-Object Windows.Media.RotateTransform(180))) }
    4 { $tg.Children.Add((New-Object Windows.Media.ScaleTransform(1, -1))) }
    5 { $tg.Children.Add((New-Object Windows.Media.RotateTransform(90))); $tg.Children.Add((New-Object Windows.Media.ScaleTransform(-1, 1))) }
    6 { $tg.Children.Add((New-Object Windows.Media.RotateTransform(90))) }
    7 { $tg.Children.Add((New-Object Windows.Media.RotateTransform(270))); $tg.Children.Add((New-Object Windows.Media.ScaleTransform(-1, 1))) }
    8 { $tg.Children.Add((New-Object Windows.Media.RotateTransform(270))) }
  }
  return (New-Object Windows.Media.Imaging.TransformedBitmap($src, $tg))
}

function Get-Scaled($src, [int]$max) {
  $s = [Math]::Min(1.0, $max / [double][Math]::Max($src.PixelWidth, $src.PixelHeight))
  if ($s -ge 0.999) { return $src }
  return (New-Object Windows.Media.Imaging.TransformedBitmap($src, (New-Object Windows.Media.ScaleTransform($s, $s))))
}

function Save-Jpeg($src, [string]$path, [int]$q) {
  $bmp = $src
  if ($bmp.Format -ne [Windows.Media.PixelFormats]::Bgr24 -and $bmp.Format -ne [Windows.Media.PixelFormats]::Gray8) {
    $bmp = New-Object Windows.Media.Imaging.FormatConvertedBitmap($bmp, [Windows.Media.PixelFormats]::Bgr24, $null, 0)
  }
  $enc = New-Object Windows.Media.Imaging.JpegBitmapEncoder
  $enc.QualityLevel = $q
  $enc.Frames.Add([Windows.Media.Imaging.BitmapFrame]::Create($bmp))
  $fs = [IO.File]::Create($path)
  try { $enc.Save($fs) } finally { $fs.Dispose() }
}

function Get-Popis([string]$name, $datum) {
  $base = [IO.Path]::GetFileNameWithoutExtension($name)
  $zTelefonu = $base -match '^(img|dsc|dscn|dscf|pxl|photo|foto|image|wp|mvimg|screenshot|snimek|vid)[\W_]*\d' -or $base -match '^[\d\W_]+$' -or $base -match '^[0-9a-f-]{20,}$'
  if ($zTelefonu) {
    if ($datum) { return ('{0}. {1}. {2}' -f $datum.Day, $datum.Month, $datum.Year) }
    return ''
  }
  $t = (($base -replace '[_\-]+', ' ') -replace '\s+', ' ').Trim()
  $t = ($t -replace '^\d{1,3}\s+', '')
  if ($t.Length -gt 0) { $t = $t.Substring(0, 1).ToUpper() + $t.Substring(1) }
  return $t
}

if ($soubory.Count -eq 0) {
  Write-Host "Ve složce $Zdroj zatím nejsou žádné fotky."
}

# načtení všech fotek
$fotky = New-Object System.Collections.Generic.List[object]
foreach ($f in $soubory) {
  try {
    $p = Read-Photo $f.FullName
    $kdy = $p.Datum
    if (-not $kdy) { $kdy = $f.LastWriteTime }
    $fotky.Add(@{ Soubor = $f; Foto = $p; Kdy = $kdy })
  } catch {
    Write-Warning "Fotku $($f.Name) se nepodařilo načíst: $($_.Exception.Message)"
  }
}

$cislovane = $fotky.Count -gt 0 -and @($fotky | Where-Object { $_.Soubor.Name -notmatch '^\d' }).Count -eq 0
if ($cislovane) { $poradi = @($fotky | Sort-Object { $_.Soubor.Name }) } else { $poradi = @($fotky | Sort-Object { $_.Kdy } -Descending) }

# staré zmenšeniny pryč, ať v galerii nezůstanou smazané fotky
Get-ChildItem -LiteralPath $cil -File -Filter *.jpg | Remove-Item -Force

$pouzite = @{}
$polozky = New-Object System.Collections.Generic.List[object]
foreach ($x in $poradi) {
  $f = $x.Soubor
  try {
    $slug = Get-Slug ([IO.Path]::GetFileNameWithoutExtension($f.Name))
    $s = $slug; $i = 2
    while ($pouzite.ContainsKey($s)) { $s = "$slug-$i"; $i++ }
    $pouzite[$s] = $true

    $obr = Set-Orientation $x.Foto.Frame $x.Foto.Orient
    $bmpVelka = Get-Scaled $obr $Velka
    $bmpMala = Get-Scaled $obr $Nahled
    Save-Jpeg $bmpVelka (Join-Path $cil "$s.jpg") $Kvalita
    Save-Jpeg $bmpMala (Join-Path $cil "$s-nahled.jpg") ($Kvalita - 4)

    $polozky.Add([ordered]@{
      src    = "assets/galerie/$s.jpg"
      w      = $bmpVelka.PixelWidth
      h      = $bmpVelka.PixelHeight
      nahled = "assets/galerie/$s-nahled.jpg"
      nw     = $bmpMala.PixelWidth
      nh     = $bmpMala.PixelHeight
      popis  = (Get-Popis $f.Name $x.Foto.Datum)
    })
    Write-Host ("  hotovo  {0}  ({1} x {2})" -f $f.Name, $bmpVelka.PixelWidth, $bmpVelka.PixelHeight)
  } catch {
    Write-Warning "Fotku $($f.Name) se nepodařilo zpracovat: $($_.Exception.Message)"
  }
}

$json = ConvertTo-Json -InputObject @($polozky.ToArray()) -Depth 3
if (-not $json -or $polozky.Count -eq 0) { $json = '[]' }
$text = "/* Seznam fotek v galerii. Vygeneruje ho skript nastroje/pripravit-fotky.ps1. */`nwindow.GALERIE = $json;`n"
[IO.File]::WriteAllText((Join-Path $Web 'assets\galerie.js'), $text, (New-Object Text.UTF8Encoding($false)))
Write-Host "Galerie má $($polozky.Count) fotek."
