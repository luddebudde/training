// import { world } from "../basics";
// import { makeDirection } from "../makeDirection";
// import { add, multVar } from "../math";
// import { player } from "../createPlayer";
// import { entities } from "../arrays";

// Number 1

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

// Number 2

//   if (
//     sprayer.health < sprayer.maxHealth / 2 &&
//     !sprayer.reacheadHalfPoint
//   ) {
//     const maxI = 50; // Antal kulor
//     const angleStep = (Math.PI * 2) / maxI; // Steg mellan vinklar för att täcka en cirkel
//     const speed = 25; // Hastighet för kulorna

//     for (let x = 0; x < 500; x++) {
//       setTimeout(() => {
//         for (let i = 0; i < maxI; i++) {
//           const angle = i * angleStep; // Vinkel för den aktuella kulan
//           const target = {
//             x: Math.cos(angle) * 100 + sprayer.pos.x, // Punkt utåt baserad på vinkel
//             y: Math.sin(angle) * 100 + sprayer.pos.y,
//           };

//           createBullet(
//             bullets,
//             undefined, // Ingen specifik "shooter"
//             target, // Målet baserat på vinkeln
//             10, // Skadevärde
//             speed, // Hastighet
//             {
//               bounceable: false, // Mods
//               airFriction: false,
//               bounceDamageLoss: 0.3,
//             },
//             {
//               startPos: {
//                 x: sprayer.pos.x,
//                 y: sprayer.pos.y,
//               },
//               team: "enemy",
//             }
//           );
//         }
//       }, 1000 * x);
//       sprayer.reacheadHalfPoint = true;
//     }
//   }
