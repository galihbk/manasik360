"use client";

const categories = [
  { name: "Semua", active: true },
  { name: "Persiapan Ihram", active: false },
  { name: "Thawaf", active: false },
  { name: "Sa'i", active: false },
  { name: "Wukuf", active: false },
  { name: "Lontar Jumrah", active: false },
];

export default function PrayerCategories() {
  return (
    <div className="flex flex-wrap gap-3 overflow-x-auto pb-2 no-scrollbar">
      {categories.map((cat, i) => (
        <button 
          key={i} 
          className={`px-6 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
            cat.active 
            ? 'bg-[var(--color-primary)] text-white shadow-lg shadow-emerald-900/10' 
            : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-100'
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
