"use client";

import { useEffect, useState } from "react";
import DashboardHero from "@/components/dashboard/DashboardHero";
import ProgressOverview from "@/components/dashboard/progress/ProgressOverview";
import ModuleTable from "@/components/dashboard/progress/ModuleTable";
import { getOverallUnifiedProgress } from "@/utils/progressStore";
import { useLanguage } from "@/context/LanguageContext";

export default function DashboardPage() {
  const [overallProgress, setOverallProgress] = useState(0);
  const { t } = useLanguage();

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
      <div className="space-y-2 text-left">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">{t("dashboard.progTitle")}</h1>
        <p className="text-gray-500 text-lg">{t("dashboard.progDesc")}</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <ProgressOverview overallProgress={overallProgress} />
         <ModuleTable />
      </div>
    </div>
  );
}




