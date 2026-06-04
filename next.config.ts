import type { NextConfig } from "next";

const extraOrigins = process.env.ALLOWED_DEV_ORIGINS?.split(",").map((s) =>
  s.trim(),
).filter(Boolean) ?? [];

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "192.168.0.119",
    "localhost",
    "127.0.0.1",
    ...extraOrigins,
  ],
};

export default nextConfig;
