import { describe, expect, it } from 'vitest'
import { mean, sum } from './scalarMath.ts'

describe('vector math', () => {
  describe('sum', () => {
    it('summarizes empty lists', () => {
      expect(sum([])).toEqual(0)
    })
    it('summarizes', () => {
      expect(sum([1, 2, 3, 4])).toEqual(1 + 2 + 3 + 4)
    })
  })
  describe('mean', () => {
    it('does not calculate empty lists', () => {
      expect(mean([])).toBeUndefined()
    })
    it('calculates', () => {
      expect(mean([1, 2, 3, 4])).toEqual((1 + 2 + 3 + 4) / 4)
    })
  })
})
