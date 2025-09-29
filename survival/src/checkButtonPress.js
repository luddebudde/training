import { buttons } from "./main.js";
import { playClick } from "./sounds.js";

let x = 0;

export const checkButtonPress = (mouseX, mouseY) => {
  // console.log(buttons);
  for (const button of buttons) {
    if (
      mouseX >= button.x &&
      mouseX <= button.width + button.x &&
      mouseY >= button.y &&
      mouseY <= button.height + button.y
    ) {
      // console.log(button);
      if (button.noclick === false || button.noclick === undefined) playClick();
      return button.function();
    }
  }
};
