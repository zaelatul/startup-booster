/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co', // Supabase 도메인 허용
      },
      {
        protocol: 'https',
        hostname: 'placehold.co', // 임시 이미지 사이트 허용
      },
    ],
    // [중요] 이미지 최적화 중 400 에러가 계속 나면 아래 주석을 풀어서 최적화를 끄세요.
    // unoptimized: true, 
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;