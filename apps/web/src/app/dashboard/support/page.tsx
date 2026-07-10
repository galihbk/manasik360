'use client';

import React, { useState, useEffect } from 'react';
import { en, id, ar } from '@bahrain/localization';

export default function SupportPage() {
  const [lang, setLang] = useState('en');

  // Translation helpers
  const tMap: Record<string, any> = { en, id, ar };
  const t = tMap[lang] || en;
  const d = t.dashboard || {
    main: lang === 'id' ? 'UTAMA' : lang === 'ar' ? 'الرئيسية' : 'MAIN',
    communication: lang === 'id' ? 'KOMUNIKASI' : lang === 'ar' ? 'الاتصالات' : 'COMMUNICATION',
    account: lang === 'id' ? 'AKUN' : lang === 'ar' ? 'الحساب' : 'ACCOUNT',
    home: lang === 'id' ? 'Beranda' : lang === 'ar' ? 'الرئيسية' : 'Home',
    my_learning: lang === 'id' ? 'Pembelajaran Saya' : lang === 'ar' ? 'تعليمي' : 'My Learning',
    certificates: lang === 'id' ? 'Sertifikat' : lang === 'ar' ? 'الشهادات' : 'Certificates',
    subscription: lang === 'id' ? 'Langganan' : lang === 'ar' ? 'الاشتراك' : 'Subscription',
    notifications: lang === 'id' ? 'Notifikasi' : lang === 'ar' ? 'الإشعارات' : 'Notifications',
    support: lang === 'id' ? 'Dukungan' : lang === 'ar' ? 'الدعم' : 'Support',
    profile: lang === 'id' ? 'Profil' : lang === 'ar' ? 'الملف الشخصي' : 'Profile',
    settings: lang === 'id' ? 'Pengaturan' : lang === 'ar' ? 'الإعدادات' : 'Settings',
    sign_out: lang === 'id' ? 'Keluar' : lang === 'ar' ? 'تسجيل الخروج' : 'Sign Out',
    welcome: 'Assalamualaikum',
    home_sub: lang === 'id' ? 'Selamat datang kembali. Lanjutkan perjalanan belajar Anda di bawah.' : lang === 'ar' ? 'مرحباً بك مجدداً. تابع مسيرتك التعليمية أدناه.' : 'Welcome back. Continue your learning journey below.',
    continue_learning: lang === 'id' ? 'Lanjutkan Belajar' : lang === 'ar' ? 'مواصلة التعلم' : 'Continue Learning',
    resume_activity: lang === 'id' ? 'Lanjutkan Aktivitas' : lang === 'ar' ? 'استئناف النشاط' : 'Resume Activity',
    reminder: lang === 'id' ? 'Pengingat Hari Ini' : lang === 'ar' ? 'تذكير اليوم' : "Today's Reminder",
    reminder_desc: lang === 'id' ? 'Konsultasikan dengan dokter Anda mengenai vaksinasi perjalanan Haji. Persiapkan latihan kardio harian.' : lang === 'ar' ? 'استشر طبيبك بخصوص تطعيمات السفر للحج. استعد بالتمارين اليومية.' : 'Consult with your physician regarding Hajj travel vaccinations. Prepare daily cardio exercises.',
    progress: lang === 'id' ? 'Progres Kelas' : lang === 'ar' ? 'تقدم الدورة' : 'Course Progress',
    recent_activity: lang === 'id' ? 'Aktivitas Terbaru' : lang === 'ar' ? 'النشاط الأخير' : 'Recent Activity',
    recommended_course: lang === 'id' ? 'Rekomendasi Kelas' : lang === 'ar' ? 'الدورة Mوصى بها' : 'Recommended Course',
    cert_status: lang === 'id' ? 'Status Sertifikat' : lang === 'ar' ? 'حالة الشهادات' : 'Certificates Status',
    completed: lang === 'id' ? 'Selesai' : lang === 'ar' ? 'مكتمل' : 'Completed',
    in_progress: lang === 'id' ? 'Sedang Berjalan' : lang === 'ar' ? 'في العمل' : 'In Progress',
    locked: lang === 'id' ? 'Terkunci' : lang === 'ar' ? 'مغلق' : 'Locked',
    duration: lang === 'id' ? 'Durasi' : lang === 'ar' ? 'المدة' : 'Duration',
    lessons: lang === 'id' ? 'Pelajaran' : lang === 'ar' ? 'دروس' : 'Lessons'
  };

  useEffect(() => {
    const savedLang = localStorage.getItem('bahrain_lang') || 'en';
    setLang(savedLang);
  }, []);

  return (
    <div className="p-8 w-full space-y-6 py-12">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{d.support}</h2>
        <p className="text-sm text-slate-400 mt-0.5 font-medium font-serif">Troubleshooting resources and Help Desk</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          {[
            { q: "How do I run virtual tours?", a: "Simply open any lesson that includes a 3DVista Virtual Tour, and click the launch button. It will load inside a responsive frame." }
          ].map((item, idx) => (
            <div key={idx} className="border border-slate-200 rounded-lg p-5">
              <h5 className="font-bold text-sm text-slate-900 mb-2">{item.q}</h5>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">{item.a}</p>
            </div>
          ))}
        </div>

        <div className="border border-slate-200 rounded-lg p-6 bg-slate-50/50 flex flex-col justify-between">
          <div>
            <h4 className="font-bold text-xs text-slate-955 uppercase tracking-wide mb-2">Live Support</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-4 font-medium">Have an inquiry regarding ritual sequences or technical configurations?</p>
          </div>
          <button className="w-full bg-[#1e40af] text-white text-sm font-bold py-2.5 rounded hover:bg-blue-800 transition-all">
            Open Ticket
          </button>
        </div>
      </div>
    </div>
  );
}
