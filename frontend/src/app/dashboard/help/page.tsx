"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import FeedbackModal from "@/components/dashboard/help/FeedbackModal";
import { useLanguage } from "@/context/LanguageContext";

interface FAQItemProps {
  question: string;
  answer: string;
}

function FAQItem({ question, answer }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-100 last:border-none">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between text-left group"
      >
        <span className="font-bold text-gray-900 group-hover:text-[var(--color-primary)] transition-colors">{question}</span>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isOpen ? 'bg-[var(--color-primary)] text-white' : 'bg-gray-50 text-gray-400'}`}>
          <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
        </div>
      </button>
      {isOpen && (
        <div className="pb-6 animate-in fade-in slide-in-from-top-2 duration-300">
          <p className="text-sm text-gray-500 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}

export default function HelpPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <div className="w-full space-y-12 pb-10">
      <FeedbackModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">{t("help.title")}</h1>
        <p className="text-gray-500">{t("help.subtitle")}</p>
      </div>

      {/* Help Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         {[
            { title: t("help.catVR"), desc: t("help.catVRDesc"), icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>, color: "bg-blue-50 text-blue-600" },
            { title: t("help.catAccount"), desc: t("help.catAccountDesc"), icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>, color: "bg-emerald-50 text-emerald-600" },
            { title: t("help.catMaterials"), desc: t("help.catMaterialsDesc"), icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>, color: "bg-purple-50 text-purple-600" },
         ].map((cat, i) => (
            <Card key={i} className="p-8 bg-white border-none shadow-sm hover:shadow-xl transition-all group cursor-pointer rounded-[2.5rem] flex flex-col items-center text-center space-y-4">
               <div className={`w-16 h-16 ${cat.color} rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform`}>
                  {cat.icon}
               </div>
               <h4 className="font-bold text-gray-900">{cat.title}</h4>
               <p className="text-xs text-gray-400 leading-relaxed">{cat.desc}</p>
            </Card>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
         {/* FAQ Section */}
         <div className="lg:col-span-2 space-y-8">
            <h3 className="text-xl font-bold text-gray-900">{t("help.faqTitle")}</h3>
            <div className="bg-white p-8 lg:p-10 rounded-[3rem] border border-gray-50 shadow-sm">
               <FAQItem 
                 question={t("help.faq.q1")} 
                 answer={t("help.faq.a1")}
               />
               <FAQItem 
                 question={t("help.faq.q2")} 
                 answer={t("help.faq.a2")}
               />
               <FAQItem 
                 question={t("help.faq.q3")} 
                 answer={t("help.faq.a3")}
               />
               <FAQItem 
                 question={t("help.faq.q4")} 
                 answer={t("help.faq.a4")}
               />
            </div>
         </div>

         {/* Contact Support Card */}
         <div className="space-y-8">
            <h3 className="text-xl font-bold text-gray-900">{t("help.supportTitle")}</h3>
            <Card className="p-8 bg-[#064e3b] text-white border-none shadow-xl rounded-[3rem] space-y-6">
               <div className="space-y-2">
                  <h4 className="font-bold text-lg">{t("help.supportSubTitle")}</h4>
                  <p className="text-emerald-100 text-xs leading-relaxed">
                     {t("help.supportDesc")}
                  </p>
               </div>
               
               <div className="space-y-3">
                  <a href="#" className="flex items-center gap-4 p-4 bg-white/10 rounded-2xl hover:bg-white/20 transition-all border border-white/10">
                     <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.484 8.412-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.309 1.656zm6.29-4.143c1.589.943 3.133 1.411 4.74 1.412 5.405.002 9.803-4.395 9.805-9.801.001-2.621-1.02-5.086-2.871-6.938-1.852-1.852-4.32-2.873-6.94-2.874-5.404 0-9.803 4.398-9.806 9.805-.001 1.733.486 3.422 1.409 4.887l-1.011 3.693 3.774-.984zm11.03-5.393c-.24-.12-1.423-.701-1.643-.781-.221-.079-.382-.12-.545.12s-.625.781-.765.942-.282.181-.522.06c-.24-.121-.913-.337-1.738-1.074-.643-.573-1.076-1.281-1.203-1.499-.127-.218-.014-.335.106-.454.108-.107.24-.281.36-.421.12-.14.16-.24.24-.4.08-.161.04-.301-.02-.421-.06-.12-.545-1.314-.746-1.796-.196-.472-.394-.409-.545-.417-.14-.007-.301-.008-.462-.008-.161 0-.422.06-.643.301-.221.24-.844.824-.844 2.01s.865 2.368.984 2.528c.121.16 1.702 2.6 4.123 3.648.577.249 1.026.398 1.376.509.578.183 1.105.157 1.522.095.465-.069 1.423-.581 1.623-1.141.2-.561.2-1.041.141-1.141-.06-.101-.22-.16-.461-.28z"/></svg>
                     </div>
                     <div>
                        <p className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest">{t("help.whatsapp")}</p>
                        <p className="text-sm font-bold font-sans">+62 812-9000-360</p>
                     </div>
                  </a>

                  <a href="#" className="flex items-center gap-4 p-4 bg-white/10 rounded-2xl hover:bg-white/20 transition-all border border-white/10">
                     <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                     </div>
                     <div>
                        <p className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest">{t("help.email")}</p>
                        <p className="text-sm font-bold">help@bahrain.com</p>
                     </div>
                  </a>
               </div>
            </Card>

            <div className="bg-gray-50 p-8 rounded-[3rem] border border-gray-100">
               <h4 className="font-bold text-gray-900 mb-2">{t("help.feedbackTitle")}</h4>
               <p className="text-xs text-gray-400 leading-relaxed">
                  {t("help.feedbackDesc")}
               </p>
               <button 
                  onClick={() => setIsModalOpen(true)}
                  className="text-xs font-bold text-[var(--color-primary)] mt-4 hover:underline"
               >
                  {t("help.feedbackLink")} {`->`}
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}
