export const isPointInsideArea = (
  pointX,
  pointY,
  areaX,
  areaY,
  areaWidth,
  areaHeight
) => {
  return (
    pointX >= areaX &&
    pointX <= areaX + areaWidth &&
    pointY >= areaY &&
    pointY <= areaY + areaHeight
  );
};
