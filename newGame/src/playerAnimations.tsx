import { world } from "./basics";
import {
  animationsRegistry,
  playAnimation,
  stopAnimation,
} from "./playAnimation";
import { player } from "./player";
import { loopPerSecond } from "./startFight";
import { changeIsWalking, currentlyWalking } from "./walkTowardsMapBlock";

export const playerAnimationQueue = [];

export const checkNextPlayerAnimation = () => {
  if (playerAnimationQueue[0] === undefined) {
    idleAnimation();
    return;
  } else {
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
    "/player/run.png",
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
    "/player/Idle.png",
    4,
    4,
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
    "/player/attack.png",
    5,
    5,
    1,
    "myCanvas",
    player.pos,
    player.size,
    "player",
    checkNextPlayerAnimation
  );
};

export const protectAnimation = () => {
  playAnimation(
    "/player/Protect.png",
    2,
    1,
    1,
    "myCanvas",
    player.pos,
    player.size,
    "player",
    // protectAnimation
    () => {
      player.isBlocking = false;
      checkNextPlayerAnimation();
    }
  );
};

const processAnimationQueue = () => {
  if (playerAnimationQueue.length > 0) {
    const nextAnimation = playerAnimationQueue.shift();

    console.log("next");

    nextAnimation();
  }
};

export const overwritePlayerAnimation = (playAnimation) => {
  console.log(playerAnimationQueue);

  player.isBlocking = false;
  playerAnimationQueue.length = 0;
  playerAnimationQueue.push(playAnimation);

  console.log(animationsRegistry, "1");
  stopAnimation(player.id, playAnimation);
  console.log(animationsRegistry, "2");

  processAnimationQueue();
};

export const playerAppearance = () => {
  changeIsWalking(true);
  runAnimation();

  const playerWalk = setInterval(() => {
    if (player.pos.x > world.width / 5 - player.size.x) {
      console.log(world.width / 300);

      clearInterval(playerWalk);
      changeIsWalking(false);
    }
    player.pos.x += 5;
  }, 1000 / loopPerSecond);
};
