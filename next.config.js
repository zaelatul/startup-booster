/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ 타입스크립트 에러는 무시 (이건 아직 유효함)
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // ❌ [삭제] eslint 부분은 최신 버전에서 여기서 쓰면 에러남! (제거함)

  // ✅ 이미지 전체 허용
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

module.exports = nextConfig;