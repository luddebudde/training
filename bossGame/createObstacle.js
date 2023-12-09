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
    damage: 100,
    color: color,
    health: 100000000000000000,
  };

  obstacles.push(obstacle);
};
