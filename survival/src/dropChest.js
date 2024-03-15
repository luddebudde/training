import { chests, entities } from "./main.js";

export const dropChest = (locX, locY) => {
  const chest = {
    pos: {
      x: locX,
      y: locY,
    },
    radius: 50,
    // draw: (ctx, assets, object) => {
    //   //   console.log(explosion);
    //   //   ctx.drawImage(sprite, explosion.pos.x, explosion.pos.y, size, size);
    //   explosionAnimation.step();
    //   explosionAnimation.draw(
    //     ctx,
    //     sprite,
    //     explosion.pos.x - explosion.radius / 1.2,
    //     explosion.pos.y - explosion.radius / 2,
    //     explosion.radius * 2,
    //     explosion.radius
    //   );
    //   const stepInfo = explosionAnimation.step();

    //   if (stepInfo) {
    //     explosion.hasExpired = true;
    //   }
    // },
  };
  // console.log("chest");

  chests.push(chest);
};
