"use client";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Image from "next/image";

export default function TravelDashboardPage() {
  const pilgrims = [
    { name: "Akhmad Fauzi", package: "Premium VR", progress: 35, status: "Aktif", lastActive: "10 Menit lalu" },
    { name: "Siti Aminah", package: "Lansia", progress: 100, status: "Selesai", lastActive: "2 Hari lalu" },
    { name: "Budi Santoso", package: "Basic", progress: 0, status: "Belum Bayar", lastActive: "N/A" },
    { name: "Dewi Lestari", package: "Premium VR", progress: 80, status: "Aktif", lastActive: "1 Jam lalu" },
  ];

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Monitoring Travel</h1>
          <p className="text-gray-500">Pantau progres pembelajaran manasik jamaah Anda secara real-time.</p>
        </div>
        <Button className="px-6">Tambah Jamaah Baru</Button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-white border-none shadow-sm">
           <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Total Jamaah</p>
           <h3 className="text-3xl font-bold text-gray-900">124</h3>
        </Card>
        <Card className="p-6 bg-white border-none shadow-sm">
           <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Selesai Manasik</p>
           <h3 className="text-3xl font-bold text-green-600">86</h3>
        </Card>
        <Card className="p-6 bg-white border-none shadow-sm">
           <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Kesiapan Rata-rata</p>
           <h3 className="text-3xl font-bold text-blue-600">72%</h3>
        </Card>
      </div>

      {/* Pilgrim Table */}
      <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100">
        <div className="p-8 border-b border-gray-100 flex justify-between items-center">
           <h3 className="text-xl font-bold text-gray-900">Daftar Jamaah</h3>
           <div className="flex gap-4">
              <input type="text" placeholder="Cari nama..." className="px-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[var(--color-primary)]" />
              <select className="px-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none">
                 <option>Semua Status</option>
                 <option>Aktif</option>
                 <option>Selesai</option>
              </select>
           </div>
        </div>
        <table className="w-full text-left border-collapse">
           <thead className="bg-gray-50 text-gray-400 text-xs font-bold uppercase tracking-widest">
              <tr>
                 <th className="px-8 py-4">Nama Jamaah</th>
                 <th className="px-8 py-4">Paket</th>
                 <th className="px-8 py-4">Progres</th>
                 <th className="px-8 py-4">Status</th>
                 <th className="px-8 py-4">Terakhir Aktif</th>
                 <th className="px-8 py-4 text-right">Aksi</th>
              </tr>
           </thead>
           <tbody className="divide-y divide-gray-50">
              {pilgrims.map((p, i) => (
                <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                   <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center text-[var(--color-primary)] font-bold">
                            {p.name[0]}
                         </div>
                         <span className="font-bold text-gray-900">{p.name}</span>
                      </div>
                   </td>
                   <td className="px-8 py-6 text-sm text-gray-600">{p.package}</td>
                   <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                         <div className="flex-1 h-1.5 bg-gray-100 rounded-full w-24">
                            <div className="bg-[var(--color-primary)] h-full rounded-full" style={{ width: `${p.progress}%` }}></div>
                         </div>
                         <span className="text-xs font-bold text-gray-500">{p.progress}%</span>
                      </div>
                   </td>
                   <td className="px-8 py-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${p.status === 'Selesai' ? 'bg-green-100 text-green-700' : p.status === 'Aktif' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-400'}`}>
                         {p.status}
                      </span>
                   </td>
                   <td className="px-8 py-6 text-sm text-gray-400">{p.lastActive}</td>
                   <td className="px-8 py-6 text-right">
                      <button className="text-gray-400 hover:text-[var(--color-primary)] transition-colors">
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                      </button>
                   </td>
                </tr>
              ))}
           </tbody>
        </table>
      </div>

      <div className="p-8 bg-[var(--color-primary)] rounded-[2.5rem] text-white flex items-center justify-between">
         <div>
            <h4 className="text-xl font-bold mb-1">Butuh bantuan integrasi API Travel?</h4>
            <p className="text-[var(--color-primary-light)]">Hubungkan sistem booking travel Anda dengan dashboard monitoring Manasik360.</p>
         </div>
         <Button className="bg-white text-[var(--color-primary)] hover:bg-gray-100">Pelajari API Doc</Button>
      </div>
    </div>
  );
}
