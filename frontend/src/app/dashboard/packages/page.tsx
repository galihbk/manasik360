"use client";

import Image from "next/image";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useLanguage } from "@/context/LanguageContext";

export default function PackagesPage() {
  const { t } = useLanguage();

  const packages = [
    {
      id: "basic",
      name: t("dashpkg.basicName"),
      price: "Rp 150.000",
      period: t("dashpkg.basicPeriod"),
      features: [
        t("dashpkg.basicFeat1"),
        t("dashpkg.basicFeat2"),
        t("dashpkg.basicFeat3"),
        t("dashpkg.basicFeat4")
      ],
      current: false,
      popular: false,
    },
    {
      id: "premium",
      name: t("dashpkg.premName"),
      price: "Rp 450.000",
      period: t("dashpkg.premPeriod"),
      features: [
        t("dashpkg.premFeat1"),
        t("dashpkg.premFeat2"),
        t("dashpkg.premFeat3"),
        t("dashpkg.premFeat4"),
        t("dashpkg.premFeat5")
      ],
      current: true,
      popular: true,
    },
    {
      id: "travel",
      name: t("dashpkg.travName"),
      price: "Rp 1.250.000",
      period: t("dashpkg.travPeriod"),
      features: [
        t("dashpkg.travFeat1"),
        t("dashpkg.travFeat2"),
        t("dashpkg.travFeat3"),
        t("dashpkg.travFeat4"),
        t("dashpkg.travFeat5")
      ],
      current: false,
      popular: false,
    }
  ];

  return (
    <div className="w-full space-y-12">
      {/* Header Section */}
      <div className="space-y-2 text-left">
        <h1 className="text-3xl font-bold text-gray-900">{t("dashpkg.title")}</h1>
        <p className="text-gray-500">{t("dashpkg.subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
        {packages.map((pkg, i) => (
          <div 
            key={i} 
            className={`relative p-8 rounded-[2.5rem] bg-white border shadow-sm transition-all hover:shadow-xl flex flex-col justify-between h-full ${
              pkg.current ? 'border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/10' : 'border-gray-100'
            }`}
          >
            {pkg.popular && (
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[var(--color-accent)] text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                {t("dashpkg.popular")}
              </span>
            )}
            
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-gray-900">{pkg.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-[var(--color-primary)]">{pkg.price}</span>
                    <span className="text-xs text-gray-400">{pkg.period}</span>
                  </div>
                </div>
                {pkg.current && (
                  <span className="bg-green-100 text-green-700 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter">{t("dashpkg.active")}</span>
                )}
              </div>

              <div className="space-y-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t("dashpkg.featuredFeatures")}</p>
                <ul className="space-y-3">
                  {pkg.features.map((feature, f) => (
                    <li key={f} className="flex items-center gap-3 text-sm text-gray-600">
                      <div className="w-5 h-5 bg-green-50 rounded-full flex items-center justify-center shrink-0">
                        <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-10">
              {pkg.current ? (
                <button className="w-full py-4 bg-gray-100 text-gray-400 rounded-2xl font-bold text-sm cursor-default">
                  {t("dashpkg.currentPkg")}
                </button>
              ) : (
                <Button className="w-full py-4 shadow-xl shadow-emerald-900/10">{t("dashpkg.btnBuy")}</Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Activation Section */}
      <div className="bg-[#064e3b] rounded-[3rem] p-10 lg:p-16 relative overflow-hidden shadow-2xl">
         <div className="absolute top-0 right-0 w-1/2 h-full opacity-5 islamic-pattern pointer-events-none"></div>
         <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10 text-center lg:text-left">
            <div className="space-y-4 flex-1">
               <h2 className="text-3xl font-bold text-white">{t("dashpkg.voucherTitle")}</h2>
               <p className="text-emerald-100 leading-relaxed max-w-md">
                  {t("dashpkg.voucherDesc")}
               </p>
            </div>
            <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-4 bg-white/10 p-2 rounded-3xl backdrop-blur-md border border-white/10">
               <input 
                 type="text" 
                 placeholder={t("dashpkg.voucherPlaceholder")} 
                 className="bg-transparent border-none text-white placeholder-white/50 focus:ring-0 px-6 py-4 flex-1 min-w-[280px]"
               />
               <button className="bg-[var(--color-accent)] text-white px-10 py-4 rounded-2xl font-bold shadow-lg hover:bg-[#b45309] transition-all">
                  {t("dashpkg.voucherBtn")}
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}
