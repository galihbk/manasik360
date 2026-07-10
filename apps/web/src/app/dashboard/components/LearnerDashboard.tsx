import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  Play, 
  CheckCircle2, 
  Calendar,
  Sparkles,
  AlertCircle
} from 'lucide-react';

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
          <p className="text-sm text-slate-500 leading-relaxed">
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
            <p className="text-xs text-slate-450 italic">Semua kelas direkomendasikan selesai!</p>
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
    </div>
  );
}
