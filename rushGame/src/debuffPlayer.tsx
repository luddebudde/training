import { standardPlayer } from "./createPlayer";

export let standardPlayerCopy;

setTimeout(() => {
  standardPlayerCopy = structuredClone(standardPlayer);
}, 10);

export const debuffPlayer = (
  element: keyof typeof standardPlayer | number,
  op: string,
  value: number,
  timePassedOut: number
) => {
  let key = (
    typeof element === "string"
      ? element
      : Object.keys(standardPlayer).find(
          (k) => standardPlayer[k as keyof typeof standardPlayer] === element
        )
  ) as keyof typeof standardPlayer;

  if (!key) return console.error("Egenskap hittades inte.");

  const operations: Record<string, (a: number, b: number) => number> = {
    "+": (a, b) => a + b,
    "-": (a, b) => a - b,
    "*": (a, b) => a * b,
    "/": (a, b) => (b !== 0 ? a / b : a),
  };

  if (!operations[op]) return console.error("Ogiltig operation.");

  standardPlayer[key] = operations[op](standardPlayer[key], value);

  setTimeout(() => {
    standardPlayer[key] = standardPlayerCopy[key];
  }, timePassedOut);
};
