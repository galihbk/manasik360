'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { id, en, ar } from '@bahrain/localization';
import {
  Globe2,
  Menu,
  X,
} from 'lucide-react';

interface PublicLayoutProps {
  children: React.ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('en');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem('bahrain_lang');
    if (savedLang) setCurrentLang(savedLang);
  }, []);

  const handleLangChange = (lang: string) => {
    setCurrentLang(lang);
    localStorage.setItem('bahrain_lang', lang);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const translationsMap: Record<string, any> = { id, en, ar };
  const t = translationsMap[currentLang] || en;
  const isRtl = currentLang === 'ar';

  const navLinks = [
    { label: t.nav.home, href: '/' },
    { label: t.nav.about, href: '/about' },
    { label: t.nav.features, href: '/#features' },
    { label: 'Blog', href: '/blogs' },
    { label: t.nav.pricing, href: '/#pricing' },
    { label: t.nav.faq, href: '/#faq' },
  ];

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className={`min-h-screen bg-white flex flex-col ${isRtl ? 'text-right' : 'text-left'}`}>
      
      {/* ── NAVBAR (same as landing page) ── */}
      <header className={`sticky top-0 z-50 transition-all duration-300 border-b ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md border-slate-200/80 shadow-sm py-1'
          : 'bg-[#064e3b] border-[#022c22] py-0'
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-20">

          {/* Mihrab Golden Ribbon Logo */}
          <Link
            href="/"
            className="relative bg-[#d97706] text-white px-6 pt-8 pb-12 flex flex-col items-center justify-center shadow-lg z-50 min-w-[130px] self-start mt-[-4px] md:mt-[-10px] transition-transform duration-300"
            style={{ clipPath: 'polygon(0 0, 100% 0, 100% 85%, 50% 100%, 0 85%)' }}
          >
            <Image
              src="/logo.png"
              alt="Bahrain Logo"
              width={64}
              height={64}
              className="w-10 h-10 md:w-16 md:h-16 object-contain brightness-0 invert"
            />
          </Link>

          {/* Center Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`text-sm font-semibold transition-colors duration-250 ${
                  isScrolled
                    ? 'text-slate-600 hover:text-slate-950'
                    : 'text-emerald-100/85 hover:text-white'
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-6">
            {/* Language Switcher */}
            <div className={`relative flex items-center gap-1.5 text-xs transition-colors duration-250 ${
              isScrolled ? 'text-slate-500 hover:text-slate-900' : 'text-emerald-100/90 hover:text-white'
            }`}>
              <Globe2 className="w-4 h-4" />
              <select
                value={currentLang}
                onChange={(e) => handleLangChange(e.target.value)}
                className={`bg-transparent border-none text-xs focus:ring-0 focus:outline-none cursor-pointer font-bold ${
                  isScrolled ? 'text-slate-800' : 'text-white'
                }`}
              >
                <option value="en" className="text-black">English</option>
                <option value="id" className="text-black">Indonesian</option>
                <option value="ar" className="text-black">العربية (RTL)</option>
              </select>
            </div>

            <a
              href="/register"
              className={`text-xs font-bold px-5 py-2.5 rounded-full transition-all border ${
                isScrolled
                  ? 'text-slate-700 hover:text-slate-950 border-slate-200 hover:border-slate-350'
                  : 'text-emerald-100 hover:text-white border-emerald-500/35'
              }`}
            >
              {t.nav.register}
            </a>
            <a
              href="/login"
              className="bg-[#d97706] hover:bg-[#b45309] text-white text-xs font-bold px-6 py-2.5 rounded-full transition-all shadow-md shadow-emerald-950/20"
            >
              {t.nav.login}
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden p-2 focus:outline-none transition-colors ${
              isScrolled ? 'text-slate-600 hover:text-slate-950' : 'text-emerald-100 hover:text-white'
            }`}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Panel */}
        {mobileMenuOpen && (
          <div className={`md:hidden border-t px-6 py-6 flex flex-col gap-4 transition-colors ${
            isScrolled ? 'bg-white border-slate-100 shadow-lg' : 'bg-[#064e3b] border-[#022c22]'
          }`}>
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-sm font-medium py-1 transition-colors ${
                  isScrolled ? 'text-slate-600 hover:text-slate-900' : 'text-emerald-100 hover:text-white'
                }`}
              >
                {link.label}
              </a>
            ))}
            <div className={`border-t pt-4 flex flex-col gap-3 ${
              isScrolled ? 'border-slate-100' : 'border-[#022c22]'
            }`}>
              <div className={`flex items-center gap-2 text-sm py-1 ${
                isScrolled ? 'text-slate-700' : 'text-emerald-100'
              }`}>
                <Globe2 className="w-4 h-4" />
                <select
                  value={currentLang}
                  onChange={(e) => { handleLangChange(e.target.value); setMobileMenuOpen(false); }}
                  className={`bg-transparent border-none text-xs focus:ring-0 cursor-pointer ${
                    isScrolled ? 'text-slate-800' : 'text-white'
                  }`}
                >
                  <option value="en" className="text-black">English</option>
                  <option value="id" className="text-black">Indonesian</option>
                  <option value="ar" className="text-black">العربية</option>
                </select>
              </div>
              <a
                href="/register"
                className={`text-sm font-medium py-1 ${
                  isScrolled ? 'text-slate-700 hover:text-slate-950' : 'text-emerald-100 hover:text-white'
                }`}
              >
                {t.nav.register}
              </a>
              <a href="/login" className="bg-[#d97706] text-white text-center text-xs font-bold py-3 rounded-full">
                {t.nav.login}
              </a>
            </div>
          </div>
        )}
      </header>

      {/* ── PAGE CONTENT ── */}
      <main className="flex-1">
        {children}
      </main>

      {/* ── FOOTER (same as landing page) ── */}
      <footer className="bg-slate-950 text-slate-400 py-16 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="Bahrain International Logo"
                width={28}
                height={28}
                className="object-contain filter brightness-125"
              />
              <span className="font-semibold text-white tracking-tight">BAHRAIN</span>
            </div>
            <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
              {t.footer.desc}
            </p>
          </div>
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-4">{t.footer.col1_title}</h5>
            <ul className="space-y-2 text-xs">
              <li><a href="/#features" className="hover:text-white transition-colors">Course Editor</a></li>
              <li><a href="/#features" className="hover:text-white transition-colors">3DVista Integration</a></li>
              <li><a href="/#features" className="hover:text-white transition-colors">Enterprise RBAC</a></li>
            </ul>
          </div>
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-4">{t.footer.col2_title}</h5>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-white transition-colors">API Reference</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Status Board</a></li>
            </ul>
          </div>
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-4">{t.footer.col3_title}</h5>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cookie Settings</a></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 border-t border-slate-900 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>{t.footer.copyright}</p>
          <div className="flex gap-4">
            <span onClick={() => handleLangChange('id')} className="cursor-pointer hover:text-white">Indonesia</span>
            <span onClick={() => handleLangChange('en')} className="cursor-pointer hover:text-white">English</span>
            <span onClick={() => handleLangChange('ar')} className="cursor-pointer hover:text-white">العربية</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
