import { Composite } from 'matter-js'
import { GameObject } from './GameObject'
import { Game } from './Game.ts'

export const addObject = (game: Game, obj: GameObject) => {
  Composite.add(game.engine.world, obj.body)
  game.gameObjects = [...game.gameObjects, obj]
  if (obj.type === 'player') {
    game.playerShips.push(obj)
  }
  if (obj.type === 'comet') {
    game.comets.push(obj)
  }
}
