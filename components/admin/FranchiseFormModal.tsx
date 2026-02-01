'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  XMarkIcon, CheckIcon, BuildingStorefrontIcon, CurrencyDollarIcon,
  ExclamationTriangleIcon, PhotoIcon, MegaphoneIcon, AcademicCapIcon, MapPinIcon, PencilIcon,
  ArrowsRightLeftIcon
} from '@heroicons/react/24/outline';
import { FRANCHISE_CATEGORIES } from '@/lib/franchise-data';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const REGIONS = [
  '서울', '부산', '대구', '인천', '광주', '대전', '울산', '세종',
  '경기', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주'
];

interface Props {
  initialData?: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function FranchiseFormModal({ initialData, onClose, onSuccess }: Props) {
  // [모드 상태] true: 23~25년 (최신), false: 22~24년 (기존)
  const [showLatestYear, setShowLatestYear] = useState(false);

  const [form, setForm] = useState<any>({
    name: '', category: '카페', company_name: '', ceo_name: '', address: '', contact: '', homepage_url: '',
    logo_url: '', hero_image: '', avg_duration: '', base_size_m2: 50,
    cost_join: 0, cost_edu: 0, cost_deposit: 0, cost_interior: 0, cost_other: 0, cost_total: 0, cost_max: 0, cost_security: '',
    summary_total: 0, summary_new: 0, summary_closed: 0, summary_totalDiff: 0, summary_newDiff: 0, summary_closedDiff: 0,
    
    trend_22_total: 0, trend_22_new: 0, trend_22_closed: 0,
    trend_23_total: 0, trend_23_new: 0, trend_23_closed: 0,
    trend_24_total: 0, trend_24_new: 0, trend_24_closed: 0,
    trend_25_total: 0, trend_25_new: 0, trend_25_closed: 0,
    
    fin_22_sales: 0, fin_22_profit: 0,
    fin_23_sales: 0, fin_23_profit: 0,
    fin_24_sales: 0, fin_24_profit: 0,
    fin_25_sales: 0, fin_25_profit: 0,

    avg_revenue: 0, avg_revenue_pyeong: 0, royalty: '', adFee: '',
    term_initial: 0, term_renewal: 0, renewal_cost: '',
    area_protection: 'false', area_desc: '',
    training_days: 0, training_cost_bearer: '', training_contents: '',
    marketing_ratio: '', marketing_desc: '',
    price_control: 'false',
    has_violation: 'false', violation_detail: ''
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const heroInputRef = useRef<HTMLInputElement>(null);

  // 초기 데이터 로드 (String 변환으로 안전하게)
  useEffect(() => {
    if (initialData) {
        const sm = initialData.store_summary || {};
        const ic = initialData.initial_costs || {};
        const fin = initialData.financials || [];
        const getFin = (y: string) => fin.find((f: any) => String(f.year) === y) || {};
        const tr = initialData.store_trends || [];
        const getTrend = (y: string) => tr.find((t: any) => String(t.year) === y) || {};
        const rs = initialData.regional_stores || [];
        const getRegionCount = (r: string) => rs.find((x: any) => x.region === r)?.count || 0;
        const ar = typeof initialData.avg_revenue === 'object' ? initialData.avg_revenue : { total: initialData.avg_revenue, perPyeong: 0 };
        const oc = initialData.ongoing_costs || {};
        const ct = initialData.contract || {};
        const trn = ct.training || {};
        const mkt = ct.marketing || {};
        const qc = ct.qualityControl || {};
        const ls = initialData.legal_status || {};
        const regionFormState = REGIONS.reduce((acc, r) => ({ ...acc, [`region_${r}`]: getRegionCount(r) }), {});

        const has2025 = getTrend('2025').totalStores > 0 || getFin('2025').totalSales > 0;
        if (has2025) setShowLatestYear(true);

        setForm((prev: any) => ({
            ...prev,
            id: initialData.id,
            name: initialData.name || '',
            category: initialData.category || '카페',
            company_name: initialData.company_name || '',
            ceo_name: initialData.ceo_name || '',
            address: initialData.address || '',
            contact: initialData.contact || '',
            logo_url: initialData.logo_url || '',
            hero_image: initialData.hero_image || '',
            homepage_url: initialData.description || '',
            avg_duration: initialData.avg_duration || '',
            base_size_m2: initialData.base_size_m2 || 50,
            summary_total: sm.total || 0, summary_new: sm.new || 0, summary_closed: sm.closed || 0,
            summary_totalDiff: sm.totalDiff || 0, summary_newDiff: sm.newDiff || 0, summary_closedDiff: sm.closedDiff || 0,
            
            cost_join: ic.joinFee || 0, cost_edu: ic.eduFee || 0, cost_deposit: ic.deposit || 0,
            cost_interior: ic.interior || 0, cost_other: ic.other || 0, cost_total: ic.totalAvg || 0, cost_max: ic.totalMax || 0,
            cost_security: ic.security_deposit || '',

            fin_22_sales: getFin('2022').totalSales || 0, fin_22_profit: getFin('2022').operatingProfit || 0,
            fin_23_sales: getFin('2023').totalSales || 0, fin_23_profit: getFin('2023').operatingProfit || 0,
            fin_24_sales: getFin('2024').totalSales || 0, fin_24_profit: getFin('2024').operatingProfit || 0,
            fin_25_sales: getFin('2025').totalSales || 0, fin_25_profit: getFin('2025').operatingProfit || 0,

            trend_22_total: getTrend('2022').totalStores || 0, trend_22_new: getTrend('2022').newStores || 0, trend_22_closed: getTrend('2022').closedStores || 0,
            trend_23_total: getTrend('2023').totalStores || 0, trend_23_new: getTrend('2023').newStores || 0, trend_23_closed: getTrend('2023').closedStores || 0,
            trend_24_total: getTrend('2024').totalStores || 0, trend_24_new: getTrend('2024').newStores || 0, trend_24_closed: getTrend('2024').closedStores || 0,
            trend_25_total: getTrend('2025').totalStores || 0, trend_25_new: getTrend('2025').newStores || 0, trend_25_closed: getTrend('2025').closedStores || 0,

            ...regionFormState,
            avg_revenue: ar.total || 0, avg_revenue_pyeong: ar.perPyeong || 0,
            royalty: oc.royalty || '', adFee: oc.adFee || '',
            term_initial: ct.termInitial || 0, term_renewal: ct.termRenewal || 0, renewal_cost: ct.renewalCost || '',
            area_protection: ct.areaProtection ? 'true' : 'false', area_desc: ct.areaDesc || '',
            training_days: trn.days || 0, training_cost_bearer: trn.costBearer || '', training_contents: trn.contents || '',
            marketing_ratio: mkt.ratio || '', marketing_desc: mkt.desc || '',
            price_control: qc.priceControl ? 'true' : 'false',
            has_violation: ls.hasViolation ? 'true' : 'false', violation_detail: ls.violationDetail || ''
        }));
    }
  }, [initialData]);

  // 자동 계산 로직
  useEffect(() => {
    if (showLatestYear) {
      const t24_total = Number(form.trend_24_total || 0);
      const t24_new = Number(form.trend_24_new || 0);
      const t24_closed = Number(form.trend_24_closed || 0);
      const t25_total = Number(form.trend_25_total || 0);
      const t25_new = Number(form.trend_25_new || 0);
      const t25_closed = Number(form.trend_25_closed || 0);

      setForm((prev: any) => ({
        ...prev,
        summary_total: t25_total,
        summary_new: t25_new,
        summary_closed: t25_closed,
        summary_totalDiff: t25_total - t24_total,
        summary_newDiff: t25_new - t24_new,
        summary_closedDiff: t25_closed - t24_closed
      }));
    } else {
      const t23_total = Number(form.trend_23_total || 0);
      const t23_new = Number(form.trend_23_new || 0);
      const t23_closed = Number(form.trend_23_closed || 0);
      const t24_total = Number(form.trend_24_total || 0);
      const t24_new = Number(form.trend_24_new || 0);
      const t24_closed = Number(form.trend_24_closed || 0);

      setForm((prev: any) => ({
        ...prev,
        summary_total: t24_total,
        summary_new: t24_new,
        summary_closed: t24_closed,
        summary_totalDiff: t24_total - t23_total,
        summary_newDiff: t24_new - t23_new,
        summary_closedDiff: t24_closed - t23_closed
      }));
    }
  }, [
    showLatestYear,
    form.trend_23_total, form.trend_23_new, form.trend_23_closed, 
    form.trend_24_total, form.trend_24_new, form.trend_24_closed,
    form.trend_25_total, form.trend_25_new, form.trend_25_closed
  ]);

  const uploadImage = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const safeFileName = `${Math.random().toString(36).substring(2, 10)}-${Date.now()}.${fileExt}`;
    const { error } = await supabase.storage.from('franchise-images').upload(safeFileName, file);
    if (error) throw error;
    const { data } = supabase.storage.from('franchise-images').getPublicUrl(safeFileName);
    return data.publicUrl;
  };

  const handleSave = async () => {
    if (!form.name) return alert('브랜드명은 필수입니다.');
    setUploading(true);

    try {
      let finalLogoUrl = form.logo_url;
      let finalHeroUrl = form.hero_image;

      if (logoFile) finalLogoUrl = await uploadImage(logoFile);
      if (heroFile) finalHeroUrl = await uploadImage(heroFile);

      const regionalStoresData = REGIONS.map(region => ({ region, count: Number(form[`region_${region}`] || 0) }));
      
      const payload: any = {
        name: form.name,
        category: form.category,
        company_name: form.company_name,
        ceo_name: form.ceo_name,
        address: form.address,
        contact: form.contact,
        logo_url: finalLogoUrl,
        hero_image: finalHeroUrl,
        description: form.homepage_url,
        avg_duration: form.avg_duration,
        base_size_m2: Number(form.base_size_m2 || 50),
        store_summary: {
          total: Number(form.summary_total || 0), new: Number(form.summary_new || 0), closed: Number(form.summary_closed || 0),
          totalDiff: Number(form.summary_totalDiff || 0), newDiff: Number(form.summary_newDiff || 0), closedDiff: Number(form.summary_closedDiff || 0)
        },
        initial_costs: {
          joinFee: Number(form.cost_join || 0), eduFee: Number(form.cost_edu || 0), deposit: Number(form.cost_deposit || 0),
          interior: Number(form.cost_interior || 0), other: Number(form.cost_other || 0), 
          totalAvg: Number(form.cost_total || 0), totalMax: Number(form.cost_max || 0),
          security_deposit: form.cost_security 
        },
        
        // [중요] 0보다 큰 값이 있으면 무조건 저장하도록 필터링 수정 (2022년 데이터 살리기)
        financials: [
          { year: "2022", totalSales: Number(form.fin_22_sales), operatingProfit: Number(form.fin_22_profit) },
          { year: "2023", totalSales: Number(form.fin_23_sales), operatingProfit: Number(form.fin_23_profit) },
          { year: "2024", totalSales: Number(form.fin_24_sales), operatingProfit: Number(form.fin_24_profit) },
          { year: "2025", totalSales: Number(form.fin_25_sales), operatingProfit: Number(form.fin_25_profit) }
        ].filter(f => f.totalSales > 0 || f.operatingProfit > 0),

        store_trends: [
          { year: "2022", totalStores: Number(form.trend_22_total), newStores: Number(form.trend_22_new), closedStores: Number(form.trend_22_closed) },
          { year: "2023", totalStores: Number(form.trend_23_total), newStores: Number(form.trend_23_new), closedStores: Number(form.trend_23_closed) },
          { year: "2024", totalStores: Number(form.trend_24_total), newStores: Number(form.trend_24_new), closedStores: Number(form.trend_24_closed) },
          { year: "2025", totalStores: Number(form.trend_25_total), newStores: Number(form.trend_25_new), closedStores: Number(form.trend_25_closed) }
        ].filter(t => t.totalStores > 0),

        regional_stores: regionalStoresData,
        avg_revenue: { total: Number(form.avg_revenue || 0), perPyeong: Number(form.avg_revenue_pyeong || 0) },
        ongoing_costs: { royalty: form.royalty, adFee: form.adFee },
        contract: {
           termInitial: Number(form.term_initial || 0), termRenewal: Number(form.term_renewal || 0), renewalCost: form.renewal_cost,
           areaProtection: form.area_protection === 'true', areaDesc: form.area_desc,
           training: { days: Number(form.training_days || 0), costBearer: form.training_cost_bearer, contents: form.training_contents },
           marketing: { ratio: form.marketing_ratio, desc: form.marketing_desc },
           qualityControl: { priceControl: form.price_control === 'true' }
        },
        legal_status: { hasViolation: form.has_violation === 'true', violationDetail: form.violation_detail }
      };

      if (form.id) {
         await supabase.from('franchises').update(payload).eq('id', form.id);
      } else {
         await supabase.from('franchises').insert([payload]);
      }

      onSuccess();
    } catch (error: any) {
      alert('오류 발생: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const yearsToShow = showLatestYear ? ['23', '24', '25'] : ['22', '23', '24'];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex justify-between p-6 border-b">
           <h3 className="text-xl font-bold">브랜드 정보 {form.id ? '수정' : '등록'}</h3>
           <button onClick={onClose}><XMarkIcon className="w-6 h-6 hover:text-red-500 transition-colors"/></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-8 bg-slate-50 grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="space-y-6">
              <Section title="기본 정보" icon={BuildingStorefrontIcon}>
                  <Input label="브랜드명 (필수)" value={form.name} onChange={(v: string) => setForm({...form, name: v})} placeholder="예: 메가커피" />
                  <div className="grid grid-cols-2 gap-2">
                     <div className="w-full">
                        <label className="text-[10px] font-bold text-slate-400 mb-1 block">업종</label>
                        <select className="w-full border border-slate-200 bg-slate-50 p-2 rounded-lg text-sm outline-none focus:border-indigo-500 font-medium" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                           {FRANCHISE_CATEGORIES.slice(1).map(cat => (<option key={cat.id} value={cat.name}>{cat.name}</option>))}
                        </select>
                     </div>
                     <Input label="대표자" value={form.ceo_name} onChange={(v: string) => setForm({...form, ceo_name: v})} />
                  </div>
                  <Input label="법인명" value={form.company_name} onChange={(v: string) => setForm({...form, company_name: v})} />
                  <Input label="주소" value={form.address} onChange={(v: string) => setForm({...form, address: v})} />
                  <Input label="연락처" value={form.contact} onChange={(v: string) => setForm({...form, contact: v})} />
                  <Input label="공식 홈페이지 URL" value={form.homepage_url} onChange={(v: string) => setForm({...form, homepage_url: v})} />
              </Section>

              <Section title="이미지 관리" icon={PhotoIcon}>
                  <div className="space-y-4">
                     <div className="space-y-2">
                        <div className="flex justify-between items-end"><label className="text-xs font-bold text-slate-500">로고</label>{form.logo_url && !logoFile && <span className="text-[10px] text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-full">✔ 등록됨</span>}</div>
                        <div onClick={() => logoInputRef.current?.click()} className="cursor-pointer flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-slate-300 rounded-xl hover:bg-slate-50">
                           {logoFile ? <p className="text-sm font-bold text-indigo-700">{logoFile.name}</p> : form.logo_url ? <img src={form.logo_url} className="h-full object-contain" /> : <p className="text-sm font-bold text-slate-400">클릭하여 업로드</p>}
                           <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => setLogoFile(e.target.files?.[0] || null)} />
                        </div>
                     </div>
                     <div className="space-y-2">
                        <div className="flex justify-between items-end"><label className="text-xs font-bold text-slate-500">배너</label>{form.hero_image && !heroFile && <span className="text-[10px] text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-full">✔ 등록됨</span>}</div>
                        <div onClick={() => heroInputRef.current?.click()} className="cursor-pointer flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-slate-300 rounded-xl hover:bg-slate-50">
                           {heroFile ? <p className="text-sm font-bold text-indigo-700">{heroFile.name}</p> : form.hero_image ? <img src={form.hero_image} className="w-full h-full object-cover" /> : <p className="text-sm font-bold text-slate-400">클릭하여 업로드</p>}
                           <input ref={heroInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => setHeroFile(e.target.files?.[0] || null)} />
                        </div>
                     </div>
                  </div>
              </Section>

              <Section title="초기 비용 (단위: 천원)" icon={CurrencyDollarIcon}>
                  <div className="bg-indigo-50 p-3 rounded-lg mb-3 border border-indigo-100 flex gap-2 items-center">
                     <label className="text-[10px] font-bold text-indigo-500">기준 면적(m²):</label>
                     <input type="number" className="w-16 p-1 text-sm font-bold text-right" value={form.base_size_m2} onChange={e => setForm({...form, base_size_m2: e.target.value})} placeholder="50" />
                     <span className="text-xs text-indigo-400">(약 {((Number(form.base_size_m2) || 0) / 3.3).toFixed(1)} 평)</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                     <Input label="가맹비" type="number" value={form.cost_join} onChange={(v: string) => setForm({...form, cost_join: v})} />
                     <Input label="교육비" type="number" value={form.cost_edu} onChange={(v: string) => setForm({...form, cost_edu: v})} />
                     <Input label="보증금" type="number" value={form.cost_deposit} onChange={(v: string) => setForm({...form, cost_deposit: v})} />
                     <Input label="인테리어(평당)" type="number" value={form.cost_interior} onChange={(v: string) => setForm({...form, cost_interior: v})} />
                     <Input label="기타비용" type="number" value={form.cost_other} onChange={(v: string) => setForm({...form, cost_other: v})} />
                     <div className="bg-indigo-50 p-2 rounded col-span-2 flex gap-2">
                        <Input label="평균 합계" type="number" value={form.cost_total} onChange={(v: string) => setForm({...form, cost_total: v})} />
                        <Input label="최대 상한" type="number" value={form.cost_max} onChange={(v: string) => setForm({...form, cost_max: v})} />
                     </div>
                     <div className="col-span-2 mt-2">
                        <label className="text-[10px] font-bold text-slate-400 mb-1 block">담보 설정 (비용 합계 제외 항목)</label>
                        <textarea 
                            className="w-full border border-slate-200 bg-slate-50 p-2 rounded-lg text-sm outline-none focus:border-indigo-500 font-medium h-20 resize-none"
                            placeholder="예: 부동산 담보 제공 또는 보증보험 가입 (3천만원)"
                            value={form.cost_security || ''}
                            onChange={e => setForm({...form, cost_security: e.target.value})}
                        />
                     </div>
                  </div>
              </Section>
           </div>

           {/* 오른쪽 컬럼 */}
           <div className="space-y-6">
              <Section title={`가맹점 현황 (${showLatestYear ? '25' : '24'}년 기준 자동)`} icon={BuildingStorefrontIcon}>
                  <div className="grid grid-cols-3 gap-2 text-center">
                     <Input label={`전체(${showLatestYear ? '25' : '24'})`} type="number" value={form.summary_total} onChange={(v: string) => setForm({...form, summary_total: v})} />
                     <Input label={`신규(${showLatestYear ? '25' : '24'})`} type="number" value={form.summary_new} onChange={(v: string) => setForm({...form, summary_new: v})} />
                     <Input label={`종료(${showLatestYear ? '25' : '24'})`} type="number" value={form.summary_closed} onChange={(v: string) => setForm({...form, summary_closed: v})} />
                     
                     <Input label="전체 증감" type="number" value={form.summary_totalDiff} onChange={(v: string) => setForm({...form, summary_totalDiff: v})} />
                     <Input label="신규 증감" type="number" value={form.summary_newDiff} onChange={(v: string) => setForm({...form, summary_newDiff: v})} />
                     <Input label="종료 증감" type="number" value={form.summary_closedDiff} onChange={(v: string) => setForm({...form, summary_closedDiff: v})} />
                  </div>
              </Section>

              <Section title="가맹점 변동 추이" icon={BuildingStorefrontIcon}>
                  <div className="flex justify-between items-center bg-orange-50 p-2 rounded-lg mb-2 border border-orange-100">
                     <div className="w-1/2">
                        <Input label="평균 영업 기간" value={form.avg_duration} onChange={(v: string) => setForm({...form, avg_duration: v})} placeholder="0년 0개월" />
                     </div>
                     <button 
                        onClick={() => setShowLatestYear(!showLatestYear)}
                        className={`text-[10px] px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 transition-all ${showLatestYear ? 'bg-indigo-600 text-white' : 'bg-white text-slate-500 border border-slate-200'}`}
                     >
                        <ArrowsRightLeftIcon className="w-3 h-3"/> {showLatestYear ? '23~25년 (최신)' : '22~24년 (기존)'}
                     </button>
                  </div>
                  
                  {yearsToShow.map(year => (
                     <div key={year} className="flex gap-2 items-center mb-1 animate-fade-in">
                        <span className={`text-xs font-bold w-8 ${year === '25' ? 'text-indigo-600' : 'text-slate-700'}`}>20{year}</span>
                        <Input placeholder="전체" type="number" value={form[`trend_${year}_total`]} onChange={(v: string) => setForm({...form, [`trend_${year}_total`]: v})} />
                        <Input placeholder="신규" type="number" value={form[`trend_${year}_new`]} onChange={(v: string) => setForm({...form, [`trend_${year}_new`]: v})} />
                        <Input placeholder="종료" type="number" value={form[`trend_${year}_closed`]} onChange={(v: string) => setForm({...form, [`trend_${year}_closed`]: v})} />
                     </div>
                  ))}
              </Section>
              
              <Section title="지역별 가맹점 분포 (전국)" icon={MapPinIcon}>
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                     {REGIONS.map(region => (
                        <Input key={region} label={region} type="number" value={form[`region_${region}`]} onChange={(v: string) => setForm({...form, [`region_${region}`]: v})} />
                     ))}
                  </div>
              </Section>

              <Section title="최근 3년 재무 (매출/이익)" icon={CurrencyDollarIcon}>
                  <div className="flex justify-end mb-2">
                     <span className="text-[10px] text-slate-400 font-bold">* 위 변동 추이 설정과 동일한 연도가 표시됩니다.</span>
                  </div>
                  {yearsToShow.map(year => (
                     <div key={year} className="flex gap-2 items-center mb-2 animate-fade-in">
                        <span className={`text-xs font-bold w-10 ${year === '25' ? 'text-indigo-600' : 'text-slate-500'}`}>20{year}</span>
                        <Input placeholder="매출액" type="number" value={form[`fin_${year}_sales`]} onChange={(v: string) => setForm({...form, [`fin_${year}_sales`]: v})} />
                        <Input placeholder="영업이익" type="number" value={form[`fin_${year}_profit`]} onChange={(v: string) => setForm({...form, [`fin_${year}_profit`]: v})} />
                     </div>
                  ))}
              </Section>

              <Section title="운영/수익 & 계약" icon={CurrencyDollarIcon}>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                     <Input label="연매출(전체)" type="number" value={form.avg_revenue} onChange={(v: string) => setForm({...form, avg_revenue: v})} />
                     <Input label="평당매출" type="number" value={form.avg_revenue_pyeong} onChange={(v: string) => setForm({...form, avg_revenue_pyeong: v})} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                     <Input label="최초계약(년)" type="number" value={form.term_initial} onChange={(v: string) => setForm({...form, term_initial: v})} />
                     <Input label="연장계약(년)" type="number" value={form.term_renewal} onChange={(v: string) => setForm({...form, term_renewal: v})} />
                  </div>
                  <div className="mt-2">
                     <Input label="로열티" value={form.royalty} onChange={(v: string) => setForm({...form, royalty: v})} />
                  </div>
                  <div className="mt-2">
                     <Input label="갱신 비용" value={form.renewal_cost} onChange={(v: string) => setForm({...form, renewal_cost: v})} />
                  </div>
              </Section>

              <Section title="계약 조건 & 교육" icon={PencilIcon}>
                  <div className="bg-slate-100 p-3 rounded-lg my-2 space-y-2">
                     <h5 className="text-xs font-bold text-indigo-500 flex items-center gap-1"><AcademicCapIcon className="w-3 h-3"/> 교육 및 훈련</h5>
                     <div className="grid grid-cols-2 gap-2">
                        <Input label="교육 기간(일)" type="number" value={form.training_days} onChange={(v: string) => setForm({...form, training_days: v})} />
                        <Input label="비용 부담 주체" value={form.training_cost_bearer} onChange={(v: string) => setForm({...form, training_cost_bearer: v})} />
                     </div>
                     <Input label="교육 내용 상세" value={form.training_contents} onChange={(v: string) => setForm({...form, training_contents: v})} />
                  </div>
                  <div className="bg-slate-100 p-3 rounded-lg my-2 space-y-2">
                     <h5 className="text-xs font-bold text-indigo-500 flex items-center gap-1"><MegaphoneIcon className="w-3 h-3"/> 마케팅/품질</h5>
                     <Input label="광고비 분담 비율" value={form.marketing_ratio} onChange={(v: string) => setForm({...form, marketing_ratio: v})} />
                     <Input label="마케팅 내용" value={form.marketing_desc} onChange={(v: string) => setForm({...form, marketing_desc: v})} />
                     <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs font-bold text-slate-500">가격 통제:</span>
                        <select className="border p-1 rounded text-xs bg-white" value={form.price_control} onChange={e => setForm({...form, price_control: e.target.value})}>
                           <option value="false">자율</option>
                           <option value="true">통제</option>
                        </select>
                     </div>
                  </div>
                  <div className="flex gap-2 mt-3 pt-3 border-t">
                     <select className="border p-2 rounded text-sm w-1/3 bg-white" value={form.area_protection} onChange={e => setForm({...form, area_protection: e.target.value})}>
                        <option value="true">보호함</option>
                        <option value="false">안함</option>
                     </select>
                     <Input placeholder="보호 내용" value={form.area_desc} onChange={(v: string) => setForm({...form, area_desc: v})} />
                  </div>
              </Section>

              <Section title="법적 리스크" icon={ExclamationTriangleIcon}>
                  <div className="flex gap-2 mb-2">
                     <select className="border p-2 rounded text-sm w-1/3 bg-white" value={form.has_violation} onChange={e => setForm({...form, has_violation: e.target.value})}>
                        <option value="false">위반 없음</option>
                        <option value="true">위반 있음</option>
                     </select>
                     <Input placeholder="위반 내역 상세" value={form.violation_detail} onChange={(v: string) => setForm({...form, violation_detail: v})} />
                  </div>
              </Section>
           </div>
        </div>
        
        <div className="p-6 border-t bg-white flex justify-end gap-2 rounded-b-2xl">
          <button onClick={onClose} className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors">취소</button>
          <button onClick={handleSave} disabled={uploading} className="px-8 py-3 rounded-xl font-bold text-white bg-slate-900 hover:bg-slate-800 flex items-center gap-2 transition-all active:scale-95">{uploading ? '저장 중...' : <><CheckIcon className="w-5 h-5" /> 저장</>}</button>
        </div>
      </div>
    </div>
  );
}

function Section({ title, icon: Icon, children }: any) {
   return (<div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm"><h4 className="font-bold text-slate-800 text-sm mb-4 flex items-center gap-2 uppercase"><Icon className="w-4 h-4 text-indigo-500"/>{title}</h4><div className="space-y-3">{children}</div></div>)
}

function Input({ label, value, onChange, placeholder, type = 'text' }: any) {
  return (<div className="w-full">{label && <label className="text-[10px] font-bold text-slate-400 mb-1 block">{label}</label>}<input type={type} className="w-full border border-slate-200 bg-slate-50 p-2 rounded-lg text-sm outline-none focus:border-indigo-500 transition-all font-medium" value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder} /></div>);
}