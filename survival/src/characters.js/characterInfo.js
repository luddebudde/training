import { Blugo } from "./Blugo.js";
import { Ludwigo } from "./Ludwigo.js";
import { Pelin } from "./Pelin.js";

export const characters = [Ludwigo, Pelin, Blugo];

for (let i = 0; i < 30; i++) {
  characters.push(Blugo);
}
