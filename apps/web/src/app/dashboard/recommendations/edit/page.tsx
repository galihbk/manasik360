'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ApiClient } from '@bahrain/api-client';
import { 
  ArrowLeft, 
  Loader2, 
  Save, 
  Upload, 
  CheckCircle, 
  AlertCircle,
  Hotel,
  Gift,
  MapPin,
  Phone,
  ExternalLink,
  DollarSign,
  Trash2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';

const client = new ApiClient({ baseUrl: '/api/v1' });

function EditFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [loadingDetails, setLoadingDetails] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    type: 'HOTEL',
    description: '',
    location: '',
    contactNumber: '',
    websiteUrl: '',
    isPaid: true,
    isActive: true,
    showToLearner: true,
    showToOrgAdmin: true,
    showToPublic: true
  });

  const [images, setImages] = useState<string[]>([]);
  const [activePreviewIndex, setActivePreviewIndex] = useState(0);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    if (!id) {
      showToast('ID tidak valid', 'error');
      setLoadingDetails(false);
      return;
    }

    client.getAllRecommendations()
      .then(res => {
        if (res && res.success) {
          const matched = (res.recommendations || []).find((r: any) => r.id === id);
          if (matched) {
            setFormData({
              name: matched.name || '',
              type: matched.type || 'HOTEL',
              description: matched.description || '',
              location: matched.location || '',
              contactNumber: matched.contactNumber || '',
              websiteUrl: matched.websiteUrl || '',
              isPaid: matched.isPaid !== undefined ? matched.isPaid : true,
              isActive: matched.isActive !== undefined ? matched.isActive : true,
              showToLearner: matched.showToLearner !== undefined ? matched.showToLearner : true,
              showToOrgAdmin: matched.showToOrgAdmin !== undefined ? matched.showToOrgAdmin : true,
              showToPublic: matched.showToPublic !== undefined ? matched.showToPublic : true
            });

            // Parse multiple images stored as comma separated list
            if (matched.imageUrl) {
              setImages(matched.imageUrl.split(',').filter((img: string) => img.trim() !== ''));
            }
          } else {
            showToast('Rekomendasi tidak ditemukan', 'error');
          }
        } else {
          showToast('Gagal memuat detail rekomendasi', 'error');
        }
      })
      .catch(err => {
        console.error(err);
        showToast('Koneksi detail bermasalah', 'error');
      })
      .finally(() => {
        setLoadingDetails(false);
      });
  }, [id]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await client.uploadRecommendationImage(file);
      if (res && res.success && res.url) {
        setImages(prev => [...prev, res.url]);
        showToast('Gambar berhasil diunggah!');
      } else {
        showToast(res.message || 'Gagal mengunggah gambar', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Koneksi upload bermasalah', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (idxToRemove: number) => {
    setImages(prev => prev.filter((_, idx) => idx !== idxToRemove));
    if (activePreviewIndex >= images.length - 1 && activePreviewIndex > 0) {
      setActivePreviewIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !id) {
      showToast('Form tidak valid', 'error');
      return;
    }

    setActionLoading(true);
    try {
      const res = await client.updateRecommendation(id, {
        ...formData,
        imageUrl: images.join(',') // Save multiple images as comma separated list
      });
      if (res && res.success) {
        showToast('Rekomendasi berhasil diperbarui!');
        setTimeout(() => {
          router.push('/dashboard/recommendations');
        }, 1000);
      } else {
        showToast(res.message || 'Gagal menyimpan rekomendasi', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Terjadi kesalahan koneksi', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Preview navigation
  const nextPreview = (e: React.MouseEvent) => {
    e.preventDefault();
    setActivePreviewIndex(prev => (prev + 1) % images.length);
  };

  const prevPreview = (e: React.MouseEvent) => {
    e.preventDefault();
    setActivePreviewIndex(prev => (prev - 1 + images.length) % images.length);
  };

  if (loadingDetails) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3 min-h-screen">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest animate-pulse">Memuat Detail Kemitraan...</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Toast Alert */}
      {toast && (
        <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg border text-xs font-bold transition-all ${
          toast.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-red-50 text-red-800 border-red-200'
        }`}>
          {toast.type === 'success' ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-red-600" />}
          {toast.message}
        </div>
      )}

      {/* Back Button */}
      <div>
        <Link
          href="/dashboard/recommendations"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Kelola Kemitraan
        </Link>
      </div>

      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl font-extrabold text-slate-900 mt-2">Ubah Detail Kemitraan</h1>
        <p className="text-xs text-slate-400 mt-1">Ubah detail dan konfigurasi penawaran atau status pembayaran partner.</p>
      </div>

      {/* Split Screen Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Form Editor */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 bg-white border border-slate-200 rounded-xl shadow-sm p-6 space-y-6 text-xs font-bold text-slate-700">
          {/* Section 1: Basic Info */}
          <div className="space-y-4">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">Informasi Umum</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block uppercase tracking-wide text-[10px]">Nama Hotel / Souvenir</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 border border-slate-200 rounded-lg text-xs font-medium focus:ring-1 focus:ring-blue-600 focus:outline-none bg-slate-50/50 focus:bg-white"
                  placeholder="Contoh: Hilton Suites Makkah"
                />
              </div>

              <div className="space-y-2">
                <label className="block uppercase tracking-wide text-[10px]">Kategori Kemitraan</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full p-3 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-blue-600 focus:outline-none bg-slate-50/50 focus:bg-white"
                >
                  <option value="HOTEL">Hotel / Penginapan</option>
                  <option value="SOUVENIR">Oleh-oleh / Toko belanja</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block uppercase tracking-wide text-[10px]">Deskripsi / Penawaran Promo</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-3 border border-slate-200 rounded-lg text-xs font-medium focus:ring-1 focus:ring-blue-600 focus:outline-none h-24 resize-none bg-slate-50/50 focus:bg-white"
                placeholder="Diskon 10% untuk jemaah, gratis antar-jemput..."
              />
            </div>
          </div>

          {/* Section 2: Galeri Foto */}
          <div className="space-y-4">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">Galeri Foto Kemitraan (Bisa Lebih Dari 1)</h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {images.map((img, idx) => (
                <div key={idx} className="relative aspect-video rounded-lg overflow-hidden border border-slate-200 bg-slate-100 group">
                  <img src={img} alt={`Uploaded ${idx + 1}`} className="object-cover w-full h-full" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Hapus
                  </button>
                  <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[8px] font-extrabold px-1 rounded">
                    {idx + 1}
                  </span>
                </div>
              ))}
              
              <label className="aspect-video border-2 border-dashed border-slate-200 hover:border-blue-500 rounded-lg flex flex-col items-center justify-center text-slate-400 hover:text-blue-600 cursor-pointer transition-all bg-slate-55/50">
                {uploading ? (
                  <Loader2 className="w-5 h-5 mb-1 animate-spin" />
                ) : (
                  <Upload className="w-5 h-5 mb-1" />
                )}
                <span className="text-[10px] font-bold">Unggah Foto Baru</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            </div>
          </div>

          {/* Section 3: Kontak & Lokasi */}
          <div className="space-y-4">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">Kontak & Lokasi</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block uppercase tracking-wide text-[10px]">Alamat / Lokasi</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full p-3 border border-slate-200 rounded-lg text-xs font-medium focus:ring-1 focus:ring-blue-600 focus:outline-none bg-slate-55/50 focus:bg-white"
                  placeholder="Contoh: Depan Pintu Masjidil Haram"
                />
              </div>
              <div className="space-y-2">
                <label className="block uppercase tracking-wide text-[10px]">WhatsApp / Telepon</label>
                <input
                  type="text"
                  value={formData.contactNumber}
                  onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                  className="w-full p-3 border border-slate-250 rounded-lg text-xs font-medium focus:ring-1 focus:ring-blue-650 focus:outline-none bg-slate-55/50 focus:bg-white"
                  placeholder="Contoh: +966505xxxxxx"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block uppercase tracking-wide text-[10px]">Website / Link Booking</label>
              <input
                type="url"
                value={formData.websiteUrl}
                onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                className="w-full p-3 border border-slate-200 rounded-lg text-xs font-medium focus:ring-1 focus:ring-blue-650 focus:outline-none bg-slate-55/50 focus:bg-white"
                placeholder="https://www.booking.com/hotel..."
              />
            </div>
          </div>

          {/* Section 4: Target & Status Configuration */}
          <div className="space-y-4">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">Pengaturan & Visibilitas</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <span className="block uppercase tracking-widest text-[9px] text-slate-400 font-black border-b border-slate-200 pb-1">Kemitraan</span>
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formData.isPaid}
                      onChange={(e) => setFormData({ ...formData, isPaid: e.target.checked })}
                      className="w-4.5 h-4.5 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span>Sponsored Partner</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-4.5 h-4.5 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span>Tayangkan Kemitraan</span>
                  </label>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <span className="block uppercase tracking-widest text-[9px] text-slate-400 font-black border-b border-slate-200 pb-1">Target Tampilan</span>
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formData.showToLearner}
                      onChange={(e) => setFormData({ ...formData, showToLearner: e.target.checked })}
                      className="w-4.5 h-4.5 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span>Jemaah (Learner)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formData.showToOrgAdmin}
                      onChange={(e) => setFormData({ ...formData, showToOrgAdmin: e.target.checked })}
                      className="w-4.5 h-4.5 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span>Biro Admin (B2B)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formData.showToPublic}
                      onChange={(e) => setFormData({ ...formData, showToPublic: e.target.checked })}
                      className="w-4.5 h-4.5 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span>Halaman Publik</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="border-t border-slate-200 pt-5 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => router.push('/dashboard/recommendations')}
              className="px-5 py-2.5 border border-slate-250 rounded-lg text-slate-650 hover:bg-slate-50 transition-all font-extrabold"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={actionLoading || uploading}
              className="px-6 py-2.5 bg-[#1e40af] hover:bg-blue-800 text-white rounded-lg transition-all disabled:opacity-50 flex items-center gap-2 font-bold shadow-md"
            >
              {actionLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Simpan Perubahan
            </button>
          </div>
        </form>

        {/* Right Column: Real-Time Preview Card */}
        <div className="lg:col-span-5 space-y-4 sticky top-6">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Pratinjau Kartu Kemitraan (Real-Time Preview)
            </span>
            <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[8px] font-bold uppercase rounded">
              Live
            </span>
          </div>

          {/* Simulated Card on Learner Dashboard */}
          <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-md flex flex-col justify-between">
            <div>
              <div className="relative h-44 bg-slate-100 flex items-center justify-center group/preview">
                {images.length > 0 ? (
                  <>
                    <img src={images[activePreviewIndex]} alt={formData.name || 'Preview'} className="object-cover w-full h-full" />
                    
                    {/* Slider controls if more than 1 image */}
                    {images.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={prevPreview}
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black text-white p-1 rounded-full opacity-100 transition-opacity"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={nextPreview}
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black text-white p-1 rounded-full opacity-100 transition-opacity"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                        {/* Dot indicator */}
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
                          {images.map((_, i) => (
                            <div 
                              key={i} 
                              className={`w-1 h-1 rounded-full transition-all ${
                                i === activePreviewIndex ? 'bg-blue-500 scale-125' : 'bg-white/60'
                              }`} 
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="text-slate-355 flex flex-col items-center justify-center gap-1">
                    {formData.type === 'HOTEL' ? <Hotel className="w-10 h-10" /> : <Gift className="w-10 h-10" />}
                    <span className="text-[9px] font-bold uppercase text-slate-400">Belum ada foto</span>
                  </div>
                )}

                {/* Sponsored/Paid Badge */}
                {formData.isPaid && (
                  <span className="absolute bottom-3 left-3 bg-emerald-500 text-white text-[8px] font-extrabold uppercase tracking-wide px-1.5 py-0.5 rounded shadow-sm flex items-center gap-0.5">
                    <DollarSign className="w-2.5 h-2.5" /> Sponsored
                  </span>
                )}

                {/* Type Badge */}
                <span className={`absolute top-3 left-3 text-[8px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded shadow-sm text-white ${
                  formData.type === 'HOTEL' ? 'bg-indigo-600' : 'bg-amber-600'
                }`}>
                  {formData.type === 'HOTEL' ? 'Hotel' : 'Oleh-oleh'}
                </span>
              </div>

              <div className="p-5 space-y-2.5">
                <h4 className="font-extrabold text-sm text-slate-800 truncate">
                  {formData.name || 'Nama Hotel / Souvenir Pilihan...'}
                </h4>
                <p className="text-xs text-slate-500 leading-normal line-clamp-3">
                  {formData.description || 'Deskripsi atau penawaran promo partner akan muncul di sini...'}
                </p>
              </div>
            </div>

            <div className="p-5 pt-0 space-y-2">
              <div className="border-t border-slate-150 pt-2.5 flex flex-col gap-1.5 text-[10px] text-slate-550 font-medium">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-450 shrink-0" />
                  <span className="truncate">{formData.location || 'Alamat / Lokasi belum diisi...'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-455 shrink-0" />
                  <span>{formData.contactNumber || 'Nomor WhatsApp belum diisi...'}</span>
                </div>
              </div>

              <div className="mt-2.5 flex items-center justify-center gap-1.5 py-2 w-full bg-slate-900 text-white font-extrabold text-[10px] rounded-lg shadow-sm cursor-not-allowed opacity-80">
                <ExternalLink className="w-3.5 h-3.5" />
                Kunjungi Halaman Partner
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function EditRecommendationPage() {
  return (
    <div className="p-6 md:p-8 w-full bg-slate-50 min-h-screen">
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center py-20 gap-3 min-h-screen">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest animate-pulse">Menghubungkan Halaman...</p>
        </div>
      }>
        <EditFormContent />
      </Suspense>
    </div>
  );
}
