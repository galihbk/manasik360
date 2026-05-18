"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import { getUnifiedProgressStore, UnifiedModuleProgress } from "@/utils/progressStore";

export default function ModuleTable() {
  const [modules, setModules] = useState<UnifiedModuleProgress[]>([]);

  useEffect(() => {
    // Initial fetch
    setModules(getUnifiedProgressStore());

    // Listen to changes in progress
    const handleProgressUpdate = () => {
      setModules(getUnifiedProgressStore());
    };

    window.addEventListener("progressStoreUpdated", handleProgressUpdate);
    return () => {
      window.removeEventListener("progressStoreUpdated", handleProgressUpdate);
    };
  }, []);

  return (
    <Card className="p-8 bg-white border-none shadow-sm lg:col-span-2 overflow-hidden">
      <div className="flex items-center justify-between mb-8">
         <h3 className="text-lg font-bold text-gray-900">Rekap Pembelajaran</h3>
         <button className="text-sm font-bold text-[var(--color-primary)] hover:underline">Download Report</button>
      </div>
      <div className="overflow-x-auto">
         <table className="w-full text-left border-collapse">
            <thead>
               <tr className="border-b border-gray-50">
                  <th className="pb-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Modul</th>
                  <th className="pb-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="pb-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Progres</th>
                  <th className="pb-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Waktu</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
               {modules.map((m, i) => {
                  return (
                     <tr key={m.id} className="group hover:bg-gray-50 transition-colors">
                        <td className="py-4">
                           <span className="text-sm font-bold text-gray-900">{m.title}</span>
                           <p className="text-[10px] text-gray-400 mt-1">Terakhir akses: {m.date}</p>
                        </td>
                        <td className="py-4">
                           <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter ${
                              m.status === 'Selesai' ? 'bg-green-50 text-green-600' : 
                              m.status === 'Berlangsung' ? 'bg-blue-50 text-blue-600' : 
                              'bg-gray-50 text-gray-300'
                           }`}>
                              {m.status}
                           </span>
                        </td>
                        <td className="py-4">
                           <div className="flex items-center gap-3 w-32">
                              <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                                 <div className="h-full bg-[var(--color-primary)] transition-all duration-1000" style={{ width: `${m.progress}%` }}></div>
                              </div>
                              <span className="text-[10px] font-bold text-gray-400">{m.progress}%</span>
                           </div>
                        </td>
                        <td className="py-4 text-right">
                           <span className="text-sm font-bold text-gray-900">{m.time}</span>
                           <p className="text-[10px] text-gray-400">
                             {m.videoCompleted ? 'Video ✓' : 'Video -'} | {m.doaCompleted ? 'Doa ✓' : 'Doa -'} | {m.completedTasks}/{m.totalTasks} VR
                           </p>
                        </td>
                     </tr>
                  );
               })}
            </tbody>
         </table>
      </div>
    </Card>
  );
}
