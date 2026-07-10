'use client';

import React, { useState, useEffect } from 'react';
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
  AlertCircle
} from 'lucide-react';

const client = new ApiClient({ baseUrl: '/api/v1' });

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Blog form state
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState<any | null>(null);
  const [blogTitle, setBlogTitle] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [blogPublished, setBlogPublished] = useState(false);

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
      if (Array.isArray(res)) {
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

  const handleOpenNewBlog = () => {
    setEditingBlog(null);
    setBlogTitle('');
    setBlogContent('');
    setBlogPublished(false);
    setShowBlogModal(true);
  };

  const handleOpenEditBlog = (blog: any) => {
    setEditingBlog(blog);
    setBlogTitle(blog.title);
    setBlogContent(blog.content);
    setBlogPublished(blog.published);
    setShowBlogModal(true);
  };

  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogTitle || !blogContent) {
      showToast('Judul dan konten harus diisi.', 'error');
      return;
    }

    setActionLoading(true);
    try {
      let res;
      if (editingBlog) {
        res = await client.updateSuperAdminBlog(editingBlog.id, {
          title: blogTitle,
          content: blogContent,
          published: blogPublished
        });
      } else {
        res = await client.createSuperAdminBlog({
          title: blogTitle,
          content: blogContent,
          published: blogPublished
        });
      }

      if (res && res.success) {
        showToast(editingBlog ? 'Artikel berhasil diperbarui!' : 'Artikel baru berhasil dibuat!');
        setShowBlogModal(false);
        fetchBlogs();
      } else {
        showToast('Gagal menyimpan artikel blog.', 'error');
      }
    } catch (e) {
      showToast('Terjadi kesalahan koneksi.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

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

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 bg-slate-50 min-h-screen">
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
        <button
          onClick={handleOpenNewBlog}
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-md shadow-sm transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Tulis Artikel Baru
        </button>
      </div>

      {/* Search and Action Bar */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari judul atau isi artikel..."
            value={blogSearch}
            onChange={(e) => setBlogSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-md text-xs focus:ring-1 focus:ring-blue-650 focus:outline-none"
          />
        </div>
      </div>

      {/* Grid of Articles */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest animate-pulse">Memuat daftar artikel...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlogs.length === 0 ? (
            <div className="col-span-full py-16 text-center text-slate-450 font-bold uppercase tracking-wider bg-white border border-slate-200 rounded-xl">
              Belum ada artikel blog yang ditulis.
            </div>
          ) : (
            filteredBlogs.map((b) => (
              <div key={b.id} className="border border-slate-200 rounded-xl p-5 hover:shadow-md transition-all bg-white flex flex-col justify-between gap-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider flex items-center gap-1 ${
                      b.published ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {b.published ? <Globe className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                      {b.published ? 'Published' : 'Draft'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold">
                      {new Date(b.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-sm leading-snug line-clamp-2">{b.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-4 leading-relaxed whitespace-pre-wrap">{b.content}</p>
                </div>
                <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
                  <button
                    onClick={() => handleOpenEditBlog(b)}
                    className="p-1.5 text-slate-500 hover:text-[#1e40af] hover:bg-blue-50 rounded transition-colors"
                    title="Edit"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteBlog(b.id)}
                    className="p-1.5 text-slate-500 hover:text-red-750 hover:bg-red-50 rounded transition-colors"
                    title="Hapus"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* BLOG EDITOR MODAL */}
      {showBlogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white border border-slate-200 rounded-xl shadow-lg w-full max-w-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-extrabold text-sm uppercase text-slate-900">
                {editingBlog ? 'Edit Artikel Blog' : 'Tulis Artikel Blog Baru'}
              </h3>
              <button 
                onClick={() => setShowBlogModal(false)}
                className="text-slate-400 hover:text-slate-900 text-xs font-bold"
              >
                Tutup
              </button>
            </div>

            <form onSubmit={handleSaveBlog} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">Judul Artikel</label>
                <input 
                  type="text" 
                  value={blogTitle}
                  onChange={(e) => setBlogTitle(e.target.value)}
                  placeholder="e.g. Tips Menjaga Kesehatan Fisik saat Wukuf"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-md text-xs focus:ring-1 focus:ring-blue-650 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">Konten Artikel</label>
                <textarea 
                  value={blogContent}
                  onChange={(e) => setBlogContent(e.target.value)}
                  placeholder="Tulis artikel lengkap di sini..."
                  rows={10}
                  className="w-full px-4 py-3 border border-slate-200 rounded-md text-xs focus:ring-1 focus:ring-blue-650 focus:outline-none leading-relaxed"
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="published" 
                  checked={blogPublished}
                  onChange={(e) => setBlogPublished(e.target.checked)}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="published" className="text-xs font-bold text-slate-700 cursor-pointer select-none">
                  Publish artikel ini secara publik ke sistem
                </label>
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-end gap-2 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setShowBlogModal(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-md"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md flex items-center gap-1.5 disabled:opacity-50"
                >
                  {actionLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Simpan Artikel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
