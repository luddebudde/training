import { drawSquare } from "../draw/drawSquare";
import { add } from "../math";
import { getDistance } from "./makeDirection";

export function collideCircleWithRotatedRectangle(ctx, circle, rect) {
  var rectCenterX = rect.x + rect.width / 2;
  var rectCenterY = rect.y + rect.height / 2;

  var rectX = rectCenterX - rect.width / 2;
  var rectY = rectCenterY - rect.height / 2;

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

  // ctx.save();
  // ctx.translate(rectCenterX, rectCenterY);
  // ctx.rotate(rect.rotation);

  // ctx.beginPath();
  // ctx.rect(-rect.width / 2, -rect.height / 2, rect.width, rect.height);
  // ctx.fillStyle = "purple";
  // ctx.fill();
  // ctx.restore();

  // ctx.save();
  // ctx.translate(rectCenterX, rectCenterY);
  // ctx.rotate((rect.rotation * Math.PI) / 180);
  // ctx.beginPath();
  // ctx.rect(-rect.width / 2, -rect.height / 2, rect.width, rect.height);
  // ctx.fillStyle = "green";
  // ctx.fill();
  // ctx.restore();

  // ctx.save();
  // ctx.translate(rectCenterX, rectCenterY);
  // ctx.beginPath();
  // ctx.rect(-rect.width / 2, -rect.height / 2, rect.width, rect.height);
  // ctx.fillStyle = "red";
  // ctx.fill();
  // ctx.restore();

  ctx.save();
  ctx.translate(rectCenterX, rectCenterY);
  ctx.rotate(-rect.rotation); // Rotation i radianer, utan att multiplicera med Math.PI / 180
  ctx.beginPath();
  ctx.rect(-rect.width / 2, -rect.height / 2, rect.width, rect.height);
  ctx.fillStyle = "green";
  ctx.fill();
  ctx.restore();

  if (distance < circle.radius) {
    collision = true;
    bounceCircleWithAngle(circle, { x: closestX, y: closestY });
    console.log("Colliding with rectangle");
  } else {
    collision = false;
  }

  return collision;
}

export function bounceCircleWithAngle(circle, closestPoint) {
  // Beräkna infallsvinkeln utifrån cirkelns hastighet
  const incidenceAngle = Math.atan2(circle.vel.y, circle.vel.x);
  // Beräkna normalens vinkel från closestPoint till cirkelns centrum
  const normalAngle = Math.atan2(
    circle.pos.y - closestPoint.y,
    circle.pos.x - closestPoint.x
  );
  // Reflektionsvinkel: spegla infallsvinkeln kring normalen
  const reflectionAngle = 2 * normalAngle - incidenceAngle;

  // Behåll farten (magnituden)
  const speed = Math.sqrt(
    circle.vel.x * circle.vel.x + circle.vel.y * circle.vel.y
  );
  circle.vel.x = speed * Math.cos(reflectionAngle);
  circle.vel.y = speed * Math.sin(reflectionAngle);

  // Korrigera positionen så att cirkeln inte fastnar i rektangeln
  const normalX = circle.pos.x - closestPoint.x;
  const normalY = circle.pos.y - closestPoint.y;
  const dist = Math.sqrt(normalX * normalX + normalY * normalY);
  if (dist < circle.radius) {
    const penetration = circle.radius - dist;
    circle.pos.x += (normalX / dist) * (penetration + 0.1);
    circle.pos.y += (normalY / dist) * (penetration + 0.1);

    circle.pos = add(circle.pos, circle.vel);
  }
}
