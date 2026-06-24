"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";
import { useLanguage } from "@/context/LanguageContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Email atau kata sandi salah");
      }

      // Success
      login(data.data.user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-[#042f24] via-[#064e3b] to-[#022c22]">
      {/* Decorative background glows */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[var(--color-accent)] opacity-10 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-emerald-400 opacity-10 blur-[150px] rounded-full pointer-events-none"></div>
      
      {/* Subtle Islamic pattern overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1.5px,transparent_1.5px)] [background-size:24px_24px] pointer-events-none"></div>

      <div className="max-w-md w-full relative z-10">
        {/* Logo Section */}
        <div className="text-center mb-8 flex flex-col items-center">
          <Link href="/" className="inline-flex flex-col items-center gap-2 mb-4 group">
            <div className="relative w-16 h-16 transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/logo.png"
                alt="Bahrain Logo"
                fill
                className="object-contain filter brightness-0 invert"
              />
            </div>
            <span className="text-3xl font-extrabold text-white tracking-widest drop-shadow-sm uppercase">
              Bahrain
            </span>
          </Link>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">{t("auth.welcomeBack")}</h2>
          <p className="text-gray-300/80 mt-2 text-sm font-medium">{t("auth.loginSubtitle")}</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/95 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.4)] border border-white/20">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-xl">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                {t("auth.emailLabel")}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 outline-none transition-all text-gray-900 bg-white"
                placeholder="nama@email.com"
                required
              />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                  {t("auth.passwordLabel")}
                </label>
                <a href="#" className="text-sm font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-light)]">
                  {t("auth.forgotPassword")}
                </a>
              </div>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 outline-none transition-all text-gray-900 bg-white"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-[var(--color-primary)] focus:ring-[var(--color-primary)] border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600 font-medium">
                {t("auth.rememberMe")}
              </label>
            </div>

            <Button type="submit" className="w-full py-4 text-base rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] text-white hover:opacity-95 transition-all shadow-lg shadow-emerald-950/20" onClick={() => {}}>
              {loading ? "..." : t("auth.btnLogin")}
            </Button>
          </form>

          <div className="mt-8 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-wider font-semibold">
              <span className="px-3 bg-white/0 text-gray-400">{t("auth.orWith")}</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 py-3 px-4 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all font-semibold text-gray-700 text-sm bg-white cursor-pointer">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google
            </button>
            <button className="flex items-center justify-center gap-2 py-3 px-4 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all font-semibold text-gray-700 text-sm bg-white cursor-pointer">
              <svg className="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Facebook
            </button>
          </div>
        </div>

        <p className="text-center mt-8 text-gray-300">
          {t("auth.noAccount")}{" "}
          <Link href="/register" className="font-bold text-[var(--color-accent-light)] hover:underline hover:text-[var(--color-accent)] transition-colors">
            {t("auth.registerFree")}
          </Link>
        </p>
      </div>
    </main>
  );
}
