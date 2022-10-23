const canvas = document.getElementById("theCanvas");
const ctx = canvas.getContext("2d");
const world = {
  width: canvas.width,
  height: canvas.height,
};

const reset = () => {
  startTime = Date.now()
  player = {
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
    hasLost: false
  }
  enemies = [
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
  ]
}

const currentScore = () => {
  return Math.floor((Date.now() - startTime) / 1000)
}

const difficulty = (timeScore) => {
  return 1 + Math.floor(timeScore / 10)
}

const currentDifficulty = () => {
  return difficulty(currentScore())
}

const speedMultiplier = (difficulty) => {
  return  Math.sqrt(difficulty) + 0.5
}

const currentSpeedMultipllier = () => {
  return speedMultiplier(currentDifficulty())
}

const spawnRate = (difficulty) => {
  return Math.round(Math.pow(difficulty , 1.5))
}

const randomOnCirlce = (r) => {
  const angle = Math.random() * 2 * Math.PI
  return {
    x: Math.cos(angle) * r,
    y: Math.sin(angle) * r,
  }
}

const randomOnDonut = (minR, maxR) => {
  const randomR = Math.random() * (maxR - minR) + minR
  return randomOnCirlce(randomR)
}

const add = (a, b) => {
  return {
    x: a.x + b.x,
    y: a.y + b.y,
  }
}

const makeEnemy = () => {
  return {
    radius: Math.random() * 3 + 7,
    speed: Math.random() * 0.5 * currentSpeedMultipllier(),
    mass: 5,
    fragile: Math.random() < 0.5,
    pos: add(randomOnDonut(world.width / 2, world.width), player.pos),
    vel: {
      x: 0,
      y: 0,
    },
  };
};


const worldToCanvasCoord = (pos, canvas, player) => {
  return {
    x: pos.x - player.pos.x + canvas.width / 2,
    y: pos.y - player.pos.y + canvas.height / 2
  }
}

let startTime
let player 
let enemies 
reset()


setInterval(() => {
  if (player.hasLost) {
    return 
  }
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
      player.hasLost = true
    }
  });


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

  if (player.color === 'red') {
    ctx.fillStyle = "red"
    ctx.font = "40px Arial";
    ctx.fillText('You are so bad and such a loser lol', 80, world.height / 2);
  }
  // Draw Player
  const playerScreenCoord = worldToCanvasCoord(player.pos, canvas, player)
  ctx.beginPath();
  ctx.arc(playerScreenCoord.x, playerScreenCoord.y, player.radius, 0, 2 * Math.PI);
  ctx.fillStyle = player.color;
  ctx.fill();

  // Draw enemy
  enemies.forEach((enemy) => {
    const enemyScreenCoord = worldToCanvasCoord(enemy.pos, canvas, player)
    ctx.beginPath();
    ctx.arc(enemyScreenCoord.x, enemyScreenCoord.y, enemy.radius, 0, 2 * Math.PI);
    ctx.fillStyle = "white";
    ctx.fill();
  });
  // Timer
  const timer = Math.floor((Date.now() - startTime) / 1000)
  ctx.fillStyle = "yellow"
  ctx.font = "30px Arial";
  ctx.fillText(timer, 25, 50);
}, 1000 / 30);

const spawnTickIntervall = 1

const nTimes = (callback, n) => {
  new Array(n).fill(0).forEach(callback)
}

setInterval(() => {
  nTimes(()=> {
    enemies.push(makeEnemy());  
  }, spawnRate(currentDifficulty()))
}, 1000 / spawnTickIntervall);

document.addEventListener("keydown", (event) => {
  const speed = player.speed * currentSpeedMultipllier()
  if (event.code === "ArrowUp") {
    player.vel.y = -speed ;
    player.vel.x = 0;
  }
  if (event.code === "ArrowLeft") {
    player.vel.x = -speed;
    player.vel.y = 0;
  }
  if (event.code === "ArrowDown") {
    player.vel.y = speed;
    player.vel.x = 0;
  }
  if (event.code === "ArrowRight") {
    player.vel.x = speed;
    player.vel.y = 0;
  }
  if (event.code === "KeyR") {
    reset()
  }
});
