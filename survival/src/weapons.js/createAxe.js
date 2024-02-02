import { drawObject } from "../draw/drawObject.js";
import { loadImage } from "../image.js";
import {
  assets,
  bullets,
  ctx,
  mousePos,
  moveCtx,
  player,
  worldObjects,
} from "../main.js";
import { makeDirection } from "../makeDirection.js";
import { stats } from "../stats.js";
import { world } from "../world.js";

const bulletSpeed = 20 * stats.speed;
// const cooldown = 25;

const axeStats = {
  area: 80,
  speed: 20,
  damage: 20,
  cooldown: 100,
  special: 0,
};

let axeBullet = {};

export const createAxe = () => {
  const area = 25 + stats.area * axeStats.area;
  // const speed = stats.speed * axeStats.speed;
  const speed = 10;
  const damage = stats.damage * axeStats.damage;
  const cooldown = stats.cooldown * axeStats.cooldown;

  // const circleRadius = 50;

  // const randomAngle = getRandomAngle();
  // const randomDistance = getRandomDistance(area);

  // Beräkna slumpad position i cirkeln

  // const direction = makeDirection(stopPos, player.pos);

  axeBullet = {
    angle: 10,
    radius: area,
    attackIntervall: cooldown,
    cooldown: cooldown,
    destroy: false,
    pos: {
      x: player.pos.x,
      y: player.pos.y - player.radius * 4 + area,
    },
    vel: {
      x: speed,
      y: speed,
    },
    speed: speed,
    damage: damage,
    color: "green",
    team: "player",
    priority: 5,

    attack: () => {
      bullets.push(axeBullet);
    },
  };
  bullets.push(axeBullet);

  // console.log(axeBullet);
  // console.log(player.pos.y - player.radius * 4 + area);
  // console.log(axeBullet.pos);
};

function moveAroundCircle(circle) {
  const distance = player.radius * 4 + circle.radius;
  const stopPos = {
    x:
      circle.radius +
      distance * Math.cos((circle.angle * Math.PI) / 180) +
      player.pos.x,
    y:
      circle.radius +
      distance * Math.sin((circle.angle * Math.PI) / 180) +
      player.pos.y,
  };

  if (circle.angle <= 360) {
    circle.angle += 1;
  }

  // Beräkna ny position baserat på vinkeln
  if (circle.pos.x !== undefined) {
    circle.pos.x = world.width / 2 + circle.radius * Math.cos(circle.angle);
    circle.pos.y = world.height / 2 + circle.radius * Math.sin(circle.angle);
  }
  // Uppdatera vinkeln för nästa position
  // circle.angle += (circle.speed * Math.PI) / 180; // Konvertera hastighet till radianer

  // Rita cirkeln på den nya positionen

  // Uppdatera animationen
  requestAnimationFrame(moveAroundCircle);
}

export const axe = {
  name: "axe",
  image: await loadImage(`/public/sprites/aimBulletSprite.png`),
  attackIntervall: axeStats.cooldown * stats.cooldown,
  cooldown: axeStats.cooldown * stats.cooldown,
  attack: createAxe,

  update: () => {
    axe.attackIntervall = axeStats.cooldown * stats.cooldown;

    if (axeBullet.pos !== undefined) {
      // console.log(axeBullet.pos, 1);
      moveAroundCircle(axeBullet);
      console.log(axeBullet.pos);
      // console.log(
      //   world.width / 2 + axeBullet.radius * Math.cos(axeBullet.angle)
      // );
      // console.log(axeBullet.speed * Math.PI);
    }
  },

  stats: axeStats,

  upgrades: {
    level: 0,
    statsOrder: ["cooldown", "speed", "damage", "area", "speed", "special"],
    amountOrder: [-10, 1, 1, 5, 5, 1],
    description: [
      "Decreases the cooldown between each shot",
      "Increases the speed",
      "Increases the damage",
      "Increases the area",
      "Increases the speed even further",
      "Adds special ability",
    ],
  },
};
