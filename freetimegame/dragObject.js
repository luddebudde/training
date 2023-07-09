import { blackhole } from "./blackhole.js";

export const dragObject = (dragPoint, dragedObjectX, dragedObjectY) => {
  const postionDifferance = {
    x: dragPoint.xPos - dragedObjectX.xPos,
    y: dragPoint.yPos - dragedObjectX.xPos,
  };
  if (
    postionDifferance.x < blackhole.pullRadius &&
    postionDifferance.y < blackhole.pullRadius
  ) {
    const direction = {
      x: postionDifferance / postionDifferance,
      y: postionDifferance / postionDifferance,
    };
    if (
      direction.x !== undefined ||
      (direction.x !== NaN && direction.y !== undefined) ||
      direction.y !== NaN
    ) {
      dragedObjectX = dragedObjectX - direction.x * blackhole.pullForce;
      dragedObjectY = dragedObjectY - direction.y * blackhole.pullForce;
      console.log(dragedObjectX);
    }
  }
};
