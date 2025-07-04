export const drawHealthBar = (
  ctx,
  x: number,
  y: number,
  width: number,
  height: number,
  health: number,
  maxHealth: number
) => {
  const colorArray = ["#fd151b", "#38b000", "blue", "yellow", "black"];

  const timesHealthbar = Math.ceil(health / maxHealth) + 1;

  for (let i = 0; i < timesHealthbar; i++) {
    // console.log(width * Math.max(Math.max(health, maxHealth * i), 0));
    // console.log(
    //   Math.min(
    //     // width * Math.max(Math.max(health, maxHealth * i) % maxHealth, 0)
    //     width * Math.max(Math.min(health, maxHealth * i), 0)
    //   ) / maxHealth
    // );
    // console.log(health);
    // console.log(width, width * Math.min((health / maxHealth) * i, 1));

    // console.log(health % (maxHealth + 1));

    console.log(width, width * Math.max(health / maxHealth, 1));

    // console.log(maxHealth * i);

    ctx.beginPath();
    ctx.rect(
      x,
      y,
      Math.min(
        // width * Math.max(Math.max(health, maxHealth * i) % maxHealth, 0)
        // width * Math.max(health % (maxHealth + 1), 0)
        width * Math.min(health / maxHealth, 1)
        // ) / maxHealth,
      ),
      height
    );
    ctx.fillStyle = colorArray[i];
    // "#fd151b";
    ctx.fill();
  }

  // ctx.beginPath();
  // ctx.rect(x, y, width, height);
  // ctx.fillStyle = "#fd151b";
  // ctx.fill();
  // ctx.beginPath();
  // ctx.rect(
  //   x,
  //   y,
  //   Math.min(width * Math.max(Math.min(health, maxHealth), 0)) / maxHealth,
  //   height
  // );
  // ctx.fillStyle = "#38b000";
  // ctx.fill();

  // console.log(health % maxHealth);

  // ctx.beginPath();
  // ctx.rect(
  //   x,
  //   y,
  //   (width * Math.max(Math.max(health, maxHealth) % maxHealth, 0)) / maxHealth,
  //   height
  // );
  // ctx.fillStyle = "blue";
  // ctx.fill();
};
