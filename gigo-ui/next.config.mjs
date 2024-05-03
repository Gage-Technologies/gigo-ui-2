/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['api.cdn.gigo.dev', 'user-images.githubusercontent.com', 'githubusercontent.com', 'raw.githubusercontent.com', 'cdn-images-1.medium.com'],
  },
  output: "standalone",
};

export default nextConfig;
