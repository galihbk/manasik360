"use client";

import Link from "next/link";
import Image from "next/image";
import Button from "../ui/Button";
import { useEffect, useState } from "react";

import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
            <Link href="/" className="hover:text-[var(--color-accent)] transition-colors">Home</Link>
            <Link href="/about" className="hover:text-[var(--color-accent)] transition-colors">Tentang Kami</Link>
            <Link href="#fitur" className="hover:text-[var(--color-accent)] transition-colors">Fitur</Link>
            <Link href="#harga" className="hover:text-[var(--color-accent)] transition-colors">Harga</Link>
            <Link href="/faq" className="hover:text-[var(--color-accent)] transition-colors">FAQ</Link>
            <Link href="/contact" className="hover:text-[var(--color-accent)] transition-colors">Hubungi Kami</Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-4">
            <Link
              href="/register"
              className={`hidden sm:block text-[13px] font-bold uppercase tracking-widest border-2 px-8 py-2.5 rounded-full transition-all ${isDarkText ? 'border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white' : 'border-white text-white hover:bg-white hover:text-[var(--color-primary)]'}`}
            >
              Daftar
            </Link>
            <Button
              href="/login"
              className={`px-8 py-2.5 rounded-full font-bold text-[13px] uppercase tracking-widest shadow-lg transition-all ${isDarkText ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-accent)] text-white hover:bg-[#b45309] border-none'}`}
            >
              Masuk
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
