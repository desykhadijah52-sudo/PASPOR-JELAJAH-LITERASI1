import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, CheckCircle2, Music, Pause, Play, Volume2, VolumeX, XCircle } from 'lucide-react';
import { getQuestionsByRegion } from '../data/literacyData';
import { AspectStat, LiteracyAspect, RegionInfo, VictorySummary } from '../types/game';
import { sound } from '../utils/sound';
import { createEmptyAspectBreakdown } from '../utils/studentStore';

interface PassportPlayViewProps {
  region: RegionInfo;
  studentName: string;
  studentClass: string;
  muted: boolean;
  musicEnabled: boolean;
  onToggleMute: () => void;
  onToggleMusic: () => void;
  onExitToMap: () => void;
  onComplete: (summary: VictorySummary) => void;
}

export const PassportPlayView: React.FC<PassportPlayViewProps> = ({
  region,
  studentName,
  studentClass,
  muted,
  musicEnabled,
  onToggleMute,
  onToggleMusic,
  onExitToMap,
  onComplete,
}) => {
  const [questions] = useState(() => getQuestionsByRegion(region.id));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [paused, setPaused] = useState(false);
  const [elapsedSec, setElapsedSec] = useState(0);

  const aspectRef = useRef<Record<LiteracyAspect, AspectStat>>(createEmptyAspectBreakdown());
  const responseTimesRef = useRef<number[]>([]);
  const questionStartRef = useRef<number>(Date.now());

  const currentQuestion = questions[currentIndex];
  const isAnswered = selectedOption !== null;
  const isCorrect = isAnswered && selectedOption === currentQuestion.correctIndex;

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => {
      setElapsedSec((prev) => prev + 1);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [paused]);

  const handleSelectOption = (idx: number) => {
    if (isAnswered || paused) return;

    const now = Date.now();
    const qDuration = Math.max(0.5, (now - questionStartRef.current) / 1000);
    responseTimesRef.current.push(qDuration);

    setSelectedOption(idx);
    const right = idx === currentQuestion.correctIndex;

    const aspectEntry = aspectRef.current[currentQuestion.aspect];
    aspectEntry.total += 1;
    if (right) {
      aspectEntry.correct += 1;
      const nextStreak = streak + 1;
      const speedBonus = qDuration <= 12 ? 30 : qDuration <= 20 ? 15 : 0;
      const gained = 100 + (nextStreak - 1) * 20 + speedBonus;
      setScore((s) => s + gained);
      setStreak(nextStreak);
      setCorrectCount((c) => c + 1);
      sound.playCorrect(nextStreak);
    } else {
      setStreak(0);
      sound.playWrong();
    }
  };

  const handleNext = () => {
    if (!isAnswered || paused) return;
    sound.playClick();

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      questionStartRef.current = Date.now();
      return;
    }

    const totalQ = questions.length;
    const accuracy = Math.round((correctCount / totalQ) * 100);
    const avgTime =
      responseTimesRef.current.length > 0
        ? responseTimesRef.current.reduce((a, b) => a + b, 0) / responseTimesRef.current.length
        : elapsedSec / Math.max(1, totalQ);

    const earnedStamp = accuracy >= 75 ? region : undefined;
    if (earnedStamp) {
      sound.playStamp();
    } else {
      sound.playVictory();
    }

    onComplete({
      mode: 'paspor',
      studentName,
      className: studentClass,
      destinationLabel: region.name,
      score,
      correctCount,
      totalQuestions: totalQ,
      accuracy,
      avgResponseTimeSec: Number(avgTime.toFixed(1)),
      durationSec: Math.max(1, elapsedSec),
      newStamp: earnedStamp,
      aspectBreakdown: aspectRef.current,
    });
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setPaused((p) => !p);
        return;
      }
      if (paused) return;

      if (!isAnswered && ['1', '2', '3', '4'].includes(e.key)) {
        e.preventDefault();
        handleSelectOption(Number(e.key) - 1);
      } else if (isAnswered && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        handleNext();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  return (
    <div className="min-h-screen bg-[#0B192C] text-slate-100 flex flex-col">
      {/* Unobtrusive Top HUD (< 10% viewport height) */}
      <header className="flex items-center justify-between gap-4 px-5 sm:px-8 py-3.5 border-b border-slate-800 bg-[#091424]">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setPaused(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 min-h-[44px] rounded-lg bg-[#122643] hover:bg-[#1B355B] border border-slate-700 text-sm font-medium text-slate-100 transition-colors cursor-pointer"
          >
            <Pause className="w-4 h-4" />
            <span className="hidden sm:inline">Jeda</span>
          </button>
          <div>
            <p className="text-xs text-amber-300 font-medium">{region.name}</p>
            <p className="text-sm font-semibold text-white">
              {studentName} · {studentClass}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-5 font-mono-tabular text-sm">
          <div className="text-right">
            <span className="block text-[11px] text-slate-400 font-sans">Progres</span>
            <span className="font-bold text-white">
              {currentIndex + 1} / {questions.length}
            </span>
          </div>
          <div className="text-right">
            <span className="block text-[11px] text-slate-400 font-sans">Skor</span>
            <span className="font-bold text-emerald-400">{score}</span>
          </div>
          <div className="hidden sm:block text-right">
            <span className="block text-[11px] text-slate-400 font-sans">Waktu</span>
            <span className="font-bold text-slate-200">{elapsedSec} dtk</span>
          </div>
          <button
            type="button"
            onClick={onToggleMusic}
            aria-label={musicEnabled ? 'Matikan musik latar' : 'Nyalakan musik latar'}
            className="inline-flex items-center justify-center w-11 h-11 rounded-lg bg-[#122643] hover:bg-[#1B355B] border border-slate-700 text-slate-100 transition-colors cursor-pointer"
          >
            <Music className={`w-5 h-5 ${musicEnabled && !muted ? 'text-amber-400' : 'text-slate-400'}`} />
          </button>
          <button
            type="button"
            onClick={onToggleMute}
            aria-label={muted ? 'Nyalakan suara' : 'Bisukan suara'}
            className="inline-flex items-center justify-center w-11 h-11 rounded-lg bg-[#122643] hover:bg-[#1B355B] border border-slate-700 text-slate-100 transition-colors cursor-pointer"
          >
            {muted ? <VolumeX className="w-5 h-5 text-slate-400" /> : <Volume2 className="w-5 h-5 text-emerald-400" />}
          </button>
        </div>
      </header>

      {/* Main Reading Arena */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-5 sm:px-8 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Archival Reading Passage Card */}
        <article className="lg:col-span-6 rounded-2xl bg-[#F8FAFC] text-slate-900 border border-slate-200 p-6 sm:p-8 flex flex-col justify-between shadow-xl">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2 text-xs text-slate-500 pb-3 border-b border-slate-200">
              <span className="font-semibold text-emerald-700">{currentQuestion.aspect}</span>
              <span>{region.genre}</span>
            </div>

            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#0F1F38] leading-snug">
              {currentQuestion.title}
            </h1>

            <p className="text-base sm:text-[17px] text-slate-800 leading-[1.75]">
              {currentQuestion.passage}
            </p>
          </div>

          <div className="pt-6 mt-6 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <span>Baca teks dengan saksama sebelum memilih jawaban.</span>
            {streak >= 2 && (
              <span className="font-mono-tabular font-bold text-amber-600">
                Runtutan Benar x{streak}
              </span>
            )}
          </div>
        </article>

        {/* Right: Question & 4 Large Interactive Options */}
        <section className="lg:col-span-6 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-white leading-snug">
              {currentQuestion.question}
            </h2>

            <div className="space-y-3">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                const isRightOption = idx === currentQuestion.correctIndex;

                let btnClass =
                  'bg-[#122643] hover:bg-[#193357] border-slate-700 text-slate-100';
                if (isAnswered) {
                  if (isRightOption) {
                    btnClass = 'bg-emerald-900/70 border-emerald-400 text-white';
                  } else if (isSelected && !isRightOption) {
                    btnClass = 'bg-rose-900/60 border-rose-400 text-rose-100';
                  } else {
                    btnClass = 'bg-[#0F1F38] border-slate-800 text-slate-400 opacity-70';
                  }
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={isAnswered}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full text-left px-4 py-3.5 min-h-[52px] rounded-xl border transition-all duration-150 flex items-start gap-3.5 cursor-pointer disabled:cursor-default ${btnClass}`}
                  >
                    <span className="font-mono-tabular w-7 h-7 rounded-md bg-slate-900/70 border border-slate-600/70 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="text-sm sm:text-base leading-relaxed flex-1">{option}</span>
                    {isAnswered && isRightOption && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    )}
                    {isAnswered && isSelected && !isRightOption && (
                      <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Instant Comprehension Feedback & Next CTA */}
          {isAnswered ? (
            <div
              className={`rounded-xl p-4 border space-y-3 ${
                isCorrect
                  ? 'bg-emerald-950/70 border-emerald-500/60'
                  : 'bg-rose-950/60 border-rose-500/60'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className={`text-sm font-bold ${isCorrect ? 'text-emerald-300' : 'text-rose-300'}`}>
                  {isCorrect ? 'Tepat sekali!' : 'Kurang tepat, mari pelajari:'}
                </span>
                <span className="text-xs text-slate-300 font-mono-tabular">
                  {currentIndex + 1 === questions.length ? 'Soal Terakhir' : 'Tekan Spasi untuk lanjut'}
                </span>
              </div>
              <p className="text-sm text-slate-100 leading-relaxed">{currentQuestion.explanation}</p>
              <button
                type="button"
                onClick={handleNext}
                className="w-full py-3 px-5 min-h-[48px] rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-colors cursor-pointer"
              >
                {currentIndex + 1 < questions.length ? 'Lanjut ke Bacaan Berikutnya' : 'Selesai & Terbitkan Stempel'}
              </button>
            </div>
          ) : (
            <div className="text-xs text-slate-400 flex items-center justify-between pt-2">
              <span>Tekan angka 1–4 pada papan ketik atau klik pilihan jawaban.</span>
              <span>Esc Jeda</span>
            </div>
          )}
        </section>
      </main>

      {/* Pause Modal */}
      {paused && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#122643] border border-slate-700 p-6 space-y-5 shadow-2xl">
            <h2 className="font-display text-2xl font-bold text-white">Permainan Dijeda</h2>
            <p className="text-sm text-slate-300">
              Anda sedang menjelajahi {region.name} ({currentIndex + 1}/{questions.length}).
            </p>
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => setPaused(false)}
                className="inline-flex items-center justify-center gap-2 w-full py-3 min-h-[48px] rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold cursor-pointer"
              >
                <Play className="w-4 h-4" />
                <span>Lanjutkan Membaca</span>
              </button>
              <button
                type="button"
                onClick={onExitToMap}
                className="inline-flex items-center justify-center gap-2 w-full py-3 min-h-[48px] rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali ke Buku Paspor</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
