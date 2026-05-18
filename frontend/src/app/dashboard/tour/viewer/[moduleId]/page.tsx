"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import TaskOverlay from "@/components/dashboard/tour/TaskOverlay";
import { autoCheckTaskByTrigger } from "@/utils/progressStore";


export default function VRViewerPage() {
  const { moduleId } = useParams();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [moduleName, setModuleName] = useState("Simulasi Manasik VR");
  const [moduleDescription, setModuleDescription] = useState("Pengalaman Virtual Tour Manasik Haji & Umrah Premium");
  const [iframeSrc, setIframeSrc] = useState("/tour/index.htm");
  const [iframeLoading, setIframeLoading] = useState(true);

  // 1. Fetch dynamic module title/description and check folder path dynamically
  useEffect(() => {
    const fetchModuleDetails = async () => {
      try {
        // Fetch module data from API
        const res = await fetch("/api/vrtour/modules");
        const json = await res.json();
        if (json.status === "success") {
          const activeMod = json.data.find((m: any) => m.id === moduleId);
          if (activeMod) {
            setModuleName(activeMod.name);
            if (activeMod.description) {
              setModuleDescription(activeMod.description);
            }
          }
        }

        // Proactively check if there is a dedicated 3DVista folder for this specific moduleId in public/tour/
        const checkRes = await fetch(`/tour/${moduleId}/index.htm`, { method: "HEAD" });
        if (checkRes.ok) {
          setIframeSrc(`/tour/${moduleId}/index.htm`);
          console.log(`[3DVista Dynamic Router] Loaded custom tour folder: /tour/${moduleId}/index.htm`);
        } else {
          setIframeSrc("/tour/index.htm");
          console.log(`[3DVista Dynamic Router] Dedicated folder not found. Falling back to default: /tour/index.htm`);
        }
      } catch (err) {
        console.error("Error fetching dynamic VR module details:", err);
      }
    };

    if (moduleId) {
      fetchModuleDetails();
    }
  }, [moduleId]);

  // 2. Absolute 2-second timeout fallback to guarantee loading screen always fades out smoothly
  useEffect(() => {
    const timer = setTimeout(() => {
      setIframeLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // 3. Listen for automatic task triggers from 3DVista iframe (postMessage and window.parent helper triggers)
  useEffect(() => {
    const handleVRMessage = (event: MessageEvent) => {
      const data = event.data;
      if (data && (data.type === "VR_TASK_TRIGGER" || data.type === "VR_HOTSPOT_CLICKED" || data.type === "VR_SCENE_CHANGED")) {
        const triggerText = data.text || data.hotspotText || data.sceneName;
        if (triggerText && moduleId) {
          autoCheckTaskByTrigger(moduleId as string, triggerText);
        }
      }
      
      // If we got a scene changed event, broadcast it to the React overlays
      if (data && data.type === "VR_SCENE_CHANGED") {
        const sceneEvent = new CustomEvent("vrSceneChanged", {
          detail: {
            sceneName: data.sceneName,
            sceneIndex: data.sceneIndex,
            totalScenes: data.totalScenes
          }
        });
        window.dispatchEvent(sceneEvent);
      }
    };

    window.addEventListener("message", handleVRMessage);
    
    // Direct global helper for 3DVista custom action scripts (window.parent.triggerVRTask("Rukun Yamani"))
    (window as any).triggerVRTask = (text: string) => {
      if (moduleId) {
        autoCheckTaskByTrigger(moduleId as string, text);
      }
    };


    return () => {
      window.removeEventListener("message", handleVRMessage);
      delete (window as any).triggerVRTask;
    };
  }, [moduleId]);


  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[200] bg-black w-full h-full overflow-hidden"
    >
      {/* Floating Task checklist Overlay */}
      {moduleId && <TaskOverlay moduleId={moduleId as string} />}

      {/* Top Header Overlay */}
      <div className="absolute top-0 left-0 right-0 z-[210] p-6 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
        <div className="flex items-center gap-4 pointer-events-auto">
          <button
            onClick={() => router.back()}
            className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all border border-white/20"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div className="flex flex-col">
            <span className="text-white font-bold text-lg leading-none">{moduleName}</span>
            <span className="text-white/60 text-xs mt-1">{moduleDescription}</span>
          </div>
        </div>
        <div className="pointer-events-auto">
          <button
            onClick={() => {
              if (containerRef.current) {
                if (document.fullscreenElement) {
                  document.exitFullscreen().catch(() => {});
                } else {
                  containerRef.current.requestFullscreen().catch(() => {});
                }
              }
            }}
            className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm shadow-xl shadow-emerald-900/40 flex items-center gap-3 hover:bg-emerald-500 transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
            Fullscreen Toggle
          </button>
        </div>
      </div>

      {/* 3DVista Player Embedded inside high-performance Frame */}
      {iframeSrc && (
        <iframe
          src={iframeSrc}
          className="w-full h-full border-0 absolute inset-0 z-[100]"
          allow="gyroscope; accelerometer; xr-spatial-tracking; fullscreen"
          onLoad={() => setIframeLoading(false)}
        ></iframe>
      )}

      {/* Loading Overlay */}
      {iframeLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0a0a] z-[205]">
          <div className="w-20 h-20 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-6"></div>
          <p className="text-white font-medium animate-pulse tracking-widest text-sm uppercase">Menyiapkan Pengalaman Manasik 360°...</p>
        </div>
      )}
    </div>
  );
}
