"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import { getModuleProgress, getProgressStore, updateTaskStatus } from "@/utils/progressStore";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

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
    name: "Langkah Awal: Mengenal Ihram dan Niat Haji",
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
      }
    ]
  },
  {
    id: "tawaf",
    name: "Tawaf Ifadah di Ka'bah",
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
      }
    ]
  },
  {
    id: "sai",
    name: "Sa'i Safa-Marwah",
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
    name: "Wukuf di Arafah",
    description: "Berdiam diri, merenung, berzikir khusyuk, dan shalat di Padang Arafah pada 9 Dzulhijjah.",
    thumbnail: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&q=80&w=600",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-mecca-kaaba-at-night-41584-large.mp4",
    prayers: [
      {
        title: "Doa Utama Wukuf Arafah",
        arabic: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ Lَا شَرِيكَ لَهُ",
        latin: "La ilaha illallahu wahdahu la sharika lah",
        translation: "Tidak ada Tuhan selain Allah Yang Maha Esa, tidak ada sekutu bagi-Nya.",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3"
      }
    ]
  },
  {
    id: "muzdalifah",
    name: "Mabit di Muzdalifah",
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
    name: "Melontar Jumrah di Mina",
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

export default function ModulePlayerPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const params = useParams();
  const router = useRouter();
  const moduleId = params.moduleId as string;

  const logActivity = async (title: string, type: string, icon: string, color: string) => {
    try {
      const now = new Date();
      const timeStr = now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
      const dateStr = now.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
      
      await fetch("/api/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          type,
          time: timeStr,
          date: dateStr,
          color,
          icon,
          userId: user?.id
        })
      });
      window.dispatchEvent(new Event("progressStoreUpdated"));
    } catch (error) {
      console.error("Failed to log activity:", error);
    }
  };

  const currentModule = OFFICIAL_HAJI_JOURNEY.find((m) => m.id === moduleId) || OFFICIAL_HAJI_JOURNEY[0];

  const currentIndex = OFFICIAL_HAJI_JOURNEY.findIndex(m => m.id === moduleId);
  const nextModule = currentIndex < OFFICIAL_HAJI_JOURNEY.length - 1 ? OFFICIAL_HAJI_JOURNEY[currentIndex + 1] : null;
  const prevModule = currentIndex > 0 ? OFFICIAL_HAJI_JOURNEY[currentIndex - 1] : null;

  const calculateTotalProgress = (modId: string) => {
    if (typeof window === "undefined") return 0;
    const storedSteps = localStorage.getItem("bahrain_module_steps");
    const moduleSteps = storedSteps ? JSON.parse(storedSteps) : {};
    const steps = moduleSteps[modId] || { videoCompleted: false, doaCompleted: false };
    
    const store = getProgressStore();
    const currentVr = store.find((m) => m.id === modId) || { progress: 0, tasks: [] };
    
    const videoWeight = steps.videoCompleted ? 20 : 0;
    const doaWeight = steps.doaCompleted ? 20 : 0;
    const vrWeight = Math.round((currentVr.progress / 100) * 60);
    
    return videoWeight + doaWeight + vrWeight;
  };

  const handleNextModuleClick = () => {
    if (!nextModule) {
      router.push("/dashboard/progress");
      return;
    }

    const currentModuleProgress = calculateTotalProgress(moduleId);
    if (currentModuleProgress < 100) {
      setShowLockModal(true);
      return;
    }

    router.push(`/dashboard/modules/${nextModule.id}`);
  };

  // Active step of material within this module
  // 0 = Video Pembelajaran, 1 = Doa & Dzikir Rukun, 2 = Simulasi VR 360
  const [activeStep, setActiveStep] = useState(0);

  const [isDescOpen, setIsDescOpen] = useState(true);
  const [videoCompleted, setVideoCompleted] = useState(false);
  const [doaCompleted, setDoaCompleted] = useState(false);
  const [vrProgress, setVrProgress] = useState(0);
  const [vrTasks, setVrTasks] = useState<{ id: string; title: string; isCompleted: boolean }[]>([]);
  const [isUnlocked, setIsUnlocked] = useState(true);
  const [showRedirectModal, setShowRedirectModal] = useState(false);
  const [showLockModal, setShowLockModal] = useState(false);

  // Watch trackers
  const [watchedSeconds, setWatchedSeconds] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoFinished, setVideoFinished] = useState(false);

  // Audio player
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioInstance, setAudioInstance] = useState<HTMLAudioElement | null>(null);

  // VR Iframe controller
  const [vrStarted, setVrStarted] = useState(false);

  // Load progress initially
  const loadModuleProgress = () => {
    if (typeof window === "undefined") return;

    // Load step status
    const storedSteps = localStorage.getItem("bahrain_module_steps");
    const moduleSteps = storedSteps ? JSON.parse(storedSteps) : {};
    const steps = moduleSteps[moduleId] || { videoCompleted: false, doaCompleted: false };
    
    setVideoCompleted(steps.videoCompleted);
    setVideoFinished(steps.videoCompleted);
    setDoaCompleted(steps.doaCompleted);

    // Load VR tasks status
    const store = getProgressStore();
    const currentVr = store.find((m) => m.id === moduleId) || { progress: 0, tasks: [] };
    setVrProgress(currentVr.progress);
    setVrTasks(currentVr.tasks);
  };

  useEffect(() => {
    loadModuleProgress();
    
    // Custom validation for direct URL entry
    const currentIndex = OFFICIAL_HAJI_JOURNEY.findIndex(m => m.id === moduleId);
    if (currentIndex > 0) {
      const prevModule = OFFICIAL_HAJI_JOURNEY[currentIndex - 1];
      
      const getPrevProgress = () => {
        if (typeof window === "undefined") return 0;
        const storedSteps = localStorage.getItem("bahrain_module_steps");
        const moduleSteps = storedSteps ? JSON.parse(storedSteps) : {};
        const steps = moduleSteps[prevModule.id] || { videoCompleted: false, doaCompleted: false };
        
        const store = getProgressStore();
        const currentVr = store.find((m) => m.id === prevModule.id) || { progress: 0, tasks: [] };
        
        const videoWeight = steps.videoCompleted ? 20 : 0;
        const doaWeight = steps.doaCompleted ? 20 : 0;
        const vrWeight = Math.round((currentVr.progress / 100) * 60);
        
        return videoWeight + doaWeight + vrWeight;
      };

      if (getPrevProgress() < 100) {
        setIsUnlocked(false);
        setShowRedirectModal(true);
      } else {
        setIsUnlocked(true);
        setShowRedirectModal(false);
      }
    } else {
      setIsUnlocked(true);
      setShowRedirectModal(false);
    }

    // Custom event listener for instant updates from iframe scene changes
    const handleProgressUpdate = () => {
      loadModuleProgress();
    };

    const handleVrTaskAutoChecked = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        logActivity(
          `Menyelesaikan Tugas VR: ${customEvent.detail.taskTitle} (${customEvent.detail.moduleTitle})`,
          "Simulasi",
          "vr",
          "bg-blue-500 text-white"
        );
      }
    };

    window.addEventListener("progressStoreUpdated", handleProgressUpdate);
    window.addEventListener("vrTaskAutoChecked", handleVrTaskAutoChecked);
    return () => {
      window.removeEventListener("progressStoreUpdated", handleProgressUpdate);
      window.removeEventListener("vrTaskAutoChecked", handleVrTaskAutoChecked);
      if (audioInstance) audioInstance.pause();
    };
  }, [moduleId]);

  // Video watch ticker
  useEffect(() => {
    let interval: any = null;
    if (activeStep === 0 && !videoFinished) {
      interval = setInterval(() => {
        if (videoRef.current && !videoRef.current.paused) {
          setWatchedSeconds((prev) => {
            const next = prev + 1;
            if (next >= 10) {
              markVideoAsDone();
              clearInterval(interval);
              return 10;
            }
            return next;
          });
        }
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeStep, videoFinished]);

  // Double chime audio synthesizer
  const playSuccessChime = () => {
    if (typeof window === "undefined") return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      const now = ctx.currentTime;
      const playTone = (freq: number, start: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.15, start);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + duration);
      };

      playTone(523.25, now, 0.2); // C5
      playTone(659.25, now + 0.15, 0.25); // E5
      playTone(783.99, now + 0.3, 0.4); // G5
    } catch (e) {
      console.error(e);
    }
  };

  const markVideoAsDone = () => {
    setVideoFinished(true);
    setVideoCompleted(true);
    playSuccessChime();

    const storedSteps = localStorage.getItem("bahrain_module_steps");
    const moduleSteps = storedSteps ? JSON.parse(storedSteps) : {};
    const updated = {
      ...moduleSteps,
      [moduleId]: {
        ...moduleSteps[moduleId],
        videoCompleted: true
      }
    };
    localStorage.setItem("bahrain_module_steps", JSON.stringify(updated));
    window.dispatchEvent(new Event("progressStoreUpdated"));

    // Log to backend history
    logActivity(
      `Selesai Menonton Video: ${currentModule.name}`,
      "Belajar",
      "video",
      "bg-amber-500 text-white"
    );
  };

  const markDoaAsDone = () => {
    setDoaCompleted(true);
    playSuccessChime();

    const storedSteps = localStorage.getItem("bahrain_module_steps");
    const moduleSteps = storedSteps ? JSON.parse(storedSteps) : {};
    const updated = {
      ...moduleSteps,
      [moduleId]: {
        ...moduleSteps[moduleId],
        doaCompleted: true
      }
    };
    localStorage.setItem("bahrain_module_steps", JSON.stringify(updated));
    window.dispatchEvent(new Event("progressStoreUpdated"));

    // Log to backend history
    logActivity(
      `Menghafal Doa: ${currentModule.prayers[0]?.title || "Doa Manasik"}`,
      "Hafalan",
      "book",
      "bg-emerald-500 text-white"
    );
  };

  const handlePlayDoaAudio = () => {
    if (audioPlaying) {
      audioInstance?.pause();
      setAudioPlaying(false);
    } else {
      const prayer = currentModule.prayers[0];
      const audio = new Audio(prayer.audioUrl);
      audio.volume = 0.4;
      audio.play().catch(() => {});
      audio.onended = () => {
        setAudioPlaying(false);
        markDoaAsDone();
      };
      setAudioInstance(audio);
      setAudioPlaying(true);
    }
  };

  // Cross-frame VR task completed listener
  useEffect(() => {
    const handleSceneMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === "VR_SCENE_CHANGED") {
        const sceneName = event.data.sceneName;
        // Search through unresolved tasks for keywords matching the sceneName
        const targetTasks = vrTasks.filter(t => !t.isCompleted);
        
        let didUpdate = false;
        targetTasks.forEach(task => {
          const lowerScene = sceneName.toLowerCase();
          const lowerTaskTitle = task.title.toLowerCase();
          
          if (lowerScene.includes("miqat") && lowerTaskTitle.includes("miqat")) {
            updateTaskStatus(moduleId, task.id, true);
            didUpdate = true;
          } else if (lowerScene.includes("tawaf") && lowerTaskTitle.includes("tawaf")) {
            updateTaskStatus(moduleId, task.id, true);
            didUpdate = true;
          } else if (lowerScene.includes("ka'bah") && lowerTaskTitle.includes("ka'bah")) {
            updateTaskStatus(moduleId, task.id, true);
            didUpdate = true;
          } else if (lowerScene.includes("safa") && lowerTaskTitle.includes("safa")) {
            updateTaskStatus(moduleId, task.id, true);
            didUpdate = true;
          } else if (lowerScene.includes("marwah") && lowerTaskTitle.includes("marwah")) {
            updateTaskStatus(moduleId, task.id, true);
            didUpdate = true;
          } else if (lowerScene.includes("arafah") && lowerTaskTitle.includes("arafah")) {
            updateTaskStatus(moduleId, task.id, true);
            didUpdate = true;
          } else if (lowerScene.includes("muzdalifah") && lowerTaskTitle.includes("muzdalifah")) {
            updateTaskStatus(moduleId, task.id, true);
            didUpdate = true;
          } else if (lowerScene.includes("jumrah") && lowerTaskTitle.includes("jumrah")) {
            updateTaskStatus(moduleId, task.id, true);
            didUpdate = true;
          }
        });

        if (didUpdate) {
          playSuccessChime();
          loadModuleProgress();
        }
      }
    };

    window.addEventListener("message", handleSceneMessage);
    return () => {
      window.removeEventListener("message", handleSceneMessage);
    };
  }, [vrTasks, moduleId]);

  if (showRedirectModal) {
    return (
      <div className="fixed inset-0 w-screen h-screen min-h-screen bg-black/60 backdrop-blur-md z-[600] flex items-center justify-center p-4 animate-in fade-in duration-300">
        <Card className="w-full max-w-md bg-white rounded-[3rem] p-8 lg:p-12 shadow-2xl relative text-center space-y-8 animate-in slide-in-from-bottom-8 duration-500 border-none">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-20 h-20 bg-amber-50 rounded-[2rem] flex items-center justify-center text-amber-500 animate-pulse">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
            </div>
            <h3 className="text-2xl font-black text-gray-950">Modul Terkunci!</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Anda tidak dapat mengakses modul ini langsung. Selesaikan modul sebelumnya hingga 100% terlebih dahulu untuk membuka petualangan ini!
            </p>
          </div>
          <button
            onClick={() => router.push("/dashboard/progress")}
            className="w-full py-4 bg-[var(--color-primary)] text-white rounded-2xl font-bold text-sm shadow-xl shadow-emerald-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 uppercase tracking-widest"
          >
            Kembali ke Progress
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 pb-12 font-sans text-gray-900 bg-gray-50/50 min-h-screen">
      
      {/* Back to Progress Escape Link (At the very top left, close to sidebar boundary) */}
      <div className="flex justify-start pl-2">
        <button 
          onClick={() => router.push("/dashboard/progress")}
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors cursor-pointer group"
        >
          <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform text-gray-400 group-hover:text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"/></svg>
          Kembali ke Progress
        </button>
      </div>

      {/* 1. Header Navigation Bar (Matches Canva precisely) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/70 backdrop-blur-md p-6 rounded-[2.5rem] shadow-sm border border-gray-100/60">
        <div className="flex items-center gap-4">
          {moduleId !== 'ihram' && prevModule && (
            <button 
              onClick={() => router.push(`/dashboard/modules/${prevModule.id}`)} 
              className="w-10 h-10 bg-gray-50 border border-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors shadow-sm cursor-pointer"
              title={`Kembali ke ${prevModule.name}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"/></svg>
            </button>
          )}
          <div className="space-y-0.5">
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700">Modul {moduleId === 'ihram' ? '1' : moduleId === 'tawaf' ? '2' : moduleId === 'sai' ? '3' : moduleId === 'wukuf' ? '4' : moduleId === 'muzdalifah' ? '5' : '6'}</span>
            <h1 className="text-xl font-bold text-gray-900 leading-tight">{currentModule.name}</h1>
          </div>
        </div>

        {/* Top Right Navigation Panel (Matches Left Side layout perfectly) */}
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block space-y-0.5">
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700">
              {nextModule ? `Modul ${currentIndex + 2}` : 'Selesai'}
            </span>
            <h4 className="text-xl font-bold text-gray-900 leading-tight">
              {nextModule ? nextModule.name : 'Selesai Belajar'}
            </h4>
          </div>
          
          <button 
            onClick={handleNextModuleClick}
            className="w-10 h-10 bg-gray-50 border border-gray-100 rounded-full flex items-center justify-center text-gray-650 hover:bg-gray-100 transition-colors shadow-sm cursor-pointer shrink-0"
            title={nextModule ? `Lanjut ke ${nextModule.name}` : 'Selesai Belajar'}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>

      {/* 2. Main Area: Media Player Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (Main Player - 8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="p-6 md:p-8 bg-white border-none shadow-sm rounded-[2.5rem] overflow-hidden">
            
            {/* Active Material Tag */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-amber-50 text-amber-700 text-[10px] font-black uppercase tracking-widest rounded-lg border border-amber-100/50">
                  {activeStep === 0 ? 'Berlangsung' : activeStep === 1 ? 'Mempelajari Doa' : 'Simulasi Aktif'}
                </span>
                <span className="px-3 py-1 bg-gray-50 text-gray-500 text-[10px] font-black uppercase tracking-widest rounded-lg border border-gray-100">
                  {activeStep === 0 ? 'Materi Video' : activeStep === 1 ? 'Doa & Dzikir' : 'Virtual Reality'}
                </span>
              </div>
              <p className="text-xs font-bold text-gray-400">
                {activeStep === 0 ? 'Video Pembelajaran' : activeStep === 1 ? 'Buku Doa Digital' : '360° VR Tour'}
              </p>
            </div>

            {/* Title above player */}
            <h2 className="text-2xl font-black text-gray-900 mb-6 leading-tight">
              {activeStep === 0 
                ? `1. Video Pengantar: ${currentModule.prayers[0].title}`
                : activeStep === 1
                ? `2. Lafal Doa Rukun: ${currentModule.prayers[0].title}`
                : `3. Simulasi Interaktif VR 360°`
              }
            </h2>

            {/* PLAYER ELEMENT */}
            <div className="w-full aspect-video bg-slate-900 rounded-[2rem] overflow-hidden relative border border-slate-800 shadow-inner group">
              
              {/* IF STEP 0: VIDEO */}
              {activeStep === 0 && (
                <div className="w-full h-full relative">
                  <video 
                    ref={videoRef}
                    src={currentModule.videoUrl} 
                    className="w-full h-full object-cover" 
                    controls
                  />
                  {!videoCompleted && (
                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/10 text-white text-[10px] font-black tracking-wider flex items-center gap-2">
                      <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
                      Tonton minimal 10 detik ({watchedSeconds}/10s)
                    </div>
                  )}
                </div>
              )}

              {/* IF STEP 1: DOA */}
              {activeStep === 1 && (
                <div className="w-full h-full bg-gradient-to-br from-emerald-950 via-teal-900 to-slate-950 flex flex-col justify-between p-8 md:p-12 text-white">
                  <div className="text-center space-y-6 flex-1 flex flex-col justify-center">
                    <p className="text-3xl md:text-4xl font-arabic leading-[1.8] text-amber-200 drop-shadow">
                      {currentModule.prayers[0].arabic}
                    </p>
                    <p className="text-xs md:text-sm italic text-teal-150 max-w-xl mx-auto font-sans leading-relaxed text-teal-200">
                      "{currentModule.prayers[0].latin}"
                    </p>
                    <p className="text-[10px] md:text-xs text-slate-350 max-w-lg mx-auto leading-relaxed text-slate-300">
                      Artinya: {currentModule.prayers[0].translation}
                    </p>
                  </div>

                  {/* Audio Controls Block */}
                  <div className="flex items-center justify-between border-t border-white/10 pt-6">
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={handlePlayDoaAudio}
                        className="w-12 h-12 bg-amber-500 hover:bg-amber-600 text-slate-900 rounded-2xl flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                      >
                        {audioPlaying ? (
                          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                        ) : (
                          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                        )}
                      </button>
                      <div>
                        <h4 className="text-xs font-bold">{currentModule.prayers[0].title}</h4>
                        <p className="text-[9px] text-slate-400">Putar Audio Pengucapan Rukun</p>
                      </div>
                    </div>
                    
                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border ${
                      doaCompleted 
                      ? 'bg-green-500/10 border-green-500/20 text-green-400' 
                      : 'bg-white/5 border-white/10 text-slate-400'
                    }`}>
                      {doaCompleted ? '✓ Selesai' : 'Mendengarkan'}
                    </span>
                  </div>
                </div>
              )}

              {/* IF STEP 2: VR SIMULATION */}
              {activeStep === 2 && (
                <div className="w-full h-full relative">
                  <div className="absolute inset-0 bg-cover bg-center flex flex-col items-center justify-center text-center p-8 z-20" style={{ backgroundImage: `url(${currentModule.thumbnail})` }}>
                    <div className="absolute inset-0 bg-emerald-950/80 backdrop-blur-sm"></div>
                    <div className="relative z-10 space-y-6 max-w-md">
                      <div className="w-20 h-20 bg-amber-500 text-slate-900 rounded-full flex items-center justify-center shadow-2xl mx-auto border-4 border-white/20 animate-pulse hover:scale-105 transition-transform cursor-pointer" onClick={() => router.push(`/dashboard/tour/viewer/${moduleId}`)}>
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/></svg>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-black text-white">Simulasi Interaktif VR 360°</h3>
                        <p className="text-xs text-emerald-200">Tekan tombol di bawah untuk meluncurkan panorama masjid dalam layar penuh (immersive) dan memulai deteksi otomatis rukun manasik.</p>
                      </div>
                      <button 
                        onClick={() => router.push(`/dashboard/tour/viewer/${moduleId}`)}
                        className="px-8 py-3.5 bg-amber-500 hover:bg-amber-600 text-slate-900 text-xs font-black uppercase tracking-widest rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer font-sans"
                      >
                        Klik untuk memulai
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Bottom Actions Panel */}
            <div className="flex items-center justify-between mt-6 border-t border-gray-100 pt-6">
              <button 
                onClick={() => showToast("Fitur feedback aktif. Komentar Anda membantu membimbing jamaah lain!", "info")}
                className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-black uppercase tracking-widest rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-md shadow-slate-950/10 cursor-pointer"
              >
                Tinggalkan Komentar
              </button>

              <label className="flex items-center gap-3 cursor-pointer select-none group">
                <input 
                  type="checkbox"
                  checked={activeStep === 0 ? videoCompleted : activeStep === 1 ? doaCompleted : vrProgress === 100}
                  onChange={() => {
                    if (activeStep === 0) {
                      if (!videoCompleted) markVideoAsDone();
                    } else if (activeStep === 1) {
                      if (!doaCompleted) markDoaAsDone();
                    }
                  }}
                  className="hidden"
                />
                <span className="text-xs font-black uppercase tracking-widest text-gray-500 group-hover:text-gray-900 transition-colors">
                  Tandai Selesai
                </span>
                <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  (activeStep === 0 ? videoCompleted : activeStep === 1 ? doaCompleted : vrProgress === 100)
                  ? 'bg-green-600 border-green-600 text-white shadow-md'
                  : 'border-gray-300 bg-white group-hover:border-gray-400'
                }`}>
                  {(activeStep === 0 ? videoCompleted : activeStep === 1 ? doaCompleted : vrProgress === 100) && (
                    <svg className="w-3.5 h-3.5 stroke-current" fill="none" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                  )}
                </span>
              </label>
            </div>

          </Card>
        </div>

        {/* Right Column (Sidebar Curriculum & Instructor - 4 cols) */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* 1. Materi Selanjutnya (Vertical Stack Playlist) */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-gray-400">Materi Selanjutnya</h3>
            <div className="flex flex-col gap-4">
              
              {/* Card 1: Video */}
              <Card 
                onClick={() => { setActiveStep(0); }}
                className={`p-5 rounded-[2rem] border-none shadow-sm cursor-pointer transition-all duration-300 hover:scale-[1.02] flex items-start gap-4 ${
                  activeStep === 0 
                  ? 'bg-slate-900 text-white shadow-xl shadow-slate-950/15' 
                  : 'bg-white hover:bg-gray-100 border border-gray-100/50'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  activeStep === 0 ? 'bg-amber-500 text-slate-900' : 'bg-amber-50 text-amber-600'
                }`}>
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                </div>
                <div className="space-y-1">
                  <span className={`text-[8px] font-black uppercase tracking-widest ${activeStep === 0 ? 'text-amber-400' : 'text-gray-400'}`}>Video Pembelajaran</span>
                  <h4 className="text-xs font-bold leading-tight line-clamp-2">1. Video Pengantar Rukun</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded ${
                      activeStep === 0 
                      ? 'bg-white/10 text-white border border-white/10' 
                      : 'bg-gray-50 text-gray-400'
                    }`}>Modul {moduleId === 'ihram' ? '1' : moduleId === 'tawaf' ? '2' : moduleId === 'sai' ? '3' : moduleId === 'wukuf' ? '4' : moduleId === 'muzdalifah' ? '5' : '6'}</span>
                    <span className={`text-[8px] font-bold ${videoCompleted ? 'text-green-500 font-extrabold' : activeStep === 0 ? 'text-slate-400' : 'text-gray-400'}`}>
                      {videoCompleted ? '✓ Selesai' : 'Belum Selesai'}
                    </span>
                  </div>
                </div>
              </Card>

              {/* Card 2: Doa */}
              <Card 
                onClick={() => { setActiveStep(1); }}
                className={`p-5 rounded-[2rem] border-none shadow-sm cursor-pointer transition-all duration-300 hover:scale-[1.02] flex items-start gap-4 ${
                  activeStep === 1 
                  ? 'bg-slate-900 text-white shadow-xl shadow-slate-950/15' 
                  : 'bg-white hover:bg-gray-100 border border-gray-100/50'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  activeStep === 1 ? 'bg-amber-500 text-slate-900' : 'bg-emerald-50 text-emerald-600'
                }`}>
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 3v18M3 12h18"/></svg>
                </div>
                <div className="space-y-1">
                  <span className={`text-[8px] font-black uppercase tracking-widest ${activeStep === 1 ? 'text-amber-400' : 'text-gray-400'}`}>Doa & Dzikir Rukun</span>
                  <h4 className="text-xs font-bold leading-tight line-clamp-2">2. Pelajari Lafal Doa Rukun</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded ${
                      activeStep === 1 
                      ? 'bg-white/10 text-white border border-white/10' 
                      : 'bg-gray-50 text-gray-400'
                    }`}>Modul {moduleId === 'ihram' ? '1' : moduleId === 'tawaf' ? '2' : moduleId === 'sai' ? '3' : moduleId === 'wukuf' ? '4' : moduleId === 'muzdalifah' ? '5' : '6'}</span>
                    <span className={`text-[8px] font-bold ${doaCompleted ? 'text-green-500 font-extrabold' : activeStep === 1 ? 'text-slate-400' : 'text-gray-400'}`}>
                      {doaCompleted ? '✓ Selesai' : 'Belum Selesai'}
                    </span>
                  </div>
                </div>
              </Card>

              {/* Card 3: VR */}
              <Card 
                onClick={() => { setActiveStep(2); }}
                className={`p-5 rounded-[2rem] border-none shadow-sm cursor-pointer transition-all duration-300 hover:scale-[1.02] flex items-start gap-4 ${
                  activeStep === 2 
                  ? 'bg-slate-900 text-white shadow-xl shadow-slate-950/15' 
                  : 'bg-white hover:bg-gray-100 border border-gray-100/50'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  activeStep === 2 ? 'bg-amber-500 text-slate-900' : 'bg-blue-50 text-blue-600'
                }`}>
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 21a9 9 0 100-18 9 9 0 000 18z"/></svg>
                </div>
                <div className="space-y-1">
                  <span className={`text-[8px] font-black uppercase tracking-widest ${activeStep === 2 ? 'text-amber-400' : 'text-gray-400'}`}>Virtual Reality</span>
                  <h4 className="text-xs font-bold leading-tight line-clamp-2">3. Simulasi Interaktif VR 360°</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded ${
                      activeStep === 2 
                      ? 'bg-white/10 text-white border border-white/10' 
                      : 'bg-gray-50 text-gray-400'
                    }`}>Modul {moduleId === 'ihram' ? '1' : moduleId === 'tawaf' ? '2' : moduleId === 'sai' ? '3' : moduleId === 'wukuf' ? '4' : moduleId === 'muzdalifah' ? '5' : '6'}</span>
                    <span className={`text-[8px] font-bold ${vrProgress === 100 ? 'text-green-500 font-extrabold' : activeStep === 2 ? 'text-slate-400' : 'text-gray-400'}`}>
                      {vrProgress === 100 ? '✓ Selesai' : `${vrProgress}% Selesai`}
                    </span>
                  </div>
                </div>
              </Card>

            </div>
          </div>

          {/* 2. Instructor Sidebar Card */}
          <Card className="p-8 bg-white border-none shadow-sm rounded-[2.5rem] space-y-6">
            
            {/* Instructor Profile Header */}
            <div className="flex items-center gap-4 border-b border-gray-50 pb-6">
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 border border-emerald-500/10 shrink-0">
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150" 
                  alt="Instructor" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-extrabold text-gray-900 text-sm">Hajah Aisyah Zahra</h4>
                  <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase tracking-widest rounded border border-emerald-100">
                    Premium
                  </span>
                </div>
                <button 
                  onClick={() => setIsDescOpen(!isDescOpen)}
                  className="text-xs font-semibold text-gray-400 hover:text-gray-900 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  Lihat Deskripsi
                  <svg className={`w-3.5 h-3.5 transform transition-transform duration-300 ${isDescOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"/></svg>
                </button>
              </div>
            </div>

            {/* Instructor Description Collapse */}
            {isDescOpen && (
              <p className="text-gray-500 text-xs leading-relaxed animate-fadeIn">
                {currentModule.description} Dibimbing oleh asisten ahli manasik virtual Bahrain International untuk memberikan pemahaman ibadah yang sahih, tertib, dan bernilai pahala makbul.
              </p>
            )}

          </Card>
        </div>

      </div>

      {/* Premium Glassmorphic Alert Modal */}
      {showLockModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md animate-fadeIn">
          <Card className="w-full max-w-md p-8 bg-white border border-gray-150 rounded-[2.5rem] shadow-2xl space-y-6 text-center animate-scaleUp relative overflow-hidden">
            {/* Decorative background glow */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl" />

            {/* Lock Icon container */}
            <div className="mx-auto w-20 h-20 bg-amber-50/70 border border-amber-200/50 rounded-full flex items-center justify-center text-amber-500 shadow-inner relative animate-pulse">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>

            {/* Modal Header */}
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 px-2.5 py-1 bg-amber-50 rounded-full border border-amber-100/50">Rukun Haji Berurutan</span>
              <h3 className="text-xl font-black text-gray-900 leading-snug">Modul Masih Terkunci</h3>
            </div>

            {/* Modal Body */}
            <p className="text-gray-500 text-xs leading-relaxed max-w-xs mx-auto">
              Silakan selesaikan <strong className="text-gray-800 font-extrabold">{currentModule.name}</strong> sampai <span className="text-emerald-600 font-extrabold">100%</span> terlebih dahulu untuk membuka perjalanan manasik Haji berikutnya.
            </p>

            {/* Modal Actions */}
            <button
              onClick={() => setShowLockModal(false)}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-slate-950/20 hover:shadow-slate-950/25 transition-all cursor-pointer transform active:scale-95"
            >
              Mengerti & Selesaikan Materi
            </button>
          </Card>
        </div>
      )}

    </div>
  );
}
