'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
 BanknotesIcon, 
 CheckBadgeIcon 
} from '@heroicons/react/24/solid';
import { 
 ResponsiveContainer, 
 PieChart, 
 Pie, 
 Cell, 
 Tooltip 
} from 'recharts';

const PIE_COLORS = ['#818CF8', '#34D399', '#F472B6', '#FBBF24'];

function Section({ title, icon: Icon, children }: any) {
 return (
     <section className="bg-slate-800 shadow-xl rounded-3xl border border-slate-700/50 overflow-hidden relative group">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-500/20 to-transparent"></div>
        <h3 className="text-sm md:text-xl font-black mb-4 md:mb-8 flex items-center gap-3 uppercase tracking-tight px-6 md:px-8 py-4 md:py-6 bg-slate-900/30 border-b border-slate-700/50 text-white">
            <Icon className="w-5 h-5 md:w-7 md:h-7 text-indigo-400"/> <span className="drop-shadow-md">{title}</span>
        </h3>
        <div className="px-4 md:px-8 pb-6 md:pb-10">{children}</div>
     </section>
  )
}

export default function CostTabContent({ data, fmtMoney }: { data: any, fmtMoney: any }) {
 const baseSizeM2 = data.baseSizeM2 || 50; 
 const [selectedSizeM2, setSelectedSizeM2] = useState<number>(baseSizeM2); 
  
 useEffect(() => {
      if(data.baseSizeM2) setSelectedSizeM2(data.baseSizeM2);
 }, [data.baseSizeM2]);

 const toPyeong = (m2: number) => Math.round(m2 / 3.3);

 const sizeOptions = useMemo(() => {
      const defaultSizes = [33, 50, 66, 83, 99, 132, 165, 198];
      if (!defaultSizes.includes(baseSizeM2)) {
          return [...defaultSizes, baseSizeM2].sort((a, b) => a - b);
      }
      return defaultSizes.sort((a, b) => a - b);
 }, [baseSizeM2]);

 const costs = data.initialCosts || { interior: 0, other: 0, joinFee: 0, eduFee: 0, deposit: 0 };
  
 // ✅ [수정] 이미 어드민 저장 시 인테리어비가 빠진 채 저장되므로, 여기서는 그대로 사용함 (이중 차감 방지)
 // 기타비용(other): 어드민 입력 총액 - 기준 평수 인테리어비 (이미 계산된 결과값)
 const pureOtherCost = costs.other || 0; 

 // 현재 선택된 평수에 따른 실시간 인테리어비 계산 (평수 * 평당단가)
 const currentPy = selectedSizeM2 / 3.3;
 const currentInteriorCost = Math.round(currentPy * (costs.interior || 0));

 // 합계 계산 로직 (가입+교육+보증+순수기타+현재평수 인테리어)
 const calcTotal = (costs.joinFee || 0) + (costs.eduFee || 0) + (costs.deposit || 0) + pureOtherCost + currentInteriorCost;

 // 화면 하단 평수 조정 비용 표시용
 const diffM2 = selectedSizeM2 - baseSizeM2; 
 const diffPyeong = diffM2 / 3.3; 
 const addedInteriorCost = Math.round(diffPyeong * (costs.interior || 0));

 const costChartData = [
    { name: '가입비', value: costs.joinFee || 0 },
    { name: '교육비', value: costs.eduFee || 0 },
    { name: '보증금', value: costs.deposit || 0 },
    { name: '인테리어', value: currentInteriorCost },
    { name: '기타비용', value: pureOtherCost },
 ].filter(item => item.value > 0);

 const securityInfo = costs.security_deposit || '';

 return (
    <Section title="초기 창업 비용 (예상)" icon={BanknotesIcon}>
       <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-3 bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
          <div>
             <p className="text-[10px] md:text-xs text-indigo-400 font-bold mb-1 whitespace-nowrap">
                * 프랜차이즈 정보 공개서 기준 면적: {baseSizeM2}m² ({toPyeong(baseSizeM2)}평)
             </p>
             <div className="flex items-center mt-2">
                 <span className="text-white font-bold text-sm md:text-base mr-2">기준 면적 선택:</span>
                 <div className="relative inline-block w-40">
                   <select value={selectedSizeM2} onChange={(e) => setSelectedSizeM2(Number(e.target.value))} className="w-full bg-slate-800 text-white border border-slate-600 rounded-lg py-2 px-3 text-sm font-bold">
                      {sizeOptions.map(size => (
                          <option key={size} value={size}>{size}m² ({toPyeong(size)}평)</option>
                      ))}
                   </select>
                 </div>
             </div>
          </div>
          <p className="text-[10px] md:text-xs text-slate-400">* 면적 변경 시 추가/감소 면적에 대한 인테리어 비용이 반영됩니다.</p>
       </div>

       <div className="overflow-hidden rounded-2xl border-2 border-slate-700/50 shadow-xl mb-6">
         <table className="w-full text-xs md:text-sm text-left">
            <thead className="bg-slate-900 text-slate-400 font-bold uppercase"><tr><th className="p-3 border-b border-slate-700">구분</th><th className="p-3 border-b border-slate-700 text-right">예상 비용</th></tr></thead>
            <tbody className="divide-y divide-slate-700/50 bg-slate-900/30">
               <tr><td className="p-3 text-slate-300">가입비</td><td className="p-3 text-right text-white font-bold">{fmtMoney(costs.joinFee)}</td></tr>
               <tr><td className="p-3 text-slate-300">교육비</td><td className="p-3 text-right text-white font-bold">{fmtMoney(costs.eduFee)}</td></tr>
               {/* 보증금 행 정렬 수정 완료 */}
               <tr><td className="p-3 text-slate-300">보증금</td><td className="p-3 text-right text-white font-bold">{fmtMoney(costs.deposit)}</td></tr>
               <tr><td className="p-3 text-slate-300">인테리어 ({toPyeong(selectedSizeM2)}평 기준)</td><td className="p-3 text-right text-white font-bold">{fmtMoney(currentInteriorCost)}</td></tr>
               <tr><td className="p-3 text-slate-300">기타비용(간판, 주방설비, 비품 등)</td><td className="p-3 text-right text-white font-bold">{fmtMoney(pureOtherCost)}</td></tr>
               <tr className="bg-slate-900"><td className="p-4 font-black text-white">합계</td><td className="p-4 text-right text-base md:text-xl font-black text-[#00FF00]">{fmtMoney(calcTotal)}</td></tr>
            </tbody>
         </table>
       </div>

       {securityInfo && (
         <div className="mb-6 p-4 bg-yellow-900/20 border border-yellow-600/30 rounded-xl">
            <h6 className="text-xs font-bold text-yellow-500 mb-2 flex items-center gap-1">
                <CheckBadgeIcon className="w-4 h-4"/> 비용/담보/기타내용 (초기 비용 제외 항목)
            </h6>
            <p className="text-xs md:text-sm text-yellow-100/90 whitespace-pre-wrap leading-relaxed tracking-tight">
                {securityInfo}
            </p>
         </div>
       )}

       <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/2 flex flex-col items-center">
             <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <defs><filter id="pie-shadow" height="130%"><feDropShadow dx="0" dy="3" stdDeviation="3" floodOpacity="0.5"/></filter></defs>
                        <Pie data={costChartData} cx="50%" cy="50%" innerRadius={55} outerRadius={75} paddingAngle={5} dataKey="value" animationDuration={2000} animationEasing="ease-in-out" style={{ filter: 'url(#pie-shadow)' }}>
                          {costChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} stroke="none" />)}
                        </Pie>
                        <Tooltip formatter={(val:number) => fmtMoney(val)} contentStyle={{backgroundColor:'#0F172A', border:'none', color:'white', boxShadow:'0 10px 15px rgba(0,0,0,0.5)'}} />
                    </PieChart>
                </ResponsiveContainer>
             </div>
             <div className="w-full grid grid-cols-2 gap-2 mt-4 px-2">
                {costChartData.map((entry, index) => {
                    const percent = ((entry.value / calcTotal) * 100).toFixed(1);
                    return (<div key={index} className="flex items-center gap-2 text-[10px] text-slate-300"><div className="w-2.5 h-2.5 rounded-full shrink-0" style={{backgroundColor: PIE_COLORS[index % PIE_COLORS.length]}}></div><span className="flex-1 truncate tracking-tighter">{entry.name}<span className="hidden md:inline">: {fmtMoney(entry.value)}</span> <span className="font-bold text-slate-100"> ({percent}%)</span></span></div>);
                })}
             </div>
          </div>
          <div className="w-full md:w-1/2 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 text-center flex flex-col justify-center">
              <h5 className="text-[10px] font-bold text-indigo-400 mb-2 whitespace-nowrap">평수에 따른 인테리어 조정 비용(추정)</h5>
              <div className="flex flex-row items-center justify-between gap-2 mb-3 bg-slate-900/50 p-2 rounded-lg border border-slate-700/50">
                  <div className="flex flex-col items-start">
                      <span className="text-[9px] text-slate-500 mb-0.5 tracking-tighter">희망 평수</span>
                      <select value={selectedSizeM2} onChange={(e) => setSelectedSizeM2(Number(e.target.value))} className="bg-slate-800 text-white text-[10px] p-1 rounded border border-slate-600 focus:outline-none focus:border-indigo-500 font-bold">
                          {sizeOptions.map(size => (<option key={size} value={size}>{toPyeong(size)}평</option>))}
                      </select>
                  </div>
                  <div className="flex flex-col items-center">
                      <span className="text-[9px] text-slate-500 mb-0.5 tracking-tighter">평당 단가</span>
                      <span className="text-[10px] md:text-xs font-bold text-white">{fmtMoney(costs.interior || 0)}</span>
                  </div>
                  <div className="flex flex-col items-end">
                      <span className="text-[9px] text-slate-500 mb-0.5 tracking-tighter">면적 차이</span>
                      <span className={`text-[10px] md:text-xs font-black ${diffPyeong > 0 ? 'text-red-400' : 'text-blue-400'}`}>
                        {diffPyeong > 0 ? '+' : ''}{diffPyeong.toFixed(1)}평
                      </span>
                  </div>
              </div>
              <div className="pt-2 border-t border-slate-700/50">
                  <p className="text-[10px] text-slate-500 mb-1 tracking-tighter">조정 비용 합계 (증감)</p>
                  <p className={`text-lg font-black ${addedInteriorCost > 0 ? 'text-red-300' : 'text-blue-300'} tracking-tight`}>
                    {fmtMoney(addedInteriorCost)}
                  </p>
              </div>
          </div>
       </div>
    </Section>
  );
}