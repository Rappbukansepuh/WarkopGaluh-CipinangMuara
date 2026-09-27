// Hapus atau beri komentar pada baris ini:
// output: 'export',
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
};

export default nextConfig;