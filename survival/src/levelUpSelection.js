import { checkButtonPress } from "./checkButtonPress.js";
import { drawSquare } from "./draw/drawSquare.js";
import { drawText } from "./draw/drawText.js";
import {
  assets,
  buttons,
  ctx,
  maximumAmountOfWeapons,
  moveCtx,
  pause,
  player,
  start,
  weapons,
} from "./main.js";
import { stats, upgradeStats } from "./stats.js";
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

let undefinedButtons = 0;

let newRandomIndex = 0;

let weaponPool = [];

export const levelUpSelection = () => {
  const square = {
    x: 750,
    y: 100,
    width: 1060,
    height: 1000,
    color: "green",
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
      upgradeWeaponPool.length > 0 ||
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
      // console.log(weapons, upgradeWeaponPool);
      // console.log();
    }
    const button = {
      number: i,
      image: chosenWeapon?.image,
      // image: assets.rhino,
      weapon: chosenWeapon,
      x: square.x + 20,
      y: (i * square.height) / 4 + 120,
      width: square.width - 40,
      height: square.height / 4 - 40,
      upgradeWeapon: () => {
        if (button.weapon !== undefined) {
          const weaponUpgrades = button.weapon.upgrades;
          const level = weaponUpgrades.level;

          const statTypes = weaponUpgrades.statsOrder[level];
          const upgradeAmounts = weaponUpgrades.amountOrder[level];

          // const statType = button.weapon.upgrades.statsOrder[level];
          // const amount = button.weapon.upgrades.amountOrder[level];

          statTypes.forEach((statType, index) => {
            const amount = upgradeAmounts[index];

            button.weapon.stats[statType] += amount;
            // button.weapon.stats.area += amount;

            // console.log(button.weapon.stats[statType]);
            console.log(button.weapon.stats);
            // console.log(statType);
            // console.log(amount);
          });

          // weaponPool.splice(chosenWeapon.index, 1);

          if (!weapons.includes(button.weapon)) {
            weapons.push(button.weapon);
          }

          // console.log();
          // console.log(button.weapon, button.weapon.upgrades.level);

          // console.log(newRandomIndex);
          // console.log(weapons);

          button.weapon.upgrades.level += 1;

          // const weapons = weapons.filter((value, index, self) => {
          //   self.indexOf(value) === index;
          // });

          // const weapons = [...new Set(weapons)];

          console.log(button.weapon.name, button.weapon.upgrades.level);
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
          // console.log("undefined");
        }
        start();
      },
    };

    ctx.beginPath();
    ctx.rect(button.x, button.y, button.width, button.height);
    ctx.fillStyle = "black";
    ctx.fill();

    // if (button.weapon !== undefined) {
    //   drawText(
    //     button.weapon.name,
    //     square.x + 40,
    //     (i * square.height) / 4 + 180,
    //     "green"
    //   );
    //   drawText(
    //     button.weapon.upgrades.level,
    //     square.x,
    //     (i * square.height) / 4 + 180,
    //     "yellow"
    //   );
    // }

    if (button.weapon !== undefined) {
      const level = button.weapon.upgrades.level;
      // Rita vapennamnet
      drawText(
        button.weapon.name,
        square.x + 40,
        (i * square.height) / 4 + 180,
        "green"
      );

      // Rita uppgraderingsnivån
      const levelText = `level ${button.weapon.upgrades.level + 1}`;

      // Mät bredden på vapennamnet för att justera placeringen av uppgraderingsnivån
      const weaponNameWidth = ctx.measureText(button.weapon.name).width;

      drawText(
        levelText,
        square.x + 40 + weaponNameWidth + 20, // Placera texten 100 enheter åt höger från vapennamnet
        (i * square.height) / 4 + 180,
        "yellow"
      );

      drawText(
        `${button.weapon.upgrades.statsOrder[level]}:`,
        square.x + 40 + weaponNameWidth + 20, // Placera texten 100 enheter åt höger från vapennamnet
        (i * square.height) / 4 + 300,
        "yellow"
      );

      const weaponStatsWidth = ctx.measureText(
        button.weapon.upgrades.statsOrder[level]
      ).width;

      drawText(
        button.weapon.upgrades.amountOrder[level],
        square.x + 40 + weaponNameWidth + weaponStatsWidth + 50, // Placera texten 100 enheter åt höger från vapennamnet
        (i * square.height) / 4 + 300,
        "yellow"
      );

      // if (button.weapon.upgrades.description !== undefined) {
      //   const formattedDescription =
      //     button.weapon.upgrades.description.join("\n");

      //   drawText(
      //     formattedDescription,
      //     square.x + 40 + weaponNameWidth + weaponStatsWidth + 300, // Placera texten 100 enheter åt höger från vapennamnet
      //     (i * square.height) / 4 + 180,
      //     "yellow"
      //   );
      // }
      if (button.weapon.upgrades.description !== undefined) {
        const description = button.weapon.upgrades.description[level];

        const maxWidth = 500; // Bredden där du vill bryta raden
        const lineHeight = 40; // Önskat mellanrum mellan raderna

        let words = description.split(" ");
        let line = "";
        let y = (i * square.height) / 4 + 180;

        for (let word of words) {
          const testLine = line + word + " ";
          const metrics = ctx.measureText(testLine);
          const testWidth = metrics.width;

          if (testWidth > maxWidth && line !== "") {
            ctx.fillText(
              line,
              square.x + 40 + weaponNameWidth + weaponStatsWidth + 150,
              y
            );
            line = word + " ";
            y += lineHeight; // Höjningen för nästa rad
          } else {
            line = testLine;
          }
        }

        ctx.fillText(
          line,
          square.x + 40 + weaponNameWidth + weaponStatsWidth + 150,
          y
        );
      }
    }

    if (button.image !== undefined) {
      ctx.drawImage(
        button.image,
        button.x + 20,
        button.y + 90,
        100,
        100
        // walker.radius * 2,
        // walker.radius * 2
      );
    }

    buttons.push(button);
  }
  upgradeWeaponPool.length = 0;
  weaponPool.length = 0;
};
