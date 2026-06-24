"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ChatWidget from "@/components/dashboard/ChatWidget";

interface Review {
  id: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
}

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

export default function Home() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingBlogs, setLoadingBlogs] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(true);

  useEffect(() => {
    // Fetch dynamic blogs
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
        setLoadingBlogs(false);
      }
    }

    // Fetch dynamic reviews
    async function fetchReviews() {
      try {
        const response = await fetch("/api/reviews");
        const json = await response.json();
        if (json.status === "success") {
          // Display top 3 newest testimonials on the homepage
          setReviews(json.data.slice(0, 3));
        }
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      } finally {
        setLoadingReviews(false);
      }
    }

    fetchBlogs();
    fetchReviews();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#fdfdfb]">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section - Matching Canva Style */}
        <section className="relative bg-[#064e3b] overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-32">
          <div className="absolute top-0 right-0 w-1/3 h-full opacity-5 islamic-pattern pointer-events-none"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[var(--color-accent)] opacity-10 blur-[120px] rounded-full"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
              <div className="flex-1 text-white text-center lg:text-left">
                <div className="inline-block px-4 py-1 bg-white/10 rounded-full text-xs font-bold uppercase tracking-[0.2em] mb-8 text-[var(--color-accent)] border border-white/10">
                  Immersive Digital Learning
                </div>
                <h1 className="text-5xl lg:text-7xl font-extrabold leading-[1.1] mb-10 tracking-tight">
                  PERSIAPKAN <br className="hidden lg:block"/>
                  IBADAH HAJI ANDA <br className="hidden lg:block"/>
                  SECARA <span className="text-[var(--color-accent)]">EFISIEN</span> <br className="hidden lg:block"/>
                  DAN <span className="italic font-serif">IMERSIF</span>
                </h1>
                <p className="text-xl text-gray-300 mb-12 max-w-xl leading-relaxed">
                  Bahrain menghadirkan suasana Tanah Suci langsung ke hadapan Anda melalui teknologi VR 360° yang nyata dan mendalam.
                </p>
                <div className="flex flex-wrap gap-6 justify-center lg:justify-start">
                  <Button 
                    href="/register" 
                    variant="secondary"
                    className="px-12 py-5 font-bold text-xl rounded-2xl shadow-2xl transition-transform hover:scale-105 active:scale-95"
                  >
                    Daftar Sekarang
                  </Button>
                  <Link 
                    href="#fitur" 
                    className="px-10 py-5 text-white border-2 border-white/20 rounded-2xl font-bold hover:bg-white/10 transition-all flex items-center gap-2 group"
                  >
                    Pelajari Fitur
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                  </Link>
                </div>
              </div>
              
              <div className="flex-1 relative">
                <div className="relative w-[320px] h-[320px] lg:w-[500px] lg:h-[500px] mx-auto">
                   {/* Decorative Rotating Border */}
                   <div className="absolute inset-0 border-[20px] border-[var(--color-accent)] rounded-full opacity-10 animate-[spin_10s_linear_infinite]"></div>
                   
                   {/* Main Image in Circle */}
                   <div className="absolute inset-6 rounded-full overflow-hidden border-[12px] border-white/5 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)]">
                      <Image 
                        src="/images/pilgrim-hero.png" 
                        alt="Jamaah Haji" 
                        fill
                        className="object-cover"
                        priority
                      />
                   </div>
                   
                   {/* Abstract Islamic Shape (Canva Style) */}
                   <div className="absolute -top-10 -right-10 w-40 h-40 bg-[var(--color-accent)]/20 blur-3xl rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Five Pillars Section (Lima Pilar Islam) */}
        <section id="fitur" className="py-32 bg-white relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="text-[var(--color-primary)] font-bold tracking-[0.4em] text-sm mb-4 block uppercase opacity-60">Fundamentals</span>
            <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-24 tracking-tighter uppercase">LIMA PILAR ISLAM</h2>
            
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
              {[
                { name: "Syahadat", icon: <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 21h18M3 10h18M5 10V7a2 2 0 012-2h10a2 2 0 012 2v3m-9-5V3m4 2V3M9 21v-4a1 1 0 011-1h4a1 1 0 011 1v4"/></svg>, color: "bg-emerald-50 text-emerald-600" },
                { name: "Shalat", icon: <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A10.003 10.003 0 0012 3v8h8a9.988 9.988 0 01-5.112 8.741m-5.321-4.14a9.954 9.954 0 00-1.838-1.979m2.039-4.003l1.9-1.9a2 2 0 112.828 2.828L12 10"/></svg>, color: "bg-blue-50 text-blue-600" },
                { name: "Zakat", icon: <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>, color: "bg-amber-50 text-amber-600" },
                { name: "Puasa", icon: <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>, color: "bg-indigo-50 text-indigo-600" },
                { name: "Haji", icon: <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5"/></svg>, color: "bg-rose-50 text-rose-600" }
              ].map((item, i) => (
                <div key={i} className="group cursor-pointer">
                  <div className={`w-28 h-28 lg:w-36 lg:h-36 ${item.color} rounded-full mx-auto mb-8 flex items-center justify-center group-hover:scale-110 transition-all duration-700 shadow-sm group-hover:shadow-xl`}>
                    {item.icon}
                  </div>
                  <h4 className="font-extrabold text-gray-900 uppercase tracking-[0.2em] text-sm lg:text-base">{item.name}</h4>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing / Packages Section */}
        <section id="harga" className="py-32 bg-[#f8f9f5] border-y border-gray-100 relative">
          <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] islamic-pattern pointer-events-none"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
             <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6 tracking-tight">TEMUKAN PAKET TERBAIK UNTUK ANDA</h2>
             <p className="text-gray-500 mb-20 max-w-2xl mx-auto text-lg leading-relaxed">Pilih paket pembelajaran yang sesuai dengan kebutuhan Anda dan rasakan pengalaman manasik yang lebih nyata.</p>
             
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
                {[
                  { name: "Paket Basic", price: "Gratis", features: ["1 Modul VR", "Audio Guide Basic", "Akses 7 Hari"] },
                  { name: "Paket Premium", price: "Rp 150rb", features: ["Semua Modul 360°", "AI Ustadz Virtual", "Sertifikat Digital"], highlight: true },
                  { name: "Paket Travel", price: "Custom", features: ["Dashboard Monitoring", "API Integration", "Support Prioritas"] },
                  { name: "Paket Lansia", price: "Rp 250rb", features: ["Navigasi Suara Penuh", "Kontrol Sederhana", "Bimbingan Personal"] }
                ].map((pkg, i) => (
                  <div key={i} className={`p-10 rounded-[3rem] border transition-all duration-500 flex flex-col h-full ${pkg.highlight ? 'bg-[#064e3b] text-white border-[#064e3b] shadow-2xl scale-105 z-10' : 'bg-white border-gray-100 shadow-sm hover:shadow-xl'}`}>
                     <h3 className={`text-xl font-bold mb-2 ${pkg.highlight ? 'text-white' : 'text-gray-900'}`}>{pkg.name}</h3>
                     <div className={`text-3xl font-extrabold mb-10 ${pkg.highlight ? 'text-[var(--color-accent)]' : 'text-[var(--color-primary)]'}`}>{pkg.price}</div>
                     <ul className="text-left space-y-6 mb-12 flex-grow">
                        {pkg.features.map((f, j) => (
                          <li key={j} className="flex items-center gap-4 text-sm font-medium">
                             <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${pkg.highlight ? 'bg-white/10 text-[var(--color-accent)]' : 'bg-green-50 text-green-600'}`}>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                             </div>
                             <span className={pkg.highlight ? 'text-white/80' : 'text-gray-600'}>{f}</span>
                          </li>
                        ))}
                     </ul>
                     <Button 
                        variant={pkg.highlight ? "primary" : "outline"} 
                        href="/pricing" 
                        className={`w-full py-5 rounded-2xl font-bold text-lg transition-transform hover:scale-105 ${pkg.highlight ? 'bg-[var(--color-accent)] hover:bg-[#b45309] border-none shadow-xl shadow-orange-950/40' : 'border-gray-200'}`}
                      >
                        Pilih Paket
                     </Button>
                  </div>
                ))}
             </div>
          </div>
        </section>

        {/* Why Bahrain Section */}
        <section className="py-32 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center gap-24">
              <div className="flex-1 space-y-10">
                <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 tracking-tight leading-tight uppercase">Mengapa Harus <br/> Bahrain?</h2>
                <div className="space-y-8">
                   {[
                     { t: "Akurasi Visual 100%", d: "Semua lokasi difilmkan langsung di Tanah Suci menggunakan kamera resolusi 8K." },
                     { t: "Pendampingan AI", d: "Bertanya tentang hukum manasik kapan saja dengan AI Ustadz yang terlatih." },
                     { t: "Sertifikasi Resmi", d: "Dapatkan sertifikat digital setelah menyelesaikan seluruh rangkaian simulasi." }
                   ].map((item, i) => (
                     <div key={i} className="flex gap-6">
                        <div className="w-12 h-12 bg-[#064e3b] rounded-2xl flex items-center justify-center text-white font-bold shrink-0 shadow-lg shadow-emerald-950/20">
                          {i+1}
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-gray-900 mb-2">{item.t}</h4>
                          <p className="text-gray-500 leading-relaxed">{item.d}</p>
                        </div>
                     </div>
                   ))}
                </div>
              </div>
              <div className="flex-1 w-full lg:w-auto">
                 <div className="relative aspect-video rounded-[3rem] overflow-hidden shadow-[0_48px_80px_-16px_rgba(0,0,0,0.15)] border-[12px] border-white group">
                    <Image src="/images/vr-preview.png" alt="Demo Manasik" fill className="object-cover group-hover:scale-105 transition-transform duration-[3000ms]" />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                       <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-all">
                          <svg className="w-10 h-10 text-[var(--color-primary)] fill-current ml-1" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* Dynamic Testimonials / Reviews Section */}
        <section id="testimoni" className="py-32 bg-[#f8f9f5] border-t border-gray-100 relative">
          <div className="absolute top-0 left-0 w-full h-full opacity-[0.02] islamic-pattern pointer-events-none"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center space-y-4 mb-20">
              <span className="text-[var(--color-primary)] font-bold tracking-[0.4em] text-xs uppercase opacity-60 block">
                Apa Kata Mereka?
              </span>
              <h2 className="text-3xl lg:text-5xl font-extrabold text-gray-900 tracking-tight uppercase">
                TESTIMONI TERBARU JAMAAH KAMI
              </h2>
              <p className="text-gray-500 max-w-xl mx-auto text-sm leading-relaxed">
                Dengarkan cerita jujur dari para jamaah yang telah mematangkan persiapan ibadah haji mereka bersama Bahrain.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {loadingReviews ? (
                [...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-gray-100/50 shadow-sm animate-pulse space-y-6">
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-2xl"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-3.5 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                      </div>
                    </div>
                  </div>
                ))
              ) : reviews.length === 0 ? (
                <div className="col-span-full text-center py-12 text-gray-400 text-sm">
                  Belum ada testimoni terbaru yang disubmit.
                </div>
              ) : (
                reviews.map((review) => (
                  <div key={review.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100/50 shadow-sm hover:shadow-2xl transition-all duration-500 group flex flex-col justify-between h-full">
                    <div className="space-y-6">
                      {/* Star Ratings */}
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <svg 
                            key={i} 
                            className={`w-4 h-4 ${i < review.rating ? 'text-amber-400' : 'text-gray-200'}`} 
                            fill="currentColor" 
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                          </svg>
                        ))}
                      </div>

                      {/* Comment */}
                      <p className="text-sm text-gray-500 italic leading-relaxed">
                        "{review.comment}"
                      </p>
                    </div>

                    {/* Reviewer Details */}
                    <div className="flex items-center gap-4 pt-8 mt-8 border-t border-gray-50">
                      <div className="relative w-12 h-12 rounded-2xl overflow-hidden shadow-sm shrink-0">
                        <Image src={review.avatar || "/images/pilgrim-hero.png"} alt={review.name} fill className="object-cover" />
                      </div>
                      <div className="text-left">
                        <h4 className="font-bold text-gray-900 leading-none">{review.name}</h4>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Dynamic Blog & Articles Section */}
        <section id="blog" className="py-32 bg-white relative border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center space-y-4 mb-20">
              <span className="text-[var(--color-primary)] font-bold tracking-[0.4em] text-xs uppercase opacity-60 block">
                Artikel & Berita Terbaru
              </span>
              <h2 className="text-3xl lg:text-5xl font-extrabold text-gray-900 tracking-tight uppercase">
                PANDUAN & FIKIH MANASIK TERBAIK
              </h2>
              <p className="text-gray-500 max-w-xl mx-auto text-sm leading-relaxed">
                Perkaya ilmu manasik Anda melalui kumpulan artikel panduan, fikih praktis, dan tips perjalanan haji yang dikuratori ustadz ahli.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {loadingBlogs ? (
                [...Array(3)].map((_, i) => (
                  <div key={i} className="space-y-6 animate-pulse">
                    <div className="aspect-video bg-gray-200 rounded-[2rem] w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                    </div>
                  </div>
                ))
              ) : blogs.length === 0 ? (
                <div className="col-span-full text-center py-12 text-gray-400 text-sm">
                  Belum ada artikel panduan yang diterbitkan.
                </div>
              ) : (
                blogs.map((post) => (
                  <div key={post.id} className="group cursor-pointer flex flex-col space-y-6">
                    {/* Cover Image */}
                    <div className="relative aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-sm group-hover:shadow-xl transition-all duration-500">
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

                    {/* Metadata & Content */}
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
                ))
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <ChatWidget />
    </div>
  );
}
