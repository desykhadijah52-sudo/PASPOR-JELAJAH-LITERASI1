import React, { useMemo, useState } from 'react';
import { User } from 'firebase/auth';
import {
  ArrowLeft,
  Award,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Cloud,
  Download,
  Flag,
  LogIn,
  Printer,
  Search,
  Trash2,
} from 'lucide-react';
import { SessionRecord, StudentProfile } from '../types/game';
import { ALL_ASPECTS, downloadRecapCSV } from '../utils/studentStore';
import { SchoolLogo } from './PassportEmblems';

interface RekapanViewProps {
  records: SessionRecord[];
  profiles: StudentProfile[];
  cloudUser: User | null;
  isTeacher: boolean;
  authBusy: boolean;
  onSignIn: () => void;
  onBack: () => void;
  onStartPassport: () => void;
  onStartRace: () => void;
  onDeleteRecord: (id: string) => void;
  onClearAll: () => void;
}

export const RekapanView: React.FC<RekapanViewProps> = ({
  records,
  profiles,
  cloudUser,
  isTeacher,
  authBusy,
  onSignIn,
  onBack,
  onStartPassport,
  onStartRace,
  onDeleteRecord,
  onClearAll,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [classFilter, setClassFilter] = useState('ALL');
  const [modeFilter, setModeFilter] = useState<'ALL' | 'paspor' | 'balapan'>('ALL');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const uniqueClasses = useMemo(() => {
    const set = new Set<string>();
    records.forEach((r) => set.add(r.className));
    return Array.from(set).sort();
  }, [records]);

  const filteredRecords = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return records.filter((r) => {
      if (classFilter !== 'ALL' && r.className !== classFilter) return false;
      if (modeFilter !== 'ALL' && r.mode !== modeFilter) return false;
      if (
        q &&
        !r.studentName.toLowerCase().includes(q) &&
        !r.destinationLabel.toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });
  }, [records, searchQuery, classFilter, modeFilter]);

  const kpi = useMemo(() => {
    const count = filteredRecords.length;
    if (count === 0) {
      return { avgScore: 0, avgAccuracy: 0, totalStamps: 0, activeStudents: profiles.length };
    }
    const avgScore = Math.round(
      filteredRecords.reduce((acc, r) => acc + r.score, 0) / count
    );
    const avgAccuracy = Math.round(
      filteredRecords.reduce((acc, r) => acc + r.accuracy, 0) / count
    );
    const uniqueStudents = new Set(
      filteredRecords.map((r) => `${r.studentName.toLowerCase()}::${r.className.toLowerCase()}`)
    ).size;
    const totalStamps = profiles.reduce((acc, p) => acc + p.stampsCollected.length, 0);
    return {
      avgScore,
      avgAccuracy,
      totalStamps,
      activeStudents: uniqueStudents,
    };
  }, [filteredRecords, profiles]);

  const aspectTotals = useMemo(() => {
    const totals: Record<string, { correct: number; total: number }> = {};
    ALL_ASPECTS.forEach((a) => {
      totals[a] = { correct: 0, total: 0 };
    });
    filteredRecords.forEach((r) => {
      ALL_ASPECTS.forEach((a) => {
        const entry = r.aspectBreakdown?.[a];
        if (entry) {
          totals[a].correct += entry.correct;
          totals[a].total += entry.total;
        }
      });
    });
    return totals;
  }, [filteredRecords]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col print-full">
      {/* Header */}
      <header className="no-print flex flex-wrap items-center justify-between gap-4 px-5 sm:px-8 py-4 bg-[#0B192C] text-white border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 px-3.5 py-2 min-h-[44px] rounded-lg bg-[#122643] hover:bg-[#1B355B] border border-slate-700 text-sm font-medium text-white cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Beranda</span>
          </button>
          <SchoolLogo className="w-10 h-10 shrink-0 hidden sm:block" />
          <div>
            <h1 className="font-display text-xl font-bold text-white">
              Rekapan Hasil Siswa · SMPN 9 PPU
            </h1>
            <p className="text-xs text-slate-300">
              {cloudUser && !cloudUser.isAnonymous
                ? isTeacher
                  ? `SMP Negeri 9 Penajam Paser Utara · Cloud Aktif (${cloudUser.email})`
                  : `SMP Negeri 9 Penajam Paser Utara · Riwayat Akun (${cloudUser.email})`
                : cloudUser && cloudUser.isAnonymous
                ? 'SMP Negeri 9 Penajam Paser Utara · Sesi Tamu Aktif (Guru silakan Masuk Google)'
                : 'SMP Negeri 9 Penajam Paser Utara · Mode Perangkat Lokal'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {(!cloudUser || cloudUser.isAnonymous) && (
            <button
              type="button"
              disabled={authBusy}
              onClick={onSignIn}
              className="inline-flex items-center gap-2 px-4 py-2 min-h-[44px] rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-bold cursor-pointer disabled:opacity-50"
            >
              <LogIn className="w-4 h-4" />
              <span>{authBusy ? 'Memproses...' : 'Masuk Google (Guru)'}</span>
            </button>
          )}
          {cloudUser && (
            <span className="inline-flex items-center gap-1.5 text-xs text-emerald-300 mr-1">
              <Cloud className="w-4 h-4" />
              <span>Tersinkron</span>
            </span>
          )}
          <button
            type="button"
            onClick={() => downloadRecapCSV(filteredRecords)}
            disabled={filteredRecords.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2 min-h-[44px] rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-sm font-semibold cursor-pointer disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            <span>Unduh CSV</span>
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            disabled={filteredRecords.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2 min-h-[44px] rounded-lg bg-[#122643] hover:bg-[#1B355B] disabled:opacity-40 border border-slate-700 text-white text-sm font-medium cursor-pointer disabled:cursor-not-allowed"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Cetak Laporan</span>
          </button>
        </div>
      </header>

      {/* Main Analytics Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-5 sm:px-8 py-6 space-y-6">
        {/* Print Header */}
        <div className="hidden print:flex items-center gap-4 pb-4 border-b border-slate-300">
          <SchoolLogo className="w-14 h-14 shrink-0" />
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
              SMP Negeri 9 Penajam Paser Utara
            </p>
            <h1 className="font-display text-2xl font-bold">Laporan Rekapan Paspor Literasi</h1>
            <p className="text-sm text-slate-600">
              Dicetak pada {new Date().toLocaleString('id-ID')} · Total {filteredRecords.length} sesi tercatat
            </p>
          </div>
        </div>

        {/* 4 KPI Summary Cards */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-mono-tabular">
          <div className="p-4 rounded-xl bg-white border border-slate-200">
            <p className="text-xs text-slate-500 font-sans">Total Sesi Bermain</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{filteredRecords.length}</p>
            <p className="text-xs text-slate-500 font-sans mt-1">
              {kpi.activeStudents} siswa aktif
            </p>
          </div>
          <div className="p-4 rounded-xl bg-white border border-slate-200">
            <p className="text-xs text-slate-500 font-sans">Rata-rata Skor</p>
            <p className="text-2xl font-bold text-emerald-700 mt-1">{kpi.avgScore}</p>
            <p className="text-xs text-slate-500 font-sans mt-1">Skor per sesi</p>
          </div>
          <div className="p-4 rounded-xl bg-white border border-slate-200">
            <p className="text-xs text-slate-500 font-sans">Rata-rata Akurasi</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{kpi.avgAccuracy}%</p>
            <p className="text-xs text-slate-500 font-sans mt-1">Ketuntasan minimal 75%</p>
          </div>
          <div className="p-4 rounded-xl bg-white border border-slate-200">
            <p className="text-xs text-slate-500 font-sans">Total Stempel Paspor</p>
            <p className="text-2xl font-bold text-amber-600 mt-1">{kpi.totalStamps}</p>
            <p className="text-xs text-slate-500 font-sans mt-1">Akumulasi visa kelas</p>
          </div>
        </section>

        {/* Class Mastery Across 5 Reading Aspects */}
        {filteredRecords.length > 0 && (
          <section className="p-5 rounded-xl bg-white border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-slate-900">
                Penguasaan 5 Aspek Literasi Membaca
              </h2>
              <span className="text-xs text-slate-500">Akumulasi data filter aktif</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {ALL_ASPECTS.map((aspect) => {
                const stat = aspectTotals[aspect];
                const pct = stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0;
                return (
                  <div key={aspect} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800">{aspect}</span>
                      <span className="font-mono-tabular text-slate-600">{pct}%</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          pct >= 75 ? 'bg-emerald-600' : pct >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-slate-500 font-mono-tabular">
                      {stat.correct}/{stat.total} soal tepat
                    </p>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Filters & Reset Toolbar */}
        <section className="no-print flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5 flex-1">
            <div className="relative min-w-[220px] flex-1 max-w-xs">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama siswa atau destinasi..."
                className="w-full pl-9 pr-3 py-2 min-h-[44px] rounded-lg bg-white border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <select
              aria-label="Filter kelas"
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="px-3 py-2 min-h-[44px] rounded-lg bg-white border border-slate-300 text-sm text-slate-800"
            >
              <option value="ALL">Semua Kelas</option>
              {uniqueClasses.map((cls) => (
                <option key={cls} value={cls}>
                  Kelas {cls}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-200/80">
              {(
                [
                  { id: 'ALL', label: 'Semua Mode' },
                  { id: 'paspor', label: 'Paspor' },
                  { id: 'balapan', label: 'Balapan' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setModeFilter(tab.id)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                    modeFilter === tab.id
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {!cloudUser && records.length > 0 && (
            <div className="flex items-center gap-2">
              {!confirmReset ? (
                <button
                  type="button"
                  onClick={() => setConfirmReset(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[44px] rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Reset Riwayat</span>
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onClearAll();
                      setConfirmReset(false);
                    }}
                    className="px-3 py-2 min-h-[40px] rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold cursor-pointer"
                  >
                    Ya, Hapus Semua
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmReset(false)}
                    className="px-3 py-2 min-h-[40px] rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold cursor-pointer"
                  >
                    Batal
                  </button>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Student Recap Table or Empty State */}
        {filteredRecords.length === 0 ? (
          <section className="rounded-2xl bg-white border border-slate-200 p-10 text-center space-y-4">
            <Award className="w-12 h-12 text-slate-400 mx-auto" />
            <div className="space-y-1">
              <h2 className="font-display text-xl font-bold text-slate-900">
                {records.length === 0 ? 'Belum Ada Rekapan Bermain' : 'Data Filter Tidak Ditemukan'}
              </h2>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                {records.length === 0
                  ? 'Setiap sesi Paspor Literasi atau Mode Balapan yang diselesaikan siswa akan tercatat otomatis di tabel ini.'
                  : 'Coba ubah kata kunci pencarian atau filter kelas di atas.'}
              </p>
            </div>
            {records.length === 0 && (
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={onStartPassport}
                  className="inline-flex items-center gap-2 px-5 py-2.5 min-h-[44px] rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold cursor-pointer"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Main Mode Paspor</span>
                </button>
                <button
                  type="button"
                  onClick={onStartRace}
                  className="inline-flex items-center gap-2 px-5 py-2.5 min-h-[44px] rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-bold cursor-pointer"
                >
                  <Flag className="w-4 h-4" />
                  <span>Main Mode Balapan</span>
                </button>
              </div>
            )}
          </section>
        ) : (
          <section className="rounded-xl bg-white border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600">
                    <th className="py-3.5 px-4">Siswa &amp; Kelas</th>
                    <th className="py-3.5 px-4">Mode &amp; Destinasi</th>
                    <th className="py-3.5 px-4 text-right">Skor</th>
                    <th className="py-3.5 px-4 text-right">Akurasi</th>
                    <th className="py-3.5 px-4 text-right">Kecepatan</th>
                    <th className="py-3.5 px-4">Capaian</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right no-print">Detail</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-sm">
                  {filteredRecords.map((rec) => {
                    const isExpanded = expandedId === rec.id;
                    const tuntas = rec.accuracy >= 75;
                    return (
                      <React.Fragment key={rec.id}>
                        <tr className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3.5 px-4">
                            <p className="font-semibold text-slate-900">{rec.studentName}</p>
                            <p className="text-xs text-slate-500">
                              Kelas {rec.className} ·{' '}
                              {new Date(rec.timestamp).toLocaleDateString('id-ID', {
                                day: '2-digit',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </td>
                          <td className="py-3.5 px-4">
                            <p className="font-medium text-slate-800">{rec.destinationLabel}</p>
                            <p className="text-xs text-slate-500">
                              {rec.mode === 'paspor' ? 'Paspor Literasi' : 'Mode Balapan'}
                            </p>
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono-tabular font-bold text-slate-900">
                            {rec.score}
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono-tabular">
                            <span className="font-semibold text-slate-900">{rec.accuracy}%</span>
                            <span className="block text-xs text-slate-500">
                              {rec.correctCount}/{rec.totalQuestions}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono-tabular text-slate-700">
                            {rec.avgResponseTimeSec.toFixed(1)} dtk
                          </td>
                          <td className="py-3.5 px-4 text-xs font-medium text-slate-700">
                            {rec.mode === 'balapan'
                              ? rec.raceRank
                                ? `Peringkat #${rec.raceRank}`
                                : 'Finis'
                              : rec.stampsEarned.length > 0
                              ? `Stempel: ${rec.stampsEarned.join(', ')}`
                              : 'Belum Stempel'}
                          </td>
                          <td className="py-3.5 px-4">
                            {tuntas ? (
                              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                                <CheckCircle2 className="w-4 h-4 shrink-0" />
                                <span>Tuntas</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700">
                                <BookOpen className="w-4 h-4 shrink-0" />
                                <span>Bimbingan</span>
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-right no-print">
                            <div className="inline-flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => setExpandedId(isExpanded ? null : rec.id)}
                                aria-label="Lihat detail aspek"
                                className="p-2 rounded-lg hover:bg-slate-200/70 text-slate-600 cursor-pointer"
                              >
                                {isExpanded ? (
                                  <ChevronUp className="w-4 h-4" />
                                ) : (
                                  <ChevronDown className="w-4 h-4" />
                                )}
                              </button>
                              <button
                                type="button"
                                onClick={() => onDeleteRecord(rec.id)}
                                aria-label="Hapus baris"
                                className="p-2 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr className="bg-slate-50/90">
                            <td colSpan={8} className="px-4 py-3.5">
                              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                                {ALL_ASPECTS.map((aspect) => {
                                  const stat = rec.aspectBreakdown?.[aspect];
                                  return (
                                    <div
                                      key={aspect}
                                      className="p-2.5 rounded-lg bg-white border border-slate-200"
                                    >
                                      <p className="text-[11px] font-semibold text-slate-500">
                                        {aspect}
                                      </p>
                                      <p className="font-mono-tabular text-sm font-bold text-slate-900 mt-0.5">
                                        {stat && stat.total > 0
                                          ? `${stat.correct}/${stat.total} (${Math.round(
                                              (stat.correct / stat.total) * 100
                                            )}%)`
                                          : '—'}
                                      </p>
                                    </div>
                                  );
                                })}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};
