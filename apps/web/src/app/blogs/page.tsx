'use client';

import React, { useState, useEffect } from 'react';
import { ApiClient } from '@bahrain/api-client';
import { 
  Loader2, 
  Search, 
  FileText,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  BookOpen,
  Calendar,
  Sparkles,
  Feather
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import PublicLayout from '@/components/PublicLayout';

const client = new ApiClient({ baseUrl: '/api/v1' });

function PublicBlogCard({ b, featured = false }: { b: any; featured?: boolean }) {
  const [activeImgIdx, setActiveImgIdx] = useState(0);

  let cleanContent = b.content;
  const images: string[] = [];
  const imageRegex = /^!\[cover\]\((.*?)\)\n*/gm;
  let match;
  while ((match = imageRegex.exec(cleanContent)) !== null) {
    images.push(match[1]);
  }
  cleanContent = cleanContent.replace(/^!\[cover\]\((.*?)\)\n*/gm, '');

  const nextImg = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    setActiveImgIdx(prev => (prev + 1) % images.length);
  };
  const prevImg = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    setActiveImgIdx(prev => (prev - 1 + images.length) % images.length);
  };

  if (featured) {
    return (
      <Link href={`/blogs/${b.id}`} className="group relative col-span-full lg:col-span-2 block rounded-3xl overflow-hidden shadow-2xl bg-[#022c22]">
        {/* Image */}
        <div className="relative w-full h-[420px]">
          {images.length > 0 ? (
            <Image src={images[0]} alt={b.title} fill className="object-cover opacity-60 group-hover:opacity-70 transition-opacity duration-500 group-hover:scale-105 transition-transform duration-700" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#064e3b] to-[#022c22]" />
          )}
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#022c22] via-[#022c22]/40 to-transparent" />
          {/* Islamic geometric decor */}
          <div className="absolute top-6 right-6 opacity-15 pointer-events-none">
            <svg width="120" height="120" viewBox="0 0 100 100" fill="none" stroke="white">
              <circle cx="50" cy="50" r="45" strokeWidth="0.5"/>
              <polygon points="50,5 95,50 50,95 5,50" strokeWidth="0.5"/>
              <circle cx="50" cy="50" r="30" strokeWidth="0.5"/>
              <circle cx="50" cy="50" r="15" strokeWidth="0.5"/>
              <polygon points="50,20 80,50 50,80 20,50" strokeWidth="0.5"/>
            </svg>
          </div>
        </div>
        {/* Content overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d97706] text-white text-[10px] font-extrabold uppercase tracking-widest mb-4">
            <Sparkles className="w-3 h-3" /> Artikel Pilihan
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-white font-serif leading-tight mb-3 group-hover:text-amber-200 transition-colors duration-300">
            {b.title}
          </h2>
          <p className="text-sm text-emerald-200/70 line-clamp-2 mb-5 max-w-xl leading-relaxed">
            {cleanContent}
          </p>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-xs text-emerald-300/60">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(b.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
            <span className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 group-hover:text-amber-300 transition-colors">
              Baca Selengkapnya <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/blogs/${b.id}`} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-emerald-200 hover:-translate-y-1 flex flex-col">
      {/* Card Image */}
      <div className="relative w-full aspect-[16/9] bg-gradient-to-br from-[#064e3b] to-[#022c22] flex items-center justify-center overflow-hidden">
        {images.length > 0 ? (
          <>
            <Image src={images[activeImgIdx]} alt={b.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            {images.length > 1 && (
              <>
                <button type="button" onClick={prevImg}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button type="button" onClick={nextImg}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
                  {images.map((_, i) => (
                    <div key={i} className={`w-1 h-1 rounded-full transition-all ${i === activeImgIdx ? 'bg-emerald-400 scale-125' : 'bg-white/60'}`} />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 opacity-30">
            <Feather className="w-10 h-10 text-white" />
          </div>
        )}
        {/* Date badge */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-slate-700 text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
          {new Date(b.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6 flex-1 flex flex-col gap-3">
        <h3 className="text-base font-black text-slate-900 tracking-tight leading-snug line-clamp-2 group-hover:text-emerald-700 transition-colors duration-200 font-serif">
          {b.title}
        </h3>
        <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed flex-1">
          {cleanContent}
        </p>
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-auto">
          <span className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
            <BookOpen className="w-3 h-3 text-emerald-500" />
            Artikel Panduan
          </span>
          <span className="text-xs font-bold text-emerald-600 group-hover:text-emerald-700 inline-flex items-center gap-1 transition-colors">
            Baca <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function PublicBlogsPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [blogSearch, setBlogSearch] = useState('');

  useEffect(() => {
    client.getPublicBlogs()
      .then((res) => {
        if (res && Array.isArray(res.blogs)) setBlogs(res.blogs);
        else setBlogs([]);
      })
      .catch(() => setBlogs([]))
      .finally(() => setIsLoading(false));
  }, []);

  const filteredBlogs = blogs.filter(b =>
    b.title.toLowerCase().includes(blogSearch.toLowerCase()) ||
    b.content.toLowerCase().includes(blogSearch.toLowerCase())
  );

  const featuredBlog = filteredBlogs[0];
  const restBlogs = filteredBlogs.slice(1);

  return (
    <PublicLayout>
      {/* ── HERO SECTION ── */}
      <section className="relative bg-[#064e3b] overflow-hidden py-24 md:py-32 border-b border-[#022c22]">
        {/* Arabesque left decor */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none hidden lg:block">
          <svg width="400" height="400" viewBox="0 0 100 100" fill="none" stroke="white">
            <circle cx="50" cy="50" r="45" strokeWidth="0.5"/>
            <polygon points="50,5 95,50 50,95 5,50" strokeWidth="0.5"/>
            <polygon points="50,5 50,95" strokeWidth="0.5"/>
            <polygon points="5,50 95,50" strokeWidth="0.5"/>
            <circle cx="50" cy="50" r="30" strokeWidth="0.5"/>
            <circle cx="50" cy="50" r="15" strokeWidth="0.5"/>
          </svg>
        </div>
        {/* Arabesque right decor */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none hidden lg:block rotate-180">
          <svg width="400" height="400" viewBox="0 0 100 100" fill="none" stroke="white">
            <circle cx="50" cy="50" r="45" strokeWidth="0.5"/>
            <polygon points="50,5 95,50 50,95 5,50" strokeWidth="0.5"/>
            <polygon points="50,5 50,95" strokeWidth="0.5"/>
            <polygon points="5,50 95,50" strokeWidth="0.5"/>
            <circle cx="50" cy="50" r="30" strokeWidth="0.5"/>
            <circle cx="50" cy="50" r="15" strokeWidth="0.5"/>
          </svg>
        </div>
        {/* Subtle radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(6,78,59,0)_0%,_rgba(2,44,34,0.8)_100%)] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#d97706]/20 border border-[#d97706]/40 text-[#fbbf24] text-[10px] font-extrabold uppercase tracking-widest mb-6">
            <Feather className="w-3.5 h-3.5" /> Blog & Artikel Panduan
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white font-serif leading-[1.1] tracking-tight mb-6">
            Materi Edukasi<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fbbf24] to-[#d97706]">
              Haji & Umrah
            </span>
          </h1>
          <p className="text-base text-emerald-100/60 max-w-xl mx-auto leading-relaxed mb-10">
            Temukan panduan lengkap, berita terbaru, dan tips persiapan ibadah secara mandiri — ditulis oleh para pakar.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-lg mx-auto">
            <Search className="w-4.5 h-4.5 text-emerald-300/60 absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Cari artikel, panduan, tips..."
              value={blogSearch}
              onChange={(e) => setBlogSearch(e.target.value)}
              className="w-full bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-emerald-200/40 text-sm pl-12 pr-5 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#d97706]/60 focus:border-[#d97706]/60 transition-all"
            />
          </div>

          {/* Stats row */}
          {!isLoading && blogs.length > 0 && (
            <div className="flex items-center justify-center gap-8 mt-10">
              <div className="text-center">
                <div className="text-2xl font-black text-[#fbbf24]">{blogs.length}</div>
                <div className="text-[10px] text-emerald-300/60 uppercase tracking-widest">Artikel</div>
              </div>
              <div className="w-px h-8 bg-emerald-700" />
              <div className="text-center">
                <div className="text-2xl font-black text-[#fbbf24]">100%</div>
                <div className="text-[10px] text-emerald-300/60 uppercase tracking-widest">Gratis</div>
              </div>
              <div className="w-px h-8 bg-emerald-700" />
              <div className="text-center">
                <div className="text-2xl font-black text-[#fbbf24]">3</div>
                <div className="text-[10px] text-emerald-300/60 uppercase tracking-widest">Bahasa</div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── CONTENT SECTION ── */}
      <section className="bg-slate-50 min-h-[60vh] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-emerald-100 border-t-emerald-600 animate-spin" />
              </div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest animate-pulse">Memuat Artikel...</p>
            </div>
          ) : filteredBlogs.length === 0 ? (
            /* ── EMPTY STATE ── */
            <div className="flex flex-col items-center justify-center py-24 gap-6 text-center">
              <div className="relative w-28 h-28 rounded-full bg-emerald-50 flex items-center justify-center ring-8 ring-emerald-50/50 shadow-xl shadow-emerald-100">
                <Feather className="w-12 h-12 text-emerald-300" />
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[#d97706] flex items-center justify-center shadow-lg">
                  <Search className="w-4 h-4 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-800 mb-2">
                  {blogSearch ? 'Artikel Tidak Ditemukan' : 'Belum Ada Artikel'}
                </h3>
                <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
                  {blogSearch
                    ? `Tidak ada artikel yang cocok dengan kata kunci "${blogSearch}". Coba kata kunci lain.`
                    : 'Artikel panduan Haji & Umrah akan segera hadir. Nantikan konten berkualitas dari kami.'}
                </p>
              </div>
              {blogSearch && (
                <button
                  onClick={() => setBlogSearch('')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-full transition-colors"
                >
                  Tampilkan Semua Artikel
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Section header */}
              {!blogSearch && (
                <div className="mb-10 flex items-end justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Semua Artikel</p>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                      {filteredBlogs.length} artikel tersedia
                    </h2>
                  </div>
                </div>
              )}
              {blogSearch && (
                <div className="mb-10">
                  <p className="text-sm text-slate-500">
                    Menampilkan <span className="font-bold text-slate-900">{filteredBlogs.length}</span> hasil untuk &ldquo;<span className="font-bold text-emerald-700">{blogSearch}</span>&rdquo;
                  </p>
                </div>
              )}

              {/* Grid: Featured (first) + rest */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Featured card spans 2 cols on lg */}
                {featuredBlog && (
                  <div className="col-span-1 md:col-span-2 lg:col-span-2">
                    <PublicBlogCard b={featuredBlog} featured />
                  </div>
                )}

                {/* Second card alongside featured */}
                {restBlogs[0] && (
                  <div className="col-span-1">
                    <PublicBlogCard b={restBlogs[0]} />
                  </div>
                )}

                {/* Remaining cards in 3-col grid */}
                {restBlogs.slice(1).map((b) => (
                  <PublicBlogCard key={b.id} b={b} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ── BOTTOM CTA BANNER ── */}
      {!isLoading && (
        <section className="bg-[#064e3b] py-16 border-t border-[#022c22]">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <span className="inline-block px-3 py-1 bg-amber-500/20 border border-amber-400/30 text-amber-300 text-[10px] font-extrabold uppercase tracking-widest rounded-full mb-4">
              Siap Belajar Lebih Dalam?
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-white font-serif mb-4">
              Akses Video Panduan & Simulasi 360°
            </h2>
            <p className="text-sm text-emerald-100/60 mb-8 leading-relaxed max-w-md mx-auto">
              Daftarkan diri dan nikmati modul interaktif persiapan Haji & Umrah yang lebih lengkap.
            </p>
            <a
              href="/register"
              className="inline-flex items-center gap-2 bg-[#d97706] hover:bg-[#b45309] text-white font-bold px-8 py-3.5 rounded-full transition-all shadow-lg shadow-amber-900/30 text-sm"
            >
              Mulai Belajar Gratis <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </section>
      )}
    </PublicLayout>
  );
}
