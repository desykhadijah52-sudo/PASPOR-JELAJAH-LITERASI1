import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { PassportMapView } from './components/PassportMapView';
import { PassportPlayView } from './components/PassportPlayView';
import { RacePlayView } from './components/RacePlayView';
import { RaceSetupView } from './components/RaceSetupView';
import { RekapanView } from './components/RekapanView';
import { TitleScreen } from './components/TitleScreen';
import { VictoryModal } from './components/VictoryModal';
import { REGIONS } from './data/literacyData';
import {
  auth,
  ensureAnonymousSignIn,
  isCloudAuthorizedUser,
  isTeacherUser,
  signInWithGoogle,
  signOutUser,
} from './firebase';
import {
  RaceCompetitorConfig,
  RaceDifficulty,
  RaceModeType,
  RegionInfo,
  ScreenState,
  SessionRecord,
  StudentProfile,
  VictorySummary,
} from './types/game';
import {
  deleteCloudSession,
  saveCloudSession,
  subscribeCloudProfiles,
  subscribeCloudSessions,
  upsertCloudStudentProfile,
} from './utils/cloudSync';
import { sound } from './utils/sound';
import {
  appendSessionRecord,
  clearAllRecords,
  deleteSingleRecord,
  getStudentStamps,
  loadActiveStudentSelection,
  loadProfiles,
  loadSessionRecords,
  saveActiveStudentSelection,
  upsertStudentProfile,
} from './utils/studentStore';

export default function App() {
  const initialStudent = loadActiveStudentSelection();
  const [studentName, setStudentName] = useState(initialStudent.name);
  const [studentClass, setStudentClass] = useState(initialStudent.className);
  const [localProfiles, setLocalProfiles] = useState<StudentProfile[]>(() => loadProfiles());
  const [localRecords, setLocalRecords] = useState<SessionRecord[]>(() => loadSessionRecords());

  // Firebase Auth & Cloud Firestore state
  const [cloudUser, setCloudUser] = useState<User | null>(null);
  const [authBusy, setAuthBusy] = useState(false);
  const [anonymousBlocked, setAnonymousBlocked] = useState(false);
  const [cloudProfiles, setCloudProfiles] = useState<StudentProfile[]>([]);
  const [cloudRecords, setCloudRecords] = useState<SessionRecord[]>([]);

  const [screen, setScreen] = useState<ScreenState>('TITLE_MENU');
  const [muted, setMuted] = useState(() => sound.isMuted());
  const [musicEnabled, setMusicEnabled] = useState(() => sound.isMusicEnabled());

  // Active Passport Mission state
  const [activeRegion, setActiveRegion] = useState<RegionInfo>(REGIONS[0]);
  const [pasporSessionKey, setPasporSessionKey] = useState(0);

  // Active Race Mission state
  const [raceConfig, setRaceConfig] = useState<{
    raceModeType: RaceModeType;
    difficulty: RaceDifficulty;
    competitors: RaceCompetitorConfig[];
  } | null>(null);
  const [raceSessionKey, setRaceSessionKey] = useState(0);

  // Victory summary state
  const [victorySummary, setVictorySummary] = useState<VictorySummary | null>(null);

  useEffect(() => {
    sound.setBgmMode(screen === 'RACE_PLAY' ? 'race' : 'explore');
  }, [screen]);

  useEffect(() => {
    let unsubSessions: (() => void) | null = null;
    let unsubProfiles: (() => void) | null = null;
    let attemptedAnon = false;

    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (unsubSessions) {
        unsubSessions();
        unsubSessions = null;
      }
      if (unsubProfiles) {
        unsubProfiles();
        unsubProfiles = null;
      }

      if (!user) {
        setCloudUser(null);
        setCloudRecords([]);
        setCloudProfiles([]);
        if (!attemptedAnon) {
          attemptedAnon = true;
          ensureAnonymousSignIn().catch((err) => {
            const code = (err as { code?: string })?.code || '';
            if (
              code.includes('operation-not-allowed') ||
              code.includes('admin-restricted-operation')
            ) {
              setAnonymousBlocked(true);
            }
          });
        }
        return;
      }

      setAnonymousBlocked(false);
      setCloudUser(user);

      if (isCloudAuthorizedUser(user)) {
        if (!studentName.trim() && user.displayName) {
          setStudentName(user.displayName);
          saveActiveStudentSelection(user.displayName, studentClass);
        }
        unsubSessions = subscribeCloudSessions(
          user,
          (list) => setCloudRecords(list),
          (err) => console.error('Cloud sessions error:', err)
        );
        unsubProfiles = subscribeCloudProfiles(
          user,
          (list) => setCloudProfiles(list),
          (err) => console.error('Cloud profiles error:', err)
        );
      } else {
        setCloudRecords([]);
        setCloudProfiles([]);
      }
    });

    return () => {
      unsubAuth();
      if (unsubSessions) unsubSessions();
      if (unsubProfiles) unsubProfiles();
    };
  }, []);

  const handleSignIn = async () => {
    sound.playClick();
    setAuthBusy(true);
    try {
      const cred = await signInWithGoogle();
      if (!studentName.trim() && cred.user?.displayName) {
        setStudentName(cred.user.displayName);
        saveActiveStudentSelection(cred.user.displayName, studentClass);
      }
    } catch (error) {
      console.error('Google Sign-In failed:', error);
    } finally {
      setAuthBusy(false);
    }
  };

  const handleSignOut = async () => {
    sound.playClick();
    try {
      await signOutUser();
    } catch (error) {
      console.error('Sign-Out failed:', error);
    }
  };

  const handleChangeStudent = (name: string, className: string) => {
    setStudentName(name);
    setStudentClass(className);
    saveActiveStudentSelection(name, className);
  };

  const handleToggleMute = () => {
    const nextMuted = sound.toggleMute();
    setMuted(nextMuted);
  };

  const handleToggleMusic = () => {
    const nextMusic = sound.toggleMusic();
    setMusicEnabled(nextMusic);
  };

  const recordSummaryToStore = (summary: VictorySummary) => {
    const stampsEarned = summary.newStamp ? [summary.newStamp.name] : [];
    const stampIds = summary.newStamp ? [summary.newStamp.id] : [];

    const updatedProfiles = upsertStudentProfile(
      summary.studentName,
      summary.className,
      stampIds
    );
    setLocalProfiles(updatedProfiles);

    const record: SessionRecord = {
      id: `rec_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      studentName: summary.studentName,
      className: summary.className,
      mode: summary.mode,
      destinationLabel: summary.destinationLabel,
      score: summary.score,
      correctCount: summary.correctCount,
      totalQuestions: summary.totalQuestions,
      accuracy: summary.accuracy,
      avgResponseTimeSec: summary.avgResponseTimeSec,
      durationSec: summary.durationSec,
      raceRank: summary.playerRank,
      raceModeType: summary.mode === 'balapan' ? raceConfig?.raceModeType : undefined,
      stampsEarned,
      aspectBreakdown: summary.aspectBreakdown,
      timestamp: new Date().toISOString(),
    };
    const nextRecords = appendSessionRecord(record);
    setLocalRecords(nextRecords);

    if (isCloudAuthorizedUser(cloudUser) && cloudUser) {
      saveCloudSession(cloudUser, record).catch((err) =>
        console.error('Failed saving cloud session:', err)
      );
      upsertCloudStudentProfile(cloudUser, summary.studentName, summary.className, stampIds).catch(
        (err) => console.error('Failed saving cloud profile:', err)
      );
    }
  };

  const activeProfiles = isCloudAuthorizedUser(cloudUser) ? cloudProfiles : localProfiles;
  const activeRecords = isCloudAuthorizedUser(cloudUser) ? cloudRecords : localRecords;
  const teacher = isTeacherUser(cloudUser);

  const activeStamps = isCloudAuthorizedUser(cloudUser)
    ? cloudProfiles.find(
        (p) =>
          p.name.toLowerCase() === studentName.trim().toLowerCase() &&
          p.className.toLowerCase() === (studentClass.trim() || 'Umum').toLowerCase()
      )?.stampsCollected || []
    : getStudentStamps(studentName, studentClass);

  if (screen === 'TITLE_MENU') {
    return (
      <TitleScreen
        studentName={studentName}
        studentClass={studentClass}
        onChangeStudent={handleChangeStudent}
        profiles={activeProfiles}
        totalSessionsCount={activeRecords.length}
        cloudUser={cloudUser}
        isTeacher={teacher}
        authBusy={authBusy}
        anonymousBlocked={anonymousBlocked}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
        muted={muted}
        musicEnabled={musicEnabled}
        onToggleMute={handleToggleMute}
        onToggleMusic={handleToggleMusic}
        onStartPassport={() => {
          sound.playClick();
          const updated = upsertStudentProfile(studentName, studentClass, []);
          setLocalProfiles(updated);
          if (isCloudAuthorizedUser(cloudUser) && cloudUser) {
            upsertCloudStudentProfile(cloudUser, studentName, studentClass, []).catch(() => {});
          }
          setScreen('PASPOR_MAP');
        }}
        onStartRace={() => {
          sound.playClick();
          const updated = upsertStudentProfile(studentName, studentClass, []);
          setLocalProfiles(updated);
          if (isCloudAuthorizedUser(cloudUser) && cloudUser) {
            upsertCloudStudentProfile(cloudUser, studentName, studentClass, []).catch(() => {});
          }
          setScreen('RACE_SETUP');
        }}
        onOpenRekapan={() => {
          sound.playClick();
          setScreen('REKAPAN');
        }}
      />
    );
  }

  if (screen === 'PASPOR_MAP') {
    return (
      <PassportMapView
        studentName={studentName.trim() || 'Penjelajah'}
        studentClass={studentClass}
        stampsCollected={activeStamps}
        muted={muted}
        musicEnabled={musicEnabled}
        onToggleMute={handleToggleMute}
        onToggleMusic={handleToggleMusic}
        onBackTitle={() => {
          sound.playClick();
          setScreen('TITLE_MENU');
        }}
        onSelectRegion={(region) => {
          sound.playClick();
          setActiveRegion(region);
          setPasporSessionKey((k) => k + 1);
          setScreen('PASPOR_PLAY');
        }}
        onOpenRace={() => {
          sound.playClick();
          setScreen('RACE_SETUP');
        }}
        onOpenRekapan={() => {
          sound.playClick();
          setScreen('REKAPAN');
        }}
      />
    );
  }

  if (screen === 'PASPOR_PLAY') {
    return (
      <PassportPlayView
        key={`paspor-${activeRegion.id}-${pasporSessionKey}`}
        region={activeRegion}
        studentName={studentName.trim() || 'Penjelajah'}
        studentClass={studentClass}
        muted={muted}
        musicEnabled={musicEnabled}
        onToggleMute={handleToggleMute}
        onToggleMusic={handleToggleMusic}
        onExitToMap={() => {
          sound.playClick();
          setScreen('PASPOR_MAP');
        }}
        onComplete={(summary) => {
          recordSummaryToStore(summary);
          setVictorySummary(summary);
          setScreen('VICTORY');
        }}
      />
    );
  }

  if (screen === 'RACE_SETUP') {
    return (
      <RaceSetupView
        studentName={studentName.trim() || 'Siswa 1'}
        studentClass={studentClass}
        onBack={() => {
          sound.playClick();
          setScreen('TITLE_MENU');
        }}
        onStartRace={(config) => {
          sound.playClick();
          setRaceConfig(config);
          setRaceSessionKey((k) => k + 1);
          setScreen('RACE_PLAY');
        }}
      />
    );
  }

  if (screen === 'RACE_PLAY' && raceConfig) {
    return (
      <RacePlayView
        key={`race-${raceSessionKey}`}
        raceModeType={raceConfig.raceModeType}
        difficulty={raceConfig.difficulty}
        competitors={raceConfig.competitors}
        muted={muted}
        musicEnabled={musicEnabled}
        onToggleMute={handleToggleMute}
        onToggleMusic={handleToggleMusic}
        onExit={() => {
          sound.playClick();
          setScreen('RACE_SETUP');
        }}
        onFinishRace={(primary, extras) => {
          recordSummaryToStore(primary);
          extras.forEach((extra) => recordSummaryToStore(extra));
          setVictorySummary(primary);
          setScreen('VICTORY');
        }}
      />
    );
  }

  if (screen === 'VICTORY' && victorySummary) {
    return (
      <VictoryModal
        summary={victorySummary}
        onPlayAgain={() => {
          sound.playClick();
          if (victorySummary.mode === 'paspor') {
            setPasporSessionKey((k) => k + 1);
            setScreen('PASPOR_PLAY');
          } else {
            setRaceSessionKey((k) => k + 1);
            setScreen('RACE_PLAY');
          }
        }}
        onGoPassport={() => {
          sound.playClick();
          setScreen('PASPOR_MAP');
        }}
        onOpenRekapan={() => {
          sound.playClick();
          setScreen('REKAPAN');
        }}
      />
    );
  }

  return (
    <RekapanView
      records={activeRecords}
      profiles={activeProfiles}
      cloudUser={cloudUser}
      isTeacher={teacher}
      authBusy={authBusy}
      onSignIn={handleSignIn}
      onBack={() => {
        sound.playClick();
        setScreen('TITLE_MENU');
      }}
      onStartPassport={() => {
        sound.playClick();
        if (!studentName.trim()) {
          setScreen('TITLE_MENU');
        } else {
          setScreen('PASPOR_MAP');
        }
      }}
      onStartRace={() => {
        sound.playClick();
        if (!studentName.trim()) {
          setScreen('TITLE_MENU');
        } else {
          setScreen('RACE_SETUP');
        }
      }}
      onDeleteRecord={(id) => {
        sound.playClick();
        if (cloudUser) {
          deleteCloudSession(id).catch((err) => console.error('Failed deleting cloud record:', err));
        } else {
          setLocalRecords(deleteSingleRecord(id));
        }
      }}
      onClearAll={() => {
        sound.playClick();
        clearAllRecords();
        setLocalRecords([]);
        setLocalProfiles([]);
      }}
    />
  );
}
