'use client';

import { useEffect, useState, MouseEvent } from 'react';
import Link from 'next/link';
import { ChevronRightIcon, SparklesIcon, MegaphoneIcon } from '@heroicons/react/24/solid';

// [엉아 참고] 원래 lib/banners에서 가져오던 타입인데, 
// 여기서 바로 쓸 수 있게 정의해뒀어. (나중에 파일 분리해도 돼)
export type Banner = {
  id: number;
  title: string;
  desc?: string; // 설명 추가
  href: string;
  type?: 'event' | 'partner' | 'notice'; // 배너 타입
};

// [임시 데이터] 만약 부모에서 items를 안 주면 이 데이터가 나옴 (화면 확인용)
const DEFAULT_ITEMS: Banner[] = [
  { id: 1, title: '소프트포트 회원 전용 POS 특가', desc: '가맹점 및 예비창업자 대상 패키지 할인', href: '/market', type: 'event' },
  { id: 2, title: '여름 시즌 추천 프랜차이즈 TOP 10', desc: '지금 창업하면 대박나는 아이템 모음', href: '/franchise/explore', type: 'partner' },
  { id: 3, title: '셀프 인테리어 견적 계산기 오픈', desc: '내 가게 예상 시공비 1분만에 확인', href: '/interior', type: 'notice' },
];

type Props = {
  items?: Banner[]; // optional로 변경 (데이터 없어도 기본값 보여주려고)
  onSlide?: (item: Banner, index: number) => void;
  onClickItem?: (item: Banner, index: number) => void;
};

export default function RollingBanner({ items = DEFAULT_ITEMS, onSlide, onClickItem }: Props) {
  const [index, setIndex] = useState(0);

  // 데이터가 아예 없을 경우를 대비한 안전장치
  const bannerList = items && items.length > 0 ? items : DEFAULT_ITEMS;

  useEffect(() => {
    const t = setInterval(() => {
      setIndex((i) => {
        const ni = (i + 1) % bannerList.length;
        onSlide?.(bannerList[ni], ni);
        return ni;
      });
    }, 4000);
    return () => clearInterval(t);
  }, [bannerList, onSlide]);

  const current = bannerList[index];

  // 뱃지 디자인 함수
  const getBadgeStyle = (type?: string) => {
    switch (type) {
      case 'event': return 'bg-rose-500 text-white';
      case 'partner': return 'bg-indigo-500 text-white';
      default: return 'bg-slate-700 text-white';
    }
  };

  const getBadgeLabel = (type?: string) => {
    switch (type) {
      case 'event': return 'HOT EVENT';
      case 'partner': return '제휴 혜택';
      default: return '공지사항';
    }
  };

  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-[#1E293B] shadow-lg border border-slate-700">
      {/* 배경 장식 (은은한 효과) */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between p-6 md:p-8 gap-4">
        
        {/* 텍스트 영역 */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider ${getBadgeStyle(current.type)}`}>
              {getBadgeLabel(current.type)}
            </span>
            <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
              <SparklesIcon className="w-3 h-3 text-yellow-400" />
              창업부스터 한정
            </span>
          </div>
          
          <h3 className="text-xl md:text-2xl font-bold text-white mb-2 leading-tight">
            {current.title}
          </h3>
          <p className="text-sm text-slate-400 line-clamp-1">
            {current.desc || '자세한 내용은 상세페이지에서 확인하세요.'}
          </p>
        </div>

        {/* 버튼 및 인디케이터 영역 */}
        <div className="flex flex-col items-end gap-4 w-full md:w-auto">
          <Link
            href={current.href}
            onClick={() => onClickItem?.(current, index)}
            className="group flex items-center gap-1 px-5 py-2.5 bg-white text-slate-900 rounded-full text-xs font-bold hover:bg-slate-100 transition-all active:scale-95 shadow-sm w-full md:w-auto justify-center"
          >
            자세히 보기
            <ChevronRightIcon className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </Link>

          {/* 점 인디케이터 */}
          <div className="flex gap-2">
            {bannerList.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === index ? 'w-6 bg-white' : 'w-1.5 bg-slate-600 hover:bg-slate-500'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}