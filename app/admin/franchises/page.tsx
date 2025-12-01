'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  MagnifyingGlassIcon, StarIcon, PencilIcon, 
  ArrowPathIcon, TrashIcon, PlusIcon, ArrowLeftIcon, PhotoIcon 
} from '@heroicons/react/24/solid';

// [핵심 수정] 환경변수가 없으면 임시 주소라도 넣어서 빌드가 터지지 않게 방어!
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';
const supabase = createClient(supabaseUrl, supabaseKey);

type Franchise = {
  id: number;
  brand_name: string;
  category: string;
  stores_total: number;
  average_sales: number;
  startup_cost: number;
  is_recommended: boolean;
  manual_pros?: string[];
  manual_cons?: string[];
  hq_phone?: string;
  hq_url?: string;
};

export default function AdminFranchisePage() {
  const [list, setList] = useState<Franchise[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [isEditing, setIsEditing] = useState<any>(null);

  const fetchList = async () => {
    // [방어 코드] 실제 키가 없을 땐 실행 안 함
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return;

    setLoading(true);
    let query = supabase
      .from('franchises')
      .select('*')
      .order('is_recommended', { ascending: false })
      .order('brand_name', { ascending: true })
      .limit(50);
    
    if (search) {
      query = query.ilike('brand_name', `%${search}%`);
    }

    const { data, error } = await query;
    if (error) console.error(error);
    if (data) setList(data);
    setLoading(false);
  };

  useEffect(() => { fetchList(); }, []);

  const toggleRecommend = async (id: number, current: boolean) => {
    const { error } = await supabase.from('franchises').update({ is_recommended: !current }).eq('id', id);
    if (!error) {
      setList(list.map(item => item.id === id ? { ...item, is_recommended: !current } : item));
    }
  };

  const handleSave = async () => {
    if (!isEditing) return;
    
    const payload = {
      brand_name: isEditing.brand_name,
      hq_phone: isEditing.hq_phone,
      hq_url: isEditing.hq_url,
      manual_pros: typeof isEditing.manual_pros === 'string' ? isEditing.manual_pros.split(',').map((s: string) => s.trim()) : isEditing.manual_pros,
      manual_cons: typeof isEditing.manual_cons === 'string' ? isEditing.manual_cons.split(',').map((s: string) => s.trim()) : isEditing.manual_cons,
    };

    const { error } = await supabase.from('franchises').update(payload).eq('id', isEditing.id);

    if (!error) {
      alert('수정되었습니다.');
      setIsEditing(null);
      fetchList();
    } else {
      alert('저장 실패: ' + error.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('삭제하시겠습니까?')) return;
    await supabase.from('franchises').delete().eq('id', id);
    fetchList();
  };

  const generateMockData = async () => {
    if (!confirm('테스트 데이터 10개를 생성하시겠습니까?')) return;
    setLoading(true);

    const mocks = Array.from({ length: 10 }).map((_, i) => ({
      brand_name: `테스트 브랜드 ${i+1}`,
      category: i % 2 === 0 ? '한식' : '카페',
      stores_total: Math.floor(Math.random() * 500),
      average_sales: Math.floor(Math.random() * 500000000),
      startup_cost: Math.floor(Math.random() * 100000000),
      is_recommended: i < 3,
      manual_pros: [],
      manual_cons: [],
      hq_phone: '',
      hq_url: ''
    }));

    const { error } = await supabase.from('franchises').insert(mocks);
    setLoading(false);

    if (error) {
      alert('생성 실패! 원인: ' + error.message);
      console.error(error);
    } else {
      alert('성공! 데이터가 추가되었습니다.');
      fetchList();
    }
  };

  const handleEditStart = (item: Franchise) => {
     setIsEditing({
        ...item,
        manual_pros: item.manual_pros?.join(', ') || '',
        manual_cons: item.manual_cons?.join(', ') || ''
     });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">프랜차이즈 DB 관리</h2>
        <div className="flex gap-2">
          <button onClick={generateMockData} className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-200 rounded-lg hover:bg-slate-300 transition-colors flex items-center gap-2">
            🧪 테스트 데이터 생성
          </button>
          <button className="px-4 py-2 text-sm font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-sm flex items-center gap-2 opacity-50 cursor-not-allowed">
            <ArrowPathIcon className="w-4 h-4" /> 공공데이터 동기화 (준비중)
          </button>
        </div>
      </div>

      <div className="relative">
        <input 
          type="text" 
          placeholder="브랜드명 검색..." 
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && fetchList()}
        />
        <MagnifyingGlassIcon className="w-5 h-5 text-slate-400 absolute left-3 top-3.5" />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 font-bold border-b">
            <tr>
              <th className="p-4 w-16 text-center">Pick</th>
              <th className="p-4">브랜드명</th>
              <th className="p-4">업종</th>
              <th className="p-4 text-right">가맹점수</th>
              <th className="p-4 text-right">평균매출</th>
              <th className="p-4 text-center">관리</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="p-10 text-center text-slate-500">로딩 중...</td></tr>
            ) : list.length === 0 ? (
              <tr><td colSpan={6} className="p-10 text-center text-slate-400">데이터가 없습니다.</td></tr>
            ) : (
              list.map((item) => (
                <tr key={item.id} className={`border-b last:border-0 hover:bg-slate-50 transition-colors ${item.is_recommended ? 'bg-indigo-50/30' : ''}`}>
                  <td className="p-4 text-center">
                    <button onClick={() => toggleRecommend(item.id, item.is_recommended)}>
                      <StarIcon className={`w-6 h-6 transition-colors ${item.is_recommended ? 'text-yellow-400' : 'text-slate-200 hover:text-yellow-300'}`} />
                    </button>
                  </td>
                  <td className="p-4 font-bold text-slate-900">
                    {item.brand_name}
                    {item.is_recommended && <span className="ml-2 text-[10px] bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded font-bold">추천</span>}
                  </td>
                  <td className="p-4 text-slate-500">{item.category}</td>
                  <td className="p-4 text-right font-medium">{item.stores_total?.toLocaleString()}개</td>
                  <td className="p-4 text-right font-medium">
                    {item.average_sales > 100000000 
                      ? `${(item.average_sales / 100000000).toFixed(1)}억` 
                      : item.average_sales.toLocaleString()}
                  </td>
                  <td className="p-4 text-center flex justify-center gap-2">
                    <button onClick={() => setIsEditing(item)} className="p-2 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors">
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 수정 모달 */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-2xl animate-fadeInUp max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 border-b pb-2">
               <h3 className="text-lg font-bold">브랜드 정보 수정</h3>
               <button onClick={() => setIsEditing(null)}><ArrowLeftIcon className="w-5 h-5 text-slate-400"/></button>
            </div>
            
            <div className="space-y-6">
              {/* 기본 정보 */}
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">브랜드명</label>
                <input 
                  className="w-full border border-slate-300 p-2.5 rounded-lg text-sm focus:border-indigo-500 outline-none" 
                  value={isEditing.brand_name || ''} 
                  onChange={e => setIsEditing({...isEditing, brand_name: e.target.value})} 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">본사 전화</label>
                    <input className="w-full border p-2.5 rounded-lg text-sm" value={isEditing.hq_phone || ''} onChange={e => setIsEditing({...isEditing, hq_phone: e.target.value})} />
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">홈페이지 URL</label>
                    <input className="w-full border p-2.5 rounded-lg text-sm" value={isEditing.hq_url || ''} onChange={e => setIsEditing({...isEditing, hq_url: e.target.value})} />
                 </div>
              </div>

              <div>
                 <label className="block text-xs font-bold text-slate-500 mb-1">강점 (Pros) - 쉼표 구분</label>
                 <textarea 
                    className="w-full border p-2.5 rounded-lg text-sm h-20 resize-none" 
                    placeholder="가맹비 면제, 높은 수익률..."
                    value={isEditing.manual_pros || ''} 
                    onChange={e => setIsEditing({...isEditing, manual_pros: e.target.value})} 
                 />
              </div>

              <div>
                 <label className="block text-xs font-bold text-slate-500 mb-1">유의점 (Cons) - 쉼표 구분</label>
                 <textarea 
                    className="w-full border p-2.5 rounded-lg text-sm h-20 resize-none" 
                    placeholder="초기 비용 높음, 경쟁 심화..."
                    value={isEditing.manual_cons || ''} 
                    onChange={e => setIsEditing({...isEditing, manual_cons: e.target.value})} 
                 />
              </div>
            </div>

            <div className="flex gap-2 mt-8 border-t pt-4">
              <button onClick={handleSave} className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors">저장하기</button>
              <button onClick={() => setIsEditing(null)} className="flex-1 bg-slate-100 text-slate-600 py-3 rounded-xl font-bold hover:bg-slate-200 transition-colors">취소</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}