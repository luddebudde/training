import { Vec2 } from "./math";

const canvas = document.getElementById("myCanvas");

export const world = {
  width: canvas.width,
  height: canvas.height,
};
export let isPaused: boolean = false;

export const changeIsPaused = (changeTo: boolean) => {
  isPaused = changeTo;
};

export const topLeftCorner = (additionalValue: number = 0): Vec2 => {
  return {
    x: additionalValue,
    y: additionalValue,
  };
};

export const topRightCorner = (additionalValue: number = 0): Vec2 => {
  return {
    x: world.width - additionalValue,
    y: additionalValue,
  };
};

export const bottomLeftCorner = (additionalValue: number = 0): Vec2 => {
  return {
    x: additionalValue,
    y: world.height - additionalValue,
  };
};

export const bottomRightCorner = (additionalValue: number = 0): Vec2 => {
  return {
    x: world.width - additionalValue,
    y: world.width - additionalValue,
  };
};

export const allCorners: ((additionalValue: number) => Vec2)[] = [
  topLeftCorner,
  topRightCorner,
  bottomLeftCorner,
  bottomRightCorner,
];

export const checkIfHalfHP = (boss) => {
  // console.log(
  //   boss.health,
  //   boss.maxHealth / 2,
  //   boss.health < boss.maxHealth / 2
  // );

  return boss.health < boss.maxHealth / 2;
};
