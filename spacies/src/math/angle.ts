import { Vector } from 'matter-js'

export const angle = (vec: Vector) => Math.atan2(vec.y, vec.x)
