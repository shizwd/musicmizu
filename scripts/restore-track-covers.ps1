$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $PSScriptRoot
$coverRoot = Join-Path $projectRoot 'assets\track-covers'

# These searches point at the official releases represented by the imported files.
# The two lookup-title overrides use the storefront spelling where it differs from
# the embedded FLAC title.
$albums = [ordered]@{
    'projectmili' = @(
        @{ Title = 'HUA YU' },
        @{ Title = 'SAIKAI' },
        @{ Title = '鐵花飛'; LookupTitle = 'TIE HUA FEI' },
        @{ Title = 'TIAN TIAN' },
        @{ Title = 'In Hell We Live, Lament' },
        @{ Title = 'Through Patches of Violet' },
        @{ Title = 'Iron Lotus' },
        @{ Title = 'Compass' },
        @{ Title = 'Hero' },
        @{ Title = 'Children of the City' },
        @{ Title = 'Fly, My Wings' },
        @{ Title = 'Gone Angels' },
        @{ Title = '1000x1000' }
    )
    'kusanagi-nene-wonderlands-showtime' = @(
        @{ Title = '神のまにまに' },
        @{ Title = 'サイバーパンクデッドボーイ' },
        @{ Title = 'ぼくのかみさま' },
        @{ Title = 'グッバイ宣言' },
        @{ Title = 'Mr. Showtime' },
        @{ Title = 'オールセーブチャレンジ' },
        @{ Title = '成敗いたAAAAAす！' },
        @{ Title = 'どんな結末がお望みだい？'; LookupArtist = 'ツユ'; LookupTitle = 'どんな結末がお望みだい?' },
        @{ Title = '1000年生きてる' },
        @{ Title = '箱庭のコラル' },
        @{ Title = 'スマイル*シンフォニー' },
        @{ Title = '88☆彡' },
        @{ Title = '転生林檎' },
        @{ Title = 'サヨナラ天国また来て地獄' },
        @{ Title = 'チュルリラ・チュルリラ・ダッダッダ!' },
        @{ Title = 'お気に召すまま' },
        @{ Title = 'KING' },
        @{ Title = 'にっこり^^調査隊のテーマ' },
        @{ Title = 'トンデモワンダーズ' },
        @{ Title = 'potatoになっていく' },
        @{ Title = '強風オールバック' },
        @{ Title = 'ナンセンス文学' },
        @{ Title = 'いーあるふぁんくらぶ' },
        @{ Title = 'ワンスアポンアドリーム' },
        @{ Title = 'ミラクルペイント' }
    )
}

function Normalize-Title([string]$value) {
    $normalized = $value -replace '\s*\(feat\..*$', '' -replace '[\s\p{P}\p{S}]', ''
    return $normalized.ToLowerInvariant()
}

foreach ($album in $albums.Keys) {
    $albumDirectory = Join-Path $coverRoot $album
    New-Item -ItemType Directory -Force -Path $albumDirectory | Out-Null
    $defaultArtist = if ($album -eq 'projectmili') { 'Mili' } else { 'ワンダーランズ×ショウタイム' }

    for ($index = 0; $index -lt $albums[$album].Count; $index++) {
        $track = $albums[$album][$index]
        $artist = if ($track.LookupArtist) { $track.LookupArtist } else { $defaultArtist }
        $lookupTitle = if ($track.LookupTitle) { $track.LookupTitle } else { $track.Title }
        $query = "$artist $lookupTitle"
        $uri = 'https://itunes.apple.com/search?term=' + [uri]::EscapeDataString($query) + '&entity=song&limit=20&country=JP'
        $results = (Invoke-RestMethod -Uri $uri).results
        $wanted = Normalize-Title $lookupTitle
        $match = $results | Where-Object {
            (Normalize-Title $_.trackName).StartsWith($wanted) -and $_.artistName -match [regex]::Escape($artist)
        } | Select-Object -First 1

        if (-not $match) {
            throw "No release-art match for $($track.Title) ($query)"
        }

        $artwork = $match.artworkUrl100 -replace '/100x100bb\.(jpg|png)$', '/600x600bb.jpg'
        $filename = '{0:D2}.jpg' -f ($index + 1)
        $destination = Join-Path $albumDirectory $filename
        Invoke-WebRequest -Uri $artwork -OutFile $destination
        Write-Host "[$album/$filename] $($track.Title) — $($match.collectionName)"
    }
}

Write-Host "Restored track covers at $coverRoot"


