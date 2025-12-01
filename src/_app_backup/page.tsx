'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Image from 'next/image';
import Link from 'next/link';

// 헤더 컴포넌트 임포트 (경로 확인 필요)
import HeaderMain from '@/components/HeaderMain';
import HomeQuickActions from '@/components/home/HomeQuickActions';
import RollingBanner from '@/components/home/RollingBanner';
import { ChevronRightIcon, CalendarDaysIcon } from '@heroicons/react/24/solid';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function HomePage() {
  const [franchises, setFranchises] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 최신순으로 데이터 가져오기
        const { data, error } = await supabase
          .from('franchises')
          .select('*')
          .order('id', { ascending: false });
        
        if (error) console.error('에러:', error);
        else setFranchises(data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 1. 상단 공통 헤더 (개선된 버전 적용) */}
      <HeaderMain />

      <main className="w-full flex justify-center bg-slate-50">
        <div className="w-full max-w-6xl px-4 py-10 md:px-6 lg:px-8 space-y-12">
          
          {/* 2. 히어로 섹션 */}
          <section aria-label="창업부스터 소개" className="mt-4">
            <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-white via-indigo-50/50 to-purple-50/50 px-6 py-10 shadow-lg border border-white/50 md:px-12 md:py-16">
              <div className="flex flex-col gap-10 md:flex-row md:items-center md:justify-between">
                
                {/* 왼쪽 텍스트 영역 */}
                <div className="max-w-xl md:w-3/5 z-10">
                  <div className="inline-flex items-center gap-2 mb-6">
                    <span className="px-3 py-1 rounded-full bg-slate-900 text-[10px] font-bold text-white shadow-md">
                      BETA
                    </span>
                    <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
                      v1.0 업데이트
                    </span>
                  </div>

                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight text-slate-900 break-keep">
                    창업부스터는 <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">실제 데이터</span>를 기반으로<br className="hidden md:block" />
                    창업 인사이트를 제공합니다
                  </h1>

                  <p className="mt-6 text-base text-slate-600 break-keep leading-relaxed">
                    상권·프랜차이즈·셀프 인테리어까지,<br className="md:hidden"/> 
                    창업 전에 꼭 보고 싶은 정보를 한 화면에서 비교해 보세요.
                  </p>

                  <div className="mt-10 flex flex-wrap gap-3">
                    <Link href="/magazine" className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-8 py-4 text-sm font-bold text-white shadow-lg hover:bg-slate-800 hover:shadow-xl transition-all hover:-translate-y-1">
                      창업 매거진 보기
                    </Link>
                    <Link href="/mbti" className="inline-flex items-center justify-center rounded-xl bg-white px-8 py-4 text-sm font-bold text-slate-900 shadow-md ring-1 ring-slate-200 hover:bg-slate-50 transition-all hover:-translate-y-1">
                      MBTI로 보는 창업
                    </Link>
                  </div>
                </div>

                {/* 오른쪽 이미지 영역 */}
                <div className="relative mt-6 h-64 w-full md:mt-0 md:h-80 md:w-2/5 lg:h-96 group">
                  <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/20 to-purple-600/20 rounded-3xl blur-2xl transform group-hover:scale-105 transition-transform duration-700 opacity-70"></div>
                  <Image 
                    src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1000&auto=format&fit=crop" 
                    alt="성공한 사장님 이미지" 
                    fill 
                    className="object-cover rounded-3xl shadow-2xl relative z-10 transform transition-transform duration-700 group-hover:scale-[1.02]"
                    priority
                  />
                </div>
              </div>
            </div>
          </section>

          {/* 3. 바로 실행 카드 섹션 */}
          <section aria-label="바로 실행 섹션">
            <HomeQuickActions />
          </section>

          {/* 4. 홍보 롤링 배너 */}
          <section aria-label="창업부스터 홍보 배너">
            <RollingBanner />
          </section>

          {/* 5. 프랜차이즈 실제 창업 성공 사례 (개선됨) */}
          <section aria-labelledby="success-title" className="pt-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
              <div>
                <h2 id="success-title" className="text-2xl md:text-3xl font-extrabold text-slate-900">
                  프랜차이즈 실제 창업 성공 사례
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  실제 데이터와 현장 스토리로 보는 브랜드별 창업 사례입니다.
                </p>
              </div>
              {/* 상단 더보기 버튼 */}
              <Link href="/cases" className="hidden sm:inline-flex items-center gap-1 text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
                전체 사례 보기 <ChevronRightIcon className="w-4 h-4" />
              </Link>
            </div>

            {loading ? (
              <div className="py-32 text-center text-slate-400 bg-white rounded-3xl border border-slate-100 shadow-sm">
                <div className="animate-pulse flex flex-col items-center">
                   <div className="h-4 w-4 bg-slate-200 rounded-full mb-2"></div>
                   데이터를 불러오는 중입니다...
                </div>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {/* slice(0, 6) : 2행(3열 기준) 노출 */}
                {franchises.slice(0, 6).map((item) => (
                  <div 
                    key={item.id} 
                    className="group flex flex-col overflow-hidden rounded-3xl bg-white border border-slate-100 shadow-sm transition-all hover:shadow-xl hover:border-indigo-100 hover:-translate-y-1 cursor-pointer"
                  >
                    {/* 카드 이미지 영역 */}
                    <div className="relative h-52 w-full overflow-hidden bg-slate-100">
                      {item.image_url && item.image_url.startsWith('http') ? (
                         <img 
                           src={item.image_url} 
                           alt={item.brand_name} 
                           className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" 
                         />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-slate-300 bg-slate-50">
                          <span className="text-xs font-medium">이미지 준비중</span>
                        </div>
                      )}
                      
                      {/* 카테고리 뱃지 */}
                      <div className="absolute top-4 left-4">
                        <span className="inline-block rounded-lg bg-white/90 backdrop-blur-md px-3 py-1.5 text-[10px] font-bold text-slate-900 shadow-sm">
                          {item.category}
                        </span>
                      </div>

                      {/* 창업년도 뱃지 (요청 반영) */}
                      <div className="absolute bottom-4 right-4">
                         <span className="inline-flex items-center gap-1 rounded-full bg-black/60 backdrop-blur-md px-3 py-1 text-[10px] font-medium text-white shadow-sm">
                           <CalendarDaysIcon className="w-3 h-3 text-indigo-300" />
                           {/* DB에 창업년도 없으면 임시값 2021 표시 */}
                           {item.established_year || '2021'}년 창업
                         </span>
                      </div>
                    </div>

                    {/* 카드 내용 영역 */}
                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                        {item.brand_name}
                      </h3>
                      <p className="text-xs text-slate-500 mb-6 line-clamp-2 leading-relaxed">
                        {item.brand_name}의 실제 매장 운영 데이터와 수익률을 분석한 리포트입니다.
                      </p>
                      
                      <div className="mt-auto space-y-3 rounded-2xl bg-slate-50 p-4 border border-slate-100">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-medium text-slate-500">평균 매출</span>
                          <span className="text-sm font-bold text-indigo-600">
                            {item.average_sales?.toLocaleString()}원
                          </span>
                        </div>
                        <div className="w-full h-px bg-slate-200/60"></div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-medium text-slate-500">창업 비용</span>
                          <span className="text-sm font-bold text-slate-900">
                            {item.startup_cost?.toLocaleString()}원
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 하단 더보기 버튼 (모바일용) */}
            <div className="flex justify-center pt-8 sm:hidden">
              <Link
                href="/cases"
                className="inline-flex w-full justify-center items-center rounded-xl border border-slate-200 bg-white px-6 py-4 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
              >
                성공 사례 더 보기
              </Link>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}