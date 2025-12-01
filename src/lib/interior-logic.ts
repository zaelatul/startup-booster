import { TabKey } from './interior-data';

// 업체 시공 평균 단가 (비교용, 평당 시공비 포함 대략적 수치) -> 절감액 계산용
export const PRO_UNIT_PRICE: Record<TabKey, number> = {
  wall: 80000,  // 업체는 자재+인건비 포함 평당 8만원 가정
  floor: 60000, // 업체는 평당 6만원 가정
};

// 1인당 하루 시공 인건비 기준
export const PRO_LABOR_COST = 250000; 

export function fmtKRW(v?: number | null): string {
  if (v === null || v === undefined || isNaN(v)) return '-';
  return v.toLocaleString('ko-KR') + '원';
}

// [핵심] 리얼한 자재 산출 로직
export function calculateCost(
  widthStr: string,
  lengthStr: string,
  zoneStr: string,
  activeTab: TabKey,
  // 선택된 자재 정보 (없으면 기본값 600*600, 5000원 적용)
  product: { tile_width?: number; tile_height?: number; price_per_piece?: number } = {} 
) {
  const widthNum = Number(widthStr);
  const lengthNum = Number(lengthStr);
  const zoneNum = Number(zoneStr);

  const isValid =
    !isNaN(widthNum) && widthNum > 0 &&
    !isNaN(lengthNum) && lengthNum > 0 &&
    !isNaN(zoneNum) && zoneNum > 0;

  if (!isValid) {
    return { totalArea: 0, materialCost: 0, proCost: 0, saveCost: 0, boxCount: 0, pieceCount: 0, isValid: false };
  }

  // 1. 시공 면적 (㎡)
  const totalArea = widthNum * lengthNum * zoneNum; 

  // 2. 자재 스펙 (DB에 없으면 기본값: 600각, 5000원)
  const tW = product.tile_width || 600;
  const tH = product.tile_height || 600;
  const price = product.price_per_piece || 5000;

  // 3. 자재 한 장의 면적 (㎡로 변환: mm * mm / 1,000,000)
  const pieceArea = (tW * tH) / 1000000;

  // 4. 필요 수량 계산 (여유율 10% 포함)
  // 전체면적 / 한장면적 * 1.1 -> 올림 처리
  const pieceCount = Math.ceil((totalArea / pieceArea) * 1.1);

  // 5. 비용 계산
  const materialCost = pieceCount * price;

  // 6. 비교군 (업체 비용) - 평(3.3㎡) 단위로 계산
  const pyeong = totalArea / 3.3;
  const proCost = Math.round(pyeong * PRO_UNIT_PRICE[activeTab]);
  
  const saveCost = proCost - materialCost;

  return { 
    totalArea, 
    materialCost, 
    proCost, 
    saveCost, 
    pieceCount, // 낱개 수량
    boxCount: Math.ceil(pieceCount / 10), // (가정) 1박스에 10장 들었다고 침
    isValid: true,
    spec: { tW, tH, price }
  };
}