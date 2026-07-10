import { Compass, Clock, BookOpen } from 'lucide-react';
import Image from 'next/image';

interface LessonProps {
  activeTab: string;
  lang: string;
  quizAnswers: Record<number, string>;
  setQuizAnswers: (ans: Record<number, string>) => void;
  quizScore: number | null;
  sd: any;
}

export default function VirtualDomeLesson({
  activeTab,
  lang,
  quizAnswers,
  setQuizAnswers,
  quizScore,
  sd
}: LessonProps) {
  const currentQuiz = sd.lesson_1_3_quiz || [];
  const markdownContent: string = sd.lesson_1_3_content || '';

  return (
    <div className="flex-1 flex flex-col justify-between">
      <div>
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {lang === 'id' ? 'Tur Virtual Dome Interaktif' : lang === 'ar' ? 'جولة افتراضية تفاعلية في القبة' : 'Interactive Dome Virtual Tour'}
              </h3>
              <p className="text-xs text-slate-400 font-bold mt-1.5 flex items-center gap-3">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-450" />
                  <span>10 {sd.minutes}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-slate-450" />
                  <span>4 {sd.steps}</span>
                </span>
              </p>
            </div>

            {/* Objectives Card */}
            <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">{sd.objectives_title}</h4>
              <p className="text-xs text-slate-500 font-medium">{sd.objectives_desc}</p>
              <p className="text-sm text-slate-700 font-extrabold leading-relaxed flex items-start gap-2.5">
                <Compass className="w-4 h-4 text-[#d97706] shrink-0 mt-0.5" />
                <span>{sd.objective_3}</span>
              </p>
            </div>

            <div className="text-sm text-slate-550 leading-relaxed space-y-4">
              <p>{sd.welcome_desc}</p>
            </div>
          </div>
        )}

        {activeTab === 'reading' && (
          <div className="space-y-6">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide">{sd.reading_material}</h4>
            <div className="border border-slate-200 rounded-xl p-6 bg-slate-50/50 text-sm md:text-base text-slate-755 leading-relaxed font-serif whitespace-pre-wrap markdown-content max-h-[460px] overflow-y-auto">
              {markdownContent.split('\n').map((line: string, idx) => {
                if (line.startsWith('## ')) return <h4 key={idx} className="text-base md:text-lg font-bold text-slate-800 mt-5 mb-2">{line.replace('## ', '')}</h4>;
                if (line.startsWith('• ') || line.startsWith('•')) return <li key={idx} className="ml-5 list-disc my-1 text-slate-600 font-medium">{line.replace(/^•\s*/, '')}</li>;
                if (line.trim() === '') return <div key={idx} className="h-2" />;
                return <p key={idx} className="my-1.5 leading-relaxed text-slate-650 font-medium">{line}</p>;
              })}
            </div>
          </div>
        )}

        {activeTab === 'tour' && (
          <div className="space-y-6">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide">{sd.tour_iframe}</h4>
            <div className="relative w-full aspect-video rounded-xl border border-slate-200 overflow-hidden bg-slate-900 flex flex-col items-center justify-center text-white">
              <Image
                src="/images/pilgrim-hero.png"
                alt="3DVista Tour Simulation"
                fill
                className="object-cover opacity-45"
              />
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-6 text-center">
                <Compass className="w-14 h-14 text-[#d97706] mb-3 animate-spin" />
                <h5 className="text-sm font-extrabold">{sd.tour_title}</h5>
                <p className="text-xs text-slate-300 max-w-sm mt-1">{sd.tour_desc}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'quiz' && (
          <div className="space-y-6">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide">{sd.knowledge_assessment}</h4>
            <div className="space-y-6">
              {currentQuiz.map((q: any) => (
                <div key={q.id} className="border border-slate-100 rounded-xl p-6 bg-slate-50/50">
                  <p className="text-sm font-extrabold text-slate-800 mb-4">{q.q}</p>
                  <div className="space-y-3">
                    {q.a.map((option: string) => (
                      <label key={option} className="flex items-center gap-3.5 text-sm text-slate-650 cursor-pointer hover:text-slate-900 font-semibold">
                        <input
                          type="radio"
                          name={`q-${q.id}`}
                          value={option}
                          checked={quizAnswers[q.id] === option}
                          onChange={(e) => setQuizAnswers({ ...quizAnswers, [q.id]: e.target.value })}
                          className="w-4 h-4 border-slate-350 text-[#1e40af] focus:ring-[#1e40af]"
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
