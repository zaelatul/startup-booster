import { 
  CheckBadgeIcon 
} from '@heroicons/react/24/outline';

// 1. 정보 카드 (상단 요약 등)
export function InfoCard({ label, value, fullWidth, accentColor = "text-white" }: { label: string, value: string, fullWidth?: boolean, accentColor?: string }) {
  return (
     <div className={`p-2 md:p-6 bg-slate-900/50 border border-slate-700/50 shadow-lg rounded-xl md:rounded-2xl ${fullWidth ? 'col-span-full' : ''} text-center flex flex-col justify-center`}>
        <p className="text-[8px] md:text-xs font-bold text-slate-500 uppercase mb-1 md:mb-2">{label}</p>
        <p className={`text-[9px] md:text-xl font-black ${accentColor} break-keep whitespace-normal leading-tight`}>{value}</p>
     </div>
  )
}

// 2. 상태 카드 (증감 표시)
export function StatusCard({ label, value, diff, isNegativeGood, valueColor = "text-white" }: any) {
  return (
     <div className="p-3 md:p-6 bg-slate-900/50 border border-slate-700/50 rounded-2xl text-center shadow-lg">
        <p className="text-[10px] md:text-xs text-slate-500 font-bold mb-1 md:mb-2 uppercase">{label}</p>
        <p className={`text-sm md:text-2xl font-black ${valueColor} mb-1 md:mb-2`}>{value}</p>
        <div className="flex justify-center items-center gap-1 md:gap-2 bg-slate-900/80 py-1 md:py-2 rounded-lg">
           {diff !== 0 && <span className={`text-[10px] md:text-xs font-bold ${diff > 0 ? 'text-red-400' : 'text-blue-400'}`}>{diff > 0 ? '▲' : '▼'} {Math.abs(diff)}</span>}
        </div>
     </div>
  )
}

// 3. 강조 카드 (아이콘 포함)
export function HighlightCard({ title, value, icon: Icon }: any) {
  return (
     <div className="p-4 md:p-8 bg-slate-900/50 border border-slate-700/50 rounded-2xl shadow-lg flex items-center gap-4 md:gap-6">
        <div className="w-10 h-10 md:w-16 md:h-16 bg-indigo-900/30 rounded-xl flex items-center justify-center shrink-0">
           <Icon className="w-6 h-6 md:w-8 md:h-8 text-indigo-400"/>
        </div>
        <div className="overflow-hidden">
           <p className="text-[10px] md:text-sm font-bold text-slate-500 uppercase mb-1 whitespace-nowrap truncate">{title}</p>
           <p className="text-xs md:text-lg font-black text-white break-keep">{value}</p>
        </div>
     </div>
  )
}

// 4. 리스트 아이템 (체크 아이콘)
export function DetailListItem({ label, value, valueColor = "text-white" }: any) {
  return (
     <li className="flex justify-between items-center border-b border-slate-700/50 pb-3 md:pb-4 px-2">
        <span className="text-xs md:text-sm text-slate-400 font-bold flex items-center gap-2">
           <CheckBadgeIcon className="w-3 h-3 md:w-4 md:h-4 text-indigo-500"/> {label}
        </span>
        <span className={`text-sm md:text-lg ${valueColor} font-black`}>{value}</span>
     </li>
  )
}

// 5. 공통 섹션 레이아웃
export function Section({ title, icon: Icon, children }: any) {
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