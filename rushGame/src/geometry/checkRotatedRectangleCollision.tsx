import { squares } from "../arrays";
import { drawCircle } from "../draw/drawCircle";
import { drawSquare } from "../draw/drawSquare";
import { add, multVar, Vec2 } from "../math";
import { isPointInsideArea } from "./isInsideRectangle";
import { getDistance } from "./makeDirection";

export function collideCircleWithRotatedRectangle(ctx, circle, rect) {
  var rectCenterX = rect.x + rect.width / 2;
  var rectCenterY = rect.y + rect.height / 2;

  var rectX = rect.x;
  var rectY = rect.y;

  var rectReferenceX = rectX;
  var rectReferenceY = rectY;

  // Rotate circle's center point back
  var unrotatedCircleX =
    Math.cos(rect.rotation) * (circle.pos.x - rectCenterX) -
    Math.sin(rect.rotation) * (circle.pos.y - rectCenterY) +
    rectCenterX;
  var unrotatedCircleY =
    Math.sin(rect.rotation) * (circle.pos.x - rectCenterX) +
    Math.cos(rect.rotation) * (circle.pos.y - rectCenterY) +
    rectCenterY;

  // Closest point in the rectangle to the center of circle rotated backwards(unrotated)
  var closestX, closestY;

  // Find the unrotated closest x point from center of unrotated circle
  if (unrotatedCircleX < rectReferenceX) {
    closestX = rectReferenceX;
  } else if (unrotatedCircleX > rectReferenceX + rect.width) {
    closestX = rectReferenceX + rect.width;
  } else {
    closestX = unrotatedCircleX;
  }

  // Find the unrotated closest y point from center of unrotated circle
  if (unrotatedCircleY < rectReferenceY) {
    closestY = rectReferenceY;
  } else if (unrotatedCircleY > rectReferenceY + rect.height) {
    closestY = rectReferenceY + rect.height;
  } else {
    closestY = unrotatedCircleY;
  }

  // Determine collision
  var collision = false;
  var distance = getDistance(
    { x: unrotatedCircleX, y: unrotatedCircleY },
    { x: closestX, y: closestY }
  );

  const pointA = { x: rectReferenceX, y: rectReferenceY };
  const pointB = { x: rect.width, y: rect.y };
  const pointC = { x: rect.x, y: rect.height };
  const pointD = { x: rect.width, y: rect.height };

  const points = [pointA, pointB, pointC, pointD];

  ctx.beginPath();
  ctx.arc(closestX, closestY, 10, 0, 2 * Math.PI);
  ctx.fillStyle = "black";
  ctx.fill();

  ctx.save();
  ctx.translate(rectCenterX, rectCenterY);
  ctx.rotate(-rect.rotation); // Rotation i radianer, utan att multiplicera med Math.PI / 180

  ctx.beginPath();
  ctx.rect(-rect.width / 2, -rect.height / 2, rect.width, rect.height);
  ctx.fillStyle = "green";
  ctx.fill();

  // ctx.beginPath();
  // ctx.arc(
  //   closestX - rect.x - rect.width / 2,
  //   closestY - rect.y - rect.height / 2,
  //   10,
  //   0,
  //   2 * Math.PI
  // );
  // ctx.fillStyle = "black";
  // ctx.fill();

  isPointInsideArea(
    ctx,
    circle,
    {
      x: -rect.width / 2,
      y: -rect.height / 2,
      width: rect.width,
      height: rect.height,
      rotation: 1,
    },
    circle.radius
  );

  ctx.beginPath();
  ctx.arc(-rect.width / 2, -rect.height / 2, 10, 0, 2 * Math.PI);
  ctx.fillStyle = "black";
  ctx.fill();

  ctx.restore();

  if (distance < circle.radius) {
    collision = true;

    let alpha: number;

    if (closestX === pointA.x || closestX === pointD.x) {
      // Horizontal === 1 (Horizontal)
      alpha = -Math.PI * 0.5;
    } else {
      // Horizontal === 0 (Vertical)
      alpha = Math.PI * 0;
    }
    const tmp: Vec2 = {
      x:
        Math.cos(rect.rotation + alpha) * circle.vel.x -
        Math.sin(rect.rotation + alpha) * circle.vel.y,
      y:
        Math.sin(rect.rotation + alpha) * circle.vel.x +
        Math.cos(rect.rotation + alpha) * circle.vel.y,
    };

    tmp.y = -tmp.y;

    circle.vel.x =
      Math.cos(-rect.rotation - alpha) * tmp.x -
      Math.sin(-rect.rotation - alpha) * tmp.y;

    circle.vel.y =
      Math.sin(-rect.rotation - alpha) * tmp.x +
      Math.cos(-rect.rotation - alpha) * tmp.y;
  } else {
    collision = false;
  }

  return collision;
}

// export const changeDirection = (ctx, entity, rect) => {
//   const tmp: Vec2 = {
//     x:
//       Math.cos(rect.rotation) * entity.vel.x -
//       Math.sin(rect.rotation) * entity.vel.y,
//     y:
//       Math.sin(rect.rotation) * entity.vel.x +
//       Math.cos(rect.rotation) * entity.vel.y,
//   };

//   tmp.y = -tmp.y;

//   entity.vel.x =
//     Math.cos(-rect.rotation) * tmp.x - Math.sin(-rect.rotation) * tmp.y;

//   entity.vel.y =
//     Math.sin(-rect.rotation) * tmp.x + Math.cos(-rect.rotation) * tmp.y;
// };

// export function bounceCircleWithAngle(circle, closestPoint) {
//   // Beräkna infallsvinkeln utifrån cirkelns hastighet
//   const incidenceAngle = Math.atan2(circle.vel.y, circle.vel.x);
//   // Beräkna normalens vinkel från closestPoint till cirkelns centrum
//   const normalAngle = Math.atan2(
//     circle.pos.y - closestPoint.y,
//     circle.pos.x - closestPoint.x
//   );
//   // Reflektionsvinkel: spegla infallsvinkeln kring normalen
//   const reflectionAngle = 2 * normalAngle - incidenceAngle;

//   // Behåll farten (magnituden)
//   const speed = Math.sqrt(
//     circle.vel.x * circle.vel.x + circle.vel.y * circle.vel.y
//   );
//   circle.vel.x = speed * Math.cos(reflectionAngle);
//   circle.vel.y = speed * Math.sin(reflectionAngle);

//   // Korrigera positionen så att cirkeln inte fastnar i rektangeln
//   const normalX = circle.pos.x - closestPoint.x;
//   const normalY = circle.pos.y - closestPoint.y;
//   const dist = Math.sqrt(normalX * normalX + normalY * normalY);
//   if (dist < circle.radius) {
//     const penetration = circle.radius - dist;
//     circle.pos.x += (normalX / dist) * (penetration + 0.1);
//     circle.pos.y += (normalY / dist) * (penetration + 0.1);

//     circle.pos = add(circle.pos, circle.vel);
//   }
// }
