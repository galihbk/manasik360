"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";

export default function LobbyPage() {
  const [tutorialStep, setTutorialStep] = useState(0);
  const [showTutorial, setShowTutorial] = useState(true);

  const tutorialSteps = [
    {
      title: "Selamat Datang",
      desc: "Mari luangkan waktu sejenak untuk mengenal navigasi di sini sebelum memulai manasik Anda.",
      target: "center"
    },
    {
      title: "Melihat Sekitar",
      desc: "Anda bisa menggeser pandangan ke segala arah untuk melihat suasana lokasi dengan lebih dekat.",
      target: "view"
    },
    {
      title: "Titik Informasi",
      desc: "Ketuk tanda (+) untuk mendapatkan penjelasan mendalam mengenai rukun atau lokasi tersebut.",
      target: "hotspot"
    },
    {
      title: "Berpindah Lokasi",
      desc: "Gunakan tanda panah di lantai untuk melangkah ke titik selanjutnya dalam urutan manasik.",
      target: "arrows"
    },
    {
      title: "Pengalaman VR",
      desc: "Jika Anda memiliki perangkat VR, ketuk ikon kacamata untuk pengalaman yang lebih nyata.",
      target: "vr-btn"
    }
  ];

  const nextTutorial = () => {
    if (tutorialStep < tutorialSteps.length - 1) {
      setTutorialStep(tutorialStep + 1);
    } else {
      setShowTutorial(false);
    }
  };

  return (
    <main className="relative h-screen w-full bg-[#fdfdfb] overflow-hidden font-sans">
      {/* 360 Viewer Placeholder */}
      <div className="absolute inset-0 transition-transform duration-[3000ms] ease-out scale-105">
        <Image 
          src="/images/lobby.png" 
          alt="Lounge Manasik" 
          fill
          className="object-cover opacity-90"
        />
        
        {/* Mock Hotspots */}
        {!showTutorial && (
          <>
            <div className="absolute top-[40%] left-[60%]">
              <button className="w-12 h-12 bg-white/40 backdrop-blur-md border border-white/60 rounded-full flex items-center justify-center group shadow-xl">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-[var(--color-primary)] font-bold text-xl group-hover:scale-110 transition-transform shadow-sm">
                  +
                </div>
              </button>
            </div>

            <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2">
              <Link href="/dashboard" className="flex flex-col items-center gap-4 group">
                <div className="px-8 py-3 bg-white text-[var(--color-primary)] font-bold rounded-full shadow-2xl hover:bg-[var(--color-primary)] hover:text-white transition-all transform hover:-translate-y-1">
                  Masuk ke Dashboard
                </div>
              </Link>
            </div>
          </>
        )}
      </div>

      {/* Tutorial Overlay */}
      {showTutorial && (
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[4px] z-50 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded-[3rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.15)] overflow-hidden animate-in fade-in zoom-in-95 duration-500">
            <div className="p-12 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{tutorialSteps[tutorialStep].title}</h3>
              <p className="text-gray-600 mb-12 leading-relaxed">{tutorialSteps[tutorialStep].desc}</p>
              
              <div className="flex items-center justify-between gap-6">
                <div className="flex gap-2">
                  {tutorialSteps.map((_, i) => (
                    <div key={i} className={`h-1 rounded-full transition-all ${i === tutorialStep ? "w-10 bg-[var(--color-primary)]" : "w-2 bg-gray-100"}`}></div>
                  ))}
                </div>
                <Button onClick={nextTutorial} className="px-8 rounded-2xl">
                  {tutorialStep === tutorialSteps.length - 1 ? "Mulai" : "Lanjut"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* UI Controls (Floating) */}
      {!showTutorial && (
        <div className="absolute top-6 left-6 z-40">
           <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-3xl flex items-center gap-4 shadow-2xl">
              <div className="w-10 h-10 bg-[var(--color-primary)] rounded-xl flex items-center justify-center font-bold text-white">360</div>
              <div>
                <p className="text-white font-bold text-sm">Lobby Manasik</p>
                <p className="text-white/60 text-xs">Pilih modul di dashboard untuk memulai</p>
              </div>
           </div>
        </div>
      )}

      <div className="absolute bottom-6 right-6 z-40 flex flex-col gap-3">
        <button className="w-14 h-14 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center hover:bg-white/20 transition-all group">
          <svg className="w-6 h-6 text-white group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
        </button>
        <button className="w-14 h-14 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center hover:bg-white/20 transition-all group">
          <svg className="w-8 h-8 text-white group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M21 7H3c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zM6.5 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm11 0c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/></svg>
        </button>
      </div>
    </main>
  );
}
