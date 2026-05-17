"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
    } catch (err) { 
      console.error(err); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { 
    fetchModules(); 
  }, []);

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
    } catch (err) { 
      console.error(err); 
    } finally { 
      setIsUploadingModule(false); 
    }
  };

  const handleCreateModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!moduleForm.name) {
      alert("Nama modul wajib diisi!");
      return;
    }
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
    } catch (err) { 
      console.error(err); 
    }
  };

  if (loading) return <div className="p-10 text-emerald-600 font-bold animate-pulse">Memuat Modul VR...</div>;

  return (
    <div className="space-y-10 pb-20">
      {/* HEADER SECTION */}
      <div className="flex justify-between items-end border-b border-slate-100 pb-6">
        <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Kurikulum Virtual Reality</h1>
            <p className="text-slate-500 text-sm mt-1">Kelola dan rancang petualangan manasik interaktif 360° Anda.</p>
        </div>
        <div className="hidden lg:block">
            <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100 uppercase tracking-widest">
              Total: {modules.length} Modul
            </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Create Module Card */}
        <Card className="p-8 border border-dashed border-slate-200 bg-white flex flex-col justify-between text-left gap-4 group hover:border-emerald-500/30 hover:bg-emerald-50/5 transition-all duration-300 rounded-[2.5rem] min-h-[420px] shadow-sm">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
                </div>
                <div>
                  <h3 className="font-black text-slate-900 tracking-tight text-base">Tambah Modul</h3>
                  <p className="text-[9px] text-emerald-600 font-bold uppercase tracking-wider">Kurikulum Baru</p>
                </div>
              </div>
              
              <form onSubmit={handleCreateModule} className="w-full space-y-4" id="module-create-form">
                <div className="relative group/thumb">
                    <input type="file" accept="image/*" onChange={handleModuleThumbnailUpload} className="hidden" id="module-thumb" />
                    <label htmlFor="module-thumb" className="block w-full h-28 bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden cursor-pointer hover:border-emerald-500/50 transition-all">
                      {isUploadingModule ? (
                        <div className="flex items-center justify-center h-full"><div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div></div>
                      ) : moduleThumbnail ? (
                        <img src={`http://localhost:5001${moduleThumbnail}`} className="w-full h-full object-cover" alt="" />
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-slate-400 hover:text-slate-600 transition-colors">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                            <span className="text-[8px] font-black uppercase tracking-widest mt-2">Upload Sampul Modul</span>
                        </div>
                      )}
                    </label>
                </div>
                <input 
                  value={moduleForm.name} 
                  onChange={(e) => setModuleForm({...moduleForm, name: e.target.value})}
                  placeholder="Nama Modul..." 
                  className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500/10 shadow-sm"
                />
                <textarea 
                  value={moduleForm.description} 
                  onChange={(e) => setModuleForm({...moduleForm, description: e.target.value})}
                  placeholder="Deskripsi singkat..." 
                  className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500/10 shadow-sm h-20 resize-none"
                />
              </form>
            </div>

            <Button form="module-create-form" type="submit" className="w-full py-3.5 text-xs rounded-xl bg-emerald-600 font-bold hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-900/10">
              Buat Modul Baru
            </Button>
        </Card>

        {/* Existing Modules */}
        {modules.map(mod => (
          <Card 
            key={mod.id} 
            className="group relative p-8 bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-100 hover:border-emerald-500/30 transition-all duration-500 rounded-[2.5rem] cursor-pointer overflow-hidden flex flex-col justify-between min-h-[420px]"
            onClick={() => router.push(`/admin/${mod.id}`)}
          >
            <div>
              {/* Thumbnail Container */}
              <div className="w-full h-36 bg-slate-50 rounded-3xl overflow-hidden mb-6 relative border border-slate-100">
                {mod.thumbnail ? (
                  <img src={`http://localhost:5001${mod.thumbnail}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-emerald-600">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
                  </div>
                )}
                <div className="absolute top-4 right-4">
                  <div className="w-8 h-8 bg-white/90 backdrop-blur-md rounded-xl flex items-center justify-center text-slate-500 group-hover:bg-emerald-600 group-hover:text-white border border-slate-150 shadow-sm transition-all duration-300">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                  </div>
                </div>
              </div>

              <h3 className="text-lg font-black text-slate-900 group-hover:text-emerald-600 transition-colors leading-snug tracking-tight">{mod.name}</h3>
              <p className="text-slate-500 text-xs mt-2 line-clamp-3 leading-relaxed">{mod.description || 'Belum ada deskripsi.'}</p>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{mod._count?.scenes || 0} Titik VR</span>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setConfirmModal({
                        isOpen: true,
                        title: "Hapus Modul?",
                        message: `Seluruh data titik VR di dalam modul "${mod.name}" akan ikut terhapus permanen dari server.`,
                        onConfirm: async () => {
                          await fetch(`http://localhost:5001/api/vrtour/modules/${mod.id}`, { method: 'DELETE', credentials: 'include' });
                          fetchModules();
                        }
                      });
                    }}
                    className="text-[9px] font-bold text-rose-500 hover:text-rose-600 transition-colors uppercase tracking-widest mt-1 text-left"
                  >
                    Hapus Modul
                  </button>
                </div>
                
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(`/dashboard/tour/viewer/${mod.id}`, '_blank');
                  }}
                  className="px-4 py-2 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white hover:border-emerald-500 transition-all duration-300"
                >
                  Preview
                </button>
            </div>
          </Card>
        ))}
      </div>

      {/* CONFIRMATION MODAL */}
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
