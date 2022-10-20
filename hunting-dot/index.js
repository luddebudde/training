const canvas = document.getElementById("theCanvas");
const ctx = canvas.getContext("2d");
const world = {
  width: canvas.width,
  height: canvas.height,
};

const player = {
  radius: 10,
  speed: 2,
  mass: 5,
  color: "blue",
  pos: {
    x: world.width / 2,
    y: world.height / 2,
  },
  vel: {
    x: 0,
    y: 0,
  },
};
const enemy1 = {
  radius: 10,
  speed: 5,
  mass: 5,
  pos: {
    x: 250,
    y: 100,
  },
  vel: {
    x: 0,
    y: 0,
  },
};
const enemy2 = {
  radius: 10,
  speed: 5,
  mass: 5,
  pos: {
    x: 500,
    y: 100,
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

setInterval(() => {
  // Uppdatera pos
  player.pos.x = player.pos.x + player.vel.x;
  player.pos.y = player.pos.y + player.vel.y;

  enemies.forEach((enemy) => {
    enemy.pos.x = enemy.pos.x + enemy.vel.x;
    enemy.pos.y = enemy.pos.y + enemy.vel.y;

    const dx = player.pos.x - enemy.pos.x;
    const dy = player.pos.y - enemy.pos.y;
    enemy.vel.x = Math.sign(dx) * enemy.speed;
    enemy.vel.y = Math.sign(dy) * enemy.speed;
  });

  const enemiesToRemove = [];
  enemies.forEach((enemyA) => {
    enemies.forEach((enemyB) => {
      if (enemyA === enemyB) {
        return;
      }

      const dx = enemyA.pos.x - enemyB.pos.x;
      const dy = enemyA.pos.y - enemyB.pos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < enemyA.radius + enemyA.radius) {
        if (enemyA.fragile) {
          enemiesToRemove.push(enemyA);
        } else {
          enemyA.speed = 0;
        }
        if (enemyB.fragile) {
          enemiesToRemove.push(enemyB);
        } else {
          enemyB.speed = 0;
        }
        if (player.color === "red"){
            player.speed = 0
            enemy.speed = 0
        }
      }
    });
  });
  enemies = enemies.filter((enemyA) => {
    return !enemiesToRemove.some((enemyB) => enemyB === enemyA);
  });

  enemies.forEach((enemy) => {
    const dx = enemy.pos.x - player.pos.x;
    const dy = enemy.pos.y - player.pos.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < enemy.radius + player.radius) {
      player.color = "red";
    }
  });

  // Update movement (AI)

  //  Bounce
  const playerRightBoundary = player.pos.x + player.radius;
  if (playerRightBoundary > world.width && player.vel.x > 0) {
    player.vel.x = -player.vel.x;
    player.pos.x = world.width - player.radius;
  }
  const playerLeftBoundary = player.pos.x - player.radius;
  if (playerLeftBoundary < 0 && player.vel.x < 0) {
    player.vel.x = -player.vel.x;
    player.pos.x = 0 + player.radius;
  }

  // Teleport
  const playerTopBoundary = player.pos.y - player.radius;
  const playerBottomBoundary = player.pos.y + player.radius;
  if (player.pos.y < 0 && player.vel.y < 0) {
    player.pos.y = world.height;
  }
  if (player.pos.y > world.height && player.vel.y > 0) {
    player.pos.y = 0;
  }

  // console.log(player1.pos.x - coin.pos.x, player1.pos.y - coin.pos.y)

  // const dx = player1.pos.x - coin.pos.x
  // const dy = player1.pos.y - coin.pos.y
  // const dist = Math.sqrt(dx * dx + dy * dy)
  // // console.log("dist", dist)
  // if (dist < player1.radius + coin.radius) {
  //     // console.log("crash")
  //     player1.radius = player1.radius + 5
  //     coin.pos.x = Math.random() * world.worldWidth
  //     coin.pos.y = Math.random() * world.worldHeight
  // }

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
    player.pos.x,
    player.pos.y + world.height,
    player.radius,
    0,
    2 * Math.PI
  );
  ctx.fillStyle = player.color;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(
    player.pos.x,
    player.pos.y - world.height,
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
      enemy.pos.x,
      enemy.pos.y + world.height,
      enemy.radius,
      0,
      2 * Math.PI
    );
    ctx.fillStyle = "white";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(
      enemy.pos.x,
      enemy.pos.y - world.height,
      enemy.radius,
      0,
      2 * Math.PI
    );
    ctx.fillStyle = "white";
    ctx.fill();
  });
}, 1000 / 30);

setInterval(() => {
  enemies.push(makeEnemy());
}, 1000 / 2);

document.addEventListener("keydown", (event) => {
  if (event.code === "ArrowUp") {
    player.vel.y = -player.speed;
    player.vel.x = 0;
  }
  if (event.code === "ArrowLeft") {
    player.vel.x = -player.speed;
    player.vel.y = 0;
  }
  if (event.code === "ArrowDown") {
    player.vel.y = player.speed;
    player.vel.x = 0;
  }
  if (event.code === "ArrowRight") {
    player.vel.x = player.speed;
    player.vel.y = 0;
  }
});
