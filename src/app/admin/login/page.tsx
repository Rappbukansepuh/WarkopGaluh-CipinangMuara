'use client';

import React, { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Coffee, Lock, Mail, ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/admin/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAutoFill = () => {
    setEmail('admin@warkop.com');
    setPassword('adminwarkop123');
    toast.info('Akun admin default telah diisi otomatis');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Email dan password wajib diisi');
      return;
    }

    try {
      setLoading(true);
      const res = await signIn('credentials', {
        redirect: false,
        email: email.trim(),
        password: password.trim(),
        callbackUrl,
      });

      if (res?.error) {
        toast.error(res.error || 'Email atau password salah');
      } else if (res?.ok) {
        toast.success('Login berhasil! Mengalihkan ke dashboard...');
        window.location.href = callbackUrl;
      }
    } catch (err) {
      console.error('Login error:', err);
      toast.error('Terjadi kesalahan saat login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-center items-center px-4 sm:px-6 py-8">
      <div className="w-full max-w-md space-y-6 animate-fade-in-up">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#78716C] hover:text-[#1C1917] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Website Warkop</span>
        </Link>

        {/* Card Box */}
        <div className="bg-white border border-[#E7E0D8] rounded-2xl p-6 sm:p-8 shadow-md space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-stone-900 text-white flex items-center justify-center mx-auto shadow-xs">
              <Coffee className="w-6 h-6" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#1C1917] font-display">
              Login Admin Warkop
            </h1>
            <p className="text-xs text-[#78716C]">
              Masuk untuk mengelola menu, pesanan, dan operasional Warkop Galuh
            </p>
          </div>

          {/* Quick Autofill Helper */}
          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs flex items-center justify-between">
            <div>
              <p className="font-semibold text-stone-800 text-[11px]">Akun Default Warkop:</p>
              <p className="text-stone-500 text-[10px] font-mono">admin@warkop.com / adminwarkop123</p>
            </div>
            <button
              type="button"
              onClick={handleAutoFill}
              className="px-2.5 py-1.5 rounded-lg bg-white border border-stone-300 hover:border-stone-400 text-stone-800 text-[11px] font-semibold flex items-center gap-1 shadow-2xs transition-colors"
            >
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Isi Otomatis</span>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#44403C]">
                Email Admin
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#A8A29E] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@warkop.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-[#FAF8F5] border border-[#E7E0D8] text-xs font-medium text-[#1C1917] focus:outline-none focus:border-stone-900"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#44403C]">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#A8A29E] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-[#FAF8F5] border border-[#E7E0D8] text-xs font-medium text-[#1C1917] focus:outline-none focus:border-stone-900"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs sm:text-sm font-bold shadow-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50 active:scale-98"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Memverifikasi...</span>
                </>
              ) : (
                <span>Masuk ke Dashboard</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center text-[#78716C] text-xs">
        <div className="w-8 h-8 border-2 border-[#E7E0D8] border-t-stone-900 rounded-full animate-spin mb-2" />
      </div>
    }>
      <AdminLoginForm />
    </Suspense>
  );
}
