import bundleAnalyzer from '@next/bundle-analyzer'
// import MillionLint from "@million/lint";
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
    serverActions: process.env.NODE_ENV === 'development' ? {
      allowedOrigins: ["ui-dev.gigo.dev:33001"]
    } : {
      allowedOrigins: ["dev.gigo.dev", "gigo.dev", "www.gigo.dev"]
    }
  },
});

export default nextConfig;

// TODO: reduce the excluded pages
// export default MillionLint.next({ 
//   rsc: true, 
//   filter: {
//     exclude: [
//       "**/node_modules/**/*",
//       "**/components/Pages/Login/*.tsx",
//       "**/components/Pages/Signup/*.tsx",
//       "**/app/profile/*.tsx",
//       "**/app/user/*.tsx",
//     ]
//   }
// })(nextConfig);
