"use client";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function PricingPage() {
  const plans = [
    {
      name: "Paket Basic",
      price: "Gratis",
      desc: "Cocok untuk pengenalan awal manasik.",
      features: ["1 Modul VR Utama (Ihram)", "Panduan Audio Dasar", "Teks Doa Lengkap", "Akses 7 Hari"],
      button: "Mulai Gratis",
      highlight: false
    },
    {
      name: "Paket Premium VR",
      price: "Rp 150.000",
      desc: "Pengalaman penuh untuk jamaah individu.",
      features: ["Semua Modul 360°", "AI Ustadz Virtual 24/7", "Sertifikat Digital", "Akses Selamanya", "Update Konten Berkala"],
      button: "Beli Paket Premium",
      highlight: true
    },
    {
      name: "Paket Travel Haji",
      price: "Custom",
      desc: "Solusi efisien untuk biro perjalanan.",
      features: ["Dashboard Monitoring Jamaah", "Branding Nama Travel", "Akses untuk 50+ Jamaah", "API Integration", "Support Prioritas"],
      button: "Hubungi Penjualan",
      highlight: false
    },
    {
      name: "Paket Lansia",
      price: "Rp 250.000",
      desc: "Bimbingan ekstra untuk orang tua tercinta.",
      features: ["Navigasi Voice-Command", "Interface Sangat Sederhana", "Bimbingan Video Call (1x)", "Semua Fitur Premium", "Pendampingan Login"],
      button: "Beli Paket Khusus",
      highlight: false
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#fdfdfb]">
      <Navbar />
      
      <main className="flex-grow pb-24">
        {/* Header Section */}
        <div className="bg-[#064e3b] pt-32 pb-24 lg:pt-48 mb-20 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-1/2 h-full opacity-5 islamic-pattern pointer-events-none"></div>
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 text-white">
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 tracking-tight">Investasikan Persiapan <br className="hidden lg:block"/> Ibadah Anda</h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">Pilih paket yang paling sesuai dengan kebutuhan Anda untuk pengalaman manasik yang lebih matang.</p>
           </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {plans.map((plan, i) => (
              <div 
                key={i} 
                className={`flex flex-col p-10 rounded-[3rem] border transition-all duration-500 relative ${
                  plan.highlight 
                  ? 'bg-white border-[var(--color-accent)] shadow-2xl scale-105 z-10' 
                  : 'bg-white border-gray-100 shadow-sm hover:shadow-xl'
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[var(--color-accent)] text-white px-6 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                    Paling Populer
                  </div>
                )}
                
                <div className="mb-10 text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="text-3xl font-extrabold text-[var(--color-primary)] mb-4">{plan.price}</div>
                  <p className="text-sm text-gray-500 leading-relaxed">{plan.desc}</p>
                </div>

                <div className="space-y-5 mb-12 flex-grow">
                  {plan.features.map((feature, j) => (
                    <div key={j} className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${plan.highlight ? 'bg-[var(--color-accent)] text-white' : 'bg-green-50 text-green-600'}`}>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                      </div>
                      <span className="text-sm text-gray-600 leading-tight">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button 
                  href="/register" 
                  className={`w-full py-4 rounded-2xl font-bold text-sm shadow-lg transition-transform hover:scale-105 ${plan.highlight ? 'bg-[var(--color-accent)] hover:bg-[#b45309] border-none text-white' : 'bg-white text-gray-900 border border-gray-200 hover:bg-gray-50'}`}
                >
                  {plan.button}
                </Button>
              </div>
            ))}
          </div>

          <div className="mt-24 p-12 bg-white rounded-[3rem] border border-gray-100 shadow-sm text-center">
             <h3 className="text-2xl font-bold text-gray-900 mb-4">Butuh Bantuan Memilih?</h3>
             <p className="text-gray-500 mb-8 max-w-2xl mx-auto">Tim kami siap membantu Anda memilih paket terbaik atau memberikan demo khusus untuk biro perjalanan Haji & Umrah Anda.</p>
             <Button variant="outline" className="px-10 py-4 rounded-2xl font-bold border-gray-200">Hubungi Kami via WhatsApp</Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
