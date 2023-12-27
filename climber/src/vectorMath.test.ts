import { describe, expect, it } from 'vitest'
import { mean, sum } from './vectorMath.ts'
import { Vec3 } from 'cannon'

describe('vector math', () => {
  describe('sum', () => {
    it('summarizes empty lists', () => {
      expect(sum([])).toEqual(new Vec3(0, 0, 0))
    })
    it('summarizes', () => {
      expect(
        sum([new Vec3(1, 2, 3), new Vec3(1, 2, 3), new Vec3(1, 2, 3)]),
      ).toEqual(new Vec3(3, 6, 9))
    })
  })
  describe('mean', () => {
    it('does not calculate empty lists', () => {
      expect(mean([])).toBeUndefined()
    })
    it('summarizes', () => {
      expect(
        sum([new Vec3(1, 2, 3), new Vec3(1, 2, 3), new Vec3(1, 2, 3)]),
      ).toEqual(new Vec3(3, 6, 9))
    })
  })
})
