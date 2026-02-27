import { MetadataRoute } from 'next';
import { FRANCHISE_LIST } from '@/lib/franchise-data';
import { CASES } from '@/lib/cases';
import { MAGAZINE_ARTICLES } from '@/lib/magazine-data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://startup-booster.co.kr';

  // 1. 기본 메뉴 페이지 (검색 로봇이 가장 먼저 봐야 할 곳)
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/market`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/franchise/explore`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/mbti`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/interior`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/magazine`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/cases`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
  ];

  // 2. 프랜차이즈 브랜드 상세 페이지 (약 500개 자동 추가)
  const franchiseRoutes: MetadataRoute.Sitemap = FRANCHISE_LIST.map((item) => ({
    url: `${baseUrl}/franchise/brand/${item.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  // 3. 실제 창업 성공 사례 상세 페이지 (약 1,000개 자동 추가)
  const caseRoutes: MetadataRoute.Sitemap = CASES.map((item) => ({
    url: `${baseUrl}/cases/${item.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  // 4. 창업 매거진 상세 기사 (약 30개 자동 추가)
  const magazineRoutes: MetadataRoute.Sitemap = MAGAZINE_ARTICLES.map((item) => ({
    url: `${baseUrl}/magazine/${item.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  // 모든 경로를 하나로 합쳐서 전달합니다.
  return [...staticRoutes, ...franchiseRoutes, ...caseRoutes, ...magazineRoutes];
}