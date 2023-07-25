export const makeDirection = (mainObject, secondObject) => {
  const diff = {
    x: mainObject.xPos - secondObject.x,
    y: mainObject.yPos - secondObject.y,
  };
  const dist = Math.sqrt(diff.x * diff.x + diff.y * diff.y);
  const direction = {
    x: diff.x / dist,
    y: diff.y / dist,
  };

  return direction;
};
