import { Player } from './Player.ts'
import { GameObject } from './GameObject.ts'

export type GameQueries = {
  getPlayers: () => Player[]
  getEnemies: () => GameObject[]
}
