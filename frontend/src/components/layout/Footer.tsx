"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer id="kontak" className="py-24 bg-[#064e3b] text-white relative overflow-hidden">
      {/* Decorative background pattern */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] islamic-pattern pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-16 mb-20">
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="relative w-12 h-12">
                 <img src="/logo.png" alt="Logo" className="object-contain brightness-0 invert" />
              </div>
              <div className="flex flex-col">
                 <span className="text-xl font-bold text-white leading-none">bahrain</span>
                 <span className="text-[10px] text-[var(--color-accent)] font-bold uppercase tracking-widest mt-1">International</span>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed max-w-xs">
              Membantu jamaah Indonesia mempersiapkan perjalanan spiritual terbaik mereka melalui teknologi imersif yang nyata dan terpercaya.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-8 uppercase tracking-widest text-[var(--color-accent)]">Navigasi</h4>
            <ul className="space-y-6 text-gray-300 font-medium">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">Tentang Kami</Link></li>
              <li><Link href="#fitur" className="hover:text-white transition-colors">Fitur Utama</Link></li>
              <li><Link href="#harga" className="hover:text-white transition-colors">Paket Harga</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-8 uppercase tracking-widest text-[var(--color-accent)]">Dukungan</h4>
            <ul className="space-y-6 text-gray-300 font-medium">
              <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Pusat Bantuan</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Kebijakan Privasi</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Syarat & Ketentuan</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-8 uppercase tracking-widest text-[var(--color-accent)]">Hubungi Kami</h4>
            <p className="text-gray-300 mb-6">Punya pertanyaan? Kami siap membantu persiapan Anda.</p>
            <div className="space-y-4">
              <a href="mailto:info@bahrain.com" className="block text-gray-100 font-bold hover:text-[var(--color-accent)] transition-colors">info@bahrain.com</a>
              <div className="flex gap-4">
              {[
                { name: "Instagram", icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" strokeWidth="2"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" strokeWidth="2"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth="2"/></svg> },
                { name: "Facebook", icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" strokeWidth="2"/></svg> },
                { name: "YouTube", icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 00-1.94 2C1 8.11 1 12 1 12s0 3.89.46 5.58a2.78 2.78 0 001.94 2c1.72.42 8.6.42 8.6.42s6.88 0 8.6-.42a2.78 2.78 0 001.94-2C23 15.89 23 12 23 12s0-3.89-.46-5.58z" strokeWidth="2"/><path d="M9.75 15.02l5.75-3.02-5.75-3.02v6.04z" fill="currentColor"/></svg> }
              ].map((social, i) => (
                <div key={i} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[var(--color-accent)] transition-all cursor-pointer group" title={social.name}>
                  <div className="text-white group-hover:scale-110 transition-transform">
                    {social.icon}
                  </div>
                </div>
              ))}
            </div>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-6 text-center sm:text-left">
          <p className="text-gray-400 text-sm">© 2026 Bahrain. Seluruh hak cipta dilindungi oleh Allah SWT.</p>
        </div>
      </div>
    </footer>
  );
}
