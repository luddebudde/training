import React from "react";
import { createRoot } from "react-dom/client";
import {
  blackholes,
  bullets,
  checkArrayRemoval,
  entities,
  lines,
  liveBosses,
  squares,
} from "./arrays";
import { changeIsPaused, isPaused, visualWorld, world } from "./basics";
import {
  createBullet,
  createWaveShoot,
  handleBulletBounce,
} from "./createBullet";
import { player, standardPlayer } from "./createPlayer";
import { dealDamage } from "./dealDamage";
import { drawCircle } from "./draw/drawCircle";
import { drawHealthBar } from "./draw/drawHealthbar";
import { drawLine } from "./draw/drawLine";
import { drawSquare } from "./draw/drawSquare";
import { collideCircleWithRotatedRectangle } from "./geometry/checkRotatedRectangleCollision";
import { doCirclesOverlap } from "./geometry/doCirlceOverlap";
import { handleCollision } from "./handleCollision";
import { keyDownTracker } from "./keyDownTracker";
import { loseScreen } from "./loseScreen";
import { add, mult, multVar } from "./math";
import App from "./react/mainMenu";
import { MenuProvider } from "./react/reactContext";

const canvas = document.getElementById("myCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");

const root = createRoot(document.getElementById("root")!);
root.render(
  <MenuProvider>
    <App />
  </MenuProvider>
);

export const isKeyDown = keyDownTracker();

const airResistanceConstant = 0.05;

let dashCooldown = 10;

setTimeout(() => {
  for (let i = 0; i < 1; i++) {
    // createPlayer();
    // createChaser();
    // createSniper();
    // nextBoss(ctx);
    // loseScreen();
    // generateRewards(ctx);
    // startGame(ctx);
    // PracticeMenu;
    // winAnimation(player);
  }
}, 10);

let currentTime = Date.now(); // Starttid vid första kallelsen
// let startTime = 0; // Om du har en starttidsstämpel

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

// squares.push(square);

const update = () => {
  if (isPaused === true) {
    requestAnimationFrame(update);
    return;
  }

  ctx.beginPath();
  ctx.rect(0, 0, world.width, world.height);
  ctx.fillStyle = "white";
  ctx.fill();

  [fps, deltaTime] = calculateFPS();
  // console.log(fps, deltaTime);

  blackholes.forEach((blackhole) => {
    blackhole.pos = add(blackhole.pos, blackhole.vel);
    drawCircle(ctx, blackhole);
  });

  player.speed =
    standardPlayer.speed *
    (1 +
      player.unlockedAbilities.adrenaline *
        (1 - player.health / player.maxHealth));

  // console.log(player.speed, player.unlockedAbilities.adrenaline);

  player.radius = standardPlayer.radius;

  entities.forEach((entity) => {
    entity.pos = add(entity.pos, entity.vel);
    if (entity.iFrame !== undefined) {
      entity.iFrame--;
    }

    // console.log(entity.vel);

    if (entity.airFriction !== false) {
      entity.vel = multVar(
        entity.vel,
        1 - airResistanceConstant * entity.airFriction
      );
    }

    if (entity.pos.x > world.width - entity.radius && entity.collision) {
      entity?.onWallBounce?.();
      entity.vel.x = -entity.vel.x;
      entity.pos.x = world.width - entity.radius;
    }
    if (entity.pos.x < entity.radius && entity.collision) {
      entity?.onWallBounce?.();
      entity.vel.x = -entity.vel.x;
      entity.pos.x = entity.radius;
    }
    if (entity.pos.y > world.height - entity.radius && entity.collision) {
      entity?.onWallBounce?.();
      entity.vel.y = -entity.vel.y;
      entity.pos.y = world.height - entity.radius;
    }
    if (entity.pos.y < entity.radius && entity.collision) {
      entity?.onWallBounce?.();
      entity.vel.y = -entity.vel.y;
      entity.pos.y = entity.radius;
    }

    entities.forEach((secondEntity) => {
      if (entity !== secondEntity) {
        if (doCirclesOverlap(entity, secondEntity)) {
          if (entity.team !== secondEntity.team) {
            dealDamage(entity, secondEntity, entity.contactDamage, "contact");
            dealDamage(
              secondEntity,
              entity,
              secondEntity.contactDamage,
              "contact"
            );
          }

          if (entity.collision === true && secondEntity.collision === true) {
            const newVel = handleCollision(entity, secondEntity);
            entity.vel = newVel.v1;
            secondEntity.vel = newVel.v2;
          }
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

      if (collideCircleWithRotatedRectangle(entity, rect, true)) {
        entity.onSquareHit?.(entity, rect);
      }
    });

    blackholes.forEach((blackhole, index) => {
      if (entity.blackholeEffected) {
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
      }
    });

    entity?.update?.(ctx);
    drawCircle(ctx, entity);
  });

  lines.forEach((line, index) => {
    drawLine(ctx, line.startPos, line.endPos, line.color);
    lines.splice(index);
  });

  bullets.forEach((bullet, index) => {
    bullet.pos = add(bullet.pos, bullet.vel);

    entities.forEach((entity) => {
      if (doCirclesOverlap(bullet, entity)) {
        if (bullet.team !== entity.team && bullet.shooter !== entity) {
          dealDamage(bullet.shooter, entity, bullet.damage);
          // console.log(bullet.damage, bullet.shooter);
          bullets.splice(index, 1);

          bullet.onHit(entity, bullet);
        }
      }

      drawCircle(ctx, bullet);
    });

    squares.forEach((square) => {
      if (collideCircleWithRotatedRectangle(bullet, square, false)) {
        if (square.health !== undefined) {
          // console.log(bullet.shooter);

          if (bullet.team !== square.team) {
            bullets.splice(index, 1);
            dealDamage(bullet.shooter, square, bullet.damage);
          }
        }
      }
    });

    // Bounces
    if (
      bullet.pos.x > world.width - bullet.radius ||
      bullet.pos.x < bullet.radius
    ) {
      handleBulletBounce(
        bullets,
        bullet,
        { x: -bullet.vel.x, y: bullet.vel.y },
        index
      );

      return;
    }

    if (
      bullet.pos.y > world.height - bullet.radius ||
      bullet.pos.y < bullet.radius
    ) {
      handleBulletBounce(
        bullets,
        bullet,
        { x: bullet.vel.x, y: -bullet.vel.y },
        index
      );

      return;
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
  if (isKeyDown("KeyQ") && dashCooldown < 0) {
    const dashStrength = player.unlockedAbilities.dashStrength;
    const minStrength = player.unlockedAbilities.dashMinStrengthMult;
    player.vel.x += Math.min(player.vel.x * minStrength, dashStrength);
    player.vel.y += Math.min(player.vel.y * minStrength, dashStrength);
    // player.vel = addVar(player.vel, 35);

    console.log("dashj");

    dashCooldown = player.unlockedAbilities.dashCooldown;
  }

  if (isKeyDown("Space") && player.attackDelay < 0) {
    if (player.unlockedAbilities.spreadShotCount === 0) {
      createBullet(
        bullets,
        player,
        mult(mousePos, visualWorld),
        player.bulletDamage,
        player.bulletSpeed,
        {
          bounceable: player.unlockedAbilities.bounceable,
          bounceDamageLoss: player.unlockedAbilities.bounceDamageLoss,
          airFriction: false,
        },
        { bulletRadius: player.bulletSize }
      );
    } else {
      const bulletCount = player.unlockedAbilities.spreadShotCount;
      const spread = player.unlockedAbilities.spreadShotSpread;
      const totalDamage = player.bulletDamage * bulletCount * 1.25;

      createWaveShoot(
        bullets,
        player,
        mousePos,
        totalDamage / bulletCount,
        player.bulletSpeed,
        ((Math.PI * 2) / 180) * spread,
        bulletCount,
        {
          bounceable: player.unlockedAbilities.bounceable,
          bounceDamageLoss: player.unlockedAbilities.bounceDamageLoss,
        }
      );
    }
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

  if (player.health <= 0) {
    changeIsPaused(true);
    if (player.unlockedAbilities.bonusLifeCount > 0) {
      console.log("You have tricked death!");

      player.health = player.maxHealth / 2;
      entities.push(player);

      player.unlockedAbilities.bonusLifeCount--;
      setTimeout(() => {
        changeIsPaused(false);
        // requestAnimationFrame(update);
      }, 1000);
    } else {
      loseScreen();
    }
  }

  // setTimeout(() => {
  requestAnimationFrame(update);
  // }, 50);
};

export const mousePos = {
  x: 0,
  y: 0,
};

document.addEventListener("mousemove", (event) => {
  mousePos.x = event.clientX;
  mousePos.y = event.clientY;
});

// export const activateUpdateFunction = () => {
//   update();
// };

// activateUpdateFunction();
requestAnimationFrame(update);
