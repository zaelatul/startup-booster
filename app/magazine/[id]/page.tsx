'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image'; 
import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { MAGAZINE_ARTICLES as DUMMY_ARTICLES } from '@/lib/magazine-data';
import { CalendarIcon, ClockIcon, UserCircleIcon, ChevronLeftIcon, ShareIcon, HomeIcon, UserGroupIcon, BanknotesIcon } from '@heroicons/react/24/solid';
import RollingBanner from '@/components/home/RollingBanner';

const TuiViewerWrapper = dynamic(() => import('@/components/TuiViewerWrapper'), { ssr: false });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';
const supabase = createClient(supabaseUrl, supabaseKey);

// --- [보강] 자동 계산 기능이 포함된 브랜드 비교표 컴포넌트 ---
function BrandComparison({ brandA, brandB }: { brandA: any, brandB: any }) {
  if (!brandA || !brandB) return null;

  // 창업비용 총액 계산기 (가맹비 + 교육비 + 보증금 + 기타 + 인테리어)
  const calculateTotalCost = (brand: any) => {
    const costs = brand.initial_costs || {};
    const baseSizeM2 = brand.base_size_m2 || 0;
    
    const joinFee = costs.join_fee || costs.joinFee || 0;
    const eduFee = costs.edu_fee || costs.eduFee || 0;
    const deposit = costs.deposit || 0;
    const other = costs.other || 0;
    const interiorPerPy = costs.interior || 0;

    // 인테리어 총액 = (기준면적 / 3.3) * 평당 비용
    const interiorTotal = Math.round((baseSizeM2 / 3.3) * interiorPerPy);
    return joinFee + eduFee + deposit + other + interiorTotal;
  };

  const fmtMoney = (val: number) => {
    if (!val || val === 0) return '정보없음';
    if (val >= 100000) return `${(val / 100000).toFixed(2)}억`;
    return `${Math.round(val / 10).toLocaleString()}만`;
  };

  const brandA_Cost = calculateTotalCost(brandA);
  const brandB_Cost = calculateTotalCost(brandB);

  return (
    <div className="my-10 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl animate-fadeIn">
      <div className="bg-slate-900 p-5 text-center text-white">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400 mb-1">Expert Comparison</p>
        <h4 className="text-xl font-black">라이벌 브랜드 데이터 매치</h4>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
        {[brandA, brandB].map((brand, idx) => {
          const cost = idx === 0 ? brandA_Cost : brandB_Cost;
          const revenue = brand.avg_revenue?.total || brand.avg_revenue || 0;
          const storeCount = brand.store_summary?.total || 0;
          const pyeong = Math.round((brand.base_size_m2 || 0) / 3.3);

          return (
            <div key={brand.id} className="p-8 text-center bg-white">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-50 p-3 border border-slate-100 shadow-inner">
                {brand.logo_url ? <img src={brand.logo_url} alt={brand.name} className="max-h-full max-w-full object-contain" /> : <span className="text-xs font-bold text-slate-300">LOGO</span>}
              </div>
              <h5 className="text-2xl font-black text-slate-800 mb-8">{brand.name}</h5>
              
              <div className="space-y-3">
                {/* 창업비용 - 자동 계산 적용 */}
                <div className="rounded-2xl bg-indigo-50 p-5 border border-indigo-100">
                  <p className="text-[10px] font-bold text-indigo-500 uppercase mb-1 flex justify-center items-center gap-1"><BanknotesIcon className="w-3 h-3"/> 예상 창업비용</p>
                  <p className="text-2xl font-black text-indigo-900">{fmtMoney(cost)}</p>
                </div>

                {/* 매출액 */}
                <div className="rounded-2xl bg-emerald-50 p-5 border border-emerald-100">
                  <p className="text-[10px] font-bold text-emerald-500 uppercase mb-1 flex justify-center items-center gap-1"><HomeIcon className="w-3 h-3"/> 연평균 매출액</p>
                  <p className="text-2xl font-black text-emerald-900">{fmtMoney(revenue)}</p>
                </div>

                {/* 추가 지표: 가맹점수 & 기준평수 */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                    <p className="text-[9px] font-bold text-slate-400 uppercase mb-1 flex justify-center items-center gap-1"><UserGroupIcon className="w-3 h-3"/> 가맹점 수</p>
                    <p className="text-sm font-bold text-slate-700">{storeCount}개</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                    <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">기준 평수</p>
                    <p className="text-sm font-bold text-slate-700">{pyeong}평</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="bg-slate-50 p-4 text-center border-t border-slate-100">
        <p className="text-[10px] font-bold text-slate-400">* 모든 데이터는 공정거래위원회 정보공개서 최신 데이터를 기반으로 자동 산출됩니다.</p>
      </div>
    </div>
  );
}

export default function MagazineDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [comparisonData, setComparisonData] = useState<{a: any, b: any} | null>(null);

  useEffect(() => {
    async function fetchArticle() {
      if (!id) return;
      setLoading(true);
      const { data: mag } = await supabase.from('magazines').select('*').eq('id', id).single();
      
      if (mag) {
        setArticle({ ...mag, date: new Date(mag.created_at).toLocaleDateString(), description: mag.subtitle });

        if (mag.compare_brand_a && mag.compare_brand_b) {
          const { data: brands } = await supabase.from('franchises').select('*').in('id', [mag.compare_brand_a, mag.compare_brand_b]);
          if (brands && brands.length === 2) {
            setComparisonData({
              a: brands.find(b => b.id === mag.compare_brand_a),
              b: brands.find(b => b.id === mag.compare_brand_b)
            });
          }
        }
      } else {
        setArticle(DUMMY_ARTICLES.find(a => a.id === id));
      }
      setLoading(false);
    }
    fetchArticle();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">데이터 분석 중...</div>;
  if (!article) return <div className="min-h-screen flex items-center justify-center"><p>존재하지 않는 리포트입니다.</p></div>;

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      <div className="max-w-6xl mx-auto px-4 mt-4"><RollingBanner location="magazine" /></div>
      
      <div className="relative w-full bg-slate-900 flex flex-col justify-end mt-4 overflow-hidden min-h-[220px]">
        {article.thumbnail_url && <Image src={article.thumbnail_url} alt="bg" fill className="object-cover opacity-40" priority />}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent"></div>
        <div className="w-full p-8 max-w-4xl mx-auto z-10 relative">
          <span className="inline-block px-3 py-1 rounded-full bg-indigo-600 text-white text-[10px] font-bold mb-4 shadow-lg border border-indigo-400/30 uppercase tracking-widest">{article.category}</span>
          <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4 drop-shadow-xl break-keep">{article.title}</h1>
          <div className="flex items-center gap-4 text-xs text-slate-300 font-medium">
            <span className="flex items-center gap-1"><UserCircleIcon className="w-4 h-4 text-indigo-400"/> {article.author}</span>
            <span className="flex items-center gap-1"><CalendarIcon className="w-4 h-4 opacity-70"/> {article.date}</span>
          </div>
        </div>
      </div>

      <article className="max-w-3xl mx-auto -mt-10 relative z-20 px-4">
        <div className="bg-white rounded-[2rem] shadow-2xl p-8 md:p-14 border border-slate-100">
          {comparisonData && <BrandComparison brandA={comparisonData.a} brandB={comparisonData.b} />}
          
          <div className="prose prose-lg max-w-none prose-headings:font-black prose-p:leading-relaxed prose-slate">
            <TuiViewerWrapper content={article.content || ''} />
          </div>

          <div className="mt-16 pt-8 border-t border-slate-100 flex justify-center">
            <button className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-indigo-600 transition-all"><ShareIcon className="w-5 h-5" /> 이 리포트 공유하기</button>
          </div>
        </div>
      </article>
    </main>
  );
}