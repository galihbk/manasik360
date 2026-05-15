"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Card from "@/components/ui/Card";
import Link from "next/link";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && user?.role !== 'ADMIN') {
      router.push("/dashboard");
    }
  }, [user, authLoading, router]);

  if (authLoading) return null;

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Control Center</h1>
        <p className="text-gray-500">Selamat datang kembali, {user?.name}. Kelola seluruh ekosistem Manasik360 di sini.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Link href="/dashboard/admin/vr">
          <Card className="p-8 hover:shadow-xl transition-all border-none bg-emerald-600 text-white rounded-[2.5rem] group cursor-pointer">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Management VR</h3>
            <p className="text-emerald-100 text-sm">Atur titik navigasi, hotspot, dan alur simulasi manasik secara dinamis.</p>
          </Card>
        </Link>

        <Link href="/dashboard/admin/feedback">
          <Card className="p-8 hover:shadow-xl transition-all border-none bg-blue-600 text-white rounded-[2.5rem] group cursor-pointer">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Feedback User</h3>
            <p className="text-blue-100 text-sm">Lihat pesan dan masukan dari jamaah untuk meningkatkan kualitas platform.</p>
          </Card>
        </Link>

        <Card className="p-8 border-none bg-white rounded-[2.5rem] shadow-sm flex flex-col justify-center items-center text-center">
            <div className="w-12 h-12 bg-gray-100 text-gray-400 rounded-2xl flex items-center justify-center mb-4">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900">Modul Baru</h3>
            <p className="text-gray-400 text-xs mt-1 italic">Segera Hadir</p>
        </Card>
      </div>
    </div>
  );
}
