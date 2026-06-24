"use client";

import { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import ConfirmModal from "@/components/ui/ConfirmModal";
import Image from "next/image";
import { useToast } from "@/context/ToastContext";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  image: string;
  category: string;
  date: string;
}

export default function AdminBlogsPage() {
  const { showToast } = useToast();
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [form, setForm] = useState({
    title: "",
    summary: "",
    content: "",
    image: "",
    category: "Tips Persiapan"
  });

  // Modal State
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {}
  });

  const fetchBlogs = async () => {
    try {
      const response = await fetch("/api/blogs");
      const json = await response.json();
      if (json.status === "success") {
        setBlogs(json.data);
      }
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleCreateOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title.trim() || !form.summary.trim() || !form.content.trim()) {
      showToast("Judul, Ringkasan, dan Konten wajib diisi!", "warning");
      return;
    }

    try {
      const url = isEditing && editingId ? `/api/blogs/${editingId}` : "/api/blogs";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          title: form.title,
          summary: form.summary,
          content: form.content,
          image: form.image || undefined,
          category: form.category
        })
      });

      const json = await response.json();
      if (json.status === "success") {
        showToast(isEditing ? "Artikel berhasil diperbarui!" : "Artikel baru berhasil diterbitkan!", "success");
        fetchBlogs();
        resetForm();
      } else {
        showToast(json.message || "Gagal menyimpan artikel.", "error");
      }
    } catch (error) {
      console.error("Error saving blog:", error);
      showToast("Terjadi kesalahan koneksi server.", "error");
    }
  };

  const handleEditInit = (post: BlogPost) => {
    setIsEditing(true);
    setEditingId(post.id);
    setForm({
      title: post.title,
      summary: post.summary,
      content: post.content,
      image: post.image,
      category: post.category
    });
    // Scroll smoothly to form
    document.getElementById("blog-form-section")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleDeleteClick = (post: BlogPost) => {
    setConfirmModal({
      isOpen: true,
      title: "Hapus Artikel?",
      message: `Apakah Anda yakin ingin menghapus artikel berjudul "${post.title}"? Tindakan ini permanen.`,
      onConfirm: async () => {
        try {
          const response = await fetch(`/api/blogs/${post.id}`, {
            method: "DELETE",
            credentials: "include"
          });
          const json = await response.json();
          if (json.status === "success") {
            showToast("Artikel berhasil dihapus!", "success");
            fetchBlogs();
          } else {
            showToast(json.message || "Gagal menghapus artikel.", "error");
          }
        } catch (error) {
          console.error("Error deleting blog:", error);
          showToast("Terjadi kesalahan koneksi server.", "error");
        }
      }
    });
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditingId(null);
    setForm({
      title: "",
      summary: "",
      content: "",
      image: "",
      category: "Tips Persiapan"
    });
  };

  if (loading) {
    return <div className="p-10 text-emerald-600 font-bold animate-pulse">Memuat Manajemen Blog & Berita...</div>;
  }

  return (
    <div className="space-y-12 pb-20 text-left">
      {/* HEADER SECTION */}
      <div className="flex justify-between items-end border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Kelola Blog & Berita</h1>
          <p className="text-slate-500 text-sm mt-1">Tulis dan terbitkan artikel edukatif, panduan haji, dan tips manasik Anda.</p>
        </div>
        <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100 uppercase tracking-widest">
          Total: {blogs.length} Artikel
        </span>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12 items-start">
        {/* Left Columns: Articles List (takes 2/3 on xl) */}
        <div className="xl:col-span-2 space-y-6">
          <Card className="p-8 bg-white border border-slate-100 shadow-sm rounded-[2.5rem] space-y-6">
            <h3 className="text-lg font-black text-slate-900 tracking-tight">Daftar Artikel Aktif</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <th className="pb-4 pl-4">Sampul</th>
                    <th className="pb-4">Judul & Ringkasan</th>
                    <th className="pb-4">Kategori</th>
                    <th className="pb-4">Tanggal</th>
                    <th className="pb-4 pr-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {blogs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-400 text-sm font-semibold">
                        Belum ada artikel yang diterbitkan. Silakan tulis artikel pertama Anda!
                      </td>
                    </tr>
                  ) : (
                    blogs.map((post) => (
                      <tr key={post.id} className="group hover:bg-slate-50/50 transition-colors">
                        <td className="py-6 pl-4">
                          <div className="relative w-16 h-12 rounded-xl overflow-hidden shadow-sm bg-slate-100 shrink-0">
                            <Image 
                              src={post.image} 
                              alt={post.title} 
                              fill 
                              className="object-cover" 
                            />
                          </div>
                        </td>
                        <td className="py-6 pr-6 max-w-sm">
                          <h4 className="font-bold text-slate-900 leading-snug group-hover:text-emerald-600 transition-colors line-clamp-2">{post.title}</h4>
                          <p className="text-slate-500 text-[10px] line-clamp-2 mt-1 leading-normal">{post.summary}</p>
                        </td>
                        <td className="py-6">
                          <span className="px-3 py-1 bg-emerald-50 text-[9px] font-black text-emerald-700 uppercase tracking-wider rounded-full border border-emerald-100">
                            {post.category}
                          </span>
                        </td>
                        <td className="py-6 text-xs font-bold text-slate-400 uppercase tracking-widest">{post.date}</td>
                        <td className="py-6 pr-4 text-right space-x-2">
                          <button 
                            onClick={() => handleEditInit(post)}
                            className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                            title="Edit Artikel"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                          </button>
                          <button 
                            onClick={() => handleDeleteClick(post)}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                            title="Hapus Artikel"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Right Column: Write/Edit Form (takes 1/3 on xl) */}
        <div className="space-y-6" id="blog-form-section">
          <Card className="p-8 bg-white border border-slate-100 shadow-sm rounded-[2.5rem] space-y-6">
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                {isEditing ? "Edit Artikel" : "Tulis Artikel Baru"}
              </h3>
              <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider mt-1">
                {isEditing ? "Perbarui Konten Di Database" : "Publikasikan Ke Publik"}
              </p>
            </div>

            <form onSubmit={handleCreateOrUpdate} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-2">Judul Artikel</label>
                <input 
                  type="text" 
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Ketik judul artikel..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-150 rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500/10 shadow-sm font-semibold text-slate-800"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-2">Kategori</label>
                <select 
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-150 rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500/10 shadow-sm font-semibold text-slate-800"
                >
                  <option value="Tips Persiapan">Tips Persiapan</option>
                  <option value="Fikih Haji">Fikih Haji</option>
                  <option value="Panduan Rukun">Panduan Rukun</option>
                  <option value="Kabar KBIHU">Kabar KBIHU</option>
                  <option value="Umum">Umum</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-2">Cover Image URL (Opsional)</label>
                <input 
                  type="text" 
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="Link gambar unsplash/lainnya..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-150 rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500/10 shadow-sm font-semibold text-slate-800"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-2">Ringkasan Singkat (Summary)</label>
                <textarea 
                  value={form.summary}
                  onChange={(e) => setForm({ ...form, summary: e.target.value })}
                  placeholder="Ketik ringkasan singkat artikel..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-150 rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500/10 shadow-sm h-20 resize-none font-semibold text-slate-800"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-2">Konten Lengkap</label>
                <textarea 
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  placeholder="Tulis seluruh konten artikel secara lengkap..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-150 rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500/10 shadow-sm h-48 resize-none font-semibold text-slate-800"
                  required
                />
              </div>

              <div className="pt-4 flex gap-3">
                {isEditing && (
                  <Button 
                    type="button" 
                    onClick={resetForm}
                    className="flex-1 py-3 text-xs rounded-xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-all"
                  >
                    Batal
                  </Button>
                )}
                <Button 
                  type="submit" 
                  className="flex-grow py-3 text-xs rounded-xl bg-emerald-600 font-bold hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-900/10"
                >
                  {isEditing ? "Perbarui Artikel" : "Terbitkan Artikel"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>

      {/* CONFIRMATION MODAL */}
      <ConfirmModal 
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
      />
    </div>
  );
}
