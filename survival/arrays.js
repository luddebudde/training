import { createBullet } from "./createBullet.js";
import { createWalker } from "./createWalker.js";
import { player } from "./player.js";

export const allies = [player];
export const enemies = [];
export const entities = [allies, enemies];

export const createEnemies = [createWalker];

export const playerBullets = [];
export const enemyBullets = [];
export const kindsOfBullets = [playerBullets, enemyBullets];

export const worldObjects = [kindsOfBullets, entities];
