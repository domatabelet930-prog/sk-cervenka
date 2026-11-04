<#
  Stáhne zápasy, výsledky a tabulky mužů i mládeže a nahraje je na web.
  Běží z tohoto počítače, protože is.fotbal.cz automat na GitHubu nepustí. GitHub dál stahuje muže jako záloha.

  Spouští ji každé pondělí naplánovaná úloha "SK Cervenka data". Když je počítač vypnutý,
  doběhne po zapnutí. Co se stalo, je v souboru nastroje\posledni-aktualizace.log.
#>

$koren = Split-Path $PSScriptRoot -Parent
$log = Join-Path $PSScriptRoot 'posledni-aktualizace.log'
Set-Location -LiteralPath $koren

function Spust-Vse {
  Get-Date -Format 'yyyy-MM-dd HH:mm'
  $node = (Get-Command node -ErrorAction SilentlyContinue).Source
  if (-not $node) { $node = Join-Path $env:ProgramFiles 'nodejs\node.exe' }

  git pull --ff-only --autostash
  if ($LASTEXITCODE -ne 0) { 'Stažení novinek z GitHubu se nepovedlo, končím.'; return }

  & $node nastroje/aktualizovat-tabulku.mjs

  git diff --quiet -- sk-cervenka/assets/data.js
  if ($LASTEXITCODE -eq 0) { 'Data se nezměnila.'; return }
  git add sk-cervenka/assets/data.js
  git commit -m "Data k $(Get-Date -Format 'yyyy-MM-dd')"
  git push
}

Spust-Vse *>&1 | Out-File -LiteralPath $log -Encoding utf8
