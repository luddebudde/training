const canvas = document.getElementById("myCanvas");

export const world = {
  width: canvas.width,
  height: canvas.height,
};
export let isPaused: boolean = false;

export const changeIsPaused = (changeTo: boolean) => {
  isPaused = changeTo;
};
