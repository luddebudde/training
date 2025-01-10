// import { world } from "../basics";
// import { makeDirection } from "../makeDirection";
// import { add, multVar } from "../math";
// import { player } from "../createPlayer";
// import { entities } from "../arrays";

// export type Enemy = {
//   health: number;
//   damage: number;
//   pos: {
//     x: number;
//     y: number;
//   };
//   vel: {
//     x: number;
//     y: number;
//   };
//   radius: number;
//   color: string;
//   speed: number;
//   team: string;
//   mass: number;
//   update: () => void;
//   airFriction: boolean;
// };

// export const createRamper = () => {
//   const enemy: Enemy = {
//     health: 100,
//     damage: 40,
//     pos: {
//       x: Math.random() * world.width,
//       y: Math.random() * world.height,
//     },
//     vel: {
//       x: 0,
//       y: 0,
//     },
//     radius: 50,
//     color: "purple",
//     speed: 0.5,
//     team: "enemy",
//     mass: 100,
//     airFriction: false,
//     chargeMeter: 300,
//     update: (): void => {
//       enemy.chargeMeter--;

//       if (enemy.chargeMeter < 0) {
//         const direction = makeDirection(enemy.pos, player.pos);
//         enemy.vel = multVar(direction, 50);
//         enemy.chargeMeter = 300;
//       }
//     },
//   };

//   entities.push(enemy);
// };
