export const makeDirection = (secondObject, mainObject) => {
  const diff = {
    x: mainObject.pos.x - secondObject.pos.x,
    y: mainObject.pos.y - secondObject.pos.y,
  };
  const dist = Math.sqrt(diff.x * diff.x + diff.y * diff.y);
  const direction = {
    x: diff.x / dist,
    y: diff.y / dist,
  };

  return direction;
};
