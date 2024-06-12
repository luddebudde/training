import { assets, ctx, player } from "../../main.js";
import { world } from "../../world.js";

export let computeBossRotationSpeed = 0.4;
export let computeBossRotationAngle = 0;
export let computeBossChangeRotation = 10;

export const computeBossShake = (compute, output, argument) => {
  // let rotationSpeed = 0.4;
  // let rotationAngle = 0;
  // let changeRotation = 10;

  const animate = () => {
    computeBossRotationAngle += computeBossRotationSpeed;

    ctx.save();
    ctx.translate(world.width / 2, world.height / 2);
    ctx.translate(compute.pos.x - player.pos.x, compute.pos.y - player.pos.y);
    ctx.scale(compute.lookDirection, 1);
    ctx.rotate((computeBossRotationAngle * Math.PI) / 180);

    ctx.drawImage(
      compute.asset,
      -compute.radius,
      -compute.radius,
      compute.radius * 2,
      compute.radius * 2
    );

    ctx.restore();

    if (
      computeBossRotationAngle > computeBossChangeRotation ||
      computeBossRotationAngle < -computeBossChangeRotation
    ) {
      computeBossRotationSpeed = -computeBossRotationSpeed;

      computeBossRotationSpeed = computeBossRotationSpeed * 1.1;
    }

    console.log(computeBossRotationSpeed);
    if (computeBossRotationSpeed < 5) {
      requestAnimationFrame(animate);
    } else {
      output(compute, argument);

      computeBossRotationAngle = 0;
      computeBossRotationSpeed = 1;
    }
  };

  requestAnimationFrame(animate);
};
