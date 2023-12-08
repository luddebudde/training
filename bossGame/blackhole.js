import { world } from "./world.js";

export const blackhole = {
  radius: 40,
  xPos: world.width / 2,
  yPos: world.height / 2,
  pullRadius: 2000,
  pullForce: 1000,
};

export const blackholes = [
  // {
  //   radius: 40,
  //   xPos: world.width / 2,
  //   yPos: world.height / 2,
  //   pullRadius: 200,
  //   pullForce: 4000,
  // },
  // {
  //   radius: 40,
  //   xPos: world.width / 3,
  //   yPos: world.height / 3,
  //   pullRadius: 2000,
  //   pullForce: -1000,
  // },
  // {
  //   radius: 40,
  //   xPos: (world.width / 3) * 2,
  //   yPos: world.height / 3,
  //   pullRadius: 2000,
  //   pullForce: -1000,
  // },
];
