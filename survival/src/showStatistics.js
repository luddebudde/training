import { drawSquare } from "./draw/drawSquare.js";
import { drawText } from "./draw/drawText.js";
import { getNextElement } from "./getNextElement.js";
import { ctx, maxAmountOfWeapons, weapons } from "./main.js";
import { statistics } from "./statistics.js";
import { aimBullet } from "./weapons.js/createAimBullet.js";
import { shotgun } from "./weapons.js/createShotgun.js";
import { wiper } from "./weapons.js/wiper.js";
import { world } from "./world.js";

let loopAmount = 0;
let overallStatAmount = 0;
let weaponStatAmount = 0;

const drawStatistics = (type, value, x, y, color = "red") => {
  const margin = x + 10;

  const keyHeight = 100 * overallStatAmount;
  const keyLenght = ctx.measureText(type);

  drawText(type, 40, keyHeight, "red");
  drawText(":", keyLenght.width + margin, keyHeight, color);
  drawText(value, keyLenght.width + margin + 20, keyHeight, color);
};

export const showStatistics = () => {
  //   const buttonTexts = [];

  Object.keys(statistics).forEach((key) => {
    // buttonTexts.push();
    // console.log(key);
    loopAmount++;
  });

  //   console.log(loopAmount);

  const square = {
    x: 0,
    y: 0,
    width: world.width,
    height: world.height,
    color: "black",
  };

  drawSquare(square);

  //   for (let i = 0; i < loopAmount; i++) {
  //   const buttonName = getNextElement(buttonTexts, i - 1);
  // console.log(buttonName.name);
  // const act = buttonFunctions[i % buttonFunctions.length];

  // const buttonNameInfo = ctx.measureText(buttonName);

  // console.log(buttonName);

  const objectKeys = Object.keys(statistics.overall);

  for (const key of objectKeys) {
    overallStatAmount++;

    const value = statistics.overall[key];
    drawStatistics(key, value, 40);
  }

  weapons.reverse();
  weapons.forEach((weapon, index) => {
    // weaponStatAmount++;
    const previusWeaponLenght = ctx.measureText(weapons[index - 1]);
    const currentWeaponLenght = ctx.measureText(weapons[index]);

    drawText(
      weapon.name,
      world.width -
        previusWeaponLenght.width * index -
        currentWeaponLenght.width,
      60,
      "blue"
    );
    // console.log(previusWeaponLenght.width);

    if (weapon.statistics !== undefined) {
      const weaponStatistics = Object.keys(weapon.statistics);

      for (const key of weaponStatistics) {
        weaponStatAmount++;

        //   const value = statistics.overall[key];
        //   drawStatistics(key, value, 40);
        drawText(key, 500, 100 * weaponStatAmount + 100, "green");
      }
    }
  });
};
