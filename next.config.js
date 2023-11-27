/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    TENANT_ID: process.env.TENANT_ID,
    TENANT_PASSWORD: process.env.TENANT_PASSWORD,
    EASYLOAD_BASE_API: process.env.EASYLOAD_BASE_API,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
