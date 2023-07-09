import { drawLine } from "../drawLine.js";
import { player } from "../main.js";
import { world } from "../world.js";

export let enemy = {
  radius: 80,
  xPos: world.width / 2,
  yPos: world.height / 2,
  vel: {
    x: 0,
    y: 0,
  },
  attackSpeed: 100,
};

let x = 0;
let y = 0;

let phaseTime = 200;
let prePhase = true;
let hasDecidedDirection = false;

const oldPlayerPos = {
  x: 0,
  y: 0,
};

export const attack = () => {
  if (prePhase) {
    oldPlayerPos.x = player.xPos;
    oldPlayerPos.y = player.yPos;
    enemy.vel.x = 0;
    enemy.vel.y = 0;
    const lineX1 = enemy.xPos - enemy.radius;
    const lineX2 = enemy.xPos + enemy.radius;
    const lineY1 = enemy.yPos - enemy.radius;
    const lineY2 = enemy.yPos + enemy.radius;

    drawLine(lineX1, enemy.yPos, oldPlayerPos.x, oldPlayerPos.y);
    drawLine(lineX2, enemy.yPos, oldPlayerPos.x, oldPlayerPos.y);
    drawLine(enemy.xPos, lineY1, oldPlayerPos.x, oldPlayerPos.y);
    drawLine(enemy.xPos, lineY2, oldPlayerPos.x, oldPlayerPos.y);

    x = x + 1;
    if (x % phaseTime === 0) {
      prePhase = false;
      hasDecidedDirection = false;
      x = 0;
    }
    // if (changePrePhase) {
    //   setInterval(() => {
    //     prePhase = false;
    //     hasDecidedDirection = true;
    //   }, phaseTime);
    // }
  }

  if (!prePhase) {
    if (!hasDecidedDirection) {
      const diff = {
        x: enemy.xPos - oldPlayerPos.x,
        y: enemy.yPos - oldPlayerPos.y,
      };
      const dist = Math.sqrt(diff.x * diff.x + diff.y * diff.y);
      const direction = {
        x: diff.x / dist,
        y: diff.y / dist,
      };
      enemy.vel.x -= direction.x * 20;
      enemy.vel.y -= direction.y * 20;
      hasDecidedDirection = true;
    }
    y = y + 1;
    if (y % (phaseTime * 2) === 0) {
      prePhase = true;
      y = 0;
    }
  }
};
