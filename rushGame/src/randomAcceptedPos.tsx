import { world } from "./basics";
import { getDistance } from "./geometry/makeDirection";
import { Vec2 } from "./math";

// export const randomAcceptedPos = (
//   mainPos: Vec2,
//   forbiddenPos: Vec2,
//   margin: number
// ) => {
//   // const randomPos = {
//   //   x: world.width * Math.random(),
//   //   y: world.height * Math.random(),
//   // };
//   const randomPos = {
//     x: player.pos.x + player.radius,
//     y: player.pos.y + player.radius,
//   };
//   const distance = getDistance(randomPos, forbiddenPos);

//   if (distance < margin) {
//     requestAnimationFrame(() =>
//       randomAcceptedPos(mainPos, forbiddenPos, margin)
//     );
//   } else {
//     return randomPos;
//   }
// };

export const randomAcceptedPos = (
  mainPos: Vec2,
  forbiddenPos: Vec2,
  margin: number
) => {
  let randomPos: Vec2;
  let distance: number;

  do {
    randomPos = {
      x: world.width * Math.random(),
      y: world.height * Math.random(),
    };
    distance = getDistance(randomPos, forbiddenPos);
  } while (distance < margin);

  return randomPos;
};
