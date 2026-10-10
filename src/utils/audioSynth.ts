// Synthesizes pleasant solarpunk civic radio ambiance and SOS beeps using Web Audio API

let audioCtx: AudioContext | null = null;
let radioOsc: OscillatorNode | null = null;
let radioGain: GainNode | null = null;
let staticNode: AudioBufferSourceNode | null = null;
let sosInterval: number | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playTactileClick() {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(380, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  } catch {
    // Audio may be blocked before interaction
  }
}

export function startCivicRadio(onVolumeChange?: (vol: number) => void): boolean {
  try {
    const ctx = getAudioContext();
    stopCivicRadio();

    // Create warm solar tone chord
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.08, ctx.currentTime);

    // Warm chord notes (F# maj 7 - comforting ambient solarpunk vibe)
    const frequencies = [185.0, 233.08, 277.18, 369.99];
    frequencies.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const noteGain = ctx.createGain();
      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      // subtle LFO modulation
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.setValueAtTime(0.2 + idx * 0.1, ctx.currentTime);
      lfoGain.gain.setValueAtTime(2.0, ctx.currentTime);
      lfo.connect(osc.frequency);
      lfo.start();

      noteGain.gain.setValueAtTime(0.04, ctx.currentTime);
      osc.connect(noteGain);
      noteGain.connect(masterGain);
      osc.start();
    });

    masterGain.connect(ctx.destination);
    radioGain = masterGain;
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

export function stopCivicRadio() {
  if (radioGain) {
    try {
      radioGain.disconnect();
    } catch {
      // ignore
    }
    radioGain = null;
  }
  if (radioOsc) {
    try {
      radioOsc.stop();
    } catch {
      // ignore
    }
    radioOsc = null;
  }
}

export function startSOSBeaconTone() {
  stopSOSBeaconTone();
  try {
    const ctx = getAudioContext();
    const playBeep = () => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.setValueAtTime(440, ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    };

    playBeep();
    sosInterval = window.setInterval(playBeep, 1600);
  } catch {
    // audio blocked
  }
}

export function stopSOSBeaconTone() {
  if (sosInterval !== null) {
    clearInterval(sosInterval);
    sosInterval = null;
  }
}

// Plays a low-frequency seismic earth rumble tone
export function playSeismicRumble(durationSeconds = 3) {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(45, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + durationSeconds);

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationSeconds);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + durationSeconds);
  } catch {
    // Audio blocked
  }
}

// Plays a sharp seismic hazard alert chime
export function playSeismicAlarmTone() {
  try {
    const ctx = getAudioContext();
    [660, 520, 660, 520].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);

      gain.gain.setValueAtTime(0.06, ctx.currentTime + idx * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.12 + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + idx * 0.12);
      osc.stop(ctx.currentTime + idx * 0.12 + 0.1);
    });
  } catch {
    // Audio blocked
  }
}
