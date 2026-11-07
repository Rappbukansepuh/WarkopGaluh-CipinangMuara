import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { checkRateLimit } from '@/lib/security';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'admin@warkop.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email dan password harus diisi');
        }

        const normalizedEmail = credentials.email.toLowerCase().trim();
        const inputPassword = credentials.password.trim();

        // Debug: lihat apa yang diterima backend
        console.log('[DEBUG AUTH] Raw email:', credentials.email);
        console.log('[DEBUG AUTH] Raw password:', credentials.password);
        console.log('[DEBUG AUTH] Normalized email:', normalizedEmail);
        console.log('[DEBUG AUTH] Input password length:', inputPassword.length);

        // Rate limiting: Check FIRST sebelum validasi credential (prevent brute force)
        // 5 attempts dalam 15 menit = 900 detik
        const rateCheck = checkRateLimit(`login_${normalizedEmail}`, 5, 15 * 60 * 1000);
        if (!rateCheck.isAllowed) {
          const resetTimeMin = Math.ceil((rateCheck.resetTime - Date.now()) / 60 / 1000);
          console.warn(`[SECURITY] Brute force attempt blocked for ${normalizedEmail}. Reset in ${resetTimeMin} minutes`);
          throw new Error(`Terlalu banyak percobaan login gagal. Coba lagi dalam ${resetTimeMin} menit.`);
        }

        // Daftar email admin default yang sah
        const envEmail = (process.env.ADMIN_DEFAULT_EMAIL || '').toLowerCase().trim();
        const validAdminEmails = ['admin@warkop.com', 'admin@warkop123.com'];
        if (envEmail && !validAdminEmails.includes(envEmail)) {
          validAdminEmails.push(envEmail);
        }

        const defaultAdminPassword = (process.env.ADMIN_DEFAULT_PASSWORD || 'adminwarkop123').trim();
        console.log('[DEBUG AUTH] Default password length:', defaultAdminPassword.length);
        console.log('[DEBUG AUTH] Password match:', inputPassword === defaultAdminPassword);

        // 1. Cek kredensial default admin terlebih dahulu (langsung tembus tanpa butuh MongoDB aktif)
        if (
          validAdminEmails.includes(normalizedEmail) &&
          inputPassword === defaultAdminPassword
        ) {
          console.log(`[AUTH SUCCESS] Default admin login: ${normalizedEmail}`);
          return {
            id: 'default-admin-id',
            name: 'Admin Warkop',
            email: normalizedEmail,
            role: 'admin',
          };
        }

        // 2. Cek user kustom di MongoDB jika ada
        try {
          await connectToDatabase();
          const user = await User.findOne({ email: normalizedEmail });

          if (!user || !user.password) {
            console.warn(`[AUTH FAILED] User not found or no password: ${normalizedEmail}`);
            throw new Error('Akun tidak ditemukan atau password salah');
          }

          const isPasswordMatch = await bcrypt.compare(inputPassword, user.password);
          if (!isPasswordMatch) {
            console.warn(`[AUTH FAILED] Password mismatch for: ${normalizedEmail}`);
            throw new Error('Password salah');
          }

          console.log(`[AUTH SUCCESS] User login: ${normalizedEmail}`);
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
          };
        } catch (error) {
          console.error('NextAuth authorize error:', error);

          // Fallback: jika DB mati tapi kredensial default admin
          if (
            validAdminEmails.includes(normalizedEmail) &&
            inputPassword === defaultAdminPassword
          ) {
            console.log(`[AUTH SUCCESS - FALLBACK] Default admin login (DB offline): ${normalizedEmail}`);
            return {
              id: 'default-admin-id',
              name: 'Admin Warkop',
              email: normalizedEmail,
              role: 'admin',
            };
          }

          throw new Error('Email atau password salah (atau database offline)');
        }
      },
    }),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as unknown as { role?: string }).role || 'admin';
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as unknown as { role?: string; id?: string }).role = token.role as string;
        (session.user as unknown as { role?: string; id?: string }).id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  secret: process.env.NEXTAUTH_SECRET || 'rahasia-warkop-super-secret-key-123456',
};
