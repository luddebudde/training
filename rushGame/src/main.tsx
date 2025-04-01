import { keyDownTracker } from "./keyDownTracker";
import { add, mult, multVar } from "./math";
import { doCirclesOverlap } from "./geometry/doCirlceOverlap";
import { handleCollision } from "./handleCollision";
import { createBullet } from "./createBullet";
import { world } from "./basics";
import { player, standardPlayer } from "./createPlayer";
import {
  blackholes,
  bullets,
  checkArrayRemoval,
  entities,
  lines,
  liveBosses,
  nextBoss,
  squares,
} from "./arrays";
import { drawHealthBar } from "./drawHealthbar";
import { loseScreen } from "./loseScreen";
import { dealDamage } from "./dealDamage";
import { drawCircle } from "./draw/drawCircle";
import { drawSquare } from "./draw/drawSquare";
import { collideCircleWithRotatedRectangle } from "./geometry/checkRotatedRectangleCollision";
import { drawLine } from "./draw/drawLine";

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

export const isKeyDown = keyDownTracker();

const airResistanceConstant = 0.05;

let dashCooldown = 10;

setTimeout(() => {
  for (let i = 0; i < 1; i++) {
    // createChaser();
    // createSniper();
    nextBoss();
    // loseScreen();
  }
}, 10);

let currentTime = Date.now(); // Starttid vid första kallelsen
let startTime = 0; // Om du har en starttidsstämpel

export const calculateFPS = () => {
  const now = Date.now();
  const deltaTime = now - currentTime; // Tid mellan senaste och nuvarande frame

  // Beräkna FPS
  const fps = 1000 / deltaTime;

  // Uppdatera currentTime för nästa frame
  currentTime = now;

  return [fps, deltaTime];
};

export let fps;
export let deltaTime;

const square = {
  x: 800,
  y: 800,
  width: 200,
  height: 200,
  color: "white",
  rotation: 0 * Math.PI,
};

// squares.push(square);

const update = () => {
  ctx.beginPath();
  ctx.rect(0, 0, world.width, world.height);
  ctx.fillStyle = "white";
  ctx.fill();

  [fps, deltaTime] = calculateFPS();
  // console.log(fps, deltaTime);

  player.speed =
    standardPlayer.speed *
    (1 +
      player.unlockedAbilities.adrenaline *
        (1 - player.health / player.maxHealth));

  player.radius = standardPlayer.radius;

  entities.forEach((entity, index) => {
    entity.pos = add(entity.pos, entity.vel);

    if (entity.airFriction !== false) {
      entity.vel = multVar(
        entity.vel,
        1 - airResistanceConstant * entity.airFriction
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

    entity?.update?.(ctx);

    entities.forEach((secondEntity) => {
      if (entity !== secondEntity && doCirclesOverlap(entity, secondEntity)) {
        // if (entity.team !== secondEntity.team) {
        dealDamage(entity, secondEntity, entity.contactDamage);
        // }

        if (entity.collision === true && secondEntity.collision === true) {
          const newVel = handleCollision(entity, secondEntity);
          entity.vel = newVel.v1;
          secondEntity.vel = newVel.v2;
        }
      }
    });
    // console.log(squares);
    squares.forEach((rect) => {
      const rotationAxis = {
        x: rect.width / 2,
        y: rect.height / 2,
      };
      drawSquare(ctx, rect, rotationAxis);

      if (collideCircleWithRotatedRectangle(ctx, entity, rect, true)) {
      }
    });

    blackholes.forEach((blackhole, index) => {
      blackhole.pos = add(blackhole.pos, blackhole.vel);

      const dx = blackhole.pos.x - entity.pos.x;
      const dy = blackhole.pos.y - entity.pos.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      const force = (blackhole.strength * entity.mass) / distance; // Använder strength istället för massan

      const acceleration = force / entity.mass;

      const angle = Math.atan2(dy, dx);
      const ax = acceleration * Math.cos(angle);
      const ay = acceleration * Math.sin(angle);

      entity.vel.x += ax;
      entity.vel.y += ay;

      if (doCirclesOverlap(entity, blackhole) && entity.team !== "enemy") {
        dealDamage(liveBosses[0], entity, 40);

        blackholes.splice(index);
      }

      drawCircle(ctx, blackhole);
    });

    drawCircle(ctx, entity);
  });

  lines.forEach((line) => {
    drawLine(ctx, line.startPos, line.endPos, line.color);
  });

  bullets.forEach((bullet, index) => {
    bullet.pos = add(bullet.pos, bullet.vel);

    entities.forEach((entity) => {
      if (doCirclesOverlap(bullet, entity)) {
        if (bullet.shooter !== entity) {
          // if (bullet.team !== entity.team) {
          dealDamage(bullet.shooter, entity, bullet.damage);

          bullets.splice(index, 1);
          // }

          bullet.onHit(entity, bullet);
        }
      }

      drawCircle(ctx, bullet);
    });

    squares.forEach((square) => {
      if (collideCircleWithRotatedRectangle(ctx, bullet, square, false)) {
        if (square.health !== undefined) {
          dealDamage(bullet.shooter, square, bullet.damage);

          if (bullet.team !== square.team) {
            bullets.splice(index, 1);
          }
        }
      }
    });

    // blackholes.forEach((blackhole, index) => {
    //   // blackhole.pos = add(blackhole.pos, blackhole.vel);

    //   const dx = blackhole.pos.x - bullet.pos.x;
    //   const dy = blackhole.pos.y - bullet.pos.y;
    //   const distance = Math.sqrt(dx * dx + dy * dy);

    //   const force = (blackhole.strength * 2 * bullet.mass) / distance; // Använder strength istället för massan

    //   const acceleration = force / bullet.mass;

    //   const angle = Math.atan2(dy, dx);
    //   const ax = acceleration * Math.cos(angle);
    //   const ay = acceleration * Math.sin(angle);

    //   bullet.vel.x += ax;
    //   bullet.vel.y += ay;

    //   // if (doCirclesOverlap(entity, blackhole) && entity.team !== "enemy") {
    //   //   dealDamage(liveBosses[0], entity, 40);

    //   //   blackholes.splice(index);
    //   // }

    //   drawCircle(ctx, blackhole);
    // });

    if (bullet.pos.x > world.width - bullet.radius) {
      if (bullet.bounceable) {
        bullet.vel.x = -bullet.vel.x;
        bullet.damage *= 1 - bullet.bounceDamageLoss;
        return;
      }
      bullets.splice(index, 1);
    }
    if (bullet.pos.x < bullet.radius) {
      if (bullet.bounceable) {
        bullet.vel.x = -bullet.vel.x;
        bullet.damage *= 1 - bullet.bounceDamageLoss;
        return;
      }
      bullets.splice(index, 1);
    }
    if (bullet.pos.y > world.height - bullet.radius) {
      if (bullet.bounceable) {
        bullet.vel.y = -bullet.vel.y;
        bullet.damage *= 1 - bullet.bounceDamageLoss;
        return;
      }
      bullets.splice(index, 1);
    }
    if (bullet.pos.y < bullet.radius) {
      if (bullet.bounceable) {
        bullet.vel.y = -bullet.vel.y;
        bullet.damage *= 1 - bullet.bounceDamageLoss;
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

  if (liveBosses.length > 0 && player.unlockedAbilities.autoDamage > 0) {
    dealDamage(player, liveBosses[0], player.unlockedAbilities.autoDamage);
  }

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
    createBullet(bullets, player, mousePos, player.bulletDamage, 50, {
      bounceable: player.unlockedAbilities.bounceable,
      bounceDamageLoss: player.unlockedAbilities.bounceDamageLoss,
      airFriction: false,
    });

    player.attackDelay =
      standardPlayer.attackDelay *
      (1 -
        player.unlockedAbilities.adrenaline *
          0.33 *
          (1 - player.health / player.maxHealth));
  }
  dashCooldown--;
  player.attackDelay--;

  checkArrayRemoval(ctx);

  if (player.health > 0) {
    requestAnimationFrame(update);
  } else if (player.unlockedAbilities.bonusLifeCount > 0) {
    console.log("You have tricked death!");

    player.health = player.maxHealth / 2;
    entities.push(player);

    player.unlockedAbilities.bonusLifeCount--;

    setTimeout(() => {
      requestAnimationFrame(update);
    }, 1000);
  } else {
    loseScreen();
  }
};

export const mousePos = {
  x: 0,
  y: 0,
};

document.addEventListener("mousemove", (event) => {
  mousePos.x = event.clientX;
  mousePos.y = event.clientY;
});

update();
