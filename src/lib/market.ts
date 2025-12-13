import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export type MarketAnalysisData = {
  grade: string;
  summaryReport: {
    growthTitle: string; growthDesc: string;
    stabilityTitle: string; stabilityDesc: string;
    compTitle: string; compDesc: string;
  };
  profitTrend: { quarter: string; index: number }[];
  ageDist: { name: string; value: number }[];
  genderDist: { name: string; value: number }[];
  population: { name: string; value: string | number; label?: string }[];
  costStructure: { name: string; value: number; label: string }[];
  timeIndex: { name: string; value: number }[];
  kpiCards: { title: string; value: string; desc: string; badge?: string }[];
};

const parseNumber = (val: any) => {
  if (typeof val === 'number') return val;
  if (typeof val === 'string') return parseInt(val.replace(/,/g, ''), 10) || 0;
  return 0;
};

export async function fetchMarketAnalysis(address: string, category: string, mapStoreCount: number): Promise<MarketAnalysisData> {
  const regionName = address.split(' ').pop() || '';
  const categoryKeyword = category === '전체' ? '' : category;

  console.log(`🔍 [1단계] 분석 요청: 지역=[${regionName}] 업종=[${categoryKeyword}] 지도점포=[${mapStoreCount}]`);

  let salesData: any = null;
  let storeData: any = null;
  let popData: any = null;

  if (regionName) {
    try {
        // A. 매출 데이터
        const salesRes = await supabase.from('market_stats')
            .select('*').eq('region_name', regionName).ilike('category', `%${categoryKeyword}%`)
            .order('year_code', { ascending: false }).limit(1);
        
        // B. 점포 데이터
        const storeRes = await supabase.from('market_stores')
            .select('*').eq('region_name', regionName).ilike('category', `%${categoryKeyword}%`)
            .order('year_code', { ascending: false }).limit(1);

        // C. 인구 데이터
        const popRes = await supabase.from('market_population')
            .select('*').eq('region_name', regionName)
            .order('year_code', { ascending: false }).limit(1);

        if (salesRes.data?.[0]) salesData = salesRes.data[0];
        if (storeRes.data?.[0]) storeData = storeRes.data[0];
        if (popRes.data?.[0]) popData = popRes.data[0];

        console.log(`🔍 [2단계] DB 조회 결과: 매출=${!!salesData}, 점포=${!!storeData}, 인구=${!!popData}`);
        
    } catch (e) {
        console.error("🚨 DB 에러:", e);
    }
  }

  // ... (이하 로직은 기존과 동일)
  const totalSales = salesData ? parseNumber(salesData.sales_score) : 0;
  const dbStoreCount = storeData ? parseNumber(storeData.store_count) : 0;
  const finalStoreCount = dbStoreCount > 0 ? dbStoreCount : (mapStoreCount > 0 ? mapStoreCount : 1);
  const perStoreRevenue = totalSales > 0 ? Math.floor(totalSales / finalStoreCount) : 0;

  const totalPop = popData ? parseNumber(popData.total_pop) : 0;
  
  let grade = 'C';
  // 유동인구 기준 등급 (현실화)
  if (totalPop >= 100000) grade = 'S';
  else if (totalPop >= 50000) grade = 'A';
  else if (totalPop >= 20000) grade = 'B';
  else grade = 'C';

  let report = {
    growthTitle: "유동인구 분석 대기", growthDesc: "데이터가 수집되지 않았습니다.",
    stabilityTitle: "-", stabilityDesc: "-",
    compTitle: "-", compDesc: "-"
  };

  if (grade === 'S') {
    report = {
      growthTitle: "유동인구 매우 많음", growthDesc: "항상 붐비는 핵심 상권입니다.",
      stabilityTitle: "🔴 고위험 (임대료)", stabilityDesc: "수익 내기 어렵습니다. 아이템 선정 주의.",
      compTitle: "경쟁 치열함", compDesc: "확실한 차별화 없이는 생존이 어렵습니다."
    };
  } else if (grade === 'A') {
    report = {
        growthTitle: "유동인구 많음", growthDesc: "안정적인 유입이 기대됩니다.",
        stabilityTitle: "🟡 주의 필요", stabilityDesc: "고정비 부담이 큽니다. 회전율을 높이세요.",
        compTitle: "경쟁 높음", compDesc: "브랜딩과 마케팅이 중요합니다."
    };
  } else if (grade === 'B') {
    report = {
        growthTitle: "유동인구 보통", growthDesc: "시간대별 편차가 존재합니다.",
        stabilityTitle: "🟢 관리 중요", stabilityDesc: "고정 고객 확보 노력이 필요합니다.",
        compTitle: "경쟁 보통", compDesc: "단골 고객 관리가 승부처입니다."
    };
  } else { // C급
    report = {
        growthTitle: "유동인구 적음", growthDesc: "특정 목적 방문 위주입니다.",
        stabilityTitle: "🔵 리스크 낮음", stabilityDesc: "진입 장벽은 낮으나 대중적 아이템 필수.",
        compTitle: "경쟁 낮음", compDesc: "수요 자체가 적을 수 있습니다."
    };
  }

  // 인구 데이터 가공
  const malePop = popData ? parseNumber(popData.male_pop) : 50;
  const femalePop = popData ? parseNumber(popData.female_pop) : 50;
  const totalGender = malePop + femalePop || 1;
  const maleRatio = Math.round((malePop / totalGender) * 100);
  const femaleRatio = 100 - maleRatio;
  const estimatedRes = totalPop > 0 ? Math.floor(totalPop * 0.3) : 0;

  const age10 = popData ? parseNumber(popData.age_10) : 10;
  const age20 = popData ? parseNumber(popData.age_20) : 20;
  const age30 = popData ? parseNumber(popData.age_30) : 30;
  const age40 = popData ? parseNumber(popData.age_40) : 20;
  const age50 = popData ? parseNumber(popData.age_50) : 10;
  const age60 = popData ? parseNumber(popData.age_60) : 10;

  // 비용 구조
  let costStructure = [];
  if (categoryKeyword.includes('서비스') || categoryKeyword.includes('부동산')) {
    costStructure = [
      { name: '임대료', value: 30, label: '30%' },
      { name: '인건비', value: 30, label: '30%' },
      { name: '기타', value: 10, label: '10%' },
      { name: '순이익', value: 30, label: '30%' }
    ];
  } else {
    costStructure = [
      { name: '임대료', value: 15, label: '15%' },
      { name: '인건비', value: 25, label: '25%' },
      { name: '재료비', value: 35, label: '35%' },
      { name: '순이익', value: 25, label: '25%' }
    ];
  }

  return {
    grade, summaryReport: report,
    profitTrend: [
        { quarter: '1분기', index: Math.floor(perStoreRevenue * 0.9 / 10000) },
        { quarter: '2분기', index: Math.floor(perStoreRevenue * 0.95 / 10000) },
        { quarter: '3분기', index: Math.floor(perStoreRevenue * 1.05 / 10000) },
        { quarter: '4분기', index: Math.floor(perStoreRevenue / 10000) }
    ],
    ageDist: [
      { name: '10대', value: age10 }, { name: '20대', value: age20 }, { name: '30대', value: age30 },
      { name: '40대', value: age40 }, { name: '50대', value: age50 }, { name: '60대+', value: age60 }
    ],
    genderDist: [ { name: '남성', value: maleRatio }, { name: '여성', value: femaleRatio } ],
    population: [
      { name: '거주', value: estimatedRes, label: `${(estimatedRes/10000).toFixed(1)}만` },
      { name: '유동', value: totalPop, label: `${(totalPop/10000).toFixed(1)}만` }
    ],
    costStructure,
    timeIndex: [ { name: '점심', value: 60 }, { name: '저녁', value: 40 } ],
    kpiCards: [
      { 
        title: '월 예상 매출 (점포당)', 
        value: perStoreRevenue > 0 ? `${(perStoreRevenue / 100000000).toFixed(1)}억원` : '-', 
        desc: `경쟁점포 ${finalStoreCount}개 평균`, badge: '예측' 
      },
      { 
        title: '핵심 고객 (유동)', 
        value: maleRatio > femaleRatio ? `남성 (${maleRatio}%)` : `여성 (${femaleRatio}%)`, 
        desc: '유동인구 성비 기준' 
      },
      { 
        title: '상권 등급', 
        value: `${grade}급`, 
        desc: '유동인구 규모 기준', badge: grade === 'S' ? '최상위' : '일반'
      },
      { 
        title: '경쟁 점포 수', 
        value: `${finalStoreCount}개`, 
        desc: dbStoreCount > 0 ? '공공데이터 기준' : '지도 데이터 추정' 
      },
    ],
  };
}