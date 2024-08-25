// import { playAnimation } from "./playAnimation";
// import { currentlyWalking } from "./walkTowardsMapBlock";

import { playAnimation } from "./playAnimation";
import { player } from "./player";
import { currentlyWalking } from "./walkTowardsMapBlock";

// export const runAnimation = () => {
//   playAnimation("/run.png", 7, 10, 1, "spriteContainer", () => {
//     const checkWalking = () => currentlyWalking;

//     if (checkWalking()) {
//       console.log("walk");
//       //   setTimeout(() => {
//       runAnimation();
//       console.log("walk again");
//       //   }, 1000);
//     } else {
//       idleAnimation();
//     }
//   });
// };

// export const idleAnimation = () => {
//   playAnimation("/Idle.png", 4, 5, 1, "spriteContainer", () => {
//     const checkWalking = () => currentlyWalking;

//     if (checkWalking()) {
//       console.log("walk");
//       //   setTimeout(() => {
//       runAnimation();
//       console.log("walk again");
//       //   }, 1000);
//     } else {
//       idleAnimation();
//     }
//   });
// };

export const runAnimation = () => {
  playAnimation(
    "/runNew.png",
    7,
    10,
    1,
    "myCanvas",
    player.pos,
    player.size,
    () => {
      const checkWalking = () => currentlyWalking;

      if (checkWalking()) {
        console.log("walk");
        //   setTimeout(() => {
        runAnimation();
        console.log("walk again");
        //   }, 1000);
      } else {
        idleAnimation();
      }
    }
  );
};

export const idleAnimation = () => {
  playAnimation(
    "/Idle.png",
    4,
    10,
    1,
    "myCanvas",
    player.pos,
    player.size,
    () => {
      const checkWalking = () => currentlyWalking;

      if (checkWalking()) {
        console.log("walk");
        //   setTimeout(() => {
        runAnimation();
        console.log("walk again");
        //   }, 1000);
      } else {
        idleAnimation();
      }
    }
  );
};
