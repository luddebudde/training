import { doCirclesOverlap } from "./doCirclesOverlap.js";
import { worldObjects } from "./main.js";

export const checkCollisions = (object, otherObject) => {
  if (
    doCirclesOverlap(object, otherObject) &&
    (object.team !== otherObject.team) & (object.type !== otherObject.type)
  ) {
    if (
      otherObject.damage !== undefined &&
      object.type !== "blackhole" &&
      otherObject.type !== "blackhole"
    ) {
      object.health -= otherObject.damage;
    } else {
      // console.log("hejsan");
    }
    // if (object,type === "bullet"){
    //   worldObjects.filter
    // }
    if (object.type === "bullet") {
      object.destroy = true;
    }

    // console.log(object.health);
  }
};
