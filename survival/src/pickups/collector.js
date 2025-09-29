import { pickups, xps } from "../main.js";
import { makeDirection } from "../makeDirection.js";

export const createCollector = (xPos, yPos) => {
  const collector = {
    radius: 20,
    pos: {
      x: xPos,
      y: yPos,
    },
    color: "blue",
    priority: 5,

    effect: (object) => {
      xps.forEach((xp) => {
        const newDirection = makeDirection(xp.pos, object.pos);

        xp.vel.x = newDirection.x * 10;
        xp.vel.y = newDirection.y * 10;
      });
    },
    draw: (ctx, assets, gameObject) => {
      ctx.drawImage(
        assets.collector,
        collector.pos.x - collector.radius,
        collector.pos.y - collector.radius,
        collector.radius * 2,
        collector.radius * 2
      );
    },
  };
  pickups.push(collector);
};
