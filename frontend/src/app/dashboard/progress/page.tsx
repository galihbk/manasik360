"use client";

import StepsSection from "@/components/dashboard/StepsSection";
import { useLanguage } from "@/context/LanguageContext";

export default function ProgressPage() {
  const { t } = useLanguage();

  return (
    <div className="w-full space-y-12 pb-10">
      {/* Page Header - Perfectly matched with Doa & Dzikir and other pages */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">{t("progress.title")}</h1>
        <p className="text-gray-500 text-lg">{t("progress.subtitle")}</p>
      </div>

      {/* The 6 Interactive Haji & Umrah Simulation Timeline Modules with hidden local header */}
      <StepsSection hideHeader />

      {/* Achievement / Suggestion Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-10">
         <div className="bg-[#064e3b] p-8 rounded-[2.5rem] text-white flex items-center gap-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 opacity-10 bg-white rounded-full -mr-16 -mt-16"></div>
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
               <svg className="w-8 h-8 text-[var(--color-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            </div>
            <div>
               <h4 className="font-bold mb-1">{t("progress.tipTitle")}</h4>
               <p className="text-xs text-emerald-100 font-medium">{t("progress.tipDesc")}</p>
            </div>
         </div>
         <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 flex items-center gap-6 shadow-sm group cursor-pointer hover:shadow-lg transition-all">
            <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
               <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5a2 2 0 10-2 2h2z"/></svg>
            </div>
            <div>
               <h4 className="font-bold text-gray-900">{t("progress.certTitle")}</h4>
               <p className="text-xs text-gray-400 font-medium font-sans">{t("progress.certDesc")}</p>
            </div>
         </div>
      </div>
    </div>
  );
}

