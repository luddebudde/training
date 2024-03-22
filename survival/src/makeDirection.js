export const makeDirection = (secondObject, mainObject) => {
  const diff = {
    x: mainObject.x - secondObject.x,
    y: mainObject.y - secondObject.y,
  };
  const dist = Math.sqrt(diff.x * diff.x + diff.y * diff.y);
  const direction = {
    x: diff.x / (dist + 0.001),
    y: diff.y / (dist + 0.001),
  };

  return direction;
};
