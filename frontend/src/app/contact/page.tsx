"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import { useLanguage } from "@/context/LanguageContext";

export default function ContactPage() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col min-h-screen bg-[#fdfdfb]">
      <Navbar />

      <main className="flex-grow pt-32 pb-20 lg:pt-48 lg:pb-32">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
             <span className="text-[var(--color-primary)] font-bold tracking-[0.4em] text-xs mb-4 block uppercase opacity-60">{t("contact.sub")}</span>
             <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 tracking-tight leading-tight uppercase">{t("contact.title")}</h1>
             <p className="text-xl text-gray-500 mt-6 max-w-2xl mx-auto leading-relaxed">
               {t("contact.desc")}
             </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
             {/* Contact Form Section */}
             <div className="bg-white p-10 lg:p-16 rounded-[4rem] shadow-[0_48px_80px_-16px_rgba(0,0,0,0.08)] border border-gray-50 space-y-10">
                <div className="space-y-4">
                   <h2 className="text-3xl font-bold text-gray-900">{t("contact.formTitle")}</h2>
                   <p className="text-gray-500 text-sm">{t("contact.formDesc")}</p>
                </div>

                <form className="space-y-8">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                         <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-2">{t("contact.labelName")}</label>
                         <input 
                           type="text" 
                           placeholder={t("contact.phName")}
                           className="w-full px-8 py-5 bg-gray-50 border-none rounded-3xl text-sm focus:ring-2 focus:ring-[var(--color-primary)]/10 transition-all"
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-2">{t("contact.labelEmail")}</label>
                         <input 
                           type="email" 
                           placeholder="email@anda.com"
                           className="w-full px-8 py-5 bg-gray-50 border-none rounded-3xl text-sm focus:ring-2 focus:ring-[var(--color-primary)]/10 transition-all"
                         />
                      </div>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-2">{t("contact.labelSubject")}</label>
                      <select className="w-full px-8 py-5 bg-gray-50 border-none rounded-3xl text-sm focus:ring-2 focus:ring-[var(--color-primary)]/10 transition-all appearance-none">
                         <option>{t("contact.optSubject1")}</option>
                         <option>{t("contact.optSubject2")}</option>
                         <option>{t("contact.optSubject3")}</option>
                         <option>{t("contact.optSubject4")}</option>
                      </select>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-2">{t("contact.labelMessage")}</label>
                      <textarea 
                        rows={5}
                        placeholder={t("contact.phMessage")}
                        className="w-full px-8 py-6 bg-gray-50 border-none rounded-[3rem] text-sm focus:ring-2 focus:ring-[var(--color-primary)]/10 transition-all resize-none"
                      ></textarea>
                   </div>
                   <button className="w-full py-5 bg-[#064e3b] text-white rounded-3xl font-bold text-lg shadow-2xl shadow-emerald-950/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                      {t("contact.btnSubmit")}
                   </button>
                </form>
             </div>

             {/* Contact Info Section */}
             <div className="space-y-16 lg:pt-10">
                <div className="space-y-12">
                   <div className="flex gap-8">
                      <div className="w-16 h-16 bg-emerald-50 text-[var(--color-primary)] rounded-3xl flex items-center justify-center shrink-0">
                         <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                      </div>
                      <div className="space-y-2">
                         <h4 className="text-xl font-bold text-gray-900">{t("contact.infoOffice")}</h4>
                         <p className="text-gray-500 leading-relaxed max-w-xs">
                            {t("contact.infoOfficeDesc")}
                         </p>
                      </div>
                   </div>

                   <div className="flex gap-8">
                      <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center shrink-0">
                         <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                      </div>
                      <div className="space-y-2">
                         <h4 className="text-xl font-bold text-gray-900">{t("contact.infoPhone")}</h4>
                         <p className="text-gray-500 leading-relaxed">
                            WhatsApp: +62 812 9000 360 <br/>
                            Telp: (021) 555-0360
                         </p>
                      </div>
                   </div>

                   <div className="flex gap-8">
                      <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-3xl flex items-center justify-center shrink-0">
                         <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                      </div>
                      <div className="space-y-2">
                         <h4 className="text-xl font-bold text-gray-900">{t("contact.infoEmail")}</h4>
                         <p className="text-gray-500 leading-relaxed">
                            help@bahrain.com <br/>
                            support@bahrain.com
                         </p>
                      </div>
                   </div>
                </div>

                {/* Map Mockup */}
                <div className="relative aspect-video bg-gray-100 rounded-[3rem] overflow-hidden border-8 border-white shadow-2xl group">
                   <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Google Maps View</p>
                   </div>
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      <div className="w-10 h-10 bg-red-500 rounded-full border-4 border-white shadow-xl animate-bounce"></div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
