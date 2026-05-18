"use client";

import { useState, useEffect } from "react";
import { getModuleProgress, updateTaskStatus, VRModuleProgress } from "@/utils/progressStore";

interface TaskOverlayProps {
  moduleId: string;
}

export default function TaskOverlay({ moduleId }: TaskOverlayProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [moduleProgress, setModuleProgress] = useState<VRModuleProgress | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeScene, setActiveScene] = useState<{ name: string; index: number; total: number } | null>(null);

  useEffect(() => {
    setModuleProgress(getModuleProgress(moduleId));

    const handleUpdate = () => {
      setModuleProgress(getModuleProgress(moduleId));
    };

    window.addEventListener("progressStoreUpdated", handleUpdate);
    return () => {
      window.removeEventListener("progressStoreUpdated", handleUpdate);
    };
  }, [moduleId]);

  // Listen to automated task completions to trigger dynamic toast notifications
  useEffect(() => {
    const handleAutoChecked = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && customEvent.detail.taskTitle) {
        const currentProgress = getModuleProgress(moduleId);
        if (customEvent.detail.moduleTitle === currentProgress.title) {
          setToastMessage(customEvent.detail.taskTitle);
          
          // Play a quick subtle ding sound for positive reinforcement
          try {
            const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2568/2568-84.wav");
            audio.volume = 0.15;
            audio.play().catch(() => {});
          } catch (_) {}

          setTimeout(() => {
            setToastMessage(null);
          }, 4000);
        }
      }
    };

    window.addEventListener("vrTaskAutoChecked", handleAutoChecked);
    return () => {
      window.removeEventListener("vrTaskAutoChecked", handleAutoChecked);
    };
  }, [moduleId]);

  // Listen for VR Scene/Photo transitions to update Header GPS Location and auto-check tasks
  useEffect(() => {
    const handleSceneChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        setActiveScene({
          name: customEvent.detail.sceneName,
          index: customEvent.detail.sceneIndex || 1,
          total: customEvent.detail.totalScenes || 1
        });
      }
    };

    window.addEventListener("vrSceneChanged", handleSceneChange);
    return () => {
      window.removeEventListener("vrSceneChanged", handleSceneChange);
    };
  }, [moduleId]);

  if (!moduleProgress) return null;

  const completedCount = moduleProgress.tasks.filter((t) => t.isCompleted).length;
  const totalCount = moduleProgress.tasks.length;
  const progressPercent = moduleProgress.progress;

  const handleToggleTask = (taskId: string, currentStatus: boolean) => {
    const prevProgress = moduleProgress.progress;
    updateTaskStatus(moduleId, taskId, !currentStatus);

    const nextProgress = getModuleProgress(moduleId).progress;
    
    // Trigger celebration when completed
    if (nextProgress === 100 && prevProgress < 100) {
      setShowCelebration(true);
      // Play a soft sound if supported by the browser
      try {
        const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2019/2019-84.wav");
        audio.volume = 0.3;
        audio.play().catch(() => {});
      } catch (e) {}
    }
  };

  // Unsplash image related to the module
  const getImageUrl = () => {
    switch (moduleProgress.id) {
      case "ihram":
        return "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&q=80&w=400";
      case "tawaf":
        return "https://images.unsplash.com/photo-1565552645632-d7c5f76a16be?auto=format&fit=crop&q=80&w=400";
      case "sai":
        return "https://images.unsplash.com/photo-1580835239846-5bb9ce03c8c3?auto=format&fit=crop&q=80&w=400";
      default:
        return "https://images.unsplash.com/photo-1542856391-010fb87dcfed?auto=format&fit=crop&q=80&w=400";
    }
  };

  return (
    <>
      {/* Dynamic Celebration Banner */}
      {showCelebration && (
        <div className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] p-10 max-w-md w-full text-center shadow-3xl border border-emerald-500/20 relative overflow-hidden animate-in zoom-in-95 duration-500">
            {/* Confetti Background decoration */}
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl"></div>
            
            {/* Animated Ring */}
            <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-100 animate-bounce">
              <svg className="w-12 h-12 text-emerald-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest block mb-2">Modul Terselesaikan!</span>
            <h3 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">Selamat, Anda Luar Biasa!</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-8">
              Seluruh target dalam <b>{moduleProgress.title}</b> telah berhasil diselesaikan dengan baik. Progress Anda kini tercatat 100%.
            </p>
            <button
              onClick={() => setShowCelebration(false)}
              className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-sm font-bold shadow-lg shadow-emerald-950/20 active:scale-95 transition-all cursor-pointer"
            >
              Lanjutkan Eksplorasi
            </button>
          </div>
        </div>
      )}

      {/* Floating Task Widget */}
      <div 
        className={`fixed top-24 left-6 z-[250] transition-all duration-500 ease-out font-sans ${
          isOpen ? "translate-x-0 opacity-100 pointer-events-auto" : "-translate-x-12 opacity-0 pointer-events-none"
        }`}
      >
        <div className="w-80 bg-white/90 backdrop-blur-xl border border-white/50 shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-[2.5rem] overflow-hidden flex flex-col">
          {/* Header Image */}
          <div className="relative h-28 bg-gray-100">
            <img 
              src={getImageUrl()} 
              alt={moduleProgress.title}
              className="w-full h-full object-cover brightness-[0.8]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent"></div>
            
            {/* Title Overlay (Dynamic GPS Location / Scene Tracker) */}
            <div className="absolute bottom-4 left-6 right-6">
              <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest block mb-0.5">
                {activeScene ? `📍 Foto ${activeScene.index}/${activeScene.total}` : "Task Checklist"}
              </span>
              <h4 className="text-base font-bold text-white leading-none line-clamp-1">
                {activeScene ? activeScene.name : moduleProgress.title}
              </h4>
            </div>


            {/* Collapse Toggle inside card */}
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 w-7 h-7 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition-colors border border-white/10"
              title="Minimize panel"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </div>

          {/* Checklist Area (Read-Only: Automatically checked through VR interactions only) */}
          <div className="p-6 space-y-4 max-h-[320px] overflow-y-auto custom-scrollbar bg-white/50">
            {moduleProgress.tasks.map((task) => (
              <div 
                key={task.id}
                className={`flex items-start gap-4 p-3 rounded-2xl border transition-all duration-300 ${
                  task.isCompleted 
                    ? "bg-emerald-50/40 border-emerald-100/50" 
                    : "bg-white/80 border-gray-100/70"
                }`}
              >
                {/* Custom Checkbox Circle (Read-only status indicator) */}
                <div className="mt-0.5 shrink-0">
                  {task.isCompleted ? (
                    <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-sm border border-emerald-400 animate-in zoom-in-50 duration-300">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-gray-300 bg-gray-50 flex items-center justify-center" title="Akan tercentang otomatis saat Anda berinteraksi dengan scene/hotspot terkait di VR">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-300 scale-0"></div>
                    </div>
                  )}
                </div>

                {/* Task Label */}
                <span 
                  className={`text-xs font-bold leading-relaxed select-none transition-colors ${
                    task.isCompleted 
                      ? "text-emerald-800/70 line-through decoration-emerald-300 decoration-1.5" 
                      : "text-gray-500"
                  }`}
                >
                  {task.title}
                </span>
              </div>
            ))}
          </div>


          {/* Dynamic Footer with Progress Ring and percentage */}
          <div className="px-6 py-4 bg-gray-50/80 border-t border-gray-100/50 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Progress</span>
              <span className="text-xs font-bold text-gray-800 mt-0.5">{completedCount} dari {totalCount} Selesai</span>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Tiny Progress Circle */}
              <div className="relative w-8 h-8 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle 
                    cx="16" cy="16" r="12" 
                    className="text-gray-200" 
                    strokeWidth="3" stroke="currentColor" fill="none" 
                  />
                  <circle 
                    cx="16" cy="16" r="12" 
                    className="text-emerald-600 transition-all duration-700" 
                    strokeWidth="3" strokeDasharray="75.39" 
                    strokeDashoffset={75.39 - (75.39 * progressPercent) / 100}
                    strokeLinecap="round" stroke="currentColor" fill="none" 
                  />
                </svg>
                <span className="absolute text-[8px] font-black text-emerald-800">{progressPercent}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mini Compact Capsule Toggle when Closed */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="fixed top-24 left-6 z-[250] p-2 pr-5 bg-white/95 backdrop-blur-xl text-slate-800 rounded-full flex items-center gap-3 shadow-[0_15px_35px_rgba(0,0,0,0.15)] hover:scale-105 active:scale-95 transition-all cursor-pointer border border-white/50 font-sans group"
          title="Tampilkan Detail Checklist"
        >
          {/* Stylized Checkbox Icon Indicator */}
          <div className="w-9 h-9 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-md border border-emerald-400 transition-transform group-hover:rotate-12 duration-300">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          
          {/* Progress Ratio */}
          <div className="flex flex-col text-left">
            <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none">Tugas</span>
            <span className="text-xs font-black text-emerald-800 leading-none mt-1">{completedCount}/{totalCount}</span>
          </div>
        </button>
      )}


      {/* Toast Notification for Auto-Checking */}
      {toastMessage && (
        <div className="fixed bottom-10 right-10 z-[300] bg-emerald-950/95 backdrop-blur-md text-white border border-emerald-500/30 px-6 py-4 rounded-3xl shadow-2xl flex items-center gap-3.5 animate-in slide-in-from-bottom-5 duration-300 font-sans border-l-4 border-l-emerald-400">
          <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400">
            <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest block">Selesai Otomatis</span>
            <p className="text-xs font-bold mt-0.5">Tugas selesai: &ldquo;{toastMessage}&rdquo;</p>
          </div>
        </div>
      )}

      {/* Styled scrollbar styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 99px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </>
  );
}
