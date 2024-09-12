import { playAnimation, stopAnimation } from "./playAnimation";
import { player } from "./player";
import { currentlyWalking } from "./walkTowardsMapBlock";

export const playerAnimationQueue = [];

export const checkNextPlayerAnimation = () => {
  // console.log(animationQueue);

  if (playerAnimationQueue[0] === undefined) {
    // console.log("tjena");

    idleAnimation();
    return;
  } else {
    // console.log("benfh");

    playerAnimationQueue[0]();
    playerAnimationQueue.splice(0);
  }
};

export const checkWalking = () => {
  if (currentlyWalking) {
    playerAnimationQueue.push(runAnimation);
  }
  checkNextPlayerAnimation();
};

export const runAnimation = () => {
  playAnimation(
    "/run.png",
    7,
    10,
    1,
    "myCanvas",
    player.pos,
    player.size,
    "player",
    checkWalking
  );
};

export const idleAnimation = () => {
  playAnimation(
    "/Idle.png",
    4,
    0.4,
    1,
    "myCanvas",
    player.pos,
    player.size,
    "player",
    checkNextPlayerAnimation
  );
};

export const attackAnimation = () => {
  playAnimation(
    "/attack.png",
    5,
    5,
    1,
    "myCanvas",
    player.pos,
    player.size,
    "player", // unique entityId
    checkNextPlayerAnimation
  );
};

export const protectAnimation = () => {
  playAnimation(
    "/Protect.png",
    2,
    2,
    1,
    "myCanvas",
    player.pos,
    player.size,
    "player",
    checkNextPlayerAnimation
  );
};

const processAnimationQueue = () => {
  if (playerAnimationQueue.length > 0) {
    const nextAnimation = playerAnimationQueue.shift();
    nextAnimation();
  }
};

export const overwritePlayerAnimation = (playAnimation) => {
  playerAnimationQueue.length = 0;
  stopAnimation("player");
  playerAnimationQueue.push(playAnimation);
  processAnimationQueue();
};
