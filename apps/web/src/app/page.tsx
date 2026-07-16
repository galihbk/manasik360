'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { id, en, ar } from '@bahrain/localization';
import { 
  ArrowRight, 
  BookOpen, 
  Video, 
  Compass, 
  Award, 
  CheckCircle2, 
  Users, 
  Shield, 
  Globe2, 
  BarChart3, 
  Layers, 
  Ticket, 
  FileSpreadsheet, 
  MessageSquare,
  HelpCircle,
  Menu,
  X,
  ChevronDown,
  PlayCircle
} from 'lucide-react';
import { ApiClient } from '@bahrain/api-client';

const client = new ApiClient({ baseUrl: '/api/v1' });

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('en');
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const [prices, setPrices] = useState<{ hajj: number; umroh: number }>({ hajj: 100000, umroh: 100000 });

  // Read language preference on mount and fetch prices
  useEffect(() => {
    const savedLang = localStorage.getItem('bahrain_lang');
    if (savedLang) {
      setCurrentLang(savedLang);
    }
    client.getVoucherPrices()
      .then(res => {
        if (res && res.hajj && res.umroh) {
          setPrices({ hajj: res.hajj, umroh: res.umroh });
        }
      })
      .catch(err => console.error('Gagal mengambil harga paket:', err));
  }, []);

  // Update language preference helper
  const handleLangChange = (lang: string) => {
    setCurrentLang(lang);
    localStorage.setItem('bahrain_lang', lang);
  };

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Map translations
  const translationsMap: Record<string, any> = { id, en, ar };
  const t = translationsMap[currentLang] || en;
  const isRtl = currentLang === 'ar';

  const toggleFaq = (index: number) => {
    setFaqOpen(faqOpen === index ? null : index);
  };

  const navLinks = [
    { label: t.nav.home, href: '#' },
    { label: t.nav.about, href: '/about' },
    { label: t.nav.features, href: '#features' },
    { label: 'Blog', href: '/blogs' },
    { label: 'Kemitraan', href: '/recommendations' },
    { label: t.nav.pricing, href: '#pricing' },
    { label: t.nav.faq, href: '#faq' }
  ];

  // Map icons dynamically to keep translations separated from UI templates
  const featureIcons = [
    <BookOpen key="1" className="w-5 h-5 text-[#1e40af]" />,
    <Compass key="2" className="w-5 h-5 text-[#1e40af]" />,
    <HelpCircle key="3" className="w-5 h-5 text-[#1e40af]" />,
    <Award key="4" className="w-5 h-5 text-[#1e40af]" />,
    <Ticket key="5" className="w-5 h-5 text-[#1e40af]" />,
    <BarChart3 key="6" className="w-5 h-5 text-[#1e40af]" />,
    <Layers key="7" className="w-5 h-5 text-[#1e40af]" />,
    <FileSpreadsheet key="8" className="w-5 h-5 text-[#1e40af]" />,
    <MessageSquare key="9" className="w-5 h-5 text-[#1e40af]" />,
    <Globe2 key="10" className="w-5 h-5 text-[#1e40af]" />
  ];

  const userFlowIcons = [
    <BookOpen key="u1" className="w-4 h-4 text-white" />,
    <Video key="u2" className="w-4 h-4 text-white" />,
    <Compass key="u3" className="w-4 h-4 text-white" />,
    <HelpCircle key="u4" className="w-4 h-4 text-white" />,
    <Award key="u5" className="w-4 h-4 text-white" />
  ];

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className={`min-h-screen bg-white selection:bg-primary/10 selection:text-primary-dark ${isRtl ? 'text-right' : 'text-left'}`}>
      
      {/* 1. Header/Navigation */}
      <header className={`sticky top-0 z-50 transition-all duration-300 border-b ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md border-slate-200/80 shadow-sm py-1' 
          : 'bg-[#064e3b] border-[#022c22] py-0'
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-20">
          
          {/* Logo Brand Tag (Mihrab Golden Ribbon Style) */}
          <div 
            className="relative bg-[#d97706] text-white px-4 pt-5 pb-9 md:px-6 md:pt-8 md:pb-12 flex flex-col items-center justify-center shadow-lg z-50 min-w-[80px] md:min-w-[130px] self-start mt-[-4px] md:mt-[-10px] transition-transform duration-300"
            style={{ clipPath: 'polygon(0 0, 100% 0, 100% 85%, 50% 100%, 0 85%)' }}
          >
            <Image 
              src="/logo.png" 
              alt="Bahrain Logo" 
              width={64} 
              height={64} 
              className="w-12 h-12 md:w-16 md:h-16 object-contain brightness-0 invert"
            />
          </div>

          {/* Center Links */}
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

        {/* Mobile Navigation Drawer (Slide right to left) */}
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9998]"
              onClick={() => setMobileMenuOpen(false)}
            />
            {/* Drawer Panel */}
            <div className="fixed top-0 right-0 h-screen w-72 bg-[#064e3b] text-white z-[9999] shadow-2xl p-6 flex flex-col gap-6 animate-in slide-in-from-right duration-250">
              <div className="flex items-center justify-between border-b border-emerald-900 pb-4">
                <span className="text-sm font-black uppercase tracking-wider text-emerald-350">Menu Bahrain</span>
                <button onClick={() => setMobileMenuOpen(false)} className="p-1.5 hover:bg-emerald-800 rounded-lg text-emerald-100 transition-all">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="flex flex-col gap-4 text-sm font-bold text-emerald-100/90">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-1 hover:text-white transition-all hover:translate-x-1"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
              <div className="border-t border-emerald-900 pt-6 flex flex-col gap-4">
                <div className="flex items-center gap-2 text-xs">
                  <Globe2 className="w-4 h-4 text-emerald-400" />
                  <select
                    value={currentLang}
                    onChange={(e) => { handleLangChange(e.target.value); setMobileMenuOpen(false); }}
                    className="bg-emerald-900/80 border border-emerald-850 text-white rounded px-2.5 py-1 text-xs focus:ring-0 cursor-pointer font-bold"
                  >
                    <option value="en" className="text-black">English</option>
                    <option value="id" className="text-black">Indonesian</option>
                    <option value="ar" className="text-black">العربية</option>
                  </select>
                </div>
                <a
                  href="/register"
                  className="text-center text-xs font-bold py-2.5 rounded-full border border-emerald-500/30 hover:border-emerald-500 hover:bg-emerald-800 transition-all text-emerald-100"
                >
                  {t.nav.register}
                </a>
                <a href="/login" className="bg-[#d97706] hover:bg-[#b45309] text-white text-center text-xs font-bold py-3 rounded-full shadow-md transition-all">
                  {t.nav.login}
                </a>
              </div>
            </div>
          </>
        )}
      </header>

      {/* 2. Hero Section */}
      <section className="relative bg-[#064e3b] py-20 lg:py-32 overflow-hidden border-b border-[#022c22]">
        
        {/* Left/Right Arabesque Decors */}
        <div className={`absolute ${isRtl ? 'right-0' : 'left-0'} top-1/2 -translate-y-1/2 opacity-10 pointer-events-none hidden lg:block`}>
          <svg width="400" height="400" viewBox="0 0 100 100" fill="none" stroke="currentColor" className="text-white">
            <circle cx="50" cy="50" r="45" strokeWidth="0.5" />
            <polygon points="50,5 95,50 50,95 5,50" strokeWidth="0.5" />
            <polygon points="50,5 50,95" strokeWidth="0.5" />
            <polygon points="5,50 95,50" strokeWidth="0.5" />
            <circle cx="50" cy="50" r="30" strokeWidth="0.5" />
            <circle cx="50" cy="50" r="15" strokeWidth="0.5" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Hero Content */}
          <div className="lg:col-span-7 flex flex-col items-start text-left pt-6 lg:pt-0">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight leading-[1.15] mb-6">
              {t.hero.heading}
            </h1>
            <p className="text-base sm:text-lg text-emerald-100/75 max-w-xl mb-10 leading-relaxed font-sans">
              {t.hero.subheading}
            </p>
            <div className="flex flex-wrap gap-4">
              <a 
                href="/register" 
                className="inline-flex items-center gap-3 bg-[#d97706] hover:bg-[#b45309] text-white text-sm font-bold px-8 py-3.5 rounded-full transition-all shadow-lg shadow-emerald-950/30"
              >
                {t.hero.cta}
                <PlayCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Hero Right Content - Arched Mihrab/Dome Frame */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <div className="relative w-64 h-80 sm:w-72 sm:h-96 md:w-80 md:h-[400px] rounded-t-full border-[6px] border-[#d97706]/35 overflow-hidden shadow-2xl shadow-emerald-950/40 bg-[#022c22]">
              <Image 
                src="/images/pilgrim-hero.png" 
                alt="Pilgrim Haji 360 Preview" 
                fill
                priority
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#022c22]/50 to-transparent"></div>
            </div>
          </div>

        </div>
      </section>



      {/* 5. Platform Overview */}
      <section id="features" className="py-24 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mb-16">
            <h2 className="text-xs font-bold text-emerald-700 uppercase tracking-widest mb-3">{t.overview.section_title}</h2>
            <p className="text-3xl font-black text-slate-900 tracking-tight mb-4">{t.overview.section_subtitle}</p>
            <p className="text-sm text-slate-500 leading-relaxed">{t.overview.section_desc}</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 border border-slate-200 rounded-md flex flex-col justify-between">
              <div>
                <span className="inline-block px-2.5 py-1 rounded bg-emerald-50 text-[10px] text-emerald-800 font-bold uppercase mb-4">{t.overview.student.badge}</span>
                <h3 className="text-lg font-bold text-slate-900 mb-3">{t.overview.student.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{t.overview.student.desc}</p>
              </div>
            </div>
            <div className="bg-white p-8 border border-slate-200 rounded-md flex flex-col justify-between">
              <div>
                <span className="inline-block px-2.5 py-1 rounded bg-amber-50 text-[10px] text-[#d97706] font-bold uppercase mb-4">{t.overview.organization.badge}</span>
                <h3 className="text-lg font-bold text-slate-900 mb-3">{t.overview.organization.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{t.overview.organization.desc}</p>
              </div>
            </div>
            <div className="bg-white p-8 border border-slate-200 rounded-md flex flex-col justify-between">
              <div>
                <span className="inline-block px-2.5 py-1 rounded bg-slate-100 text-[10px] text-slate-600 font-bold uppercase mb-4">{t.overview.operator.badge}</span>
                <h3 className="text-lg font-bold text-slate-900 mb-3">{t.overview.operator.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{t.overview.operator.desc}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Learning Experience (Timeline) */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs font-bold text-emerald-700 uppercase tracking-widest mb-3">{t.user_flow.section_title}</h2>
          <p className="text-3xl font-black text-slate-900 tracking-tight">{t.user_flow.section_subtitle}</p>
        </div>

        <div className="relative max-w-3xl mx-auto">
          <div className="absolute left-4 lg:left-1/2 top-0 bottom-0 w-0.5 bg-slate-100 -translate-x-1/2"></div>
          
          <div className="space-y-12">
            {t.user_flow.steps.map((step: any, idx: number) => (
              <div key={idx} className="relative flex flex-col lg:flex-row items-start lg:items-center">
                <div className="absolute left-4 lg:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-emerald-800 flex items-center justify-center z-10">
                  {userFlowIcons[idx]}
                </div>
                <div className={`w-full lg:w-1/2 pl-12 lg:pl-0 ${idx % 2 === 0 ? 'lg:pr-12 lg:text-right' : 'lg:pl-12 lg:order-last'}`}>
                  <h4 className="font-bold text-sm text-slate-900 mb-1">{step.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
                </div>
                <div className="hidden lg:block w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Organization Experience */}
      <section className="py-24 bg-slate-50/50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-emerald-700 uppercase tracking-widest mb-3">{t.org_flow.section_title}</h2>
            <p className="text-3xl font-black text-slate-900 tracking-tight">{t.org_flow.section_subtitle}</p>
          </div>

          <div className="grid md:grid-cols-5 gap-6 text-center">
            {t.org_flow.steps.map((o: any, idx: number) => (
              <div key={idx} className="p-6 bg-white border border-slate-150 rounded-md">
                <div className="font-mono text-xl font-black text-primary/45 mb-3">{o.num}</div>
                <h4 className="font-bold text-xs text-slate-900 mb-2">{o.title}</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">{o.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Platform Features Grid */}
      <section className="py-24 max-w-7xl mx-auto px-6 border-t border-slate-100">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs font-bold text-emerald-700 uppercase tracking-widest mb-3">{t.features.section_title}</h2>
          <p className="text-3xl font-black text-slate-900 tracking-tight">{t.features.section_subtitle}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {t.features.items.map((f: any, i: number) => (
            <div key={i} className="p-5 border border-slate-100 rounded-md bg-white hover:border-slate-200 transition-all">
              <div className="mb-4">{featureIcons[i]}</div>
              <h4 className="font-bold text-xs text-slate-900 mb-2">{f.title}</h4>
              <p className="text-[10px] text-slate-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 9. Pricing Section */}
      <section id="pricing" className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-emerald-700 uppercase tracking-widest mb-3">{t.pricing.heading}</h2>
            <p className="text-3xl font-black text-slate-900 tracking-tight">{t.pricing.subheading}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Hajj Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-900 uppercase tracking-wide">
                      {currentLang === 'id' ? 'Paket Haji' : currentLang === 'ar' ? 'باقة الحج' : 'Hajj Package'}
                    </h3>
                    <p className="text-[11px] text-slate-450 mt-1">
                      {currentLang === 'id' ? 'Persiapan Haji komprehensif' : currentLang === 'ar' ? 'إعداد الحج الشامل' : 'Comprehensive Hajj preparation'}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-emerald-800">
                      Rp {prices.hajj.toLocaleString('id-ID')}
                    </span>
                    <p className="text-[9px] text-slate-450 font-mono mt-0.5">
                      {currentLang === 'id' ? 'per jemaah' : currentLang === 'ar' ? 'لكل مستخدم' : 'per user'}
                    </p>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3 text-xs text-slate-655">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{currentLang === 'id' ? 'Akses simulasi VR Haji Interaktif' : currentLang === 'ar' ? 'الوصول إلى محاكاة الحج التفاعلية VR' : 'Interactive VR Hajj simulation access'}</span>
                  </li>
                  <li className="flex items-center gap-3 text-xs text-slate-655">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{currentLang === 'id' ? 'Materi modul panduan audio visual haji' : currentLang === 'ar' ? 'وحدات دليل الحج السمعي والبصري' : 'Hajj audio-visual guide modules'}</span>
                  </li>
                  <li className="flex items-center gap-3 text-xs text-slate-655">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{currentLang === 'id' ? 'Akses multi-platform (Android, Web, VR)' : currentLang === 'ar' ? 'الوصول متعدد المنصات (أندرويد، ويب، VR)' : 'Multi-platform access (Android, Web, VR)'}</span>
                  </li>
                  <li className="flex items-center gap-3 text-xs text-slate-655">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{currentLang === 'id' ? 'Sertifikat digital kesiapan ibadah haji' : currentLang === 'ar' ? 'شهادة رقمية للجاهزية للحج' : 'Hajj readiness digital certificate'}</span>
                  </li>
                </ul>
              </div>

              <a 
                href="/register" 
                className="block text-center bg-[#064e3b] hover:bg-[#043427] text-white text-xs font-bold py-3.5 rounded-full transition-all shadow-md"
              >
                {t.hero.cta}
              </a>
            </div>

            {/* Umrah Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-900 uppercase tracking-wide">
                      {currentLang === 'id' ? 'Paket Umrah' : currentLang === 'ar' ? 'باقة العمرة' : 'Umrah Package'}
                    </h3>
                    <p className="text-[11px] text-slate-450 mt-1">
                      {currentLang === 'id' ? 'Persiapan Umrah komprehensif' : currentLang === 'ar' ? 'إعداد العمرة الشامل' : 'Comprehensive Umrah preparation'}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-emerald-800">
                      Rp {prices.umroh.toLocaleString('id-ID')}
                    </span>
                    <p className="text-[9px] text-slate-450 font-mono mt-0.5">
                      {currentLang === 'id' ? 'per jemaah' : currentLang === 'ar' ? 'لكل مستخدم' : 'per user'}
                    </p>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3 text-xs text-slate-655">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{currentLang === 'id' ? 'Akses simulasi VR Umrah Interaktif' : currentLang === 'ar' ? 'الوصول إلى محاكاة العمرة التفاعلية VR' : 'Interactive VR Umrah simulation access'}</span>
                  </li>
                  <li className="flex items-center gap-3 text-xs text-slate-655">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{currentLang === 'id' ? 'Materi modul panduan audio visual umrah' : currentLang === 'ar' ? 'وحدات دليل العمرة السمعي والبصري' : 'Umrah audio-visual guide modules'}</span>
                  </li>
                  <li className="flex items-center gap-3 text-xs text-slate-655">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{currentLang === 'id' ? 'Akses multi-platform (Android, Web, VR)' : currentLang === 'ar' ? 'الوصول متعدد المنصات (أندرويد، ويب، VR)' : 'Multi-platform access (Android, Web, VR)'}</span>
                  </li>
                  <li className="flex items-center gap-3 text-xs text-slate-655">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{currentLang === 'id' ? 'Sertifikat digital kesiapan ibadah umrah' : currentLang === 'ar' ? 'شهادة رقمية للجاهزية للعمرة' : 'Umrah readiness digital certificate'}</span>
                  </li>
                </ul>
              </div>

              <a 
                href="/register" 
                className="block text-center bg-[#d97706] hover:bg-[#b45309] text-white text-xs font-bold py-3.5 rounded-full transition-all shadow-md shadow-amber-900/10"
              >
                {t.hero.cta}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 10. Statistics */}
      <section className="py-24 bg-[#064e3b] text-white border-y border-[#022c22]">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12 text-center">
          {t.stats.items.map((s: any, i: number) => (
            <div key={i}>
              <div className="text-4xl lg:text-5xl font-black text-[#fbbf24] mb-2">{s.value}</div>
              <p className="text-xs text-white/80 font-medium tracking-wide">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 11. Testimonials */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs font-bold text-emerald-700 uppercase tracking-widest mb-3">{t.testimonials.section_title}</h2>
          <p className="text-3xl font-black text-slate-900 tracking-tight">{t.testimonials.section_subtitle}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {t.testimonials.items.map((testimonial: any, i: number) => (
            <div key={i} className="p-6 bg-white border border-slate-150 rounded-md flex flex-col justify-between">
              <p className="text-xs text-slate-600 italic leading-relaxed mb-6">"{testimonial.quote}"</p>
              <div>
                <h4 className="font-bold text-xs text-slate-950">{testimonial.author}</h4>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">{testimonial.org}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 12. FAQ Accordion */}
      <section id="faq" className="py-24 bg-slate-50 border-y border-slate-100">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-xs font-bold text-emerald-700 uppercase tracking-widest mb-3">{t.faq.heading}</h2>
            <p className="text-3xl font-black text-slate-900 tracking-tight">{t.faq.subheading}</p>
          </div>

          <div className="space-y-4">
            {t.faq.items.map((faq: any, idx: number) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-md overflow-hidden">
                <button 
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none"
                >
                  <span className="font-bold text-sm text-slate-900">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${faqOpen === idx ? 'rotate-180' : ''}`} />
                </button>
                {faqOpen === idx && (
                  <div className="px-6 pb-4 border-t border-slate-50 pt-3">
                    <p className="text-xs text-slate-600 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* 14. Footer */}
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
              <li><a href="#features" className="hover:text-white transition-colors">Course Editor</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">3DVista Integration</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Enterprise RBAC</a></li>
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
