'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ApiClient } from '@bahrain/api-client';
import { en, id, ar } from '@bahrain/localization';
import { ArrowLeft, CreditCard, ShieldCheck, Ticket, CheckCircle2, RefreshCw } from 'lucide-react';

const client = new ApiClient({ baseUrl: '/api/v1' });

function VouchersCheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const voucherId = searchParams.get('voucherId');

  const [packageType, setPackageType] = useState('hajj');
  const [maxUses, setMaxUses] = useState(10);
  const [description, setDescription] = useState('');

  const [lang, setLang] = useState('id');
  const [paymentMethod, setPaymentMethod] = useState<'qris' | 'va'>('qris');
  const [step, setStep] = useState<'checkout' | 'processing' | 'success'>('checkout');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [prices, setPrices] = useState<{ hajj: number; umroh: number }>({ hajj: 100000, umroh: 100000 });

  useEffect(() => {
    const savedLang = localStorage.getItem('bahrain_lang') || 'id';
    setLang(savedLang);

    client.getVoucherPrices()
      .then((data) => {
        if (data && !data.error) {
          setPrices(data);
        }
      })
      .catch(console.error);

    if (voucherId) {
      client.getSingleVoucher(voucherId)
        .then((v) => {
          if (v && !v.error) {
            setPackageType(v.packageType);
            setMaxUses(v.maxUses);
            setDescription(v.description || '');
          }
        })
        .catch(console.error);
    } else {
      setPackageType((searchParams.get('packageType') || 'hajj').toLowerCase());
      setMaxUses(parseInt(searchParams.get('maxUses') || '10', 10));
      setDescription(searchParams.get('description') || '');
    }
  }, [voucherId, searchParams]);

  const pricePerQuota = packageType === 'hajj' ? prices.hajj : prices.umroh;
  const subtotal = pricePerQuota * maxUses;
  const ppn = subtotal * 0.11;
  const grandTotal = subtotal + ppn;

  const handlePaymentSubmit = () => {
    setStep('processing');
    setErrorMessage(null);
    
    // Simulate gateway processing delay
    setTimeout(() => {
      if (voucherId) {
        client.confirmVoucherPayment(voucherId)
          .then((res) => {
            if (res.success) {
              setStep('success');
            } else {
              setStep('checkout');
              setErrorMessage(res.message || 'Gagal mengonfirmasi pembayaran voucher.');
            }
          })
          .catch(() => {
            setStep('checkout');
            setErrorMessage('Gagal menyambung ke database untuk menyelesaikan transaksi.');
          });
      } else {
        client.createVoucher({
          packageType: packageType === 'hajj' ? 'hajj' : 'umroh',
          maxUses,
          description,
          isPaid: true
        }).then((res) => {
          if (res.success) {
            setStep('success');
          } else {
            setStep('checkout');
            setErrorMessage(res.message || 'Gagal memproses pembelian voucher.');
          }
        }).catch(() => {
          setStep('checkout');
          setErrorMessage('Gagal menyambung ke database untuk menyelesaikan transaksi.');
        });
      }
    }, 1500);
  };

  const isHaj = packageType === 'hajj';

  return (
    <div className="p-8 w-full space-y-6 py-12 bg-slate-50/50 min-h-screen">
      {/* Back button */}
      {step !== 'processing' && (
        <button
          onClick={() => router.push('/dashboard/vouchers')}
          className="inline-flex items-center gap-2 text-xs text-slate-500 hover:text-slate-900 transition-colors font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Voucher
        </button>
      )}

      <div className="grid md:grid-cols-3 gap-8 pt-2">
        {/* Left section: Invoice summary & details */}
        <div className="md:col-span-1 space-y-6">
          <div className="border border-slate-200 rounded-2xl p-6 bg-white shadow-sm space-y-4">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Rincian Tagihan</h3>
            
            <div className="space-y-3 pt-2 text-xs">
              <div className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
                <Ticket className={`w-4 h-4 ${isHaj ? 'text-blue-700' : 'text-amber-600'}`} />
                {isHaj ? 'Voucher Haji Premium' : 'Voucher Umrah Premium'}
              </div>
              
              {description && (
                <div className="bg-slate-50 p-2.5 rounded-lg text-[11px] text-slate-500 border border-slate-100 leading-normal">
                  <strong className="block text-slate-700 font-bold mb-0.5">Nama Grup / Rujukan:</strong>
                  {description}
                </div>
              )}

              <div className="flex justify-between text-slate-500 pt-3 border-t border-slate-100">
                <span>Harga Satuan</span>
                <span>Rp {pricePerQuota.toLocaleString('id-ID')}</span>
              </div>
              
              <div className="flex justify-between text-slate-500">
                <span>Jumlah Kuota</span>
                <span>{maxUses} Jemaah</span>
              </div>

              <div className="flex justify-between text-slate-500 pt-2 border-t border-slate-100">
                <span>Subtotal</span>
                <span>Rp {subtotal.toLocaleString('id-ID')}</span>
              </div>

              <div className="flex justify-between text-slate-500">
                <span>PPN (11%)</span>
                <span>Rp {ppn.toLocaleString('id-ID')}</span>
              </div>
              
              <div className="flex justify-between text-sm font-black text-[#1e40af] pt-3 border-t border-slate-100">
                <span>Total Pembayaran</span>
                <span>Rp {grandTotal.toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold justify-center bg-slate-50 py-2.5 rounded-xl border border-slate-200/60">
            <ShieldCheck className="w-4.5 h-4.5 text-blue-600" />
            SECURE CHECKOUT SSL 256-BIT
          </div>
        </div>

        {/* Right section: Payment Gateway panel */}
        <div className="md:col-span-2 border border-slate-200 rounded-2xl p-8 bg-white shadow-sm min-h-[400px] flex flex-col justify-between relative overflow-hidden">
          {step === 'checkout' && (
            <div className="space-y-6 flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                {errorMessage && (
                  <div className="bg-rose-50 text-rose-700 border border-rose-100 p-4 rounded-xl text-xs font-semibold flex items-center justify-between shadow-sm animate-fade-in">
                    <span>{errorMessage}</span>
                    <button 
                      onClick={() => setErrorMessage(null)} 
                      className="text-rose-450 hover:text-rose-600 font-black ml-2 text-sm"
                    >
                      ✕
                    </button>
                  </div>
                )}
                <h3 className="font-extrabold text-sm text-slate-800">Pilih Metode Pembayaran</h3>
                
                {/* Method selector buttons */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setPaymentMethod('qris')}
                    className={`flex flex-col items-center justify-center p-5 border-2 rounded-xl transition-all ${
                      paymentMethod === 'qris'
                        ? 'border-[#1e40af] bg-blue-50/20 text-slate-900 ring-1 ring-[#1e40af]'
                        : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    <span className="font-black text-sm tracking-tight text-[#1e40af]">QRIS Instant</span>
                    <span className="text-[9px] text-slate-400 mt-1 uppercase font-bold tracking-wider">E-Wallet Instant</span>
                  </button>
                  
                  <button
                    onClick={() => setPaymentMethod('va')}
                    className={`flex flex-col items-center justify-center p-5 border-2 rounded-xl transition-all ${
                      paymentMethod === 'va'
                        ? 'border-[#1e40af] bg-blue-50/20 text-slate-900 ring-1 ring-[#1e40af]'
                        : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    <span className="font-black text-sm tracking-tight text-[#1e40af]">Bank Transfer</span>
                    <span className="text-[9px] text-slate-400 mt-1 uppercase font-bold tracking-wider">Virtual Account</span>
                  </button>
                </div>

                {/* Details of Selected Method */}
                <div className="border border-slate-150 rounded-xl p-6 bg-slate-50/50 mt-4">
                  {paymentMethod === 'qris' ? (
                    <div className="flex flex-col items-center text-center space-y-3">
                      <div className="p-4 bg-white border border-slate-200 rounded-xl">
                        {/* Simulated QR Code representation */}
                        <div className="w-40 h-40 bg-slate-950 flex items-center justify-center relative rounded p-2">
                          <div className="grid grid-cols-5 gap-1.5 w-full h-full opacity-90">
                            {Array.from({ length: 25 }).map((_, idx) => (
                              <div 
                                key={idx} 
                                className={`rounded-sm ${(idx * 7 + 13) % 5 === 0 || idx % 3 === 0 ? 'bg-white' : 'bg-slate-950'}`} 
                              />
                            ))}
                          </div>
                          <div className="absolute inset-0 m-auto w-10 h-10 bg-white border-2 border-slate-950 rounded flex items-center justify-center font-black text-[9px] text-[#1e40af]">
                            QRIS
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-slate-400 font-bold max-w-xs">
                        Pindai kode QR menggunakan ShopeePay, GoPay, OVO, LinkAja, atau Mobile Banking Anda.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-xs text-slate-500 leading-relaxed font-bold">
                        Silakan transfer tepat sesuai jumlah tagihan ke rekening Virtual Account berikut:
                      </p>
                      <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Nomor Virtual Account</span>
                          <span className="font-mono text-sm font-black text-slate-800 tracking-wider block mt-1">9880183827495000</span>
                        </div>
                        <span className="text-xs font-black bg-blue-50 text-blue-700 px-3 py-1 rounded-lg">BCA VA</span>
                      </div>
                      <p className="text-[11px] text-slate-450 leading-relaxed">
                        * Pengecekan status pembayaran dilakukan secara otomatis oleh sistem kami setelah transfer berhasil dikirim.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex justify-between items-center gap-4 flex-wrap sm:flex-nowrap">
                <div className="text-xs text-slate-400 font-bold">
                  * Klik tombol di samping untuk mensimulasikan pelunasan tagihan.
                </div>
                <button
                  onClick={handlePaymentSubmit}
                  className="w-full sm:w-auto px-8 py-3 bg-[#1e40af] text-white rounded-xl text-xs font-bold hover:bg-blue-800 transition-all flex items-center justify-center gap-2 shadow-sm shrink-0"
                >
                  <CreditCard className="w-4 h-4" />
                  Bayar Sekarang
                </button>
              </div>
            </div>
          )}

          {step === 'processing' && (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 animate-pulse">
              <RefreshCw className="w-12 h-12 text-[#1e40af] animate-spin" />
              <h3 className="font-extrabold text-sm text-slate-800">Memproses Pembayaran Aman...</h3>
              <p className="text-xs text-slate-400 font-bold max-w-xs">
                Mohon tidak menutup halaman ini. Gateway pembayaran kami sedang memproses pelunasan kuota voucher Anda.
              </p>
            </div>
          )}

          {step === 'success' && (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-5 py-6">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 border border-emerald-100">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-black text-lg text-slate-900">Pembayaran Berhasil!</h3>
                <p className="text-xs text-slate-400 font-medium max-w-sm mt-1.5 leading-relaxed">
                  Sebanyak <strong>{maxUses} kuota jemaah</strong> telah berhasil ditambahkan. Kode voucher individual sekali pakai jemaah telah di-generate secara otomatis di database.
                </p>
              </div>
              <button
                onClick={() => router.push('/dashboard/vouchers')}
                className="px-6 py-2.5 bg-[#1e40af] text-white rounded-xl text-xs font-bold hover:bg-[#1e3a8a] transition-all"
              >
                Lihat Daftar Voucher
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VouchersCheckoutPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400 font-bold">Memuat...</div>}>
      <VouchersCheckoutContent />
    </Suspense>
  );
}
