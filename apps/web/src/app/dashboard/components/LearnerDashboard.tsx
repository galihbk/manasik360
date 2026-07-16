import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ApiClient } from '@bahrain/api-client';
import { 
  Play, 
  CheckCircle2, 
  Calendar,
  Sparkles,
  AlertCircle,
  Hotel,
  Gift,
  MapPin,
  Phone,
  ExternalLink,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const client = new ApiClient({ baseUrl: '/api/v1' });

interface LearnerDashboardProps {
  userName: string;
  courses: any[];
  d: any;
  lang: string;
  subscription: any;
  certificatesCount: number;
}

export default function LearnerDashboard({ userName, courses, d, lang, subscription, certificatesCount }: LearnerDashboardProps) {
  const router = useRouter();
  const [recommendations, setRecommendations] = useState<any[]>([]);

  // Fetch active recommendations for learner
  useEffect(() => {
    client.getActiveRecommendations('learner')
      .then(res => {
        if (res && res.success) {
          setRecommendations(res.recommendations || []);
        }
      })
      .catch(err => console.error("Error fetching learner recommendations:", err));
  }, []);

  // Extract all lessons from courses
  const allLessons = courses.flatMap(c => c.lessons || []);

  // Find next lesson to continue
  const continueLesson = allLessons.find(l => l.status === 'in-progress') || 
                         allLessons.find(l => l.status === 'locked') || 
                         allLessons[0];

  // Find recent activity (last completed lesson)
  const completedLessons = allLessons.filter(l => l.status === 'completed');
  const recentLesson = completedLessons[completedLessons.length - 1];

  // Find recommended lesson (something not completed)
  const recommendedLesson = allLessons.find(l => l.status === 'locked') || 
                            allLessons.find(l => l.status === 'in-progress') || 
                            allLessons[allLessons.length - 1];

  const planName = subscription?.plan || 'Free Trial';
  const planActive = subscription?.active || false;

  return (
    <div className="p-8 w-full space-y-8 py-12">
      {/* Welcome Message */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{d.welcome || 'Selamat Datang'}, {userName}</h2>
        <p className="text-sm text-slate-400 mt-1">{d.home_sub || 'Lanjutkan perjalanan belajar Anda di bawah.'}</p>
      </div>

      {/* Continue Learning (Row 1) */}
      <div className="bg-slate-900 text-white rounded-xl p-8 border border-slate-800 shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-lg">
          <span className="text-xs font-bold text-[#d97706] uppercase tracking-widest">{d.continue_learning || 'Lanjutkan Belajar'}</span>
          <h3 className="text-lg font-bold text-white mt-1.5">
            {continueLesson?.title || 'Memulai Pembelajaran'}
          </h3>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            {continueLesson
               ? `Materi tipe ${continueLesson.type === 'READING' ? 'Membaca' : 'Tur Virtual 360°'} dengan estimasi pengerjaan ${continueLesson.duration || '15 menit'}.`
               : 'Silakan aktifkan paket pembelajaran Anda untuk memulai manasik haji & umrah.'}
          </p>
          <button 
            onClick={() => router.push('/dashboard/my-learning')}
            className="mt-5 bg-[#d97706] hover:bg-[#b45309] text-white text-sm font-bold px-6 py-3 rounded-full transition-all shadow-md flex items-center gap-2"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            {d.resume_activity || 'Lanjutkan Aktivitas'} ({continueLesson?.duration || '10 menit'})
          </button>
        </div>
        <div className="absolute right-8 bottom-0 top-0 w-1/3 opacity-20 pointer-events-none hidden md:block">
          <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" className="w-full h-full text-white">
            <polygon points="50,15 85,50 50,85 15,50" strokeWidth="0.5" />
          </svg>
        </div>
      </div>

      {/* Grid: Course Progress & Today's Reminder (Row 2) */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 border border-slate-200/80 rounded-xl p-6 bg-white shadow-sm space-y-4">
          <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">{d.progress || 'Progres Kelas'}</h4>
          
          <div className="space-y-4">
            {courses.length > 0 ? (
              courses.map((course) => (
                <div key={course.id}>
                  <div className="flex justify-between text-sm font-semibold mb-1">
                    <span className="text-slate-700">{course.title}</span>
                    <span className="text-slate-500">{course.progress}% {lang === 'id' ? 'Selesai' : 'Complete'}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-[#1e40af] h-2.5 rounded-full" style={{ width: `${course.progress}%` }}></div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-slate-400 text-sm font-medium">
                {lang === 'id' ? 'Belum ada kelas aktif.' : 'No active courses.'}
              </div>
            )}
          </div>
        </div>

        <div className="border border-slate-200/80 rounded-xl p-6 bg-white shadow-sm space-y-3.5">
          <div className="flex items-center gap-2 text-[#1e40af]">
            <Calendar className="w-5 h-5" />
            <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">{d.reminder || 'Pengingat'}</h4>
          </div>
          <p className="text-sm text-slate-505 leading-relaxed">
            {d.reminder_desc || 'Konsultasikan kesehatan fisik Anda secara rutin dan persiapkan mental dengan simulasi 360.'}
          </p>
        </div>
      </div>

      {/* Grid: Recent Activity & Subscription Status (Row 3) */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="border border-slate-200/80 rounded-xl p-6 bg-white shadow-sm space-y-4">
          <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">{d.recent_activity || 'Aktivitas Terbaru'}</h4>
          {recentLesson ? (
            <div className="flex gap-3 text-sm leading-relaxed">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-800">
                  {lang === 'id' ? `Menyelesaikan Pelajaran: ${recentLesson.title}` : `Completed Lesson: ${recentLesson.title}`}
                </p>
                <p className="text-xs text-slate-400 mt-0.5 font-medium">Baru Saja • Durasi {recentLesson.duration || '15 menit'}</p>
              </div>
            </div>
          ) : (
            <div className="flex gap-2.5 items-center text-sm text-slate-450 italic py-2">
              <AlertCircle className="w-4.5 h-4.5 text-slate-400" />
              <span>{lang === 'id' ? 'Belum ada aktivitas belajar diselesaikan.' : 'No completed activities yet.'}</span>
            </div>
          )}
        </div>

        <div className="border border-slate-200/80 rounded-xl p-6 bg-white shadow-sm space-y-4">
          <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">Subscription Plan</h4>
          <div className="flex justify-between items-center text-sm">
            <div>
              <p className="font-bold text-slate-800">{planName}</p>
              <p className="text-xs text-slate-400 mt-0.5">
                {planActive ? 'Status Keaktifan: AKTIF' : 'Status Keaktifan: TIDAK AKTIF'}
              </p>
            </div>
            <span className={`text-xs font-black px-3 py-1 rounded ${planActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {planActive ? 'ACTIVE' : 'INACTIVE'}
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Recommended Course & Certificate Status (Row 4) */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 border border-slate-200/80 rounded-xl p-6 bg-white shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-[#d97706]">
            <Sparkles className="w-5 h-5" />
            <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">{d.recommended_course || 'Rekomendasi Kelas'}</h4>
          </div>
          {recommendedLesson ? (
            <div>
              <h5 className="font-bold text-sm text-slate-800">{recommendedLesson.title}</h5>
              <p className="text-xs text-slate-500 mt-1">Materi selanjutnya untuk diselesaikan. Estimasi pengerjaan: {recommendedLesson.duration || '15 menit'}.</p>
            </div>
          ) : (
            <p className="text-xs text-slate-455 italic">Semua kelas direkomendasikan selesai!</p>
          )}
        </div>

        <div className="border border-slate-200/80 rounded-xl p-6 bg-white shadow-sm space-y-4">
          <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">{d.cert_status || 'Status Sertifikat'}</h4>
          <div className="flex items-center gap-2.5 text-sm text-slate-505">
            {certificatesCount > 0 ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span className="font-bold text-slate-800">{certificatesCount} Sertifikat Kelulusan Tersedia</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-5 h-5 text-slate-400" />
                <span>{lang === 'id' ? 'Belum ada sertifikat kelulusan.' : 'No completed certificates yet.'}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {recommendations.length > 0 && (
        <div className="border border-slate-200/80 rounded-xl p-6 bg-white shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2 text-indigo-600">
              <Hotel className="w-5 h-5" />
              <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                {lang === 'id' ? 'Rekomendasi Hotel & Oleh-Oleh Pilihan' : 'Recommended Hotels & Souvenirs'}
              </h4>
            </div>
            <span className="px-2 py-0.5 bg-indigo-50 text-indigo-650 rounded text-[9px] font-black uppercase tracking-wider">Partner Resmi</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {recommendations.map((reco) => (
              <div key={reco.id} className="border border-slate-150 rounded-lg overflow-hidden flex flex-col justify-between hover:shadow-md transition-all bg-slate-50/50">
                <div>
                  <RecommendationCardImage imageUrl={reco.imageUrl} type={reco.type} name={reco.name} />

                  <div className="p-4 space-y-2">
                    <h5 className="font-extrabold text-xs text-slate-800 line-clamp-1">{reco.name}</h5>
                    <p className="text-[11px] text-slate-500 leading-normal line-clamp-2">{reco.description || 'Lihat penawaran eksklusif dari partner kami.'}</p>
                  </div>
                </div>

                <div className="p-4 pt-0 space-y-1.5">
                  <div className="border-t border-slate-150 pt-2 flex flex-col gap-1 text-[10px] text-slate-550 font-medium">
                    {reco.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{reco.location}</span>
                      </div>
                    )}
                    {reco.contactNumber && (
                      <div className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{reco.contactNumber}</span>
                      </div>
                    )}
                  </div>

                  {reco.websiteUrl && (
                    <a
                      href={reco.websiteUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 flex items-center justify-center gap-1 py-1.5 w-full bg-slate-900 hover:bg-slate-850 text-white font-extrabold text-[10px] rounded-md transition-all shadow-sm"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Kunjungi Halaman Partner
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function RecommendationCardImage({ imageUrl, type, name }: { imageUrl: string; type: string; name: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const images = imageUrl ? imageUrl.split(',').filter((img: string) => img.trim() !== '') : [];

  if (images.length === 0) {
    return (
      <div className="relative h-32 bg-slate-100 flex items-center justify-center">
        <div className="text-slate-350">
          {type === 'HOTEL' ? <Hotel className="w-8 h-8" /> : <Gift className="w-8 h-8" />}
        </div>
        <span className={`absolute top-2 left-2 text-[8px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded shadow-sm bg-slate-600 text-white`}>
          {type === 'HOTEL' ? 'Hotel' : 'Oleh-oleh'}
        </span>
      </div>
    );
  }

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    setActiveIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative h-32 bg-slate-100 flex items-center justify-center group">
      <img src={images[activeIndex]} alt={name} className="object-cover w-full h-full" />
      
      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-1 top-1/2 -translate-y-1/2 bg-black/55 hover:bg-black/85 text-white p-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-1 top-1/2 -translate-y-1/2 bg-black/55 hover:bg-black/85 text-white p-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex gap-0.5 z-10">
            {images.map((_, i) => (
              <div 
                key={i} 
                className={`w-1 h-1 rounded-full transition-all ${
                  i === activeIndex ? 'bg-blue-500 scale-110' : 'bg-white/60'
                }`} 
              />
            ))}
          </div>
        </>
      )}

      <span className={`absolute top-2 left-2 text-[8px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded shadow-sm text-white ${
        type === 'HOTEL' ? 'bg-indigo-600' : 'bg-amber-600'
      }`}>
        {type === 'HOTEL' ? 'Hotel' : 'Oleh-oleh'}
      </span>
    </div>
  );
}
