'use client';

import {
  ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area
} from 'recharts';

const formatMoney = (val: number) => {
  if (val >= 100000000) return `${(val / 100000000).toFixed(1)}억`;
  return `${(val / 10000).toLocaleString()}만`;
};

// 1. 브랜드 성장률 그래프 (Area Chart)
export function BrandGrowthChart({ data }: { data: number[] }) {
  const chartData = data.map((val, i) => ({ month: `${i + 1}월`, value: val }));
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <h3 className="text-lg font-bold text-slate-900 mb-4">📈 브랜드 성장률 (최근 6개월)</h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
            <YAxis tick={{fontSize: 12}} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{borderRadius: '8px', border:'none', boxShadow:'0 4px 6px -1px rgba(0,0,0,0.1)'}} />
            <Area type="monotone" dataKey="value" stroke="#6366f1" fillOpacity={1} fill="url(#colorGrowth)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// 2. 가맹점 수 추이 (Bar Chart)
export function StoreTrendChart({ data }: { data: {year: number, count: number}[] }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <h3 className="text-lg font-bold text-slate-900 mb-4">🏪 연도별 가맹점 수</h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="year" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
            <YAxis tick={{fontSize: 12}} axisLine={false} tickLine={false} />
            <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '8px'}} />
            <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={30} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// 3. 핵심 지표 카드 4종
export function KeyMetrics({ data }: { data: any }) {
  const metrics = [
    { label: '평균 매출 (연)', value: formatMoney(data.avgSales), color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: '평균 수익률', value: `${data.profitMargin}%`, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: '평균 순이익 (월)', value: formatMoney(data.netProfit), color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: '총 창업비용', value: formatMoney(data.startupCostTotal), color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {metrics.map((m, idx) => (
        <div key={idx} className={`${m.bg} p-5 rounded-2xl border border-slate-100/50`}>
          <p className="text-xs text-slate-500 mb-1 font-medium">{m.label}</p>
          <p className={`text-xl font-extrabold ${m.color}`}>{m.value}</p>
        </div>
      ))}
    </div>
  );
}

// 4. 본사 정보 및 문의
export function HqInfo({ data }: { data: any }) {
  return (
    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
      <h3 className="text-lg font-bold text-slate-900 mb-4">🏢 가맹 본부 정보</h3>
      <ul className="space-y-3 text-sm text-slate-600 mb-6">
        <li className="flex justify-between"><span className="text-slate-400">상호명</span> <span className="font-medium text-slate-800">{data.hqName}</span></li>
        <li className="flex justify-between"><span className="text-slate-400">소재지</span> <span className="font-medium text-slate-800">{data.hqAddress}</span></li>
        <li className="flex justify-between"><span className="text-slate-400">대표전화</span> <span className="font-medium text-slate-800">{data.hqPhone}</span></li>
        <li className="flex justify-between"><span className="text-slate-400">홈페이지</span> <a href={data.url} target="_blank" className="text-indigo-600 hover:underline truncate max-w-[200px]">{data.url}</a></li>
      </ul>
      <button 
        onClick={() => alert('관리자에게 창업 문의가 접수되었습니다.')}
        className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg"
      >
        가맹 상담 문의하기
      </button>
    </div>
  );
}