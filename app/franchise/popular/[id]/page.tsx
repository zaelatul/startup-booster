'use client';

import { useState, useEffect } from 'react';
import { InquiryBottomBar } from '@/components/brand-detail/InquiryPopup';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import RecentLogger from '@/components/common/RecentLogger';
import {
  ArrowLeftIcon,
  BuildingStorefrontIcon,
  ChartBarIcon,
  CheckCircleIcon,
  PhoneIcon,
  UserGroupIcon,
  EnvelopeIcon,
  MapPinIcon,
  BookOpenIcon,
  SparklesIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/solid';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LabelList } from 'recharts';
// ✅ 스크롤 애니메이션 훅
import { useScrollAnimation } from '@/lib/hooks/useScrollAnimation';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

// ✅ 애니메이션 래퍼 (여기서도 정의해서 사용)
function AnimatedSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const { domRef, isVisible } = useScrollAnimation();
  return (
    <div
      ref={domRef}
      className={`transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} ${className}`}
    >
      {children}
    </div>
  );
}

// ✅ 차트 전용 애니메이션 래퍼 (isVisible 상태 전달용)
function AnimatedChartSection({ children }: { children: (isVisible: boolean) => React.ReactNode }) {
  const { domRef, isVisible } = useScrollAnimation();
  return (
    <div
      ref={domRef}
      className={`transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
    >
      {children(isVisible)}
    </div>
  );
}

export default function PopularBrandDetail() {
  const params = useParams();
  const id = params?.id as string;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      setLoading(true);

      const { data: dbData, error } = await supabase.from('popular_franchises').select('*').eq('id', id).maybeSingle();

      if (dbData) {
        setData({
          id: dbData.id,
          name: dbData.name,
          category: dbData.category,
          slogan: dbData.slogan || '성공 창업의 확실한 파트너',
          establishedYear: dbData.established_year || new Date().getFullYear(),
          mainImage: dbData.main_image || '/no-image.png',
          avgSales: dbData.avg_sales || 0,
          netProfit: dbData.net_profit || 0,
          profitMargin: dbData.profit_margin || 0,
          startupCostTotal: dbData.startup_cost || 0,
          openRate: dbData.open_rate || 0,
          closeRate: dbData.close_rate || 0,
          concept: dbData.concept || '-',
          targetLayer: dbData.target_layer || '전 연령층',
          brandStoryTitle: `${dbData.name} 이야기`,
          brandStory: dbData.brand_story || '등록된 브랜드 스토리가 없습니다.',
          successPoints: dbData.success_points || [],
          storeImages: dbData.store_images || [],
          menuImages: dbData.menu_images || [],
          storesTotal: dbData.stores_total || 0,
          storeTrend: dbData.store_trend || [],
          hqName: dbData.hq_name || '-',
          hqPhone: dbData.hq_phone || '-',
          hqEmail: dbData.hq_email || '-',
          hqUrl: dbData.hq_url || '',
        });
      } else {
        console.error('❌ 데이터를 찾을 수 없습니다.', error);
      }
      setLoading(false);
    }
    fetchData();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-white bg-slate-900">로딩 중...</div>;
  if (!data) return <div className="p-20 text-center text-slate-500">브랜드를 찾을 수 없습니다.</div>;

  const fmt = (n: number) => {
    if (!n) return '-';
    if (n >= 10000) {
      return `${parseFloat((n / 10000).toFixed(2))}억`;
    }
    return `${n.toLocaleString()}만`;
  };

  const dividerStyle =
    "relative after:content-[''] after:absolute after:top-1/2 after:-translate-y-1/2 after:-right-[5px] md:after:-right-[9px] after:w-[1px] after:h-8 md:after:h-10 after:bg-slate-600/50";

  return (
    <>
      {data && (
        <RecentLogger
          id={`popular-${data.id}`}
          brand={data.name}
          branch={data.category}
          image={data.mainImage}
          url={`/franchise/popular/${data.id}`}
        />
      )}

      <main className="min-h-screen bg-slate-50 pb-40 font-sans text-slate-800">
        {/* 1. 히어로 섹션 */}
        <section className="relative pt-4 pb-8 md:pt-12 md:pb-20 px-4 overflow-hidden h-[200px] md:h-[350px] flex items-center">
          <div className="absolute inset-0 z-0">
            {data.mainImage && <Image src={data.mainImage} alt="bg" fill className="object-cover" priority quality={80} />}
            <div className="absolute inset-0 bg-black/40"></div>
          </div>

          <div className="max-w-4xl mx-auto relative z-10 w-full animate-fade-in-up">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-2 md:mb-6 text-xs md:text-sm transition-colors font-bold drop-shadow-md"
            >
              <ArrowLeftIcon className="w-3 h-3 md:w-4 md:h-4" /> 메인으로 돌아가기
            </Link>
            <div className="flex flex-row gap-4 md:gap-8 items-center md:items-start">
              <div className="w-16 h-16 md:w-32 md:h-32 bg-white rounded-2xl md:rounded-3xl p-1 shadow-2xl shrink-0 overflow-hidden relative border-2 border-white/20">
                <Image
                  src={data.mainImage}
                  alt={data.name}
                  fill
                  className="object-cover rounded-xl md:rounded-2xl"
                  sizes="(max-width: 768px) 100px, 200px"
                />
              </div>
              <div className="flex-1 drop-shadow-lg">
                <div className="flex items-center gap-2 mb-1 md:mb-2">
                  <span className="bg-indigo-600 text-white text-[9px] md:text-[10px] px-2 py-0.5 rounded font-bold shadow-sm border border-indigo-400/50">
                    {data.category}
                  </span>
                  <span className="text-white text-[10px] md:text-xs flex items-center gap-1 font-bold">
                    <BuildingStorefrontIcon className="w-3 h-3" /> {data.establishedYear}년
                  </span>
                </div>
                <h1 className="text-2xl md:text-5xl font-black text-white mb-1 md:mb-2 leading-tight">{data.name}</h1>
                <p className="text-sm md:text-xl text-white font-bold opacity-90 line-clamp-1 md:line-clamp-none">
                  "{data.slogan}"
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 2. 핵심 지표 */}
        <div className="max-w-4xl mx-auto px-4 -mt-10 md:-mt-20 relative z-20 animate-fade-in-up delay-100">
          <div className="bg-slate-800 rounded-2xl md:rounded-3xl shadow-2xl p-4 md:p-8 border border-slate-700">
            <div className="grid grid-cols-3 gap-y-6 md:gap-y-10 gap-x-2 md:gap-x-4 text-center">
              <div className={`px-1 ${dividerStyle}`}>
                <p className="text-[10px] md:text-xs text-slate-400 mb-1 font-bold">년 평균 매출</p>
                <p className="text-sm md:text-xl font-extrabold text-white">{fmt(data.avgSales)}</p>
              </div>
              <div className={`px-1 ${dividerStyle}`}>
                <p className="text-[10px] md:text-xs text-slate-400 mb-1 font-bold">월 평균 순수익</p>
                <p className="text-sm md:text-xl font-extrabold text-yellow-400">{fmt(data.netProfit)}</p>
              </div>
              <div className="px-1">
                <p className="text-[10px] md:text-xs text-slate-400 mb-1 font-bold">평균 수익률</p>
                <p className="text-sm md:text-xl font-extrabold text-emerald-400">{data.profitMargin}%</p>
              </div>
              <div className={`px-1 pt-2 md:pt-4 border-t border-slate-700/50 ${dividerStyle}`}>
                <p className="text-[10px] md:text-xs text-slate-400 mb-1 font-bold">창업 비용</p>
                <p className="text-sm md:text-xl font-extrabold text-slate-200">{fmt(data.startupCostTotal)}</p>
              </div>
              <div className={`px-1 pt-2 md:pt-4 border-t border-slate-700/50 ${dividerStyle}`}>
                <p className="text-[10px] md:text-xs text-slate-400 mb-1 font-bold">개점률</p>
                <p className="text-sm md:text-xl font-extrabold text-blue-400">{data.openRate}%</p>
              </div>
              <div className="px-1 pt-2 md:pt-4 border-t border-slate-700/50">
                <p className="text-[10px] md:text-xs text-slate-400 mb-1 font-bold">폐업률</p>
                <p className="text-sm md:text-xl font-extrabold text-rose-400">{data.closeRate}%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 mt-8 md:mt-12 space-y-8 md:space-y-12">
          {/* 3. 컨셉 & 타겟 */}
          <AnimatedSection className="grid grid-cols-2 gap-3 md:gap-4">
            <div className="bg-white p-3 md:p-6 rounded-xl md:rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-center h-full">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="p-1.5 md:p-3 bg-indigo-50 rounded-lg text-indigo-600 shrink-0">
                  <SparklesIcon className="w-4 h-4 md:w-6 md:h-6" />
                </div>
                <h4 className="text-[10px] md:text-sm font-bold text-slate-500">브랜드 컨셉</h4>
              </div>
              <p className="text-xs md:text-lg font-bold text-slate-900 leading-snug break-keep">{data.concept}</p>
            </div>
            <div className="bg-white p-3 md:p-6 rounded-xl md:rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-center h-full">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="p-1.5 md:p-3 bg-emerald-50 rounded-lg text-emerald-600 shrink-0">
                  <UserGroupIcon className="w-4 h-4 md:w-6 md:h-6" />
                </div>
                <h4 className="text-[10px] md:text-sm font-bold text-slate-500">주요 타겟층</h4>
              </div>
              <p className="text-xs md:text-lg font-bold text-slate-900 leading-snug break-keep">{data.targetLayer}</p>
            </div>
          </AnimatedSection>

          {/* 4. 브랜드 스토리 */}
          <AnimatedSection className="bg-white rounded-2xl md:rounded-3xl p-5 md:p-8 shadow-sm border border-slate-200">
            <h3 className="text-base md:text-xl font-bold text-slate-900 mb-3 md:mb-6 flex items-center gap-2">
              <BookOpenIcon className="w-5 h-5 md:w-6 md:h-6 text-indigo-600" /> 브랜드 스토리
            </h3>
            <div className="prose prose-slate max-w-none">
              <h4 className="text-sm md:text-lg font-bold text-slate-800 mb-2">{data.brandStoryTitle}</h4>
              <p className="text-xs md:text-base text-slate-600 leading-relaxed md:leading-8 whitespace-pre-wrap break-keep text-left">
                {data.brandStory}
              </p>
            </div>
          </AnimatedSection>

          {/* 5. 브랜드 경쟁력 */}
          <AnimatedSection>
            <h3 className="text-base md:text-xl font-bold text-slate-900 mb-3 md:mb-6 flex items-center gap-2">
              <CheckCircleIcon className="w-5 h-5 md:w-6 md:h-6 text-indigo-600" /> 브랜드 경쟁력
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
              {data.successPoints?.map((point: string, i: number) => (
                <div
                  key={i}
                  className="bg-white p-3 md:p-5 rounded-xl md:rounded-2xl shadow-sm border border-slate-200 flex items-start gap-3 h-full min-h-0"
                >
                  <span className="flex items-center justify-center w-5 h-5 md:w-6 md:h-6 rounded-full bg-indigo-100 text-indigo-600 text-[10px] md:text-xs font-bold shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-xs md:text-sm font-bold text-slate-700 break-words whitespace-pre-wrap">
                    {point}
                  </span>
                </div>
              ))}
            </div>
          </AnimatedSection>

          {/* 6. 매장 & 메뉴/상품 */}
          <AnimatedSection>
            <h3 className="text-base md:text-xl font-bold text-slate-900 mb-3 md:mb-6 flex items-center gap-2">
              <BuildingStorefrontIcon className="w-5 h-5 md:w-6 md:h-6 text-indigo-600" /> 매장 & 메뉴/상품
            </h3>
            <div className="flex flex-col gap-8 md:gap-12">
              <div className="flex flex-col gap-3 md:gap-4">
                <h4 className="text-xs md:text-sm font-bold text-slate-500">매장 인테리어</h4>
                <div className="grid grid-cols-2 gap-2 md:gap-4">
                  {data.storeImages.length > 0 ? (
                    data.storeImages.map((img: string, i: number) => (
                      <div
                        key={i}
                        className="relative h-32 md:h-64 rounded-lg md:rounded-xl overflow-hidden bg-slate-200 shadow-sm border border-slate-200"
                      >
                        <Image src={img} alt={`매장${i}`} fill className="object-cover" sizes="(max-width: 768px) 50vw, 50vw" />
                      </div>
                    ))
                  ) : (
                    <div className="h-32 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 text-xs">
                      이미지 없음
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-3 md:gap-4">
                <h4 className="text-xs md:text-sm font-bold text-slate-500">대표 메뉴/상품/기타</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
                  {data.menuImages.length > 0 ? (
                    data.menuImages.map((img: string, i: number) => (
                      <div
                        key={i}
                        className="relative aspect-square rounded-lg md:rounded-xl overflow-hidden bg-slate-200 shadow-sm border border-slate-200"
                      >
                        <Image src={img} alt={`메뉴${i}`} fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
                      </div>
                    ))
                  ) : (
                    <div className="h-32 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 text-xs">
                      이미지 없음
                    </div>
                  )}
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* 7. 가맹점 성장 추이 (차트 애니메이션 적용) */}
          <AnimatedChartSection>
            {(isVisible) => (
              <div className="bg-white p-5 md:p-8 rounded-2xl md:rounded-3xl shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-4 md:mb-6">
                  <h3 className="text-base md:text-xl font-bold text-slate-900 flex items-center gap-2">
                    <ChartBarIcon className="w-5 h-5 md:w-6 md:h-6 text-slate-700" /> 가맹점 추이
                  </h3>
                  <span className="bg-slate-100 text-slate-600 text-[10px] md:text-xs font-bold px-2 py-1 rounded-full">
                    현재 {data.storesTotal}개
                  </span>
                </div>
                <div className="h-48 md:h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    {/* ✅ key를 줘서 스크롤 감지 시 리마운트 */}
                    <BarChart
                      key={isVisible ? 'visible' : 'hidden'}
                      data={data.storeTrend}
                      margin={{ top: 20, right: 10, left: -20, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis dataKey="year" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                      <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '11px' }} />
                      <Bar dataKey="count" name="가맹점 수" fill="#22C55E" radius={[4, 4, 0, 0]} barSize={20} animationDuration={2000} animationEasing="ease-out">
                        <LabelList dataKey="count" position="top" fill="#64748b" fontSize={10} fontWeight="bold" />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </AnimatedChartSection>

          {/* 8. 가맹 본사 정보 */}
          <AnimatedSection className="bg-slate-100 rounded-2xl md:rounded-3xl p-5 md:p-8 mb-8">
            <h3 className="text-sm md:text-lg font-bold text-slate-900 mb-3 md:mb-4 text-center">가맹 본사 정보</h3>
            <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm">
              <div className="grid grid-cols-2 gap-y-6 gap-x-2 md:gap-6">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[10px] md:text-xs">
                    <UserGroupIcon className="w-3.5 h-3.5" /> 본사명
                  </div>
                  <p className="font-bold text-slate-700 text-xs md:text-base break-words">{data.hqName}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[10px] md:text-xs">
                    <PhoneIcon className="w-3.5 h-3.5" /> 대표번호
                  </div>
                  <p className="font-bold text-slate-700 text-xs md:text-base">{data.hqPhone}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[10px] md:text-xs">
                    <EnvelopeIcon className="w-3.5 h-3.5" /> 이메일
                  </div>
                  <p className="font-bold text-slate-700 text-xs md:text-base break-all">{data.hqEmail}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[10px] md:text-xs">
                    <GlobeAltIcon className="w-3.5 h-3.5" /> 홈페이지
                  </div>
                  {data.hqUrl ? (
                    <a
                      href={data.hqUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-indigo-600 underline text-xs md:text-base truncate block"
                    >
                      바로가기
                    </a>
                  ) : (
                    <p className="font-bold text-slate-700 text-xs md:text-base">-</p>
                  )}
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>

        {/* 9. 창업 상담 신청 */}
        <InquiryBottomBar
          brandId={`popular-${data.id}`}
          brandName={data.name}
          category="인기"
          buttonLabel={`${data.name} 창업 문의하기`}
        />
      </main>
    </>
  );
}
