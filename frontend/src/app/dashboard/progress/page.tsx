"use client";

import ProgressHeader from "@/components/dashboard/progress/ProgressHeader";
import ProgressOverview from "@/components/dashboard/progress/ProgressOverview";
import ModuleTable from "@/components/dashboard/progress/ModuleTable";

export default function ProgressPage() {
  const overallProgress = 35;
  
  return (
    <div className="w-full space-y-12">
      <ProgressHeader />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <ProgressOverview overallProgress={overallProgress} />
         <ModuleTable />
      </div>

      {/* Achievement / Suggestion Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-10">
         <div className="bg-[#064e3b] p-8 rounded-[2.5rem] text-white flex items-center gap-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 opacity-10 bg-white rounded-full -mr-16 -mt-16"></div>
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
               <svg className="w-8 h-8 text-[var(--color-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            </div>
            <div>
               <h4 className="font-bold mb-1">Terus Berikan yang Terbaik!</h4>
               <p className="text-xs text-emerald-100">Sedikit lagi Anda akan menyelesaikan Modul Tawaf. Kesiapan mental sangat penting.</p>
            </div>
         </div>
         <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 flex items-center gap-6 shadow-sm group cursor-pointer hover:shadow-lg transition-all">
            <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
               <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5a2 2 0 10-2 2h2z"/></svg>
            </div>
            <div>
               <h4 className="font-bold text-gray-900">Unduh Sertifikat Progress</h4>
               <p className="text-xs text-gray-400">Dapatkan sertifikat sementara untuk setiap modul yang Anda selesaikan.</p>
            </div>
         </div>
      </div>
    </div>
  );
}
