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
        const defaultAdminEmail = (process.env.ADMIN_DEFAULT_EMAIL || 'admin@warkop.com').toLowerCase().trim();
        const defaultAdminPassword = (process.env.ADMIN_DEFAULT_PASSWORD || 'adminwarkop123').trim();

        if (
          normalizedEmail === defaultAdminEmail &&
          credentials.password.trim() === defaultAdminPassword
        ) {
          return {
            id: 'default-admin-id',
            name: 'Admin Warkop',
            email: defaultAdminEmail,
            role: 'admin',
          };
        }

        const rateCheck = checkRateLimit(`login_${normalizedEmail}`, 10, 5 * 60 * 1000);
        if (!rateCheck.isAllowed) {
          throw new Error('Terlalu banyak percobaan login gagal. Silakan coba lagi setelah 5 menit.');
        }

        try {
          await connectToDatabase();
          const user = await User.findOne({ email: credentials.email.toLowerCase() });

          if (!user || !user.password) {
            throw new Error('Akun tidak ditemukan atau password salah');
          }

          const isPasswordMatch = await bcrypt.compare(credentials.password, user.password);
          if (!isPasswordMatch) {
            throw new Error('Password salah');
          }

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
          };
        } catch (error) {
          console.error('NextAuth authorize error:', error);
          if (
            credentials.email.toLowerCase() === defaultAdminEmail.toLowerCase() &&
            credentials.password === defaultAdminPassword
          ) {
            return {
              id: 'default-admin-id',
              name: 'Admin Warkop',
              email: defaultAdminEmail,
              role: 'admin',
            };
          }
          throw error;
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
