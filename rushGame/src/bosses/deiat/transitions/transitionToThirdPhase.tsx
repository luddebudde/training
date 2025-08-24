import { liveBosses } from "../../../arrays";
import { randomArrayElement } from "../../../randomArrayElement";
import { createChargerBoss } from "../../charger";
import { createSprayerBoss } from "../../sprayer";
import { createTwinBoss } from "../../twins";
import { Deiat } from "../deiatBoss";

export const transistionToThirdPhase = (deiat: Deiat, saveTime: number) => {
  const currentRadius = deiat.radius;
  const endRadius = 40;

  for (let i = 0; i < (currentRadius - endRadius) * saveTime; i++) {
    setTimeout(() => {
      deiat.radius -= 1 / saveTime;
    }, 20 * i);
  }
  setTimeout(() => {
    deiat.phaseCounter++;
    deiat.collision = false;
    deiat.transitionShield = false;
    deiat.attackDelay = 20;
    deiat.pickedAttack = 0;

    setTimeout(() => {
      const obtainableBosses: (() => void)[] = [
        createChargerBoss,
        createSprayerBoss,
        createTwinBoss,
      ];

      console.log(obtainableBosses);

      randomArrayElement(obtainableBosses)();
    }, 1500);
  }, 20 * (currentRadius - endRadius));
};
