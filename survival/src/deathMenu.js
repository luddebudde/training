import { checkButtonPress } from "./checkButtonPress.js";
import { drawSquare } from "./draw/drawSquare.js";
import { drawText } from "./draw/drawText.js";
import { getNextElement } from "./getNextElement.js";
import {
  assets,
  buttons,
  ctx,
  entities,
  maximumAmountOfWeapons,
  pause,
  player,
  start,
  startGame,
  weapons,
} from "./main.js";
import { stats, upgradeStats } from "./stats.js";
import { aimBullet } from "./weapons.js/createAimBullet.js";
import { airstrike } from "./weapons.js/createAirstrike.js";
import { axe } from "./weapons.js/createAxe.js";
import { holyArea } from "./weapons.js/createHolyArea.js";
import { minigun } from "./weapons.js/createMinigun.js";
import { randomAimBullet } from "./weapons.js/createRandomAimBullet.js";
import { shotgun } from "./weapons.js/createShotgun.js";
import { buba, colin, jedå, uluk } from "./weapons.js/randomWeapons.js";
import { selfImpaler } from "./weapons.js/selfImpaler.js";
import { wiper } from "./weapons.js/wiper.js";
import { world } from "./world.js";

let upgradeWeaponPool = [];
let amountOfWeapons = 0;
let chosenWeapon = 0;

const totalWeapons = [
  aimBullet,
  holyArea,
  minigun,
  shotgun,
  wiper,
  randomAimBullet,
  axe,
  airstrike,
  selfImpaler,
  jedå,
  colin,
  uluk,
  buba,
];

let undefinedButtons = 0;

let newRandomIndex = 0;

let weaponPool = [];

export const deathMenu = () => {
  const square = {
    x: 750,
    y: 100,
    width: 1060,
    height: 1000,
    color: "green",
  };

  drawSquare(square);

  document.createElement("button");

  console.log("button");

  const revivePlayer = () => {
    player.health = 100;
    entities.push(player);
  };

  const buttonFuncion = [revivePlayer, startGame];
  const buttonText = ["REVIVE", "RESTART", "MAIN MENU"];

  for (let i = 0; i < 4; i++) {
    const button = {
      number: i,
      image: chosenWeapon?.image,

      weapon: chosenWeapon,
      x: square.x + 20,
      y: (i * square.height) / 4 + 120,
      width: square.width - 40,
      height: square.height / 4 - 40,
      function: () => {
        const act = getNextElement(buttonFuncion, i - 1);
        act();
        // console.log(act);
        start();
      },
    };

    ctx.beginPath();
    ctx.rect(button.x, button.y, button.width, button.height);
    ctx.fillStyle = "black";
    ctx.fill();

    if (button.weapon !== undefined) {
      const buttonName = getNextElement(buttonText, i - 1);
      // Rita vapennamnet
      drawText(buttonName, square.x + 40, (i * square.height) / 4 + 180, "red");

      // Mät bredden på vapennamnet för att justera placeringen av uppgraderingsnivån
      //   const weaponNameWidth = ctx.measureText(button.weapon.name).width;

      //   const weaponStatsWidth = ctx.measureText(
      //     button.weapon.upgrades.statsOrder[level]
      //   ).width;

      if (button.image !== undefined) {
        ctx.drawImage(button.image, button.x + 20, button.y + 90, 100, 100);
      }

      buttons.push(button);
    }
  }
};
