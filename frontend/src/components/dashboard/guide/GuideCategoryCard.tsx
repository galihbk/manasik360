"use client";

interface GuideCategoryCardProps {
  title: string;
  count: string;
  icon: React.ReactNode;
  color: string;
}

export default function GuideCategoryCard({ title, count, icon, color }: GuideCategoryCardProps) {
  return (
    <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group cursor-pointer">
       <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
          {icon}
       </div>
       <h4 className="text-lg font-bold text-gray-900 mb-1">{title}</h4>
       <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{count} Materi</p>
    </div>
  );
}
