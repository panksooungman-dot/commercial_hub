import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Glass/브라우저에서 127.0.0.1로 접속해도 HMR·정적 리소스 허용
  allowedDevOrigins: ["127.0.0.1", "localhost"],
};

export default nextConfig;
