"use client";

import Image from "next/image";
import GuideCategoryCard from "@/components/dashboard/guide/GuideCategoryCard";
import GuideItem from "@/components/dashboard/guide/GuideItem";

const categories = [
  { title: "Rukun Haji", count: "6", color: "bg-emerald-50 text-emerald-600", icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg> },
  { title: "Wajib Haji", count: "5", color: "bg-blue-50 text-blue-600", icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> },
  { title: "Larangan Ihram", count: "12", color: "bg-rose-50 text-rose-600", icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/></svg> },
  { title: "Fiqih Wanita", count: "8", color: "bg-purple-50 text-purple-600", icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg> },
];

const guides = [
  { title: "Tata Cara Pemakaian Kain Ihram", duration: "10 Menit", type: "Video", image: "/images/miqat.png", status: "Selesai" },
  { title: "Urutan Lengkap Ibadah Haji (Tamattu')", duration: "25 Menit", type: "Panduan", image: "/images/vr-preview.png", status: "Selesai" },
  { title: "Kesehatan Jamaah Selama di Mina", duration: "15 Menit", type: "Artikel", image: "/images/mina.png", status: "Belum Baca" },
  { title: "Adab dan Etika di Masjid Nabawi", duration: "12 Menit", type: "Video", image: "/images/miqat.png", status: "Belum Tonton" },
];

export default function GuidePage() {
  return (
    <div className="w-full space-y-12 pb-10">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Panduan Ibadah</h1>
        <p className="text-gray-500">Materi edukasi lengkap untuk membimbing langkah ibadah Anda.</p>
      </div>

      {/* Featured Guide */}
      <div className="relative h-[300px] rounded-[3rem] overflow-hidden group shadow-2xl">
         <Image src="/images/pilgrim-praying-natural.png" alt="Featured Guide" fill className="object-cover" />
         <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-10 lg:p-12 space-y-4">
            <span className="bg-[var(--color-accent)] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest w-fit">Featured Material</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-white max-w-2xl leading-tight">
               Memahami Makna Filosofis di Balik Setiap Rukun Haji
            </h2>
            <button className="bg-white text-gray-900 px-8 py-3 rounded-full font-bold text-sm w-fit hover:bg-gray-100 transition-all flex items-center gap-2 group/btn">
               Mulai Belajar Sekarang
               <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7-7 7"/></svg>
            </button>
         </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
         {categories.map((cat, i) => (
           <GuideCategoryCard key={i} {...cat} />
         ))}
      </div>

      {/* Guides List Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
         {/* Left Side: Video & Article List */}
         <div className="space-y-8">
            <div className="flex items-center justify-between">
               <h3 className="text-xl font-bold text-gray-900">Materi Terbaru</h3>
               <button className="text-sm font-bold text-[var(--color-primary)] hover:underline">Lihat Semua</button>
            </div>
            <div className="space-y-4">
               {guides.map((guide, i) => (
                 <GuideItem key={i} {...guide} />
               ))}
            </div>
         </div>

         {/* Right Side: Quick Reference / FAQ Card */}
         <div className="space-y-8">
            <h3 className="text-xl font-bold text-gray-900">Referensi Cepat</h3>
            <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm space-y-6">
               {[
                 { q: "Apa perbedaan Haji Tamattu' dan Haji Ifrad?", a: "Haji Tamattu' mendahulukan Umrah baru Haji, sedangkan Ifrad hanya melakukan Haji saja." },
                 { q: "Kapan waktu terbaik untuk melakukan Sa'i?", a: "Sa'i sebaiknya dilakukan segera setelah Thawaf tanpa jeda yang terlalu lama." },
                 { q: "Apa yang harus dilakukan jika melanggar larangan Ihram?", a: "Harus membayar Dam (denda) sesuai dengan jenis pelanggaran yang dilakukan." }
               ].map((faq, i) => (
                 <div key={i} className="space-y-2 group cursor-pointer">
                    <h4 className="font-bold text-gray-900 group-hover:text-[var(--color-primary)] transition-colors flex items-center gap-2">
                       <span className="w-1.5 h-1.5 bg-[var(--color-accent)] rounded-full"></span>
                       {faq.q}
                    </h4>
                    <p className="text-sm text-gray-500 leading-relaxed pl-3.5">
                       {faq.a}
                    </p>
                 </div>
               ))}
               <button className="w-full py-4 bg-emerald-50 text-[var(--color-primary)] rounded-2xl font-bold text-xs hover:bg-emerald-100 transition-all uppercase tracking-widest">
                  Buka Help Center
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}
