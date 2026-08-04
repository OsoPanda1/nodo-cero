import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    // Images are served locally from /public/images (real photos of Real del Monte).
    remotePatterns: [],
  },
  // Standalone build keeps the deployment self-contained (Cloud Run / Docker compatible).
  output: 'standalone',
  transpilePackages: ['motion', 'three', '@react-three/fiber'],
  webpack: (config, {dev}) => {
    // HMR is disabled in AI Studio via DISABLE_HMR env var.
    // File watching is disabled to prevent flickering during agent edits.
    if (dev && process.env.DISABLE_HMR === 'true') {
      config.watchOptions = {
        ignored: /.*/,
      };
    }
    return config;
  },
};

export default nextConfig;
