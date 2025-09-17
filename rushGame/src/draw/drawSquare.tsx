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

// export const drawSquare = (ctx, rect, rotationCenter) => {
//   const offsetX = rect.x - rotationCenter.x;
//   const offsetY = rect.y - rotationCenter.y;

//   ctx.save();

//   ctx.translate(rect.x + rect.width / 2, rect.y + rect.height / 2);
//   ctx.rotate(rect.rotation);
//   // ctx.translate(rotationCenter.x, rotationCenter.y);

//   // ctx.translate(offsetX, offsetY);

//   ctx.beginPath();
//   ctx.rect(
//     -rect.width / 2 / visualWorld.x,
//     -rect.height / 2 / visualWorld.y,
//     rect.width / visualWorld.x,
//     rect.height / visualWorld.y
//   );
//   ctx.fillStyle = rect.color;
//   ctx.fill();

//   // ctx.translate(rect.x - rect.width / 2, rect.y - rect.height / 2);
//   // ctx.rotate(rect.rotation);

//   ctx.restore();
// };

export const drawSquare = (ctx, rect, rotationCenter) => {
  const worldToCanvasX = (wx) => wx / visualWorld.x;
  const worldToCanvasY = (wy) => wy / visualWorld.y;

  // fallback: om inget rotationCenter skickats -> rotera runt rektangelns mitt
  const rotCenter = rotationCenter || {
    x: rect.x + rect.width / 2,
    y: rect.y + rect.height / 2,
  };

  // konvertera world -> canvas (pixel) innan vi ritar/roterar
  const cx = worldToCanvasX(rotCenter.x);
  const cy = worldToCanvasY(rotCenter.y);

  const rectCenterCanvasX = worldToCanvasX(rect.x + rect.width / 2);
  const rectCenterCanvasY = worldToCanvasY(rect.y + rect.height / 2);

  const canvasRectW = rect.width / visualWorld.x;
  const canvasRectH = rect.height / visualWorld.y;

  // offset från rotationscentrum i canvas-koordinater
  const offsetX = rectCenterCanvasX - cx;
  const offsetY = rectCenterCanvasY - cy;

  ctx.save();
  ctx.translate(cx, cy); // flytta till rotationens mittpunkt (i pixlar)
  ctx.rotate(rect.rotation); // rotation i radianer

  // rita rektangeln med centrum i offsetX/offsetY
  ctx.beginPath();
  ctx.rect(
    offsetX - canvasRectW / 2,
    offsetY - canvasRectH / 2,
    canvasRectW,
    canvasRectH
  );
  ctx.fillStyle = rect.color;
  ctx.fill();

  // valfri debug-outline (avkommentera för felsökning)
  // ctx.lineWidth = 2;
  // ctx.strokeStyle = 'black';
  // ctx.stroke();

  ctx.restore();
};
