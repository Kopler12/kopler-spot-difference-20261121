// Screenshot scenes behind ?shot=cover|level2|hint|win. Each one plays the REAL rules forward
// from a fresh game — the same clickScene() a mouse click calls — so every frame is what a
// short session of the game really looks like, and the same scene always gives the same frame.
import { SCENES } from './scenes.js';

/** Click every difference of the current level, in order, through the real handler. */
function clearLevel(game) {
  for (const diff of game.scene.diffs) {
    game.clickScene(diff.x, diff.y);
  }
}

/**
 * Set the game to the named scene and return when it is staged.
 * cover: level 1 mid-hunt, 4 found, 6 still hidden, counter and timer visible.
 * level2: level 2 mid-hunt, 2 found, 8 still hidden.
 * hint: level 1 with a hint ring pulsing on an unfound difference.
 * win: all three levels cleared, the winner screen up.
 */
export function stageShot(game, name) {
  game.startGame();
  if (name === 'level2') {
    clearLevel(game);
    game.nextLevel();
    game.clickScene(game.scene.diffs[1].x, game.scene.diffs[1].y);
    game.clickScene(game.scene.diffs[5].x, game.scene.diffs[5].y);
    game.timeLeft = 118;
    return;
  }
  if (name === 'hint') {
    game.clickScene(game.scene.diffs[0].x, game.scene.diffs[0].y);
    game.clickScene(game.scene.diffs[3].x, game.scene.diffs[3].y);
    game.useHint();
    // Point the ring at one clear spot for the picture: the star by the moon, open sky.
    game.hintTarget = game.scene.diffs.find((d) => d.id === 'star-gone');
    game.hintUntil = performance.now() + 3000;
    game.timeLeft = 145;
    return;
  }
  if (name === 'win') {
    for (let level = 0; level < SCENES.length; level += 1) {
      game.timeLeft = 96;
      clearLevel(game);
      if (level < SCENES.length - 1) game.nextLevel();
    }
    return;
  }
  // cover (and anything else): four found, six to go.
  game.clickScene(game.scene.diffs[0].x, game.scene.diffs[0].y);
  game.clickScene(game.scene.diffs[2].x, game.scene.diffs[2].y);
  game.clickScene(game.scene.diffs[4].x, game.scene.diffs[4].y);
  game.clickScene(game.scene.diffs[6].x, game.scene.diffs[6].y);
  game.timeLeft = 132;
}
