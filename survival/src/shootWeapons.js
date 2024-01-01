import { weapons } from "./main.js";

export const shootWeapons = (direction) => {
  weapons.forEach((weapon) => {
    weapon(direction);
  });
};
