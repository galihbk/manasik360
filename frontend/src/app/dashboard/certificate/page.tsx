"use client";

import CertificatePreview from "@/components/dashboard/certificate/CertificatePreview";
import Card from "@/components/ui/Card";

const achievements = [
  { name: "Pioneer Ihram", date: "12 Mei 2024", icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>, color: "bg-blue-50 text-blue-600" },
  { name: "Thawaf Master", date: "14 Mei 2024", icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5"/></svg>, color: "bg-emerald-50 text-emerald-600" },
  { name: "Patient Pilgrim", date: "In Progress", icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>, color: "bg-amber-50 text-amber-600" },
];

export default function CertificatePage() {
  return (
    <div className="w-full space-y-12 pb-10">
      {/* Header */}
      <div className="space-y-2 text-center lg:text-left">
        <h1 className="text-3xl font-bold text-gray-900">Sertifikat & Pencapaian</h1>
        <p className="text-gray-500">Bukti nyata kesungguhan Anda dalam mempersiapkan perjalanan suci.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
         {/* Main Certificate Display */}
         <div className="lg:col-span-2 space-y-8">
            <CertificatePreview 
              title="Official Hajj Simulation Certificate"
              issueDate="Pending Completion"
              certificateId="M360-FAU-2024-XXXX"
              isUnlocked={false}
            />
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
               <button className="px-10 py-4 bg-[var(--color-primary)] text-white rounded-2xl font-bold text-sm shadow-xl shadow-emerald-900/20 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                  Download PDF
               </button>
               <button className="px-10 py-4 border-2 border-gray-100 text-gray-400 rounded-2xl font-bold text-sm hover:bg-gray-50 transition-all">
                  Bagikan ke Media Sosial
               </button>
            </div>
         </div>

         {/* Achievements Sidebar */}
         <div className="space-y-8">
            <h3 className="text-xl font-bold text-gray-900">Badge Pencapaian</h3>
            <div className="space-y-4">
               {achievements.map((ach, i) => (
                 <Card key={i} className="p-6 bg-white border-none shadow-sm flex items-center gap-4 group hover:shadow-md transition-all rounded-[2rem]">
                    <div className={`w-14 h-14 ${ach.color} rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                       {ach.icon}
                    </div>
                    <div>
                       <h4 className="font-bold text-gray-900">{ach.name}</h4>
                       <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{ach.date}</p>
                    </div>
                 </Card>
               ))}
            </div>

            <div className="bg-emerald-50 p-8 rounded-[2.5rem] border border-emerald-100">
               <h4 className="font-bold text-emerald-900 mb-2">Mengapa Sertifikat Ini Penting?</h4>
               <p className="text-xs text-emerald-700 leading-relaxed">
                  Sertifikat ini menunjukkan bahwa Anda telah menguasai rukun, wajib, dan tata cara manasik secara visual dan teoritis, meningkatkan kepercayaan diri Anda di lapangan nanti.
               </p>
            </div>
         </div>
      </div>
    </div>
  );
}
