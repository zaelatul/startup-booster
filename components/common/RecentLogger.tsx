'use client';

import { useEffect } from 'react';

type Props = {
  id: string;
  brand: string;
  branch?: string;
  image: string;
  url: string;
};

export default function RecentLogger({ id, brand, branch = '', image, url }: Props) {
  useEffect(() => {
    if (!id || !brand) return;

    try {
      const newItem = {
        id,      // 중복 체크용 ID
        brand,   // 브랜드명
        branch,  // 지점명 또는 카테고리
        image,   // 썸네일 이미지
        url      // 클릭 시 이동할 주소
      };

      const existing = JSON.parse(localStorage.getItem('recent_views') || '[]');
      
      // 이미 목록에 있으면 지우고 (중복 제거)
      const filtered = existing.filter((item: any) => item.id !== id);
      
      // 맨 앞에 추가해서 저장 (최대 10개 유지)
      const updated = [newItem, ...filtered].slice(0, 10);
      
      localStorage.setItem('recent_views', JSON.stringify(updated));
    } catch (e) {
      console.error("최근 본 내역 저장 실패:", e);
    }
  }, [id, brand, branch, image, url]);

  return null; // 화면에는 아무것도 보여주지 않음 (투명 인간)
}