import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // ✅ ビルド出力はルート直下
    distDir: ".next",
    // ✅ src/app構成はNext.jsが自動認識する
    experimental: {
        serverActions: { bodySizeLimit: "2mb" },
    },
    images: {
        domains: [
            "localhost",
            "127.0.0.1",
            "192.168.11.15",
            "mizuki-clinic.online",
        ],
        unoptimized: true,
    },
};

export default nextConfig;
