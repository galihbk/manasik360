"use client";

import { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import { useLanguage } from "@/context/LanguageContext";

interface Prayer {
  id: string;
  title: string;
  category: string;
  arabic: string;
  latin: string;
  translation: string;
  audioUrl: string;
}

// Locked Premium Haji & Umrah prayers to secure long-term client maintenance
const OFFICIAL_PRAYERS: Prayer[] = [
  {
    id: "niat-ihram",
    title: "Lafal Niat Ihram Haji & Umrah",
    category: "Persiapan Ihram",
    arabic: "نَوَيْتُ الْحَجَّ وَأَحْرَمْتُ بِهِ لِلَّهِ تَعَالَى",
    latin: "Nawaitul hajja wa ahramtu bihi lillahi ta'ala",
    translation: "Aku berniat melaksanakan ibadah haji dan berihram karena Allah Ta'ala.",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    id: "talbiyah",
    title: "Kalimat Talbiyah Utama",
    category: "Persiapan Ihram",
    arabic: "لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لَا شَرِيكَ لَكَ لَبَّيْكَ، إِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْكَ، لَا شَرِيكَ لَكَ",
    latin: "Labaikallahumma labaik, labaika laa syarika laka labaik, innal hamda wan ni'mata laka wal mulk, laa syarika lak",
    translation: "Aku memenuhi panggilan-Mu ya Allah, aku memenuhi panggilan-Mu. Aku memenuhi panggilan-Mu, tidak ada sekutu bagi-Mu, aku memenuhi panggilan-Mu. Sesungguhnya segala puji, nikmat dan kerajaan adalah milik-Mu, tidak ada sekutu bagi-Mu.",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  },
  {
    id: "mulai-tawaf",
    title: "Doa Memulai Hajar Aswad (Tawaf)",
    category: "Thawaf",
    arabic: "بِسْمِ اللَّهِ وَاللَّهُ أَكْبَرُ، اللَّهُمَّ إِيمَانًا بِكَ وَتَصْدِيقًا بِكِتَابِكَ وَوَفَاءً بِعَهْدِكَ",
    latin: "Bismillahi wallahu akbar, Allahumma imanan bika wa tasdiqan bikitabika wa wafa'an bi'ahdika",
    translation: "Dengan menyebut nama Allah, Allah Maha Besar. Ya Allah, aku beriman kepada-Mu, membenarkan kitab-Mu, dan memenuhi janji-Mu.",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
  },
  {
    id: "sapu-jagad",
    title: "Doa Sapu Jagad (Rukun Yamani)",
    category: "Thawaf",
    arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
    latin: "Rabbana atina fid-dunya hasanatah wa fil-akhirati hasanatah wa qina 'adhaban-nar",
    translation: "Ya Tuhan kami, berilah kami kebaikan di dunia dan kebaikan di akhirat, dan lindungilah kami dari azab neraka.",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
  },
  {
    id: "bukit-safa",
    title: "Doa Naik Bukit Safa (Mulai Sa'i)",
    category: "Sa'i",
    arabic: "إِنَّ الصَّفَا وَالْمَرْوَةَ مِنْ شَعَائِرِ اللَّهِ، أَبْبَدَأُ بِمَا بَدَأَ اللَّهُ بِهِ",
    latin: "Innas-safa wal-marwata min sha'a'irillah, abda'u bima bada'allahu bih",
    translation: "Sesungguhnya Safa dan Marwah adalah sebagian dari syiar Allah. Aku memulai dengan apa yang Allah memulai dengannya.",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3"
  },
  {
    id: "wukuf-arafah",
    title: "Doa Utama Wukuf di Arafah",
    category: "Wukuf",
    arabic: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
    latin: "La ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamdu wa huwa 'ala kulli shay'in qadir",
    translation: "Tidak ada Tuhan selain Allah Yang Maha Esa, tidak ada sekutu bagi-Nya. Bagi-Nya segala kerajaan dan bagi-Nya segala puji. Dia Maha Kuasa atas segala sesuatu.",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3"
  },
  {
    id: "lontar-jumrah",
    title: "Doa Saat Melontar Jumrah",
    category: "Lontar Jumrah",
    arabic: "بِسْمِ اللَّهِ وَاللَّهُ أَكْبَرُ، رَجْمًا لِلشَّيَاطِينِ وَرِضًا لِلرَّحْمَنِ",
    latin: "Bismillahi wallahu akbar, rajman lish-shayatini wa ridan lir-rahman",
    translation: "Dengan menyebut nama Allah, Allah Maha Besar. Lemparan ini sebagai penolak setan dan keridaan bagi Allah Yang Maha Pengasih.",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3"
  }
];

const CATEGORIES = [
  "Semua",
  "Persiapan Ihram",
  "Thawaf",
  "Sa'i",
  "Wukuf",
  "Lontar Jumrah"
];

export default function PrayersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [audioInstance, setAudioInstance] = useState<HTMLAudioElement | null>(null);
  const { t } = useLanguage();

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (audioInstance) {
        audioInstance.pause();
      }
    };
  }, [audioInstance]);

  const handlePlayAudio = (id: string, url: string) => {
    if (playingId === id) {
      audioInstance?.pause();
      setPlayingId(null);
    } else {
      if (audioInstance) {
        audioInstance.pause();
      }
      const newAudio = new Audio(url);
      newAudio.volume = 0.25;
      newAudio.play().catch(() => {});
      newAudio.onended = () => setPlayingId(null);
      setAudioInstance(newAudio);
      setPlayingId(id);
    }
  };

  const getCategoryText = (cat: string) => {
     if (cat === "Semua") return t("prayers.cat.all");
     if (cat === "Persiapan Ihram") return t("prayers.cat.ihram");
     if (cat === "Thawaf") return t("prayers.cat.tawaf");
     if (cat === "Sa'i") return t("prayers.cat.sai");
     if (cat === "Wukuf") return t("prayers.cat.wukuf");
     if (cat === "Lontar Jumrah") return t("prayers.cat.jumrah");
     return cat;
  };

  const getPrayerTitle = (id: string, defaultTitle: string) => {
     if (id === "niat-ihram") return t("prayer.ihram.title");
     if (id === "talbiyah") return t("prayer.talbiyah.title");
     if (id === "mulai-tawaf") return t("prayer.tawaf.title");
     if (id === "sapu-jagad") return t("prayer.sapujagad.title");
     if (id === "bukit-safa") return t("prayer.sai.title");
     if (id === "wukuf-arafah") return t("prayer.wukuf.title");
     if (id === "lontar-jumrah") return t("prayer.jumrah.title");
     return defaultTitle;
  };

  const getPrayerTranslation = (id: string, defaultTrans: string) => {
     if (id === "niat-ihram") return t("prayer.ihram.trans");
     if (id === "talbiyah") return t("prayer.talbiyah.trans");
     if (id === "mulai-tawaf") return t("prayer.tawaf.trans");
     if (id === "sapu-jagad") return t("prayer.sapujagad.trans");
     if (id === "bukit-safa") return t("prayer.sai.trans");
     if (id === "wukuf-arafah") return t("prayer.wukuf.trans");
     if (id === "lontar-jumrah") return t("prayer.jumrah.trans");
     return defaultTrans;
  };

  // Filter prayers based on category and search query
  const filteredPrayers = OFFICIAL_PRAYERS.filter((prayer) => {
    const matchesCategory = selectedCategory === "Semua" || prayer.category === selectedCategory;
    const matchesSearch = prayer.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          prayer.latin.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          prayer.translation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full space-y-12 pb-10 font-sans">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">{t("prayers.title")}</h1>
        <p className="text-gray-500 text-lg">{t("prayers.subtitle")}</p>
      </div>

      {/* Search & Categories */}
      <div className="space-y-6 bg-white p-6 lg:p-8 rounded-[2.5rem] shadow-sm border border-gray-50/70">
         <div className="relative group max-w-2xl">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </span>
            <input 
              type="text" 
              placeholder={t("prayers.searchPlaceholder")} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500/20 transition-all font-sans"
            />
         </div>

         {/* Category Filter Tabs */}
         <div className="flex flex-wrap gap-3 overflow-x-auto pb-2 no-scrollbar">
           {CATEGORIES.map((cat, i) => (
             <button 
               key={i} 
               onClick={() => setSelectedCategory(cat)}
               className={`px-6 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                 selectedCategory === cat 
                 ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/10 scale-105' 
                 : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-100'
               }`}
             >
               {getCategoryText(cat)}
             </button>
           ))}
         </div>
      </div>

      {/* Prayer List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
         {filteredPrayers.map((prayer) => (
           <Card key={prayer.id} className="p-8 bg-white border-none shadow-sm hover:shadow-2xl transition-all duration-500 group rounded-[2.5rem] flex flex-col h-full">
             {/* Wrap top elements in a flex-1 container to push the button section to the bottom */}
             <div className="flex-1 space-y-6 pb-6 flex flex-col">
               <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full uppercase tracking-widest border border-emerald-100/50">
                     {getCategoryText(prayer.category)}
                  </span>
                  <button className="text-gray-200 hover:text-amber-500 hover:scale-110 active:scale-95 transition-all cursor-pointer">
                     <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                  </button>
               </div>
               
               <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">{getPrayerTitle(prayer.id, prayer.title)}</h3>
                  <div className="py-6 border-y border-gray-50">
                     <p className="text-3xl font-arabic text-right leading-[2] text-gray-800 tracking-wide" dir="rtl">
                        {prayer.arabic}
                     </p>
                  </div>
               </div>

               <div className="space-y-3 flex-1">
                  <p className="text-sm font-bold italic text-emerald-800 leading-relaxed">
                     "{prayer.latin}"
                  </p>
                  <p className="text-sm text-gray-500 leading-relaxed">
                     <span className="font-bold text-gray-600">{t("prayers.meaning")}</span> {getPrayerTranslation(prayer.id, prayer.translation)}
                  </p>
               </div>
             </div>

             {/* Functional Audio Player Controls - pushed to bottom */}
             <div className="pt-6 border-t border-gray-50 flex items-center gap-4 mt-auto">
                <button 
                  onClick={() => handlePlayAudio(prayer.id, prayer.audioUrl)}
                  className={`flex-1 py-3.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    playingId === prayer.id
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/20 active:scale-95'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-700 hover:scale-[1.02] active:scale-95'
                  }`}
                >
                   {playingId === prayer.id ? (
                     <>
                       {/* Animated Playing Indicator bar icon */}
                       <div className="flex gap-0.5 items-end h-3">
                         <div className="w-0.5 bg-white animate-[bounce_0.8s_infinite] h-3"></div>
                         <div className="w-0.5 bg-white animate-[bounce_0.5s_infinite] h-2"></div>
                         <div className="w-0.5 bg-white animate-[bounce_0.7s_infinite] h-3.5"></div>
                       </div>
                       {t("prayers.btnPause")}
                     </>
                   ) : (
                     <>
                       <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                       {t("prayers.btnPlay")}
                     </>
                   )}
                </button>
                <button className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center hover:bg-emerald-100 hover:scale-105 active:scale-95 transition-all cursor-pointer">
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
                </button>
             </div>
           </Card>
         ))}

         {filteredPrayers.length === 0 && (
           <div className="col-span-full text-center py-16 bg-white rounded-[2.5rem] border border-gray-50">
             <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
             <p className="text-gray-400 text-sm">{t("prayers.noResults")}</p>
           </div>
         )}
      </div>

      {/* Helpful Tip */}
      <div className="bg-amber-50 p-8 rounded-[2.5rem] border border-amber-100 flex items-center gap-6">
         <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm shrink-0 border border-amber-100">
            <svg className="w-8 h-8 text-amber-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
         </div>
         <div>
            <h4 className="font-bold text-amber-900 mb-1">{t("prayers.tipTitle")}</h4>
            <p className="text-sm text-amber-700 leading-relaxed">
               {t("prayers.tipDesc")}
            </p>
         </div>
      </div>
    </div>
  );
}

