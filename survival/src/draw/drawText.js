import { player } from "../main.js";
import { world } from "../world.js";

export const drawText = (ctx) => {
  // const ctx = document.getElementById("canvas").getContext("2d");
  ctx.font = "48px serif";
  ctx.fillStyle = "black";
  ctx.fillText(player.xp.level, world.width - 80, 40);
};
