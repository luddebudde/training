import { drawSquare } from "../draw/drawSquare.js";
import { drawText } from "../draw/drawText.js";
import { getNextElement } from "../getNextElement.js";
import { ctx, maxAmountOfWeapons, weapons } from "../main.js";
import { statistics } from "../statistics.js";
import { aimBullet } from "../weapons.js/createAimBullet.js";
import { shotgun } from "../weapons.js/createShotgun.js";
import { wiper } from "../weapons.js/wiper.js";
import { screenSizeMultipler, world, worldsizeMultiplier } from "../world.js";

let loopAmount = 0;
let overallStatAmount = 0;
let weaponStatisticAmount = 0;

const drawStatistics = (type, value, x, y, color = "red") => {
  const margin = (x + 10) * screenSizeMultipler.x;

  const keyHeight = 100 * overallStatAmount * screenSizeMultipler.x;
  const keyLenght = ctx.measureText(type);

  drawText(
    type,
    40 * screenSizeMultipler.x,
    keyHeight,
    "red",
    worldsizeMultiplier
  );
  drawText(
    ":",
    keyLenght.width + margin,
    keyHeight,
    color,
    worldsizeMultiplier
  );
  drawText(
    value,
    keyLenght.width + margin + 20 * screenSizeMultipler.x,
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

  const playerSquare = {
    x: world.width,
    y: world.height,
    width: -600 * screenSizeMultipler.x,
    height: -600 * screenSizeMultipler.y,
    color: "white",
  };

  drawSquare(playerSquare);

  // draw

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
      (previusWeaponLenght.width * index -
        currentWeaponLenght.width +
        1100 * screenSizeMultipler.x) *
        1,
      60 * screenSizeMultipler.y,
      "blue",
      worldsizeMultiplier
    );

    if (weapon.statistics !== undefined) {
      const weaponStatistics = Object.keys(weapon.statistics);

      for (const key of weaponStatistics) {
        weaponStatisticAmount++;

        drawText(
          key,
          500 * screenSizeMultipler.x,
          100 * weaponStatisticAmount + 100 * screenSizeMultipler.y,
          "green",
          worldsizeMultiplier
        );
        drawText(
          weapon.statistics[key],
          (300 * index + 900) * screenSizeMultipler.x,
          100 * weaponStatisticAmount + 100 * screenSizeMultipler.y,
          "green",
          worldsizeMultiplier
        );
        console.log(weapon.statistics[key]);
      }
      weaponStatisticAmount = 0;
    }
  });
};