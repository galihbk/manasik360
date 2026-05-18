"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Card from "@/components/ui/Card";
import { useAuth } from "@/context/AuthContext";

export default function ProfilePage() {
  const { user, login } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("+62 812 3456 7890"); // Mock/Default phone as user doesn't have it in schema
  const [location, setLocation] = useState("Jakarta Selatan"); // Mock/Default city
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Populate data when active user loads
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    // Form validations
    if (!name.trim()) {
      setMessage({ type: "error", text: "Nama tidak boleh kosong" });
      return;
    }
    if (!email.trim()) {
      setMessage({ type: "error", text: "Email tidak boleh kosong" });
      return;
    }
    if (password) {
      if (password !== confirmPassword) {
        setMessage({ type: "error", text: "Konfirmasi password tidak cocok" });
        return;
      }
      if (password.length < 6) {
        setMessage({ type: "error", text: "Password baru minimal harus 6 karakter" });
        return;
      }
    }

    setIsSaving(true);
    try {
      const response = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password: password || undefined,
        }),
      });

      const json = await response.json();
      if (json.status === "success") {
        // Sync context session and local storage
        login(json.data.user);
        setMessage({ type: "success", text: "Profil berhasil diperbarui!" });
        setPassword("");
        setConfirmPassword("");
      } else {
        setMessage({ type: "error", text: json.message || "Gagal memperbarui profil." });
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      setMessage({ type: "error", text: "Terjadi kesalahan koneksi server." });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full space-y-12 pb-10">
      <div className="space-y-2 text-left">
        <h1 className="text-3xl font-bold text-gray-900">Pengaturan Profil</h1>
        <p className="text-gray-500">Kelola informasi pribadi dan preferensi akun Anda secara real-time.</p>
      </div>

      {message && (
        <div className={`p-6 rounded-[2rem] border text-sm font-semibold flex items-center gap-3 animate-in fade-in duration-300 ${message.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-rose-50 border-rose-100 text-rose-800'}`}>
          {message.type === 'success' ? (
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          ) : (
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          )}
          {message.text}
        </div>
      )}

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
         {/* Left Side: Photo & Quick Info */}
         <div className="space-y-8">
            <Card className="p-10 bg-white border-none shadow-sm flex flex-col items-center text-center space-y-6 rounded-[3rem]">
               <div className="relative group">
                  <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden border-4 border-emerald-50 shadow-xl bg-emerald-50 flex items-center justify-center text-emerald-700 text-4xl font-extrabold relative">
                     {name.charAt(0) || "U"}
                  </div>
               </div>
               <div>
                  <h3 className="text-xl font-bold text-gray-900">{name || "Loading..."}</h3>
                  <p className="text-xs text-green-600 font-bold uppercase tracking-widest mt-1">
                    {user?.role === 'ADMIN' ? 'Administrator' : 'Premium User'}
                  </p>
               </div>
               <div className="w-full pt-6 border-t border-gray-50 flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
                  <span>ID Anggota</span>
                  <span className="text-gray-900">M360-{user?.id ? user.id.slice(0, 5).toUpperCase() : "10294"}</span>
               </div>
            </Card>

            <div className="bg-amber-50 p-8 rounded-[3rem] border border-amber-100 flex items-start gap-4">
               <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm text-amber-500">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
               </div>
               <p className="text-xs text-amber-700 leading-relaxed text-left">
                  Data Anda aman dan terenkripsi. Kami tidak akan membagikan informasi pribadi Anda kepada pihak manapun.
               </p>
            </div>
         </div>

         {/* Right Side: Form */}
         <div className="lg:col-span-2">
            <Card className="p-10 lg:p-12 bg-white border-none shadow-sm rounded-[3rem] space-y-10">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                  <div className="space-y-2">
                     <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-2">Nama Lengkap</label>
                     <input 
                       type="text" 
                       value={name}
                       onChange={(e) => setName(e.target.value)}
                       className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-[var(--color-primary)]/10 transition-all font-semibold text-gray-800"
                       required
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-2">Email</label>
                     <input 
                       type="email" 
                       value={email}
                       onChange={(e) => setEmail(e.target.value)}
                       className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-[var(--color-primary)]/10 transition-all font-semibold text-gray-800"
                       required
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-2">No. WhatsApp</label>
                     <input 
                       type="text" 
                       value={phone}
                       onChange={(e) => setPhone(e.target.value)}
                       className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-[var(--color-primary)]/10 transition-all font-semibold text-gray-800 font-sans"
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-2">Lokasi / Kota</label>
                     <input 
                       type="text" 
                       value={location}
                       onChange={(e) => setLocation(e.target.value)}
                       className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-[var(--color-primary)]/10 transition-all font-semibold text-gray-800"
                     />
                  </div>
               </div>

               <div className="pt-6 border-t border-gray-50 space-y-6 text-left">
                  <h4 className="font-bold text-gray-900">Keamanan Akun</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-2">Password Baru</label>
                        <input 
                          type="password" 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Ketik password baru..."
                          className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-[var(--color-primary)]/10 transition-all"
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-2">Konfirmasi Password</label>
                        <input 
                          type="password" 
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Ulangi password baru..."
                          className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-[var(--color-primary)]/10 transition-all"
                        />
                     </div>
                  </div>
               </div>

               <div className="pt-10 flex justify-end">
                  <button 
                    type="submit"
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
      </form>
    </div>
  );
}
