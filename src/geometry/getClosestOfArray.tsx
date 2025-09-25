import { Vec2 } from "../math";
import { getDistance } from "./makeDirection";

export const getClosestOfArray = (mainPos: Vec2, array: any[]) => {
  let maxValue = Infinity;
  let closestElement;
  for (let element of array) {
    // Must be either a Vec2 or include x and y-coordinates
    const compareElement =
      element.pos !== undefined
        ? element.pos
        : {
            x: element.x + element.width / 2,
            y: element.y + element.height / 2,
          };

    const distance = getDistance(mainPos, compareElement);

    if (distance < maxValue) {
      maxValue = distance;
      closestElement = element;
    }
    // console.log(distance, compareElement.name);
  }

  return closestElement;
};
