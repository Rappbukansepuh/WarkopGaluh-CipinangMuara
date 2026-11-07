import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
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
  // CATATAN: Logika eksekusi Python 'crop_icon.py' dan modul 'fs' / 'child_process' 
  // SUDAH DIHAPUS dari sini karena menyebabkan efek samping (side-effect) berbahaya 
  // saat komponen di-render oleh Next.js.

  return (
    <html lang="id" className="scroll-smooth">
      <body className="antialiased min-h-screen bg-[#FAF8F5] text-[#1C1917] selection:bg-stone-900 selection:text-white">
        <Script
          src="https://www.googletagmanager.com/gtm.js?id=GTM-W5TLJFC2"
          strategy="afterInteractive"
        />
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'GTM-W5TLJFC2');
          `}
        </Script>
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
