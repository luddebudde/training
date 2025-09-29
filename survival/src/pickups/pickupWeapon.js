import { pickups, weapons, xps } from "../main.js";
import { makeDirection } from "../makeDirection.js";

export const createPickupWeapon = (xPos, yPos, weapon) => {
  const pickupWeapon = {
    weapon: weapon,
    radius: 20,
    // bulletHealth: 10,
    // destroy: false,
    pos: {
      x: xPos,
      y: yPos,
    },
    color: "purple",
    // team: "player",
    priority: 5,

    effect: (object) => {
      weapons.push(pickupWeapon.weapon);
    },
    // enemiesHit: [],
    // pierce: aimBulletStats.pierce,
    // weapon: aimBullet,
  };
  pickups.push(pickupWeapon);
};
