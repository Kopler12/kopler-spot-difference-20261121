// Game state and rules: levels, clicks, timer, hints, scoring, win and lose.
// This file knows nothing about pixels — render.js draws what it reads here.
import { SCENES } from './scenes.js';
import {
  playClick, playFound, playWrong, playHint, playTick,
  playLevelClear, playWin, playGameOver, unlockAudio,
} from './audio.js';

export const STATE_TITLE = 'title';
export const STATE_PLAY = 'play';
export const STATE_LEVEL_DONE = 'leveldone';
export const STATE_WIN = 'win';
export const STATE_OVER = 'over';

const HINTS_PER_LEVEL = 3;
const WRONG_PENALTY_SECONDS = 5;
const FIND_POINTS = 100;
const HINT_COST = 25;

export class SpotGame {
  constructor(onChange) {
    this.onChange = onChange;
    this.levelIndex = 0;
    this.state = STATE_TITLE;
    this.found = new Set();
    this.foundOrder = [];
    this.score = 0;
    this.combo = 1;
    this.bestCombo = 1;
    this.hintsLeft = HINTS_PER_LEVEL;
    this.timeLeft = SCENES[0].timeLimit;
    this.misses = 0;
    this.finds = 0;
    this.levelScores = [0, 0, 0];
    this.levelTimes = [0, 0, 0];
    this.particles = [];
    this.missMarks = [];
    this.hintTarget = null;
    this.hintUntil = 0;
    this.lastTickSecond = -1;
    this.best = 0;
    try {
      this.best = Number(window.localStorage.getItem('spotdiff-best') ?? 0) || 0;
    } catch {
      this.best = 0;
    }
    this._lastTickAt = 0;
  }

  get scene() {
    return SCENES[this.levelIndex];
  }

  get totalDiffs() {
    return this.scene.diffs.length;
  }

  get foundCount() {
    return this.found.size;
  }

  get remaining() {
    return this.totalDiffs - this.found.size;
  }

  emit() {
    if (this.onChange) this.onChange();
  }

  startLevel(index) {
    this.levelIndex = index;
    this.state = STATE_PLAY;
    this.found = new Set();
    this.foundOrder = [];
    this.combo = 1;
    this.hintsLeft = HINTS_PER_LEVEL;
    this.timeLeft = this.scene.timeLimit;
    this.misses = 0;
    this.hintTarget = null;
    this.hintUntil = 0;
    this.lastTickSecond = -1;
    this._lastTickAt = performance.now();
    this.emit();
  }

  startGame() {
    unlockAudio();
    this.score = 0;
    this.finds = 0;
    this.bestCombo = 1;
    this.levelScores = [0, 0, 0];
    this.levelTimes = [0, 0, 0];
    this.startLevel(0);
  }

  restartLevel() {
    unlockAudio();
    const refund = this.levelScores[this.levelIndex];
    this.score = Math.max(0, this.score - refund);
    this.levelScores[this.levelIndex] = 0;
    this.startLevel(this.levelIndex);
  }

  /** Advance the clock; called every animation frame while playing. */
  tick(now) {
    if (this.state !== STATE_PLAY) return;
    const dt = (now - this._lastTickAt) / 1000;
    this._lastTickAt = now;
    if (dt <= 0 || dt > 1) return;
    this.timeLeft -= dt;
    const whole = Math.ceil(this.timeLeft);
    if (whole <= 10 && whole !== this.lastTickSecond && whole > 0) {
      this.lastTickSecond = whole;
      playTick();
    }
    if (this.timeLeft <= 0) {
      this.timeLeft = 0;
      this.state = STATE_OVER;
      playGameOver();
      this.emit();
    }
  }

  /** Convert a canvas click to scene coordinates and resolve it. */
  clickAt(canvas, clientX, clientY) {
    if (this.state !== STATE_PLAY) return null;
    unlockAudio();
    const rect = canvas.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 620;
    const y = ((clientY - rect.top) / rect.height) * 440;
    return this.clickScene(x, y);
  }

  /** The real rule: is (x, y) on an unfound difference? Shared by mouse and shots. */
  clickScene(x, y) {
    let hit = null;
    let bestDist = Infinity;
    for (const diff of this.scene.diffs) {
      if (this.found.has(diff.id)) continue;
      const d = Math.hypot(x - diff.x, y - diff.y);
      if (d <= diff.r + 6 && d < bestDist) {
        hit = diff;
        bestDist = d;
      }
    }
    if (hit) {
      this.found.add(hit.id);
      this.foundOrder.push(hit.id);
      this.finds += 1;
      const gained = FIND_POINTS * this.combo;
      this.score += gained;
      this.levelScores[this.levelIndex] += gained;
      this.bestCombo = Math.max(this.bestCombo, this.combo);
      this.spawnSparks(hit.x, hit.y);
      playFound();
      this.combo = Math.min(3, this.combo + 1);
      if (this.found.size === this.totalDiffs) this.completeLevel();
      this.emit();
      return { kind: 'found', diff: hit, gained };
    }
    this.misses += 1;
    this.combo = 1;
    this.timeLeft = Math.max(0, this.timeLeft - WRONG_PENALTY_SECONDS);
    this.missMarks.push({ x, y, at: performance.now() });
    playWrong();
    this.emit();
    return { kind: 'miss', x, y };
  }

  spawnSparks(x, y) {
    for (let i = 0; i < 16; i += 1) {
      const angle = (i / 16) * Math.PI * 2 + Math.random() * 0.4;
      const speed = 40 + Math.random() * 90;
      this.particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 30,
        life: 0.7,
        maxLife: 0.7,
        size: 2.5 + Math.random() * 3.5,
        color: ['#ffd75e', '#ff9a3d', '#7ee081', '#ff5a8a'][i % 4],
      });
    }
  }

  updateParticles(dt) {
    for (const p of this.particles) {
      p.life -= dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 160 * dt;
    }
    this.particles = this.particles.filter((p) => p.life > 0);
    const now = performance.now();
    this.missMarks = this.missMarks.filter((m) => now - m.at < 900);
    if (this.hintTarget && now > this.hintUntil) this.hintTarget = null;
  }

  useHint() {
    if (this.state !== STATE_PLAY || this.hintsLeft <= 0 || this.remaining === 0) return null;
    unlockAudio();
    const unfound = this.scene.diffs.filter((d) => !this.found.has(d.id));
    const pick = unfound[Math.floor(Math.random() * unfound.length)];
    this.hintsLeft -= 1;
    this.score = Math.max(0, this.score - HINT_COST);
    this.hintTarget = pick;
    this.hintUntil = performance.now() + 3000;
    playHint();
    this.emit();
    return pick;
  }

  completeLevel() {
    const timeBonus = Math.round(this.timeLeft) * 5;
    this.score += timeBonus;
    this.levelScores[this.levelIndex] += timeBonus;
    this.levelTimes[this.levelIndex] = Math.round(this.timeLeft);
    if (this.levelIndex >= SCENES.length - 1) {
      this.state = STATE_WIN;
      if (this.score > this.best) {
        this.best = this.score;
        try {
          window.localStorage.setItem('spotdiff-best', String(this.best));
        } catch {
          /* storage unavailable — best score just is not kept */
        }
      }
      playWin();
    } else {
      this.state = STATE_LEVEL_DONE;
      playLevelClear();
    }
  }

  nextLevel() {
    unlockAudio();
    this.startLevel(this.levelIndex + 1);
  }

  backToTitle() {
    this.state = STATE_TITLE;
    this.levelIndex = 0;
    this.emit();
  }

  /** Star rating for the final screen: time left, accuracy and combo. */
  starCount() {
    const accuracy = this.finds / Math.max(1, this.finds + this.misses);
    const totalTimeLeft = this.levelTimes.reduce((a, b) => a + b, 0);
    let stars = 1;
    if (accuracy >= 0.8 && totalTimeLeft >= 60) stars = 3;
    else if (accuracy >= 0.6 && totalTimeLeft >= 25) stars = 2;
    return stars;
  }
}
