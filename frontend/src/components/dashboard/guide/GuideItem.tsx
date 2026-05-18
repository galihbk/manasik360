"use client";

import Image from "next/image";

interface GuideItemProps {
  title: string;
  duration: string;
  type: string;
  image: string;
  status: string;
  onClick?: () => void;
}

export default function GuideItem({ title, duration, type, image, status, onClick }: GuideItemProps) {
  return (
    <div 
      onClick={onClick}
      className="flex items-center gap-6 p-4 rounded-3xl hover:bg-white transition-all group cursor-pointer border border-transparent hover:border-gray-100 hover:shadow-xl"
    >
       <div className="relative w-24 h-24 rounded-2xl overflow-hidden shrink-0 shadow-sm">
          <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
       </div>
       <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
             <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{type}</span>
             <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
             <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">{duration}</span>
          </div>
          <h4 className="font-bold text-gray-900 group-hover:text-emerald-600 transition-colors leading-tight">{title}</h4>
          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter ${
             status === 'Selesai' ? 'bg-green-50 text-green-600 border border-green-100/50' : 'bg-gray-50 text-gray-400'
          }`}>
             {status}
          </span>
       </div>
       <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-emerald-600 group-hover:text-white transition-all">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
       </div>
    </div>
  );
}

