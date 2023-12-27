export const sum = (terms: number[]): number =>
  terms.reduce((previousValue, currentValue) => previousValue + currentValue, 0)
export const mean = (terms: number[]): undefined | number =>
  terms.length === 0 ? undefined : sum(terms) / terms.length

export const square = (a: number): number => a * a
export const cube = (a: number): number => a * a * a
