import { player } from "./player.js";

export const allies = [player];
export const enemies = [];
export const entities = [allies, enemies];

export const playerBullets = [];
export const enemyBullets = [];
export const kindsOfBullets = [playerBullets, enemyBullets];

export const worldObjects = [kindsOfBullets, entities];
