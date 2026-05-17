"use client";

import { useEffect, useRef, useState } from "react";
import { MANASIK_TUTORIAL, TourStep } from "@/data/tourData";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { useRouter } from "next/navigation";

export default function LinearTourViewer() {
  const router = useRouter();
  const viewerRef = useRef<any>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const currentStep = MANASIK_TUTORIAL[currentStepIndex];

  useEffect(() => {
    // Load Pannellum Script
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css";
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js";
    script.async = true;
    script.onload = () => initViewer(currentStep.panoramaPath);
    document.body.appendChild(script);

    return () => {
      if (viewerRef.current) viewerRef.current.destroy();
    };
  }, []);

  const initViewer = (imagePath: string) => {
    if ((window as any).pannellum) {
      if (viewerRef.current) viewerRef.current.destroy();
      
      viewerRef.current = (window as any).pannellum.viewer("panorama", {
        type: "equirectangular",
        panorama: imagePath,
        autoLoad: true,
        showControls: false,
      });
      setIsLoaded(true);
    }
  };

  const nextStep = () => {
    if (currentStepIndex < MANASIK_TUTORIAL.length - 1) {
      const nextIdx = currentStepIndex + 1;
      setCurrentStepIndex(nextIdx);
      initViewer(MANASIK_TUTORIAL[nextIdx].panoramaPath);
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      const prevIdx = currentStepIndex - 1;
      setCurrentStepIndex(prevIdx);
      initViewer(MANASIK_TUTORIAL[prevIdx].panoramaPath);
    }
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden font-sans">
      {/* VR CANVAS */}
      <div id="panorama" className="w-full h-full" />

      {/* OVERLAY UI */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 lg:p-10">
        
        {/* HEADER: PROGRESS */}
        <div className="flex justify-between items-start pointer-events-auto">
          <div className="bg-white/90 backdrop-blur-md px-6 py-4 rounded-[2rem] shadow-2xl border border-white/50 flex items-center gap-4">
             <button 
               onClick={() => router.back()}
               className="w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center hover:bg-emerald-700 transition-all shadow-lg"
             >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
             </button>
             <div>
                <h1 className="text-sm font-black text-emerald-900 uppercase tracking-tighter">Tutorial Manasik</h1>
                <div className="flex items-center gap-2 mt-0.5">
                   <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500 transition-all duration-500" 
                        style={{ width: `${((currentStepIndex + 1) / MANASIK_TUTORIAL.length) * 100}%` }}
                      />
                   </div>
                   <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                     {currentStepIndex + 1} / {MANASIK_TUTORIAL.length}
                   </span>
                </div>
             </div>
          </div>
        </div>

        {/* BOTTOM SECTION: INFO CARD & NAVIGATION */}
        <div className="flex flex-col lg:flex-row items-end justify-between gap-6">
          
          {/* INFO CARD */}
          <div className="pointer-events-auto w-full lg:w-[400px] animate-in fade-in slide-in-from-bottom-10 duration-700">
            <Card className="p-8 bg-white/95 backdrop-blur-xl border-none shadow-[0_20px_50px_rgba(0,0,0,0.2)] rounded-[2.5rem]">
               <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-[9px] font-black uppercase tracking-widest mb-4 inline-block">
                 Informasi Lokasi
               </span>
               <h2 className="text-2xl font-bold text-gray-900 leading-tight mb-3">{currentStep.title}</h2>
               <p className="text-gray-500 text-sm leading-relaxed mb-6">
                 {currentStep.description}
               </p>
               
               <div className="flex gap-3">
                  <button 
                    onClick={prevStep}
                    disabled={currentStepIndex === 0}
                    className="flex-1 py-4 px-6 bg-gray-100 disabled:opacity-30 text-gray-900 rounded-2xl text-xs font-bold hover:bg-gray-200 transition-all active:scale-95"
                  >
                    Sebelumnya
                  </button>
                  <button 
                    onClick={nextStep}
                    disabled={currentStepIndex === MANASIK_TUTORIAL.length - 1}
                    className="flex-[2] py-4 px-6 bg-emerald-600 disabled:opacity-30 text-white rounded-2xl text-xs font-bold shadow-lg shadow-emerald-900/20 hover:bg-emerald-700 transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    {currentStepIndex === MANASIK_TUTORIAL.length - 1 ? "Selesai Tutorial" : "Langkah Berikutnya"}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5-5 5M6 7l5 5-5 5"/></svg>
                  </button>
               </div>
            </Card>
          </div>

          {/* HINT */}
          <div className="hidden lg:block bg-black/40 backdrop-blur-md px-6 py-3 rounded-full text-white/70 text-[10px] font-medium tracking-wide">
             Gunakan Mouse untuk memutar pandangan 360°
          </div>
        </div>

      </div>

      {/* LOADING STATE */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-emerald-900 flex flex-col items-center justify-center z-50">
           <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mb-4" />
           <p className="text-white font-bold tracking-widest text-xs uppercase animate-pulse">Menyiapkan Pengalaman VR...</p>
        </div>
      )}
    </div>
  );
}
