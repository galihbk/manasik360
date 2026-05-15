"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#fdfdfb]">
      <Navbar />

      <main className="flex-grow pt-32 pb-20 lg:pt-48 lg:pb-32">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
             <span className="text-[var(--color-primary)] font-bold tracking-[0.4em] text-xs mb-4 block uppercase opacity-60">Get in Touch</span>
             <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 tracking-tight leading-tight uppercase">HUBUNGI KAMI</h1>
             <p className="text-xl text-gray-500 mt-6 max-w-2xl mx-auto leading-relaxed">
               Kami di sini untuk membantu Anda mempersiapkan perjalanan spiritual terbaik dalam hidup Anda.
             </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
             {/* Contact Form Section */}
             <div className="bg-white p-10 lg:p-16 rounded-[4rem] shadow-[0_48px_80px_-16px_rgba(0,0,0,0.08)] border border-gray-50 space-y-10">
                <div className="space-y-4">
                   <h2 className="text-3xl font-bold text-gray-900">Kirim Pesan</h2>
                   <p className="text-gray-500 text-sm">Ada pertanyaan khusus? Isi form di bawah dan tim kami akan membalas Anda dalam 24 jam.</p>
                </div>

                <form className="space-y-8">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                         <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-2">Nama Lengkap</label>
                         <input 
                           type="text" 
                           placeholder="Nama Anda"
                           className="w-full px-8 py-5 bg-gray-50 border-none rounded-3xl text-sm focus:ring-2 focus:ring-[var(--color-primary)]/10 transition-all"
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-2">Email</label>
                         <input 
                           type="email" 
                           placeholder="email@anda.com"
                           className="w-full px-8 py-5 bg-gray-50 border-none rounded-3xl text-sm focus:ring-2 focus:ring-[var(--color-primary)]/10 transition-all"
                         />
                      </div>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-2">Subjek</label>
                      <select className="w-full px-8 py-5 bg-gray-50 border-none rounded-3xl text-sm focus:ring-2 focus:ring-[var(--color-primary)]/10 transition-all appearance-none">
                         <option>Pertanyaan Umum</option>
                         <option>Aktivasi Paket</option>
                         <option>Kerjasama Biro Travel</option>
                         <option>Kendala Teknis VR</option>
                      </select>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-2">Pesan</label>
                      <textarea 
                        rows={5}
                        placeholder="Tuliskan pesan Anda di sini..."
                        className="w-full px-8 py-6 bg-gray-50 border-none rounded-[3rem] text-sm focus:ring-2 focus:ring-[var(--color-primary)]/10 transition-all resize-none"
                      ></textarea>
                   </div>
                   <button className="w-full py-5 bg-[#064e3b] text-white rounded-3xl font-bold text-lg shadow-2xl shadow-emerald-950/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                      Kirim Sekarang
                   </button>
                </form>
             </div>

             {/* Contact Info Section */}
             <div className="space-y-16 lg:pt-10">
                <div className="space-y-12">
                   <div className="flex gap-8">
                      <div className="w-16 h-16 bg-emerald-50 text-[var(--color-primary)] rounded-3xl flex items-center justify-center shrink-0">
                         <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                      </div>
                      <div className="space-y-2">
                         <h4 className="text-xl font-bold text-gray-900">Kantor Pusat</h4>
                         <p className="text-gray-500 leading-relaxed max-w-xs">
                            Jl. Jendral Sudirman No. 12, Senayan, Jakarta Selatan, 12190
                         </p>
                      </div>
                   </div>

                   <div className="flex gap-8">
                      <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center shrink-0">
                         <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                      </div>
                      <div className="space-y-2">
                         <h4 className="text-xl font-bold text-gray-900">Hubungi Kami</h4>
                         <p className="text-gray-500 leading-relaxed">
                            WhatsApp: +62 812 9000 360 <br/>
                            Telp: (021) 555-0360
                         </p>
                      </div>
                   </div>

                   <div className="flex gap-8">
                      <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-3xl flex items-center justify-center shrink-0">
                         <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                      </div>
                      <div className="space-y-2">
                         <h4 className="text-xl font-bold text-gray-900">Dukungan Email</h4>
                         <p className="text-gray-500 leading-relaxed">
                            help@manasik360.com <br/>
                            support@manasik360.com
                         </p>
                      </div>
                   </div>
                </div>

                {/* Map Mockup */}
                <div className="relative aspect-video bg-gray-100 rounded-[3rem] overflow-hidden border-8 border-white shadow-2xl group">
                   <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Google Maps View</p>
                   </div>
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      <div className="w-10 h-10 bg-red-500 rounded-full border-4 border-white shadow-xl animate-bounce"></div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
