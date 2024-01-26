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

// export const isPointInsideArea = (
//   pointX,
//   pointY,
//   areaX,
//   areaY,
//   areaWidth,
//   areaHeight
// ) => {
//   const adjustedPointX = pointX - areaX;
//   const adjustedPointY = pointY - areaY;

//   return (
//     adjustedPointX >= 0 &&
//     adjustedPointX <= areaWidth &&
//     adjustedPointY >= 0 &&
//     adjustedPointY <= areaHeight
//   );
// };

// export function isPointInsideCircle(pointX, pointY, centerX, centerY, radius) {
//     const distanceSquared = (pointX - centerX) ** 2 + (pointY - centerY) ** 2;
//     return distanceSquared <= radius ** 2;
//   }

//   // Exempel:
//   const pointX = 25;
//   const pointY = 15;
//   const centerX = 20;
//   const centerY = 10;
//   const radius = 15;

//   const isInside = isPointInsideCircle(pointX, pointY, centerX, centerY, radius);
//   console.log(isInside); // Resultatet borde vara true eller false beroende på om punkten är inom cirkeln
