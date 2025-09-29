import { player } from "./main.js";
import { enemy } from "./src/enemy.js";

let xAdder = 0;
let yAdder = 0;

export const checkRectangleCollison = (circle, rectangle) => {
  const biggerValueX = Math.max(rectangle.startPos.x, rectangle.endPos.x);
  const smallerValueX = Math.min(rectangle.startPos.x, rectangle.endPos.x);

  const biggerValueY = Math.max(rectangle.startPos.y, rectangle.endPos.y);
  const smallerValueY = Math.min(rectangle.startPos.y, rectangle.endPos.y);

  if (
    circle.xPos + circle.radius >= smallerValueX &&
    circle.xPos - circle.radius <= biggerValueX &&
    circle.yPos + circle.radius >= smallerValueY &&
    circle.yPos - circle.radius <= biggerValueY
  ) {
    // console.log("är i");
    // console.log(smallerValueY);
    circle.vel.y = -circle.vel.y;
    circle.vel.x = -circle.vel.x;

    if (circle.team !== "enemy") {
      if (rectangle.vel !== undefined) {
        xAdder = rectangle.vel.x;
        yAdder = rectangle.vel.y;
      }
      circle.xPos += circle.vel.x + xAdder;
      circle.yPos += circle.vel.y + yAdder;
    }
    xAdder = 0;
    yAdder = 0;
  }
};

// Find the closest point on the rectangle to the center of the circle

export const checkRectangleCollisonForBullet = (bullet, rectangle) => {
  const biggerValueX = Math.max(rectangle.startPos.x, rectangle.endPos.x);
  const smallerValueX = Math.min(rectangle.startPos.x, rectangle.endPos.x);

  const biggerValueY = Math.max(rectangle.startPos.y, rectangle.endPos.y);
  const smallerValueY = Math.min(rectangle.startPos.y, rectangle.endPos.y);

  if (
    bullet.xPos + bullet.radius >= smallerValueX &&
    bullet.xPos - bullet.radius <= biggerValueX &&
    bullet.yPos + bullet.radius >= smallerValueY &&
    bullet.yPos - bullet.radius <= biggerValueY &&
    !rectangle.bulletFriendly
  ) {
    // console.log("Destory");
    bullet.destroy = true;
  }
};
