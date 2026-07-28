import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Glass/브라우저에서 127.0.0.1로 접속해도 HMR·정적 리소스 허용
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  images: {
    // MD Plan 도면 이미지가 캐시 무효화용 ?v= 쿼리스트링을 사용하므로 명시적으로 허용
    localPatterns: [
      {
        pathname: "/images/plans/**",
        search: "?v=clean1",
      },
    ],
  },
};

export default nextConfig;
