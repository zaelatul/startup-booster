'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  MagnifyingGlassIcon, PencilIcon, TrashIcon, 
  PlusIcon, ChevronLeftIcon, ChevronRightIcon 
} from '@heroicons/react/24/outline';
import { FRANCHISE_CATEGORIES } from '@/lib/franchise-data';
// [중요] 방금 만든 모달 컴포넌트 불러오기
import FranchiseFormModal from '@/components/admin/FranchiseFormModal';

// 👇 [수정됨] 여기가 핵심입니다! (환경변수 없으면 가짜 값이라도 넣어서 빌드 통과시킴)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

const supabase = createClient(supabaseUrl, supabaseKey);

const ITEMS_PER_PAGE = 10;

export default function AdminFranchisePage() {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('전체');
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // 모달 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null); // 수정할 데이터

  const fetchList = async () => {
    setLoading(true);
    let query = supabase.from('franchises').select('*', { count: 'exact' });

    if (search) query = query.ilike('name', `%${search}%`);
    if (categoryFilter !== '전체') query = query.eq('category', categoryFilter);

    const from = (page - 1) * ITEMS_PER_PAGE;
    const to = from + ITEMS_PER_PAGE - 1;

    const { data, count, error } = await query
        .order('priority', { ascending: false }) // 우선순위 반영
        .order('created_at', { ascending: false })
        .range(from, to);

    if (!error) {
        setList(data || []);
        setTotalCount(count || 0);
    }
    setLoading(false);
  };

  useEffect(() => { fetchList(); }, [page, categoryFilter]); 

  const handleSearch = () => { setPage(1); fetchList(); };
  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === 'Enter') handleSearch(); };

  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    await supabase.from('franchises').delete().eq('id', id);
    fetchList();
  };

  // 모달 열기 (신규 등록)
  const openNewModal = () => {
      setSelectedItem(null); // 초기화
      setIsModalOpen(true);
  };

  // 모달 열기 (수정)
  const openEditModal = (item: any) => {
      setSelectedItem(item); // 데이터 전달
      setIsModalOpen(true);
  };

  // 모달 닫기 및 저장 성공 시 처리
  const handleModalClose = () => setIsModalOpen(false);
  const handleModalSuccess = () => {
      setIsModalOpen(false);
      fetchList(); // 목록 갱신
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-200 gap-4">
        <div>
            <h2 className="text-2xl font-black text-slate-900">프랜차이즈 DB 관리</h2>
            <p className="text-slate-500 text-sm mt-1">총 <span className="font-bold text-indigo-600">{totalCount}개</span></p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
            <select 
                value={categoryFilter} 
                onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
                className="bg-slate-50 border border-slate-200 text-sm rounded-xl p-2.5 outline-none focus:border-indigo-500 font-bold text-slate-600"
            >
                <option value="전체">전체 업종</option>
                {FRANCHISE_CATEGORIES.slice(1).map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
            </select>

            <div className="relative w-full md:w-64">
                <input 
                    type="text" 
                    placeholder="브랜드명 검색" 
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500 transition-all"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <MagnifyingGlassIcon className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer" onClick={handleSearch}/>
            </div>

            <button onClick={openNewModal} className="px-4 py-2.5 text-sm font-bold text-white bg-slate-900 rounded-xl hover:bg-slate-800 shadow-lg flex items-center justify-center gap-2 whitespace-nowrap">
                <PlusIcon className="w-4 h-4" /> 신규 등록
            </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase text-xs">
            <tr><th className="p-4 pl-6">브랜드명</th><th className="p-4">업종</th><th className="p-4 text-right">가맹점수</th><th className="p-4 text-center">관리</th></tr>
          </thead>
          <tbody>
            {loading ? (
                <tr><td colSpan={4} className="p-10 text-center text-slate-400">로딩 중...</td></tr>
            ) : list.length === 0 ? (
                <tr><td colSpan={4} className="p-10 text-center text-slate-400">데이터가 없습니다.</td></tr>
            ) : (
                list.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 border-b last:border-0 transition-colors">
                    <td className="p-4 pl-6">
                        <div className="font-bold text-slate-900 text-base">{item.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5 truncate w-24">{item.id}</div>
                    </td>
                    <td className="p-4"><span className="px-2.5 py-1 bg-slate-100 rounded-md text-xs font-bold text-slate-600">{item.category}</span></td>
                    <td className="p-4 text-right font-bold text-slate-700">{item.store_summary?.total?.toLocaleString() ?? '-'}개</td>
                    <td className="p-4 text-center flex justify-center gap-2">
                    <button onClick={() => openEditModal(item)} className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 bg-slate-100 rounded-lg transition-colors"><PencilIcon className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(item.id)} className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 bg-slate-100 rounded-lg transition-colors"><TrashIcon className="w-4 h-4" /></button>
                    </td>
                </tr>
                ))
            )}
          </tbody>
        </table>
        
        {/* 페이지네이션 */}
        {!loading && totalCount > 0 && (
            <div className="flex justify-center items-center gap-2 p-4 border-t border-slate-100 bg-slate-50/50">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-2 rounded-lg hover:bg-slate-200 disabled:opacity-30 transition-all"><ChevronLeftIcon className="w-4 h-4" /></button>
                <span className="text-sm font-bold text-slate-600 mx-2">{page} / {totalPages} 페이지</span>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-2 rounded-lg hover:bg-slate-200 disabled:opacity-30 transition-all"><ChevronRightIcon className="w-4 h-4" /></button>
            </div>
        )}
      </div>

      {/* 팝업 모달 (분리된 컴포넌트 호출) */}
      {isModalOpen && (
        <FranchiseFormModal 
            initialData={selectedItem} 
            onClose={handleModalClose} 
            onSuccess={handleModalSuccess} 
        />
      )}
    </div>
  );
}