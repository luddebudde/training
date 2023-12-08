import { obstacles } from "./main.js";

export const createObstacle = (spx, spy, epx, epy, color) => {
  const obstacle = {
    startPos: {
      x: spx,
      y: spy,
    },
    endPos: {
      x: epx,
      y: epy,
    },
    color: color,
  };

  obstacles.push(obstacle);
};
