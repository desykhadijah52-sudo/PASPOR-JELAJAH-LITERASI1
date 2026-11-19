import React from 'react';
import { Award, BookOpen, Flag, RotateCcw, Trophy } from 'lucide-react';
import { VictorySummary } from '../types/game';
import { ALL_ASPECTS } from '../utils/studentStore';
import { VisaStampSVG } from './PassportEmblems';

interface VictoryModalProps {
  summary: VictorySummary;
  onPlayAgain: () => void;
  onGoPassport: () => void;
  onOpenRekapan: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  summary,
  onPlayAgain,
  onGoPassport,
  onOpenRekapan,
}) => {
  const isPassport = summary.mode === 'paspor';
  const passed = summary.accuracy >= 75;

  return (
    <div className="min-h-screen bg-[#0B192C] text-slate-100 flex items-center justify-center p-5 sm:p-8">
      <div className="w-full max-w-4xl rounded-2xl bg-[#10223C] border border-slate-700/80 shadow-2xl overflow-hidden">
        {/* Top Banner */}
        <div className="px-6 sm:px-8 py-6 bg-[#091424] border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-amber-300 uppercase tracking-wider">
              {isPassport ? 'Hasil Misi Paspor' : 'Garis Finis Balapan Literasi'}
            </p>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-white">
              {isPassport
                ? passed
                  ? `Selamat, ${summary.studentName}! Stempel Sah Diterbitkan`
                  : `Bagus, ${summary.studentName}! Terus Berlatih`
                : summary.playerRank === 1
                ? `Juara 1! ${summary.studentName} Memimpin Lintasan`
                : `Balapan Selesai — Peringkat #${summary.playerRank}`}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              {summary.studentName} · Kelas {summary.className} · {summary.destinationLabel}
            </p>
          </div>

          <div className="text-right font-mono-tabular">
            <span className="block text-xs text-slate-400 font-sans">Skor Akhir</span>
            <span className="text-3xl font-bold text-emerald-400">{summary.score}</span>
          </div>
        </div>

        {/* Body Grid */}
        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Left: Stamp or Podium */}
          <div className="md:col-span-5 rounded-xl bg-[#F8FAFC] text-slate-900 p-5 border border-slate-200 flex flex-col items-center justify-center text-center space-y-3">
            {isPassport ? (
              <>
                {summary.newStamp ? (
                  <>
                    <VisaStampSVG
                      region={summary.newStamp}
                      earned={true}
                      dateLabel={new Date().toLocaleDateString('id-ID')}
                      animate={true}
                    />
                    <h2 className="font-display text-lg font-bold text-slate-900">
                      Stempel {summary.newStamp.name}
                    </h2>
                    <p className="text-xs text-slate-600">
                      Akurasi {summary.accuracy}% memenuhi syarat pengesahan visa literasi.
                    </p>
                  </>
                ) : (
                  <div className="py-6 space-y-2">
                    <Award className="w-12 h-12 text-amber-600 mx-auto" />
                    <h2 className="font-display text-lg font-bold text-slate-900">
                      Stempel Belum Terbit
                    </h2>
                    <p className="text-xs text-slate-600">
                      Raih minimal akurasi 75% (3/4 jawaban benar) untuk mengesahkan stempel destinasi ini.
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="w-full text-left space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h2 className="font-display text-lg font-bold text-slate-900">Klasemen Finis</h2>
                  <Flag className="w-4 h-4 text-amber-600" />
                </div>
                <div className="space-y-2">
                  {summary.raceStandings?.map((racer) => (
                    <div
                      key={racer.id}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg border text-xs ${
                        racer.rank === 1
                          ? 'bg-amber-50 border-amber-300 text-slate-900 font-semibold'
                          : 'bg-white border-slate-200 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-mono-tabular font-bold w-5">#{racer.rank}</span>
                        <span
                          className="w-2.5 h-2.5 rounded-sm shrink-0"
                          style={{ backgroundColor: racer.colorHex }}
                        />
                        <span className="truncate">{racer.name}</span>
                      </div>
                      <span className="font-mono-tabular shrink-0 ml-2">
                        {racer.finishTimeSec !== null ? `${racer.finishTimeSec} dtk` : `${racer.distance}m`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Metrics & Literacy Aspect Breakdown */}
          <div className="md:col-span-7 space-y-5">
            <div className="grid grid-cols-3 gap-3 font-mono-tabular">
              <div className="p-3.5 rounded-xl bg-[#0B192C] border border-slate-700/80">
                <span className="block text-xs text-slate-400 font-sans">Akurasi</span>
                <span className="text-xl font-bold text-white">{summary.accuracy}%</span>
                <span className="block text-[11px] text-slate-400">
                  {summary.correctCount}/{summary.totalQuestions} benar
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#0B192C] border border-slate-700/80">
                <span className="block text-xs text-slate-400 font-sans">Kecepatan</span>
                <span className="text-xl font-bold text-amber-300">{summary.avgResponseTimeSec}s</span>
                <span className="block text-[11px] text-slate-400">rata-rata/soal</span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#0B192C] border border-slate-700/80">
                <span className="block text-xs text-slate-400 font-sans">Durasi</span>
                <span className="text-xl font-bold text-slate-200">{summary.durationSec}s</span>
                <span className="block text-[11px] text-slate-400">total sesi</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0B192C] border border-slate-700/80 space-y-3">
              <h3 className="text-sm font-bold text-white">Capaian Aspek Literasi</h3>
              <div className="space-y-2.5">
                {ALL_ASPECTS.map((aspect) => {
                  const stat = summary.aspectBreakdown[aspect];
                  if (!stat || stat.total === 0) return null;
                  const pct = Math.round((stat.correct / stat.total) * 100);
                  return (
                    <div key={aspect} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-200 font-medium">{aspect}</span>
                        <span className="font-mono-tabular text-slate-300">
                          {stat.correct}/{stat.total} ({pct}%)
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-emerald-500 transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={onPlayAgain}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 min-h-[48px] rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Main Lagi</span>
              </button>
              <button
                type="button"
                onClick={onGoPassport}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 min-h-[48px] rounded-xl bg-[#163156] hover:bg-[#1E4070] border border-slate-600 text-white font-medium text-sm cursor-pointer"
              >
                <BookOpen className="w-4 h-4" />
                <span>Buku Paspor</span>
              </button>
              <button
                type="button"
                onClick={onOpenRekapan}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 min-h-[48px] rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm cursor-pointer"
              >
                <Trophy className="w-4 h-4" />
                <span>Lihat Rekapan Siswa</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
