export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">관리자 대시보드</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <p className="text-sm text-slate-500">총 방문자 (오늘)</p>
          <p className="text-3xl font-extrabold text-slate-900 mt-2">1,204명</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <p className="text-sm text-slate-500">신규 상담 문의</p>
          <p className="text-3xl font-extrabold text-indigo-600 mt-2">5건</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <p className="text-sm text-slate-500">등록된 브랜드</p>
          <p className="text-3xl font-extrabold text-slate-900 mt-2">120개</p>
        </div>
      </div>
      <div className="bg-indigo-50 p-8 rounded-2xl border border-indigo-100 text-center">
        <p className="text-indigo-900 font-bold mb-2">👋 환영합니다, 관리자님!</p>
        <p className="text-sm text-indigo-700">왼쪽 메뉴에서 관리할 항목을 선택해주세요.</p>
      </div>
    </div>
  );
}