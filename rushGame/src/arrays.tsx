import { createChaser } from "./enemies/chaser";
import { createRamper } from "./enemies/ramper";
import { createSniper } from "./enemies/shooter";
import { randomArrayElement } from "./randomArrayElement";

export let entities = [];
export const bullets = [];

export const bossPool = [createChaser, createSniper, createRamper];
export let liveBosses = [];

export const checkArrayRemoval = () => {
  entities = entities.filter((entity) => entity.health > 0);

  liveBosses.forEach((boss, index) => {
    if (boss.health < 0) {
      boss.deathAnimation?.();
    }

    setTimeout(() => {
      liveBosses.splice(index, 1);
    }, 100);
  });
  // bosses = bosses.filter((entity) => bosses.health > 0);
};

export const spawnBoss = () => {
  const nextboss = randomArrayElement(bossPool);

  nextboss();
};
