import { player } from "./main.js";
import { makeDirection } from "./makeDirection.js";
import { world } from "./world.js";

export const drawPointingArrow = (ctx, fromObj, toObj, color) => {
  if (toObj.shouldPoint !== undefined && toObj.shouldPoint === true) {
    const direction = makeDirection(toObj.pos, fromObj.pos);
    // fromObj.vel.x += 3;
    const startX = world.width / 2 + -direction.x * 50;
    const startY = world.height / 2 + -direction.y * 50;
    const endX = startX + -direction.x * 40;
    const endY = startY + -direction.y * 40;

    // const originalStrokeStyle = ctx.strokeStyle;
    // const originalFillStyle = ctx.fillStyle;

    // Ändra färgen för linjen och pilspetsen
    ctx.strokeStyle = color; // Till exempel, ändra till röd färg
    ctx.fillStyle = color; // Samma färg för fyllning av pilspetsen

    // console.log(direction);

    // Rita linjen från start till slutpunkt
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();

    // console.log(endY);

    // Rita pilspetsen
    var arrowSize = 20;
    var angle = Math.atan2(endY - startY, endX - startX);
    ctx.beginPath();
    ctx.moveTo(endX, endY);
    ctx.lineTo(
      endX - arrowSize * Math.cos(angle - Math.PI / 6),
      endY - arrowSize * Math.sin(angle - Math.PI / 6)
    );
    ctx.lineTo(
      endX - arrowSize * Math.cos(angle + Math.PI / 6),
      endY - arrowSize * Math.sin(angle + Math.PI / 6)
    );
    ctx.closePath();
    ctx.fill();
  }
};
