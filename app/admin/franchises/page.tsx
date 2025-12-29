'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  MagnifyingGlassIcon, PencilIcon, TrashIcon, 
  PlusIcon, XMarkIcon, CheckIcon, BuildingStorefrontIcon, CurrencyDollarIcon,
  ExclamationTriangleIcon, PhotoIcon, MegaphoneIcon, AcademicCapIcon, MapPinIcon
} from '@heroicons/react/24/outline';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const REGIONS = [
  '서울', '부산', '대구', '인천', '광주', '대전', '울산', '세종',
  '경기', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주'
];

export default function AdminFranchisePage() {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [uploading, setUploading] = useState(false);
  
  const [form, setForm] = useState<any>({});

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [heroFile, setHeroFile] = useState<File | null>(null);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const heroInputRef = useRef<HTMLInputElement>(null);

  const fetchList = async () => {
    setLoading(true);
    let query = supabase.from('franchises').select('*').order('created_at', { ascending: false });
    if (search) query = query.ilike('name', `%${search}%`);
    const { data } = await query;
    if (data) setList(data);
    setLoading(false);
  };

  useEffect(() => { fetchList(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    await supabase.from('franchises').delete().eq('id', id);
    fetchList();
  };

  const uploadImage = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const safeFileName = `${Math.random().toString(36).substring(2, 10)}-${Date.now()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('franchise-images')
      .upload(safeFileName, file);

    if (uploadError) {
      console.error("업로드 에러:", uploadError);
      throw uploadError;
    }

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

      const regionalStoresData = REGIONS.map(region => ({
        region: region,
        count: Number(form[`region_${region}`] || 0)
      }));

      // [수정] avg_revenue를 객체({ total, perPyeong }) 형태로 저장
      const avgRevenueData = {
          total: Number(form.avg_revenue || 0),
          perPyeong: Number(form.avg_revenue_pyeong || 0)
      };

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

        store_summary: {
          total: Number(form.summary_total || 0),
          new: Number(form.summary_new || 0),
          closed: Number(form.summary_closed || 0),
          totalDiff: Number(form.summary_totalDiff || 0),
          newDiff: Number(form.summary_newDiff || 0),
          closedDiff: Number(form.summary_closedDiff || 0)
        },

        initial_costs: {
          joinFee: Number(form.cost_join || 0),
          eduFee: Number(form.cost_edu || 0),
          deposit: Number(form.cost_deposit || 0),
          interior: Number(form.cost_interior || 0),
          other: Number(form.cost_other || 0),
          totalAvg: Number(form.cost_total || 0),
          totalMax: Number(form.cost_max || 0)
        },

        financials: [
          { year: "2022", totalSales: Number(form.fin_22_sales || 0), operatingProfit: Number(form.fin_22_profit || 0) },
          { year: "2023", totalSales: Number(form.fin_23_sales || 0), operatingProfit: Number(form.fin_23_profit || 0) },
          { year: "2024", totalSales: Number(form.fin_24_sales || 0), operatingProfit: Number(form.fin_24_profit || 0) }
        ],

        store_trends: [
          { year: "2022", totalStores: Number(form.trend_22_total || 0), newStores: Number(form.trend_22_new || 0), closedStores: Number(form.trend_22_closed || 0) },
          { year: "2023", totalStores: Number(form.trend_23_total || 0), newStores: Number(form.trend_23_new || 0), closedStores: Number(form.trend_23_closed || 0) },
          { year: "2024", totalStores: Number(form.trend_24_total || 0), newStores: Number(form.trend_24_new || 0), closedStores: Number(form.trend_24_closed || 0) }
        ],

        regional_stores: regionalStoresData,

        // [수정] 위에서 만든 객체를 저장
        avg_revenue: avgRevenueData,
        
        ongoing_costs: { royalty: form.royalty, adFee: form.adFee },
        
        contract: {
           termInitial: Number(form.term_initial || 0),
           termRenewal: Number(form.term_renewal || 0),
           renewalCost: form.renewal_cost,
           areaProtection: form.area_protection === 'true', 
           areaDesc: form.area_desc,
           training: { days: Number(form.training_days || 0), costBearer: form.training_cost_bearer, contents: form.training_contents },
           marketing: { ratio: form.marketing_ratio, desc: form.marketing_desc },
           qualityControl: { priceControl: form.price_control === 'true' }
        },
        
        legal_status: {
           hasViolation: form.has_violation === 'true',
           violationDetail: form.violation_detail
        }
      };

      if (form.id) {
         const { error } = await supabase.from('franchises').update(payload).eq('id', form.id);
         if (error) throw error;
      } else {
         const { error } = await supabase.from('franchises').insert([payload]);
         if (error) throw error;
      }

      alert('성공적으로 저장되었습니다!');
      setIsEditing(false);
      setLogoFile(null);
      setHeroFile(null);
      fetchList();

    } catch (error: any) {
      console.error(error);
      alert('오류 발생: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const openEditModal = (item: any) => {
    const sm = item.store_summary || {};
    const ic = item.initial_costs || {};
    const fin = item.financials || [];
    const getFin = (y: string) => fin.find((f: any) => f.year === y) || {};
    
    const tr = item.store_trends || [];
    const getTrend = (y: string) => tr.find((t: any) => t.year === y) || {};

    const rs = item.regional_stores || [];
    const getRegionCount = (r: string) => rs.find((x: any) => x.region === r)?.count || 0;

    // [수정] avg_revenue가 객체인지 숫자인지 체크해서 폼에 바인딩
    const ar = typeof item.avg_revenue === 'object' ? item.avg_revenue : { total: item.avg_revenue, perPyeong: 0 };

    const oc = item.ongoing_costs || {};
    const ct = item.contract || {};
    const trn = ct.training || {};
    const mkt = ct.marketing || {};
    const qc = ct.qualityControl || {};
    const ls = item.legal_status || {};

    const regionFormState = REGIONS.reduce((acc, r) => ({ ...acc, [`region_${r}`]: getRegionCount(r) }), {});

    setForm({
      id: item.id,
      name: item.name,
      category: item.category,
      company_name: item.company_name,
      ceo_name: item.ceo_name,
      address: item.address,
      contact: item.contact,
      logo_url: item.logo_url,
      hero_image: item.hero_image,
      homepage_url: item.description,

      summary_total: sm.total, summary_new: sm.new, summary_closed: sm.closed,
      summary_totalDiff: sm.totalDiff, summary_newDiff: sm.newDiff, summary_closedDiff: sm.closedDiff,

      cost_join: ic.joinFee, cost_edu: ic.eduFee, cost_deposit: ic.deposit,
      cost_interior: ic.interior, cost_other: ic.other, cost_total: ic.totalAvg, cost_max: ic.totalMax,

      fin_22_sales: getFin('2022').totalSales, fin_22_profit: getFin('2022').operatingProfit,
      fin_23_sales: getFin('2023').totalSales, fin_23_profit: getFin('2023').operatingProfit,
      fin_24_sales: getFin('2024').totalSales, fin_24_profit: getFin('2024').operatingProfit,

      trend_22_total: getTrend('2022').totalStores, trend_22_new: getTrend('2022').newStores, trend_22_closed: getTrend('2022').closedStores,
      trend_23_total: getTrend('2023').totalStores, trend_23_new: getTrend('2023').newStores, trend_23_closed: getTrend('2023').closedStores,
      trend_24_total: getTrend('2024').totalStores, trend_24_new: getTrend('2024').newStores, trend_24_closed: getTrend('2024').closedStores,

      ...regionFormState,

      // [수정] 폼 상태에 각각 매핑
      avg_revenue: ar.total,
      avg_revenue_pyeong: ar.perPyeong,
      
      royalty: oc.royalty, adFee: oc.adFee,

      term_initial: ct.termInitial, term_renewal: ct.termRenewal, renewal_cost: ct.renewalCost,
      area_protection: ct.areaProtection ? 'true' : 'false', area_desc: ct.areaDesc,
      training_days: trn.days, training_cost_bearer: trn.costBearer, training_contents: trn.contents,
      marketing_ratio: mkt.ratio, marketing_desc: mkt.desc,
      price_control: qc.priceControl ? 'true' : 'false',
      has_violation: ls.hasViolation ? 'true' : 'false', violation_detail: ls.violationDetail
    });
    setLogoFile(null);
    setHeroFile(null);
    setIsEditing(true);
  };

  const openNewModal = () => {
      setForm({ id: null, name: '', category: '카페' }); 
      setLogoFile(null);
      setHeroFile(null);
      setIsEditing(true);
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h2 className="text-2xl font-black text-slate-900">프랜차이즈 DB</h2>
          <p className="text-slate-500 text-sm mt-1">총 {list.length}개의 데이터</p>
        </div>
        <button onClick={openNewModal} className="px-4 py-2.5 text-sm font-bold text-white bg-slate-900 rounded-xl hover:bg-slate-800 shadow-lg flex items-center gap-2">
            <PlusIcon className="w-4 h-4" /> 신규 등록
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase text-xs">
            <tr><th className="p-4">브랜드명</th><th className="p-4">업종</th><th className="p-4 text-right">가맹점수</th><th className="p-4 text-center">관리</th></tr>
          </thead>
          <tbody>
            {list.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 border-b last:border-0">
                <td className="p-4"><div className="font-bold text-slate-900">{item.name}</div><div className="text-xs text-slate-400 font-mono truncate w-24">{item.id}</div></td>
                <td className="p-4"><span className="px-2 py-1 bg-slate-100 rounded text-xs font-bold text-slate-600">{item.category}</span></td>
                <td className="p-4 text-right">{item.store_summary?.total?.toLocaleString() ?? '-'}개</td>
                <td className="p-4 text-center flex justify-center gap-2">
                  <button onClick={() => openEditModal(item)} className="p-2 text-slate-500 hover:text-indigo-600 bg-slate-100 rounded-lg"><PencilIcon className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 text-slate-500 hover:text-red-600 bg-slate-100 rounded-lg"><TrashIcon className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isEditing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex justify-between p-6 border-b">
               <h3 className="text-xl font-bold">브랜드 정보 {form.id ? '수정' : '등록'}</h3>
               <button onClick={() => setIsEditing(false)}><XMarkIcon className="w-6 h-6"/></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 bg-slate-50 grid grid-cols-1 md:grid-cols-2 gap-8">
               
               <div className="space-y-6">
                  <Section title="기본 정보" icon={BuildingStorefrontIcon}>
                     <Input label="브랜드명 (필수)" value={form.name} onChange={v => setForm({...form, name: v})} placeholder="예: 메가커피" />
                     <div className="grid grid-cols-2 gap-2">
                        <Input label="업종" value={form.category} onChange={v => setForm({...form, category: v})} />
                        <Input label="대표자" value={form.ceo_name} onChange={v => setForm({...form, ceo_name: v})} />
                     </div>
                     <Input label="법인명" value={form.company_name} onChange={v => setForm({...form, company_name: v})} />
                     <Input label="주소" value={form.address} onChange={v => setForm({...form, address: v})} />
                     <Input label="연락처" value={form.contact} onChange={v => setForm({...form, contact: v})} />
                     <Input label="공식 홈페이지 URL" value={form.homepage_url} onChange={v => setForm({...form, homepage_url: v})} placeholder="https://..." />
                  </Section>

                  <Section title="이미지 관리" icon={PhotoIcon}>
                     <div className="space-y-6">
                        {/* 로고 업로드 */}
                        <div className="space-y-2">
                           <div className="flex justify-between items-end">
                              <label className="text-xs font-bold text-slate-500">로고 이미지</label>
                              {form.logo_url && !logoFile && <span className="text-[10px] text-green-600 font-bold">✔ 현재 등록됨</span>}
                           </div>
                           <div 
                              onClick={() => logoInputRef.current?.click()}
                              className={`cursor-pointer flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl transition-all ${logoFile ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 hover:bg-slate-50 hover:border-indigo-400'}`}
                           >
                              {logoFile ? (
                                 <div className="text-center">
                                    <CheckIcon className="w-8 h-8 text-indigo-600 mx-auto mb-2"/>
                                    <p className="text-sm font-bold text-indigo-700">{logoFile.name}</p>
                                    <p className="text-xs text-indigo-500">업로드 준비 완료</p>
                                 </div>
                              ) : form.logo_url ? (
                                 <div className="text-center w-full h-full flex items-center justify-center p-2 relative group">
                                    <img src={form.logo_url} className="max-h-full max-w-full object-contain" />
                                    <div className="absolute inset-0 bg-black/0 hover:bg-black/10 flex items-center justify-center transition-colors rounded-xl">
                                       <p className="text-xs font-bold text-transparent group-hover:text-white bg-black/50 px-2 py-1 rounded">변경하려면 클릭</p>
                                    </div>
                                 </div>
                              ) : (
                                 <div className="text-center text-slate-400">
                                    <PlusIcon className="w-8 h-8 mx-auto mb-2"/>
                                    <p className="text-sm font-bold">클릭하여 로고 업로드</p>
                                 </div>
                              )}
                              <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => setLogoFile(e.target.files?.[0] || null)} />
                           </div>
                        </div>

                        {/* 배너 업로드 */}
                        <div className="space-y-2">
                           <div className="flex justify-between items-end">
                              <label className="text-xs font-bold text-slate-500">배너(Hero) 이미지</label>
                              {form.hero_image && !heroFile && <span className="text-[10px] text-green-600 font-bold">✔ 현재 등록됨</span>}
                           </div>
                           <div 
                              onClick={() => heroInputRef.current?.click()}
                              className={`cursor-pointer flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl transition-all ${heroFile ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 hover:bg-slate-50 hover:border-indigo-400'}`}
                           >
                              {heroFile ? (
                                 <div className="text-center">
                                    <CheckIcon className="w-8 h-8 text-indigo-600 mx-auto mb-2"/>
                                    <p className="text-sm font-bold text-indigo-700">{heroFile.name}</p>
                                    <p className="text-xs text-indigo-500">업로드 준비 완료</p>
                                 </div>
                              ) : form.hero_image ? (
                                 <div className="text-center w-full h-full flex items-center justify-center relative overflow-hidden rounded-xl group">
                                    <img src={form.hero_image} className="w-full h-full object-cover opacity-80" />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/10 transition-all">
                                       <span className="bg-black/50 text-white text-xs font-bold px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">변경하려면 클릭</span>
                                    </div>
                                 </div>
                              ) : (
                                 <div className="text-center text-slate-400">
                                    <PhotoIcon className="w-8 h-8 mx-auto mb-2"/>
                                    <p className="text-sm font-bold">클릭하여 배너 업로드</p>
                                 </div>
                              )}
                              <input ref={heroInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => setHeroFile(e.target.files?.[0] || null)} />
                           </div>
                        </div>
                     </div>
                  </Section>

                  <Section title="초기 비용 (단위: 만원)" icon={CurrencyDollarIcon}>
                     <div className="grid grid-cols-2 gap-3">
                        <Input label="가맹비" type="number" value={form.cost_join} onChange={v => setForm({...form, cost_join: v})} />
                        <Input label="교육비" type="number" value={form.cost_edu} onChange={v => setForm({...form, cost_edu: v})} />
                        <Input label="보증금" type="number" value={form.cost_deposit} onChange={v => setForm({...form, cost_deposit: v})} />
                        <Input label="인테리어" type="number" value={form.cost_interior} onChange={v => setForm({...form, cost_interior: v})} />
                        <Input label="기타비용" type="number" value={form.cost_other} onChange={v => setForm({...form, cost_other: v})} />
                        <div className="bg-indigo-50 p-2 rounded col-span-2">
                           <Input label="평균 합계" type="number" value={form.cost_total} onChange={v => setForm({...form, cost_total: v})} />
                           <Input label="최대 상한" type="number" value={form.cost_max} onChange={v => setForm({...form, cost_max: v})} />
                        </div>
                     </div>
                  </Section>

                  <Section title="운영/수익" icon={CurrencyDollarIcon}>
                     {/* [수정] 평당 매출 입력 필드 추가 */}
                     <div className="grid grid-cols-2 gap-3 mb-2">
                        <Input label="연평균 매출 (전체)" type="number" value={form.avg_revenue} onChange={v => setForm({...form, avg_revenue: v})} placeholder="단위: 만원" />
                        <Input label="평당(3.3㎡) 매출" type="number" value={form.avg_revenue_pyeong} onChange={v => setForm({...form, avg_revenue_pyeong: v})} placeholder="단위: 만원" />
                     </div>
                     <Input label="로열티 (예: 월 20만원)" value={form.royalty} onChange={v => setForm({...form, royalty: v})} />
                     <Input label="광고비 분담" value={form.adFee} onChange={v => setForm({...form, adFee: v})} />
                  </Section>
               </div>

               <div className="space-y-6">
                  <Section title="가맹점 현황 (요약)" icon={BuildingStorefrontIcon}>
                     <div className="grid grid-cols-3 gap-2 text-center">
                        <Input label="전체 수" type="number" value={form.summary_total} onChange={v => setForm({...form, summary_total: v})} />
                        <Input label="신규" type="number" value={form.summary_new} onChange={v => setForm({...form, summary_new: v})} />
                        <Input label="종료" type="number" value={form.summary_closed} onChange={v => setForm({...form, summary_closed: v})} />
                        
                        <Input label="전체 증감" type="number" value={form.summary_totalDiff} onChange={v => setForm({...form, summary_totalDiff: v})} />
                        <Input label="신규 증감" type="number" value={form.summary_newDiff} onChange={v => setForm({...form, summary_newDiff: v})} />
                        <Input label="종료 증감" type="number" value={form.summary_closedDiff} onChange={v => setForm({...form, summary_closedDiff: v})} />
                     </div>
                  </Section>

                  <Section title="가맹점 변동 추이 (전체/신규/종료)" icon={BuildingStorefrontIcon}>
                     {['22', '23', '24'].map(year => (
                        <div key={year} className="flex gap-2 items-center mb-2">
                           <span className="text-xs font-bold text-slate-500 w-10">20{year}</span>
                           <Input placeholder="전체" type="number" value={form[`trend_${year}_total`]} onChange={v => setForm({...form, [`trend_${year}_total`]: v})} />
                           <Input placeholder="신규" type="number" value={form[`trend_${year}_new`]} onChange={v => setForm({...form, [`trend_${year}_new`]: v})} />
                           <Input placeholder="종료" type="number" value={form[`trend_${year}_closed`]} onChange={v => setForm({...form, [`trend_${year}_closed`]: v})} />
                        </div>
                     ))}
                  </Section>

                  <Section title="지역별 가맹점 분포 (전국)" icon={MapPinIcon}>
                     <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                        {REGIONS.map(region => (
                           <Input 
                              key={region} 
                              label={region} 
                              type="number" 
                              value={form[`region_${region}`]} 
                              onChange={v => setForm({...form, [`region_${region}`]: v})} 
                           />
                        ))}
                     </div>
                  </Section>

                  <Section title="최근 3년 재무 (매출/이익)" icon={CurrencyDollarIcon}>
                     {['22', '23', '24'].map(year => (
                        <div key={year} className="flex gap-2 items-center mb-2">
                           <span className="text-xs font-bold text-slate-500 w-10">20{year}</span>
                           <Input placeholder="매출액" type="number" value={form[`fin_${year}_sales`]} onChange={v => setForm({...form, [`fin_${year}_sales`]: v})} />
                           <Input placeholder="영업이익" type="number" value={form[`fin_${year}_profit`]} onChange={v => setForm({...form, [`fin_${year}_profit`]: v})} />
                        </div>
                     ))}
                  </Section>

                  <Section title="계약 조건 & 교육" icon={PencilIcon}>
                     <div className="grid grid-cols-2 gap-2">
                        <Input label="최초 계약(년)" type="number" value={form.term_initial} onChange={v => setForm({...form, term_initial: v})} />
                        <Input label="연장 계약(년)" type="number" value={form.term_renewal} onChange={v => setForm({...form, term_renewal: v})} />
                     </div>
                     <Input label="갱신 비용" value={form.renewal_cost} onChange={v => setForm({...form, renewal_cost: v})} />
                     
                     <div className="bg-slate-100 p-3 rounded-lg my-2 space-y-2">
                        <h5 className="text-xs font-bold text-indigo-500 flex items-center gap-1"><AcademicCapIcon className="w-3 h-3"/> 교육 및 훈련 (신규 추가)</h5>
                        <div className="grid grid-cols-2 gap-2">
                           <Input label="교육 기간(일)" type="number" value={form.training_days} onChange={v => setForm({...form, training_days: v})} />
                           <Input label="비용 부담 주체" value={form.training_cost_bearer} onChange={v => setForm({...form, training_cost_bearer: v})} placeholder="예: 가맹점주" />
                        </div>
                        <Input label="교육 내용 상세" value={form.training_contents} onChange={v => setForm({...form, training_contents: v})} />
                     </div>

                     <div className="bg-slate-100 p-3 rounded-lg my-2 space-y-2">
                        <h5 className="text-xs font-bold text-indigo-500 flex items-center gap-1"><MegaphoneIcon className="w-3 h-3"/> 마케팅/품질 (신규 추가)</h5>
                        <Input label="광고비 분담 비율" value={form.marketing_ratio} onChange={v => setForm({...form, marketing_ratio: v})} placeholder="본사 50 : 점주 50" />
                        <Input label="마케팅 내용" value={form.marketing_desc} onChange={v => setForm({...form, marketing_desc: v})} />
                        <div className="flex items-center gap-2 mt-2">
                           <span className="text-xs font-bold text-slate-500">가격 통제:</span>
                           <select className="border p-1 rounded text-xs" value={form.price_control} onChange={e => setForm({...form, price_control: e.target.value})}>
                              <option value="false">자율 (권장가 없음)</option><option value="true">통제 (권장가 있음)</option>
                           </select>
                        </div>
                     </div>

                     <div className="flex gap-2 mt-3 pt-3 border-t">
                        <select className="border p-2 rounded text-sm w-1/3" value={form.area_protection} onChange={e => setForm({...form, area_protection: e.target.value})}>
                           <option value="true">영업지역 보호함</option><option value="false">보호 안함</option>
                        </select>
                        <Input placeholder="보호 내용 (예: 반경 500m)" value={form.area_desc} onChange={v => setForm({...form, area_desc: v})} />
                     </div>
                  </Section>
                  
                  <Section title="법적 리스크" icon={ExclamationTriangleIcon}>
                     <div className="flex gap-2 mb-2">
                        <select className="border p-2 rounded text-sm w-1/3" value={form.has_violation} onChange={e => setForm({...form, has_violation: e.target.value})}>
                           <option value="false">위반 없음</option><option value="true">위반 있음</option>
                        </select>
                        <Input placeholder="위반 내역 상세" value={form.violation_detail} onChange={v => setForm({...form, violation_detail: v})} />
                     </div>
                  </Section>
               </div>

            </div>
            
            <div className="p-6 border-t bg-white flex justify-end gap-2 rounded-b-2xl">
              <button onClick={() => setIsEditing(false)} className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100">취소</button>
              <button onClick={handleSave} disabled={uploading} className="px-8 py-3 rounded-xl font-bold text-white bg-slate-900 hover:bg-slate-800 flex items-center gap-2">
                 {uploading ? '업로드 중...' : <><CheckIcon className="w-5 h-5" /> 저장</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Section({ title, icon: Icon, children }: any) {
   return (
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
         <h4 className="font-bold text-slate-800 text-sm mb-4 flex items-center gap-2 uppercase"><Icon className="w-4 h-4 text-indigo-500"/>{title}</h4>
         <div className="space-y-3">{children}</div>
      </div>
   )
}

function Input({ label, value, onChange, placeholder, type = 'text' }: any) {
  return (
    <div className="w-full">
      {label && <label className="text-[10px] font-bold text-slate-400 mb-1 block">{label}</label>}
      <input type={type} className="w-full border border-slate-200 bg-slate-50 p-2 rounded-lg text-sm outline-none focus:border-indigo-500 transition-all" value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}