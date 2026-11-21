// Bootstrap: wires the DOM to the game, keeps the HUD in sync, shows the overlays
// (title, level clear, win, time up) and runs the frame loop.
import { SpotGame, STATE_TITLE, STATE_PLAY, STATE_LEVEL_DONE, STATE_WIN, STATE_OVER } from './game.js';
import { Renderer } from './render.js';
import { SCENES } from './scenes.js';
import { stageShot } from './shots.js';
import { setMuted, isMuted } from './audio.js';

const $ = (id) => document.getElementById(id);

const leftCanvas = $('canvas-left');
const rightCanvas = $('canvas-right');
const renderer = new Renderer(leftCanvas, rightCanvas);

let overlayAction = null;

function formatTime(seconds) {
  const s = Math.max(0, Math.ceil(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

function showOverlay({ kicker, title, text, stats, btnLabel, hint, action }) {
  $('overlay-kicker').textContent = kicker;
  $('overlay-title').textContent = title;
  $('overlay-text').textContent = text;
  $('overlay-stats').innerHTML = stats
    .map(([label, value]) => `<div class="stat"><span class="stat-label">${label}</span><span class="stat-value">${value}</span></div>`)
    .join('');
  $('overlay-btn').textContent = btnLabel;
  $('overlay-hint').textContent = hint;
  overlayAction = action;
  $('overlay').classList.remove('hidden');
}

function hideOverlay() {
  $('overlay').classList.add('hidden');
  overlayAction = null;
}

function syncHud(game) {
  $('level-name').textContent = game.scene.name;
  $('found-count').textContent = String(game.foundCount);
  $('remain-count').textContent = game.remaining === 0
    ? 'Semua ketemu!'
    : `Sisa ${game.remaining} perbedaan`;
  $('time-text').textContent = formatTime(game.timeLeft);
  $('time-fill').style.width = `${Math.max(0, (game.timeLeft / game.scene.timeLimit) * 100)}%`;
  $('hud-time').classList.toggle('low', game.timeLeft <= 30 && game.state === STATE_PLAY);
  $('score-text').textContent = String(game.score);
  $('combo-text').textContent = `Kombo ×${game.combo}`;
  $('hint-count').textContent = String(game.hintsLeft);
  $('hint-btn').disabled = game.state !== STATE_PLAY || game.hintsLeft <= 0;
  document.querySelectorAll('#level-dots .dot').forEach((dot, i) => {
    dot.classList.toggle('done', i < game.levelIndex || (game.state === STATE_WIN && i < SCENES.length));
    dot.classList.toggle('active', i === game.levelIndex && game.state !== STATE_TITLE);
  });
}

function syncOverlay(game) {
  if (game.state === STATE_PLAY) {
    hideOverlay();
    return;
  }
  if (game.state === STATE_TITLE) {
    showOverlay({
      kicker: 'Selamat datang di',
      title: 'Spot the Difference',
      text: 'Dua gambar nyaris sama — sepuluh perbedaan tersembunyi di antaranya. Temukan semuanya sebelum waktu habis, lewati tiga dunia: Pasar Malam, Stasiun Orbit-9, dan Taman Karang.',
      stats: [
        ['LEVEL', '3 dunia'],
        ['PERBEDAAN', '30 total'],
        ['SKOR TERBAIK', String(game.best)],
      ],
      btnLabel: '▶  MULAI BERMAIN',
      hint: 'Klik perbedaan di gambar A atau B — keduanya bisa. Klik salah: −5 detik.',
      action: () => game.startGame(),
    });
    return;
  }
  if (game.state === STATE_LEVEL_DONE) {
    showOverlay({
      kicker: `${game.scene.name} selesai`,
      title: 'Level Selesai!',
      text: `Semua ${game.totalDiffs} perbedaan ketemu. Bonus waktu +${game.levelTimes[game.levelIndex] * 5} poin. Dunia berikutnya lebih sulit — perbedaannya makin licik.`,
      stats: [
        ['SKOR', String(game.score)],
        ['SISA WAKTU', formatTime(game.levelTimes[game.levelIndex])],
        ['LEVEL BERIKUTNYA', SCENES[game.levelIndex + 1].name],
      ],
      btnLabel: 'Lanjut ke Level Berikutnya  →',
      hint: 'Tekan Enter untuk lanjut.',
      action: () => game.nextLevel(),
    });
    return;
  }
  if (game.state === STATE_WIN) {
    const stars = '★'.repeat(game.starCount()) + '☆'.repeat(3 - game.starCount());
    showOverlay({
      kicker: 'Semua dunia selesai',
      title: `${stars}  Kamu Menang!`,
      text: 'Tiga puluh perbedaan, tiga dunia, nol yang lolos. Mata elang sejati — pasar malam, orbit, dan karang sudah tak punya rahasia lagi buatmu.',
      stats: [
        ['SKOR AKHIR', String(game.score)],
        ['AKURASI', `${Math.round((game.finds / Math.max(1, game.finds + game.misses)) * 100)}%`],
        ['KOMBO TERBAIK', `×${game.bestCombo}`],
      ],
      btnLabel: '↻  Main Lagi',
      hint: `Skor terbaikmu: ${game.best}. Coba kalahkan!`,
      action: () => game.startGame(),
    });
    return;
  }
  if (game.state === STATE_OVER) {
    showOverlay({
      kicker: 'Waktu habis',
      title: 'Belum Ketemu Semua…',
      text: `Waktu habis di ${game.scene.name} — ${game.foundCount} dari ${game.totalDiffs} perbedaan sudah ketemu. Yang ${game.remaining} sisanya masih bersembunyi di sana.`,
      stats: [
        ['KETEMU', `${game.foundCount} / ${game.totalDiffs}`],
        ['SKOR', String(game.score)],
        ['SKOR TERBAIK', String(game.best)],
      ],
      btnLabel: '↻  Coba Lagi',
      hint: 'Pakai petunjuk (H) kalau ada perbedaan yang bandel.',
      action: () => game.restartLevel(),
    });
  }
}

const game = new SpotGame(() => {
  syncHud(game);
  syncOverlay(game);
});

function onCanvasClick(event) {
  const result = game.clickAt(event.currentTarget, event.clientX, event.clientY);
  if (result && result.kind === 'miss') {
    for (const canvas of [leftCanvas, rightCanvas]) {
      canvas.classList.remove('shake');
      void canvas.offsetWidth;
      canvas.classList.add('shake');
    }
  }
}

leftCanvas.addEventListener('click', onCanvasClick);
rightCanvas.addEventListener('click', onCanvasClick);

$('hint-btn').addEventListener('click', () => game.useHint());
$('restart-btn').addEventListener('click', () => {
  if (game.state === STATE_PLAY || game.state === STATE_OVER) game.restartLevel();
});
$('sound-btn').addEventListener('click', () => {
  setMuted(!isMuted());
  $('sound-btn').textContent = isMuted() ? '♪ Senyap' : '♪ Suara';
  $('sound-btn').classList.toggle('off', isMuted());
});
$('overlay-btn').addEventListener('click', () => {
  if (overlayAction) overlayAction();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'h' || event.key === 'H') game.useHint();
  else if (event.key === 'm' || event.key === 'M') $('sound-btn').click();
  else if (event.key === 'r' || event.key === 'R') {
    if (game.state === STATE_PLAY || game.state === STATE_OVER) game.restartLevel();
  } else if (event.key === 'Enter') {
    if (overlayAction && game.state !== STATE_TITLE) overlayAction();
  }
});

// Frame loop: clock, particles, then draw both panels.
let lastNow = performance.now();
function frame(now) {
  const dt = Math.min(0.1, (now - lastNow) / 1000);
  lastNow = now;
  game.tick(now);
  game.updateParticles(dt);
  renderer.draw(game, now);
  syncHud(game);
  requestAnimationFrame(frame);
}

syncHud(game);
syncOverlay(game);
requestAnimationFrame(frame);

// Screenshot staging (?shot=cover|level2|hint|win) — plays the real rules forward,
// then flags readiness for whoever is taking the picture.
const shot = new URLSearchParams(window.location.search).get('shot');
if (shot) {
  stageShot(game, shot);
  syncHud(game);
  syncOverlay(game);
}
window.__spotdiff = { game, stageShot };
window.__shotReady = true;
