import { drawSquare } from "./draw/drawSquare.js";
import { drawText } from "./draw/drawText.js";
import { getNextElement } from "./getNextElement.js";
import { ctx, maxAmountOfWeapons, weapons } from "./main.js";
import { statistics } from "./statistics.js";
import { aimBullet } from "./weapons.js/createAimBullet.js";
import { shotgun } from "./weapons.js/createShotgun.js";
import { wiper } from "./weapons.js/wiper.js";
import { squareSizeMultipler, world, worldsizeMultiplier } from "./world.js";

let loopAmount = 0;
let overallStatAmount = 0;
let weaponStatisticAmount = 0;

const drawStatistics = (type, value, x, y, color = "red") => {
  const margin = x + 10;

  const keyHeight = 100 * overallStatAmount * squareSizeMultipler.x;
  const keyLenght = ctx.measureText(type);

  drawText(type, 40, keyHeight, "red", worldsizeMultiplier);
  drawText(
    ":",
    keyLenght.width + margin,
    keyHeight,
    color,
    worldsizeMultiplier
  );
  drawText(
    value,
    keyLenght.width + margin + 20,
    keyHeight,
    color,
    worldsizeMultiplier
  );
};

export const showStatistics = () => {
  Object.keys(statistics).forEach((key) => {
    loopAmount++;
  });

  const square = {
    x: 0,
    y: 0,
    width: world.width,
    height: world.height,
    color: "black",
  };

  drawSquare(square);

  const objectKeys = Object.keys(statistics.overall);

  for (const key of objectKeys) {
    overallStatAmount++;

    const value = statistics.overall[key];
    drawStatistics(key, Math.floor(value), 40);
  }

  weapons.forEach((weapon, index) => {
    const previusWeaponLenght = ctx.measureText(weapons[index - 1]);
    const currentWeaponLenght = ctx.measureText(weapons[index]);

    drawText(
      weapon.name,
      (previusWeaponLenght.width * index - currentWeaponLenght.width + 1100) *
        1,
      60 * squareSizeMultipler.y,
      "blue",
      worldsizeMultiplier
    );

    if (weapon.statistics !== undefined) {
      const weaponStatistics = Object.keys(weapon.statistics);

      for (const key of weaponStatistics) {
        weaponStatisticAmount++;

        drawText(
          key,
          500 * squareSizeMultipler.x,
          100 * weaponStatisticAmount + 100 * squareSizeMultipler.y,
          "green",
          worldsizeMultiplier
        );
        drawText(
          weapon.statistics[key],
          (300 * index + 900) * squareSizeMultipler.x,
          100 * weaponStatisticAmount + 100 * squareSizeMultipler.y,
          "green",
          worldsizeMultiplier
        );
        console.log(weapon.statistics[key]);
      }
      weaponStatisticAmount = 0;
    }
  });
};
