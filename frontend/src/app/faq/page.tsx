"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useLanguage } from "@/context/LanguageContext";

interface FAQItemProps {
  question: string;
  answer: string;
}

function FAQItem({ question, answer }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden transition-all hover:shadow-md">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-8 flex items-center justify-between text-left group"
      >
        <span className="text-lg font-bold text-gray-900 group-hover:text-[var(--color-primary)] transition-colors">{question}</span>
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${isOpen ? 'bg-[var(--color-primary)] text-white shadow-lg shadow-emerald-900/20' : 'bg-gray-50 text-gray-400'}`}>
          <svg className={`w-5 h-5 transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
        </div>
      </button>
      <div className={`transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-8 pb-8">
           <div className="h-px bg-gray-50 mb-8"></div>
           <p className="text-gray-500 leading-relaxed italic">
             {answer}
           </p>
        </div>
      </div>
    </div>
  );
}

export default function FAQPage() {
  const { t } = useLanguage();

  const categories = [
    {
      name: t("faq.cat1"),
      questions: [
        { q: t("faq.q1"), a: t("faq.a1") },
        { q: t("faq.q2"), a: t("faq.a2") },
        { q: t("faq.q3"), a: t("faq.a3") }
      ]
    },
    {
      name: t("faq.cat2"),
      questions: [
        { q: t("faq.q4"), a: t("faq.a4") },
        { q: t("faq.q5"), a: t("faq.a5") }
      ]
    },
    {
      name: t("faq.cat3"),
      questions: [
        { q: t("faq.q6"), a: t("faq.a6") },
        { q: t("faq.q7"), a: t("faq.a7") }
      ]
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#fdfdfb]">
      <Navbar />

      <main className="flex-grow pt-32 pb-20 lg:pt-48 lg:pb-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
             <span className="text-[var(--color-primary)] font-bold tracking-[0.4em] text-xs mb-4 block uppercase opacity-60">{t("faq.sub")}</span>
             <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 tracking-tight uppercase leading-tight">{t("faq.title")}</h1>
             <p className="text-xl text-gray-500 mt-6 leading-relaxed">
               {t("faq.desc")}
             </p>
          </div>

          <div className="space-y-20">
             {categories.map((cat, idx) => (
               <div key={idx} className="space-y-8">
                  <div className="flex items-center gap-4">
                     <div className="h-px flex-1 bg-gray-100"></div>
                     <h3 className="text-xs font-black text-emerald-600 uppercase tracking-[0.3em]">{cat.name}</h3>
                     <div className="h-px flex-1 bg-gray-100"></div>
                  </div>
                  
                  <div className="space-y-4">
                     {cat.questions.map((item, i) => (
                       <FAQItem key={i} question={item.q} answer={item.a} />
                     ))}
                  </div>
               </div>
             ))}
          </div>

          {/* CTA Section */}
          <div className="mt-32 p-12 lg:p-16 bg-[#064e3b] rounded-[4rem] text-center text-white space-y-8 shadow-2xl shadow-emerald-950/20 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 opacity-10 islamic-pattern"></div>
             <h3 className="text-3xl font-bold">{t("faq.ctaTitle")}</h3>
             <p className="text-emerald-100 opacity-80 max-w-lg mx-auto">
                {t("faq.ctaDesc")}
             </p>
             <div className="pt-4">
                <a 
                  href="/contact" 
                  className="inline-block px-12 py-5 bg-[var(--color-accent)] text-white rounded-3xl font-bold text-lg hover:bg-[#b45309] transition-all shadow-xl shadow-orange-900/30"
                >
                   {t("faq.ctaBtn")}
                </a>
             </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
