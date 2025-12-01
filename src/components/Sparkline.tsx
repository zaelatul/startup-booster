// 신규 — src/components/Sparkline.tsx
// 외부 라이브러리 없이 가벼운 SVG 스파크라인
// SSR 안전(브라우저 API 사용 없음), 데이터 없거나 1개일 때도 안전 처리

type Props = {
  data: number[];               // 지수 배열(예: [100, 98, 101, ...])
  width?: number;               // 기본 280
  height?: number;              // 기본 56
  stroke?: string;              // 선 색상 (기본 #2563eb, Tailwind blue-600)
  strokeWidth?: number;         // 선 두께 (기본 2)
  fill?: string;                // 면 색상 (기본 'none')
  padding?: number;             // 내부 여백 (기본 6)
  baseLine?: number;            // 기준선(예: 100) 표시를 원하면 지정
  minY?: number;                // 스케일 고정용 최소값(옵션)
  maxY?: number;                // 스케일 고정용 최대값(옵션)
  'data-testid'?: string;       // 테스트용 id
  className?: string;
};

export default function Sparkline({
  data,
  width = 280,
  height = 56,
  stroke = '#2563eb',
  strokeWidth = 2,
  fill = 'none',
  padding = 6,
  baseLine,
  minY,
  maxY,
  className,
  'data-testid': testId = 'sparkline',
}: Props) {
  const n = Array.isArray(data) ? data.length : 0;

  // 안전 가드: 데이터가 없거나 1개면 수평선/점 형태로 처리
  if (n === 0) {
    return (
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className={className}
        data-testid={testId}
        aria-label="데이터 없음"
      >
        <rect x="0" y="0" width={width} height={height} fill="transparent" />
        <line
          x1={padding}
          x2={width - padding}
          y1={height / 2}
          y2={height / 2}
          stroke="#e5e7eb"
          strokeWidth={1}
          strokeDasharray="4 4"
        />
      </svg>
    );
  }

  const w = Math.max(2 * padding + 1, width);
  const h = Math.max(2 * padding + 1, height);

  const lo =
    typeof minY === 'number'
      ? minY
      : Math.min(...data.filter(Number.isFinite) as number[]);
  const hi =
    typeof maxY === 'number'
      ? maxY
      : Math.max(...data.filter(Number.isFinite) as number[]);

  // hi === lo 방어(평평한 데이터)
  const range = hi - lo || 1;

  const innerW = w - padding * 2;
  const innerH = h - padding * 2;

  const toX = (i: number) =>
    padding + (n === 1 ? innerW / 2 : (i / (n - 1)) * innerW);
  const toY = (v: number) =>
    padding + innerH - ((v - lo) / range) * innerH;

  // 라인 경로 생성
  let d = '';
  data.forEach((v, i) => {
    const x = toX(i);
    const y = toY(v);
    d += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
  });

  // 면적 채우기 경로(옵션)
  let area: string | null = null;
  if (fill !== 'none' && n > 1) {
    const firstX = toX(0);
    const lastX = toX(n - 1);
    const baseY = toY(lo); // 하단 기준
    area = `${d} L ${lastX} ${baseY} L ${firstX} ${baseY} Z`;
  }

  // 기준선(예: 지수 100)
  const baseLineY =
    typeof baseLine === 'number' ? toY(baseLine) : undefined;

  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      className={className}
      data-testid={testId}
      role="img"
      aria-label="매출 트렌드 스파크라인"
    >
      <rect x="0" y="0" width={w} height={h} fill="transparent" />
      {/* 기준선 */}
      {typeof baseLineY === 'number' && (
        <line
          x1={padding}
          x2={w - padding}
          y1={baseLineY}
          y2={baseLineY}
          stroke="#d1d5db"
          strokeWidth={1}
          strokeDasharray="4 4"
          aria-hidden="true"
        />
      )}
      {/* 면적(옵션) */}
      {area && (
        <path d={area} fill={fill} opacity={0.15} aria-hidden="true" />
      )}
      {/* 라인 */}
      <path
        d={d}
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
