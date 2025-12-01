// components/home/HomeSectionGrid.tsx  (신규)
// 메인 홈에서 6개 주요 섹션으로 바로가기 그리드

import Link from "next/link";

type HomeSection = {
  id: string;
  title: string;
  description: string;
  href: string;
  badge?: string;
  testId: string;
};

const SECTIONS: HomeSection[] = [
  {
    id: "auth",
    title: "간편 로그인",
    description: "내 상권·프랜차이즈 분석 결과를 계정에 저장하고 다시 볼 수 있게 준비 중입니다.",
    href: "#", // TODO: 추후 실제 간편 로그인 경로로 교체
    badge: "준비 중",
    testId: "home-card-auth",
  },
  {
    id: "market",
    title: "상권분석",
    description: "행정동 기준 인구·유동·경쟁·비용 지표를 한 번에 보고, 상권의 활성도와 위험도를 확인합니다.",
    href: "/market",
    badge: "베타",
    testId: "home-card-market",
  },
  {
    id: "franchise",
    title: "프랜차이즈 분석",
    description: "업종·매출·개업률·폐업률 기준으로 프랜차이즈를 비교하고, 브랜드별 상세 지표를 볼 수 있습니다.",
    href: "/franchise/explore",
    badge: "핵심",
    testId: "home-card-franchise",
  },
  {
    id: "mbti",
    title: "MBTI로 보는 창업",
    description: "나의 성향(MBTI)에 맞는 업종과 프랜차이즈 추천을 받아 창업 방향을 잡아봅니다.",
    href: "/mbti",
    testId: "home-card-mbti",
  },
  {
    id: "interior",
    title: "셀프 인테리어",
    description: "바닥·벽·천장 재료를 고르고, 면적 입력만으로 대략적인 인테리어 비용을 계산해봅니다.",
    href: "/interior", // 향후 구현 예정
    badge: "준비 중",
    testId: "home-card-interior",
  },
  {
    id: "magazine",
    title: "창업 매거진",
    description: "최근 창업 트렌드, 성공사례, 뜨는 브랜드를 기사 형태로 모아서 제공합니다.",
    href: "/magazine", // 향후 구현 예정
    badge: "준비 중",
    testId: "home-card-magazine",
  },
];

export default function HomeSectionGrid() {
  return (
    <section
      className="mx-auto mt-10 max-w-6xl px-4"
      aria-labelledby="home-sections-heading"
    >
      <div className="flex items-baseline justify-between gap-4">
        <div>
          <h2
            id="home-sections-heading"
            className="text-xl font-semibold text-gray-900"
          >
            창업로드에서 할 수 있는 것들
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            상권분석 → 프랜차이즈 분석 → 셀프 인테리어까지, 한 곳에서 순서대로 확인할 수 있게 구성했습니다.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {SECTIONS.map((section) => (
          <Link
            key={section.id}
            href={section.href}
            data-testid={section.testId}
            className="group flex flex-col justify-between rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-gray-900">
                  {section.title}
                </h3>
                {section.badge && (
                  <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                    {section.badge}
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm text-gray-600">
                {section.description}
              </p>
            </div>
            <div className="mt-4 text-sm font-medium text-blue-600">
              <span className="inline-flex items-center gap-1">
                바로가기
                <span aria-hidden className="transition group-hover:translate-x-0.5">
                  →
                </span>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

