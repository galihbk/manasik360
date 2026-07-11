'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import PublicLayout from '@/components/PublicLayout';
import {
  Heart,
  Globe2,
  Shield,
  Zap,
  Users,
  Award,
  Target,
  Eye,
  BookOpen,
  Video,
  Compass,
  CheckCircle2,
  ArrowRight,
  Quote,
  Star,
  MapPin,
  Phone,
  Mail,
  ChevronRight
} from 'lucide-react';

/* ── Animated counter hook ── */
function useCountUp(target: number, duration = 1800, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
}

/* ── Intersection Observer hook ── */
function useInView() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return { ref, inView };
}

/* ── Stat Card ── */
function StatCard({ value, suffix, label, delay }: { value: number; suffix: string; label: string; delay: number }) {
  const { ref, inView } = useInView();
  const count = useCountUp(value, 1800, inView);
  return (
    <div ref={ref} className="text-center" style={{ animationDelay: `${delay}ms` }}>
      <div className="text-4xl lg:text-5xl font-black text-[#fbbf24] mb-1 tabular-nums">
        {count}{suffix}
      </div>
      <p className="text-xs text-white/60 uppercase tracking-widest font-medium">{label}</p>
    </div>
  );
}

/* ── Value Card ── */
function ValueCard({ icon, title, desc, color }: { icon: React.ReactNode; title: string; desc: string; color: string }) {
  return (
    <div className={`group relative bg-white border border-slate-100 rounded-2xl p-7 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden`}>
      <div className={`absolute top-0 left-0 w-1 h-full ${color} rounded-l-2xl`} />
      <div className={`w-12 h-12 rounded-xl ${color.replace('bg-', 'bg-').replace('-600', '-50')} flex items-center justify-center mb-5`}>
        {icon}
      </div>
      <h3 className="font-black text-slate-900 text-sm mb-2 tracking-tight">{title}</h3>
      <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
    </div>
  );
}

/* ── Team Card ── */
function TeamCard({ name, role, desc, initial, color }: { name: string; role: string; desc: string; initial: string; color: string }) {
  return (
    <div className="group bg-white border border-slate-100 rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center">
      <div className={`w-20 h-20 rounded-full ${color} flex items-center justify-center text-white text-2xl font-black mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
        {initial}
      </div>
      <h3 className="font-black text-slate-900 text-sm tracking-tight">{name}</h3>
      <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest mt-0.5 mb-3">{role}</p>
      <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
    </div>
  );
}

export default function AboutPage() {
  const milestones = [
    { year: '2019', title: 'Pendirian Bahrain International', desc: 'Berawal dari visi sederhana — membantu jamaah Indonesia mempersiapkan ibadah Haji & Umrah dengan lebih baik melalui teknologi.' },
    { year: '2020', title: 'Pengembangan Platform Digital', desc: 'Membangun sistem manajemen manasik berbasis web pertama yang mengintegrasikan konten edukasi interaktif.' },
    { year: '2022', title: 'Integrasi Virtual Reality 360°', desc: 'Meluncurkan fitur simulasi virtual tour Makkah & Madinah yang memungkinkan jamaah "merasakan" suasana sebelum berangkat.' },
    { year: '2024', title: 'Ekspansi & Sertifikasi', desc: 'Platform dipercaya lebih dari 50+ Travel Haji & Umrah terdaftar dan mendapat pengakuan dari Kementerian Agama RI.' },
  ];

  const values = [
    {
      icon: <Heart className="w-6 h-6 text-rose-500" />,
      title: 'Dedikasi Ibadah',
      desc: 'Setiap fitur dirancang dengan kesadaran bahwa kami melayani tamu Allah. Kualitas adalah ibadah.',
      color: 'bg-rose-500',
    },
    {
      icon: <Shield className="w-6 h-6 text-emerald-600" />,
      title: 'Amanah & Integritas',
      desc: 'Data jamaah dijaga dengan standar keamanan enterprise. Kepercayaan adalah fondasi utama kami.',
      color: 'bg-emerald-600',
    },
    {
      icon: <Zap className="w-6 h-6 text-amber-500" />,
      title: 'Inovasi Berkelanjutan',
      desc: 'Teknologi terus berkembang — kami berkomitmen menghadirkan pengalaman belajar terdepan.',
      color: 'bg-amber-500',
    },
    {
      icon: <Globe2 className="w-6 h-6 text-blue-500" />,
      title: 'Inklusif & Merata',
      desc: 'Bahasa Indonesia, Arab, dan Inggris. Kami menjangkau semua lapisan jamaah tanpa terkecuali.',
      color: 'bg-blue-500',
    },
    {
      icon: <Users className="w-6 h-6 text-purple-500" />,
      title: 'Berpusat pada Jamaah',
      desc: 'Setiap keputusan dimulai dari satu pertanyaan: apa yang terbaik untuk jamaah kami?',
      color: 'bg-purple-500',
    },
    {
      icon: <Award className="w-6 h-6 text-orange-500" />,
      title: 'Standar Tertinggi',
      desc: 'Konten kami dikurasi bersama ulama dan pembimbing berpengalaman untuk akurasi maksimal.',
      color: 'bg-orange-500',
    },
  ];

  const team = [
    { name: 'Dr. Ahmad Faruqi', role: 'CEO & Co-Founder', desc: 'Mantan pembimbing Haji Kemenag dengan 15 tahun pengalaman di bidang edukasi Islam.', initial: 'AF', color: 'bg-gradient-to-br from-emerald-600 to-[#022c22]' },
    { name: 'Siti Rahma, M.Kom', role: 'CTO & Co-Founder', desc: 'Insinyur perangkat lunak senior dengan spesialisasi edtech dan pengalaman VR immersive.', initial: 'SR', color: 'bg-gradient-to-br from-[#d97706] to-[#b45309]' },
    { name: 'Ustadz Hasan Basri', role: 'Direktur Konten', desc: 'Hafidz Quran dan pembimbing manasik berpengalaman, menjamin akurasi setiap materi.', initial: 'HB', color: 'bg-gradient-to-br from-slate-700 to-slate-900' },
    { name: 'Dewi Kartika, MBA', role: 'COO', desc: 'Memastikan operasional platform berjalan mulus untuk ratusan operator travel.', initial: 'DK', color: 'bg-gradient-to-br from-purple-600 to-purple-900' },
  ];

  const features = [
    { icon: <BookOpen className="w-5 h-5 text-emerald-600" />, label: 'Modul Manasik Lengkap' },
    { icon: <Video className="w-5 h-5 text-emerald-600" />, label: 'Video Tutorial HD' },
    { icon: <Compass className="w-5 h-5 text-emerald-600" />, label: 'Tour Virtual 360°' },
    { icon: <Award className="w-5 h-5 text-emerald-600" />, label: 'Sertifikat Digital' },
    { icon: <Users className="w-5 h-5 text-emerald-600" />, label: 'Manajemen Jamaah' },
    { icon: <Shield className="w-5 h-5 text-emerald-600" />, label: 'Keamanan Enterprise' },
  ];

  return (
    <PublicLayout>

      {/* ══════════════════════════════════════════════
          1. HERO
      ══════════════════════════════════════════════ */}
      <section className="relative bg-[#064e3b] min-h-[88vh] flex items-center overflow-hidden">
        {/* Background image with overlay */}
        <div className="absolute inset-0">
          <Image
            src="/images/about-mission.png"
            alt="Jamaah Haji di Masjidil Haram"
            fill
            priority
            className="object-cover object-center opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#022c22] via-[#064e3b]/90 to-[#022c22]/60" />
        </div>

        {/* Arabesque decors */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-8 pointer-events-none hidden xl:block">
          <svg width="500" height="500" viewBox="0 0 100 100" fill="none" stroke="white">
            <circle cx="50" cy="50" r="45" strokeWidth="0.4"/>
            <polygon points="50,5 95,50 50,95 5,50" strokeWidth="0.4"/>
            <polygon points="50,5 50,95" strokeWidth="0.4"/>
            <polygon points="5,50 95,50" strokeWidth="0.4"/>
            <circle cx="50" cy="50" r="30" strokeWidth="0.4"/>
            <circle cx="50" cy="50" r="15" strokeWidth="0.4"/>
            <polygon points="50,20 80,50 50,80 20,50" strokeWidth="0.4"/>
          </svg>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-16 items-center">
          {/* Left content */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-0.5 bg-[#d97706]" />
              <span className="text-[#fbbf24] text-xs font-extrabold uppercase tracking-widest">Tentang Kami</span>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white font-serif leading-[1.05] tracking-tight mb-8">
              Mempersiapkan<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fbbf24] to-[#d97706]">
                Tamu Allah
              </span><br />
              dengan Teknologi
            </h1>
            <p className="text-base text-emerald-100/65 leading-relaxed max-w-lg mb-10">
              Bahrain International adalah platform edukasi manasik Haji & Umrah terdepan di Indonesia — menggabungkan kearifan ulama dengan kekuatan teknologi immersive untuk pengalaman belajar yang tak terlupakan.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 bg-[#d97706] hover:bg-[#b45309] text-white font-bold px-7 py-3.5 rounded-full transition-all shadow-lg shadow-amber-900/30 text-sm"
              >
                Mulai Sekarang <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#misi"
                className="inline-flex items-center gap-2 text-emerald-100 border border-emerald-500/40 hover:border-emerald-300/60 hover:text-white font-bold px-7 py-3.5 rounded-full transition-all text-sm"
              >
                Pelajari Lebih <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Right — Feature pills */}
          <div className="hidden lg:grid grid-cols-2 gap-4">
            {features.map((f, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl px-5 py-4 flex items-center gap-3 hover:bg-white/15 transition-colors">
                <div className="w-9 h-9 rounded-lg bg-emerald-900/60 flex items-center justify-center shrink-0">
                  {f.icon}
                </div>
                <span className="text-xs font-semibold text-white/90">{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          2. STATS BAND
      ══════════════════════════════════════════════ */}
      <section className="bg-[#022c22] border-y border-[#064e3b] py-14">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          <StatCard value={50} suffix="+" label="Travel Partner" delay={0} />
          <div className="hidden md:block w-px self-stretch bg-emerald-800/50 mx-auto" />
          <StatCard value={10000} suffix="+" label="Jamaah Terdaftar" delay={200} />
          <div className="hidden md:block w-px self-stretch bg-emerald-800/50 mx-auto" />
          <StatCard value={5} suffix=" Thn" label="Pengalaman" delay={400} />
          <div className="hidden md:block w-px self-stretch bg-emerald-800/50 mx-auto" />
          <StatCard value={98} suffix="%" label="Kepuasan Jamaah" delay={600} />
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          3. VISI & MISI
      ══════════════════════════════════════════════ */}
      <section id="misi" className="py-24 md:py-32 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Image side */}
            <div className="relative">
              {/* Main image */}
              <div className="relative rounded-3xl overflow-hidden aspect-[4/3] shadow-2xl">
                <Image
                  src="/images/lobby.png"
                  alt="Fasilitas Bahrain International"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#022c22]/40 to-transparent" />
              </div>
              {/* Floating card */}
              <div className="absolute -bottom-6 -right-6 bg-[#d97706] text-white rounded-2xl p-5 shadow-2xl max-w-[200px]">
                <Quote className="w-6 h-6 mb-2 opacity-60" />
                <p className="text-xs font-semibold leading-relaxed italic">
                  "Teknologi untuk melayani tamu-tamu Allah dengan lebih baik"
                </p>
              </div>
              {/* Geometric accent */}
              <div className="absolute -top-8 -left-8 w-32 h-32 opacity-10">
                <svg viewBox="0 0 100 100" fill="none" stroke="#064e3b" strokeWidth="1">
                  <circle cx="50" cy="50" r="45"/>
                  <polygon points="50,5 95,50 50,95 5,50"/>
                  <circle cx="50" cy="50" r="25"/>
                </svg>
              </div>
            </div>

            {/* Text side */}
            <div className="space-y-10">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-0.5 bg-[#d97706]" />
                  <span className="text-[#d97706] text-[10px] font-extrabold uppercase tracking-widest">Identitas Kami</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-slate-900 font-serif tracking-tight mb-6">
                  Siapa Bahrain<br />International?
                </h2>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Didirikan pada 2019 oleh para akademisi, praktisi teknologi, dan pembimbing haji berpengalaman, Bahrain International hadir sebagai jembatan antara kesiapan spiritual dan kesiapan praktis seorang jamaah.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {/* Visi */}
                <div className="flex gap-5 p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
                  <div className="w-12 h-12 rounded-xl bg-[#064e3b] flex items-center justify-center shrink-0">
                    <Eye className="w-6 h-6 text-[#fbbf24]" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 text-sm mb-2 uppercase tracking-wide">Visi</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Menjadi platform manasik digital terpercaya di Asia Tenggara, mempersiapkan setiap jamaah menunaikan ibadah Haji & Umrah dengan sempurna dan penuh keyakinan.
                    </p>
                  </div>
                </div>

                {/* Misi */}
                <div className="flex gap-5 p-6 bg-amber-50 rounded-2xl border border-amber-100">
                  <div className="w-12 h-12 rounded-xl bg-[#d97706] flex items-center justify-center shrink-0">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 text-sm mb-2 uppercase tracking-wide">Misi</h3>
                    <ul className="space-y-1.5">
                      {[
                        'Menghadirkan konten manasik berkualitas tinggi & mudah diakses',
                        'Membangun ekosistem digital untuk seluruh stakeholder perjalanan ibadah',
                        'Memanfaatkan teknologi VR/AR untuk pengalaman belajar immersive',
                      ].map((m, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#d97706] shrink-0 mt-0.5" />
                          {m}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          4. TIMELINE / MILESTONE
      ══════════════════════════════════════════════ */}
      <section className="py-24 bg-slate-50 border-y border-slate-100">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-6 h-0.5 bg-[#d97706]" />
              <span className="text-[#d97706] text-[10px] font-extrabold uppercase tracking-widest">Perjalanan Kami</span>
              <div className="w-6 h-0.5 bg-[#d97706]" />
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 font-serif tracking-tight">
              Jejak Langkah Bahrain International
            </h2>
          </div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-slate-200 hidden md:block" />

            <div className="space-y-10">
              {milestones.map((m, i) => (
                <div key={i} className={`relative md:flex gap-8 items-start ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  {/* Content */}
                  <div className="md:w-1/2 bg-white border border-slate-100 rounded-2xl p-7 shadow-sm hover:shadow-md transition-shadow">
                    <span className="inline-block px-3 py-1 bg-[#064e3b] text-[#fbbf24] text-xs font-black rounded-full mb-3">
                      {m.year}
                    </span>
                    <h3 className="font-black text-slate-900 text-sm mb-2 tracking-tight">{m.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{m.desc}</p>
                  </div>

                  {/* Center dot */}
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 top-7 w-4 h-4 rounded-full bg-[#d97706] ring-4 ring-amber-100 shadow-md" />

                  {/* Spacer */}
                  <div className="hidden md:block md:w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          5. VALUES
      ══════════════════════════════════════════════ */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-6 h-0.5 bg-[#d97706]" />
              <span className="text-[#d97706] text-[10px] font-extrabold uppercase tracking-widest">Nilai-Nilai Kami</span>
              <div className="w-6 h-0.5 bg-[#d97706]" />
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 font-serif tracking-tight">
              Prinsip yang Menggerakkan Kami
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {values.map((v, i) => (
              <ValueCard key={i} {...v} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          6. TEAM
      ══════════════════════════════════════════════ */}
      <section className="py-24 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-6 h-0.5 bg-[#d97706]" />
              <span className="text-[#d97706] text-[10px] font-extrabold uppercase tracking-widest">Tim Kami</span>
              <div className="w-6 h-0.5 bg-[#d97706]" />
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 font-serif tracking-tight mb-4">
              Orang-Orang di Balik Bahrain
            </h2>
            <p className="text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
              Tim multidisiplin yang bersatu dalam satu misi: membantu setiap jamaah meraih haji & umrah yang mabrur.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((t, i) => (
              <TeamCard key={i} {...t} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          7. IMAGE BAND — Kaaba
      ══════════════════════════════════════════════ */}
      <section className="relative h-[400px] md:h-[520px] overflow-hidden">
        <Image
          src="/images/kaaba.png"
          alt="Masjidil Haram"
          fill
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#022c22]/90 via-[#064e3b]/70 to-[#022c22]/90" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <Quote className="w-10 h-10 text-[#fbbf24] opacity-60 mb-4" />
          <blockquote className="text-2xl md:text-4xl font-black text-white font-serif max-w-3xl leading-snug mb-4">
            "Setiap jamaah berhak mendapatkan persiapan terbaik untuk memenuhi panggilan Allah."
          </blockquote>
          <p className="text-sm text-emerald-200/60 font-medium">— Dr. Ahmad Faruqi, CEO Bahrain International</p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          8. CONTACT / CTA
      ══════════════════════════════════════════════ */}
      <section className="py-24 bg-[#064e3b]">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-0.5 bg-[#d97706]" />
              <span className="text-[#fbbf24] text-[10px] font-extrabold uppercase tracking-widest">Hubungi Kami</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white font-serif tracking-tight mb-6">
              Mari Berkolaborasi Bersama
            </h2>
            <p className="text-sm text-emerald-100/60 leading-relaxed mb-8 max-w-md">
              Apakah Anda sebuah travel Haji & Umrah yang ingin bergabung, atau jamaah yang ingin belajar? Kami siap membantu.
            </p>
            <div className="space-y-4">
              {[
                { icon: <Mail className="w-4 h-4 text-[#fbbf24]" />, label: 'info@bahrainintl.id' },
                { icon: <Phone className="w-4 h-4 text-[#fbbf24]" />, label: '+62 21 1234 5678' },
                { icon: <MapPin className="w-4 h-4 text-[#fbbf24]" />, label: 'Jakarta, Indonesia' },
              ].map((c, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-emerald-100/75">
                  <div className="w-8 h-8 rounded-lg bg-emerald-800/60 flex items-center justify-center shrink-0">
                    {c.icon}
                  </div>
                  {c.label}
                </div>
              ))}
            </div>
          </div>

          {/* Right — CTA card */}
          <div className="bg-white rounded-3xl p-8 md:p-10 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#064e3b] flex items-center justify-center">
                <Star className="w-5 h-5 text-[#fbbf24]" />
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-sm">Mulai Perjalanan Anda</h3>
                <p className="text-[10px] text-slate-400">Daftar gratis, akses langsung</p>
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed mb-6">
              Bergabunglah dengan lebih dari 10.000 jamaah yang sudah mempersiapkan ibadah Haji & Umrah mereka bersama Bahrain International.
            </p>

            <ul className="space-y-2 mb-7">
              {[
                'Akses modul manasik lengkap',
                'Simulasi virtual tour 360°',
                'Sertifikat digital terverifikasi',
                'Dukungan dari pembimbing ahli',
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-xs text-slate-600">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-3">
              <Link
                href="/register"
                className="block text-center bg-[#d97706] hover:bg-[#b45309] text-white font-bold py-3.5 rounded-full transition-all shadow-md shadow-amber-800/20 text-sm"
              >
                Daftar Gratis Sekarang
              </Link>
              <Link
                href="/login"
                className="block text-center border border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-800 font-bold py-3 rounded-full transition-all text-sm"
              >
                Sudah punya akun? Masuk
              </Link>
            </div>
          </div>
        </div>
      </section>

    </PublicLayout>
  );
}
