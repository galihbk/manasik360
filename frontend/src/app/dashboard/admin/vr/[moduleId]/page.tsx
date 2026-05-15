"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import ConfirmModal from "@/components/ui/ConfirmModal";

interface Scene {
  id: string;
  name: string;
  panoramaPath: string;
  isFirst: boolean;
  moduleId?: string;
}

interface Module {
  id: string;
  name: string;
  description: string;
}

export default function ModuleEditorPage() {
  const router = useRouter();
  const { moduleId } = useParams();
  const { user, loading: authLoading } = useAuth();
  
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [module, setModule] = useState<Module | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  // Forms
  const [sceneForm, setSceneForm] = useState({ name: "", panoramaPath: "", isFirst: false, moduleId: moduleId as string });
  const [hotspotForm, setHotspotForm] = useState({ sceneId: "", targetSceneId: "", pitch: 0, yaw: 0, text: "Maju" });

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'ADMIN')) {
      router.push('/dashboard');
    }
  }, [user, authLoading]);

  const fetchData = async () => {
    try {
      // Fetch Module Info
      const modRes = await fetch(`http://localhost:5001/api/vrtour/modules`, { credentials: "include" });
      const modJson = await modRes.json();
      const currentMod = modJson.data.find((m: any) => m.id === moduleId);
      setModule(currentMod);

      // Fetch Scenes
      const sceneRes = await fetch(`http://localhost:5001/api/vrtour/scenes?moduleId=${moduleId}`, { credentials: "include" });
      const sceneJson = await sceneRes.json();
      setScenes(sceneJson.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (moduleId) fetchData();
  }, [moduleId]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append("panorama", file);
    try {
      const res = await fetch("http://localhost:5001/api/vrtour/upload", {
        method: "POST",
        credentials: "include",
        body: formData
      });
      const json = await res.json();
      if (json.status === "success") {
        setSceneForm({ ...sceneForm, panoramaPath: json.data.filePath });
      }
    } catch (err) { console.error(err); } finally { setIsUploading(false); }
  };

  const handleCreateScene = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sceneForm.panoramaPath) return alert("Upload foto dulu!");
    try {
      const res = await fetch("http://localhost:5001/api/vrtour/scenes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(sceneForm)
      });
      if (res.ok) {
        alert("Titik VR berhasil disimpan!");
        setSceneForm({ ...sceneForm, name: "", panoramaPath: "", isFirst: false });
        fetchData();
      }
    } catch (err) { console.error(err); }
  };

  const handleAddHotspot = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5001/api/vrtour/hotspots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(hotspotForm)
      });
      if (res.ok) {
        alert("Jalur berhasil dihubungkan!");
        fetchData();
      }
    } catch (err) { console.error(err); }
  };

  if (loading || authLoading) return <div className="p-10 text-emerald-600 font-bold">Memuat Editor...</div>;

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
           <button 
             onClick={() => router.push('/dashboard/admin/vr')}
             className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-gray-400 hover:text-emerald-600 hover:shadow-lg transition-all shadow-sm"
           >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
           </button>
           <div>
              <h1 className="text-3xl font-bold text-gray-900">Kelola: {module?.name}</h1>
              <p className="text-gray-500">Konfigurasi foto 360° dan jalur navigasi.</p>
           </div>
        </div>
        <div className="flex items-center gap-2 px-6 py-3 bg-emerald-50 text-emerald-600 rounded-2xl font-bold text-xs uppercase tracking-widest border border-emerald-100 shadow-sm">
           <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
           Editor Active
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <Card className="p-8 rounded-[2.5rem] border-none shadow-sm bg-white flex flex-col justify-between">
           <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-3">
                 <div className="w-9 h-9 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                 </div>
                 Upload Titik Baru
              </h3>
              <form onSubmit={handleCreateScene} className="space-y-5" id="scene-form">
                 <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Nama Titik Navigasi</label>
                    <input 
                      value={sceneForm.name} 
                      onChange={(e) => setSceneForm({...sceneForm, name: e.target.value})}
                      placeholder="Contoh: Depan Ka'bah" 
                      className="w-full px-5 py-3 bg-gray-50 rounded-xl border-none text-xs outline-none focus:ring-2 focus:ring-emerald-500/10 transition-all"
                    />
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Gambar Panorama 360°</label>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" id="editor-upload" />
                    <label 
                      htmlFor="editor-upload"
                      className={`w-full flex flex-col items-center justify-center px-6 py-8 border-2 border-dashed rounded-[2rem] cursor-pointer transition-all ${
                        sceneForm.panoramaPath ? 'border-emerald-200 bg-emerald-50/30' : 'border-gray-100 bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                       {isUploading ? (
                          <div className="w-6 h-6 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                       ) : sceneForm.panoramaPath ? (
                          <div className="text-center">
                             <svg className="w-8 h-8 text-emerald-500 mx-auto mb-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                             <p className="text-[8px] font-bold text-emerald-600 uppercase tracking-widest">Siap Disimpan</p>
                          </div>
                       ) : (
                          <div className="text-center">
                             <svg className="w-8 h-8 text-gray-200 mx-auto mb-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/></svg>
                             <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Pilih Gambar</span>
                          </div>
                       )}
                    </label>
                 </div>
                 <div className="flex items-center gap-3 py-0.5">
                    <input 
                      type="checkbox" 
                      id="is-first"
                      checked={sceneForm.isFirst}
                      onChange={(e) => setSceneForm({...sceneForm, isFirst: e.target.checked})}
                      className="w-4 h-4 rounded text-emerald-600 border-gray-200 focus:ring-emerald-500/20"
                    />
                    <label htmlFor="is-first" className="text-[9px] font-bold text-gray-400 uppercase tracking-widest cursor-pointer">Titik Awal Modul</label>
                 </div>
              </form>
           </div>
           <Button form="scene-form" type="submit" className="w-full py-3.5 rounded-xl font-bold shadow-lg shadow-emerald-900/5 mt-6 bg-emerald-900 text-xs">Simpan Titik Baru</Button>
        </Card>

        <Card className="p-8 rounded-[2.5rem] border-none shadow-sm bg-white flex flex-col justify-between">
           <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-3">
                 <div className="w-9 h-9 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"/></svg>
                 </div>
                 Hubungkan Jalur
              </h3>
              <form onSubmit={handleAddHotspot} className="space-y-5" id="hotspot-form">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                       <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Dari Titik</label>
                       <select 
                         value={hotspotForm.sceneId}
                         onChange={(e) => setHotspotForm({...hotspotForm, sceneId: e.target.value})}
                         className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none text-xs outline-none appearance-none font-bold text-gray-600"
                       >
                          <option value="">Asal</option>
                          {scenes.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                       </select>
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Tujuan Ke</label>
                       <select 
                         value={hotspotForm.targetSceneId}
                         onChange={(e) => setHotspotForm({...hotspotForm, targetSceneId: e.target.value})}
                         className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none text-xs outline-none appearance-none font-bold text-gray-600"
                       >
                          <option value="">Target</option>
                          {scenes.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                       </select>
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                       <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Yaw Position</label>
                       <input 
                         type="number"
                         value={hotspotForm.yaw}
                         onChange={(e) => setHotspotForm({...hotspotForm, yaw: parseFloat(e.target.value)})}
                         className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none text-xs outline-none font-bold text-gray-600"
                       />
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Pitch Position</label>
                       <input 
                         type="number"
                         value={hotspotForm.pitch}
                         onChange={(e) => setHotspotForm({...hotspotForm, pitch: parseFloat(e.target.value)})}
                         className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none text-xs outline-none font-bold text-gray-600"
                       />
                    </div>
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Label Tombol</label>
                    <input 
                       value={hotspotForm.text}
                       onChange={(e) => setHotspotForm({...hotspotForm, text: e.target.value})}
                       placeholder="Contoh: Maju ke Safa" 
                       className="w-full px-5 py-3 bg-gray-50 rounded-xl border-none text-xs outline-none font-bold text-gray-600"
                    />
                 </div>
              </form>
           </div>
           <Button form="hotspot-form" type="submit" className="w-full py-3.5 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-900/5 mt-6 text-xs">Simpan Koneksi Jalur</Button>
        </Card>
      </div>

      <Card className="p-10 rounded-[3rem] border-none shadow-sm overflow-hidden bg-white">
         <div className="flex justify-between items-center mb-10">
            <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Daftar Titik di Modul Ini</h3>
            <span className="px-4 py-1.5 bg-gray-100 rounded-full text-[10px] font-black text-gray-500 uppercase tracking-widest">{scenes.length} Titik Terdaftar</span>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50">
                     <th className="pb-6 px-4">Urutan</th>
                     <th className="pb-6">Nama Titik</th>
                     <th className="pb-6">Preview</th>
                     <th className="pb-6">Status</th>
                     <th className="pb-6 text-right px-4">Aksi</th>
                  </tr>
               </thead>
               <tbody className="text-sm">
                  {scenes.map((scene, idx) => (
                    <tr key={scene.id} className="border-b border-gray-50 last:border-none group hover:bg-gray-50/50 transition-colors">
                       <td className="py-6 px-4 font-black text-gray-300">{(idx + 1).toString().padStart(2, '0')}</td>
                       <td className="py-6 font-bold text-gray-900">{scene.name}</td>
                       <td className="py-6">
                          <div className="w-16 h-10 rounded-lg overflow-hidden bg-gray-100 border border-gray-100">
                             <img src={scene.panoramaPath.startsWith('http') ? scene.panoramaPath : `http://localhost:5001${scene.panoramaPath}`} className="w-full h-full object-cover" alt="" />
                          </div>
                       </td>
                       <td className="py-6">
                          {scene.isFirst && <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-[10px] font-black uppercase tracking-tighter">Start Point</span>}
                       </td>
                       <td className="py-6 text-right px-4">
                          <button 
                            onClick={() => setConfirmModal({
                              isOpen: true,
                              title: "Hapus Titik VR?",
                              message: `Apakah Anda yakin ingin menghapus titik "${scene.name}"?`,
                              onConfirm: async () => {
                                await fetch(`http://localhost:5001/api/vrtour/scenes/${scene.id}`, { method: 'DELETE', credentials: 'include' });
                                fetchData();
                              }
                            })}
                            className="w-8 h-8 flex items-center justify-center text-red-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all ml-auto"
                          >
                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                          </button>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </Card>

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
