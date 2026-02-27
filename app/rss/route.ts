import { NextResponse } from 'next/server'

export async function GET() {
  // 현재 시간을 네이버가 좋아하는 형식으로 생성
  const pubDate = new Date().toUTCString();

  const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
      <title>창업부스터 - 데이터 기반 창업 지원 플랫폼</title>
      <link>https://startup-booster.co.kr</link>
      <description>프랜차이즈 창업 실제 성공사례 및 프랜차이즈 분석 정보를 제공합니다.</description>
      <language>ko</language>
      <pubDate>${pubDate}</pubDate>
      <lastBuildDate>${pubDate}</lastBuildDate>
      
      {/* 1. 프랜차이즈 창업 실제 성공사례 섹션 */}
      <item>
        <title>프랜차이즈 창업 실제 성공사례 데이터 업데이트</title>
        <link>https://startup-booster.co.kr/cases</link>
        <description>전국 주요 상권의 프랜차이즈 창업 실제 성공사례를 정밀 분석 및 검증하여 공개합니다.</description>
        <pubDate>${pubDate}</pubDate>
        <guid>https://startup-booster.co.kr/cases-main</guid>
      </item>

      {/* 2. 프랜차이즈 분석 섹션 */}
      <item>
        <title>데이터로 보는 프랜차이즈 분석 리포트</title>
        <link>https://startup-booster.co.kr</link>
        <description>유동인구, 상권 데이터 기반의 객관적인 프랜차이즈 분석 정보를 확인하세요.</description>
        <pubDate>${pubDate}</pubDate>
        <guid>https://startup-booster.co.kr/analysis-info</guid>
      </item>

      {/* 3. 창업매거진 섹션 */}
      <item>
        <title>창업매거진: 2026년 창업 트렌드 및 전략</title>
        <link>https://startup-booster.co.kr</link>
        <description>예비 창업자를 위한 창업매거진, 최신 창업 정보와 인사이트를 제공합니다.</description>
        <pubDate>${pubDate}</pubDate>
        <guid>https://startup-booster.co.kr/magazine-1</guid>
      </item>
    </channel>
  </rss>`

  return new NextResponse(rssFeed, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  })
}