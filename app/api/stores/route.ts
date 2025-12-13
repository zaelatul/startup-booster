import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat') || '37.4979';
  const lng = searchParams.get('lng') || '127.0276';
  const category = searchParams.get('category'); // I212 (카페) 같은 코드
  const radius = '500';

  const apiKey = process.env.DATA_GO_KR_API_KEY;

  if (!apiKey) return NextResponse.json({ error: 'API Key Missing' }, { status: 500 });

  // [핵심] 공공데이터 상권정보 API 호출 (반경 내 상가 조회)
  let apiUrl = `https://apis.data.go.kr/B553077/api/open/sdsc2/storeListInRadius?serviceKey=${apiKey}&pageNo=1&numOfRows=100&radius=${radius}&cx=${lng}&cy=${lat}&type=json`;
  
  // 업종 필터가 있으면 파라미터 추가
  if (category && category !== '') {
    // indsMclsCd: 상권업종중분류코드 (예: I212)
    apiUrl += `&indsMclsCd=${category}`;
  }

  // [디버깅용 로그] 서버 터미널에서 어떤 주소로 요청하는지 확인 가능!
  console.log('Fetching:', apiUrl);

  try {
    const res = await fetch(apiUrl);
    if (!res.ok) throw new Error(`공공데이터 오류: ${res.status}`);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: '데이터 로드 실패' }, { status: 500 });
  }
}