import { moveCtx, player } from "./main.js";
import { world } from "./world.js";

const spawnMargin = 100;

// export const getRandomSpawnPos = (player) => {
//   let pos = {
//     x:
//       Math.random() * (world.width + player.pos.x + world.width / 2) -
//       world.width / 2,
//     y:
//       Math.random() * (world.height + player.pos.y + world.height / 2) -
//       world.height / 2,
//   };

//   const randomSpawnSide = Math.floor(Math.random() * 4);

//   if (randomSpawnSide === 0) {
//     // Uppifrån
//     pos.y = -spawnMargin - world.height / 2 + player.pos.y;
//   } else if (randomSpawnSide === 1) {
//     // Högerifrån
//     pos.x = world.width / 2.5 + spawnMargin + player.pos.x;
//   } else if (randomSpawnSide === 2) {
//     // Nedifrån
//     pos.y = world.height / 2.5 + spawnMargin + player.pos.y;
//   } else if (randomSpawnSide === 3) {
//     // Vänsterifrån
//     pos.x = -spawnMargin - world.width / 2 + player.pos.x;
//   }

//   return pos;
// };

export const getRandomSpawnPos = (player) => {
  // let pos = {
  //   x: Math.random() * world.width + player.pos.x,
  //   y: Math.random() * world.height + player.pos.y,
  // };

  let pos = {
    x: Math.random() * world.width - world.width / 2 + player.pos.x,
    y: Math.random() * world.height - world.height / 2 + player.pos.y,
  };

  const randomSpawnSide = Math.floor(Math.random() * 4);

  if (randomSpawnSide === 0) {
    // Uppifrån
    pos.y = -spawnMargin - world.height / 2 + player.pos.y;
  } else if (randomSpawnSide === 1) {
    // Högerifrån
    pos.x = world.width / 2 + player.pos.x;
  } else if (randomSpawnSide === 2) {
    // Nedifrån
    pos.y = world.height / 2 + player.pos.y;
  } else if (randomSpawnSide === 3) {
    // Vänsterifrån
    pos.x = -spawnMargin - world.width / 2 + player.pos.x;
  }

  // console.log(pos);

  return pos;
};
