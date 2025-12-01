// src/components/KpiCard.tsx
type Props = {
  label: string;
  value: number | string;
  suffix?: string;     // 단위 표시 (예: 명, 건, %)
  tooltip?: string;    // 간단 설명
  highlight?: boolean; // 강조 여부
};

function fmtNumber(n: number) {
  try {
    return n.toLocaleString('ko-KR');
  } catch {
    return String(n);
  }
}

export default function KpiCard({ label, value, suffix, tooltip, highlight }: Props) {
  const show = typeof value === 'number' ? fmtNumber(value) : value;
  return (
    <div
      title={tooltip}
      style={{
        border: '1px solid #e5e7eb',
        borderRadius: 12,
        padding: '14px 16px',
        background: highlight ? '#f8fafc' : '#fff',
      }}
    >
      <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 800 }}>
        {show}{suffix ? <span style={{ fontSize: 14, marginLeft: 4 }}>{suffix}</span> : null}
      </div>
    </div>
  );
}
