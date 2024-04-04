import { assets } from "../main.js";
import { stats } from "../stats.js";
// import { aimBullet } from "../weapons.js/createAimBullet.js";

export const Blugo = {
  fullname: "Blugo McPlommon",
  sprite: "blue",
  // startingWeapon: aimBullet,

  stats: {
    growth: 10,
    greed: 1,

    movementSpeed: 5,

    maxHealth: 100,
    // maxHealth: 2,
    regen: 1,
    armor: 1,
    maxShield: 50,
    // shield: 50,
    shield: 0,

    damage: 1,
    area: 1,
    speed: 1,

    luck: 1,
    curse: 1,
    cooldown: 1,
    revives: 300,
  },
  levelUpIncrease: () => {
    // stats.curse += 0.1;
  },
  draw: (ctx, assets, player) => {
    ctx.drawImage(
      assets.blue,
      player.pos.x - player.radius,
      player.pos.y - player.radius,
      player.radius * 2,
      player.radius * 2
    );
  },
};
