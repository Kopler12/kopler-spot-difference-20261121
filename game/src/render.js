// Draws every frame: the two panels (left original, right with all differences applied),
// the gold rings on found differences, spark particles, miss crosses and the hint pulse.
import { PANEL_W, PANEL_H } from './scenes.js';
import { circle, ellipse, glow } from './helpers.js';

export class Renderer {
  constructor(leftCanvas, rightCanvas) {
    this.left = leftCanvas;
    this.right = rightCanvas;
    this.lctx = leftCanvas.getContext('2d');
    this.rctx = rightCanvas.getContext('2d');
  }

  draw(game, now) {
    this.drawPanel(this.lctx, game, new Set(), now);
    const all = new Set(game.scene.diffs.map((d) => d.id));
    this.drawPanel(this.rctx, game, all, now);
  }

  drawPanel(ctx, game, applied, now) {
    const scene = game.scene;
    scene.draw(ctx, applied);
    // Found markers: a gold ring with the find number, on both panels.
    game.foundOrder.forEach((id, i) => {
      const diff = scene.diffs.find((d) => d.id === id);
      if (!diff) return;
      const pulse = 1 + Math.sin(now / 300 + i) * 0.06;
      const r = 24 * pulse;
      ctx.save();
      ctx.strokeStyle = '#ffd75e';
      ctx.lineWidth = 4;
      ctx.shadowColor = '#ffb340';
      ctx.shadowBlur = 12;
      circle(ctx, diff.x, diff.y, r);
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.strokeStyle = 'rgba(255,255,255,.9)';
      ctx.lineWidth = 1.5;
      circle(ctx, diff.x, diff.y, r - 5);
      ctx.stroke();
      // Number badge.
      ctx.fillStyle = '#ffd75e';
      circle(ctx, diff.x + 16, diff.y - 16, 11);
      ctx.fill();
      ctx.fillStyle = '#160b2e';
      ctx.font = '900 13px "Trebuchet MS", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(i + 1), diff.x + 16, diff.y - 15);
      ctx.restore();
    });
    // Spark particles on a fresh find.
    for (const p of game.particles) {
      const alpha = Math.max(0, p.life / p.maxLife);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      circle(ctx, p.x, p.y, p.size);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    // Red crosses where the player clicked wrong (fading).
    for (const m of game.missMarks) {
      const age = (now - m.at) / 900;
      if (age >= 1) continue;
      ctx.save();
      ctx.globalAlpha = 1 - age;
      ctx.strokeStyle = '#ff5a6e';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(m.x - 10, m.y - 10);
      ctx.lineTo(m.x + 10, m.y + 10);
      ctx.moveTo(m.x + 10, m.y - 10);
      ctx.lineTo(m.x - 10, m.y + 10);
      ctx.stroke();
      ctx.restore();
    }
    // Hint: a pulsing teal ring around one unfound difference.
    if (game.hintTarget) {
      const d = game.hintTarget;
      const t = (now % 700) / 700;
      const r = 26 + t * 14;
      ctx.save();
      ctx.globalAlpha = 1 - t * 0.45;
      ctx.strokeStyle = '#39d0c4';
      ctx.lineWidth = 5;
      ctx.setLineDash([10, 8]);
      ctx.lineDashOffset = -now / 40;
      circle(ctx, d.x, d.y, r);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.globalAlpha = 0.9;
      glow(ctx, d.x, d.y, 34, '#39d0c4', 0.35);
      ctx.restore();
    }
  }
}

export { PANEL_W, PANEL_H };
