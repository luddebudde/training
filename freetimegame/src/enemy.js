import { makeDirection } from "../makeDirection.js";
import { drawLine } from "../drawLine.js";
import { hasDecidedDirection, player } from "../main.js";
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
  currentPhase: 1,
};

const oldPlayerPos = {
  x: 0,
  y: 0,
};

export const preCharge = () => {
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
};

export const attack = () => {
  if (enemy.currentPhase === 1) {
    if (!hasDecidedDirection) {
      const direction = makeDirection(enemy, oldPlayerPos);
      enemy.vel.x -= direction.x * 20;
      enemy.vel.y -= direction.y * 20;
    }
  } else if (enemy.currentPhase === 2) {
  }
};
