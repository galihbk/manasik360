"use client";

import { useState, useEffect } from "react";
import PrayerCategories from "@/components/dashboard/prayers/PrayerCategories";
import PrayerCard from "@/components/dashboard/prayers/PrayerCard";

interface Prayer {
  id: string;
  title: string;
  category: string;
  arabic: string;
  latin: string;
  translation: string;
  audioUrl?: string;
}

export default function PrayersPage() {
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPrayers() {
      try {
        const response = await fetch("/api/prayers", {
          credentials: "include"
        });
        const json = await response.json();
        if (json.status === "success") {
          setPrayers(json.data);
        }
      } catch (error) {
        console.error("Failed to fetch prayers:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPrayers();
  }, []);

  return (
    <div className="w-full space-y-12 pb-10">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Doa & Dzikir</h1>
        <p className="text-gray-500">Kumpulan doa-doa mustajab selama perjalanan ibadah Anda.</p>
      </div>

      {/* Search & Categories */}
      <div className="space-y-6 bg-white p-6 lg:p-8 rounded-[2.5rem] shadow-sm border border-gray-50">
         <div className="relative group max-w-2xl">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </span>
            <input 
              type="text" 
              placeholder="Cari doa tertentu..." 
              className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-[var(--color-primary)]/10 transition-all"
            />
         </div>
         <PrayerCategories />
      </div>

      {/* Prayer List */}
      {loading ? (
        <div className="flex justify-center py-20">
           <div className="w-10 h-10 border-4 border-[var(--color-primary)]/20 border-t-[var(--color-primary)] rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {prayers.map((prayer, i) => (
             <PrayerCard key={i} {...prayer} />
           ))}
        </div>
      )}

      {/* Helpful Tip */}
      <div className="bg-amber-50 p-8 rounded-[2.5rem] border border-amber-100 flex items-center gap-6">
         <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm">
            <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
         </div>
         <div>
            <h4 className="font-bold text-amber-900 mb-1">Tips Menghafal</h4>
            <p className="text-sm text-amber-700 leading-relaxed">
               Gunakan fitur audio untuk mendengarkan pelafalan yang benar secara berulang. Menghafal sedikit demi sedikit setiap hari jauh lebih efektif.
            </p>
         </div>
      </div>
    </div>
  );
}
