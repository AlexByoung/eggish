"use strict";

class AudioManager {
  constructor(config) {
    this.config = config;
    this.scene = null;
    this.context = null;
    this.settings = { ...config.defaults };
    this.unlocked = false;
    this.paused = false;
    this.pendingMusic = null;
    this.currentMusic = null;
    this.currentMusicId = null;
    this.lastPlayedAt = new Map();
    this.activeInstances = new Map();
    this.activeLoops = new Map();
    this.pausedLoops = new Set();
    this.unlockHandler = () => this.unlock();
  }

  preload(scene) {
    Object.values(this.config.events).forEach((event) => {
      if (event.category === 'music' && event.path && event.key) {
        scene.load.audio(event.key, event.path);
      }
    });
  }

  initialize(scene) {
    this.scene = scene;
    this.context = scene.sound?.context || null;
    window.addEventListener('pointerdown', this.unlockHandler, { passive: true });
    window.addEventListener('keydown', this.unlockHandler);
    scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.destroy());
    scene.events.once(Phaser.Scenes.Events.DESTROY, () => this.destroy());
    this.applyMusicVolume();
  }

  async unlock() {
    if (!this.context && window.AudioContext) this.context = new AudioContext();
    if (!this.context && window.webkitAudioContext) this.context = new webkitAudioContext();
    if (!this.context) return false;
    try {
      if (this.context.state === 'suspended') await this.context.resume();
      this.unlocked = this.context.state === 'running';
    } catch {
      this.unlocked = false;
    }
    if (this.unlocked) {
      window.removeEventListener('pointerdown', this.unlockHandler);
      window.removeEventListener('keydown', this.unlockHandler);
      if (this.pendingMusic) {
        const musicId = this.pendingMusic;
        this.pendingMusic = null;
        this.playMusic(musicId);
      }
    }
    return this.unlocked;
  }

  setSettings(nextSettings) {
    ['masterVolume', 'musicVolume', 'sfxVolume'].forEach((key) => {
      if (Number.isFinite(nextSettings[key])) {
        this.settings[key] = Phaser.Math.Clamp(nextSettings[key], 0, 1);
      }
    });
    if (typeof nextSettings.muted === 'boolean') this.settings.muted = nextSettings.muted;
    this.applyMusicVolume();
    this.refreshLoopVolumes();
  }

  getSettings() {
    return { ...this.settings };
  }

  getEffectiveVolume(event) {
    if (this.settings.muted) return 0;
    const categoryVolume = event.category === 'music'
      ? this.settings.musicVolume
      : this.settings.sfxVolume;
    return this.settings.masterVolume * categoryVolume * (event.volume ?? 1);
  }

  play(eventId) {
    const event = this.config.events[eventId];
    if (!event || event.category !== 'sfx' || event.loop || this.paused) return false;
    const now = performance.now();
    if (now - (this.lastPlayedAt.get(eventId) || 0) < (event.cooldown || 0)) return false;
    const active = this.activeInstances.get(eventId) || 0;
    if (active >= (event.maxInstances || 1)) return false;
    if (!this.unlocked || !this.context || this.context.state !== 'running') return false;

    this.lastPlayedAt.set(eventId, now);
    this.activeInstances.set(eventId, active + 1);
    const duration = this.playSynth(event.synth, this.getEffectiveVolume(event));
    window.setTimeout(() => {
      const remaining = (this.activeInstances.get(eventId) || 1) - 1;
      if (remaining > 0) this.activeInstances.set(eventId, remaining);
      else this.activeInstances.delete(eventId);
    }, Math.max(50, duration * 1000 + 30));
    return true;
  }

  playMusic(eventId) {
    const event = this.config.events[eventId];
    if (!event || event.category !== 'music') return false;
    if (!this.unlocked) {
      this.pendingMusic = eventId;
      return false;
    }
    if (
      !event.synth
      && (!event.path || !event.key || !this.scene?.cache.audio.exists(event.key))
    ) {
      this.stopMusic(event.fadeOut || 0);
      this.currentMusicId = eventId;
      return false;
    }
    if (this.currentMusicId === eventId && this.currentMusic?.isPlaying) return true;

    const begin = () => {
      if (!this.scene || this.paused) {
        this.pendingMusic = eventId;
        return;
      }
      const sound = event.synth
        ? this.createMusicSynth(event.synth)
        : this.scene.sound.add(event.key, { loop: Boolean(event.loop), volume: 0 });
      if (!sound) {
        this.currentMusicId = eventId;
        return;
      }
      this.currentMusic = sound;
      this.currentMusicId = eventId;
      sound.play();
      this.fadeSound(sound, this.getEffectiveVolume(event), event.fadeIn || 0);
    };
    if (this.currentMusic) this.stopMusic(this.config.events[this.currentMusicId]?.fadeOut || 0, begin);
    else begin();
    return true;
  }

  stopMusic(duration = 0, onComplete) {
    const sound = this.currentMusic;
    this.currentMusic = null;
    this.currentMusicId = null;
    if (!sound) {
      onComplete?.();
      return;
    }
    this.fadeSound(sound, 0, duration, () => {
      sound.stop();
      sound.destroy();
      onComplete?.();
    });
  }

  fadeSound(sound, volume, duration, onComplete) {
    if (!this.scene || !duration) {
      sound.setVolume(volume);
      onComplete?.();
      return;
    }
    this.scene.tweens.addCounter({
      from: sound.volume,
      to: volume,
      duration,
      ease: 'Sine.InOut',
      onUpdate: (tween) => sound.setVolume(tween.getValue()),
      onComplete
    });
  }

  startLoop(eventId) {
    const event = this.config.events[eventId];
    if (!event?.loop || event.category !== 'sfx' || this.activeLoops.has(eventId)) return false;
    if (this.paused) {
      this.pausedLoops.add(eventId);
      return false;
    }
    if (!this.unlocked || !this.context || this.context.state !== 'running') return false;
    const nodes = this.createLoopSynth(event.synth, this.getEffectiveVolume(event));
    if (!nodes) return false;
    this.activeLoops.set(eventId, { ...nodes, event });
    return true;
  }

  stopLoop(eventId) {
    this.pausedLoops.delete(eventId);
    const loop = this.activeLoops.get(eventId);
    if (!loop) return;
    try {
      loop.oscillator.stop();
      loop.modulator?.stop();
    } catch {
      // A previously stopped Web Audio node needs no further cleanup.
    }
    loop.oscillator.disconnect();
    loop.modulator?.disconnect();
    loop.modulationGain?.disconnect();
    loop.gain.disconnect();
    this.activeLoops.delete(eventId);
  }

  stopLevelLoops() {
    [...this.activeLoops.keys()].forEach((eventId) => this.stopLoop(eventId));
    this.pausedLoops.clear();
  }

  pauseAll() {
    if (this.paused) return;
    this.paused = true;
    this.currentMusic?.pause();
    this.activeLoops.forEach((value, eventId) => this.pausedLoops.add(eventId));
    [...this.activeLoops.keys()].forEach((eventId) => {
      const loop = this.activeLoops.get(eventId);
      try { loop.oscillator.stop(); loop.modulator?.stop(); } catch { /* already stopped */ }
      loop.oscillator.disconnect();
      loop.modulator?.disconnect();
      loop.modulationGain?.disconnect();
      loop.gain.disconnect();
      this.activeLoops.delete(eventId);
    });
  }

  resumeAll() {
    if (!this.paused) return;
    this.paused = false;
    if (this.currentMusic?.isPaused) this.currentMusic.resume();
    const loops = [...this.pausedLoops];
    this.pausedLoops.clear();
    loops.forEach((eventId) => this.startLoop(eventId));
    if (this.pendingMusic) this.playMusic(this.pendingMusic);
  }

  applyMusicVolume() {
    if (!this.currentMusicId || !this.currentMusic) return;
    const event = this.config.events[this.currentMusicId];
    this.currentMusic.setVolume(this.getEffectiveVolume(event));
  }

  refreshLoopVolumes() {
    this.activeLoops.forEach((loop) => {
      loop.gain.gain.setValueAtTime(this.getEffectiveVolume(loop.event), this.context.currentTime);
    });
  }

  playSynth(preset, volume) {
    if (!volume) return 0.05;
    const definitions = {
      jump: [[210, 540, 0.13, 'sine', 0]],
      land: [[125, 72, 0.08, 'sine', 0]],
      death: [[360, 92, 0.42, 'triangle', 0]],
      button: [[420, 250, 0.09, 'sine', 0]],
      door: [[185, 105, 0.28, 'triangle', 0], [310, 180, 0.2, 'sine', 0.06]],
      uiHover: [[790, 790, 0.05, 'sine', 0]],
      uiSelect: [[560, 720, 0.1, 'sine', 0], [720, 930, 0.1, 'sine', 0.055]],
      levelClear: [[440, 660, 0.14, 'sine', 0], [554, 830, 0.16, 'sine', 0.08], [660, 990, 0.18, 'sine', 0.16]],
      fireWarning: [[260, 360, 0.16, 'triangle', 0], [360, 440, 0.12, 'sine', 0.1]],
      fireLaunch: [[210, 105, 0.22, 'triangle', 0]],
      spring: [[190, 620, 0.14, 'sine', 0], [420, 760, 0.1, 'triangle', 0.045]],
      spikeWarning: [[240, 220, 0.07, 'sine', 0], [300, 270, 0.07, 'sine', 0.09]]
    };
    const notes = definitions[preset];
    if (!notes) return 0.05;
    notes.forEach((note) => this.scheduleTone(...note, volume / Math.sqrt(notes.length)));
    return Math.max(...notes.map((note) => note[2] + note[4]));
  }

  scheduleTone(startFrequency, endFrequency, duration, type, delay, volume) {
    const now = this.context.currentTime + delay;
    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(startFrequency, now);
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(20, endFrequency), now + duration);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, volume), now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    oscillator.connect(gain).connect(this.context.destination);
    oscillator.start(now);
    oscillator.stop(now + duration + 0.02);
    oscillator.addEventListener('ended', () => {
      oscillator.disconnect();
      gain.disconnect();
    }, { once: true });
  }

  createLoopSynth(preset, volume) {
    if (!volume) return null;
    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();
    const modulator = this.context.createOscillator();
    const modulationGain = this.context.createGain();
    oscillator.type = preset === 'boxPush' ? 'triangle' : 'sine';
    oscillator.frequency.value = preset === 'boxPush' ? 115 : 180;
    modulator.frequency.value = preset === 'boxPush' ? 7 : 2.2;
    modulationGain.gain.value = preset === 'boxPush' ? 16 : 8;
    modulator.connect(modulationGain).connect(oscillator.frequency);
    gain.gain.value = volume;
    oscillator.connect(gain).connect(this.context.destination);
    oscillator.start();
    modulator.start();
    return { oscillator, modulator, modulationGain, gain };
  }

  createMusicSynth(preset) {
    if (preset !== 'transitionAmbience' || !this.context) return null;
    const context = this.context;
    const gain = context.createGain();
    const low = context.createOscillator();
    const high = context.createOscillator();
    const drift = context.createOscillator();
    const driftGain = context.createGain();
    low.type = 'sine';
    high.type = 'sine';
    drift.type = 'sine';
    low.frequency.value = 174;
    high.frequency.value = 261;
    drift.frequency.value = 0.11;
    driftGain.gain.value = 3;
    drift.connect(driftGain);
    driftGain.connect(high.frequency);
    low.connect(gain);
    high.connect(gain);
    gain.connect(context.destination);
    gain.gain.value = 0;

    let started = false;
    let stopped = false;
    const sound = {
      volume: 0,
      isPlaying: false,
      isPaused: false,
      play() {
        if (!started) {
          low.start();
          high.start();
          drift.start();
          started = true;
        }
        this.isPlaying = true;
        this.isPaused = false;
      },
      setVolume(value) {
        this.volume = value;
        if (!stopped) gain.gain.setTargetAtTime(value * 0.32, context.currentTime, 0.04);
      },
      pause() {
        this.isPaused = true;
        this.isPlaying = false;
        gain.gain.setTargetAtTime(0, context.currentTime, 0.03);
      },
      resume() {
        this.isPaused = false;
        this.isPlaying = true;
        gain.gain.setTargetAtTime(this.volume * 0.32, context.currentTime, 0.04);
      },
      stop() {
        if (stopped) return;
        stopped = true;
        this.isPlaying = false;
        try {
          low.stop();
          high.stop();
          drift.stop();
        } catch {
          // Stopping an already-ended procedural ambience is harmless.
        }
      },
      destroy() {
        low.disconnect();
        high.disconnect();
        drift.disconnect();
        driftGain.disconnect();
        gain.disconnect();
      }
    };
    return sound;
  }

  destroy() {
    window.removeEventListener('pointerdown', this.unlockHandler);
    window.removeEventListener('keydown', this.unlockHandler);
    this.stopLevelLoops();
    this.stopMusic(0);
    this.scene = null;
  }
}

const audioManager = new AudioManager(AUDIO_CONFIG);
