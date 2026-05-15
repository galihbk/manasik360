"use client";

import Card from "@/components/ui/Card";

interface ProgressOverviewProps {
  overallProgress: number;
}

export default function ProgressOverview({ overallProgress }: ProgressOverviewProps) {
  return (
    <Card className="p-8 bg-white border-none shadow-sm lg:col-span-1 flex flex-col items-center justify-center text-center space-y-6">
      <div className="relative w-40 h-40">
         <svg className="w-full h-full" viewBox="0 0 36 36">
            <path className="text-gray-100" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            <path className="text-[var(--color-primary)]" strokeWidth="3" strokeDasharray={`${overallProgress}, 100`} strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
         </svg>
         <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-black text-gray-900">{overallProgress}%</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Selesai</span>
         </div>
      </div>
      <p className="text-sm text-gray-500 leading-relaxed">
         Anda telah menyelesaikan <span className="font-bold text-[var(--color-primary)]">1 dari 6</span> modul utama. Terus tingkatkan!
      </p>
    </Card>
  );
}
