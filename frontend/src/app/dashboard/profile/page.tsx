"use client";

import { useState } from "react";
import Image from "next/image";
import Card from "@/components/ui/Card";

export default function ProfilePage() {
  const [name, setName] = useState("Akhmad Fauzi");
  const [email, setEmail] = useState("fauzi@manasik360.com");
  const [phone, setPhone] = useState("+62 812 3456 7890");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert("Profil berhasil diperbarui!");
    }, 1500);
  };

  return (
    <div className="w-full space-y-12 pb-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Pengaturan Profil</h1>
        <p className="text-gray-500">Kelola informasi pribadi dan preferensi akun Anda.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
         {/* Left Side: Photo & Quick Info */}
         <div className="space-y-8">
            <Card className="p-10 bg-white border-none shadow-sm flex flex-col items-center text-center space-y-6 rounded-[3rem]">
               <div className="relative group">
                  <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden border-4 border-emerald-50 shadow-xl">
                     <Image src="/images/pilgrim-hero.png" alt="Profile" fill className="object-cover" />
                  </div>
                  <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-[var(--color-primary)] text-white rounded-xl flex items-center justify-center shadow-lg hover:scale-110 transition-all border-4 border-white">
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                  </button>
               </div>
               <div>
                  <h3 className="text-xl font-bold text-gray-900">{name}</h3>
                  <p className="text-xs text-green-600 font-bold uppercase tracking-widest mt-1">Premium User</p>
               </div>
               <div className="w-full pt-6 border-t border-gray-50 flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
                  <span>ID Anggota</span>
                  <span className="text-gray-900">M360-10294</span>
               </div>
            </Card>

            <div className="bg-amber-50 p-8 rounded-[3rem] border border-amber-100 flex items-start gap-4">
               <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm text-amber-500">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
               </div>
               <p className="text-xs text-amber-700 leading-relaxed">
                  Data Anda aman dan terenkripsi. Kami tidak akan membagikan informasi pribadi Anda kepada pihak manapun.
               </p>
            </div>
         </div>

         {/* Right Side: Form */}
         <div className="lg:col-span-2">
            <Card className="p-10 lg:p-12 bg-white border-none shadow-sm rounded-[3rem] space-y-10">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                     <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-2">Nama Lengkap</label>
                     <input 
                       type="text" 
                       value={name}
                       onChange={(e) => setName(e.target.value)}
                       className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-[var(--color-primary)]/10 transition-all"
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-2">Email</label>
                     <input 
                       type="email" 
                       value={email}
                       onChange={(e) => setEmail(e.target.value)}
                       className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-[var(--color-primary)]/10 transition-all"
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-2">No. WhatsApp</label>
                     <input 
                       type="text" 
                       value={phone}
                       onChange={(e) => setPhone(e.target.value)}
                       className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-[var(--color-primary)]/10 transition-all"
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-2">Lokasi / Kota</label>
                     <input 
                       type="text" 
                       placeholder="Contoh: Jakarta Selatan"
                       className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-[var(--color-primary)]/10 transition-all"
                     />
                  </div>
               </div>

               <div className="pt-6 border-t border-gray-50 space-y-6">
                  <h4 className="font-bold text-gray-900">Keamanan Akun</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-2">Password Baru</label>
                        <input 
                          type="password" 
                          placeholder="••••••••"
                          className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-[var(--color-primary)]/10 transition-all"
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-2">Konfirmasi Password</label>
                        <input 
                          type="password" 
                          placeholder="••••••••"
                          className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-[var(--color-primary)]/10 transition-all"
                        />
                     </div>
                  </div>
               </div>

               <div className="pt-10 flex justify-end">
                  <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-12 py-4 bg-[var(--color-primary)] text-white rounded-2xl font-bold text-sm shadow-xl shadow-emerald-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-3 disabled:opacity-50"
                  >
                     {isSaving ? (
                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                     ) : (
                        <>
                           Simpan Perubahan
                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                        </>
                     )}
                  </button>
               </div>
            </Card>
         </div>
      </div>
    </div>
  );
}
