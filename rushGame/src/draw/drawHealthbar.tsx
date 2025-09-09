import { visualWorld } from "../basics";

export const drawHealthBar = (
  ctx,
  x: number,
  y: number,
  width: number,
  height: number,
  health: number,
  maxHealth: number
) => {
  const colorArray = ["#38b000", "blue", "yellow", "black"];
  const timesHealthbar = Math.ceil(health / maxHealth);

  ctx.beginPath();
  ctx.rect(x / visualWorld.x, y/ visualWorld.y, width/ visualWorld.x, height/ visualWorld.y);
  ctx.fillStyle = "#fd151b";

  ctx.fill();

  for (let i = 0; i < timesHealthbar; i++) {
    const ecvation = health - maxHealth * i;

    ctx.beginPath();
    ctx.rect(x/ visualWorld.x, y/ visualWorld.y, Math.min((ecvation * width) / maxHealth, width)/ visualWorld.x, height/ visualWorld.y);
    ctx.fillStyle = colorArray[i];

    ctx.fill();
  }
};
