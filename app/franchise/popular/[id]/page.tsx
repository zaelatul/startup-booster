'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { 
  ArrowLeftIcon, BuildingStorefrontIcon, 
  ChartBarIcon, CheckCircleIcon, 
  PhoneIcon, UserGroupIcon, EnvelopeIcon, MapPinIcon,
  BookOpenIcon, SparklesIcon, GlobeAltIcon, XMarkIcon
} from '@heroicons/react/24/solid';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LabelList } from 'recharts';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function PopularBrandDetail() {
  const params = useParams();
  const id = params?.id as string;
  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // [수정] 문의 폼 상태 관리
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [inquirySent, setInquirySent] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' });
  const [isAgreed, setIsAgreed] = useState(false);

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      setLoading(true);

      const { data: dbData, error } = await supabase
        .from('popular_franchises') 
        .select('*')
        .eq('id', id)
        .maybeSingle();

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
          hqUrl: dbData.hq_url || ''
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
    if (n >= 10000) return `${(n / 10000).toFixed(1)}억`;
    return `${n.toLocaleString()}만`;
  };

  // [수정] 문의 제출 핸들러 (실제 데이터 수집 로직)
  const handleSubmitInquiry = async () => {
    if (!formData.name || !formData.phone) {
        alert('성함과 연락처는 필수 입력입니다.');
        return;
    }
    if (!isAgreed) {
        alert('개인정보 제3자 제공 동의가 필요합니다.');
        return;
    }

    // TODO: 여기서 실제 Supabase DB ('inquiries' 테이블)에 insert 합니다.
    console.log("전송할 데이터:", { ...formData, brand: data.name, target_hq: data.hqName });

    // 성공 처리
    setInquirySent(true);
    setShowInquiryForm(false);
    
    // 폼 초기화
    setFormData({ name: '', phone: '', email: '' });
    setIsAgreed(false);

    alert(`[${data.name}] 본사로 상담 신청이 접수되었습니다.\n담당자가 확인 후 연락드릴 예정입니다.`);
    setTimeout(() => setInquirySent(false), 5000);
  };

  return (
    <>
      <main className="min-h-screen bg-slate-50 pb-28 font-sans text-slate-800">
        
        {/* 1. 히어로 섹션 */}
        <section className="relative bg-[#0F172A] pt-8 pb-16 md:pt-12 md:pb-32 px-4 overflow-hidden">
           <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
           <div className="absolute inset-0 z-0 opacity-30">
              {data.mainImage && <Image src={data.mainImage} alt="bg" fill className="object-cover" priority />}
           </div>
           <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/80 to-transparent z-0"></div>

           <div className="max-w-4xl mx-auto relative z-10">
              <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-4 md:mb-8 text-xs md:text-sm transition-colors">
                 <ArrowLeftIcon className="w-3 h-3 md:w-4 md:h-4" /> 메인으로 돌아가기
              </Link>
              <div className="flex flex-row gap-4 md:gap-8 items-center md:items-start">
                 <div className="w-16 h-16 md:w-32 md:h-32 bg-white rounded-2xl md:rounded-3xl p-1 shadow-2xl shrink-0 overflow-hidden relative">
                    <Image src={data.mainImage} alt={data.name} fill className="object-cover rounded-xl md:rounded-2xl" />
                 </div>
                 <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 md:mb-2">
                       <span className="bg-indigo-500 text-white text-[9px] md:text-[10px] px-1.5 py-0.5 rounded font-bold">{data.category}</span>
                       <span className="text-slate-400 text-[10px] md:text-xs flex items-center gap-1"><BuildingStorefrontIcon className="w-3 h-3"/> {data.establishedYear}년</span>
                    </div>
                    <h1 className="text-xl md:text-4xl font-extrabold text-white mb-1 md:mb-2">{data.name}</h1>
                    <p className="text-xs md:text-lg text-slate-300 font-medium opacity-90 line-clamp-1 md:line-clamp-none">"{data.slogan}"</p>
                 </div>
              </div>
           </div>
        </section>

        {/* 2. 핵심 지표 */}
        <div className="max-w-4xl mx-auto px-4 -mt-10 md:-mt-20 relative z-20">
           <div className="bg-slate-800 rounded-2xl md:rounded-3xl shadow-2xl p-4 md:p-8 border border-slate-700">
              <div className="grid grid-cols-3 gap-y-4 md:gap-y-8 gap-x-2 md:gap-x-4 text-center divide-x divide-slate-700/50 md:divide-none">
                 <div className="px-1">
                    <p className="text-[10px] md:text-xs text-slate-400 mb-0.5 font-bold">월 평균 매출</p>
                    <p className="text-sm md:text-xl font-extrabold text-white">{fmt(data.avgSales)}</p>
                 </div>
                 <div className="px-1">
                    <p className="text-[10px] md:text-xs text-slate-400 mb-0.5 font-bold">순수익</p>
                    <p className="text-sm md:text-xl font-extrabold text-yellow-400">{fmt(data.netProfit)}</p>
                 </div>
                 <div className="px-1 border-r-0">
                    <p className="text-[10px] md:text-xs text-slate-400 mb-0.5 font-bold">수익률</p>
                    <p className="text-sm md:text-xl font-extrabold text-emerald-400">{data.profitMargin}%</p>
                 </div>
                 
                 <div className="px-1 pt-2 md:pt-0 border-t border-slate-700/50 md:border-none">
                    <p className="text-[10px] md:text-xs text-slate-400 mb-0.5 font-bold">창업 비용</p>
                    <p className="text-sm md:text-xl font-extrabold text-slate-200">{fmt(data.startupCostTotal)}</p>
                 </div>
                 <div className="px-1 pt-2 md:pt-0 border-t border-slate-700/50 md:border-none">
                    <p className="text-[10px] md:text-xs text-slate-400 mb-0.5 font-bold">개점률</p>
                    <p className="text-sm md:text-xl font-extrabold text-blue-400">{data.openRate}%</p>
                 </div>
                 <div className="px-1 pt-2 md:pt-0 border-t border-slate-700/50 md:border-none border-r-0">
                    <p className="text-[10px] md:text-xs text-slate-400 mb-0.5 font-bold">폐업률</p>
                    <p className="text-sm md:text-xl font-extrabold text-rose-400">{data.closeRate}%</p>
                 </div>
              </div>
           </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 mt-8 md:mt-12 space-y-8 md:space-y-12">
           
           {/* 3. 컨셉 & 타겟 */}
           <section className="grid grid-cols-2 gap-3 md:gap-4">
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
           </section>

           {/* 4. 브랜드 스토리 */}
           <section className="bg-white rounded-2xl md:rounded-3xl p-5 md:p-8 shadow-sm border border-slate-200">
              <h3 className="text-base md:text-xl font-bold text-slate-900 mb-3 md:mb-6 flex items-center gap-2">
                 <BookOpenIcon className="w-5 h-5 md:w-6 md:h-6 text-indigo-600" /> 브랜드 스토리
              </h3>
              <div className="prose prose-slate max-w-none">
                 <h4 className="text-sm md:text-lg font-bold text-slate-800 mb-2">{data.brandStoryTitle}</h4>
                 <p className="text-xs md:text-base text-slate-600 leading-relaxed md:leading-8 whitespace-pre-wrap text-justify">
                    {data.brandStory}
                 </p>
              </div>
           </section>

           {/* 5. 브랜드 경쟁력 */}
           <section>
              <h3 className="text-base md:text-xl font-bold text-slate-900 mb-3 md:mb-6 flex items-center gap-2">
                 <CheckCircleIcon className="w-5 h-5 md:w-6 md:h-6 text-indigo-600" /> 브랜드 경쟁력
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                 {data.successPoints?.map((point: string, i: number) => (
                    <div key={i} className="bg-white p-3 md:p-5 rounded-xl md:rounded-2xl shadow-sm border border-slate-200 flex items-start gap-3 h-full min-h-0">
                       <span className="flex items-center justify-center w-5 h-5 md:w-6 md:h-6 rounded-full bg-indigo-100 text-indigo-600 text-[10px] md:text-xs font-bold shrink-0 mt-0.5">{i+1}</span>
                       <span className="text-xs md:text-sm font-bold text-slate-700 break-words whitespace-pre-wrap">{point}</span>
                    </div>
                 ))}
              </div>
           </section>

           {/* 6. 매장 & 메뉴/상품 */}
           <section>
              <h3 className="text-base md:text-xl font-bold text-slate-900 mb-3 md:mb-6 flex items-center gap-2">
                 <BuildingStorefrontIcon className="w-5 h-5 md:w-6 md:h-6 text-indigo-600" /> 매장 & 메뉴/상품
              </h3>
              <div className="flex flex-col gap-8 md:gap-12">
                 <div className="flex flex-col gap-3 md:gap-4">
                    <h4 className="text-xs md:text-sm font-bold text-slate-500">매장 인테리어</h4>
                    <div className="grid grid-cols-2 gap-2 md:gap-4">
                       {data.storeImages.length > 0 ? data.storeImages.map((img: string, i: number) => (
                          <div key={i} className="relative h-32 md:h-64 rounded-lg md:rounded-xl overflow-hidden bg-slate-200 shadow-sm border border-slate-200">
                             <Image src={img} alt={`매장${i}`} fill className="object-cover" />
                          </div>
                       )) : <div className="h-32 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 text-xs">이미지 없음</div>}
                    </div>
                 </div>
                 <div className="flex flex-col gap-3 md:gap-4">
                    <h4 className="text-xs md:text-sm font-bold text-slate-500">대표 메뉴/상품/기타</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
                       {data.menuImages.length > 0 ? data.menuImages.map((img: string, i: number) => (
                          <div key={i} className="relative h-32 md:h-48 rounded-lg md:rounded-xl overflow-hidden bg-slate-200 shadow-sm border border-slate-200">
                             <Image src={img} alt={`메뉴${i}`} fill className="object-cover" />
                          </div>
                       )) : <div className="h-32 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 text-xs">이미지 없음</div>}
                    </div>
                 </div>
              </div>
           </section>

           {/* 7. 가맹점 성장 추이 */}
           <section className="bg-white p-5 md:p-8 rounded-2xl md:rounded-3xl shadow-sm border border-slate-200">
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
                    <BarChart data={data.storeTrend} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                       <XAxis dataKey="year" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                       <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                       <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '11px' }} />
                       <Bar dataKey="count" name="가맹점 수" fill="#1E293B" radius={[4, 4, 0, 0]} barSize={20}>
                          <LabelList dataKey="count" position="top" fill="#64748b" fontSize={10} fontWeight="bold" />
                       </Bar>
                    </BarChart>
                 </ResponsiveContainer>
              </div>
           </section>

           {/* 8. 가맹 본사 정보 */}
           <section className="bg-slate-100 rounded-2xl md:rounded-3xl p-5 md:p-8 mb-8">
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
                          <a href={data.hqUrl} target="_blank" rel="noopener noreferrer" className="font-bold text-indigo-600 underline text-xs md:text-base truncate block">바로가기</a>
                       ) : <p className="font-bold text-slate-700 text-xs md:text-base">-</p>}
                    </div>
                 </div>
              </div>
           </section>

        </div>

        {/* 9. 창업 상담 신청 (띠배너 Sticky) */}
        <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 p-3 md:p-6 z-[999] shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
           <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
              <div className="hidden md:block">
                 <p className="text-xs text-slate-500">본사 담당자에게 직접 전달됩니다.</p>
                 <p className="text-sm font-bold text-slate-900">지금 문의하면 <span className="text-indigo-600">우선 상담 혜택!</span></p>
              </div>
              
              {inquirySent ? (
                 <button disabled className="w-full md:w-auto flex-1 bg-emerald-500 text-white px-4 py-3 md:px-8 md:py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 cursor-default text-sm">
                    <CheckCircleIcon className="w-5 h-5" /> 신청 완료
                 </button>
              ) : (
                 <button 
                    onClick={() => setShowInquiryForm(true)} // [수정] 바로 전송 안 하고 폼 열기
                    className="w-full md:w-auto flex-1 bg-[#1E293B] hover:bg-slate-800 text-white px-4 py-3 md:px-8 md:py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg text-sm"
                 >
                    <EnvelopeIcon className="w-4 h-4 md:w-5 md:h-5" />
                    {data.name} 창업 문의하기
                 </button>
              )}
           </div>
        </div>

      </main>

      {/* [추가] 개인정보 수집 및 상담 신청 폼 (Modal) */}
      {showInquiryForm && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-lg text-slate-900">가맹 상담 신청</h3>
              <button onClick={() => setShowInquiryForm(false)}><XMarkIcon className="w-6 h-6 text-slate-400 hover:text-slate-600"/></button>
            </div>
            
            <div className="p-6 space-y-4">
              <p className="text-sm text-slate-600 mb-2">
                <span className="font-bold text-indigo-600">{data.name}</span> 본사 담당자에게<br/>
                고객님의 연락처가 안전하게 전달됩니다.
              </p>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">성함</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                  placeholder="홍길동"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">연락처</label>
                <input 
                  type="tel" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                  placeholder="010-1234-5678"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">이메일 (선택)</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                  placeholder="example@email.com"
                />
              </div>

              {/* 제3자 정보 제공 동의 */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 mt-2">
                <div className="flex items-start gap-2">
                  <input 
                    type="checkbox" 
                    id="agree" 
                    checked={isAgreed} 
                    onChange={(e) => setIsAgreed(e.target.checked)}
                    className="mt-0.5"
                  />
                  <label htmlFor="agree" className="text-xs text-slate-500 leading-snug cursor-pointer">
                    <span className="font-bold text-slate-700">[필수] 개인정보 제3자 제공 동의</span><br/>
                    상담을 위해 입력하신 정보를 <span className="underline">{data.name} 본사</span>에 제공하는 것에 동의합니다.
                  </label>
                </div>
              </div>

              <button 
                onClick={handleSubmitInquiry}
                className={`w-full py-3.5 rounded-xl font-bold text-white transition-all mt-2 shadow-lg
                  ${isAgreed ? 'bg-indigo-600 hover:bg-indigo-500 cursor-pointer' : 'bg-slate-300 cursor-not-allowed'}
                `}
              >
                상담 신청하기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}