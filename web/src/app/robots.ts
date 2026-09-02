import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/plan/calibrate"],
    },
    sitemap: "https://ivianmall.com/sitemap.xml",
  };
}
