/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'placehold.co' },
      { protocol: 'https', hostname: 'files.catbox.moe' },
    ],
  },
  compress: true,
  poweredByHeader: false,
  eslint: {
    // Mengabaikan error ESLint saat npm run build / deploy di Vercel
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Mengabaikan error TypeScript saat build (opsional)
    ignoreBuildErrors: true,
  },
};

export default nextConfig;