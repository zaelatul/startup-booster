// src/app/diagnostics/page.tsx
export const dynamic = 'force-dynamic';

function Row({ label, ok }: { label: string; ok: boolean }) {
  return (
    <li style={{
      display: 'flex', justifyContent: 'space-between',
      padding: '10px 12px', border: '1px solid #e5e7eb',
      borderRadius: 8, marginBottom: 8
    }}>
      <span>{label}</span>
      <span style={{ fontWeight: 700 }}>{ok ? 'OK' : 'MISSING'}</span>
    </li>
  );
}

export default function Diagnostics() {
  const {
    NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC__FAIL_MARKET_API__,
    NEXT_PUBLIC__NO_FALLBACK__,
  } = process.env;

  const rows = [
    ['SUPABASE_URL', !!NEXT_PUBLIC_SUPABASE_URL],
    ['SUPABASE_ANON_KEY', !!NEXT_PUBLIC_SUPABASE_ANON_KEY],
    ['FAIL_MARKET_API flag', true],
    ['NO_FALLBACK flag', true],
  ] as const;

  return (
    <main style={{ maxWidth: 720, margin: '40px auto', padding: 16 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>진단</h1>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {rows.map(([k, ok]) => <Row key={k} label={k} ok={ok} />)}
      </ul>
    </main>
  );
}
