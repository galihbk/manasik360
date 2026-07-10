'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { en, id, ar } from '@bahrain/localization';
import { ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [lang, setLang] = useState('en');
  const [devRole, setDevRole] = useState('Learner');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Read language preference on mount
  useEffect(() => {
    const savedLang = localStorage.getItem('bahrain_lang');
    if (savedLang) {
      setLang(savedLang);
    }
  }, []);

  // Update language preference helper
  const handleLangChange = (selectedLang: string) => {
    setLang(selectedLang);
    localStorage.setItem('bahrain_lang', selectedLang);
  };

  const tMap: Record<string, any> = { en, id, ar };
  const t = tMap[lang] || en;
  const isRtl = lang === 'ar';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const res = await fetch(`${apiBase}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.message || 'Email atau kata sandi tidak valid.');
        setIsLoading(false);
        return;
      }

      // Store verified user data from backend
      const user = data.user;
      localStorage.setItem('bahrain_user_name', user.name);
      localStorage.setItem('bahrain_user_email', user.email);
      localStorage.setItem('bahrain_user_role', user.role);
      localStorage.setItem('bahrain_org_name', user.tenantName || 'Bahrain Virtual Academy');
      document.cookie = 'bahrain_session=true; path=/; max-age=86400;';

      router.push('/dashboard');
    } catch (err) {
      setError('Koneksi ke server gagal. Coba lagi.');
      setIsLoading(false);
    }
  };

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-6 py-12">
      <div className="absolute top-8 left-8 right-8 flex justify-between items-center">
        <Link href="/" className="inline-flex items-center gap-2 text-xs text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          {lang === 'id' ? 'Kembali ke Beranda' : lang === 'ar' ? 'العودة للرئيسية' : 'Back to home'}
        </Link>
        <select 
          value={lang} 
          onChange={(e) => handleLangChange(e.target.value)}
          className="bg-transparent border border-slate-200 rounded px-2 py-1 text-xs focus:ring-0 focus:outline-none"
        >
          <option value="en">English</option>
          <option value="id">Bahasa</option>
          <option value="ar">العربية</option>
        </select>
      </div>

      <div className="w-full max-w-md bg-white border border-slate-250/60 rounded-md p-8 shadow-sm">
        <div className="flex flex-col items-center mb-6">
          <Image 
            src="/logo.png" 
            alt="Bahrain Logo" 
            width={44} 
            height={44} 
            className="object-contain mb-4"
          />
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            {t.auth.login_title}
          </h2>
          <p className="text-xs text-slate-400 mt-1">{t.auth.login_subtitle}</p>
        </div>

        {/* Quick Role Selection (Dev Helper) */}
        <div className="mb-6 p-2 bg-slate-50 border border-slate-200 rounded-lg">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center mb-1.5">Quick Role (Dev Mode)</p>
          <div className="grid grid-cols-3 gap-1">
            <button
              type="button"
              onClick={() => {
                setEmail('learner@bahrain.com');
                setPassword('learner123');
                setDevRole('Learner');
              }}
              className={`py-1.5 text-[10px] font-bold rounded-md transition-all ${
                devRole === 'Learner' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-150'
              }`}
            >
              Jemaah
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail('adminbiro@bahrain.com');
                setPassword('adminbiro123');
                setDevRole('Org Admin');
              }}
              className={`py-1.5 text-[10px] font-bold rounded-md transition-all ${
                devRole === 'Org Admin' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-150'
              }`}
            >
              Admin Biro
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail('superadmin@bahrain.com');
                setPassword('superadmin123');
                setDevRole('Super Admin');
              }}
              className={`py-1.5 text-[10px] font-bold rounded-md transition-all ${
                devRole === 'Super Admin' ? 'bg-red-650 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-150'
              }`}
            >
              Super Admin
            </button>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
              {t.auth.email_label}
            </label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-md text-sm focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none disabled:opacity-60"
              placeholder="name@organization.com"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
              {t.auth.password_label}
            </label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-md text-sm focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none disabled:opacity-60"
              placeholder="••••••••"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
              <input type="checkbox" disabled={isLoading} className="rounded border-slate-300 text-primary focus:ring-primary" />
              {t.auth.remember_me}
            </label>
            <a href="#" className="text-xs text-[#d97706] hover:underline">
              {t.auth.forgot_password}
            </a>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-[#1e40af] hover:bg-blue-800 text-white text-xs font-bold py-3 rounded-md transition-all shadow-sm mt-4 flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>{lang === 'id' ? 'Memproses...' : lang === 'ar' ? 'جاري التحميل...' : 'Signing in...'}</span>
              </>
            ) : (
              t.nav.login
            )}
          </button>

          {error && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md text-xs text-red-600 text-center">
              {error}
            </div>
          )}
        </form>

        <div className="border-t border-slate-100 mt-8 pt-6 text-center">
          <p className="text-xs text-slate-500">
            {t.auth.no_account}{' '}
            <Link href="/register" className="text-[#d97706] hover:underline font-semibold">
              {t.nav.register}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
