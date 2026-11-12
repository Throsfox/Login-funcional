# Verifica servicos relacionados ao SQL Server no Windows
$servicos = Get-Service | Where-Object { $_.DisplayName -like '*SQL*' -or $_.Name -match 'SQL' } | Select-Object Name, DisplayName, Status
Write-Host "=== Servicos SQL encontrados ==="
foreach ($s in $servicos) {
    Write-Host "  $(if ($s.Status -eq 'Running') { 'RUNNING' } else { 'STOPPED' })  $s.Name  ($($s.DisplayName))"
}
Write-Host "`n=== SQLBrowser e MSSQLSERVER ==="
$alvos = @('SQLBrowser', 'MSSQLSERVER')
foreach ($n in $alvos) {
    $s = Get-Service -Name $n -ErrorAction SilentlyContinue
    if ($s) {
        Write-Host "  $(if ($s.Status -eq 'Running') { 'RUNNING' } else { 'STOPPED' })  $n  ($($s.DisplayName))"
    } else {
        Write-Host "  N�O ENCONTRADO  $n"
    }
}
