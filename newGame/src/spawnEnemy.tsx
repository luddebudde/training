import { world } from "./basics";
import { deepCloneWithFunctions } from "./createCloneObject";
import { enemies } from "./enemies/enemyTypes";
import { generateUniqueId } from "./generateAnimationId";
import { Enemy } from "./main";

export const spawnEnemy = (spawnEnemies: Enemy[]) => {
  console.log(`Spawning ${spawnEnemies.length} enemies`);

  spawnEnemies.forEach((enemy, i) => {
    const newEnemy: Enemy = deepCloneWithFunctions(enemy);
    // const posX = (world.width / 4) * 3 + 0 * i;
    // const posY = (world.height / 4) * 3 + 75 * i;

    const posX =
      (Math.random() * world.width) / 2 + world.width / 2 - newEnemy.size.x * 2;
    const posY = Math.random() * world.height - newEnemy.size.y * 2;

    newEnemy.pos.x = posX;
    newEnemy.pos.y = posY;

    newEnemy.id = generateUniqueId();

    newEnemy.startAnimation(newEnemy);

    console.log(enemy, i);

    enemies.push(newEnemy);
  });
};
