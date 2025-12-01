// C:\Users\USER\Desktop\프로젝트2\web\app\mbti\layout.tsx
import { Suspense } from 'react';

// ✅ 이 세그먼트는 항상 동적 렌더링(프리렌더 금지)
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

// ✅ PPR 경고 방지: 자식 트리를 얇은 Suspense 경계로 래핑
export default function MbtiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Suspense fallback={null}>{children}</Suspense>;
}
