"use client";

import Image from "next/image";

export default function DashboardHero() {
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
             <button className="flex items-center gap-4 bg-[var(--color-accent)] text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-[#b45309] transition-all">
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                   <svg className="w-4 h-4 text-[var(--color-accent)] fill-current ml-0.5" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                </div>
                Tonton Sekarang
             </button>
             <div className="flex -space-x-3">
                {[1,2,3].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-gray-200">
                     <Image src="/images/pilgrim-hero.png" alt="User" width={32} height={32} />
                  </div>
                ))}
                <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-400">+30</div>
             </div>
          </div>
       </div>
    </div>
  );
}
