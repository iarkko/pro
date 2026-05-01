import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      // 🚫 отключаем кеш для API (у тебя уже было правильно)
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate",
          },
        ],
      },

      // 🧠 ВАЖНО: отключаем кеш для uploads (иначе старые картинки могут висеть)
      {
        source: "/uploads/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, must-revalidate",
          },
        ],
      },
    ];
  },

  // 🔥 важно для Docker/production (особенно если используешь next/image где-то)
  images: {
    unoptimized: true,
  },
};

export default nextConfig;