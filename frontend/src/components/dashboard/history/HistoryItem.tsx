"use client";

import { useLanguage } from "@/context/LanguageContext";

interface HistoryItemProps {
  title: string;
  type: string;
  time: string;
  date: string;
  icon: string | React.ReactNode;
  color: string;
}

const iconMap: Record<string, React.ReactNode> = {
  video: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
  vr: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
  book: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>,
  system: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>,
};

export default function HistoryItem({ title, type, time, date, icon, color }: HistoryItemProps) {
  const { t } = useLanguage();
  const renderedIcon = typeof icon === 'string' ? (iconMap[icon] || iconMap.system) : icon;

  const getTypeText = (type: string) => {
     if (type === "Simulasi") return t("history.typeSimulasi");
     if (type === "Hafalan") return t("history.typeHafalan");
     if (type === "Belajar") return t("history.typeBelajar");
     return type;
  };

  const getTranslatedTitle = (title: string) => {
     // Check if the title starts with "Selesai Menonton Video:" or "Menghafal Doa:"
     if (title.startsWith("Selesai Menonton Video: ")) {
        const modPart = title.replace("Selesai Menonton Video: ", "");
        // Map modPart if it matches a module name
        let mappedName = modPart;
        if (modPart.includes("Ihram")) mappedName = t("module.ihram.name");
        else if (modPart.includes("Tawaf")) mappedName = t("module.tawaf.name");
        else if (modPart.includes("Sa'i") || modPart.includes("Sai")) mappedName = t("module.sai.name");
        else if (modPart.includes("Wukuf")) mappedName = t("module.wukuf.name");
        else if (modPart.includes("Mabit") || modPart.includes("Muzdalifah")) mappedName = t("module.muzdalifah.name");
        else if (modPart.includes("Jumrah")) mappedName = t("module.jumrah.name");
        return t("progress.videoCompleted").replace("{name}", mappedName);
     }
     if (title.startsWith("Menghafal Doa: ")) {
        const prayerPart = title.replace("Menghafal Doa: ", "");
        let mappedName = prayerPart;
        if (prayerPart.includes("Niat")) mappedName = t("prayer.ihram.title");
        else if (prayerPart.includes("Talbiyah")) mappedName = t("prayer.talbiyah.title");
        else if (prayerPart.includes("Memulai Tawaf")) mappedName = t("prayer.tawaf.title");
        else if (prayerPart.includes("Sapu Jagad")) mappedName = t("prayer.sapujagad.title");
        else if (prayerPart.includes("Safa")) mappedName = t("prayer.sai.title");
        else if (prayerPart.includes("Wukuf")) mappedName = t("prayer.wukuf.title");
        else if (prayerPart.includes("Mabit")) mappedName = t("prayer.muzdalifah.title");
        else if (prayerPart.includes("Jumrah")) mappedName = t("prayer.jumrah.title");
        return t("progress.doaCompleted").replace("{name}", mappedName);
     }
     return title;
  };

  return (
    <div className="flex gap-6 group relative">
       {/* Timeline line */}
       <div className="absolute left-6 top-14 bottom-0 w-0.5 bg-gray-50 group-last:hidden"></div>
       
       {/* Icon */}
       <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center shrink-0 shadow-sm z-10 transition-transform group-hover:scale-110`}>
          {renderedIcon}
       </div>
       
       {/* Content */}
       <div className="flex-1 pb-10">
          <div className="bg-white p-6 rounded-[2rem] border border-gray-50 shadow-sm group-hover:shadow-xl transition-all">
             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                   <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{getTypeText(type)}</span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{time}</span>
                   </div>
                   <h4 className="font-bold text-gray-900">{getTranslatedTitle(title)}</h4>
                </div>
                <div className="text-right">
                   <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{date}</p>
                   <button className="text-[10px] font-bold text-[var(--color-primary)] hover:underline mt-1">{t("landing.blogReadMore")}</button>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
}
