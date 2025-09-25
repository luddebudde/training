import { center } from "../../../basics";
import { goTo } from "../../../goTo";
import { Deiat } from "../deiatBoss";

export const transitionToSecondPhase = (deiat: Deiat, saveTime: number) => {
  goTo(deiat, center, 80 * saveTime, () => {
    for (let i = 0; i < 80 * saveTime; i++) {
      setTimeout(() => {
        deiat.radius += 1 / saveTime;
      }, 20 * i);
    }
    setTimeout(() => {
      deiat.phaseCounter++;
      deiat.collision = true;
      deiat.transitionShield = false;
      deiat.attackDelay = 0;
    }, 80 * 20);
  });
};
