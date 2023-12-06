import { doCirclesOverlap } from "./doCirclesOverlap.js";

export const checkCollisions = (object, otherObject) => {
  if (object !== otherObject && doCirclesOverlap(object, otherObject)) {
    if (otherObject.damage !== undefined) {
      object.health -= otherObject.damage;
    }
    console.log(object.health);
  }
};
