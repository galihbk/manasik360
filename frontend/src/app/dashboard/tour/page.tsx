"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";

interface Module {
  id: string;
  name: string;
  description: string;
  thumbnail?: string;
  _count?: { scenes: number };
}

export default function VRModuleListPage() {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/vrtour/modules");
        const json = await res.json();
        if (json.status === "success") setModules(json.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchModules();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="max-w-2xl">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Simulasi VR Manasik</h1>
        <p className="text-gray-500 mt-4 text-lg">Pilih modul simulasi di bawah ini untuk memulai pengalaman manasik haji dan umrah secara imersif 360 derajat.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {modules.length === 0 ? (
          <Card className="col-span-full p-20 text-center border-dashed border-2 border-gray-200 bg-gray-50/50">
             <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
             </div>
             <h3 className="text-xl font-bold text-gray-900 mb-2">Belum Ada Modul</h3>
             <p className="text-gray-500">Admin belum menambahkan modul simulasi VR saat ini.</p>
          </Card>
        ) : (
          modules.map((mod) => (
            <Link key={mod.id} href={`/dashboard/tour/viewer/${mod.id}`}>
              <Card className="group overflow-hidden rounded-[2.5rem] border-none shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer bg-white h-full flex flex-col">
                <div className="relative h-56 bg-gray-100 overflow-hidden">
                  {mod.thumbnail ? (
                    <img src={mod.thumbnail} alt={mod.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center">
                       <svg className="w-16 h-16 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                    </div>
                  )}
                  <div className="absolute top-6 right-6">
                    <span className="px-4 py-2 bg-black/30 backdrop-blur-md text-white rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20">
                      {mod._count?.scenes || 0} Titik 360°
                    </span>
                  </div>
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors">{mod.name}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-1 line-clamp-3">{mod.description || "Simulasi VR imersif untuk panduan manasik haji dan umrah."}</p>
                  <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-50">
                    <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Mulai Simulasi</span>
                    <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7-7 7M5 5l7 7-7 7"/></svg>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
