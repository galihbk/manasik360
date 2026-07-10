'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { en, id, ar } from '@bahrain/localization';
import { Mail, CheckCircle2, ArrowLeft } from 'lucide-react';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || 'your-email@example.com';
  const [lang, setLang] = useState('en');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  // Read language preference on mount
  useEffect(() => {
    const savedLang = localStorage.getItem('bahrain_lang');
    if (savedLang) {
      setLang(savedLang);
    }
  }, []);

  const handleLangChange = (selectedLang: string) => {
    setLang(selectedLang);
    localStorage.setItem('bahrain_lang', selectedLang);
  };

  const tMap: Record<string, any> = { en, id, ar };
  const t = tMap[lang] || en;
  const isRtl = lang === 'ar';

  const handleSimulateVerify = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerified(true);
      setTimeout(() => {
        router.push('/login?verified=true');
      }, 1500);
    }, 1200);
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

      <div className="w-full max-w-md bg-white border border-slate-250/60 rounded-md p-8 shadow-sm text-center">
        <div className="flex flex-col items-center mb-6">
          <Image 
            src="/logo.png" 
            alt="Bahrain Logo" 
            width={44} 
            height={44} 
            className="object-contain mb-4"
          />
        </div>

        {!isVerified ? (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-6 animate-pulse">
              <Mail className="w-8 h-8" />
            </div>
            
            <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-2">
              {lang === 'id' ? 'Verifikasi Email Anda' : lang === 'ar' ? 'تأكيد بريدك الإلكتروني' : 'Verify Your Email'}
            </h2>
            
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm mb-8">
              {lang === 'id' 
                ? `Kami telah menyimulasikan pengiriman tautan verifikasi ke ${email}. Silakan cek kotak masuk Anda atau klik tombol di bawah untuk simulasi verifikasi manual.`
                : lang === 'ar'
                ? `لقد قمنا بمحاكاة إرسال رابط التحقق إلى ${email}. يرجى التحقق من صندوق الوارد الخاص بك أو النقر على الزر أدناه للمحاكاة.`
                : `We have simulated sending a verification link to ${email}. Please check your inbox or click the button below to simulate manual email verification.`
              }
            </p>

            <button
              onClick={handleSimulateVerify}
              disabled={isVerifying}
              className="w-full bg-[#1e40af] hover:bg-blue-800 text-white text-xs font-bold py-3.5 rounded-md transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isVerifying ? (
                <span>{lang === 'id' ? 'Memverifikasi...' : 'Verifying...'}</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  {lang === 'id' ? 'Simulasikan Klik Tautan Verifikasi' : lang === 'ar' ? 'محاكاة النقر على رابط التحقق' : 'Simulate Clicking Verification Link'}
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center py-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mb-6">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-2">
              {lang === 'id' ? 'Email Berhasil Diverifikasi!' : 'Email Verified Successfully!'}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {lang === 'id' ? 'Mengarahkan ke halaman masuk...' : 'Redirecting to login portal...'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-xs text-slate-500">Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
