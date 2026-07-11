/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "@bahrain/ui",
    "@bahrain/types",
    "@bahrain/localization",
    "@bahrain/api-client",
    "@bahrain/auth",
    "@bahrain/config",
    "@bahrain/constants",
    "@bahrain/database",
    "@bahrain/hooks",
    "@bahrain/logger",
    "@bahrain/utils"
  ],
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: 'http://127.0.0.1:5001/api/v1/:path*',
      },
    ];
  },
};

export default nextConfig;
