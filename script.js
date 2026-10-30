"use strict";
const game = document.querySelector("#game");
const character = document.querySelector("#character");
const obstacleLayer = document.querySelector("#obstacles");
const status = document.querySelector("#status");
const scoreDisplay = document.querySelector("#score");
const startButton = document.querySelector("#start");
const jumpButton = document.querySelector("#jump");
const SPEED = 240; // Pixels per second; independent of the monitor refresh rate.
const GRAVITY = 1800;
const JUMP_SPEED = 650;
let running = false;
let paused = false;
let height = 0;
let velocity = 0;
let obstacles = [];
let score = 0;
let spawnTimer = 0;
let lastTime = null;
let frameId = null;
function jump() {
  if (running && !paused && height === 0) velocity = JUMP_SPEED;
}
function spawnObstacle() {
  const element = document.createElement("div");
  element.className = "obstacle";
  const obstacle = { x: game.clientWidth, width: 24, height: 30 + Math.random() * 24, scored: false, element };
  element.style.height = `${obstacle.height}px`;
  obstacleLayer.append(element);
  obstacles.push(obstacle);
}
function hasCollision(obstacle) {
  // Axis-aligned rectangles in game coordinates; height measures distance above ground.
  return 48 < obstacle.x + obstacle.width && 78 > obstacle.x && height < obstacle.height;
}
function endGame() {
  running = false;
  jumpButton.disabled = true;
  startButton.textContent = "Play again";
  status.textContent = `Game over! Final score: ${score}. Press Play again to restart.`;
}
function update(dt) {
  velocity -= GRAVITY * dt;
  height = Math.max(0, height + velocity * dt);
  if (height === 0) velocity = 0;
  character.style.transform = `translateY(${-height}px)`;
  spawnTimer -= dt;
  if (spawnTimer <= 0) {
    spawnObstacle();
    // Minimum spacing allows landing before the next jump, even on a narrow screen.
    spawnTimer = 1.45 + Math.random() * 0.55;
  }
  for (const obstacle of obstacles) {
    obstacle.x -= SPEED * dt;
    obstacle.element.style.left = `${obstacle.x}px`;
    if (hasCollision(obstacle)) { endGame(); return; }
    if (!obstacle.scored && obstacle.x + obstacle.width < 48) {
      obstacle.scored = true;
      score++;
      scoreDisplay.textContent = score;
    }
  }
  obstacles = obstacles.filter(obstacle => {
    if (obstacle.x + obstacle.width < 0) { obstacle.element.remove(); return false; }
    return true;
  });
}
function frame(time) {
  frameId = null;
  if (!running || paused) return;
  if (lastTime !== null) {
    // Small simulation steps prevent tunnelling through obstacles after a slow frame.
    let remaining = Math.min((time - lastTime) / 1000, 0.1);
    while (remaining > 0 && running) {
      const dt = Math.min(remaining, 1 / 120);
      update(dt);
      remaining -= dt;
    }
  }
  lastTime = time;
  if (running) frameId = requestAnimationFrame(frame);
}
function startGame() {
  cancelAnimationFrame(frameId);
  obstacleLayer.replaceChildren();
  obstacles = [];
  height = 0;
  velocity = 0;
  score = 0;
  scoreDisplay.textContent = "0";
  character.style.transform = "translateY(0)";
  spawnTimer = 1;
  lastTime = null;
  paused = false;
  running = true;
  jumpButton.disabled = false;
  startButton.textContent = "Restart game";
  status.textContent = "Go! Jump over each obstacle.";
  frameId = requestAnimationFrame(frame);
}
startButton.addEventListener("click", startGame);
jumpButton.addEventListener("click", jump);
game.addEventListener("pointerdown", jump);
document.addEventListener("keydown", event => {
  if (!["Space", "ArrowUp"].includes(event.code) || event.ctrlKey || event.metaKey || event.altKey) return;
  // Keep Space usable immediately after clicking Start instead of restarting.
  if (event.code === "Space" && event.target.tagName === "BUTTON" &&
      (event.target === jumpButton || !running)) return;
  event.preventDefault();
  if (!event.repeat) jump();
});
document.addEventListener("visibilitychange", () => {
  if (!running) return;
  paused = document.hidden;
  cancelAnimationFrame(frameId);
  lastTime = null;
  status.textContent = paused ? "Game paused while this tab is hidden." : "Go! Jump over each obstacle.";
  if (!paused) frameId = requestAnimationFrame(frame);
});
