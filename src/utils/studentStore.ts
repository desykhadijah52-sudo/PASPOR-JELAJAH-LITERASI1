import { LiteracyAspect, RegionId, SessionRecord, StudentProfile } from '../types/game';

const PROFILES_KEY = 'paspor_literasi_profiles_v1';
const RECORDS_KEY = 'paspor_literasi_records_v1';
const ACTIVE_STUDENT_KEY = 'paspor_literasi_active_student_v1';

export const ALL_ASPECTS: LiteracyAspect[] = [
  'Ide Pokok',
  'Kosakata',
  'Inferensi',
  'Fakta & Opini',
  'Pesan & Makna',
];

export const CLASS_OPTIONS: string[] = [
  'VII A',
  'VII B',
  'VII C',
  'VIII A',
  'VIII B',
  'VIII C',
  'IX A',
  'IX B',
  'IX C',
  'Umum',
];

function normalizeClassLabel(raw?: string): string {
  if (!raw || typeof raw !== 'string') return 'VII A';
  const cleaned = raw.trim().replace(/-/g, ' ');
  return cleaned || 'VII A';
}

export function createEmptyAspectBreakdown(): Record<LiteracyAspect, { correct: number; total: number }> {
  return {
    'Ide Pokok': { correct: 0, total: 0 },
    Kosakata: { correct: 0, total: 0 },
    Inferensi: { correct: 0, total: 0 },
    'Fakta & Opini': { correct: 0, total: 0 },
    'Pesan & Makna': { correct: 0, total: 0 },
  };
}

export function loadProfiles(): StudentProfile[] {
  try {
    const raw = window.localStorage.getItem(PROFILES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveProfiles(profiles: StudentProfile[]): void {
  try {
    window.localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
  } catch {
    // ignore quota issues
  }
}

export function loadActiveStudentSelection(): { name: string; className: string } {
  try {
    const raw = window.localStorage.getItem(ACTIVE_STUDENT_KEY);
    if (!raw) return { name: '', className: 'VII A' };
    const parsed = JSON.parse(raw);
    return {
      name: typeof parsed?.name === 'string' ? parsed.name : '',
      className: normalizeClassLabel(parsed?.className),
    };
  } catch {
    return { name: '', className: 'VII A' };
  }
}

export function saveActiveStudentSelection(name: string, className: string): void {
  try {
    window.localStorage.setItem(ACTIVE_STUDENT_KEY, JSON.stringify({ name, className }));
  } catch {
    // ignore
  }
}

export function upsertStudentProfile(
  name: string,
  className: string,
  newStamps: RegionId[] = []
): StudentProfile[] {
  const cleanName = name.trim();
  const cleanClass = className.trim() || 'Umum';
  if (!cleanName) return loadProfiles();

  const profiles = loadProfiles();
  const existingIdx = profiles.findIndex(
    (p) =>
      p.name.toLowerCase() === cleanName.toLowerCase() &&
      p.className.toLowerCase() === cleanClass.toLowerCase()
  );

  const now = new Date().toISOString();
  if (existingIdx >= 0) {
    const existing = profiles[existingIdx];
    const mergedStamps = Array.from(new Set([...existing.stampsCollected, ...newStamps]));
    profiles[existingIdx] = {
      ...existing,
      name: cleanName,
      className: cleanClass,
      stampsCollected: mergedStamps,
      lastPlayedAt: now,
    };
  } else {
    profiles.unshift({
      id: `stu_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      name: cleanName,
      className: cleanClass,
      stampsCollected: [...newStamps],
      lastPlayedAt: now,
    });
  }

  saveProfiles(profiles);
  return profiles;
}

export function getStudentStamps(name: string, className: string): RegionId[] {
  const cleanName = name.trim().toLowerCase();
  const cleanClass = (className.trim() || 'Umum').toLowerCase();
  if (!cleanName) return [];
  const found = loadProfiles().find(
    (p) => p.name.toLowerCase() === cleanName && p.className.toLowerCase() === cleanClass
  );
  return found ? found.stampsCollected : [];
}

export function loadSessionRecords(): SessionRecord[] {
  try {
    const raw = window.localStorage.getItem(RECORDS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function appendSessionRecord(record: SessionRecord): SessionRecord[] {
  const current = loadSessionRecords();
  const next = [record, ...current];
  try {
    window.localStorage.setItem(RECORDS_KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
  return next;
}

export function clearAllRecords(): void {
  try {
    window.localStorage.removeItem(RECORDS_KEY);
    window.localStorage.removeItem(PROFILES_KEY);
  } catch {
    // ignore
  }
}

export function deleteSingleRecord(id: string): SessionRecord[] {
  const next = loadSessionRecords().filter((r) => r.id !== id);
  try {
    window.localStorage.setItem(RECORDS_KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
  return next;
}

export function downloadRecapCSV(records: SessionRecord[]): void {
  const headers = [
    'Tanggal',
    'Nama Siswa',
    'Kelas',
    'Mode',
    'Destinasi / Lintasan',
    'Skor',
    'Benar',
    'Total Soal',
    'Akurasi (%)',
    'Rata-rata Waktu (dtk)',
    'Durasi Total (dtk)',
    'Peringkat Balap',
    'Stempel Diperoleh',
    'Status Ketuntasan',
  ];

  const escapeCsv = (val: string | number) => {
    const str = String(val ?? '');
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const rows = records.map((r) => {
    const dateStr = new Date(r.timestamp).toLocaleString('id-ID');
    const modeStr = r.mode === 'paspor' ? 'Paspor' : 'Balapan';
    const rankStr = r.raceRank ? `Juara ${r.raceRank}` : '-';
    const stampsStr = r.stampsEarned.length > 0 ? r.stampsEarned.join('; ') : '-';
    const statusStr = r.accuracy >= 75 ? 'Tuntas' : 'Perlu Bimbingan';
    return [
      dateStr,
      r.studentName,
      r.className,
      modeStr,
      r.destinationLabel,
      r.score,
      r.correctCount,
      r.totalQuestions,
      r.accuracy,
      r.avgResponseTimeSec.toFixed(1),
      r.durationSec,
      rankStr,
      stampsStr,
      statusStr,
    ]
      .map(escapeCsv)
      .join(',');
  });

  const csvContent = '\uFEFF' + [headers.map(escapeCsv).join(','), ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `rekapan-paspor-literasi-${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
