"use client";

import { useState, useEffect } from "react";
import HistoryItem from "@/components/dashboard/history/HistoryItem";
import Card from "@/components/ui/Card";

interface Activity {
  id: string;
  title: string;
  type: string;
  time: string;
  date: string;
  color: string;
  icon: string;
}

export default function HistoryPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchActivities() {
      try {
        const response = await fetch("/api/activities", {
          credentials: "include"
        });
        const json = await response.json();
        if (json.status === "success") {
          setActivities(json.data);
        }
      } catch (error) {
        console.error("Failed to fetch activities:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchActivities();
  }, []);

  // Compute dynamic stats from backend database activities list
  const totalSesiVal = `${activities.length} Sesi`;

  const vrActivities = activities.filter(a => a.type === "Simulasi");
  const totalMinutes = vrActivities.length * 15; // 15 mins estimated per VR task
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const simulasiVal = hours > 0 
    ? `${hours} Jam ${minutes} Menit` 
    : `${minutes} Menit`;

  const totalDoaVal = `${activities.filter(a => a.type === "Hafalan").length} Doa`;

  return (
    <div className="w-full space-y-12 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Histori Aktivitas</h1>
          <p className="text-gray-500">Rekaman jejak persiapan ibadah Anda dari waktu ke waktu.</p>
        </div>
        <div className="flex gap-4">
           <button className="px-6 py-2.5 bg-white border border-gray-100 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition-all flex items-center gap-2 shadow-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/></svg>
              Filter Tipe
           </button>
           <button className="px-6 py-2.5 bg-white border border-gray-100 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition-all flex items-center gap-2 shadow-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              Urutkan Terbaru
           </button>
        </div>
      </div>

      {/* Stats Summary Area */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         {[
           { label: "Total Sesi Belajar", val: totalSesiVal, color: "text-blue-600" },
           { label: "Waktu Simulasi", val: simulasiVal, color: "text-emerald-600" },
           { label: "Doa yang Dihafal", val: totalDoaVal, color: "text-amber-600" },
         ].map((stat, i) => (
           <Card key={i} className="p-8 bg-white border-none shadow-sm flex flex-col justify-center text-center space-y-2 rounded-[2rem]">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
              <h3 className={`text-2xl font-black ${stat.color}`}>{stat.val}</h3>
           </Card>
         ))}
      </div>

      {/* Timeline Section */}
      <div className="w-full space-y-4">
         {loading ? (
            <div className="flex justify-center py-20">
               <div className="w-10 h-10 border-4 border-[var(--color-primary)]/20 border-t-[var(--color-primary)] rounded-full animate-spin"></div>
            </div>
         ) : activities.length === 0 ? (
            <div className="text-center py-20 bg-white border border-gray-100 rounded-[2.5rem]">
               <p className="text-gray-400 text-sm">Belum ada histori aktivitas. Mulailah belajar di halaman modul!</p>
            </div>
         ) : (
            activities.map((item, i) => (
              <HistoryItem key={i} {...item} />
            ))
         )}
      </div>

      {/* Load More */}
      {activities.length > 5 && (
        <div className="flex justify-center pt-8">
           <button className="px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-2xl text-xs font-bold transition-all">
              Muat Aktivitas Sebelumnya
           </button>
        </div>
      )}
    </div>
  );
}
