import { keyDownTracker } from "./keyDownTracker";
import { add, multVar } from "./math";
import { doCirclesOverlap } from "./doCirlceOverlap";
import { handleCollision } from "./handleCollision";
import { createBullet } from "./createBullet";
import { world } from "./basics";
import { player } from "./createPlayer";
import {
  bullets,
  checkArrayRemoval,
  entities,
  liveBosses,
  nextBoss,
} from "./arrays";
import { drawHealthBar } from "./drawHealthbar";
import { loseScreen } from "./loseScreen";
import { dealDamage } from "./dealDamage";

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

const update = () => {
  ctx.beginPath();
  ctx.rect(0, 0, world.width, world.height);
  ctx.fillStyle = "white";
  ctx.fill();

  player.speed =
    player.standardspeed *
    (1 +
      player.unlockedAbilities.adrenaline *
        (1 - player.health / player.maxHealth));

  // mainArrays.forEach((array) => {
  entities.forEach((entity, index) => {
    // console.log(entity.airFriction);

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
        if (entity.team !== secondEntity.team) {
          dealDamage(entity, secondEntity, entity.contactDamage);
          // secondEntity.health -= entity.contactDamage;
        }

        if (entity.collision === true && secondEntity.collision === true) {
          const newVel = handleCollision(entity, secondEntity);
          entity.vel = newVel.v1;
          secondEntity.vel = newVel.v2;
        }
      }
    });

    ctx.beginPath();
    ctx.arc(entity.pos.x, entity.pos.y, entity.radius, 0, 2 * Math.PI);
    ctx.fillStyle = entity.color;
    ctx.fill();
  });

  bullets.forEach((bullet, index) => {
    bullet.pos = add(bullet.pos, bullet.vel);

    entities.forEach((entity) => {
      if (doCirclesOverlap(bullet, entity)) {
        if (bullet.team !== entity.team) {
          dealDamage(bullet, entity, bullet.damage);

          bullets.splice(index, 1);
        }
        if (bullet.shooter !== entity) {
          bullet.onHit(entity, bullet);
        }
      }

      ctx.beginPath();
      ctx.arc(bullet.pos.x, bullet.pos.y, bullet.radius, 0, 2 * Math.PI);
      ctx.fillStyle = bullet.color;
      ctx.fill();
    });

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

  // const autoDamage = player.unlockedAbilities.autoDamage;
  if (liveBosses.length > 0) {
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
    // generateRewards();
    // const direction = makeDirection(player.pos, mousePos);
    createBullet(bullets, player, mousePos, player.bulletDamage, 50, {
      bounceable: player.unlockedAbilities.bounceable,
      bounceDamageLoss: player.unlockedAbilities.bounceDamageLoss,
      airFriction: false,
    });

    player.attackDelay =
      player.standardAttackDelay *
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

  // console.log(`Musposition: (${mousePos.x}, ${mousePos.y})`);
});

update();
