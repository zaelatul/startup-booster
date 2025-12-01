[CmdletBinding()]
param(
  [Parameter(Position=0)][ValidateSet("New","Replace")] [string]$Mode,
  [Parameter(Position=1)] [string]$Path,
  [Parameter(Position=2)] [string]$Baseline = ".\snapshots\hashes_baseline.csv",
  [switch]$InitBaseline,
  [string]$Root = "C:\Users\USER\Desktop\프로젝트2\web"
)

$ErrorActionPreference = "Stop"
Set-Location $Root

# 0) init baseline
if ($InitBaseline) {
  if (-not (Test-Path "_hashes.csv")) {
    if (Test-Path ".\scripts\snap-tree.ps1") {
      powershell -NoProfile -ExecutionPolicy Bypass -File ".\scripts\snap-tree.ps1" | Out-Null
    } else { Write-Error "snap-tree.ps1 not found"; exit 1 }
  }
  New-Item -ItemType Directory -Path ".\snapshots" -ErrorAction SilentlyContinue | Out-Null
  Copy-Item -Force "_hashes.csv" $Baseline
  Write-Host "BASELINE CREATED: $Baseline" -ForegroundColor Green
  return
}

if (-not $Mode) { Write-Error "Need Mode (New|Replace)"; exit 1 }
if (-not $Path) { Write-Error "Need -Path (relative)"; exit 1 }

# 1) normalize path
$rel = $Path -replace '^[.\s\\\/]+',''
$rel = $rel -replace '/','\'
if (-not (Test-Path $rel)) { Write-Error "FILE NOT FOUND: $rel"; exit 1 }

# 2) no baseline -> fallback to git
if (-not (Test-Path $Baseline)) {
  $git = ""
  try { if (Test-Path ".git") { $git = git status --porcelain=v1 2>$null } } catch {}
  if ($git -eq "") { Write-Error "No baseline and no git status available"; exit 1 }
  $relesc = [regex]::Escape($rel)
  if ($Mode -eq "New") {
    if ($git -match "^\?\?\s+$relesc$") { Write-Host "[NEW OK] $rel" -ForegroundColor Green; return }
    else { Write-Error "[FAIL] Not NEW by git: $rel"; exit 1 }
  } else {
    if ($git -match "^\sM\s+$relesc$" -or $git -match "^M\s\s$relesc$") { Write-Host "[REPLACE OK] $rel" -ForegroundColor Green; return }
    else { Write-Error "[FAIL] Not REPLACE by git: $rel"; exit 1 }
  }
}

# 3) hash-based verification
$base = Import-Csv $Baseline
$row  = $base | Where-Object { $_.Path -eq $rel }

if ($Mode -eq "New") {
  if (-not $row) { Write-Host "[NEW OK] not in baseline: $rel" -ForegroundColor Green; return }
  else { Write-Error "[FAIL] Exists in baseline: $rel"; exit 1 }
} else {
  if (-not $row) { Write-Error "[FAIL] Not in baseline: $rel"; exit 1 }
  $cur = (Get-FileHash -Algorithm SHA256 -Path $rel).Hash
  if ($row.Hash -ne $cur) { Write-Host "[REPLACE OK] hash changed: $rel" -ForegroundColor Green; return }
  else { Write-Error "[FAIL] Hash same: $rel"; exit 1 }
}
