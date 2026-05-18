"use client";

export interface Task {
  id: string;
  title: string;
  isCompleted: boolean;
}

export interface VRModuleProgress {
  id: string; // 'ihram', 'tawaf', 'sai', 'wukuf', 'muzdalifah', 'jumrah'
  title: string;
  status: "Belum Mulai" | "Berlangsung" | "Selesai";
  progress: number; // 0 to 100
  time: string;
  tasks: Task[];
  date: string;
}

const DEFAULT_PROGRESS: VRModuleProgress[] = [
  {
    id: "ihram",
    title: "Ihram & Miqat",
    status: "Belum Mulai",
    progress: 0,
    time: "0m",
    date: "-",
    tasks: [
      { id: "ihram-1", title: "Pilih lokasi miqat", isCompleted: false },
      { id: "ihram-2", title: "Memasuki area Miqat", isCompleted: false },
      { id: "ihram-3", title: "Panduan membaca niat", isCompleted: false },
      { id: "ihram-4", title: "Shalat Sunnah ihram", isCompleted: false },
      { id: "ihram-5", title: "Memulai perjalanan ke Mekkah", isCompleted: false }
    ]
  },
  {
    id: "tawaf",
    title: "Tawaf Ifadah",
    status: "Belum Mulai",
    progress: 0,
    time: "0m",
    date: "-",
    tasks: [
      { id: "tawaf-1", title: "Masuk Masjidil Haram & berniat", isCompleted: false },
      { id: "tawaf-2", title: "Menghadap Hajar Aswad (Mulai)", isCompleted: false },
      { id: "tawaf-3", title: "Mengitari Ka'bah sebanyak 7 putaran", isCompleted: false },
      { id: "tawaf-4", title: "Membaca doa di Rukun Yamani", isCompleted: false },
      { id: "tawaf-5", title: "Shalat 2 rakaat di belakang Maqam Ibrahim", isCompleted: false }
    ]
  },
  {
    id: "sai",
    title: "Sa'i Safa-Marwah",
    status: "Belum Mulai",
    progress: 0,
    time: "0m",
    date: "-",
    tasks: [
      { id: "sai-1", title: "Mendaki Bukit Safa & berniat Sa'i", isCompleted: false },
      { id: "sai-2", title: "Mulai berjalan menuju Bukit Marwah", isCompleted: false },
      { id: "sai-3", title: "Lari-lari kecil di area Lampu Hijau", isCompleted: false },
      { id: "sai-4", title: "Berzikir dan berdoa di Bukit Marwah", isCompleted: false },
      { id: "sai-5", title: "Menyelesaikan 7 kali perjalanan", isCompleted: false },
      { id: "sai-6", title: "Melakukan Tahallul (potong rambut)", isCompleted: false }
    ]
  },
  {
    id: "wukuf",
    title: "Wukuf di Arafah",
    status: "Belum Mulai",
    progress: 0,
    time: "0m",
    date: "-",
    tasks: [
      { id: "wukuf-1", title: "Tiba di Arafah pada 9 Dzulhijjah", isCompleted: false },
      { id: "wukuf-2", title: "Mendengarkan Khutbah Wukuf", isCompleted: false },
      { id: "wukuf-3", title: "Melaksanakan shalat Jama' Qashar", isCompleted: false },
      { id: "wukuf-4", title: "Memperbanyak zikir, doa, dan istighfar", isCompleted: false }
    ]
  },
  {
    id: "muzdalifah",
    title: "Mabit di Muzdalifah",
    status: "Belum Mulai",
    progress: 0,
    time: "0m",
    date: "-",
    tasks: [
      { id: "muzdalifah-1", title: "Tiba di Muzdalifah setelah sunset Arafah", isCompleted: false },
      { id: "muzdalifah-2", title: "Mabit (menginap) hingga melewati tengah malam", isCompleted: false },
      { id: "muzdalifah-3", title: "Mengumpulkan batu kerikil untuk melontar Jumrah", isCompleted: false }
    ]
  },
  {
    id: "jumrah",
    title: "Melontar Jumrah",
    status: "Belum Mulai",
    progress: 0,
    time: "0m",
    date: "-",
    tasks: [
      { id: "jumrah-1", title: "Menuju komplek Jamarat di Mina", isCompleted: false },
      { id: "jumrah-2", title: "Melontar Jumrah Aqabah pada hari Nahr (10 Dzulhijjah)", isCompleted: false },
      { id: "jumrah-3", title: "Melontar Jumrah Ula pada hari Tasyrik", isCompleted: false },
      { id: "jumrah-4", title: "Melontar Jumrah Wustha pada hari Tasyrik", isCompleted: false },
      { id: "jumrah-5", title: "Melontar Jumrah Aqabah pada hari Tasyrik", isCompleted: false },
      { id: "jumrah-6", title: "Mengakhiri dengan Tahallul Tsani", isCompleted: false }
    ]
  }
];

const LOCAL_STORAGE_KEY = "manasik360_modules_progress";

// Helper to check if localStorage is available (client-side only)
const isClient = () => typeof window !== "undefined";

export const getProgressStore = (): VRModuleProgress[] => {
  if (!isClient()) return DEFAULT_PROGRESS;

  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_PROGRESS));
    return DEFAULT_PROGRESS;
  }

  try {
    const parsed = JSON.parse(stored) as VRModuleProgress[];
    // Self-healing migration: if the old test progress is present (Ihram = 100), reset it to start completely fresh!
    if (parsed.some(m => m.id === "ihram" && m.progress === 100)) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_PROGRESS));
      localStorage.removeItem("manasik360_module_steps"); // clear step-level locks too!
      return DEFAULT_PROGRESS;
    }
    return parsed;
  } catch (e) {
    console.error("Error parsing progress store:", e);
    return DEFAULT_PROGRESS;
  }
};

export const saveProgressStore = (store: VRModuleProgress[]) => {
  if (!isClient()) return;
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(store));

  // Dispatch a custom event to notify other components on the same page
  window.dispatchEvent(new Event("progressStoreUpdated"));
};

/**
 * Normalizes input module ID or title to match one of the standard keys.
 */
export const normalizeModuleId = (idOrName: string): string => {
  if (!idOrName) return "tawaf";
  
  const lower = idOrName.toLowerCase();
  
  if (lower === "ihram" || lower.includes("ihram") || lower.includes("miqat") || lower.includes("mengenakan kain")) {
    return "ihram";
  }
  if (lower === "tawaf" || lower.includes("tawaf") || lower.includes("ifadah") || lower === "default") {
    return "tawaf";
  }
  if (lower === "sai" || lower.includes("sai") || lower.includes("safa") || lower.includes("marwah")) {
    return "sai";
  }
  if (lower === "wukuf" || lower.includes("wukuf") || lower.includes("arafah")) {
    return "wukuf";
  }
  if (lower === "muzdalifah" || lower.includes("muzdalifah") || lower.includes("mabit")) {
    return "muzdalifah";
  }
  if (lower === "jumrah" || lower.includes("jumrah") || lower.includes("jumroh") || lower.includes("lempar")) {
    return "jumrah";
  }

  return "tawaf"; // Fallback to tawaf
};

export const getModuleProgress = (idOrName: string): VRModuleProgress => {
  const normalizedId = normalizeModuleId(idOrName);
  const store = getProgressStore();
  return store.find((m) => m.id === normalizedId) || store[1]; // fallback to tawaf
};

export const updateTaskStatus = (
  moduleIdOrName: string,
  taskId: string,
  isCompleted: boolean
): VRModuleProgress[] => {
  const normalizedId = normalizeModuleId(moduleIdOrName);
  const store = getProgressStore();
  
  const updatedStore = store.map((module) => {
    if (module.id !== normalizedId) return module;

    const updatedTasks = module.tasks.map((task) => {
      if (task.id === taskId) {
        return { ...task, isCompleted };
      }
      return task;
    });

    const completedCount = updatedTasks.filter((t) => t.isCompleted).length;
    const progress = Math.round((completedCount / updatedTasks.length) * 100);
    
    let status: "Belum Mulai" | "Berlangsung" | "Selesai" = "Belum Mulai";
    if (progress === 100) {
      status = "Selesai";
    } else if (progress > 0) {
      status = "Berlangsung";
    }

    const today = new Date();
    const formattedDate = today.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });

    // Estimate time based on checked tasks (mocked time)
    const time = `${Math.max(2, completedCount * 3 + Math.floor(Math.random() * 2))}m`;

    return {
      ...module,
      tasks: updatedTasks,
      progress,
      status,
      time,
      date: formattedDate
    };
  });

  saveProgressStore(updatedStore);
  return updatedStore;
};

export const getOverallProgress = (): number => {
  const store = getProgressStore();
  const total = store.reduce((sum, m) => sum + m.progress, 0);
  return Math.round(total / store.length);
};

export const resetProgress = () => {
  saveProgressStore(DEFAULT_PROGRESS);
};

// Keyword mapping for automatic task completion based on hotspot interactions or scene name transitions
const KEYWORD_MAP: Record<string, Record<string, string[]>> = {
  ihram: {
    "ihram-1": ["lokasi", "miqat", "titik miqat", "pilih lokasi"],
    "ihram-2": ["masuk", "area miqat", "memasuki"],
    "ihram-3": ["niat", "baca niat", "niat ihram", "panduan niat", "labbaik"],
    "ihram-4": ["shalat", "sunnah", "sunnah ihram", "larangan ihram", "larangan"],
    "ihram-5": ["jalan", "mekkah", "perjalanan", "memulai", "keluar"]
  },
  tawaf: {
    "tawaf-1": ["masuk", "berniat", "masjidil haram", "haram"],
    "tawaf-2": ["hajar", "aswad", "hajar aswad", "mulai"],
    "tawaf-3": ["keliling", "putar", "mengitari", "7 putaran", "tawaf"],
    "tawaf-4": ["yamani", "rukun yamani", "doa yamani"],
    "tawaf-5": ["ibrahim", "maqam", "maqam ibrahim"]
  },
  sai: {
    "sai-1": ["safa", "bukit safa"],
    "sai-2": ["jalan", "menuju marwah", "berjalan"],
    "sai-3": ["hijau", "lampu hijau", "lari kecil"],
    "sai-4": ["marwah", "bukit marwah", "berzikir"],
    "sai-5": ["7 kali", "perjalanan"],
    "sai-6": ["tahallul", "potong rambut", "cukur"]
  },
  wukuf: {
    "wukuf-1": ["tiba", "arafah", "tasyrik"],
    "wukuf-2": ["khutbah", "dengar"],
    "wukuf-3": ["shalat", "jama", "qashar"],
    "wukuf-4": ["zikir", "istighfar", "wukuf arafah"]
  },
  muzdalifah: {
    "muzdalifah-1": ["tiba", "muzdalifah", "sunset"],
    "muzdalifah-2": ["mabit", "nginap", "tengah malam"],
    "muzdalifah-3": ["kerikil", "batu", "kumpul"]
  },
  jumrah: {
    "jumrah-1": ["mina", "jamarat"],
    "jumrah-2": ["nahr", "aqabah", "10 dzulhijjah"],
    "jumrah-3": ["ula"],
    "jumrah-4": ["wustha"],
    "jumrah-5": ["tasyrik", "aqabah tasyrik"],
    "jumrah-6": ["tahallul tsani", "cukur", "potong"]
  }
};

/**
 * Automatically triggers task completion if trigger text matches mapped keywords.
 * Returns true if a task status was changed, false otherwise.
 */
export const autoCheckTaskByTrigger = (
  moduleIdOrName: string,
  triggerText: string
): boolean => {
  const normalizedId = normalizeModuleId(moduleIdOrName);
  const triggerLower = triggerText.toLowerCase();
  
  const moduleKeywords = KEYWORD_MAP[normalizedId];
  if (!moduleKeywords) return false;

  let taskUpdated = false;
  const store = getProgressStore();
  const targetModule = store.find(m => m.id === normalizedId);
  if (!targetModule) return false;

  for (const taskId in moduleKeywords) {
    const keywords = moduleKeywords[taskId];
    // Check if trigger text contains the keyword or vice-versa
    const isMatched = keywords.some(kw => triggerLower.includes(kw) || kw.includes(triggerLower));
    
    if (isMatched) {
      const targetTask = targetModule.tasks.find(t => t.id === taskId);
      if (targetTask && !targetTask.isCompleted) {
        updateTaskStatus(normalizedId, taskId, true);
        taskUpdated = true;
        
        // Dispatch a custom event specifically for the toast notification
        if (isClient()) {
          const autoCheckEvent = new CustomEvent("vrTaskAutoChecked", {
            detail: { moduleTitle: targetModule.title, taskTitle: targetTask.title }
          });
          window.dispatchEvent(autoCheckEvent);
        }
      }
    }
  }

  return taskUpdated;
};

export interface UnifiedModuleProgress {
  id: string;
  title: string;
  status: "Belum Mulai" | "Berlangsung" | "Selesai";
  progress: number;
  time: string;
  date: string;
  videoCompleted: boolean;
  doaCompleted: boolean;
  vrProgress: number;
  completedTasks: number;
  totalTasks: number;
}

export const getUnifiedProgressStore = (): UnifiedModuleProgress[] => {
  const vrStore = getProgressStore();
  
  let moduleSteps: Record<string, { videoCompleted: boolean; doaCompleted: boolean }> = {};
  if (typeof window !== "undefined") {
    const storedSteps = localStorage.getItem("manasik360_module_steps");
    if (storedSteps) {
      try {
        moduleSteps = JSON.parse(storedSteps);
      } catch (e) {}
    }
  }

  return vrStore.map((m) => {
    const steps = moduleSteps[m.id] || { videoCompleted: false, doaCompleted: false };
    
    const videoWeight = steps.videoCompleted ? 20 : 0;
    const doaWeight = steps.doaCompleted ? 20 : 0;
    const vrWeight = Math.round((m.progress / 100) * 60);
    const totalProgress = videoWeight + doaWeight + vrWeight;

    let status: "Belum Mulai" | "Berlangsung" | "Selesai" = "Belum Mulai";
    if (totalProgress === 100) {
      status = "Selesai";
    } else if (totalProgress > 0) {
      status = "Berlangsung";
    }

    const completedTasks = m.tasks.filter((t) => t.isCompleted).length;

    return {
      id: m.id,
      title: m.title,
      status,
      progress: totalProgress,
      time: m.time === "0m" && totalProgress > 0 ? "5m" : m.time,
      date: m.date,
      videoCompleted: steps.videoCompleted,
      doaCompleted: steps.doaCompleted,
      vrProgress: m.progress,
      completedTasks,
      totalTasks: m.tasks.length
    };
  });
};

export const getOverallUnifiedProgress = (): number => {
  const store = getUnifiedProgressStore();
  const total = store.reduce((sum, m) => sum + m.progress, 0);
  return Math.round(total / store.length);
};

export const getCompletedModulesCount = (): number => {
  const store = getUnifiedProgressStore();
  return store.filter(m => m.progress === 100).length;
};

