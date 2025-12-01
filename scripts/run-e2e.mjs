// 파일: scripts/run-e2e.mjs  (교체)
// 목표: PW_NO_SERVER=1 재사용 실패 시 자동으로 build→start(5174) 폴백
import { spawn } from 'node:child_process';

const BASE_URL = process.env.BASE_URL || 'http://localhost:5174';
let REUSE = String(process.env.PW_NO_SERVER || '').toLowerCase() === '1' || String(process.env.PW_NO_SERVER || '').toLowerCase() === 'true';
const SHOW_REPORT = String(process.env.SHOW_REPORT || '').toLowerCase() === '1';

const PORT = (() => { try { return new URL(BASE_URL).port || '5174'; } catch { return '5174'; } })();

function run(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: 'inherit', shell: true, ...opts });
    p.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`${cmd} ${args.join(' ')} → exit ${code}`))));
    p.on('error', reject);
  });
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function waitUntilAlive(url, timeoutMs = 15_000) {
  const start = Date.now();
  const target = `${url}`.replace(/\/$/, '') + '/franchise/explore';
  let lastErr = '';
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(target);
      if ((res.status >= 200 && res.status < 500) || res.status === 404) return true;
      lastErr = `HTTP ${res.status}`;
    } catch (e) {
      lastErr = String(e);
    }
    await sleep(500);
  }
  throw new Error(`Server health check timeout: ${target} (${lastErr})`);
}

async function startLocalServerSamePort() {
  console.log(`[run-e2e] Build → Start on port ${PORT} (same as dev)`);
  await run('npx', ['next', 'build']);
  const server = spawn('npx', ['next', 'start', '-p', PORT], { stdio: 'inherit', shell: true });

  const killer = () => { try { server && server.kill(); } catch {} };
  process.on('exit', killer);
  process.on('SIGINT', () => { killer(); process.exit(1); });
  process.on('SIGTERM', () => { killer(); process.exit(1); });

  await waitUntilAlive(BASE_URL);
  return server;
}

async function main() {
  let server = null;
  try {
    if (REUSE) {
      console.log(`[run-e2e] Reuse dev server at ${BASE_URL} (PW_NO_SERVER=1)`);
      try {
        await waitUntilAlive(BASE_URL, 8_000); // 짧게 확인
      } catch {
        console.warn('[run-e2e] Dev 재사용 실패 → 자동 폴백(build→start)로 전환합니다.');
        REUSE = false;
      }
    }

    if (!REUSE) {
      server = await startLocalServerSamePort();
    }

    console.log('[run-e2e] Run Playwright tests…');
    await run('npx', ['playwright', 'test', '--reporter=list,html']);

    if (SHOW_REPORT) {
      await run('npx', ['playwright', 'show-report']);
    } else {
      console.log('✔ Done. To open the report:  npx playwright show-report');
    }
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    // server는 process exit 훅에서 정리
  }
}
main();
