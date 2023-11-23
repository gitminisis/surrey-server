/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        // matching all API routes
        source: "/*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" }, // replace this your actual origin
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,DELETE,PATCH,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
        ],
      },
    ];
  },
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
