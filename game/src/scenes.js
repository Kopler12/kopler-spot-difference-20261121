// The three original scenes. Each scene draws the SAME picture twice: the left panel with
// no differences applied, the right panel with all ten. A difference is a small, deliberate
// change keyed by its id in the `applied` set, so the two panels differ in exactly ten spots.
// All art is original, drawn with canvas paths — no image files anywhere.
import { rr, circle, ellipse, poly, star, vgrad, text, glow } from './helpers.js';

const W = 620;
const H = 440;

/* ------------------------------------------------------------------ */
/* Scene 1 — Pasar Malam Lampion (Lantern Night Market)                */
/* ------------------------------------------------------------------ */
const MARKET_STARS = [
  [30, 60], [90, 35], [150, 70], [230, 30], [300, 55], [370, 28], [430, 60],
  [500, 34], [580, 60], [600, 30], [60, 100], [260, 95], [340, 80], [470, 95],
];

function drawMarketLantern(ctx, x, y, color) {
  ctx.strokeStyle = '#8a6d3b';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(x, 0);
  ctx.lineTo(x, y - 20);
  ctx.stroke();
  ctx.fillStyle = '#d4a017';
  ctx.fillRect(x - 7, y - 22, 14, 5);
  ctx.fillStyle = color;
  ellipse(ctx, x, y, 15, 19);
  ctx.fill();
  ctx.strokeStyle = 'rgba(120,20,20,.55)';
  ctx.lineWidth = 1.5;
  for (let i = -1; i <= 1; i += 1) {
    ctx.beginPath();
    ctx.ellipse(x, y, 15 - Math.abs(i) * 4, 19, 0, -0.9, 0.9);
    ctx.stroke();
  }
  ctx.fillStyle = '#d4a017';
  ctx.fillRect(x - 7, y + 17, 14, 5);
  glow(ctx, x, y, 34, color, 0.35);
}

function drawMarket(ctx, applied) {
  // Dusk sky.
  vgrad(ctx, W, H, [[0, '#160b2e'], [0.55, '#4a1e5c'], [0.72, '#c65a7a'], [1, '#ff9a5a']]);
  // Stars (one of them is a difference).
  ctx.fillStyle = '#fff6d8';
  for (const [sx, sy] of MARKET_STARS) {
    if (applied.has('star-gone') && sx === 500 && sy === 34) continue;
    star(ctx, sx, sy, 5, 2.2);
    ctx.fill();
  }
  // Moon with craters.
  ctx.fillStyle = '#ffe9a8';
  circle(ctx, 540, 52, 26);
  ctx.fill();
  ctx.fillStyle = '#e8c87a';
  circle(ctx, 530, 45, 4); ctx.fill();
  circle(ctx, 550, 60, 5); ctx.fill();
  circle(ctx, 545, 40, 3); ctx.fill();
  glow(ctx, 540, 52, 60, '#ffe9a8', 0.3);

  // Distant houses with lit windows (one window is a difference).
  ctx.fillStyle = '#241338';
  ctx.fillRect(15, 272, 60, 40);
  ctx.fillRect(90, 282, 48, 30);
  ctx.fillRect(545, 278, 60, 34);
  ctx.fillStyle = applied.has('window-dark') ? '#1c1030' : '#ffd75e';
  ctx.fillRect(40, 282, 11, 13);
  ctx.fillStyle = '#ffd75e';
  ctx.fillRect(104, 290, 10, 11);
  ctx.fillRect(568, 288, 11, 12);

  // Ground and puddle.
  ctx.fillStyle = '#3a2a55';
  ctx.fillRect(0, 368, W, 72);
  ctx.fillStyle = '#463366';
  for (let gx = 0; gx < W; gx += 46) {
    ellipse(ctx, gx + 18, 392 + (gx % 92 === 0 ? 14 : 0), 20, 8);
    ctx.fill();
  }
  ctx.fillStyle = '#7a5fb0';
  ellipse(ctx, 300, 414, 56, 10);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,179,64,.5)';
  ellipse(ctx, 300, 412, 34, 4);
  ctx.fill();

  // String lights across the top.
  ctx.strokeStyle = '#2c1a4d';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 16);
  ctx.quadraticCurveTo(310, 44, 620, 20);
  ctx.stroke();
  const bulbColors = ['#ffd75e', '#ff5a6e', '#39d0c4', '#ff9a3d'];
  for (let i = 0; i < 14; i += 1) {
    const t = i / 13;
    const bx = t * 620;
    const by = (1 - t) * (1 - t) * 16 + 2 * (1 - t) * t * 44 + t * t * 20 + 8;
    ctx.fillStyle = bulbColors[i % 4];
    circle(ctx, bx, by, 5);
    ctx.fill();
    glow(ctx, bx, by, 12, bulbColors[i % 4], 0.5);
  }

  // Paper lanterns (one changes colour).
  const lanternXs = [70, 180, 290, 400, 510];
  lanternXs.forEach((lx, i) => {
    const color = applied.has('lantern-green') && i === 1 ? '#39d353' : '#ff4d4d';
    drawMarketLantern(ctx, lx, 92, color);
  });

  // Bunting flags (one changes colour).
  ctx.strokeStyle = '#2c1a4d';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 118);
  ctx.quadraticCurveTo(310, 152, 620, 100);
  ctx.stroke();
  const flagColors = ['#ffd75e', '#ff5a6e', '#39d0c4', '#ff9a3d'];
  for (let i = 0; i < 15; i += 1) {
    const t = i / 14;
    const fx = 20 + t * 580;
    const fy = (1 - t) * (1 - t) * 118 + 2 * (1 - t) * t * 152 + t * t * 100;
    let color = flagColors[i % 4];
    if (applied.has('flag-purple') && Math.abs(fx - 420) < 22) color = '#9b59d0';
    ctx.fillStyle = color;
    poly(ctx, [[fx - 9, fy + 2], [fx + 9, fy + 2], [fx, fy + 20]]);
    ctx.fill();
  }

  // ---- Left stall: sate ----
  ctx.fillStyle = '#5a3a22';
  ctx.fillRect(58, 225, 8, 78);
  ctx.fillRect(256, 225, 8, 78);
  // Striped awning.
  for (let i = 0; i < 8; i += 1) {
    ctx.fillStyle = i % 2 === 0 ? '#d93a3a' : '#f6ead8';
    poly(ctx, [[50 + i * 27.5, 190], [50 + (i + 1) * 27.5, 190], [48 + (i + 1) * 27, 226], [48 + i * 27, 226]]);
    ctx.fill();
  }
  // Sign board (its wording is a difference).
  ctx.fillStyle = '#7a4a21';
  rr(ctx, 95, 148, 130, 32, 6);
  ctx.fill();
  ctx.strokeStyle = '#d4a017';
  ctx.lineWidth = 2;
  rr(ctx, 95, 148, 130, 32, 6);
  ctx.stroke();
  text(ctx, applied.has('sign-soto') ? 'SOTO AYAM' : 'SATE AYAM', 160, 165, { font: '900 17px "Trebuchet MS", sans-serif', color: '#ffe9a8' });
  // Vendor: conical hat (its band is a difference), head, apron.
  ctx.fillStyle = '#f2c79b';
  circle(ctx, 160, 258, 16);
  ctx.fill();
  ctx.fillStyle = '#2f8f7a';
  rr(ctx, 138, 276, 44, 30, 8);
  ctx.fill();
  ctx.fillStyle = '#e8c96a';
  poly(ctx, [[132, 246], [188, 246], [160, 214]]);
  ctx.fill();
  if (!applied.has('hat-band')) {
    ctx.fillStyle = '#d93a3a';
    poly(ctx, [[141, 238], [179, 238], [176, 231], [144, 231]]);
    ctx.fill();
  }
  // Counter and grill with skewers (one skewer is a difference).
  ctx.fillStyle = '#8a5a2e';
  ctx.fillRect(55, 302, 210, 68);
  ctx.fillStyle = '#a9743f';
  ctx.fillRect(55, 302, 210, 10);
  ctx.fillStyle = '#3a3a3a';
  rr(ctx, 148, 284, 104, 18, 4);
  ctx.fill();
  for (let i = 0; i < 5; i += 1) {
    if (applied.has('skewer-gone') && i === 3) continue;
    const sx = 160 + i * 20;
    ctx.strokeStyle = '#d8c9a8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(sx, 282);
    ctx.lineTo(sx, 300);
    ctx.stroke();
    ctx.fillStyle = '#c65a3a';
    circle(ctx, sx, 291, 4.5);
    ctx.fill();
  }
  // Cat asleep on the stall roof (it vanishes in the other panel).
  if (!applied.has('cat-gone')) {
    ctx.fillStyle = '#2e2a38';
    ellipse(ctx, 88, 182, 17, 11);
    ctx.fill();
    circle(ctx, 100, 172, 9);
    ctx.fill();
    poly(ctx, [[94, 166], [97, 157], [101, 165]]);
    ctx.fill();
    poly(ctx, [[103, 165], [107, 157], [109, 166]]);
    ctx.fill();
    ctx.strokeStyle = '#2e2a38';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(72, 184);
    ctx.quadraticCurveTo(60, 176, 66, 166);
    ctx.stroke();
  }

  // ---- Right stall: es teh ----
  for (let i = 0; i < 8; i += 1) {
    ctx.fillStyle = i % 2 === 0 ? '#1f8a80' : '#f6ead8';
    poly(ctx, [[345 + i * 28.75, 190], [345 + (i + 1) * 28.75, 190], [343 + (i + 1) * 28, 226], [343 + i * 28, 226]]);
    ctx.fill();
  }
  ctx.fillStyle = '#5a3a22';
  ctx.fillRect(353, 225, 8, 78);
  ctx.fillRect(561, 225, 8, 78);
  ctx.fillStyle = '#7a4a21';
  rr(ctx, 388, 148, 146, 32, 6);
  ctx.fill();
  ctx.strokeStyle = '#39d0c4';
  ctx.lineWidth = 2;
  rr(ctx, 388, 148, 146, 32, 6);
  ctx.stroke();
  text(ctx, 'ES TEH MANIS', 461, 165, { font: '900 15px "Trebuchet MS", sans-serif', color: '#c8f5ef' });
  ctx.fillStyle = '#8a5a2e';
  ctx.fillRect(350, 302, 220, 68);
  ctx.fillStyle = '#a9743f';
  ctx.fillRect(350, 302, 220, 10);
  // Glass jars of coloured drinks.
  const jarColors = ['#ff9a3d', '#39d0c4', '#ff5a8a'];
  jarColors.forEach((c, i) => {
    const jx = 382 + i * 48;
    ctx.fillStyle = 'rgba(255,255,255,.25)';
    rr(ctx, jx, 268, 34, 34, 6);
    ctx.fill();
    ctx.fillStyle = c;
    rr(ctx, jx + 3, 278, 28, 21, 4);
    ctx.fill();
  });
  // Teapot.
  ctx.fillStyle = '#c8c8d8';
  ellipse(ctx, 532, 292, 20, 13);
  ctx.fill();
  ctx.fillStyle = '#9a9ab0';
  rr(ctx, 524, 276, 16, 8, 3);
  ctx.fill();

  // Bicycle with a basket of flowers (the flowers are a difference).
  ctx.strokeStyle = '#222';
  ctx.lineWidth = 3;
  circle(ctx, 482, 396, 18);
  ctx.stroke();
  circle(ctx, 548, 396, 18);
  ctx.stroke();
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(482, 396); ctx.lineTo(512, 366); ctx.lineTo(548, 396);
  ctx.moveTo(512, 366); ctx.lineTo(505, 352); ctx.lineTo(530, 352);
  ctx.moveTo(530, 352); ctx.lineTo(548, 396);
  ctx.stroke();
  ctx.fillStyle = '#8a5a2e';
  rr(ctx, 546, 344, 26, 18, 4);
  ctx.fill();
  if (!applied.has('flowers-gone')) {
    const flowerColors = ['#ff5a8a', '#ffd75e', '#ff9a3d'];
    flowerColors.forEach((c, i) => {
      ctx.fillStyle = c;
      circle(ctx, 552 + i * 7, 340 - (i % 2) * 5, 5);
      ctx.fill();
    });
  }

  // Balloon bunch (one balloon changes colour).
  ctx.strokeStyle = '#d8c9a8';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(585, 178); ctx.lineTo(575, 142);
  ctx.moveTo(585, 178); ctx.lineTo(595, 140);
  ctx.moveTo(585, 178); ctx.lineTo(585, 122);
  ctx.stroke();
  const balloonColors = ['#ff5a6e', applied.has('balloon-orange') ? '#ff9a3d' : '#4d8dff', '#ffd75e'];
  const balloonPos = [[573, 128], [595, 124], [585, 104]];
  balloonPos.forEach(([bx, by], i) => {
    ctx.fillStyle = balloonColors[i];
    ellipse(ctx, bx, by, 13, 16);
    ctx.fill();
    poly(ctx, [[bx - 4, by + 15], [bx + 4, by + 15], [bx, by + 21]]);
    ctx.fill();
  });
}

const MARKET_DIFFS = [
  { id: 'lantern-green', x: 180, y: 92, r: 26, label: 'Lampion merah jadi hijau' },
  { id: 'star-gone', x: 500, y: 34, r: 20, label: 'Bintang dekat bulan hilang' },
  { id: 'cat-gone', x: 88, y: 176, r: 26, label: 'Kucing di atap warung hilang' },
  { id: 'hat-band', x: 160, y: 232, r: 24, label: 'Pita merah topi penjual hilang' },
  { id: 'skewer-gone', x: 220, y: 291, r: 24, label: 'Satu tusuk sate hilang' },
  { id: 'sign-soto', x: 160, y: 165, r: 26, label: 'SATE AYAM jadi SOTO AYAM' },
  { id: 'flowers-gone', x: 556, y: 348, r: 24, label: 'Bunga di keranjang sepeda hilang' },
  { id: 'balloon-orange', x: 595, y: 124, r: 24, label: 'Balon biru jadi oranye' },
  { id: 'window-dark', x: 45, y: 288, r: 22, label: 'Jendela rumah jadi gelap' },
  { id: 'flag-purple', x: 420, y: 132, r: 22, label: 'Bendera kuning jadi ungu' },
];

/* ------------------------------------------------------------------ */
/* Scene 2 — Stasiun Orbit-9 (Space Station)                           */
/* ------------------------------------------------------------------ */
const VIEWPORT_STARS = [[120, 90], [135, 95], [170, 70], [215, 105], [240, 80], [150, 140], [205, 150]];

function drawFish(ctx, x, y, color, flip = false) {
  ctx.save();
  ctx.translate(x, y);
  if (flip) ctx.scale(-1, 1);
  ctx.fillStyle = color;
  ellipse(ctx, 0, 0, 14, 8);
  ctx.fill();
  poly(ctx, [[-12, 0], [-22, -7], [-22, 7]]);
  ctx.fill();
  ctx.fillStyle = '#10243a';
  circle(ctx, 7, -2, 2);
  ctx.fill();
  ctx.restore();
}

function drawStation(ctx, applied) {
  // Metal wall.
  vgrad(ctx, W, H, [[0, '#1b2836'], [1, '#0c131c']]);
  ctx.strokeStyle = 'rgba(255,255,255,.06)';
  ctx.lineWidth = 1;
  for (let x = 0; x <= W; x += 78) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 340); ctx.stroke();
  }
  ctx.beginPath(); ctx.moveTo(0, 340); ctx.lineTo(W, 340); ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,.14)';
  for (let x = 20; x < W; x += 78) {
    for (let y = 20; y < 330; y += 70) { circle(ctx, x, y, 2); ctx.fill(); }
  }

  // Big round viewport: space, Earth arc, stars (one star is a difference).
  ctx.fillStyle = '#5a6b7d';
  circle(ctx, 175, 155, 104);
  ctx.fill();
  ctx.fillStyle = '#42546a';
  circle(ctx, 175, 155, 96);
  ctx.fill();
  ctx.save();
  circle(ctx, 175, 155, 88);
  ctx.clip();
  ctx.fillStyle = '#020617';
  ctx.fillRect(80, 60, 190, 190);
  ctx.fillStyle = '#fff';
  for (const [sx, sy] of VIEWPORT_STARS) {
    if (applied.has('star-gone') && sx === 135 && sy === 95) continue;
    star(ctx, sx, sy, 4.5, 2);
    ctx.fill();
  }
  // Earth rising at the bottom of the window.
  ctx.fillStyle = '#2b6cb0';
  circle(ctx, 175, 430, 195);
  ctx.fill();
  ctx.fillStyle = '#2f9e5f';
  ellipse(ctx, 120, 250, 42, 16);
  ctx.fill();
  ellipse(ctx, 225, 268, 30, 12);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,.85)';
  ellipse(ctx, 150, 235, 34, 7);
  ctx.fill();
  ellipse(ctx, 210, 250, 26, 5);
  ctx.fill();
  ctx.restore();

  // Hanging cable (it vanishes in the other panel).
  if (!applied.has('cable-gone')) {
    ctx.strokeStyle = '#0a0a0a';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(60, 0);
    ctx.quadraticCurveTo(78, 45, 66, 92);
    ctx.stroke();
    ctx.fillStyle = '#ffd75e';
    rr(ctx, 59, 90, 14, 12, 3);
    ctx.fill();
  }

  // Warning light (its colour is a difference).
  ctx.fillStyle = applied.has('warning-light') ? '#39d353' : '#ff3b30';
  circle(ctx, 310, 28, 11);
  ctx.fill();
  glow(ctx, 310, 28, 30, applied.has('warning-light') ? '#39d353' : '#ff3b30', 0.5);
  ctx.fillStyle = '#3a4a5c';
  rr(ctx, 296, 40, 28, 6, 3);
  ctx.fill();

  // Plant shelf with three pots (one leaf is a difference).
  ctx.fillStyle = '#4a3520';
  ctx.fillRect(440, 58, 150, 9);
  const potXs = [465, 505, 545];
  potXs.forEach((px, i) => {
    ctx.fillStyle = '#b0612f';
    poly(ctx, [[px - 12, 46], [px + 12, 46], [px + 8, 58], [px - 8, 58]]);
    ctx.fill();
    ctx.strokeStyle = '#39d353';
    ctx.lineWidth = 3;
    for (let leaf = -1; leaf <= 1; leaf += 1) {
      if (applied.has('plant-leaf') && i === 1 && leaf === 0) continue;
      ctx.beginPath();
      ctx.moveTo(px, 46);
      ctx.quadraticCurveTo(px + leaf * 12, 30, px + leaf * 16, 22);
      ctx.stroke();
    }
  });

  // Poster (its wording is a difference).
  ctx.fillStyle = '#f6ead8';
  rr(ctx, 395, 105, 90, 112, 6);
  ctx.fill();
  ctx.fillStyle = '#d93a3a';
  poly(ctx, [[440, 120], [452, 150], [428, 150]]);
  ctx.fill();
  ctx.fillStyle = '#2b6cb0';
  rr(ctx, 434, 148, 12, 22, 3);
  ctx.fill();
  ctx.fillStyle = '#ff9a3d';
  poly(ctx, [[434, 168], [440, 182], [446, 168]]);
  ctx.fill();
  text(ctx, applied.has('poster-text') ? 'ORBIT-8' : 'ORBIT-9', 440, 200, { font: '900 15px "Trebuchet MS", sans-serif', color: '#1b2836' });

  // Astronaut floating (the visor glint is a difference).
  ctx.strokeStyle = 'rgba(200,220,240,.7)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(378, 132);
  ctx.quadraticCurveTo(420, 110, 452, 140);
  ctx.stroke();
  ctx.fillStyle = '#e8ecf2';
  rr(ctx, 330, 140, 42, 56, 16);
  ctx.fill();
  ctx.fillStyle = '#c9d2de';
  rr(ctx, 326, 144, 12, 40, 6);
  ctx.fill();
  ctx.fillStyle = '#f4f6f9';
  circle(ctx, 351, 120, 27);
  ctx.fill();
  ctx.fillStyle = '#1b2a3a';
  circle(ctx, 351, 120, 21);
  ctx.fill();
  ctx.fillStyle = '#9fd8ff';
  ellipse(ctx, 351, 118, 13, 9);
  ctx.fill();
  if (!applied.has('visor-glint')) {
    ctx.strokeStyle = 'rgba(255,255,255,.95)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(351, 118, 14, -2.4, -1.2);
    ctx.stroke();
  }
  ctx.fillStyle = '#e8ecf2';
  rr(ctx, 318, 146, 14, 34, 7);
  ctx.fill();
  rr(ctx, 370, 146, 14, 34, 7);
  ctx.fill();

  // Robot helper (its eye colour is a difference).
  ctx.fillStyle = '#8a97a8';
  rr(ctx, 462, 292, 56, 62, 10);
  ctx.fill();
  ctx.fillStyle = '#6b7a8c';
  circle(ctx, 490, 268, 22);
  ctx.fill();
  ctx.strokeStyle = '#6b7a8c';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(490, 246); ctx.lineTo(490, 232);
  ctx.stroke();
  ctx.fillStyle = '#ffd75e';
  circle(ctx, 490, 230, 5);
  ctx.fill();
  ctx.fillStyle = applied.has('robot-eye') ? '#ff3b30' : '#39d353';
  circle(ctx, 490, 268, 7);
  ctx.fill();
  glow(ctx, 490, 268, 16, applied.has('robot-eye') ? '#ff3b30' : '#39d353', 0.6);
  ctx.fillStyle = '#3a4a5c';
  rr(ctx, 472, 312, 36, 8, 4);
  ctx.fill();
  rr(ctx, 472, 326, 36, 8, 4);
  ctx.fill();

  // Floating coffee cup (it vanishes in the other panel).
  if (!applied.has('coffee-gone')) {
    ctx.strokeStyle = 'rgba(255,255,255,.5)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(250, 246); ctx.quadraticCurveTo(246, 238, 250, 230);
    ctx.moveTo(262, 246); ctx.quadraticCurveTo(266, 238, 262, 230);
    ctx.stroke();
    ctx.fillStyle = '#f4f6f9';
    rr(ctx, 242, 248, 30, 24, 5);
    ctx.fill();
    ctx.fillStyle = '#6b4a2f';
    rr(ctx, 245, 250, 24, 6, 3);
    ctx.fill();
    ctx.strokeStyle = '#f4f6f9';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(274, 260, 7, -1.2, 1.2);
    ctx.stroke();
  }

  // Airlock door, left bottom.
  ctx.fillStyle = '#2c3e50';
  rr(ctx, 18, 228, 64, 112, 8);
  ctx.fill();
  ctx.fillStyle = '#9fd8ff';
  circle(ctx, 50, 268, 16);
  ctx.fill();
  ctx.strokeStyle = '#5a6b7d';
  ctx.lineWidth = 4;
  circle(ctx, 50, 268, 16);
  ctx.stroke();
  text(ctx, 'AIRLOCK', 50, 322, { font: '800 10px "Trebuchet MS", sans-serif', color: '#9fb2c8' });

  // Control console with screens, gauges and one big button.
  ctx.fillStyle = '#141e29';
  ctx.fillRect(0, 340, W, 100);
  ctx.fillStyle = '#0d141c';
  ctx.fillRect(0, 340, W, 6);
  const screenData = ['#123a5c', '#3a1c4d', '#123a2c'];
  screenData.forEach((c, i) => {
    const sx = 200 + i * 92;
    ctx.fillStyle = c;
    rr(ctx, sx, 356, 78, 52, 6);
    ctx.fill();
    ctx.strokeStyle = '#39d0c4';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(sx + 8, 396);
    for (let px = 0; px <= 62; px += 8) ctx.lineTo(sx + 8 + px, 396 - Math.abs(Math.sin(px * 0.35 + i)) * 22);
    ctx.stroke();
  });
  // Gauges (one needle moves).
  [[95, 382], [150, 382]].forEach(([gx, gy], i) => {
    ctx.fillStyle = '#e8ecf2';
    circle(ctx, gx, gy, 22);
    ctx.fill();
    ctx.strokeStyle = '#5a6b7d';
    ctx.lineWidth = 3;
    circle(ctx, gx, gy, 22);
    ctx.stroke();
    const angle = i === 0 && applied.has('gauge-needle') ? 0.7 : -0.6;
    ctx.strokeStyle = '#d93a3a';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(gx, gy);
    ctx.lineTo(gx + Math.sin(angle) * 16, gy - Math.cos(angle) * 16);
    ctx.stroke();
    ctx.fillStyle = '#1b2836';
    circle(ctx, gx, gy, 3);
    ctx.fill();
  });
  // Button grid and the big red button (it turns blue).
  ctx.fillStyle = '#2c3e50';
  for (let rI = 0; rI < 2; rI += 1) {
    for (let cI = 0; cI < 4; cI += 1) {
      circle(ctx, 500 + cI * 16, 362 + rI * 18, 4);
      ctx.fill();
    }
  }
  ctx.fillStyle = applied.has('big-button') ? '#4d8dff' : '#ff3b30';
  circle(ctx, 560, 392, 15);
  ctx.fill();
  glow(ctx, 560, 392, 30, applied.has('big-button') ? '#4d8dff' : '#ff3b30', 0.45);
  ctx.fillStyle = '#1b2836';
  circle(ctx, 560, 392, 5);
  ctx.fill();
}

const STATION_DIFFS = [
  { id: 'star-gone', x: 135, y: 95, r: 20, label: 'Bintang di jendela hilang' },
  { id: 'visor-glint', x: 352, y: 112, r: 22, label: 'Kilau helm astronot hilang' },
  { id: 'robot-eye', x: 490, y: 268, r: 22, label: 'Mata robot hijau jadi merah' },
  { id: 'plant-leaf', x: 505, y: 34, r: 20, label: 'Daun tanaman tengah hilang' },
  { id: 'big-button', x: 560, y: 392, r: 22, label: 'Tombol besar merah jadi biru' },
  { id: 'coffee-gone', x: 257, y: 258, r: 24, label: 'Cangkir kopi melayang hilang' },
  { id: 'poster-text', x: 440, y: 160, r: 24, label: 'Poster ORBIT-9 jadi ORBIT-8' },
  { id: 'gauge-needle', x: 95, y: 382, r: 22, label: 'Jarum pengukur pindah' },
  { id: 'cable-gone', x: 66, y: 55, r: 22, label: 'Kabel gantung hilang' },
  { id: 'warning-light', x: 310, y: 28, r: 22, label: 'Lampu peringatan merah jadi hijau' },
];

/* ------------------------------------------------------------------ */
/* Scene 3 — Taman Karang Bawah Laut (Coral Reef Garden)                */
/* ------------------------------------------------------------------ */
function drawCoral(ctx, x, y, color, missingBranch) {
  ctx.strokeStyle = color;
  ctx.lineCap = 'round';
  const branches = [
    [[0, 0], [-14, -26], [-26, -44]],
    [[0, 0], [4, -30], [2, -56]],
    [[0, 0], [18, -22], [34, -38]],
    [[-14, -26], [-30, -34], [-40, -52]],
  ];
  branches.forEach((pts, i) => {
    if (missingBranch && i === 1) return;
    ctx.lineWidth = 11 - i;
    ctx.beginPath();
    ctx.moveTo(x + pts[0][0], y + pts[0][1]);
    ctx.quadraticCurveTo(x + pts[1][0], y + pts[1][1], x + pts[2][0], y + pts[2][1]);
    ctx.stroke();
  });
  ctx.lineCap = 'butt';
}

function drawReef(ctx, applied) {
  // Water.
  vgrad(ctx, W, H, [[0, '#0b5e9e'], [0.6, '#0a4a80'], [1, '#063a66']]);
  // Sun rays.
  ctx.fillStyle = 'rgba(255,255,255,.07)';
  poly(ctx, [[80, 0], [150, 0], [260, 440], [170, 440]]);
  ctx.fill();
  poly(ctx, [[300, 0], [340, 0], [430, 440], [380, 440]]);
  ctx.fill();
  // Distant fish silhouettes and rising bubbles, for depth.
  ctx.fillStyle = 'rgba(8,52,96,.6)';
  ellipse(ctx, 90, 90, 16, 8); ctx.fill();
  poly(ctx, [[74, 90], [62, 83], [62, 97]]); ctx.fill();
  ellipse(ctx, 390, 70, 14, 7); ctx.fill();
  poly(ctx, [[376, 70], [366, 64], [366, 76]]); ctx.fill();
  ellipse(ctx, 540, 60, 12, 6); ctx.fill();
  poly(ctx, [[528, 60], [519, 55], [519, 65]]); ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,.45)';
  ctx.lineWidth = 1.5;
  [[130, 320, 3], [150, 280, 4], [360, 310, 3], [520, 320, 4], [420, 180, 3], [110, 240, 3]].forEach(([bx, by, br]) => {
    circle(ctx, bx, by, br);
    ctx.stroke();
  });
  // Sand.
  ctx.fillStyle = '#e8d29a';
  ctx.beginPath();
  ctx.moveTo(0, 396);
  ctx.quadraticCurveTo(160, 378, 320, 394);
  ctx.quadraticCurveTo(480, 410, 620, 390);
  ctx.lineTo(620, 440);
  ctx.lineTo(0, 440);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#d8c184';
  ellipse(ctx, 120, 420, 26, 7); ctx.fill();
  ellipse(ctx, 420, 428, 34, 8); ctx.fill();
  ellipse(ctx, 560, 414, 22, 6); ctx.fill();

  // Seaweed cluster (one cluster is a difference).
  if (!applied.has('seaweed-gone')) {
    ctx.strokeStyle = '#2f9e5f';
    ctx.lineWidth = 7;
    ctx.lineCap = 'round';
    [[48, 0], [60, -14], [72, 6]].forEach(([sx, dx]) => {
      ctx.beginPath();
      ctx.moveTo(sx, 400);
      ctx.quadraticCurveTo(sx + dx, 360, sx + dx * 1.6, 322);
      ctx.stroke();
    });
    ctx.lineCap = 'butt';
  }
  ctx.strokeStyle = '#2f9e5f';
  ctx.lineWidth = 7;
  ctx.lineCap = 'round';
  [[292, 0], [304, -12], [316, 4]].forEach(([sx, dx]) => {
    ctx.beginPath();
    ctx.moveTo(sx, 402);
    ctx.quadraticCurveTo(sx + dx, 362, sx + dx * 1.6, 326);
    ctx.stroke();
  });
  [[242, 0], [254, -12], [266, 4]].forEach(([sx, dx]) => {
    ctx.beginPath();
    ctx.moveTo(sx, 404);
    ctx.quadraticCurveTo(sx + dx, 370, sx + dx * 1.6, 340);
    ctx.stroke();
  });
  [[582, 0], [592, -10]].forEach(([sx, dx]) => {
    ctx.beginPath();
    ctx.moveTo(sx, 402);
    ctx.quadraticCurveTo(sx + dx, 366, sx + dx * 1.6, 336);
    ctx.stroke();
  });
  ctx.lineCap = 'butt';
  // Pebbles on the sand.
  ctx.fillStyle = '#cbb27f';
  ellipse(ctx, 150, 428, 18, 6); ctx.fill();
  ellipse(ctx, 492, 430, 20, 7); ctx.fill();

  // Corals (one branch is a difference).
  drawCoral(ctx, 100, 385, '#ff7fa5', applied.has('coral-branch'));
  drawCoral(ctx, 520, 388, '#ff9e57', false);
  ctx.fillStyle = '#ff7fa5';
  circle(ctx, 74, 341, 6); ctx.fill();
  circle(ctx, 102, 329, 6); ctx.fill();
  circle(ctx, 134, 347, 6); ctx.fill();
  ctx.fillStyle = '#ff9e57';
  circle(ctx, 494, 350, 6); ctx.fill();
  circle(ctx, 554, 350, 6); ctx.fill();

  // Fish school (one fish is a difference).
  drawFish(ctx, 240, 160, '#ffd75e');
  drawFish(ctx, 280, 175, '#4d8dff', true);
  if (!applied.has('fish-gone')) drawFish(ctx, 320, 155, '#ffd75e');
  drawFish(ctx, 270, 200, '#ff9a3d');
  drawFish(ctx, 310, 195, '#4d8dff');
  drawFish(ctx, 90, 120, '#7ee081', true);
  drawFish(ctx, 540, 90, '#ffd75e', true);

  // Jellyfish (its dome colour is a difference).
  ctx.fillStyle = applied.has('jelly-blue') ? '#7fc4ff' : '#ff9fd0';
  ctx.beginPath();
  ctx.arc(480, 118, 24, Math.PI, 0);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = applied.has('jelly-blue') ? '#7fc4ff' : '#ff9fd0';
  ctx.lineWidth = 2.5;
  for (let i = -2; i <= 2; i += 1) {
    ctx.beginPath();
    ctx.moveTo(480 + i * 9, 118);
    ctx.quadraticCurveTo(480 + i * 11, 136, 480 + i * 8, 152);
    ctx.stroke();
  }

  // Octopus (one eye winks in the other panel).
  ctx.fillStyle = '#b678e8';
  circle(ctx, 565, 222, 22);
  ctx.fill();
  ctx.strokeStyle = '#b678e8';
  ctx.lineWidth = 7;
  ctx.lineCap = 'round';
  for (let i = 0; i < 4; i += 1) {
    const ax = 548 + i * 11;
    ctx.beginPath();
    ctx.moveTo(ax, 240);
    ctx.quadraticCurveTo(ax - 6, 258, ax + 4, 272);
    ctx.stroke();
  }
  ctx.lineCap = 'butt';
  ctx.fillStyle = '#fff';
  circle(ctx, 558, 216, 5); ctx.fill();
  circle(ctx, 573, 216, 5); ctx.fill();
  ctx.fillStyle = '#1b2836';
  if (applied.has('octo-eye')) {
    ctx.strokeStyle = '#1b2836';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(554, 216); ctx.lineTo(562, 216);
    ctx.stroke();
  } else {
    circle(ctx, 558, 216, 2.5); ctx.fill();
  }
  circle(ctx, 573, 216, 2.5); ctx.fill();

  // Diver with tank (the tank colour is a difference) and bubbles (one is a difference).
  ctx.fillStyle = '#2b6cb0';
  ellipse(ctx, 180, 205, 40, 15);
  ctx.fill();
  ctx.fillStyle = '#f2c79b';
  circle(ctx, 220, 200, 11);
  ctx.fill();
  ctx.fillStyle = '#1b2a3a';
  rr(ctx, 216, 196, 13, 9, 3);
  ctx.fill();
  ctx.strokeStyle = '#1b2a3a';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(212, 194);
  ctx.lineTo(200, 188);
  ctx.stroke();
  ctx.fillStyle = applied.has('tank-red') ? '#d93a3a' : '#ffd75e';
  ellipse(ctx, 164, 186, 18, 10);
  ctx.fill();
  ctx.strokeStyle = '#8a6d1f';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(176, 180);
  ctx.quadraticCurveTo(196, 178, 210, 190);
  ctx.stroke();
  ctx.fillStyle = '#ff9a3d';
  poly(ctx, [[142, 205], [122, 194], [122, 216]]);
  ctx.fill();
  poly(ctx, [[142, 205], [126, 200], [126, 210]]);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,.75)';
  ctx.lineWidth = 2;
  [[215, 152, 6], [228, 136, 5], [205, 166, 4]].forEach(([bx, by, br]) => {
    if (applied.has('bubble-gone') && bx === 228) return;
    circle(ctx, bx, by, br);
    ctx.stroke();
  });

  // Treasure chest with gold (the coins are a difference).
  ctx.fillStyle = '#7a4a21';
  rr(ctx, 400, 378, 64, 26, 4);
  ctx.fill();
  ctx.fillStyle = '#8a5a2e';
  ctx.beginPath();
  ctx.arc(432, 378, 32, Math.PI, 0);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#d4a017';
  ctx.fillRect(428, 374, 8, 30);
  if (!applied.has('coins-gone')) {
    ctx.fillStyle = '#ffd75e';
    [[414, 372], [428, 366], [442, 372], [452, 378], [418, 380]].forEach(([cx, cy]) => {
      circle(ctx, cx, cy, 5);
      ctx.fill();
    });
  }

  // Starfish (one arm is a difference).
  ctx.fillStyle = '#ff9a3d';
  ctx.save();
  ctx.translate(330, 414);
  for (let i = 0; i < 5; i += 1) {
    if (applied.has('starfish-arm') && i === 2) continue;
    ctx.save();
    ctx.rotate((i * 2 * Math.PI) / 5 - Math.PI / 2);
    poly(ctx, [[0, -6], [5, -18], [0, -24], [-5, -18]]);
    ctx.fill();
    ctx.restore();
  }
  circle(ctx, 0, 0, 8);
  ctx.fill();
  ctx.restore();

  // Scallop shell (its colour is a difference).
  ctx.fillStyle = applied.has('shell-blue') ? '#4d8dff' : '#ffb3c8';
  ctx.beginPath();
  ctx.arc(200, 420, 16, Math.PI, 0);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,.18)';
  ctx.lineWidth = 1.5;
  for (let i = -2; i <= 2; i += 1) {
    ctx.beginPath();
    ctx.moveTo(200, 420);
    ctx.lineTo(200 + i * 7, 406);
    ctx.stroke();
  }

  // Old anchor.
  ctx.strokeStyle = '#3a4a5c';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(84, 388); ctx.lineTo(84, 424);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(84, 420, 12, 0.3, Math.PI - 0.3);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(70, 392); ctx.lineTo(98, 392);
  ctx.stroke();
}

const REEF_DIFFS = [
  { id: 'fish-gone', x: 320, y: 155, r: 22, label: 'Satu ikan kuning hilang' },
  { id: 'coral-branch', x: 95, y: 295, r: 22, label: 'Cabang karang pink hilang' },
  { id: 'coins-gone', x: 430, y: 372, r: 22, label: 'Koin emas peti hilang' },
  { id: 'tank-red', x: 168, y: 188, r: 22, label: 'Tabung penyelam kuning jadi merah' },
  { id: 'jelly-blue', x: 480, y: 115, r: 24, label: 'Ubur-ubur pink jadi biru' },
  { id: 'octo-eye', x: 558, y: 216, r: 20, label: 'Gurita mengedipkan satu mata' },
  { id: 'starfish-arm', x: 330, y: 412, r: 20, label: 'Bintang laut kehilangan satu lengan' },
  { id: 'shell-blue', x: 200, y: 415, r: 20, label: 'Kerang pink jadi biru' },
  { id: 'seaweed-gone', x: 60, y: 375, r: 22, label: 'Rumput laut kiri hilang' },
  { id: 'bubble-gone', x: 228, y: 136, r: 20, label: 'Satu gelembung penyelam hilang' },
];

/* ------------------------------------------------------------------ */
/* Export                                                              */
/* ------------------------------------------------------------------ */
export const SCENES = [
  {
    id: 'market',
    name: 'Pasar Malam',
    subtitle: 'Lampion, sate, dan kucing di atap warung',
    timeLimit: 150,
    diffs: MARKET_DIFFS,
    draw: drawMarket,
  },
  {
    id: 'station',
    name: 'Stasiun Orbit-9',
    subtitle: 'Bumi dari jendela, astronot, dan robot kecil',
    timeLimit: 150,
    diffs: STATION_DIFFS,
    draw: drawStation,
  },
  {
    id: 'reef',
    name: 'Taman Karang',
    subtitle: 'Ikan, gurita, dan peti harta karun',
    timeLimit: 150,
    diffs: REEF_DIFFS,
    draw: drawReef,
  },
];

export const PANEL_W = W;
export const PANEL_H = H;
