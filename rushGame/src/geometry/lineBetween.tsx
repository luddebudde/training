import { player } from "../createPlayer";
import { drawLineBetween } from "../drawLine";
import { Vec2 } from "../math";
import { isPlayerBetweenEnemies } from "./isPlayerBetweenEnemies";

export const lineBetween = (ctx, startPos: Vec2, endPos: Vec2) => {
  drawLineBetween(ctx, startPos, endPos);
  if (isPlayerBetweenEnemies(startPos, endPos, player)) {
    return true;
  } else {
    return false;
  }
};
