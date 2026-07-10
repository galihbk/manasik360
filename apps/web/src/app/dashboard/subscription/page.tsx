'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { ApiClient } from '@bahrain/api-client';
import { en, id, ar } from '@bahrain/localization';

const client = new ApiClient({ baseUrl: '/api/v1' });

export default function SubscriptionPage() {
  const router = useRouter();
  const [lang, setLang] = useState('en');
  const [tenantName, setTenantName] = useState('Personal Workspace');
  const [voucherCodeInput, setVoucherCodeInput] = useState('');
  const [voucherMessage, setVoucherMessage] = useState('');
  const [planActive, setPlanActive] = useState(false);
  const [mounted, setMounted] = useState(false);

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
    recommended_course: lang === 'id' ? 'Rekomendasi Kelas' : lang === 'ar' ? 'الدورة الموصى بها' : 'Recommended Course',
    cert_status: lang === 'id' ? 'Status Sertifikat' : lang === 'ar' ? 'حالة الشهادات' : 'Certificates Status',
    completed: lang === 'id' ? 'Selesai' : lang === 'ar' ? 'مكتمل' : 'Completed',
    in_progress: lang === 'id' ? 'Sedang Berjalan' : lang === 'ar' ? 'في العمل' : 'In Progress',
    locked: lang === 'id' ? 'Terkunci' : lang === 'ar' ? 'مغلق' : 'Locked',
    duration: lang === 'id' ? 'Durasi' : lang === 'ar' ? 'المدة' : 'Duration',
    lessons: lang === 'id' ? 'Pelajaran' : lang === 'ar' ? 'دروس' : 'Lessons'
  };

  const [activePackages, setActivePackages] = useState<string[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);
  const [paymentStep, setPaymentStep] = useState<'checkout' | 'processing' | 'success'>('checkout');
  const [paymentMethod, setPaymentMethod] = useState<'qris' | 'va'>('qris');

  // Local translations for subscription page
  const localD: Record<string, Record<string, string>> = {
    en: {
      sub_desc: 'Manage premium paths and access vouchers',
      hajj_title: 'Hajj Premium Path',
      hajj_desc: 'Unlock full sequence paths, physical readiness protocols, video lessons, and interactive 3D virtual dome tours of Masjidil Haram.',
      umrah_title: 'Umrah Premium Path',
      umrah_desc: 'Access step-by-step guides for the Umrah rites, including virtual tours of Miqat locations and step-by-step rituals.',
      buy_hajj: 'Buy Hajj Package',
      buy_umrah: 'Buy Umrah Package',
      purchased: '✓ PURCHASED',
      active: 'ACTIVE',
      inactive: 'INACTIVE',
      activate_voucher: 'Activate Voucher',
      voucher_desc: 'Have an access voucher code? Enter it below to unlock your assigned workspaces or premium paths instantly.',
      voucher_placeholder: 'ENTER VOUCHER CODE',
      redeem_btn: 'Redeem Voucher',
      per_year: ' / year',
      checkout_title: 'Order Details',
      order_summary: 'Invoice Details',
      base_price: 'Base Price',
      ppn: 'VAT (PPN 11%)',
      total_pay: 'Total Price',
      pay_now: 'Proceed to Checkout'
    },
    id: {
      sub_desc: 'Kelola paket premium dan voucher akses Anda',
      hajj_title: 'Paket Haji Premium',
      hajj_desc: 'Buka seluruh alur bimbingan Haji, protokol kesiapan fisik, video pelajaran, dan tur kubah virtual 3D interaktif di Masjidil Haram.',
      umrah_title: 'Paket Umrah Premium',
      umrah_desc: 'Akses panduan langkah-demi-langkah ibadah Umrah, termasuk tur virtual lokasi Miqat dan tata cara manasik lengkap.',
      buy_hajj: 'Beli Paket Haji',
      buy_umrah: 'Beli Paket Umrah',
      purchased: '✓ SUDAH AKTIF',
      active: 'AKTIF',
      inactive: 'TIDAK AKTIF',
      activate_voucher: 'Aktivasi Voucher',
      voucher_desc: 'Punya kode voucher akses? Masukkan di bawah untuk membuka paket pelatihan atau ruang kerja Anda secara instan.',
      voucher_placeholder: 'MASUKKAN KODE VOUCHER',
      redeem_btn: 'Aktifkan Voucher',
      per_year: ' / tahun',
      checkout_title: 'Rincian Pesanan',
      order_summary: 'Rincian Tagihan',
      base_price: 'Harga Dasar',
      ppn: 'PPN (11%)',
      total_pay: 'Total Harga',
      pay_now: 'Lanjut ke Pembayaran'
    },
    ar: {
      sub_desc: 'إدارة المسارات المميزة وقسائم الوصول الخاصة بك',
      hajj_title: 'مسار الحج المميز',
      hajj_desc: 'افتح مسارات التدريب الكاملة، وبروتوكولات الجاهزية البدنية، ودروس الفيديو، والجولات الافتراضية ثلاثية الأبعاد في المسجد الحرام.',
      umrah_title: 'مسار العمرة المميز',
      umrah_desc: 'الوصول إلى أدلة خطوة بخطوة لمناسك العمرة، بما في ذلك الجولات الافتراضية لمواقع الميقات والدروس التعليمية.',
      buy_hajj: 'شراء باقة الحج',
      buy_umrah: 'شراء باقة العمرة',
      purchased: '✓ تم الشراء (نشط)',
      active: 'نشط',
      inactive: 'غير نشط',
      activate_voucher: 'تفعيل القسيمة',
      voucher_desc: 'هل لديك رمز قسيمة؟ أدخله أدناه لفتح باقات التدريب أو مساحات العمل الخاصة بك على الفور.',
      voucher_placeholder: 'أدخل رمز القسيمة',
      redeem_btn: 'تفعيل القسيمة',
      per_year: ' / سنوياً',
      checkout_title: 'تفاصيل الطلب',
      order_summary: 'تفاصيل الفاتورة',
      base_price: 'السعر الأساسي',
      ppn: 'ضريبة القيمة المضافة (11%)',
      total_pay: 'السعر الإجمالي',
      pay_now: 'الذهاب إلى الدفع'
    }
  };

  const sd = localD[lang] || localD.en;

  useEffect(() => {
    setMounted(true);
    const savedLang = localStorage.getItem('bahrain_lang') || 'en';
    setLang(savedLang);

    // Retrieve subscription state from database
    client.getSubscription()
      .then((data) => {
        if (data) {
          setPlanActive(data.active);
          if (data.tenantName) setTenantName(data.tenantName);
          if (data.activePackages) setActivePackages(data.activePackages);
        }
      })
      .catch(() => {
        setPlanActive(false);
      });
  }, []);

  const handleRedeemVoucher = () => {
    client.redeemVoucher(voucherCodeInput).then((res) => {
      setVoucherMessage(res.message);
      if (res.success) {
        setPlanActive(true);
        // Reload page to refresh sidebar
        setTimeout(() => window.location.reload(), 1500);
      }
    }).catch(() => {
      setVoucherMessage('Voucher code not found.');
    });
  };

  const handleBuyPackage = (packageId: string) => {
    setSelectedPackageId(packageId);
    setPaymentStep('checkout');
    setShowPaymentModal(true);
  };

  const processSimulatedPayment = () => {
    if (!selectedPackageId) return;
    setPaymentStep('processing');

    setTimeout(() => {
      client.buyPackage(selectedPackageId).then((res) => {
        if (res.success) {
          setPaymentStep('success');
          // Fetch updated subscription from the database
          client.getSubscription()
            .then((data) => {
              if (data) {
                setPlanActive(data.active);
                if (data.tenantName) setTenantName(data.tenantName);
                if (data.activePackages) setActivePackages(data.activePackages);
              }
            })
            .catch(() => {});
        } else {
          alert(res.message || 'Pembayaran gagal.');
          setPaymentStep('checkout');
        }
      }).catch(() => {
        alert('Gagal menyambung ke database untuk memproses pembayaran.');
        setPaymentStep('checkout');
      });
    }, 1500);
  };

  return (
    <div className="p-8 w-full space-y-8 py-12">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{d.subscription}</h2>
        <p className="text-sm text-slate-400 mt-0.5 font-medium">{sd.sub_desc}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Hajj Package */}
        <div className="border border-slate-200 rounded-lg p-6 bg-white shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <h4 className="font-bold text-base text-slate-900">{sd.hajj_title}</h4>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                activePackages.includes('hajj')
                  ? 'bg-blue-50 text-emerald-800'
                  : 'bg-slate-100 text-slate-500'
              }`}>
                {activePackages.includes('hajj') ? sd.active : sd.inactive}
              </span>
            </div>
            <div className="text-2xl font-extrabold text-[#1e40af]">
              Rp 100.000<span className="text-xs text-slate-400 font-medium">{sd.per_year}</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              {sd.hajj_desc}
            </p>
          </div>
          <button
            onClick={() => handleBuyPackage('hajj')}
            disabled={activePackages.includes('hajj')}
            className={`w-full py-2.5 rounded text-xs font-bold transition-all ${
              activePackages.includes('hajj')
                ? 'bg-slate-50 text-slate-400 cursor-not-allowed border border-slate-200'
                : 'bg-[#1e40af] text-white hover:bg-blue-800 shadow-sm'
            }`}
          >
            {activePackages.includes('hajj') ? sd.purchased : sd.buy_hajj}
          </button>
        </div>

        {/* Umrah Package */}
        <div className="border border-slate-200 rounded-lg p-6 bg-white shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <h4 className="font-bold text-base text-slate-900">{sd.umrah_title}</h4>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                activePackages.includes('umrah')
                  ? 'bg-blue-50 text-emerald-800'
                  : 'bg-slate-100 text-slate-500'
              }`}>
                {activePackages.includes('umrah') ? sd.active : sd.inactive}
              </span>
            </div>
            <div className="text-2xl font-extrabold text-[#1e40af]">
              Rp 100.000<span className="text-xs text-slate-400 font-medium">{sd.per_year}</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              {sd.umrah_desc}
            </p>
          </div>
          <button
            onClick={() => handleBuyPackage('umrah')}
            disabled={activePackages.includes('umrah')}
            className={`w-full py-2.5 rounded text-xs font-bold transition-all ${
              activePackages.includes('umrah')
                ? 'bg-slate-50 text-slate-400 cursor-not-allowed border border-slate-200'
                : 'bg-[#1e40af] text-white hover:bg-blue-800 shadow-sm'
            }`}
          >
            {activePackages.includes('umrah') ? sd.purchased : sd.buy_umrah}
          </button>
        </div>

        {/* Voucher Redemption */}
        <div className="border border-slate-200 rounded-lg p-6 bg-slate-50/50 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <h4 className="font-bold text-xs text-slate-955 uppercase tracking-wide">{sd.activate_voucher}</h4>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              {sd.voucher_desc}
            </p>
            <input 
              type="text" 
              placeholder={sd.voucher_placeholder}
              value={voucherCodeInput}
              onChange={(e) => setVoucherCodeInput(e.target.value)}
              className="w-full px-4 py-2 bg-white border border-slate-200 rounded text-sm uppercase focus:ring-0 focus:outline-none"
            />
            {voucherMessage && (
              <p className="text-xs font-semibold text-blue-700 mt-2">{voucherMessage}</p>
            )}
          </div>
          <button 
            onClick={handleRedeemVoucher}
            className="w-full bg-[#1e40af] text-white text-sm font-bold py-2.5 rounded hover:bg-blue-800 transition-all"
          >
            {sd.redeem_btn}
          </button>
        </div>
      </div>

      {/* Payment Gateway Dialog Modal */}
      {mounted && showPaymentModal && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-lg border border-slate-200 shadow-xl max-w-md w-full overflow-hidden flex flex-col justify-between transition-all">
            {/* Modal Header */}
            <div className="h-14 border-b border-slate-100 px-6 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-bold text-sm text-slate-800 tracking-tight text-slate-900">
                {paymentStep === 'success' ? sd.pay_success : sd.checkout_title}
              </h3>
              {paymentStep !== 'processing' && (
                <button 
                  onClick={() => setShowPaymentModal(false)}
                  className="text-slate-400 hover:text-slate-700 text-xs font-bold"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 text-left">
              {/* Order summary */}
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-150 space-y-3">
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">{sd.order_summary}</p>
                
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>{selectedPackageId === 'hajj' ? sd.hajj_title : sd.umrah_title}</span>
                  <span>Rp 100.000</span>
                </div>
                
                <div className="flex justify-between text-xs text-slate-500 pt-2 border-t border-slate-200/50">
                  <span>{sd.base_price}</span>
                  <span>Rp 100.000</span>
                </div>
                
                <div className="flex justify-between text-xs text-slate-500">
                  <span>{sd.ppn}</span>
                  <span>Rp 11.000</span>
                </div>
                
                <div className="flex justify-between text-sm font-extrabold text-[#1e40af] pt-2 border-t border-slate-200/50">
                  <span>{sd.total_pay}</span>
                  <span>Rp 111.000</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  router.push(`/dashboard/subscription/checkout?packageId=${selectedPackageId}`);
                }}
                className="w-full bg-[#1e40af] hover:bg-blue-800 text-white text-xs font-bold py-3 rounded transition-all shadow-sm flex items-center justify-center gap-2"
              >
                {sd.pay_now}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
