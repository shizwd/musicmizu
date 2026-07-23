param(
    [Parameter(Mandatory = $true)][string]$CatalogDir,
    [Parameter(Mandatory = $true)][string]$OutputPath
)
$ErrorActionPreference = 'Stop'
$audioExtensions = @('.flac', '.mp3', '.m4a', '.ogg', '.opus', '.wav')
$trackCoverRoot = Join-Path (Split-Path -Parent $CatalogDir) 'assets\track-covers'

function Read-EnoField {
    param([string]$Text, [string]$Name)
    $match = [regex]::Match($Text, "(?m)^$([regex]::Escape($Name)):\s*(.+?)\s*$")
    if ($match.Success) { return $match.Groups[1].Value.Trim() }
    return $null
}

$releases = Get-ChildItem -Directory -LiteralPath $CatalogDir |
    Where-Object { Test-Path -LiteralPath (Join-Path $_.FullName 'release.eno') } |
    ForEach-Object {
        $manifest = [System.IO.File]::ReadAllText(
            (Join-Path $_.FullName 'release.eno'),
            [System.Text.Encoding]::UTF8
        )
        $slug = Read-EnoField $manifest 'permalink'
        if (-not $slug) { $slug = $_.Name }
        $title = Read-EnoField $manifest 'title'
        if (-not $title) { throw "Release $($_.Name) has no title." }
        $artist = Read-EnoField $manifest 'release_artist'
        if (-not $artist) { $artist = 'Music Mizu' }
        $trackCount = @(
            Get-ChildItem -File -Recurse -LiteralPath $_.FullName |
                Where-Object { $audioExtensions -contains $_.Extension.ToLowerInvariant() }
        ).Count
        $externalCoverDir = Join-Path $trackCoverRoot $slug
        $trackCoverCount = if (Test-Path -LiteralPath $externalCoverDir) {
            @(Get-ChildItem -File -LiteralPath $externalCoverDir |
                Where-Object { $_.Extension.ToLowerInvariant() -in @('.jpg', '.jpeg', '.png') }).Count
        } else { 0 }
        [ordered]@{
            slug = $slug
            title = $title
            artist = $artist
            cover = "$slug/cover_160.jpg"
            trackCount = $trackCount
            trackCoverCount = $trackCoverCount
        }
    } |
    Sort-Object slug

$payload = [ordered]@{ releases = @($releases) }
$json = $payload | ConvertTo-Json -Depth 5
[System.IO.File]::WriteAllText(
    [System.IO.Path]::GetFullPath($OutputPath),
    $json,
    (New-Object System.Text.UTF8Encoding($false))
)
Write-Host "Generated library index with $(@($releases).Count) releases."
