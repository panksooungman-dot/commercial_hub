import type { Metadata } from "next";
import { Newsreader, Manrope } from "next/font/google";
import "./globals.css";

const display = Newsreader({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const body = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ivianmall.com"),
  title: "송도 하늘채 아이비원 상업시설",
  description: "송도 아이비원 주상복합 단지 내 근린생활시설 분양 안내",
  openGraph: {
    title: "송도 하늘채 아이비원 상업시설",
    description: "송도 아이비원 주상복합 단지 내 근린생활시설 분양 안내",
    siteName: "송도 하늘채 아이비원",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "송도 하늘채 아이비원 상업시설",
    description: "송도 아이비원 주상복합 단지 내 근린생활시설 분양 안내",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${display.variable} ${body.variable} h-full`}>
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
