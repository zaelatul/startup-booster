import Link from 'next/link';

export default function Footer() {
  return (
    // ✅ [수정 1] py-10 -> py-6 (모바일 세로 길이 30% 축소)
    <footer className="bg-slate-900 text-slate-400 py-6 md:py-16 border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-6">
        {/* 상단: 로고 및 회사명 (마진 축소) */}
        <div className="mb-4 md:mb-8">
          <h2 className="text-white font-bold text-lg md:text-xl mb-1">(주)시너지허브</h2>
          <p className="text-slate-500 text-[10px] md:text-xs">Start-up Synergy Hub</p>
        </div>

        {/* 하단 정보 영역 
           - 모바일: grid-cols-2 (2칸씩 배치)
           - 갭 조정: gap-y-1로 줄여서 더 오밀조밀하게
        */}
        <div className="grid grid-cols-2 md:flex md:flex-wrap md:gap-x-8 md:gap-y-2 gap-x-2 gap-y-1 text-[10px] md:text-sm leading-snug">
          
          {/* 1. 대표이사 */}
          <div className="col-span-1">
            <span className="font-bold text-slate-200 mr-1.5 md:mr-2">대표이사</span>
            <span>김인흥</span>
          </div>

          {/* 2. 주소 */}
          <div className="col-span-1">
             {/* ✅ [수정 2] block 클래스와 <br> 태그 제거 -> 라벨 옆에 바로 텍스트 시작 */}
             <span className="font-bold text-slate-200 mr-1.5 md:mr-2">주소</span>
             <span>경기도 광명시 소하로 190, 광명G타워 12층 38호</span>
          </div>

          {/* 3. 이메일 */}
          <div className="col-span-1">
             <span className="font-bold text-slate-200 mr-1.5 md:mr-2">이메일</span>
             <span>sy.hub.ko@gmail.com</span>
          </div>

          {/* 4. 연락처 */}
          <div className="col-span-1">
             <span className="font-bold text-slate-200 mr-1.5 md:mr-2">연락처</span>
             <span>070-8144-5863</span>
          </div>

        </div>

        {/* 카피라이트 (여백 축소) */}
        <div className="mt-4 pt-4 md:mt-8 md:pt-8 border-t border-slate-800 text-center text-slate-600 text-[10px] md:text-xs">
          Copyright © {new Date().getFullYear()} Synergy Hub. All rights reserved.
        </div>
      </div>
    </footer>
  );
}