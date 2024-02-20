import { buttons } from "./main.js";

let x = 0;

export const checkButtonPress = (mouseX, mouseY) => {
  for (const button of buttons) {
    if (
      mouseX >= button.x &&
      mouseX <= button.width + button.y &&
      mouseY >= button.y &&
      mouseY <= button.height + button.y
    ) {
      buttons.length = 0;
      return button.function();
    }
  }
};
