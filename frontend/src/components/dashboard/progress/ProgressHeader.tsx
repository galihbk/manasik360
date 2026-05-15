"use client";

export default function ProgressHeader() {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Progress Modul</h1>
        <p className="text-gray-500">Pantau perkembangan kesiapan ibadah Anda secara detail.</p>
      </div>
      <div className="flex items-center gap-4 bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
         <div className="text-right">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Target Selesai</p>
            <p className="font-bold text-gray-900">20 Juni 2024</p>
         </div>
         <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
         </div>
      </div>
    </div>
  );
}
