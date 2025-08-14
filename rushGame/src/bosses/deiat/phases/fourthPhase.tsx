import { bullets, lines } from "../../../arrays";
import { corners, center, world } from "../../../basics";
import { createBullet } from "../../../createBullet";
import { player } from "../../../createPlayer";
import { dealDamage } from "../../../dealDamage";
import { goTo } from "../../../goTo";
import { add, numberIsWithinMargin, sub } from "../../../math";
import { Deiat } from "../deiatBoss";

const shootSolarFlare = (deiat: Deiat) => {
  const bulletRadius = 5;
  const pos = {
    x: world.width - bulletRadius,
    y: world.height * Math.random(),
  };

  if (
    (deiat.solarCharge &&
      numberIsWithinMargin(center.y, pos.y, deiat.radius)) ||
    (numberIsWithinMargin(center.y, pos.y, deiat.radius) &&
      Math.random() < 0.67)
  ) {
    return;
  }

  createBullet(
    bullets,
    deiat,
    undefined,
    5,
    5,
    {},
    {
      bulletRadius: bulletRadius,
      color: "orange",
      startPos: pos,
      vel: { x: -8, y: 0 },
    }
  );
};

const useSolarCharge = (deiat: Deiat) => {
  goTo(deiat, sub(deiat.pos, { x: world.width, y: 0 }), 25, () => {
    goTo(deiat, add(deiat.pos, { x: world.width, y: 0 }), 50);
  });

  corners.forEach((corner) => {
    const cornerPos = corner(0);

    createBullet(
      bullets,
      deiat,
      player.pos,
      10,
      20,
      { indestructible: true },
      { bulletRadius: 40, startPos: cornerPos, color: "yellow" }
    );
  });
};

const showSolarCharge = (deiat: Deiat) => {
  if (!deiat.solarCharge) {
    const r = 255;
    const g = 255;
    const b = 0;
    deiat.color = `rgb(${r}, ${g}, ${b})`;
    return;
  }
  const delayRatio = Math.max(0, Math.min(1, deiat.attackDelay / 250));
  // 1 = lång tid kvar (gul), 0 = snart attack (röd)

  // Gul: RGB(255, 255, 0)
  // Röd: RGB(255, 0, 0)
  const r = 255;
  const g = Math.round(255 * delayRatio);
  const b = 0;

  deiat.color = `rgb(${r}, ${g}, ${b})`;
};

const handleLine = (deiat: Deiat) => {
  const line = {
    startPos: {
      x: world.width * 0.8,
      y: 0,
    },
    endPos: {
      x: world.width * 0.8,
      y: world.height,
    },
  };

  lines.push(line);

  if (player.pos.x > line.startPos.x) {
    player.health += 25;

    createBullet(
      bullets,
      player,
      { x: world.width, y: center.y },
      800,
      30,
      {},
      { color: "blue" }
    );
    player.pos = {
      x: player.radius * 8,
      y: center.y,
    };
  }
};

const intervalTime = 15;
export const fourthPhase = (deiat: Deiat) => {
  if (deiat.solarCharge) {
    useSolarCharge(deiat);
  }

  if (deiat.interval) {
    clearInterval(deiat.interval);
    deiat.interval = null;
  }

  deiat.interval = setInterval(() => {
    player.vel.x -= player.speed * 0.4;
    shootSolarFlare(deiat);

    showSolarCharge(deiat);
    handleLine(deiat);
  }, intervalTime);

  if (deiat.solarCharge === true) {
    deiat.solarCharge = false;
    deiat.attackDelay = 500;
  } else if (deiat.solarCharge === false) {
    deiat.solarCharge = true;
    deiat.attackDelay = 250;
  }
};
