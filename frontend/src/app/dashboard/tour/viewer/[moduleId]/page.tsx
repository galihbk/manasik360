"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Script from "next/script";

declare global {
  interface Window {
    pannellum: any;
  }
}

export default function VRViewerPage() {
  const { moduleId } = useParams();
  const router = useRouter();
  const viewerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const initViewer = async () => {
    try {
      const res = await fetch(`http://localhost:5001/api/vrtour/config/${moduleId}`);
      const json = await res.json();

      if (json.status !== "success") {
        throw new Error(json.message || "Gagal memuat konfigurasi VR");
      }

      if (window.pannellum) {
        if (viewerRef.current) {
          viewerRef.current.destroy();
        }
        viewerRef.current = window.pannellum.viewer("panorama", json.data);
        setLoading(false);
      }
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    // Re-init if script is already loaded
    if (window.pannellum) {
      initViewer();
    }
    
    return () => {
      if (viewerRef.current) {
        viewerRef.current.destroy();
      }
    };
  }, [moduleId]);

  return (
    <div className="fixed inset-0 z-[200] bg-black">
      <Script 
        src="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js"
        onLoad={initViewer}
      />
      <link 
        rel="stylesheet" 
        href="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css" 
      />

      {/* Top Header */}
      <div className="absolute top-0 left-0 right-0 z-[210] p-6 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
         <div className="flex items-center gap-4 pointer-events-auto">
            <button 
              onClick={() => router.back()}
              className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all border border-white/20"
            >
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
            </button>
            <div className="flex flex-col">
               <span className="text-white font-bold text-lg leading-none">Simulasi Manasik VR</span>
               <span className="text-white/60 text-xs mt-1">Gunakan mouse atau geser untuk melihat sekeliling</span>
            </div>
         </div>
         <div className="pointer-events-auto">
            <button 
               onClick={() => {
                  if (containerRef.current?.requestFullscreen) containerRef.current.requestFullscreen();
               }}
               className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm shadow-xl shadow-emerald-900/40 flex items-center gap-3 hover:bg-emerald-500 transition-all"
            >
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/></svg>
               Fullscreen
            </button>
         </div>
      </div>

      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0a0a] z-[205]">
          <div className="w-20 h-20 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-6"></div>
          <p className="text-white font-medium animate-pulse tracking-widest text-sm uppercase">Menyiapkan Pengalaman 360°...</p>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0a0a] z-[205] p-10 text-center">
          <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-6">
             <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">Gagal Memuat Simulasi</h3>
          <p className="text-gray-400 max-w-md mb-8">{error}</p>
          <button 
            onClick={() => router.back()}
            className="px-10 py-4 bg-white text-black font-bold rounded-2xl hover:bg-gray-200 transition-all"
          >
            Kembali ke Daftar Modul
          </button>
        </div>
      )}

      <div 
        id="panorama" 
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      ></div>

      <style jsx global>{`
        .pnlm-load-box { display: none !important; }
        .pnlm-about-msg { display: none !important; }
        .pnlm-control-bar { background: rgba(0,0,0,0.5) !important; border-radius: 12px !important; margin: 20px !important; border: 1px solid rgba(255,255,255,0.1) !important; }
        .pnlm-hotspot-base { border-radius: 50% !important; background: rgba(16, 185, 129, 0.8) !important; border: 4px solid white !important; box-shadow: 0 0 20px rgba(16, 185, 129, 0.5) !important; cursor: pointer !important; transition: all 0.3s !important; }
        .pnlm-hotspot-base:hover { transform: scale(1.3) !important; background: rgba(16, 185, 129, 1) !important; }
      `}</style>
    </div>
  );
}
