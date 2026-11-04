<#
  Jednou spustit: zapne ve Windows týdenní aktualizaci dat webu (každé pondělí v 9:00).
  Když je počítač vypnutý, doběhne po zapnutí. Vypnutí: Unregister-ScheduledTask -TaskName 'SK Cervenka data'
#>

$skript = Join-Path $PSScriptRoot 'tydenni-aktualizace.ps1'
$akce = New-ScheduledTaskAction -Execute 'powershell.exe' -Argument "-NoProfile -WindowStyle Hidden -File `"$skript`""
$kdy = New-ScheduledTaskTrigger -Weekly -DaysOfWeek Monday -At 9:00
$nastaveni = New-ScheduledTaskSettingsSet -StartWhenAvailable -RunOnlyIfNetworkAvailable -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -ExecutionTimeLimit (New-TimeSpan -Minutes 15)
Register-ScheduledTask -TaskName 'SK Cervenka data' -Action $akce -Trigger $kdy -Settings $nastaveni -Force | Out-Null
Write-Host 'Hotovo: aktualizace poběží každé pondělí v 9:00.'
