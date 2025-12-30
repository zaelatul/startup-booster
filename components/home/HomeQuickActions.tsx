import Link from "next/link";
import { MapPin, Store, PaintBucket, ArrowRight } from "lucide-react";

type QuickSection = {
  id: string;
  label: string;
  title: string;
  href: string;
  Icon: React.ElementType;
  iconColor: string;
  borderColor: string; // 호버 시 테두리 색상
};

const SECTIONS: QuickSection[] = [
  {
    id: "market",
    label: "상권분석",
    // 엉아 원본 텍스트 유지
    title: "철저한 상권분석으로 실패 확율을 줄이세요", 
    href: "/market", // [중요] 엉아가 지정한 경로 유지
    Icon: MapPin,
    iconColor: "text-blue-500",
    borderColor: "group-hover:border-blue-500/50",
  },
  {
    id: "franchise",
    label: "프랜차이즈 분석",
    // 엉아 원본 텍스트 유지
    title: "과장 광고에 현혹 되지 마시고\n실제 데이터를 확인하세요", 
    href: "/franchise/explore", // [중요] 엉아가 지정한 경로 유지 (explore)
    Icon: Store,
    iconColor: "text-indigo-500",
    borderColor: "group-hover:border-indigo-500/50",
  },
  {
    id: "interior",
    label: "셀프 인테리어",
    // 엉아 원본 텍스트 유지
    title: "바닥과 벽면 셀프 시공으로\n인테리어 비용을 30%~40% 절감하세요", 
    href: "/interior", // [중요] 엉아가 지정한 경로 유지
    Icon: PaintBucket,
    iconColor: "text-orange-500",
    borderColor: "group-hover:border-orange-500/50",
  },
];

export default function HomeQuickActions() {
  return (
    <section
      className="mt-2 flex flex-col gap-4"
      aria-label="지금 바로 확인해 볼 수 있는 창업 정보"
    >
      {/* 고급 메탈 그레이 디자인 적용 */}
      <div className="grid gap-6 md:grid-cols-3">
        {SECTIONS.map((item) => (
          <Link key={item.id} href={item.href} className="group block h-full">
            <article
              className="flex h-full flex-col rounded-2xl border border-slate-700 bg-slate-800 px-6 py-6 shadow-xl transition-all duration-300 hover:-translate-y-2 hover:bg-slate-700 hover:shadow-2xl"
              data-testid={`home-section-${item.id}`}
            >
              {/* 상단: 아이콘 */}
              <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-slate-600 bg-slate-900 transition-colors ${item.borderColor}`}>
                <item.Icon className={`h-6 w-6 ${item.iconColor}`} />
              </div>

              {/* 제목 */}
              <h3 className="mb-2 text-lg font-bold text-white">
                {item.label}
              </h3>

              {/* 설명 */}
              <p className="mb-6 flex-grow whitespace-pre-line text-xs leading-relaxed text-slate-400">
                {item.title}
              </p>

              {/* 하단 링크 스타일 */}
              <div className="mt-auto flex items-center text-xs font-bold text-slate-300 transition-colors group-hover:text-white">
                자세히 보기
                <ArrowRight className="ml-2 h-3 w-3 transition-transform group-hover:translate-x-1" />
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}