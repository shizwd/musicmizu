param(
    [string]$FaircampPath = ''
)
$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $PSScriptRoot
$localFaircamp = Join-Path $projectRoot '.tools\faircamp\faircamp.exe'
$faircamp = Get-Command faircamp -ErrorAction SilentlyContinue

if ($FaircampPath) {
    $faircampExecutable = $FaircampPath
} elseif (Test-Path $localFaircamp) {
    $faircampExecutable = $localFaircamp
} elseif ($faircamp) {
    $faircampExecutable = $faircamp.Source
} else {
    throw 'Faircamp 1.7+ is required. Install it from https://faircamp.org/'
}

& (Join-Path $PSScriptRoot 'generate-library.ps1') `
    -CatalogDir (Join-Path $projectRoot 'catalog') `
    -OutputPath (Join-Path $projectRoot 'catalog\library.json')

& $faircampExecutable `
    --catalog-dir (Join-Path $projectRoot 'catalog') `
    --build-dir (Join-Path $projectRoot 'dist')

if ($LASTEXITCODE -ne 0) {
    throw "Faircamp build failed with exit code $LASTEXITCODE"
}

# Music Mizu owns playback and persists its audio element across page changes.
# Remove Faircamp's second player runtime to avoid duplicate observers and controls.
$buildDir = Join-Path $projectRoot 'dist'
$trackCoverSource = Join-Path $projectRoot 'assets\track-covers'
$trackCoverDestination = Join-Path $buildDir 'track-covers'
if (Test-Path $trackCoverSource) {
    New-Item -ItemType Directory -Force -Path $trackCoverDestination | Out-Null
    Copy-Item -Path (Join-Path $trackCoverSource '*') -Destination $trackCoverDestination -Recurse -Force
}
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
Get-ChildItem -Path $buildDir -Filter '*.html' -Recurse | ForEach-Object {
    $html = [System.IO.File]::ReadAllText($_.FullName)
    $html = [regex]::Replace(
        $html,
        '<script defer src="[^"]*player\.js\?[^\"]*"></script>\r?\n?',
        ''
    )
    $html = $html.Replace(
        'content="width=device-width, initial-scale=1"',
        'content="width=device-width, initial-scale=1, viewport-fit=cover"'
    )
    [System.IO.File]::WriteAllText($_.FullName, $html, $utf8NoBom)
}

Write-Host "Built site at $(Join-Path $projectRoot 'dist')"
