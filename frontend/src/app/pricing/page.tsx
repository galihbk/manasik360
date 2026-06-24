"use client";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useLanguage } from "@/context/LanguageContext";

export default function PricingPage() {
  const { t } = useLanguage();

  const plans = [
    {
      name: t("landing.pkgBasic"),
      price: t("landing.priceFree"),
      desc: t("price.descBasic"),
      features: [t("price.featBasic1"), t("price.featBasic2"), t("price.featBasic3"), t("price.featBasic4")],
      button: t("price.btnFree"),
      highlight: false
    },
    {
      name: t("landing.pkgPremium"),
      price: "Rp 150.000",
      desc: t("price.descPremium"),
      features: [t("price.featPrem1"), t("price.featPrem2"), t("price.featPrem3"), t("price.featPrem4"), t("price.featPrem5")],
      button: t("price.btnPremium"),
      highlight: true
    },
    {
      name: t("landing.pkgTravel"),
      price: t("landing.priceCustom"),
      desc: t("price.descTravel"),
      features: [t("price.featTrav1"), t("price.featTrav2"), t("price.featTrav3"), t("price.featTrav4"), t("price.featTrav5")],
      button: t("price.btnSales"),
      highlight: false
    },
    {
      name: t("landing.pkgLansia"),
      price: "Rp 250.000",
      desc: t("price.descLansia"),
      features: [t("price.featLan1"), t("price.featLan2"), t("price.featLan3"), t("price.featLan4"), t("price.featLan5")],
      button: t("price.btnLansia"),
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
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 tracking-tight">{t("price.heroTitle")}</h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">{t("price.heroSubtitle")}</p>
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
                    {t("price.popular")}
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
             <h3 className="text-2xl font-bold text-gray-900 mb-4">{t("price.helpTitle")}</h3>
             <p className="text-gray-500 mb-8 max-w-2xl mx-auto">{t("price.helpDesc")}</p>
             <Button variant="outline" href="https://wa.me/628129000360" className="px-10 py-4 rounded-2xl font-bold border-gray-200">{t("price.btnWa")}</Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
