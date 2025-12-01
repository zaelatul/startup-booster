import { NextRequest, NextResponse } from 'next/server';

/**
 * 상권 인사이트 API (임시 스냅샷 버전)
 *
 * - 쿼리: ?dong=행정동코드(10자리)&biz=FNB|RETAIL|SERVICE
 * - 항상 200으로 응답, ok=false일 때도 JSON 안에 error 포함
 * - 현재는 공공 API 대신 스냅샷 데이터를 그대로 돌려줌
 */

const ALLOWED_BIZ = ['FNB', 'RETAIL', 'SERVICE'] as const;
type BizType = (typeof ALLOWED_BIZ)[number];

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const dong = (url.searchParams.get('dong') || '').trim();
  const biz = (url.searchParams.get('biz') || '').trim().toUpperCase() as BizType | string;

  const nowIso = new Date().toISOString();
  const base = {
    updatedAt: nowIso,
    params: { dong, biz },
  };

  // 1) 행정동 코드 검증 (숫자 10자리만 허용)
  if (!/^\d{10}$/.test(dong)) {
    return NextResponse.json({
      ok: false,
      source: 'snapshot' as const,
      ...base,
      error: {
        code: 'INVALID_DONG',
        message:
          '행정동(숫자 10자리)만 분석할 수 있습니다. 예: 1168058000 (서울 강남구 역삼1동). 군·면·리는 현재 지원하지 않습니다.',
      },
    });
  }

  // 2) 업종 코드 검증
  if (!ALLOWED_BIZ.includes(biz as BizType)) {
    return NextResponse.json({
      ok: false,
      source: 'snapshot' as const,
      ...base,
      error: {
        code: 'INVALID_BIZ',
        message:
          '아직 지원하지 않는 업종입니다. 화면에서 제공하는 업종 선택(FNB/RETAIL/SERVICE)만 사용해주세요.',
      },
    });
  }

  // 3) 라이브 호출은 나중에 연결 (현재는 바로 스냅샷 사용)
  //    - 나중에 여기서 Cloudflare Worker / 공공 API 호출
  //    - 실패하면 catch에서 snapshot으로 폴백하는 구조로 바꿀 예정
  try {
    const snapshot = buildSnapshot(dong, biz as BizType);

    return NextResponse.json({
      ok: true,
      source: 'snapshot' as const,
      ...base,
      data: snapshot,
    });
  } catch (err) {
    console.error('insights snapshot error', err);
    // 스냅샷 자체에 문제가 있어도 화면이 깨지지 않도록 방어
    return NextResponse.json({
      ok: false,
      source: 'snapshot' as const,
      ...base,
      error: {
        code: 'SNAPSHOT_ERROR',
        message:
          '상권 데이터를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요. 문제가 계속되면 관리자에게 문의해 주세요.',
      },
    });
  }
}

/**
 * 임시 스냅샷 데이터 구성
 * - dong, biz에 따라 숫자를 조금씩만 바꿔서 리얼 느낌만 살림
 * - 프론트에서는 kpis / trend / customer 세 블록을 사용
 */
function buildSnapshot(dong: string, biz: BizType) {
  // 단순한 해시 느낌으로 지수에 약간 변화를 줌
  const seed = Number(dong.slice(-2)) || 0;
  const bizOffset = biz === 'FNB' ? 5 : biz === 'RETAIL' ? 2 : -3;

  const baseIndex = 100 + ((seed % 7) - 3) + bizOffset; // 100±몇 포인트

  const kpis = {
    // 요약 지표
    stores_total: 120 + (seed % 15), // 점포 수
    open_rate_recent: 4.2 + ((seed % 3) - 1) * 0.3, // 개업률(%)
    close_rate_recent: 2.1 + ((seed % 3) - 1) * 0.2, // 폐업률(%)
    sales_index_recent: baseIndex,

    // 인구·유동
    resident_population: 32000 + seed * 10,
    workers_population: 45000 + seed * 8,
    floating_population: 58000 + seed * 12,
    population_index: baseIndex + 2,
    flow_index: baseIndex + 4,

    // 구조·비용 (인테리어는 제외, 임대료/보증금 위주)
    rent_index: baseIndex + 5,
    deposit_index: baseIndex + 3,
    structure_cost_index: baseIndex + 4,

    // 경쟁·집객 (학교·병원 등 공공성 시설은 제외, 지하철/상가 중심)
    competition_index: baseIndex - 2, // 같은 업종 점포 밀도
    brand_density_index: baseIndex + 1, // 브랜드 점포 밀집도
    anchor_tenant_index: baseIndex + 6, // 지하철·상가 영향

    // 종합 인덱스
    activity_index: baseIndex + 3,
    growth_index: baseIndex + 1,
    stability_index: baseIndex - 1,
  };

  const trend = {
    // 매출 지수 트렌드 (기준월=100)
    sales_index: [
      98,
      100,
      baseIndex - 2,
      baseIndex,
      baseIndex + 2,
      baseIndex + 4,
      baseIndex + 1,
    ],
  };

  const customer = {
    ages: [
      { label: '10대', share: 8 },
      { label: '20대', share: biz === 'FNB' ? 28 : 22 },
      { label: '30대', share: 28 },
      { label: '40대', share: 22 },
      { label: '50대↑', share: 14 },
    ],
    gender:
      biz === 'FNB'
        ? { male: 48, female: 52 }
        : biz === 'RETAIL'
        ? { male: 46, female: 54 }
        : { male: 52, female: 48 },
    workerShare: biz === 'SERVICE' ? 62 : 68,
  };

  return { kpis, trend, customer };
}
