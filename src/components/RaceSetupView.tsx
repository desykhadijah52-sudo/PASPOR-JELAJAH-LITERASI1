import React, { useState } from 'react';
import { ArrowLeft, Bot, Flag, Play, Users } from 'lucide-react';
import { RaceCompetitorConfig, RaceDifficulty, RaceModeType } from '../types/game';
import { CLASS_OPTIONS } from '../utils/studentStore';

interface RaceSetupViewProps {
  studentName: string;
  studentClass: string;
  onBack: () => void;
  onStartRace: (config: {
    raceModeType: RaceModeType;
    difficulty: RaceDifficulty;
    competitors: RaceCompetitorConfig[];
  }) => void;
}

const RACER_COLORS = ['#10B981', '#F59E0B', '#38BDF8', '#F43F5E'];
const VEHICLES: ('kapal' | 'balon' | 'kereta' | 'layar')[] = ['kapal', 'balon', 'kereta', 'layar'];

export const RaceSetupView: React.FC<RaceSetupViewProps> = ({
  studentName,
  studentClass,
  onBack,
  onStartRace,
}) => {
  const [raceModeType, setRaceModeType] = useState<RaceModeType>('solo-bot');
  const [difficulty, setDifficulty] = useState<RaceDifficulty>('cepat');
  const [playerCount, setPlayerCount] = useState<number>(2);
  const [groupPlayers, setGroupPlayers] = useState<{ name: string; className: string }[]>([
    { name: studentName || 'Siswa 1', className: studentClass || 'VII A' },
    { name: 'Siswa 2', className: studentClass || 'VII A' },
    { name: 'Siswa 3', className: studentClass || 'VII A' },
    { name: 'Siswa 4', className: studentClass || 'VII A' },
  ]);

  const handleStart = () => {
    if (raceModeType === 'solo-bot') {
      const competitors: RaceCompetitorConfig[] = [
        {
          id: 'player-1',
          name: studentName,
          className: studentClass,
          isBot: false,
          vehicle: 'kapal',
          colorHex: RACER_COLORS[0],
        },
        {
          id: 'bot-1',
          name: 'Kancil Kilat',
          className: 'Bot',
          isBot: true,
          vehicle: 'balon',
          colorHex: RACER_COLORS[1],
        },
        {
          id: 'bot-2',
          name: 'Elang Pustaka',
          className: 'Bot',
          isBot: true,
          vehicle: 'kereta',
          colorHex: RACER_COLORS[2],
        },
        {
          id: 'bot-3',
          name: 'Burung Hantu',
          className: 'Bot',
          isBot: true,
          vehicle: 'layar',
          colorHex: RACER_COLORS[3],
        },
      ];
      onStartRace({ raceModeType, difficulty, competitors });
      return;
    }

    const activePlayers = groupPlayers.slice(0, playerCount).map((p, i) => ({
      id: `duel-${i + 1}`,
      name: p.name.trim() || `Pemain ${i + 1}`,
      className: p.className.trim() || studentClass,
      isBot: false,
      vehicle: VEHICLES[i % VEHICLES.length],
      colorHex: RACER_COLORS[i % RACER_COLORS.length],
    }));

    onStartRace({ raceModeType, difficulty, competitors: activePlayers });
  };

  return (
    <div className="min-h-screen bg-[#0B192C] text-slate-100 flex flex-col">
      <header className="flex items-center justify-between gap-4 px-5 sm:px-8 py-4 border-b border-slate-800 bg-[#091424]">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-2 min-h-[44px] rounded-lg bg-[#122643] hover:bg-[#1B355B] border border-slate-700 text-sm font-medium text-slate-100 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>
        <span className="font-display text-lg font-bold text-white">Arena Mode Balapan</span>
        <div className="w-20" />
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto px-5 sm:px-8 py-8 flex flex-col justify-center space-y-6">
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-amber-300 uppercase tracking-wider">
            Lintasan Teluk Penajam · 1.000 Meter
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white">
            Pilih Format Balapan Literasi
          </h1>
          <p className="text-sm text-slate-300">
            Jawab soal bacaan daerah Penajam dengan cepat dan tepat untuk memicu dorongan turbo menuju garis finis.
          </p>
        </div>

        {/* Race Format Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setRaceModeType('solo-bot')}
            className={`text-left p-5 rounded-2xl border transition-all cursor-pointer space-y-2.5 ${
              raceModeType === 'solo-bot'
                ? 'bg-[#152E52] border-amber-400 shadow-lg'
                : 'bg-[#10223C] border-slate-700 hover:border-slate-500'
            }`}
          >
            <div className="flex items-center justify-between">
              <Bot className="w-6 h-6 text-amber-400" />
              <span className="text-xs font-semibold text-slate-300">Real-Time 60fps</span>
            </div>
            <h2 className="font-display text-xl font-bold text-white">Balap Solo vs Bot</h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {studentName} bertanding langsung melawan 3 pembalap AI secara serentak di lintasan Teluk Balikpapan.
            </p>
          </button>

          <button
            type="button"
            onClick={() => setRaceModeType('duel-kelas')}
            className={`text-left p-5 rounded-2xl border transition-all cursor-pointer space-y-2.5 ${
              raceModeType === 'duel-kelas'
                ? 'bg-[#152E52] border-amber-400 shadow-lg'
                : 'bg-[#10223C] border-slate-700 hover:border-slate-500'
            }`}
          >
            <div className="flex items-center justify-between">
              <Users className="w-6 h-6 text-emerald-400" />
              <span className="text-xs font-semibold text-slate-300">2–4 Siswa / Kelompok</span>
            </div>
            <h2 className="font-display text-xl font-bold text-white">Balap Kelompok Kelas</h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Cocok untuk proyektor kelas! 2 hingga 4 siswa bergantian cepat; seluruh nilai langsung masuk rekapan.
            </p>
          </button>
        </div>

        {/* Conditional Config Panel */}
        {raceModeType === 'solo-bot' ? (
          <div className="p-5 rounded-2xl bg-[#10223C] border border-slate-700/80 space-y-3">
            <h3 className="text-sm font-bold text-white">Kecepatan Lawan Bot</h3>
            <div className="grid grid-cols-3 gap-3">
              {(
                [
                  { id: 'santai', label: 'Santai', desc: 'Cocok pemula' },
                  { id: 'cepat', label: 'Cepat', desc: 'Tantangan standar' },
                  { id: 'kilat', label: 'Kilat', desc: 'Juara membaca' },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setDifficulty(opt.id)}
                  className={`p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                    difficulty === opt.id
                      ? 'bg-emerald-700/40 border-emerald-400 text-white'
                      : 'bg-[#0B192C] border-slate-700 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  <span className="block text-sm font-bold">{opt.label}</span>
                  <span className="block text-xs text-slate-300 mt-0.5">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-5 rounded-2xl bg-[#10223C] border border-slate-700/80 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-sm font-bold text-white">Daftar Pembalap / Kelompok</h3>
              <div className="flex items-center gap-1.5 bg-[#0B192C] p-1 rounded-lg border border-slate-700">
                {[2, 3, 4].map((cnt) => (
                  <button
                    key={cnt}
                    type="button"
                    onClick={() => setPlayerCount(cnt)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                      playerCount === cnt
                        ? 'bg-amber-500 text-slate-950'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {cnt} Pemain
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {groupPlayers.slice(0, playerCount).map((player, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-[#0B192C] border border-slate-700 flex items-center gap-2.5"
                >
                  <span
                    className="w-3 h-8 rounded-sm shrink-0"
                    style={{ backgroundColor: RACER_COLORS[idx] }}
                  />
                  <input
                    type="text"
                    value={player.name}
                    onChange={(e) => {
                      const next = [...groupPlayers];
                      next[idx] = { ...next[idx], name: e.target.value };
                      setGroupPlayers(next);
                    }}
                    placeholder={`Nama Siswa ${idx + 1}`}
                    className="flex-1 min-w-0 px-2.5 py-2 rounded-lg bg-[#122643] border border-slate-600 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                  <select
                    aria-label={`Pilih kelas siswa ${idx + 1}`}
                    value={player.className}
                    onChange={(e) => {
                      const next = [...groupPlayers];
                      next[idx] = { ...next[idx], className: e.target.value };
                      setGroupPlayers(next);
                    }}
                    className="w-24 px-2 py-2 rounded-lg bg-[#122643] border border-slate-600 text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                  >
                    {CLASS_OPTIONS.map((cls) => (
                      <option key={cls} value={cls}>
                        {cls}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={handleStart}
            className="inline-flex items-center justify-center gap-2.5 px-7 py-4 min-h-[52px] rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-base shadow-lg transition-all cursor-pointer"
          >
            <Flag className="w-5 h-5" />
            <span>Mulai Balapan Sekarang</span>
            <Play className="w-4 h-4" />
          </button>
        </div>
      </main>
    </div>
  );
};
