"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function PrivacyPolicyPage() {
  const sections = [
    {
      title: "1. Informasi yang Kami Kumpulkan",
      content: "Kami mengumpulkan informasi yang Anda berikan secara langsung kepada kami, termasuk saat Anda membuat akun, melakukan pembelian paket, atau menghubungi tim dukungan kami. Informasi ini mencakup nama, alamat email, nomor telepon, dan data profil lainnya."
    },
    {
      title: "2. Penggunaan Informasi",
      content: "Informasi yang kami kumpulkan digunakan untuk menyediakan, memelihara, dan meningkatkan layanan Bahrain, memproses transaksi Anda, serta mengirimkan pemberitahuan penting mengenai akun dan pembaruan fitur."
    },
    {
      title: "3. Keamanan Data",
      content: "Kami menerapkan langkah-langkah keamanan teknis dan organisasi yang dirancang untuk melindungi informasi pribadi Anda dari akses yang tidak sah, pengungkapan, atau modifikasi. Data Anda disimpan dalam server yang terenkripsi dan aman."
    },
    {
      title: "4. Berbagi Informasi dengan Pihak Ketiga",
      content: "Kami tidak menjual informasi pribadi Anda kepada pihak ketiga. Kami hanya membagikan data Anda dengan penyedia layanan yang bekerja atas nama kami (seperti penyedia gateway pembayaran) sesuai dengan kebijakan kerahasiaan yang ketat."
    },
    {
      title: "5. Hak-Hak Anda",
      content: "Anda memiliki hak untuk mengakses, memperbarui, atau menghapus informasi pribadi Anda kapan saja melalui pengaturan profil di dashboard Anda. Jika Anda memiliki pertanyaan mengenai data Anda, silakan hubungi tim dukungan kami."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#fdfdfb]">
      <Navbar />

      <main className="flex-grow pt-32 pb-20 lg:pt-48 lg:pb-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
             <span className="text-[var(--color-primary)] font-bold tracking-[0.4em] text-xs mb-4 block uppercase opacity-60">Legal Information</span>
             <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 tracking-tight uppercase leading-tight">KEBIJAKAN PRIVASI</h1>
             <p className="text-xl text-gray-500 mt-6 leading-relaxed">
               Bagaimana kami menjaga dan melindungi data pribadi Anda di Bahrain.
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
                   <p className="text-gray-500 text-sm leading-relaxed">
                      Dengan menggunakan layanan Bahrain, Anda menyetujui pengumpulan dan penggunaan informasi sesuai dengan kebijakan ini. Kami dapat memperbarui kebijakan ini dari waktu ke waktu, dan kami akan memberi tahu Anda jika ada perubahan signifikan.
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
