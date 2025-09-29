import { ctx, player } from "../main.js";
import { world } from "../world.js";

export const drawText = (text, x, y, color, scaleFactor = 1) => {
  const baseFontSize = 48; // Basstorlek för texten
  const fontSize = baseFontSize * scaleFactor; // Beräkna den nya fontstorleken med multiplikationsfaktorn

  // const ctx = document.getElementById("canvas").getContext("2d");
  ctx.font = fontSize + "px serif";
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
};
