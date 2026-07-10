'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ApiClient } from '@bahrain/api-client';
import { en, id, ar } from '@bahrain/localization';
import { ArrowLeft, CreditCard, ShieldCheck } from 'lucide-react';

const client = new ApiClient({ baseUrl: '/api/v1' });

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const packageId = (searchParams.get('packageId') || 'hajj').toLowerCase();
  
  const [lang, setLang] = useState('en');
  const [paymentMethod, setPaymentMethod] = useState<'qris' | 'va'>('qris');
  const [step, setStep] = useState<'checkout' | 'processing' | 'success'>('checkout');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const savedLang = localStorage.getItem('bahrain_lang') || 'en';
    setLang(savedLang);
  }, []);

  // Multi-language translation support
  const localD: Record<string, Record<string, string>> = {
    en: {
      checkout: 'Checkout Payment',
      back: 'Back to Subscription',
      order_summary: 'Invoice Details',
      hajj_title: 'Hajj Premium Path',
      umrah_title: 'Umrah Premium Path',
      base_price: 'Base Price',
      ppn: 'VAT (PPN 11%)',
      total_pay: 'Total Amount',
      choose_method: 'Choose Payment Method',
      pay_now: 'Pay Securely Now',
      qris_desc: 'Scan QR code using ShopeePay, GoPay, OVO, or LinkAja',
      va_desc: 'Transfer exactly the total amount to BCA Virtual Account below',
      processing: 'Processing Secure Payment...',
      success_title: 'Payment Successful!',
      success_desc: 'Your premium training path is now active. Happy learning!',
      start: 'Go to My Learning',
      purchase_failed: 'Purchase failed.',
      conn_failed: 'Failed to connect to the payment gateway.'
    },
    id: {
      checkout: 'Checkout Pembayaran',
      back: 'Kembali ke Langganan',
      order_summary: 'Rincian Tagihan',
      hajj_title: 'Paket Haji Premium',
      umrah_title: 'Paket Umrah Premium',
      base_price: 'Harga Dasar',
      ppn: 'PPN (11%)',
      total_pay: 'Total Pembayaran',
      choose_method: 'Pilih Metode Pembayaran',
      pay_now: 'Bayar Sekarang',
      qris_desc: 'Pindai kode QR menggunakan ShopeePay, GoPay, OVO, atau LinkAja',
      va_desc: 'Transfer tepat sesuai jumlah tagihan ke BCA Virtual Account di bawah ini',
      processing: 'Memproses Pembayaran Aman...',
      success_title: 'Pembayaran Berhasil!',
      success_desc: 'Akses paket premium Anda telah aktif. Selamat belajar!',
      start: 'Mulai Belajar Sekarang',
      purchase_failed: 'Pembelian paket premium gagal.',
      conn_failed: 'Gagal terhubung dengan gerbang pembayaran.'
    },
    ar: {
      checkout: 'الدفع والخروج',
      back: 'العودة إلى الاشتراك',
      order_summary: 'تفاصيل الفاتورة',
      hajj_title: 'مسار الحج المميز',
      umrah_title: 'مسار العمرة المميز',
      base_price: 'السعر الأساسي',
      ppn: 'ضريبة القيمة المضافة (11%)',
      total_pay: 'إجمالي الدفع',
      choose_method: 'اختر طريقة الدفع',
      pay_now: 'ادفع الآن بأمان',
      qris_desc: 'امسح رمز الاستجابة السريعة باستخدام المحافظ الإلكترونية',
      va_desc: 'قم بالتحويل عبر الحساب الافتراضي لبنك BCA المبين أدناه للتفعيل',
      processing: 'جاري معالجة الدفع الآمن...',
      success_title: 'تم الدفع بنجاح!',
      success_desc: 'تم تفعيل وصول باقة التدريب المميزة بنجاح. نتمنى لك تعليماً موفقاً!',
      start: 'ابدأ التعلم الآن',
      purchase_failed: 'فشل شراء الباقة المميزة.',
      conn_failed: 'فشل الاتصال ببوابة الدفع الإلكترونية.'
    }
  };

  const sd = localD[lang] || localD.en;
  const isRtl = lang === 'ar';

  const getTranslatedError = (msg: string) => {
    if (!msg) return sd.purchase_failed;
    const lower = msg.toLowerCase();
    if (lower.includes('purchase failed') || lower.includes('fail')) {
      return sd.purchase_failed;
    }
    return msg;
  };

  const handlePaymentSubmit = () => {
    setStep('processing');
    setErrorMessage(null);
    
    // Simulate gateway response and DB persistence write after 1.5s
    setTimeout(() => {
      client.buyPackage(packageId).then((res) => {
        if (res.success) {
          setStep('success');
        } else {
          setStep('checkout');
          setErrorMessage(getTranslatedError(res.message));
        }
      }).catch(() => {
        setStep('checkout');
        setErrorMessage(sd.conn_failed);
      });
    }, 1500);
  };

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="p-8 w-full space-y-6 py-12">
      {/* Back button */}
      {step !== 'processing' && (
        <button
          onClick={() => router.push('/dashboard/subscription')}
          className="inline-flex items-center gap-2 text-xs text-slate-500 hover:text-slate-900 transition-colors font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          {sd.back}
        </button>
      )}

      <div className="grid md:grid-cols-3 gap-8 pt-2">
        {/* Left section: Invoice summary & details */}
        <div className="md:col-span-1 space-y-6">
          <div className="border border-slate-200 rounded-lg p-5 bg-white shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">{sd.order_summary}</h3>
            
            <div className="space-y-3 pt-2 text-xs">
              <div className="font-bold text-slate-800 text-sm">
                {packageId === 'hajj' ? sd.hajj_title : sd.umrah_title}
              </div>
              
              <div className="flex justify-between text-slate-500 pt-2 border-t border-slate-100">
                <span>{sd.base_price}</span>
                <span>Rp 100.000</span>
              </div>
              
              <div className="flex justify-between text-slate-500">
                <span>{sd.ppn}</span>
                <span>Rp 11.000</span>
              </div>
              
              <div className="flex justify-between text-base font-extrabold text-[#1e40af] pt-2 border-t border-slate-100">
                <span>{sd.total_pay}</span>
                <span>Rp 111.000</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold justify-center bg-slate-50 py-2.5 rounded-lg border border-slate-200/60">
            <ShieldCheck className="w-4.5 h-4.5 text-blue-600" />
            SECURE CHECKOUT SSL 256-BIT
          </div>
        </div>

        {/* Right section: Payment Gateway panel */}
        <div className="md:col-span-2 border border-slate-200 rounded-lg p-6 bg-white shadow-sm min-h-[350px] flex flex-col justify-between">
          {step === 'checkout' && (
            <div className="space-y-6 flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                {errorMessage && (
                  <div className="bg-rose-50 text-rose-700 border border-rose-100 p-3.5 rounded-lg text-xs font-semibold flex items-center justify-between shadow-sm animate-fade-in">
                    <span>{errorMessage}</span>
                    <button 
                      onClick={() => setErrorMessage(null)} 
                      className="text-rose-400 hover:text-rose-600 font-bold ml-2 text-sm"
                    >
                      ✕
                    </button>
                  </div>
                )}
                <h3 className="font-bold text-sm text-slate-900">{sd.choose_method}</h3>
                
                {/* Method selector buttons */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setPaymentMethod('qris')}
                    className={`flex flex-col items-center justify-center p-4 border rounded-lg transition-all ${
                      paymentMethod === 'qris'
                        ? 'border-[#1e40af] bg-blue-50/20 text-slate-800 ring-1 ring-[#1e40af]'
                        : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    <span className="font-extrabold text-sm tracking-tight text-[#1e40af]">QRIS</span>
                    <span className="text-[9px] text-slate-400 mt-1">E-Wallet Instant</span>
                  </button>
                  
                  <button
                    onClick={() => setPaymentMethod('va')}
                    className={`flex flex-col items-center justify-center p-4 border rounded-lg transition-all ${
                      paymentMethod === 'va'
                        ? 'border-[#1e40af] bg-blue-50/20 text-slate-800 ring-1 ring-[#1e40af]'
                        : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    <span className="font-extrabold text-sm tracking-tight text-[#1e40af]">BCA VIRTUAL A/C</span>
                    <span className="text-[9px] text-slate-400 mt-1">Bank Transfer</span>
                  </button>
                </div>

                {/* Details layout */}
                {paymentMethod === 'qris' ? (
                  <div className="flex flex-col items-center justify-center border border-dashed border-slate-200 p-6 rounded-lg bg-slate-50/40">
                    <div className="w-36 h-36 bg-white border border-slate-200 rounded p-2 flex flex-col justify-between shadow-inner">
                      {/* Visual QR Code layout */}
                      <div className="flex-1 bg-[radial-gradient(#1e293b_2.5px,transparent_2.5px)] [background-size:7px_7px]"></div>
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold mt-3 leading-relaxed text-center">
                      {sd.qris_desc}
                    </span>
                  </div>
                ) : (
                  <div className="border border-slate-250 p-5 rounded-lg bg-slate-50/50 space-y-3 text-xs">
                    <div className="flex justify-between items-center font-bold text-slate-700">
                      <span>BCA Virtual Account</span>
                      <span className="text-[#1e40af] text-sm font-extrabold tracking-wider">8001 2398 4719 2837</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                      {sd.va_desc}
                    </p>
                  </div>
                )}
              </div>

              <button
                onClick={handlePaymentSubmit}
                className="w-full bg-[#1e40af] hover:bg-blue-800 text-white text-xs font-bold py-3.5 rounded transition-all shadow-sm flex items-center justify-center gap-2 mt-6"
              >
                <CreditCard className="w-4.5 h-4.5" />
                {sd.pay_now}
              </button>
            </div>
          )}

          {step === 'processing' && (
            <div className="flex-1 flex flex-col items-center justify-center py-16 space-y-4">
              <svg className="animate-spin h-10 w-10 text-[#1e40af]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-xs font-bold text-slate-600 animate-pulse">{sd.processing}</p>
            </div>
          )}

          {step === 'success' && (
            <div className="flex-1 flex flex-col items-center justify-center py-8 text-center space-y-5">
              <div className="w-16 h-16 rounded-full bg-blue-50 border border-emerald-250 flex items-center justify-center text-blue-600 text-3xl font-extrabold animate-bounce shadow-sm">
                ✓
              </div>
              <h4 className="font-extrabold text-lg text-slate-900">{sd.success_title}</h4>
              <p className="text-xs text-slate-550 max-w-xs font-medium leading-relaxed">
                {sd.success_desc}
              </p>
              <button
                onClick={() => {
                  router.push('/dashboard/my-learning');
                }}
                className="w-full bg-[#1e40af] text-white text-xs font-bold py-3.5 rounded hover:bg-blue-800 transition-all shadow-sm max-w-xs mt-2"
              >
                {sd.start}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs font-bold text-slate-400">Loading Checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
