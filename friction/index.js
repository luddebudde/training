const canvas = document.getElementById("theCanvas");
const ctx = canvas.getContext("2d");
const world = {
  width: canvas.width,
  height: canvas.height,
};

const player = {
  radius: 25,
  impulseY: 20,
  impulseX: 10,
  mass: 5,
  color: "blue",
  canJump: true,
  pos: {
    x: world.width / 2,
    y: world.height / 2,
  },
  vel: {
    x: 0,
    y: 0,
  },
};
const makeEnemy = () => {
  return {
    radius: Math.random() * 3 + 7,
    speed: Math.random() * 0.5,
    mass: 5,
    fragile: Math.random() < 0.5,
    pos: {
      x: Math.random() * world.width,
      y: Math.random() * world.height,
    },
    vel: {
      x: 0,
      y: 0,
    },
  };
};
let enemies = [
  makeEnemy(),
  makeEnemy(),
  makeEnemy(),
  makeEnemy(),
  makeEnemy(),
  makeEnemy(),
  makeEnemy(),
  makeEnemy(),
  makeEnemy(),
  makeEnemy(),
  makeEnemy(),
  makeEnemy(),
  makeEnemy(),
  makeEnemy(),
  makeEnemy(),
  makeEnemy(),
  makeEnemy(),
  makeEnemy(),
  makeEnemy(),
  makeEnemy(),
  makeEnemy(),
  makeEnemy(),
  makeEnemy(),
  makeEnemy(),
  makeEnemy(),
  makeEnemy(),
  makeEnemy(),
  makeEnemy(),
  makeEnemy(),
  makeEnemy(),
  makeEnemy(),
  makeEnemy(),
  makeEnemy(),
  makeEnemy(),
  makeEnemy(),
  makeEnemy(),
  makeEnemy(),
  makeEnemy(),
  makeEnemy(),
  makeEnemy(),
  makeEnemy(),
  makeEnemy(),
  makeEnemy(),
  makeEnemy(),
  makeEnemy(),
];
enemies.forEach((enemy) => {
  enemy.pos.x = enemy.pos.x + enemy.vel.x;
  enemy.pos.y = enemy.pos.y + enemy.vel.y;

  const dx = player.pos.x - enemy.pos.x;
  const dy = player.pos.y - enemy.pos.y;
  enemy.vel.x = Math.sign(dx) * enemy.speed;
  enemy.vel.y = Math.sign(dy) * enemy.speed;
});

setInterval(() => {
  enemies.forEach((enemy) => {
    // tyngdkraft
    enemy.vel.y = enemy.vel.y + 1;
    enemy.vel.x = enemy.vel.x * 0.95;
    // Uppdatera pos
    enemy.pos.x = enemy.pos.x + enemy.vel.x;
    enemy.pos.y = enemy.pos.y + enemy.vel.y;

    //  Bounce
    const enemyBottomBoundary = enemy.pos.y + enemy.radius;
    if (enemyBottomBoundary > world.height && enemy.vel.y > 0) {
      enemy.vel.y = -enemy.vel.y / 2;
      enemy.pos.y = world.height - enemy.radius;
      enemy.canJump = true;
    }
    const enemyTopBoundary = enemy.pos.y - enemy.radius;
    if (enemyTopBoundary < 0 && enemy.vel.y < 0) {
      enemy.vel.y = -enemy.vel.y / 2;
      enemy.pos.y = 0 + enemy.radius;
    }
  });
  // tyngdkraft
  player.vel.y = player.vel.y + 1;
  player.vel.x = player.vel.x * 0.95;
  // Uppdatera pos
  player.pos.x = player.pos.x + player.vel.x;
  player.pos.y = player.pos.y + player.vel.y;

  //  Bounce
  const playerBottomBoundary = player.pos.y + player.radius;
  if (playerBottomBoundary > world.height && player.vel.y > 0) {
    player.vel.y = -player.vel.y / 2;
    player.pos.y = world.height - player.radius;
    player.canJump = true;
  }
  const playerTopBoundary = player.pos.y - player.radius;
  if (playerTopBoundary < 0 && player.vel.y < 0) {
    player.vel.y = -player.vel.y / 2;
    player.pos.y = 0 + player.radius;
  }

  // Teleport
  const playerLeftBoundary = player.pos.x - player.radius;
  const playerRightBoundary = player.pos.x + player.radius;
  if (player.pos.x < 0 && player.vel.x < 0) {
    player.pos.x = world.width;
  }
  if (player.pos.x > world.width && player.vel.x > 0) {
    player.pos.x = 0;
  }

  // Rita ut
  ctx.beginPath();
  ctx.fillStyle = "black";
  ctx.rect(0, 0, world.width, world.height);
  ctx.fill();

  // Draw Player
  ctx.beginPath();
  ctx.arc(player.pos.x, player.pos.y, player.radius, 0, 2 * Math.PI);
  ctx.fillStyle = player.color;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(
    player.pos.x + world.width,
    player.pos.y,
    player.radius,
    0,
    2 * Math.PI
  );
  ctx.fillStyle = player.color;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(
    player.pos.x - world.width,
    player.pos.y,
    player.radius,
    0,
    2 * Math.PI
  );
  ctx.fillStyle = player.color;
  ctx.fill();

  // Draw enemy
  enemies.forEach((enemy) => {
    ctx.beginPath();
    ctx.arc(enemy.pos.x, enemy.pos.y, enemy.radius, 0, 2 * Math.PI);
    ctx.fillStyle = "white";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(
      enemy.pos.x + world.width,
      enemy.pos.y,
      enemy.radius,
      0,
      2 * Math.PI
    );
    ctx.fillStyle = "white";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(
      enemy.pos.x - world.width,
      enemy.pos.y,
      enemy.radius,
      0,
      2 * Math.PI
    );
    ctx.fillStyle = "white";
    ctx.fill();
  });
}, 1000 / 30);

document.addEventListener("keydown", (event) => {
  if (event.code === "ArrowUp" && player.canJump) {
    player.vel.y = player.vel.y - player.impulseY;
    player.canJump = false;
  }
  if (event.code === "ArrowLeft") {
    player.vel.x = player.vel.x - player.impulseX;
  }
  // if (event.code === "ArrowDown") {
  //   player.vel.y = player.vel.y + player.impulseY;
  // }
  if (event.code === "ArrowRight") {
    player.vel.x = player.vel.x + player.impulseX;
  }
});
