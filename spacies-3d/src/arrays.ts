export const min = <T>(items: T[], getValue: (item: T) => number): T => {
  const index = items
    .map(getValue)
    .reduce((accIndex, currentValue, currentIndex, values) => {
      return currentValue < values[accIndex] ? currentIndex : accIndex
    }, 0)
  return items[index]
}

// export const least = <T>(
//   items: T[],
//   count: number,
//   getValue: (item: T) => number,
// ): T[] => {
// }
