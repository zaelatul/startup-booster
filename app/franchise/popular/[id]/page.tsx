'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { POPULAR_FRANCHISES } from '@/lib/reco';
import { 
  ArrowLeftIcon, BuildingStorefrontIcon, 
  CurrencyDollarIcon, ChartBarIcon, CheckCircleIcon, 
  PhoneIcon, UserGroupIcon, EnvelopeIcon, MapPinIcon,
  BookOpenIcon, SparklesIcon, UserIcon, CheckBadgeIcon
} from '@heroicons/react/24/solid';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LabelList } from 'recharts';

export default function PopularBrandDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const data = POPULAR_FRANCHISES.find((b) => b.id === id);
  const [inquirySent, setInquirySent] = useState(false);

  if (!data) return <div className="p-20 text-center">브랜드를 찾을 수 없습니다.</div>;

  const fmt = (n: number) => {
    if (n >= 100000000) return `${(n / 100000000).toFixed(1)}억`;
    return `${(n / 10000).toLocaleString()}만`;
  };

  const handleInquiry = () => {
    setInquirySent(true);
    setTimeout(() => setInquirySent(false), 4000);
  };

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      
      {/* 1. 히어로 섹션 */}
      <section className="relative bg-[#0F172A] pt-12 pb-32 px-4 overflow-hidden">
         <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
         <div className="max-w-4xl mx-auto relative z-10">
            <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 text-sm transition-colors">
               <ArrowLeftIcon className="w-4 h-4" /> 메인으로 돌아가기
            </Link>
            <div className="flex flex-col md:flex-row gap-8 items-start">
               <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-3xl p-1 shadow-2xl shrink-0 overflow-hidden">
                  <Image src={data.mainImage} alt={data.name} width={128} height={128} className="w-full h-full object-cover rounded-2xl" />
               </div>
               <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                     <span className="bg-indigo-500 text-white text-[10px] px-2 py-0.5 rounded font-bold">{data.category}</span>
                     <span className="text-slate-400 text-xs flex items-center gap-1"><BuildingStorefrontIcon className="w-3 h-3"/> 설립: {data.establishedYear}년</span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">{data.name}</h1>
                  <p className="text-lg text-slate-300 font-medium opacity-90">"{data.slogan}"</p>
               </div>
            </div>
         </div>
      </section>

      {/* 2. 핵심 지표 (6종) */}
      <div className="max-w-4xl mx-auto px-4 -mt-20 relative z-20">
         <div className="bg-slate-800 rounded-3xl shadow-2xl p-6 md:p-8 border border-slate-700">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-4 text-center">
               <div className="border-r border-slate-700">
                  <p className="text-xs text-slate-400 mb-1 font-bold">월 평균 매출</p>
                  <p className="text-xl font-extrabold text-white">{fmt(data.avgSales)}</p>
               </div>
               <div className="border-r border-slate-700">
                  <p className="text-xs text-slate-400 mb-1 font-bold">순수익 (예상)</p>
                  <p className="text-xl font-extrabold text-yellow-400">{fmt(data.netProfit)}</p>
               </div>
               <div className="md:border-none border-r border-slate-700">
                  <p className="text-xs text-slate-400 mb-1 font-bold">수익률</p>
                  <p className="text-xl font-extrabold text-emerald-400">{data.profitMargin}%</p>
               </div>
               <div className="border-t border-slate-700 pt-6 border-r border-slate-700 md:border-none md:pt-0">
                  <p className="text-xs text-slate-400 mb-1 font-bold">창업 비용</p>
                  <p className="text-xl font-extrabold text-slate-200">{fmt(data.startupCostTotal)}</p>
               </div>
               <div className="border-t border-slate-700 pt-6 border-r border-slate-700">
                  <p className="text-xs text-slate-400 mb-1 font-bold">신규 개점률</p>
                  <p className="text-xl font-extrabold text-blue-400">{data.openRate}%</p>
               </div>
               <div className="border-t border-slate-700 pt-6">
                  <p className="text-xs text-slate-400 mb-1 font-bold">폐업률</p>
                  <p className="text-xl font-extrabold text-rose-400">{data.closeRate}%</p>
               </div>
            </div>
         </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-12 space-y-12">
         
         {/* 3. [신규] 컨셉 & 타겟 (카드 섹션) */}
         <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-start gap-4">
               <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600 shrink-0">
                  <SparklesIcon className="w-6 h-6" />
               </div>
               <div>
                  <h4 className="text-sm font-bold text-slate-500 mb-1">브랜드 컨셉</h4>
                  <p className="text-lg font-bold text-slate-900 leading-tight">{data.concept || '차별화된 가치를 제공하는 브랜드'}</p>
               </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-start gap-4">
               <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600 shrink-0">
                  <UserGroupIcon className="w-6 h-6" />
               </div>
               <div>
                  <h4 className="text-sm font-bold text-slate-500 mb-1">주요 타겟층</h4>
                  <p className="text-lg font-bold text-slate-900 leading-tight">{data.targetLayer || '전 연령층에게 사랑받는 브랜드'}</p>
               </div>
            </div>
         </section>

         {/* 4. 브랜드 스토리 */}
         <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
               <BookOpenIcon className="w-6 h-6 text-indigo-600" /> 브랜드 스토리
            </h3>
            <div className="prose prose-slate max-w-none">
               <h4 className="text-lg font-bold text-slate-800 mb-3">{data.brandStoryTitle}</h4>
               <p className="text-slate-600 leading-8 whitespace-pre-wrap">{data.brandStory}</p>
            </div>
         </section>

         {/* 5. 브랜드 경쟁력 */}
         <section>
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
               <CheckCircleIcon className="w-6 h-6 text-indigo-600" /> 브랜드 경쟁력
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               {data.successPoints?.map((point: string, i: number) => (
                  <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-3">
                     <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold">{i+1}</span>
                     <span className="text-sm font-bold text-slate-700">{point}</span>
                  </div>
               ))}
            </div>
         </section>

         {/* 6. 매장 & 메뉴 미리보기 */}
         <section>
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
               <BuildingStorefrontIcon className="w-6 h-6 text-indigo-600" /> 매장 & 메뉴 미리보기
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <div className="flex flex-col gap-4">
                  <h4 className="text-sm font-bold text-slate-500">매장 인테리어</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                     {data.storeImages?.map((img: string, i: number) => (
                        <div key={i} className="relative h-56 rounded-xl overflow-hidden bg-slate-200 group shadow-sm border border-slate-200">
                           <Image src={img} alt={`매장${i}`} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                           <span className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded backdrop-blur-sm">Interior {i+1}</span>
                        </div>
                     ))}
                  </div>
               </div>
               <div className="flex flex-col gap-4">
                  <h4 className="text-sm font-bold text-slate-500">대표 메뉴</h4>
                  <div className="grid grid-cols-2 gap-4">
                     {data.menuImages?.map((img: string, i: number) => (
                        <div key={i} className="relative h-40 sm:h-56 rounded-xl overflow-hidden bg-slate-200 group shadow-sm border border-slate-200">
                           <Image src={img} alt={`메뉴${i}`} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                           <span className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded backdrop-blur-sm">Menu {i+1}</span>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </section>

         {/* 7. 가맹점 성장 추이 (차트) */}
         <section className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-6">
               <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <ChartBarIcon className="w-6 h-6 text-slate-700" /> 가맹점 성장 추이
               </h3>
               <span className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1 rounded-full">
                  현재 {data.storesTotal}개
               </span>
            </div>
            <div className="h-72 w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.storeTrend} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                     <XAxis dataKey="year" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                     <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                     <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                     <Bar dataKey="count" name="가맹점 수" fill="#1E293B" radius={[6, 6, 0, 0]} barSize={40}>
                        <LabelList dataKey="count" position="top" fill="#64748b" fontSize={12} fontWeight="bold" />
                     </Bar>
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </section>

         {/* 8. 가맹 본사 정보 */}
         <section className="bg-slate-100 rounded-3xl p-8">
            <h3 className="text-lg font-bold text-slate-900 mb-4 text-center">가맹 본사 정보</h3>
            <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                     <div className="p-2 bg-slate-100 rounded-lg"><UserGroupIcon className="w-5 h-5 text-slate-500" /></div>
                     <div><p className="text-xs text-slate-400">본사명</p><p className="font-bold text-slate-700">{data.hqName}</p></div>
                  </div>
                  <div className="flex items-center gap-3">
                     <div className="p-2 bg-slate-100 rounded-lg"><PhoneIcon className="w-5 h-5 text-slate-500" /></div>
                     <div><p className="text-xs text-slate-400">대표번호</p><p className="font-bold text-slate-700">{data.hqPhone}</p></div>
                  </div>
               </div>
               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center gap-3">
                     <div className="p-2 bg-slate-100 rounded-lg"><EnvelopeIcon className="w-5 h-5 text-slate-500" /></div>
                     <div><p className="text-xs text-slate-400">이메일</p><p className="font-bold text-slate-700">{data.hqEmail || '-'}</p></div>
                  </div>
                  <div className="flex items-center gap-3">
                     <div className="p-2 bg-slate-100 rounded-lg"><MapPinIcon className="w-5 h-5 text-slate-500" /></div>
                     <div><p className="text-xs text-slate-400">주소</p><p className="font-bold text-slate-700 text-sm">{data.hqAddress}</p></div>
                  </div>
               </div>
            </div>
         </section>

         {/* 9. [수정됨] 창업 상담 신청 (고정 버튼) */}
         <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 p-4 md:p-6 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
            <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
               <div className="hidden md:block">
                  <p className="text-xs text-slate-500">본사 담당자에게 직접 전달됩니다.</p>
                  <p className="text-sm font-bold text-slate-900">지금 문의하면 <span className="text-indigo-600">우선 상담 혜택!</span></p>
               </div>
               
               {inquirySent ? (
                  <button disabled className="w-full md:w-auto flex-1 bg-emerald-500 text-white px-8 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 cursor-default">
                     <CheckCircleIcon className="w-5 h-5" /> 신청이 접수되었습니다
                  </button>
               ) : (
                  <button 
                     onClick={handleInquiry}
                     className="w-full md:w-auto flex-1 bg-[#1E293B] hover:bg-slate-800 text-white px-8 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg"
                  >
                     <EnvelopeIcon className="w-5 h-5" />
                     창업 상담 신청하기
                  </button>
               )}
            </div>
         </div>

      </div>
    </main>
  );
}