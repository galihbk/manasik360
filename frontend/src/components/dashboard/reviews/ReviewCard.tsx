"use client";

import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

interface ReviewCardProps {
  name: string;
  role: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
}

export default function ReviewCard({ name, role, avatar, rating, comment, date }: ReviewCardProps) {
  const { t } = useLanguage();
  
  const displayRole = role === "Administrator" || role === "ADMIN" 
    ? t("header.admin") 
    : t("header.premium");

  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-50 shadow-sm hover:shadow-xl transition-all group">
       <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
             <div className="relative w-12 h-12 rounded-2xl overflow-hidden shadow-sm">
                <Image src={avatar} alt={name} fill className="object-cover" />
             </div>
             <div>
                <h4 className="font-bold text-gray-900 leading-none mb-1">{name}</h4>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{displayRole}</p>
             </div>
          </div>
          <div className="flex items-center gap-1">
             {[...Array(5)].map((_, i) => (
                <svg 
                  key={i} 
                  className={`w-4 h-4 ${i < rating ? 'text-amber-400' : 'text-gray-200'}`} 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                   <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
             ))}
          </div>
       </div>
       <p className="text-sm text-gray-500 leading-relaxed italic mb-6">
          "{comment}"
       </p>
       <div className="flex items-center justify-start pt-6 border-t border-gray-50">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{date}</span>
       </div>
    </div>
  );
}
