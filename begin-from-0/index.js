const canvas = document.getElementById("theCanvas");
const ctx = canvas.getContext("2d");

const world = {
  width: canvas.width,
  height: canvas.height,
};
const ball = {
  maxSpeed: 20,
  vel: {
    x: 15,
    y: 11,
  },
  pos: {
    x: 100,
    y: 150,
  },
  radius: 15,
};

const playerHeight = 150
const playerSpeed = 20

const player1 = {
  pos: {
    x: 20,
    y: world.height / 2 - playerHeight / 2,
  },
  vel: {
    x: 0,
    y: 0,
  },
  speed: playerSpeed,
  width: 10,
  height: playerHeight,
};
const player2 = {
    pos: {
      x: world.width - 20,
      y: world.height / 2 - playerHeight / 2,
    },
    vel: {
      x: 0,
      y: 0,
    },
    speed: playerSpeed,
    width: 10,
    height: playerHeight,
  };

const isCollidingLeft = (circle, rect) => {
    return (circle.pos.x < 0 + rect.pos.x + rect.width + circle.radius && between(circle.pos.y, rect.pos.y, rect.pos.y + rect.height) && circle.pos.x > rect.pos.x)
}
const isCollidingRight = (circle, rect) => {
    return (circle.pos.x > rect.pos.x - circle.radius && between(circle.pos.y, rect.pos.y, rect.pos.y + rect.height))
}
const add = (a, b) => {
  // console.log(a.x)
  return {
    x: a.x + b.x,
    y: a.y + b.y,
  };
};
const mult = (k, a) => {
    return {
        x:a.x * k,
        y:a.y * k,
    }
}

const right = {
    x:1,
    y:0,
}

const left = {
    x:-1,
    y:0,
}
const up = {
    x:0,
    y:-1,
}

const down = {
    x:0,
    y:1,
}

const between = (p, a , b) => {
    return (p < b && p > a) || (p < a && p > b)
}
setInterval(() => {
  // Update world
  ball.pos = add(ball.pos, ball.vel);
  player1.pos = add(player1.pos, player1.vel);
  player2.pos = add(player2.pos, player2.vel);

  // Bounce Ball

  if (ball.pos.y < 0 + ball.radius) {
    ball.vel.y = -ball.vel.y;
  }
  if (ball.pos.y > world.height - ball.radius) {
    ball.vel.y = -ball.vel.y;
  }
//   Bounce against player
  if (isCollidingLeft(ball, player1)){
    ball.vel.x = -ball.vel.x
  }
  if (isCollidingRight(ball, player2)){
    ball.vel.x = -ball.vel.x
  }

  // Bounce Player1
  if (player1.pos.y < 0) {
    player1.vel.y = -player1.vel.y
}
if (player1.pos.y > world.height - player1.height) {
    player1.vel.y = -player1.vel.y
}
if (player2.pos.y < 0) {
    player2.vel.y = -player2.vel.y
}
if (player2.pos.y > world.height - player2.height) {
    player2.vel.y = -player2.vel.y
}

  // Draw
  ctx.beginPath();
  ctx.fillStyle = "white";
  ctx.rect(0, 0, world.width, world.height);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(ball.pos.x, ball.pos.y, ball.radius, 0, 2 * Math.PI);
  ctx.fillStyle = "red";
  ctx.fill();

  ctx.beginPath();
  ctx.fillStyle = "blue";
  ctx.rect(player1.pos.x, player1.pos.y, player1.width, player1.height);
  ctx.fill();

  ctx.beginPath();
  ctx.fillStyle = "green";
  ctx.rect(player2.pos.x, player2.pos.y, player2.width, player2.height);
  ctx.fill();

  //   player.pos = player.pos + player.vel
}, 1000 / 30);

window.addEventListener ('keydown', (event) => {
    // Player1
    if (event.code === 'KeyW'){
        player1.vel = mult(player1.speed, up)
    }
    if (event.code === 'KeyS'){
        player1.vel = mult(player1.speed, down)
    }
    
    if (event.code === 'KeyA'){
        player1.vel = mult(player1.speed, left)
    }
    if (event.code === 'KeyD'){
        player1.vel = mult(player1.speed, right)
    }
    // Player2
    if (event.code === 'ArrowUp'){
        player2.vel = mult(player2.speed, up)
    }
    if (event.code === 'ArrowDown'){
        player2.vel = mult(player2.speed, down)
    }
    if (event.code === 'ArrowLeft'){
        player2.vel = mult(player2.speed, left)
    }
    if (event.code === 'ArrowRight'){
        player2.vel = mult(player2.speed, right)
    }
    
})