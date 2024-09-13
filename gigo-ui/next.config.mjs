import {withSentryConfig} from '@sentry/nextjs';
import bundleAnalyzer from '@next/bundle-analyzer'
// import MillionLint from "@million/lint";
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = withBundleAnalyzer({
  reactStrictMode: false, // disable react strict mode
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.gigo.dev',
        port: '',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: '*.medium.com',
        port: '',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: '*.githubusercontent.com',
        port: '',
        pathname: '/**'
      },
    ],
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

export default withSentryConfig(nextConfig, {
// For all available options, see:
// https://github.com/getsentry/sentry-webpack-plugin#options

org: "gigo-rm",
project: "javascript-nextjs",

// Only print logs for uploading source maps in CI
silent: !process.env.CI,

// For all available options, see:
// https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

// Upload a larger set of source maps for prettier stack traces (increases build time)
widenClientFileUpload: true,

// Automatically annotate React components to show their full name in breadcrumbs and session replay
reactComponentAnnotation: {
enabled: true,
},

// Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
// This can increase your server load as well as your hosting bill.
// Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
// side errors will fail.
tunnelRoute: "/monitoring",

// Hides source maps from generated client bundles
hideSourceMaps: true,

// Automatically tree-shake Sentry logger statements to reduce bundle size
disableLogger: true,

// Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
// See the following for more information:
// https://docs.sentry.io/product/crons/
// https://vercel.com/docs/cron-jobs
automaticVercelMonitors: true,
});

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