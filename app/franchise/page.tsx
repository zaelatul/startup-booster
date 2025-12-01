// web/app/franchise/page.tsx
'use client';

import React from 'react';
import { 
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, 
  BarChart, CartesianGrid, XAxis, YAxis, Bar, 
  LineChart, Line, ReferenceLine 
} from 'recharts';
import Header from '@/components/Header'; // 헤더가 있다면 사용, 없으면 주석

export default function FranchiseDetail() {
  // 1. 비용 구조 데이터
  const costData = [
    { name: '가맹비', value: 1000, color: '#3B82F6' }, // Blue-500
    { name: '교육비', value: 500, color: '#10B981' },  // Emerald-500
    { name: '보증금', value: 200, color: '#F59E0B' },  // Amber-500
    { name: '인테리어', value: 3000, color: '#6366F1' }, // Indigo-500
    { name: '기타', value: 1100, color: '#94A3B8' },  // Slate-400
  ];

  // 2. 매출 추이 데이터
  const salesTrendData = [
    { month: '1월', sales: 2800 },
    { month: '2월', sales: 2600 },
    { month: '3월', sales: 3200 },
    { month: '4월', sales: 3800 },
    { month: '5월', sales: 4200 },
    { month: '6월', sales: 3900 },
  ];

  // 3. 매출 분포 데이터 (상위 vs 하위)
  const distributionData = [
    { name: '상위 20%', value: 5800 },
    { name: '전체 평균', value: 3500 },
    { name: '하위 20%', value: 1800 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 헤더 영역 */}
      <div className="bg-white border-b border-gray-100 h-16 flex items-center px-4 sticky top-0 z-50">
         <span className="font-bold text-lg">창업부스터</span>
      </div>
      
      <main className="max-w-4xl mx-auto pt-8 px-4">
        {/* 브랜드 타이틀 */}
        <section className="mb-8">
           <h1 className="text-3xl font-bold text-gray-900 mb-2">메가커피</h1>
           <p className="text-gray-500 text-lg">카페/디저트 | 가맹점 수 1위 브랜드</p>
        </section>

        <div className="grid md:grid-cols-2 gap-6">
          
          {/* 1. 예상 비용 구조 (도넛 차트 + 수치 박스) */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold mb-6 text-gray-900">예상 창업 비용 상세</h2>
            <div className="h-64 relative">
               <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                   <Pie 
                     data={costData} 
                     cx="50%" cy="50%" 
                     innerRadius={60} outerRadius={80} 
                     paddingAngle={5} 
                     dataKey="value"
                   >
                     {costData.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={entry.color} />
                     ))}
                   </Pie>
                   <Tooltip />
                 </PieChart>
               </ResponsiveContainer>
               {/* 가운데 총액 표시 */}
               <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                 <span className="text-sm text-gray-500">총 예상 비용</span>
                 <span className="text-xl font-bold text-blue-600">5,800만원</span>
               </div>
            </div>
            
            {/* 하단 수치 리스트 */}
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
              {costData.map((item) => (
                <div key={item.name} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                   <div className="flex items-center gap-2">
                     <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                     <span className="text-gray-600">{item.name}</span>
                   </div>
                   <span className="font-bold text-gray-900">{item.value.toLocaleString()}만</span>
                </div>
              ))}
            </div>
          </section>

          {/* 2. 매출 분포 (가로 막대 그래프) */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
            <h2 className="text-lg font-bold mb-2 text-gray-900">매출 분포 (상위 vs 하위)</h2>
            <p className="text-xs text-gray-500 mb-6 text-right">* 가맹점 월 평균 매출 기준</p>
            <div className="flex-grow min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={distributionData} margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={70} />
                  <Tooltip cursor={{fill: 'transparent'}} formatter={(value: number) => `${value.toLocaleString()}만원`} />
                  <Bar dataKey="value" barSize={30} radius={[0, 5, 5, 0]}>
                    {distributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#3B82F6' : index === 2 ? '#94A3B8' : '#64748B'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 p-3 bg-blue-50 text-blue-800 text-sm rounded-lg text-center font-medium">
               상위 20% 매장은 평균 대비 <span className="font-bold">1.6배</span> 높은 매출을 기록하고 있습니다.
            </div>
          </section>
          
        </div>

        {/* 3. 가맹점 평균 매출 추이 (전체 너비) */}
        <section className="mt-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-end mb-6">
             <h2 className="text-lg font-bold text-gray-900">가맹점 평균 매출 추이</h2>
             <span className="text-xs text-gray-500">* 점선은 전년도 동일 평균을 나타냅니다.</span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesTrendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `${v/1000}천`} />
                <Tooltip formatter={(value: number) => `${value.toLocaleString()}만원`} />
                {/* 기준선 (점선) */}
                <ReferenceLine y={3000} stroke="red" strokeDasharray="3 3" label={{ position: 'right', value: '손익분기점', fill: 'red', fontSize: 12 }} />
                <Line type="monotone" dataKey="sales" stroke="#3B82F6" strokeWidth={3} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* 4. 하단 CTA (텍스트 수정 완료) */}
        <section className="mt-8 bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-8 text-center text-white">
           <h3 className="text-xl font-bold mb-2">전문가에게 상세 견적 받기</h3>
           <p className="text-gray-300 mb-6 text-sm leading-relaxed whitespace-pre-line">
             계산된 예상 견적을 바탕으로 더 정확한 내용이 필요하시면 문의 주시기 바랍니다.<br/>
             상세한 견적을 메일로 안내드리겠습니다.
           </p>
           <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-xl transition-all">
             무료 견적 상담 신청
           </button>
        </section>

      </main>
    </div>
  );
}