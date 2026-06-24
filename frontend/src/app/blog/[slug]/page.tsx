"use client";

import { use, useEffect, useState } from "react";
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

export default function BlogDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [allBlogs, setAllBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPostAndList() {
      try {
        const response = await fetch("/api/blogs");
        const json = await response.json();
        if (json.status === "success") {
          const found = json.data.find((p: BlogPost) => p.slug === slug);
          setPost(found || null);
          setAllBlogs(json.data);
        }
      } catch (error) {
        console.error("Failed to fetch blog post:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPostAndList();
  }, [slug]);

  // Filter other recommended blogs excluding the current active one
  const otherBlogs = allBlogs.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen bg-[#fdfdfb] font-sans">
      <Navbar />

      <main className="flex-grow pt-36 lg:pt-44">
        {loading ? (
          <div className="max-w-3xl mx-auto px-4 py-20 animate-pulse space-y-8 text-center">
            <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto"></div>
            <div className="h-10 bg-gray-200 rounded w-3/4 mx-auto"></div>
            <div className="aspect-video bg-gray-200 rounded-[2.5rem] w-full"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        ) : !post ? (
          <div className="max-w-3xl mx-auto px-4 py-32 text-center space-y-6">
            <div className="w-20 h-20 bg-rose-50 rounded-[2rem] flex items-center justify-center text-rose-500 mx-auto">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-black text-gray-900">Artikel Tidak Ditemukan</h2>
            <p className="text-gray-500">Maaf, artikel yang Anda cari tidak tersedia atau telah dihapus.</p>
            <Link 
              href="/blog" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-white font-bold rounded-xl shadow-lg transition-transform hover:scale-105"
            >
              Kembali ke Blog
            </Link>
          </div>
        ) : (
          <article className="pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              
              {/* Left Column: Entire Article Details (takes 8 cols) */}
              <div className="lg:col-span-8 space-y-8">
                
                {/* Header Content */}
                <div className="text-left space-y-4">
                  <span className="px-4 py-1.5 bg-emerald-50 text-[10px] font-black uppercase tracking-widest text-[var(--color-primary)] rounded-full inline-block shadow-sm">
                    {post.category}
                  </span>
                  <h1 className="text-3xl lg:text-5xl font-black text-gray-950 leading-tight text-left">
                    {post.title}
                  </h1>
                  <div className="flex items-center gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                    <span>Tim Bahrain</span>
                    <span>•</span>
                    <span>{post.date}</span>
                  </div>
                </div>

                {/* Cover Art */}
                <div className="relative w-full aspect-video rounded-[3rem] overflow-hidden shadow-xl bg-gray-100">
                  <Image 
                    src={post.image} 
                    alt={post.title} 
                    fill 
                    className="object-cover" 
                  />
                </div>

                {/* Article Content Body */}
                <div className="text-left space-y-12">
                  <div className="text-base text-gray-600 leading-relaxed space-y-8 font-sans">
                    {/* Intro summary block for editorial feel */}
                    <p className="text-xl text-gray-900 font-medium leading-relaxed border-l-4 border-[var(--color-accent)] pl-6 py-2">
                      {post.summary}
                    </p>
                    
                    {/* Main dynamic content */}
                    <p className="text-lg leading-loose text-gray-600">
                      {post.content}
                    </p>
                    
                    <p className="text-lg leading-loose text-gray-600">
                      Dalam mempersiapkan perjalanan suci ini, memiliki panduan yang komprehensif adalah sebuah keharusan. 
                      Teknologi visual seperti Bahrain memberikan jembatan yang sempurna untuk membiasakan diri Anda 
                      dengan tata letak geografis rukun ibadah haji, melengkapi persiapan spiritual, fisik, maupun fikih yang Anda miliki.
                    </p>
                  </div>

                  {/* Bottom Escape Navigation */}
                  <div className="pt-10 border-t border-gray-100">
                    <Link 
                      href="/blog" 
                      className="inline-flex items-center gap-3 text-xs font-black uppercase tracking-widest text-[var(--color-primary)] hover:text-emerald-700 transition-colors group"
                    >
                      <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                      </svg>
                      Kembali ke Berita & Blog
                    </Link>
                  </div>
                </div>
                
              </div>

              {/* Right Column: Sticky Sidebar starting right at the top beside the title (takes 4 cols) */}
              <div className="lg:col-span-4 lg:sticky lg:top-32 space-y-8">
                <div className="bg-[#fcfcf9] p-8 rounded-[2.5rem] border border-gray-100/50 shadow-sm space-y-6">
                  <h3 className="text-lg font-black text-gray-950 uppercase tracking-wider border-b border-gray-100 pb-4 text-left">
                    Artikel Lainnya
                  </h3>
                  
                  <div className="space-y-6">
                    {otherBlogs.length === 0 ? (
                      <p className="text-xs text-gray-400 text-left">Belum ada artikel rekomendasi lainnya.</p>
                    ) : (
                      otherBlogs.map((other) => (
                        <Link 
                          key={other.id} 
                          href={`/blog/${other.slug}`}
                          className="flex gap-4 group cursor-pointer"
                        >
                          <div className="relative w-24 h-20 rounded-2xl overflow-hidden shadow-sm shrink-0 bg-gray-100">
                            <Image 
                              src={other.image} 
                              alt={other.title} 
                              fill 
                              className="object-cover group-hover:scale-105 transition-transform duration-500" 
                            />
                          </div>
                          <div className="space-y-1.5 flex flex-col justify-center text-left">
                            <span className="text-[9px] font-black uppercase tracking-widest text-[var(--color-primary)]">
                              {other.category}
                            </span>
                            <h4 className="text-xs font-bold text-gray-900 leading-snug group-hover:text-[var(--color-primary)] transition-colors line-clamp-2">
                              {other.title}
                            </h4>
                          </div>
                        </Link>
                      ))
                    )}
                  </div>
                </div>
              </div>

            </div>
          </article>
        )}
      </main>

      <Footer />
      <ChatWidget />
    </div>
  );
}
