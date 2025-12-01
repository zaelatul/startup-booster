// types/market.ts

export interface ProfitTrend {
  quarter: string;
  index: number;
}

export interface AgeDist {
  name: string;
  value: number;
}

export interface GenderDist {
  name: string;
  value: number;
}

export interface Population {
  name: string;
  value: number;
}

export interface CostStructure {
  name: string;
  value: number;
}

export interface TimeIndex {
  name: string;
  value: number;
}

export interface KPICard {
  title: string;
  value: string;
  desc: string;
}

// 전체 상권 분석 데이터를 묶는 큰 가방
export interface MarketAnalysisData {
  profitTrend: ProfitTrend[];
  ageDist: AgeDist[];
  genderDist: GenderDist[];
  population: Population[];
  costStructure: CostStructure[];
  timeIndex: TimeIndex[];
  kpiCards: KPICard[];
}