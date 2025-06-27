const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const player = {
  x: canvas.width / 2 - 10,
  y: canvas.height - 40,
  width: 20,
  height: 20,
  speed: 5
};

const bullets = [];
const enemies = [];
const keys = {};

window.addEventListener('keydown', e => keys[e.code] = true);
window.addEventListener('keyup', e => keys[e.code] = false);

function spawnEnemy() {
  const x = Math.random() * (canvas.width - 30);
  enemies.push({ x, y: 0, width: 30, height: 30, speed: 2 });
}

setInterval(spawnEnemy, 1000);

function update() {
  if (keys['ArrowLeft'] && player.x > 0) {
    player.x -= player.speed;
  }
  if (keys['ArrowRight'] && player.x < canvas.width - player.width) {
    player.x += player.speed;
  }
  if (keys['Space']) {
    keys['Space'] = false;
    bullets.push({ x: player.x + player.width / 2 - 2, y: player.y, width: 4, height: 10, speed: 7 });
  }

  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].y -= bullets[i].speed;
    if (bullets[i].y < 0) bullets.splice(i, 1);
  }

  for (let i = enemies.length - 1; i >= 0; i--) {
    enemies[i].y += enemies[i].speed;
    if (enemies[i].y > canvas.height) enemies.splice(i, 1);
  }

  for (let i = enemies.length - 1; i >= 0; i--) {
    for (let j = bullets.length - 1; j >= 0; j--) {
      if (bullets[j].x < enemies[i].x + enemies[i].width &&
          bullets[j].x + bullets[j].width > enemies[i].x &&
          bullets[j].y < enemies[i].y + enemies[i].height &&
          bullets[j].y + bullets[j].height > enemies[i].y) {
        enemies.splice(i, 1);
        bullets.splice(j, 1);
        break;
      }
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = 'white';
  ctx.fillRect(player.x, player.y, player.width, player.height);

  ctx.fillStyle = 'red';
  bullets.forEach(b => ctx.fillRect(b.x, b.y, b.width, b.height));

  ctx.fillStyle = 'green';
  enemies.forEach(e => ctx.fillRect(e.x, e.y, e.width, e.height));
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
