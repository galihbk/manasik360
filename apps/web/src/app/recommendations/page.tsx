'use client';

import React, { useState, useEffect } from 'react';
import PublicLayout from '@/components/PublicLayout';
import { ApiClient } from '@bahrain/api-client';
import { 
  Loader2, 
  Search, 
  MapPin, 
  Phone, 
  Hotel,
  Gift,
  ExternalLink,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const client = new ApiClient({ baseUrl: '/api/v1' });

// Image Slider helper component for public cards
function RecommendationCardImage({ imageUrl, type, name }: { imageUrl: string; type: string; name: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const images = imageUrl ? imageUrl.split(',').filter((img: string) => img.trim() !== '') : [];

  if (images.length === 0) {
    return (
      <div className="relative h-48 bg-slate-100 flex items-center justify-center">
        <div className="text-slate-350">
          {type === 'HOTEL' ? <Hotel className="w-10 h-10" /> : <Gift className="w-10 h-10" />}
        </div>
        <span className={`absolute top-3 left-3 text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded shadow-sm bg-slate-600 text-white`}>
          {type === 'HOTEL' ? 'Hotel' : 'Oleh-oleh'}
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
    <div className="relative h-48 bg-slate-100 flex items-center justify-center group">
      <img src={images[activeIndex]} alt={name} className="object-cover w-full h-full" />
      
      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
            {images.map((_, i) => (
              <div 
                key={i} 
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  i === activeIndex ? 'bg-blue-500 scale-110' : 'bg-white/60'
                }`} 
              />
            ))}
          </div>
        </>
      )}

      <span className={`absolute top-3 left-3 text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded shadow-sm text-white ${
        type === 'HOTEL' ? 'bg-emerald-700' : 'bg-amber-600'
      }`}>
        {type === 'HOTEL' ? 'Hotel' : 'Oleh-oleh'}
      </span>
    </div>
  );
}

export default function PublicRecommendationsPage() {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');

  useEffect(() => {
    client.getActiveRecommendations('public')
      .then(res => {
        if (res && res.success) {
          setRecommendations(res.recommendations || []);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  const filtered = recommendations.filter(reco => {
    const matchesSearch = reco.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (reco.description && reco.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = typeFilter === 'ALL' || reco.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <PublicLayout>
      {/* Hero Banner Section */}
      <section className="bg-[#064e3b] text-white py-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900 to-transparent opacity-80"></div>
        <div className="max-w-7xl mx-auto relative z-10 space-y-4">
          <span className="bg-emerald-500/25 border border-emerald-450/40 text-emerald-200 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
            Kemitraan Resmi & Layanan Penunjang
          </span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            Rekomendasi Mitra Pilihan Haji & Umrah
          </h1>
          <p className="text-sm md:text-base text-emerald-100 max-w-3xl leading-relaxed">
            Temukan daftar akomodasi hotel bintang lima, penginapan terdekat, dan toko oleh-oleh mekah & madinah terbaik yang bekerja sama dengan platform kami untuk menunjang kenyamanan ibadah Anda.
          </p>
        </div>
      </section>

      {/* Main Catalog Section */}
      <main className="flex-1 bg-slate-50 py-12 px-6">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Search & Filter Bar */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cari hotel, souvenir, atau lokasi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-emerald-600 focus:outline-none bg-slate-50/50"
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              {['ALL', 'HOTEL', 'SOUVENIR'].map((tType) => (
                <button
                  key={tType}
                  onClick={() => setTypeFilter(tType)}
                  className={`flex-1 md:flex-none text-xs font-extrabold px-5 py-3 rounded-xl border transition-all ${
                    typeFilter === tType
                      ? 'bg-emerald-800 border-emerald-800 text-white shadow-sm'
                      : 'bg-white border-slate-200 text-slate-650 hover:bg-slate-50'
                  }`}
                >
                  {tType === 'ALL' ? 'Semua Kategori' : tType === 'HOTEL' ? 'Hotel / Penginapan' : 'Oleh-oleh Mekah'}
                </button>
              ))}
            </div>
          </div>

          {/* Directory Listings */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-3">
              <Loader2 className="w-10 h-10 text-emerald-700 animate-spin" />
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest animate-pulse">
                Memuat Kemitraan Publik...
              </span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white border border-slate-250 rounded-2xl py-20 text-center max-w-xl mx-auto shadow-sm">
              <Hotel className="w-16 h-16 text-slate-350 mx-auto mb-4" />
              <h3 className="text-base font-bold text-slate-700">Tidak ada partner ditemukan</h3>
              <p className="text-xs text-slate-400 mt-2">
                Kata kunci atau kategori pencarian Anda tidak memiliki hasil aktif saat ini.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((reco) => (
                <div key={reco.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                  <div>
                    <RecommendationCardImage imageUrl={reco.imageUrl} type={reco.type} name={reco.name} />

                    <div className="p-6 space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-extrabold text-base text-slate-800 truncate max-w-[220px]">
                          {reco.name}
                        </h3>
                        {reco.isPaid && (
                          <span className="bg-emerald-50 text-emerald-800 border border-emerald-150 text-[8px] font-black uppercase px-2.5 py-0.5 rounded-full">
                            Partner Resmi
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                        {reco.description || 'Lihat penawaran eksklusif dari partner resmi kami.'}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 pt-0 space-y-4">
                    <div className="border-t border-slate-100 pt-4 flex flex-col gap-2 text-xs text-slate-550 font-medium">
                      {reco.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                          <span className="truncate">{reco.location}</span>
                        </div>
                      )}
                      {reco.contactNumber && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                          <span>{reco.contactNumber}</span>
                        </div>
                      )}
                    </div>

                    {reco.websiteUrl && (
                      <a
                        href={reco.websiteUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 flex items-center justify-center gap-2 py-3 w-full bg-[#064e3b] hover:bg-[#043427] text-white font-extrabold text-xs rounded-xl transition-all shadow-sm uppercase tracking-wider"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Kunjungi Halaman Partner
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </main>
    </PublicLayout>
  );
}
