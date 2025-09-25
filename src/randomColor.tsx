export const getRandomColor = (): string => {
  const r = Math.floor(Math.random() * 256); // 0–255
  const g = Math.floor(Math.random() * 256); // 0–255
  const b = Math.floor(Math.random() * 256); // 0–255

  const toHex = (n: number): string => n.toString(16).padStart(2, "0");

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};
