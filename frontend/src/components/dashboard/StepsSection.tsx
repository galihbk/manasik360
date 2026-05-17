"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const steps = [
  { title: "Pengantar Ihram dan niat Haji", status: "Selesai", progress: 100, lessons: "1/1", type: "Video Pembelajaran", image: "/images/miqat.png" },
  { title: "Simulasi mengenakan kain ihram", status: "Berlangsung", progress: 50, lessons: "1", type: "Virtual Reality", image: "/images/vr-preview.png" },
  { title: "Larangan ihram", status: "Belum mulai", progress: 0, lessons: "3/5", type: "Video Pembelajaran", image: "/images/mina.png" },
  { title: "Simulasi lokasi miqat", status: "Belum mulai", progress: 0, lessons: "4/5", type: "Virtual Reality", image: "/images/miqat.png" },
];

export default function StepsSection() {
  const router = useRouter();
  const [dbModules, setDbModules] = useState<any[]>([]);

  // Fetch VR modules list from the database
  useEffect(() => {
    const fetchModules = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/vrtour/modules");
        const json = await res.json();
        if (json.status === "success") {
          setDbModules(json.data);
        }
      } catch (err) {
        console.error("Error fetching modules in StepsSection:", err);
      }
    };
    fetchModules();
  }, []);

  const handleCardClick = (step: typeof steps[0]) => {
    if (step.type === "Video Pembelajaran") {
      // Navigate to the video training and materials center
      router.push("/dashboard/guide");
    } else if (step.type === "Virtual Reality") {
      // Match card title dynamically against database VRModules using keywords
      const match = dbModules.find(m => {
        const titleLower = step.title.toLowerCase();
        const nameLower = m.name.toLowerCase();
        return (
          nameLower.includes(titleLower) ||
          titleLower.includes(nameLower) ||
          (titleLower.includes("ihram") && nameLower.includes("ihram")) ||
          (titleLower.includes("miqat") && nameLower.includes("miqat"))
        );
      });

      // Navigate to matched module ID, or fallback to the first available module, or VR listing page
      const targetId = match?.id || dbModules[0]?.id;
      if (targetId) {
        router.push(`/dashboard/tour/viewer/${targetId}`);
      } else {
        router.push("/dashboard/tour");
      }
    }
  };

  return (
    <div className="space-y-8 pb-10">
      <h2 className="text-2xl font-bold text-gray-900">Langkah-langkah</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step, i) => (
          <div 
            key={i} 
            onClick={() => handleCardClick(step)}
            className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-50 space-y-6 group hover:shadow-xl transition-all cursor-pointer hover:border-emerald-500/30"
          >
             <div className="relative aspect-video rounded-2xl overflow-hidden">
                <Image src={step.image} alt={step.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-3 right-3 w-8 h-8 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center text-white">
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/></svg>
                </div>
             </div>
             <div className="space-y-4">
                <div className="flex items-center justify-between">
                   <h4 className="font-bold text-gray-900 text-sm line-clamp-1">{step.title}</h4>
                </div>
                <div className="space-y-2">
                   <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-gray-400">
                      <span>{step.type}</span>
                      <span>{step.progress}%</span>
                   </div>
                   <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 transition-all duration-1000" style={{ width: `${step.progress}%` }}></div>
                   </div>
                   <div className="flex justify-between text-[10px] font-bold text-gray-400">
                      <span>Modul 1</span>
                      <span>{step.lessons}</span>
                   </div>
                </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
