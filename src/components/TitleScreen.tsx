import React, { useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { Award, BookOpen, Cloud, Flag, LogIn, LogOut, Music, Plus, Trophy, Volume2, VolumeX } from 'lucide-react';
import { TITLE_BACKDROP_URL } from '../data/literacyData';
import { StudentProfile } from '../types/game';
import { CLASS_OPTIONS } from '../utils/studentStore';
import { SchoolLogo } from './PassportEmblems';

interface TitleScreenProps {
  studentName: string;
  studentClass: string;
  onChangeStudent: (name: string, className: string) => void;
  profiles: StudentProfile[];
  totalSessionsCount: number;
  cloudUser: User | null;
  isTeacher: boolean;
  authBusy: boolean;
  anonymousBlocked?: boolean;
  onSignIn: () => void;
  onSignOut: () => void;
  muted: boolean;
  musicEnabled: boolean;
  onToggleMute: () => void;
  onToggleMusic: () => void;
  onStartPassport: () => void;
  onStartRace: () => void;
  onOpenRekapan: () => void;
}

const CLASS_PRESETS = CLASS_OPTIONS;

export const TitleScreen: React.FC<TitleScreenProps> = ({
  studentName,
  studentClass,
  onChangeStudent,
  profiles,
  totalSessionsCount,
  cloudUser,
  isTeacher,
  authBusy,
  anonymousBlocked = false,
  onSignIn,
  onSignOut,
  muted,
  musicEnabled,
  onToggleMute,
  onToggleMusic,
  onStartPassport,
  onStartRace,
  onOpenRekapan,
}) => {
  const [imgFailed, setImgFailed] = useState(false);
  const [nameError, setNameError] = useState(false);

  const ensureValidAndRun = (action: () => void) => {
    if (!studentName.trim()) {
      setNameError(true);
      return;
    }
    setNameError(false);
    action();
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'SELECT')) {
        if (e.key === 'Enter' && studentName.trim()) {
          e.preventDefault();
          onStartPassport();
        }
        return;
      }
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        ensureValidAndRun(onStartPassport);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  });

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0B192C] text-slate-100 select-none">
      {/* Full-bleed key art backdrop */}
      {!imgFailed ? (
        <img
          src={TITLE_BACKDROP_URL}
          alt="Ilustrasi kepulauan perpustakaan Paspor Literasi"
          referrerPolicy="no-referrer"
          onError={() => setImgFailed(true)}
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 75% 45%, rgba(217,119,6,0.22), transparent 45%), linear-gradient(120deg, #0B192C 0%, #102A43 60%, #0F5132 100%)',
          }}
        />
      )}

      {/* Measured contrast scrim over the calm left negative space */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(90deg, rgba(11,25,44,0.96) 0%, rgba(11,25,44,0.88) 42%, rgba(11,25,44,0.35) 75%, rgba(11,25,44,0.18) 100%)',
        }}
      />

      {/* Top right sound & recap utility cluster */}
      <div className="relative z-20 flex items-center justify-end gap-2.5 px-6 pt-5">
        <button
          type="button"
          onClick={onOpenRekapan}
          className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-lg bg-[#122643]/90 hover:bg-[#1B355B] border border-slate-600/60 text-sm font-medium text-slate-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>Rekapan Siswa</span>
          <span className="font-mono-tabular text-xs text-slate-300">({totalSessionsCount})</span>
        </button>

        <button
          type="button"
          onClick={onToggleMusic}
          aria-label={musicEnabled ? 'Matikan musik latar' : 'Nyalakan musik latar'}
          className="inline-flex items-center gap-1.5 px-3.5 py-2.5 min-h-[44px] rounded-lg bg-[#122643]/90 hover:bg-[#1B355B] border border-slate-600/60 text-xs font-medium text-slate-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Music className={`w-4 h-4 ${musicEnabled && !muted ? 'text-amber-400' : 'text-slate-400'}`} />
          <span className="hidden sm:inline">{musicEnabled && !muted ? 'Musik Hidup' : 'Musik Mati'}</span>
        </button>

        <button
          type="button"
          onClick={onToggleMute}
          aria-label={muted ? 'Nyalakan suara' : 'Bisukan suara'}
          className="inline-flex items-center justify-center w-11 h-11 rounded-lg bg-[#122643]/90 hover:bg-[#1B355B] border border-slate-600/60 text-slate-100 transition-colors cursor-pointer"
        >
          {muted ? <VolumeX className="w-5 h-5 text-slate-400" /> : <Volume2 className="w-5 h-5 text-emerald-400" />}
        </button>
      </div>

      {/* Left calm space hero lockup & controls */}
      <main className="relative z-10 h-[calc(100vh-88px)] flex flex-col justify-between px-6 sm:px-12 lg:px-16 pb-7 max-w-2xl">
        <div className="my-auto space-y-6">
          {/* Bespoke SVG Title Lockup */}
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <SchoolLogo className="w-16 h-16 shrink-0" />
              <div>
                <p className="text-xs font-semibold tracking-wider text-amber-300 uppercase">
                  SMP Negeri 9 Penajam Paser Utara
                </p>
                <p className="text-[11px] font-medium tracking-wide text-slate-300 uppercase mt-0.5">
                  Ekspedisi Membaca Benuo Taka
                </p>
                <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-white leading-tight text-balance">
                  Paspor Literasi
                </h1>
              </div>
            </div>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-lg">
              Jelajahi enam destinasi literasi Benuo Taka dari Pesisir Nipah-Nipah hingga Sepaku, atau adu cepat memahami bacaan di lintasan balapan kelas.
            </p>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300 tabular-nums">
              <span>6 Destinasi Paspor</span>
              <span aria-hidden="true">·</span>
              <span>Mode Balapan 60fps</span>
              <span aria-hidden="true">·</span>
              <span>Rekapan &amp; Ekspor CSV</span>
            </div>
          </div>

          {/* Student Identity Form */}
          <div className="p-4 rounded-xl bg-[#0F223D]/95 border border-slate-700/70 space-y-3 max-w-lg">
            <div className="flex items-center justify-between gap-2">
              <label htmlFor="student-name-input" className="text-xs font-semibold text-slate-200">
                Identitas Penjelajah / Siswa
              </label>
              {profiles.length > 0 && (
                <span className="text-xs text-slate-400 tabular-nums">
                  {profiles.length} siswa tercatat
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <input
                id="student-name-input"
                type="text"
                value={studentName}
                onChange={(e) => {
                  setNameError(false);
                  onChangeStudent(e.target.value, studentClass);
                }}
                placeholder="Ketik nama siswa..."
                className={`sm:col-span-2 px-3.5 py-2.5 min-h-[44px] rounded-lg bg-[#081322] border text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 ${
                  nameError ? 'border-rose-400' : 'border-slate-600/80'
                }`}
              />
              <select
                aria-label="Pilih kelas siswa"
                value={studentClass}
                onChange={(e) => onChangeStudent(studentName, e.target.value)}
                className="px-3 py-2.5 min-h-[44px] rounded-lg bg-[#081322] border border-slate-600/80 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                {CLASS_PRESETS.map((cls) => (
                  <option key={cls} value={cls}>
                    Kelas {cls}
                  </option>
                ))}
              </select>
            </div>

            {nameError && (
              <p className="text-xs text-rose-300 font-medium">
                Masukkan nama siswa terlebih dahulu agar hasil permainan terekam di buku paspor &amp; rekapan.
              </p>
            )}

            {profiles.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-xs text-slate-400 mr-1">Pilih cepat:</span>
                {profiles.slice(0, 5).map((p) => {
                  const isSelected =
                    p.name.toLowerCase() === studentName.trim().toLowerCase() &&
                    p.className.toLowerCase() === studentClass.trim().toLowerCase();
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setNameError(false);
                        onChangeStudent(p.name, p.className);
                      }}
                      className={`px-2.5 py-1.5 text-xs rounded-md border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-600 border-emerald-500 text-white font-semibold'
                          : 'bg-[#122643] border-slate-600/70 text-slate-200 hover:bg-[#193357]'
                      }`}
                    >
                      {p.name} · {p.className}
                    </button>
                  );
                })}
                {studentName.trim() && (
                  <button
                    type="button"
                    onClick={() => onChangeStudent('', studentClass)}
                    className="inline-flex items-center gap-1 px-2 py-1.5 text-xs text-slate-300 hover:text-white cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Siswa Baru</span>
                  </button>
                )}
              </div>
            )}
            {/* Cloud Sync Status & Google Account Control */}
            <div className="pt-2.5 mt-1 border-t border-slate-700/70 flex flex-wrap items-center justify-between gap-2">
              {cloudUser && !cloudUser.isAnonymous ? (
                <>
                  <div className="flex items-center gap-2 text-xs text-emerald-300 min-w-0">
                    <Cloud className="w-4 h-4 shrink-0" />
                    <span className="truncate">
                      Cloud Aktif · {isTeacher ? 'Guru' : 'Siswa'} ({cloudUser.email})
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={onSignOut}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-300 hover:text-white rounded-md hover:bg-slate-800 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Keluar</span>
                  </button>
                </>
              ) : cloudUser && cloudUser.isAnonymous ? (
                <>
                  <div className="flex items-center gap-2 text-xs text-emerald-300 min-w-0">
                    <Cloud className="w-4 h-4 shrink-0" />
                    <span className="truncate">
                      Cloud Siswa Tanpa Akun Aktif · Nilai otomatis terkirim
                    </span>
                  </div>
                  <button
                    type="button"
                    disabled={authBusy}
                    onClick={onSignIn}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#163156] hover:bg-[#1E4070] border border-slate-600 text-xs font-semibold text-white transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <LogIn className="w-3.5 h-3.5 text-amber-300" />
                    <span>{authBusy ? 'Memproses...' : 'Masuk Guru'}</span>
                  </button>
                </>
              ) : (
                <>
                  <span className="text-xs text-slate-300">
                    {anonymousBlocked
                      ? 'Aktifkan Login Anonim di Firebase Console atau masuk Google'
                      : 'Masuk Google agar nilai otomatis masuk ke rekapan guru'}
                  </span>
                  <button
                    type="button"
                    disabled={authBusy}
                    onClick={onSignIn}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[36px] rounded-lg bg-[#163156] hover:bg-[#1E4070] border border-slate-600 text-xs font-semibold text-white transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <LogIn className="w-3.5 h-3.5 text-amber-300" />
                    <span>{authBusy ? 'Memproses...' : 'Masuk Google'}</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Primary & Secondary Mode CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              type="button"
              onClick={() => ensureValidAndRun(onStartPassport)}
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 min-h-[48px] rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-semibold text-sm sm:text-base shadow-lg shadow-emerald-950/50 transition-all whitespace-nowrap shrink-0 cursor-pointer"
            >
              <BookOpen className="w-5 h-5" />
              <span>Buka Paspor Literasi</span>
            </button>

            <button
              type="button"
              onClick={() => ensureValidAndRun(onStartRace)}
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 min-h-[48px] rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-[0.99] text-slate-950 font-semibold text-sm sm:text-base shadow-lg shadow-amber-950/40 transition-all whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Flag className="w-5 h-5" />
              <span>Mode Balapan</span>
            </button>
          </div>
        </div>

        {/* Single flat control-hint line */}
        <div className="flex items-center gap-3 text-xs text-slate-300/90 tabular-nums">
          <Award className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Klik atau Angka 1–4 Pilih Jawaban · Spasi Mulai / Lanjut · Esc Jeda</span>
        </div>
      </main>
    </div>
  );
};
