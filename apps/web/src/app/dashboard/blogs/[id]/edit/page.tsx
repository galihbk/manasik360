'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ApiClient } from '@bahrain/api-client';
import { ArrowLeft, Loader2, Upload, FileText, Globe, Lock, Eye, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const client = new ApiClient({ baseUrl: '/api/v1' });

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const blogId = params?.id as string;

  const [blogTitle, setBlogTitle] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [blogPublished, setBlogPublished] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [activePreviewIndex, setActivePreviewIndex] = useState(0);
  
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!blogId) return;

    client.getSuperAdminBlogs()
      .then((res) => {
        if (res && Array.isArray(res.blogs)) {
          const found = res.blogs.find((b: any) => b.id === blogId);
          if (found) {
            setBlogTitle(found.title);
            
            // Extract multiple cover images from markdown if prepended
            let rawContent = found.content;
            const extractedImages: string[] = [];
            
            const imageRegex = /^!\[cover\]\((.*?)\)\n*/gm;
            let match;
            // Capture all match URLs
            while ((match = imageRegex.exec(rawContent)) !== null) {
              extractedImages.push(match[1]);
            }
            // Remove matches from main text content
            rawContent = rawContent.replace(/^!\[cover\]\((.*?)\)\n*/gm, '');

            setBlogContent(rawContent);
            setImages(extractedImages);
            setBlogPublished(found.published);
          } else {
            setError('Artikel tidak ditemukan.');
          }
        } else {
          setError('Gagal memuat data artikel.');
        }
      })
      .catch(() => {
        setError('Gagal menghubungkan ke server.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [blogId]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const filesArray = Array.from(files);
    
    const largeFiles = filesArray.filter(f => f.size > 2 * 1024 * 1024);
    if (largeFiles.length > 0) {
      setError('Beberapa file melebihi batas ukuran 2MB.');
      return;
    }

    setError('');
    const loadedImages: string[] = [];
    let processed = 0;

    filesArray.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        loadedImages.push(reader.result as string);
        processed++;
        if (processed === filesArray.length) {
          setImages(prev => [...prev, ...loadedImages]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (idxToRemove: number) => {
    setImages(prev => prev.filter((_, idx) => idx !== idxToRemove));
    if (activePreviewIndex >= images.length - 1 && activePreviewIndex > 0) {
      setActivePreviewIndex(prev => prev - 1);
    }
  };

  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogTitle || !blogContent) {
      setError('Judul dan konten harus diisi.');
      return;
    }

    setActionLoading(true);
    setError('');

    // Prepend cover images markdown to content
    const finalContent = images.length > 0
      ? images.map(img => `![cover](${img})`).join('\n') + '\n\n' + blogContent
      : blogContent;

    try {
      const res = await client.updateSuperAdminBlog(blogId, {
        title: blogTitle,
        content: finalContent,
        published: blogPublished
      });

      if (res && res.success) {
        router.push('/dashboard/blogs');
      } else {
        setError('Gagal memperbarui artikel blog.');
      }
    } catch (err) {
      setError('Terjadi kesalahan koneksi saat memperbarui artikel.');
    } finally {
      setActionLoading(false);
    }
  };

  const nextPreview = () => {
    setActivePreviewIndex(prev => (prev + 1) % images.length);
  };

  const prevPreview = () => {
    setActivePreviewIndex(prev => (prev - 1 + images.length) % images.length);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-3 bg-slate-50">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest animate-pulse">Memuat Artikel...</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 w-full bg-slate-50 min-h-screen">
      <div className="w-full space-y-6">
        {/* Back Button */}
        <div>
          <Link 
            href="/dashboard/blogs" 
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Kelola Blog
          </Link>
        </div>

        {/* Header */}
        <div className="border-b border-slate-200 pb-5">
          <h1 className="text-2xl font-extrabold text-slate-900 mt-2">Edit Artikel</h1>
          <p className="text-xs text-slate-400 mt-1">Ubah judul, tambah/hapus gambar cover, atau edit isi artikel dengan pratinjau kartu langsung.</p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-xs font-bold text-red-800">
            {error}
          </div>
        )}

        {/* Split Screen Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form Editor */}
          <form onSubmit={handleSaveBlog} className="lg:col-span-7 bg-white border border-slate-200 rounded-xl shadow-sm p-6 space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Judul Artikel</label>
              <input 
                type="text" 
                value={blogTitle}
                onChange={(e) => setBlogTitle(e.target.value)}
                placeholder="Tulis judul artikel yang menarik di sini..."
                className="w-full px-4 py-3 border border-slate-200 rounded-md text-xs focus:ring-1 focus:ring-blue-650 focus:outline-none"
                required
              />
            </div>

            {/* Multiple Images Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Galeri Gambar Artikel (Bisa lebih dari 1)</label>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                {images.map((img, idx) => (
                  <div key={idx} className="relative aspect-video rounded-lg overflow-hidden border border-slate-200 bg-slate-100 group">
                    <Image src={img} alt={`Uploaded ${idx + 1}`} fill className="object-cover" />
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
                
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-video border-2 border-dashed border-slate-200 hover:border-emerald-500 rounded-lg flex flex-col items-center justify-center text-slate-400 hover:text-emerald-600 transition-all bg-slate-50/50"
                >
                  <Upload className="w-5 h-5 mb-1" />
                  <span className="text-[10px] font-bold">Tambah Foto</span>
                </button>
              </div>

              <div className="text-[11px] text-slate-450 leading-relaxed">
                <p className="font-bold">Format: JPG, PNG, atau WEBP</p>
                <p>Maksimal ukuran file per gambar: 2MB</p>
              </div>
              
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageChange} 
                accept="image/*" 
                multiple
                className="hidden" 
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Konten Artikel</label>
              <textarea 
                value={blogContent}
                onChange={(e) => setBlogContent(e.target.value)}
                placeholder="Tulis konten lengkap artikel di sini (mendukung spasi dan paragraf)..."
                rows={12}
                className="w-full px-4 py-4 border border-slate-200 rounded-md text-xs focus:ring-1 focus:ring-blue-650 focus:outline-none leading-relaxed font-sans"
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
                Publish artikel ini secara publik ke sistem setelah disimpan
              </label>
            </div>

            <div className="pt-5 border-t border-slate-100 flex justify-end gap-2 text-xs font-bold">
              <Link
                href="/dashboard/blogs"
                className="px-5 py-3 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-md transition-all text-center"
              >
                Batal
              </Link>
              <button
                type="submit"
                disabled={actionLoading}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md flex items-center gap-1.5 disabled:opacity-50 transition-all shadow-sm"
              >
                {actionLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Simpan Perubahan'}
              </button>
            </div>
          </form>

          {/* Right Column: Live Card Preview */}
          <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-6">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wide">
              <Eye className="w-4 h-4 text-emerald-600" />
              Pratinjau Kartu Artikel (Real-time Slider)
            </div>

            {/* Simulated Card Component matching the main list design */}
            <div className="bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col">
              {/* Card Image Area */}
              <div className="relative w-full aspect-video bg-slate-900 flex items-center justify-center group/card">
                {images.length > 0 ? (
                  <>
                    <Image src={images[activePreviewIndex]} alt="Cover Preview" fill className="object-cover" />
                    
                    {/* Carousel controls if more than 1 image */}
                    {images.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={prevPreview}
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black text-white p-1 rounded-full opacity-0 group-hover/card:opacity-100 transition-opacity"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={nextPreview}
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black text-white p-1 rounded-full opacity-0 group-hover/card:opacity-100 transition-opacity"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                        {/* Dot indicator */}
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 z-10">
                          {images.map((_, i) => (
                            <div 
                              key={i} 
                              className={`w-1.5 h-1.5 rounded-full transition-all ${
                                i === activePreviewIndex ? 'bg-emerald-500 scale-125' : 'bg-white/60'
                              }`} 
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-500 p-6 text-center">
                    <FileText className="w-10 h-10 text-slate-655 mb-2" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Belum Ada Gambar Cover</span>
                  </div>
                )}
                
                {/* Floating tags */}
                <div className="absolute top-3 left-3 flex gap-1">
                  <span className={`inline-flex items-center gap-1 text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm ${
                    blogPublished ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-white'
                  }`}>
                    {blogPublished ? <Globe className="w-2.5 h-2.5" /> : <Lock className="w-2.5 h-2.5" />}
                    {blogPublished ? 'Public' : 'Draft'}
                  </span>
                </div>
              </div>

              {/* Card Content Area */}
              <div className="p-5 space-y-2">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  Update Terakhir • Oleh Super Admin
                </span>
                <h3 className="text-sm font-extrabold text-slate-900 tracking-tight line-clamp-1">
                  {blogTitle || 'Tulis Judul Artikel...'}
                </h3>
                <p className="text-xs text-slate-450 line-clamp-3 leading-relaxed">
                  {blogContent || 'Tulis konten lengkap artikel di form editor sebelah kiri untuk melihat cuplikan teks di sini...'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
