import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// 엉아의 Supabase 열쇠들 (환경변수에서 가져옴)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  try {
    console.log("🚀 데이터 넣기 시작합니다...");

    // 1. 프랜차이즈 샘플 데이터
    const franchiseData = [
      {
        brand_name: '메가커피',
        category: '커피',
        startup_cost: 50000000,
        average_sales: 30000000,
        branch_count: 1500,
        image_url: 'https://via.placeholder.com/150'
      },
      {
        brand_name: 'BBQ',
        category: '치킨',
        startup_cost: 80000000,
        average_sales: 45000000,
        branch_count: 1200,
        image_url: 'https://via.placeholder.com/150'
      },
      {
        brand_name: '베스킨라빈스',
        category: '아이스크림',
        startup_cost: 120000000,
        average_sales: 55000000,
        branch_count: 900,
        image_url: 'https://via.placeholder.com/150'
      }
    ];

    // 2. 상권분석 샘플 데이터
    const marketData = [
      {
        region_name: '서울 강남구 역삼동',
        population: 45000,
        floating_pop: 120000,
        major_category: '요식업',
        growth_rate: 5.5
      },
      {
        region_name: '경기 수원시 인계동',
        population: 38000,
        floating_pop: 85000,
        major_category: '유흥주점',
        growth_rate: 3.2
      }
    ];

    // Supabase에 데이터 쏘기!
    // 주의: 테이블 이름을 한글로 만들었으면 '프랜차이즈', 영어면 'franchises'로 바꿔야 해!
    // 엉아가 보여준 사진엔 영어(brand_name 등) 컬럼이 있어서 일단 영어 테이블명으로 가정하고 짰어.
    
    // 1. 프랜차이즈 데이터 넣기
    const result1 = await supabase.from('franchises').insert(franchiseData).select();
    if (result1.error) throw result1.error;

    // 2. 상권 데이터 넣기
    const result2 = await supabase.from('market_analysis').insert(marketData).select();
    if (result2.error) throw result2.error;

    return NextResponse.json({ message: '🎉 성공! 데이터가 채워졌어요!', data: { franchise: result1.data, market: result2.data } });

  } catch (error: any) {
    console.error("❌ 에러 발생:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}