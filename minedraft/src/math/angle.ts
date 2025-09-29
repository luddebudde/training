import { Vector } from 'matter-js'

export const angle = (vec: Vector) => Math.atan2(vec.y, vec.x)
export const vectorFromAngle = (angle: number): Vector =>
  Vector.create(Math.cos(angle), Math.sin(angle))
export const degrees = (radians: number): number => (radians * 180) / Math.PI
export const radians = (degrees: number): number => (degrees * Math.PI) / 180
