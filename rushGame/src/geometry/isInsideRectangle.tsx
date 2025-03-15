export const isPointInsideArea = (
  pointX: number,
  pointY: number,
  areaX: number,
  areaY: number,
  areaWidth: number,
  areaHeight: number
) => {
  return (
    pointX >= areaX &&
    pointX <= areaX + areaWidth &&
    pointY >= areaY &&
    pointY <= areaY + areaHeight
  );
};
