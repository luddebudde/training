import { Vec3 } from 'cannon'
import { origo } from './vectors.ts'

export const randomLinear = (min: number, max: number) =>
  min + (max - min) * Math.random()

export const randomAngle = () => randomLinear(0, 2 * Math.PI)

export const randomInt = (min: number, max: number) =>
  Math.floor(randomLinear(min, max))

export const randomColor = () => {
  const r = Math.floor(randomLinear(0, 255))
  const g = Math.floor(randomLinear(0, 255))
  const b = Math.floor(randomLinear(0, 255))
  return (r << 16) | (g << 8) | (b << 0)
}

export const randomPointOnSphere = (pos: Vec3, radius: number) => {
  while (true) {
    const randomPointInCube = new Vec3(
      randomLinear(-radius, radius),
      randomLinear(-radius, radius),
      randomLinear(-radius, radius),
    )
    const dist2 = randomPointInCube.norm2()
    if (dist2 <= radius * radius) {
      randomPointInCube.normalize()
      return randomPointInCube.scale(radius).vadd(pos)
    }
  }
}
