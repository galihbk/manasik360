'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ApiClient } from '@bahrain/api-client';
import { Printer, ShieldCheck, ArrowLeft, Loader2 } from 'lucide-react';

const client = new ApiClient({ baseUrl: '/api/v1' });

export default function CertificateViewPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500 font-bold">Memuat halaman sertifikat...</div>}>
      <CertificateViewContent />
    </Suspense>
  );
}

function CertificateViewContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const certId = searchParams.get('id');

  const [cert, setCert] = useState<any | null>(null);
  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!certId) {
      router.push('/dashboard/certificates');
      return;
    }

    // Load certificates and find the matching one
    Promise.all([
      client.getCertificates(),
      client.getProfile()
    ]).then(([certs, profile]) => {
      if (Array.isArray(certs)) {
        const found = certs.find((c: any) => c.id === certId);
        if (found) {
          setCert(found);
        }
      }
      if (profile && profile.name) {
        setUserName(profile.name);
      }
      setIsLoading(false);
    }).catch(() => {
      setIsLoading(false);
    });
  }, [certId, router]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 gap-3">
        <Loader2 className="w-8 h-8 text-blue-700 animate-spin" />
        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Mempersiapkan Sertifikat...</p>
      </div>
    );
  }

  if (!cert) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6 text-center gap-4">
        <h3 className="text-lg font-bold text-slate-800">Sertifikat Tidak Ditemukan</h3>
        <button 
          onClick={() => router.push('/dashboard/certificates')}
          className="px-4 py-2 bg-blue-700 text-white rounded text-xs font-bold"
        >
          Kembali
        </button>
      </div>
    );
  }

  const formattedDate = new Date(cert.verifiedAt).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-slate-100/60 p-4 md:p-8 flex flex-col items-center justify-center print:bg-white print:p-0">
      {/* Top Controls Bar (Hidden during Print) */}
      <div className="w-full max-w-4xl flex items-center justify-between mb-6 bg-white border border-slate-200 p-4 rounded-xl shadow-sm print:hidden">
        <button
          onClick={() => router.push('/dashboard/certificates')}
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Sertifikat</span>
        </button>
        
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-extrabold shadow-sm transition-all"
        >
          <Printer className="w-4 h-4" />
          <span>Cetak / Simpan PDF</span>
        </button>
      </div>

      {/* Official Certificate Layout */}
      <div className="w-full max-w-4xl bg-white border-[16px] border-double border-slate-900 p-10 md:p-16 rounded-lg shadow-xl relative overflow-hidden flex flex-col justify-between items-center text-center aspect-[1.414/1] print:shadow-none print:border-slate-900 print:my-0">
        
        {/* Background Ornamental Borders */}
        <div className="absolute top-4 left-4 right-4 bottom-4 border-2 border-slate-300 pointer-events-none"></div>
        
        {/* Header Branding */}
        <div className="space-y-2 mt-4 z-10">
          <div className="flex items-center justify-center gap-2 text-slate-900">
            <span className="font-black text-lg tracking-widest">BAHRAIN</span>
          </div>
          <p className="text-[10px] tracking-widest uppercase font-extrabold text-slate-400">Portal Edukasi Manasik Ibadah Virtual</p>
        </div>

        {/* Certificate Title */}
        <div className="my-8 z-10">
          <h1 className="text-3xl md:text-5xl font-serif text-slate-900 font-extrabold tracking-tight">SERTIFIKAT KELULUSAN</h1>
          <div className="w-24 h-0.5 bg-slate-900 mx-auto mt-4"></div>
        </div>

        {/* Recipient Details */}
        <div className="space-y-3 z-10">
          <p className="text-xs italic text-slate-450 font-medium font-serif">Sertifikat ini dengan bangga diberikan kepada:</p>
          <h2 className="text-2xl md:text-4xl font-serif font-black text-slate-900 underline decoration-slate-300 underline-offset-8">
            {userName}
          </h2>
        </div>

        {/* Completion Description */}
        <div className="max-w-xl mx-auto space-y-2 my-6 z-10">
          <p className="text-xs md:text-sm text-slate-650 leading-relaxed font-medium">
            Telah menyelesaikan seluruh rangkaian pelatihan manasik dan simulasi virtual 360° secara penuh, komprehensif, serta dinyatakan lulus pada kurikulum kelas:
          </p>
          <h3 className="text-base md:text-lg font-extrabold text-[#1e40af] uppercase tracking-wide">
            {cert.course?.title || 'Pembelajaran Haji'}
          </h3>
        </div>

        {/* Footer, Verification stamp & signatures */}
        <div className="w-full grid grid-cols-3 items-end mt-8 border-t border-slate-100 pt-8 z-10">
          {/* Signee left */}
          <div className="space-y-1 text-left">
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Verifikasi Platform</span>
            <div className="text-[10px] text-slate-800 font-bold">Bahrain Virtual Academy</div>
            <div className="text-[9px] text-slate-400 font-semibold">{formattedDate}</div>
          </div>

          {/* Golden Seal badge middle */}
          <div className="flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-amber-50 rounded-full border border-amber-200 flex items-center justify-center text-amber-700 shadow-inner">
              <ShieldCheck className="w-10 h-10" />
            </div>
            <span className="text-[9px] text-amber-850 font-extrabold uppercase mt-2 tracking-widest">RESMI & SAH</span>
          </div>

          {/* Signee right */}
          <div className="space-y-1 text-right">
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Super Administrator</span>
            <div className="text-[10px] text-slate-800 font-bold">Customer Service CS</div>
            <div className="text-[9px] text-slate-500 font-semibold">Tanda Tangan Digital</div>
          </div>
        </div>

      </div>
    </div>
  );
}
