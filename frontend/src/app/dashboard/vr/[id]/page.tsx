"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Button from "@/components/ui/Button";
import Image from "next/image";
import TaskOverlay from "@/components/dashboard/tour/TaskOverlay";
import { autoCheckTaskByTrigger } from "@/utils/progressStore";
import { useToast } from "@/context/ToastContext";

export default function VRPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showVideo, setShowVideo] = useState(true);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const viewerRef = useRef<any>(null);

  const moduleId = params.id as string;

  const moduleData: Record<string, any> = {
    "ihram": {
      title: "Ihram & Miqat",
      panorama: "/images/miqat.png",
      videoUrl: "#",
      audioUrl: "#",
      hotspots: [
        { pitch: -10, yaw: 0, text: "Niat Ihram", desc: "Ucapkan: Labbaik Allahumma Hajjan" },
        { pitch: 0, yaw: 90, text: "Larangan Ihram", desc: "Tidak boleh mencukur rambut, memakai parfum, dll." }
      ],
      quiz: {
        question: "Di mana titik Miqat bagi jamaah yang datang dari Madinah?",
        options: ["Bir Ali (Zulhulayfah)", "Yalamlam", "Juhfah", "Qarnul Manazil"],
        answer: 0
      }
    },
    "tawaf": {
      title: "Tawaf di Ka'bah",
      panorama: "/images/vr-preview.png",
      videoUrl: "#",
      audioUrl: "#",
      hotspots: [
        { pitch: -5, yaw: 45, text: "Hajar Aswad", desc: "Titik awal dan akhir tawaf. Beri isyarat (istilam)." },
        { pitch: -5, yaw: 180, text: "Maqam Ibrahim", desc: "Disunnahkan shalat 2 rakaat di belakangnya." }
      ],
      quiz: {
        question: "Berapa kali putaran tawaf dilakukan?",
        options: ["3 Kali", "5 Kali", "7 Kali", "9 Kali"],
        answer: 2
      }
    },
    "sai": {
      title: "Sa'i Safa-Marwah",
      panorama: "/images/sai.png",
      videoUrl: "#",
      audioUrl: "#",
      hotspots: [
        { pitch: 0, yaw: 0, text: "Bukit Safa", desc: "Titik awal Sa'i." },
        { pitch: 0, yaw: 180, text: "Lampu Hijau", desc: "Area lari-lari kecil bagi laki-laki." }
      ],
      quiz: {
        question: "Dari mana Sa'i dimulai?",
        options: ["Marwah", "Safa", "Ka'bah", "Mina"],
        answer: 1
      }
    },
    "mina": {
      title: "Mina & Arafah",
      panorama: "/images/mina.png",
      videoUrl: "#",
      audioUrl: "#",
      hotspots: [
        { pitch: 0, yaw: 45, text: "Wukuf Arafah", desc: "Puncak ibadah haji pada 9 Dzulhijjah." },
        { pitch: 0, yaw: 135, text: "Lempar Jumrah", desc: "Dilakukan di Mina selama hari Tasyrik." }
      ],
      quiz: {
        question: "Kapan Wukuf di Arafah dilaksanakan?",
        options: ["8 Dzulhijjah", "9 Dzulhijjah", "10 Dzulhijjah", "11 Dzulhijjah"],
        answer: 1
      }
    }
  };

  const currentModule = moduleData[moduleId] || moduleData["tawaf"];

  useEffect(() => {
    const initViewer = () => {
      if ((window as any).pannellum) {
        if (viewerRef.current) viewerRef.current.destroy();

        viewerRef.current = (window as any).pannellum.viewer('panorama-container', {
          type: 'equirectangular',
          panorama: currentModule.panorama,
          autoLoad: true,
          showControls: false,
          hotSpots: currentModule.hotspots.map((hs: any) => ({
            pitch: hs.pitch,
            yaw: hs.yaw,
            type: "info",
            text: hs.text,
            createTooltipFunc: (hotSpotDiv: any) => {
               hotSpotDiv.classList.add('custom-hotspot');

               // Automatic task completion trigger when user interacts with a hotspot
               const autoCheck = () => {
                 autoCheckTaskByTrigger(moduleId, hs.text);
               };
               hotSpotDiv.addEventListener('click', autoCheck);
               hotSpotDiv.addEventListener('mouseenter', autoCheck);

               const span = document.createElement('span');
               span.innerHTML = `<div class="p-4 bg-black/80 backdrop-blur-xl text-white rounded-2xl border border-white/20 w-48 shadow-2xl">
                 <p class="font-bold text-accent mb-1">${hs.text}</p>
                 <p class="text-xs text-white/70">${hs.desc}</p>
               </div>`;
               hotSpotDiv.appendChild(span);
               span.style.width = '192px';
               span.style.marginLeft = -(192 / 2) + (hotSpotDiv.offsetWidth / 2) + 'px';
               span.style.marginTop = -120 + 'px';
            }
          }))
        });

        // Dispatch scene changed event to notify TaskOverlay of the loaded Pannellum scene/photo
        const sceneEvent = new CustomEvent("vrSceneChanged", {
          detail: {
            sceneName: currentModule.title,
            sceneIndex: 1,
            totalScenes: 1
          }
        });
        window.dispatchEvent(sceneEvent);
      } else {
        setTimeout(initViewer, 500);
      }
    };



    if (!showVideo) {
      initViewer();
    }

    return () => {
      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, [moduleId, showVideo]);

  const handleFinishModule = () => {
    setShowQuiz(false);
    showToast("Selamat! Modul berhasil diselesaikan.", "success");
    router.push('/dashboard');
  };

  return (
    <div className="relative w-full h-[calc(100vh-12rem)] bg-black rounded-3xl overflow-hidden shadow-2xl font-sans">
      
      {/* Dynamic Task list Checklist widget */}
      {!showVideo && !showQuiz && moduleId && <TaskOverlay moduleId={moduleId} />}

      
      {/* 1. Video Opening Overlay */}
      {showVideo && (
        <div className="absolute inset-0 z-[100] bg-[#0c0c0c] flex flex-col items-center justify-center p-10 text-center">
           <div className="max-w-2xl w-full">
              <span className="text-[var(--color-primary-light)] font-medium tracking-[0.2em] text-xs mb-6 block uppercase">Pendahuluan</span>
              <h2 className="text-4xl font-serif text-white mb-10 italic">Menuju {currentModule.title}</h2>
              <div className="aspect-video bg-black rounded-[2.5rem] border border-white/5 flex items-center justify-center mb-12 group cursor-pointer overflow-hidden relative shadow-3xl">
                 <Image src={currentModule.panorama} alt="Suasana" fill className="object-cover opacity-40 group-hover:scale-105 transition-transform duration-[3000ms]" />
                 <div className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/20 relative z-10 group-hover:bg-white group-hover:text-black transition-all">
                    <svg className="w-8 h-8 fill-current ml-1" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                 </div>
              </div>
              <Button onClick={() => setShowVideo(false)} className="px-12 py-4 bg-white text-black hover:bg-gray-100 rounded-2xl">Masuk ke Suasana 360°</Button>
           </div>
        </div>
      )}

      {/* 2. Pannellum Viewer */}
      <div 
        id="panorama-container" 
        className={`w-full h-full transition-all duration-[1000ms] ${isTransitioning ? 'blur-2xl opacity-0' : 'blur-0 opacity-100'}`}
      ></div>

      {/* 3. Quiz Overlay */}
      {showQuiz && (
        <div className="absolute inset-0 z-[110] bg-black/40 backdrop-blur-[6px] flex items-center justify-center p-6">
           <div className="max-w-md w-full bg-white rounded-[3rem] p-12 shadow-3xl animate-in fade-in zoom-in-95 duration-500">
              <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">Refleksi Sejenak</h3>
              <p className="text-gray-500 mb-10 text-center leading-relaxed">{currentModule.quiz.question}</p>
              <div className="space-y-3 mb-10">
                 {currentModule.quiz.options.map((opt: string, i: number) => (
                   <button 
                    key={i}
                    onClick={() => {
                      if (i === currentModule.quiz.answer) {
                        handleFinishModule();
                      } else {
                        // Softer error feedback
                      }
                    }}
                    className="w-full text-left p-5 rounded-2xl border border-gray-50 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 transition-all font-medium text-gray-700"
                   >
                     {opt}
                   </button>
                 ))}
              </div>
              <button onClick={() => setShowQuiz(false)} className="w-full text-gray-400 text-sm font-medium hover:text-gray-600 transition-colors">Kembali melihat suasana</button>
           </div>
        </div>
      )}

      {/* 4. VR HUD / Controls */}
      {!showVideo && !showQuiz && (
        <>
          <div className="absolute top-8 left-8 z-40">
             <div className="bg-black/20 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-2xl flex items-center gap-4">
                <span className="text-white font-serif italic text-lg tracking-wide">{currentModule.title}</span>
             </div>
          </div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-6 bg-black/60 backdrop-blur-2xl px-8 py-4 rounded-[2rem] border border-white/10 shadow-3xl">
             <button 
              onClick={() => setIsPlayingAudio(!isPlayingAudio)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isPlayingAudio ? 'bg-[var(--color-accent)] text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
             >
                {isPlayingAudio ? (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                ) : (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
                )}
             </button>
             
             <div className="h-8 w-px bg-white/10"></div>
             
             <button 
              onClick={() => setShowQuiz(true)}
              className="px-6 py-2 bg-white text-black font-bold rounded-full hover:bg-gray-100 transition-all flex items-center gap-2"
             >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                Selesaikan Modul
             </button>

             <div className="h-8 w-px bg-white/10"></div>

             <button 
              onClick={() => router.push('/dashboard/lobby')}
              className="w-12 h-12 bg-white/10 text-white rounded-full flex items-center justify-center hover:bg-white/20 transition-all"
             >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
             </button>
          </div>

          <div className="absolute top-6 right-6 z-40">
             <button 
              onClick={() => router.push('/dashboard')}
              className="w-10 h-10 bg-black/40 backdrop-blur-md rounded-xl flex items-center justify-center text-white border border-white/10"
             >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
             </button>
          </div>
        </>
      )}

      {/* Global CSS for Hotspots */}
      <style jsx global>{`
        .custom-hotspot {
          width: 30px;
          height: 30px;
          background: var(--color-primary);
          border: 3px solid white;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 0 20px rgba(6, 78, 59, 0.5);
          animation: pulse-hotspot 2s infinite;
        }

        .custom-hotspot span {
          visibility: hidden;
          position: absolute;
          z-index: 1;
          opacity: 0;
          transition: opacity 0.3s;
        }

        .custom-hotspot:hover span {
          visibility: visible;
          opacity: 1;
        }

        @keyframes pulse-hotspot {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(6, 78, 59, 0.7); }
          70% { transform: scale(1.1); box-shadow: 0 0 0 10px rgba(6, 78, 59, 0); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(6, 78, 59, 0); }
        }

        .pnlm-load-box { display: none !important; }
      `}</style>
    </div>
  );
}
