"use client";

import { useEffect, useState } from "react";
import { getOverallProgress, getProgressStore } from "@/utils/progressStore";
import { useRouter } from "next/navigation";

export default function OverallProgressWidget() {
  const router = useRouter();
  const [overallProgress, setOverallProgress] = useState(0);
  const [completedModulesCount, setCompletedModulesCount] = useState(0);
  const [activeModuleName, setActiveModuleName] = useState("Ihram & Miqat");

  // Load progress states dynamically
  const loadStats = () => {
    if (typeof window === "undefined") return;

    // 1. Get Overall Progress %
    const progress = getOverallProgress();
    setOverallProgress(progress);

    // 2. Get local steps progress to calculate total progress per module
    const storedSteps = localStorage.getItem("bahrain_module_steps");
    const moduleSteps = storedSteps ? JSON.parse(storedSteps) : {};
    const store = getProgressStore();

    let completedCount = 0;
    let foundActive = false;
    let activeName = "Ihram & Miqat";

    const OFFICIAL_KEYS = ["ihram", "tawaf", "sai", "wukuf", "muzdalifah", "jumrah"];
    const NAME_MAP: Record<string, string> = {
      ihram: "Ihram & Miqat",
      tawaf: "Tawaf di Ka'bah",
      sai: "Sa'i Safa-Marwah",
      wukuf: "Wukuf di Arafah",
      muzdalifah: "Mabit di Muzdalifah",
      jumrah: "Melontar Jumrah"
    };

    OFFICIAL_KEYS.forEach((key) => {
      // Calculate total progress for this specific module
      const steps = moduleSteps[key] || { videoCompleted: false, doaCompleted: false };
      const vr = store.find((m) => m.id === key) || { progress: 0 };
      
      const videoWeight = steps.videoCompleted ? 20 : 0;
      const doaWeight = steps.doaCompleted ? 20 : 0;
      const vrWeight = Math.round((vr.progress / 100) * 60);
      const totalProg = videoWeight + doaWeight + vrWeight;

      if (totalProg === 100) {
        completedCount++;
      } else if (!foundActive) {
        activeName = NAME_MAP[key];
        foundActive = true;
      }
    });

    setCompletedModulesCount(completedCount);
    
    if (completedCount === 6) {
      setActiveModuleName("Semua Modul Tuntas! 🎉");
    } else {
      setActiveModuleName(activeName);
    }
  };

  useEffect(() => {
    loadStats();
    window.addEventListener("progressStoreUpdated", loadStats);
    return () => {
      window.removeEventListener("progressStoreUpdated", loadStats);
    };
  }, []);

  // Circular gauge calculations
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallProgress / 100) * circumference;

  return (
    <div className="bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-500/15 backdrop-blur-md rounded-[3rem] p-8 shadow-xl grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
      
      {/* 1. Circular Progress Gauge (Col 1-3) */}
      <div className="md:col-span-3 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-emerald-500/10 pb-6 md:pb-0 md:pr-8">
        <div className="relative w-28 h-28 flex items-center justify-center">
          {/* Background Ring */}
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="56"
              cy="56"
              r={radius}
              className="stroke-gray-100"
              strokeWidth="8"
              fill="transparent"
            />
            {/* Glowing Active Ring */}
            <circle
              cx="56"
              cy="56"
              r={radius}
              className="stroke-emerald-600 transition-all duration-[1500ms] ease-out"
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>
          {/* Centered Percentage Text */}
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-2xl font-black text-gray-900 leading-none">{overallProgress}%</span>
            <span className="text-[8px] font-black uppercase text-gray-400 mt-1 tracking-wider">Total</span>
          </div>
        </div>
        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-800 mt-3">
          Progres Kelulusan
        </p>
      </div>

      {/* 2. Real-Time Stats Hub (Col 4-7) */}
      <div className="md:col-span-4 flex flex-col justify-center space-y-4">
        <div>
          <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Modul Aktif</span>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-ping shrink-0"></span>
            <h4 className="font-extrabold text-gray-900 text-sm md:text-base leading-snug">
              {activeModuleName}
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div>
            <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Rasio Selesai</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2.5 py-1 bg-green-50 text-green-700 text-[10px] font-black rounded-lg border border-green-100">
                {completedModulesCount} / 6 Modul
              </span>
            </div>
          </div>
          <div>
            <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Status</span>
            <p className="text-xs font-bold text-gray-700 mt-1.5">
              {completedModulesCount === 6 ? "✓ Bersertifikat" : "Dalam Pelatihan"}
            </p>
          </div>
        </div>
      </div>

      {/* 3. Certificate Milestone & Reward Banner (Col 8-12) */}
      <div className="md:col-span-5 bg-white/60 backdrop-blur-sm border border-emerald-500/5 rounded-3xl p-6 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow">
        <div className="w-12 h-12 bg-amber-500/10 text-amber-600 rounded-2xl flex items-center justify-center shrink-0 border border-amber-200/30">
          <svg className="w-6 h-6 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <div className="space-y-1.5">
          <h5 className="font-extrabold text-gray-900 text-xs uppercase tracking-wider">
            🏆 Target Kelulusan Bahrain
          </h5>
          <p className="text-[10px] text-gray-500 leading-relaxed">
            {completedModulesCount === 6 
              ? "Luar biasa! Seluruh rukun haji telah Anda selesaikan. Silakan klaim sertifikat kelulusan digital resmi Anda sekarang!"
              : "Tuntaskan seluruh 6 modul perjalanan haji di bawah ini untuk berhak mengunduh Sertifikat Kelulusan Manasik Resmi atas nama Anda!"
            }
          </p>
          <button
            onClick={() => router.push(completedModulesCount === 6 ? "/dashboard/certificate" : "#")}
            className={`mt-2 text-[10px] font-black uppercase tracking-widest flex items-center gap-1 hover:underline cursor-pointer ${
              completedModulesCount === 6 ? 'text-amber-600' : 'text-gray-400 cursor-not-allowed'
            }`}
            disabled={completedModulesCount !== 6}
          >
            {completedModulesCount === 6 ? "Klaim Sertifikat Sekarang →" : "Sertifikat Terkunci 🔒"}
          </button>
        </div>
      </div>

    </div>
  );
}
