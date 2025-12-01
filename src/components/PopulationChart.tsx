// 신규 — web/src/components/PopulationChart.tsx
import * as React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LabelList,
  Cell,
} from "recharts";

type PopulationItemKey = "resident" | "worker" | "floating";

type PopulationItem = {
  key: PopulationItemKey;
  label: string;
  value: number;
};

/**
 * 예시 데이터
 * - 실제 서비스에서는 API 응답 값으로 교체하면 됩니다.
 */
const populationData: PopulationItem[] = [
  { key: "resident", label: "거주 인구", value: 32000 },
  { key: "worker", label: "직장/주간 인구", value: 45000 },
  { key: "floating", label: "유동 인구", value: 58000 },
];

const POPULATION_COLORS: Record<PopulationItemKey, string> = {
  resident: "#2563eb", // 파란색
  worker: "#22c55e",   // 초록색
  floating: "#f97316", // 주황색
};

/**
 * 거주/직장/유동 인구 막대 그래프
 * - 각 막대 색상을 다르게 적용
 * - 마우스 오버 없이도 막대 위에 수치(명)를 항상 표시
 */
export function PopulationChart() {
  return (
    <div className="h-64 w-full rounded-xl border border-blue-50 bg-white px-6 pb-6 pt-4 shadow-sm [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted">
      <div className="mb-3 flex items-baseline justify-between gap-2">
        <div>
          <h3 className="text-base font-semibold text-slate-900">
            거주/직장/유동 인구
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            상권 단위에서 거주 인구, 직장/주간 인구, 유동 인구의 규모를 한눈에 비교한 값입니다.
          </p>
        </div>
      </div>

      <div className="h-40 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={populationData}
            margin={{ top: 12, right: 8, left: -16, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10 }}
              tickFormatter={(value: number) => `${Math.round(value / 1000)}k`}
            />
            <Tooltip
              formatter={(value: number) => `${value.toLocaleString()}명`}
              labelFormatter={(label: string) => label}
            />
            <Bar
              dataKey="value"
              radius={[8, 8, 0, 0]}
              barSize={32}
              name="인구 수"
            >
              {/* 막대 위에 항상 숫자 표시 (모바일에서도 보임) */}
              <LabelList
                dataKey="value"
                position="top"
                formatter={(value: number) => value.toLocaleString()}
                className="text-[11px] fill-slate-700"
              />
              {/* 각 막대 색상 개별 지정 */}
              {populationData.map((item) => (
                <Cell
                  key={item.key}
                  fill={POPULATION_COLORS[item.key]}
                  className="outline-hidden"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 범례: 어떤 색이 어떤 인구인지 설명 */}
      <div className="mt-3 flex flex-wrap gap-3 text-[11px] text-slate-600">
        <LegendDot
          color={POPULATION_COLORS.resident}
          label="거주 인구"
          description="주민등록 기준 상권 내 거주 인구"
        />
        <LegendDot
          color={POPULATION_COLORS.worker}
          label="직장/주간 인구"
          description="직장·학교 등으로 상권을 방문하는 주간 인구"
        />
        <LegendDot
          color={POPULATION_COLORS.floating}
          label="유동 인구"
          description="쇼핑·식사 등으로 머무르는 유동 인구"
        />
      </div>
    </div>
  );
}

type LegendDotProps = {
  color: string;
  label: string;
  description?: string;
};

function LegendDot({ color, label, description }: LegendDotProps) {
  return (
    <div className="flex items-center gap-1">
      <span
        className="inline-block h-2.5 w-2.5 rounded-full"
        style={{ backgroundColor: color }}
      />
      <span className="font-medium text-[11px] text-slate-700">{label}</span>
      {description ? (
        <span className="pl-1 text-[10px] text-slate-400">· {description}</span>
      ) : null}
    </div>
  );
}
