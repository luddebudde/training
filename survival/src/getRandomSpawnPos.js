import { world } from "./world.js";

const spawnMargin = 100;

export const getRandomSpawnPos = () => {
  let pos = {
    x: Math.random() * world.width,
    y: Math.random() * world.height,
  };

  const randomSpawnSide = Math.floor(Math.random() * 4);

  if (randomSpawnSide === 0) {
    pos.y = -spawnMargin;
  } else if (randomSpawnSide === 1) {
    pos.x = world.width / 2 + spawnMargin;
  } else if (randomSpawnSide === 2) {
    pos.y = world.height / 2 + spawnMargin;
  } else if (randomSpawnSide === 3) {
    pos.x = -spawnMargin;
  }
  //   console.log(randomSpawnSide);
  return pos;
};
