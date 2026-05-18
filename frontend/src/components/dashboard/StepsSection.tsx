"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import { getModuleProgress } from "@/utils/progressStore";

interface ModuleStepsState {
  videoCompleted: boolean;
  doaCompleted: boolean;
}

interface HajiModule {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  prayers: {
    title: string;
    arabic: string;
    latin: string;
    translation: string;
    audioUrl: string;
  }[];
}

const OFFICIAL_HAJI_JOURNEY: HajiModule[] = [
  {
    id: "ihram",
    name: "Modul 1: Ihram & Miqat",
    description: "Persiapan mengenakan kain ihram, larangan ihram, dan melafalkan niat Haji/Umrah di titik Miqat.",
    thumbnail: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&q=80&w=600",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-mecca-kaaba-at-night-41584-large.mp4",
    prayers: [
      {
        title: "Lafal Niat Ihram Haji",
        arabic: "نَوَيْتُ الْحَجَّ وَأَحْرَمْتُ بِهِ لِلَّهِ تَعَالَى",
        latin: "Nawaitul hajja wa ahramtu bihi lillahi ta'ala",
        translation: "Aku berniat melaksanakan ibadah haji dan berihram karena Allah Ta'ala.",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
      },
      {
        title: "Lafal Kalimat Talbiyah",
        arabic: "لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لَا شَرِيكَ لَكَ لَبَّيْكَ",
        latin: "Labaikallahumma labaik, labaika laa syarika laka labaik",
        translation: "Aku memenuhi panggilan-Mu ya Allah, aku memenuhi panggilan-Mu, tidak ada sekutu bagi-Mu.",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
      }
    ]
  },
  {
    id: "tawaf",
    name: "Modul 2: Tawaf di Ka'bah",
    description: "Mengelilingi Ka'bah sebanyak 7 putaran diawali dari garis Hajar Aswad disertai doa khusus.",
    thumbnail: "https://images.unsplash.com/photo-1565552645632-d7c5f76a16be?auto=format&fit=crop&q=80&w=600",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-mecca-kaaba-at-night-41584-large.mp4",
    prayers: [
      {
        title: "Doa Memulai Tawaf",
        arabic: "بِسْمِ اللَّهِ وَاللَّهُ أَكْبَرُ، اللَّهُمَّ إِيمَانًا بِكَ",
        latin: "Bismillahi wallahu akbar, Allahumma imanan bika",
        translation: "Dengan menyebut nama Allah, Allah Maha Besar. Ya Allah, aku beriman kepada-Mu.",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
      },
      {
        title: "Doa Sapu Jagad (Rukun Yamani)",
        arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
        latin: "Rabbana atina fid-dunya hasanatah wa fil-akhirati hasanatah wa qina 'adhaban-nar",
        translation: "Ya Tuhan kami, berilah kami kebaikan di dunia dan kebaikan di akhirat, dan lindungilah kami dari azab neraka.",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
      }
    ]
  },
  {
    id: "sai",
    name: "Modul 3: Sa'i Safa-Marwah",
    description: "Berjalan dan lari-lari kecil sebanyak 7 kali perjalanan antara Bukit Safa dan Bukit Marwah.",
    thumbnail: "https://images.unsplash.com/photo-1580835239846-5bb9ce03c8c3?auto=format&fit=crop&q=80&w=600",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-mecca-kaaba-at-night-41584-large.mp4",
    prayers: [
      {
        title: "Doa Naik Bukit Safa (Mulai Sa'i)",
        arabic: "إِنَّ الصَّفَا وَالْمَرْوَةَ مِنْ شَعَائِرِ اللَّهِ",
        latin: "Innas-safa wal-marwata min sha'a'irillah",
        translation: "Sesungguhnya Safa dan Marwah adalah sebagian dari syiar Allah.",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3"
      }
    ]
  },
  {
    id: "wukuf",
    name: "Modul 4: Wukuf di Arafah",
    description: "Berdiam diri, merenung, berzikir khusyuk, dan shalat di Padang Arafah pada 9 Dzulhijjah.",
    thumbnail: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&q=80&w=600",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-mecca-kaaba-at-night-41584-large.mp4",
    prayers: [
      {
        title: "Doa Utama Wukuf Arafah",
        arabic: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ",
        latin: "La ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamdu",
        translation: "Tidak ada Tuhan selain Allah Yang Maha Esa, tidak ada sekutu bagi-Nya. Bagi-Nya segala kerajaan dan segala puji.",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3"
      }
    ]
  },
  {
    id: "muzdalifah",
    name: "Modul 5: Mabit di Muzdalifah",
    description: "Bermalam sejenak di Muzdalifah setelah sunset dari Arafah untuk berzikir dan mencari kerikil.",
    thumbnail: "https://images.unsplash.com/photo-1542856391-010fb87dcfed?auto=format&fit=crop&q=80&w=600",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-mecca-kaaba-at-night-41584-large.mp4",
    prayers: [
      {
        title: "Zikir Mabit Muzdalifah",
        arabic: "فَاذْكُرُوا اللَّهَ عِنْدَ الْمَشْعَرِ الْحَرَامِ",
        latin: "Fadhkurullaha 'indal masy'aril haram",
        translation: "Maka berzikirlah kepada Allah di tempat yang mulia (Masy'aril Haram).",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3"
      }
    ]
  },
  {
    id: "jumrah",
    name: "Modul 6: Melontar Jumrah",
    description: "Melontar Jumrah Ula, Wustha, dan Aqabah di Jamarat menggunakan kerikil sebagai simbol perlawanan setan.",
    thumbnail: "https://images.unsplash.com/photo-1542856391-010fb87dcfed?auto=format&fit=crop&q=80&w=600",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-mecca-kaaba-at-night-41584-large.mp4",
    prayers: [
      {
        title: "Doa Melontar Jumrah",
        arabic: "بِسْمِ اللَّهِ وَاللَّهُ أَكْبَرُ، رَجْمًا لِلشَّيَاطِينِ",
        latin: "Bismillahi wallahu akbar, rajman lish-shayatini",
        translation: "Dengan menyebut nama Allah, Allah Maha Besar. Sebagai penolak setan.",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
      }
    ]
  }
];

interface StepsSectionProps {
  hideHeader?: boolean;
}

export default function StepsSection({ hideHeader = false }: StepsSectionProps) {
  const router = useRouter();
  
  // Track step-level progress for each module
  const [moduleSteps, setModuleSteps] = useState<Record<string, ModuleStepsState>>({});
  const [vrProgresses, setVrProgresses] = useState<Record<string, { progress: number; completedCount: number; total: number }>>({});
  
  // Modals active states
  const [selectedModule, setSelectedModule] = useState<HajiModule | null>(null);
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);
  const [activePrayers, setActivePrayers] = useState<HajiModule["prayers"] | null>(null);
  const [playingAudioIndex, setPlayingAudioIndex] = useState<number | null>(null);
  const [audioInstance, setAudioInstance] = useState<HTMLAudioElement | null>(null);
  
  // Video duration state
  const [watchedSeconds, setWatchedSeconds] = useState(0);
  const [videoFinished, setVideoFinished] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const videoIntervalRef = useRef<any>(null);

  // Load progress and local steps on mount
  const loadProgressData = () => {
    if (typeof window === "undefined") return;

    // 1. Get VR checklist progress from progressStore
    const vrData: Record<string, any> = {};
    OFFICIAL_HAJI_JOURNEY.forEach((m) => {
      const prog = getModuleProgress(m.id);
      const completed = prog.tasks.filter((t) => t.isCompleted).length;
      vrData[m.id] = {
        progress: prog.progress,
        completedCount: completed,
        total: prog.tasks.length
      };
    });
    setVrProgresses(vrData);

    // 2. Get local video/doa steps progress
    const storedSteps = localStorage.getItem("manasik360_module_steps");
    if (storedSteps) {
      try {
        setModuleSteps(JSON.parse(storedSteps));
      } catch (e) {
        initializeSteps();
      }
    } else {
      initializeSteps();
    }
  };

  const initializeSteps = () => {
    const initial: Record<string, ModuleStepsState> = {};
    OFFICIAL_HAJI_JOURNEY.forEach((m) => {
      // Ihram default is unlocked, but steps are incomplete
      initial[m.id] = { videoCompleted: false, doaCompleted: false };
    });
    localStorage.setItem("manasik360_module_steps", JSON.stringify(initial));
    setModuleSteps(initial);
  };

  useEffect(() => {
    loadProgressData();
    window.addEventListener("progressStoreUpdated", loadProgressData);
    return () => {
      window.removeEventListener("progressStoreUpdated", loadProgressData);
      if (audioInstance) audioInstance.pause();
    };
  }, [audioInstance]);

  // Clean up timers
  useEffect(() => {
    return () => {
      if (videoIntervalRef.current) clearInterval(videoIntervalRef.current);
    };
  }, []);

  // Web Audio success chime
  const playSuccessChime = () => {
    if (typeof window === "undefined") return;
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.12); // E5
      osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.24); // G5
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.6);
    } catch (e) {}
  };

  // Helper to compute total module progress (Video 20% + Doa 20% + VR 60%)
  const calculateTotalProgress = (moduleId: string) => {
    const steps = moduleSteps[moduleId] || { videoCompleted: false, doaCompleted: false };
    const vr = vrProgresses[moduleId] || { progress: 0 };
    
    const videoWeight = steps.videoCompleted ? 20 : 0;
    const doaWeight = steps.doaCompleted ? 20 : 0;
    const vrWeight = Math.round((vr.progress / 100) * 60);
    
    return videoWeight + doaWeight + vrWeight;
  };

  // Check if a module is unlocked (Module 1 is always unlocked; subsequent require previous module total progress = 100%)
  const isModuleUnlocked = (index: number) => {
    if (index === 0) return true;
    const prevModule = OFFICIAL_HAJI_JOURNEY[index - 1];
    return calculateTotalProgress(prevModule.id) === 100;
  };

  // Triggered when clicking a module card
  const handleModuleClick = (mod: HajiModule, index: number) => {
    if (!isModuleUnlocked(index)) {
      alert(`🔒 Modul Terkunci!\nSilakan selesaikan Modul sebelumnya terlebih dahulu sampai 100% untuk membuka perjalanan manasik Haji berikutnya sesuai rukun.`);
      return;
    }
    router.push(`/dashboard/modules/${mod.id}`);
  };

  // Handle Video Watch time ticking
  useEffect(() => {
    if (activeVideoUrl && selectedModule && !videoFinished) {
      videoIntervalRef.current = setInterval(() => {
        if (videoRef.current && !videoRef.current.paused) {
          setWatchedSeconds((prev) => {
            const next = prev + 1;
            if (next >= 10) {
              handleMarkVideoComplete();
              clearInterval(videoIntervalRef.current);
              return 10;
            }
            return next;
          });
        }
      }, 1000);
    }
    return () => {
      if (videoIntervalRef.current) clearInterval(videoIntervalRef.current);
    };
  }, [activeVideoUrl, videoFinished, selectedModule]);

  const handleMarkVideoComplete = () => {
    if (!selectedModule) return;
    setVideoFinished(true);
    playSuccessChime();

    const updated = {
      ...moduleSteps,
      [selectedModule.id]: {
        ...moduleSteps[selectedModule.id],
        videoCompleted: true
      }
    };
    setModuleSteps(updated);
    localStorage.setItem("manasik360_module_steps", JSON.stringify(updated));
  };

  // Play audio for Doa step
  const handlePlayPrayerAudio = (index: number, url: string) => {
    if (playingAudioIndex === index) {
      audioInstance?.pause();
      setPlayingAudioIndex(null);
    } else {
      if (audioInstance) audioInstance.pause();
      const newAudio = new Audio(url);
      newAudio.volume = 0.3;
      newAudio.play().catch(() => {});
      newAudio.onended = () => {
        setPlayingAudioIndex(null);
        // Automatically check off Doa once finished
        if (selectedModule) {
          handleMarkDoaComplete();
        }
      };
      setAudioInstance(newAudio);
      setPlayingAudioIndex(index);
    }
  };

  const handleMarkDoaComplete = () => {
    if (!selectedModule) return;
    playSuccessChime();
    const updated = {
      ...moduleSteps,
      [selectedModule.id]: {
        ...moduleSteps[selectedModule.id],
        doaCompleted: true
      }
    };
    setModuleSteps(updated);
    localStorage.setItem("manasik360_module_steps", JSON.stringify(updated));
  };

  return (
    <div className="space-y-8 pb-10 font-sans relative">
      {!hideHeader && (
        <div className="max-w-xl">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Jalur Perjalanan Haji</h2>
          <p className="text-gray-500 text-sm mt-2 leading-relaxed">
             Ikuti urutan bimbingan manasik di bawah secara berurutan sesuai ketentuan Rukun & Wajib Haji. Selesaikan modul sebelumnya hingga 100% untuk membuka materi berikutnya.
          </p>
        </div>
      )}

      {/* Grid of the 6 Journey Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {OFFICIAL_HAJI_JOURNEY.map((mod, i) => {
          const unlocked = isModuleUnlocked(i);
          const totalProgress = calculateTotalProgress(mod.id);
          const stepsState = moduleSteps[mod.id] || { videoCompleted: false, doaCompleted: false };
          const vr = vrProgresses[mod.id] || { completedCount: 0, total: 0 };

          return (
            <Card 
              key={mod.id} 
              onClick={() => handleModuleClick(mod, i)}
              className={`group overflow-hidden rounded-[2.5rem] border-none shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer bg-white h-full flex flex-col relative ${
                !unlocked ? 'opacity-65 select-none' : 'hover:scale-[1.01]'
              }`}
            >
              {/* Locked frosted Overlay */}
              {!unlocked && (
                <div className="absolute inset-0 bg-amber-950/5 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center p-6 text-center">
                   <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center shadow-lg border border-amber-200/50 mb-3 animate-pulse">
                     <svg className="w-6 h-6 text-amber-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/></svg>
                   </div>
                   <span className="text-xs font-black uppercase text-amber-900 tracking-widest bg-amber-100/80 px-4 py-1.5 rounded-full border border-amber-200">
                     Terkunci
                   </span>
                </div>
              )}

              {/* Module Thumbnail */}
              <div className="relative h-48 overflow-hidden bg-gray-50 shrink-0">
                <img 
                  src={mod.thumbnail} 
                  alt={mod.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[3000ms]" 
                />
                <div className="absolute top-4 right-4">
                  <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border backdrop-blur-md ${
                    totalProgress === 100 
                    ? 'bg-green-600/90 border-green-400 text-white shadow-md' 
                    : 'bg-black/30 border-white/20 text-white'
                  }`}>
                    {totalProgress === 100 ? '✓ Selesai' : `${totalProgress}% Selesai`}
                  </span>
                </div>
              </div>

              {/* Module Description & Progress */}
              <div className="p-8 flex-1 flex flex-col justify-between space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
                    {mod.name}
                  </h3>
                  <p className="text-gray-500 text-xs mt-3 leading-relaxed line-clamp-2">
                    {mod.description}
                  </p>
                </div>

                {/* Sub-steps Indicator lists */}
                <div className="space-y-3 pt-4 border-t border-gray-50">
                  <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    <span>Materi Video</span>
                    <span className={stepsState.videoCompleted ? 'text-green-600 font-extrabold' : ''}>
                      {stepsState.videoCompleted ? '✓ Selesai' : '0/1 Video'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    <span>Doa & Dzikir</span>
                    <span className={stepsState.doaCompleted ? 'text-green-600 font-extrabold' : ''}>
                      {stepsState.doaCompleted ? '✓ Selesai' : '0/1 Materi'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    <span>Simulasi VR 360°</span>
                    <span className={vr.progress === 100 ? 'text-green-600 font-extrabold' : 'text-emerald-700'}>
                      {vr.completedCount}/{mod.id === 'ihram' ? 5 : mod.id === 'tawaf' ? 5 : mod.id === 'sai' ? 6 : mod.id === 'wukuf' ? 4 : mod.id === 'muzdalifah' ? 3 : 6} Tugas
                    </span>
                  </div>

                  {/* Combined Progress bar */}
                  <div className="pt-2">
                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                       <div 
                         className={`h-full transition-all duration-[1500ms] rounded-full ${
                           totalProgress === 100 ? 'bg-green-500' : 'bg-emerald-600'
                         }`} 
                         style={{ width: `${totalProgress}%` }}
                       />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* 🗺️ Learning Path Popup Modal (The Module Learning Hub) */}
      {selectedModule && (
        <div className="fixed inset-0 z-[140] bg-black/60 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white rounded-[3.5rem] p-8 max-w-xl w-full border border-gray-50 flex flex-col space-y-8 shadow-3xl relative animate-in zoom-in-95 duration-300">
            {/* Close Button */}
            <button 
              onClick={() => setSelectedModule(null)}
              className="absolute top-6 right-6 w-10 h-10 bg-gray-50 text-gray-500 rounded-full flex items-center justify-center hover:bg-gray-100 transition-all cursor-pointer z-10"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>

            {/* Header info */}
            <div>
              <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-3.5 py-1.5 rounded-full uppercase tracking-widest border border-emerald-100/50">
                Pintu Pembelajaran Manasik
              </span>
              <h3 className="text-2xl font-bold text-gray-900 mt-4">{selectedModule.name}</h3>
              <p className="text-gray-500 text-xs mt-2 leading-relaxed">{selectedModule.description}</p>
            </div>

            {/* Steps Path Container */}
            <div className="space-y-5">
              {/* Step 1: Video Tutorial */}
              <div className="p-5 border border-gray-100 rounded-3xl bg-gray-50/50 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white ${
                    moduleSteps[selectedModule.id]?.videoCompleted ? 'bg-green-500' : 'bg-emerald-600'
                  }`}>
                    {moduleSteps[selectedModule.id]?.videoCompleted ? '✓' : '1'}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-sm">Langkah 1: Video Tutorial</h4>
                    <p className="text-[10px] text-gray-400 mt-0.5 font-medium">Tonton bimbingan visual cara pelaksanaan (20% progres)</p>
                  </div>
                </div>
                
                {moduleSteps[selectedModule.id]?.videoCompleted ? (
                  <span className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-full border border-green-200">Selesai</span>
                ) : (
                  <button 
                    onClick={() => {
                      setWatchedSeconds(0);
                      setVideoFinished(false);
                      setActiveVideoUrl(selectedModule.videoUrl);
                    }}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
                  >
                    Tonton Video
                  </button>
                )}
              </div>

              {/* Step 2: Prayers Tutorial */}
              <div className="p-5 border border-gray-100 rounded-3xl bg-gray-50/50 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white ${
                    moduleSteps[selectedModule.id]?.doaCompleted ? 'bg-green-500' : 'bg-emerald-600'
                  }`}>
                    {moduleSteps[selectedModule.id]?.doaCompleted ? '✓' : '2'}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-sm">Langkah 2: Doa & Dzikir khusus</h4>
                    <p className="text-[10px] text-gray-400 mt-0.5 font-medium">Dengarkan do'a wajib yang dibaca (20% progres)</p>
                  </div>
                </div>

                {moduleSteps[selectedModule.id]?.doaCompleted ? (
                  <span className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-full border border-green-200">Selesai</span>
                ) : (
                  <button 
                    onClick={() => {
                      setPlayingAudioIndex(null);
                      setActivePrayers(selectedModule.prayers);
                    }}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
                  >
                    Buka Doa
                  </button>
                )}
              </div>

              {/* Step 3: VR Interactive Simulation */}
              <div className="p-5 border border-gray-100 rounded-3xl bg-gray-50/50 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white ${
                    vrProgresses[selectedModule.id]?.progress === 100 ? 'bg-green-500' : 'bg-emerald-600'
                  }`}>
                    {vrProgresses[selectedModule.id]?.progress === 100 ? '✓' : '3'}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-sm">Langkah 3: Simulasi VR 360°</h4>
                    <p className="text-[10px] text-gray-400 mt-0.5 font-medium">Tuntaskan semua tugas interaktif lapangan (60% progres)</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black text-emerald-800 bg-emerald-50 px-2.5 py-1.5 rounded-lg">
                    {vrProgresses[selectedModule.id]?.completedCount || 0}/{vrProgresses[selectedModule.id]?.total || 0} Tugas
                  </span>
                  <button 
                    onClick={() => {
                      setSelectedModule(null);
                      router.push(`/dashboard/tour/viewer/${selectedModule.id}`);
                    }}
                    className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
                  >
                    Mulai VR
                  </button>
                </div>
              </div>
            </div>

            {/* Total Module Progress Gauge */}
            <div className="p-5 bg-emerald-50/50 border border-emerald-100 rounded-3xl flex items-center justify-between gap-6">
              <div>
                <p className="text-xs font-black uppercase text-emerald-700 tracking-widest">Total Progres Modul</p>
                <p className="text-[10px] text-gray-400 font-medium mt-1">Selesaikan 3 langkah di atas untuk 100% kelulusan modul ini.</p>
              </div>
              <span className="text-3xl font-black text-emerald-600">
                {calculateTotalProgress(selectedModule.id)}%
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 📹 Modal Video Player for Steps (Inner Modal) */}
      {activeVideoUrl && (
        <div className="fixed inset-0 z-[160] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white rounded-[3.5rem] p-8 max-w-xl w-full border border-gray-50 flex flex-col space-y-6 shadow-3xl relative animate-in zoom-in-95 duration-300">
            {/* Close Button */}
            <button 
              onClick={() => {
                if (!videoFinished && watchedSeconds > 0) {
                  alert("Peringatan:\nAnda belum selesai menonton minimal 10 detik. Progres bimbingan video Anda tidak akan disimpan.");
                }
                setActiveVideoUrl(null);
                setWatchedSeconds(0);
              }}
              className="absolute top-6 right-6 w-10 h-10 bg-gray-50 text-gray-500 rounded-full flex items-center justify-center hover:bg-gray-100 transition-all cursor-pointer z-10"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>

            <div>
              <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full uppercase tracking-widest border border-emerald-100/50">
                Video Tutorial Modul
              </span>
              <h4 className="text-xl font-bold text-gray-900 mt-3">{selectedModule?.name} - Pengantar</h4>
            </div>

            <div className="relative aspect-video rounded-[2.5rem] overflow-hidden bg-black shadow-lg">
              <video 
                ref={videoRef}
                src={activeVideoUrl} 
                controls 
                autoPlay
                className="w-full h-full object-cover"
              />
            </div>

            {/* Video watch duration controls */}
            <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-500">Persyaratan Kelulusan:</span>
                <span className={`text-xs font-bold ${videoFinished ? 'text-green-600' : 'text-emerald-700 animate-pulse'}`}>
                  {videoFinished 
                    ? "✅ Video Selesai Ditonton" 
                    : `⏱️ Menonton: ${watchedSeconds}s / 10s`
                  }
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 rounded-full ${videoFinished ? 'bg-green-500' : 'bg-emerald-600'}`}
                  style={{ width: `${(watchedSeconds / 10) * 100}%` }}
                />
              </div>
            </div>

            {videoFinished && (
              <button 
                onClick={() => {
                  setActiveVideoUrl(null);
                  setWatchedSeconds(0);
                }}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold transition-all uppercase tracking-widest shadow-lg shadow-emerald-950/15 cursor-pointer"
              >
                Kembali ke Portal Langkah
              </button>
            )}
          </div>
        </div>
      )}

      {/* 📖 Modal Doa & Dzikir for Steps (Inner Modal) */}
      {activePrayers && (
        <div className="fixed inset-0 z-[160] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white rounded-[3.5rem] p-8 max-w-xl w-full border border-gray-50 flex flex-col space-y-6 shadow-3xl relative animate-in zoom-in-95 duration-300">
            {/* Close Button */}
            <button 
              onClick={() => {
                if (audioInstance) audioInstance.pause();
                setPlayingAudioIndex(null);
                setActivePrayers(null);
              }}
              className="absolute top-6 right-6 w-10 h-10 bg-gray-50 text-gray-500 rounded-full flex items-center justify-center hover:bg-gray-100 transition-all cursor-pointer z-10"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>

            <div>
              <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full uppercase tracking-widest border border-emerald-100/50">
                Doa & Dzikir Rukun
              </span>
              <h4 className="text-xl font-bold text-gray-900 mt-3">{selectedModule?.name} - Doa Khusus</h4>
            </div>

            {/* List of Module specific Prayers */}
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
              {activePrayers.map((pr, idx) => (
                <div key={idx} className="p-6 bg-gray-50/50 border border-gray-100 rounded-3xl space-y-4">
                  <div className="flex items-center justify-between">
                    <h5 className="font-bold text-gray-800 text-sm">{pr.title}</h5>
                    <button 
                      onClick={() => handlePlayPrayerAudio(idx, pr.audioUrl)}
                      className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer ${
                        playingAudioIndex === idx
                        ? 'bg-emerald-600 text-white animate-pulse'
                        : 'bg-white text-emerald-700 border border-emerald-100'
                      }`}
                    >
                      {playingAudioIndex === idx ? 'Jeda Audio' : 'Dengarkan'}
                    </button>
                  </div>
                  
                  <div className="py-4 border-y border-gray-100">
                    <p className="text-2xl font-arabic text-right leading-loose text-gray-800" dir="rtl">
                      {pr.arabic}
                    </p>
                  </div>

                  <p className="text-[11px] font-bold italic text-emerald-800">
                    "{pr.latin}"
                  </p>
                  <p className="text-[10px] text-gray-500 leading-relaxed">
                    <b>Artinya:</b> {pr.translation}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-2 flex gap-4">
              <button 
                onClick={() => {
                  handleMarkDoaComplete();
                  if (audioInstance) audioInstance.pause();
                  setPlayingAudioIndex(null);
                  setActivePrayers(null);
                }}
                className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold transition-all uppercase tracking-widest shadow-lg shadow-emerald-950/15 cursor-pointer text-center"
              >
                Saya Telah Menghafal & Selesai
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
