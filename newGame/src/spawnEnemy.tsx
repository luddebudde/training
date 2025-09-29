import { world } from "./basics";
import { deepCloneWithFunctions } from "./createCloneObject";
import { bosses, enemies, entities } from "./enemies/enemyTypes";
import { generateUniqueId } from "./generateAnimationId";
import { Enemy } from "./enemies/enemyTypes";
import { initializePlayerTarget, player } from "./player";

// export const spawnEnemy = (spawnEnemies: Enemy[]) => {
//   console.log(`Spawning ${spawnEnemies.length} enemies`);

//   spawnEnemies.forEach((enemy, i) => {
//     const newEnemy: Enemy = deepCloneWithFunctions(enemy);
//     // const posX = (world.width / 4) * 3 + 0 * i;
//     // const posY = (world.height / 4) * 3 + 75 * i;

//     const posX =
//       (Math.random() * world.width) / 2 + world.width / 2 - newEnemy.size.x * 2;
//     const posY = Math.random() * world.height - newEnemy.size.y * 2;

//     newEnemy.pos.x = posX;
//     newEnemy.pos.y = posY;

//     newEnemy.id = generateUniqueId();

//     newEnemy.startAnimation(newEnemy);

//     console.log(enemy, i);

//     enemies.push(newEnemy);
//     entities.push(newEnemy);

//     // initializePlayerTarget();
//     player.possibleTargets = enemies;
//     player.target = player.possibleTargets[0];
//     // console.log("playertarget", player);
//   });
// };

export const spawnEnemy = (spawnEnemies: Enemy[]) => {
  console.log(`Spawning ${spawnEnemies.length} enemies`);

  spawnEnemies.forEach((enemy, i) => {
    const newEnemy: Enemy = deepCloneWithFunctions(enemy);

    let posX, posY;

    let validPosition = false;

    while (!validPosition) {
      posX =
        (Math.random() * world.width) / 2 +
        world.width / 2 -
        newEnemy.size.x * 2;
      posY = Math.random() * world.height - newEnemy.size.y * 2;

      if (posX < 0) posX = 0;
      if (posX + newEnemy.size.x > world.width)
        posX = world.width - newEnemy.size.x;

      if (posY < 0) posY = 0;
      if (posY + newEnemy.size.y > world.height)
        posY = world.height - newEnemy.size.y;

      validPosition = true;
      for (let existingEnemy of enemies) {
        const distanceX = Math.abs(existingEnemy.pos.x - posX);
        const distanceY = Math.abs(existingEnemy.pos.y - posY);

        if (
          distanceX < (existingEnemy.size.x + newEnemy.size.x) / 2 &&
          distanceY < (existingEnemy.size.y + newEnemy.size.y) / 2
        ) {
          validPosition = false;
          break;
        }
      }
    }

    newEnemy.pos.x = posX;
    newEnemy.pos.y = posY;

    newEnemy.id = generateUniqueId();

    newEnemy.startAnimation(newEnemy);

    console.log(enemy, i);

    enemies.push(newEnemy);
    entities.push(newEnemy);

    player.possibleTargets = enemies;
    player.target = player.possibleTargets[0];
  });
};

export const spawnBoss = (spawnEnemies: Enemy[]) => {
  console.log(`Spawning ${spawnEnemies.length} enemies`);

  spawnEnemies.forEach((enemy, i) => {
    const newEnemy: Enemy = deepCloneWithFunctions(enemy);

    // newEnemy.pos.x = posX;
    // newEnemy.pos.y = posY;

    newEnemy.id = generateUniqueId();

    newEnemy.startAnimation(newEnemy);

    // console.log(enemy, i);

    enemies.push(newEnemy);
    entities.push(newEnemy);
    bosses.push(newEnemy);

    player.possibleTargets = enemies;
    player.target = player.possibleTargets[0];
  });
};
