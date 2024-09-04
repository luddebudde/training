import { world } from "./basics";
import { Enemy } from "./main";

export const spawnEnemy = (enemies: Enemy[]) => {
  enemies.forEach((enemy, i) => {
    enemy.pos.x = world.width / 2 + 250 * i;
    enemy.pos.y = world.height / 2 + 250 * i;

    enemy.animations[0](enemy);
  });
};
