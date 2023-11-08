export const makeDirection = (mainObject, secondObject) => {
  const diff = {
    x: mainObject.pos.x - secondObject.pos.x,
    y: mainObject.pos.x - secondObject.pos.x,
  };
  const dist = Math.sqrt(diff.x * diff.x + diff.y * diff.y);
  const direction = {
    x: diff.x / dist,
    y: diff.y / dist,
  };

  return direction;
};
