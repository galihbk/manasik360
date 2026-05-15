"use client";

import DashboardHero from "@/components/dashboard/DashboardHero";
import GuideSection from "@/components/dashboard/GuideSection";
import StepsSection from "@/components/dashboard/StepsSection";

export default function DashboardPage() {
  return (
    <div className="w-full space-y-12">
      <DashboardHero />
      <GuideSection />
      <StepsSection />
    </div>
  );
}
