"use client";

import { useEffect, useState } from "react";
import DashboardHero from "@/components/dashboard/DashboardHero";
import ProgressOverview from "@/components/dashboard/progress/ProgressOverview";
import ModuleTable from "@/components/dashboard/progress/ModuleTable";
import { getOverallUnifiedProgress } from "@/utils/progressStore";

export default function DashboardPage() {
  const [overallProgress, setOverallProgress] = useState(0);

  useEffect(() => {
    setOverallProgress(getOverallUnifiedProgress());

    const handleProgressUpdate = () => {
      setOverallProgress(getOverallUnifiedProgress());
    };

    window.addEventListener("progressStoreUpdated", handleProgressUpdate);
    return () => {
      window.removeEventListener("progressStoreUpdated", handleProgressUpdate);
    };
  }, []);

  return (
    <div className="w-full space-y-12 pb-10">
      <DashboardHero />
      
      {/* Page Header - Perfectly aligned typography */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Progress Modul</h1>
        <p className="text-gray-500 text-lg">Pantau perkembangan kesiapan ibadah Haji & Umrah Anda secara real-time.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <ProgressOverview overallProgress={overallProgress} />
         <ModuleTable />
      </div>
    </div>
  );
}




