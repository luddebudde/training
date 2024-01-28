import { checkButtonPress } from "./checkButtonPress.js";
import { drawSquare } from "./draw/drawSquare.js";
import { drawText } from "./draw/drawText.js";
import {
  buttons,
  ctx,
  maximumAmountOfWeapons,
  moveCtx,
  pause,
  start,
  weapons,
} from "./main.js";
import { upgradeStats } from "./stats.js";
import { aimBullet } from "./weapons.js/createAimBullet.js";
import { holyArea } from "./weapons.js/createHolyArea.js";
import { minigun } from "./weapons.js/createMinigun.js";
import { shotgun } from "./weapons.js/createShotgun.js";
import { buba, colin, jedå, uluk } from "./weapons.js/randomWeapons.js";
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
  jedå,
  colin,
  uluk,
  buba,
];

let newRandomIndex = 0;

let weaponPool = [];

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

  const weaponsNotInList = totalWeapons.filter(
    (allWeapon) =>
      !weapons.includes(allWeapon) && !weaponPool.includes(allWeapon)
  );

  weaponPool.push(...weaponsNotInList);

  weapons.forEach((weapon) => {
    amountOfWeapons += 1;
    if (!(weapon.upgrades.level >= weapon.upgrades.amountOrder.length))
      upgradeWeaponPool.push(weapon);
  });
  // console.log(weaponPool);

  for (let i = 0; i < 4; i++) {
    if (
      upgradeWeaponPool.length > 0 &&
      weapons.length >= maximumAmountOfWeapons
    ) {
      if (
        (Math.floor(Math.random() * 2) === 0 && upgradeWeaponPool.length > 0) ||
        weapons.length >= maximumAmountOfWeapons
      ) {
        // if (upgradeWeaponPool.length > 0) {
        const randomIndex = Math.floor(
          Math.random() * upgradeWeaponPool.length
        );

        chosenWeapon = upgradeWeaponPool[randomIndex];
        upgradeWeaponPool.splice(randomIndex, 1);

        // } else {
        // chosenWeapon = undefined;
        // return;
        // }
      } else {
        if (weaponPool.length > 0) {
          newRandomIndex = Math.floor(Math.random() * weaponPool.length);
          chosenWeapon = weaponPool[newRandomIndex];
          weaponPool.splice(newRandomIndex, 1);
        } else {
          chosenWeapon = undefined;
          // console.log(weaponPool);
        }
      }
    } else {
      chosenWeapon = wiper;
    }
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

        button.weapon.stats[statType] += amount;

        // weaponPool.splice(chosenWeapon.index, 1);

        if (!weapons.includes(button.weapon)) {
          weapons.push(button.weapon);
        }

        console.log(button.weapon);
        console.log(button.weapon.upgrades.level);

        // console.log(newRandomIndex);
        // console.log(weapons);

        button.weapon.upgrades.level += 1;

        // const weapons = weapons.filter((value, index, self) => {
        //   self.indexOf(value) === index;
        // });

        // const weapons = [...new Set(weapons)];

        console.log(weapons);

        start();
      },
    };

    ctx.beginPath();
    ctx.rect(button.x, button.y, button.width, button.height);
    ctx.fillStyle = "black";
    ctx.fill();

    if (button.weapon !== undefined) {
      drawText(
        button.weapon.name,
        square.x + 40,
        (i * square.height) / 4 + 180,
        "green"
      );
    }
    buttons.push(button);
  }
  upgradeWeaponPool.length = 0;
  weaponPool.length = 0;
};
