import { world } from "./world.js";

const spawnMargin = 100;

export const getRandomSpawnPos = () => {
  let pos = {
    x: 0,
    y: 0,
  };

  const randomSpawnSide = Math.floor(Math.random() * 4);

  if (randomSpawnSide === 0) {
    pos.y = 0 - spawnMargin;
  } else if (randomSpawnSide === 1) {
    pos.x = world.width + spawnMargin;
  } else if (randomSpawnSide === 2) {
    pos.y = world.height + spawnMargin;
  } else if (randomSpawnSide === 3) {
    pos.x = 0 - spawnMargin;
  }
  //   console.log(randomSpawnSide);
  return pos;
};
