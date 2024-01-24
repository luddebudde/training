import { moveCtx } from "./main.js";
import { world } from "./world.js";

const spawnMargin = 100;

// export const getRandomSpawnPos = () => {
//   let pos = {
//     x: Math.random() * world.width + moveCtx.x,
//     y: Math.random() * world.height + moveCtx.y,
//   };

//   const randomSpawnSide = Math.floor(Math.random() * 4);

//   if (randomSpawnSide === 0) {
//     pos.y = -spawnMargin + moveCtx.y;
//   } else if (randomSpawnSide === 1) {
//     pos.x = world.width + spawnMargin + moveCtx.x;
//   } else if (randomSpawnSide === 2) {
//     pos.y = world.height + spawnMargin + moveCtx.y;
//   } else if (randomSpawnSide === 3) {
//     pos.x = -spawnMargin + moveCtx.x;
//   }
//   // console.log(randomSpawnSide);
//   return pos;
// };

export const getRandomSpawnPos = () => {
  let pos = {
    x: 0,
    y: 0,
  };

  const randomSpawnSide = Math.floor(Math.random() * 4);

  if (randomSpawnSide === 0) {
    // Uppifrån
    pos.x = Math.random() * world.width + moveCtx.x;
    pos.y = -spawnMargin + moveCtx.y;
  } else if (randomSpawnSide === 1) {
    // Högerifrån
    pos.x = world.width + spawnMargin + moveCtx.x;
    pos.y = Math.random() * world.height + moveCtx.y;
  } else if (randomSpawnSide === 2) {
    // Nedifrån
    pos.x = Math.random() * world.width + moveCtx.x;
    pos.y = world.height + spawnMargin + moveCtx.y;
  } else if (randomSpawnSide === 3) {
    // Vänsterifrån
    pos.x = -spawnMargin + moveCtx.x;
    pos.y = Math.random() * world.height + moveCtx.y;
  }

  return pos;
};
