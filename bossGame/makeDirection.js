let diff = 0;

export const makeDirection = (mainObject, secondObject) => {
  if (secondObject.x !== undefined) {
    diff = {
      x: mainObject.xPos - secondObject.x,
      y: mainObject.yPos - secondObject.y,
    };
  } else {
    diff = {
      x: mainObject.xPos - secondObject.xPos,
      y: mainObject.yPos - secondObject.yPos,
    };
  }
  const dist = Math.sqrt(diff.x * diff.x + diff.y * diff.y);
  const direction = {
    x: diff.x / dist,
    y: diff.y / dist,
  };

  return direction;
};
