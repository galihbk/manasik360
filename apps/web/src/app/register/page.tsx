'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { en, id, ar } from '@bahrain/localization';
import { ArrowLeft, Building2, User } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'learner' | 'organization'>('learner');
  const [fullName, setFullName] = useState('');
  const [orgName, setOrgName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [lang, setLang] = useState('en');

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

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Save state to localStorage for dynamic dashboard rendering
    localStorage.setItem('bahrain_user_name', fullName);
    localStorage.setItem('bahrain_user_email', email);
    localStorage.setItem('bahrain_org_name', activeTab === 'organization' ? orgName : 'Personal Workspace');
    localStorage.setItem('bahrain_user_role', activeTab === 'organization' ? 'Org Admin' : 'Learner');
    
    router.push(`/verify-email?email=${encodeURIComponent(email)}`);
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

      <div className="w-full max-w-lg bg-white border border-slate-250/60 rounded-md p-8 shadow-sm my-8">
        <div className="flex flex-col items-center mb-6">
          <Image 
            src="/logo.png" 
            alt="Bahrain Logo" 
            width={44} 
            height={44} 
            className="object-contain mb-4"
          />
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            {t.auth.register_title}
          </h2>
          <p className="text-xs text-slate-400 mt-1">{t.auth.register_subtitle}</p>
        </div>

        {/* Tab Toggle Option */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-md mb-6">
          <button
            type="button"
            onClick={() => setActiveTab('learner')}
            className={`flex items-center justify-center gap-2 py-2.5 text-xs font-semibold rounded-md transition-all ${
              activeTab === 'learner' 
                ? 'bg-white text-primary shadow-sm' 
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4" />
            {t.auth.tab_personal}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('organization')}
            className={`flex items-center justify-center gap-2 py-2.5 text-xs font-semibold rounded-md transition-all ${
              activeTab === 'organization' 
                ? 'bg-white text-primary shadow-sm' 
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-4 h-4" />
            {t.auth.tab_org}
          </button>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          {activeTab === 'organization' ? (
            /* Organization (Tenant) Registration Fields */
            <>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                    {t.auth.admin_name}
                  </label>
                  <input 
                    type="text" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-md text-sm focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                    {t.auth.org_name}
                  </label>
                  <input 
                    type="text" 
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-md text-sm focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none"
                    placeholder="Al-Ihsan Travel Network"
                  />
                </div>
              </div>
            </>
          ) : (
            /* Regular User (Learner) Registration Fields */
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                  {t.auth.full_name}
                </label>
                <input 
                  type="text" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-md text-sm focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none"
                  placeholder="Ahmad Fauzi"
                />
              </div>
            </>
          )}

          {/* Shared Fields */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
              {t.auth.email_label}
            </label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-md text-sm focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none"
              placeholder="user@example.com"
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
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-md text-sm focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          <p className="text-[10px] text-slate-400 leading-relaxed pt-2">
            {t.auth.terms_note}
          </p>

          <button 
            type="submit" 
            className="w-full bg-[#1e40af] hover:bg-blue-800 text-white text-xs font-bold py-3 rounded-md transition-all shadow-sm mt-4"
          >
            {t.nav.register}
          </button>
        </form>

        <div className="border-t border-slate-100 mt-8 pt-6 text-center">
          <p className="text-xs text-slate-500">
            {t.auth.already_have_account}{' '}
            <Link href="/login" className="text-[#d97706] hover:underline font-semibold">
              {t.nav.login}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
