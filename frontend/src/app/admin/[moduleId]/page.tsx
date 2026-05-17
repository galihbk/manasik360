"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Script from "next/script";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import ConfirmModal from "@/components/ui/ConfirmModal";

interface Scene {
  id: string;
  name: string;
  panoramaPath: string;
  isFirst: boolean;
  hotspots?: any[];
}

interface Module {
  id: string;
  name: string;
  description: string;
}

export default function ModuleEditorPage() {
  const params = useParams();
  const router = useRouter();
  const moduleId = params.moduleId as string;

  const [module, setModule] = useState<Module | null>(null);
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [loading, setLoading] = useState(true);

  // Reusable Confirmation Modal
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  // Coordinate Picker Tool State
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [pickerImage, setPickerImage] = useState("");

  // Live 360 Preview Tool State
  const [previewScene, setPreviewScene] = useState<Scene | null>(null);
  const [pannellumLoaded, setPannellumLoaded] = useState(false);
  const [activeViewer, setActiveViewer] = useState<any>(null);

  // Form State
  const [sceneForm, setSceneForm] = useState({ name: "", panoramaPath: "", isFirst: false, moduleId });
  const [hotspotForm, setHotspotForm] = useState({ sceneId: "", targetSceneId: "", pitch: 0, yaw: 0, text: "Maju" });

  const [isUploading, setIsUploading] = useState(false);

  const fetchData = async () => {
    try {
      // Fetch Module details
      const modRes = await fetch(`http://localhost:5001/api/vrtour/modules`, { credentials: "include" });
      const modJson = await modRes.json();
      if (modJson.status === "success") {
        const found = modJson.data.find((m: any) => m.id === moduleId);
        if (found) setModule(found);
      }

      // Fetch Scenes in Module
      const scRes = await fetch(`http://localhost:5001/api/vrtour/scenes?moduleId=${moduleId}`, { credentials: "include" });
      const scJson = await scRes.json();
      if (scJson.status === "success") setScenes(scJson.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [moduleId]);

  // Live 360 Preview Initializer
  useEffect(() => {
    if (previewScene && (window as any).pannellum) {
      const initTimer = setTimeout(() => {
        if (activeViewer) {
          try { activeViewer.destroy(); } catch (e) {}
        }

        const fullScene = scenes.find(s => s.id === previewScene.id);
        const hotSpots = fullScene?.hotspots?.map((hs: any) => ({
          pitch: hs.pitch,
          yaw: hs.yaw,
          type: "info",
          text: `${hs.text} (Ke: ${hs.targetScene?.name || 'Tujuan'})`
        })) || [];

        const viewer = (window as any).pannellum.viewer("pannellum-preview-container", {
          type: "equirectangular",
          panorama: `http://localhost:5001${previewScene.panoramaPath}`,
          autoLoad: true,
          hotSpots: hotSpots
        });
        setActiveViewer(viewer);
      }, 200);

      return () => clearTimeout(initTimer);
    }
  }, [previewScene, pannellumLoaded]);

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
      } else {
        alert(json.message);
      }
    } catch (err) {
      console.error(err);
      alert("Gagal mengunggah gambar");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCreateScene = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sceneForm.name || !sceneForm.panoramaPath) {
      alert("Silakan lengkapi nama titik dan gambar panorama!");
      return;
    }
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
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddHotspot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hotspotForm.sceneId || !hotspotForm.targetSceneId) {
      alert("Silakan pilih titik asal dan titik tujuan!");
      return;
    }
    try {
      const res = await fetch("http://localhost:5001/api/vrtour/hotspots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(hotspotForm)
      });
      if (res.ok) {
        alert("Jalur berhasil dihubungkan!");
        setHotspotForm({ ...hotspotForm, targetSceneId: "", text: "Maju", pitch: 0, yaw: 0 });
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Maps flat projection click to Yaw (-180 to 180) & Pitch (-90 to 90)
  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left; // x position within element
    const y = e.clientY - rect.top;  // y position within element
    
    const xPercent = x / rect.width;
    const yPercent = y / rect.height;

    // Convert to Yaw and Pitch coordinates
    const calculatedYaw = Math.round(-180 + (xPercent * 360));
    const calculatedPitch = Math.round(90 - (yPercent * 180));

    setHotspotForm({
      ...hotspotForm,
      yaw: calculatedYaw,
      pitch: calculatedPitch
    });
    setIsPickerOpen(false);
  };

  if (loading) return <div className="p-10 text-emerald-600 font-bold animate-pulse">Memuat Konfigurasi Modul...</div>;
  if (!module) return <div className="p-10 text-rose-500 font-bold">Modul tidak ditemukan.</div>;

  const activeOriginScene = scenes.find(s => s.id === hotspotForm.sceneId);

  return (
    <div className="space-y-8 pb-20">
      {/* Script & CSS for Pannellum */}
      <Script 
        src="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js"
        onLoad={() => setPannellumLoaded(true)}
      />
      <link 
        rel="stylesheet" 
        href="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css" 
      />

      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-100 pb-6">
        <div className="flex items-center gap-6">
           <button 
             onClick={() => router.push("/admin")}
             className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-500 hover:text-emerald-600 border border-slate-200 hover:shadow-sm transition-all"
           >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
           </button>
           <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-4">
                Kelola: {module.name}
              </h1>
              <p className="text-slate-500 text-sm mt-1">{module.description || "Rancang detail titik VR dan alur koneksi navigasi."}</p>
           </div>
        </div>
        <div className="flex items-center gap-2 px-5 py-3 bg-emerald-50 text-emerald-600 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-emerald-100">
           <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
           Editor Aktif
        </div>
      </div>

      {/* TWO COLUMN COMPONENT ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        
        {/* Create Scene Card */}
        <Card className="p-8 rounded-[2.5rem] border border-slate-100 shadow-sm bg-white flex flex-col justify-between">
           <div className="space-y-6">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-3">
                 <div className="w-9 h-9 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                 </div>
                 Upload Titik Baru
              </h3>
              <form onSubmit={handleCreateScene} className="space-y-5" id="scene-form">
                 <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Titik Navigasi</label>
                    <input 
                      value={sceneForm.name} 
                      onChange={(e) => setSceneForm({...sceneForm, name: e.target.value})}
                      placeholder="Contoh: Depan Ka'bah" 
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500/10 transition-all"
                    />
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Gambar Panorama 360°</label>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" id="editor-upload" />
                    <label 
                      htmlFor="editor-upload"
                      className={`w-full flex flex-col items-center justify-center px-6 py-8 border-2 border-dashed rounded-[2rem] cursor-pointer transition-all ${
                        sceneForm.panoramaPath ? 'border-emerald-250 bg-emerald-50/30' : 'border-slate-200 bg-slate-50 hover:bg-slate-100/60'
                      }`}
                    >
                       {isUploading ? (
                          <div className="w-6 h-6 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                       ) : sceneForm.panoramaPath ? (
                          <div className="text-center">
                             <svg className="w-8 h-8 text-emerald-600 mx-auto mb-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                             <p className="text-[8px] font-bold text-emerald-600 uppercase tracking-widest">Gambar Terupload</p>
                          </div>
                       ) : (
                          <div className="text-center">
                             <svg className="w-8 h-8 text-slate-400 mx-auto mb-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/></svg>
                             <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Pilih Gambar 360°</span>
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
                      className="w-4 h-4 rounded text-emerald-600 border-slate-200 bg-slate-50 focus:ring-emerald-500/20"
                    />
                    <label htmlFor="is-first" className="text-[9px] font-bold text-slate-500 uppercase tracking-widest cursor-pointer">Titik Awal Modul</label>
                 </div>
              </form>
           </div>
           <Button form="scene-form" type="submit" className="w-full py-3.5 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-900/5 mt-6 text-xs">
             Simpan Titik Baru
           </Button>
        </Card>

        {/* Connect Hotspot Card */}
        <Card className="p-8 rounded-[2.5rem] border border-slate-100 shadow-sm bg-white flex flex-col justify-between">
           <div className="space-y-6">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-3">
                 <div className="w-9 h-9 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"/></svg>
                 </div>
                 Hubungkan Jalur Navigasi
              </h3>
              <form onSubmit={handleAddHotspot} className="space-y-5" id="hotspot-form">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                       <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Dari Titik</label>
                       <select 
                         value={hotspotForm.sceneId}
                         onChange={(e) => setHotspotForm({...hotspotForm, sceneId: e.target.value})}
                         className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 outline-none appearance-none font-bold"
                       >
                          <option value="">Pilih Asal</option>
                          {scenes.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                       </select>
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Tujuan Ke</label>
                       <select 
                         value={hotspotForm.targetSceneId}
                         onChange={(e) => setHotspotForm({...hotspotForm, targetSceneId: e.target.value})}
                         className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 outline-none appearance-none font-bold"
                       >
                          <option value="">Pilih Target</option>
                          {scenes.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                       </select>
                    </div>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5 relative">
                       <div className="flex justify-between items-center">
                         <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Yaw Position</label>
                         {activeOriginScene && (
                           <button 
                             type="button" 
                             onClick={() => { setPickerImage(activeOriginScene.panoramaPath); setIsPickerOpen(true); }}
                             className="text-[8px] font-black text-emerald-600 hover:text-emerald-500 uppercase tracking-widest transition-colors animate-pulse"
                           >
                             [ Visual Picker ]
                           </button>
                         )}
                       </div>
                       <input 
                         type="number"
                         value={hotspotForm.yaw}
                         onChange={(e) => setHotspotForm({...hotspotForm, yaw: parseFloat(e.target.value)})}
                         className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none font-bold focus:ring-2 focus:ring-emerald-500/10"
                       />
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Pitch Position</label>
                       <input 
                         type="number"
                         min="-90"
                         max="90"
                         step="1"
                         value={hotspotForm.pitch}
                         onChange={(e) => setHotspotForm({...hotspotForm, pitch: Number(e.target.value)})}
                         className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none font-bold focus:ring-2 focus:ring-emerald-500/10"
                       />
                       <div className="flex gap-1 mt-1">
                         {([[-35,'Jalan'],[-15,'Bawah'],[0,'Mata'],[30,'Atas']] as [number,string][]).map(([val, label]) => (
                           <button
                             key={val}
                             type="button"
                             onClick={() => setHotspotForm({...hotspotForm, pitch: val})}
                             className={`flex-1 py-1 rounded-lg text-[8px] font-black uppercase tracking-wider transition-all ${
                               hotspotForm.pitch === val
                                 ? 'bg-emerald-500 text-white'
                                 : 'bg-slate-100 text-slate-500 hover:bg-emerald-50 hover:text-emerald-600'
                             }`}
                           >
                             {label}
                           </button>
                         ))}
                       </div>
                    </div>
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Label Tombol</label>
                    <input 
                       value={hotspotForm.text}
                       onChange={(e) => setHotspotForm({...hotspotForm, text: e.target.value})}
                       placeholder="Contoh: Maju ke Bukit Safa" 
                       className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none font-bold focus:ring-2 focus:ring-emerald-500/10"
                    />
                 </div>
              </form>
           </div>
           <Button form="hotspot-form" type="submit" className="w-full py-3.5 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-900/5 mt-6 text-xs">
             Simpan Jalur
           </Button>
        </Card>
      </div>

      {/* Scenes List table */}
      <Card className="p-8 rounded-[2.5rem] border border-slate-100 shadow-sm bg-white overflow-hidden">
         <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Daftar Titik di Modul Ini</h3>
            <span className="px-4 py-1.5 bg-slate-50 border border-slate-200 rounded-full text-[9px] font-black text-emerald-600 uppercase tracking-widest">
              {scenes.length} Titik Terdaftar
            </span>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
                     <th className="pb-4 px-4">Urutan</th>
                     <th className="pb-4">Nama Titik</th>
                     <th className="pb-4">Preview</th>
                     <th className="pb-4">Status</th>
                     <th className="pb-4 text-right px-4">Aksi</th>
                  </tr>
               </thead>
               <tbody className="text-xs">
                  {scenes.map((scene, idx) => (
                    <tr key={scene.id} className="border-b border-slate-50 last:border-none group hover:bg-slate-50/50 transition-colors">
                       <td className="py-4 px-4 font-black text-slate-400">{(idx + 1).toString().padStart(2, '0')}</td>
                       <td className="py-4 font-bold text-slate-900">{scene.name}</td>
                       <td className="py-4">
                          <div className="w-16 h-10 rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                             <img src={`http://localhost:5001${scene.panoramaPath}`} className="w-full h-full object-cover" alt="" />
                          </div>
                       </td>
                       <td className="py-4">
                          {scene.isFirst && (
                            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg text-[9px] font-black uppercase tracking-tighter">
                              Start Point
                            </span>
                          )}
                       </td>
                       <td className="py-4 text-right px-4">
                          <div className="flex justify-end gap-2 ml-auto">
                            <button 
                              onClick={() => setPreviewScene(scene)}
                              title="Buka Live 360° Preview"
                              className="w-8 h-8 flex items-center justify-center text-emerald-600 hover:text-emerald-500 hover:bg-emerald-50 rounded-lg border border-transparent hover:border-emerald-100 transition-all"
                            >
                               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                            </button>
                            <button 
                              onClick={() => {
                                setConfirmModal({
                                  isOpen: true,
                                  title: "Hapus Titik VR?",
                                  message: `Apakah Anda yakin ingin menghapus titik "${scene.name}"? Seluruh koneksi navigasi (hotspots) yang terikat pada titik ini akan ikut terhapus.`,
                                  onConfirm: async () => {
                                    await fetch(`http://localhost:5001/api/vrtour/scenes/${scene.id}`, { method: 'DELETE', credentials: 'include' });
                                    fetchData();
                                  }
                                });
                              }}
                              className="w-8 h-8 flex items-center justify-center text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-transparent hover:border-rose-100 transition-all"
                            >
                               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                            </button>
                          </div>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </Card>

      {/* VISUAL COORDINATE MAP MODAL */}
      {isPickerOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-6">
           <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setIsPickerOpen(false)} />
           <div className="relative w-full max-w-4xl bg-white border border-slate-100 rounded-[3rem] p-8 shadow-2xl animate-in zoom-in-95 duration-300">
              <div className="flex justify-between items-center mb-6">
                 <div>
                    <h3 className="text-xl font-black text-slate-900">Visual Coordinate Picker</h3>
                    <p className="text-xs text-slate-500 mt-1">Klik di mana saja pada proyeksi flat di bawah untuk mengambil koordinat Yaw & Pitch secara presisi.</p>
                 </div>
                 <button onClick={() => setIsPickerOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold text-sm">Tutup</button>
              </div>

              <div 
                className="relative w-full h-[400px] rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 cursor-crosshair group"
                onClick={handleMapClick}
              >
                 <img src={`http://localhost:5001${pickerImage}`} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300" alt="Panorama Flat Projection" />
                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    {/* Visual Center Hairlines */}
                    <div className="w-full h-[1px] bg-emerald-500/20"></div>
                    <div className="h-full w-[1px] bg-emerald-500/20 absolute"></div>
                 </div>
              </div>
              <div className="mt-4 flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-emerald-600">
                 <span>Yaw: -180 &larr;&rarr; 180</span>
                 <span>Pitch: -90 (Bawah) &uarr;&darr; 90 (Atas)</span>
              </div>
           </div>
        </div>
      )}

      {/* INTERACTIVE 360 LIVE PREVIEW MODAL */}
      {previewScene && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-6">
           <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setPreviewScene(null)} />
           <div className="relative w-full max-w-4xl bg-white border border-slate-100 rounded-[3rem] p-8 shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col">
              <div className="flex justify-between items-center mb-6 shrink-0">
                 <div>
                    <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                       <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></span>
                       Live 360° Preview: {previewScene.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">Gunakan mouse Anda untuk menyeret/memutar gambar dan mengecek penempatan tombol hotspot.</p>
                 </div>
                 <button onClick={() => setPreviewScene(null)} className="text-slate-400 hover:text-slate-650 font-bold text-sm">Tutup Preview</button>
              </div>

              {/* Panorama Box */}
              <div 
                id="pannellum-preview-container" 
                className="w-full h-[450px] rounded-2xl overflow-hidden border border-slate-200 bg-black cursor-grab active:cursor-grabbing"
              ></div>

              <div className="mt-4 text-[9px] font-black uppercase tracking-widest text-emerald-600 shrink-0 flex justify-between">
                 <span>Aktivasi Hotspots: Mode Simulasi Terintegrasi</span>
                 <span>Pannellum Engine v2.5.6</span>
              </div>
           </div>
        </div>
      )}

      {/* CONFIRMATION MODAL */}
      <ConfirmModal 
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
      />

      <style jsx global>{`
        .pnlm-load-box { display: none !important; }
        .pnlm-about-msg { display: none !important; }
        .pnlm-control-bar { background: rgba(255,255,255,0.8) !important; border-radius: 12px !important; border: 1px solid rgba(0,0,0,0.05) !important; }
        .pnlm-hotspot-base { border-radius: 50% !important; background: rgba(16, 185, 129, 0.85) !important; border: 4px solid white !important; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3) !important; cursor: pointer !important; transition: all 0.3s !important; }
        .pnlm-hotspot-base:hover { transform: scale(1.3) !important; background: rgba(16, 185, 129, 1) !important; }
      `}</style>
    </div>
  );
}
