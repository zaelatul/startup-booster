// src/lib/categories.ts  (신규)
// 카테고리 다중 파싱 유틸: "Retail|F&B|Service", "Retail,F&B", 반복 파라미터 모두 지원.
// 대소문자/공백/기호 정규화 + 중복 제거.

export const CATEGORIES = ['Retail', 'F&B', 'Service'] as const;
export type Category = (typeof CATEGORIES)[number];

function normalize(token: string): string {
  // 알파벳과 &만 남기고 공백/기호 제거, 대문자화
  const t = token.trim();
  if (!t) return '';
  // 특수문자 정리: "f&b", "F & B" 같은 변형 지원
  const cleaned = t
    .replace(/\s+/g, '')
    .replace(/＆/g, '&') // 전각 & 방지
    .toUpperCase();

  // 대표 표기 매핑
  if (cleaned === 'RETAIL') return 'Retail';
  if (cleaned === 'SERVICE' || cleaned === 'SERVICES') return 'Service';
  if (cleaned === 'F&B' || cleaned === 'F& B' || cleaned === 'FNB' || cleaned === 'F&BN' || cleaned === 'FAND B' || cleaned === 'FB') return 'F&B';

  // 정확 매칭이 아니면 빈값
  return '';
}

export function parseCategories(input: unknown): Category[] {
  const rawParts: string[] = [];

  if (Array.isArray(input)) {
    for (const v of input) {
      if (typeof v === 'string') rawParts.push(v);
    }
  } else if (typeof input === 'string') {
    rawParts.push(input);
  }

  // 파이프(|) 또는 콤마(,) 기준 분리
  const tokens = rawParts.flatMap((s) => s.split(/[|,]/));

  const normalized = tokens
    .map(normalize)
    .filter((v): v is Category => (CATEGORIES as readonly string[]).includes(v));

  // 중복 제거
  return Array.from(new Set(normalized)) as Category[];
}
