"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import ConfirmModal from "@/components/ui/ConfirmModal";

interface Module {
  id: string;
  name: string;
  description: string;
  thumbnail?: string;
  _count?: { scenes: number };
}

export default function AdminVRPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);

  // Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  // Form State
  const [moduleForm, setModuleForm] = useState({ name: "", description: "" });
  const [isUploadingModule, setIsUploadingModule] = useState(false);
  const [moduleThumbnail, setModuleThumbnail] = useState("");

  const fetchModules = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/vrtour/modules", { credentials: "include" });
      const json = await res.json();
      if (json.status === "success") setModules(json.data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => {
    if (!authLoading && user?.role !== 'ADMIN') {
      router.push("/dashboard");
    }
  }, [user, authLoading, router]);

  useEffect(() => { fetchModules(); }, []);

  const handleModuleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingModule(true);
    const formData = new FormData();
    formData.append("panorama", file);
    try {
      const res = await fetch("http://localhost:5001/api/vrtour/upload", {
        method: "POST",
        credentials: "include",
        body: formData
      });
      const json = await res.json();
      if (json.status === "success") setModuleThumbnail(json.data.filePath);
    } catch (err) { console.error(err); } finally { setIsUploadingModule(false); }
  };

  const handleCreateModule = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5001/api/vrtour/modules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ...moduleForm, thumbnail: moduleThumbnail })
      });
      if (res.ok) {
        alert("Modul berhasil dibuat!");
        fetchModules();
        setModuleForm({ name: "", description: "" });
        setModuleThumbnail("");
      }
    } catch (err) { console.error(err); }
  };

  if (loading || authLoading) return <div className="p-10 text-emerald-600 font-bold animate-pulse">Memuat Modul...</div>;

  return (
    <div className="space-y-10 pb-20">
      <div className="flex justify-between items-end">
        <div>
            <h1 className="text-3xl font-bold text-gray-900">Pilih Modul Manasik</h1>
            <p className="text-gray-500">Pilih modul yang ingin Anda kelola konten VR-nya.</p>
        </div>
        <div className="hidden lg:block">
            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Total: {modules.length} Modul</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <Card className="p-8 border-2 border-dashed border-emerald-100 bg-emerald-50/30 flex flex-col items-center justify-center text-center gap-4 group cursor-pointer hover:border-emerald-300 hover:bg-emerald-50 transition-all rounded-[2.5rem]">
            <div className="w-16 h-16 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-200 group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
            </div>
            <div>
              <h3 className="font-bold text-emerald-900">Tambah Modul</h3>
              <p className="text-[10px] text-emerald-400 font-medium">Buat kurikulum baru</p>
            </div>
            
            <form onSubmit={handleCreateModule} className="w-full space-y-3 mt-4">
              <div className="relative group/thumb">
                  <input type="file" accept="image/*" onChange={handleModuleThumbnailUpload} className="hidden" id="module-thumb" />
                  <label htmlFor="module-thumb" className="block w-full h-24 bg-white rounded-xl border border-emerald-100 overflow-hidden cursor-pointer hover:border-emerald-500 transition-all">
                    {isUploadingModule ? (
                      <div className="flex items-center justify-center h-full"><div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div></div>
                    ) : moduleThumbnail ? (
                      <img src={`http://localhost:5001${moduleThumbnail}`} className="w-full h-full object-cover" alt="" />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-gray-300">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                          <span className="text-[8px] font-black uppercase tracking-widest mt-1">Upload Sampul</span>
                      </div>
                    )}
                  </label>
              </div>
              <input 
                value={moduleForm.name} 
                onChange={(e) => setModuleForm({...moduleForm, name: e.target.value})}
                placeholder="Nama Modul..." 
                className="w-full px-4 py-3 bg-white rounded-xl border-none text-xs outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-sm"
              />
              <textarea 
                value={moduleForm.description} 
                onChange={(e) => setModuleForm({...moduleForm, description: e.target.value})}
                placeholder="Deskripsi singkat..." 
                className="w-full px-4 py-3 bg-white rounded-xl border-none text-xs outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-sm h-16 resize-none"
              />
              <Button type="submit" className="w-full py-3 text-xs rounded-xl bg-emerald-600 font-bold shadow-lg shadow-emerald-900/20">Buat Modul Baru</Button>
            </form>
        </Card>

        {modules.map(mod => (
          <Card 
            key={mod.id} 
            className="group relative p-8 bg-white border-none shadow-sm hover:shadow-xl transition-all duration-500 rounded-[2.5rem] cursor-pointer overflow-hidden flex flex-col justify-between h-[340px]"
            onClick={() => router.push(`/dashboard/admin/vr/${mod.id}`)}
          >
            <div className="absolute top-0 right-0 p-6 flex flex-col items-end gap-2">
                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-300 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                </div>
            </div>

            <div>
                <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500 overflow-hidden shadow-inner">
                  {mod.thumbnail ? (
                    <img src={`http://localhost:5001${mod.thumbnail}`} className="w-full h-full object-cover" alt="" />
                  ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">{mod.name}</h3>
                <p className="text-gray-400 text-[10px] font-medium mt-2 line-clamp-2 leading-relaxed">{mod.description || 'Belum ada deskripsi.'}</p>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{mod._count?.scenes || 0} Titik VR</span>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setConfirmModal({
                      isOpen: true,
                      title: "Hapus Modul?",
                      message: `Seluruh data titik VR di dalam modul "${mod.name}" akan ikut terhapus. Tindakan ini tidak bisa dibatalkan.`,
                      onConfirm: async () => {
                        await fetch(`http://localhost:5001/api/vrtour/modules/${mod.id}`, { method: 'DELETE', credentials: 'include' });
                        fetchModules();
                      }
                    });
                  }}
                  className="text-[9px] font-bold text-red-300 hover:text-red-500 transition-colors uppercase tracking-widest mt-1"
                >
                  Hapus Modul
                </button>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(`/dashboard/tour/viewer/${mod.id}`, '_blank');
                  }}
                  className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all border border-emerald-100"
                >
                  Preview Hasil
                </button>
            </div>
          </Card>
        ))}
      </div>

      <ConfirmModal 
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
      />
    </div>
  );
}
