$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $PSScriptRoot
$localFaircamp = Join-Path $projectRoot '.tools\faircamp\faircamp.exe'
$faircamp = Get-Command faircamp -ErrorAction SilentlyContinue

if (Test-Path $localFaircamp) {
    $faircampExecutable = $localFaircamp
} elseif ($faircamp) {
    $faircampExecutable = $faircamp.Source
} else {
    throw 'Faircamp 1.7+ is required. Install it from https://faircamp.org/'
}

& $faircampExecutable `
    --catalog-dir (Join-Path $projectRoot 'catalog') `
    --build-dir (Join-Path $projectRoot 'dist')

if ($LASTEXITCODE -ne 0) {
    throw "Faircamp build failed with exit code $LASTEXITCODE"
}

Write-Host "Built site at $(Join-Path $projectRoot 'dist')"
