"use client";

import Card from "@/components/ui/Card";

interface PrayerCardProps {
  title: string;
  arabic: string;
  latin: string;
  translation: string;
  category: string;
}

export default function PrayerCard({ title, arabic, latin, translation, category }: PrayerCardProps) {
  return (
    <Card className="p-8 bg-white border-none shadow-sm hover:shadow-xl transition-all group space-y-6 rounded-[2.5rem]">
      <div className="flex items-center justify-between">
         <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-tighter">
            {category}
         </span>
         <button className="text-gray-300 hover:text-amber-500 transition-colors">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
         </button>
      </div>
      
      <div className="space-y-4">
         <h3 className="text-xl font-bold text-gray-900 group-hover:text-[var(--color-primary)] transition-colors">{title}</h3>
         <div className="py-6 border-y border-gray-50">
            <p className="text-3xl font-arabic text-right leading-[1.8] text-gray-800" dir="rtl">
               {arabic}
            </p>
         </div>
      </div>

      <div className="space-y-3">
         <p className="text-sm font-medium italic text-gray-500 leading-relaxed">
            "{latin}"
         </p>
         <p className="text-sm text-gray-400 leading-relaxed">
            <span className="font-bold text-gray-600">Artinya:</span> {translation}
         </p>
      </div>

      <div className="pt-4 flex items-center gap-4">
         <button className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-600 py-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            Putar Audio
         </button>
         <button className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center hover:bg-emerald-100 transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
         </button>
      </div>
    </Card>
  );
}
