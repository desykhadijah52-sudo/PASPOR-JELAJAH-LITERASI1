import { User } from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db, handleFirestoreError, isTeacherUser, OperationType } from '../firebase';
import { RegionId, SessionRecord, StudentProfile } from '../types/game';
import { ALL_ASPECTS } from './studentStore';

function sanitizeIdPart(raw: string): string {
  const cleaned = raw.replace(/[^a-zA-Z0-9_-]/g, '_').replace(/^_+|_+$/g, '');
  return cleaned || 'item';
}

function clampStr(val: string, max: number, fallback = 'Umum'): string {
  const trimmed = (val || '').trim();
  if (!trimmed) return fallback;
  return trimmed.slice(0, max);
}

function clampNum(val: number, min: number, max: number): number {
  if (!Number.isFinite(val)) return min;
  return Math.min(max, Math.max(min, val));
}

export function subscribeCloudSessions(
  user: User,
  onData: (records: SessionRecord[]) => void,
  onError?: (err: Error) => void
): () => void {
  const path = 'sessions';
  const baseRef = collection(db, path);
  const q = isTeacherUser(user)
    ? query(baseRef, orderBy('createdAt', 'desc'))
    : query(baseRef, where('ownerUid', '==', user.uid), orderBy('createdAt', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const list: SessionRecord[] = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          studentName: String(data.studentName || ''),
          className: String(data.className || ''),
          mode: data.mode === 'balapan' ? 'balapan' : 'paspor',
          destinationLabel: String(data.destinationLabel || ''),
          score: Number(data.score || 0),
          correctCount: Number(data.correctCount || 0),
          totalQuestions: Number(data.totalQuestions || 0),
          accuracy: Number(data.accuracy || 0),
          avgResponseTimeSec: Number(data.avgResponseTimeSec || 0),
          durationSec: Number(data.durationSec || 0),
          raceRank: typeof data.raceRank === 'number' ? data.raceRank : undefined,
          raceModeType:
            data.raceModeType === 'solo-bot' || data.raceModeType === 'duel-kelas'
              ? data.raceModeType
              : undefined,
          stampsEarned: Array.isArray(data.stampsEarned) ? data.stampsEarned.map(String) : [],
          aspectBreakdown: data.aspectBreakdown || {},
          timestamp: String(data.timestamp || new Date().toISOString()),
        };
      });
      onData(list);
    },
    (error) => {
      if (onError) {
        onError(error instanceof Error ? error : new Error(String(error)));
      }
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

export function subscribeCloudProfiles(
  user: User,
  onData: (profiles: StudentProfile[]) => void,
  onError?: (err: Error) => void
): () => void {
  const path = 'studentProfiles';
  const baseRef = collection(db, path);
  const q = isTeacherUser(user)
    ? query(baseRef)
    : query(baseRef, where('ownerUid', '==', user.uid));

  return onSnapshot(
    q,
    (snapshot) => {
      const list: StudentProfile[] = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          name: String(data.name || ''),
          className: String(data.className || ''),
          stampsCollected: Array.isArray(data.stampsCollected)
            ? (data.stampsCollected.map(String) as RegionId[])
            : [],
          lastPlayedAt: String(data.lastPlayedAt || ''),
        };
      });
      list.sort((a, b) => b.lastPlayedAt.localeCompare(a.lastPlayedAt));
      onData(list);
    },
    (error) => {
      if (onError) {
        onError(error instanceof Error ? error : new Error(String(error)));
      }
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

export async function saveCloudSession(user: User, record: SessionRecord): Promise<void> {
  if (!user.emailVerified && !user.isAnonymous) return;
  const safeId = sanitizeIdPart(record.id).slice(0, 120);
  const path = `sessions/${safeId}`;

  const safeBreakdown: Record<string, { correct: number; total: number }> = {};
  ALL_ASPECTS.forEach((aspect) => {
    const entry = record.aspectBreakdown?.[aspect];
    safeBreakdown[aspect] = {
      correct: clampNum(entry?.correct ?? 0, 0, 100),
      total: clampNum(entry?.total ?? 0, 0, 100),
    };
  });

  const payload: Record<string, unknown> = {
    ownerUid: user.uid,
    studentName: clampStr(record.studentName, 80, 'Siswa'),
    className: clampStr(record.className, 32, 'Umum'),
    mode: record.mode === 'balapan' ? 'balapan' : 'paspor',
    destinationLabel: clampStr(record.destinationLabel, 100, 'Paspor Literasi'),
    score: clampNum(Math.round(record.score), 0, 100000),
    correctCount: clampNum(Math.round(record.correctCount), 0, 200),
    totalQuestions: clampNum(Math.round(record.totalQuestions), 0, 200),
    accuracy: clampNum(Math.round(record.accuracy), 0, 100),
    avgResponseTimeSec: clampNum(Number(record.avgResponseTimeSec.toFixed(1)), 0, 3600),
    durationSec: clampNum(Math.round(record.durationSec), 0, 7200),
    stampsEarned: (record.stampsEarned || []).slice(0, 6).map((s) => clampStr(s, 40)),
    aspectBreakdown: safeBreakdown,
    timestamp: clampStr(record.timestamp, 40, new Date().toISOString()),
    createdAt: serverTimestamp(),
  };

  if (typeof record.raceRank === 'number' && record.raceRank >= 1 && record.raceRank <= 4) {
    payload.raceRank = record.raceRank;
  }
  if (record.raceModeType === 'solo-bot' || record.raceModeType === 'duel-kelas') {
    payload.raceModeType = record.raceModeType;
  }

  try {
    await setDoc(doc(db, 'sessions', safeId), payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function upsertCloudStudentProfile(
  user: User,
  name: string,
  className: string,
  newStamps: RegionId[]
): Promise<void> {
  if (!user.emailVerified && !user.isAnonymous) return;
  const cleanName = clampStr(name, 80, '');
  const cleanClass = clampStr(className, 32, 'Umum');
  if (!cleanName) return;

  const slug = sanitizeIdPart(`${cleanName.toLowerCase()}_${cleanClass.toLowerCase()}`).slice(0, 64);
  const profileId = `prof_${sanitizeIdPart(user.uid).slice(0, 24)}_${slug}`.slice(0, 120);
  const path = `studentProfiles/${profileId}`;
  const docRef = doc(db, 'studentProfiles', profileId);

  try {
    const snap = await getDoc(docRef);
    const nowIso = new Date().toISOString();
    if (snap.exists()) {
      const existingData = snap.data();
      const existingStamps = Array.isArray(existingData.stampsCollected)
        ? (existingData.stampsCollected.map(String) as RegionId[])
        : [];
      const merged = Array.from(new Set([...existingStamps, ...newStamps])).slice(0, 6);
      await updateDoc(docRef, {
        name: cleanName,
        className: cleanClass,
        stampsCollected: merged,
        lastPlayedAt: nowIso,
        updatedAt: serverTimestamp(),
      });
    } else {
      await setDoc(docRef, {
        ownerUid: user.uid,
        name: cleanName,
        className: cleanClass,
        stampsCollected: Array.from(new Set(newStamps)).slice(0, 6),
        lastPlayedAt: nowIso,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteCloudSession(sessionId: string): Promise<void> {
  const safeId = sanitizeIdPart(sessionId).slice(0, 120);
  const path = `sessions/${safeId}`;
  try {
    await deleteDoc(doc(db, 'sessions', safeId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}
