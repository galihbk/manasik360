'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { 
  Home, 
  BookOpen, 
  Award, 
  CreditCard, 
  Bell, 
  HelpCircle, 
  User, 
  Settings, 
  LogOut,
  Menu,
  X,
  Users,
  BarChart3,
  Ticket,
  Building2,
  FileText,
  MessageSquare,
  Hotel
} from 'lucide-react';
import { en, id, ar } from '@bahrain/localization';
import { ApiClient } from '@bahrain/api-client';
import ChatWidget from './components/ChatWidget';

const client = new ApiClient({ baseUrl: '/api/v1' });

const isOrgAdmin = (role: string) => role === 'Org Admin' || role === 'ORG_ADMIN' || role === 'ORG ADMIN';
const isSuperAdmin = (role: string) => role === 'Super Admin' || role === 'SUPER_ADMIN' || role === 'SUPER ADMIN';

function SubMenuItems({ subItems }: { subItems: any[] }) {
  const searchParams = useSearchParams();
  const typeParam = searchParams.get('type') || 'haji';
  return (
    <>
      {subItems.map((sub: any) => {
        const isSubActive = typeParam === sub.id || (sub.id === 'haji' && typeParam === 'haji') || (sub.id === 'umrah' && typeParam === 'umroh');
        return (
          <Link
            key={sub.id}
            href={sub.path}
            className={`w-full px-3 py-1.5 rounded-md text-xs font-extrabold transition-all ${
              isSubActive
                ? 'bg-[#1e40af]/10 text-[#1e40af]'
                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            • {sub.label}
          </Link>
        );
      })}
    </>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [userName, setUserName] = useState('');
  const [tenantName, setTenantName] = useState('');
  const [role, setRole] = useState('');
  const [lang, setLang] = useState('en');
  const [planActive, setPlanActive] = useState(false);
  const [planName, setPlanName] = useState('No Active Plan');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Translation helpers
  const tMap: Record<string, any> = { en, id, ar };
  const t = tMap[lang] || en;
  const d = t.dashboard || en.dashboard;
  const isRtl = lang === 'ar';

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const storedName = localStorage.getItem('bahrain_user_name');
    const storedOrg = localStorage.getItem('bahrain_org_name');
    const storedRole = localStorage.getItem('bahrain_user_role');
    const savedLang = localStorage.getItem('bahrain_lang') || 'en';
    if (storedName) setUserName(storedName);
    if (storedOrg) setTenantName(storedOrg);
    if (storedRole) setRole(storedRole);
    setLang(savedLang);

    // Query profile and subscription status from database
    Promise.allSettled([
      client.getProfile()
        .then((data) => {
          if (data && data.name) {
            setUserName(data.name);
            if (data.tenantName) {
              setTenantName(data.tenantName);
              localStorage.setItem('bahrain_org_name', data.tenantName);
            }
            if (data.role) {
              const normalizedRole = data.role === 'ORG_ADMIN' || data.role === 'ORG ADMIN' ? 'Org Admin' : data.role;
              setRole(normalizedRole);
              localStorage.setItem('bahrain_user_role', normalizedRole);
            }
          }
        }),
      client.getSubscription()
        .then((data) => {
          if (data) {
            setPlanActive(data.active);
            setPlanName(data.plan || 'No Active Plan');
            if (data.tenantName) {
              setTenantName(data.tenantName);
              localStorage.setItem('bahrain_org_name', data.tenantName);
            }
          }
        })
        .catch(() => {
          setPlanActive(false);
          setPlanName('No Active Plan');
        })
    ]).finally(() => {
      setIsLoading(false);
    });
  }, [pathname]);

  const handleLogout = () => {
    document.cookie = "bahrain_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    localStorage.removeItem('bahrain_user_name');
    localStorage.removeItem('bahrain_org_name');
    localStorage.removeItem('bahrain_user_role');
    router.push('/login');
  };

  // Learner sidebar menu
  const learnerMenuItems = [
    { id: 'home', label: d.home, path: '/dashboard', icon: <Home className="w-5 h-5" />, group: 'MAIN' },
    { 
      id: 'my-learning', 
      label: d.my_learning, 
      path: '/dashboard/my-learning', 
      icon: <BookOpen className="w-5 h-5" />, 
      group: 'MAIN',
      subItems: [
        { id: 'haji', label: 'Haji', path: '/dashboard/my-learning?type=haji' },
        { id: 'umrah', label: 'Umrah', path: '/dashboard/my-learning?type=umroh' }
      ]
    },
    { id: 'certificates', label: d.certificates, path: '/dashboard/certificates', icon: <Award className="w-5 h-5" />, group: 'MAIN' },
    { id: 'subscription', label: d.subscription, path: '/dashboard/subscription', icon: <CreditCard className="w-5 h-5" />, group: 'MAIN' },
    { id: 'recommendations', label: 'Rekomendasi Mitra', path: '/dashboard/recommendations', icon: <Hotel className="w-5 h-5" />, group: 'MAIN' },
    
    { id: 'notifications', label: d.notifications, path: '/dashboard/notifications', icon: <Bell className="w-5 h-5" />, group: 'COMMUNICATION' },
    { id: 'support', label: d.support, path: '/dashboard/support', icon: <HelpCircle className="w-5 h-5" />, group: 'COMMUNICATION' },
    
    { id: 'profile', label: d.profile, path: '/dashboard/profile', icon: <User className="w-5 h-5" />, group: 'ACCOUNT' },
    { id: 'settings', label: d.settings, path: '/dashboard/settings', icon: <Settings className="w-5 h-5" />, group: 'ACCOUNT' }
  ];

  // Org Admin sidebar menu
  const orgMenuItems = [
    { id: 'home', label: 'Beranda Biro', path: '/dashboard', icon: <Home className="w-5 h-5" />, group: 'BIRO' },
    { id: 'pilgrims', label: 'Daftar Jemaah', path: '/dashboard/pilgrims', icon: <Users className="w-5 h-5" />, group: 'BIRO' },
    { id: 'progress', label: 'Progres Belajar', path: '/dashboard/progress', icon: <BarChart3 className="w-5 h-5" />, group: 'BIRO' },
    { id: 'vouchers', label: 'Voucher Jemaah', path: '/dashboard/vouchers', icon: <Ticket className="w-5 h-5" />, group: 'BIRO' },
    { id: 'recommendations', label: 'Rekomendasi Mitra', path: '/dashboard/recommendations', icon: <Hotel className="w-5 h-5" />, group: 'BIRO' },

    { id: 'notifications', label: d.notifications, path: '/dashboard/notifications', icon: <Bell className="w-5 h-5" />, group: 'KOMUNIKASI' },
    { id: 'support', label: d.support, path: '/dashboard/support', icon: <HelpCircle className="w-5 h-5" />, group: 'KOMUNIKASI' },

    { id: 'profile', label: 'Profil Biro', path: '/dashboard/profile', icon: <Building2 className="w-5 h-5" />, group: 'AKUN' },
    { id: 'settings', label: d.settings, path: '/dashboard/settings', icon: <Settings className="w-5 h-5" />, group: 'AKUN' }
  ];

  // Super Admin sidebar menu
  const superMenuItems = [
    { id: 'home', label: 'Konsol Utama', path: '/dashboard', icon: <Home className="w-5 h-5" />, group: 'SUPER_ADMIN' },
    { id: 'tenants', label: 'Kelola Biro', path: '/dashboard/tenants', icon: <Building2 className="w-5 h-5" />, group: 'SUPER_ADMIN' },
    { id: 'recommendations', label: 'Kelola Kemitraan', path: '/dashboard/recommendations', icon: <Building2 className="w-5 h-5" />, group: 'SUPER_ADMIN' },
    { id: 'vouchers', label: 'Semua Voucher', path: '/dashboard/vouchers', icon: <Ticket className="w-5 h-5" />, group: 'SUPER_ADMIN' },
    { id: 'users', label: 'Daftar Pengguna', path: '/dashboard/users', icon: <Users className="w-5 h-5" />, group: 'SUPER_ADMIN' },
    { id: 'blogs', label: 'Kelola Blog', path: '/dashboard/blogs', icon: <FileText className="w-5 h-5" />, group: 'SUPER_ADMIN' },
    { id: 'chat', label: 'Pesan Chat', path: '/dashboard/chat', icon: <MessageSquare className="w-5 h-5" />, group: 'SUPER_ADMIN' },
    { id: 'profile', label: 'Profil Saya', path: '/dashboard/profile', icon: <User className="w-5 h-5" />, group: 'SUPER_ADMIN' },
    { id: 'settings', label: d.settings, path: '/dashboard/settings', icon: <Settings className="w-5 h-5" />, group: 'SUPER_ADMIN' }
  ];

  const menuItems = isSuperAdmin(role) ? superMenuItems : isOrgAdmin(role) ? orgMenuItems : learnerMenuItems;
  const superGroups = ['SUPER_ADMIN'];
  const orgGroups = ['BIRO', 'KOMUNIKASI', 'AKUN'];
  const learnerGroups = ['MAIN', 'COMMUNICATION', 'ACCOUNT'];
  const groups = isSuperAdmin(role) ? superGroups : isOrgAdmin(role) ? orgGroups : learnerGroups;

  const getGroupLabel = (groupName: string) => {
    if (groupName === 'MAIN') return d.main;
    if (groupName === 'COMMUNICATION') return d.communication;
    if (groupName === 'ACCOUNT') return d.account;
    return groupName;
  };

  const renderGroup = (groupName: string) => (
    <div>
      <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider px-6 mb-2">
        {getGroupLabel(groupName)}
      </p>
      <nav className="px-3 space-y-1">
        {menuItems.filter(item => item.group === groupName).map((item: any) => {
          const isActive = pathname === item.path || (item.path !== '/dashboard' && pathname.startsWith(item.path));
          return (
            <div key={item.id} className="space-y-1">
              <Link
                href={item.path}
                className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-md text-sm font-bold transition-all ${
                  isActive
                    ? isOrgAdmin(role)
                      ? 'bg-blue-50 text-[#1e40af]'
                      : 'bg-slate-100/80 text-slate-900'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <span className={isActive && isOrgAdmin(role) ? 'text-[#1e40af]' : ''}>{item.icon}</span>
                {item.label}
              </Link>
              {item.subItems && isActive && (
                <div className="pl-9 pr-2 py-1 space-y-1 border-l border-slate-200/80 ml-6 mt-1 flex flex-col gap-0.5">
                  <Suspense fallback={null}>
                    <SubMenuItems subItems={item.subItems} />
                  </Suspense>
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );

  if (isLoading) {
    return (
      <div className="h-screen w-screen bg-slate-900 flex flex-col items-center justify-center gap-4 text-white">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-semibold tracking-wider text-slate-400 animate-pulse uppercase">Memuat Dasbor...</p>
      </div>
    );
  }

  const isOrg = isOrgAdmin(role);

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="h-screen bg-slate-50 flex text-slate-800 font-sans antialiased text-base overflow-hidden relative">
      
      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div 
          onClick={() => setIsMobileOpen(false)} 
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm md:hidden transition-all"
        />
      )}

      {/* SIDEBAR NAVIGATION */}
      <aside 
        className={`fixed inset-y-0 ${isRtl ? 'right-0 border-l' : 'left-0 border-r'} z-50 w-64 flex flex-col justify-between shrink-0 transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : isRtl ? 'translate-x-full' : '-translate-x-full md:translate-x-0'
        } bg-white border-slate-200/80`}
      >
        <div>
          {/* Header branding */}
          <div className="h-20 flex items-center justify-between px-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <Image 
                src="/logo.png" 
                alt="Bahrain Logo" 
                width={30} 
                height={30} 
                className="object-contain"
              />
              <div>
                <span className="font-extrabold text-sm tracking-wider uppercase text-slate-900">BAHRAIN</span>
                {isOrg && (
                  <span className="block text-[9px] font-bold text-emerald-600 tracking-widest uppercase">Portal Biro</span>
                )}
              </div>
            </div>
            <button 
              onClick={() => setIsMobileOpen(false)}
              className="p-1 md:hidden focus:outline-none text-slate-400 hover:text-slate-900"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Org Admin: Role badge */}
          {isOrg && (
            <div className="mx-4 mt-4 px-3 py-2 bg-emerald-50 border border-emerald-200/60 rounded-lg flex items-center gap-2">
              <Building2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">Admin Biro & Umrah</span>
            </div>
          )}

          <div className="py-6 space-y-5">
            {groups.map(g => (
              <div key={g} className="">
                {renderGroup(g)}
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic User Profile Card */}
        <div className="p-5 border-t border-slate-150 bg-slate-50/50">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold uppercase ${isOrg ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-200 text-slate-700'}`}>
                {userName.charAt(0)}
              </div>
              <div className="min-w-0">
                <h5 className="text-xs font-bold truncate text-slate-900">{userName}</h5>
                <p className="text-[10px] truncate text-slate-400">{tenantName}</p>
              </div>
            </div>
            
            <div className="pt-2 border-t border-slate-200/60 text-slate-500 space-y-1.5 text-xs">
              {!isOrg && !isSuperAdmin(role) && (
                <>
                  <div className="flex justify-between">
                    <span>Plan:</span>
                    <span className="font-semibold text-slate-700">{planName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className={`font-semibold ${planActive ? 'text-emerald-600' : 'text-slate-400'}`}>
                      {planActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </>
              )}
              <div className="flex justify-between">
                <span>Role:</span>
                <span className="font-semibold text-slate-700">
                  {isSuperAdmin(role) ? 'Super Admin' : isOrg ? 'Admin Biro' : 'Jemaah'}
                </span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 mt-2 py-2 border border-slate-250 hover:bg-slate-100 text-slate-700 rounded text-xs font-bold transition-all"
            >
              <LogOut className="w-4 h-4" />
              {d.sign_out}
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT WRAPPER — only this area scrolls */}
      <main className="flex-1 flex flex-col bg-white overflow-y-auto h-screen md:ml-64">
        {/* Mobile Top Navbar Header */}
        <header className="h-16 border-b px-6 flex items-center justify-between md:hidden shrink-0 bg-white border-slate-200/60">
          <button 
            onClick={() => setIsMobileOpen(true)}
            className="p-1 focus:outline-none text-slate-500 hover:text-slate-900"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <Image 
              src="/logo.png" 
              alt="Bahrain Logo" 
              width={24} 
              height={24} 
              className="object-contain"
            />
            <span className="font-extrabold text-xs tracking-wider text-slate-900">BAHRAIN</span>
          </div>
          <div className="w-8"></div>
        </header>

        <div className="flex-1">
          {children}
        </div>
        <ChatWidget />
      </main>
    </div>
  );
}
