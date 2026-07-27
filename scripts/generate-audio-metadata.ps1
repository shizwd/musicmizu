param(
    [Parameter(Mandatory = $true)]
    [string]$BuildDir,

    [Parameter(Mandatory = $true)]
    [string]$FfmpegPath
)

$ErrorActionPreference = 'Stop'

if (-not (Test-Path -LiteralPath $BuildDir -PathType Container)) {
    throw "Build directory not found: $BuildDir"
}

if (-not (Test-Path -LiteralPath $FfmpegPath -PathType Leaf)) {
    $ffmpegCommand = Get-Command $FfmpegPath -ErrorAction SilentlyContinue
    if (-not $ffmpegCommand) {
        throw "FFmpeg not found: $FfmpegPath"
    }
    $FfmpegPath = $ffmpegCommand.Source
}

$resolvedBuildDir = (Resolve-Path -LiteralPath $BuildDir).Path.TrimEnd('\', '/')
$streams = [ordered]@{}
$streamFiles = Get-ChildItem -LiteralPath $resolvedBuildDir -Recurse -File |
    Where-Object {
        $_.Extension -in '.mp3', '.opus' -and
        $_.FullName -match '[\\/](mp3-v5|opus-96)[\\/]'
    } |
    Sort-Object FullName

foreach ($file in $streamFiles) {
    # FFmpeg writes probe information to stderr and exits non-zero when no
    # output target is supplied. Capture that expected output without letting
    # Windows PowerShell turn it into a terminating NativeCommandError.
    $previousErrorActionPreference = $ErrorActionPreference
    $ErrorActionPreference = 'Continue'
    try {
        $probeOutput = (& $FfmpegPath -hide_banner -i $file.FullName 2>&1 |
            ForEach-Object { $_.ToString() }) -join "`n"
    } finally {
        $ErrorActionPreference = $previousErrorActionPreference
    }

    $durationMatch = [regex]::Match(
        $probeOutput,
        'Duration:\s*(?<hours>\d+):(?<minutes>\d+):(?<seconds>[\d.]+)'
    )
    $audioMatch = [regex]::Match(
        $probeOutput,
        'Audio:\s*(?<codec>[^,\s]+).*?,\s*(?<sampleRate>\d+)\s+Hz'
    )

    if (-not $durationMatch.Success -or -not $audioMatch.Success) {
        Write-Warning "Skipping audio metadata for $($file.FullName): FFmpeg output was not recognized."
        continue
    }

    $durationSeconds =
        ([double]$durationMatch.Groups['hours'].Value * 3600) +
        ([double]$durationMatch.Groups['minutes'].Value * 60) +
        [double]$durationMatch.Groups['seconds'].Value
    $bitrateKbps = if ($durationSeconds -gt 0) {
        [math]::Round(($file.Length * 8) / ($durationSeconds * 1000))
    } else {
        $null
    }

    $relativePath = $file.FullName.Substring($resolvedBuildDir.Length + 1).Replace('\', '/')
    $isMp3 = $file.Extension -eq '.mp3'
    $streams[$relativePath] = [ordered]@{
        format = if ($isMp3) { 'MP3' } else { 'Opus' }
        profile = if ($isMp3) { 'V5 VBR' } else { '96 kbps target' }
        quality = 'lossy'
        sampleRateHz = [int]$audioMatch.Groups['sampleRate'].Value
        bitDepth = $null
        bitrateKbps = $bitrateKbps
        sizeBytes = [long]$file.Length
    }
}

$manifest = [ordered]@{
    version = 1
    streams = $streams
}
$json = $manifest | ConvertTo-Json -Depth 5 -Compress
$outputPath = Join-Path $resolvedBuildDir 'audio-metadata.json'
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($outputPath, $json, $utf8NoBom)

Write-Host "Generated playback metadata for $($streams.Count) streams at $outputPath"
