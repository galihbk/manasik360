'use client';

import React, { useState, useEffect } from 'react';
import { Award, Download } from 'lucide-react';
import { en, id, ar } from '@bahrain/localization';
import { ApiClient } from '@bahrain/api-client';

const client = new ApiClient({ baseUrl: '/api/v1' });

export default function CertificatesPage() {
  const [lang, setLang] = useState('en');
  const [certs, setCerts] = useState<any[]>([]);

  // Translation helpers
  const tMap: Record<string, any> = { en, id, ar };
  const t = tMap[lang] || en;
  const d = t.dashboard || en.dashboard;

  useEffect(() => {
    const savedLang = localStorage.getItem('bahrain_lang') || 'en';
    setLang(savedLang);

    // Fetch dynamic certificates from NestJS API
    client.getCertificates()
      .then((data) => {
        if (data && Array.isArray(data)) {
          setCerts(data);
        }
      })
      .catch(() => {
        // Leave empty on failure
      });
  }, []);


  return (
    <div className="p-8 w-full space-y-6 py-12">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{d.certificates || 'Sertifikat'}</h2>
        <p className="text-sm text-slate-400 mt-0.5 font-medium">Unduh kredensial dan bukti kelulusan manasik Anda</p>
      </div>

      {certs.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {certs.map((cert) => (
            <div key={cert.id} className="border border-slate-200 rounded-lg p-6 bg-white shadow-sm flex flex-col justify-between space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-[#1e40af] shrink-0">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{cert.course?.title || 'Sertifikat Kelulusan'}</h4>
                  <p className="text-xs text-slate-400 mt-1">Diverifikasi pada {new Date(cert.verifiedAt).toLocaleDateString('id-ID')}</p>
                </div>
              </div>
              <a 
                href={`/dashboard/certificates/view?id=${cert.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#1e40af] hover:bg-blue-800 text-white rounded py-2 px-4 text-xs font-bold transition-colors w-full"
              >
                <Award className="w-3.5 h-3.5" />
                Lihat & Cetak Sertifikat (PDF)
              </a>
            </div>
          ))}
        </div>
      ) : (
        <div className="border border-dashed border-slate-200 rounded-lg p-12 text-center flex flex-col items-center bg-slate-50/50">
          <Award className="w-12 h-12 text-slate-400 mb-4" />
          <h4 className="font-bold text-sm text-slate-900">Belum Ada Sertifikat Tersedia</h4>
          <p className="text-sm text-slate-400 max-w-sm mt-1.5 leading-relaxed font-medium">
            Selesaikan semua modul pelatihan dan ujian Haji / Umrah untuk menerbitkan sertifikat kelulusan resmi Anda.
          </p>
        </div>
      )}
    </div>
  );
}
