param(
  [string]$Root = "C:\Users\USER\Desktop\프로젝트2\web",
  [string]$OutDir,
  [int]$SinceDays = 2,
  [string]$PrevHashCsv
)

$ErrorActionPreference = "Stop"
if (-not $OutDir) { $OutDir = $Root }
Set-Location $Root

$exclude = 'node_modules|\.git|\.next|\.vercel|playwright-report|\.turbo|\.pnpm-store|\.cache|dist|build|coverage|\.wrangler|\.vscode'

Write-Host "==> 1) 트리 스냅샷 생성: _tree.txt"
$items = Get-ChildItem -Recurse -Force | Where-Object { $_.FullName -notmatch "\\($exclude)(\\|$)" }
$rel = $items | ForEach-Object { $_.FullName.Replace((Get-Location).Path + '\','') }
$rel | Sort-Object | Set-Content -Encoding utf8 "$OutDir\_tree.txt"

Write-Host "==> 2) 파일 해시 스냅샷: _hashes.csv"
$files = Get-ChildItem -Recurse -Force -File | Where-Object { $_.FullName -notmatch "\\($exclude)(\\|$)" }
$hashes = foreach ($f in $files) {
  $h = Get-FileHash -Algorithm SHA256 -Path $f.FullName
  [pscustomobject]@{
    Path      = $f.FullName.Replace((Get-Location).Path + '\','')
    Hash      = $h.Hash
    Length    = $f.Length
    LastWrite = $f.LastWriteTime.ToString('yyyy-MM-dd HH:mm:ss')
  }
}
$hashes | Sort-Object Path | Export-Csv -NoTypeInformation -Encoding UTF8 "$OutDir\_hashes.csv"

Write-Host "==> 3) 최근 변경 목록: _changed_since.txt (최근 $SinceDays 일)"
$since = (Get-Date).AddDays(-$SinceDays)
$changed = $files | Where-Object { $_.LastWriteTime -gt $since } |
  ForEach-Object { $_.FullName.Replace((Get-Location).Path + '\','') }
$changed | Sort-Object | Set-Content -Encoding utf8 "$OutDir\_changed_since.txt"

Write-Host "==> 4) Git 상태(선택): _git_status.txt"
if (Test-Path "$Root\.git") {
  $git = git status --porcelain=v1 2>$null
  $git | Set-Content -Encoding utf8 "$OutDir\_git_status.txt"
}

if ($PrevHashCsv -and (Test-Path $PrevHashCsv)) {
  Write-Host "==> 5) 이전 해시와 비교: _hash_diff.csv"
  $old = Import-Csv $PrevHashCsv
  $new = Import-Csv "$OutDir\_hashes.csv"
  $diff = Compare-Object $old $new -Property Path,Hash -PassThru
  $diff | Export-Csv -NoTypeInformation -Encoding UTF8 "$OutDir\_hash_diff.csv"
}

Write-Host "완료: $OutDir 에 _tree.txt, _hashes.csv, _changed_since.txt (및 _git_status.txt, _hash_diff.csv) 생성"
