import React, { useState, useRef } from 'react';
import { Compass, Clock, BookOpen, Play } from 'lucide-react';
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
  const [isTourActive, setIsTourActive] = useState(false);
  const iframeContainerRef = useRef<HTMLDivElement>(null);

  const handleStartTour = () => {
    setIsTourActive(true);
    setTimeout(() => {
      if (iframeContainerRef.current) {
        if (iframeContainerRef.current.requestFullscreen) {
          iframeContainerRef.current.requestFullscreen();
        } else if ((iframeContainerRef.current as any).webkitRequestFullscreen) {
          (iframeContainerRef.current as any).webkitRequestFullscreen();
        } else if ((iframeContainerRef.current as any).msRequestFullscreen) {
          (iframeContainerRef.current as any).msRequestFullscreen();
        }
      }
    }, 100);
  };

  React.useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && !(document as any).webkitFullscreenElement && !(document as any).msFullscreenElement) {
        setIsTourActive(false);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

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
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide px-6 md:px-8">{sd.tour_iframe}</h4>
            <div 
              ref={iframeContainerRef}
              className="relative w-[calc(100%+3rem)] md:w-[calc(100%+4rem)] -mx-6 md:-mx-8 aspect-video border-y border-slate-200 overflow-hidden bg-slate-950 shadow-sm flex items-center justify-center"
            >
              {!isTourActive ? (
                <>
                  <Image
                    src="/images/pilgrim-hero.png"
                    alt="3DVista Tour Simulation"
                    fill
                    className="object-cover opacity-40"
                  />
                  <div className="absolute inset-0 bg-slate-950/60 flex flex-col items-center justify-center p-6 text-center z-10">
                    <Compass className="w-16 h-16 text-[#d97706] mb-4 animate-pulse" />
                    <h5 className="text-lg font-extrabold text-white mb-2">{sd.tour_title || 'Mulai Tur Virtual 360°'}</h5>
                    <p className="text-xs text-slate-350 max-w-sm mt-1 mb-6">
                      {sd.tour_desc || 'Buka pemandangan interaktif 360 derajat secara langsung dalam layar penuh.'}
                    </p>
                    <button
                      type="button"
                      onClick={handleStartTour}
                      className="px-6 py-3 bg-[#d97706] hover:bg-amber-600 text-white text-xs font-bold rounded-lg shadow-lg transform transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      <span>{lang === 'id' ? 'Mulai Tur (Layar Penuh)' : 'Start Tour (Fullscreen)'}</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="w-full h-full relative">
                  <iframe
                    src="/tour/index.htm"
                    className="w-full h-full"
                    allowFullScreen
                    style={{ border: 0 }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (document.fullscreenElement) {
                        document.exitFullscreen();
                      } else {
                        handleStartTour();
                      }
                    }}
                    className="absolute bottom-4 right-4 bg-slate-900/80 hover:bg-slate-900 text-white p-2 rounded-lg text-xs font-bold shadow-md z-20 flex items-center gap-1.5"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>Layar Penuh</span>
                  </button>
                </div>
              )}
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
