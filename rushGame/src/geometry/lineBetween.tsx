import { player } from "../createPlayer";
import { drawLine } from "../draw/drawLine";
import { Vec2 } from "../math";
import { isPlayerBetweenEnemies } from "./isPlayerBetweenEnemies";

export const lineBetween = (
  ctx,
  startPos: Vec2,
  endPos: Vec2,
  color = "black"
) => {
  drawLine(ctx, startPos, endPos, color);
  if (isPlayerBetweenEnemies(startPos, endPos, player)) {
    return true;
  } else {
    return false;
  }
};
