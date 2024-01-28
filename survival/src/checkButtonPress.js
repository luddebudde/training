import { buttons } from "./main.js";

let x = 0;

export const checkButtonPress = (mouseX, mouseY) => {
  for (const button of buttons) {
    // console.log("Mouse");
    // console.log(mouseX, button.x);
    // console.log(mouseY, button.y);
    if (
      mouseX >= button.x &&
      mouseX <= button.width + button.y &&
      mouseY >= button.y &&
      mouseY <= button.height + button.y
    ) {
      //   console.log("loga true");
      //   console.log("");
      //   button.upgradeWeapon();
      buttons.length = 0;
      return button.upgradeWeapon();
    }
    // else {
    //   //   console.log("loga false");
    //   //   console.log("");
    //   return false;
    // }
  }
};
