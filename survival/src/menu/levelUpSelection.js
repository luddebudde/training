import { checkButtonPress } from "../checkButtonPress.js";
import { drawSquare } from "../draw/drawSquare.js";
import { drawText } from "../draw/drawText.js";
import {
  assets,
  buttons,
  ctx,
  maxAmountOfWeapons,
  player,
  start,
  weapons,
} from "../main.js";
import { stats, upgradeStats } from "../stats.js";
import { cherry } from "../weapons/cherry.js";
import { aimBullet } from "../weapons/createAimBullet.js";
import { airstrike } from "../weapons/createAirstrike.js";
import { axe } from "../weapons/createAxe.js";
import { droper } from "../weapons/createDroper.js";
import { holyArea } from "../weapons/createHolyArea.js";
import { minigun } from "../weapons/createMinigun.js";
import { randomAimBullet } from "../weapons/spreader.js";
import { shotgun } from "../weapons/createShotgun.js";
import { buba, colin, jedå, uluk } from "../weapons/randomWeapons.js";
import { selfImpaler } from "../weapons/selfImpaler.js";
import { wiper } from "../weapons/wiper.js";
import { screenSizeMultipler, world, worldsizeMultiplier } from "../world.js";
import { pusher } from "../weapons/pusher.js";
import { flamethrower } from "../weapons/flameThrower.js";
import { stunner } from "../weapons/stunner.js";
import { devistator } from "../weapons/devistator.js";
import { bouncer } from "../weapons/bouncer.js";
import { screecher } from "../weapons/screecher.js";
import { lightningStriker } from "../weapons/lightningStrike.js";

let upgradeWeaponPool = [];
let amountOfWeapons = 0;
let chosenWeapon = 0;

export const totalWeapons = [
  aimBullet,
  holyArea,
  minigun,
  shotgun,
  wiper,
  randomAimBullet,
  axe,
  airstrike,
  selfImpaler,
  cherry,
  droper,
  flamethrower,
  stunner,
  devistator,
  bouncer,
  pusher,
  screecher,
  lightningStriker,

  // jedå,
  // colin,
  // uluk,
  // buba,
];

export const availableWeapons = [
  aimBullet,
  holyArea,
  // minigun,
  shotgun,
  wiper,
  randomAimBullet,
  axe,
  // airstrike,
  // selfImpaler,
  // cherry,
  droper,
  // flamethrower,
  stunner,
  devistator,
  bouncer,
  pusher,
  screecher,
  lightningStriker,
];

let undefinedButtons = 0;

let newRandomIndex = 0;

let weaponPool = [];

export const levelUpSelection = () => {
  const square = {
    x: 750 * screenSizeMultipler.x,
    y: 100 * screenSizeMultipler.y,
    width: 1060 * screenSizeMultipler.x,
    height: 1000 * screenSizeMultipler.y,
    color: "green",
  };
  drawSquare(square);

  document.createElement("button");

  const weaponsNotInList = availableWeapons.filter(
    (allWeapon) =>
      !weapons.includes(allWeapon) && !weaponPool.includes(allWeapon)
  );

  weaponPool.push(...weaponsNotInList);

  weapons.forEach((weapon) => {
    amountOfWeapons += 1;
    if (!(weapon.upgrades.level >= weapon.upgrades.amountOrder.length))
      upgradeWeaponPool.push(weapon);
  });

  for (let i = 0; i < 4; i++) {
    if (upgradeWeaponPool.length > 0 || weapons.length >= maxAmountOfWeapons) {
      if (
        (Math.floor(Math.random() * 2) === 0 && upgradeWeaponPool.length > 0) ||
        weapons.length >= maxAmountOfWeapons
      ) {
        const randomIndex = Math.floor(
          Math.random() * upgradeWeaponPool.length
        );

        chosenWeapon = upgradeWeaponPool[randomIndex];
        upgradeWeaponPool.splice(randomIndex, 1);
      } else {
        if (weaponPool.length > 0) {
          newRandomIndex = Math.floor(Math.random() * weaponPool.length);
          chosenWeapon = weaponPool[newRandomIndex];
          weaponPool.splice(newRandomIndex, 1);
        } else {
          chosenWeapon = undefined;
        }
      }
    } else {
      chosenWeapon = wiper;
    }
    const button = {
      number: i,
      image: chosenWeapon?.image,
      noclick: true,
      weapon: chosenWeapon,
      x: square.x + 20 * screenSizeMultipler.x,
      y: (i * square.height) / 4 + 120 * screenSizeMultipler.y,
      width: square.width - 40 * screenSizeMultipler.x,
      height: square.height / 4 - 40 * screenSizeMultipler.y,
      function: () => {
        if (button.weapon !== undefined) {
          if (weapons.includes(button.weapon)) {
            const weaponUpgrades = button.weapon.upgrades;
            const level = weaponUpgrades.level;

            const statTypes = weaponUpgrades.statsOrder[level];
            const upgradeAmounts = weaponUpgrades.amountOrder[level];

            statTypes.forEach((statType, index) => {
              const amount = upgradeAmounts[index];

              button.weapon.stats[statType] += amount;

              console.log(button.weapon.stats);
            });

            if (!weapons.includes(button.weapon)) {
              weapons.push(button.weapon);
            }

            button.weapon.upgrades.level += 1;
            buttons.length = 0;

            console.log(button.weapon.name, button.weapon.upgrades.level);
          } else {
            console.log(button.weapon);
            button.weapon.timesTaken++;
            weapons.push(button.weapon);
            buttons.length = 0;
          }
        } else {
          if (button.number === 0) {
            if (player.health <= stats.maxHealth) player.health += 15;
            // button.image = assets.rhino;
          } else if (button.number === 1) {
            player.gold += 30;
          } else if (button.number === 2) {
            stats.maxHealth += 2;
          } else if (button.number === 3) {
            stats.movementSpeed += 1;
          }
        }
        start();
      },
    };

    ctx.beginPath();
    ctx.rect(button.x, button.y, button.width, button.height);
    ctx.fillStyle = "black";
    ctx.fill();

    if (button.weapon !== undefined) {
      const textBonusMarginX = 40 * screenSizeMultipler.x;
      const textBonusMarginY = 180 * screenSizeMultipler.y;

      const level = button.weapon.upgrades.level;

      // Rita vapennamnet
      drawText(
        button.weapon.name,
        square.x + textBonusMarginX,
        (i * square.height) / 4 + textBonusMarginY,
        "green",
        worldsizeMultiplier
      );

      // Rita uppgraderingsnivån
      const levelText = `level ${button.weapon.upgrades.level + 1}`;

      // Mät bredden på vapennamnet för att justera placeringen av uppgraderingsnivån
      const weaponNameWidth = ctx.measureText(button.weapon.name).width;

      drawText(
        levelText,
        square.x + textBonusMarginX + weaponNameWidth + textBonusMarginX / 2, // Placera texten 100 enheter åt höger från vapennamnet
        (i * square.height) / 4 + textBonusMarginY,
        "yellow",
        worldsizeMultiplier
      );

      drawText(
        `${button.weapon.upgrades.statsOrder[level]}:`,
        square.x + textBonusMarginX + weaponNameWidth + textBonusMarginX / 2, // Placera texten 100 enheter åt höger från vapennamnet
        (i * square.height) / 4 + textBonusMarginY * 1.66,
        "yellow",
        worldsizeMultiplier
      );

      const weaponStatsWidth = ctx.measureText(
        button.weapon.upgrades.statsOrder[level]
      ).width;

      drawText(
        button.weapon.upgrades.amountOrder[level],
        square.x +
          textBonusMarginX +
          weaponNameWidth +
          weaponStatsWidth +
          textBonusMarginX * 1.25, // Placera texten 100 enheter åt höger från vapennamnet
        (i * square.height) / 4 + textBonusMarginY * 1.66,
        "yellow",
        worldsizeMultiplier
      );

      // const shouldWriteDescription =button.weapon.upgrades.amount > 0 || !button.weapon ? true : false

      // if (button.weapon.upgrades.amount > 0)

      if (button.weapon.upgrades.description !== undefined) {
        const description = button.weapon.upgrades.description[level];

        const textBonusWidth = weaponNameWidth + weaponStatsWidth + 150;

        // const maxWidth = textBonusWidth - square.width; // Bredden där du vill bryta raden

        // const maxWidth = Math.min(textBonusWidth - square.width, square.width); // Begränsa maxWidth till bredden av rutan
        const maxWidth = Math.min(square.width - textBonusWidth, square.width); // Begränsa maxWidth till bredden av rutan
        const lineHeight = 40; // Önskat mellanrum mellan raderna

        let words = description.split(" ");
        let line = "";
        let y = (i * square.height) / 4 + textBonusMarginY;

        for (let word of words) {
          const testLine = line + word + " ";
          const metrics = ctx.measureText(testLine);
          const testWidth = metrics.width;

          if (testWidth > maxWidth && line !== "") {
            ctx.fillText(line, square.x + textBonusWidth, y);
            line = word + " ";
            y += lineHeight; // Höjningen för nästa rad
          } else {
            line = testLine;
          }
        }

        ctx.fillText(line, square.x + textBonusWidth, y);
      }
    }

    const imageMarginBonus = {
      x: 20 * screenSizeMultipler.x,
      y: 90 * screenSizeMultipler.y,
    };

    if (button.image !== undefined) {
      ctx.drawImage(
        button.image,
        button.x + imageMarginBonus.x,
        button.y + imageMarginBonus.y,
        100 * screenSizeMultipler.x,
        100 * screenSizeMultipler.y
      );
    }

    buttons.push(button);
  }
  upgradeWeaponPool.length = 0;
  weaponPool.length = 0;
};
