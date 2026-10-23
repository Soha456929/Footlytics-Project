# Run this file on Windows to download the eight official club crest images.
# Internet access is required for this one-time setup.
$ErrorActionPreference = "Stop"
$folder = Join-Path $PSScriptRoot "images"
New-Item -ItemType Directory -Path $folder -Force | Out-Null
$clubs = @{
    "541" = "Real Madrid"
    "529" = "Barcelona"
    "33" = "Manchester United"
    "50" = "Manchester City"
    "40" = "Liverpool"
    "42" = "Arsenal"
    "85" = "PSG"
    "157" = "Bayern Munich"
}
$failed = @()
foreach ($id in $clubs.Keys) {
    $name = $clubs[$id]
    $url = "https://media.api-sports.io/football/teams/$id.png"
    $destination = Join-Path $folder "$id.png"
    try {
        Invoke-WebRequest -Uri $url -OutFile $destination -TimeoutSec 25 -ErrorAction Stop
        $bytes = [System.IO.File]::ReadAllBytes($destination)
        if ($bytes.Length -lt 100 -or $bytes[0] -ne 137 -or $bytes[1] -ne 80 -or $bytes[2] -ne 78 -or $bytes[3] -ne 71) {
            throw "Response is not a valid PNG"
        }
        Write-Host "Downloaded: $name" -ForegroundColor Green
    }
    catch {
        Remove-Item $destination -ErrorAction SilentlyContinue
        Write-Warning "Could not download $name : $_"
        $failed += $name
    }
}
if ($failed.Count -eq 0) {
    Write-Host "All eight logos downloaded. Open index.html with Live Server." -ForegroundColor Green
} else {
    Write-Warning "Some logos could not be downloaded. The website will try the online logo URL automatically."
}
Read-Host "Press Enter to close"
