'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { en, id, ar } from '@bahrain/localization';
import { 
  Globe, 
  Lock, 
  Bell, 
  ShieldAlert, 
  CheckCircle2, 
  Eye, 
  EyeOff,
  UserX
} from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();
  const [lang, setLang] = useState('en');

  // Change password states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Notification toggles (persisted in state)
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifInApp, setNotifInApp] = useState(true);
  const [notifWA, setNotifWA] = useState(false);

  // Privacy toggles
  const [shareProgress, setShareProgress] = useState(true);
  const [receiveNews, setReceiveNews] = useState(false);

  // Translation helpers
  const tMap: Record<string, any> = { en, id, ar };
  const t = tMap[lang] || en;
  const d = t.dashboard || en.dashboard;

  // Local translations for settings page
  const localD: Record<string, Record<string, string>> = {
    en: {
      sub_desc: 'Manage language translation, security, and preferred configurations',
      preferred_lang: 'Preferred Language',
      toggle_desc: 'Change UI language interface translation',
      security_title: 'Security & Password',
      security_desc: 'Update your login password credentials',
      curr_pass: 'Current Password',
      new_pass: 'New Password',
      conf_pass: 'Confirm New Password',
      notif_title: 'Notifications Preferences',
      notif_desc: 'Choose how you receive messages and alerts',
      privacy_title: 'Privacy & Sharing',
      privacy_desc: 'Manage progress visibility to your travel agency (Biro)',
      danger_title: 'Danger Zone',
      danger_desc: 'Irreversible account operations',
      delete_acc: 'Delete Account'
    },
    id: {
      sub_desc: 'Kelola preferensi bahasa, keamanan akun, dan konfigurasi lainnya',
      preferred_lang: 'Bahasa Pilihan',
      toggle_desc: 'Ubah kamus terjemahan antarmuka sistem',
      security_title: 'Keamanan & Kata Sandi',
      security_desc: 'Perbarui kata sandi akun Anda secara berkala',
      curr_pass: 'Kata Sandi Saat Ini',
      new_pass: 'Kata Sandi Baru',
      conf_pass: 'Konfirmasi Kata Sandi Baru',
      notif_title: 'Preferensi Notifikasi',
      notif_desc: 'Pilih bagaimana Anda menerima info materi dan notifikasi sistem',
      privacy_title: 'Privasi & Pembagian Data',
      privacy_desc: 'Kelola keterlihatan progres belajar Anda oleh pihak Biro Perjalanan',
      danger_title: 'Zona Bahaya',
      danger_desc: 'Tindakan yang tidak dapat dibatalkan pada akun Anda',
      delete_acc: 'Hapus Akun Permanen'
    },
    ar: {
      sub_desc: 'إدارة ترجمة اللغة والأمان والتهيئة المفضلة لديك',
      preferred_lang: 'اللغة المفضلة',
      toggle_desc: 'تغيير ترجمة واجهة لغة المستخدم',
      security_title: 'الأمان وكلمة المرور',
      security_desc: 'تحديث بيانات اعتماد كلمة مرور تسجيل الدخول الخاصة بك',
      curr_pass: 'كلمة المرور الحالية',
      new_pass: 'كلمة المرور الجديدة',
      conf_pass: 'تأكيد كلمة المرور الجديدة',
      notif_title: 'تفضيلات الإشعارات',
      notif_desc: 'اختر كيفية تلقي الرسائل والتنبيهات',
      privacy_title: 'الخصوصية والمشاركة',
      privacy_desc: 'إدارة إمكانية رؤية التقدم لوكالة السفر الخاصة بك (البيرو)',
      danger_title: 'منطقة الخطر',
      danger_desc: 'عمليات الحساب التي لا يمكن التراجع عنها',
      delete_acc: 'حذف الحساب نهائياً'
    }
  };

  const sd = localD[lang] || localD.en;

  useEffect(() => {
    const savedLang = localStorage.getItem('bahrain_lang') || 'en';
    setLang(savedLang);
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      triggerToast('Mohon lengkapi semua kolom kata sandi.');
      return;
    }
    if (newPassword !== confirmPassword) {
      triggerToast('Kata sandi baru dan konfirmasi tidak cocok.');
      return;
    }
    
    // Simulate successful password update
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    triggerToast('Kata sandi berhasil diperbarui!');
  };

  const handleDeleteAccount = () => {
    if (confirm('Apakah Anda yakin ingin menghapus akun Anda secara permanen? Semua progres belajar, voucher, dan sertifikat akan hilang.')) {
      triggerToast('Akun Anda sedang diproses untuk dihapus...');
      setTimeout(() => {
        document.cookie = "bahrain_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
        router.push('/login');
      }, 2000);
    }
  };

  return (
    <div className="p-8 w-full space-y-8 py-12 bg-slate-50 min-h-screen">
      {/* Toast Alert */}
      {showToast && (
        <div className="fixed bottom-5 right-5 z-55 flex items-center gap-2 px-4 py-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg shadow-lg text-xs font-bold transition-all">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 animate-bounce" />
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <span className="px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-widest bg-blue-100 text-blue-800 rounded-full">
          Konfigurasi
        </span>
        <h1 className="text-2xl font-extrabold text-slate-900 mt-2">{d.settings}</h1>
        <p className="text-xs text-slate-400 mt-1">{sd.sub_desc}</p>
      </div>

      <div className="space-y-6">
        
        {/* Section 1: Language */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden p-6 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <Globe className="w-5 h-5 text-blue-700" />
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wide">{sd.preferred_lang}</h3>
              <p className="text-[11px] text-slate-400 font-medium">{sd.toggle_desc}</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs font-semibold text-slate-600">Pilih Kamus Antarmuka</span>
            <select 
              value={lang} 
              onChange={(e) => {
                localStorage.setItem('bahrain_lang', e.target.value);
                setLang(e.target.value);
                window.location.reload();
              }}
              className="border border-slate-200 rounded-lg px-4 py-1.5 bg-white text-xs font-bold focus:ring-0 focus:outline-none cursor-pointer"
            >
              <option value="en">English</option>
              <option value="id">Bahasa Indonesia</option>
              <option value="ar">العربية</option>
            </select>
          </div>
        </div>

        {/* Section 2: Security */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden p-6 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <Lock className="w-5 h-5 text-blue-700" />
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wide">{sd.security_title}</h3>
              <p className="text-[11px] text-slate-400 font-medium">{sd.security_desc}</p>
            </div>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5 relative">
                <label className="text-[10px] font-extrabold uppercase text-slate-400 block">{sd.curr_pass}</label>
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-bold focus:ring-1 focus:ring-blue-650 focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase text-slate-400 block">{sd.new_pass}</label>
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-bold focus:ring-1 focus:ring-blue-650 focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase text-slate-400 block">{sd.conf_pass}</label>
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-bold focus:ring-1 focus:ring-blue-650 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-xs font-extrabold text-slate-500 hover:text-slate-700 flex items-center gap-1.5"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <span>{showPassword ? 'Sembunyikan Sandi' : 'Tampilkan Sandi'}</span>
              </button>

              <button
                type="submit"
                className="bg-[#1e40af] hover:bg-blue-800 text-white text-xs font-extrabold px-6 py-2 rounded-lg shadow-sm transition-all"
              >
                Perbarui Kata Sandi
              </button>
            </div>
          </form>
        </div>

        {/* Section 3: Notification Toggles */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden p-6 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <Bell className="w-5 h-5 text-blue-700" />
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wide">{sd.notif_title}</h3>
              <p className="text-[11px] text-slate-400 font-medium">{sd.notif_desc}</p>
            </div>
          </div>

          <div className="divide-y divide-slate-100 text-xs font-semibold">
            <div className="flex justify-between items-center py-3">
              <div>
                <span className="text-slate-800 block">Notifikasi Email</span>
                <span className="text-[10px] text-slate-400 block font-medium">Kirim pembaruan dan rilis materi bimbingan lewat email</span>
              </div>
              <input 
                type="checkbox" 
                checked={notifEmail} 
                onChange={(e) => setNotifEmail(e.target.checked)} 
                className="w-4.5 h-4.5 rounded border-slate-300 text-blue-600 focus:ring-0 cursor-pointer"
              />
            </div>

            <div className="flex justify-between items-center py-3">
              <div>
                <span className="text-slate-800 block">Notifikasi Dalam Aplikasi (In-App)</span>
                <span className="text-[10px] text-slate-400 block font-medium">Tampilkan lencana merah di dashboard untuk info notifikasi baru</span>
              </div>
              <input 
                type="checkbox" 
                checked={notifInApp} 
                onChange={(e) => setNotifInApp(e.target.checked)} 
                className="w-4.5 h-4.5 rounded border-slate-300 text-blue-600 focus:ring-0 cursor-pointer"
              />
            </div>

            <div className="flex justify-between items-center py-3">
              <div>
                <span className="text-slate-800 block">Notifikasi WhatsApp</span>
                <span className="text-[10px] text-slate-400 block font-medium">Kirim konfirmasi jadwal keberangkatan manasik ke nomor WA aktif</span>
              </div>
              <input 
                type="checkbox" 
                checked={notifWA} 
                onChange={(e) => setNotifWA(e.target.checked)} 
                className="w-4.5 h-4.5 rounded border-slate-300 text-blue-600 focus:ring-0 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Privacy */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden p-6 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <Eye className="w-5 h-5 text-blue-700" />
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wide">{sd.privacy_title}</h3>
              <p className="text-[11px] text-slate-400 font-medium">{sd.privacy_desc}</p>
            </div>
          </div>

          <div className="divide-y divide-slate-100 text-xs font-semibold">
            <div className="flex justify-between items-center py-3">
              <div>
                <span className="text-slate-800 block">Bagikan Progres Belajar</span>
                <span className="text-[10px] text-slate-400 block font-medium">Izinkan Biro Perjalanan memantau modul haji/umrah yang sudah Anda selesaikan</span>
              </div>
              <input 
                type="checkbox" 
                checked={shareProgress} 
                onChange={(e) => setShareProgress(e.target.checked)} 
                className="w-4.5 h-4.5 rounded border-slate-300 text-blue-600 focus:ring-0 cursor-pointer"
              />
            </div>

            <div className="flex justify-between items-center py-3">
              <div>
                <span className="text-slate-800 block">Terima Buletin Edukasi</span>
                <span className="text-[10px] text-slate-400 block font-medium">Langganan artikel tips & trik kesehatan sebelum berangkat umrah/haji</span>
              </div>
              <input 
                type="checkbox" 
                checked={receiveNews} 
                onChange={(e) => setReceiveNews(e.target.checked)} 
                className="w-4.5 h-4.5 rounded border-slate-300 text-blue-600 focus:ring-0 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Section 5: Danger Zone */}
        <div className="bg-red-50/20 border border-red-200 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-red-100">
            <ShieldAlert className="w-5 h-5 text-red-650" />
            <div>
              <h3 className="font-extrabold text-sm text-red-950 uppercase tracking-wide">{sd.danger_title}</h3>
              <p className="text-[11px] text-red-700 font-medium">{sd.danger_desc}</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            <div className="text-xs">
              <span className="text-slate-850 font-bold block">{sd.delete_acc}</span>
              <span className="text-slate-500 block font-medium mt-0.5">Penghapusan akun bersifat permanen dan tidak dapat dipulihkan.</span>
            </div>
            <button
              onClick={handleDeleteAccount}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-extrabold shadow-sm transition-all"
            >
              <UserX className="w-4 h-4" />
              <span>{sd.delete_acc}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
