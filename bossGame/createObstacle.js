import { obstacles } from "./main.js";

export const createObstacle = (spx, spy, epx, epy, color, bulletFriendly) => {
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
    // health: 100000000000000000,
    bulletFriendly: bulletFriendly,
  };

  obstacles.push(obstacle);
};

export const createMovingObstacle = (
  spx,
  spy,
  epx,
  epy,
  color,
  bulletFriendly,
  velX,
  velY
) => {
  const obstacle = {
    startPos: {
      x: spx,
      y: spy,
    },
    endPos: {
      x: epx,
      y: epy,
    },
    vel: {
      x: velX,
      y: velY,
    },
    damage: 100,
    color: color,
    // health: 100000000000000000,
    bulletFriendly: bulletFriendly,
  };

  obstacles.push(obstacle);
};
