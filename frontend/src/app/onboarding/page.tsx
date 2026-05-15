"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Link from "next/link";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    courseType: "",
    age: "",
    experience: "",
    language: "Bahasa Indonesia",
  });

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleFinish = () => {
    // Save to backend logic would go here
    router.push("/dashboard/lobby");
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 islamic-pattern">
      <div className="max-w-2xl w-full">
        {/* Progress Bar */}
        <div className="mb-12 flex justify-between items-center gap-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex-1 h-2 rounded-full overflow-hidden bg-gray-200">
              <div 
                className={`h-full transition-all duration-500 ${step >= s ? "bg-[var(--color-primary)]" : "bg-transparent"}`}
              ></div>
            </div>
          ))}
        </div>

        <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-gray-100">
          {step === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Apa Tujuan Anda?</h2>
                <p className="text-gray-500">Pilih jenis pembelajaran yang ingin Anda ikuti.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { id: "haji", title: "Haji", icon: "🕋" },
                  { id: "umrah", title: "Umrah", icon: "🕌" },
                  { id: "short", title: "Manasik Singkat", icon: "⚡" },
                  { id: "full", title: "Pembelajaran Lengkap", icon: "📚" }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setFormData({ ...formData, courseType: item.id })}
                    className={`p-6 rounded-2xl border-2 transition-all text-left flex flex-col gap-3 ${formData.courseType === item.id ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5" : "border-gray-100 hover:border-gray-200"}`}
                  >
                    <span className="text-3xl">{item.icon}</span>
                    <span className="font-bold text-gray-900">{item.title}</span>
                  </button>
                ))}
              </div>
              <Button onClick={nextStep} disabled={!formData.courseType} className="w-full">Selanjutnya</Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Profil Jamaah</h2>
                <p className="text-gray-500">Informasi ini membantu kami menyesuaikan konten untuk Anda.</p>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Usia Anda</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {["< 20", "20-40", "41-60", "60+"].map((age) => (
                      <button
                        key={age}
                        onClick={() => setFormData({ ...formData, age })}
                        className={`py-3 rounded-xl border transition-all ${formData.age === age ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-[var(--color-primary)] bg-opacity-10" : "border-gray-200 hover:bg-gray-50"}`}
                      >
                        {age}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Pengalaman Haji/Umrah</label>
                  <select 
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[var(--color-primary)] outline-none"
                  >
                    <option value="">Pilih Pengalaman</option>
                    <option value="none">Belum Pernah</option>
                    <option value="once">Sudah 1 Kali</option>
                    <option value="more">Lebih dari 1 Kali</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-4">
                <Button variant="outline" onClick={prevStep} className="flex-1">Kembali</Button>
                <Button onClick={nextStep} disabled={!formData.age || !formData.experience} className="flex-[2]">Selanjutnya</Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 text-center">
              <div className="w-24 h-24 bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Semua Sudah Siap!</h2>
                <p className="text-gray-500">Anda akan diarahkan ke Lobby Virtual untuk memulai pengalaman manasik.</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-2xl text-left">
                <h4 className="font-bold text-sm uppercase tracking-wider text-gray-400 mb-4">Ringkasan Profil</h4>
                <div className="grid grid-cols-2 gap-y-4">
                  <div>
                    <p className="text-xs text-gray-500">Tujuan</p>
                    <p className="font-bold text-gray-900 capitalize">{formData.courseType}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Usia</p>
                    <p className="font-bold text-gray-900">{formData.age}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Pengalaman</p>
                    <p className="font-bold text-gray-900 capitalize">{formData.experience === 'none' ? 'Belum Pernah' : 'Pernah'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Bahasa</p>
                    <p className="font-bold text-gray-900">{formData.language}</p>
                  </div>
                </div>
              </div>
              <Button onClick={handleFinish} className="w-full text-lg py-4">Mulai Pengalaman Imersif</Button>
            </div>
          )}
        </div>

        <p className="text-center mt-8 text-gray-500 text-sm">
          Langkah {step} dari 3
        </p>
      </div>
    </main>
  );
}
