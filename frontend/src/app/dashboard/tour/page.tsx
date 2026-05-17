"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);

  // Default premium 3DVista dummy module that is always available
  const dummyModules: Module[] = [
    {
      id: "default",
      name: "Simulasi Manasik Haji 360° (Premium)",
      description: "Rasakan simulasi manasik haji dan umrah interaktif secara nyata menggunakan visualisasi 360 derajat sinematik super mulus berbasis 3DVista WebGL.",
      thumbnail: "/images/vr-preview.png",
      _count: { scenes: 14 }
    }
  ];

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/vrtour/modules");
        const json = await res.json();
        if (json.status === "success") {
          setModules(json.data);
        }
      } catch (err) {
        console.error("Error fetching modules in list page:", err);
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

  // Always show the premium 3DVista default simulation, followed by any dynamic database modules
  const displayModules = [...dummyModules, ...modules];

  return (
    <div className="space-y-10">
      <div className="max-w-2xl">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Simulasi VR Manasik</h1>
        <p className="text-gray-500 mt-4 text-lg">Pilih modul simulasi di bawah ini untuk memulai pengalaman manasik haji dan umrah secara imersif 360 derajat.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayModules.map((mod) => (
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
                <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between">
                  <div className="flex flex-col">
                     <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Tutorial Terpandu</span>
                     <span className="text-[9px] font-medium text-gray-400 mt-1">Satu arah & Interaktif</span>
                  </div>
                  <button 
                    onClick={(e) => { 
                      e.preventDefault(); 
                      router.push(`/dashboard/tour/viewer/${mod.id}`); 
                    }}
                    className="px-6 py-3 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-900/10 active:scale-95 cursor-pointer"
                  >
                     Mulai Belajar
                  </button>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
