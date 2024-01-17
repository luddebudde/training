import { checkButtonPress } from "./checkButtonPress.js";
import { drawSquare } from "./draw/drawSquare.js";
import { drawText } from "./draw/drawText.js";
import { buttons, ctx, moveCtx, pause, start, weapons } from "./main.js";
import { upgradeStats } from "./stats.js";
import { world } from "./world.js";

let weaponPool = [];
let amountOfWeapons = 0;
let chosenWeapon = 0;

export const levelUpSelection = () => {
  const square = {
    x: 750,
    y: 100,
    width: 1060,
    height: 1000,
    color: "grey",
  };
  drawSquare(square);

  document.createElement("button");

  weapons.forEach((weapon) => {
    amountOfWeapons += 1;
    weaponPool.push(weapon);

    // Get the random element
  });

  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * weaponPool.length);
    if (weaponPool.length === 0) {
      return;
    }
    chosenWeapon = weaponPool[randomIndex];
    weaponPool.splice(randomIndex, 1);

    const button = {
      weapon: chosenWeapon,
      x: square.x + 20,
      y: (i * square.height) / 4 + 120,
      width: square.width - 40,
      height: square.height / 4 - 40,
      upgradeWeapon: () => {
        const level = button.weapon.upgrades.level;

        const statType = button.weapon.upgrades.statsOrder[level];
        const amount = button.weapon.upgrades.amountOrder[level];

        // if (button.weapon.upgrades.statsOrder.length > level) {
        button.weapon.stats[statType] += amount;

        console.log(button.weapon.stats);

        button.weapon.upgrades.level += 1;

        start();
        // } else {
        //   weaponPool.splice(randomIndex);
        //   const randomIndex = Math.floor(Math.random() * weaponPool.length);

        //   chosenWeapon = weaponPool[randomIndex];
        //   button.upgradeWeapon();
        // }
      },
    };

    ctx.beginPath();
    ctx.rect(button.x, button.y, button.width, button.height);
    ctx.fillStyle = "black";
    ctx.fill();

    drawText(
      button.weapon.name,
      square.x + 40,
      (i * square.height) / 4 + 180,
      "green"
    );
    buttons.push(button);
  }
};
