export const rgb = (r: number, g: number, b: number) => {
  const red = Math.floor(cap(r) * 256)
    .toString(16)
    .padStart(2, '0')
  const green = Math.floor(cap(g) * 256)
    .toString(16)
    .padStart(2, '0')
  const blue = Math.floor(cap(b) * 256)
    .toString(16)
    .padStart(2, '0')

  return `#${red}${green}${blue}`
}

const cap = (x: number) => {
  return Math.max(0, Math.min(x, 1))
}
