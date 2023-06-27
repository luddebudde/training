export const radiansToCartesian = (angle: number, r: number) => {
  return {
    x: r * Math.cos(angle),
    y: r * Math.sin(angle),
  }
}
