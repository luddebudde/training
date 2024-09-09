import { world } from "./basics";
import { generateUniqueId } from "./generateAnimationId";
import { Enemy } from "./main";

export const spawnEnemy = (enemies: Enemy[]) => {
  console.log(`Spawning ${enemies.length} enemies`);

  enemies.forEach((enemy, i) => {
    const posX = world.width / 2 + 750 * i;
    const posY = world.height / 2 + 250 * i;

    enemy.pos.x = posX;
    enemy.pos.y = posY;

    enemy.id = generateUniqueId();

    enemy.animations[0](enemy);

    console.log(enemy, i);
  });
};
