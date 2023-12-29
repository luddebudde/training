export const rgb = (r: number, g: number, b: number) => {
  const red = Math.floor(r * 256)
    .toString(16)
    .padStart(2, '0')
  const green = Math.floor(g * 256)
    .toString(16)
    .padStart(2, '0')
  const blue = Math.floor(b * 256)
    .toString(16)
    .padStart(2, '0')

  return `#${red}${green}${blue}`
}
