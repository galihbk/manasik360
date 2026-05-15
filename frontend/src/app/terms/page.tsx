"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function TermsPage() {
  const sections = [
    {
      title: "1. Ketentuan Penggunaan",
      content: "Dengan mengakses dan menggunakan platform Manasik360, Anda setuju untuk terikat oleh syarat dan ketentuan ini. Layanan kami disediakan untuk tujuan edukasi persiapan ibadah Haji dan Umroh."
    },
    {
      title: "2. Akun Pengguna",
      content: "Anda bertanggung jawab untuk menjaga kerahasiaan informasi akun dan kata sandi Anda. Anda setuju untuk bertanggung jawab atas semua aktivitas yang terjadi di bawah akun Anda."
    },
    {
      title: "3. Hak Kekayaan Intelektual",
      content: "Seluruh konten dalam Manasik360, termasuk namun tidak terbatas pada video 360°, teks, grafis, logo, dan perangkat lunak, adalah milik Manasik360 dan dilindungi oleh undang-undang hak cipta Indonesia."
    },
    {
      title: "4. Pembelian dan Pembatalan",
      content: "Semua transaksi pembelian paket adalah final dan tidak dapat dikembalikan, kecuali ditentukan lain oleh tim kami dalam kondisi khusus. Aktivasi paket akan dilakukan segera setelah konfirmasi pembayaran diterima."
    },
    {
      title: "5. Batasan Tanggung Jawab",
      content: "Manasik360 adalah alat bantu simulasi dan edukasi. Kami tidak bertanggung jawab atas perubahan prosedur resmi yang dilakukan oleh otoritas pemerintah Arab Saudi atau penyelenggara Haji/Umroh resmi."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#fdfdfb]">
      <Navbar />

      <main className="flex-grow pt-32 pb-20 lg:pt-48 lg:pb-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
             <span className="text-[var(--color-primary)] font-bold tracking-[0.4em] text-xs mb-4 block uppercase opacity-60">Terms of Service</span>
             <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 tracking-tight uppercase leading-tight">SYARAT & KETENTUAN</h1>
             <p className="text-xl text-gray-500 mt-6 leading-relaxed">
               Aturan dan ketentuan penggunaan layanan platform Manasik360.
             </p>
          </div>

          <div className="bg-white p-10 lg:p-20 rounded-[4rem] shadow-[0_48px_80px_-16px_rgba(0,0,0,0.05)] border border-gray-50">
             <div className="prose prose-emerald max-w-none space-y-12">
                <p className="text-gray-600 leading-relaxed text-lg italic">
                  Terakhir diperbarui: 15 Mei 2026
                </p>
                
                {sections.map((section, idx) => (
                  <div key={idx} className="space-y-4">
                     <h2 className="text-2xl font-bold text-gray-900 tracking-tight">{section.title}</h2>
                     <p className="text-gray-500 leading-relaxed text-lg">
                        {section.content}
                     </p>
                  </div>
                ))}

                <div className="pt-12 border-t border-gray-50 mt-12">
                   <p className="text-gray-500 text-sm leading-relaxed text-center">
                      Jika Anda memiliki pertanyaan mengenai Syarat & Ketentuan ini, silakan hubungi kami melalui <a href="/contact" className="text-[var(--color-primary)] font-bold underline">Halaman Kontak</a>.
                   </p>
                </div>
             </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
