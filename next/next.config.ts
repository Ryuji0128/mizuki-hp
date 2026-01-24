import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    distDir: ".next",
    experimental: {
        serverActions: { bodySizeLimit: "2mb" },
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "mizuki-clinic.online",
            },
            {
                protocol: "https",
                hostname: "static.wixstatic.com",
            },
        ],
    },
};

export default nextConfig;
