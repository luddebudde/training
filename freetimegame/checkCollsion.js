export const checkCollsion = (objA, objB) => {
  if (objA !== objB) {
    if (
      objA.xPos + objA.radius >= objB.xPos - objB.radius ||
      objA.yPos + objA.radius >= objB.yPos - objB.radius
    ) {
      if (
        objA.xPos - objA.radius <= objB.xPos + objB.radius ||
        objA.yPos - objA.radius <= objB.yPos + objB.radius
      ) {
        console.log("hej");
      }
    }
  } else {
    return;
  }
};
