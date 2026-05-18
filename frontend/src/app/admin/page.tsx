"use client";

import { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import Link from "next/link";

interface LatestUser {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

interface StatsData {
  totalUsers: number;
  totalBlogs: number;
  totalReviews: number;
  totalFeedbacks: number;
  latestUsers: LatestUser[];
}

export default function AdminDashboardHome() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/auth/stats", { credentials: "include" });
      const json = await response.json();
      if (json.status === "success") {
        setStats(json.data);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return <div className="p-10 text-emerald-600 font-bold animate-pulse">Memuat Ringkasan Dashboard...</div>;
  }

  // Format date safely
  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric"
      });
    } catch {
      return "Baru saja";
    }
  };

  return (
    <div className="space-y-12 pb-20 text-left">
      {/* HEADER SECTION */}
      <div className="flex justify-between items-end border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Ringkasan Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Pantau pendaftaran jamaah, publikasi konten, dan interaksi KBIHU secara real-time.</p>
        </div>
        <button 
          onClick={() => { setLoading(true); fetchStats(); }}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl text-xs font-bold transition-all border border-emerald-100"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89H18"/></svg>
          Refresh Data
        </button>
      </div>

      {/* STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        
        {/* Card 1: Pendaftar */}
        <Card className="p-8 bg-white border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 rounded-[2.5rem] flex items-center gap-6 group hover:border-emerald-500/20">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-2xl flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition-transform">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Total Jamaah</p>
            <h3 className="text-3xl font-black text-slate-900 leading-none">{stats?.totalUsers || 0}</h3>
            <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100 uppercase tracking-wider inline-block">Terdaftar</span>
          </div>
        </Card>

        {/* Card 2: Artikel */}
        <Card className="p-8 bg-white border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 rounded-[2.5rem] flex items-center gap-6 group hover:border-amber-500/20">
          <div className="w-14 h-14 bg-amber-50 text-amber-600 border border-amber-100 rounded-2xl flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition-transform">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 4a2 2 0 00-2-2h-3m3 2a2 2 0 00-2-2M9 9h.01M9 13h.01M9 17h.01M13 9h.01M13 13h.01M13 17h.01"/></svg>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Artikel Edukasi</p>
            <h3 className="text-3xl font-black text-slate-900 leading-none">{stats?.totalBlogs || 0}</h3>
            <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100 uppercase tracking-wider inline-block">Published</span>
          </div>
        </Card>

        {/* Card 3: Feedback */}
        <Card className="p-8 bg-white border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 rounded-[2.5rem] flex items-center gap-6 group hover:border-blue-500/20">
          <div className="w-14 h-14 bg-blue-50 text-blue-600 border border-blue-100 rounded-2xl flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition-transform">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Saran Pengunjung</p>
            <h3 className="text-3xl font-black text-slate-900 leading-none">{stats?.totalFeedbacks || 0}</h3>
            <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100 uppercase tracking-wider inline-block">Masuk</span>
          </div>
        </Card>

        {/* Card 4: Ulasan */}
        <Card className="p-8 bg-white border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 rounded-[2.5rem] flex items-center gap-6 group hover:border-rose-500/20">
          <div className="w-14 h-14 bg-rose-50 text-rose-600 border border-rose-100 rounded-2xl flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition-transform">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.175 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Ulasan Manasik</p>
            <h3 className="text-3xl font-black text-slate-900 leading-none">{stats?.totalReviews || 0}</h3>
            <span className="text-[9px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100 uppercase tracking-wider inline-block">Rating 5/5</span>
          </div>
        </Card>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        {/* Left Side: Recent Registrants list (takes 2/3) */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-8 bg-white border border-slate-100 shadow-sm rounded-[2.5rem] space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-black text-slate-900 tracking-tight">Daftar Pendaftar Terbaru</h3>
              <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider border border-emerald-100">5 Akun Baru</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <th className="pb-4 pl-4">Jamaah</th>
                    <th className="pb-4">Email</th>
                    <th className="pb-4">Tanggal Daftar</th>
                    <th className="pb-4 pr-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {!stats?.latestUsers || stats.latestUsers.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-10 text-center text-slate-400 text-sm font-semibold">
                        Belum ada jamaah yang terdaftar di database.
                      </td>
                    </tr>
                  ) : (
                    stats.latestUsers.map((u) => (
                      <tr key={u.id} className="group hover:bg-slate-50/50 transition-colors">
                        <td className="py-5 pl-4 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 font-extrabold text-sm shrink-0">
                            {u.name ? u.name.charAt(0).toUpperCase() : "U"}
                          </div>
                          <span className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">{u.name || "User Tanpa Nama"}</span>
                        </td>
                        <td className="py-5 text-slate-500 font-medium text-xs font-sans">{u.email}</td>
                        <td className="py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">{formatDate(u.createdAt)}</td>
                        <td className="py-5 pr-4 text-right">
                          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                            u.role === "ADMIN" 
                              ? "bg-blue-50 border-blue-100 text-blue-700" 
                              : "bg-emerald-50 border-emerald-100 text-emerald-700"
                          }`}>
                            {u.role === "ADMIN" ? "Super Admin" : "Premium User"}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Right Side: Quick Action and System Information (takes 1/3) */}
        <div className="space-y-6">
          <Card className="p-8 bg-white border border-slate-100 shadow-sm rounded-[2.5rem] space-y-6">
            <h3 className="text-lg font-black text-slate-900 tracking-tight">Navigasi Cepat</h3>
            
            <div className="space-y-3">
              <Link 
                href="/admin/blogs"
                className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-emerald-50 border border-slate-150 hover:border-emerald-100 rounded-2xl group transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white border border-slate-150 rounded-xl flex items-center justify-center text-slate-500 group-hover:bg-emerald-600 group-hover:text-white transition-colors shadow-sm">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                  </div>
                  <div className="text-left">
                    <h4 className="text-xs font-bold text-slate-900 leading-none">Terbitkan Artikel</h4>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-1 inline-block">Kelola Blog</span>
                  </div>
                </div>
                <svg className="w-5 h-5 text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"/></svg>
              </Link>

              <Link 
                href="/dashboard"
                className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-emerald-50 border border-slate-150 hover:border-emerald-100 rounded-2xl group transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white border border-slate-150 rounded-xl flex items-center justify-center text-slate-500 group-hover:bg-emerald-600 group-hover:text-white transition-colors shadow-sm">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
                  </div>
                  <div className="text-left">
                    <h4 className="text-xs font-bold text-slate-900 leading-none">Portal Jamaah</h4>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-1 inline-block">Lihat Simulasi VR</span>
                  </div>
                </div>
                <svg className="w-5 h-5 text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"/></svg>
              </Link>
            </div>
          </Card>

          <div className="bg-emerald-50 border border-emerald-100 rounded-[2.5rem] p-8 text-left space-y-4 shadow-sm">
            <h4 className="font-bold text-emerald-950 text-sm">🛡️ Konsol Manajemen Aman</h4>
            <p className="text-xs text-emerald-800 leading-relaxed font-medium">
              Seluruh data pendaftar dan statistik di atas terenkripsi secara otomatis menggunakan protokol keamanan tingkat tinggi. Silakan hubungi bagian IT travel KBIHU jika Anda memerlukan integrasi API pendaftaran haji lebih lanjut.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
