import { Composite } from 'matter-js'
import { Game } from './Game.ts'
import { GameObject } from './GameObject'

export const removeObject = (game: Game, obj: GameObject) => {
  Composite.remove(game.engine.world, obj.body)
  game.gameObjects = game.gameObjects.filter((it) => it !== obj)
  game.playerShips = game.playerShips.filter((it) => it !== obj)
  game.comets = game.comets.filter((it) => it !== obj)
}
