'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Image from 'next/image';
import Link from 'next/link';

// [디자인 복구] 아이콘 라이브러리 추가
import { ArrowRight, MapPin, Store, PaintBucket } from 'lucide-react';
import { ChevronRightIcon, CalendarDaysIcon } from '@heroicons/react/24/solid';

// [기능 유지] 롤링 배너 컴포넌트
import RollingBanner from '@/components/home/RollingBanner';

// Supabase 설정
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function HomePage() {
  // [기능 유지] 데이터 상태 관리
  const [franchises, setFranchises] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // [기능 유지] 데이터 페칭 로직
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from('franchises')
          .select('*')
          .order('id', { ascending: false })
          .limit(6);
        
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
      <main className="w-full flex flex-col items-center">
        
        {/* 1. 히어로 섹션 [디자인 복구: 메탈 그레이 Dark 테마] */}
        <section className="w-full relative pt-32 pb-24 overflow-hidden bg-slate-900 text-white">
            {/* 배경 그라데이션 효과 */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-black opacity-80"></div>
            
            <div className="relative max-w-6xl mx-auto px-4 w-full z-10">
              <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                  
                  {/* 텍스트 영역 */}
                  <div className="flex-1 text-center md:text-left">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-slate-700/50 text-blue-200 text-xs font-bold mb-6 border border-slate-600 backdrop-blur-sm">
                        AI 기반 창업 솔루션
                    </span>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-white tracking-tight">
                        성공적인 창업의 시작<br />
                        <span className="text-blue-500">창업부스터</span>와 함께
                    </h1>
                    
                    <p className="text-base md:text-lg text-slate-400 mb-10 leading-relaxed font-light">
                        창업부스터는 실제 데이터를 기반으로<br />
                        실패 없는 창업 인사이트를 제공합니다
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                        <Link 
                        href="/analysis"
                        className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-900/30 flex items-center justify-center gap-2 hover:-translate-y-1"
                        >
                        무료로 시작하기 <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                  </div>

                  {/* 이미지 영역 */}
                  <div className="flex-1 relative w-full max-w-lg flex justify-center md:justify-end">
                      <div className="relative aspect-square w-full max-w-md animate-float">
                          <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-3xl"></div>
                          <Image
                            src="/images/hero-store.png"
                            alt="창업부스터 서비스 예시"
                            fill
                            className="object-contain drop-shadow-2xl relative z-10"
                            priority
                          />
                      </div>
                  </div>
              </div>
            </div>
        </section>

        <div className="w-full max-w-6xl px-4 py-16 md:px-6 lg:px-8 space-y-20">

          {/* 2. 주요 서비스 섹션 [디자인 복구: 카드 3개 명시적 배치] */}
          <section aria-label="주요 서비스">
             <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-slate-900 mb-3">어떤 도움이 필요하신가요?</h2>
                <p className="text-slate-500">예비 사장님에게 꼭 필요한 기능을 모았습니다</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
                {/* 카드 1: 상권분석 */}
                <Link href="/analysis" className="group block h-full">
                  <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 hover:-translate-y-1 h-full flex flex-col">
                    <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
                      <MapPin className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">상권분석</h3>
                    <p className="text-slate-500 text-sm mb-6 leading-relaxed flex-grow">
                      철저한 상권분석으로 실패 확률을 줄이세요.<br/>
                      유동인구와 매출 데이터를 분석합니다.
                    </p>
                    <div className="flex items-center text-blue-600 text-sm font-bold group-hover:translate-x-1 transition-transform mt-auto">
                      자세히 보기 <ArrowRight className="w-4 h-4 ml-2" />
                    </div>
                  </div>
                </Link>

                {/* 카드 2: 프랜차이즈 분석 */}
                <Link href="/franchise" className="group block h-full">
                  <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 hover:-translate-y-1 h-full flex flex-col">
                    <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 transition-colors">
                      <Store className="w-7 h-7 text-indigo-600 group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">프랜차이즈 분석</h3>
                    <p className="text-slate-500 text-sm mb-6 leading-relaxed flex-grow">
                      과장 광고에 현혹 되지 마시고<br/>
                      실제 데이터를 확인하세요.
                    </p>
                    <div className="flex items-center text-indigo-600 text-sm font-bold group-hover:translate-x-1 transition-transform mt-auto">
                      자세히 보기 <ArrowRight className="w-4 h-4 ml-2" />
                    </div>
                  </div>
                </Link>

                {/* 카드 3: 셀프 인테리어 */}
                <Link href="/interior" className="group block h-full">
                  <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 hover:-translate-y-1 h-full flex flex-col">
                    <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-orange-600 transition-colors">
                      <PaintBucket className="w-7 h-7 text-orange-600 group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">셀프 인테리어</h3>
                    <p className="text-slate-500 text-sm mb-6 leading-relaxed flex-grow">
                      바닥과 벽면 셀프 시공으로<br/>
                      인테리어 비용을 30%~40% 절감하세요.
                    </p>
                    <div className="flex items-center text-orange-600 text-sm font-bold group-hover:translate-x-1 transition-transform mt-auto">
                      자세히 보기 <ArrowRight className="w-4 h-4 ml-2" />
                    </div>
                  </div>
                </Link>
            </div>
          </section>

          {/* 3. 홍보 롤링 배너 [기능 유지] */}
          <section aria-label="창업부스터 홍보 배너">
            <RollingBanner />
          </section>

          {/* 4. 프랜차이즈 실제 창업 성공 사례 [기능+디자인 통합] */}
          <section aria-labelledby="success-title">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
              <div>
                <h2 id="success-title" className="text-2xl md:text-3xl font-bold text-slate-900">
                  프랜차이즈 실제 창업 성공 사례
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  실제 데이터와 현장 스토리로 보는 브랜드별 창업 사례입니다
                </p>
              </div>
              <Link href="/cases" className="hidden sm:inline-flex items-center gap-1 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors">
                전체 사례 보기 <ChevronRightIcon className="w-4 h-4" />
              </Link>
            </div>

            {loading ? (
              <div className="py-32 text-center text-slate-400 bg-white rounded-2xl border border-slate-100">
                <span className="text-sm">데이터를 불러오는 중입니다... ⏳</span>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {franchises.map((item) => (
                  <Link 
                    href={`/franchise/brand/${item.id}`} 
                    key={item.id} 
                    className="group flex flex-col overflow-hidden rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1"
                  >
                    {/* 이미지 영역 */}
                    <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                      {item.image_url ? (
                          <img 
                            src={item.image_url} 
                            alt={item.brand_name} 
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" 
                          />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-slate-400 bg-slate-50">
                          <span className="text-xs">이미지 준비중</span>
                        </div>
                      )}
                      
                      {/* 창업년도 뱃지 (스크린샷 디자인 반영) */}
                      <div className="absolute bottom-3 right-3">
                          <span className="inline-flex items-center gap-1 rounded-md bg-black/70 backdrop-blur-sm px-2 py-1 text-[10px] font-bold text-white shadow-sm">
                            <CalendarDaysIcon className="w-3 h-3 text-yellow-400" />
                            {item.established_year || '2024'}년
                          </span>
                      </div>
                      
                      {/* 카테고리 뱃지 */}
                      <div className="absolute top-3 left-3">
                        <span className="inline-block rounded-md bg-white/95 px-2 py-1 text-[10px] font-extrabold text-slate-900 shadow-sm">
                          {item.category}
                        </span>
                      </div>
                    </div>

                    {/* 텍스트 내용 영역 */}
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="text-lg font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors">
                        {item.brand_name}
                      </h3>
                      
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between items-center pb-2 border-b border-slate-50">
                          <span className="text-xs text-slate-500 font-medium">평균 매출</span>
                          <span className="font-bold text-blue-600">
                            {item.average_sales ? `${(item.average_sales / 100000000).toFixed(1)}억` : '-'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-slate-500 font-medium">창업 비용</span>
                          <span className="font-bold text-slate-800">
                            {item.startup_cost ? `${(item.startup_cost / 10000).toLocaleString()}만` : '-'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* 모바일 더보기 버튼 */}
            <div className="flex justify-center pt-8 sm:hidden">
              <Link
                href="/cases"
                className="inline-flex w-full justify-center items-center rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
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