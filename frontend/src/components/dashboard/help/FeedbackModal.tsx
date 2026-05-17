"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ subject, message }),
      });

      const json = await response.json();
      if (json.status === "success") {
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          onClose();
          setSubject("");
          setMessage("");
        }, 2000);
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-screen h-screen min-h-screen bg-black/60 backdrop-blur-md z-[300] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <Card className="w-full max-w-xl bg-white rounded-[3rem] p-8 lg:p-12 shadow-2xl relative animate-in slide-in-from-bottom-8 duration-500">
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>

        {isSuccess ? (
          <div className="py-12 flex flex-col items-center text-center space-y-4 animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-[2rem] flex items-center justify-center">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Feedback Terkirim!</h3>
            <p className="text-gray-500 max-w-xs">Terima kasih atas masukan Anda. Kami akan terus berusaha meningkatkan layanan kami.</p>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold text-gray-900">Kirim Feedback</h3>
              <p className="text-sm text-gray-500">Berikan saran atau laporkan kendala teknis Anda.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-2">Subjek</label>
                <input
                  required
                  type="text"
                  placeholder="Contoh: Saran Fitur Baru / Kendala VR"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-[var(--color-primary)]/10 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-2">Pesan Anda</label>
                <textarea
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ceritakan detail saran atau kendala yang Anda alami..."
                  rows={4}
                  className="w-full p-6 bg-gray-50 border-none rounded-[2rem] text-sm focus:ring-2 focus:ring-[var(--color-primary)]/10 transition-all resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[var(--color-primary)] text-white rounded-2xl font-bold text-sm shadow-xl shadow-emerald-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    Kirim Sekarang
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </Card>
    </div>
  );
}
