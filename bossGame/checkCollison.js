import { doCirclesOverlap } from "./doCirclesOverlap.js";

export const checkCollisions = (object, otherObject) => {
  if (
    object !== otherObject &&
    doCirclesOverlap(object, otherObject) &&
    object.team !== otherObject.team
  ) {
    if (otherObject.damage !== undefined) {
      object.health -= otherObject.damage;
    } else {
      // console.log("hejsan");
    }
    console.log(object.health);
  }
};
