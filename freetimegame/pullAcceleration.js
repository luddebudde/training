export const pullAcceleration = (dragPoint, dragedObjectX, dragedObjectY) => {
  const diff = {
    x: dragPoint.xPos - dragedObjectX,
    y: dragPoint.yPos - dragedObjectY,
  };
  const dist = Math.sqrt(diff.x * diff.x + diff.y * diff.y);
  if (dist < dragPoint.pullRadius && dist !== 0) {
    const direction = {
      x: diff.x / dist,
      y: diff.y / dist,
    };

    return {
      x: (direction.x * dragPoint.pullForce) / (dist * dist),
      y: (direction.y * dragPoint.pullForce) / (dist * dist),
    };
  }
  return { x: 0, y: 0 };
};
