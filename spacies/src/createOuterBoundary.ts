import { Vector } from 'matter-js'
import { hollowCircle } from './hollowCircle.ts'
import { GameObject } from './GameObject.ts'

export const createOuterBoundary = (radius: number): GameObject => {
  return {
    body: hollowCircle(Vector.create(0, 0), 100, radius, {
      isSensor: true,
      isStatic: true,
      width: 100,
      label: 'OuterBoundary',
      render: {
        fillStyle: '#FFFFFF',
        opacity: 0.1,
      },
    }),
  }
}
