"use client";

import Link from "next/link";
import Image from "next/image";
import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import ChatWidget from "@/components/dashboard/ChatWidget";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (user.role !== "ADMIN") {
        router.push("/dashboard");
      }
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== "ADMIN") {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-emerald-600 font-black tracking-widest text-xs uppercase animate-pulse">Memuat Panel Admin...</p>
      </div>
    );
  }

  const menuItems = [
    {
      section: "Menu Utama",
      items: [
        { 
          name: "Ringkasan", 
          icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z"/></svg>, 
          href: "/admin" 
        },
        { 
          name: "Live Chat", 
          icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>, 
          href: "/admin/chat" 
        },
      ]
    },
    {
      section: "Manajemen Konten",
      items: [
        { 
          name: "Kelola Blog & Berita", 
          icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 4a2 2 0 00-2-2h-3m3 2a2 2 0 00-2-2M9 9h.01M9 13h.01M9 17h.01M13 9h.01M13 13h.01M13 17h.01"/></svg>, 
          href: "/admin/blogs" 
        },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-slate-900 flex font-sans">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 z-[110] lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 h-screen w-80 bg-white border-r border-slate-100 flex-shrink-0 flex flex-col z-[120] transition-transform duration-500 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-8 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-3">
             <div className="relative w-10 h-10 bg-emerald-50 p-2 rounded-2xl border border-emerald-100 flex items-center justify-center">
                <Image src="/logo.png" alt="Logo" fill className="object-contain p-2" />
             </div>
             <div className="flex flex-col">
                <span className="text-lg font-black text-slate-900 leading-none tracking-tight">MANASIK<span className="text-emerald-600">360</span></span>
                <span className="text-[9px] text-emerald-600 font-bold uppercase tracking-widest mt-1">ADMIN CONSOLE</span>
             </div>
          </Link>
          <button 
            className="lg:hidden p-2 text-slate-400 hover:text-slate-600"
            onClick={() => setIsSidebarOpen(false)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
          {menuItems.map((section, idx) => (
            <div key={idx} className="space-y-3">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">{section.section}</h4>
              <nav className="space-y-1">
                {section.items.map((item, i) => {
                  const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
                  return (
                    <Link 
                      key={i} 
                      href={item.href} 
                      onClick={() => setIsSidebarOpen(false)}
                      className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                        isActive 
                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/10' 
                        : 'text-slate-500 hover:bg-slate-50 hover:text-emerald-600'
                      }`}
                    >
                      <div className={`${isActive ? 'text-white' : 'text-slate-400 group-hover:text-emerald-600'} transition-colors`}>
                        {item.icon}
                      </div>
                      <span className="text-sm font-semibold">{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

        <div className="p-8">
          <button 
            onClick={logout}
            className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-2xl bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-100 transition-all font-bold text-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            Keluar Panel
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-6 lg:px-10 shrink-0">
          <div className="flex items-center gap-4 flex-1">
             <button 
               className="lg:hidden p-2 text-slate-500 hover:bg-slate-50 rounded-xl transition-colors"
               onClick={() => setIsSidebarOpen(true)}
             >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
             </button>
             <div className="flex-1 max-w-xl hidden md:block">
                <span className="text-xs font-semibold text-emerald-600/80 uppercase tracking-widest">Sistem Administrasi Kurikulum Virtual Reality</span>
             </div>
          </div>
          
          <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 pl-4 border-l border-slate-100">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-650 font-black">
                   {user?.name?.charAt(0) || "A"}
                </div>
                <div className="hidden lg:block text-left">
                   <p className="text-sm font-black text-slate-900 leading-none mb-1">{user?.name || "Administrator"}</p>
                   <p className="text-[8px] font-black uppercase tracking-widest text-emerald-600">
                      Super Admin
                   </p>
                </div>
              </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-10 scroll-smooth bg-[#f8f9fa]">
           {children}
        </main>
      </div>
    </div>
  );
}
