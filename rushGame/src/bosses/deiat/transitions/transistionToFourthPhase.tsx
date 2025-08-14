import { entities, liveBosses } from "../../../arrays";
import { center, world } from "../../../basics";
import { player, standardPlayer } from "../../../createPlayer";
import { goTo } from "../../../goTo";
import { randomArrayElement } from "../../../randomArrayElement";
import { createChargerBoss } from "../../charger";
import { createSprayerBoss } from "../../sprayer";
import { createTwinBoss } from "../../twins";
import { Deiat } from "../deiatBoss";

export const transistionToFourthPhase = (deiat: Deiat, saveTime: number) => {
  liveBosses.forEach((boss, index) => {
    if (boss !== deiat) {
      liveBosses.splice(index);
    }
  });

  const deiatBaseRadius = deiat.radius;
  const deiatEndRadius = 240;
  const deiatDistToSize = Math.abs(deiatBaseRadius - deiatEndRadius);

  const playerBaseRadius = player.radius;
  const playerEndRadius = 15;

  const baseSpeed = player.speed;
  const baseBulletSize = player.bulletSize;
  const baseBulletSpeed = player.bulletSpeed;
  const baseBulletDamage = player.bulletDamage;

  const playerDistToSize = Math.abs(playerEndRadius - playerBaseRadius);

  goTo(deiat, { x: world.width, y: center.y }, 50, () => {
    for (let i = 0; i < deiatDistToSize * saveTime; i++) {
      setTimeout(() => {
        deiat.radius += 1 / saveTime;

        standardPlayer.radius -=
          //   Math.max(
          playerDistToSize / deiatDistToSize;
        //   );

        // standardPlayer.speed -=
        //   playerDistToSize / deiatDistToSize / deiatDistToSize;

        // player.bulletSize -=
        //   playerDistToSize / deiatDistToSize / deiatDistToSize;

        standardPlayer.speed = baseSpeed * (player.radius / playerBaseRadius);
        player.bulletSize = baseBulletSize * (player.radius / playerBaseRadius);
        player.bulletSpeed =
          baseBulletSpeed * (player.radius / playerBaseRadius);
        player.bulletDamage =
          baseBulletDamage * (player.radius / playerBaseRadius);

        // console.log(player.speed);
      }, 20 * i);
    }
    setTimeout(() => {
      deiat.phaseCounter++;
      deiat.collision = false;
      deiat.transitionShield = false;
      deiat.attackDelay = 20;
      deiat.pickedAttack = 0;

      setTimeout(() => {}, 1500);
    }, 20 * deiatDistToSize);
  });
};
