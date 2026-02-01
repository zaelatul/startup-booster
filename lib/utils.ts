// lib/utils.ts

// 1. 금액 포맷팅 (1억 이상 / 만원 단위)
export const formatMoney = (val: number) => {
  if (!val && val !== 0) return '-';
  if (val >= 10000) {
    const eok = Math.floor(val / 10000);
    const man = val % 10000;
    if (man === 0) return `${eok}억원`;
    return `${eok}억 ${man.toLocaleString()}만원`; 
  } 
  return `${val.toLocaleString()}만원`; 
};

// 2. 이미지 주소 깨짐 방지 (디코딩)
export const getCleanImageUrl = (url: string) => {
  if (!url) return 'https://placehold.co/800x400?text=No+Image';
  try { return decodeURIComponent(url); } catch (e) { return url; }
};

// 3. 이미지 데이터 정제 (JSON 파싱 및 라벨링)
export const normalizeImages = (images: any[] | null, defaultLabel: string): { url: string; label: string }[] => {
  if (!Array.isArray(images)) return [];
  return images
    .map((img) => {
      if (!img) return null;
      if (typeof img === 'object' && img.url) {
          return { url: img.url, label: img.label || defaultLabel };
      }
      if (typeof img === 'string' && img.startsWith('{')) {
          try { 
              const parsed = JSON.parse(img);
              return { url: parsed.url, label: parsed.label || defaultLabel };
          } catch(e) { 
              return { url: img, label: defaultLabel }; 
          }
      }
      return { url: img, label: defaultLabel };
    })
    .filter((img) => img !== null && img.url) as { url: string; label: string }[];
};

// 4. 메인 이미지 추출
export const extractMainImageUrl = (imgData: any): string => {
    if (!imgData) return '';
    if (typeof imgData === 'string' && imgData.startsWith('{')) {
        try { return JSON.parse(imgData).url; } catch { return imgData; }
    }
    if (typeof imgData === 'object' && imgData.url) return imgData.url;
    return imgData;
}