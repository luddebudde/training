export const min = <T>(items: T[], getValue: (item: T) => number): T => {
  const index = items
    .map(getValue)
    .reduce((accIndex, currentValue, currentIndex, values) => {
      return currentValue < values[accIndex] ? currentIndex : accIndex
    }, 0)
  return items[index]
}
export const max = <T>(items: T[], getValue: (item: T) => number): T => {
  const index = items
    .map(getValue)
    .reduce((accIndex, currentValue, currentIndex, values) => {
      return currentValue > values[accIndex] ? currentIndex : accIndex
    }, 0)
  return items[index]
}
