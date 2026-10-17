// Procedural audio engine. No audio assets required — everything is
// synthesized via Web Audio API so the game ships with full ambience and SFX
// out of the box and works offline.

let ctx = null;
let master = null;
let musicGain = null;
let sfxGain = null;
let currentLoop = null;
let muted = false;

const WORLD_KEYS = {
  origin: { root: 220, scale: [0, 2, 3, 5, 7, 10], tempo: 0.4, color: 'warm' },
  school: { root: 246.94, scale: [0, 2, 4, 7, 9], tempo: 0.55, color: 'bright' },
  bca: { root: 261.63, scale: [0, 3, 5, 7, 10], tempo: 0.7, color: 'cool' },
  mca: { root: 277.18, scale: [0, 2, 5, 7, 10], tempo: 0.65, color: 'cool' },
  mern: { root: 293.66, scale: [0, 3, 5, 7, 10], tempo: 0.9, color: 'electric' },
  company: { root: 311.13, scale: [0, 2, 4, 7, 9], tempo: 0.7, color: 'warm' },
  projects: { root: 329.63, scale: [0, 2, 5, 7, 9], tempo: 0.85, color: 'electric' },
  future: { root: 349.23, scale: [0, 2, 3, 7, 10], tempo: 0.5, color: 'ethereal' },
};

function ensure() {
  if (ctx) return ctx;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  ctx = new AC();
  master = ctx.createGain();
  master.gain.value = 0.6;
  master.connect(ctx.destination);

  musicGain = ctx.createGain();
  musicGain.gain.value = 0.35;
  musicGain.connect(master);

  sfxGain = ctx.createGain();
  sfxGain.gain.value = 0.6;
  sfxGain.connect(master);
  return ctx;
}

export function unlockAudio() {
  const c = ensure();
  if (!c) return;
  if (c.state === 'suspended') c.resume();
}

export function setMuted(v) {
  muted = !!v;
  if (master) master.gain.setTargetAtTime(muted ? 0 : 0.6, ctx.currentTime, 0.05);
}

export function isMuted() {
  return muted;
}

function makeReverb(seconds = 2.2) {
  const c = ctx;
  const sampleRate = c.sampleRate;
  const length = sampleRate * seconds;
  const buf = c.createBuffer(2, length, sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const data = buf.getChannelData(ch);
    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2.5);
    }
  }
  const conv = c.createConvolver();
  conv.buffer = buf;
  return conv;
}

let reverb = null;
function reverbNode() {
  if (!reverb) reverb = makeReverb(2.4);
  return reverb;
}

function midiHz(root, semis) {
  return root * Math.pow(2, semis / 12);
}

function playNote({
  freq,
  start,
  dur = 1.6,
  type = 'sine',
  gain = 0.18,
  filter = 1800,
  detune = 0,
  destination,
}) {
  const c = ctx;
  const osc = c.createOscillator();
  osc.type = type;
  osc.frequency.value = freq;
  osc.detune.value = detune;

  const env = c.createGain();
  env.gain.setValueAtTime(0, start);
  env.gain.linearRampToValueAtTime(gain, start + 0.05);
  env.gain.exponentialRampToValueAtTime(0.0001, start + dur);

  const filt = c.createBiquadFilter();
  filt.type = 'lowpass';
  filt.frequency.value = filter;
  filt.Q.value = 1.1;

  const send = c.createGain();
  send.gain.value = 0.25;

  osc.connect(filt);
  filt.connect(env);
  env.connect(destination || musicGain);
  env.connect(send);
  send.connect(reverbNode());
  reverbNode().connect(destination || musicGain);

  osc.start(start);
  osc.stop(start + dur + 0.1);
}

export function startWorldMusic(worldId) {
  const c = ensure();
  if (!c) return;
  stopMusic();

  const key = WORLD_KEYS[worldId] || WORLD_KEYS.origin;
  const startedAt = c.currentTime + 0.1;
  let beat = 0;

  // Schedule notes on a rolling timer.
  const tick = () => {
    if (!ctx || currentLoop !== tickRef) return;
    const t = ctx.currentTime;
    const lookahead = 1.2;
    while (beat * key.tempo + startedAt < t + lookahead) {
      const noteStart = startedAt + beat * key.tempo;
      const step = key.scale[Math.floor(Math.random() * key.scale.length)];
      const octave = Math.random() < 0.7 ? 0 : 12;
      const freq = midiHz(key.root, step + octave);

      // Pad
      playNote({
        freq,
        start: noteStart,
        dur: key.tempo * 4,
        type: key.color === 'electric' ? 'sawtooth' : 'triangle',
        gain: 0.06,
        filter: 900,
        detune: -5,
      });
      // Bass
      if (beat % 4 === 0) {
        playNote({
          freq: freq / 2,
          start: noteStart,
          dur: key.tempo * 3,
          type: 'sine',
          gain: 0.18,
          filter: 380,
        });
      }
      // Sparkle
      if (Math.random() < 0.4) {
        playNote({
          freq: freq * 2,
          start: noteStart + key.tempo * 0.5,
          dur: key.tempo * 0.8,
          type: 'sine',
          gain: 0.05,
          filter: 4200,
        });
      }
      beat++;
    }
  };

  const tickRef = setInterval(tick, 400);
  currentLoop = tickRef;
  tick();
}

export function stopMusic() {
  if (currentLoop) clearInterval(currentLoop);
  currentLoop = null;
}

// ------- SFX --------

function blip({ freq = 880, dur = 0.15, type = 'square', gain = 0.2, sweep = 0 }) {
  const c = ensure();
  if (!c || muted) return;
  const t = c.currentTime;
  const osc = c.createOscillator();
  osc.type = type;
  osc.frequency.value = freq;
  if (sweep) osc.frequency.exponentialRampToValueAtTime(Math.max(20, freq + sweep), t + dur);
  const env = c.createGain();
  env.gain.setValueAtTime(0, t);
  env.gain.linearRampToValueAtTime(gain, t + 0.005);
  env.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(env);
  env.connect(sfxGain);
  osc.start();
  osc.stop(t + dur + 0.05);
}

export const sfx = {
  ui() { blip({ freq: 720, dur: 0.08, type: 'square', gain: 0.15 }); },
  pickup() { blip({ freq: 880, dur: 0.18, type: 'triangle', sweep: 700 }); },
  unlock() {
    blip({ freq: 660, dur: 0.18, type: 'sawtooth', sweep: 300 });
    setTimeout(() => blip({ freq: 990, dur: 0.22, type: 'sine', sweep: 200 }), 100);
  },
  achievement() {
    [880, 1108, 1318, 1760].forEach((f, i) =>
      setTimeout(() => blip({ freq: f, dur: 0.15, type: 'triangle', gain: 0.18 }), i * 90)
    );
  },
  portal() {
    blip({ freq: 220, dur: 0.4, type: 'sawtooth', sweep: 600 });
  },
  jump() { blip({ freq: 320, dur: 0.12, type: 'square', sweep: 400 }); },
  footstep() {
    const c = ensure();
    if (!c || muted) return;
    const t = c.currentTime;
    const noise = c.createBufferSource();
    const buf = c.createBuffer(1, c.sampleRate * 0.08, c.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
    noise.buffer = buf;
    const filt = c.createBiquadFilter();
    filt.type = 'lowpass';
    filt.frequency.value = 600;
    const env = c.createGain();
    env.gain.setValueAtTime(0.08, t);
    env.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
    noise.connect(filt);
    filt.connect(env);
    env.connect(sfxGain);
    noise.start();
  },
};
