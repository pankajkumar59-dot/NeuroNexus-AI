/**
 * Web Audio API synthesizer for Binaural Alpha Waves, Pink Noise Campus Rain, and Haptic Pulses
 */

class SoundscapeEngine {
  private ctx: AudioContext | null = null;
  private isPlayingBinaural = false;
  private binauralNodes: { oscLeft: OscillatorNode; oscRight: OscillatorNode; gain: GainNode } | null = null;
  private noiseNode: AudioNode | null = null;
  private noiseGain: GainNode | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  /**
   * Play Binaural Beats at 432Hz base with 10Hz Alpha difference (432Hz left, 442Hz right)
   */
  public startBinauralAlpha(freqBase = 432, beatDiff = 10, volume = 0.08) {
    this.initContext();
    if (!this.ctx) return;
    this.stopBinauralAlpha();

    try {
      const merger = this.ctx.createChannelMerger(2);
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(volume, this.ctx.currentTime);

      const oscLeft = this.ctx.createOscillator();
      oscLeft.type = 'sine';
      oscLeft.frequency.setValueAtTime(freqBase, this.ctx.currentTime);

      const oscRight = this.ctx.createOscillator();
      oscRight.type = 'sine';
      oscRight.frequency.setValueAtTime(freqBase + beatDiff, this.ctx.currentTime);

      oscLeft.connect(merger, 0, 0);
      oscRight.connect(merger, 0, 1);
      merger.connect(gain);
      gain.connect(this.ctx.destination);

      oscLeft.start();
      oscRight.start();

      this.binauralNodes = { oscLeft, oscRight, gain };
      this.isPlayingBinaural = true;
    } catch (e) {
      console.warn('Audio playback not supported:', e);
    }
  }

  public stopBinauralAlpha() {
    if (this.binauralNodes) {
      try {
        this.binauralNodes.oscLeft.stop();
        this.binauralNodes.oscRight.stop();
        this.binauralNodes.oscLeft.disconnect();
        this.binauralNodes.oscRight.disconnect();
        this.binauralNodes.gain.disconnect();
      } catch {
        // ignore
      }
      this.binauralNodes = null;
    }
    this.isPlayingBinaural = false;
  }

  public toggleBinaural(enabled: boolean) {
    if (enabled) {
      this.startBinauralAlpha();
    } else {
      this.stopBinauralAlpha();
    }
  }

  /**
   * Ambient Campus Rain / Shower Pink Noise generator
   */
  public startCampusRain(volume = 0.05) {
    this.initContext();
    if (!this.ctx) return;
    this.stopCampusRain();

    try {
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.08;
        b6 = white * 0.115926;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      // Filter for soothing rain sound
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1000, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(volume, this.ctx.currentTime);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start();
      this.noiseNode = noise;
      this.noiseGain = gain;
    } catch (e) {
      console.warn('Pink noise error:', e);
    }
  }

  public stopCampusRain() {
    if (this.noiseNode) {
      try {
        (this.noiseNode as AudioBufferSourceNode).stop();
        this.noiseNode.disconnect();
      } catch {
        // ignore
      }
      this.noiseNode = null;
    }
  }

  /**
   * Short tactile resonance beep / haptic pulse simulator
   */
  public playHapticPulse(hz = 120, durationMs = 120) {
    this.initContext();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(hz, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + durationMs / 1000);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + durationMs / 1000);

      // Trigger navigator.vibrate if available
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate?.(durationMs);
      }
    } catch {
      // ignore
    }
  }
}

export const soundEngine = new SoundscapeEngine();
