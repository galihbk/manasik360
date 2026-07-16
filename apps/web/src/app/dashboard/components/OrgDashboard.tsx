import React from 'react';
import {
  Users,
  Play,
  BookOpen,
  Ticket,
  Copy,
  Check,
  Search,
  Building
} from 'lucide-react';

interface OrgDashboardProps {
  orgData: any;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  copiedCode: string | null;
  copyToClipboard: (code: string) => void;
}

export default function OrgDashboard({
  orgData,
  searchQuery,
  setSearchQuery,
  copiedCode,
  copyToClipboard
}: OrgDashboardProps) {
  const pilgrimsList = orgData?.pilgrims || [];
  const filteredPilgrims = pilgrimsList.filter((p: any) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 w-full space-y-8 py-12 bg-slate-50/50 min-h-screen">
      {/* Header Branding */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/60 pb-6">
        <div>
          <span className="text-xs font-bold text-[#1e40af] uppercase tracking-widest flex items-center gap-1.5">
            <Building className="w-3.5 h-3.5" /> Portal Kemitraan Biro Haji & Umrah
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            {orgData?.tenantName}
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Pantau progres belajar jemaah dan kelola voucher rujukan keberangkatan Anda.
          </p>
        </div>
      </div>

      {/* 4 Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-[#1e40af]/10 rounded-xl flex items-center justify-center text-[#1e40af] shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">Total Jemaah</span>
            <span className="text-2xl font-black text-slate-900 mt-0.5 block">{orgData?.stats?.totalPilgrims || 0} Orang</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 shrink-0">
            <Play className="w-5 h-5 fill-amber-600" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">Rata-rata Progres</span>
            <span className="text-2xl font-black text-slate-900 mt-0.5 block">{orgData?.stats?.averageProgress || 0}% Selesai</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-[#1e40af] shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">Materi Aktif</span>
            <span className="text-sm font-extrabold text-emerald-800 bg-blue-50 border border-emerald-100 rounded-lg px-2.5 py-1 mt-1.5 inline-block">Haji & Umrah Premium</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
            <Ticket className="w-6 h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">Kode Voucher Jemaah</span>
            <div className="flex items-center justify-between mt-1 gap-2 bg-slate-50 border border-slate-150 rounded-lg px-2 py-1">
              <span className="font-mono text-xs font-black text-slate-800 truncate">{orgData?.vouchers?.[0]?.code || 'BIRO360'}</span>
              <button
                onClick={() => copyToClipboard(orgData?.vouchers?.[0]?.code || 'BIRO360')}
                className="text-slate-400 hover:text-[#1e40af] shrink-0"
              >
                {copiedCode === (orgData?.vouchers?.[0]?.code || 'BIRO360') ? <Check className="w-3.5 h-3.5 text-blue-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Pilgrims Progress Tracking Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-800">Pemantauan Progres Belajar Jemaah</h3>
            <p className="text-xs text-slate-400 font-medium mt-0.5">Pantau kesiapan jemaah sebelum berangkat ke tanah suci.</p>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-xs w-full">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama atau email jemaah..."
              className="w-full bg-slate-50/70 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-bold focus:outline-none focus:border-[#1e40af] focus:bg-white transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200 text-[10px] font-bold text-slate-450 uppercase tracking-wider">
                <th className="px-6 py-4">Nama Jemaah</th>
                <th className="px-6 py-4">Peran (Role)</th>
                <th className="px-6 py-4">Progres Kesiapan</th>
                <th className="px-6 py-4">Rata-rata Nilai Kuis</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Tanggal Bergabung</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-bold text-slate-700">
              {filteredPilgrims.length > 0 ? (
                filteredPilgrims.map((pilgrim: any) => (
                  <tr key={pilgrim.id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-650 flex items-center justify-center uppercase font-black text-xs">
                          {pilgrim.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-extrabold text-slate-800">{pilgrim.name}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">{pilgrim.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${pilgrim.role === 'ORG_ADMIN' ? 'bg-[#1e40af]/10 text-[#1e40af]' : 'bg-slate-100 text-slate-500'
                        }`}>
                        {pilgrim.role === 'ORG_ADMIN' ? 'Biro Admin' : 'Jemaah'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3 max-w-[200px]">
                        <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-[#1e40af] h-2 rounded-full transition-all duration-500"
                            style={{ width: `${pilgrim.progress}%` }}
                          ></div>
                        </div>
                        <span className="font-mono text-slate-800 shrink-0">{pilgrim.progress}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-mono text-sm ${pilgrim.avgQuizScore >= 80 ? 'text-blue-600 font-extrabold' : 'text-slate-550'}`}>
                        {pilgrim.avgQuizScore}%
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${pilgrim.status === 'Completed'
                        ? 'bg-blue-50 text-blue-700'
                        : pilgrim.status === 'In Progress'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-slate-100 text-slate-400'
                        }`}>
                        {pilgrim.status === 'Completed' ? 'Selesai' : pilgrim.status === 'In Progress' ? 'Belajar' : 'Belum Mulai'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-450 font-normal">
                      {new Date(pilgrim.joinedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">
                    Tidak ada data jemaah yang ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Voucher Management details */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-slate-800">
          <Ticket className="w-5 h-5 text-[#1e40af]" />
          <h3 className="text-base font-extrabold">Manfaat Distribusi Voucher Biro</h3>
        </div>
        <p className="text-sm text-slate-550 leading-relaxed max-w-3xl">
          Bagikan kode voucher kemitraan Anda di atas kepada jemaah travel Anda. Ketika jemaah melakukan registrasi dan memasukkan kode voucher ini, akun mereka akan otomatis memiliki akses premium ke pembelajaran Haji & Umrah V2 secara gratis, serta terhubung di bawah pimpinan grup Biro Anda untuk pemantauan progres.
        </p>
      </div>

      {/* B2B Recommendations / Partner Offers Section */}
      <OrgRecommendations />
    </div>
  );
}

// Sub-component to isolate state and effects for cleaner code
import { useState, useEffect } from 'react';
import { ApiClient } from '@bahrain/api-client';
import { Hotel, Gift, MapPin, Phone, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';

function RecommendationCardImage({ imageUrl, type, name }: { imageUrl: string; type: string; name: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const images = imageUrl ? imageUrl.split(',').filter((img: string) => img.trim() !== '') : [];

  if (images.length === 0) {
    return (
      <div className="relative h-32 bg-slate-100 flex items-center justify-center">
        <div className="text-slate-350">
          {type === 'HOTEL' ? <Hotel className="w-8 h-8" /> : <Gift className="w-8 h-8" />}
        </div>
        <span className={`absolute top-2 left-2 text-[8px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded shadow-sm bg-slate-600 text-white`}>
          {type === 'HOTEL' ? 'Hotel Partner' : 'Oleh-oleh Partner'}
        </span>
      </div>
    );
  }

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    setActiveIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative h-32 bg-slate-100 flex items-center justify-center group">
      <img src={images[activeIndex]} alt={name} className="object-cover w-full h-full" />
      
      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-1 top-1/2 -translate-y-1/2 bg-black/55 hover:bg-black/85 text-white p-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-1 top-1/2 -translate-y-1/2 bg-black/55 hover:bg-black/85 text-white p-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex gap-0.5 z-10">
            {images.map((_, i) => (
              <div 
                key={i} 
                className={`w-1 h-1 rounded-full transition-all ${
                  i === activeIndex ? 'bg-blue-500 scale-110' : 'bg-white/60'
                }`} 
              />
            ))}
          </div>
        </>
      )}

      <span className={`absolute top-2 left-2 text-[8px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded shadow-sm text-white ${
        type === 'HOTEL' ? 'bg-indigo-600' : 'bg-amber-600'
      }`}>
        {type === 'HOTEL' ? 'Hotel Partner' : 'Oleh-oleh Partner'}
      </span>
    </div>
  );
}

function OrgRecommendations() {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const client = new ApiClient({ baseUrl: '/api/v1' });
    client.getActiveRecommendations('org_admin')
      .then(res => {
        if (res && res.success) {
          setRecommendations(res.recommendations || []);
        }
      })
      .catch(err => console.error("Error fetching org recommendations:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center justify-center py-10">
        <span className="text-xs text-slate-400 font-bold uppercase tracking-wider animate-pulse">Memuat penawaran mitra...</span>
      </div>
    );
  }

  if (recommendations.length === 0) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2 text-indigo-650">
          <Hotel className="w-5 h-5 text-indigo-600" />
          <h3 className="text-base font-extrabold text-slate-800">
            Penawaran Kerja Sama Hotel & Kemitraan (B2B)
          </h3>
        </div>
        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[9px] font-black uppercase tracking-wider">Tarif Khusus Biro</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {recommendations.map((reco) => (
          <div key={reco.id} className="border border-slate-150 rounded-xl overflow-hidden flex flex-col justify-between hover:shadow-md transition-all bg-slate-50/50">
            <div>
              <RecommendationCardImage imageUrl={reco.imageUrl} type={reco.type} name={reco.name} />

              <div className="p-4 space-y-2">
                <h5 className="font-extrabold text-xs text-slate-800 line-clamp-1">{reco.name}</h5>
                <p className="text-[11px] text-slate-500 leading-normal line-clamp-2">{reco.description || 'Penawaran kerja sama khusus untuk Biro Anda.'}</p>
              </div>
            </div>

            <div className="p-4 pt-0 space-y-2">
              <div className="border-t border-slate-150 pt-2 flex flex-col gap-1 text-[10px] text-slate-550 font-medium">
                {reco.location && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{reco.location}</span>
                  </div>
                )}
                {reco.contactNumber && (
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{reco.contactNumber}</span>
                  </div>
                )}
              </div>

              {reco.websiteUrl && (
                <a
                  href={reco.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 flex items-center justify-center gap-1 py-1.5 w-full bg-slate-900 hover:bg-slate-850 text-white font-extrabold text-[10px] rounded-md transition-all shadow-sm"
                >
                  <ExternalLink className="w-3 h-3" />
                  Hubungi Partner / B2B Detail
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
