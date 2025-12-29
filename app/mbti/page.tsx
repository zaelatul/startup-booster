'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { QUESTIONS, calculateMbti, MbtiResult, MBTI_BANNERS as DUMMY_BANNERS } from '@/lib/mbti-data';
import { CheckCircleIcon, ArrowPathIcon, SparklesIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

// [추가] Supabase 연결
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function MbtiPage() {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [result, setResult] = useState<MbtiResult | null>(null);
  const [banners, setBanners] = useState<any[]>([]); // [NEW] 배너 상태
  const resultRef = useRef<HTMLDivElement>(null);

  // [추가] 배너 데이터 Fetching
  useEffect(() => {
    async function fetchBanners() {
      const { data } = await supabase
        .from('banners')
        .select('*')
        .eq('location', 'mbti') // MBTI 전용 배너
        .eq('is_active', true)
        .order('sort_order');
      
      if (data && data.length > 0) {
        setBanners(data);
      } else {
        // 데이터가 없으면 기존 더미(mbti-data) 사용 (구조 맞춤)
        setBanners(DUMMY_BANNERS.map(b => ({ ...b, image_url: b.imageUrl }))); 
      }
    }
    fetchBanners();
  }, []);

  const handleSelect = (qId: number, option: 'A' | 'B') => {
    setAnswers((prev) => ({ ...prev, [qId]: option }));
  };

  const handleShowResult = () => {
    if (Object.keys(answers).length < QUESTIONS.length) {
      alert('모든 질문에 답변해 주세요!');
      return;
    }
    const res = calculateMbti(answers);
    setResult(res);
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const handleReset = () => {
    setAnswers({});
    setResult(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const progress = Math.round((Object.keys(answers).length / QUESTIONS.length) * 100);

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      <div className="mx-auto max-w-3xl px-4 py-8 md:px-6">
        
        {/* 1. 배너 (실제 DB 연동) */}
        <section className="relative overflow-hidden rounded-3xl shadow-xl bg-[#1E293B] mb-10">
          <Swiper 
            modules={[Autoplay, Pagination]} 
            autoplay={{ delay: 4000 }} 
            pagination={{ clickable: true }} 
            loop={banners.length > 1} 
            // [수정] 높이: 모바일 h-40 (40% 축소), PC h-64 유지
            className="h-40 md:h-64"
          >
            {banners.map((banner) => (
              <SwiperSlide key={banner.id}>
                <div className="relative h-full w-full flex flex-col justify-center p-6 md:p-12">
                  <div className="absolute inset-0 opacity-40 bg-cover bg-center" style={{ backgroundImage: `url(${banner.image_url || banner.imageUrl})` }} />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A] to-transparent" />
                  <div className="relative z-10">
                    <span className="inline-block px-2 py-0.5 md:px-3 md:py-1 rounded-full bg-indigo-600 text-[9px] md:text-[10px] font-bold text-white mb-2 md:mb-3 shadow-sm">MBTI TEST</span>
                    {/* [수정] 폰트 크기 최적화 */}
                    <h2 className="text-lg md:text-3xl font-extrabold text-white mb-1 md:mb-2 leading-tight">{banner.title}</h2>
                    <p className="text-xs md:text-sm text-slate-300 opacity-90 line-clamp-1 md:line-clamp-none">{banner.subtitle}</p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>

        {/* 2. 진행률 */}
        <div className="sticky top-[70px] z-30 bg-white/90 backdrop-blur-md py-3 px-4 rounded-xl border border-slate-200 shadow-sm mb-8 transition-all">
           <div className="flex justify-between text-xs font-bold text-slate-500 mb-1.5">
              <span>진행률</span>
              <span className="text-indigo-600">{progress}%</span>
           </div>
           <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
           </div>
        </div>

        {/* 3. 질문 리스트 */}
        <div className="space-y-4 md:space-y-6">
          {QUESTIONS.map((q, idx) => (
            <div key={q.id} className={`transition-all duration-500 ${idx > 0 && !answers[QUESTIONS[idx-1].id] ? 'opacity-40 blur-[1px] pointer-events-none' : 'opacity-100'}`}>
              <div className="bg-white rounded-3xl p-5 md:p-8 shadow-sm border border-slate-100">
                {/* [수정] 질문 텍스트 크기 30% 축소 (text-sm), 볼드체 유지, PC는 text-lg */}
                <h3 className="text-sm md:text-lg font-bold text-slate-800 mb-4 md:mb-6 flex gap-2.5 md:gap-3 items-start md:items-center">
                   <span className="flex-shrink-0 w-6 h-6 md:w-7 md:h-7 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 text-xs md:text-sm font-extrabold mt-0.5 md:mt-0">{q.id}</span>
                   <span className="leading-snug">{q.text}</span>
                </h3>
                <div className="grid gap-2.5 md:gap-3">
                  {['A', 'B'].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleSelect(q.id, opt as 'A' | 'B')}
                      className={`relative p-3 md:p-4 rounded-xl text-left text-xs md:text-sm font-medium transition-all duration-200 border-2 active:scale-95 ${
                        answers[q.id] === opt
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-900 ring-2 ring-indigo-100 ring-offset-1 z-10'
                          : 'border-slate-100 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                      }`}
                    >
                      {opt === 'A' ? q.optionA : q.optionB}
                      {answers[q.id] === opt && <CheckCircleIcon className="absolute top-1/2 -translate-y-1/2 right-3 md:right-4 w-4 h-4 md:w-5 md:h-5 text-indigo-600" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 4. 결과 보기 버튼 */}
        <div className="mt-8 md:mt-12 text-center">
           {!result ? (
              <button 
                 onClick={handleShowResult}
                 disabled={Object.keys(answers).length < QUESTIONS.length}
                 className={`w-full md:w-auto px-8 md:px-12 py-3.5 md:py-4 rounded-full text-base md:text-lg font-bold text-white shadow-lg transition-all transform ${
                   Object.keys(answers).length < QUESTIONS.length ? 'bg-slate-300 cursor-not-allowed' : 'bg-[#1E293B] hover:bg-slate-800 hover:scale-105 hover:shadow-xl'
                 }`}
              >
                 결과 분석하기
              </button>
           ) : (
              <button onClick={handleReset} className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-white border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all text-sm md:text-base">
                 <ArrowPathIcon className="w-4 h-4 md:w-5 md:h-5" /> 다시 테스트하기
              </button>
           )}
        </div>

        {/* 5. 결과 섹션 */}
        {result && (
           <section ref={resultRef} className="mt-12 animate-fade-in-up">
              <div className="bg-gradient-to-br from-indigo-600 to-purple-800 rounded-3xl p-1 shadow-2xl">
                 <div className="bg-white rounded-[20px] p-8 md:p-12 text-center">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold mb-6 border border-indigo-100">
                       <SparklesIcon className="w-3 h-3" /> 나의 창업 DNA
                    </span>
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-2 tracking-tighter">{result.type}</h2>
                    <h3 className="text-lg md:text-xl font-bold text-slate-600 mb-8">"{result.title}"</h3>
                    
                    <div className="w-full h-px bg-slate-100 my-8" />
                    
                    <p className="text-slate-700 leading-relaxed mb-10 text-xs md:text-base max-w-lg mx-auto break-keep">
                       {result.description}
                    </p>

                    <div className="grid gap-4 md:grid-cols-2 text-left bg-slate-50 rounded-2xl p-6">
                       <div>
                          <h4 className="text-xs font-bold text-slate-400 mb-3 uppercase">키워드</h4>
                          <div className="flex flex-wrap gap-2">
                             {result.tags.map(tag => (
                                <span key={tag} className="px-2.5 py-1 bg-white border border-slate-200 rounded-md text-xs font-bold text-slate-600">{tag}</span>
                             ))}
                          </div>
                       </div>
                       <div>
                          <h4 className="text-xs font-bold text-slate-400 mb-3 uppercase">추천 업종</h4>
                          <ul className="space-y-2">
                             {result.recommend.map(rec => (
                                <li key={rec} className="flex items-center gap-2 text-xs md:text-sm font-bold text-slate-800">
                                   <CheckCircleIcon className="w-4 h-4 text-emerald-500" /> {rec}
                                </li>
                             ))}
                          </ul>
                       </div>
                    </div>

                    <div className="mt-10">
                       <Link href="/franchise/explore" className="block w-full py-4 bg-[#1E293B] text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg flex items-center justify-center gap-2 text-sm md:text-base">
                          나에게 맞는 브랜드 찾으러 가기 <ChevronRightIcon className="w-4 h-4" />
                       </Link>
                    </div>
                 </div>
              </div>
           </section>
        )}

      </div>
    </main>
  );
}