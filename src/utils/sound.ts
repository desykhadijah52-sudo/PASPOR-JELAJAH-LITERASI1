export type BgmMode = 'none' | 'explore' | 'race';

class SoundEngine {
  private ctx: AudioContext | null = null;
  private masterOut: AudioNode | null = null;
  private muted: boolean = false;
  private musicEnabled: boolean = true;
  private bgmMode: BgmMode = 'explore';
  private bgmTimer: number | null = null;
  private stepIndex: number = 0;
  private unlocked: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const savedMuted = window.localStorage.getItem('paspor_literasi_muted');
      this.muted = savedMuted === 'true';
      const savedMusic = window.localStorage.getItem('paspor_literasi_music');
      this.musicEnabled = savedMusic !== 'false';

      const unlockHandler = () => {
        if (this.unlocked) return;
        const ctx = this.ensureContext();
        if (ctx) {
          this.unlocked = true;
          if (!this.muted && this.musicEnabled && this.bgmMode !== 'none') {
            this.startBgmLoop();
          }
        }
      };

      window.addEventListener('pointerdown', unlockHandler, { passive: true });
      window.addEventListener('keydown', unlockHandler, { passive: true });
    }
  }

  private ensureContext(): AudioContext | null {
    if (this.muted || typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();
      const compressor = this.ctx.createDynamicsCompressor();
      compressor.threshold.setValueAtTime(-14, this.ctx.currentTime);
      compressor.knee.setValueAtTime(18, this.ctx.currentTime);
      compressor.ratio.setValueAtTime(6, this.ctx.currentTime);
      compressor.attack.setValueAtTime(0.005, this.ctx.currentTime);
      compressor.release.setValueAtTime(0.15, this.ctx.currentTime);
      compressor.connect(this.ctx.destination);
      this.masterOut = compressor;
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  private withActiveContext(callback: (ctx: AudioContext, dest: AudioNode) => void) {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const dest = this.masterOut || ctx.destination;
    if (ctx.state === 'suspended') {
      ctx
        .resume()
        .then(() => {
          if (!this.muted) callback(ctx, dest);
        })
        .catch(() => {});
      return;
    }
    callback(ctx, dest);
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public isMusicEnabled(): boolean {
    return this.musicEnabled;
  }

  public toggleMute(): boolean {
    this.muted = !this.muted;
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('paspor_literasi_muted', String(this.muted));
    }
    if (this.muted) {
      this.stopBgmLoop();
    } else {
      this.ensureContext();
      this.playClick();
      if (this.musicEnabled && this.bgmMode !== 'none') {
        this.startBgmLoop();
      }
    }
    return this.muted;
  }

  public toggleMusic(): boolean {
    this.musicEnabled = !this.musicEnabled;
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('paspor_literasi_music', String(this.musicEnabled));
    }
    if (!this.musicEnabled || this.muted) {
      this.stopBgmLoop();
    } else {
      this.ensureContext();
      this.playClick();
      if (this.bgmMode !== 'none') {
        this.startBgmLoop();
      }
    }
    return this.musicEnabled;
  }

  public setBgmMode(mode: BgmMode) {
    if (this.bgmMode === mode) return;
    this.bgmMode = mode;
    this.stepIndex = 0;

    if (mode === 'none' || this.muted || !this.musicEnabled) {
      this.stopBgmLoop();
      return;
    }

    if (this.unlocked) {
      this.startBgmLoop();
    }
  }

  private stopBgmLoop() {
    if (this.bgmTimer !== null && typeof window !== 'undefined') {
      window.clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    }
  }

  private startBgmLoop() {
    this.stopBgmLoop();
    if (typeof window === 'undefined' || this.muted || !this.musicEnabled || this.bgmMode === 'none') {
      return;
    }

    const intervalMs = this.bgmMode === 'race' ? 215 : 340;
    this.tickBgm();
    this.bgmTimer = window.setInterval(() => {
      this.tickBgm();
    }, intervalMs);
  }

  private tickBgm() {
    if (this.muted || !this.musicEnabled || this.bgmMode === 'none') return;
    const ctx = this.ensureContext();
    if (!ctx || ctx.state !== 'running') return;

    if (this.bgmMode === 'explore') {
      // Warm Nusantara-inspired pentatonic marimba melody (C D E G A)
      const melody = [
        523.25, 0, 659.25, 783.99,
        659.25, 587.33, 523.25, 0,
        440.0, 523.25, 587.33, 659.25,
        587.33, 0, 440.0, 392.0,
      ];
      const bass = [
        130.81, 0, 0, 0,
        196.0, 0, 0, 0,
        110.0, 0, 0, 0,
        146.83, 0, 196.0, 0,
      ];
      const idx = this.stepIndex % melody.length;
      const note = melody[idx];
      const bassNote = bass[idx];

      if (note > 0) {
        this.tone(note, 0.28, 'sine', 0.024, 0);
        this.tone(note * 2, 0.14, 'triangle', 0.007, 0);
      }
      if (bassNote > 0) {
        this.tone(bassNote, 0.45, 'triangle', 0.02, 0);
      }
    } else if (this.bgmMode === 'race') {
      // Upbeat energetic race track groove
      const lead = [
        523.25, 659.25, 783.99, 659.25,
        880.0, 783.99, 659.25, 587.33,
        523.25, 587.33, 659.25, 783.99,
        1046.5, 0, 783.99, 659.25,
      ];
      const bass = [
        130.81, 130.81, 196.0, 196.0,
        174.61, 174.61, 196.0, 196.0,
        130.81, 130.81, 146.83, 146.83,
        196.0, 0, 196.0, 146.83,
      ];
      const idx = this.stepIndex % lead.length;
      const note = lead[idx];
      const bassNote = bass[idx];

      if (note > 0) {
        this.tone(note, 0.16, 'triangle', 0.026, 0);
      }
      if (bassNote > 0) {
        this.tone(bassNote, 0.15, 'sine', 0.028, 0);
      }
    }

    this.stepIndex = (this.stepIndex + 1) % 16;
  }

  private scheduleTone(
    ctx: AudioContext,
    dest: AudioNode,
    freq: number,
    duration: number,
    type: OscillatorType = 'sine',
    gainPeak = 0.12,
    delay = 0,
    endFreq?: number,
    lowpassHz?: number
  ) {
    const now = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    if (endFreq) {
      osc.frequency.exponentialRampToValueAtTime(endFreq, now + duration);
    }

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(gainPeak, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    if (lowpassHz) {
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(lowpassHz, now);
      osc.connect(filter);
      filter.connect(gain);
    } else {
      osc.connect(gain);
    }

    gain.connect(dest);
    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  private tone(
    freq: number,
    duration: number,
    type: OscillatorType = 'sine',
    gainPeak = 0.09,
    delay = 0,
    endFreq?: number,
    lowpassHz?: number
  ) {
    this.withActiveContext((ctx, dest) => {
      this.scheduleTone(ctx, dest, freq, duration, type, gainPeak, delay, endFreq, lowpassHz);
    });
  }

  public playClick() {
    this.tone(540, 0.06, 'triangle', 0.07, 0, 410);
  }

  public playTurnStart() {
    this.tone(440, 0.09, 'triangle', 0.11, 0);
    this.tone(659.25, 0.16, 'triangle', 0.13, 0.08);
  }

  public playCorrect(streak = 1) {
    const semitoneBoost = Math.min(Math.max(0, streak - 1), 5) * 32;
    this.withActiveContext((ctx, dest) => {
      // Bright celebratory arpeggio chime (Ting-Ting-Ding!)
      const n1 = 523.25 + semitoneBoost;
      const n2 = 659.25 + semitoneBoost;
      const n3 = 783.99 + semitoneBoost;
      const n4 = 1046.5 + semitoneBoost;

      this.scheduleTone(ctx, dest, n1, 0.11, 'sine', 0.2, 0);
      this.scheduleTone(ctx, dest, n2, 0.12, 'sine', 0.22, 0.065);
      this.scheduleTone(ctx, dest, n3, 0.15, 'triangle', 0.2, 0.13);
      this.scheduleTone(ctx, dest, n4, 0.34, 'sine', 0.25, 0.19);
      this.scheduleTone(ctx, dest, n4 * 1.5, 0.22, 'triangle', 0.09, 0.19);
    });
  }

  public playWrong() {
    this.withActiveContext((ctx, dest) => {
      // Unmistakable warm quiz-show buzzer ("Tet-Tot!")
      this.scheduleTone(ctx, dest, 265, 0.13, 'sawtooth', 0.16, 0, 225, 920);
      this.scheduleTone(ctx, dest, 132.5, 0.13, 'triangle', 0.16, 0, 115);

      this.scheduleTone(ctx, dest, 195, 0.3, 'sawtooth', 0.2, 0.13, 132, 820);
      this.scheduleTone(ctx, dest, 98, 0.3, 'triangle', 0.18, 0.13, 72);
    });
  }

  public playStamp() {
    this.withActiveContext((ctx, dest) => {
      this.scheduleTone(ctx, dest, 150, 0.15, 'triangle', 0.22, 0, 65);
      this.scheduleTone(ctx, dest, 440, 0.11, 'sine', 0.14, 0.04, 587);
      this.scheduleTone(ctx, dest, 880, 0.28, 'sine', 0.18, 0.09);
      this.scheduleTone(ctx, dest, 1174.66, 0.3, 'triangle', 0.12, 0.14);
    });
  }

  public playBoost() {
    this.withActiveContext((ctx, dest) => {
      this.scheduleTone(ctx, dest, 330, 0.2, 'sawtooth', 0.09, 0, 780, 1800);
      this.scheduleTone(ctx, dest, 660, 0.28, 'triangle', 0.16, 0.06, 1080);
    });
  }

  public playVictory() {
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((n, idx) => {
      this.tone(n, idx === 3 ? 0.48 : 0.17, 'triangle', 0.18, idx * 0.1);
    });
  }
}

export const sound = new SoundEngine();
