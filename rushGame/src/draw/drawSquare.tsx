// export const drawSquare = (ctx, rect, rotationCenter) => {
//   ctx.save();
//   ctx.translate(rect.x + rect.width / 2, rect.y + rect.height / 2);
//   ctx.rotate(-rect.rotation); // Rotation i radianer, utan att multiplicera med Math.PI / 180

import { visualWorld } from "../basics";

//   ctx.beginPath();
//   ctx.rect(-rect.width / 2, -rect.height / 2, rect.width, rect.height);
//   ctx.fillStyle = rect.color;
//   ctx.fill();

//   ctx.restore();
// };

export const drawSquare = (ctx, rect, rotationCenter) => {
  const offsetX = rect.x - rotationCenter.x;
  const offsetY = rect.y - rotationCenter.y;

  ctx.save();
  // ctx.translate(rotationCenter.x, rotationCenter.y);
  ctx.translate(rect.x + rect.width / 2, rect.y + rect.height / 2);
  ctx.rotate(rect.rotation);
  // ctx.translate(offsetX, offsetY);

  ctx.beginPath();
  ctx.rect(-rect.width / 2/ visualWorld.x, -rect.height / 2/ visualWorld.y, rect.width/ visualWorld.x, rect.height/ visualWorld.y);
  ctx.fillStyle = rect.color;
  ctx.fill();

  ctx.restore();
};
