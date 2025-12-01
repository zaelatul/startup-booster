'use client';

import { use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CASES, CaseItem } from '@/lib/cases';
import { 
  ArrowLeftIcon, MapPinIcon, BuildingStorefrontIcon, 
  LightBulbIcon, ChatBubbleBottomCenterTextIcon, CurrencyDollarIcon
} from '@heroicons/react/24/solid';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

const GRADE_INFO: any = {
  'S': { label: 'S급 중심상권', desc: '유동인구가 폭발적인 번화가/역세권 (임대료 최상)' },
  'A': { label: 'A급 오피스/복합', desc: '직장인과 거주민이 섞인 안정적 상권 (유동 풍부)' },
  'B': { label: 'B급 주거/지역', desc: '아파트 단지 등 배후 수요가 탄탄한 실속 상권' },
};

const COLORS = ['#3B82F6', '#F97316'];

export default function CaseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  // [핵심 수정] ID 찾는 로직 강화!
  // 1. 정확한 ID로 찾기 (목록에서 클릭 시)
  let data = CASES.find((c) => c.id === id);

  // 2. 없으면 '-숫자' 떼고 원본 ID로 찾기 (메인에서 클릭 시 등)
  if (!data) {
    const originalId = id.replace(/-\d+$/, ''); 
    data = CASES.find((c) => c.id === originalId || c.id.startsWith(originalId));
  }

  // 3. 그래도 없으면 첫 번째 데이터라도 보여주기 (방어 코드)
  // (실제 운영 시에는 이 부분 빼도 됨, 지금은 빈 화면 방지용)
  if (!data && CASES.length > 0) {
     data = CASES[0];
  }

  if (!data) return <div className="p-20 text-center">데이터를 찾을 수 없습니다.</div>;

  const otherCases = CASES.filter(c => c.id !== data!.id).slice(0, 3);
  const grade = GRADE_INFO[data.areaGrade] || GRADE_INFO['B'];

  const salesData = [
    { name: '홀 매출', value: data.salesRatio?.hall || 0 },
    { name: '배달/포장', value: data.salesRatio?.delivery || 0 },
  ];

  // 이미지 안전장치
  const storeImages = data.storeImages && data.storeImages.length > 0 ? data.storeImages : [];
  const menuImages = data.menuImages && data.menuImages.length > 0 ? data.menuImages : [];

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      
      {/* 1. 히어로 배너 */}
      <section className="relative h-[500px] w-full bg-[#0F172A]">
        {data.mainImage ? (
          <Image 
            src={data.mainImage} 
            alt={data.brand} 
            fill 
            className="object-cover opacity-40" 
            priority
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 bg-slate-800 opacity-40"></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/40 to-transparent"></div>
        
        <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-between p-6 md:p-10 max-w-6xl mx-auto">
          <Link href="/cases" className="w-fit flex items-center gap-2 text-white/80 hover:text-white bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium transition-all hover:bg-white/20">
            <ArrowLeftIcon className="w-4 h-4" /> 목록으로
          </Link>
          
          <div className="animate-fade-in-up pb-8">
            <div className="flex flex-wrap gap-2 mb-4">
              {data.tags?.map((tag, idx) => (
                <span key={idx} className="px-3 py-1 bg-indigo-500 text-white text-xs font-bold rounded-full shadow-lg border border-indigo-400/30">
                  #{tag}
                </span>
              ))}
            </div>
            
            <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-2 drop-shadow-xl">
              {data.brand} {data.branch}
            </h1>
            <p className="text-lg text-slate-300 font-medium flex items-center gap-2 mb-8">
              <MapPinIcon className="w-5 h-5 text-slate-400" /> {data.area}
            </p>
            
            <div className="inline-flex flex-col sm:flex-row bg-[#1E293B]/90 backdrop-blur-md border border-slate-600 rounded-3xl overflow-hidden shadow-2xl">
               <div className="p-6 sm:p-8 min-w-[200px] border-b sm:border-b-0 sm:border-r border-slate-600">
                  <p className="text-sm text-slate-400 font-bold mb-2">월 평균 매출</p>
                  <p className="text-3xl sm:text-4xl font-black text-white tracking-tight">{data.monthlySales}</p>
               </div>
               <div className="p-6 sm:p-8 min-w-[200px] bg-indigo-900/30">
                  <p className="text-sm text-yellow-400 font-bold mb-2 flex items-center gap-1">
                    <CurrencyDollarIcon className="w-4 h-4"/> 월 순이익
                  </p>
                  <p className="text-3xl sm:text-4xl font-black text-yellow-400 tracking-tight">{data.netProfit}</p>
                  <p className="text-xs text-indigo-300 mt-2 font-medium">수익률 {data.profitMargin} 달성</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 space-y-12 mt-12">
        
        {/* 2. 매장 상세 분석 (메탈 그레이 적용 완료) */}
        <section className="bg-[#1E293B] rounded-3xl p-6 md:p-8 shadow-2xl border border-slate-700">
           <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <BuildingStorefrontIcon className="w-6 h-6 text-indigo-400" /> 매장 상세 분석
           </h2>
           
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* 왼쪽: 이미지 & 스펙 */}
              <div className="space-y-4">
                 <div className="grid grid-cols-2 gap-3">
                    {storeImages.length > 0 ? (
                      storeImages.slice(0, 1).map((img, i) => (
                        <div key={i} className="relative h-40 rounded-xl overflow-hidden bg-slate-800 group border border-slate-600">
                           <Image src={img} alt="매장" fill className="object-cover" />
                           <span className="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] px-2 py-1 rounded backdrop-blur-sm">매장 전경</span>
                        </div>
                      ))
                    ) : (
                      <div className="h-40 rounded-xl bg-slate-800 flex items-center justify-center text-slate-500 text-xs">이미지 없음</div>
                    )}

                    {menuImages.length > 0 ? (
                      menuImages.slice(0, 1).map((img, i) => (
                        <div key={i} className="relative h-40 rounded-xl overflow-hidden bg-slate-800 group border border-slate-600">
                           <Image src={img} alt="메뉴" fill className="object-cover" />
                           <span className="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] px-2 py-1 rounded backdrop-blur-sm">대표 메뉴</span>
                        </div>
                      ))
                    ) : (
                      <div className="h-40 rounded-xl bg-slate-800 flex items-center justify-center text-slate-500 text-xs">이미지 없음</div>
                    )}
                 </div>
                 
                 <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700">
                    <div className="flex justify-between items-start mb-2">
                       <span className="text-xs font-bold text-slate-400">창업 시기</span>
                       <span className="text-sm font-bold text-white">{data.startupYear}년</span>
                    </div>
                    <div className="flex justify-between items-start mb-1">
                       <span className="text-xs font-bold text-slate-400">상권 등급</span>
                       <span className={`text-sm font-extrabold px-2 py-0.5 rounded ${data.areaGrade === 'S' ? 'bg-rose-900/50 text-rose-300' : data.areaGrade === 'A' ? 'bg-indigo-900/50 text-indigo-300' : 'bg-emerald-900/50 text-emerald-300'}`}>
                          {grade.label}
                       </span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-2 bg-slate-700/50 p-2 rounded border border-slate-600 leading-relaxed">
                       💡 {grade.desc}
                    </p>
                 </div>
              </div>

              {/* 오른쪽: 매출 비중 (도넛 차트) */}
              <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 flex flex-col justify-center">
                 <h3 className="text-sm font-bold text-white mb-4 text-center">매출 발생 비중</h3>
                 <div className="h-48 relative">
                    <ResponsiveContainer width="100%" height="100%">
                       <PieChart>
                          <Pie
                             data={salesData}
                             cx="50%" cy="50%"
                             innerRadius={60}
                             outerRadius={80}
                             paddingAngle={5}
                             dataKey="value"
                             label={({ value }) => `${value}%`}
                             stroke="none"
                          >
                             {salesData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                             ))}
                          </Pie>
                          <Tooltip contentStyle={{borderRadius: 12, backgroundColor: '#1e293b', border: 'none', color: '#fff'}} />
                       </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col">
                       <span className="text-xs text-slate-400">주력</span>
                       <span className="text-lg font-bold text-white">
                          {(data.salesRatio?.hall || 0) > (data.salesRatio?.delivery || 0) ? '홀 영업' : '배달/포장'}
                       </span>
                    </div>
                 </div>
                 <div className="flex justify-center gap-4 mt-2">
                    <div className="flex items-center gap-1 text-xs text-slate-300">
                       <div className="w-3 h-3 rounded-full bg-[#3B82F6]"></div> 홀 {data.salesRatio?.hall || 0}%
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-300">
                       <div className="w-3 h-3 rounded-full bg-[#F97316]"></div> 배달 {data.salesRatio?.delivery || 0}%
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* 3. 성공 비결 */}
        <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-amber-100 rounded-2xl text-amber-600 shrink-0">
              <LightBulbIcon className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">성공 포인트</h3>
              <p className="text-slate-700 leading-relaxed font-medium">"{data.successPoint}"</p>
            </div>
          </div>
        </section>

        {/* 4. 점주님 인터뷰 */}
        <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <ChatBubbleBottomCenterTextIcon className="w-6 h-6 text-indigo-600" />
            점주님 한마디
          </h3>
          <div className="relative bg-slate-50 rounded-2xl p-6 border border-slate-100">
            <div className="absolute -top-3 left-8 w-6 h-6 bg-slate-50 border-t border-l border-slate-100 transform rotate-45"></div>
            <p className="text-slate-700 leading-7 whitespace-pre-wrap">{data.interview}</p>
          </div>
        </section>

        {/* 5. 하단: 다른 사례 더보기 */}
        <section className="pt-10 border-t border-slate-200">
          <h3 className="text-xl font-bold text-slate-900 mb-6">다른 성공 사례도 확인해보세요</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {otherCases.map((item) => (
              <Link key={item.id} href={`/cases/${item.id}`} className="group block bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-md transition-all">
                <div className="relative h-32 w-full bg-slate-100">
                  {item.mainImage ? (
                    <Image src={item.mainImage} alt={item.brand} fill className="object-cover group-hover:scale-105 transition-transform" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">NO IMG</div>
                  )}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors"></div>
                </div>
                <div className="p-4">
                  <p className="text-xs text-indigo-600 font-bold mb-1">{item.brand}</p>
                  <p className="text-sm font-bold text-slate-900 line-clamp-1">{item.summary}</p>
                  <div className="mt-2 text-xs text-slate-500">
                    순수익 <span className="font-bold text-slate-800">{item.netProfit}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="text-center">
            <Link href="/cases" className="inline-block px-10 py-3.5 bg-slate-900 text-white rounded-full text-sm font-bold shadow-lg hover:bg-slate-800 hover:shadow-xl transition-all active:scale-95">
              성공 사례 전체 목록 보기
            </Link>
          </div>
        </section>

      </div>
    </main>
  );
}