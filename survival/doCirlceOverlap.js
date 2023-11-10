export function doCirclesOverlap(circle1, circle2) {
  const distance = Math.sqrt(
    (circle2.pos.x - circle1.pos.x) ** 2 + (circle2.pos.y - circle1.pos.y) ** 2
  );

  return distance <= circle1.radius + circle2.radius;
}
