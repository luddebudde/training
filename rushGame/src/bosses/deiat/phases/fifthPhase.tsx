import { squares } from "../../../arrays";
import { center } from "../../../basics";
import { player } from "../../../createPlayer";
import { dealDamage } from "../../../dealDamage";
import { collideCircleWithRotatedRectangle } from "../../../geometry/checkRotatedRectangleCollision";
import { doCirclesOverlap } from "../../../geometry/doCirlceOverlap";
import { makeDirection } from "../../../geometry/makeDirection";
import { multVar } from "../../../math";
import { Deiat } from "../deiatBoss";

export const fifthPhase = (deiat: Deiat) => {
  deiat.airFriction = false;
  const direction = makeDirection(deiat.pos, player.pos);

  deiat.vel = multVar(direction, deiat.speed);

  deiat.attackDelay = 10000;
};
