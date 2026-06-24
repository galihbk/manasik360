"use client";

import Link from "next/link";
import Image from "next/image";
import Button from "../ui/Button";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const { language, setLanguage, t } = useLanguage();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll();

    // Run after a short delay to account for browser auto-scroll to hash elements
    const timer = setTimeout(handleScroll, 150);

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
    };
  }, [pathname]);

  const isDarkText = isScrolled || !isHomePage;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${isScrolled || !isHomePage ? 'bg-white shadow-xl py-2' : 'bg-transparent py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo Badge Style (Canva Reference) */}
          <Link href="/" className="relative flex items-center h-full">
            <div className={`absolute top-[-1.5rem] lg:top-[-3.5rem] w-24 lg:w-32 h-[140px] lg:h-[190px] bg-[var(--color-accent)] transition-all duration-500 flex flex-col items-center justify-center pt-1 lg:pt-4 shadow-lg mihrab-shape z-50 ${isScrolled ? 'scale-90 lg:translate-y-4' : ''}`}>
               <div className="relative w-12 h-12 lg:w-24 lg:h-24">
                  <Image 
                    src="/logo.png" 
                    alt="Logo" 
                    fill 
                    className="object-contain brightness-0 invert" 
                  />
               </div>
            </div>
            {/* Spacer to keep nav items centered correctly */}
            <div className="w-24 lg:w-32"></div>
          </Link>

          {/* Navigation Links */}
          <div className={`hidden lg:flex items-center gap-8 text-[13px] font-bold uppercase tracking-widest transition-colors ${isDarkText ? 'text-gray-600' : 'text-white/90'}`}>
            <Link href="/" className="hover:text-[var(--color-accent)] transition-colors">{t("nav.home")}</Link>
            <Link href="/about" className="hover:text-[var(--color-accent)] transition-colors">{t("nav.about")}</Link>
            <Link href="/#fitur" className="hover:text-[var(--color-accent)] transition-colors">{t("nav.features")}</Link>
            <Link href="/#harga" className="hover:text-[var(--color-accent)] transition-colors">{t("nav.pricing")}</Link>
            <Link href="/blog" className="hover:text-[var(--color-accent)] transition-colors">{t("nav.blog")}</Link>
            <Link href="/faq" className="hover:text-[var(--color-accent)] transition-colors">{t("nav.faq")}</Link>
            <Link href="/contact" className="hover:text-[var(--color-accent)] transition-colors">{t("nav.contact")}</Link>
          </div>

          {/* Right Section: Language Dropdown + Auth + Hamburger Toggle */}
          <div className="flex items-center gap-3 md:gap-4">
            {/* Language Selector Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsLangOpen(!isLangOpen)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all text-xs font-bold uppercase tracking-wider ${
                  isDarkText 
                  ? 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100' 
                  : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                }`}
              >
                 {language === "id" && (
                   <div className="w-4 h-4 rounded-full overflow-hidden flex flex-col border border-gray-200 shrink-0">
                      <div className="h-1/2 bg-red-600"></div>
                      <div className="h-1/2 bg-white"></div>
                   </div>
                 )}
                 {language === "en" && (
                   <div className="w-4 h-4 rounded-full overflow-hidden flex flex-col border border-gray-200 shrink-0">
                      <div className="h-1/3 bg-blue-800"></div>
                      <div className="h-1/3 bg-red-600"></div>
                      <div className="h-1/3 bg-white"></div>
                   </div>
                 )}
                 {language === "ar" && (
                   <div className="w-4 h-4 rounded-full overflow-hidden flex flex-col border border-gray-200 shrink-0 bg-green-700 flex items-center justify-center text-[8px] text-white font-bold">ع</div>
                 )}
                 <span className="text-[10px]">{language}</span>
                 <svg className="w-3.5 h-3.5 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"/></svg>
              </button>

              {isLangOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsLangOpen(false)}></div>
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 p-2 space-y-1">
                    <button
                      onClick={() => {
                        setLanguage("id");
                        setIsLangOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-left text-xs font-bold transition-all ${
                        language === "id" ? "bg-emerald-50 text-emerald-700" : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <div className="w-5 h-5 rounded-full overflow-hidden flex flex-col border border-gray-200 shrink-0">
                        <div className="h-1/2 bg-red-600"></div>
                        <div className="h-1/2 bg-white"></div>
                      </div>
                      <span>Bahasa Indonesia</span>
                    </button>
                    <button
                      onClick={() => {
                        setLanguage("en");
                        setIsLangOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-left text-xs font-bold transition-all ${
                        language === "en" ? "bg-emerald-50 text-emerald-700" : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <div className="w-5 h-5 rounded-full overflow-hidden flex flex-col border border-gray-200 shrink-0">
                        <div className="h-1/3 bg-blue-800"></div>
                        <div className="h-1/3 bg-red-600"></div>
                        <div className="h-1/3 bg-white"></div>
                      </div>
                      <span>English</span>
                    </button>
                    <button
                      onClick={() => {
                        setLanguage("ar");
                        setIsLangOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-left text-xs font-bold transition-all ${
                        language === "ar" ? "bg-emerald-50 text-emerald-700" : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <div className="w-5 h-5 rounded-full overflow-hidden border border-gray-200 shrink-0 bg-green-700 flex items-center justify-center text-[10px] text-white font-bold">
                        ع
                      </div>
                      <span>العربية (Arabic)</span>
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Desktop Auth Buttons (lg:flex) */}
            <div className="hidden lg:flex items-center gap-4">
              <Link
                href="/register"
                className={`text-[13px] font-bold uppercase tracking-widest border-2 px-8 py-2.5 rounded-full transition-all ${isDarkText ? 'border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white' : 'border-white text-white hover:bg-white hover:text-[var(--color-primary)]'}`}
              >
                {t("nav.register")}
              </Link>
              <Button
                href="/login"
                className={`px-8 py-2.5 rounded-full font-bold text-[13px] uppercase tracking-widest shadow-lg transition-all ${isDarkText ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-accent)] text-white hover:bg-[#b45309] border-none'}`}
              >
                {t("nav.login")}
              </Button>
            </div>

            {/* Mobile Hamburger Toggle (lg:hidden) */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`lg:hidden p-2 rounded-xl transition-colors ${
                isDarkText ? 'text-gray-600 hover:bg-gray-50' : 'text-white hover:bg-white/10'
              }`}
            >
              {isMobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-100 shadow-xl px-6 pt-4 pb-8 space-y-5 animate-in slide-in-from-top-5 duration-300">
          <div className="flex flex-col gap-3.5 text-xs font-bold uppercase tracking-widest text-gray-600">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[var(--color-accent)] py-2 transition-colors">{t("nav.home")}</Link>
            <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[var(--color-accent)] py-2 transition-colors">{t("nav.about")}</Link>
            <Link href="/#fitur" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[var(--color-accent)] py-2 transition-colors">{t("nav.features")}</Link>
            <Link href="/#harga" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[var(--color-accent)] py-2 transition-colors">{t("nav.pricing")}</Link>
            <Link href="/blog" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[var(--color-accent)] py-2 transition-colors">{t("nav.blog")}</Link>
            <Link href="/faq" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[var(--color-accent)] py-2 transition-colors">{t("nav.faq")}</Link>
            <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[var(--color-accent)] py-2 transition-colors">{t("nav.contact")}</Link>
          </div>
          <div className="border-t border-gray-100 pt-5 flex flex-col gap-3">
            <Link
              href="/register"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-center text-xs font-bold uppercase tracking-widest border-2 border-[var(--color-primary)] text-[var(--color-primary)] py-3 rounded-full hover:bg-[var(--color-primary)] hover:text-white transition-all"
            >
              {t("nav.register")}
            </Link>
            <Link
              href="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-center text-xs font-bold uppercase tracking-widest bg-[var(--color-primary)] text-white py-3 rounded-full shadow-md hover:bg-emerald-800 transition-all font-sans"
            >
              {t("nav.login")}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
