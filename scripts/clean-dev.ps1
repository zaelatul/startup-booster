$ErrorActionPreference = 'SilentlyContinue'

# 1) 포트 정리
$ports = 5174, 3000, 9333
foreach ($p in $ports) {
  $conns = Get-NetTCPConnection -LocalPort $p -State Listen -ErrorAction SilentlyContinue
  if ($conns) {
    $pids = $conns | Select-Object -ExpandProperty OwningProcess -Unique
    foreach ($pid in $pids) { Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue }
    Write-Host "포트 ${p} 사용 프로세스 종료" -ForegroundColor Yellow
  } else {
    Write-Host "포트 ${p}: 리스너 없음" -ForegroundColor DarkGray
  }
}

# 2) .next dev 락 제거
$webRoot = Split-Path -Parent $PSScriptRoot
$devLock = Join-Path $webRoot ".next\dev\lock"
if (Test-Path $devLock) {
  Remove-Item $devLock -Force
  Write-Host ".next/dev/lock 제거" -ForegroundColor Yellow
}

# 3) Playwright 리포트 폴더 제거(선택)
$report = Join-Path $webRoot "playwright-report"
if (Test-Path $report) {
  Remove-Item $report -Recurse -Force
  Write-Host "playwright-report 폴더 제거" -ForegroundColor DarkGray
}

Write-Host "== 정리 완료 ==" -ForegroundColor Cyan
