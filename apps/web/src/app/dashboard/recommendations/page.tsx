'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ApiClient } from '@bahrain/api-client';
import { 
  Plus, 
  Loader2, 
  Search, 
  Edit3, 
  Trash2, 
  Link as LinkIcon, 
  MapPin, 
  Phone, 
  CheckCircle, 
  AlertCircle, 
  Hotel,
  Gift,
  DollarSign,
  User,
  Building2,
  Globe,
  ExternalLink,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const client = new ApiClient({ baseUrl: '/api/v1' });

// Image Slider helper component for directory view
function RecommendationCardImage({ imageUrl, type, name }: { imageUrl: string; type: string; name: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const images = imageUrl ? imageUrl.split(',').filter((img: string) => img.trim() !== '') : [];

  if (images.length === 0) {
    return (
      <div className="relative h-44 bg-slate-100 flex items-center justify-center">
        <div className="text-slate-350">
          {type === 'HOTEL' ? <Hotel className="w-10 h-10" /> : <Gift className="w-10 h-10" />}
        </div>
        <span className={`absolute top-3 left-3 text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded shadow-sm bg-slate-650 text-white`}>
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
    <div className="relative h-44 bg-slate-100 flex items-center justify-center group">
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
        type === 'HOTEL' ? 'bg-indigo-600' : 'bg-amber-600'
      }`}>
        {type === 'HOTEL' ? 'Hotel' : 'Oleh-oleh'}
      </span>
    </div>
  );
}

export default function RecommendationsPage() {
  const router = useRouter();
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [role, setRole] = useState<string>('learner');
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchRecommendations = async () => {
    setIsLoading(true);
    try {
      const storedRole = typeof window !== 'undefined' ? localStorage.getItem('bahrain_user_role') : 'learner';
      const isSuper = storedRole === 'super_admin';
      
      let res;
      if (isSuper) {
        res = await client.getAllRecommendations();
      } else {
        res = await client.getActiveRecommendations(storedRole === 'org_admin' ? 'org_admin' : 'learner');
      }
      
      if (res && res.success) {
        setRecommendations(res.recommendations || []);
      } else {
        showToast('Gagal memuat rekomendasi', 'error');
      }
    } catch (e) {
      console.error(e);
      showToast('Koneksi bermasalah', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedRole = localStorage.getItem('bahrain_user_role');
      if (storedRole) {
        setRole(storedRole);
      }
    }
    fetchRecommendations();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus rekomendasi ini?')) return;
    
    setActionLoading(true);
    try {
      const res = await client.deleteRecommendation(id);
      if (res && res.success) {
        showToast('Rekomendasi berhasil dihapus');
        fetchRecommendations();
      } else {
        showToast('Gagal menghapus rekomendasi', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Koneksi bermasalah', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Filter & Search logic
  const filtered = recommendations.filter(reco => {
    const matchesSearch = reco.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (reco.description && reco.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = typeFilter === 'ALL' || reco.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const isSuper = role === 'super_admin';

  return (
    <div className="p-6 md:p-8 w-full space-y-6 bg-slate-50 min-h-screen">
      {/* Toast Alert */}
      {toast && (
        <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg border text-xs font-bold transition-all ${
          toast.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-red-50 text-red-800 border-red-200'
        }`}>
          {toast.type === 'success' ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-red-600" />}
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <span className="px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-widest bg-blue-100 text-blue-800 rounded-full">
            {isSuper ? 'Kemitraan & Rekomendasi' : 'Direktori Partner & Rekomendasi'}
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-2">
            {isSuper ? 'Daftar Rekomendasi Partner' : role === 'org_admin' ? 'Kemitraan Hotel & Souvenir (B2B)' : 'Rekomendasi Akomodasi & Oleh-oleh'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {isSuper 
              ? 'Kelola listing hotel, travel, dan oleh-oleh berbayar untuk dashboard dan publik.' 
              : role === 'org_admin'
                ? 'Daftar penawaran tarif khusus biro dan kemitraan resmi dengan hotel & merchant di Mekah/Madinah.'
                : 'Rekomendasi hotel penginapan dan toko oleh-oleh resmi pilihan selama ibadah haji & umrah.'
            }
          </p>
        </div>
        {isSuper && (
          <button
            onClick={() => router.push('/dashboard/recommendations/new')}
            className="inline-flex items-center gap-2 bg-[#1e40af] hover:bg-blue-800 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" /> Tambah Rekomendasi
          </button>
        )}
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama rekomendasi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-blue-600 focus:outline-none bg-slate-55/30"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          {['ALL', 'HOTEL', 'SOUVENIR'].map((tType) => (
            <button
              key={tType}
              onClick={() => setTypeFilter(tType)}
              className={`flex-1 md:flex-none text-xs font-extrabold px-4 py-2.5 rounded-lg border transition-all ${
                typeFilter === tType
                  ? 'bg-slate-900 border-slate-900 text-white'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {tType === 'ALL' ? 'Semua' : tType === 'HOTEL' ? 'Hotel' : 'Oleh-oleh'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content List */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest animate-pulse">Memuat Data Rekomendasi...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center shadow-sm">
          <Hotel className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-bold text-slate-700">Belum ada partner terdaftar</p>
          <p className="text-xs text-slate-400 mt-1">
            {isSuper ? 'Tekan tombol Tambah Rekomendasi di kanan atas untuk membuat.' : 'Silakan kembali lagi nanti untuk penawaran partner terbaru.'}
          </p>
        </div>
      ) : isSuper ? (
        /* SUPER ADMIN: Horizontal Card view */
        <div className="space-y-6">
          {filtered.map((reco) => (
            <div key={reco.id} className="bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-5">
              {/* Image & Category Badges (Left) */}
              <div className="relative w-full md:w-48 aspect-video md:aspect-square bg-slate-900 shrink-0 flex items-center justify-center">
                {(() => {
                  const rImages = reco.imageUrl ? reco.imageUrl.split(',').filter((img: string) => img.trim() !== '') : [];
                  const firstImg = rImages[0];
                  return (
                    <>
                      {firstImg ? (
                        <img src={firstImg} alt={reco.name} className="object-cover w-full h-full" />
                      ) : (
                        <div className="text-slate-550 flex flex-col items-center justify-center p-4">
                          {reco.type === 'HOTEL' ? <Hotel className="w-10 h-10" /> : <Gift className="w-10 h-10" />}
                        </div>
                      )}
                      {rImages.length > 1 && (
                        <span className="absolute bottom-3 right-3 text-[9px] bg-slate-900/80 text-white font-extrabold px-1.5 py-0.5 rounded uppercase">
                          {rImages.length} Foto
                        </span>
                      )}
                    </>
                  );
                })()}
                
                {/* Floating category badge */}
                <div className="absolute top-3 left-3">
                  <span className={`inline-flex items-center gap-1 text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm ${
                    reco.type === 'HOTEL' ? 'bg-indigo-600 text-white' : 'bg-amber-600 text-white'
                  }`}>
                    {reco.type === 'HOTEL' ? 'Hotel' : 'Oleh-oleh'}
                  </span>
                </div>

                {/* Floating paid badge */}
                {reco.isPaid && (
                  <div className="absolute bottom-3 left-3">
                    <span className="bg-emerald-600 text-white text-[8px] font-extrabold uppercase tracking-wide px-1.5 py-0.5 rounded-full shadow-sm flex items-center gap-0.5">
                      <DollarSign className="w-2.5 h-2.5" /> Paid
                    </span>
                  </div>
                )}
              </div>

              {/* Card Body & Actions (Right) */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                      Status Keaktifan:
                    </span>
                    <span className={`text-[8px] font-extrabold uppercase tracking-wide px-1.5 py-0.5 rounded-full ${
                      reco.isActive ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-650'
                    }`}>
                      {reco.isActive ? 'Active' : 'Draft'}
                    </span>
                  </div>

                  <h3 className="text-sm font-extrabold text-slate-900 tracking-tight leading-snug">{reco.name}</h3>
                  <p className="text-xs text-slate-455 line-clamp-2 md:line-clamp-3 leading-relaxed max-w-4xl">
                    {reco.description || 'Tidak ada deskripsi.'}
                  </p>

                  <div className="flex flex-wrap gap-x-4 gap-y-1.5 pt-2 text-[10px] text-slate-550 font-medium border-t border-slate-100">
                    {reco.location && (
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{reco.location}</span>
                      </div>
                    )}
                    {reco.contactNumber && (
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{reco.contactNumber}</span>
                      </div>
                    )}
                    {reco.websiteUrl && (
                      <a href={reco.websiteUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-blue-600 font-bold hover:underline">
                        <LinkIcon className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate max-w-[200px]">{reco.websiteUrl}</span>
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  {/* Visibilities info */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tampil di:</span>
                    <div className="flex gap-1">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${reco.showToLearner ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-400'}`}>
                        Jemaah
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${reco.showToOrgAdmin ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-100 text-slate-400'}`}>
                        Biro
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${reco.showToPublic ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
                        Publik
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => router.push(`/dashboard/recommendations/edit?id=${reco.id}`)}
                      className="p-2 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all"
                      title="Edit Rekomendasi"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(reco.id)}
                      disabled={actionLoading}
                      className="p-2 text-slate-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
                      title="Hapus Rekomendasi"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* LEARNER / ORG ADMIN DIRECTORY: Beautiful 3-Column Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((reco) => (
            <div key={reco.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <RecommendationCardImage imageUrl={reco.imageUrl} type={reco.type} name={reco.name} />

                {/* Body details */}
                <div className="p-5 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-sm text-slate-800 truncate max-w-[200px]">
                      {reco.name}
                    </h3>
                    {reco.isPaid && (
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[8px] font-extrabold uppercase px-2 py-0.5 rounded-full">
                        Partner
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-550 leading-relaxed line-clamp-3">
                    {reco.description || 'Lihat penawaran eksklusif dari partner resmi kami.'}
                  </p>
                </div>
              </div>

              {/* Contact, Locations, Website link */}
              <div className="p-5 pt-0 space-y-3">
                <div className="border-t border-slate-100 pt-3 flex flex-col gap-1.5 text-[10px] text-slate-550 font-medium">
                  {reco.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{reco.location}</span>
                    </div>
                  )}
                  {reco.contactNumber && (
                    <div className="flex items-center gap-2">
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
                    className="mt-3 flex items-center justify-center gap-1.5 py-2.5 w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-[10px] rounded-lg transition-all shadow-sm uppercase tracking-wider"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Kunjungi Halaman Partner
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
