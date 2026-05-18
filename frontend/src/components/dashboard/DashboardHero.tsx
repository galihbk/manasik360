"use client";

import { useState } from "react";
import Image from "next/image";

export default function DashboardHero() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="relative h-[300px] lg:h-[400px] rounded-[3rem] overflow-hidden group shadow-2xl">
        <Image 
          src="/images/about-mission.png" 
          alt="Apa itu VR Haji 360" 
          fill 
          className="object-cover group-hover:scale-105 transition-transform duration-[5000ms]" 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex flex-col justify-center px-12 lg:px-20 space-y-6">
           <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight max-w-lg">
             Apa itu VR Haji 360°?
           </h1>
           <p className="text-gray-300 max-w-md leading-relaxed">
             VR Haji menghadirkan simulasi interaktif untuk merasakan pengalaman ibadah Haji secara nyata.
           </p>
           <div className="flex items-center gap-6">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-4 bg-[var(--color-accent)] text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-[#b45309] hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                 <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-[var(--color-accent)] fill-current ml-0.5" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                 </div>
                 Tonton Sekarang
              </button>
           </div>
        </div>

        {/* Premium Glassmorphic Video Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[500] flex items-center justify-center p-4 lg:p-12 animate-in fade-in duration-300">
            {/* Modal Container */}
            <div className="relative w-full max-w-5xl aspect-video bg-black rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 animate-in zoom-in-95 duration-300">
              
              {/* Close Button */}
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/15 hover:bg-white/25 border border-white/15 backdrop-blur-md flex items-center justify-center text-white transition-all hover:rotate-90 z-[510] shadow-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>

              {/* Video Element */}
              <video 
                src="https://assets.mixkit.co/videos/preview/mixkit-mecca-kaaba-at-night-41584-large.mp4" 
                controls 
                autoPlay 
                className="w-full h-full object-contain"
              />
            </div>
            
            {/* Click outside to close overlay */}
            <div className="absolute inset-0 -z-10 cursor-pointer" onClick={() => setIsModalOpen(false)}></div>
          </div>
        )}
    </div>
  );
}
