"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const guideCards = [
  { title: "Langkah Awal: Mengenal Ihram dan Niat Haji", status: "Sedang berjalan", color: "bg-[#064e3b]", text: "text-white", btn: "Lanjutkan Modul" },
  { title: "Puncak Ibadah: Berdoa di Arafah", status: "5 materi", color: "bg-white", text: "text-gray-900", btn: "Modul Selanjutnya" },
  { title: "Kumpulkan Kerikil dan Perkuat Niat Anda", status: "5 materi", color: "bg-white", text: "text-gray-900", btn: "Modul Selanjutnya" },
  { title: "Tantangan Iman: Melontar Kerikil ke Jumrah", status: "5 materi", color: "bg-white", text: "text-gray-900", btn: "Modul Selanjutnya" },
];

export default function GuideSection() {
  const router = useRouter();
  const [dbModules, setDbModules] = useState<any[]>([]);

  // Fetch modules list in background to route active cards correctly
  useEffect(() => {
    const fetchModules = async () => {
      try {
        const res = await fetch("/api/vrtour/modules");
        const json = await res.json();
        if (json.status === "success") {
          setDbModules(json.data);
        }
      } catch (err) {
        console.error("Error fetching modules in GuideSection:", err);
      }
    };
    fetchModules();
  }, []);

  const handleCardClick = (card: typeof guideCards[0]) => {
    if (card.title.toLowerCase().includes("ihram")) {
      // Intelligently find matched VR Module from database
      const match = dbModules.find(m => m.name.toLowerCase().includes("ihram"));
      const targetId = match?.id || dbModules[0]?.id;
      if (targetId) {
        router.push(`/dashboard/tour/viewer/${targetId}`);
      } else {
        router.push("/dashboard/tour");
      }
    } else {
      // Other materials go to the general learning center
      router.push("/dashboard/guide");
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">Panduan Ibadah</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {guideCards.map((card, i) => (
          <div 
            key={i} 
            onClick={() => handleCardClick(card)}
            className={`${card.color} ${card.text} p-8 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col justify-between group hover:shadow-xl transition-all h-[240px] cursor-pointer`}
          >
             <div className="space-y-4">
                <div className="flex items-center justify-between">
                   <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${card.color === 'bg-[#064e3b]' ? 'bg-white/10' : 'bg-gray-100 text-gray-400'}`}>
                      {card.status}
                   </span>
                </div>
                <h4 className="font-bold leading-snug">{card.title}</h4>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation(); // Avoid double click triggers
                  handleCardClick(card);
                }}
                className={`w-full py-3 rounded-full text-xs font-bold transition-all cursor-pointer ${card.color === 'bg-[#064e3b]' ? 'bg-[var(--color-accent)] text-white hover:bg-[#b45309]' : 'bg-gray-50 text-gray-400 border border-gray-100 hover:bg-gray-100'}`}
              >
                 {card.btn}
              </button>
          </div>
        ))}
      </div>
    </div>
  );
}
