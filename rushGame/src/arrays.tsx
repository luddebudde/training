import { world } from "./basics";
import { createSprayerBoss } from "./bosses/sprayer";
import { drawHealthBar } from "./drawHealthbar";
import { randomArrayElement } from "./randomArrayElement";

export let entities = [];
export const bullets = [];

export const bossPool = [createSprayerBoss];
export let liveBosses = [];

export const checkArrayRemoval = (ctx) => {
  entities = entities.filter((entity) => entity.health > 0);

  // liveBosses.forEach((boss) => {

  // });

  // console.log(bosses);

  liveBosses.forEach((boss, index) => {
    drawHealthBar(
      ctx,
      0,
      0 + 40 * index,
      world.width,
      30,
      boss.health,
      boss.maxHealth
    );

    // console.log(boss.health);

    if (boss.health <= 0) {
      boss.deathAnimation();

      console.log("splcie");

      // setTimeout(() => {
      liveBosses.splice(index, 1);
      // }, 100);
    }
  });
  // bosses = bosses.filter((entity) => bosses.health > 0);
};

export const spawnBoss = () => {
  const nextboss = randomArrayElement(bossPool);

  nextboss();
};
