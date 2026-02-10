
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
  generateStatsFile: true,
  statsFilename: 'stats.json',
});


/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = withBundleAnalyzer(nextConfig);
