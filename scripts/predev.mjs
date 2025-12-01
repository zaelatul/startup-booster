// scripts/predev.mjs
import { spawnSync } from 'node:child_process';
import { rmSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import os from 'node:os';

const ports = [5174, 3000, 9333];

function killByPortWin(port) {
  const ps = [
    'Get-NetTCPConnection',
    `-LocalPort ${port}`,
    '-State Listen',
    '-ErrorAction SilentlyContinue',
    '| Select-Object -ExpandProperty OwningProcess -Unique',
  ].join(' ');
  const r = spawnSync('powershell', ['-NoLogo', '-NoProfile', '-Command', ps], { encoding: 'utf8' });
  if (!r.stdout) return;
  const pids = r.stdout
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter((s) => /^\d+$/.test(s));
  for (const pid of pids) {
    spawnSync('taskkill', ['/PID', pid, '/F'], { stdio: 'ignore' });
    console.log(`[predev] 포트 ${port} 사용 PID ${pid} 강종`);
  }
}

function cleanupLock() {
  const lock = join(process.cwd(), '.next', 'dev', 'lock');
  if (existsSync(lock)) {
    rmSync(lock, { force: true });
    console.log('[predev] .next\\dev\\lock 삭제');
  }
}

function main() {
  console.log('[predev] 사전 정리 시작');
  if (os.platform() === 'win32') {
    for (const p of ports) killByPortWin(p);
  } else {
    console.log('[predev] (참고) 비-Windows OS는 포트 강종 생략');
  }
  cleanupLock();
  console.log('[predev] 사전 정리 완료');
}

main();
