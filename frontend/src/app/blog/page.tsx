"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ChatWidget from "@/components/dashboard/ChatWidget";

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

export default function BlogIndex() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlogs() {
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
    }
    fetchBlogs();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#fdfdfb] font-sans">
      <Navbar />

      <main className="flex-grow">
        {/* Banner Header Section */}
        <section className="relative bg-[#064e3b] overflow-hidden pt-40 pb-24 text-center">
          <div className="absolute top-0 right-0 w-1/3 h-full opacity-5 islamic-pattern pointer-events-none"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[var(--color-accent)] opacity-10 blur-[120px] rounded-full pointer-events-none"></div>
          
          <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-6">
            <span className="text-[var(--color-accent)] font-bold tracking-[0.4em] text-xs uppercase block">
              Pusat Edukasi & Artikel
            </span>
            <h1 className="text-4xl lg:text-6xl font-black text-white leading-tight uppercase">
              KABAR & PANDUAN MANASIK360
            </h1>
            <p className="text-gray-300 max-w-xl mx-auto text-base leading-relaxed">
              Jelajahi petunjuk terlengkap seputar fikih ibadah haji, tips stamina sehat, dan panduan perjalanan ibadah langsung dari pembimbing berpengalaman.
            </p>
          </div>
        </section>

        {/* Blog Post Grid Section */}
        <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-6 animate-pulse">
                  <div className="aspect-[4/3] bg-gray-200 rounded-[2rem] w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 4a2 2 0 00-2-2m2 2a2 2 0 012 2v7a2 2 0 01-2 2H9a2 2 0 01-2-2v-1"/>
              </svg>
              <h3 className="text-lg font-bold text-gray-800">Belum Ada Artikel</h3>
              <p className="text-sm text-gray-500 mt-2">Daftar artikel bimbingan akan segera diterbitkan dalam waktu dekat.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {blogs.map((post) => (
                <div key={post.id} className="group cursor-pointer flex flex-col space-y-6">
                  {/* Image Cover */}
                  <div className="relative aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-sm group-hover:shadow-xl transition-all duration-500 bg-gray-100">
                    <Image 
                      src={post.image} 
                      alt={post.title} 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute top-6 left-6 px-4 py-1.5 bg-white/90 backdrop-blur-md text-[10px] font-black uppercase tracking-widest text-[var(--color-primary)] rounded-full shadow-sm">
                      {post.category}
                    </div>
                  </div>

                  {/* Metadata and Content */}
                  <div className="space-y-3 px-2 text-left">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{post.date}</span>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-[var(--color-primary)] transition-colors leading-snug line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">
                      {post.summary}
                    </p>
                    
                    <div className="pt-2">
                      <Link 
                        href={`/blog/${post.slug}`} 
                        className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[var(--color-primary)] hover:text-emerald-700 transition-colors group/link"
                      >
                        Baca Selengkapnya
                        <svg className="w-4 h-4 transform group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
      <ChatWidget />
    </div>
  );
}
