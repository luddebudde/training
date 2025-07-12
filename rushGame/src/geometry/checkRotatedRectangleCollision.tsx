import { squares } from "../arrays";
import { drawCircle } from "../draw/drawCircle";
import { drawSquare } from "../draw/drawSquare";
import { add, multVar, Vec2 } from "../math";
import { isPointInsideArea } from "./isInsideRectangle";
import { getDistance } from "./makeDirection";

export function collideCircleWithRotatedRectangle(
  ctx,
  circle,
  rect,
  shouldBounce = true
) {
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
  const pointD = {
    x: rectReferenceX + rect.width,
    y: rectReferenceY + rect.height,
  };

  const points = [pointA, pointB, pointC, pointD];

  // ctx.save();
  // ctx.translate(rect.x + rect.width / 2, rect.y + rect.height / 2);
  // ctx.rotate(-rect.rotation); // Rotation i radianer, utan att multiplicera med Math.PI / 180

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

  // ctx.restore();

  if (distance < circle.radius) {
    collision = true;

    if (shouldBounce === true) {
      let alpha: number;

      if (closestX === pointA.x || closestX === pointD.x) {
        // Horizontal === 1 (Horizontal)
        alpha = Math.PI * 1.5;
      } else {
        // Horizontal === 0 (Vertical)
        alpha = Math.PI * 0;
      }

      points.forEach((point) => {
        if (point.x === closestX && point.y === closestY) {
          circle.vel = multVar(circle.vel, -1);
          // if (Math.abs(circle.vel.y) < Math.abs(circle.vel.x)) {
          //   alpha = Math.PI * 1.5;
          // } else {
          //   alpha = Math.PI * 0;
          // }
          // alpha =
        }
      });

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

      circle.pos = add(circle.pos, circle.vel);
    }
  } else {
    collision = false;
  }

  return collision;
}
