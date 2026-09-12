import type { Metadata, Viewport } from 'next';
import './globals.css';
import AuthProvider from '@/components/providers/AuthProvider';
import { Toaster } from 'sonner';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#FAF8F5',
};

export const metadata: Metadata = {
  title: 'Warkop Galuh - Cipinang Muara',
  description: 'Warung Kopi Galuh di Cipinang Muara. Tempat santai menikmati kopi, mie instan, dan aneka minuman. Buka setiap hari 09.00 - 00.00 WIB.',
  keywords: 'warkop galuh, warkop cipinang muara, kopi enak, indomie warkop, tempat nongkrong',
  icons: {
    icon: '/favicon.ico',
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className="antialiased min-h-screen bg-[#FAF8F5] text-[#1C1917] selection:bg-stone-900 selection:text-white">
        <AuthProvider>
          {children}
          <Toaster 
            position="top-right" 
            richColors 
            theme="light" 
            toastOptions={{
              style: {
                background: '#FFFFFF',
                border: '1px solid #E7E0D8',
                color: '#1C1917',
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
