import { Vec2 } from "../math";

export const getDistance = (
  mainObject: Vec2,
  secondObject: Vec2
  // vector = false
) => {
  const diff = {
    x: mainObject.x - secondObject.x,
    y: mainObject.y - secondObject.y,
  };
  const dist = Math.sqrt(diff.x * diff.x + diff.y * diff.y);

  // if (!vector) {
  //   return dist;
  // } else {
  //   return diff;
  // }

  return dist;
};

export const makeDirection = (mainObject: Vec2, secondObject: Vec2) => {
  const diff = {
    x: mainObject.x - secondObject.x,
    y: mainObject.y - secondObject.y,
  };
  const dist = Math.sqrt(diff.x * diff.x + diff.y * diff.y);
  const direction = {
    x: -diff.x / (dist + 0.001),
    y: -diff.y / (dist + 0.001),
  };

  // console.log(direction);

  return direction;
};
