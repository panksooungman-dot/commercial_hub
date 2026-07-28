import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Glass/브라우저에서 127.0.0.1로 접속해도 HMR·정적 리소스 허용
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  images: {
    // Vercel Image Optimization이 INVALID_IMAGE_OPTIMIZE_REQUEST(400)를 반환해
    // 메인 히어로·조감·도면이 깨지므로 public 정적 파일을 직접 사용합니다.
    unoptimized: true,
    // 이후 최적화를 다시 켤 때를 위해 허용 품질·경로를 명시합니다.
    qualities: [75, 88, 90, 92, 95, 100],
    localPatterns: [
      {
        pathname: "/images/**",
      },
    ],
  },
};

export default nextConfig;
