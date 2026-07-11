'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ApiClient } from '@bahrain/api-client';
import { 
  Loader2, 
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Clock,
  User
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import PublicLayout from '@/components/PublicLayout';

const client = new ApiClient({ baseUrl: '/api/v1' });

export default function PublicBlogDetailPage() {
  const params = useParams();
  const blogId = params?.id as string;

  const [blog, setBlog] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!blogId) return;

    client.getPublicBlog(blogId)
      .then((res) => {
        if (res && res.success && res.blog) {
          setBlog(res.blog);
        } else {
          setError('Artikel tidak ditemukan.');
        }
      })
      .catch((err) => {
        console.error(err);
        setError('Gagal menghubungkan ke server.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [blogId]);

  if (isLoading) {
    return (
      <PublicLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 bg-slate-50">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest animate-pulse">Memuat Artikel...</p>
        </div>
      </PublicLayout>
    );
  }

  if (error || !blog) {
    return (
      <PublicLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 bg-slate-50 p-6 text-center">
          <p className="text-sm font-bold text-red-800 bg-red-50 px-4 py-3 rounded-lg border border-red-200">{error || 'Artikel tidak ditemukan.'}</p>
          <Link href="/blogs" className="inline-flex items-center gap-2 text-xs font-bold text-emerald-600 hover:text-emerald-700">
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Daftar Blog
          </Link>
        </div>
      </PublicLayout>
    );
  }

  // Extract all images
  let cleanContent = blog.content;
  const images: string[] = [];
  const imageRegex = /^!\[cover\]\((.*?)\)\n*/gm;
  let match;
  while ((match = imageRegex.exec(cleanContent)) !== null) {
    images.push(match[match.length - 1]);
  }
  cleanContent = cleanContent.replace(/^!\[cover\]\((.*?)\)\n*/gm, '');

  const nextImg = () => {
    setActiveImgIdx(prev => (prev + 1) % images.length);
  };

  const prevImg = () => {
    setActiveImgIdx(prev => (prev - 1 + images.length) % images.length);
  };

  return (
    <PublicLayout>
      <div className="bg-slate-50 min-h-screen">
        <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
          {/* Back link */}
          <Link 
            href="/blogs"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Daftar Blog
          </Link>

          {/* Title & Metadata */}
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight font-serif">
              {blog.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 border-y border-slate-200 py-3">
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-emerald-600" />
                Oleh Super Admin
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-600" />
                {new Date(blog.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </div>
          </div>

          {/* Cover Slider / Image */}
          {images.length > 0 && (
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-md bg-slate-900 flex items-center justify-center group/slider">
              <Image src={images[activeImgIdx]} alt={blog.title} fill className="object-cover" />
              
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prevImg}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black text-white p-2 rounded-full opacity-0 group-hover/slider:opacity-100 transition-opacity"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={nextImg}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black text-white p-2 rounded-full opacity-0 group-hover/slider:opacity-100 transition-opacity"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  {/* Dot indicator */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                    {images.map((_, i) => (
                      <div 
                        key={i} 
                        className={`w-2 h-2 rounded-full transition-all ${
                          i === activeImgIdx ? 'bg-emerald-500 scale-125' : 'bg-white/60'
                        }`} 
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Article Body */}
          <div className="prose max-w-none text-sm text-slate-800 leading-relaxed space-y-6 font-sans whitespace-pre-wrap">
            {cleanContent}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
