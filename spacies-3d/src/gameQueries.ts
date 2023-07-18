import { Player } from './Player.ts'

export type GameQueries = {
  getPlayers: () => Player[]
}
