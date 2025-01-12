import { keyDownTracker } from "./keyDownTracker";
import { makeDirection } from "./makeDirection";
import { add, addVar, multVar } from "./math";
import { doCirclesOverlap } from "./doCirlceOverlap";
import { handleCollision } from "./handleCollision";
import { createBullet } from "./createBullet";
import { createChaser } from "./enemies/chaser";
import { world } from "./basics";
import { player } from "./createPlayer";
import {
  bullets,
  checkArrayRemoval,
  entities,
  liveBosses,
  spawnBoss,
} from "./arrays";
import { createSniper } from "./enemies/shooter";
import { createRamper } from "./enemies/ramper";
import { generateRewards } from "./generateRewards";
import { drawHealthBar } from "./drawHealthbar";

// import React from "https://esm.sh/react";
// import ReactDOM from "https://esm.sh/react-dom";

// const App = () => <h1>Hello, React!</h1>;
// ReactDOM.render(<App />, document.getElementById("root"));

// import React from "react";
// import ReactDOM from "react-dom";
// import App from "./0./App";

// Ta bort eller kommentera ut nedan rad
// import React.StrictMode från React
// import { StrictMode } from 'react';

// Eller använd enbart
// ReactDOM.render(<App />, document.getElementById("root"));

// import { createRoot } from "react-dom/client";

// Clear the existing HTML content
// document.body.innerHTML = '<div id="app"></div>';

// // Render your React component instead
// const root = createRoot(document.getElementById("app"));
// // root.render(<h1>Hello, world</h1>);

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

export const isKeyDown = keyDownTracker();

// export const mainArrays = [entities, bullets];

// export type NormalEnemy = {
//   health: number;
//   damage: number;
//   pos: {
//     x: number;
//     y: number;
//   };
//   vel: {
//     x: number;
//     y: number;
//   };
//   radius: number;
//   color: string;
//   speed: number;
//   team: string;
//   mass: number;
//   update: () => {};
// };

// export type Player = {
//   name: string,
//   health: number,
//   pos: {
//     x: number,
//     y: number,
//   },
//   vel: {
//     x: number,
//     y: number,
//   },
//   radius: number,
//   color: string,
//   speed: number,
//   team: string,
//   mass: number,
//   unlockedAbilities: string[],
// };

// return player;
// };

// console.log(entities);

// const player = createPlayer();

// console.log(entities);

const airResistanceConstant = 0.95;

let dashCooldown = 10;

let initialized = false;

function init() {
  if (initialized) {
    console.log("Init har redan körts!");
    return;
  }
  initialized = true;

  console.log("Init körs för första gången!");
  // Din initialiseringskod här
}

document.addEventListener("DOMContentLoaded", init);

setTimeout(() => {
  for (let i = 0; i < 1; i++) {
    // createChaser();
    // createSniper();
    spawnBoss();
  }
}, 10);

const update = () => {
  ctx.beginPath();
  ctx.rect(0, 0, world.width, world.height);
  ctx.fillStyle = "white";
  ctx.fill();

  // console.log(mainArrays);

  // mainArrays.forEach((array) => {
  entities.forEach((entity, index) => {
    // console.log(entity.airFriction);

    entity.pos = add(entity.pos, entity.vel);

    if (entity.airFriction == true) {
      entity.vel = multVar(
        entity.vel,
        airResistanceConstant * entity.airFriction
      );
    }

    if (entity.pos.x > world.width - entity.radius) {
      entity?.onWallBounce?.();
      entity.vel.x = -entity.vel.x;
      entity.pos.x = world.width - entity.radius;
    }
    if (entity.pos.x < entity.radius) {
      entity?.onWallBounce?.();
      entity.vel.x = -entity.vel.x;
      entity.pos.x = entity.radius;
    }
    if (entity.pos.y > world.height - entity.radius) {
      entity?.onWallBounce?.();
      entity.vel.y = -entity.vel.y;
      entity.pos.y = world.height - entity.radius;
    }
    if (entity.pos.y < entity.radius) {
      entity?.onWallBounce?.();
      entity.vel.y = -entity.vel.y;
      entity.pos.y = entity.radius;
    }

    entities.forEach((secondEntity) => {
      if (entity !== secondEntity && doCirclesOverlap(entity, secondEntity)) {
        if (entity.team !== secondEntity.team) {
          secondEntity.health -= entity.contactDamage;
        }

        const newVel = handleCollision(entity, secondEntity);
        entity.vel = newVel.v1;
        secondEntity.vel = newVel.v2;
      }
    });

    entity?.update?.(ctx);

    ctx.beginPath();
    ctx.arc(entity.pos.x, entity.pos.y, entity.radius, 0, 2 * Math.PI);
    ctx.fillStyle = entity.color;
    ctx.fill();
  });

  bullets.forEach((bullet, index) => {
    bullet.pos = add(bullet.pos, bullet.vel);

    entities.forEach((entity) => {
      if (doCirclesOverlap(bullet, entity) && bullet.team !== entity.team) {
        entity.health -= bullet.damage;
        bullets.splice(index, 1);
      }

      ctx.beginPath();
      ctx.arc(bullet.pos.x, bullet.pos.y, bullet.radius, 0, 2 * Math.PI);
      ctx.fillStyle = bullet.color;
      ctx.fill();
    });

    if (bullet.pos.x > world.width - bullet.radius) {
      if (bullet.bounceable) {
        bullet.vel.x = -bullet.vel.x;
        bullet.damage = 1 - bullet.bounceDamageLoss;
        return;
      }
      bullets.splice(index, 1);
    }
    if (bullet.pos.x < bullet.radius) {
      if (bullet.bounceable) {
        bullet.vel.x = -bullet.vel.x;
        bullet.damage = 1 - bullet.bounceDamageLoss;
        return;
      }
      bullets.splice(index, 1);
    }
    if (bullet.pos.y > world.height - bullet.radius) {
      if (bullet.bounceable) {
        bullet.vel.y = -bullet.vel.y;
        bullet.damage = 1 - bullet.bounceDamageLoss;
        return;
      }
      bullets.splice(index, 1);
    }
    if (bullet.pos.y < bullet.radius) {
      if (bullet.bounceable) {
        bullet.vel.y = -bullet.vel.y;
        bullet.damage = 1 - bullet.bounceDamageLoss;
        return;
      }
      bullets.splice(index, 1);
    }
  });

  drawHealthBar(
    ctx,
    player.pos.x - player.radius,
    player.pos.y + player.radius + 10,
    player.radius * 2,
    20,
    player.health,
    player.maxHealth
  );

  if (isKeyDown("KeyW")) {
    player.vel.y += -player.speed;
  }
  if (isKeyDown("KeyA")) {
    player.vel.x += -player.speed;
  }
  if (isKeyDown("KeyS")) {
    player.vel.y += player.speed;
  }
  if (isKeyDown("KeyD")) {
    player.vel.x += player.speed;
  }
  if (isKeyDown("KeyQ") && player.unlockedAbilities.dash && dashCooldown < 0) {
    player.vel.x += Math.min(player.vel.x, 15);
    player.vel.y += Math.min(player.vel.y, 15);
    // player.vel = addVar(player.vel, 35);

    console.log("dashj");

    dashCooldown = 100;
  }

  if (isKeyDown("Space") && player.attackDelay < 0) {
    // generateRewards();
    // const direction = makeDirection(player.pos, mousePos);
    createBullet(bullets, player, mousePos, 10, 50, {
      bounceable: player.unlockedAbilities.bounceable,
    });

    player.attackDelay = 10;
  }
  dashCooldown--;
  player.attackDelay--;

  checkArrayRemoval(ctx);

  requestAnimationFrame(update);
};

export const mousePos = {
  x: 0,
  y: 0,
};

document.addEventListener("mousemove", (event) => {
  mousePos.x = event.clientX;
  mousePos.y = event.clientY;

  // console.log(`Musposition: (${mousePos.x}, ${mousePos.y})`);
});

update();
