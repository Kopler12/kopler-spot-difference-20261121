// All sound in this game is synthesised live with WebAudio — no audio files, no network.
// Every effect is a few oscillators shaped by a gain envelope.
let audioCtx = null;
let muted = false;

export function isMuted() {
  return muted;
}

export function setMuted(value) {
  muted = value;
}

function ctx() {
  if (audioCtx === null) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    audioCtx = new AC();
  }
  if (audioCtx.state === 'suspended') audioCtx.resume().catch(() => {});
  return audioCtx;
}

/** Unlock audio on the first user gesture; headless runs just skip it. */
export function unlockAudio() {
  try {
    ctx();
  } catch {
    /* audio unavailable — the game stays silent and playable */
  }
}

function tone(freq, startAt, dur, type = 'sine', vol = 0.16) {
  const ac = ctx();
  if (ac === null || muted) return;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ac.currentTime + startAt);
  gain.gain.setValueAtTime(0.0001, ac.currentTime + startAt);
  gain.gain.exponentialRampToValueAtTime(vol, ac.currentTime + startAt + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + startAt + dur);
  osc.connect(gain).connect(ac.destination);
  osc.start(ac.currentTime + startAt);
  osc.stop(ac.currentTime + startAt + dur + 0.05);
}

export function playClick() {
  tone(620, 0, 0.07, 'triangle', 0.1);
}

export function playFound() {
  // A bright little arpeggio: the satisfying "ding" on every find.
  tone(523.25, 0, 0.16, 'sine', 0.18);
  tone(659.25, 0.07, 0.16, 'sine', 0.18);
  tone(783.99, 0.14, 0.22, 'sine', 0.2);
  tone(1046.5, 0.21, 0.3, 'triangle', 0.12);
}

export function playWrong() {
  tone(160, 0, 0.18, 'sawtooth', 0.12);
  tone(110, 0.09, 0.22, 'sawtooth', 0.1);
}

export function playHint() {
  tone(880, 0, 0.12, 'sine', 0.12);
  tone(1174.66, 0.1, 0.18, 'sine', 0.12);
}

export function playTick() {
  tone(980, 0, 0.05, 'square', 0.05);
}

export function playLevelClear() {
  const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5];
  notes.forEach((f, i) => tone(f, i * 0.09, 0.28, 'triangle', 0.16));
}

export function playWin() {
  const notes = [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5, 1318.5, 1567.98];
  notes.forEach((f, i) => tone(f, i * 0.11, 0.32, 'triangle', 0.17));
  tone(261.63, 0, 0.9, 'sine', 0.08);
}

export function playGameOver() {
  const notes = [392, 329.63, 261.63, 196];
  notes.forEach((f, i) => tone(f, i * 0.16, 0.3, 'sine', 0.14));
}
