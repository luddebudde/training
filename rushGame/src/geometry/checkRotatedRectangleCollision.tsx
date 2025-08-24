import { squares } from "../arrays";
import { drawCircle } from "../draw/drawCircle";
import { drawSquare } from "../draw/drawSquare";
import { add, multVar, Vec2 } from "../math";
import { isPointInsideArea } from "./isInsideRectangle";
import { getDistance } from "./makeDirection";

export function collideCircleWithRotatedRectangle(
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

  const rotation = rect.rotation !== undefined ? rect.rotation : 0;

  // Rotate circle's center point back
  var unrotatedCircleX =
    Math.cos(rotation) * (circle.pos.x - rectCenterX) -
    Math.sin(rotation) * (circle.pos.y - rectCenterY) +
    rectCenterX;
  var unrotatedCircleY =
    Math.sin(rotation) * (circle.pos.x - rectCenterX) +
    Math.cos(rotation) * (circle.pos.y - rectCenterY) +
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
        }
      });

      const tmp: Vec2 = {
        x:
          Math.cos(rotation + alpha) * circle.vel.x -
          Math.sin(rotation + alpha) * circle.vel.y,
        y:
          Math.sin(rotation + alpha) * circle.vel.x +
          Math.cos(rotation + alpha) * circle.vel.y,
      };

      tmp.y = -tmp.y;

      circle.vel.x =
        Math.cos(-rotation - alpha) * tmp.x -
        Math.sin(-rotation - alpha) * tmp.y;

      circle.vel.y =
        Math.sin(-rotation - alpha) * tmp.x +
        Math.cos(-rotation - alpha) * tmp.y;

      circle.pos = add(circle.pos, circle.vel);
    }
  } else {
    collision = false;
  }

  return collision;
}
