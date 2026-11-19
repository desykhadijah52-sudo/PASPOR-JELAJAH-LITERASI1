export type LiteracyAspect =
  | 'Ide Pokok'
  | 'Kosakata'
  | 'Inferensi'
  | 'Fakta & Opini'
  | 'Pesan & Makna';

export type RegionId =
  | 'bahari'
  | 'aksara'
  | 'sains'
  | 'warta'
  | 'pustaka'
  | 'syair';

export interface RegionInfo {
  id: RegionId;
  name: string;
  subtitle: string;
  genre: string;
  stampCode: string;
  stampTitle: string;
  accentHex: string;
  imageUrl?: string;
  description: string;
}

export interface ReadingQuestion {
  id: string;
  regionId: RegionId;
  aspect: LiteracyAspect;
  title: string;
  passage: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  explanation: string;
}

export type ScreenState =
  | 'TITLE_MENU'
  | 'PASPOR_MAP'
  | 'PASPOR_PLAY'
  | 'RACE_SETUP'
  | 'RACE_PLAY'
  | 'VICTORY'
  | 'REKAPAN';

export type RaceModeType = 'solo-bot' | 'duel-kelas';
export type RaceDifficulty = 'santai' | 'cepat' | 'kilat';

export interface RaceCompetitorConfig {
  id: string;
  name: string;
  className: string;
  isBot: boolean;
  vehicle: 'kapal' | 'balon' | 'kereta' | 'layar';
  colorHex: string;
}

export interface AspectStat {
  correct: number;
  total: number;
}

export interface SessionRecord {
  id: string;
  studentName: string;
  className: string;
  mode: 'paspor' | 'balapan';
  destinationLabel: string;
  score: number;
  correctCount: number;
  totalQuestions: number;
  accuracy: number;
  avgResponseTimeSec: number;
  durationSec: number;
  raceRank?: number;
  raceModeType?: RaceModeType;
  stampsEarned: string[];
  aspectBreakdown: Record<LiteracyAspect, AspectStat>;
  timestamp: string;
}

export interface StudentProfile {
  id: string;
  name: string;
  className: string;
  stampsCollected: RegionId[];
  lastPlayedAt: string;
}

export interface VictorySummary {
  mode: 'paspor' | 'balapan';
  studentName: string;
  className: string;
  destinationLabel: string;
  score: number;
  correctCount: number;
  totalQuestions: number;
  accuracy: number;
  avgResponseTimeSec: number;
  durationSec: number;
  newStamp?: RegionInfo;
  raceStandings?: {
    id: string;
    name: string;
    className: string;
    isBot: boolean;
    distance: number;
    finishTimeSec: number | null;
    rank: number;
    colorHex: string;
    correctCount: number;
    totalAnswered: number;
    score: number;
  }[];
  playerRank?: number;
  aspectBreakdown: Record<LiteracyAspect, AspectStat>;
}
