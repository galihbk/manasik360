"use client";

import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#fdfdfb]">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-[#064e3b] pt-32 pb-24 lg:pt-48 lg:pb-32 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-5 islamic-pattern pointer-events-none"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <span className="text-[var(--color-accent)] font-bold tracking-[0.3em] uppercase text-sm mb-4 block">Tentang Kami</span>
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-8 tracking-tight leading-tight">
              Menghubungkan Hati dengan <br className="hidden lg:block"/> Tanah Suci Melalui Teknologi
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Bahrain lahir dari keinginan untuk membantu setiap jamaah merasakan ketenangan dan kesiapan maksimal sebelum melangkah ke Baitullah.
            </p>
          </div>
        </section>

        {/* Our Vision Section */}
        <section className="py-32 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center gap-20">
              <div className="flex-1 relative">
                 <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-3xl border-[12px] border-[#f8f9f5]">
                    <Image 
                      src="/images/about-mission.png" 
                      alt="Suasana Suci" 
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-[3000ms]"
                    />
                 </div>
                 <div className="absolute -bottom-10 -right-10 bg-[var(--color-accent)] text-white p-10 rounded-[2.5rem] shadow-2xl max-w-xs hidden lg:block">
                    <p className="text-3xl font-bold mb-2">10k+</p>
                    <p className="text-sm font-medium opacity-80 uppercase tracking-widest leading-relaxed">Jamaah telah terbantu mempersiapkan haji & umrah.</p>
                 </div>
              </div>
              <div className="flex-1 space-y-10">
                <div className="space-y-4">
                  <h2 className="text-4xl font-bold text-gray-900 tracking-tight">Misi Perjalanan Kami</h2>
                  <div className="w-20 h-1.5 bg-[var(--color-accent)] rounded-full"></div>
                </div>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Kami memahami bahwa perjalanan Haji dan Umrah adalah momen sekali seumur hidup yang paling sakral. Namun, ketidaktahuan akan situasi lapangan seringkali menimbulkan kecemasan bagi calon jamaah, terutama lansia.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Bahrain hadir sebagai jembatan imersif. Dengan teknologi VR 360°, kami menghadirkan simulasi nyata yang memungkinkan jamaah "berada" di lokasi sebenarnya, menghafal rute, dan memahami rukun secara visual sebelum keberangkatan.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-6">
                   <div className="space-y-3">
                      <h4 className="font-bold text-gray-900 text-xl">Visi Kami</h4>
                      <p className="text-sm text-gray-500">Menjadi platform edukasi manasik digital nomor satu di dunia yang menggabungkan syariat dan teknologi.</p>
                   </div>
                   <div className="space-y-3">
                      <h4 className="font-bold text-gray-900 text-xl">Nilai Kami</h4>
                      <p className="text-sm text-gray-500">Amanah dalam menyampaikan ilmu, Inovatif dalam teknologi, dan Imersif dalam pengalaman.</p>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features / Why Us Section */}
        <section className="py-32 bg-[#f8f9f5] relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-24">
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">Kenapa Bahrain Berbeda?</h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">Inovasi kami dirancang untuk memudahkan, bukan mempersulit.</p>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { t: "Akurasi 8K", d: "Semua visual diambil langsung di lokasi nyata dengan resolusi ultra-tinggi untuk detail maksimal.", icon: <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg> },
              { t: "Kurikulum Terintegrasi", d: "Materi disusun bersama ustadz pembimbing berpengalaman sesuai syariat yang sahih.", icon: <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg> },
              { t: "Aksesibilitas Tinggi", d: "Dapat diakses melalui smartphone, tablet, komputer, hingga headset VR profesional.", icon: <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg> }
            ].map((item, i) => (
              <div key={i} className="bg-white p-12 rounded-[3rem] shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-500 group">
                <div className="text-[var(--color-primary)] mb-8 group-hover:scale-110 transition-transform inline-block">{item.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{item.t}</h3>
                <p className="text-gray-500 leading-relaxed">{item.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">Mari Bergabung dalam <br/> Revolusi Manasik Digital</h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">Tingkatkan kesiapan ibadah Anda atau jamaah travel Anda sekarang juga.</p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
               <Button href="/register" className="px-12 py-5 text-xl font-bold rounded-2xl bg-[var(--color-primary)] shadow-2xl shadow-emerald-900/20 transition-transform hover:scale-105">
                 Mulai Sekarang
               </Button>
               <Button variant="outline" href="/#kontak" className="px-12 py-5 text-xl font-bold rounded-2xl border-gray-200">
                 Hubungi Kami
               </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
