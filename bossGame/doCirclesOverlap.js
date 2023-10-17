export function doCirclesOverlap(circle1, circle2) {
  const distance = Math.sqrt(
    (circle2.xPos - circle1.xPos) ** 2 + (circle2.yPos - circle1.yPos) ** 2
  );

  return distance <= circle1.radius + circle2.radius;
}
