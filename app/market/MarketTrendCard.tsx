'use client';

type MarketTrendCardProps = {
  values?: number[];
  updatedAt?: string;
  source?: string;
};

const FALLBACK_VALUES = [97, 102, 104, 101, 99, 103];

// 공용 색상(딥블루)
const LINE_COLOR = '#123b8c';

export default function MarketTrendCard({
  values,
  updatedAt,
  source,
}: MarketTrendCardProps) {
  const series = (values && values.length > 0 ? values : FALLBACK_VALUES).slice(-6);

  const last = series[series.length - 1];
  const base = 100;
  const diffFromBase = last - base;

  const maxVal = Math.max(...series, base);
  const minVal = Math.min(...series, base);
  const range = maxVal - minVal || 1;

  // 좌우 여백 최소화
  const left = 8;
  const right = 592;
  const top = 40;
  const bottom = 200;

  const points = series.map((v, idx) => {
    const t = series.length === 1 ? 0.5 : idx / (series.length - 1);
    const x = left + (right - left) * t;
    const y = bottom - ((v - minVal) / range) * (bottom - top);
    return { x, y, value: v };
  });

  const pathD = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ');

  const areaD =
    pathD +
    ` L ${points[points.length - 1].x} ${bottom} L ${points[0].x} ${bottom} Z`;

  const updatedAtText = updatedAt
    ? new Date(updatedAt).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
    : '-';

  const sourceLabel =
    source === 'live'
      ? 'live(실시간)'
      : source === 'snapshot'
      ? 'snapshot(샘플)'
      : source || 'snapshot';

  return (
    <section className="rounded-3xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">
            매출 트렌드(지수, 기준월=100)
          </h2>
          <p className="mt-1 text-[11px] text-slate-500">
            가로축은 과거→최근 흐름, 세로축은 지수 크기를 의미합니다. 100을 기준으로
            위·아래 움직임을 간단히 비교해 보세요.
          </p>
          <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-700">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-900" />
            <span>최근 6개 구간</span>
          </div>
        </div>
        <div className="text-right text-[11px] text-slate-500">
          <div>
            최근 지수{' '}
            <span className="font-semibold text-slate-900">
              {last.toFixed(0)}
            </span>
            {Number.isFinite(diffFromBase) && (
              <span
                className={
                  diffFromBase >= 0 ? 'text-emerald-600' : 'text-rose-600'
                }
              >
                {' '}
                ({diffFromBase >= 0 ? '기준 대비 +' : '기준 대비 '}
                {Math.abs(diffFromBase).toFixed(0)})
              </span>
            )}
          </div>
          <div className="mt-1">
            기준: <span className="font-medium text-slate-800">{sourceLabel}</span>
          </div>
          <div className="mt-0.5">
            업데이트:{' '}
            <span className="font-medium text-slate-800">{updatedAtText}</span>
          </div>
        </div>
      </div>

      {/* 그래프 영역 */}
      <div className="mt-4">
        <div className="relative w-full aspect-[5/2]">
          <svg viewBox="0 0 600 240" className="h-full w-full">
            <defs>
              <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={LINE_COLOR} stopOpacity="0.16" />
                <stop offset="100%" stopColor={LINE_COLOR} stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* 배경 가이드선 */}
            {[0.25, 0.5, 0.75].map((ratio) => (
              <line
                key={ratio}
                x1={left}
                x2={right}
                y1={top + (bottom - top) * ratio}
                y2={top + (bottom - top) * ratio}
                stroke="#e5e7eb"
                strokeDasharray="4 4"
                strokeWidth={1}
              />
            ))}

            {/* 영역 + 라인 (딥블루) */}
            <path d={areaD} fill="url(#trendFill)" />
            <path
              d={pathD}
              fill="none"
              stroke={LINE_COLOR}
              strokeWidth={1.6}      // ★ 20% 더 얇게
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* 포인트 + 값 표시 */}
            {points.map((p, idx) => (
              <g key={idx}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={4}
                  fill={idx === points.length - 1 ? LINE_COLOR : 'white'}
                  stroke={LINE_COLOR}
                  strokeWidth={2}
                />
                <text
                  x={p.x}
                  y={p.y - 10}
                  fontSize={8}          // ★ 20% 더 작게
                  textAnchor="middle"
                  fill={LINE_COLOR}
                  fontWeight={600}
                >
                  {p.value.toFixed(0)}
                </text>
              </g>
            ))}

            {/* X축 눈금 & 라벨 */}
            {points.map((p, idx) => (
              <g key={`tick-${idx}`}>
                <line
                  x1={p.x}
                  x2={p.x}
                  y1={bottom}
                  y2={bottom + 5}
                  stroke="#cbd5f5"
                  strokeWidth={1}
                />
                <text
                  x={p.x}
                  y={bottom + 20}
                  fontSize={10}
                  textAnchor="middle"
                  fill="#9ca3af"
                >
                  {idx === points.length - 1 ? '최근' : `${idx + 1}`}
                </text>
              </g>
            ))}

            {/* Y축 기준선(100) */}
            {base >= minVal && base <= maxVal && (
              <>
                <line
                  x1={left}
                  x2={right}
                  y1={
                    bottom -
                    ((base - minVal) / range) * (bottom - top)
                  }
                  y2={
                    bottom -
                    ((base - minVal) / range) * (bottom - top)
                  }
                  stroke="#4b5563"
                  strokeDasharray="6 4"
                  strokeWidth={1}
                />
                <text
                  x={left + 4}
                  y={
                    bottom -
                    ((base - minVal) / range) * (bottom - top) -
                    4
                  }
                  fontSize={10}
                  fill="#4b5563"
                >
                  기준 100
                </text>
              </>
            )}
          </svg>
        </div>
      </div>

      <p className="mt-2 text-[11px] text-slate-500">
        ※ 가로축은 왼쪽이 과거, 오른쪽이 최근입니다. 세로축 100이 기준 달의 매출 수준이며, 예를 들어
        최근 지수가 118이라면 기준 대비 약 18% 높은 수준이라고 이해하시면 됩니다.
      </p>
    </section>
  );
}
