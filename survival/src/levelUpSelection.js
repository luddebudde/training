import { checkButtonPress } from "./checkButtonPress.js";
import { drawSquare } from "./draw/drawSquare.js";
import { drawText } from "./draw/drawText.js";
import { buttons, ctx, moveCtx, weapons } from "./main.js";
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
    chosenWeapon = weaponPool[randomIndex];

    const button = {
      x: square.x + 20,
      y: (i * square.height) / 4 + 120,
      width: square.width - 40,
      height: square.height / 4 - 40,
      upgradeWeapon: () => {
        const level = chosenWeapon.upgrades.level;

        const statType = chosenWeapon.upgrades.statsOrder[level];
        const amount = chosenWeapon.upgrades.amountOrder[level];

        chosenWeapon.stats[statType] +=
          // upgradeStats(
          //   chosenWeapon,
          //   statType,
          amount;
        // );
        console.log(chosenWeapon.stats[statType]);

        chosenWeapon.upgrades.level += 1;
      },
    };

    ctx.beginPath();
    ctx.rect(button.x, button.y, button.width, button.height);
    ctx.fillStyle = "black";
    ctx.fill();

    drawText(
      chosenWeapon.name,
      square.x + 40,
      (i * square.height) / 4 + 180,
      "green"
    );
    buttons.push(button);
  }
};
