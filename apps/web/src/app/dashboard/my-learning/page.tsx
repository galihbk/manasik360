'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Play,
  CheckCircle2,
  Lock,
  ArrowLeft,
  FileText,
  Video,
  Compass,
  CheckSquare,
  ChevronRight,
  BookOpen,
  Clock
} from 'lucide-react';
import { ApiClient } from '@bahrain/api-client';
import { en, id, ar } from '@bahrain/localization';
import PhysicalReadinessLesson from './components/PhysicalReadinessLesson';
import MiqatLesson from './components/MiqatLesson';
import VirtualDomeLesson from './components/VirtualDomeLesson';

const client = new ApiClient({ baseUrl: '/api/v1' });

export default function MyLearningPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500 font-bold">Loading...</div>}>
      <MyLearningContent />
    </Suspense>
  );
}

function MyLearningContent() {
  const [userName, setUserName] = useState('');
  const [lang, setLang] = useState('en');

  // Translation helpers
  const tMap: Record<string, any> = { en, id, ar };
  const t = tMap[lang] || en;
  const d = t.dashboard || en.dashboard;

  const sd = t.my_learning_wizard || en.my_learning_wizard;

  // Structured Hajj Course Data conforming to Product -> Path -> Course -> Module -> Lesson -> Content
  const coursesList = [
    {
      id: 'c-1',
      title: lang === 'id' ? 'Pembelajaran Haji' : lang === 'ar' ? 'دروس الحج' : 'Introductory Rites and Physical Preparation',
      duration: `45 ${sd.mins}`,
      progress: 66,
      lastActivity: sd.assessed_yesterday,
      lessonsCount: 3,
      lessons: [
        {
          id: 'l-1.1',
          title: lang === 'id' ? 'Protokol Kesiapan Fisik' : 'Physical Readiness Protocols',
          duration: `15 ${sd.mins}`,
          type: 'Reading',
          status: 'completed',
          readingContent: 'Hajj involves significant physical exertion, including walking several miles daily. Prior to departure, build cardiovascular stamina by walking 30-45 minutes daily. Ensure you consult with your physician regarding recommended vaccinations and necessary personal medications.',
          videoUrl: '/mock-video.mp4',
          quizQuestions: [
            { id: 1, q: "What is the recommended daily walking duration to build stamina before Hajj?", a: ["10 minutes", "15 minutes", "30-45 minutes", "2 hours"], correct: "30-45 minutes" }
          ]
        },
        {
          id: 'l-1.2',
          title: lang === 'id' ? 'Memahami Batas Miqat' : 'Understanding Miqat Boundaries',
          duration: `20 ${sd.mins}`,
          type: 'Video',
          status: 'completed',
          readingContent: 'Miqat represents the boundary line at which pilgrims must enter the state of Ihram. There are five main Miqats designated depending on the geographic direction from which the pilgrim arrives. For instance, pilgrims arriving from Medina assume Ihram at Dhul Hulaifah.',
          videoUrl: '/mock-video.mp4',
          quizQuestions: [
            { id: 1, q: "Which Miqat boundary is designated for pilgrims arriving from Medina?", a: ["Yalamlam", "Dhul Hulaifah", "Juhfah", "Dhat Irq"], correct: "Dhul Hulaifah" }
          ]
        },
        {
          id: 'l-1.3',
          title: lang === 'id' ? 'Tur Virtual Dome Interaktif' : 'Interactive Dome Virtual Tour',
          duration: `10 ${sd.mins}`,
          type: '3DVista Virtual Tour',
          status: 'in-progress',
          readingContent: 'Launch the immersive 360° tour below to orient yourself with the pathways of Masjidil Haram, locating key landmarks including the Kaaba, Safa, and Marwah hills.',
          videoUrl: '/mock-video.mp4',
          quizQuestions: [
            { id: 1, q: "What is the starting point of the Tawaf ritual circuit?", a: ["Maqam Ibrahim", "Hajar al-Aswad (Black Stone)", "Safa Hill", "Muzdalifah"], correct: "Hajar al-Aswad (Black Stone)" }
          ]
        }
      ]
    },
    {
      id: 'c-2',
      title: lang === 'id' ? 'Urutan Ritual Tingkat Lanjut & Tenda Mina' : 'Advanced Ritual Sequence & Mina Camping',
      duration: `1.2 ${sd.hours}`,
      progress: 0,
      lastActivity: sd.not_started,
      lessonsCount: 2,
      lessons: [
        {
          id: 'l-2.1',
          title: 'Safar Journey Guidelines',
          duration: `30 ${sd.mins}`,
          type: 'Reading',
          status: 'locked',
          readingContent: 'Understand traveling procedures and group boarding schedules.',
          videoUrl: '',
          quizQuestions: []
        },
        {
          id: 'l-2.2',
          title: 'Mina & Muzdalifah Stay Procedures',
          duration: `40 ${sd.mins}`,
          type: '3DVista Virtual Tour',
          status: 'locked',
          readingContent: 'Step-by-step overview of camp structures and stoning schedules.',
          videoUrl: '',
          quizQuestions: []
        }
      ]
    }
  ];

  const [courses, setCourses] = useState<any[]>([]);
  const [hasActivePlan, setHasActivePlan] = useState<boolean | null>(null); // null = loading
  const [activePackages, setActivePackages] = useState<string[]>([]);


  // Lesson player states
  const [selectedLesson, setSelectedLesson] = useState<any | null>(null);
  const [activeContentTab, setActiveContentTab] = useState<'overview' | 'reading' | 'video' | 'tour' | 'quiz'>('overview');
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [maxUnlockedStep, setMaxUnlockedStep] = useState<number>(0);

  // Guard flag: prevents save useEffect from firing with stale data during lesson initialization
  const isInitializingRef = useRef(false);
  // Track previous lesson ID to detect actual lesson changes vs. data refreshes of same lesson
  const previousLessonIdRef = useRef<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const lessonIdFromUrl = searchParams.get('lessonId');
  const typeParam = searchParams.get('type') || 'haji';
  const selectedSubmenu = typeParam === 'umroh' ? 'umroh' : 'haji';

  const getShortLessonTitle = (title: string) => {
    const lower = title.toLowerCase();
    if (lower.includes('readiness') || lower.includes('kesiapan')) return lang === 'id' ? 'Persiapan' : lang === 'ar' ? 'الاستعداد' : 'Readiness';
    if (lower.includes('miqat')) return 'Miqat';
    if (lower.includes('dome') || lower.includes('virtual tour') || lower.includes('virtual dome')) return lang === 'id' ? 'Kubah Virtual' : lang === 'ar' ? 'القبة الافتراضية' : 'Virtual Tour';
    if (lower.includes('safar')) return 'Safar';
    if (lower.includes('mina')) return 'Mina';
    return title;
  };

  const getActiveQuizQuestions = (lesson: any) => {
    if (!lesson) return [];
    const activeSd = t.my_learning_wizard || en.my_learning_wizard;
    const isL1_1 = lesson.id === 'l-1.1' || lesson.title.toLowerCase().includes('readiness') || lesson.title.toLowerCase().includes('kesiapan');
    const isL1_2 = lesson.id === 'l-1.2' || lesson.title.toLowerCase().includes('miqat') || lesson.title.toLowerCase().includes('miqat');
    const isL1_3 = lesson.id === 'l-1.3' || lesson.title.toLowerCase().includes('interactive dome') || lesson.title.toLowerCase().includes('tur virtual');
    
    if (isL1_1) return activeSd.lesson_1_1_quiz || [];
    if (isL1_2) return activeSd.lesson_1_2_quiz || [];
    if (isL1_3) return activeSd.lesson_1_3_quiz || [];
    return [];
  };

  const translateTitle = (title: string) => {
    const activeSd = t.my_learning_wizard || en.my_learning_wizard;
    if (title.includes('Introductory Rites')) return activeSd.title_introductory_rites || title;
    if (title.includes('Physical Readiness')) return activeSd.title_physical_readiness || title;
    if (title.includes('Miqat Boundaries')) return activeSd.title_miqat_boundaries || title;
    if (title.includes('Interactive Dome')) return activeSd.title_interactive_dome || title;
    if (title.includes('Advanced Ritual')) return activeSd.title_advanced_ritual || title;
    return title;
  };

  useEffect(() => {
    const savedLang = localStorage.getItem('bahrain_lang') || 'en';
    setLang(savedLang);

    // Fetch subscription status from database
    client.getSubscription()
      .then((sub: any) => {
        setHasActivePlan(sub?.active === true);
        setActivePackages(sub?.activePackages || []);
      })
      .catch(() => {
        setHasActivePlan(false);
        setActivePackages([]);
      });

    // Fetch dynamic paths from NestJS API
    client.getPaths()
      .then((data) => {
        if (data && data.courses && data.courses.length > 0) {
          setCourses(data.courses);
        } else {
          setCourses([]);
        }
      })
      .catch(() => {
        setCourses([]);
      });
  }, [lang]);

  // Sync URL query param to state (supports F5 refresh)
  useEffect(() => {
    if (lessonIdFromUrl && courses.length > 0) {
      let foundLesson = null;
      for (const course of courses) {
        const found = course.lessons?.find((l: any) => l.id === lessonIdFromUrl);
        if (found && found.status !== 'locked') {
          foundLesson = found;
          break;
        }
      }
      if (foundLesson) {
        setSelectedLesson(foundLesson);
      } else {
        setSelectedLesson(null);
      }
    } else if (!lessonIdFromUrl) {
      setSelectedLesson(null);
    }
  }, [lessonIdFromUrl, courses]);

  // Load saved progress when selectedLesson changes from DB
  useEffect(() => {
    if (selectedLesson) {
      const isNewLesson = selectedLesson.id !== previousLessonIdRef.current;
      previousLessonIdRef.current = selectedLesson.id;

      if (isNewLesson) {
        // Switching to a different lesson — reset everything and load saved progress
        isInitializingRef.current = true;

        if (selectedLesson.activeTab) {
          setActiveContentTab(selectedLesson.activeTab);
        } else {
          setActiveContentTab('overview');
        }

        if (selectedLesson.status === 'completed') {
          setMaxUnlockedStep(4);
        } else if (typeof selectedLesson.maxUnlockedStep === 'number') {
          setMaxUnlockedStep(selectedLesson.maxUnlockedStep);
        } else {
          setMaxUnlockedStep(0);
        }
        // Load quiz state from DB instead of resetting it
        setQuizAnswers(selectedLesson.quizAnswers || {});
        setQuizScore(selectedLesson.quizScore !== undefined && selectedLesson.quizScore !== null ? selectedLesson.quizScore : null);

        const timer = setTimeout(() => {
          isInitializingRef.current = false;
        }, 300);
        return () => clearTimeout(timer);
      }
      // Same lesson refreshed (e.g., after completeLesson → getPaths) — do NOT reset quizScore
    }
  }, [selectedLesson]);

  // Save progress when activeContentTab, maxUnlockedStep, quizAnswers, or quizScore changes to DB
  useEffect(() => {
    // Skip saving while a new lesson is being initialized (prevents stale data from previous lesson bleeding over)
    if (isInitializingRef.current) return;
    if (selectedLesson && (activeContentTab !== 'overview' || maxUnlockedStep > 0)) {
      client.saveLessonProgress(
        selectedLesson.id,
        activeContentTab,
        maxUnlockedStep,
        quizAnswers,
        quizScore
      ).catch(() => {});
    }
  }, [activeContentTab, maxUnlockedStep, quizAnswers, quizScore, selectedLesson]);

  // Auto-scroll the active tab button into view on mobile
  useEffect(() => {
    const activeBtn = document.getElementById(`tab-btn-${activeContentTab}`);
    if (activeBtn) {
      activeBtn.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }, [activeContentTab]);

  if (selectedLesson) {
    const activeQuizQuestions = getActiveQuizQuestions(selectedLesson);
    const parentCourse = courses.find(c => c.lessons?.some((l: any) => l.id === selectedLesson.id));
    const courseTitle = parentCourse ? translateTitle(parentCourse.title) : (lang === 'id' ? 'Umrah' : lang === 'ar' ? 'العمرة' : 'Umrah');
    const pathName = courseTitle.toLowerCase().includes('haji') || courseTitle.toLowerCase().includes('hajj')
      ? (lang === 'id' ? 'Haji' : lang === 'ar' ? 'الحج' : 'Hajj')
      : (lang === 'id' ? 'Umrah' : lang === 'ar' ? 'العمرة' : 'Umrah');

    const rawSteps = [{ id: 'overview', label: sd.overview }];
    rawSteps.push({ id: 'reading', label: sd.reading });

    // Video is active for all stages
    rawSteps.push({ id: 'video', label: sd.video });

    // 360 Tour is active for all stages except: Persiapan Fisik, Ihram, and Tahallul
    const titleLower = (selectedLesson.title || '').toLowerCase();
    const isPersiapanFisik = titleLower.includes('readiness') || titleLower.includes('kesiapan') || titleLower.includes('persiapan');
    const isIhram = titleLower.includes('ihram');
    const isTahallul = titleLower.includes('tahalul') || titleLower.includes('tahallul');

    const hasTour = !isPersiapanFisik && !isIhram && !isTahallul;
    if (hasTour) {
      rawSteps.push({ id: 'tour', label: sd.tour });
    }

    rawSteps.push({ id: 'quiz', label: sd.quiz });

    const wizardSteps = rawSteps.map((step, idx) => ({ ...step, index: idx }));

    const currentStepIndex = wizardSteps.findIndex(s => s.id === activeContentTab);
    const nextStep = wizardSteps[currentStepIndex + 1];

    const isLessonCompleted = selectedLesson.status === 'completed' || quizScore === 100;
    const completedStepsCount = isLessonCompleted ? wizardSteps.length : Math.max(1, maxUnlockedStep);
    const progressPercent = Math.round((completedStepsCount / wizardSteps.length) * 100);

    const circleNums = ['①', '②', '③', '④', '⑤', '⑥'];

    const getObjectiveText = () => {
      if (selectedLesson.id === 'l-1.1') return sd.objective_1;
      if (selectedLesson.id === 'l-1.2') return sd.objective_2;
      if (selectedLesson.id === 'l-1.3') return sd.objective_3;
      if (selectedLesson.id === 'l-2.1') return sd.objective_4;
      if (selectedLesson.id === 'l-2.2') return sd.objective_5;
      return sd.objective_1;
    };

    const handleNextLessonRedirect = () => {
      // Fetch the latest paths from DB so we have fresh lesson status
      client.getPaths().then((data: any) => {
        if (data && data.courses) {
          setCourses(data.courses);
          // Find the current lesson's position across all courses
          for (const course of data.courses) {
            const lessons = course.lessons || [];
            const currentIdx = lessons.findIndex((l: any) => l.id === selectedLesson.id);
            if (currentIdx !== -1) {
              const nextL = lessons[currentIdx + 1];
              if (nextL) {
                router.push(`/dashboard/my-learning?lessonId=${nextL.id}`);
                setActiveContentTab('overview');
                setQuizScore(null);
                setQuizAnswers({});
                return;
              }
              break;
            }
          }
        }
        // No next lesson — back to list
        router.push('/dashboard/my-learning');
        setQuizScore(null);
        setQuizAnswers({});
      }).catch(() => {
        router.push('/dashboard/my-learning');
        setQuizScore(null);
        setQuizAnswers({});
      });
    };

    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        {/* Coursera-style Top Breadcrumbs Bar */}
        <div className="bg-white border-b border-slate-200 px-4 md:px-8 py-3.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                router.push('/dashboard/my-learning');
              }}
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors font-bold shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{sd.back}</span>
            </button>
            <span className="text-slate-300 font-mono">/</span>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold truncate max-w-[250px] sm:max-w-md">
              <span>{pathName}</span>
              <span>&gt;</span>
              <span className="truncate">{courseTitle}</span>
              <span>&gt;</span>
              <span className="text-slate-800 font-extrabold truncate">{translateTitle(selectedLesson.title)}</span>
            </div>
          </div>
        </div>

        {/* Split Grid Layout */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden w-full p-4 md:p-6 gap-6">

          {/* Left Sidebar: Progress Stepper */}
          <div className="w-full lg:w-72 bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col shrink-0 gap-4">
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">{sd.learning_progress}</h4>
              <div className="flex items-center justify-between mt-2.5">
                <span className="text-xs font-extrabold text-slate-700">{completedStepsCount} {sd.of} {wizardSteps.length} {sd.steps}</span>
                <span className="text-xs font-mono font-extrabold text-[#1e40af]">{progressPercent}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-1.5">
                <div className="bg-[#1e40af] h-2 rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-3 flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible gap-2 lg:gap-1 scrollbar-none">
              {wizardSteps.map((step) => {
                const isCompleted = selectedLesson.status === 'completed' || step.index < maxUnlockedStep;
                const isActive = activeContentTab === step.id;
                const isLocked = !isCompleted && !isActive && step.index > maxUnlockedStep;
                const stepIcon = isCompleted ? '✓' : circleNums[step.index];

                return (
                  <button
                    key={step.id}
                    id={`tab-btn-${step.id}`}
                    disabled={isLocked}
                    onClick={() => {
                      setActiveContentTab(step.id as any);
                    }}
                    className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-xs font-extrabold transition-all shrink-0 whitespace-nowrap text-left w-auto lg:w-full ${isActive
                        ? 'bg-[#1e40af] text-white shadow-sm ring-2 ring-emerald-100 animate-pulse'
                        : isLocked
                          ? 'bg-slate-50 border border-slate-150 text-slate-450 opacity-55 cursor-not-allowed'
                          : 'bg-white hover:bg-slate-50 border border-slate-200 text-slate-700'
                      }`}
                  >
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold ${isActive ? 'bg-white text-[#1e40af]' : isCompleted ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                      {isCompleted ? '✓' : stepIcon}
                    </span>
                    <span className="truncate">{step.label}</span>
                    {isLocked && <Lock className="w-3.5 h-3.5 text-slate-400 ml-auto shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Main Viewer: Content Stepper Box */}
          <div className="flex-1 bg-white border border-slate-200 rounded-xl shadow-sm p-6 md:p-8 overflow-y-auto flex flex-col justify-between">

            {/* If Quiz is passed and we are on the quiz tab, show the premium Success celebration page directly */}
            {activeContentTab === 'quiz' && quizScore === 100 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-6 py-12">
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                  <CheckCircle2 className="w-12 h-12 text-blue-600 animate-bounce" />
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold text-slate-800 tracking-tight">{sd.celebration_congrats}</h3>
                  <p className="text-sm text-slate-500 font-medium mt-2 leading-relaxed">
                    {sd.celebration_desc}
                  </p>
                </div>
                <button
                  onClick={handleNextLessonRedirect}
                  className="bg-[#1e40af] hover:bg-[#043427] text-white text-sm font-extrabold px-8 py-3 rounded-lg shadow-md hover:shadow-lg transition-all"
                >
                  {sd.next_lesson_btn}
                </button>
              </div>
            ) : (
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  {(() => {
                    const getLessonSummaryAndObjective = (lessonTitle: string) => {
                      const lower = lessonTitle.toLowerCase();
                      const summaries = sd.lesson_summaries || {};

                      let key = "";
                      if (lower.includes('readiness') || lower.includes('kesiapan') || lower.includes('fisik')) {
                        key = "readiness";
                      } else if (lower.includes('miqat') || lower.includes('batas')) {
                        key = "miqat";
                      } else if (lower.includes('ihram')) {
                        key = "ihram";
                      } else if (lower.includes('wukuf') || lower.includes('arafah')) {
                        key = "wukuf";
                      } else if (lower.includes('mabit') && lower.includes('muzdalifah')) {
                        key = "mabit_muzdalifah";
                      } else if (lower.includes('jumrah') && lower.includes('aqabah')) {
                        key = "jumrah_aqabah";
                      } else if (lower.includes('tahalul') || lower.includes('tahallul')) {
                        key = "tahalul";
                      } else if (lower.includes('tawaf')) {
                        key = "tawaf";
                      } else if (lower.includes('sa\'i') || lower.includes('safi')) {
                        key = "sai";
                      } else if (lower.includes('mabit') && lower.includes('mina')) {
                        key = "mabit_mina";
                      } else if (lower.includes('wada')) {
                        key = "wada";
                      }

                      if (key && summaries[key]) {
                        return {
                          objective: summaries[key].objective,
                          desc: summaries[key].desc
                        };
                      }

                      return {
                        objective: sd.objective_1,
                        desc: sd.welcome_desc
                      };
                    };

                    const dynamicInfo = getLessonSummaryAndObjective(selectedLesson.title);
                    const customSd = {
                      ...sd,
                      objective_1: dynamicInfo.objective,
                      objective_2: dynamicInfo.objective,
                      objective_3: dynamicInfo.objective,
                      welcome_desc: dynamicInfo.desc
                    };

                    if (selectedLesson.id === 'l-1.1' || selectedLesson.title.toLowerCase().includes('kesiapan') || selectedLesson.title.toLowerCase().includes('readiness')) {
                      return (
                        <PhysicalReadinessLesson
                          activeTab={activeContentTab}
                          lang={lang}
                          quizAnswers={quizAnswers}
                          setQuizAnswers={setQuizAnswers}
                          quizScore={quizScore}
                          sd={customSd}
                        />
                      );
                    } else if (selectedLesson.id === 'l-1.2' || selectedLesson.title.toLowerCase().includes('miqat')) {
                      return (
                        <MiqatLesson
                          activeTab={activeContentTab}
                          lang={lang}
                          quizAnswers={quizAnswers}
                          setQuizAnswers={setQuizAnswers}
                          quizScore={quizScore}
                          sd={customSd}
                        />
                      );
                    } else {
                      return (
                        <VirtualDomeLesson
                          activeTab={activeContentTab}
                          lang={lang}
                          quizAnswers={quizAnswers}
                          setQuizAnswers={setQuizAnswers}
                          quizScore={quizScore}
                          sd={customSd}
                        />
                      );
                    }
                  })()}
                </div>

                {/* Bottom Wizard Stepper Control Button */}
                <div className="mt-8 border-t border-slate-100 pt-5 flex justify-end">
                  {nextStep ? (
                    <button 
                      onClick={() => {
                        setActiveContentTab(nextStep.id as any);
                        setMaxUnlockedStep(prev => Math.max(prev, nextStep.index));
                      }} 
                      className="bg-[#1e40af] hover:bg-[#043427] text-white text-xs font-extrabold px-8 py-3 rounded-lg shadow-sm transition-all"
                    >
                      {nextStep.id === 'reading' && sd.start_lesson}
                      {nextStep.id === 'video' && sd.next_video}
                      {nextStep.id === 'tour' && sd.next_tour}
                      {nextStep.id === 'quiz' && sd.next_quiz}
                    </button>
                  ) : (
                    activeContentTab === 'quiz' && quizScore === null && activeQuizQuestions && activeQuizQuestions.length > 0 ? (
                      <button
                        onClick={() => {
                          const correct = activeQuizQuestions.every((q: any) => quizAnswers[q.id] === q.correct);
                          setQuizScore(correct ? 100 : 0);
                          if (correct) {
                            client.completeLesson(selectedLesson.id)
                              .then(() => {
                                client.getPaths().then((data) => {
                                  if (data && data.courses) {
                                    setCourses(data.courses);
                                  }
                                });
                              })
                              .catch(() => {});
                          }
                        }}
                        className="bg-[#d97706] hover:bg-[#b45309] text-white text-xs font-extrabold px-8 py-3 rounded-lg shadow-sm transition-all"
                      >
                        {sd.submit_answers}
                      </button>
                    ) : activeContentTab === 'quiz' && quizScore === 0 ? (
                      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-amber-50 text-amber-900 border border-amber-200">
                        <span className="text-xs font-bold">{sd.quiz_fail}</span>
                        <button
                          onClick={() => {
                            setQuizScore(null);
                            setQuizAnswers({});
                          }}
                          className="bg-[#d97706] hover:bg-[#b45309] text-white text-xs font-extrabold px-5 py-2 rounded-lg transition-all"
                        >
                          Try Again
                        </button>
                      </div>
                    ) : null
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 w-full space-y-6 py-12">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{d.my_learning}</h2>
        <p className="text-sm text-slate-400 mt-0.5 font-medium">Workspace containing paths and sequence lessons</p>
      </div>

      {/* Subscription loading */}
      {hasActivePlan === null && (
        <div className="flex items-center justify-center py-24 text-slate-400 text-sm font-medium">Memuat status langganan...</div>
      )}

      {/* No active plan — hide courses, show premium empty state */}
      {hasActivePlan === false && (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-6">
          <div className="w-20 h-20 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center">
            <Lock className="w-9 h-9 text-amber-400" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-extrabold text-slate-800">Belum Ada Paket Aktif</h3>
            <p className="text-sm text-slate-500 max-w-sm">Pilih paket <span className="font-bold text-[#1e40af]">Haji</span> atau <span className="font-bold text-[#1e40af]">Umrah</span> untuk membuka semua materi pembelajaran sesuai ibadah Anda.</p>
          </div>
          <button
            onClick={() => router.push('/dashboard/subscription')}
            className="bg-[#1e40af] hover:bg-[#043427] text-white text-sm font-extrabold px-8 py-3 rounded-xl shadow transition-all flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            Lihat Paket Langganan
          </button>
        </div>
      )}



      <div className="space-y-8">
        {hasActivePlan === true && (() => {
          const isHajjSubmenu = selectedSubmenu === 'haji';
          const isPackageActive = activePackages.some((p: string) => 
            p && (isHajjSubmenu 
              ? (p.toLowerCase().includes('haji') || p.toLowerCase().includes('hajj'))
              : (p.toLowerCase().includes('umrah') || p.toLowerCase().includes('umroh')))
          );

          if (!isPackageActive) {
            return (
              <div className="flex flex-col items-center justify-center py-16 text-center gap-5 border border-slate-200 rounded-2xl bg-slate-50/40 p-8 shadow-sm">
                <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center">
                  <Lock className="w-7 h-7 text-amber-500" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-lg font-extrabold text-slate-800">Paket Belum Aktif</h4>
                  <p className="text-sm text-slate-500 max-w-sm">
                    Anda belum memiliki akses aktif untuk paket <span className="font-bold text-[#1e40af] capitalize">{selectedSubmenu}</span>. Aktifkan paket Anda untuk mulai belajar.
                  </p>
                </div>
                <button
                  onClick={() => router.push('/dashboard/subscription')}
                  className="bg-[#1e40af] hover:bg-[#043427] text-white text-xs font-extrabold px-6 py-2.5 rounded-lg shadow-sm transition-all"
                >
                  Aktifkan Sekarang
                </button>
              </div>
            );
          }

          // Render selected submenu course as a premium grid of cards
          const activeCourse = courses.find((c: any) => 
            isHajjSubmenu 
              ? (c.title.toLowerCase().includes('haji') || c.title.toLowerCase().includes('hajj'))
              : (c.title.toLowerCase().includes('umrah') || c.title.toLowerCase().includes('umroh'))
          );

          if (!activeCourse) {
            return (
              <div className="flex items-center justify-center py-16 text-slate-400 text-sm font-medium">
                Materi pembelajaran belum tersedia untuk paket ini.
              </div>
            );
          }

          const courseLessons = activeCourse.lessons || [];

          return (
            <div className="space-y-6">
              {/* Course Progress header banner */}
              <div className="bg-slate-50/70 border border-slate-200 rounded-xl px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="font-extrabold text-base text-slate-800 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-[#1e40af] shrink-0" />
                    {translateTitle(activeCourse.title)}
                  </h3>
                  <span className="inline-block bg-blue-50 text-[#1e40af] text-xs font-bold px-2 py-0.5 rounded-md">
                    {activeCourse.lessonsCount || courseLessons.length || 0} {d.lessons}
                  </span>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs font-bold text-slate-500">Progress Pembelajaran:</span>
                  <div className="w-32 bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#1e40af] h-2 rounded-full transition-all duration-500" style={{ width: `${activeCourse.progress}%` }}></div>
                  </div>
                  <span className="text-sm font-extrabold text-[#1e40af] font-mono">{activeCourse.progress}%</span>
                </div>
              </div>

              {/* Grid Layout of individual cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courseLessons.map((lesson: any) => (
                  <div
                    key={lesson.id}
                    onClick={() => {
                      if (lesson.status !== 'locked') {
                        router.push(`/dashboard/my-learning?lessonId=${lesson.id}`);
                        setActiveContentTab('overview');
                      }
                    }}
                    className={`group relative border rounded-2xl flex flex-col justify-between transition-all duration-300 overflow-hidden min-h-[300px] h-full ${
                      lesson.status !== 'locked'
                        ? 'border-slate-200 bg-white hover:border-[#1e40af] hover:shadow-lg hover:-translate-y-1 cursor-pointer'
                        : 'border-slate-100 bg-slate-50/50 opacity-75 cursor-not-allowed'
                    }`}
                  >
                    {/* Card Thumbnail Image */}
                    <div className="relative w-full h-40 overflow-hidden bg-slate-100 shrink-0">
                      <Image
                        src={(() => {
                          const lower = (lesson.title || '').toLowerCase();
                          if (lower.includes('readiness') || lower.includes('kesiapan') || lower.includes('fisik')) return '/images/pilgrim-hero.png';
                          if (lower.includes('miqat') || lower.includes('ihram')) return '/images/miqat.png';
                          if (lower.includes('wukuf') || lower.includes('arafah')) return '/images/about-mission.png';
                          if (lower.includes('tawaf')) return '/images/kaaba.png';
                          if (lower.includes('sa\'i')) return '/images/sai.png';
                          if (lower.includes('mina') || lower.includes('mabit') || lower.includes('jumrah')) return '/images/mina.png';
                          return '/images/kaaba.png';
                        })()}
                        alt={lesson.title}
                        fill
                        className={`object-cover transition-transform duration-500 group-hover:scale-105 ${
                          lesson.status === 'locked' ? 'grayscale blur-[2px]' : ''
                        }`}
                      />
                      {lesson.status === 'locked' && (
                        <div className="absolute inset-0 bg-slate-900/30 flex items-center justify-center">
                          <div className="w-10 h-10 rounded-full bg-white/95 flex items-center justify-center shadow-md">
                            <Lock className="w-4 h-4 text-slate-550" />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Card Content area */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div className="space-y-3">
                        {/* Top Row: Icon / Status Badge */}
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                            lesson.status === 'completed'
                              ? 'bg-blue-50 text-blue-700'
                              : lesson.status === 'in-progress'
                                ? 'bg-amber-50 text-amber-700'
                                : 'bg-slate-150 text-slate-500'
                          }`}>
                            {lesson.status === 'completed' ? 'Selesai' : lesson.status === 'in-progress' ? 'Lanjut' : 'Terkunci'}
                          </span>
                          
                          <div>
                            {lesson.status === 'completed' && <CheckCircle2 className="w-5 h-5 text-blue-600" />}
                            {lesson.status === 'in-progress' && <Play className="w-5 h-5 text-[#d97706]" />}
                          </div>
                        </div>

                        {/* Lesson Title */}
                        <h4 className={`font-extrabold text-sm md:text-base tracking-tight leading-snug ${
                          lesson.status === 'locked' ? 'text-slate-400' : 'text-slate-800'
                        }`}>
                          {translateTitle(lesson.title)}
                        </h4>
                      </div>

                      {/* Features list (Membaca • Video • Tur 360) */}
                      <div className="mt-6 pt-4 border-t border-slate-100/60 flex items-center justify-between text-[11px] text-slate-400 font-bold">
                        <span className="truncate">
                          {(() => {
                            const titleLower = (lesson.title || '').toLowerCase();
                            const isPersiapanFisik = titleLower.includes('readiness') || titleLower.includes('kesiapan') || titleLower.includes('persiapan');
                            const isIhram = titleLower.includes('ihram');
                            const isTahallul = titleLower.includes('tahalul') || titleLower.includes('tahallul');

                            const features = [sd.reading, sd.video];
                            const hasTour = !isPersiapanFisik && !isIhram && !isTahallul;
                            if (hasTour) {
                              features.push(sd.tour);
                            }
                            features.push(sd.quiz);
                            return features.join(' • ');
                          })()}
                        </span>
                    </div>
                  </div>
                </div>
              ))}
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
