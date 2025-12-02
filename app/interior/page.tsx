'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  XMarkIcon, ShoppingBagIcon, PlusIcon, CalculatorIcon, 
  InformationCircleIcon, PencilSquareIcon, WrenchScrewdriverIcon 
} from '@heroicons/react/24/solid';
import { calculateCost, fmtKRW, PRO_LABOR_COST } from '@/lib/interior-logic';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// [핵심 수정] 안전장치 적용! (이 부분이 없으면 에러 남)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';
const supabase = createClient(supabaseUrl, supabaseKey);

// ... (이하 코드는 동일합니다. 아래 내용을 그대로 복사하세요)

const PROMO_BANNERS = [
  { id: 1, title: '벽면 셀프 시공만으로 분위기 확 바꾸기', description: '소프트스톤, 데코 패널 등 벽면만 먼저 손보는 셀프 시공', tag: '소프트스톤 · 데코 패널', imageUrl: 'https://images.unsplash.com/photo-1505691723518-36a5ac3be353?q=80&w=1200' },
  { id: 2, title: '데코타일로 바닥 셀프 시공', description: '기존 바닥 철거 없이 올려 시공하는 방식으로 비용 절감', tag: '데코타일 셀프 시공', imageUrl: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1200' },
];

// 제품 상세 모달
function ProductDetailModal({ product, onClose }: { product: any; onClose: () => void; }) {
  if (!product) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl flex flex-col md:flex-row max-h-[90vh]">
        <button onClick={onClose} className="absolute right-4 top-4 z-20 rounded-full bg-white/80 p-2 text-slate-800 shadow-md hover:bg-white transition-all"><XMarkIcon className="h-6 w-6" /></button>
        <div className="relative h-64 md:h-auto md:w-1/2 bg-slate-100">
          <img src={product.image_url || 'https://via.placeholder.com/600'} alt={product.name} className="h-full w-full object-cover" />
        </div>
        <div className="flex-1 p-6 md:p-8 flex flex-col overflow-y-auto bg-white">
          <div className="mb-4">
            <span className="inline-block rounded-md bg-indigo-50 px-2 py-1 text-[11px] font-bold text-indigo-600 mb-2">{product.tag}</span>
            <h3 className="text-2xl font-bold text-slate-900 leading-tight mb-1">{product.name}</h3>
            <p className="text-xs text-slate-400">Code: {product.id.slice(0, 8).toUpperCase()}</p>
          </div>
          <div className="flex-1 space-y-6">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <h4 className="text-xs font-bold text-slate-500 mb-2">📌 제품 스펙</h4>
              <p className="text-sm text-slate-700 whitespace-pre-wrap">{product.spec_description || '상세 정보 없음'}</p>
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 mb-2">💡 장당 가격</h4>
              <p className="text-lg font-bold text-indigo-600">{Number(product.price_per_piece).toLocaleString()}원 / 1장</p>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-slate-100">
             <p className="text-xs text-slate-500 mb-4 text-center">* 정확한 견적은 아래 계산기를 이용해주세요.</p>
             <button className="w-full py-4 rounded-xl bg-[#1E293B] text-sm font-bold text-white shadow-lg hover:bg-slate-800 flex items-center justify-center gap-2"><ShoppingBagIcon className="w-4 h-4" /> 구매 문의하기</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// 시공 사례 모달
function CaseDetailModal({ caseItem, onClose }: { caseItem: any; onClose: () => void; }) {
  if (!caseItem) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl flex flex-col md:flex-row max-h-[90vh]">
        <button onClick={onClose} className="absolute right-4 top-4 z-20 rounded-full bg-black/50 p-2 text-white shadow-md hover:bg-black/70"><XMarkIcon className="h-6 w-6" /></button>
        <div className="relative h-64 md:h-auto md:w-3/5 bg-slate-900">
          <img src={caseItem.after_image} alt={caseItem.title} className="h-full w-full object-cover" />
          <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-8">
             <h3 className="text-2xl font-bold text-white mb-1">{caseItem.title}</h3>
             <p className="text-indigo-300 text-sm font-bold">{Number(caseItem.cost_saved).toLocaleString()}원 절감 사례</p>
          </div>
        </div>
        <div className="flex-1 p-8 bg-white flex flex-col overflow-y-auto">
           <div className="mb-6">
              <span className="text-xs font-bold text-slate-400 uppercase mb-2 block">Before Construction</span>
              <div className="h-40 rounded-xl overflow-hidden bg-slate-100 mb-4">
                 {caseItem.before_image ? <img src={caseItem.before_image} alt="Before" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">Before 없음</div>}
              </div>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{caseItem.description}</p>
           </div>
        </div>
      </div>
    </div>
  );
}

export default function InteriorPage() {
  const [activeTab, setActiveTab] = useState<'wall' | 'floor'>('wall');
  const [products, setProducts] = useState<any[]>([]);
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [productLimit, setProductLimit] = useState(6);
  const [caseLimit, setCaseLimit] = useState(4);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedCase, setSelectedCase] = useState<any>(null);
  const [widthM, setWidthM] = useState<string>('3');
  const [lengthM, setLengthM] = useState<string>('4');
  const [zoneCount, setZoneCount] = useState<string>('1');
  const [isManualMode, setIsManualMode] = useState(false);
  const [manualSpec, setManualSpec] = useState({ tile_width: 600, tile_height: 600, price_per_piece: 5000 });

  useEffect(() => {
    // [중요] 환경변수 체크: 없으면 실행 안 함 (배포 시 에러 방지)
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
        setLoading(false);
        return;
    }
    
    const fetchData = async () => {
      setLoading(true);
      const { data: prodData } = await supabase.from('interior_products').select('*').eq('category', activeTab).order('created_at', { ascending: false });
      if (prodData) setProducts(prodData);

      const { data: caseData } = await supabase.from('interior_cases').select('*').order('created_at', { ascending: false });
      if (caseData) setCases(caseData);
      setLoading(false);
    };
    fetchData();
    setProductLimit(6);
    setSelectedProduct(null);
    setIsManualMode(false);
  }, [activeTab]);

  let targetProduct;
  if (isManualMode) {
    targetProduct = { ...manualSpec, name: '직접 입력 자재' };
  } else {
    targetProduct = selectedProduct || (products.length > 0 ? products[0] : { tile_width: 600, tile_height: 600, price_per_piece: 5000 });
  }

  const { materialCost, proCost, saveCost, pieceCount, isValid, spec } = calculateCost(widthM, lengthM, zoneCount, activeTab, targetProduct);
  const visibleProducts = products.slice(0, productLimit);
  const visibleCases = cases.slice(0, caseLimit);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="mx-auto max-w-6xl px-4 py-8 space-y-10">
        
        {/* 배너 */}
        <section className="relative overflow-hidden rounded-3xl shadow-xl border border-slate-800/10">
          <Swiper modules={[Autoplay, Pagination]} autoplay={{ delay: 5000 }} loop={true} className="h-64 md:h-80">
            {PROMO_BANNERS.map((banner) => (
              <SwiperSlide key={banner.id}>
                <div className="relative h-full w-full">
                  <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${banner.imageUrl})` }} />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A] via-[#1E293B]/80 to-transparent" />
                  <div className="relative z-10 flex h-full flex-col justify-center p-8 md:p-12 max-w-2xl">
                    <span className="inline-block w-fit mb-3 rounded-md bg-indigo-600 px-3 py-1 text-[10px] font-bold text-white shadow-sm">{banner.tag}</span>
                    <h2 className="text-2xl md:text-4xl font-extrabold text-white leading-tight mb-3">{banner.title}</h2>
                    <p className="text-sm md:text-base text-slate-300 line-clamp-2">{banner.description}</p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>

        {/* 탭 및 리스트 */}
        <section>
           <div className="flex justify-center mb-8">
              <div className="bg-white p-1.5 rounded-full shadow-sm border border-slate-200 inline-flex">
                <button onClick={() => setActiveTab('wall')} className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${activeTab === 'wall' ? 'bg-[#1E293B] text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}>벽면 (Wall)</button>
                <button onClick={() => setActiveTab('floor')} className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${activeTab === 'floor' ? 'bg-[#1E293B] text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}>바닥 (Floor)</button>
              </div>
           </div>
           {loading ? <div className="py-20 text-center text-slate-400">데이터를 불러오는 중...</div> : visibleProducts.length === 0 ? (
              <div className="py-20 text-center text-slate-400 bg-white rounded-2xl border border-slate-100">등록된 자재가 없습니다.</div>
           ) : (
             <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {visibleProducts.map((item) => (
                   <div key={item.id} onClick={() => { setSelectedProduct(item); setIsManualMode(false); document.getElementById('calculator-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }} className={`group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm border transition-all hover:-translate-y-1 ${selectedProduct?.id === item.id && !isManualMode ? 'border-indigo-500 ring-2 ring-indigo-500 ring-offset-2' : 'border-slate-100 hover:border-indigo-100'}`}>
                      <div className="relative h-40 bg-slate-200 overflow-hidden">
                         <img src={item.image_url || 'https://via.placeholder.com/400'} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <div className="p-4">
                         <p className="text-[10px] text-indigo-600 font-bold mb-1">{item.tag}</p>
                         <h3 className="text-sm font-bold text-slate-900 line-clamp-1">{item.name}</h3>
                         <div className="mt-2 flex items-center justify-between">
                            <span className="text-xs text-slate-400">{item.tile_width}x{item.tile_height}mm</span>
                            <span className="text-sm font-extrabold text-slate-900">{Number(item.price_per_piece).toLocaleString()}<span className="text-xs font-normal">원/장</span></span>
                         </div>
                      </div>
                   </div>
                ))}
             </div>
           )}
           {visibleProducts.length < products.length && (
             <div className="mt-8 text-center">
                <button onClick={() => setProductLimit(prev => prev + 6)} className="inline-flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-600 hover:bg-slate-50 shadow-sm transition-all"><PlusIcon className="w-3 h-3" /> 더 보기</button>
             </div>
           )}
        </section>

        {/* 견적 계산기 */}
        <section id="calculator-section" className="rounded-3xl bg-[#1E293B] p-6 md:p-10 text-white shadow-xl relative overflow-hidden">
           <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
           <div className="relative z-10 flex flex-col lg:flex-row gap-10 items-start">
              <div className="flex-1 w-full">
                 <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                       <CalculatorIcon className="w-6 h-6 text-yellow-400" />
                       <h2 className="text-xl font-bold">셀프 견적 계산기</h2>
                    </div>
                    <div className="flex bg-slate-800 rounded-lg p-1">
                       <button onClick={() => setIsManualMode(false)} className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${!isManualMode ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}>선택 자재</button>
                       <button onClick={() => setIsManualMode(true)} className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${isManualMode ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}><PencilSquareIcon className="w-3 h-3 inline mr-1"/>직접 입력</button>
                    </div>
                 </div>
                 <div className="mb-6 bg-white/5 p-4 rounded-xl border border-white/10 flex items-start gap-3">
                    <PencilSquareIcon className="w-5 h-5 text-indigo-400 mt-1 shrink-0" />
                    <div>
                       {isManualMode ? (
                          <>
                             <p className="text-sm text-slate-200 mb-1">내가 알아본 자재의 <strong>규격과 가격</strong>을 직접 입력해서 계산합니다.</p>
                             <p className="text-xs text-slate-500 font-medium">(자재 규격 및 단가 확인 후 입력하세요)</p>
                          </>
                       ) : (
                          <>
                             <p className="text-sm text-slate-200 mb-1">위 리스트에서 <strong>자재를 선택</strong>하면 해당 스펙으로 자동 계산됩니다.</p>
                             <p className="text-xs text-slate-500 font-medium">{selectedProduct ? `선택됨: ${selectedProduct.name}` : '(선택된 자재 없음 -> 기본값 적용)'}</p>
                          </>
                       )}
                    </div>
                 </div>
                 <div className="space-y-6">
                    <div>
                       <p className="text-xs font-bold text-indigo-300 mb-2 uppercase">STEP 1. 시공할 공간 크기</p>
                       <div className="grid grid-cols-3 gap-3">
                          <div><label className="text-xs text-slate-400 mb-1 block">가로 (m)</label><input type="number" value={widthM} onChange={(e) => setWidthM(e.target.value)} className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2.5 text-white text-sm focus:border-indigo-500 outline-none" /></div>
                          <div><label className="text-xs text-slate-400 mb-1 block">세로 (m)</label><input type="number" value={lengthM} onChange={(e) => setLengthM(e.target.value)} className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2.5 text-white text-sm focus:border-indigo-500 outline-none" /></div>
                          <div><label className="text-xs text-slate-400 mb-1 block">구역 수</label><input type="number" value={zoneCount} onChange={(e) => setZoneCount(e.target.value)} className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2.5 text-white text-sm focus:border-indigo-500 outline-none" /></div>
                       </div>
                    </div>
                    {isManualMode && (
                       <div className="animate-fadeIn">
                          <p className="text-xs font-bold text-indigo-300 mb-2 uppercase">STEP 2. 자재 정보 입력</p>
                          <div className="grid grid-cols-3 gap-3">
                             <div><label className="text-xs text-slate-400 mb-1 block">자재 가로 (mm)</label><input type="number" value={manualSpec.tile_width} onChange={(e) => setManualSpec({...manualSpec, tile_width: Number(e.target.value)})} className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2.5 text-white text-sm focus:border-indigo-500 outline-none" /></div>
                             <div><label className="text-xs text-slate-400 mb-1 block">자재 세로 (mm)</label><input type="number" value={manualSpec.tile_height} onChange={(e) => setManualSpec({...manualSpec, tile_height: Number(e.target.value)})} className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2.5 text-white text-sm focus:border-indigo-500 outline-none" /></div>
                             <div><label className="text-xs text-slate-400 mb-1 block">장당 가격 (원)</label><input type="number" value={manualSpec.price_per_piece} onChange={(e) => setManualSpec({...manualSpec, price_per_piece: Number(e.target.value)})} className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2.5 text-white text-sm focus:border-indigo-500 outline-none" /></div>
                          </div>
                       </div>
                    )}
                 </div>
              </div>
              <div className="w-full lg:w-96 bg-white rounded-2xl p-6 text-slate-900 shadow-lg shrink-0">
                 {isValid ? (
                    <>
                       <div className="flex justify-between items-center mb-2"><span className="text-sm font-bold text-slate-500">예상 자재비</span><span className="text-2xl font-extrabold text-slate-900">{fmtKRW(materialCost)}</span></div>
                       <div className="mb-6 text-right">
                          <p className="text-xs text-slate-400 mb-1">{spec?.tW}x{spec?.tH}mm ({fmtKRW(spec?.price)}/장) 기준</p>
                          <span className="inline-block bg-indigo-100 text-indigo-700 text-xs px-2 py-0.5 rounded font-bold">총 {pieceCount}장 필요 (여유 10%)</span>
                       </div>
                       <div className="space-y-3 pt-4 border-t border-slate-100">
                          <div className="flex justify-between text-xs"><span className="text-slate-500">업체 시공 시 예상가</span><span className="text-slate-400 line-through">{fmtKRW(proCost)}</span></div>
                          <div className="flex justify-between items-center bg-indigo-50 p-3 rounded-lg"><span className="text-xs font-bold text-indigo-700">💰 예상 절감액</span><span className="text-sm font-extrabold text-indigo-600">-{fmtKRW(saveCost)}</span></div>
                          <div className="flex gap-2 items-start text-[10px] text-slate-400 bg-slate-50 p-2 rounded border border-slate-100"><InformationCircleIcon className="w-3 h-3 shrink-0 mt-0.5" /><span>1인당 하루 시공 인건비({fmtKRW(PRO_LABOR_COST)}) 절감 효과가 포함된 금액입니다.</span></div>
                       </div>
                       <button className="w-full mt-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-all shadow-md active:scale-95">이 견적으로 자재 담기</button>
                    </>
                 ) : (<div className="text-center py-12 text-slate-400 text-sm flex flex-col items-center"><CalculatorIcon className="w-8 h-8 mb-2 text-slate-300" />치수를 입력하면<br/>자동으로 계산됩니다.</div>)}
              </div>
           </div>
        </section>

        {/* 시공 사례 */}
        <section>
           <h2 className="text-xl font-bold text-slate-900 mb-6">📸 생생한 시공 후기</h2>
           {cases.length === 0 ? <div className="py-10 text-center text-slate-400">등록된 후기가 없습니다.</div> : (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {visibleCases.map((c) => (
                   <div key={c.id} onClick={() => setSelectedCase(c)} className="group relative h-64 rounded-2xl overflow-hidden cursor-pointer shadow-sm">
                      <img src={c.after_image || 'https://via.placeholder.com/600'} alt={c.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                      <div className="absolute bottom-6 left-6 right-6"><span className="inline-block px-2 py-0.5 bg-indigo-500 text-white text-[10px] font-bold rounded mb-2">Before & After</span><h3 className="text-lg font-bold text-white">{c.title}</h3></div>
                   </div>
                ))}
             </div>
           )}
        </section>
      </div>

      {selectedProduct && <ProductDetailModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
      {selectedCase && <CaseDetailModal caseItem={selectedCase} onClose={() => setSelectedCase(null)} />}
    </div>
  );
}