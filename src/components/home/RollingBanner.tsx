// 신규 — src/components/home/RollingBanner.tsx
'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

type BannerItem = {
  id: number;
  badge: string;
  title: string;
  description: string;
  imageUrl: string;
};

const ITEMS: BannerItem[] = [
  {
    id: 1,
    badge: '창업부스터 한정 특가 소식',
    title: '소프트포트 회원 전용, POS·키오스크 패키지 할인',
    description:
      '현재 가맹점 및 예비창업자 대상 POS/키오스크 패키지를 특별가로 제공합니다.',
    imageUrl:
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80',
  },
  // 필요하면 여기 배열에 배너를 더 추가하면 자동으로 롤링됨
];

export default function RollingBanner() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (ITEMS.length <= 1) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % ITEMS.length);
    }, 7000);

    return () => clearInterval(timer);
  }, []);

  const current = ITEMS[index];

  return (
    <article className="flex flex-col overflow-hidden rounded-3xl bg-slate-900 text-white shadow-lg md:flex-row">
      {/* 텍스트 영역 */}
      <div className="flex flex-1 flex-col justify-center gap-3 px-6 py-6 md:px-8 md:py-8">
        <span className="inline-flex w-fit items-center rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
          {current.badge}
        </span>
        <h2 className="text-lg font-semibold md:text-xl">{current.title}</h2>
        <p className="text-sm text-slate-300">{current.description}</p>

        <button
          type="button"
          className="mt-3 inline-flex w-fit items-center rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-900 hover:bg-slate-100"
        >
          자세히 보기 →
        </button>
      </div>

      {/* 이미지 영역 */}
      <div className="relative h-40 w-full md:h-auto md:w-80">
        <Image
          src={current.imageUrl}
          alt={current.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 320px"
        />
      </div>
    </article>
  );
}
