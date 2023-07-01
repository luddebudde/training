import { Vector } from "matter-js"
import { sum } from "."

export const closestPointOnCircle = (pos: Vector, circlePos: Vector, radius: number) => {
    const r = Vector.sub(pos, circlePos)
    const dist = Vector.magnitude(r)
    if (dist < 0.0001) {
      return circlePos
    }
    return sum(circlePos, Vector.mult(r, radius / dist))
  }
  