// Web Audio API Retro 8-bit Sound Synthesizer
// Works completely offline without external audio files!

class SoundSynthesizer {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;
  private volume: number = 0.7;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  // Play a simple retro note
  private playTone(freq: number, type: OscillatorType, duration: number, delay: number = 0, gainLevel: number = 0.15) {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    setTimeout(() => {
      if (!this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        const currentVol = this.volume * gainLevel;
        gain.gain.setValueAtTime(currentVol, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
      } catch (e) {
        console.warn('Audio playback error', e);
      }
    }, delay * 1000);
  }

  // Quest Complete sound (Cute bright 8-bit coin / clear chime)
  public playQuestComplete() {
    if (!this.enabled) return;
    this.playTone(523.25, 'triangle', 0.1, 0, 0.2);      // C5
    this.playTone(659.25, 'triangle', 0.1, 0.08, 0.2);   // E5
    this.playTone(783.99, 'triangle', 0.1, 0.16, 0.2);   // G5
    this.playTone(1046.50, 'triangle', 0.25, 0.24, 0.25); // C6
  }

  // Level Up sound (Victorious fanfare)
  public playLevelUp() {
    if (!this.enabled) return;
    const notes = [
      { f: 440, t: 0.1, d: 0 },       // A4
      { f: 554.37, t: 0.1, d: 0.09 }, // C#5
      { f: 659.25, t: 0.1, d: 0.18 }, // E5
      { f: 880, t: 0.15, d: 0.27 },   // A5
      { f: 783.99, t: 0.1, d: 0.42 }, // G5
      { f: 880, t: 0.4, d: 0.52 },    // A5
    ];
    notes.forEach(n => this.playTone(n.f, 'square', n.t, n.d, 0.15));
  }

  // Achievement unlock sound (Sparkle magic)
  public playAchievement() {
    if (!this.enabled) return;
    const notes = [659.25, 783.99, 987.77, 1318.51, 1567.98];
    notes.forEach((freq, idx) => {
      this.playTone(freq, 'sine', 0.2, idx * 0.07, 0.2);
    });
  }

  // Button click / toggle sound
  public playClick() {
    if (!this.enabled) return;
    this.playTone(800, 'square', 0.04, 0, 0.08);
  }

  // Streak update sound
  public playStreak() {
    if (!this.enabled) return;
    this.playTone(330, 'sawtooth', 0.1, 0, 0.15);
    this.playTone(440, 'sawtooth', 0.1, 0.08, 0.18);
    this.playTone(550, 'sawtooth', 0.25, 0.16, 0.2);
  }

  // Chain complete grand fanfare
  public playChainComplete() {
    if (!this.enabled) return;
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    notes.forEach((freq, idx) => {
      this.playTone(freq, 'triangle', 0.3, idx * 0.1, 0.25);
    });
  }
}

export const soundManager = new SoundSynthesizer();
