"use client";

import Image from "next/image";

interface CertificatePreviewProps {
  title: string;
  issueDate: string;
  certificateId: string;
  isUnlocked: boolean;
}

export default function CertificatePreview({ title, issueDate, certificateId, isUnlocked }: CertificatePreviewProps) {
  return (
    <div className={`relative p-1 bg-gradient-to-br ${isUnlocked ? 'from-[var(--color-accent)] to-[#b45309]' : 'from-gray-200 to-gray-300'} rounded-[3rem] shadow-2xl`}>
       <div className="bg-white rounded-[2.9rem] p-8 lg:p-12 space-y-8 relative overflow-hidden">
          {/* Certificate Design Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 opacity-[0.03] islamic-pattern pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 opacity-[0.03] islamic-pattern pointer-events-none rotate-180"></div>
          
          {!isUnlocked && (
             <div className="absolute inset-0 bg-white/60 backdrop-blur-md z-20 flex flex-col items-center justify-center text-center p-8">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4">
                   <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">Sertifikat Terkunci</h4>
                <p className="text-sm text-gray-500 max-w-xs">Selesaikan seluruh kurikulum Manasik360 untuk mengunduh sertifikat resmi Anda.</p>
             </div>
          )}

          <div className="flex flex-col items-center text-center space-y-6">
             <div className="w-24 h-24 relative mb-4">
                <Image src="/logo.png" alt="Logo" fill className="object-contain grayscale opacity-50" />
             </div>
             
             <div className="space-y-2">
                <h3 className="text-[10px] font-bold text-[var(--color-accent)] uppercase tracking-[0.4em]">Certificate of Completion</h3>
                <h2 className="text-3xl lg:text-4xl font-serif text-gray-900 italic">Akhmad Fauzi</h2>
             </div>

             <div className="w-16 h-0.5 bg-gray-100"></div>

             <p className="text-sm text-gray-500 max-w-lg leading-relaxed">
                Telah berhasil menyelesaikan seluruh rangkaian program simulasi manasik haji digital dan dinyatakan siap secara teori untuk melaksanakan ibadah di Tanah Suci.
             </p>

             <div className="grid grid-cols-2 gap-12 pt-8">
                <div className="text-center">
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Tanggal Terbit</p>
                   <p className="text-sm font-bold text-gray-900">{issueDate}</p>
                </div>
                <div className="text-center">
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">ID Sertifikat</p>
                   <p className="text-sm font-bold text-gray-900">{certificateId}</p>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
}
