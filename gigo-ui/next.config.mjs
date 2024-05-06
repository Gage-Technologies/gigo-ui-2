import bundleAnalyzer from '@next/bundle-analyzer'
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = withBundleAnalyzer({
  images: {
    domains: ['api.cdn.gigo.dev', 'user-images.githubusercontent.com', 'githubusercontent.com', 'raw.githubusercontent.com', 'cdn-images-1.medium.com'],
  },
  output: "standalone",
  experimental: {
    optimizePackageImports: [
      'date-fns',
      '@mui/material',
      '@mui/icons-material',
      'lodash-es'
    ],
  },
});

export default nextConfig;
