"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function VRModuleRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard");
  }, [router]);

  return (
    <div className="w-full h-[calc(100vh-12rem)] flex flex-col items-center justify-center space-y-4">
      <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-500 text-sm font-semibold tracking-wide animate-pulse">
        Mengalihkan Anda ke Beranda Jalur Belajar Haji...
      </p>
    </div>
  );
}


