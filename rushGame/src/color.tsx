export const fadeToBlack = (color, amount: number) => {
  // color = { r: 255, g: 100, b: 50 }
  return {
    r: Math.floor(color.r * (1 - amount)),
    g: Math.floor(color.g * (1 - amount)),
    b: Math.floor(color.b * (1 - amount)),
  };
};

export function hexToRGB(hex) {
  let bigint = parseInt(hex.replace("#", ""), 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}

export function rgbToHex({ r, g, b }) {
  return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
}

export function darkenHexColor(hex, amount) {
  let rgb = fadeToBlack(hexToRGB(hex), amount);
  return rgbToHex(rgb);
}

export function getDarkerColor(
  baseColor: { r: number; g: number; b: number },
  ratio: number
) {
  return `rgb(${Math.floor(baseColor.r * ratio)}, ${Math.floor(
    baseColor.g * ratio
  )}, ${Math.floor(baseColor.b * ratio)})`;
}
