"use client";

const guideCards = [
  { title: "Langkah Awal: Mengenal Ihram dan Niat Haji", status: "Sedang berjalan", color: "bg-[#064e3b]", text: "text-white", btn: "Lanjutkan Modul" },
  { title: "Puncak Ibadah: Berdoa di Arafah", status: "5 materi", color: "bg-white", text: "text-gray-900", btn: "Modul Selanjutnya" },
  { title: "Kumpulkan Kerikil dan Perkuat Niat Anda", status: "5 materi", color: "bg-white", text: "text-gray-900", btn: "Modul Selanjutnya" },
  { title: "Tantangan Iman: Melontar Kerikil ke Jumrah", status: "5 materi", color: "bg-white", text: "text-gray-900", btn: "Modul Selanjutnya" },
];

export default function GuideSection() {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">Panduan Ibadah</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {guideCards.map((card, i) => (
          <div key={i} className={`${card.color} ${card.text} p-8 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col justify-between group hover:shadow-xl transition-all h-[240px]`}>
             <div className="space-y-4">
                <div className="flex items-center justify-between">
                   <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${card.color === 'bg-[#064e3b]' ? 'bg-white/10' : 'bg-gray-100 text-gray-400'}`}>
                      {card.status}
                   </span>
                </div>
                <h4 className="font-bold leading-snug">{card.title}</h4>
             </div>
             <button className={`w-full py-3 rounded-full text-xs font-bold transition-all ${card.color === 'bg-[#064e3b]' ? 'bg-[var(--color-accent)] text-white hover:bg-[#b45309]' : 'bg-gray-50 text-gray-400 border border-gray-100 hover:bg-gray-100'}`}>
                {card.btn}
             </button>
          </div>
        ))}
      </div>
    </div>
  );
}
