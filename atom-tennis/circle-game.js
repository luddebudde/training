"use strict";

const combinations = (arr) =>
  arr.map((a1, index) => arr.slice(index).map((a2) => [a1, a2])).flat();

const throttle = (time) => {
  let throttlePause;

  return (callback) => {
    //don't run the function if throttlePause is true
    if (throttlePause) {
      return;
    }

    //set throttlePause to true after the if condition. This allows the function to be run once
    throttlePause = true;
    callback();

    //setTimeout runs the callback within the specified time
    setTimeout(() => {
      //throttlePause is set to false once the function has been called, allowing the throttle function to loop
      throttlePause = false;
    }, time);
  };
};

const diff = (v1, v2) => ({
  x: v1.x - v2.x,
  y: v1.y - v2.y,
});
const add = (v1, v2) => ({
  x: v1.x + v2.x,
  y: v1.y + v2.y,
});
const dot = (v1, v2) => v1.x * v2.x + v1.y * v2.y;
const multiply = (k, v) => ({
  x: v.x * k,
  y: v.y * k,
});
const norm = (v) => {
  const len = Math.sqrt(dot(v, v));
  if(len === 0){
    return {
      x: 0,
      y: 0,
    }
  }
  return {
    x: v.x / len,
    y: v.y / len,
  };
};

const random = (min, max) => min + Math.random() * (max - min);

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let isPaused = false;

let hasLost = false;

const mass = (radius) => {
  const area = Math.PI * radius * radius;
  return 0.001 * area;
};

const spawn = (world, team) => {
  const minRadius = 10;
  const maxRadius = 75;
  const radius = minRadius + Math.random() * (maxRadius - minRadius);

  const margin = radius + 100;
  const startSpeed = 150;

  let pos;
  let vel;
  const side = Math.floor(Math.random() * 4); // 0,1,3, eller 4
  // vanster
  if (side === 0) {
    pos = {
      x: -margin,
      y: random(radius, world.dim.height - radius),
    };
    vel = {
      x: startSpeed,
      y: 0,
    };
  }
  // hoger
  if (side === 1) {
    pos = {
      x: world.dim.width + margin,
      y: random(radius, world.dim.height - radius),
    };
    vel = {
      x: -startSpeed,
      y: 0,
    };
  }
  // top
  if (side === 2) {
    pos = {
      x: random(radius, world.dim.width - radius),
      y: -margin,
    };
    vel = {
      x: 0,
      y: startSpeed,
    };
  }
  // botten
  if (side === 3) {
    pos = {
      x: random(radius, world.dim.width - radius),
      y: world.dim.width + margin,
    };
    vel = {
      x: 0,
      y: -startSpeed,
    };
  }

  const circle = {
    dim: {
      radius: radius,
    },
    pos: pos,
    vel: vel,
    mass: mass(radius),
    color: team.color,
    acc: {
      x: 0,
      y: 0,
    },
    friction: 0.001,
  };

  world.circles.push(circle);
  team.circles.push(circle);
};

const handleSpawn = (world) => {
  spawn(world, world.teams.team1);
  spawn(world, world.teams.team2);
};

const createWorld = () => {
  const worldDim = {
    height: canvas.height,
    width: canvas.width,
  };

  const playerRadius = 20;
  const team2Color = "red";
  const team1Color = "blue";
  const playerSpeed = 700.0;
  const playerFriction = 0.03;

  const boost = (player) => {
    if (player.charge >= 1) {
      // player.vel.x = player.vel.x * 2;
      // player.vel.y = player.vel.y * 2;
      player.charge = 0;
      player.vel = add(player.vel, multiply(300, norm(player.vel)));
    }
  };

  const player1 = {
    dim: {
      radius: playerRadius,
    },
    pos: {
      x: worldDim.width / 2 + 2 * playerRadius,
      y: worldDim.height / 2,
    },
    vel: {
      x: 0,
      y: 0,
    },
    acc: {
      x: 0,
      y: 0,
    },
    friction: playerFriction,
    mass: mass(playerRadius),
    speed: playerSpeed,
    color: team1Color,
    charge: 1,
  };
  player1.boost = () => boost(player1);

  const player2 = {
    dim: {
      radius: playerRadius,
    },
    pos: {
      x: worldDim.width / 2 - 2 * playerRadius,
      y: worldDim.height / 2,
    },
    vel: {
      x: 0,
      y: 0,
    },
    acc: {
      x: 0,
      y: 0,
    },
    friction: playerFriction,
    mass: mass(playerRadius),
    speed: playerSpeed,
    color: team2Color,
    charge: 1,
  };
  player2.boost = () => boost(player2);

  const world = {
    player1: player1,
    player2,
    circles: [player1, player2],
    teams: {
      team1: {
        color: team1Color,
        player: player1,
        circles: [],
      },
      team2: {
        color: team2Color,
        player: player2,
        circles: [],
      },
    },
    dim: worldDim,
  };

  const spawnCount = Math.floor (Math.random() * 3 + 1)
  new Array(spawnCount).fill(0).forEach(() => {
    handleSpawn(world);
  })
  return world;
};

let world = createWorld();

const restart = () => {
  hasLost = false;
  world = createWorld();
  setPause(true);
};

const setPause = (newIsPaused) => {
  isPaused = newIsPaused;
  if (isPaused === true) {
    stopButton.innerText = "START";
  }
  if (isPaused === false) {
    stopButton.innerText = "STOP";
  }
};

const togglePlay = () => {
  setPause(!isPaused);
};
const stopButton = document.getElementById("button");
stopButton.addEventListener("click", () => {
  togglePlay();
});

const isOverlapping = (circleA, circleB) => {
  const diffPos = diff(circleA.pos, circleB.pos);
  const minDist = circleA.dim.radius + circleB.dim.radius;
  return dot(diffPos, diffPos) < minDist * minDist;
};

// const sayHi = () => {
//     console.log("Hej!")
// }
// sayHi()s

const fps = 60;
const delay = 1000 / fps;
const dt = 1 / fps;

const render = (world) => {
  ctx.beginPath();
  ctx.globalAlpha = 1;
  ctx.clearRect(0, 0, world.dim.width, world.dim.height);
  ctx.fillStyle = "white";
  ctx.fill();

  const players = [world.teams.team1.player, world.teams.team2.player];

  players.forEach((player) => {
    ctx.beginPath();
    ctx.arc(
      player.pos.x,
      player.pos.y,
      player.dim.radius,
      0,
      2 * Math.PI * player.charge
    );
    ctx.strokeStyle = player.color;
    ctx.lineWidth = 2;
    ctx.stroke();

    if (player.charge >= 1) {
      ctx.beginPath();
      ctx.fillStyle = player.color;
      ctx.arc(
        player.pos.x,
        player.pos.y,
        player.dim.radius,
        0,
        2 * Math.PI * player.charge
      );
      ctx.fill();
    }
  });

  world.circles.forEach((circle) => {
    ctx.beginPath();
    ctx.globalAlpha = 0.6;
    ctx.arc(circle.pos.x, circle.pos.y, circle.dim.radius, 0, 2 * Math.PI);
    ctx.fillStyle = circle.color;
    ctx.fill();
  });
};

const updateAcceleration = (circle) => {
  // Accelrate the velocity
  circle.vel.x += circle.acc.x * dt;
  circle.vel.y += circle.acc.y * dt;
}

const updateMovement = (circle) => {
  // Update pos
  circle.pos.y += circle.vel.y * dt;
  circle.pos.x += circle.vel.x * dt;
};

const update = (world) => {
  // charge batterieses

  world.circles.forEach((circle) => {
    updateAcceleration(circle);
    updateMovement(circle);
  });

  const players = [world.teams.team1.player, world.teams.team2.player];
  players.forEach((player) => {
    player.charge = player.charge + 0.01;
  });
  if (Math.random() * 1000 < 1) {
    handleSpawn(world);
  }

  world.teams.team1.circles.forEach((circle) => {
    if (isOverlapping(world.teams.team2.player, circle)) {
      hasLost = true;
    }
  });

  world.teams.team2.circles.forEach((circle) => {
    if (isOverlapping(world.teams.team1.player, circle)) {
      hasLost = true;
    }
  });

  combinations(world.circles)
    .filter(([c1, c2]) => c1 !== c2)
    .forEach(([c1, c2]) => {
      if (!isOverlapping(c1, c2)) {
        return;
      }
      const newVel = (c1, c2) => {
        const diffPos = diff(c1.pos, c2.pos);
        const diffVel = diff(c1.vel, c2.vel);

        const k1 = (2 * c2.mass) / (c1.mass + c2.mass);
        const k2 = dot(diffVel, diffPos) / dot(diffPos, diffPos);
        return diff(c1.vel, multiply(k1 * k2, diffPos));
      };
      const v1 = newVel(c1, c2);
      const v2 = newVel(c2, c1);

      c1.vel = v1;
      c2.vel = v2;

      new Array(0).fill(0).forEach(() => {
        updateMovement(c1);
        updateMovement(c2);
        console.log('AA');
      })
    });

  world.circles.forEach((circle) => {
    // Collide world boundaries
    //  bottom
    if (
      circle.pos.y + circle.dim.radius > world.dim.height &&
      circle.vel.y > 0
    ) {
      circle.vel.y = -circle.vel.y;
      circle.pos.y = world.dim.height - circle.dim.radius;
    }
    //  top
    if (circle.pos.y - circle.dim.radius < 0 && circle.vel.y < 0) {
      circle.vel.y = -circle.vel.y;
      circle.pos.y = circle.dim.radius;
    }
    //  right
    if (
      circle.pos.x + circle.dim.radius > world.dim.width &&
      circle.vel.x > 0
    ) {
      circle.vel.x = -circle.vel.x;
      circle.pos.x = world.dim.width - circle.dim.radius;
    }
    // left
    if (circle.pos.x - circle.dim.radius < 0 && circle.vel.x < 0) {
      circle.vel.x = -circle.vel.x;
      circle.pos.x = circle.dim.radius;
    }
  });

  const dt = delay * 0.001;

  // Friction
  world.circles.forEach((circle) => {
    circle.vel.x = circle.vel.x * (1 - circle.friction);
    circle.vel.y = circle.vel.y * (1 - circle.friction);
  });
};

setInterval(() => {
  if (!isPaused && !hasLost) {
    update(world);
  }

  render(world);
}, delay);

document.addEventListener("keyup", (event) => {
  const player1 = world.teams.team1.player;
  const player2 = world.teams.team2.player;

  switch (event.code) {
    case "KeyW":
    case "KeyS":
      player1.acc.y = 0;
      break;
    case "KeyA":
    case "KeyD":
      player1.acc.x = 0;
      break;
    case "ArrowUp":
    case "ArrowDown":
      player2.acc.y = 0;
      break;
    case "ArrowLeft":
    case "ArrowRight":
      player2.acc.x = 0;
      break;
  }
});

document.addEventListener("keydown", (event) => {
  const player1 = world.teams.team1.player;
  if (event.code === "KeyP"){
    handleSpawn(world)
  }
  if (event.code === "KeyR") {
    restart();
  }
  if (event.code === "Space") {
    togglePlay();
  }
  if (event.code === "KeyQ") {
    player1.boost();
  }
  if (event.code === "KeyW") { 
    player1.acc.y = -player1.speed;
    // player1.vel.y += -player1.speed;
    // player1.vel.x = 0;
  }
  if (event.code === "KeyS") {
    player1.acc.y = player1.speed;
    // player1.vel.y += player1.speed;
    // player1.vel.x = 0;
  }
  if (event.code === "KeyA") {
    player1.acc.x = -player1.speed;
    // player1.vel.x += -player1.speed;
    // player1.vel.y = 0;
  }
  if (event.code === "KeyD") {
    player1.acc.x = player1.speed;
    // player1.vel.x += player1.speed;
    // player1.vel.y = 0;
  }
  const player2 = world.teams.team2.player;

  if (event.code === "KeyM") {
    player2.boost();
  }
  if (event.code === "ArrowUp") {
    player2.acc.y = -player2.speed;
    // player2.vel.y += -player2.speed;
    // player2.vel.x = 0;
  }
  if (event.code === "ArrowDown") {
    player2.acc.y = player2.speed;
    // player2.vel.y += player2.speed;
    // player2.vel.x = 0;
  }
  if (event.code === "ArrowLeft") {
    player2.acc.x = -player2.speed;
    // player2.vel.x += -player2.speed;
    // player2.vel.y = 0;
  }
  if (event.code === "ArrowRight") {
    player2.acc.x = player2.speed;
    // player2.vel.x += player2.speed;
    // player2.vel.y = 0;
  }
});

function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

  const restartbutton = document.getElementById("restart");
  restartbutton.addEventListener("click", () => {
    restart();
  });
