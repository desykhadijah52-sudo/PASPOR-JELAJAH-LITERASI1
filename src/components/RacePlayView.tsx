import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Music,
  Pause,
  Play,
  Volume2,
  VolumeX,
  XCircle,
  Zap,
} from 'lucide-react';
import { getShuffledQuestions } from '../data/literacyData';
import {
  AspectStat,
  LiteracyAspect,
  RaceCompetitorConfig,
  RaceDifficulty,
  RaceModeType,
  ReadingQuestion,
  VictorySummary,
} from '../types/game';
import { sound } from '../utils/sound';
import { createEmptyAspectBreakdown } from '../utils/studentStore';
import { RaceCanvas, RacerRenderState } from './RaceCanvas';

const FINISH_DISTANCE = 1000;
const DUEL_TURN_LIMIT_SEC = 18;

interface RacerStats {
  config: RaceCompetitorConfig;
  distance: number;
  finishTimeSec: number | null;
  score: number;
  correctCount: number;
  totalAnswered: number;
  streak: number;
  responseTimes: number[];
  aspectBreakdown: Record<LiteracyAspect, AspectStat>;
}

interface RacePlayViewProps {
  raceModeType: RaceModeType;
  difficulty: RaceDifficulty;
  competitors: RaceCompetitorConfig[];
  muted: boolean;
  musicEnabled: boolean;
  onToggleMute: () => void;
  onToggleMusic: () => void;
  onExit: () => void;
  onFinishRace: (
    primarySummary: VictorySummary,
    extraHumanSummaries: VictorySummary[]
  ) => void;
}

export const RacePlayView: React.FC<RacePlayViewProps> = ({
  raceModeType,
  difficulty,
  competitors,
  muted,
  musicEnabled,
  onToggleMute,
  onToggleMusic,
  onExit,
  onFinishRace,
}) => {
  const [questionPool] = useState<ReadingQuestion[]>(() => getShuffledQuestions(24));
  const [qIndex, setQIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [elapsedSec, setElapsedSec] = useState(0);

  // Duel turn management
  const [activeTurnIdx, setActiveTurnIdx] = useState(0);
  const [duelReadyGate, setDuelReadyGate] = useState(raceModeType === 'duel-kelas');
  const [turnTimeLeft, setTurnTimeLeft] = useState(DUEL_TURN_LIMIT_SEC);

  // Answer feedback state
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [boostBanner, setBoostBanner] = useState<string | null>(null);

  // HUD mirror values
  const [hudStats, setHudStats] = useState<{
    playerDist: number;
    playerScore: number;
    playerStreak: number;
    leaderName: string;
  }>({
    playerDist: 0,
    playerScore: 0,
    playerStreak: 0,
    leaderName: competitors[0]?.name || '',
  });

  const statsRef = useRef<RacerStats[]>(
    competitors.map((c) => ({
      config: c,
      distance: 0,
      finishTimeSec: null,
      score: 0,
      correctCount: 0,
      totalAnswered: 0,
      streak: 0,
      responseTimes: [],
      aspectBreakdown: createEmptyAspectBreakdown(),
    }))
  );

  const canvasRacersRef = useRef<RacerRenderState[]>(
    competitors.map((c, idx) => ({
      id: c.id,
      name: c.name,
      distance: 0,
      colorHex: c.colorHex,
      vehicle: c.vehicle,
      isPlayerHighlight: idx === 0,
      boostUntilMs: 0,
    }))
  );

  const raceFinishedRef = useRef(false);
  const elapsedRef = useRef(0);
  const questionStartRef = useRef<number>(Date.now());
  const autoAdvanceTimerRef = useRef<number | null>(null);

  const currentQuestion = questionPool[qIndex % questionPool.length];
  const activeRacerStat = statsRef.current[activeTurnIdx];
  const isAnswered = selectedOption !== null;

  const finalizeRace = () => {
    if (raceFinishedRef.current) return;
    raceFinishedRef.current = true;
    if (autoAdvanceTimerRef.current) {
      window.clearTimeout(autoAdvanceTimerRef.current);
    }

    sound.playVictory();

    const sorted = [...statsRef.current].sort((a, b) => {
      if (a.finishTimeSec !== null && b.finishTimeSec !== null) {
        return a.finishTimeSec - b.finishTimeSec;
      }
      if (a.finishTimeSec !== null) return -1;
      if (b.finishTimeSec !== null) return 1;
      return b.distance - a.distance;
    });

    const standings = sorted.map((r, i) => ({
      id: r.config.id,
      name: r.config.name,
      className: r.config.className,
      isBot: r.config.isBot,
      distance: Math.round(r.distance),
      finishTimeSec: r.finishTimeSec !== null ? Number(r.finishTimeSec.toFixed(1)) : null,
      rank: i + 1,
      colorHex: r.config.colorHex,
      correctCount: r.correctCount,
      totalAnswered: r.totalAnswered,
      score: r.score,
    }));

    const humanRacers = sorted.filter((r) => !r.config.isBot);
    const buildSummary = (r: RacerStats): VictorySummary => {
      const rank = standings.findIndex((s) => s.id === r.config.id) + 1;
      const totalQ = Math.max(1, r.totalAnswered);
      const accuracy = r.totalAnswered > 0 ? Math.round((r.correctCount / totalQ) * 100) : 0;
      const avgTime =
        r.responseTimes.length > 0
          ? r.responseTimes.reduce((a, b) => a + b, 0) / r.responseTimes.length
          : 0;

      return {
        mode: 'balapan',
        studentName: r.config.name,
        className: r.config.className,
        destinationLabel:
          raceModeType === 'solo-bot'
            ? `Balap Solo (${difficulty === 'santai' ? 'Santai' : difficulty === 'cepat' ? 'Cepat' : 'Kilat'})`
            : 'Balap Kelompok Kelas',
        score: r.score,
        correctCount: r.correctCount,
        totalQuestions: r.totalAnswered,
        accuracy,
        avgResponseTimeSec: Number(avgTime.toFixed(1)),
        durationSec: Math.max(1, Math.round(elapsedRef.current)),
        raceStandings: standings,
        playerRank: rank,
        aspectBreakdown: r.aspectBreakdown,
      };
    };

    const primary = buildSummary(humanRacers[0] || sorted[0]);
    const extras = humanRacers.slice(1).map(buildSummary);
    onFinishRace(primary, extras);
  };

  // Bot continuous progression + global race clock (Solo vs Bot)
  useEffect(() => {
    const botBaseSpeed =
      difficulty === 'santai' ? 14 : difficulty === 'cepat' ? 21 : 29;

    let lastTick = performance.now();
    const interval = window.setInterval(() => {
      const now = performance.now();
      const dt = Math.min((now - lastTick) / 1000, 0.15);
      lastTick = now;

      if (paused || raceFinishedRef.current) return;
      if (raceModeType === 'duel-kelas' && duelReadyGate) return;

      elapsedRef.current += dt;
      setElapsedSec(Math.floor(elapsedRef.current));

      if (raceModeType === 'solo-bot') {
        statsRef.current.forEach((racer, idx) => {
          if (racer.config.isBot && racer.finishTimeSec === null) {
            const paceFactor = 0.88 + ((idx * 17 + Math.floor(elapsedRef.current)) % 5) * 0.06;
            racer.distance = Math.min(
              FINISH_DISTANCE,
              racer.distance + botBaseSpeed * paceFactor * dt
            );
            if (racer.distance >= FINISH_DISTANCE) {
              racer.finishTimeSec = elapsedRef.current;
            }
          } else if (!racer.config.isBot && racer.finishTimeSec === null) {
            // Steady baseline sail speed so player vessel glides forward while reading
            racer.distance = Math.min(FINISH_DISTANCE - 5, racer.distance + 4.5 * dt);
          }
        });

        // Sync canvas ref
        canvasRacersRef.current = statsRef.current.map((r, idx) => ({
          ...canvasRacersRef.current[idx],
          distance: r.distance,
          isPlayerHighlight: idx === 0,
        }));

        const sortedLeader = [...statsRef.current].sort((a, b) => b.distance - a.distance)[0];
        const player = statsRef.current[0];
        setHudStats({
          playerDist: Math.round(player.distance),
          playerScore: player.score,
          playerStreak: player.streak,
          leaderName: sortedLeader.config.name,
        });

        // End if player finishes or all bots finish
        const anyFinished = statsRef.current.some((r) => r.finishTimeSec !== null);
        const playerFinished = player.finishTimeSec !== null;
        if (playerFinished || (anyFinished && statsRef.current.filter((r) => r.finishTimeSec !== null).length >= 3)) {
          finalizeRace();
        }
      }
    }, 100);

    return () => window.clearInterval(interval);
  }, [difficulty, duelReadyGate, paused, raceModeType]);

  // Duel Turn Countdown Timer
  useEffect(() => {
    if (raceModeType !== 'duel-kelas' || duelReadyGate || paused || isAnswered) return;
    const timer = window.setInterval(() => {
      setTurnTimeLeft((prev) => {
        if (prev <= 1) {
          // Time out counts as missed turn
          handleDuelTimeout();
          return DUEL_TURN_LIMIT_SEC;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  });

  const advanceQuestionAndTurn = () => {
    if (raceFinishedRef.current) return;
    setSelectedOption(null);
    setBoostBanner(null);
    setQIndex((prev) => prev + 1);

    if (raceModeType === 'duel-kelas') {
      const nextTurn = (activeTurnIdx + 1) % statsRef.current.length;
      setActiveTurnIdx(nextTurn);
      setTurnTimeLeft(DUEL_TURN_LIMIT_SEC);
      setDuelReadyGate(true);

      canvasRacersRef.current = statsRef.current.map((r, idx) => ({
        ...canvasRacersRef.current[idx],
        distance: r.distance,
        isPlayerHighlight: idx === nextTurn,
      }));
    } else {
      questionStartRef.current = Date.now();
    }
  };

  const handleDuelTimeout = () => {
    if (isAnswered || raceFinishedRef.current) return;
    sound.playWrong();
    const active = statsRef.current[activeTurnIdx];
    active.totalAnswered += 1;
    active.streak = 0;
    active.responseTimes.push(DUEL_TURN_LIMIT_SEC);
    active.aspectBreakdown[currentQuestion.aspect].total += 1;

    setSelectedOption(-1);
    setBoostBanner('Waktu habis! Giliran berpindah.');
    autoAdvanceTimerRef.current = window.setTimeout(advanceQuestionAndTurn, 1300);
  };

  const handleSelectOption = (idx: number) => {
    if (isAnswered || paused || duelReadyGate || raceFinishedRef.current) return;

    const qTime = Math.max(0.5, (Date.now() - questionStartRef.current) / 1000);
    const active = statsRef.current[activeTurnIdx];
    active.totalAnswered += 1;
    active.responseTimes.push(qTime);
    active.aspectBreakdown[currentQuestion.aspect].total += 1;

    setSelectedOption(idx);
    const isRight = idx === currentQuestion.correctIndex;

    if (isRight) {
      active.correctCount += 1;
      active.streak += 1;
      active.aspectBreakdown[currentQuestion.aspect].correct += 1;

      const speedBonus = qTime <= 6 ? 65 : qTime <= 11 ? 35 : 10;
      const streakBonus = Math.min(active.streak - 1, 3) * 25;
      const boostDist = 145 + speedBonus + streakBonus;
      const points = 120 + speedBonus + streakBonus;

      active.score += points;
      active.distance = Math.min(FINISH_DISTANCE, active.distance + boostDist);

      if (active.distance >= FINISH_DISTANCE && active.finishTimeSec === null) {
        active.finishTimeSec = elapsedRef.current;
      }

      canvasRacersRef.current[activeTurnIdx] = {
        ...canvasRacersRef.current[activeTurnIdx],
        distance: active.distance,
        boostUntilMs: performance.now() + 950,
      };

      sound.playCorrect(active.streak);
      sound.playBoost();
      setBoostBanner(`TURBO +${boostDist}m! (${active.streak > 1 ? `Kombo x${active.streak}` : 'Tepat & Cepat'})`);

      const sortedLeader = [...statsRef.current].sort((a, b) => b.distance - a.distance)[0];
      setHudStats({
        playerDist: Math.round(active.distance),
        playerScore: active.score,
        playerStreak: active.streak,
        leaderName: sortedLeader.config.name,
      });

      if (active.finishTimeSec !== null) {
        autoAdvanceTimerRef.current = window.setTimeout(finalizeRace, 850);
      } else {
        autoAdvanceTimerRef.current = window.setTimeout(advanceQuestionAndTurn, 950);
      }
    } else {
      active.streak = 0;
      sound.playWrong();
      setBoostBanner('Kurang tepat! Cek penjelasan singkat di bawah.');
      autoAdvanceTimerRef.current = window.setTimeout(advanceQuestionAndTurn, 1900);
    }
  };

  const handleStartDuelTurn = () => {
    sound.playTurnStart();
    setDuelReadyGate(false);
    setTurnTimeLeft(DUEL_TURN_LIMIT_SEC);
    questionStartRef.current = Date.now();
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setPaused((p) => !p);
        return;
      }
      if (paused) return;

      if (duelReadyGate && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        handleStartDuelTurn();
        return;
      }

      if (!isAnswered && !duelReadyGate && ['1', '2', '3', '4'].includes(e.key)) {
        e.preventDefault();
        handleSelectOption(Number(e.key) - 1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  useEffect(() => {
    return () => {
      if (autoAdvanceTimerRef.current) {
        window.clearTimeout(autoAdvanceTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0B192C] text-slate-100 flex flex-col">
      {/* Compact Race HUD */}
      <header className="flex items-center justify-between gap-4 px-5 sm:px-8 py-3 border-b border-slate-800 bg-[#091424]">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setPaused(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 min-h-[44px] rounded-lg bg-[#122643] hover:bg-[#1B355B] border border-slate-700 text-sm font-medium text-slate-100 cursor-pointer"
          >
            <Pause className="w-4 h-4" />
            <span className="hidden sm:inline">Jeda</span>
          </button>
          <div>
            <p className="text-xs text-amber-300 font-medium">
              {raceModeType === 'solo-bot' ? 'Balap Solo vs Bot' : `Giliran: ${activeRacerStat.config.name}`}
            </p>
            <p className="text-sm font-semibold text-white">
              Pemimpin: {hudStats.leaderName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 sm:gap-6 font-mono-tabular text-sm">
          {raceModeType === 'duel-kelas' && !duelReadyGate && (
            <div className="text-right">
              <span className="block text-[11px] text-slate-400 font-sans">Sisa Waktu</span>
              <span className={`font-bold ${turnTimeLeft <= 5 ? 'text-rose-400' : 'text-amber-300'}`}>
                {turnTimeLeft} dtk
              </span>
            </div>
          )}
          <div className="text-right">
            <span className="block text-[11px] text-slate-400 font-sans">Jarak Aktif</span>
            <span className="font-bold text-emerald-400">
              {Math.round(activeRacerStat.distance)} / {FINISH_DISTANCE}m
            </span>
          </div>
          <div className="text-right hidden sm:block">
            <span className="block text-[11px] text-slate-400 font-sans">Skor</span>
            <span className="font-bold text-white">{activeRacerStat.score}</span>
          </div>
          <div className="text-right hidden md:block">
            <span className="block text-[11px] text-slate-400 font-sans">Durasi</span>
            <span className="font-bold text-slate-200">{elapsedSec} dtk</span>
          </div>
          <button
            type="button"
            onClick={onToggleMusic}
            aria-label={musicEnabled ? 'Matikan musik latar' : 'Nyalakan musik latar'}
            className="inline-flex items-center justify-center w-11 h-11 rounded-lg bg-[#122643] hover:bg-[#1B355B] border border-slate-700 text-slate-100 cursor-pointer"
          >
            <Music className={`w-5 h-5 ${musicEnabled && !muted ? 'text-amber-400' : 'text-slate-400'}`} />
          </button>
          <button
            type="button"
            onClick={onToggleMute}
            aria-label={muted ? 'Nyalakan suara' : 'Bisukan suara'}
            className="inline-flex items-center justify-center w-11 h-11 rounded-lg bg-[#122643] hover:bg-[#1B355B] border border-slate-700 text-slate-100 cursor-pointer"
          >
            {muted ? <VolumeX className="w-5 h-5 text-slate-400" /> : <Volume2 className="w-5 h-5 text-emerald-400" />}
          </button>
        </div>
      </header>

      {/* Main Race Viewport: Upper 60fps Track + Lower Reading Sprint */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-5 sm:px-8 py-4 flex flex-col gap-4">
        <RaceCanvas
          racersRef={canvasRacersRef}
          finishDistance={FINISH_DISTANCE}
          paused={paused}
        />

        {/* Lower Reading Sprint Arena */}
        {duelReadyGate ? (
          <section className="flex-1 rounded-2xl bg-[#10223C] border border-slate-700 p-8 flex flex-col items-center justify-center text-center space-y-4">
            <span
              className="w-12 h-2 rounded-full"
              style={{ backgroundColor: activeRacerStat.config.colorHex }}
            />
            <p className="text-xs font-semibold text-amber-300 uppercase tracking-wider">
              Giliran Pembalap Berikutnya
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
              {activeRacerStat.config.name}
            </h2>
            <p className="text-sm text-slate-300 max-w-md">
              Kelas {activeRacerStat.config.className} · Jarak saat ini {Math.round(activeRacerStat.distance)}m. Jawab dalam {DUEL_TURN_LIMIT_SEC} detik untuk dorongan turbo!
            </p>
            <button
              type="button"
              onClick={handleStartDuelTurn}
              className="inline-flex items-center gap-2 px-7 py-3.5 min-h-[48px] rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-base cursor-pointer"
            >
              <Play className="w-5 h-5" />
              <span>Mulai Giliran (Spasi)</span>
            </button>
          </section>
        ) : (
          <section className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            {/* Reading Passage */}
            <article className="lg:col-span-6 rounded-2xl bg-[#F8FAFC] text-slate-900 border border-slate-200 p-5 sm:p-6 flex flex-col justify-between shadow-lg">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-200">
                  <span className="font-semibold text-emerald-700">{currentQuestion.aspect}</span>
                  <span className="font-mono-tabular">Pos Baca #{qIndex + 1}</span>
                </div>
                <h1 className="font-display text-xl sm:text-2xl font-bold text-[#0F1F38]">
                  {currentQuestion.title}
                </h1>
                <p className="text-sm sm:text-base text-slate-800 leading-relaxed">
                  {currentQuestion.passage}
                </p>
              </div>

              {activeRacerStat.streak >= 2 && (
                <div className="pt-3 mt-3 border-t border-slate-200 flex items-center gap-2 text-xs font-bold text-amber-600">
                  <Zap className="w-4 h-4" />
                  <span>Kombo Turbo Aktif x{activeRacerStat.streak}</span>
                </div>
              )}
            </article>

            {/* Rapid Response Options */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-3">
              <div className="space-y-3">
                <h2 className="text-base sm:text-lg font-bold text-white leading-snug">
                  {currentQuestion.question}
                </h2>
                <div className="space-y-2.5">
                  {currentQuestion.options.map((opt, idx) => {
                    const isSelected = selectedOption === idx;
                    const isRight = idx === currentQuestion.correctIndex;
                    let cls =
                      'bg-[#122643] hover:bg-[#193357] border-slate-700 text-slate-100';
                    if (isAnswered) {
                      if (isRight) cls = 'bg-emerald-900/70 border-emerald-400 text-white';
                      else if (isSelected) cls = 'bg-rose-900/60 border-rose-400 text-rose-100';
                      else cls = 'bg-[#0F1F38] border-slate-800 text-slate-400 opacity-70';
                    }

                    return (
                      <button
                        key={idx}
                        type="button"
                        disabled={isAnswered}
                        onClick={() => handleSelectOption(idx)}
                        className={`w-full text-left px-4 py-3 min-h-[48px] rounded-xl border transition-all duration-150 flex items-start gap-3 cursor-pointer disabled:cursor-default ${cls}`}
                      >
                        <span className="font-mono-tabular w-6 h-6 rounded-md bg-slate-900/70 border border-slate-600/70 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="text-sm leading-snug flex-1">{opt}</span>
                        {isAnswered && isRight && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        )}
                        {isAnswered && isSelected && !isRight && (
                          <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {boostBanner && (
                <div
                  className={`rounded-xl px-4 py-3 border text-sm ${
                    selectedOption === currentQuestion.correctIndex
                      ? 'bg-emerald-950/80 border-emerald-400 text-emerald-200'
                      : 'bg-rose-950/70 border-rose-400 text-rose-100'
                  }`}
                >
                  <p className="font-bold">{boostBanner}</p>
                  {selectedOption !== currentQuestion.correctIndex && (
                    <p className="text-xs text-slate-200 mt-1">{currentQuestion.explanation}</p>
                  )}
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      {/* Pause Modal */}
      {paused && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#122643] border border-slate-700 p-6 space-y-5 shadow-2xl">
            <h2 className="font-display text-2xl font-bold text-white">Balapan Dijeda</h2>
            <p className="text-sm text-slate-300">
              Lintasan dihentikan sementara. Lanjutkan balapan atau keluar ke menu pengaturan.
            </p>
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => setPaused(false)}
                className="inline-flex items-center justify-center gap-2 w-full py-3 min-h-[48px] rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold cursor-pointer"
              >
                <Play className="w-4 h-4" />
                <span>Lanjutkan Balapan</span>
              </button>
              <button
                type="button"
                onClick={onExit}
                className="inline-flex items-center justify-center gap-2 w-full py-3 min-h-[48px] rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Keluar dari Balapan</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
