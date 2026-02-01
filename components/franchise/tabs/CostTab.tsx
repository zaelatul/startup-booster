'use client';

import { useState, useEffect } from 'react';
import { 
  BanknotesIcon, ArrowTrendingUpIcon, ChartBarIcon, 
  MegaphoneIcon, CalculatorIcon, ChevronDownIcon, ChartPieIcon, ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { 
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend 
} from 'recharts';
import { Section, HighlightCard } from '../FranchiseUI'; // 아까 만든 UI 불러오기

const SIZE_OPTIONS = [15, 20, 30, 40, 50, 60, 70, 80, 90, 100];
const COLORS = ['#6366F1', '#22D3EE', '#F472B6', '#34D399'];

interface CostTabProps {
  data: any; // 타입 지정은 나중에 정교하게 하셔도 됩니다
}

export default function CostTab({ data }: CostTabProps) {
  // 상태 관리를 여기서 합니다! (메인 페이지 해방)
  const [selectedSize, setSelectedSize] = useState<number>(15);
  const [inputPerPyeong, setInputPerPyeong] = useState<number>(0);

  useEffect(() => {
    // 초기 평당 매출 설정
    if (data.avgRevenue && typeof data.avgRevenue === 'object' && data.avgRevenue.perPyeong) {
        setInputPerPyeong(data.avgRevenue.perPyeong);
    }
  }, [data]);

  const formatMoney = (val: number) => `${(val || 0).toLocaleString()}천원`;

  // 비용 계산 로직
  const BASE_SIZE = 15;
  const additionalSize = Math.max(0, selectedSize - BASE_SIZE);
  const addedInteriorCost = additionalSize * (data.initialCosts.interior || 0);
  const finalConstructionCost = (data.initialCosts.other || 0) + addedInteriorCost;
  const calcTotal = (data.initialCosts.joinFee || 0) + 
                    (data.initialCosts.eduFee || 0) + 
                    (data.initialCosts.deposit || 0) + 
                    finalConstructionCost;

  const costChartData = [
    { name: '가맹비', value: data.initialCosts.joinFee || 0 },
    { name: '교육비', value: data.initialCosts.eduFee || 0 },
    { name: '보증금', value: data.initialCosts.deposit || 0 },
    { name: '기타(인테리어)', value: finalConstructionCost },
  ].filter(item => item.value > 0);

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in">
       {/* 여기에 아까 작성한 <Section>... 매출 ...</Section> 코드들 붙여넣기 */}
       {/* 1. 매출 섹션 */}
       <Section title="가맹점 연평균 매출" icon={ArrowTrendingUpIcon}>
           <div className="grid grid-cols-2 gap-3 md:gap-6 mb-2">
              <div className="p-4 md:p-6 bg-slate-900/50 border border-slate-700/50 rounded-2xl shadow-lg flex flex-col items-center justify-center text-center h-40 md:h-48">
                 <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase mb-2 break-keep">가맹점 전체 평균 매출 (연간)</p>
                 <p className="text-lg md:text-3xl font-black text-white">
                    {formatMoney(typeof data.avgRevenue === 'object' ? data.avgRevenue?.total : data.avgRevenue || 0)}
                 </p>
                 <p className="text-[9px] md:text-[10px] text-slate-500 mt-2">* 정보공개서 신고 기준</p>
              </div>
              <div className="p-4 md:p-6 bg-slate-900/50 border border-slate-700/50 rounded-2xl shadow-lg flex flex-col items-center justify-center text-center h-40 md:h-48">
                 <p className="text-[10px] md:text-xs font-bold text-indigo-400 uppercase mb-2 break-keep">3.3㎡(1평)당 평균 매출</p>
                 <p className="text-lg md:text-3xl font-black text-indigo-400">
                    {formatMoney(inputPerPyeong)}
                 </p>
                 <p className="text-[9px] md:text-[10px] text-slate-500 mt-2">* 효율성 참고 지표</p>
              </div>
           </div>
           <div className="text-[10px] md:text-[11px] text-slate-500 text-left leading-relaxed bg-slate-900/30 p-3 rounded-lg border border-slate-800 break-keep word-break-keep-all">
              <ExclamationTriangleIcon className="w-3 h-3 inline mr-1" /> 
              매출은 매장 평수보다 <strong>상권, 입지, 운영 능력</strong>에 따라 크게 달라질 수 있습니다.<br className="hidden md:block"/>
              단순히 평수를 늘린다고 매출이 비례하여 증가하지 않으므로, 위 <strong>전체 평균 매출</strong>을 보수적인 기준으로 참고하시기 바랍니다.
           </div>
       </Section>

       {/* 2. 초기 창업 비용 섹션 */}
       <Section title="초기 창업 비용 (예상)" icon={BanknotesIcon}>
           <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-3 bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
              <div>
                 <p className="text-[10px] md:text-xs text-indigo-400 font-bold mb-1 whitespace-nowrap">
                    * 프랜차이즈 정보 공개서 기준 평수는 50㎡(15평) 기준입니다.
                 </p>
                 <div className="flex items-center">
                     <span className="text-white font-bold text-sm md:text-base mr-2">기준 평수 선택:</span>
                     <div className="relative inline-block w-28 md:w-32">
                       <select 
                          value={selectedSize}
                          onChange={(e) => setSelectedSize(Number(e.target.value))}
                          className="appearance-none w-full bg-slate-800 text-white border border-slate-600 rounded-lg py-2 px-3 pr-8 leading-tight focus:outline-none focus:border-indigo-500 text-sm font-bold"
                       >
                          {SIZE_OPTIONS.map(size => (
                             <option key={size} value={size}>{size}평</option>
                          ))}
                       </select>
                       <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                          <ChevronDownIcon className="w-4 h-4" />
                       </div>
                     </div>
                 </div>
              </div>
              <p className="text-xs text-slate-400 break-keep">
                 * 평수 변경 시 추가 면적에 대한 인테리어 비용이 합산됩니다.
              </p>
           </div>

           <div className="overflow-hidden rounded-2xl border-2 border-slate-700/50 shadow-xl mb-6">
              <table className="w-full text-xs md:text-sm text-left">
                 <thead className="bg-slate-900 text-slate-400 font-bold uppercase tracking-wider">
                    <tr><th className="p-3 md:p-5 border-b border-slate-700">구분</th><th className="p-3 md:p-5 border-b border-slate-700 text-right">예상 비용</th></tr>
                 </thead>
                 <tbody className="divide-y divide-slate-700/50 bg-slate-900/30">
                    <tr><td className="p-3 md:p-5 text-slate-300 font-medium">가입비(가맹비)</td><td className="p-3 md:p-5 text-right font-bold text-white">{formatMoney(data.initialCosts.joinFee)}</td></tr>
                    <tr className="bg-slate-900/60"><td className="p-3 md:p-5 text-slate-300 font-medium">교육비</td><td className="p-3 md:p-5 text-right font-bold text-white">{formatMoney(data.initialCosts.eduFee)}</td></tr>
                    <tr><td className="p-3 md:p-5 text-slate-300 font-medium">보증금</td><td className="p-3 md:p-5 text-right font-bold text-white">{formatMoney(data.initialCosts.deposit)}</td></tr>
                    <tr className="bg-slate-900/60">
                       <td className="p-3 md:p-5 text-slate-300 font-medium flex flex-col">
                          <span className="whitespace-nowrap">기타 (설비/인테리어 합산)</span>
                          <span className="text-[10px] text-slate-500 mt-0.5">* 기본(15평) 포함 + 추가평수 인테리어</span>
                       </td>
                       <td className="p-3 md:p-5 text-right font-bold text-white">{formatMoney(finalConstructionCost)}</td>
                    </tr>
                    <tr className="bg-gradient-to-r from-slate-900 to-slate-800">
                       <td className="p-4 md:p-6 font-black text-sm md:text-lg text-white">비용 합계 (예상)</td>
                       <td className="p-4 md:p-6 text-right">
                          <div className="text-lg md:text-2xl font-black text-[#00FF00] drop-shadow-[0_0_15px_rgba(0,255,0,0.4)]">{formatMoney(calcTotal)}</div>
                       </td>
                    </tr>
                 </tbody>
              </table>
           </div>

           <div className="mb-6 p-6 bg-slate-900/50 rounded-2xl border border-slate-700/50 shadow-xl flex flex-col md:flex-row items-center gap-8">
              <div className="w-full md:w-1/2 relative flex flex-col items-center">
                 <h4 className="text-sm font-bold text-slate-300 mb-2 flex items-center gap-2 self-start">
                    <ChartPieIcon className="w-5 h-5 text-indigo-400"/> 비용 구성 비율
                 </h4>
                 <div className="h-56 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                           <Pie
                              data={costChartData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="value"
                              animationDuration={1500}
                              animationBegin={0}
                           >
                              {costChartData.map((entry, index) => (
                                 <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0.2)" />
                              ))}
                           </Pie>
                           <Tooltip formatter={(val:number) => formatMoney(val)} contentStyle={{backgroundColor:'#0F172A', color:'#E2E8F0', borderRadius:'12px', border:'1px solid #334155'}} />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[40%] text-center">
                        <p className="text-[10px] text-slate-500 font-bold">TOTAL</p>
                        <p className="text-sm font-black text-white">100%</p>
                    </div>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-x-4 gap-y-2 w-full mt-2 px-2">
                    {costChartData.map((entry, index) => (
                       <div key={index} className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                          <div className="flex flex-col">
                             <span className="text-[10px] text-slate-400 leading-tight">{entry.name} <span className="text-slate-200">({((entry.value / calcTotal) * 100).toFixed(1)}%)</span></span>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
              
              <div className="w-full md:w-1/2 bg-slate-800/50 rounded-xl p-5 border border-slate-700/50">
                  <h5 className="text-[11px] md:text-sm font-bold text-indigo-400 mb-4 flex items-center gap-2 pb-2 border-b border-slate-700/50 whitespace-nowrap">
                      <CalculatorIcon className="w-4 h-4"/> 평수에 따른 인테리어 추가 비용(추정)
                  </h5>
                  <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                          <p className="text-[10px] text-slate-500 mb-1">단위면적(3.3㎡)당</p>
                          <p className="text-sm font-bold text-white">{formatMoney(data.initialCosts.interior || 0)}</p>
                      </div>
                      <div>
                          <p className="text-[10px] text-slate-500 mb-1">추가 평수</p>
                          <p className="text-sm font-black text-white">{Math.max(0, selectedSize - 15)}평</p>
                      </div>
                      <div className="col-span-2 pt-2 mt-2 border-t border-slate-700/50">
                          <p className="text-[10px] text-slate-500 mb-1">추가 비용 합계</p>
                          <p className="text-lg font-black text-indigo-300">{formatMoney(addedInteriorCost)}</p>
                      </div>
                  </div>
              </div>
           </div>

           <div className="mt-4 p-3 bg-slate-900/30 rounded-lg text-[11px] md:text-xs text-slate-400 leading-relaxed border border-slate-800">
              <p className="mb-1">※ '기타' 비용에는 정보공개서 기준(15평)의 인테리어 및 설비 비용 전액이 포함되어 있습니다.</p>
              <p className="break-keep word-break-keep-all">※ 15평을 초과하는 평수 선택 시, 초과 면적에 대한 인테리어 예상 비용만 추가 합산됩니다.</p>
           </div>
       </Section>

       {/* 3. 운영 중 부담 섹션 */}
       <Section title="운영 중 부담 (월 고정비)" icon={ChartBarIcon}>
           <div className="grid grid-cols-2 gap-3 md:gap-6">
              <HighlightCard title="로열티 (Royalty)" value={data.ongoingCosts.royalty} icon={BanknotesIcon} />
              <HighlightCard title="광고/판촉비 분담" value={data.ongoingCosts.adFee} icon={MegaphoneIcon} />
           </div>
       </Section>
    </div>
  );
}