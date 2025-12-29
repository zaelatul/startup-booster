'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  ArrowLeftIcon, PhotoIcon, ChartBarIcon, 
  CloudArrowUpIcon, PlusIcon, ChatBubbleBottomCenterTextIcon
} from '@heroicons/react/24/solid';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// 데이터 안전 변환 함수
const safeParse = (data: any) => {
  if (typeof data === 'string') {
    try { return JSON.parse(data); } catch (e) { return null; }
  }
  return data;
};

export default function AdminSuccessCasesPage() {
  const [list, setList] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const fetchList = async () => {
    setLoading(true);
    const { data } = await supabase.from('success_cases').select('*').order('created_at', { ascending: false });
    if (data) setList(data);
    setLoading(false);
  };

  useEffect(() => { fetchList(); }, []);

  // [수정] 파일명 난수화 함수 (한글 깨짐 방지)
  const generateSafeFileName = (originalName: string) => {
    const fileExt = originalName.split('.').pop();
    const randomString = Math.random().toString(36).substring(2, 10);
    return `${Date.now()}_${randomString}.${fileExt}`;
  };

  const handleEdit = (item: any) => {
    const json = item.analysis_json || {};
    const ft = json.footTraffic || {};
    const day = (d: string) => ft.dayRatio?.find((x: any) => x.day === d)?.value || 0;
    const time = (t: string) => ft.timeRatio?.find((x: any) => x.time === t)?.value || 0;

    const safeStoreImages = (item.store_images || []).map((img: any) => safeParse(img) || { url: '', label: '매장' });
    const safeMenuImages = (item.menu_images || []).map((img: any) => safeParse(img) || { url: '', label: '메뉴' });

    setForm({
      id: item.id,
      brand_name: item.brand_name,
      branch_name: item.branch_name,
      area: item.area,
      startup_year: item.startup_year,
      monthly_sales: item.monthly_sales,
      net_profit: item.net_profit,
      invest_cost: item.invest_cost,
      profit_margin: item.profit_margin,
      deposit: item.deposit,
      monthly_rent: item.monthly_rent,
      store_size: item.store_size,
      metrics_comment: item.metrics_comment, 
      summary: item.summary,
      success_point: item.success_point,
      owner_comment: item.owner_comment,
      main_image: item.main_image,
      store_images: safeStoreImages,
      menu_images: safeMenuImages,
      q1: json.quarterlyRevenue?.[0] || 0,
      q2: json.quarterlyRevenue?.[1] || 0,
      q3: json.quarterlyRevenue?.[2] || 0,
      q4: json.quarterlyRevenue?.[3] || 0,
      quarterComment: json.quarterComment, 
      ft_dailyAvg: ft.dailyAvg || 0,
      ft_trafficLevel: ft.trafficLevel || '보통', 
      ft_competitors: ft.competitors || 0,
      ft_competitorLevel: ft.competitorLevel || '보통',
      ft_comment: ft.comment,
      ft_week: ft.weekRatio?.week || 70,
      ft_weekend: ft.weekRatio?.weekend || 30,
      ft_day_mon: day('월'), ft_day_tue: day('화'), ft_day_wed: day('수'),
      ft_day_thu: day('목'), ft_day_fri: day('금'), ft_day_sat: day('토'), ft_day_sun: day('일'),
      ft_time_05: time('05~09'), ft_time_09: time('09~12'), ft_time_12: time('12~14'),
      ft_time_14: time('14~18'), ft_time_18: time('18~23'), ft_time_23: time('23~05')
    });
    setIsEditing(true);
  };

  const handleCreate = () => {
    setForm({ 
        store_images: [], menu_images: [], 
        q1:0, q2:0, q3:0, q4:0, 
        ft_dailyAvg:0, ft_competitors:0,
        ft_week: 70, ft_weekend: 30, 
        ft_day_mon:15, ft_day_tue:15, ft_day_wed:15, ft_day_thu:15, ft_day_fri:20, ft_day_sat:10, ft_day_sun:10,
        ft_time_05: 5, ft_time_09: 15, ft_time_12: 25, ft_time_14: 20, ft_time_18: 25, ft_time_23: 10
    });
    setIsEditing(true);
  }

  const handleSave = async () => {
    if (!form.brand_name) return alert('브랜드명은 필수입니다!');

    const payload = {
      brand_name: form.brand_name,
      branch_name: form.branch_name,
      area: form.area,
      startup_year: form.startup_year,
      monthly_sales: Number(form.monthly_sales),
      net_profit: Number(form.net_profit),
      invest_cost: Number(form.invest_cost),
      profit_margin: Number(form.profit_margin),
      deposit: Number(form.deposit),
      monthly_rent: Number(form.monthly_rent),
      store_size: Number(form.store_size),
      metrics_comment: form.metrics_comment,
      summary: form.summary,
      success_point: form.success_point,
      owner_comment: form.owner_comment,
      main_image: form.main_image,
      store_images: form.store_images,
      menu_images: form.menu_images,
      analysis_json: {
        quarterlyRevenue: [Number(form.q1), Number(form.q2), Number(form.q3), Number(form.q4)],
        quarterComment: form.quarterComment, 
        footTraffic: {
           dailyAvg: Number(form.ft_dailyAvg),
           trafficLevel: form.ft_trafficLevel,
           competitors: Number(form.ft_competitors),
           competitorLevel: form.ft_competitorLevel,
           comment: form.ft_comment, 
           weekRatio: { week: Number(form.ft_week), weekend: Number(form.ft_weekend) },
           dayRatio: [
             { day: '월', value: Number(form.ft_day_mon) }, { day: '화', value: Number(form.ft_day_tue) },
             { day: '수', value: Number(form.ft_day_wed) }, { day: '목', value: Number(form.ft_day_thu) },
             { day: '금', value: Number(form.ft_day_fri) }, { day: '토', value: Number(form.ft_day_sat) },
             { day: '일', value: Number(form.ft_day_sun) }
           ],
           timeRatio: [
             { time: '05~09', value: Number(form.ft_time_05) }, { time: '09~12', value: Number(form.ft_time_09) },
             { time: '12~14', value: Number(form.ft_time_12) }, { time: '14~18', value: Number(form.ft_time_14) },
             { time: '18~23', value: Number(form.ft_time_18) }, { time: '23~05', value: Number(form.ft_time_23) }
           ]
        }
      }
    };

    if (form.id) {
      await supabase.from('success_cases').update(payload).eq('id', form.id);
    } else {
      await supabase.from('success_cases').insert([payload]);
    }
    alert('✅ 저장되었습니다!');
    setIsEditing(false);
    fetchList();
  };

  const handleFileWithLabelChange = async (e: any, field: string, index: number, target: 'url' | 'label') => {
    const newArr = form[field] ? [...form[field]] : [];
    let currentItem = newArr[index];
    if (typeof currentItem === 'string') currentItem = safeParse(currentItem);
    if (!currentItem) currentItem = { url: '', label: field === 'store_images' ? '매장' : '메뉴' };

    if (target === 'url') {
       if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          // [수정] 파일명 난수화 적용
          const fileName = `success-cases/${generateSafeFileName(file.name)}`;
          const { data } = await supabase.storage.from('uploads').upload(fileName, file);
          const { data: publicData } = supabase.storage.from('uploads').getPublicUrl(fileName);
          currentItem.url = publicData.publicUrl;
       }
    } else {
       currentItem.label = e;
    }
    newArr[index] = currentItem;
    setForm({ ...form, [field]: newArr });
  };

  if (isEditing) {
    return (
      <div className="max-w-5xl bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-8 border-b pb-4">
          <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-slate-100 rounded-full"><ArrowLeftIcon className="w-5 h-5"/></button>
          <h2 className="text-xl font-bold text-slate-900">사례 수정/등록</h2>
          <button onClick={handleSave} className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 shadow-md">저장하기</button>
        </div>
        
        <div className="space-y-10">
          <section className="grid grid-cols-2 gap-6">
            <Input label="브랜드명" value={form.brand_name} onChange={(v:any) => setForm({...form, brand_name: v})} />
            <Input label="지점명" value={form.branch_name} onChange={(v:any) => setForm({...form, branch_name: v})} />
            <Input label="지역 (행정동)" value={form.area} onChange={(v:any) => setForm({...form, area: v})} />
            <Input label="창업년월 (예: 2023.05)" value={form.startup_year} onChange={(v:any) => setForm({...form, startup_year: v})} />
          </section>
          
          <section className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
            <h3 className="text-sm font-bold mb-4 text-indigo-600 uppercase flex items-center gap-2"><ChartBarIcon className="w-4 h-4"/> 핵심 지표</h3>
            <div className="grid grid-cols-4 gap-4 mb-4">
              <Input label="월 매출 (만원)" type="number" value={form.monthly_sales} onChange={(v:any) => setForm({...form, monthly_sales: v})} />
              <Input label="월 순수익 (만원)" type="number" value={form.net_profit} onChange={(v:any) => setForm({...form, net_profit: v})} />
              <Input label="총 창업비용 (만원)" type="number" value={form.invest_cost} onChange={(v:any) => setForm({...form, invest_cost: v})} />
              <Input label="매장 평수 (평)" type="number" value={form.store_size} onChange={(v:any) => setForm({...form, store_size: v})} />
              <Input label="보증금 (만원)" type="number" value={form.deposit} onChange={(v:any) => setForm({...form, deposit: v})} />
              <Input label="월세 (만원)" type="number" value={form.monthly_rent} onChange={(v:any) => setForm({...form, monthly_rent: v})} />
              <Input label="수익률 (%)" type="number" value={form.profit_margin} onChange={(v:any) => setForm({...form, profit_margin: v})} />
            </div>
            <div className="mt-4">
               <label className="text-xs font-bold text-indigo-600 ml-1 block mb-1.5 flex items-center gap-1"><ChatBubbleBottomCenterTextIcon className="w-3 h-3"/> 핵심 지표 분석 (상세 상단 노출)</label>
               <textarea className="w-full border p-3 rounded-xl text-sm min-h-[60px]" value={form.metrics_comment || ''} onChange={(e) => setForm({...form, metrics_comment: e.target.value})} placeholder="예: 평수 대비 높은 매출 효율을 보이며..." />
            </div>
          </section>

          <section className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
             <h3 className="text-sm font-bold mb-4 text-purple-600 uppercase">분기 매출 (계절성) - 단위: 만원</h3>
             <div className="grid grid-cols-4 gap-2 mb-3">
                 <Input label="1분기" type="number" value={form.q1} onChange={(v:any) => setForm({...form, q1: v})} />
                 <Input label="2분기" type="number" value={form.q2} onChange={(v:any) => setForm({...form, q2: v})} />
                 <Input label="3분기" type="number" value={form.q3} onChange={(v:any) => setForm({...form, q3: v})} />
                 <Input label="4분기" type="number" value={form.q4} onChange={(v:any) => setForm({...form, q4: v})} />
             </div>
             <div className="mt-2">
                <label className="text-xs font-bold text-purple-600 ml-1 block mb-1.5">매출 추이 분석</label>
                <textarea className="w-full border p-3 rounded-xl text-sm min-h-[60px]" value={form.quarterComment || ''} onChange={(e) => setForm({...form, quarterComment: e.target.value})} placeholder="예: 여름 성수기에 매출이 집중되며..." />
             </div>
          </section>

          <section className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
             <h3 className="text-sm font-bold mb-4 text-emerald-600 uppercase">상권 분석 데이터</h3>
             <div className="grid grid-cols-2 gap-4 mb-4">
                 <div className="flex gap-2">
                     <Input label="유동인구 (명)" type="number" value={form.ft_dailyAvg} onChange={(v:any) => setForm({...form, ft_dailyAvg: v})} />
                     <div className="w-32 pt-6"><select className="w-full border p-2.5 rounded-xl text-sm" value={form.ft_trafficLevel} onChange={e => setForm({...form, ft_trafficLevel: e.target.value})}><option value="매우 많음">매우 많음</option><option value="많음">많음</option><option value="보통">보통</option><option value="적음">적음</option></select></div>
                 </div>
                 <div className="flex gap-2">
                     <Input label="경쟁점 (개)" type="number" value={form.ft_competitors} onChange={(v:any) => setForm({...form, ft_competitors: v})} />
                     <div className="w-32 pt-6"><select className="w-full border p-2.5 rounded-xl text-sm" value={form.ft_competitorLevel} onChange={e => setForm({...form, ft_competitorLevel: e.target.value})}><option value="매우 치열">매우 치열</option><option value="치열">치열</option><option value="보통">보통</option><option value="약함">약함</option></select></div>
                 </div>
             </div>
             <div className="grid grid-cols-2 gap-4 mb-2">
                <div>
                    <label className="text-xs font-bold text-slate-500 mb-1 block">주중 vs 주말 (%)</label>
                    <div className="flex gap-2">
                        <input type="number" className="w-full border p-2 rounded-lg" placeholder="주중" value={form.ft_week} onChange={e => setForm({...form, ft_week: e.target.value})} />
                        <input type="number" className="w-full border p-2 rounded-lg" placeholder="주말" value={form.ft_weekend} onChange={e => setForm({...form, ft_weekend: e.target.value})} />
                    </div>
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-500 mb-1 block">요일별 (%)</label>
                    <div className="grid grid-cols-7 gap-1">
                        {['mon','tue','wed','thu','fri','sat','sun'].map(d => (
                            <input key={d} type="number" className="w-full border p-1 rounded text-center text-xs" value={form[`ft_day_${d}`]} onChange={e => setForm({...form, [`ft_day_${d}`]: e.target.value})} />
                        ))}
                    </div>
                </div>
             </div>
             <div className="mb-4">
                <label className="text-xs font-bold text-slate-500 mb-1 block">시간대별 유동인구 비율 (%)</label>
                <div className="grid grid-cols-6 gap-2">
                    <input type="number" className="border p-2 rounded-lg text-xs" placeholder="05~09" value={form.ft_time_05} onChange={e => setForm({...form, ft_time_05: e.target.value})} />
                    <input type="number" className="border p-2 rounded-lg text-xs" placeholder="09~12" value={form.ft_time_09} onChange={e => setForm({...form, ft_time_09: e.target.value})} />
                    <input type="number" className="border p-2 rounded-lg text-xs" placeholder="12~14" value={form.ft_time_12} onChange={e => setForm({...form, ft_time_12: e.target.value})} />
                    <input type="number" className="border p-2 rounded-lg text-xs" placeholder="14~18" value={form.ft_time_14} onChange={e => setForm({...form, ft_time_14: e.target.value})} />
                    <input type="number" className="border p-2 rounded-lg text-xs" placeholder="18~23" value={form.ft_time_18} onChange={e => setForm({...form, ft_time_18: e.target.value})} />
                    <input type="number" className="border p-2 rounded-lg text-xs" placeholder="23~05" value={form.ft_time_23} onChange={e => setForm({...form, ft_time_23: e.target.value})} />
                </div>
             </div>
             <div className="mt-2">
                <label className="text-xs font-bold text-emerald-600 ml-1 block mb-1.5">상권 입체 분석 (상세 노출)</label>
                <textarea className="w-full border p-3 rounded-xl text-sm min-h-[60px]" value={form.ft_comment || ''} onChange={(e) => setForm({...form, ft_comment: e.target.value})} placeholder="예: 오피스 상권이라 평일 점심 매출이..." />
             </div>
          </section>

          <section>
             <Input label="한줄 요약" value={form.summary} onChange={(v:any) => setForm({...form, summary: v})} />
             <div className="mt-4"><Input label="성공 포인트 (키워드)" value={form.success_point} onChange={(v:any) => setForm({...form, success_point: v})} /></div>
             <div className="mt-4">
                <label className="text-xs font-bold text-slate-500 ml-1 block mb-1.5">점주 인터뷰 (줄바꿈 가능)</label>
                <textarea className="w-full border p-3 rounded-xl text-sm min-h-[80px]" value={form.owner_comment || ''} onChange={(e) => setForm({...form, owner_comment: e.target.value})} />
             </div>
          </section>

          <section className="space-y-6 pt-4 border-t">
             <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2"><PhotoIcon className="w-4 h-4"/> 이미지 관리</h3>
             <div>
                <p className="text-xs font-bold text-slate-500 mb-2">메인 배경 (1장)</p>
                <ImageUploader value={form.main_image} onChange={async (e:any) => {
                    if (e.target.files?.[0]) {
                       const file = e.target.files[0];
                       // [수정] 파일명 난수화
                       const fileName = `success-cases/${generateSafeFileName(file.name)}`;
                       const { data } = await supabase.storage.from('uploads').upload(fileName, file);
                       const { data: publicData } = supabase.storage.from('uploads').getPublicUrl(fileName);
                       setForm({...form, main_image: publicData.publicUrl});
                    }
                }} />
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <p className="text-xs font-bold text-slate-500 mb-2">매장 이미지 (2장)</p>
                    <div className="space-y-2">
                       {[0, 1].map(i => (
                         <div key={i} className="flex gap-2">
                            <ImageUploader value={form.store_images?.[i]?.url} onChange={(e:any) => handleFileWithLabelChange(e, 'store_images', i, 'url')} placeholder={`매장 ${i+1}`} />
                            <select className="w-24 border rounded-xl text-xs text-center" value={form.store_images?.[i]?.label || '매장'} onChange={(e) => handleFileWithLabelChange(e.target.value, 'store_images', i, 'label')}>
                                <option value="매장">매장</option><option value="내부">내부</option>
                            </select>
                         </div>
                       ))}
                    </div>
                </div>
                <div>
                    <p className="text-xs font-bold text-slate-500 mb-2">메뉴/상품 이미지 (4장)</p>
                    <div className="grid grid-cols-2 gap-2">
                       {[0, 1, 2, 3].map(i => (
                          <div key={i} className="flex flex-col gap-1">
                             <ImageUploader value={form.menu_images?.[i]?.url} onChange={(e:any) => handleFileWithLabelChange(e, 'menu_images', i, 'url')} placeholder={`이미지 ${i+1}`} />
                             <select className="w-full border rounded-lg text-[10px] p-1 text-center" value={form.menu_images?.[i]?.label || '메뉴'} onChange={(e) => handleFileWithLabelChange(e.target.value, 'menu_images', i, 'label')}>
                                <option value="메뉴">메뉴</option><option value="상품">상품</option><option value="기타">기타</option>
                             </select>
                          </div>
                       ))}
                    </div>
                </div>
             </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">성공 사례 관리</h2>
        <button onClick={handleCreate} className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-md"><PlusIcon className="w-5 h-5" /> 사례 등록</button>
      </div>
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 font-bold border-b">
            <tr><th className="p-5 pl-8">브랜드 정보</th><th className="p-5">매출/순익 (단위:만원)</th><th className="p-5 text-right pr-8">관리</th></tr>
          </thead>
          <tbody>
            {list.map((item) => (
              <tr key={item.id} className="border-b hover:bg-slate-50 transition-colors">
                <td className="p-5 pl-8"><div className="font-bold text-slate-900">{item.brand_name}</div></td>
                <td className="p-5"><div className="font-bold">{item.monthly_sales}</div></td>
                <td className="p-5 text-right pr-8"><button onClick={() => handleEdit(item)} className="p-2 text-slate-400 hover:text-indigo-600 bg-slate-100 rounded-lg">수정</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, placeholder, type = 'text' }: any) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-xs font-bold text-slate-500 ml-1">{label}</label>
      <input type={type} className="w-full border border-slate-200 bg-slate-50 p-3 rounded-xl text-sm outline-none focus:border-indigo-500 transition-all" value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}

function ImageUploader({ value, onChange, placeholder }: any) {
  return (
    <label className="relative flex items-center gap-3 w-full h-16 bg-white border border-slate-200 rounded-xl p-2 cursor-pointer hover:border-indigo-400 transition-all overflow-hidden">
       <input type="file" className="hidden" accept="image/*" onChange={onChange} />
       <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center shrink-0 border border-slate-100 overflow-hidden">
          {value ? <img src={value} alt="preview" className="w-full h-full object-cover" /> : <CloudArrowUpIcon className="w-6 h-6 text-slate-300" />}
       </div>
       <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-slate-700 truncate">{value ? '변경' : (placeholder || '업로드')}</p>
       </div>
    </label>
  );
}