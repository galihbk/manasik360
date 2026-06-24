"use client";

import Link from "next/link";
import Image from "next/image";
import { ReactNode, useState } from "react";
import { usePathname } from "next/navigation";
import NotificationDropdown from "@/components/dashboard/NotificationDropdown";
import ChatWidget from "@/components/dashboard/ChatWidget";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

interface MenuItem {
  name: string;
  icon: React.ReactNode;
  href: string;
}

interface MenuSection {
  section: string;
  items: MenuItem[];
  userOnly?: boolean;
  adminOnly?: boolean;
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);

  console.log("Current User Role:", user?.role); // Debug line
  
  const allMenuItems: MenuSection[] = [
    { section: t("menu.dashboard"), items: [
      { name: t("menu.home"), icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>, href: "/dashboard" },
      { name: t("menu.packages"), icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"/></svg>, href: "/dashboard/packages" },
      { name: t("menu.progress"), icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0h6m2 0h2a2 2 0 002-2v-7a2 2 0 00-2-2h-2a2 2 0 00-2 2v7a2 2 0 002 2z"/></svg>, href: "/dashboard/progress" },
    ], userOnly: true },
    { section: t("menu.mainMenu"), items: [
      { name: t("menu.prayers"), icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>, href: "/dashboard/prayers" },
      { name: t("menu.certificate"), icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>, href: "/dashboard/certificate" },
      { name: t("menu.history"), icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>, href: "/dashboard/history" },
      { name: t("menu.reviews"), icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.175 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>, href: "/dashboard/reviews" },
    ], userOnly: true },
    { section: t("menu.settings"), items: [
      { name: t("menu.profile"), icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>, href: "/dashboard/profile" },
      { name: t("menu.help"), icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>, href: "/dashboard/help" },
    ]}
  ];

  const menuItems = allMenuItems.filter(section => {
    const isUser = user?.role?.toUpperCase() === 'USER';
    const isAdmin = user?.role?.toUpperCase() === 'ADMIN';

    // Jika section khusus admin, hanya tampilkan jika user adalah admin
    if (section.adminOnly) return isAdmin;
    
    // Jika section khusus user (jamaah), sembunyikan jika yang login adalah admin
    if (section.userOnly) return isUser;

    return true;
  });

  console.log("DEBUG - User in Layout:", user);

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[110] lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 h-screen w-72 bg-white border-r border-gray-100 flex-shrink-0 flex flex-col z-[120] transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-8 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
             <div className="relative w-10 h-10">
                <Image src="/logo.png" alt="Logo" fill className="object-contain" />
             </div>
             <div className="flex flex-col">
                <span className="text-lg font-bold text-gray-900 leading-none">bahrain</span>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">International</span>
             </div>
          </Link>
          <button 
            className="lg:hidden p-2 text-gray-400 hover:text-gray-600"
            onClick={() => setIsSidebarOpen(false)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-10">
          {menuItems.map((section, idx) => (
            <div key={idx} className="space-y-4">
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4">{section.section}</h4>
              <nav className="space-y-1">
                {section.items.map((item, i) => {
                  const isActive = pathname === item.href || (item.href === "/dashboard/progress" && pathname.startsWith("/dashboard/modules"));
                  return (
                    <Link 
                      key={i} 
                      href={item.href} 
                      onClick={() => setIsSidebarOpen(false)}
                      className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all group ${
                        isActive 
                        ? 'bg-[var(--color-primary)] text-white shadow-lg shadow-emerald-900/10' 
                        : 'text-gray-500 hover:bg-gray-50 hover:text-[var(--color-primary)]'
                      }`}
                    >
                      <div className={`${isActive ? 'text-white' : 'text-gray-400 group-hover:text-[var(--color-primary)]'} transition-colors`}>
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
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all font-semibold text-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            {t("menu.logout")}
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-4 lg:px-8 shrink-0">
          <div className="flex items-center gap-4 flex-1">
             <button 
               className="lg:hidden p-2 text-gray-500 hover:bg-gray-50 rounded-xl transition-colors"
               onClick={() => setIsSidebarOpen(true)}
             >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
             </button>
             <div className="flex-1 max-w-xl hidden md:block"></div>
          </div>
          
          <div className="flex items-center gap-2 lg:gap-6">
             <div className="relative">
               <button 
                 onClick={() => setIsLangOpen(!isLangOpen)}
                 className="hidden sm:flex items-center gap-4 px-4 py-2 bg-gray-50 rounded-full cursor-pointer hover:bg-gray-100 transition-colors"
               >
                  {language === "id" && (
                    <div className="w-5 h-5 rounded-full overflow-hidden flex flex-col border border-gray-200 shrink-0">
                       <div className="h-1/2 bg-red-600"></div>
                       <div className="h-1/2 bg-white"></div>
                    </div>
                  )}
                  {language === "en" && (
                    <div className="w-5 h-5 rounded-full overflow-hidden flex flex-col border border-gray-200 shrink-0">
                       <div className="h-1/3 bg-blue-800"></div>
                       <div className="h-1/3 bg-red-600"></div>
                       <div className="h-1/3 bg-white"></div>
                    </div>
                  )}
                  {language === "ar" && (
                    <div className="w-5 h-5 rounded-full overflow-hidden flex flex-col border border-gray-200 shrink-0">
                       <div className="h-full bg-green-700 flex items-center justify-center text-[10px] text-white font-bold">ع</div>
                    </div>
                  )}
                  <span className="text-xs font-bold text-gray-600 uppercase">{language}</span>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
               </button>

               {isLangOpen && (
                 <>
                   <div className="fixed inset-0 z-40" onClick={() => setIsLangOpen(false)}></div>
                   <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 p-2 space-y-1">
                     <button
                       onClick={() => {
                         setLanguage("id");
                         setIsLangOpen(false);
                       }}
                       className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-left text-xs font-bold transition-all ${
                         language === "id" ? "bg-emerald-50 text-emerald-700" : "text-gray-600 hover:bg-gray-50"
                       }`}
                     >
                       <div className="w-5 h-5 rounded-full overflow-hidden flex flex-col border border-gray-200 shrink-0">
                         <div className="h-1/2 bg-red-600"></div>
                         <div className="h-1/2 bg-white"></div>
                       </div>
                       <span>Bahasa Indonesia</span>
                     </button>
                     <button
                       onClick={() => {
                         setLanguage("en");
                         setIsLangOpen(false);
                       }}
                       className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-left text-xs font-bold transition-all ${
                         language === "en" ? "bg-emerald-50 text-emerald-700" : "text-gray-600 hover:bg-gray-50"
                       }`}
                     >
                       <div className="w-5 h-5 rounded-full overflow-hidden flex flex-col border border-gray-200 shrink-0">
                         <div className="h-1/3 bg-blue-800"></div>
                         <div className="h-1/3 bg-red-600"></div>
                         <div className="h-1/3 bg-white"></div>
                       </div>
                       <span>English</span>
                     </button>
                     <button
                       onClick={() => {
                         setLanguage("ar");
                         setIsLangOpen(false);
                       }}
                       className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-left text-xs font-bold transition-all ${
                         language === "ar" ? "bg-emerald-50 text-emerald-700" : "text-gray-600 hover:bg-gray-50"
                       }`}
                     >
                       <div className="w-5 h-5 rounded-full overflow-hidden border border-gray-200 shrink-0 bg-green-700 flex items-center justify-center text-[10px] text-white font-bold">
                         ع
                       </div>
                       <span>العربية (Arabic)</span>
                     </button>
                   </div>
                 </>
               )}
             </div>
             
             <NotificationDropdown />
             
              <Link href="/dashboard/profile" className="flex items-center gap-3 pl-2 lg:pl-4 border-l border-gray-100 hover:opacity-80 transition-opacity">
                <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm border border-gray-100 bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
                   {user?.name?.charAt(0) || "U"}
                </div>
                <div className="hidden lg:block text-left">
                   <p className="text-sm font-bold text-gray-900 leading-none mb-1">{user?.name || "User"}</p>
                   <p className={`text-[10px] font-bold uppercase tracking-tighter ${user?.role === 'ADMIN' ? 'text-blue-600' : 'text-green-600'}`}>
                      {user?.role === 'ADMIN' ? t("header.admin") : t("header.premium")}
                   </p>
                </div>
              </Link>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-10 scroll-smooth">
           {children}
        </main>
      </div>
      {!pathname.includes('/tour/viewer') && <ChatWidget />}
    </div>
  );
}
