'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ApiClient } from '@bahrain/api-client';
import { 
  Plus, 
  Loader2, 
  Search, 
  FileText,
  Edit3,
  Trash2,
  Globe,
  Lock,
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const client = new ApiClient({ baseUrl: '/api/v1' });

// Independent Blog Card component with carousel support
function BlogCard({ 
  b, 
  actionLoading, 
  handleDeleteBlog 
}: { 
  b: any; 
  actionLoading: boolean; 
  handleDeleteBlog: (id: string) => void 
}) {
  const [activeImgIdx, setActiveImgIdx] = useState(0);

  // Extract all cover images from content
  let cleanContent = b.content;
  const images: string[] = [];
  const imageRegex = /^!\[cover\]\((.*?)\)\n*/gm;
  let match;
  while ((match = imageRegex.exec(cleanContent)) !== null) {
    images.push(match[1]);
  }
  cleanContent = cleanContent.replace(/^!\[cover\]\((.*?)\)\n*/gm, '');

  const nextImg = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveImgIdx(prev => (prev + 1) % images.length);
  };

  const prevImg = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveImgIdx(prev => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-5">
      {/* Blog Card Image/Slider */}
      <div className="relative w-full md:w-48 aspect-video md:aspect-square bg-slate-900 shrink-0 flex items-center justify-center group/card">
        {images.length > 0 ? (
          <>
            <Image src={images[activeImgIdx]} alt={b.title} fill className="object-cover" />
            
            {/* Carousel controls if more than 1 image */}
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={prevImg}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black text-white p-1 rounded-full opacity-0 group-hover/card:opacity-100 transition-opacity"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={nextImg}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black text-white p-1 rounded-full opacity-0 group-hover/card:opacity-100 transition-opacity"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                {/* Dot indicator */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
                  {images.map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-1 h-1 rounded-full transition-all ${
                        i === activeImgIdx ? 'bg-emerald-500 scale-125' : 'bg-white/60'
                      }`} 
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="text-slate-500 flex flex-col items-center justify-center p-4">
            <FileText className="w-8 h-8 text-slate-655" />
          </div>
        )}
        {/* Floating badge */}
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center gap-1 text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm ${
            b.published ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-white'
          }`}>
            {b.published ? <Globe className="w-2.5 h-2.5" /> : <Lock className="w-2.5 h-2.5" />}
            {b.published ? 'Public' : 'Draft'}
          </span>
        </div>
      </div>

      {/* Blog Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              {new Date(b.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} • Oleh Super Admin
            </span>
            {images.length > 1 && (
              <span className="text-[9px] bg-slate-100 border border-slate-200 text-slate-500 font-extrabold px-1.5 py-0.5 rounded uppercase">
                {images.length} Foto
              </span>
            )}
          </div>
          <h3 className="text-sm font-extrabold text-slate-900 tracking-tight leading-snug">{b.title}</h3>
          <p className="text-xs text-slate-455 line-clamp-2 md:line-clamp-3 leading-relaxed max-w-4xl">
            {cleanContent}
          </p>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">
            {cleanContent.split(' ').length} Kata
          </span>
          <div className="flex items-center gap-1">
            <Link
              href={`/dashboard/blogs/${b.id}/edit`}
              className="p-2 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all"
              title="Edit"
            >
              <Edit3 className="w-4 h-4" />
            </Link>
            <button
              onClick={() => handleDeleteBlog(b.id)}
              disabled={actionLoading}
              className="p-2 text-slate-500 hover:text-red-750 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
              title="Hapus"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BlogsPage() {
  const router = useRouter();
  const [blogs, setBlogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Search query
  const [blogSearch, setBlogSearch] = useState('');

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchBlogs = async () => {
    setIsLoading(true);
    try {
      const res = await client.getSuperAdminBlogs();
      if (res && Array.isArray(res.blogs)) {
        setBlogs(res.blogs);
      } else if (Array.isArray(res)) {
        setBlogs(res);
      } else {
        setBlogs([]);
      }
    } catch (e: any) {
      console.error(e);
      showToast('Gagal memuat data blog dari server', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDeleteBlog = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus artikel ini?')) return;
    setActionLoading(true);
    try {
      const res = await client.deleteSuperAdminBlog(id);
      if (res && res.success) {
        showToast('Artikel berhasil dihapus.');
        fetchBlogs();
      } else {
        showToast('Gagal menghapus artikel.', 'error');
      }
    } catch (e) {
      showToast('Terjadi kesalahan koneksi.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredBlogs = blogs.filter(b => 
    b.title.toLowerCase().includes(blogSearch.toLowerCase()) ||
    b.content.toLowerCase().includes(blogSearch.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest animate-pulse">Memuat Artikel Blog...</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 w-full space-y-8 bg-slate-50 min-h-screen">
      {/* Toast Alert */}
      {toast && (
        <div className={`fixed bottom-5 right-5 z-55 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg border text-xs font-bold transition-all ${
          toast.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-red-50 text-red-800 border-red-200'
        }`}>
          {toast.type === 'success' ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-red-600" />}
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <span className="px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-widest bg-red-100 text-red-850 rounded-full">
            Console Super Admin
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-2">Kelola Blog & Artikel</h1>
          <p className="text-xs text-slate-400 mt-1">Buat, sunting, dan publish materi panduan atau berita untuk ekosistem Bahrain.</p>
        </div>
        <Link
          href="/dashboard/blogs/new"
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-md shadow-sm transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Tulis Artikel Baru
        </Link>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="w-4 h-4 text-slate-450 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Cari judul atau isi artikel..."
            value={blogSearch}
            onChange={(e) => setBlogSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-md text-xs focus:ring-1 focus:ring-blue-650 focus:outline-none"
          />
        </div>
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Total: {filteredBlogs.length} Artikel
        </div>
      </div>

      {/* Blogs List */}
      {filteredBlogs.length === 0 ? (
        <div className="bg-white border border-slate-200/80 rounded-xl p-16 text-center shadow-sm">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Belum ada artikel blog yang ditulis.</h3>
          <p className="text-xs text-slate-400 mt-1">Klik tombol 'Tulis Artikel Baru' di kanan atas untuk memulai.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredBlogs.map((b) => (
            <BlogCard 
              key={b.id} 
              b={b} 
              actionLoading={actionLoading} 
              handleDeleteBlog={handleDeleteBlog} 
            />
          ))}
        </div>
      )}
    </div>
  );
}
