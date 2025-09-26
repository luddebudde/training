import { visualWorld, world } from "../basics";

export const drawBossName = (ctx, boss, index: number) => {
  const widtUnit = world.width / 100 / visualWorld.x;
  const heighUnit = world.height / 100 / visualWorld.y;

  ctx.font = "2vh arial";
  ctx.strokeText(
    boss.name,
    widtUnit * 0.8,
    heighUnit * 1.75 + heighUnit * 2.75 * index
  );
};
